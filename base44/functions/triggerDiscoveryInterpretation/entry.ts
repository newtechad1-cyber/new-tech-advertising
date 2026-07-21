import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const INELIGIBLE_SESSION_STATUSES = [
  'deleted', 'deletion_requested', 'expired', 'completed', 'handoff_requested'
];

function json(error: string, status: number): Response {
  return Response.json({ error }, { status });
}

function entryIdFromAutomation(payload: any): string | null {
  const event = payload?.event;
  if (
    event?.type !== 'create' ||
    event?.entity_name !== 'DiscoveryConversationEntry' ||
    typeof event?.entity_id !== 'string' ||
    !event.entity_id
  ) {
    return null;
  }
  return event.entity_id;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json('METHOD_NOT_ALLOWED', 405);

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return json('INVALID_PAYLOAD', 400);
  }

  const entryId = entryIdFromAutomation(payload);
  if (!entryId) return json('INVALID_AUTOMATION_EVENT', 400);

  const secret = Deno.env.get('AGENT_WEBHOOK_KEY');
  if (!secret) return json('AUTOMATION_BRIDGE_NOT_CONFIGURED', 503);

  const base44 = createClientFromRequest(req);

  try {
    // The adapter accepts no caller-supplied session or run ID. It derives scope
    // from the real database record and permits only the exact entity-create case
    // that the disabled automation is configured to emit.
    const entry = await base44.asServiceRole.entities.DiscoveryConversationEntry.get(entryId);
    if (!entry) return json('ENTRY_NOT_FOUND', 404);
    if (entry.speaker !== 'owner') return json('NON_OWNER_ENTRY', 409);

    const session = await base44.asServiceRole.entities.DiscoverySession.get(entry.session_id);
    if (!session || INELIGIBLE_SESSION_STATUSES.includes(session.status)) {
      return json('SESSION_INELIGIBLE', 409);
    }

    // A replay cannot start more work after this entry has already created a run.
    // Base44 does not document atomic conditional creates, so the coordinator's
    // isolated-version and stale-promotion checks remain the final concurrency guard.
    const priorRuns = await base44.asServiceRole.entities.DiscoveryInterpretationRun.filter({
      triggering_entry_id: entryId
    });
    if (priorRuns.some((run: any) => ['staging', 'ready', 'promoted'].includes(run.status))) {
      return Response.json({ status: 'already_accepted', entry_id: entryId });
    }

    const coordinatorUrl = new URL(req.url);
    coordinatorUrl.pathname = '/functions/coordinateDiscoveryInterpretation';
    coordinatorUrl.search = '';

    const coordinatorResponse = await fetch(coordinatorUrl, {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${secret}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({ event: payload.event })
    });

    const responseText = await coordinatorResponse.text();
    let responseBody: unknown;
    try {
      responseBody = responseText ? JSON.parse(responseText) : {};
    } catch {
      return json('COORDINATOR_INVALID_RESPONSE', 502);
    }

    return Response.json(responseBody, { status: coordinatorResponse.status });
  } catch {
    return json('AUTOMATION_BRIDGE_FAILED', 500);
  }
});

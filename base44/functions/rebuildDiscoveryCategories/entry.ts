import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const INELIGIBLE_SESSION_STATUSES = [
  'deleted', 'deletion_requested', 'expired', 'completed', 'handoff_requested'
];

function authorized(req: Request): boolean {
  const secret = Deno.env.get('AGENT_WEBHOOK_KEY');
  return Boolean(secret) && req.headers.get('authorization') === `Bearer ${secret}`;
}

function response(error: string, status: number): Response {
  return Response.json({ error }, { status });
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return response('METHOD_NOT_ALLOWED', 405);
  if (!authorized(req)) return response('AUTHORIZATION_FAILED', 401);

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return response('INVALID_PAYLOAD', 400);
  }

  const sessionId = payload.session_id;
  const action = payload.action;
  if (
    typeof sessionId !== 'string' ||
    !['start', 'promote', 'fail'].includes(action)
  ) {
    return response('INVALID_PAYLOAD', 400);
  }

  const base44 = createClientFromRequest(req);

  try {
    const session = await base44.asServiceRole.entities.DiscoverySession.get(sessionId);
    if (!session || INELIGIBLE_SESSION_STATUSES.includes(session.status)) {
      return response('SESSION_INELIGIBLE', 409);
    }

    if (action === 'start') {
      const states = await base44.asServiceRole.entities.DiscoveryInterpretationState.filter({
        session_id: sessionId
      });
      const runs = await base44.asServiceRole.entities.DiscoveryInterpretationRun.filter({
        session_id: sessionId
      });
      const highestKnownVersion = Math.max(
        states[0]?.active_interpretation_version || 0,
        ...runs.map((run: any) => run.interpretation_version || 0)
      );
      const ownerEntries = await base44.asServiceRole.entities.DiscoveryConversationEntry.filter(
        { session_id: sessionId, speaker: 'owner' },
        'occurred_at',
        500
      );
      if (ownerEntries.length === 0) {
        return response('NO_OWNER_EVIDENCE', 409);
      }

      const run = await base44.asServiceRole.entities.DiscoveryInterpretationRun.create({
        session_id: sessionId,
        interpretation_version: highestKnownVersion + 1,
        status: 'staging',
        expected_entry_count: ownerEntries.length,
        completed_entry_count: 0,
        started_at: new Date().toISOString()
      });

      return Response.json({
        status: 'staging',
        run_id: run.id,
        interpretation_version: run.interpretation_version,
        entry_ids: ownerEntries.map((entry: any) => entry.id)
      });
    }

    const runId = payload.run_id;
    if (typeof runId !== 'string') return response('INVALID_PAYLOAD', 400);

    const run = await base44.asServiceRole.entities.DiscoveryInterpretationRun.get(runId);
    if (
      !run ||
      run.session_id !== sessionId ||
      !['staging', 'ready'].includes(run.status)
    ) {
      return response('INVALID_INTERPRETATION_RUN', 409);
    }

    if (action === 'fail') {
      if (run.status !== 'staging') {
        return response('INVALID_INTERPRETATION_RUN', 409);
      }
      await base44.asServiceRole.entities.DiscoveryInterpretationRun.update(run.id, {
        status: 'failed',
        safe_error: 'CATEGORY_STAGING_FAILED',
        completed_at: new Date().toISOString()
      });
      return Response.json({ status: 'failed', run_id: run.id });
    }

    // A ready run has already passed completeness checks. Allow promotion to be
    // retried if the pointer or final run-status update previously failed.
    if (run.status === 'staging') {
      const ownerEntries = await base44.asServiceRole.entities.DiscoveryConversationEntry.filter(
        { session_id: sessionId, speaker: 'owner' },
        'occurred_at',
        500
      );
      const jobs = await base44.asServiceRole.entities.CategoryInterpretationJob.filter({
        session_id: sessionId,
        run_id: run.id,
        status: 'completed'
      });
      const completedEntryIds = new Set(jobs.map((job: any) => String(job.entry_id)));
      if (
        ownerEntries.length !== run.expected_entry_count ||
        completedEntryIds.size !== run.expected_entry_count ||
        ownerEntries.some((entry: any) => !completedEntryIds.has(String(entry.id)))
      ) {
        return response('REBUILD_INCOMPLETE', 409);
      }

      const stagedCategories =
        await base44.asServiceRole.entities.DiscoveryCategoryInterpretation.filter({
          session_id: sessionId,
          run_id: run.id,
          interpretation_version: run.interpretation_version
        });
      if (stagedCategories.length === 0) {
        return response('REBUILD_INCOMPLETE', 409);
      }

      // Mark the candidate ready before the one authoritative pointer changes.
      await base44.asServiceRole.entities.DiscoveryInterpretationRun.update(run.id, {
        status: 'ready',
        completed_entry_count: completedEntryIds.size,
        completed_at: new Date().toISOString()
      });
    }

    const states = await base44.asServiceRole.entities.DiscoveryInterpretationState.filter({
      session_id: sessionId
    });
    const now = new Date().toISOString();
    if (states[0]) {
      await base44.asServiceRole.entities.DiscoveryInterpretationState.update(states[0].id, {
        active_interpretation_version: run.interpretation_version,
        active_run_id: run.id,
        updated_at: now
      });
    } else {
      await base44.asServiceRole.entities.DiscoveryInterpretationState.create({
        session_id: sessionId,
        active_interpretation_version: run.interpretation_version,
        active_run_id: run.id,
        updated_at: now
      });
    }

    await base44.asServiceRole.entities.DiscoveryInterpretationRun.update(run.id, {
      status: 'promoted',
      promoted_at: now
    });

    return Response.json({
      status: 'promoted',
      run_id: run.id,
      active_interpretation_version: run.interpretation_version
    });
  } catch {
    return response('REBUILD_OPERATION_FAILED', 500);
  }
});

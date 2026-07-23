import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const ALLOWED_EVENTS = new Set([
  'page_view',
  'trust_step_clicked',
  'growth_conversation_started',
  'growth_conversation_submitted',
  'booking_page_viewed',
]);

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const eventName = String(payload?.event_name || '').trim();

    if (!ALLOWED_EVENTS.has(eventName)) {
      return Response.json({ error: 'Unsupported event' }, { status: 400 });
    }

    const route = String(payload?.route || '').slice(0, 250);
    const step = String(payload?.step || '').slice(0, 120);
    const source = String(payload?.source || '').slice(0, 120);
    const sessionId = String(payload?.session_id || '').slice(0, 120);

    await base44.asServiceRole.entities.SystemLog.create({
      event_type: `journey_${eventName}`,
      source_system: 'website',
      source_route: route,
      source_component: 'journeyAnalytics',
      workflow_type: 'customer_journey',
      workflow_stage: step || eventName,
      status: 'success',
      message: `${eventName}${step ? `: ${step}` : ''}`,
      payload_snapshot: JSON.stringify({ route, step, source, session_id: sessionId }),
      log_level: 'info',
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('[trackJourneyEvent]', error.message);
    return Response.json({ error: 'Unable to record event' }, { status: 500 });
  }
});

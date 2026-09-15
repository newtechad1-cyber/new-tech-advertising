import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const ALLOWED_EVENTS = new Set([
  'page_view',
  'trust_step_clicked',
  'growth_conversation_started',
  'growth_conversation_submitted',
  'booking_page_viewed',
  'regional_account_manager_home_click',
  'regional_account_manager_cta_clicked',
  'regional_account_manager_form_submitted',
  'regional_account_manager_video_clicked',
  'regional_account_manager_video_playlist_clicked',
  'community_partner_home_click',
  'question_path_opened',
  'question_growth_guide_opened',
  'question_growth_conversation_started',
]);
// Browser measurement uses the platform analytics API. This legacy log writer
// is restricted to verified administrators and service workflows.

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin' && user.is_service !== true) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > 4096) {
      return Response.json({ error: 'Request is too large' }, { status: 413 });
    }

    const rawBody = await req.text();
    if (rawBody.length > 4096) {
      return Response.json({ error: 'Request is too large' }, { status: 413 });
    }

    let payload;
    try {
      payload = JSON.parse(rawBody || '{}');
    } catch {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (!payload || Array.isArray(payload) || typeof payload !== 'object') {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const eventName = String(payload.event_name || '').trim();

    if (!ALLOWED_EVENTS.has(eventName)) {
      return Response.json({ error: 'Unsupported event' }, { status: 400 });
    }

    const route = String(payload?.route || '').slice(0, 250);
    const step = String(payload?.step || '').slice(0, 120);
    const source = String(payload?.source || '').slice(0, 120);
    const sessionId = String(payload?.session_id || '').slice(0, 120);
    const siteSurface = String(payload?.site_surface || '').slice(0, 40);

    await base44.asServiceRole.entities.SystemLog.create({
      event_type: `journey_${eventName}`,
      source_system: 'website',
      source_route: route,
      source_component: 'journeyAnalytics',
      workflow_type: 'customer_journey',
      workflow_stage: step || eventName,
      status: 'success',
      message: `${eventName}${step ? `: ${step}` : ''}`,
      payload_snapshot: JSON.stringify({ route, step, source, session_id: sessionId, site_surface: siteSurface }),
      log_level: 'info',
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('[trackJourneyEvent]', error.message);
    return Response.json({ error: 'Unable to record event' }, { status: 500 });
  }
});

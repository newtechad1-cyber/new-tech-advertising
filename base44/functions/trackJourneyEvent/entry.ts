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
]);
const TRUSTED_PUBLIC_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://app.newtechadvertising.com',
  'https://new-tech-advertising.base44.app',
]);
const REQUEST_WINDOW_MS = 15 * 60 * 1000;
const REQUEST_LIMIT = 120;
const requestBuckets = new Map();

function isTrustedPublicOrigin(req) {
  const rawOrigin = req.headers.get('origin') || req.headers.get('referer');
  if (!rawOrigin) return false;

  try {
    return TRUSTED_PUBLIC_ORIGINS.has(new URL(rawOrigin).origin);
  } catch {
    return false;
  }
}

function requestClientIdentity(req) {
  return String(
    req.headers.get('cf-connecting-ip')
    || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown',
  ).slice(0, 128);
}

function isRateLimited(req) {
  const now = Date.now();
  const key = requestClientIdentity(req);
  let bucket = requestBuckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + REQUEST_WINDOW_MS };
    requestBuckets.set(key, bucket);
  }

  if (bucket.count >= REQUEST_LIMIT) {
    return Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  }

  bucket.count += 1;
  return 0;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    const trustedService = user?.role === 'admin' || user?.is_service === true;

    if (!trustedService && !isTrustedPublicOrigin(req)) {
      return Response.json({ error: 'Untrusted request origin' }, { status: 403 });
    }

    if (!trustedService) {
      const retryAfterSeconds = isRateLimited(req);
      if (retryAfterSeconds) {
        return Response.json(
          { error: 'Too many requests. Please try again shortly.' },
          { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
        );
      }
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

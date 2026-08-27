/**
 * Public-site intake bridge.
 *
 * Public forms must remain login-free. This endpoint therefore validates the
 * browser origin, bounds payloads, applies a per-client throttle, and forwards
 * only the normal public intake shape to the NTA Core Admin Hub.
 */

import { createClient, createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const OFFICE_APP_ID = '6a7215451eb90dc843a94546';
const TRUSTED_PUBLIC_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://app.newtechadvertising.com',
  'https://new-tech-advertising.base44.app',
]);
const REQUEST_WINDOW_MS = 15 * 60 * 1000;
const REQUEST_LIMIT = 12;
const requestBuckets = new Map();

function cleanText(value, maxLength = 500) {
  return String(value || '').trim().slice(0, maxLength);
}

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
  const forwarded = req.headers.get('cf-connecting-ip')
    || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown';

  return String(forwarded).slice(0, 128);
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

  if (requestBuckets.size > 3000) {
    for (const [bucketKey, entry] of requestBuckets) {
      if (entry.resetAt <= now) requestBuckets.delete(bucketKey);
    }
  }

  return 0;
}

function isPlausibleEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sanitizeMetadata(value, depth = 0) {
  if (depth > 3 || value === null || value === undefined) return undefined;

  if (typeof value === 'string') return cleanText(value, 2000);
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value === 'boolean') return value;

  if (Array.isArray(value)) {
    return value
      .slice(0, 50)
      .map((item) => sanitizeMetadata(item, depth + 1))
      .filter((item) => item !== undefined);
  }

  if (typeof value === 'object') {
    const safe = {};
    for (const [key, item] of Object.entries(value).slice(0, 50)) {
      if (!/^[A-Za-z0-9_-]{1,64}$/.test(key)) continue;
      const sanitized = sanitizeMetadata(item, depth + 1);
      if (sanitized !== undefined) safe[key] = sanitized;
    }
    return safe;
  }

  return undefined;
}

function trustedSourceUrl(value, fallbackPath) {
  const raw = cleanText(value, 1500);
  if (!raw) return fallbackPath;

  try {
    const url = new URL(raw);
    return TRUSTED_PUBLIC_ORIGINS.has(url.origin) ? url.toString() : fallbackPath;
  } catch {
    return fallbackPath;
  }
}

function normalizePublicPayload(payload) {
  const submissionType = cleanText(payload.submission_type, 100) || 'lead';
  const highIntentTypes = new Set([
    'contact',
    'free_audit_request',
    'website_rebuild_intake',
    'ada_intake_form',
    'growth_conversation',
    'trial_signup',
    'hvac_funnel_lead',
    'service_location_inquiry',
    'case_study_inquiry',
    'community_partner_inquiry',
  ]);
  const highIntent = highIntentTypes.has(submissionType);
  const sourcePage = cleanText(payload.source_page || payload.detected_route, 500) || '/';
  const antiSpam = payload.anti_spam && typeof payload.anti_spam === 'object'
    ? payload.anti_spam
    : {};

  return {
    submission_type: submissionType,
    offer_type: cleanText(payload.offer_type, 100),
    mapping_confidence: cleanText(payload.mapping_confidence, 50),
    mapping_notes: cleanText(payload.mapping_notes, 1000),
    source_system: 'website',
    source_page: sourcePage,
    source_url: trustedSourceUrl(payload.source_url, sourcePage),
    source_campaign: cleanText(payload.source_campaign, 300),
    name: cleanText(payload.name || payload.full_name, 200),
    business_name: cleanText(payload.business_name || payload.business, 300),
    email: cleanText(payload.email, 320).toLowerCase(),
    phone: cleanText(payload.phone, 100),
    website: cleanText(payload.website || payload.website_url, 1000),
    city: cleanText(payload.city, 200),
    state: cleanText(payload.state, 100),
    industry: cleanText(payload.industry, 200),
    notes: cleanText(payload.notes || payload.message, 4000),
    service_interest: cleanText(payload.service_interest, 100),
    service_used: cleanText(payload.service_used, 100),
    service_slug: cleanText(payload.service_slug, 100),
    selected_service: cleanText(payload.selected_service, 100),
    selected_package: cleanText(payload.selected_package, 100),
    package: cleanText(payload.package, 100),
    detected_route: cleanText(payload.detected_route, 500),
    detected_component: cleanText(payload.detected_component, 200),
    priority: highIntent ? 'high' : 'medium',
    is_high_intent: highIntent,
    skip_webhook: true,
    anti_spam: {
      honeypot: cleanText(antiSpam.honeypot || payload.honeypot, 200),
      form_started_at: Number(antiSpam.form_started_at || 0) || undefined,
    },
    raw_payload: sanitizeMetadata(payload.raw_payload) || {},
  };
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    const trustedService = user?.role === 'admin' || user?.is_service === true;

    if (!trustedService && !isTrustedPublicOrigin(req)) {
      return Response.json({ error: 'Untrusted request origin' }, { status: 403 });
    }

    const retryAfterSeconds = isRateLimited(req);
    if (retryAfterSeconds) {
      return Response.json(
        { error: 'Too many requests. Please try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
      );
    }

    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > 48000) {
      return Response.json({ error: 'Request is too large' }, { status: 413 });
    }

    const rawBody = await req.text();
    if (rawBody.length > 48000) {
      return Response.json({ error: 'Request is too large' }, { status: 413 });
    }

    let incoming;
    try {
      incoming = JSON.parse(rawBody || '{}');
    } catch {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (!incoming || Array.isArray(incoming) || typeof incoming !== 'object') {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const payload = normalizePublicPayload(incoming);
    const elapsedMs = payload.anti_spam.form_started_at
      ? Date.now() - payload.anti_spam.form_started_at
      : null;

    if (
      payload.anti_spam.honeypot
      || (elapsedMs !== null && (elapsedMs < 1500 || elapsedMs > 24 * 60 * 60 * 1000))
    ) {
      return Response.json({ success: true, accepted: false });
    }

    if (!payload.email && !payload.phone) {
      return Response.json({ error: 'An email address or phone number is required.' }, { status: 400 });
    }
    if (payload.email && !isPlausibleEmail(payload.email)) {
      return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const office = createClient({ appId: OFFICE_APP_ID });
    const response = await office.functions.invoke('ntaUnifiedIntake', payload);
    const data = response?.data ?? response;

    return Response.json(data);
  } catch (error) {
    const upstreamStatus = Number(error?.response?.status || 0);
    const status = upstreamStatus >= 400 && upstreamStatus < 500 ? upstreamStatus : 502;
    const detail = status < 500
      ? (error?.response?.data || { error: error?.message || 'Unable to submit your request.' })
      : { error: 'Unable to submit your request right now.' };

    console.error('[public ntaUnifiedIntake] Office intake failed:', error?.message || detail);
    return Response.json(detail, { status });
  }
});

import { createClient, createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const OFFICE_APP_ID = '6a7215451eb90dc843a94546';

const TRUSTED_PUBLIC_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://app.newtechadvertising.com',
  'https://new-tech-advertising.base44.app',
]);
const REQUEST_WINDOW_MS = 60 * 60 * 1000;
const REQUEST_LIMIT = 8;
const MAX_BODY_LENGTH = 16000;
const requestBuckets = new Map();

function cleanText(value, maxLength) {
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

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed.' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    const trustedService = user?.role === 'admin' || user?.is_service === true;

    if (!trustedService && !isTrustedPublicOrigin(req)) {
      return Response.json({ error: 'Untrusted request origin.' }, { status: 403 });
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
    if (contentLength > MAX_BODY_LENGTH) {
      return Response.json({ error: 'Request is too large.' }, { status: 413 });
    }

    const rawBody = await req.text();
    if (rawBody.length > MAX_BODY_LENGTH) {
      return Response.json({ error: 'Request is too large.' }, { status: 413 });
    }

    let body;
    try {
      body = JSON.parse(rawBody || '{}');
    } catch {
      return Response.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    if (!body || Array.isArray(body) || typeof body !== 'object') {
      return Response.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const antiSpam = body.anti_spam && typeof body.anti_spam === 'object' ? body.anti_spam : {};
    const startedAt = Number(antiSpam.form_started_at || body.form_started_at || 0);
    const elapsedMs = startedAt ? Date.now() - startedAt : null;
    if (
      cleanText(antiSpam.honeypot || body.website, 200)
      || (elapsedMs !== null && (elapsedMs < 1200 || elapsedMs > 24 * 60 * 60 * 1000))
    ) {
      return Response.json({ success: true, accepted: false });
    }

    const full_name = cleanText(body.full_name, 200);
    const email = cleanText(body.email, 320).toLowerCase();
    const phone = cleanText(body.phone, 100);
    const city = cleanText(body.city, 200);
    const territory = cleanText(body.territory, 200);
    const campaign_source = cleanText(body.campaign_source, 200);
    const campaign_medium = cleanText(body.campaign_medium, 200);
    const campaign_name = cleanText(body.campaign_name, 300);
    const landing_path = cleanText(body.landing_path, 1000);
    const current_role = cleanText(body.current_role, 300);
    const business_relationships = cleanText(body.business_relationships, 3000);
    const interest_reason = cleanText(body.interest_reason, 4000);

    if (!full_name || !validEmail(email)) {
      return Response.json({ error: 'A name and valid email are required.' }, { status: 400 });
    }

    const office = createClient({ appId: OFFICE_APP_ID });
    const response = await office.asServiceRole.functions.invoke('submitRecruitingApplication', {
      full_name,
      email,
      phone,
      city,
      territory,
      campaign_source,
      campaign_medium,
      campaign_name,
      landing_path,
      current_role,
      business_relationships,
      interest_reason,
    });
    const data = response?.data ?? response;

    if (data?.error) {
      return Response.json({ error: data.error }, { status: 502 });
    }

    return Response.json({
      success: true,
      accepted: true,
      candidate_id: data?.candidate_id || null,
      email_delivery: data?.email_delivery || {
        internal: 'unknown',
        applicant: 'unknown',
      },
    });
  } catch (error) {
    console.error('submitRecruitingApplication error:', error?.message || error);
    return Response.json({ error: 'Unable to save your application right now.' }, { status: 500 });
  }
});
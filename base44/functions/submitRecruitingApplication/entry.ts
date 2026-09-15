import { createClient, createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

// Turnstile verification is public visitor proof, not account authentication.
// Never use Origin, the public site key, or a client-supplied role as proof.
const NTA_VERIFIED_HOSTS = new Set([
  'newtechadvertising.com', 'www.newtechadvertising.com',
  'app.newtechadvertising.com', 'new-tech-advertising.base44.app',
]);
const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

function verificationSettings() {
  const siteKey = String(Deno.env.get('NTA_TURNSTILE_SITE_KEY') || '').trim();
  const secret = String(Deno.env.get('NTA_TURNSTILE_SECRET_KEY') || '').trim();
  const isTestKey = (value) => /^[123]x0{8,}/.test(value);
  return siteKey.length >= 20 && secret.length >= 20 && !isTestKey(siteKey) && !isTestKey(secret)
    ? { siteKey, secret }
    : null;
}

function publicVerificationConfig(action) {
  const settings = verificationSettings();
  if (!settings) {
    return Response.json({ error: 'Verification is temporarily unavailable. Please call or text 641-420-8816.' }, { status: 503 });
  }
  return Response.json({ site_key: settings.siteKey, action }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}

async function verifyPublicRequest(req, token, action) {
  if (typeof token !== 'string' || !token.trim() || token.length > 2048) {
    return Response.json({ error: 'Please complete the verification and try again.', code: 'VERIFICATION_REQUIRED' }, { status: 403 });
  }
  const settings = verificationSettings();
  if (!settings) {
    return Response.json({ error: 'Verification is temporarily unavailable. Please call or text 641-420-8816.' }, { status: 503 });
  }

  let expectedHostname;
  try {
    const origin = new URL(req.headers.get('origin') || req.headers.get('referer') || '');
    if (origin.protocol !== 'https:' || !NTA_VERIFIED_HOSTS.has(origin.hostname)) throw new Error('Untrusted host');
    expectedHostname = origin.hostname;
  } catch {
    return Response.json({ error: 'Request verification failed.' }, { status: 403 });
  }

  try {
    // The server, not the browser, consumes each provider token exactly once.
    const response = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: settings.secret, response: token }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error('Verification provider unavailable');
    const result = await response.json();
    const issuedAt = Date.parse(result.challenge_ts);
    const age = Date.now() - issuedAt;
    if (
      result.success !== true || result.action !== action ||
      result.hostname !== expectedHostname ||
      !Number.isFinite(issuedAt) || age < -30_000 || age > 300_000
    ) {
      return Response.json({ error: 'Verification expired or could not be confirmed. Please try again.', code: 'VERIFICATION_FAILED' }, { status: 403 });
    }
    return null;
  } catch {
    // Provider errors and missing configuration never permit privileged work.
    return Response.json({ error: 'Verification could not be completed. Please try again shortly.' }, { status: 503 });
  }
}

const OFFICE_APP_ID = '6a7215451eb90dc843a94546';

function createCoreClient() {
  const secret = String(Deno.env.get('NTA_CORE_BRIDGE_SECRET') || '').trim();
  if (secret.length < 32) throw new Error('The NTA connection is not configured. Please call or text 641-420-8816.');
  return createClient({
    appId: OFFICE_APP_ID,
    headers: { 'x-nta-core-bridge-secret': secret },
  });
}


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

    if (body.verification_config === true && Object.keys(body).length === 1) {
      return publicVerificationConfig('recruiting_application');
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

    if (!trustedService) {
      const verificationError = await verifyPublicRequest(req, body.verification_token, 'recruiting_application');
      if (verificationError) return verificationError;
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
    const business_observation = cleanText(body.business_observation, 6000);
    const nta_questions = cleanText(body.nta_questions, 3000);

    if (!full_name || !validEmail(email)) {
      return Response.json({ error: 'A name and valid email are required.' }, { status: 400 });
    }

    // Route this opportunity form into the dedicated recruiting workflow in
    // NTA Core so the candidate record, Rick notification, and applicant
    // acknowledgement stay together.
    const office = createCoreClient();
    const response = await office.functions.invoke('submitRecruitingApplication', {
      full_name,
      email,
      phone,
      city,
      territory,
      campaign_source,
      campaign_medium,
      campaign_name,
      landing_path: landing_path || '/account-manager',
      current_role,
      business_relationships,
      interest_reason,
      business_observation,
      nta_questions,
    });
    const data = response?.data ?? response;

    if (data?.error || data?.success !== true || data?.accepted === false) {
      return Response.json({ error: data?.error || 'The application was not accepted. Please try again or call or text 641-420-8816.' }, { status: 502 });
    }

    return Response.json({
      success: true,
      accepted: true,
      candidate_id: data?.candidate_id || null,
      duplicate: Boolean(data?.duplicate),
      email_delivery: data?.email_delivery || {
        internal: 'unknown',
        applicant: 'unknown',
      },
    });
  } catch (error) {
    const upstreamStatus = Number(error?.response?.status || 0);
    const status = upstreamStatus >= 400 && upstreamStatus < 500 ? upstreamStatus : 502;
    const detail = status < 500
      ? (error?.response?.data || { error: error?.message || 'Unable to save your inquiry.' })
      : { error: 'Unable to save your inquiry right now.' };

    console.error('submitRecruitingApplication intake error:', error?.message || detail);
    return Response.json(detail, { status });
  }
});
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

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

const MAX_REQUEST_BODY_BYTES = 4096;
const TRUSTED_PUBLIC_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://app.newtechadvertising.com',
  'https://new-tech-advertising.base44.app',
]);
const REQUEST_WINDOW_MS = 15 * 60 * 1000;
const REQUEST_LIMIT = 12;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

function isTrustedPublicOrigin(req: Request) {
  const rawOrigin = req.headers.get('origin') || req.headers.get('referer');
  if (!rawOrigin) return false;

  try {
    return TRUSTED_PUBLIC_ORIGINS.has(new URL(rawOrigin).origin);
  } catch {
    return false;
  }
}

function requestClientIdentity(req: Request) {
  return String(
    req.headers.get('cf-connecting-ip')
    || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown',
  ).slice(0, 128);
}

function isRateLimited(req: Request) {
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

class RequestValidationError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function readLimitedJsonObject(req: Request): Promise<Record<string, unknown>> {
  const declaredLength = req.headers.get('content-length');
  if (declaredLength !== null) {
    const parsedLength = Number(declaredLength);
    if (Number.isFinite(parsedLength) && parsedLength > MAX_REQUEST_BODY_BYTES) {
      throw new RequestValidationError('Request body too large', 413);
    }
  }

  if (!req.body) {
    return {};
  }

  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    totalBytes += value.byteLength;
    if (totalBytes > MAX_REQUEST_BODY_BYTES) {
      await reader.cancel();
      throw new RequestValidationError('Request body too large', 413);
    }

    chunks.push(value);
  }

  if (totalBytes === 0) {
    return {};
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  let body: unknown;
  try {
    body = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new RequestValidationError('Invalid JSON body', 400);
  }

  if (body === null || Array.isArray(body) || typeof body !== 'object') {
    throw new RequestValidationError('Request body must be a JSON object', 400);
  }

  return body as Record<string, unknown>;
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

    const body = await readLimitedJsonObject(req);
    if (body.verification_config === true && Object.keys(body).length === 1) {
      return publicVerificationConfig('start_discovery_session');
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
      const verificationError = await verifyPublicRequest(req, body.verification_token, 'start_discovery_session');
      if (verificationError) return verificationError;
    }

    const { mode = 'text' } = body;
    
    if (!['text', 'voice', 'mixed'].includes(mode as string)) {
      return Response.json({ error: 'Invalid mode' }, { status: 400 });
    }

    // Generate 32 cryptographically secure random bytes -> 64 hex chars
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const sessionKey = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const session = await base44.asServiceRole.entities.DiscoverySession.create({
      model_version: 1,
      public_session_key: sessionKey,
      mode,
      stage: 'your_goal',
      status: 'initializing',
      created_at: now.toISOString(),
      last_activity_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    });

    const categories = [
      'reason_for_conversation', 'owner_goals', 'stated_pain', 'present_process',
      'existing_tools_and_information', 'what_works_and_must_be_protected',
      'missing_or_disconnected_pieces', 'desired_improvement', 'growth_readiness',
      'operational_capacity', 'financial_considerations', 'nta_fit',
      'potential_first_priority', 'information_still_needed', 'promises_and_representations',
      'agreed_next_step'
    ];

    await base44.asServiceRole.entities.DiscoveryCategory.bulkCreate(
      categories.map(c => ({
        session_id: session.id,
        category_key: c,
        completion_state: 'not_started',
        updated_at: now.toISOString()
      }))
    );

    const persistedCategories = await base44.asServiceRole.entities.DiscoveryCategory.filter({
      session_id: session.id
    });
    const persistedCategoryKeys = new Set(
      persistedCategories.map(category => category.category_key)
    );
    if (
      persistedCategories.length !== categories.length ||
      categories.some(categoryKey => !persistedCategoryKeys.has(categoryKey))
    ) {
      throw new Error('Session category initialization incomplete');
    }

    await base44.asServiceRole.entities.DiscoveryAuditEvent.create({
      session_id: session.id,
      event_type: 'created',
      actor_type: 'owner',
      occurred_at: now.toISOString(),
      target_record_type: 'DiscoverySession',
      target_record_id: session.id,
      reason: 'Session initialized',
      metadata: { mode }
    });

    const initializedSession = await base44.asServiceRole.entities.DiscoverySession.update(
      session.id,
      { status: 'started' }
    );

    // Return only the specified fields, hiding internal database structure
    return Response.json({
      session_id: session.id,
      public_session_key: sessionKey,
      mode: initializedSession.mode,
      stage: initializedSession.stage,
      status: initializedSession.status,
      expires_at: initializedSession.expires_at
    });
  } catch (error) {
    if (error instanceof RequestValidationError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    return Response.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
});
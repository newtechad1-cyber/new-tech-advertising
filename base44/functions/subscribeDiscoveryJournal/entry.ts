import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

const TRUSTED_PUBLIC_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://app.newtechadvertising.com',
  'https://new-tech-advertising.base44.app',
]);
const REQUEST_WINDOW_MS = 15 * 60 * 1000;
const REQUEST_LIMIT = 24;
const MAX_JSON_BODY_BYTES = 64 * 1024;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

class RequestTooLarge extends Error {}

// These actions carry small session/consent fields, never transcripts or media.
// Check real streamed bytes before parsing; Content-Length alone is not a limit.
async function parseBoundedJson(req: Request) {
  const declared = req.headers.get('content-length');
  if (declared !== null) {
    const size = Number(declared);
    if (!Number.isFinite(size) || size < 0 || size > MAX_JSON_BODY_BYTES) throw new RequestTooLarge();
  }
  if (!req.body) throw new SyntaxError('Missing JSON body');

  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_JSON_BODY_BYTES) {
        await reader.cancel().catch(() => {});
        throw new RequestTooLarge();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(total);
  let position = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, position);
    position += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

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

Deno.serve(async req => {
  if (req.method !== 'POST') return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const base44 = createClientFromRequest(req);
    const publicBoundaryUser = await base44.auth.me().catch(() => null);
    const trustedPublicService = publicBoundaryUser?.role === 'admin' || publicBoundaryUser?.is_service === true;

    if (!trustedPublicService && !isTrustedPublicOrigin(req)) {
      return Response.json({ error: 'Untrusted request origin' }, { status: 403 });
    }

    if (!trustedPublicService) {
      const retryAfterSeconds = isRateLimited(req);
      if (retryAfterSeconds) {
        return Response.json(
          { error: 'Too many requests. Please try again shortly.' },
          { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
        );
      }
    }
    const { session_id, public_session_key, email, first_name } = await parseBoundedJson(req);
    if (typeof session_id !== 'string' || typeof public_session_key !== 'string' || typeof email !== 'string') return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalizedEmail) || normalizedEmail.length > 255) return Response.json({ error: 'Invalid email' }, { status: 400 });
    if (first_name && (typeof first_name !== 'string' || first_name.length > 100)) return Response.json({ error: 'Invalid first name' }, { status: 400 });
    const session = await base44.asServiceRole.entities.DiscoverySession.get(session_id);
    if (!session || session.public_session_key !== public_session_key || (session.expires_at && new Date(session.expires_at) < new Date()) || ['deleted', 'expired', 'deletion_requested'].includes(session.status)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const consents = await base44.asServiceRole.entities.DiscoveryConsent.filter({ session_id, consent_type: 'journal' });
    const consent = consents[0];
    if (!consent || consent.state !== 'granted' || consent.affirmative_action !== true) return Response.json({ error: 'Missing Journal consent' }, { status: 403 });
    const existing = await base44.asServiceRole.entities.Subscriber.filter({ email: normalizedEmail });
    let subscriber = existing[0];
    const data = { email: normalizedEmail, first_name: first_name?.trim() || subscriber?.first_name, status: 'active', source: 'Growth Guide completion', consent_status: 'confirmed', consent_date: new Date().toISOString().slice(0, 10), consent_method: 'website_form', consent_context: `Optional Journal signup after Discovery session ${session_id}` };
    if (subscriber) { await base44.asServiceRole.entities.Subscriber.update(subscriber.id, data); subscriber = { ...subscriber, ...data }; }
    else subscriber = await base44.asServiceRole.entities.Subscriber.create(data);
    await base44.asServiceRole.entities.DiscoveryAuditEvent.create({ session_id, event_type: 'created', actor_type: 'owner', actor_id: session.anonymous_visitor_id || 'anonymous_owner', occurred_at: new Date().toISOString(), target_record_type: 'Subscriber', target_record_id: subscriber.id, reason: 'Owner optionally subscribed to the NTA Journal', metadata: { consent_id: consent.id } });
    return Response.json({ subscribed: true, subscriber_id: subscriber.id });
  } catch (error) {
    if (error instanceof RequestTooLarge) {
      return Response.json({ error: 'Request body too large' }, { status: 413 });
    }
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
});

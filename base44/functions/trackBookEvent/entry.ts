import { createClient, createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

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
const requestBuckets = new Map();

function decodeBase64Url(value) {
  const normalized = String(value || '').replaceAll('-', '+').replaceAll('_', '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

async function verifyTrackingToken(token, bookKey) {
  const secret = String(Deno.env.get('NTA_CORE_BRIDGE_SECRET') || '').trim();
  if (secret.length < 32 || typeof token !== 'string') return false;
  const [encodedPayload, encodedSignature, ...extra] = token.split('.');
  if (!encodedPayload || !encodedSignature || extra.length) return false;
  try {
    const key = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'],
    );
    const valid = await crypto.subtle.verify(
      'HMAC', key, decodeBase64Url(encodedSignature), new TextEncoder().encode(encodedPayload),
    );
    if (!valid) return false;
    const payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(encodedPayload)));
    return payload?.book_key === bookKey && Number(payload?.exp) > Date.now();
  } catch { return false; }
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

function getRetryAfter(req) {
  const key = String(
    req.headers.get('cf-connecting-ip')
      || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || 'unknown',
  ).slice(0, 128);
  const now = Date.now();
  let bucket = requestBuckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + (15 * 60 * 1000) };
    requestBuckets.set(key, bucket);
  }
  if (bucket.count >= 30) {
    return Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  }
  bucket.count += 1;
  return 0;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed.' }, { status: 405 });
  }
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me().catch(() => null);

  const retryAfter = getRetryAfter(req);
  if (retryAfter) {
    return Response.json(
      { error: 'Too many tracking requests.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    );
  }

  try {
    const contentLength = Number(req.headers.get('content-length') || 0);
    if (Number.isFinite(contentLength) && contentLength > 4096) {
      return Response.json({ error: 'Request body too large.' }, { status: 413 });
    }

    const payload = await req.json();
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return Response.json({ error: 'Invalid tracking request.' }, { status: 400 });
    }

    if (!['better-business-book', 'practical-ai-for-small-business'].includes(payload.book_key)
      || !['access_request', 'download_click', 'read_online_click'].includes(payload.event_type)) {
      return Response.json({ error: 'Invalid book event.' }, { status: 400 });
    }
    const privileged = user?.role === 'admin' || user?.is_service === true;
    if (!privileged) {
      if (!isTrustedPublicOrigin(req)) return Response.json({ error: 'Untrusted request origin.' }, { status: 403 });
      if (payload.event_type === 'access_request') return Response.json({ error: 'Access requests are recorded by the verified signup flow.' }, { status: 403 });
      if (!await verifyTrackingToken(payload.tracking_token, payload.book_key)) {
        return Response.json({ error: 'Book tracking authorization expired. Please request access again.' }, { status: 403 });
      }
    }
    const office = createCoreClient();
    const response = await office.functions.invoke('trackBookEvent', payload);
    return Response.json(response?.data ?? response);
  } catch (error) {
    const status = error?.response?.status || 500;
    const detail = error?.response?.data || { error: error?.message || 'Book activity could not be recorded.' };
    console.error('[public trackBookEvent] Office tracking failed:', detail);
    return Response.json(detail, { status });
  }
});

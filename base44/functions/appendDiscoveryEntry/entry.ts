import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

const TRUSTED_PUBLIC_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://app.newtechadvertising.com',
  'https://new-tech-advertising.base44.app',
]);
const REQUEST_WINDOW_MS = 15 * 60 * 1000;
const REQUEST_LIMIT = 48;
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

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
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
    if (contentLength > 12000) {
      return Response.json({ error: 'Request is too large' }, { status: 413 });
    }

    const rawBody = await req.text();
    if (rawBody.length > 12000) {
      return Response.json({ error: 'Request is too large' }, { status: 413 });
    }

    let body: any;
    try {
      body = JSON.parse(rawBody || '{}');
    } catch {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (!body || Array.isArray(body) || typeof body !== 'object') {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const {
      session_id,
      public_session_key,
      client_request_id,
      text,
      speaker = 'owner',
      source_mode = 'text'
    } = body;

    // 1. Inline Session Authentication
    if (!session_id || !public_session_key || typeof session_id !== 'string' || typeof public_session_key !== 'string') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let session;
    try {
      session = await base44.asServiceRole.entities.DiscoverySession.get(session_id);
    } catch (e) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session || session.public_session_key !== public_session_key) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.expires_at && new Date(session.expires_at) < new Date()) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const answerableStatuses = ['started', 'in_progress', 'paused'];
    if (!answerableStatuses.includes(session.status)) {
      return Response.json({ error: 'Session is not accepting answers' }, { status: 409 });
    }

    // 2. Input Validation
    if (
      !client_request_id ||
      typeof client_request_id !== 'string' ||
      client_request_id.length > 128
    ) {
      return Response.json({ error: 'Invalid client request ID' }, { status: 400 });
    }

    if (!text || typeof text !== 'string' || text.trim() === '' || text.length > 5000) {
      return Response.json({ error: 'Invalid text payload' }, { status: 400 });
    }

    if (speaker !== 'owner') {
      return Response.json({ error: 'Cannot impersonate restricted speakers' }, { status: 403 });
    }
    
    if (!['text', 'voice_transcript'].includes(source_mode)) {
      return Response.json({ error: 'Invalid source mode' }, { status: 403 });
    }

    // Answers may only be stored after the owner has explicitly allowed
    // Discovery processing. Voice transcripts additionally require the two
    // voice-specific permissions; browser microphone permission alone is not
    // treated as consent to transcribe or save the words.
    const consents = await base44.asServiceRole.entities.DiscoveryConsent.filter({ session_id });
    const granted = new Set(
      consents.filter(consent => consent.state === 'granted').map(consent => consent.consent_type)
    );
    if (!granted.has('discovery_processing')) {
      return Response.json({ error: 'Discovery processing consent required' }, { status: 403 });
    }
    if (
      source_mode === 'voice_transcript' &&
      (!granted.has('microphone') || !granted.has('transcription'))
    ) {
      return Response.json({ error: 'Voice consent required' }, { status: 403 });
    }

    const safeFields = (entry: any) => ({
      id: entry.id,
      session_id: entry.session_id,
      client_request_id: entry.client_request_id,
      speaker: entry.speaker,
      text: entry.text,
      source_mode: entry.source_mode,
      occurred_at: entry.occurred_at
    });

    // 3. Return the original entry when the browser retries one logical submission.
    // Base44 does not provide a compound unique constraint here, so this check is
    // intentionally idempotent for normal retries but is not fully atomic against
    // malicious or extreme concurrent requests.
    const existingEntries = await base44.asServiceRole.entities.DiscoveryConversationEntry.filter({
      session_id,
      client_request_id
    });
    if (existingEntries.length > 0) {
      return Response.json({ ...safeFields(existingEntries[0]), replayed: true });
    }

    const now = new Date().toISOString();

    // 4. Create Entry
    const entry = await base44.asServiceRole.entities.DiscoveryConversationEntry.create({
      session_id,
      client_request_id,
      speaker: 'owner',
      text: text.trim(),
      source_mode,
      occurred_at: now
    });

    // 5. Update Parent Session
    const updateData: any = { last_activity_at: now };
    if (session.status === 'started') {
      updateData.status = 'in_progress';
    }
    await base44.asServiceRole.entities.DiscoverySession.update(session_id, updateData);

    // 6. Return Safe Fields Only
    return Response.json({ ...safeFields(entry), replayed: false });

  } catch (error) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
});

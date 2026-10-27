import { createClientFromRequest } from 'npm:@base44/sdk@0.8.41';

const HEYGEN_SPEECH_URL = 'https://api.heygen.com/v3/voices/speech';
const RICK_VOICE_ID = '40a9cc7e29c3483b8a04c412ae2d8017';
const TRUSTED_PUBLIC_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://new-tech-advertising.base44.app',
]);
const WINDOW_MS = 15 * 60 * 1000;
const REQUEST_LIMIT = 24;
const MAX_TEXT_LENGTH = 2600;
const buckets = new Map<string, { count: number; resetAt: number }>();

function isTrustedPublicOrigin(req: Request) {
  const origin = req.headers.get('origin') || req.headers.get('referer');
  if (!origin) return false;
  try {
    return TRUSTED_PUBLIC_ORIGINS.has(new URL(origin).origin);
  } catch {
    return false;
  }
}

function isRateLimited(req: Request) {
  const key = String(
    req.headers.get('cf-connecting-ip')
      || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || 'unknown'
  ).slice(0, 128);
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + WINDOW_MS };
    buckets.set(key, bucket);
  }
  if (bucket.count >= REQUEST_LIMIT) {
    return Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  }
  bucket.count += 1;
  return 0;
}

function plainSpeechText(value: unknown) {
  return String(value || '')
    .replace(/\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/[*_#>`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_TEXT_LENGTH);
}

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
  const isTestKey = (value: string) => /^[123]x0{8,}/.test(value);
  return siteKey.length >= 20 && secret.length >= 20 && !isTestKey(siteKey) && !isTestKey(secret)
    ? { siteKey, secret }
    : null;
}

function publicVerificationConfig(action: string) {
  const settings = verificationSettings();
  if (!settings) {
    return Response.json({ error: 'Verification is temporarily unavailable. Please call or text 641-420-8816.' }, { status: 503 });
  }
  return Response.json({ site_key: settings.siteKey, action }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}

async function verifyPublicRequest(req: Request, token: unknown, action: string) {
  if (typeof token !== 'string' || !token.trim() || token.length > 2048) {
    return Response.json({ error: 'Please complete the verification and try again.', code: 'VERIFICATION_REQUIRED' }, { status: 403 });
  }
  const settings = verificationSettings();
  if (!settings) {
    return Response.json({ error: 'Verification is temporarily unavailable. Please call or text 641-420-8816.' }, { status: 503 });
  }

  let expectedHostname: string;
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

Deno.serve(async (req: Request) => {
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

    const body = await req.json().catch(() => null);
    if (body?.verification_config === true) {
      return publicVerificationConfig('speak_guide_answer');
    }

    if (!trustedService) {
      const retryAfter = isRateLimited(req);
      if (retryAfter) {
        return Response.json(
          { error: 'Please wait a moment before asking Rick another question.' },
          { status: 429, headers: { 'Retry-After': String(retryAfter) } }
        );
      }
      const verificationError = await verifyPublicRequest(req, body?.verification_token, 'speak_guide_answer');
      if (verificationError) return verificationError;
    }

    const text = plainSpeechText(body?.text);
    if (!text) {
      return Response.json({ error: 'A short answer is required to create speech.' }, { status: 400 });
    }

    const apiKey = Deno.env.get('HEYGEN_API_KEY') || Deno.env.get('Heygen') || '';
    if (!apiKey) {
      return Response.json({ error: 'Rick’s spoken guide is not configured yet.' }, { status: 503 });
    }

    const response = await fetch(HEYGEN_SPEECH_URL, {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice_id: RICK_VOICE_ID,
        language: 'en',
        locale: 'en-US',
      }),
      signal: AbortSignal.timeout(25_000),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.data?.audio_url) {
      console.error('HeyGen speech request failed', { status: response.status });
      return Response.json({ error: 'Rick’s voice is temporarily unavailable. You can still read the answer.' }, { status: 502 });
    }

    return Response.json({
      audio_url: payload.data.audio_url,
      duration: payload.data.duration || null,
    });
  } catch (error) {
    console.error('speakGrowthGuideAnswer failed', {
      name: error instanceof Error ? error.name : 'UnknownError',
    });
    return Response.json({ error: 'Rick’s spoken guide is temporarily unavailable. You can still read the answer.' }, { status: 500 });
  }
});
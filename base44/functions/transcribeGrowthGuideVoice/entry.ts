import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// Deployment stamp for the registered production transcription service.
const FUNCTION_VERSION = 'v1-direct-2026-08-05-production-sync-r3';
const MAX_BASE64_LENGTH = 8_000_000;
// Include a small allowance for JSON metadata; never buffer an unbounded request.
const MAX_JSON_BODY_BYTES = MAX_BASE64_LENGTH + 16_384;
class RequestTooLarge extends Error {}
const OPENAI_TIMEOUT_MS = 25_000;
const ALLOWED_AUDIO_TYPES: Record<string, string> = {
  'audio/webm': 'webm',
  'audio/mp4': 'm4a',
  'audio/ogg': 'ogg',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'audio/mpeg': 'mp3'
};
const TRUSTED_PUBLIC_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://app.newtechadvertising.com',
  'https://new-tech-advertising.base44.app',
]);
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

function isTrustedPublicOrigin(req: Request) {
  const rawOrigin = req.headers.get('origin') || req.headers.get('referer');
  if (!rawOrigin) return false;
  try { return TRUSTED_PUBLIC_ORIGINS.has(new URL(rawOrigin).origin); } catch { return false; }
}

function rateLimit(req: Request) {
  const key = String(req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown').slice(0, 128);
  const now = Date.now();
  let bucket = requestBuckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + 15 * 60 * 1000 };
    requestBuckets.set(key, bucket);
  }
  if (bucket.count >= 6) return Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  bucket.count += 1;
  return 0;
}

type FailureStage =
  | 'REQUEST_DECODING'
  | 'SECRET_ACCESS'
  | 'AUDIO_DECODING'
  | 'AUDIO_FILE_CREATION'
  | 'MULTIPART_CREATION'
  | 'OPENAI_REQUEST'
  | 'OPENAI_RESPONSE';

const decodeBase64 = (value: string) => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
};

// Base44's client wraps non-2xx function responses in an opaque exception.
// Preserve the established 200 envelope with fixed, public-safe diagnostic codes.
// Never send provider response bodies, account configuration or authentication details.
const voiceError = (error: string, diagnosticCode: string) => Response.json({
  error,
  diagnostic_code: diagnosticCode,
  function_version: FUNCTION_VERSION,
});

const transcriptionFailure = (status: number) => {
  if (status === 401 || status === 403) {
    return voiceError('Voice transcription is temporarily unavailable. Please try again or type your message.', 'OPENAI_AUTH_FAILED');
  }
  if (status === 429) {
    return voiceError('Voice transcription is busy right now. Please try again shortly or type your message.', 'OPENAI_RATE_LIMITED');
  }
  if (status === 400 || status === 415 || status === 422) {
    return voiceError('The recording could not be read. Please record again or type your message.', 'OPENAI_AUDIO_REJECTED');
  }
  return voiceError('Voice transcription could not be completed. Please try again or type your message.', `OPENAI_HTTP_${status}`);
};

// Turnstile verification is public visitor proof, not account authentication.
// Origin and Referer are routing hints only — never authorization.
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
    return voiceError('Voice verification is temporarily unavailable. Please call or text 641-420-8816.', 'VERIFICATION_UNAVAILABLE');
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
    return voiceError('Voice verification is temporarily unavailable. Please call or text 641-420-8816.', 'VERIFICATION_UNAVAILABLE');
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
    return Response.json({ error: 'Verification could not be completed. Please try again shortly.' }, { status: 503 });
  }
}

// Read a request with an actual byte ceiling before JSON parsing. Content-Length
// is advisory only; chunked requests must also be checked while streaming.
async function parseBoundedJson(req: Request): Promise<unknown> {
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

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me().catch(() => null);
  const trustedService = user?.role === 'admin' || user?.is_service === true;
  if (!trustedService && !isTrustedPublicOrigin(req)) return Response.json({ error: 'Untrusted request origin' }, { status: 403 });

  let stage: FailureStage = 'REQUEST_DECODING';

  try {
    const body = await parseBoundedJson(req);

    if (body?.verification_config === true) {
      return publicVerificationConfig('transcribe_guide_voice');
    }

    if (!trustedService) {
      const retryAfter = rateLimit(req);
      if (retryAfter) return Response.json({ error: 'Too many transcription requests' }, { status: 429, headers: { 'Retry-After': String(retryAfter) } });
      const verificationError = await verifyPublicRequest(req, body?.verification_token, 'transcribe_guide_voice');
      if (verificationError) return verificationError;
    }

    const audioBase64 = typeof body?.audio_base64 === 'string' ? body.audio_base64 : '';
    const mimeType = String(body?.mime_type || '').split(';')[0].toLowerCase();
    const extension = ALLOWED_AUDIO_TYPES[mimeType];

    if (!audioBase64 || !extension) {
      return voiceError('A supported audio recording is required.', 'AUDIO_FORMAT_UNSUPPORTED');
    }
    if (audioBase64.length > MAX_BASE64_LENGTH) {
      return voiceError('The recording is too long. Please keep it under one minute.', 'AUDIO_TOO_LARGE');
    }

    stage = 'SECRET_ACCESS';
    const apiKey = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('OpenAI') || '';
    if (!apiKey) {
      return voiceError(
        'Voice transcription is temporarily unavailable. Please try again or type your message.',
        'OPENAI_KEY_MISSING'
      );
    }

    stage = 'AUDIO_DECODING';
    const audioBytes = decodeBase64(audioBase64);

    stage = 'AUDIO_FILE_CREATION';
    const audioFile = new File(
      [audioBytes],
      `talk-to-my-office.${extension}`,
      { type: mimeType }
    );
    if (audioFile.size < 1_000) {
      return voiceError(
        'The recording did not contain enough audio to transcribe.',
        'AUDIO_TOO_SHORT'
      );
    }

    stage = 'MULTIPART_CREATION';
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');
    formData.append(
      'prompt',
      'New Tech Advertising, NTA, Talk to My Office, Digital Growth Guide, Growth Roadmap, Knowledge Library.'
    );

    stage = 'OPENAI_REQUEST';
    let openAIResponse: Response;
    try {
      openAIResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` },
        body: formData,
        signal: AbortSignal.timeout(OPENAI_TIMEOUT_MS)
      });
    } catch (error) {
      if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
        return voiceError(
          'Voice transcription timed out while waiting for OpenAI. Please try again or type your message.',
          'OPENAI_REQUEST_TIMED_OUT'
        );
      }
      throw error;
    }

    if (!openAIResponse.ok) {
      // Do not parse or copy untrusted provider error bodies into public output.
      console.error('OpenAI transcription request failed', { status: openAIResponse.status });
      return transcriptionFailure(openAIResponse.status);
    }

    stage = 'OPENAI_RESPONSE';
    const transcription = await openAIResponse.json();
    const transcript = String(transcription?.text || '').trim();

    if (!transcript) {
      return voiceError('No speech was detected in the recording.', 'NO_SPEECH_DETECTED');
    }

    return Response.json({ transcript, function_version: FUNCTION_VERSION });
  } catch (error) {
    if (error instanceof RequestTooLarge) {
      return voiceError('The recording is too long. Please keep it under one minute.', 'AUDIO_TOO_LARGE');
    }
    console.error('transcribeGrowthGuideVoice failed', {
      stage,
      name: error instanceof Error ? error.name : 'UnknownError'
    });
    return voiceError(
      `Voice transcription stopped during ${stage.toLowerCase().replaceAll('_', ' ')}.`,
      `${stage}_FAILED`
    );
  }
});
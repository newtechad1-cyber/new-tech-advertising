import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

const TRUSTED_APP_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://app.newtechadvertising.com',
  'https://new-tech-advertising.base44.app',
]);
const REQUEST_WINDOW_MS = 15 * 60 * 1000;
const REQUEST_LIMIT = 8;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

function isTrustedAppOrigin(req: Request) {
  try {
    const origin = req.headers.get('origin');
    if (origin && TRUSTED_APP_ORIGINS.has(origin)) return true;

    const referer = req.headers.get('referer');
    return Boolean(referer && TRUSTED_APP_ORIGINS.has(new URL(referer).origin));
  } catch {
    return false;
  }
}

function isRateLimited(req: Request) {
  const now = Date.now();
  const key = String(
    req.headers.get('cf-connecting-ip')
    || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown',
  ).slice(0, 128);
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
  try {
    if (!isTrustedAppOrigin(req)) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const retryAfterSeconds = isRateLimited(req);
    if (retryAfterSeconds) {
      return Response.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
      );
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { businessName, industry, serviceArea, offer, duration, tone } = await req.json();
    if (!businessName || !industry || !serviceArea) {
      return Response.json({ error: 'businessName, industry, and serviceArea are required' }, { status: 400 });
    }

    const prompt = `Write a ${duration || '30 seconds'} streaming TV commercial script for a local ${industry} business.

Business name: ${businessName}
Service area: ${serviceArea}
Special offer or key message: ${offer || 'quality service and free estimates'}
Tone: ${tone || 'Professional'}

Format the script with:
- OPENING (hook — first 3 seconds)
- BODY (main message with benefits)
- CALL TO ACTION (clear next step)

Keep it tight to the ${duration || '30 seconds'} duration. Write conversational, spoken-word language — not marketing copy. Include a suggested voiceover note.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });

    return Response.json({ script: typeof result === 'string' ? result : result?.text || '' });
  } catch (error) {
    console.error('[generateTvCommercialScript] Error:', error?.message || error);
    return Response.json({ error: 'Script generation failed' }, { status: 500 });
  }
});
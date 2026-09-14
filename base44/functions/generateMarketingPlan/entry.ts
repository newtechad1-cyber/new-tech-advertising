import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';
import { isTrustedAppOrigin } from '../shared/origin-guard.ts';

const REQUEST_WINDOW_MS = 15 * 60 * 1000;
const REQUEST_LIMIT = 8;
const MAX_BODY_BYTES = 12_288;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

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

function stringField(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

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

    const declaredLength = Number(req.headers.get('content-length') || 0);
    if (declaredLength > MAX_BODY_BYTES) {
      return Response.json({ error: 'Request too large' }, { status: 413 });
    }

    const rawBody = await req.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return Response.json({ error: 'Request too large' }, { status: 413 });
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody || '{}');
    } catch {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }
    if (!payload || Array.isArray(payload) || typeof payload !== 'object') {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const businessName = stringField(payload.businessName, 160);
    const industry = stringField(payload.industry, 160);
    const city = stringField(payload.city, 160);
    const goal = stringField(payload.goal, 160);
    const budget = stringField(payload.budget, 160);
    const channels = Array.isArray(payload.channels)
      ? payload.channels
          .filter((channel: unknown) => typeof channel === 'string')
          .map((channel: string) => channel.trim().slice(0, 64))
          .filter(Boolean)
          .slice(0, 10)
      : [];
    const notes = stringField(payload.notes, 2_000);

    if (!businessName || !industry || !city) {
      return Response.json({ error: 'businessName, industry, and city are required' }, { status: 400 });
    }

    const prompt = `Create a practical 90-day marketing plan for a local small business.

Business name: ${businessName}
Industry: ${industry}
City / Service area: ${city}
Primary goal: ${goal || 'grow'}
Monthly marketing budget: ${budget || 'Not specified'}
Preferred channels: ${channels.length ? channels.join(', ') : 'Open to all channels'}
Additional context: ${notes || 'None provided'}

Format the plan with these sections:
1. SITUATION SUMMARY — a brief honest assessment of this type of business's marketing position
2. PRIMARY STRATEGY — the one core approach that will drive the most results given the goal and budget
3. CHANNEL BREAKDOWN — for each relevant channel, what to do and how much budget to allocate
4. 90-DAY CALENDAR — what to do in Month 1, Month 2, and Month 3
5. QUICK WINS — 3 things to do in the first 7 days
6. SUCCESS METRICS — how to know if the plan is working

Be specific, practical, and oriented toward a local service business owner who is not a marketing expert.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });

    return Response.json({ plan: typeof result === 'string' ? result : result?.text || '' });
  } catch (error) {
    console.error('[generateMarketingPlan] Error:', error?.message || error);
    return Response.json({ error: 'Marketing plan generation failed' }, { status: 500 });
  }
});
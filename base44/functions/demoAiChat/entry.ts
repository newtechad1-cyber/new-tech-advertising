import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

const REQUEST_WINDOW_MS = 15 * 60 * 1000;
const REQUEST_LIMIT = 12;
const MAX_BODY_BYTES = 16_384;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

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

function stringField(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    // Internal/legacy endpoint. Origin and Referer headers are not authentication.
    const user = await base44.auth.me().catch(() => null);
    if (!user) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }
    if (user.role !== 'admin' && user.is_service !== true) {
      return Response.json({ error: 'Administrator or service access required' }, { status: 403 });
    }

    const retryAfterSeconds = isRateLimited(req);
    if (retryAfterSeconds) {
      return Response.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
      );
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

    const honeypot = stringField(payload.website, 200);
    if (honeypot) {
      return Response.json({ error: 'Invalid request' }, { status: 400 });
    }

    const question = stringField(payload.question, 1_000);
    const context = stringField(payload.context, 1_000);
    const history = Array.isArray(payload.history)
      ? payload.history
          .slice(-8)
          .map((message: any) => ({
            role: message?.role === 'user' ? 'user' : 'assistant',
            content: stringField(message?.content, 800),
          }))
          .filter((message: any) => message.content)
      : [];

    if (!question) {
      return Response.json({ error: 'question is required' }, { status: 400 });
    }

    const historyText = history
      .map((message: any) => `${message.role === 'user' ? 'Prospect' : 'NTA Guide'}: ${message.content}`)
      .join('\n');

    const prompt = `You are the NTA demo guide — a helpful, confident sales assistant for New Tech Advertising, an AI marketing platform for small businesses.
Context about where the prospect is in the demo: ${context || 'browsing the demo'}

Previous conversation:
${historyText}

Prospect question: ${question}

Answer in 2-4 short paragraphs. Be direct, friendly, and specific. If they ask about pricing, mention plans start at an affordable monthly rate and suggest booking a call for a custom quote. Always end with a relevant CTA like "Want to see this in action?" or "Ready to start your free trial?"`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });

    const answer = typeof result === 'string' ? result : result?.text || 'Great question! Let me connect you with our team for a personalized answer.';
    return Response.json({ answer });
  } catch (error) {
    console.error('[demoAiChat] Error:', error?.message || error);
    return Response.json({ error: 'Chat failed' }, { status: 500 });
  }
});
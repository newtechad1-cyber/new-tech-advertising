import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const MAX_BODY_BYTES = 16_384;
const REQUEST_WINDOW_MS = 10 * 60 * 1000;
const REQUEST_LIMIT = 10;
const TRUSTED_PUBLIC_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://new-tech-advertising.base44.app',
]);

const requestBuckets = new Map();

function trustedOrigin(req) {
  const rawOrigin = req.headers.get('origin') || req.headers.get('referer');
  if (!rawOrigin) return false;
  try {
    return TRUSTED_PUBLIC_ORIGINS.has(new URL(rawOrigin).origin);
  } catch {
    return false;
  }
}

function clientKey(req) {
  return String(
    req.headers.get('cf-connecting-ip')
      || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown',
  ).slice(0, 128);
}

function retryAfter(req) {
  const now = Date.now();
  const key = clientKey(req);
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

function clean(value, maxLength) {
  return String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLength);
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  const declaredLength = Number(req.headers.get('content-length') || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return Response.json({ error: 'Request too large' }, { status: 413 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const authUser = await base44.auth.me().catch(() => null);
    const trustedService = authUser?.role === 'admin' || authUser?.is_service === true;

    // Growth Guide visitors may submit without an account. Direct anonymous
    // requests are accepted only from the public NTA site.
    if (!trustedService && !trustedOrigin(req)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const wait = retryAfter(req);
    if (wait) {
      return Response.json(
        { error: 'Too many requests. Please try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(wait) } },
      );
    }

    const payload = await req.json();
    const event = payload?.event || {};
    const lead = payload?.lead || event?.lead || event?.contact || {};

    if (payload?.website || event?.website || lead?.website) {
      return Response.json({ success: true, accepted: false, reason: 'spam_rejected' });
    }

    const name = clean(payload?.name || event?.name || lead?.name, 120);
    const email = clean(payload?.email || event?.email || lead?.email, 254);
    const phone = clean(payload?.phone || event?.phone || lead?.phone, 40);
    const company = clean(payload?.company || event?.company || lead?.company, 160);
    const conversationId = clean(event?.conversation_id || payload?.conversation_id, 160);
    const notes = clean(payload?.notes || event?.notes || lead?.notes, 2000);

    const validEmail = email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validPhone = phone === '' || /^[0-9+().\-\s]{7,40}$/.test(phone);
    if (!name || (!email && !phone) || !validEmail || !validPhone) {
      return Response.json({
        success: true,
        accepted: false,
        reason: 'name_and_contact_required',
      });
    }

    const currentDate = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'info@newtechadvertising.com',
      subject: 'New NTA Growth Guide conversation',
      body: [
        'A visitor shared contact information with the NTA Growth Guide.',
        '',
        `Time: ${currentDate}`,
        `Name: ${name}`,
        `Email: ${email || 'Not provided'}`,
        `Phone: ${phone || 'Not provided'}`,
        `Company: ${company || 'Not provided'}`,
        `Conversation ID: ${conversationId || 'N/A'}`,
        `Notes: ${notes || 'None'}`,
      ].join('\n'),
    });

    return Response.json({ success: true, accepted: true });
  } catch (error) {
    console.error('Error in chatbot lead capture:', error?.message || error);
    return Response.json({ error: 'Unable to process this request right now' }, { status: 500 });
  }
});

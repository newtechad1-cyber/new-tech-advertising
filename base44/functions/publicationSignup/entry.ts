import { createClient, createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const OFFICE_APP_ID = '6a7215451eb90dc843a94546';
const TRUSTED_PUBLIC_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://app.newtechadvertising.com',
  'https://new-tech-advertising.base44.app',
]);
const REQUEST_WINDOW_MS = 15 * 60 * 1000;
const REQUEST_LIMIT = 12;
const requestBuckets = new Map();

function isTrustedPublicOrigin(req) {
  const rawOrigin = req.headers.get('origin') || req.headers.get('referer');
  if (!rawOrigin) return false;

  try {
    return TRUSTED_PUBLIC_ORIGINS.has(new URL(rawOrigin).origin);
  } catch {
    return false;
  }
}

function requestClientIdentity(req) {
  return String(
    req.headers.get('cf-connecting-ip')
    || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown',
  ).slice(0, 128);
}

function isRateLimited(req) {
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

function value(input, length = 500) {
  return String(input || '').trim().slice(0, length);
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function uniqueTags(tags) {
  return [...new Set((Array.isArray(tags) ? tags.slice(0, 12) : []).map((tag) => value(tag, 80)).filter(Boolean))];
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return Response.json({ error: 'Method not allowed.' }, { status: 405 });
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    const trustedService = user?.role === 'admin' || user?.is_service === true;

    if (!trustedService && !isTrustedPublicOrigin(req)) {
      return Response.json({ error: 'Untrusted request origin.' }, { status: 403 });
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
    if (contentLength > 16000) {
      return Response.json({ error: 'Request is too large.' }, { status: 413 });
    }

    const rawBody = await req.text();
    if (rawBody.length > 16000) {
      return Response.json({ error: 'Request is too large.' }, { status: 413 });
    }

    let payload;
    try {
      payload = JSON.parse(rawBody || '{}');
    } catch {
      return Response.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    if (!payload || Array.isArray(payload) || typeof payload !== 'object') {
      return Response.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const antiSpam = payload.anti_spam && typeof payload.anti_spam === 'object' ? payload.anti_spam : {};
    const formStartedAt = Number(antiSpam.form_started_at || 0);
    const elapsedMs = formStartedAt ? Date.now() - formStartedAt : null;
    if (
      value(antiSpam.honeypot, 200)
      || (elapsedMs !== null && (elapsedMs < 1200 || elapsedMs > 24 * 60 * 60 * 1000))
    ) {
      return Response.json({ success: true, accepted: false });
    }

    const email = value(payload.email, 320).toLowerCase();
    const name = value(payload.name, 200);
    const businessName = value(payload.business_name, 300);
    const publicationTitle = value(payload.publication_title, 300);
    const publicationTag = value(payload.publication_tag, 100);
    const deliveryUrl = value(payload.delivery_url, 1500);
    if (!validEmail(email) || !publicationTitle || !publicationTag) {
      return Response.json({ error: 'A valid email address and publication details are required.' }, { status: 400 });
    }

    const [firstName, ...remaining] = name.split(/\s+/).filter(Boolean);
    const existing = await base44.asServiceRole.entities.Subscriber.filter({ email });
    const current = existing?.[0];
    const currentTags = uniqueTags(current?.tags || []);
    const isUnsubscribed = ['unsubscribed', 'revoked', 'inactive'].includes(String(current?.status || '').toLowerCase())
      || String(current?.consent_status || '').toLowerCase() === 'revoked';
    const legacyJournalTags = ['newsletter', 'nta-newsletter'];
    const alreadyHasJournalSubscription = publicationTag === 'nta-journal'
      && currentTags.some((tag) => tag === publicationTag || legacyJournalTags.includes(tag));
    const alreadySubscribed = current
      && (alreadyHasJournalSubscription || currentTags.includes(publicationTag))
      && !isUnsubscribed;

    if (alreadySubscribed) {
      // Upgrade a legacy newsletter record to the canonical Journal tag when
      // the person confirms the current consent checkbox, then show the
      // duplicate notice instead of creating another subscription.
      let duplicateJournalSyncStatus = null;
      if (alreadyHasJournalSubscription && publicationTag === 'nta-journal') {
        try {
          await base44.asServiceRole.entities.Subscriber.update(current.id, {
            tags: uniqueTags([...currentTags, 'nta-publications', 'nta-journal']),
            status: 'active',
            consent_status: 'confirmed',
            consent_date: new Date().toISOString().slice(0, 10),
            consent_method: 'website_form',
            consent_context: value(payload.consent_context, 1000) || current.consent_context || 'Confirmed The NTA Journal subscription from the NTA website.',
          });
        } catch (legacyUpgradeError) {
          console.warn('[publicationSignup] Legacy newsletter record upgrade failed:', legacyUpgradeError.message);
        }
      }

      if (publicationTag === 'nta-journal') {
        try {
          const sync = await base44.asServiceRole.functions.invoke('syncJournalSubscriber', { email });
          duplicateJournalSyncStatus = sync?.data?.status || sync?.status || 'requested';
        } catch (syncError) {
          duplicateJournalSyncStatus = 'needs_attention';
          console.warn('[publicationSignup] Existing Journal subscriber sync needs attention:', syncError);
        }
      }

      return Response.json({
        success: false,
        status: 'already_subscribed',
        error: 'This email is already subscribed to ' + publicationTitle + '.',
        journal_sync_status: duplicateJournalSyncStatus,
      }, { status: 409 });
    }

    const subscriberData = {
      email, first_name: firstName || current?.first_name || '', last_name: remaining.join(' ') || current?.last_name || '',
      business_name: businessName || current?.business_name || '',
      tags: uniqueTags([...(current?.tags || []), 'nta-publications', publicationTag, ...(payload.tags || [])]),
      source: value(payload.source, 200) || current?.source || 'nta_publication_signup',
      status: 'active', consent_status: 'confirmed', consent_date: new Date().toISOString().slice(0, 10),
      consent_method: 'website_form',
      consent_context: value(payload.consent_context, 1000) || current?.consent_context || `Requested ${publicationTitle} from the NTA website.`,
    };
    const subscriber = current
      ? await base44.asServiceRole.entities.Subscriber.update(current.id, subscriberData)
      : await base44.asServiceRole.entities.Subscriber.create(subscriberData);

    const deliveryRequest = payload.create_delivery_request !== false && deliveryUrl
      ? await base44.asServiceRole.entities.PublicationDeliveryRequest.create({
          subscriber_id: subscriber.id, publication_title: publicationTitle, status: 'pending',
          delivery_url: deliveryUrl, attempt_count: 0,
        })
      : null;

    let journalSyncStatus = null;
    if (publicationTag === 'nta-journal') {
      try {
        const sync = await base44.asServiceRole.functions.invoke('syncJournalSubscriber', { email });
        journalSyncStatus = sync?.data?.status || sync?.status || 'requested';
      } catch (syncError) {
        journalSyncStatus = 'needs_attention';
        console.warn('[publicationSignup] Journal subscriber saved; Brevo sync needs attention:', syncError);
      }
    }

    try {
      const office = createClient({ appId: OFFICE_APP_ID });
      await office.functions.invoke('trackBookEvent', {
        book_key: publicationTag,
        event_type: 'access_request',
      });
    } catch (trackingError) {
      console.warn('[publicationSignup] Book access event could not be recorded:', trackingError);
    }

    return Response.json({ success: true, subscriber_id: subscriber.id, delivery_request_id: deliveryRequest?.id || null, journal_sync_status: journalSyncStatus });
  } catch (error) {
    console.error('[publicationSignup]', error);
    return Response.json({ error: 'Unable to save the publication request.' }, { status: 500 });
  }
});
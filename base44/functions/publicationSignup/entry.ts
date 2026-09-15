import { createClient, createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

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
  const isTestKey = (value) => /^[123]x0{8,}/.test(value);
  return siteKey.length >= 20 && secret.length >= 20 && !isTestKey(siteKey) && !isTestKey(secret)
    ? { siteKey, secret }
    : null;
}

function publicVerificationConfig(action) {
  const settings = verificationSettings();
  if (!settings) {
    return Response.json({ error: 'Verification is temporarily unavailable. Please call or text 641-420-8816.' }, { status: 503 });
  }
  return Response.json({ site_key: settings.siteKey, action }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}

async function verifyPublicRequest(req, token, action) {
  if (typeof token !== 'string' || !token.trim() || token.length > 2048) {
    return Response.json({ error: 'Please complete the verification and try again.', code: 'VERIFICATION_REQUIRED' }, { status: 403 });
  }
  const settings = verificationSettings();
  if (!settings) {
    return Response.json({ error: 'Verification is temporarily unavailable. Please call or text 641-420-8816.' }, { status: 503 });
  }

  let expectedHostname;
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

const OFFICE_APP_ID = '6a7215451eb90dc843a94546';

function createCoreClient() {
  const secret = String(Deno.env.get('NTA_CORE_BRIDGE_SECRET') || '').trim();
  if (secret.length < 32) throw new Error('The NTA connection is not configured. Please call or text 641-420-8816.');
  return createClient({
    appId: OFFICE_APP_ID,
    headers: { 'x-nta-core-bridge-secret': secret },
  });
}

function base64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/g, '');
}

async function createBookTrackingToken(bookKey) {
  if (!bookKey || bookKey === 'nta-journal') return '';
  const secret = String(Deno.env.get('NTA_CORE_BRIDGE_SECRET') || '').trim();
  if (secret.length < 32) return '';
  const payload = JSON.stringify({ book_key: bookKey, exp: Date.now() + (60 * 60 * 1000) });
  const encodedPayload = base64Url(new TextEncoder().encode(payload));
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(encodedPayload)));
  return `${encodedPayload}.${base64Url(signature)}`;
}

const TRUSTED_PUBLIC_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://app.newtechadvertising.com',
  'https://new-tech-advertising.base44.app',
]);
const REQUEST_WINDOW_MS = 15 * 60 * 1000;
const REQUEST_LIMIT = 12;
const requestBuckets = new Map();

// Public callers may request only publications that NTA has explicitly configured.
// This prevents a visitor from using the signup endpoint to attach arbitrary tags
// or store a delivery link that could later be emailed to somebody else.
const PUBLICATIONS = Object.freeze({
  'nta-journal': {
    title: 'The NTA Journal',
    tags: [],
    delivery_url: '',
  },
  'better-business-book': {
    title: 'The Better Business Building Book',
    tags: ['free-book-download'],
    delivery_url: 'https://drive.usercontent.google.com/download?id=1SSpBnObRHrt0SGtVmHhOAdzazmLql-M9&export=download',
  },
  'practical-ai-for-small-business': {
    title: 'Practical AI for Small Business',
    tags: ['free-book-download'],
    delivery_url: 'https://drive.usercontent.google.com/download?id=11nq430-bcstci_fuOP8Fm9g2xTk2n0yl&export=download',
  },
});

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

    // This metadata response exposes only the public site key, never the secret.
    if (payload.verification_config === true && Object.keys(payload).length === 1) {
      return publicVerificationConfig('publication_signup');
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

    if (!trustedService) {
      const verificationError = await verifyPublicRequest(req, payload.verification_token, 'publication_signup');
      if (verificationError) return verificationError;
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

    if (payload.consent !== true) {
      return Response.json({ error: 'Please confirm that you want this publication and related updates.' }, { status: 400 });
    }

    const email = value(payload.email, 320).toLowerCase();
    const name = value(payload.name, 200);
    const businessName = value(payload.business_name, 300);
    const publicationTitle = value(payload.publication_title, 300);
    const publicationTag = value(payload.publication_tag, 100);
    const requestedDeliveryUrl = value(payload.delivery_url, 1500);
    const publication = PUBLICATIONS[publicationTag];
    if (!validEmail(email) || !publication || publication.title !== publicationTitle) {
      return Response.json({ error: 'A valid email address and recognized publication are required.' }, { status: 400 });
    }
    if (requestedDeliveryUrl && requestedDeliveryUrl !== publication.delivery_url) {
      return Response.json({ error: 'Invalid publication delivery link.' }, { status: 400 });
    }
    if (payload.create_delivery_request === true && !publication.delivery_url) {
      return Response.json({ error: 'This publication is delivered by email, not by download link.' }, { status: 400 });
    }
    const createDeliveryRequest = publication.delivery_url && payload.create_delivery_request !== false;

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

    const nowIso = new Date().toISOString();
    const source = value(payload.source, 200) || current?.source || 'nta_publication_signup';
    const sourceUrl = value(payload.source_url, 1500);
    const isJournalSignup = publicationTag === 'nta-journal';
    const subscriberData = {
      email, first_name: firstName || current?.first_name || '', last_name: remaining.join(' ') || current?.last_name || '',
      business_name: businessName || current?.business_name || '',
      tags: uniqueTags([...(current?.tags || []), 'nta-publications', publicationTag, ...(publication.tags || [])]),
      source,
      status: 'active', consent_status: 'confirmed', consent_date: new Date().toISOString().slice(0, 10),
      consent_method: 'website_form',
      consent_context: value(payload.consent_context, 1000) || current?.consent_context || `Requested ${publicationTitle} from the NTA website.`,
      consent_scope: isJournalSignup ? 'journal' : (current?.journal_consent_status === 'confirmed' ? 'mixed' : 'publication'),
      journal_consent_status: isJournalSignup ? 'confirmed' : (current?.journal_consent_status || 'none'),
      quality_classification: 'legitimate',
      risk_score: 0,
      risk_reasons: [],
      first_source: current?.first_source || source,
      most_recent_source: source,
      first_source_url: current?.first_source_url || sourceUrl,
      most_recent_source_url: sourceUrl || current?.most_recent_source_url || '',
      first_activity_at: current?.first_activity_at || nowIso,
      last_activity_at: nowIso,
    };
    const subscriber = current
      ? await base44.asServiceRole.entities.Subscriber.update(current.id, subscriberData)
      : await base44.asServiceRole.entities.Subscriber.create(subscriberData);

    const deliveryRequest = createDeliveryRequest
      ? await base44.asServiceRole.entities.PublicationDeliveryRequest.create({
          subscriber_id: subscriber.id, publication_title: publicationTitle, status: 'pending',
          delivery_url: publication.delivery_url, attempt_count: 0,
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

    // A publication form has already provided one verified visitor request.
    // Forward its optional CRM intake with the server's authenticated identity
    // so the browser does not need a second challenge or a reusable token.
    let intakeStatus = null;
    if (payload.record_intake === true) {
      try {
        const sourcePage = value(payload.source_page, 500) || '/';
        const intake = await base44.asServiceRole.functions.invoke('ntaUnifiedIntake', {
          name, email, business_name: businessName,
          source: value(payload.source, 200),
          source_page: sourcePage,
          source_url: value(payload.source_url, 1500),
          publication_title: publicationTitle, publication_tag: publicationTag,
          consent: true, consent_context: value(payload.consent_context, 1000),
          anti_spam: { honeypot: value(antiSpam.honeypot, 200), form_started_at: formStartedAt || undefined },
          submission_type: 'publication_request', offer_type: 'business_education',
          mapping_confidence: 'hardcoded',
          mapping_notes: 'Public publication signup for ' + publicationTitle,
          detected_route: sourcePage, detected_component: 'PublicationSignupForm',
          source_system: 'website', priority: 'low',
          notes: 'Requested ' + publicationTitle,
        });
        if (intake?.data?.success !== true) throw new Error('Publication intake was not confirmed');
        intakeStatus = 'saved';
      } catch (intakeError) {
        // The publication/subscriber record is already saved. A CRM follow-up
        // failure must not hide the download or ask the visitor to subscribe again.
        intakeStatus = 'needs_attention';
        console.warn('[publicationSignup] Publication saved; CRM intake needs attention:', intakeError?.message);
      }
    }

    try {
      const office = createCoreClient();
      await office.functions.invoke('trackBookEvent', {
        book_key: publicationTag,
        event_type: 'access_request',
      });
    } catch (trackingError) {
      console.warn('[publicationSignup] Book access event could not be recorded:', trackingError?.response?.status || 'request_failed');
    }

    const book_tracking_token = publicationTag === 'nta-journal' ? null : await createBookTrackingToken(publicationTag);
    return Response.json({ success: true, subscriber_id: subscriber.id, delivery_request_id: deliveryRequest?.id || null, journal_sync_status: journalSyncStatus, intake_status: intakeStatus, book_tracking_token });
  } catch (error) {
    console.error('[publicationSignup]', error);
    return Response.json({ error: 'Unable to save the publication request.' }, { status: 500 });
  }
});
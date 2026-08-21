import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const TRUSTED_PUBLIC_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://app.newtechadvertising.com',
  'https://new-tech-advertising.base44.app',
]);
const REQUEST_WINDOW_MS = 15 * 60 * 1000;
const REQUEST_LIMIT = 8;
const requestBuckets = new Map();

function cleanText(value, maxLength = 500) {
  return String(value || '').trim().slice(0, maxLength);
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

function requestClientIdentity(req) {
  const forwarded = req.headers.get('cf-connecting-ip')
    || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown';

  return String(forwarded).slice(0, 128);
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

  if (requestBuckets.size > 2000) {
    for (const [bucketKey, entry] of requestBuckets) {
      if (entry.resetAt <= now) requestBuckets.delete(bucketKey);
    }
  }

  return 0;
}

function isPlausibleEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPrivateOrLocalHost(hostname) {
  const host = String(hostname || '').toLowerCase();
  return (
    !host ||
    host === 'localhost' ||
    host === 'metadata.google.internal' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host) ||
    host === '::1'
  );
}

function normalizeWebsite(value) {
  const raw = cleanText(value, 2048);
  if (!raw) return null;

  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : 'https://' + raw;
  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    if (url.port && !['80', '443'].includes(url.port)) return null;
    if (isPrivateOrLocalHost(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

async function readJsonBody(req) {
  const contentLength = Number(req.headers.get('content-length') || 0);
  if (contentLength > 16000) return { error: 'Request is too large', status: 413 };

  const body = await req.text();
  if (body.length > 16000) return { error: 'Request is too large', status: 413 };

  try {
    const payload = JSON.parse(body || '{}');
    if (!payload || Array.isArray(payload) || typeof payload !== 'object') {
      return { error: 'Invalid request body', status: 400 };
    }
    return { payload };
  } catch {
    return { error: 'Invalid request body', status: 400 };
  }
}

Deno.serve(async (req) => {
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

    const retryAfterSeconds = isRateLimited(req);
    if (retryAfterSeconds) {
      return Response.json(
        { error: 'Too many requests. Please try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
      );
    }

    const requestBody = await readJsonBody(req);
    if (requestBody.error) {
      return Response.json({ error: requestBody.error }, { status: requestBody.status });
    }

    const formData = requestBody.payload;
    const honeypot = cleanText(formData.honeypot || formData.anti_spam?.honeypot, 200);
    if (honeypot) {
      return Response.json({ success: true, accepted: false });
    }

    const name = cleanText(formData.name || formData.full_name, 200);
    const business = cleanText(formData.business || formData.business_name, 300);
    const email = cleanText(formData.email, 320).toLowerCase();
    const phone = cleanText(formData.phone, 100);
    const websiteUrl = normalizeWebsite(formData.website_url || formData.website);
    const city = cleanText(formData.city, 200);
    const state = cleanText(formData.state, 100);
    const selectedPackage = cleanText(formData.selected_package || formData.package, 50);
    const locations = cleanText(formData.locations || formData.number_of_locations, 50);
    const siteType = cleanText(formData.site_type, 100);
    const pages = cleanText(formData.pages || formData.approximate_pages, 50);
    const industry = cleanText(formData.industry, 200);
    const notes = cleanText(formData.notes, 4000);

    if (!name || !business || !email || !phone || !websiteUrl || !city || !state || !selectedPackage) {
      return Response.json({ error: 'Please complete all required contact and business fields.' }, { status: 400 });
    }
    if (!isPlausibleEmail(email)) {
      return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (!['Starter', 'Growth', 'Authority'].includes(selectedPackage)) {
      return Response.json({ error: 'Invalid package selection.' }, { status: 400 });
    }

    const nonprofit = formData.nonprofit === true || formData.nonprofit === 'true';

    base44.asServiceRole.functions.invoke('ntaUnifiedIntake', {
      submission_type: 'ada_intake_form',
      offer_type: 'ada_compliance',
      mapping_confidence: 'hardcoded',
      mapping_notes: 'Validated public ADA intake',
      detected_route: '/ada',
      detected_component: 'AdaIntake',
      source_system: 'public_website',
      source_page: '/ada',
      name,
      business_name: business,
      email,
      phone,
      website: websiteUrl,
      city,
      state,
      notes,
      selected_package: selectedPackage,
      priority: 'high',
      is_high_intent: true,
      skip_webhook: true,
      anti_spam: {
        honeypot: '',
        form_started_at: Number(formData.anti_spam?.form_started_at || 0) || undefined,
      },
      raw_payload: {
        nonprofit,
        number_of_locations: locations,
        site_type: siteType,
        approximate_pages: pages,
        industry,
      },
    }).catch((error) => {
      console.warn('[adaIntake] canonical intake mirror failed:', error?.message || error);
    });

    const lead = await base44.asServiceRole.entities.AdaLead.create({
      full_name: name,
      business_name: business,
      email,
      phone,
      website_url: websiteUrl,
      city,
      state,
      nonprofit,
      number_of_locations: locations,
      site_type: siteType,
      approximate_pages: pages,
      industry,
      notes,
      package: selectedPackage,
      status: 'new',
    });

    await base44.asServiceRole.entities.LeadActivity.create({
      lead_id: lead.id,
      activity_type: 'form_submission',
      page_url: '/ada',
      details: 'Validated ADA intake form submitted for ' + selectedPackage + ' package',
    });

    try {
      await base44.asServiceRole.functions.invoke('adaWebhookHandler', {
        event: 'ada_intake_submitted',
        lead_id: lead.id,
        contact: { name, email, phone, business },
        package: selectedPackage,
        details: {
          website_url: websiteUrl,
          city,
          state,
          nonprofit,
          locations,
          site_type: siteType,
          pages,
          industry,
        },
      });
    } catch (webhookError) {
      console.warn('[adaIntake] webhook notification failed:', webhookError?.message || webhookError);
    }

    return Response.json({ success: true, lead_id: lead.id });
  } catch (error) {
    console.error('[adaIntake] failed:', error?.message || error);
    return Response.json({ error: 'Unable to submit your request right now.' }, { status: 500 });
  }
});

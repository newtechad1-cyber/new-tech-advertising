import { createClientFromRequest } from 'npm:@base44/sdk@0.8.41';

const TRUSTED_PUBLIC_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://app.newtechadvertising.com',
  'https://new-tech-advertising.base44.app',
]);
const REQUEST_WINDOW_MS = 60 * 60 * 1000;
const REQUEST_LIMIT = 8;
const MAX_BODY_LENGTH = 16000;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

function cleanText(value: unknown, maxLength: number) {
  return String(value || '').trim().slice(0, maxLength);
}

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

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function safeWebsiteUrl(value: string) {
  if (!value) return '';

  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : '';
  } catch {
    return '';
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
    if (contentLength > MAX_BODY_LENGTH) {
      return Response.json({ error: 'Request is too large' }, { status: 413 });
    }

    const rawBody = await req.text();
    if (rawBody.length > MAX_BODY_LENGTH) {
      return Response.json({ error: 'Request is too large' }, { status: 413 });
    }

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(rawBody || '{}');
    } catch {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (!payload || Array.isArray(payload) || typeof payload !== 'object') {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const antiSpam = payload.anti_spam && typeof payload.anti_spam === 'object'
      ? payload.anti_spam as Record<string, unknown>
      : {};
    const formStartedAt = Number(antiSpam.form_started_at || 0);
    const elapsedMs = formStartedAt ? Date.now() - formStartedAt : null;
    if (
      cleanText(antiSpam.honeypot, 200)
      || (elapsedMs !== null && (elapsedMs < 1200 || elapsedMs > 24 * 60 * 60 * 1000))
    ) {
      return Response.json({ success: true, accepted: false });
    }

    const businessName = cleanText(payload.business_name, 300);
    const fullName = cleanText(payload.full_name, 200);
    const email = cleanText(payload.email, 320).toLowerCase();
    const phone = cleanText(payload.phone, 100);
    const industry = cleanText(payload.industry, 100);
    const city = cleanText(payload.city, 200);
    const state = cleanText(payload.state, 100);
    const primaryGoal = cleanText(payload.primary_goal, 100);
    const howDidYouFindUs = cleanText(payload.how_did_you_find_us, 100) || 'other';
    const sourcePage = cleanText(payload.source_page, 500) || '/start';
    const sourceCampaign = cleanText(payload.source_campaign, 300);
    const sourceTool = cleanText(payload.source_tool, 200);
    const notes = cleanText(payload.notes, 2000);
    const websiteUrl = safeWebsiteUrl(cleanText(payload.website_url, 1000));

    const allowedGoals = new Set([
      'leads', 'visibility', 'consistency', 'content_video', 'replace_marketing',
    ]);
    const allowedSources = new Set([
      'google', 'facebook', 'youtube', 'referral', 'email', 'demo_tool', 'other',
    ]);

    if (
      !businessName
      || !fullName
      || !validEmail(email)
      || !industry
      || !city
      || !state
      || !allowedGoals.has(primaryGoal)
    ) {
      return Response.json({ error: 'Please complete the required trial information.' }, { status: 400 });
    }

    const slugBase = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'business';
    const slug = slugBase.slice(0, 80) + '-' + crypto.randomUUID().slice(0, 8);
    const goalMap: Record<string, string> = {
      leads: 'leads',
      visibility: 'visibility',
      consistency: 'retention',
      content_video: 'traffic',
      replace_marketing: 'leads',
    };

    const trial = await base44.asServiceRole.entities.TrialAccount.create({
      name: businessName,
      slug,
      full_name: fullName,
      email,
      phone,
      industry,
      location_city: city,
      location_state: state,
      website_url: websiteUrl,
      primary_goal: primaryGoal,
      how_did_you_find_us: allowedSources.has(howDidYouFindUs) ? howDidYouFindUs : 'other',
      source_page: sourcePage,
      source_tool: sourceTool,
      source_campaign: sourceCampaign,
      notes,
      trial_status: 'submitted',
      onboarding_status: 'submitted',
      intelligence_status: 'pending',
      weekly_plan_status: 'pending',
      provisioning_status: 'pending',
      trial_start_at: new Date().toISOString(),
      trial_end_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const businessProfile = await base44.asServiceRole.entities.BusinessProfile.create({
      business_name: businessName,
      business_slug: slug,
      website_url: websiteUrl,
      industry_slug: industry.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'general',
      city,
      state,
      primary_goal: goalMap[primaryGoal] || 'leads',
      status: 'active',
    });

    await base44.asServiceRole.entities.TrialAccount.update(trial.id, {
      business_profile_id: businessProfile.id,
      onboarding_status: 'business_profile_linked',
    });

    // Queue the existing protected provisioning pipeline. Its own admin/service
    // guard accepts this service invocation, while failures remain visible to
    // the NTA team without exposing implementation details to the visitor.
    void base44.asServiceRole.functions.invoke('onTrialSubmitted', { trial_id: trial.id })
      .catch((error: Error) => console.error('[submitPublicTrialSignup] provisioning queue failed:', error?.message || error));

    return Response.json({
      success: true,
      accepted: true,
      trial_id: trial.id,
      business_profile_id: businessProfile.id,
      provisioning_status: 'queued',
    });
  } catch (error) {
    console.error('[submitPublicTrialSignup] failed:', error?.message || error);
    return Response.json({ error: 'Unable to begin your trial right now.' }, { status: 500 });
  }
});

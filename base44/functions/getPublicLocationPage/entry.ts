import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

const TRUSTED_PUBLIC_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://app.newtechadvertising.com',
  'https://new-tech-advertising.base44.app',
]);
const REQUEST_WINDOW_MS = 15 * 60 * 1000;
const REQUEST_LIMIT = 60;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

function isTrustedPublicOrigin(req: Request) {
  const rawOrigin = req.headers.get('origin') || req.headers.get('referer');
  if (!rawOrigin) return false;
  try {
    return TRUSTED_PUBLIC_ORIGINS.has(new URL(rawOrigin).origin);
  } catch {
    return false;
  }
}

function isRateLimited(req: Request) {
  const key = String(
    req.headers.get('cf-connecting-ip')
    || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown',
  ).slice(0, 128);
  const now = Date.now();
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

function isSafeRoutePart(value: unknown) {
  return typeof value === 'string'
    && value.length > 0
    && value.length <= 100
    && /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(value);
}

function cityFromSlug(value: string) {
  return value
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function publicLocationPage(page: Record<string, unknown>) {
  return {
    service_slug: page.service_slug,
    city: page.city,
    state: page.state,
    state_code: page.state_code,
    url_slug: page.url_slug,
    canonical_path: page.canonical_path,
    title: page.title,
    meta_description: page.meta_description,
    h1: page.h1,
    intro_paragraph: page.intro_paragraph,
    service_overview: page.service_overview,
    local_market_context: page.local_market_context,
    local_examples: Array.isArray(page.local_examples) ? page.local_examples.slice(0, 24) : [],
    why_this_service_matters: page.why_this_service_matters,
    how_it_works: page.how_it_works,
    faq: page.faq,
    case_study_section: page.case_study_section,
    cta_primary: page.cta_primary,
    cta_primary_url: page.cta_primary_url,
    cta_secondary: page.cta_secondary,
    cta_secondary_url: page.cta_secondary_url,
    video_embed_url: page.video_embed_url,
    video_title: page.video_title,
    keywords: Array.isArray(page.keywords) ? page.keywords.slice(0, 30) : [],
    content_blocks: page.content_blocks,
  };
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    const trustedService = user?.role === 'admin' || user?.is_service === true;

    if (!trustedService && !isTrustedPublicOrigin(req)) {
      return Response.json({ error: 'Untrusted request origin' }, { status: 403 });
    }
    if (!trustedService) {
      const retryAfter = isRateLimited(req);
      if (retryAfter) {
        return Response.json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': String(retryAfter) } });
      }
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return Response.json({ error: 'Invalid request' }, { status: 400 });
    }
    const { service_slug, location_slug } = body as Record<string, unknown>;
    if (!isSafeRoutePart(service_slug) || !isSafeRoutePart(location_slug)) {
      return Response.json({ error: 'Invalid location request' }, { status: 400 });
    }

    const pages = await base44.asServiceRole.entities.LocationPage.filter({
      service_slug,
      city: cityFromSlug(location_slug),
      status: 'published',
    });
    const page = pages[0];
    if (!page) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }

    return Response.json({ page: publicLocationPage(page as unknown as Record<string, unknown>) });
  } catch {
    return Response.json({ error: 'Unable to load location page' }, { status: 500 });
  }
});

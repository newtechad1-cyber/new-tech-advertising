/**
 * generateCityServicePage
 * 
 * Generates a single city + service LocationPage using AI.
 * Can be called manually from the admin or triggered by automation.
 * 
 * Payload: { city, state, state_code, service_slug, service_label }
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import OpenAI from 'npm:openai';

const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') });

const SERVICE_META = {
  'streaming-tv-advertising': {
    label: 'Streaming TV Advertising',
    pillar_url: '/streaming-tv-advertising',
    tool_url: '/tools/tv-commercial-script-generator',
    cta_primary: 'Generate Your Free TV Script',
    cta_primary_url: '/tools/tv-commercial-script-generator',
    cta_secondary: 'Learn More',
    cta_secondary_url: '/streaming-tv-advertising',
  },
  'ada-website-compliance': {
    label: 'ADA Website Compliance',
    pillar_url: '/ada-website-compliance',
    tool_url: '/tools/ada-website-checker',
    cta_primary: 'Check Your Website Free',
    cta_primary_url: '/tools/ada-website-checker',
    cta_secondary: 'Learn More',
    cta_secondary_url: '/ada-website-compliance',
  },
  'hvac-marketing': {
    label: 'HVAC Marketing',
    pillar_url: '/industries/hvac',
    tool_url: '/start',
    cta_primary: 'Get Your Free Marketing Plan',
    cta_primary_url: '/start',
    cta_secondary: 'Learn More',
    cta_secondary_url: '/industries/hvac',
  },
  'small-business-marketing': {
    label: 'Small Business Marketing',
    pillar_url: '/growth-system',
    tool_url: '/start',
    cta_primary: 'Get Your Free Growth Plan',
    cta_primary_url: '/start',
    cta_secondary: 'See How It Works',
    cta_secondary_url: '/growth-system',
  },
  'restaurant-marketing': {
    label: 'Restaurant Marketing',
    pillar_url: '/industries/restaurants',
    tool_url: '/start',
    cta_primary: 'Get Your Free Restaurant Marketing Plan',
    cta_primary_url: '/start',
    cta_secondary: 'Learn More',
    cta_secondary_url: '/industries/restaurants',
  },
};

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const user = await base44.auth.me();
  if (user?.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { city, state, state_code, service_slug } = await req.json();

  if (!city || !state || !service_slug) {
    return Response.json({ error: 'city, state, and service_slug are required' }, { status: 400 });
  }

  const meta = SERVICE_META[service_slug] || {
    label: service_slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
    pillar_url: `/${service_slug}`,
    tool_url: '/start',
    cta_primary: 'Get Started',
    cta_primary_url: '/start',
    cta_secondary: 'Learn More',
    cta_secondary_url: `/${service_slug}`,
  };

  const url_slug = `${service_slug}-${city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
  const canonical_path = `/services/${service_slug}/${city.toLowerCase().replace(/\s+/g, '-')}`;

  // Check if already exists
  const existing = await base44.asServiceRole.entities.LocationPage.filter({ url_slug });
  if (existing.length > 0) {
    return Response.json({ success: true, page_id: existing[0].id, already_existed: true });
  }

  const prompt = `You are an expert local SEO content writer. Generate localized city landing page content for this combination:

Service: ${meta.label}
City: ${city}, ${state}

Return ONLY valid JSON (no markdown) matching this schema exactly:
{
  "title": "SEO-optimized page title (60 chars max)",
  "meta_description": "Meta description (155 chars max)",
  "h1": "Primary heading for the page",
  "intro_paragraph": "2-3 sentence intro mentioning the city and service (150-200 words)",
  "service_overview": "2-3 sentences explaining what ${meta.label} is and why it matters",
  "local_market_context": "2-3 sentences about ${city}'s business market and why ${meta.label} is relevant there",
  "why_this_service_matters": "2-3 sentences on why ${city} businesses specifically need this service",
  "how_it_works": "1-2 sentences on how NTA delivers the service",
  "local_examples": ["string", "string", "string"],
  "case_study_section": "A 2-3 sentence example of a local ${city} business using ${meta.label} with real-sounding results",
  "faq": [
    {"question": "city-specific question about ${meta.label}", "answer": "clear 2-sentence answer"},
    {"question": "another city-specific question", "answer": "clear 2-sentence answer"}
  ],
  "keywords": ["${service_slug} ${city.toLowerCase()}", "${city.toLowerCase()} ${meta.label.toLowerCase()}", "local ${service_slug.split('-').join(' ')} ${state.toLowerCase()}"]
}

local_examples should be 3 real industry types common in ${city} that would use ${meta.label}.
Make content feel genuinely local — reference neighborhoods, suburbs, or industries specific to ${city}.`;

  const aiRes = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a local SEO expert. Return only valid JSON.' },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
    max_tokens: 1500,
  });

  const content = JSON.parse(aiRes.choices[0].message.content);

  const page = await base44.asServiceRole.entities.LocationPage.create({
    service_slug,
    city,
    state,
    state_code: state_code || '',
    url_slug,
    canonical_path,
    title: content.title,
    meta_description: content.meta_description,
    h1: content.h1,
    intro_paragraph: content.intro_paragraph,
    service_overview: content.service_overview,
    local_market_context: content.local_market_context,
    why_this_service_matters: content.why_this_service_matters,
    how_it_works: content.how_it_works,
    local_examples: content.local_examples || [],
    case_study_section: content.case_study_section || '',
    faq: JSON.stringify(content.faq || []),
    keywords: content.keywords || [],
    cta_primary: meta.cta_primary,
    cta_primary_url: meta.cta_primary_url,
    cta_secondary: meta.cta_secondary,
    cta_secondary_url: meta.cta_secondary_url,
    status: 'published',
    generated_at: new Date().toISOString(),
    generated_by: 'generateCityServicePage',
  });

  console.log(`[generateCityServicePage] Created: ${url_slug} (id: ${page.id})`);

  return Response.json({
    success: true,
    page_id: page.id,
    url_slug,
    canonical_path,
    already_existed: false,
  });
});
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const payload = await req.json();
    const { service_slug, city, state, state_code, video_url } = payload;

    if (!service_slug || !city || !state || !state_code) {
      return Response.json(
        { error: 'service_slug, city, state, state_code required' },
        { status: 400 }
      );
    }

    // Generate slug
    const url_slug = `${service_slug}-${city.toLowerCase().replace(/\s+/g, '-')}`;
    const canonical_path = `/services/${service_slug}/${city.toLowerCase().replace(/\s+/g, '-')}`;

    // Check if page already exists
    const existing = await base44.entities.LocationPage.filter({
      service_slug,
      city,
      state,
    });

    if (existing.length > 0) {
      return Response.json({
        success: false,
        message: 'Location page already exists',
        page_id: existing[0].id,
      });
    }

    // Try to find LocalMarketIntel for better localization
    const localMarketIntel = await base44.entities.LocalMarketIntel.filter({
      city,
      state,
      industry_slug: getIndustrySlugForService(service_slug),
    });

    const marketIntelId = localMarketIntel.length > 0 ? localMarketIntel[0].id : null;

    // Generate page content using LLM
    const pageContent = await generatePageContent(
      service_slug,
      city,
      state,
      localMarketIntel.length > 0 ? localMarketIntel[0] : null
    );

    // Create location page
    const locationPage = await base44.entities.LocationPage.create({
      service_slug,
      city,
      state,
      state_code,
      url_slug,
      canonical_path,
      title: pageContent.title,
      meta_description: pageContent.meta_description,
      h1: pageContent.h1,
      intro_paragraph: pageContent.intro_paragraph,
      service_overview: pageContent.service_overview,
      local_market_context: pageContent.local_market_context,
      local_examples: pageContent.local_examples || [],
      why_this_service_matters: pageContent.why_this_service_matters,
      how_it_works: pageContent.how_it_works,
      faq: JSON.stringify(pageContent.faq || []),
      case_study_section: pageContent.case_study_section,
      cta_primary: getCTAForService(service_slug, 'primary').text,
      cta_primary_url: getCTAForService(service_slug, 'primary').url,
      cta_secondary: getCTAForService(service_slug, 'secondary').text,
      cta_secondary_url: getCTAForService(service_slug, 'secondary').url,
      video_embed_url: video_url || pageContent.video_url,
      video_title: pageContent.video_title,
      keywords: pageContent.keywords || [],
      status: 'published',
      generated_at: new Date().toISOString(),
      generated_by: 'programmatic-generator',
      local_market_intel_id: marketIntelId,
    });

    return Response.json({
      success: true,
      page_id: locationPage.id,
      url_slug,
      canonical_path,
      message: `Location page created: ${canonical_path}`,
    });
  } catch (error) {
    console.error('[generateLocationPage] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function getIndustrySlugForService(serviceSlug) {
  // Map service slugs to industry hints for LocalMarketIntel lookup
  const map = {
    'ada-website-compliance': 'general',
    'streaming-tv-advertising': 'general',
  };
  return map[serviceSlug] || 'general';
}

function getCTAForService(serviceSlug, type) {
  const ctas = {
    'ada-website-compliance': {
      primary: {
        text: 'Check Your Website Now',
        url: '/tools/ada-website-checker',
      },
      secondary: {
        text: 'Schedule Free Audit',
        url: '/book-call',
      },
    },
    'streaming-tv-advertising': {
      primary: {
        text: 'Start Your Campaign',
        url: '/streaming-tv-advertising',
      },
      secondary: {
        text: 'See Demo',
        url: '/demo',
      },
    },
  };

  return (
    ctas[serviceSlug]?.[type] || {
      text: 'Get Started',
      url: '/get-started',
    }
  );
}

async function generatePageContent(serviceSlug, city, state, localMarketIntel) {
  const serviceInfo = getServiceInfo(serviceSlug);

  // Build prompt for LLM
  const prompt = `Generate SEO-optimized location page content for:
  
Service: ${serviceInfo.name}
Location: ${city}, ${state}
Service Description: ${serviceInfo.description}

Generate a JSON response with:
{
  "title": "SEO title (60 chars max)",
  "meta_description": "Meta description (160 chars max)",
  "h1": "Main heading with location",
  "intro_paragraph": "2-3 sentences intro specific to ${city}",
  "service_overview": "Paragraph explaining what ${serviceInfo.name} is",
  "local_market_context": "Paragraph about ${city}'s market for this service",
  "local_examples": ["Industry 1", "Industry 2", "Industry 3"],
  "why_this_service_matters": "Paragraph on why this service matters in ${city}",
  "how_it_works": "Paragraph on how the service works",
  "faq": [
    {"question": "Q about ${serviceInfo.name} in ${city}", "answer": "Answer"}
  ],
  "case_study_section": "Short case study example",
  "video_title": "Suggested video title",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}

Make it specific to ${city}, ${state}. Include local market insights if available.
${localMarketIntel ? `Market context: ${JSON.stringify(localMarketIntel).slice(0, 500)}` : ''}`;

  try {
    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          meta_description: { type: 'string' },
          h1: { type: 'string' },
          intro_paragraph: { type: 'string' },
          service_overview: { type: 'string' },
          local_market_context: { type: 'string' },
          local_examples: { type: 'array', items: { type: 'string' } },
          why_this_service_matters: { type: 'string' },
          how_it_works: { type: 'string' },
          faq: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                question: { type: 'string' },
                answer: { type: 'string' },
              },
            },
          },
          case_study_section: { type: 'string' },
          video_title: { type: 'string' },
          keywords: { type: 'array', items: { type: 'string' } },
        },
      },
    });

    return response || getDefaultPageContent(serviceSlug, city, state);
  } catch (error) {
    console.error('[generatePageContent] LLM error:', error);
    return getDefaultPageContent(serviceSlug, city, state);
  }
}

function getServiceInfo(serviceSlug) {
  const services = {
    'ada-website-compliance': {
      name: 'ADA Website Compliance',
      description:
        'Professional website accessibility audits and remediation to protect against ADA lawsuits and improve usability for all visitors.',
    },
    'streaming-tv-advertising': {
      name: 'Streaming TV Advertising',
      description:
        'Local streaming TV campaigns on Hulu, Roku, Paramount+, and 30+ platforms targeted to your exact service area.',
    },
  };

  return services[serviceSlug] || { name: serviceSlug, description: '' };
}

function getDefaultPageContent(serviceSlug, city, state) {
  const service = getServiceInfo(serviceSlug);

  return {
    title: `${service.name} in ${city}, ${state}`,
    meta_description: `Professional ${service.name.toLowerCase()} services for businesses in ${city}, ${state}.`,
    h1: `${service.name} in ${city}, ${state}`,
    intro_paragraph: `Looking for ${service.name} in ${city}, ${state}? We help local businesses with professional ${service.name.toLowerCase()} solutions.`,
    service_overview: service.description,
    local_market_context: `${city} businesses need strong online presence and accessibility to compete effectively.`,
    local_examples: ['HVAC', 'Plumbing', 'Local Services'],
    why_this_service_matters: `${service.name} is critical for ${city} businesses to reach customers and protect their online presence.`,
    how_it_works: `Our ${service.name} process includes assessment, implementation, and ongoing support.`,
    faq: [
      {
        question: `What is ${service.name}?`,
        answer: service.description,
      },
      {
        question: `Why do I need ${service.name} in ${city}?`,
        answer: `${city} businesses benefit from professional ${service.name.toLowerCase()} to improve visibility and compliance.`,
      },
    ],
    case_study_section: `A local ${city} business improved their online presence using our ${service.name.toLowerCase()} services.`,
    video_title: `${service.name} for ${city} Businesses`,
    keywords: [
      `${service.name.toLowerCase()} ${city}`,
      `${service.name.toLowerCase()} ${state}`,
      `${city} ${service.name.toLowerCase()}`,
    ],
  };
}
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const SERVICE_LABELS = {
  'streaming-tv': 'Streaming TV Advertising',
  'local-seo': 'Local SEO',
  'ada-rebuild': 'ADA Website Compliance',
  'ai-social-media': 'AI Social Media Marketing',
  'video-marketing': 'Video Marketing',
  'website-rebuild': 'Website Rebuild',
  'hvac-marketing': 'HVAC Marketing',
  'plumbing-marketing': 'Plumbing Marketing',
  'small-business-marketing': 'Small Business Marketing',
};

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { service, industry, city, topic_override } = await req.json();

    const serviceLabel = SERVICE_LABELS[service] || service || 'Digital Marketing';
    const cityLine = city ? ` in ${city}` : '';
    const industryLine = industry ? ` for ${industry} businesses` : ' for local businesses';

    // Build topic
    let articleTopic = topic_override;
    if (!articleTopic) {
      if (city && industry) {
        articleTopic = `${serviceLabel} for ${industry} Businesses in ${city}`;
      } else if (city) {
        articleTopic = `${serviceLabel} in ${city}: A Local Business Guide`;
      } else if (industry) {
        articleTopic = `How ${industry} Businesses Use ${serviceLabel} to Generate More Leads`;
      } else {
        articleTopic = `Complete Guide to ${serviceLabel} for Small Businesses`;
      }
    }

    const slug = slugify(articleTopic);

    // Check for duplicate slug
    const existing = await base44.asServiceRole.entities.BlogPost.filter({ slug });
    if (existing.length > 0) {
      return Response.json({ error: 'Article with this slug already exists', slug }, { status: 409 });
    }

    // Generate article, video script, image prompt, and meta in parallel
    const [articleRes, videoRes, seoRes] = await Promise.all([
      base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `You are an SEO content writer for New Tech Advertising (NTA), a digital marketing platform for small businesses.

Write a 1,200–1,800 word SEO-optimized blog article in markdown format.

Topic: ${articleTopic}
Service focus: ${serviceLabel}
${industry ? `Industry: ${industry}` : ''}
${city ? `City/Location: ${city}` : ''}

Article structure (use ## for H2 headings, ### for H3):

## Introduction
Hook the reader with a relatable problem or statistic. Explain what this article covers.

## What Is ${serviceLabel}?
Clear explanation of the concept for a small business owner audience.

## Why ${industry || 'Local'} Businesses Use ${serviceLabel}
Key benefits with specific examples.

## How It Works
Explain the process or technology step-by-step.

## Benefits${industryLine}
3-5 specific, tangible benefits. Use bullet points.

${city ? `## ${serviceLabel}${cityLine}: Local Opportunity\nWhy this service matters specifically in ${city}. Mention local competition, market opportunity.` : ''}

## Common Questions (FAQ)
3-4 FAQ-style questions and answers that mirror common Google searches.

## Conclusion
Recap and clear call to action. Mention NTA and include: "Ready to get started? Visit newtechadvertising.com or call 641-420-8816 for a free strategy call."

Write naturally. Include the main keyword phrase 4-6 times. Do not use generic filler — be specific and practical.`,
      }),

      base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `Write a 30–60 second video script for a YouTube/social video about: "${articleTopic}"

Format:
HOOK (5 sec): One punchy opening line that grabs attention
PROBLEM (10 sec): Describe the pain point
SOLUTION (20 sec): Explain how ${serviceLabel} solves it
PROOF (10 sec): One quick stat or result example
CTA (5 sec): "Visit newtechadvertising.com or call 641-420-8816"

Keep it conversational and energetic. Short sentences.`,
      }),

      base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `Generate SEO metadata and an image prompt for this blog article: "${articleTopic}"

Return JSON:
{
  "seo_title": "60 char max SEO title",
  "meta_description": "150-160 char meta description including main keyword",
  "excerpt": "2-sentence teaser for the article listing page",
  "featured_image_prompt": "Detailed AI image generation prompt for a professional marketing/business visual",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`,
        response_json_schema: {
          type: 'object',
          properties: {
            seo_title: { type: 'string' },
            meta_description: { type: 'string' },
            excerpt: { type: 'string' },
            featured_image_prompt: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
          },
        },
      }),
    ]);

    const post = await base44.asServiceRole.entities.BlogPost.create({
      title: seoRes?.seo_title || articleTopic,
      slug,
      content: articleRes,
      excerpt: seoRes?.excerpt || '',
      meta_description: seoRes?.meta_description || '',
      featured_image_prompt: seoRes?.featured_image_prompt || '',
      video_script: videoRes,
      tags: seoRes?.tags || [],
      service,
      industry: industry || '',
      city: city || '',
      category: industry || serviceLabel,
      author: 'NTA Team',
      published_date: new Date().toISOString().split('T')[0],
      source: 'ai-generated',
      featured: false,
    });

    return Response.json({ success: true, post_id: post.id, slug, title: post.title });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
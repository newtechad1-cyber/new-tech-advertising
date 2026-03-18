import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const SERVICE_LABELS = {
  'streaming-tv': 'Streaming TV Advertising',
  'local-seo': 'Local SEO',
  'ada-rebuild': 'ADA Website Rebuild',
  'ai-social-media': 'AI Social Media Marketing',
  'video-marketing': 'Video Marketing',
  'website-rebuild': 'Website Rebuild',
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { case_study_id } = await req.json();
    if (!case_study_id) return Response.json({ error: 'case_study_id required' }, { status: 400 });

    const [cs] = await base44.asServiceRole.entities.CaseStudy.filter({ id: case_study_id });
    if (!cs) return Response.json({ error: 'Case study not found' }, { status: 404 });

    const serviceLabel = SERVICE_LABELS[cs.service_used] || cs.service_used;
    const context = `
Business: ${cs.business_name}
Industry: ${cs.industry}
City: ${cs.city}, ${cs.state}
Service: ${serviceLabel}
Problem: ${cs.problem}
Solution: ${cs.solution}
Results: ${cs.results}
Metrics: ${cs.metrics || 'not provided'}
`.trim();

    // Generate all content in parallel
    const [blogRes, scriptRes, socialRes, seoRes] = await Promise.all([
      base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `You are a marketing copywriter. Write a 1000–1500 word blog article based on this case study.

${context}

Title format: "How a ${cs.industry} Business in ${cs.city} Generated More Leads Using ${serviceLabel}"

Include these sections with ## headers:
## Background
## The Challenge
## Our Strategy
## Campaign Setup
## Results
## Lessons Learned
## Ready to Grow Your Business?

Write in a confident, results-focused tone. Be specific. End with a CTA to visit newtechadvertising.com or call 641-420-8816.`,
      }),

      base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `Write a 60–90 second video script for this case study.

${context}

Structure:
HOOK (5 sec): Start with "Most ${cs.industry} businesses struggle to stand out..."
STORY (30 sec): Tell the case study story briefly
RESULTS (20 sec): Highlight specific metrics
CALL TO ACTION (10 sec): "Your business could be the next success story. Visit newtechadvertising.com"

Format it as a clean script with labels for each section. Keep it conversational and punchy.`,
      }),

      base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `Generate 5 social media post ideas for this case study. Return as JSON array.

${context}

Each post object: { "caption": "...", "image_prompt": "...", "video_prompt": "..." }

Captions should be 1–3 lines, punchy, and lead with the result. Mix platforms (LinkedIn, Facebook, Instagram).
Image prompts describe a professional marketing graphic. Video prompts describe a 15-sec social video concept.

Return only the JSON array, no other text.`,
        response_json_schema: {
          type: 'object',
          properties: {
            posts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  caption: { type: 'string' },
                  image_prompt: { type: 'string' },
                  video_prompt: { type: 'string' },
                },
              },
            },
          },
        },
      }),

      base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `Generate SEO metadata for this case study page.

${context}

Return JSON: { "seo_title": "...", "meta_description": "..." }
- seo_title: 50–60 chars, include service + industry + city
- meta_description: 140–160 chars, include result metrics if available

Return only the JSON object.`,
        response_json_schema: {
          type: 'object',
          properties: {
            seo_title: { type: 'string' },
            meta_description: { type: 'string' },
          },
        },
      }),
    ]);

    const socialPosts = socialRes?.posts || [];

    await base44.asServiceRole.entities.CaseStudy.update(case_study_id, {
      blog_article: blogRes,
      video_script: scriptRes,
      social_posts: JSON.stringify(socialPosts),
      seo_title: seoRes?.seo_title || '',
      meta_description: seoRes?.meta_description || '',
      content_generated: true,
    });

    return Response.json({ success: true, message: 'Content generated successfully' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
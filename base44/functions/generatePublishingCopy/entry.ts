import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin' && user.is_service !== true) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { video, destinations } = await req.json();
    if (!video) return Response.json({ error: 'video is required' }, { status: 400 });

    const context = `
Title: "${video.title || 'Marketing Video'}"
Type: ${video.request_type || 'promotional'}
Industry: ${video.industry || 'general business'}
Goal: ${video.goal || 'promote the business'}
Brand: ${video.brand_name || ''}
Tagline: ${video.tagline || ''}
CTA: ${video.cta_text || video.cta || 'Contact us today'}
Website: ${video.website_url || ''}
Phone: ${video.phone || ''}
Transcript excerpt: ${video.transcript_text ? video.transcript_text.slice(0, 400) : ''}
`;

    const selectedKeys = Array.isArray(destinations) && destinations.length
      ? destinations.join(', ')
      : 'website, facebook, instagram, youtube, tiktok, gbp';

    const prompt = `Generate publishing copy for a branded marketing video. Write platform-native copy that sounds human, not AI.

Video details:
${context}

Generate copy for these platforms: ${selectedKeys}

Rules:
- website_title: SEO-friendly, 55-60 chars max, no clickbait
- website_summary: 1-2 sentence meta description, 150 chars max
- website_body: 2-3 sentence intro paragraph for the page
- facebook_caption: 1-3 sentences, conversational, 1-2 emojis max, include soft CTA
- instagram_caption: punchy opener, 2-4 sentences, 5-8 relevant hashtags on separate lines
- youtube_title: SEO optimized, include main keyword, 60 chars max
- youtube_description: 3-4 paragraphs, include timestamps placeholder, relevant keywords naturally, include CTA with contact info
- tiktok_caption: 1-2 sentences max, very casual tone, 3-5 trending hashtags
- gbp_post_text: 2-3 sentences, local business tone, clear action

Return JSON only, no explanation.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          website_title: { type: 'string' },
          website_summary: { type: 'string' },
          website_body: { type: 'string' },
          facebook_caption: { type: 'string' },
          instagram_caption: { type: 'string' },
          youtube_title: { type: 'string' },
          youtube_description: { type: 'string' },
          tiktok_caption: { type: 'string' },
          gbp_post_text: { type: 'string' },
        },
      },
    });

    return Response.json(result);
  } catch (error) {
    console.error('[generatePublishingCopy] Error:', error?.message || error);
    return Response.json({ error: 'Publishing copy generation failed' }, { status: 500 });
  }
});
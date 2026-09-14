import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin' && user.is_service !== true) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { video } = await req.json();
    if (!video) return Response.json({ error: 'video is required' }, { status: 400 });

    const prompt = `You are an expert video marketing strategist. Analyze this video and give specific production recommendations.

Video details:
- Title: "${video.title || 'Marketing Video'}"
- Type: ${video.request_type || 'promotional'}
- Goal: ${video.goal || 'promote the business'}
- Industry: ${video.industry || 'general business'}
- Target audience: ${video.audience || 'local consumers'}
- Current caption style: ${video.caption_style || 'not set'}
- Has logo: ${!!(video.primary_logo_url || video.watermark_logo_url)}
- CTA text: ${video.cta_text || 'not set'}

Respond in JSON with exactly these fields:
{
  "caption_style": one of: clean_minimal | bold_social | news_broadcast | promo_highlight,
  "caption_style_reason": "1 short sentence why",
  "aspect_ratio": one of: "Landscape 16:9" | "Square 1:1" | "Vertical 9:16",
  "aspect_ratio_reason": "1 short sentence why",
  "include_logo": true or false,
  "logo_reason": "1 short sentence why",
  "include_cta": true or false,
  "cta_reason": "1 short sentence why",
  "overall_tip": "One actionable production tip for this specific video type and industry"
}`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          caption_style: { type: 'string' },
          caption_style_reason: { type: 'string' },
          aspect_ratio: { type: 'string' },
          aspect_ratio_reason: { type: 'string' },
          include_logo: { type: 'boolean' },
          logo_reason: { type: 'string' },
          include_cta: { type: 'boolean' },
          cta_reason: { type: 'string' },
          overall_tip: { type: 'string' },
        },
      },
    });

    return Response.json(result);
  } catch (error) {
    console.error('[generateVideoRecommendations] Error:', error?.message || error);
    return Response.json({ error: 'Recommendation generation failed' }, { status: 500 });
  }
});
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin' && user.is_service !== true) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { client, topic } = await req.json();
    if (!client?.name) return Response.json({ error: 'client is required' }, { status: 400 });

    const prompt = `
You are a content strategist for a local business marketing agency.

Client: ${client.name}
Website: ${client.website || 'N/A'}
Services: ${client.services || 'general services'}
Keywords: ${client.target_keywords || 'local business'}
Topic: ${topic || 'general brand awareness and local visibility'}

Generate the following as a JSON object:
{
  "blog_article": "A full 600-800 word SEO-optimized blog article in markdown format",
  "video_script": "A 60-90 second HeyGen-compatible video script with scene directions in brackets",
  "social_facebook": "A Facebook post (150-200 words, engaging, with a CTA)",
  "social_linkedin": "A LinkedIn post (professional, 100-150 words)",
  "social_gbp": "A Google Business Profile post (75-100 words, local focus)",
  "image_prompts": "3 AI image generation prompts separated by newlines, each starting with 'Prompt:'"
}
`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          blog_article: { type: 'string' },
          video_script: { type: 'string' },
          social_facebook: { type: 'string' },
          social_linkedin: { type: 'string' },
          social_gbp: { type: 'string' },
          image_prompts: { type: 'string' },
        },
      },
    });

    return Response.json(result);
  } catch (error) {
    console.error('[generateContentPack] Error:', error?.message || error);
    return Response.json({ error: 'Content pack generation failed' }, { status: 500 });
  }
});
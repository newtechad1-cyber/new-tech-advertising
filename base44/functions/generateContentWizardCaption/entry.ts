import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin' && user.is_service !== true) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { title, client, topic } = await req.json();
    if (!title) return Response.json({ error: 'title is required' }, { status: 400 });

    const prompt = `Write social media captions for this video: "${title}". Client: ${client || 'local business'}.
${topic?.primary_keyword ? `Keyword: ${topic.primary_keyword}.` : ''}

Return JSON with:
- caption_primary: full caption (2-3 sentences + CTA)
- caption_short: under 100 chars version
- hashtags: 5-8 relevant hashtags as a single string`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          caption_primary: { type: 'string' },
          caption_short: { type: 'string' },
          hashtags: { type: 'string' },
        },
      },
    });

    return Response.json(result);
  } catch (error) {
    console.error('[generateContentWizardCaption] Error:', error?.message || error);
    return Response.json({ error: 'Caption generation failed' }, { status: 500 });
  }
});
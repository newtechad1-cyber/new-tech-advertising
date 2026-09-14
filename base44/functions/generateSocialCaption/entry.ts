import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin' && user.is_service !== true) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { image_context } = await req.json().catch(() => ({}));

    const prompt = `Write an engaging social media caption for a business image${
      image_context ? ` related to: ${image_context}` : ''
    }. Keep it concise, conversational, and include 3-5 relevant hashtags at the end. No quotation marks, just the caption text.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });

    return Response.json({ caption: typeof result === 'string' ? result : result?.text || '' });
  } catch (error) {
    console.error('[generateSocialCaption] Error:', error?.message || error);
    return Response.json({ error: 'Caption generation failed' }, { status: 500 });
  }
});
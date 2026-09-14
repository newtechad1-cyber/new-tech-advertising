import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin' && user.is_service !== true) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { title, client } = await req.json();
    if (!title) return Response.json({ error: 'title is required' }, { status: 400 });

    const prompt = `Write a detailed image generation prompt for a thumbnail/visual for this video: "${title}". Client: ${client || 'local business'}. Make it vivid, professional, and local-business appropriate. Return just the prompt text, no extra commentary.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });

    return Response.json({ prompt: typeof result === 'string' ? result : result?.text || '' });
  } catch (error) {
    console.error('[generateContentWizardImagePrompt] Error:', error?.message || error);
    return Response.json({ error: 'Image prompt generation failed' }, { status: 500 });
  }
});
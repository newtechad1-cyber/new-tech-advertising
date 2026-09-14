import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin' && user.is_service !== true) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { prompt } = await req.json();
    if (!prompt || !String(prompt).trim()) {
      return Response.json({ error: 'prompt is required' }, { status: 400 });
    }

    const result = await base44.asServiceRole.integrations.Core.GenerateImage({
      prompt: String(prompt),
    });

    return Response.json({ url: result.url });
  } catch (error) {
    console.error('[generateStudioImage] Error:', error?.message || error);
    return Response.json({ error: 'Image generation failed' }, { status: 500 });
  }
});
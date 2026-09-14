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

    const prompt = `Write a professional 60-90 second video script / voiceover transcript for a marketing video with these details:
Title: "${video.title || 'Marketing Video'}"
Type: ${video.request_type || 'promotional'}
Goal: ${video.goal || 'promote the business'}
Industry: ${video.industry || 'general business'}
Target audience: ${video.audience || 'local consumers'}
Offer: ${video.offer || ''}
CTA: ${video.cta || 'Contact us today'}

Write a natural, energetic, human-sounding voiceover transcript. Include natural pauses indicated with [pause] and emphasis with CAPS. Format it as running paragraphs. Do not add timestamps. Do not add headers.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });

    return Response.json({ transcript: typeof result === 'string' ? result : result?.text || '' });
  } catch (error) {
    console.error('[generateVideoTranscript] Error:', error?.message || error);
    return Response.json({ error: 'Transcript generation failed' }, { status: 500 });
  }
});
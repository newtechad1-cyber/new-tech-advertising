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

    const source = video.transcript_text || video.title || 'Marketing video content';

    const prompt = `Convert this video transcript into formatted caption blocks for a branded marketing video.

Transcript:
"${source}"

Caption requirements:
- Style: ${video.caption_style || 'clean_minimal'} (clean_minimal = lowercase subtle; bold_social = ALL CAPS punchy; news_broadcast = title case formal; promo_highlight = highlight key words)
- Position: ${video.caption_position || 'bottom'}
- Size: ${video.caption_size || 'medium'}
- Animation: ${video.caption_animation || 'none'}

Output format: one caption block per line, with approximate timestamp in [HH:MM:SS] format at the start of each line. Keep each caption to 6-8 words max. Be punchy and readable. Return only the caption lines, no headers or extra text.

Example output:
[00:00:00] Ready to grow your business?
[00:00:03] We help local companies win online.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });

    return Response.json({ captions: typeof result === 'string' ? result : result?.text || '' });
  } catch (error) {
    console.error('[generateVideoCaptions] Error:', error?.message || error);
    return Response.json({ error: 'Caption generation failed' }, { status: 500 });
  }
});
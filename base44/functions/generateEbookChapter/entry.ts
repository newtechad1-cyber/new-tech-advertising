import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin' && user.is_service !== true) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { ebook_title, chapter_number, chapter_title, notes } = await req.json();
    if (!chapter_title) {
      return Response.json({ error: 'chapter_title is required' }, { status: 400 });
    }

    const prompt = `Write a detailed, well-structured chapter for an ebook.
Ebook title: "${ebook_title || 'Untitled Ebook'}"
Chapter number: ${chapter_number || 1}
Chapter title: "${chapter_title}"
${notes ? `Additional notes/context: ${notes}` : ''}

Write a comprehensive chapter with an introduction, several sections with subheadings, practical tips or examples, and a conclusion. Format it in HTML using <h2>, <h3>, <p>, <ul>, <li> tags. Make it engaging and informative.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });

    return Response.json({ content: typeof result === 'string' ? result : result?.text || '' });
  } catch (error) {
    console.error('[generateEbookChapter] Error:', error?.message || error);
    return Response.json({ error: 'Chapter generation failed' }, { status: 500 });
  }
});
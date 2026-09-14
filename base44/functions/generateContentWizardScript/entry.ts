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

    const prompt = `Write a professional 60-second video script for: "${title}".
Client: ${client || 'local business'}.
${topic?.primary_keyword ? `Primary keyword: ${topic.primary_keyword}.` : ''}
${topic?.market ? `Market: ${topic.market}.` : ''}
${topic?.notes ? `Notes: ${topic.notes}` : ''}

Return a JSON object with these fields:
- script_long: full 60-second script (Hook → Problem → Solution → Proof → CTA format, conversational)
- script_short: 30-second version
- hook: opening 5 seconds only
- cta: closing call to action only`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          script_long: { type: 'string' },
          script_short: { type: 'string' },
          hook: { type: 'string' },
          cta: { type: 'string' },
        },
      },
    });

    return Response.json(result);
  } catch (error) {
    console.error('[generateContentWizardScript] Error:', error?.message || error);
    return Response.json({ error: 'Script generation failed' }, { status: 500 });
  }
});
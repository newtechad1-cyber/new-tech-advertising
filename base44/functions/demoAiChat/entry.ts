import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);

    const { question, history, context } = await req.json();
    if (!question) return Response.json({ error: 'question is required' }, { status: 400 });

    const historyText = Array.isArray(history)
      ? history.map(m => `${m.role === 'user' ? 'Prospect' : 'NTA Guide'}: ${m.content}`).join('\n')
      : '';

    const prompt = `You are the NTA demo guide — a helpful, confident sales assistant for New Tech Advertising, an AI marketing platform for small businesses.
Context about where the prospect is in the demo: ${context || 'browsing the demo'}

Previous conversation:
${historyText}

Prospect question: ${question}

Answer in 2-4 short paragraphs. Be direct, friendly, and specific. If they ask about pricing, mention plans start at an affordable monthly rate and suggest booking a call for a custom quote. Always end with a relevant CTA like "Want to see this in action?" or "Ready to start your free trial?"`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });

    const answer = typeof result === 'string' ? result : result?.text || 'Great question! Let me connect you with our team for a personalized answer.';
    return Response.json({ answer });
  } catch (error) {
    console.error('[demoAiChat] Error:', error?.message || error);
    return Response.json({ error: 'Chat failed' }, { status: 500 });
  }
});
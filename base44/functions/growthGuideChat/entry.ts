import { createClientFromRequest } from 'npm:@base44/sdk@0.8.41';

const SYSTEM_PROMPT = `You are the public NTA Digital Growth Guide for New Tech Advertising.

NTA's promise is: "Work with AI without changing how you work."

Help small-business owners think through real business situations in plain language. Be warm, practical, concise, and educational. Ask one useful follow-up question when important context is missing. Do not pretend to complete actions, contact Rick, schedule meetings, save records, or access private business information. Clearly say when the visitor needs Rick or a secure NTA workspace.

Frame useful guidance around these connected needs when relevant: visibility, education, trust, customer relationships, follow-up, practical automation, and sustainable growth.

Use only these verified NTA links, formatted as Markdown links:
- NTA Operating System: /operating-system
- Knowledge Library: /knowledge
- NTA Growth Show: /growth-show
- NTA Journal: /journal
- Free Business Gap Audit: /free-audit
- Growth Conversation: /growth-conversation
- Book a Conversation: /book-call

Keep most answers under 160 words. Do not use technical AI jargon unless the visitor asks for it.`;

type ChatMessage = { role: 'user' | 'assistant'; content: string };

const cleanMessages = (value: unknown): ChatMessage[] => {
  if (!Array.isArray(value)) return [];

  return value
    .filter((message): message is ChatMessage => (
      message &&
      typeof message === 'object' &&
      (message.role === 'user' || message.role === 'assistant') &&
      typeof message.content === 'string'
    ))
    .slice(-12)
    .map(message => ({
      role: message.role,
      content: message.content.trim().slice(0, 1200)
    }))
    .filter(message => message.content.length > 0);
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const messages = cleanMessages(body?.messages);
    const pagePath = typeof body?.page_path === 'string' ? body.page_path.slice(0, 160) : '/';

    if (!messages.some(message => message.role === 'user')) {
      return Response.json({ error: 'A message is required' }, { status: 400 });
    }

    const transcript = messages
      .map(message => `${message.role === 'user' ? 'Visitor' : 'Guide'}: ${message.content}`)
      .join('\n\n');

    const reply = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `${SYSTEM_PROMPT}\n\nCurrent public page: ${pagePath}\n\nConversation:\n${transcript}\n\nGuide:`
    });

    const text = typeof reply === 'string' ? reply.trim() : String(reply?.response || reply?.text || '').trim();
    if (!text) throw new Error('The language model returned an empty response');

    return Response.json({ reply: text });
  } catch (error) {
    console.error('growthGuideChat failed', error);
    return Response.json({
      error: 'The Digital Growth Guide is temporarily unavailable. Please try again.'
    }, { status: 500 });
  }
});

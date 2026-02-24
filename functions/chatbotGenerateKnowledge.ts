import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import OpenAI from 'npm:openai';

const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') || Deno.env.get('OpenAI') });

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { topic, context, category, client_id } = await req.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that creates clear, concise FAQ and knowledge base entries for business chatbots. Write in plain language that a chatbot can use to answer visitor questions.'
        },
        {
          role: 'user',
          content: `Create a knowledge base entry for this topic: "${topic}"${context ? `\n\nAdditional context: ${context}` : ''}\n\nFormat your response as:\nTITLE: [short title]\n\nCONTENT:\n[detailed content the chatbot should know]`
        }
      ],
      temperature: 0.6,
    });

    const text = completion.choices[0].message.content;
    const titleMatch = text.match(/TITLE:\s*(.+)/);
    const contentMatch = text.match(/CONTENT:\s*([\s\S]+)/);

    const title = titleMatch ? titleMatch[1].trim() : topic;
    const content = contentMatch ? contentMatch[1].trim() : text;

    // Save to knowledge base
    const entry = await base44.entities.ChatbotKnowledge.create({
      title,
      content,
      source_type: 'ai_generated',
      category: category || 'general',
      client_id: client_id || null,
    });

    return Response.json({ entry });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import OpenAI from 'npm:openai';

const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') || Deno.env.get('OpenAI') });

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { chatbot_id, messages, lead_data } = await req.json();

    if (!chatbot_id) {
      return Response.json({ error: 'chatbot_id is required' }, { status: 400 });
    }

    // Fetch chatbot config
    const chatbots = await base44.asServiceRole.entities.Chatbot.filter({ id: chatbot_id });
    const chatbot = chatbots[0];
    if (!chatbot) return Response.json({ error: 'Chatbot not found' }, { status: 404 });

    // Fetch knowledge base (global + client-specific)
    const allKnowledge = await base44.asServiceRole.entities.ChatbotKnowledge.list();
    const knowledge = allKnowledge.filter(k => !k.client_id || k.client_id === chatbot.client_id);
    
    const knowledgeText = knowledge.length > 0
      ? knowledge.map(k => `[${k.category || 'General'} - ${k.title}]\n${k.content}`).join('\n\n---\n\n')
      : '';

    const systemPrompt = `${chatbot.system_prompt || 'You are a helpful assistant.'}

${knowledgeText ? `\n\nKNOWLEDGE BASE:\n${knowledgeText}` : ''}

IMPORTANT RULES:
- Be helpful, friendly, and concise.
- If a visitor seems interested in services or wants to be contacted, politely ask for their name, email, phone, and business name.
- When you have collected their contact info, include at the END of your response EXACTLY this JSON block on its own line:
  LEAD_CAPTURED:{"name":"...","email":"...","phone":"...","business_name":"..."}
- Only include the LEAD_CAPTURED block once when you have all the info.
- Do not make up information not in the knowledge base.`;

    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...(messages || [])
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: chatMessages,
      temperature: 0.7,
    });

    let reply = completion.choices[0].message.content;
    let capturedLead = null;

    // Extract lead data if present
    const leadMatch = reply.match(/LEAD_CAPTURED:(\{[^}]+\})/);
    if (leadMatch) {
      try {
        capturedLead = JSON.parse(leadMatch[1]);
        reply = reply.replace(/LEAD_CAPTURED:\{[^}]+\}/, '').trim();
      } catch (_) { /* ignore parse errors */ }
    }

    // If lead_data was explicitly passed (from form), use that
    if (lead_data && lead_data.email) {
      capturedLead = lead_data;
    }

    // Save lead + trigger notifications
    if (capturedLead && capturedLead.email) {
      // Generate conversation summary
      const summaryCompletion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Summarize this chat conversation in 2-3 sentences focusing on what the visitor wants.' },
          ...chatMessages,
          { role: 'assistant', content: reply }
        ],
        max_tokens: 150,
      });
      const summary = summaryCompletion.choices[0].message.content;

      // Save lead to DB
      const savedLead = await base44.asServiceRole.entities.ChatbotLead.create({
        chatbot_id,
        name: capturedLead.name || '',
        email: capturedLead.email,
        phone: capturedLead.phone || '',
        business_name: capturedLead.business_name || '',
        conversation_summary: summary,
        status: 'new',
        crm_synced: false,
      });

      // Send email notification
      if (chatbot.escalation_email) {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: chatbot.escalation_email,
          subject: `New Lead from ${chatbot.name}: ${capturedLead.name || capturedLead.email}`,
          body: `A new lead was captured by your chatbot "${chatbot.name}".\n\n**Lead Details:**\n- Name: ${capturedLead.name || 'N/A'}\n- Email: ${capturedLead.email}\n- Phone: ${capturedLead.phone || 'N/A'}\n- Business: ${capturedLead.business_name || 'N/A'}\n\n**Conversation Summary:**\n${summary}\n\nLogin to your dashboard to follow up.`,
        });
      }

      // Send to CRM webhook
      const crmUrl = Deno.env.get('CRM_WEBHOOK_URL');
      if (crmUrl) {
        fetch(crmUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: 'chatbot',
            chatbot_id,
            chatbot_name: chatbot.name,
            lead: capturedLead,
            summary,
            captured_at: new Date().toISOString(),
          }),
        }).catch(() => {});

        // Mark as CRM synced
        await base44.asServiceRole.entities.ChatbotLead.update(savedLead.id, { crm_synced: true });
      }

      return Response.json({ reply, lead_captured: true, lead: capturedLead });
    }

    return Response.json({ reply, lead_captured: false });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
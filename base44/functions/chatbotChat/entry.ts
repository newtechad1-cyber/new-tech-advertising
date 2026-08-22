import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import OpenAI from 'npm:openai';

const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') || Deno.env.get('OpenAI') });
const TRUSTED_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://app.newtechadvertising.com',
  'https://new-tech-advertising.base44.app',
]);
const WINDOW_MS = 15 * 60 * 1000;
const LIMIT = 16;
const buckets = new Map();

function cleanText(value, max = 500) {
  return String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clientKey(req) {
  return String(
    req.headers.get('cf-connecting-ip')
      || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown'
  ).slice(0, 128);
}

function rateLimited(req) {
  const now = Date.now();
  const key = clientKey(req);
  let bucket = buckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + WINDOW_MS };
    buckets.set(key, bucket);
  }
  if (bucket.count >= LIMIT) return Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  bucket.count += 1;
  if (buckets.size > 3000) {
    for (const [bucketKey, item] of buckets) if (item.resetAt <= now) buckets.delete(bucketKey);
  }
  return 0;
}

function configuredOrigin(value) {
  try {
    const url = new URL(String(value || ''));
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.origin : null;
  } catch {
    return null;
  }
}

function trustedOrigin(req, chatbot) {
  const raw = req.headers.get('origin') || req.headers.get('referer');
  if (!raw) return false;
  try {
    const origin = new URL(raw).origin;
    return TRUSTED_ORIGINS.has(origin) || origin === configuredOrigin(chatbot.website_url);
  } catch {
    return false;
  }
}

function cleanMessages(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter(item => item && typeof item === 'object' && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string')
    .slice(-12)
    .map(item => ({ role: item.role, content: item.content.trim().slice(0, 1200) }))
    .filter(item => item.content);
}

function normaliseLead(value) {
  if (!value || Array.isArray(value) || typeof value !== 'object') return null;
  const email = cleanText(value.email, 320).toLowerCase();
  if (!validEmail(email)) return null;
  return {
    name: cleanText(value.name, 160),
    email,
    phone: cleanText(value.phone, 100),
    business_name: cleanText(value.business_name, 240),
  };
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return Response.json({ error: 'POST required' }, { status: 405 });

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    const trustedService = user?.role === 'admin' || user?.is_service === true;
    const declaredLength = Number(req.headers.get('content-length') || 0);
    if (declaredLength > 32000) return Response.json({ error: 'Request is too large' }, { status: 413 });

    const rawBody = await req.text();
    if (rawBody.length > 32000) return Response.json({ error: 'Request is too large' }, { status: 413 });

    let body;
    try {
      body = JSON.parse(rawBody || '{}');
    } catch {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }
    if (!body || Array.isArray(body) || typeof body !== 'object') {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const chatbotId = cleanText(body.chatbot_id, 128);
    if (!/^[A-Za-z0-9_-]{1,128}$/.test(chatbotId)) {
      return Response.json({ error: 'A valid chatbot_id is required' }, { status: 400 });
    }

    const chatbot = (await base44.asServiceRole.entities.Chatbot.filter({ id: chatbotId }))[0];
    if (!chatbot) return Response.json({ error: 'Chatbot not found' }, { status: 404 });
    if (!trustedService && (chatbot.status !== 'active' || !trustedOrigin(req, chatbot))) {
      return Response.json({ error: 'Untrusted chat request' }, { status: 403 });
    }
    if (!trustedService) {
      const retryAfter = rateLimited(req);
      if (retryAfter) {
        return Response.json(
          { error: 'Too many requests. Please try again shortly.' },
          { status: 429, headers: { 'Retry-After': String(retryAfter) } },
        );
      }
    }

    const messages = cleanMessages(body.messages);
    let capturedLead = normaliseLead(body.lead_data);
    if (!messages.some(item => item.role === 'user') && !capturedLead) {
      return Response.json({ error: 'A message or valid email address is required' }, { status: 400 });
    }

    const knowledgeText = (await base44.asServiceRole.entities.ChatbotKnowledge.list())
      .filter(item => !item.client_id || item.client_id === chatbot.client_id)
      .slice(0, 40)
      .map(item => '[' + cleanText(item.category || 'General', 120) + ' - ' + cleanText(item.title, 240) + ']\n' + cleanText(item.content, 5000))
      .join('\n\n---\n\n');

    const systemPrompt = [
      String(chatbot.system_prompt || 'You are a helpful assistant.').slice(0, 8000),
      knowledgeText ? 'KNOWLEDGE BASE:\n' + knowledgeText : '',
      'IMPORTANT RULES:\n- Be helpful, friendly, and concise.\n- If a visitor wants contact, ask for their name, email, phone, and business name.\n- When all details are collected, append exactly one JSON line: LEAD_CAPTURED:{"name":"...","email":"...","phone":"...","business_name":"..."}\n- For pricing or plans, link to /find-your-plan and mention the 90-second quiz.\n- Do not make up information not in the knowledge base.'
    ].filter(Boolean).join('\n\n');

    let reply = cleanText(chatbot.greeting_message || 'Thank you. How can we help?', 1000);
    const chatMessages = [{ role: 'system', content: systemPrompt }, ...messages];
    if (messages.some(item => item.role === 'user')) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: chatMessages,
        temperature: 0.7,
        max_tokens: 500,
      });
      reply = String(completion.choices?.[0]?.message?.content || '').trim();
      if (!reply) throw new Error('The language model returned an empty response');

      const match = reply.match(/LEAD_CAPTURED:(\{[^}]{1,2000}\})/);
      if (match) {
        try {
          capturedLead = normaliseLead(JSON.parse(match[1])) || capturedLead;
          reply = reply.replace(/LEAD_CAPTURED:\{[^}]{1,2000}\}/, '').trim();
        } catch {}
      }
    }

    if (!capturedLead) return Response.json({ reply: reply.slice(0, 4000), lead_captured: false });

    const summaryResult = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Summarize this chat conversation in 2-3 sentences focusing on what the visitor wants.' },
        ...chatMessages,
        { role: 'assistant', content: reply }
      ],
      max_tokens: 150,
    });
    const summary = String(summaryResult.choices?.[0]?.message?.content || 'Visitor requested follow-up.').trim();

    const savedLead = await base44.asServiceRole.entities.ChatbotLead.create({
      chatbot_id: chatbotId,
      name: capturedLead.name,
      email: capturedLead.email,
      phone: capturedLead.phone,
      business_name: capturedLead.business_name,
      conversation_summary: summary,
      status: 'new',
      crm_synced: false,
    });

    if (chatbot.escalation_email) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: chatbot.escalation_email,
        subject: 'New Lead from ' + cleanText(chatbot.name, 160) + ': ' + (capturedLead.name || capturedLead.email),
        body: 'Lead details:\n- Name: ' + (capturedLead.name || 'N/A') + '\n- Email: ' + capturedLead.email + '\n- Phone: ' + (capturedLead.phone || 'N/A') + '\n- Business: ' + (capturedLead.business_name || 'N/A') + '\n\nConversation summary:\n' + summary,
      });
    }

    const crmUrl = Deno.env.get('CRM_WEBHOOK_URL');
    if (crmUrl) {
      fetch(crmUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'chatbot',
          chatbot_id: chatbotId,
          chatbot_name: cleanText(chatbot.name, 160),
          lead: capturedLead,
          summary,
          captured_at: new Date().toISOString(),
        }),
      }).catch(() => {});
      await base44.asServiceRole.entities.ChatbotLead.update(savedLead.id, { crm_synced: true });
    }

    return Response.json({ reply: reply.slice(0, 4000), lead_captured: true, lead: capturedLead });
  } catch (error) {
    console.error('chatbotChat failed', error);
    return Response.json({ error: 'Unable to process this chat request right now.' }, { status: 500 });
  }
});

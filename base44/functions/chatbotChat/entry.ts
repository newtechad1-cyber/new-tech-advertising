import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import OpenAI from 'npm:openai';

const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') || Deno.env.get('OpenAI') });

const NTA_PUBLIC_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://app.newtechadvertising.com',
  'https://new-tech-advertising.base44.app',
]);
const REQUEST_WINDOW_MS = 15 * 60 * 1000;
const REQUEST_LIMIT = 16;
const MAX_BODY_LENGTH = 32000;
const requestBuckets = new Map();

function cleanField(value, maxLength = 500) {
  return String(value || '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function isPlausibleEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function requestOrigin(req) {
  const rawOrigin = req.headers.get('origin') || req.headers.get('referer');
  if (!rawOrigin) return null;

  try {
    return new URL(rawOrigin).origin;
  } catch {
    return null;
  }
}

function configuredOrigin(value) {
  try {
    const url = new URL(String(value || ''));
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.origin : null;
  } catch {
    return null;
  }
}

function isTrustedChatbotOrigin(req, chatbot) {
  const origin = requestOrigin(req);
  if (!origin) return false;
  return NTA_PUBLIC_ORIGINS.has(origin) || origin === configuredOrigin(chatbot.website_url);
}

function requestClientIdentity(req) {
  const forwarded = req.headers.get('cf-connecting-ip')
    || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown';

  return String(forwarded).slice(0, 128);
}

function isRateLimited(req) {
  const now = Date.now();
  const key = requestClientIdentity(req);
  let bucket = requestBuckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + REQUEST_WINDOW_MS };
    requestBuckets.set(key, bucket);
  }

  if (bucket.count >= REQUEST_LIMIT) {
    return Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  }

  bucket.count += 1;

  if (requestBuckets.size > 3000) {
    for (const [bucketKey, entry] of requestBuckets) {
      if (entry.resetAt <= now) requestBuckets.delete(bucketKey);
    }
  }

  return 0;
}

async function readJsonBody(req) {
  const contentLength = Number(req.headers.get('content-length') || 0);
  if (contentLength > MAX_BODY_LENGTH) {
    return { error: Response.json({ error: 'Request is too large' }, { status: 413 }) };
  }

  const rawBody = await req.text();
  if (rawBody.length > MAX_BODY_LENGTH) {
    return { error: Response.json({ error: 'Request is too large' }, { status: 413 }) };
  }

  let body;
  try {
    body = JSON.parse(rawBody || '{}');
  } catch {
    return { error: Response.json({ error: 'Invalid request body' }, { status: 400 }) };
  }

  if (!body || Array.isArray(body) || typeof body !== 'object') {
    return { error: Response.json({ error: 'Invalid request body' }, { status: 400 }) };
  }

  return { body };
}

function cleanMessages(value) {
  if (!Array.isArray(value)) return [];

  return value
    .filter(message => (
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
}

function normaliseLead(value) {
  if (!value || Array.isArray(value) || typeof value !== 'object') return null;

  const email = cleanField(value.email, 320).toLowerCase();
  if (!isPlausibleEmail(email)) return null;

  return {
    name: cleanField(value.name, 160),
    email,
    phone: cleanField(value.phone, 100),
    business_name: cleanField(value.business_name, 240),
  };
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    const trustedService = user?.role === 'admin' || user?.is_service === true;

    const parsed = await readJsonBody(req);
    if (parsed.error) return parsed.error;

    const chatbotId = cleanField(parsed.body.chatbot_id, 128);
    if (!/^[A-Za-z0-9_-]{1,128}$/.test(chatbotId)) {
      return Response.json({ error: 'A valid chatbot_id is required' }, { status: 400 });
    }

    const chatbots = await base44.asServiceRole.entities.Chatbot.filter({ id: chatbotId });
    const chatbot = chatbots[0];
    if (!chatbot) return Response.json({ error: 'Chatbot not found' }, { status: 404 });

    if (!trustedService && chatbot.status !== 'active') {
      return Response.json({ error: 'Chatbot is not available' }, { status: 403 });
    }
    if (!trustedService && !isTrustedChatbotOrigin(req, chatbot)) {
      return Response.json({ error: 'Untrusted request origin' }, { status: 403 });
    }
    if (!trustedService) {
      const retryAfterSeconds = isRateLimited(req);
      if (retryAfterSeconds) {
        return Response.json(
          { error: 'Too many requests. Please try again shortly.' },
          { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
        );
      }
    }

    const messages = cleanMessages(parsed.body.messages);
    let capturedLead = normaliseLead(parsed.body.lead_data);
    const hasVisitorMessage = messages.some(message => message.role === 'user');

    if (!hasVisitorMessage && !capturedLead) {
      return Response.json({ error: 'A message or valid email address is required' }, { status: 400 });
    }

    const allKnowledge = await base44.asServiceRole.entities.ChatbotKnowledge.list();
    const knowledgeText = allKnowledge
      .filter(item => !item.client_id || item.client_id === chatbot.client_id)
      .slice(0, 40)
      .map(item => '[' + cleanField(item.category || 'General', 120)
        + ' - ' + cleanField(item.title, 240) + ']\n'
        + cleanField(item.content, 5000))
      .join('\n\n---\n\n');

    const systemPrompt = [
      cleanField(chatbot.system_prompt || 'You are a helpful assistant.', 8000),
      knowledgeText ? 'KNOWLEDGE BASE:\n' + knowledgeText : '',
      'IMPORTANT RULES:\n- Be helpful, friendly, and concise.\n- If a visitor seems interested in services or wants to be contacted, politely ask for their name, email, phone, and business name.\n- When you have collected their contact info, include at the END of your response EXACTLY this JSON block on its own line:\n  LEAD_CAPTURED:{"name":"...","email":"...","phone":"...","business_name":"..."}\n- Only include the LEAD_CAPTURED block once when you have all the info.\n- If a user asks about pricing or plans, include a link to /find-your-plan and mention: "Take our 90-second quiz to get a personalized recommendation."\n- Do not make up information not in the knowledge base.'
    ].filter(Boolean).join('\n\n');

    const chatMessages = [{ role: 'system', content: systemPrompt }, ...messages];
    let reply = cleanField(chatbot.greeting_message || 'Thank you. How can we help?', 1000);

    if (hasVisitorMessage) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: chatMessages,
        temperature: 0.7,
        max_tokens: 500,
      });

      reply = String(completion.choices?.[0]?.message?.content || '').trim();
      if (!reply) throw new Error('The language model returned an empty response');

      const leadMatch = reply.match(/LEAD_CAPTURED:(\{[^}]{1,2000}\})/);
      if (leadMatch) {
        try {
          capturedLead = normaliseLead(JSON.parse(leadMatch[1])) || capturedLead;
          reply = reply.replace(/LEAD_CAPTURED:\{[^}]{1,2000}\}/, '').trim();
        } catch {
          // Ignore malformed model output and continue without a captured lead.
        }
      }
    }

    if (!capturedLead) {
      return Response.json({ reply: reply.slice(0, 4000), lead_captured: false });
    }

    const summary = hasVisitorMessage
      ? await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Summarize this chat conversation in 2-3 sentences focusing on what the visitor wants.' },
            ...chatMessages,
            { role: 'assistant', content: reply }
          ],
          max_tokens: 150,
        }).then(result => String(result.choices?.[0]?.message?.content || '').trim())
      : 'Visitor submitted contact details without a chat message.';

    const savedLead = await base44.asServiceRole.entities.ChatbotLead.create({
      chatbot_id: chatbotId,
      name: capturedLead.name,
      email: capturedLead.email,
      phone: capturedLead.phone,
      business_name: capturedLead.business_name,
      conversation_summary: summary || 'Visitor requested follow-up.',
      status: 'new',
      crm_synced: false,
    });

    if (chatbot.escalation_email) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: chatbot.escalation_email,
        subject: 'New Lead from ' + cleanField(chatbot.name, 160) + ': ' + (capturedLead.name || capturedLead.email),
        body: 'A new lead was captured by your chatbot "' + cleanField(chatbot.name, 160) + '".\n\n'
          + 'Lead Details:\n'
          + '- Name: ' + (capturedLead.name || 'N/A') + '\n'
          + '- Email: ' + capturedLead.email + '\n'
          + '- Phone: ' + (capturedLead.phone || 'N/A') + '\n'
          + '- Business: ' + (capturedLead.business_name || 'N/A') + '\n\n'
          + 'Conversation Summary:\n' + (summary || 'Visitor requested follow-up.') + '\n\n'
          + 'Login to your dashboard to follow up.',
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
          chatbot_name: cleanField(chatbot.name, 160),
          lead: capturedLead,
          summary: summary || 'Visitor requested follow-up.',
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

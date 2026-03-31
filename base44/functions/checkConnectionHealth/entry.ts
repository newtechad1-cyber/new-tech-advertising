import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const results = {};

  // ── 1. OpenAI ────────────────────────────────────────────────────────────────
  try {
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) throw new Error('OPENAI_API_KEY not set');
    const res = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${openaiKey}` },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error?.message || `HTTP ${res.status}`);
    }
    const data = await res.json();
    results.openai = {
      status: 'ok',
      message: `Connected — ${data.data?.length ?? '?'} models available`,
      latency_ms: null,
    };
  } catch (e) {
    results.openai = { status: 'error', message: e.message };
  }

  // ── 2. Meta (Facebook Graph API) ─────────────────────────────────────────────
  try {
    const token = Deno.env.get('META_PAGE_ACCESS_TOKEN') || Deno.env.get('META_USER_ACCESS_TOKEN');
    if (!token) throw new Error('META_PAGE_ACCESS_TOKEN not set');
    const res = await fetch(
      `https://graph.facebook.com/v19.0/me?fields=id,name&access_token=${token}`
    );
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    results.meta = {
      status: 'ok',
      message: `Connected as: ${data.name} (${data.id})`,
    };
  } catch (e) {
    results.meta = { status: 'error', message: e.message };
  }

  // ── 3. Email (Resend) ─────────────────────────────────────────────────────────
  try {
    const resendKey = Deno.env.get('RESEND_API_KEY');
    if (!resendKey) throw new Error('RESEND_API_KEY not set');
    const res = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${resendKey}` },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.message || `HTTP ${res.status}`);
    }
    const data = await res.json();
    const domains = data?.data || [];
    results.email = {
      status: 'ok',
      message: `Resend connected — ${domains.length} domain(s) configured`,
    };
  } catch (e) {
    results.email = { status: 'error', message: e.message };
  }

  // ── 4. CRM Webhook ────────────────────────────────────────────────────────────
  try {
    const webhookUrl = Deno.env.get('CRM_WEBHOOK_URL');
    if (!webhookUrl) throw new Error('CRM_WEBHOOK_URL not set');
    const t0 = Date.now();
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'health_check', timestamp: new Date().toISOString() }),
    });
    const latency = Date.now() - t0;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    results.crm_webhook = {
      status: 'ok',
      message: `Webhook responded in ${latency}ms`,
      latency_ms: latency,
    };
  } catch (e) {
    results.crm_webhook = { status: 'error', message: e.message };
  }

  return Response.json({ results, checked_at: new Date().toISOString() });
});
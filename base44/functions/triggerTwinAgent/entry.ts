import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const MAX_PAYLOAD_BYTES = 250_000;
const TWIN_HOST = 'build.twin.so';
const TWIN_WEBHOOK_PATH = /^\/triggers\/[a-zA-Z0-9-]+\/webhook$/;

function isAllowedTwinWebhook(value: unknown): value is string {
  if (typeof value !== 'string') return false;

  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      url.hostname === TWIN_HOST &&
      url.username === '' &&
      url.password === '' &&
      url.search === '' &&
      url.hash === '' &&
      TWIN_WEBHOOK_PATH.test(url.pathname)
    );
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { webhook_url, payload } = await req.json();
    if (!isAllowedTwinWebhook(webhook_url)) {
      return Response.json({ error: 'Invalid Twin webhook URL' }, { status: 400 });
    }

    const serializedPayload = JSON.stringify(payload ?? {});
    if (new TextEncoder().encode(serializedPayload).byteLength > MAX_PAYLOAD_BYTES) {
      return Response.json({ error: 'Twin payload is too large' }, { status: 413 });
    }

    const webhookKey = Deno.env.get('TWIN_WEBHOOK_KEY');
    if (!webhookKey) {
      return Response.json({ error: 'Twin webhook is not configured' }, { status: 503 });
    }

    const twinResponse = await fetch(webhook_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-NTA-KEY': webhookKey,
      },
      body: serializedPayload,
    });

    const result = await twinResponse.json().catch(() => ({}));
    if (!twinResponse.ok) {
      return Response.json(
        { error: `Twin webhook failed with status ${twinResponse.status}` },
        { status: 502 },
      );
    }

    return Response.json({ success: true, result });
  } catch (error) {
    console.error('[triggerTwinAgent] failed:', error);
    return Response.json({ error: 'Twin webhook request failed' }, { status: 500 });
  }
});

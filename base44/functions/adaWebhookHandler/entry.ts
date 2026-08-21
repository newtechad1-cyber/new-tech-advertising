import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin' && user.is_service !== true) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }
    const payload = await req.json();

    // Store event in database (optional - could create EventLog entity)
    console.log('ADA Event:', payload.event, 'Lead ID:', payload.lead_id);

    // Forward to CRM
    const crmEndpoint = Deno.env.get('CRM_EVENT_ENDPOINT');
    if (crmEndpoint) {
      try {
        await fetch(crmEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        console.log('Event forwarded to CRM');
      } catch (crmError) {
        console.error('CRM webhook failed:', crmError);
      }
    }

    // Forward to Agent
    const agentWebhook = Deno.env.get('AGENT_WEBHOOK_URL');
    const agentKey = Deno.env.get('AGENT_WEBHOOK_KEY');
    if (agentWebhook && agentKey) {
      try {
        await fetch(agentWebhook, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-AGENT-KEY': agentKey
          },
          body: JSON.stringify({
            source: 'base44',
            site: 'newtechadvertising.com',
            event: payload.event,
            ts: new Date().toISOString(),
            data: payload
          })
        });
        console.log('Event forwarded to Agent');
      } catch (agentError) {
        console.error('Agent webhook failed:', agentError);
      }
    }

    return Response.json({ 
      success: true,
      event: payload.event,
      forwarded: {
        crm: !!crmEndpoint,
        agent: !!agentWebhook
      }
    });

  } catch (error) {
    console.error('Webhook handler error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
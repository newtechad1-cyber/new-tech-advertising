import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { lead_id } = await req.json();

    const leads = await base44.asServiceRole.entities.AdaLead.filter({ id: lead_id });
    if (leads.length === 0) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    const lead = leads[0];

    // Send webhook to CRM
    const webhookPayload = {
      event: 'onboarding_completed',
      timestamp: new Date().toISOString(),
      source: 'newtechadvertising.com',
      page: 'AdaOnboarding',
      lead_id: lead_id,
      package: lead.package,
      contact: {
        name: lead.full_name,
        business: lead.business_name,
        email: lead.email,
        phone: lead.phone
      }
    };

    const crmWebhookUrl = Deno.env.get('CRM_WEBHOOK_URL');
    const agentWebhookUrl = Deno.env.get('AGENT_WEBHOOK_URL');

    const webhookPromises = [];
    
    if (crmWebhookUrl) {
      webhookPromises.push(
        fetch(crmWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload)
        })
      );
    }

    if (agentWebhookUrl) {
      webhookPromises.push(
        fetch(agentWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload)
        })
      );
    }

    if (webhookPromises.length > 0) {
      await Promise.all(webhookPromises.map(p => 
        p.catch(err => console.error('Webhook failed:', err))
      ));
    }

    // Notify Rick
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'rick@newtechadvertising.com',
      subject: `Onboarding Complete: ${lead.business_name}`,
      body: `${lead.full_name} has completed onboarding for ${lead.business_name}.

Package: ${lead.package}
Lead ID: ${lead_id}

Ready to start remediation.

View lead: https://newtechadvertising.com/dashboard`
    });

    return Response.json({ success: true });

  } catch (error) {
    console.error('Onboarding complete webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
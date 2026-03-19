import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { lead_id, call_date, call_time, call_type } = await req.json();

    const leads = await base44.asServiceRole.entities.AdaLead.filter({ id: lead_id });
    if (leads.length === 0) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    const lead = leads[0];

    // Send webhook to CRM and Agent
    const webhookPayload = {
      event: 'call_booked',
      timestamp: new Date().toISOString(),
      source: 'newtechadvertising.com',
      page: 'AdaCallBooking',
      lead_id: lead_id,
      package: lead.package,
      call_details: {
        date: call_date,
        time: call_time,
        type: call_type || 'consultation'
      },
      contact: {
        name: lead.full_name,
        business: lead.business_name,
        email: lead.email,
        phone: lead.phone,
        website: lead.website_url
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
        }).catch(err => console.error('CRM webhook failed:', err))
      );
    }

    if (agentWebhookUrl) {
      webhookPromises.push(
        fetch(agentWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload)
        }).catch(err => console.error('Agent webhook failed:', err))
      );
    }

    if (webhookPromises.length > 0) {
      await Promise.all(webhookPromises);
    }

    // Notify Rick
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'rick@newtechadvertising.com',
      subject: `Call Booked: ${lead.business_name}`,
      body: `${lead.full_name} has booked a call.

Business: ${lead.business_name}
Date: ${call_date}
Time: ${call_time}
Type: ${call_type || 'consultation'}

Contact: ${lead.phone} / ${lead.email}`
    });

    return Response.json({ success: true });

  } catch (error) {
    console.error('Call booking webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
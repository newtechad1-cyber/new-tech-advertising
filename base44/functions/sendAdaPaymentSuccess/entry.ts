import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { lead_id, onboarding_link } = await req.json();

    const leads = await base44.asServiceRole.entities.AdaLead.filter({ id: lead_id });
    if (leads.length === 0) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    const lead = leads[0];
    const firstName = lead.full_name.split(' ')[0];
    const onboardingUrl = onboarding_link || `https://newtechadvertising.com/ada-onboarding?lead_id=${lead_id}`;

    // Update lead status
    await base44.asServiceRole.entities.AdaLead.update(lead_id, {
      status: 'paid'
    });

    // Send webhook to CRM and Agent
    const webhookPayload = {
      event: 'payment_success',
      timestamp: new Date().toISOString(),
      source: 'newtechadvertising.com',
      page: 'AdaPayment',
      lead_id: lead_id,
      package: lead.package,
      setup_price: lead.setup_price,
      monthly_price: lead.monthly_price,
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

    // Send email
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'Rick - New Tech Advertising',
      to: lead.email,
      subject: `You're in — onboarding for ${lead.package}`,
      body: `Hi ${firstName},

You're all set. Payment received ✅

Please complete onboarding here so we can start remediation:
${onboardingUrl}

After you submit, we'll:
• Confirm priority pages
• Begin fixes
• Schedule verification review

— Rick
New Tech Advertising
641-420-8816
rick@newtechadvertising.com`
    });

    // SMS
    const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioFrom = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (twilioSid && twilioToken && twilioFrom && lead.phone) {
      const smsBody = `Payment received ✅ Please complete onboarding so we can start: ${onboardingUrl}`;
      
      try {
        const twilioAuth = btoa(`${twilioSid}:${twilioToken}`);
        await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${twilioAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            To: lead.phone,
            From: twilioFrom,
            Body: smsBody
          })
        });
      } catch (smsError) {
        console.error('SMS send failed:', smsError);
      }
    }

    return Response.json({ success: true, message: 'Payment success notification sent' });

  } catch (error) {
    console.error('Send payment success error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
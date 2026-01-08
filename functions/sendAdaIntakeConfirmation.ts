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
    const firstName = lead.full_name.split(' ')[0];

    // Send email
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'Rick - New Tech Advertising',
      to: lead.email,
      subject: 'We received your ADA request — next steps',
      body: `Hi ${firstName},

Thanks for requesting an ADA accessibility review for ${lead.business_name}.

Next step: we'll run an accessibility scan and review key risk areas based on your website: ${lead.website_url}.

Within 1 business day, you'll receive:
• A prioritized list of high-risk issues
• Recommended remediation approach
• A clear quote (setup + monthly if applicable)

If you'd like to speed things up, reply with:
• Any recent website changes
• Whether you accept online bookings/payments
• Your top 3 most important pages

— Rick
New Tech Advertising
641-420-8816
rick@newtechadvertising.com`
    });

    // SMS notification (requires Twilio or SMS provider setup)
    // Placeholder for SMS - configure TWILIO_* env vars to enable
    const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioFrom = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (twilioSid && twilioToken && twilioFrom && lead.phone) {
      const smsBody = `Hi ${firstName} — it's Rick at New Tech Advertising. Got your ADA request for ${lead.business_name}. We'll review ${lead.website_url} and send your prioritized issues + quote within 1 business day.`;
      
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

    return Response.json({ success: true, message: 'Confirmation sent' });

  } catch (error) {
    console.error('Send confirmation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
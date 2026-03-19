import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { lead_id, stripe_link } = await req.json();

    const leads = await base44.asServiceRole.entities.AdaLead.filter({ id: lead_id });
    if (leads.length === 0) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    const lead = leads[0];
    const firstName = lead.full_name.split(' ')[0];
    const monthlyText = lead.monthly_price > 0 ? `\nMonthly monitoring: $${lead.monthly_price}/mo` : '';

    // Send email
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'Rick - New Tech Advertising',
      to: lead.email,
      subject: `Your ADA accessibility quote for ${lead.business_name}`,
      body: `Hi ${firstName},

Based on your site review, your recommended package is:

${lead.package} Package
Setup: $${lead.setup_price}${monthlyText}

What you'll get:
• Accessibility remediation plan
• Priority fixes
• Verification review${lead.monthly_price > 0 ? '\n• Ongoing monitoring' : ''}

To get started, use this secure link:
${stripe_link || 'https://newtechadvertising.com/ada-quote?lead_id=' + lead_id}

Questions? Reply here or call/text me at 641-420-8816.

— Rick
New Tech Advertising
rick@newtechadvertising.com`
    });

    // SMS
    const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioFrom = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (twilioSid && twilioToken && twilioFrom && lead.phone) {
      const monthlyShort = lead.monthly_price > 0 ? ` + $${lead.monthly_price}/mo` : '';
      const smsBody = `Your ADA quote is ready: ${lead.package} — Setup $${lead.setup_price}${monthlyShort}. Start here: ${stripe_link || 'https://newtechadvertising.com'}`;
      
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

    return Response.json({ success: true, message: 'Quote notification sent' });

  } catch (error) {
    console.error('Send quote error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
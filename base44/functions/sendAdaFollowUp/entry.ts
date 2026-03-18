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

    // Send email
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'Rick - New Tech Advertising',
      to: lead.email,
      subject: 'Quick follow-up on your ADA request',
      body: `Hi ${firstName},

Just checking in — do you want to move forward with your ADA fixes and monitoring?

If yes, here's your start link again:
${stripe_link || 'https://newtechadvertising.com/ada-quote?lead_id=' + lead_id}

If not, tell me "later" and I'll follow up next month.

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
      const smsBody = `Quick follow-up — want to proceed with ADA fixes? Start here: ${stripe_link || 'https://newtechadvertising.com'} (or reply "later")`;
      
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

    return Response.json({ success: true, message: 'Follow-up sent' });

  } catch (error) {
    console.error('Send follow-up error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
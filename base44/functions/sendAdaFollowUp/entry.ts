import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const TRUSTED_APP_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://app.newtechadvertising.com',
]);
const TRUSTED_STRIPE_HOSTS = new Set(['checkout.stripe.com', 'buy.stripe.com']);

function trustedQuoteLink(leadId, candidate) {
  const safeLeadId = String(leadId || '').trim();
  const fallback = `https://newtechadvertising.com/ada-quote?lead_id=${encodeURIComponent(safeLeadId)}`;
  const raw = String(candidate || '').trim();
  if (!raw) return fallback;

  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || url.username || url.password) return fallback;

    const hostname = url.hostname.toLowerCase();
    if (TRUSTED_STRIPE_HOSTS.has(hostname)) return url.toString();
    if (!TRUSTED_APP_ORIGINS.has(url.origin)) return fallback;
    if (!['/ada-quote', '/ada/quote'].includes(url.pathname)) return fallback;
    if (url.searchParams.get('lead_id') !== safeLeadId) return fallback;
    return url.toString();
  } catch {
    return fallback;
  }
}

function isAdminUser(user) {
  const adminEmails = String(Deno.env.get('ADMIN_EMAILS') || '')
    .split(',')
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(
    user &&
    (user.role === 'admin' || adminEmails.includes(String(user.email || '').toLowerCase()))
  );
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (!isAdminUser(user)) return Response.json({ error: 'Admin access required' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const lead_id = String(body?.lead_id || '').trim();
    const stripe_link = body?.stripe_link;

    if (!/^[A-Za-z0-9_-]{1,128}$/.test(lead_id)) {
      return Response.json({ error: 'Invalid lead_id' }, { status: 400 });
    }

    const leads = await base44.asServiceRole.entities.AdaLead.filter({ id: lead_id });
    if (leads.length === 0) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    const lead = leads[0];
    const firstName = String(lead.full_name || 'there').trim().split(/\s+/)[0] || 'there';
    const safeLink = trustedQuoteLink(lead_id, stripe_link);

    // Send email
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'Rick - New Tech Advertising',
      to: lead.email,
      subject: 'Quick follow-up on your ADA request',
      body: `Hi ${firstName},

Just checking in — do you want to move forward with your ADA fixes and monitoring?

If yes, here's your start link again:
${safeLink}

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
      const smsBody = `Quick follow-up — want to proceed with ADA fixes? Start here: ${safeLink} (or reply "later")`;
      
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
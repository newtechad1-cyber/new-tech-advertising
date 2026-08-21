import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const TRUSTED_APP_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://app.newtechadvertising.com',
]);
const TRUSTED_STRIPE_HOSTS = new Set(['checkout.stripe.com', 'buy.stripe.com']);

function isAdminUser(user) {
  const adminEmails = String('' || '')
    .split(',')
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(
    user &&
    (user.role === 'admin' || adminEmails.includes(String(user.email || '').toLowerCase()))
  );
}

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

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isAdminUser(user)) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { lead_id: leadId, stripe_link: candidateLink } = await req.json().catch(() => ({}));
    if (!/^[A-Za-z0-9_-]{1,128}$/.test(String(leadId || ''))) {
      return Response.json({ error: 'Invalid lead_id' }, { status: 400 });
    }

    const leads = await base44.asServiceRole.entities.AdaLead.filter({ id: leadId });
    if (leads.length === 0) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    const lead = leads[0];
    const firstName = String(lead.full_name || 'there').trim().split(/\s+/)[0] || 'there';
    const monthlyText = Number(lead.monthly_price) > 0 ? `\nMonthly monitoring: $${lead.monthly_price}/mo` : '';
    const safeLink = trustedQuoteLink(leadId, candidateLink);

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
• Verification review${Number(lead.monthly_price) > 0 ? '\\n• Ongoing monitoring' : ''}

To get started, use this secure link:
${safeLink}

Questions? Reply here or call/text me at 641-420-8816.

— Rick
New Tech Advertising
rick@newtechadvertising.com`
    });

    const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioFrom = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (twilioSid && twilioToken && twilioFrom && lead.phone) {
      const monthlyShort = Number(lead.monthly_price) > 0 ? ` + $${lead.monthly_price}/mo` : '';
      const smsBody = `Your ADA quote is ready: ${lead.package} — Setup $${lead.setup_price}${monthlyShort}. Start here: ${safeLink}`;

      try {
        const twilioAuth = btoa(`${twilioSid}:${twilioToken}`);
        await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${twilioAuth}`,
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
    return Response.json({ error: 'Unable to send quote notification' }, { status: 500 });
  }
});

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import { Resend } from 'npm:resend@2.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const BOOKING_LINK = 'https://calendar.app.google/p6ieYanvwhixXxZ67';

function replaceMergeTags(text, lead) {
  return text
    .replace(/\{\{first_name\}\}/gi, lead.name || 'there')
    .replace(/\{\{business_name\}\}/gi, lead.business_name || 'your business')
    .replace(/\{\{audit_link\}\}/gi, lead.audit_link || '#')
    .replace(/\{\{demo_link\}\}/gi, lead.demo_link || '#')
    .replace(/\{\{booking_link\}\}/gi, BOOKING_LINK);
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { campaign_type, name, email, business_name, audit_link, demo_link, day } = await req.json();
  const sendDay = day ?? 0;

  // Fetch all emails for this campaign
  const templates = await base44.asServiceRole.entities.EmailTemplate.filter(
    { type: campaign_type },
    'sequence_day'
  );

  const emailsToSend = templates.filter(t => t.sequence_day === sendDay);
  if (emailsToSend.length === 0) {
    return Response.json({ error: `No email found for day ${sendDay}` }, { status: 404 });
  }

  const lead = { name, email, business_name, audit_link, demo_link };
  const template = emailsToSend[0];

  const subject = replaceMergeTags(template.subject || '', lead);
  const html = replaceMergeTags(template.body || '', lead);

  const result = await resend.emails.send({
    from: 'New Tech Advertising <rick@newtechadvertising.com>',
    to: email,
    subject,
    html,
  });

  return Response.json({ success: true, email_id: result?.data?.id, day: sendDay, template_name: template.name });
});
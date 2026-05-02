import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const body = await req.json();
  const { client_id, campaign_id, name, phone, email, service_needed, source_page, source_campaign } = body;

  if (!client_id) return Response.json({ error: 'client_id required' }, { status: 400 });

  // Create Lead record
  const lead = await base44.asServiceRole.entities.Lead.create({
    client_id,
    campaign_id: campaign_id || '',
    name: name || '',
    phone: phone || '',
    email: email || '',
    service_needed: service_needed || '',
    source_page: source_page || '',
    source_campaign: source_campaign || '',
    status: 'new',
  });

  // Create immediate FollowUp task
  const followUpDate = new Date();
  followUpDate.setHours(followUpDate.getHours() + 2);

  await base44.asServiceRole.entities.FollowUp.create({
    lead_id: lead.id,
    client_id,
    type: 'call',
    message: `New lead from ${source_page || 'website'}. Name: ${name || 'Unknown'}, Phone: ${phone || 'N/A'}, Service: ${service_needed || 'N/A'}. Call within 2 hours.`,
    scheduled_date: followUpDate.toISOString(),
    status: 'scheduled',
  });

  // Notify Rick
  await base44.asServiceRole.integrations.Core.SendEmail({
    to: 'rick@newtechadvertising.com',
    subject: `New Lead: ${name || 'Unknown'} — ${service_needed || 'Service Request'}`,
    body: `A new lead has been submitted.\n\nName: ${name || 'N/A'}\nPhone: ${phone || 'N/A'}\nEmail: ${email || 'N/A'}\nService Needed: ${service_needed || 'N/A'}\nSource: ${source_page || 'N/A'}\nCampaign: ${source_campaign || 'N/A'}\n\nFollow up within 2 hours for best conversion.`,
  });

  // Notify client if they have an email
  const clients = await base44.asServiceRole.entities.Client.filter({ id: client_id });
  const client = clients[0];
  if (client?.email) {
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: client.email,
      subject: `New Lead for ${client.business_name}: ${name || 'Unknown'}`,
      body: `You have a new lead from your website.\n\nName: ${name || 'N/A'}\nPhone: ${phone || 'N/A'}\nEmail: ${email || 'N/A'}\nService: ${service_needed || 'N/A'}\n\nFollow up as soon as possible!`,
    });
  }

  // Send confirmation to the lead if email provided
  if (email) {
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: email,
      subject: `We received your request — ${client?.business_name || 'Your Local Service Pro'}`,
      body: `Hi ${name || 'there'},\n\nThank you for reaching out! We received your request for ${service_needed || 'service'} and will be in touch shortly.\n\nExpect a call or text within the next few hours.\n\nThanks,\n${client?.business_name || 'Your Service Team'}`,
    });
  }

  return Response.json({
    success: true,
    lead_id: lead.id,
    message: "Thanks! We received your request and will be in touch within a few hours.",
  });
});
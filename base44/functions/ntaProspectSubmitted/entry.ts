import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const body = await req.json();
  const { business_name, contact_name, website, phone } = body;

  if (!business_name) {
    return Response.json({ error: 'business_name is required' }, { status: 400 });
  }

  // 1. Create Prospect record
  const prospect = await base44.asServiceRole.entities.Prospect.create({
    business_name,
    contact_name: contact_name || '',
    phone: phone || '',
    website: website || '',
    status: 'new',
    audit_status: 'requested',
    notes: `Gap Audit request submitted on ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}`,
  });

  // 2. Create linked GapAudit record
  await base44.asServiceRole.entities.GapAudit.create({
    prospect_id: prospect.id,
    website_url: website || '',
    status: 'draft',
  });

  // 3. Send email notification to Rick
  await base44.asServiceRole.integrations.Core.SendEmail({
    to: 'rick@newtechadvertising.com',
    subject: `🔔 New Gap Audit Request — ${business_name}`,
    body: `A new Gap Audit request just came in.\n\n` +
      `Business: ${business_name}\n` +
      `Contact: ${contact_name || 'N/A'}\n` +
      `Phone: ${phone || 'N/A'}\n` +
      `Website: ${website || 'N/A'}\n` +
      `Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}\n\n` +
      `Review it at: https://newtechadvertising.com/ops/audits`,
  });

  return Response.json({
    success: true,
    prospect_id: prospect.id,
  });
});
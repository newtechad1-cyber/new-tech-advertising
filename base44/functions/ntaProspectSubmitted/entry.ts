import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const body = await req.json();
  const { business_name, contact_name, email, phone, website, industry, city, notes } = body;

  if (!business_name) {
    return Response.json({ error: 'business_name is required' }, { status: 400 });
  }

  // Create Prospect record
  const prospect = await base44.asServiceRole.entities.Prospect.create({
    business_name,
    contact_name: contact_name || '',
    email: email || '',
    phone: phone || '',
    website: website || '',
    industry: industry || '',
    city: city || '',
    notes: notes || '',
    status: 'new',
    audit_status: 'requested',
  });

  // Create GapAudit record in draft status
  await base44.asServiceRole.entities.GapAudit.create({
    prospect_id: prospect.id,
    website_url: website || '',
    status: 'draft',
  });

  // Notify Rick via email
  await base44.asServiceRole.integrations.Core.SendEmail({
    to: 'rick@newtechadvertising.com',
    subject: `New Prospect Submitted: ${business_name}`,
    body: `A new prospect has submitted a gap audit request.\n\nBusiness: ${business_name}\nContact: ${contact_name || 'N/A'}\nEmail: ${email || 'N/A'}\nPhone: ${phone || 'N/A'}\nWebsite: ${website || 'N/A'}\nCity: ${city || 'N/A'}\nIndustry: ${industry || 'N/A'}\n\nLog in to review and build the Gap Audit.`,
  });

  return Response.json({
    success: true,
    prospect_id: prospect.id,
    message: "Thank you! We received your request and will have your free Gap Audit ready within 24 hours. We'll reach out to walk you through the findings.",
  });
});
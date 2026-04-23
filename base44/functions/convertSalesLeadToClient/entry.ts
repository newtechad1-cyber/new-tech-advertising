import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { leadId, dealId } = await req.json();
  if (!leadId) return Response.json({ error: 'leadId is required' }, { status: 400 });

  const sb = base44.asServiceRole;

  // 1. Load lead
  const lead = await sb.entities.SalesLead.get(leadId);
  if (!lead) return Response.json({ error: 'Lead not found' }, { status: 404 });

  const businessName = lead.business_name || lead.company || '';
  const email = lead.email || '';
  const contactName = lead.contact_name || [lead.first_name, lead.last_name].filter(Boolean).join(' ') || '';

  // ── 2. Find or create Client ──────────────────────────────────────────────
  let client = null;

  // Try match by email first, then business name
  if (email) {
    const matches = await sb.entities.Clients.filter({ email });
    if (matches.length > 0) client = matches[0];
  }
  if (!client && businessName) {
    const matches = await sb.entities.Clients.filter({ business_name: businessName });
    if (matches.length > 0) client = matches[0];
  }

  const clientPayload = {
    business_name: businessName,
    email,
    phone: lead.phone || '',
    website: lead.website || '',
    city: lead.city || '',
    state: lead.state || '',
    primary_contact: contactName,
    status: 'active_client',
  };

  if (client) {
    await sb.entities.Clients.update(client.id, clientPayload);
    client = { ...client, ...clientPayload };
  } else {
    client = await sb.entities.Clients.create({ ...clientPayload, archived: false });
  }

  // ── 3. Find or create NTACompany ──────────────────────────────────────────
  let company = null;

  if (email) {
    const matches = await sb.entities.NTACompany.filter({ email });
    if (matches.length > 0) company = matches[0];
  }
  if (!company && businessName) {
    const matches = await sb.entities.NTACompany.filter({ company_name: businessName });
    if (matches.length > 0) company = matches[0];
  }

  const companyPayload = {
    company_name: businessName,
    email,
    phone: lead.phone || '',
    website: lead.website || '',
    city: lead.city || '',
    state: lead.state || '',
    industry: lead.industry || '',
    status: 'active',
    lifecycle_stage: 'client',
    active_client: true,
    source: 'sales_pipeline',
  };

  if (company) {
    await sb.entities.NTACompany.update(company.id, companyPayload);
    company = { ...company, ...companyPayload };
  } else {
    company = await sb.entities.NTACompany.create(companyPayload);
  }

  // ── 4. Find or create NTAContact ─────────────────────────────────────────
  if (contactName || email) {
    const existingContacts = await sb.entities.NTAContact.filter({ company_id: company.id, is_primary: true });
    const contactPayload = {
      company_id: company.id,
      name: contactName,
      email,
      phone: lead.phone || '',
      role: 'Owner',
      is_primary: true,
    };
    if (existingContacts.length > 0) {
      await sb.entities.NTAContact.update(existingContacts[0].id, contactPayload);
    } else {
      await sb.entities.NTAContact.create(contactPayload);
    }
  }

  // ── 5. Create ClientSetupStatus if missing ────────────────────────────────
  const existingSetup = await sb.entities.ClientSetupStatus.filter({ client_id: client.id });
  if (existingSetup.length === 0) {
    await sb.entities.ClientSetupStatus.create({
      client_id: client.id,
      business_name: businessName,
      setup_status: 'Not Started',
      onboarding_stage: 'Intake',
      percent_complete: 0,
    });
  }

  // ── 6. Mark lead/deal as converted ───────────────────────────────────────
  await sb.entities.SalesLead.update(leadId, { status: 'qualified', converted_client_id: client.id });

  if (dealId) {
    await sb.entities.SalesDeal.update(dealId, { converted_client_id: client.id, stage: 'Closed Won' });
  }

  return Response.json({
    success: true,
    client_id: client.id,
    redirect_url: `/agency/clients/${client.id}/setup`,
  });
});
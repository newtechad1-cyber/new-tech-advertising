import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function isTrustedInternalUser(user) {
  return Boolean(user && (user.is_service === true || user.role === 'admin'));
}

function normalize(str) {
  return (str || '').toLowerCase().trim().replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me().catch(() => null);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isTrustedInternalUser(user)) return Response.json({ error: 'Admin access required' }, { status: 403 });

  const { submission_id, auto_process = true } = await req.json();

  if (!submission_id) {
    return Response.json({ error: 'submission_id required' }, { status: 400 });
  }

  // Fetch the submission
  const subs = await base44.asServiceRole.entities.Submission.filter({ id: submission_id });
  const sub = subs[0];
  if (!sub) return Response.json({ error: 'Submission not found' }, { status: 404 });

  await base44.asServiceRole.entities.Submission.update(sub.id, { processing_status: 'processing' });

  let company = null;
  let companyCreated = false;

  // Try to match existing company
  const allCompanies = await base44.asServiceRole.entities.NTACompany.filter({ archived: false });

  if (sub.website || sub.email || sub.phone || sub.business_name) {
    company = allCompanies.find(c => {
      if (sub.website && c.website && normalize(sub.website) === normalize(c.website)) return true;
      if (sub.email && c.email && sub.email.toLowerCase() === c.email.toLowerCase()) return true;
      if (sub.phone && c.phone && sub.phone.replace(/\D/g,'') === c.phone.replace(/\D/g,'')) return true;
      if (sub.business_name && c.company_name && sub.business_name.toLowerCase().trim() === c.company_name.toLowerCase().trim()) return true;
      return false;
    });
  }

  // Create company if no match
  if (!company && auto_process) {
    company = await base44.asServiceRole.entities.NTACompany.create({
      company_name: sub.business_name || sub.name || 'Unknown',
      website: sub.website,
      phone: sub.phone,
      email: sub.email,
      city: sub.city,
      state: sub.state,
      source: sub.source_system,
      lifecycle_stage: 'lead',
    });
    companyCreated = true;

    await base44.asServiceRole.entities.NTAActivity.create({
      company_id: company.id,
      submission_id: sub.id,
      activity_type: 'company_created',
      title: `Company created from submission: ${company.company_name}`,
      source_system: 'process_submission',
    });
  }

  // Update submission with matched company
  const processingStatus = company ? (companyCreated ? 'created' : 'matched') : 'new';
  await base44.asServiceRole.entities.Submission.update(sub.id, {
    matched_company_id: company?.id || null,
    processing_status: processingStatus,
  });

  // Create opportunity
  let opportunity = null;
  if (company) {
    opportunity = await base44.asServiceRole.entities.NTAOpportunity.create({
      company_id: company.id,
      submission_id: sub.id,
      opportunity_name: `${company.company_name} — ${sub.submission_type}`,
      source: sub.source_system,
      offer_type: sub.submission_type === 'ada' ? 'ada_rebuild' : sub.submission_type === 'rebuild' ? 'website_rebuild' : 'dfy_managed',
      stage: 'new',
      status: 'open',
    });

    await base44.asServiceRole.entities.NTAActivity.create({
      company_id: company.id,
      submission_id: sub.id,
      opportunity_id: opportunity.id,
      activity_type: 'opportunity_created',
      title: `Opportunity created: ${opportunity.opportunity_name}`,
      source_system: 'process_submission',
    });

    // Create follow-up task
    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + 1);
    await base44.asServiceRole.entities.NTATask.create({
      company_id: company.id,
      opportunity_id: opportunity.id,
      submission_id: sub.id,
      task_type: 'follow_up',
      title: `Follow up with ${company.company_name}`,
      status: 'todo',
      priority: sub.priority || 'medium',
      due_date: followUpDate.toISOString().slice(0, 10),
      source_system: 'process_submission',
    });
  }

  const webhookStatus = 'skipped';
  await base44.asServiceRole.entities.Submission.update(sub.id, {
    webhook_status: webhookStatus,
    webhook_response: null,
  });

  return Response.json({
    success: true,
    company_id: company?.id,
    company_created: companyCreated,
    opportunity_id: opportunity?.id,
    webhook_status: webhookStatus,
  });
});

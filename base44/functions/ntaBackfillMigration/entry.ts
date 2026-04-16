/**
 * ntaBackfillMigration
 *
 * One-time migration script to backfill existing legacy entity data
 * (Lead, SalesLead, AdaLead, TrialAccount, BusinessProfile)
 * into the unified NTA OS entities (Submission, NTACompany, NTAContact, NTAOpportunity, NTAActivity).
 *
 * Safe to run multiple times — uses dedup logic.
 * Call via: base44.functions.invoke('ntaBackfillMigration', { dry_run: true })
 *
 * Admin-only endpoint.
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function normalize(str) {
  return (str || '').toLowerCase().trim().replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

function normalizePhone(str) {
  return (str || '').replace(/\D/g, '');
}

function matchCompany(companies, { website, email, phone, business_name }) {
  return companies.find(c => {
    if (website && c.website && normalize(website) === normalize(c.website)) return true;
    if (email && c.email && email.toLowerCase() === c.email?.toLowerCase()) return true;
    const ph = normalizePhone(phone);
    if (ph && ph.length >= 10 && ph === normalizePhone(c.phone)) return true;
    const bn = (business_name || '').toLowerCase().trim();
    if (bn && c.company_name && bn === c.company_name.toLowerCase().trim()) return true;
    return false;
  });
}

async function upsertCompany(base44, companies, data) {
  let company = matchCompany(companies, data);
  let created = false;

  if (!company) {
    company = await base44.asServiceRole.entities.NTACompany.create({
      company_name: data.business_name || data.name || 'Unknown (Migration)',
      website: data.website || '',
      phone: data.phone || '',
      email: data.email || '',
      city: data.city || '',
      state: data.state || '',
      source: 'migration',
      lifecycle_stage: data.lifecycle_stage || 'lead',
      status: 'prospect',
    });
    companies.push(company);
    created = true;
  }

  return { company, created };
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const user = await base44.auth.me();
  if (user?.role !== 'admin') {
    return Response.json({ error: 'Admin access required' }, { status: 403 });
  }

  const { dry_run = false, entity_types = ['Lead', 'SalesLead', 'AdaLead', 'TrialAccount'] } = await req.json();

  const log = (msg) => console.log(`[ntaBackfillMigration] ${msg}`);
  const stats = { total: 0, submissions_created: 0, companies_created: 0, opportunities_created: 0, skipped: 0, errors: 0 };

  // Load all existing companies once for dedup
  const existingCompanies = await base44.asServiceRole.entities.NTACompany.filter({ archived: false });
  log(`Loaded ${existingCompanies.length} existing NTACompany records`);

  // Load existing submissions to skip already-migrated records
  const existingSubmissions = await base44.asServiceRole.entities.Submission.filter({ source_system: 'migration' });
  const migratedEmails = new Set(existingSubmissions.map(s => s.email?.toLowerCase()).filter(Boolean));
  log(`Found ${existingSubmissions.length} previously migrated submissions`);

  // ── Backfill Lead records ─────────────────────────────────────────────────
  if (entity_types.includes('Lead')) {
    log('Processing Lead records...');
    const leads = await base44.asServiceRole.entities.Lead.list('-created_date', 500);
    for (const lead of leads) {
      stats.total++;
      const emailKey = lead.email?.toLowerCase();
      if (emailKey && migratedEmails.has(emailKey)) { stats.skipped++; continue; }

      try {
        if (!dry_run) {
          const sub = await base44.asServiceRole.entities.Submission.create({
            submission_type: 'lead',
            source_system: 'migration',
            source_page: lead.page_url || '/leads',
            name: lead.name,
            business_name: lead.business_name,
            email: lead.email || '',
            phone: lead.phone || '',
            website: lead.website || '',
            city: lead.city || '',
            state: lead.state || '',
            notes: lead.message || lead.notes || '',
            raw_payload: JSON.stringify(lead),
            processing_status: 'completed',
            webhook_status: 'skipped',
            priority: 'medium',
          });

          const { company, created } = await upsertCompany(base44, existingCompanies, {
            business_name: lead.business_name,
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            website: lead.website,
            city: lead.city,
            state: lead.state,
          });

          await base44.asServiceRole.entities.Submission.update(sub.id, {
            matched_company_id: company.id,
          });

          await base44.asServiceRole.entities.NTAOpportunity.create({
            company_id: company.id,
            submission_id: sub.id,
            opportunity_name: `${lead.business_name || lead.name} — lead (migrated)`,
            source: lead.source || 'migration',
            offer_type: 'dfy_managed',
            stage: lead.status === 'qualified' ? 'qualified' : 'new',
            status: 'open',
            notes: lead.message || '',
          });

          await base44.asServiceRole.entities.NTAActivity.create({
            company_id: company.id,
            submission_id: sub.id,
            activity_type: 'submission',
            title: `[Migration] Lead: ${lead.business_name || lead.name}`,
            details: `Backfilled from Lead entity. Original status: ${lead.status}`,
            source_system: 'migration',
          });

          if (emailKey) migratedEmails.add(emailKey);
          stats.submissions_created++;
          if (created) stats.companies_created++;
          stats.opportunities_created++;
        } else {
          stats.submissions_created++;
        }
      } catch (err) {
        log(`Lead ${lead.id} error: ${err.message}`);
        stats.errors++;
      }
    }
    log(`Lead: processed ${leads.length} records`);
  }

  // ── Backfill SalesLead records ────────────────────────────────────────────
  if (entity_types.includes('SalesLead')) {
    log('Processing SalesLead records...');
    const salesLeads = await base44.asServiceRole.entities.SalesLead.list('-created_date', 500);
    for (const sl of salesLeads) {
      stats.total++;
      const emailKey = sl.email?.toLowerCase();
      if (emailKey && migratedEmails.has(emailKey)) { stats.skipped++; continue; }

      try {
        if (!dry_run) {
          const sub = await base44.asServiceRole.entities.Submission.create({
            submission_type: 'lead',
            source_system: 'migration',
            source_page: '/sales',
            name: sl.contact_name || `${sl.first_name || ''} ${sl.last_name || ''}`.trim(),
            business_name: sl.business_name,
            email: sl.email || '',
            phone: sl.phone || '',
            website: sl.website || '',
            city: sl.city || '',
            state: sl.state || '',
            notes: sl.notes || '',
            raw_payload: JSON.stringify(sl),
            processing_status: 'completed',
            webhook_status: 'skipped',
            priority: 'medium',
          });

          const { company, created } = await upsertCompany(base44, existingCompanies, {
            business_name: sl.business_name,
            name: sl.contact_name,
            email: sl.email,
            phone: sl.phone,
            website: sl.website,
            city: sl.city,
            state: sl.state,
          });

          await base44.asServiceRole.entities.Submission.update(sub.id, { matched_company_id: company.id });

          await base44.asServiceRole.entities.NTAOpportunity.create({
            company_id: company.id,
            submission_id: sub.id,
            opportunity_name: `${sl.business_name} — sales lead (migrated)`,
            source: sl.lead_source || 'migration',
            offer_type: 'dfy_managed',
            stage: 'new',
            status: 'open',
          });

          await base44.asServiceRole.entities.NTAActivity.create({
            company_id: company.id,
            submission_id: sub.id,
            activity_type: 'submission',
            title: `[Migration] SalesLead: ${sl.business_name}`,
            source_system: 'migration',
          });

          if (emailKey) migratedEmails.add(emailKey);
          stats.submissions_created++;
          if (created) stats.companies_created++;
          stats.opportunities_created++;
        } else {
          stats.submissions_created++;
        }
      } catch (err) {
        log(`SalesLead ${sl.id} error: ${err.message}`);
        stats.errors++;
      }
    }
    log(`SalesLead: processed ${salesLeads.length} records`);
  }

  // ── Backfill AdaLead records ──────────────────────────────────────────────
  if (entity_types.includes('AdaLead')) {
    log('Processing AdaLead records...');
    const adaLeads = await base44.asServiceRole.entities.AdaLead.list('-created_date', 500);
    for (const al of adaLeads) {
      stats.total++;
      const emailKey = al.email?.toLowerCase();
      if (emailKey && migratedEmails.has(emailKey)) { stats.skipped++; continue; }

      try {
        if (!dry_run) {
          const sub = await base44.asServiceRole.entities.Submission.create({
            submission_type: 'ada',
            source_system: 'migration',
            source_page: '/ada',
            name: al.full_name || al.name || '',
            business_name: al.business_name,
            email: al.email || '',
            phone: al.phone || '',
            website: al.website_url || '',
            city: al.city || '',
            state: al.state || '',
            notes: al.notes || '',
            raw_payload: JSON.stringify(al),
            processing_status: 'completed',
            webhook_status: 'skipped',
            priority: 'high',
          });

          const { company, created } = await upsertCompany(base44, existingCompanies, {
            business_name: al.business_name,
            email: al.email,
            phone: al.phone,
            website: al.website_url,
            city: al.city,
            state: al.state,
          });

          await base44.asServiceRole.entities.Submission.update(sub.id, { matched_company_id: company.id });

          await base44.asServiceRole.entities.NTAOpportunity.create({
            company_id: company.id,
            submission_id: sub.id,
            opportunity_name: `${al.business_name} — ADA compliance (migrated)`,
            source: 'migration',
            offer_type: 'ada_rebuild',
            stage: 'new',
            status: 'open',
          });

          await base44.asServiceRole.entities.NTAActivity.create({
            company_id: company.id,
            submission_id: sub.id,
            activity_type: 'submission',
            title: `[Migration] AdaLead: ${al.business_name}`,
            source_system: 'migration',
          });

          if (emailKey) migratedEmails.add(emailKey);
          stats.submissions_created++;
          if (created) stats.companies_created++;
          stats.opportunities_created++;
        } else {
          stats.submissions_created++;
        }
      } catch (err) {
        log(`AdaLead ${al.id} error: ${err.message}`);
        stats.errors++;
      }
    }
    log(`AdaLead: processed ${adaLeads.length} records`);
  }

  // ── Backfill TrialAccount records ─────────────────────────────────────────
  if (entity_types.includes('TrialAccount')) {
    log('Processing TrialAccount records...');
    const trials = await base44.asServiceRole.entities.TrialAccount.list('-created_date', 500);
    for (const t of trials) {
      stats.total++;
      const emailKey = t.email?.toLowerCase();
      if (emailKey && migratedEmails.has(emailKey)) { stats.skipped++; continue; }

      try {
        if (!dry_run) {
          const sub = await base44.asServiceRole.entities.Submission.create({
            submission_type: 'trial',
            source_system: 'migration',
            source_page: '/trial',
            name: t.full_name || t.name || '',
            business_name: t.name,
            email: t.email || '',
            phone: t.phone || '',
            website: t.website_url || '',
            city: t.location_city || '',
            state: t.location_state || '',
            notes: `Trial. Goal: ${t.primary_goal || 'N/A'}`,
            raw_payload: JSON.stringify(t),
            processing_status: 'completed',
            webhook_status: 'skipped',
            priority: 'medium',
          });

          const { company, created } = await upsertCompany(base44, existingCompanies, {
            business_name: t.name,
            email: t.email,
            phone: t.phone,
            website: t.website_url,
            city: t.location_city,
            state: t.location_state,
          });

          await base44.asServiceRole.entities.Submission.update(sub.id, { matched_company_id: company.id });

          await base44.asServiceRole.entities.NTAOpportunity.create({
            company_id: company.id,
            submission_id: sub.id,
            opportunity_name: `${t.name} — trial (migrated)`,
            source: 'migration',
            offer_type: 'diy_saas',
            stage: 'new',
            status: 'open',
          });

          await base44.asServiceRole.entities.NTAActivity.create({
            company_id: company.id,
            submission_id: sub.id,
            activity_type: 'submission',
            title: `[Migration] Trial: ${t.name}`,
            source_system: 'migration',
          });

          if (emailKey) migratedEmails.add(emailKey);
          stats.submissions_created++;
          if (created) stats.companies_created++;
          stats.opportunities_created++;
        } else {
          stats.submissions_created++;
        }
      } catch (err) {
        log(`TrialAccount ${t.id} error: ${err.message}`);
        stats.errors++;
      }
    }
    log(`TrialAccount: processed ${trials.length} records`);
  }

  log(`COMPLETE — ${JSON.stringify(stats)}`);

  return Response.json({
    success: true,
    dry_run,
    stats,
    message: dry_run
      ? `DRY RUN: Would create ~${stats.submissions_created} submissions. Run with dry_run=false to execute.`
      : `Migration complete. Created ${stats.submissions_created} submissions, ${stats.companies_created} companies, ${stats.opportunities_created} opportunities. ${stats.skipped} skipped (already migrated). ${stats.errors} errors.`,
  });
});
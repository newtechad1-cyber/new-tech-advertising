/**
 * ntaUnifiedIntake
 *
 * Universal intake mirror. Called non-blocking from every form.
 * Accepts a pre-classified payload with:
 *   - submission_type  (hardcoded by caller per mapping rules)
 *   - offer_type       (hardcoded by caller per mapping rules)
 *   - mapping_confidence  ("hardcoded" | "fallback")
 *   - mapping_notes       (human-readable reason for mapping)
 *   - detected_route      (caller's route/page)
 *   - detected_component  (caller's component name)
 *
 * Produces: Submission → NTACompany (match/create) → NTAContact → NTAOpportunity → NTAActivity → NTATask
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// ── Inline log helper (no local imports in Deno) ──────────────────────────────
async function logEvent(base44, params) {
  try {
    const {
      event_type, source_system = 'base44_function', source_route = '',
      source_component = 'ntaUnifiedIntake', entity_type = '', entity_id = '',
      related_entity_type = '', related_entity_id = '', workflow_type = 'intake',
      workflow_stage = '', status = 'success', message = '', error_details = '',
      payload_snapshot = '', user_context = '', log_level,
    } = params;
    const resolvedLevel = log_level || (status === 'failed' ? 'error' : status === 'warning' ? 'warning' : 'info');
    await base44.asServiceRole.entities.SystemLog.create({
      event_type, source_system, source_route, source_component,
      entity_type, entity_id: entity_id ? String(entity_id) : '',
      related_entity_type, related_entity_id: related_entity_id ? String(related_entity_id) : '',
      workflow_type, workflow_stage, status, message,
      error_details: String(error_details || ''),
      payload_snapshot: typeof payload_snapshot === 'string' ? payload_snapshot.slice(0, 2000) : JSON.stringify(payload_snapshot || {}).slice(0, 2000),
      user_context, log_level: resolvedLevel,
    });
  } catch (e) {
    console.warn('[ntaUnifiedIntake] SystemLog write failed:', e.message);
  }
}

// ── Mapping tables ────────────────────────────────────────────────────────────

const SERVICE_INTEREST_TO_OFFER_TYPE = {
  diy_saas:     'diy_growth_system',
  dfy_managed:  'done_for_you_marketing',
  ada_rebuild:  'ada_rebuild',
  streaming_tv: 'streaming_tv',
  not_sure:     'consultation',
};

const CASE_STUDY_SERVICE_TO_OFFER_TYPE = {
  'ada-rebuild':            'ada_compliance',
  'ada-website-compliance': 'ada_compliance',
  'website-rebuild':        'website_rebuild',
  'local-seo':              'local_seo',
  'video-marketing':        'ai_video',
  'ai-social-media':        'social_media_management',
  'streaming-tv':           'streaming_tv',
  'streaming-tv-advertising': 'streaming_tv',
};

const SIGNUP_MODAL_SERVICE_TO_OFFER_TYPE = {
  'complete-marketing':  'done_for_you_marketing',
  'dfy-social':          'social_media_management',
  'diy-social':          'diy_growth_system',
};

const ROUTE_TO_OFFER_TYPE = {
  '/ada':                   'ada_compliance',
  '/ada-compliance':        'ada_compliance',
  '/ada-intake':            'ada_compliance',
  '/ai-advertising':        'ai_advertising',
  '/ai-social-media':       'ai_advertising',
  '/local-visibility':      'local_seo',
  '/social-media':          'social_media_management',
  '/ai-video':              'ai_video',
  '/ai-videos':             'ai_video',
  '/website-rebuild':       'website_rebuild',
  '/services/website-rebuilds': 'website_rebuild',
  '/streaming-tv':          'streaming_tv',
  '/streaming-tv-advertising': 'streaming_tv',
};

const SERVICE_SLUG_TO_OFFER_TYPE = {
  'streaming-tv-advertising': 'streaming_tv',
  'ada-website-compliance':   'ada_compliance',
};

// ── Normalization helpers ─────────────────────────────────────────────────────

function normalizeUrl(str) {
  return (str || '').toLowerCase().trim()
    .replace(/^https?:\/\/(www\.)?/, '')
    .replace(/\/$/, '');
}

function normalizePhone(str) {
  return (str || '').replace(/\D/g, '');
}

function matchCompany(companies, { website, email, phone, business_name }) {
  return companies.find(c => {
    if (website && c.website && normalizeUrl(website) === normalizeUrl(c.website)) return true;
    if (email && c.email && email.toLowerCase() === c.email?.toLowerCase()) return true;
    const ph = normalizePhone(phone);
    if (ph && ph.length >= 10 && ph === normalizePhone(c.phone)) return true;
    const bn = (business_name || '').toLowerCase().trim();
    if (bn && c.company_name && bn === c.company_name.toLowerCase().trim()) return true;
    return false;
  });
}

// ── Resolve final submission_type and offer_type from payload ─────────────────

function resolveMapping(payload) {
  const {
    submission_type: raw_sub_type,
    offer_type: raw_offer_type,
    service_interest,
    service_used,
    service_slug,
    selected_service,
    source_page,
    detected_route,
    detected_component,
    mapping_confidence: raw_confidence,
    mapping_notes: raw_notes,
  } = payload;

  let submission_type = raw_sub_type || 'lead';
  let offer_type = raw_offer_type;
  let mapping_confidence = raw_confidence || 'fallback';
  let mapping_notes = raw_notes || '';

  if (offer_type && mapping_confidence === 'hardcoded') {
    return { submission_type, offer_type, mapping_confidence, mapping_notes };
  }

  if (submission_type === 'get_started' && service_interest) {
    offer_type = SERVICE_INTEREST_TO_OFFER_TYPE[service_interest] || 'consultation';
    mapping_confidence = 'hardcoded';
    mapping_notes = `get_started form; service_interest=${service_interest}`;
    return { submission_type, offer_type, mapping_confidence, mapping_notes };
  }

  if (submission_type === 'case_study_inquiry' && service_used) {
    offer_type = CASE_STUDY_SERVICE_TO_OFFER_TYPE[service_used] || 'consultation';
    mapping_confidence = 'hardcoded';
    mapping_notes = `case_study_inquiry; service_used=${service_used}`;
    return { submission_type, offer_type, mapping_confidence, mapping_notes };
  }

  if (submission_type === 'service_location_inquiry' && service_slug) {
    offer_type = SERVICE_SLUG_TO_OFFER_TYPE[service_slug] || 'local_service_inquiry';
    mapping_confidence = 'hardcoded';
    mapping_notes = `service_location_inquiry; service_slug=${service_slug}`;
    return { submission_type, offer_type, mapping_confidence, mapping_notes };
  }

  if (submission_type === 'landing_signup') {
    if (selected_service && SIGNUP_MODAL_SERVICE_TO_OFFER_TYPE[selected_service]) {
      offer_type = SIGNUP_MODAL_SERVICE_TO_OFFER_TYPE[selected_service];
      mapping_confidence = 'hardcoded';
      mapping_notes = `landing_signup; selected_service=${selected_service}`;
    } else {
      const route = detected_route || source_page || '';
      const routeMatch = Object.keys(ROUTE_TO_OFFER_TYPE).find(k => route.startsWith(k));
      if (routeMatch) {
        offer_type = ROUTE_TO_OFFER_TYPE[routeMatch];
        mapping_confidence = 'hardcoded';
        mapping_notes = `landing_signup; route_inferred=${routeMatch}`;
      } else {
        offer_type = offer_type || 'consultation';
        mapping_confidence = 'fallback';
        mapping_notes = 'landing_signup; no route match, defaulted to consultation';
      }
    }
    return { submission_type, offer_type, mapping_confidence, mapping_notes };
  }

  const HARDCODED = {
    free_audit_request:       'marketing_audit',
    trial_signup:             'trial_onboarding',
    hvac_funnel_lead:         'hvac_marketing',
    manual_lead_entry:        'manual_sales_opportunity',
    website_rebuild_intake:   'website_rebuild',
    ada_assessment_request:   'ada_compliance',
    ada_intake_form:          'ada_compliance',
  };

  if (HARDCODED[submission_type]) {
    offer_type = offer_type || HARDCODED[submission_type];
    mapping_confidence = 'hardcoded';
    mapping_notes = mapping_notes || `hardcoded from submission_type=${submission_type}`;
    return { submission_type, offer_type, mapping_confidence, mapping_notes };
  }

  // Fallback
  offer_type = offer_type || 'consultation';
  mapping_confidence = 'fallback';
  mapping_notes = mapping_notes || `unknown submission_type=${submission_type}, defaulted to consultation`;
  return { submission_type, offer_type, mapping_confidence, mapping_notes };
}

// ── Main handler ──────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const {
      source_system = 'website',
      source_page = '',
      source_campaign = '',
      source_url = '',
      name = '',
      business_name = '',
      email = '',
      phone = '',
      website = '',
      city = '',
      state = '',
      notes = '',
      priority = 'medium',
      is_high_intent = false,
      skip_webhook = false,
      raw_payload,
      service_interest,
      service_used,
      service_slug,
      selected_service,
      detected_route = source_page || '',
      detected_component = '',
      selected_package,
      package: packageField,
    } = payload;

    const { submission_type, offer_type, mapping_confidence, mapping_notes } = resolveMapping({
      ...payload,
      detected_route,
      detected_component,
    });

    console.log(`[ntaUnifiedIntake] ${submission_type} → ${offer_type} [${mapping_confidence}] | ${business_name || email}`);

    // Log mapping start
    await logEvent(base44, {
      event_type: mapping_confidence === 'fallback' ? 'migration_fallback_used' : 'migration_submission_intercepted',
      source_system,
      source_route: detected_route,
      source_component: detected_component || 'ntaUnifiedIntake',
      workflow_type: 'migration',
      workflow_stage: mapping_confidence === 'fallback' ? 'mapped_fallback' : 'mapped_hardcoded',
      status: mapping_confidence === 'fallback' ? 'warning' : 'success',
      message: mapping_confidence === 'fallback'
        ? `Unknown mapping context — fallback offer_type used: submission_type=${submission_type}, offer_type=${offer_type}`
        : `Intake intercepted: submission_type=${submission_type} → offer_type=${offer_type}`,
      payload_snapshot: JSON.stringify({ submission_type, offer_type, mapping_confidence, mapping_notes, business_name, email }),
    });

    // ── Load existing companies for dedup
    const existingCompanies = await base44.asServiceRole.entities.NTACompany.filter({ archived: false });

    // ── Create Submission
    const packageNotes = selected_package || packageField
      ? `Package: ${selected_package || packageField}` : '';

    let submission;
    try {
      submission = await base44.asServiceRole.entities.Submission.create({
        submission_type,
        source_system,
        source_page,
        source_campaign: source_campaign || '',
        source_url: source_url || '',
        name,
        business_name,
        email,
        phone,
        website,
        city,
        state,
        notes: [notes, packageNotes].filter(Boolean).join(' | '),
        raw_payload: JSON.stringify({
          ...(typeof raw_payload === 'object' ? raw_payload : {}),
          _nta_debug: {
            detected_route, detected_component,
            mapped_submission_type: submission_type,
            mapped_offer_type: offer_type,
            mapping_confidence, mapping_notes,
            service_interest: service_interest || null,
            service_used: service_used || null,
            service_slug: service_slug || null,
            selected_service: selected_service || null,
            selected_package: selected_package || packageField || null,
          }
        }),
        processing_status: 'processing',
        webhook_status: skip_webhook ? 'skipped' : 'pending',
        priority,
      });

      await logEvent(base44, {
        event_type: 'migration_submission_created',
        source_system, source_route: detected_route, source_component: detected_component || 'ntaUnifiedIntake',
        entity_type: 'Submission', entity_id: submission.id,
        workflow_type: 'migration', workflow_stage: 'submission_created', status: 'success',
        message: `Submission record created for ${business_name || email} (${submission_type})`,
        payload_snapshot: JSON.stringify({ submission_type, offer_type, business_name, email, source_system }),
      });
    } catch (subErr) {
      await logEvent(base44, {
        event_type: 'migration_failed', source_system, source_route: detected_route,
        source_component: 'ntaUnifiedIntake', workflow_type: 'migration',
        workflow_stage: 'submission_create', status: 'failed',
        message: `Failed to create Submission record for ${business_name || email}: ${subErr.message}`,
        error_details: subErr.message,
      });
      throw subErr;
    }

    // ── Match or create Company
    await logEvent(base44, {
      event_type: 'migration_company_match_started',
      source_system, entity_type: 'Submission', entity_id: submission.id,
      workflow_type: 'migration', workflow_stage: 'company_match_started', status: 'started',
      message: `Looking up company match for ${business_name || email}`,
    });

    let company = matchCompany(existingCompanies, { website, email, phone, business_name });
    let company_created = false;

    if (!company) {
      company = await base44.asServiceRole.entities.NTACompany.create({
        company_name: business_name || name || 'Unknown',
        website: website || '',
        phone: phone || '',
        email: email || '',
        city: city || '',
        state: state || '',
        source: source_system,
        lifecycle_stage: 'lead',
        status: 'prospect',
      });
      company_created = true;

      await base44.asServiceRole.entities.NTAActivity.create({
        company_id: company.id,
        submission_id: submission.id,
        activity_type: 'company_created',
        title: `Company created: ${company.company_name}`,
        details: `Source: ${source_system} | Route: ${detected_route}`,
        source_system,
      });

      await logEvent(base44, {
        event_type: 'migration_company_created',
        source_system, source_route: detected_route, source_component: 'ntaUnifiedIntake',
        entity_type: 'NTACompany', entity_id: company.id,
        related_entity_type: 'Submission', related_entity_id: submission.id,
        workflow_type: 'migration', workflow_stage: 'company_created', status: 'success',
        message: `New company created: ${company.company_name}`,
        payload_snapshot: JSON.stringify({ company_name: company.company_name, source_system }),
      });
    } else {
      await logEvent(base44, {
        event_type: 'migration_company_matched',
        source_system, source_route: detected_route,
        entity_type: 'NTACompany', entity_id: company.id,
        related_entity_type: 'Submission', related_entity_id: submission.id,
        workflow_type: 'migration', workflow_stage: 'company_matched', status: 'success',
        message: `Company matched by existing record: ${company.company_name}`,
      });
    }

    await base44.asServiceRole.entities.Submission.update(submission.id, {
      matched_company_id: company.id,
      processing_status: 'matched',
    });

    // ── Create/dedup Contact
    let contact_id = null;
    if (email || phone) {
      const existingContacts = await base44.asServiceRole.entities.NTAContact.filter({ company_id: company.id });
      const contactExists = existingContacts.find(c =>
        (email && c.email?.toLowerCase() === email.toLowerCase()) ||
        (phone && normalizePhone(c.phone) === normalizePhone(phone) && normalizePhone(phone).length >= 10)
      );
      if (!contactExists) {
        const contact = await base44.asServiceRole.entities.NTAContact.create({
          company_id: company.id,
          name: name || business_name || '',
          email: email || '',
          phone: phone || '',
          is_primary: existingContacts.length === 0,
        });
        contact_id = contact.id;

        await logEvent(base44, {
          event_type: 'migration_contact_created',
          source_system, entity_type: 'NTAContact', entity_id: contact.id,
          related_entity_type: 'NTACompany', related_entity_id: company.id,
          workflow_type: 'migration', workflow_stage: 'contact_created', status: 'success',
          message: `Contact created for ${name || business_name} at ${company.company_name}`,
        });
      } else {
        contact_id = contactExists.id;
        await logEvent(base44, {
          event_type: 'migration_contact_updated',
          source_system, entity_type: 'NTAContact', entity_id: contactExists.id,
          related_entity_type: 'NTACompany', related_entity_id: company.id,
          workflow_type: 'migration', workflow_stage: 'contact_deduped', status: 'success',
          message: `Contact already exists for ${name || email} — skipped duplicate creation`,
        });
      }
    }

    // ── Create Opportunity (dedup within 7 days)
    let opportunity_id = null;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const recentOpps = await base44.asServiceRole.entities.NTAOpportunity.filter({
      company_id: company.id,
      status: 'open',
    });
    const tooRecent = recentOpps.find(o => o.created_date > sevenDaysAgo);

    if (!tooRecent) {
      const opp = await base44.asServiceRole.entities.NTAOpportunity.create({
        company_id: company.id,
        primary_contact_id: contact_id,
        submission_id: submission.id,
        opportunity_name: `${business_name || name} — ${offer_type.replace(/_/g, ' ')}`,
        source: source_system,
        offer_type,
        stage: 'new',
        status: 'open',
        notes: [notes, packageNotes].filter(Boolean).join(' | '),
      });
      opportunity_id = opp.id;

      await base44.asServiceRole.entities.NTAActivity.create({
        company_id: company.id,
        opportunity_id: opp.id,
        submission_id: submission.id,
        activity_type: 'opportunity_created',
        title: `Opportunity created: ${opp.opportunity_name}`,
        details: `Type: ${offer_type} | Source: ${source_system} | Confidence: ${mapping_confidence} | ${mapping_notes}`,
        source_system,
      });

      await logEvent(base44, {
        event_type: 'migration_opportunity_created',
        source_system, source_route: detected_route,
        entity_type: 'NTAOpportunity', entity_id: opp.id,
        related_entity_type: 'NTACompany', related_entity_id: company.id,
        workflow_type: 'migration', workflow_stage: 'opportunity_created', status: 'success',
        message: `Opportunity created: ${opp.opportunity_name} (${offer_type})`,
        payload_snapshot: JSON.stringify({ offer_type, mapping_confidence }),
      });
    } else {
      await logEvent(base44, {
        event_type: 'migration_opportunity_updated',
        source_system, entity_type: 'NTAOpportunity', entity_id: tooRecent.id,
        related_entity_type: 'NTACompany', related_entity_id: company.id,
        workflow_type: 'migration', workflow_stage: 'opportunity_deduped', status: 'skipped',
        message: `Opportunity already exists within 7 days for ${company.company_name} — skipped duplicate`,
      });
    }

    // ── Log submission activity
    await base44.asServiceRole.entities.NTAActivity.create({
      company_id: company.id,
      submission_id: submission.id,
      opportunity_id: opportunity_id || null,
      activity_type: 'submission',
      title: `Submission: ${submission_type} from ${business_name || email}`,
      details: `Offer: ${offer_type} | Route: ${detected_route} | Component: ${detected_component} | Confidence: ${mapping_confidence}`,
      source_system,
    });

    await logEvent(base44, {
      event_type: 'migration_activity_created',
      source_system, entity_type: 'Submission', entity_id: submission.id,
      related_entity_type: 'NTACompany', related_entity_id: company.id,
      workflow_type: 'migration', workflow_stage: 'activity_logged', status: 'success',
      message: `Activity logged for ${submission_type} from ${business_name || email}`,
    });

    // ── Create follow-up task
    const HIGH_INTENT = ['ada_intake_form', 'ada_assessment_request', 'website_rebuild_intake', 'free_audit_request', 'hvac_funnel_lead'];
    const dueDays = HIGH_INTENT.includes(submission_type) ? 0 : 1;
    const dueDate = new Date(Date.now() + dueDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const task = await base44.asServiceRole.entities.NTATask.create({
      company_id: company.id,
      opportunity_id: opportunity_id || null,
      submission_id: submission.id,
      task_type: 'follow_up',
      title: `Follow up: ${business_name || name} (${submission_type})`,
      description: `Source: ${detected_route || source_system} | Offer: ${offer_type} | ${notes || ''}`,
      status: 'todo',
      priority: is_high_intent || HIGH_INTENT.includes(submission_type) ? 'high' : 'medium',
      due_date: dueDate,
      source_system,
    });

    await logEvent(base44, {
      event_type: 'migration_task_created',
      source_system, entity_type: 'NTATask', entity_id: task.id,
      related_entity_type: 'Submission', related_entity_id: submission.id,
      workflow_type: 'migration', workflow_stage: 'followup_task_created', status: 'success',
      message: `Follow-up task created for ${business_name || name}: due ${dueDate}`,
    });

    // ── Create SalesLead + SalesDeal for agency pipeline
    let sales_lead_id = null;
    let sales_deal_id = null;
    try {
      // Deduplicate: find existing SalesLead by email or business_name
      let salesLead = null;
      if (email || business_name) {
        const existingLeads = await base44.asServiceRole.entities.SalesLead.filter(
          email ? { email } : { business_name }
        );
        salesLead = existingLeads[0] || null;
      }

      if (!salesLead) {
        salesLead = await base44.asServiceRole.entities.SalesLead.create({
          contact_name: payload.contact_name || name || '',
          business_name: business_name || payload.company_name || '',
          email: email || '',
          phone: phone || '',
          website: website || payload.website_url || '',
          city: city || '',
          state: state || '',
          industry: payload.industry || '',
          lead_source: payload.source || source_system || 'website',
          status: 'new',
          notes: notes || payload.message || '',
        });
      }
      sales_lead_id = salesLead.id;

      // Deduplicate: find existing active SalesDeal for this lead
      const existingDeals = await base44.asServiceRole.entities.SalesDeal.filter({
        lead_id: salesLead.id,
        archived: false,
      });

      if (existingDeals.length === 0) {
        const deal = await base44.asServiceRole.entities.SalesDeal.create({
          lead_id: salesLead.id,
          deal_name: business_name || payload.company_name || name || 'Website Lead',
          stage: 'New Lead',
          archived: false,
        });
        sales_deal_id = deal.id;
      } else {
        sales_deal_id = existingDeals[0].id;
      }
    } catch (salesErr) {
      // Non-blocking — don't fail the whole intake if pipeline creation fails
      console.warn('[ntaUnifiedIntake] SalesLead/SalesDeal creation failed:', salesErr.message);
    }

    // ── Backfill WebsiteAudit ↔ SalesLead link
    if (sales_lead_id && email) {
      try {
        const unlinkedAudits = await base44.asServiceRole.entities.WebsiteAudit.filter({ lead_email: email });
        const toLink = unlinkedAudits.filter(a => !a.lead_id && !a.sales_lead_id);
        await Promise.all(toLink.map(a =>
          base44.asServiceRole.entities.WebsiteAudit.update(a.id, {
            lead_id: sales_lead_id,
            sales_lead_id: sales_lead_id,
          })
        ));
        if (toLink.length > 0) {
          console.log(`[ntaUnifiedIntake] Backfilled ${toLink.length} WebsiteAudit(s) for lead ${sales_lead_id}`);
        }
      } catch (backfillErr) {
        console.warn('[ntaUnifiedIntake] WebsiteAudit backfill failed (non-critical):', backfillErr.message);
      }
    }

    // ── Webhooks
    let webhook_status = 'skipped';

    if (!skip_webhook) {
      const agentUrl = Deno.env.get('AGENT_WEBHOOK_URL');
      const agentKey = Deno.env.get('AGENT_WEBHOOK_KEY');
      const crmUrl = Deno.env.get('CRM_WEBHOOK_URL');

      if (!agentUrl && !crmUrl) {
        await logEvent(base44, {
          event_type: 'webhook_skipped_missing_env',
          source_system, source_component: 'ntaUnifiedIntake',
          entity_type: 'Submission', entity_id: submission.id,
          workflow_type: 'webhook', workflow_stage: 'env_check', status: 'warning',
          message: 'No webhook URLs configured — AGENT_WEBHOOK_URL and CRM_WEBHOOK_URL both missing. Webhook skipped.',
        });
      } else {
        const webhookPayload = {
          type: submission_type, offer_type, mapping_confidence, source: source_system,
          source_page, name, business_name, email, phone, website, city, state,
          company_id: company.id, submission_id: submission.id, opportunity_id, notes,
        };

        await logEvent(base44, {
          event_type: 'webhook_prepare_started',
          source_system, entity_type: 'Submission', entity_id: submission.id,
          workflow_type: 'webhook', workflow_stage: 'prepare', status: 'started',
          message: `Sending webhooks for ${submission_type} from ${business_name || email}`,
          payload_snapshot: JSON.stringify({ agentUrl: !!agentUrl, crmUrl: !!crmUrl, submission_type }),
        });

        try {
          const promises = [];
          if (agentUrl) {
            promises.push(fetch(agentUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...(agentKey ? { 'x-agent-key': agentKey } : {}) },
              body: JSON.stringify(webhookPayload),
            }));
          }
          if (crmUrl) {
            promises.push(fetch(crmUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(webhookPayload),
            }));
          }
          await Promise.all(promises);
          webhook_status = 'sent';

          await base44.asServiceRole.entities.Submission.update(submission.id, {
            webhook_status: 'success',
            processing_status: 'created',
          });

          await base44.asServiceRole.entities.NTAActivity.create({
            company_id: company.id, submission_id: submission.id,
            activity_type: 'webhook_sent', title: `Webhook sent for ${submission_type}`, source_system,
          });

          await logEvent(base44, {
            event_type: 'webhook_success',
            source_system, entity_type: 'Submission', entity_id: submission.id,
            related_entity_type: 'NTACompany', related_entity_id: company.id,
            workflow_type: 'webhook', workflow_stage: 'delivered', status: 'success',
            message: `Webhook delivered successfully for ${submission_type} from ${business_name || email}`,
          });
        } catch (whErr) {
          webhook_status = 'failed';
          console.warn('[ntaUnifiedIntake] Webhook failed:', whErr.message);

          await base44.asServiceRole.entities.Submission.update(submission.id, {
            webhook_status: 'failed',
            webhook_response: whErr.message,
            processing_status: 'failed',
          });

          await base44.asServiceRole.entities.NTAActivity.create({
            company_id: company.id, submission_id: submission.id,
            activity_type: 'webhook_failed', title: `Webhook failed for ${submission_type}`,
            details: whErr.message, source_system,
          });

          await logEvent(base44, {
            event_type: 'webhook_failed',
            source_system, source_component: 'ntaUnifiedIntake',
            entity_type: 'Submission', entity_id: submission.id,
            related_entity_type: 'NTACompany', related_entity_id: company.id,
            workflow_type: 'webhook', workflow_stage: 'delivery_failed',
            status: 'failed', log_level: 'error',
            message: `Webhook delivery failed for ${submission_type} from ${business_name || email}: ${whErr.message}`,
            error_details: whErr.message,
          });

          await base44.asServiceRole.entities.NTATask.create({
            company_id: company.id, submission_id: submission.id,
            task_type: 'webhook_retry',
            title: `URGENT: Retry webhook for ${business_name || email}`,
            description: `Webhook failed: ${whErr.message}`,
            status: 'todo', priority: 'urgent',
            due_date: new Date().toISOString().split('T')[0],
            source_system,
          });
        }
      }
    } else {
      await base44.asServiceRole.entities.Submission.update(submission.id, {
        processing_status: 'created',
      });

      await logEvent(base44, {
        event_type: 'webhook_skipped_missing_env',
        source_system, entity_type: 'Submission', entity_id: submission.id,
        workflow_type: 'webhook', workflow_stage: 'skipped', status: 'skipped',
        message: `Webhook skipped by caller flag for ${submission_type}`,
      });
    }

    return Response.json({
      success: true,
      submission_id: submission.id,
      company_id: company.id,
      company_created,
      contact_id,
      opportunity_id,
      sales_lead_id,
      sales_deal_id,
      webhook_status,
      debug: { submission_type, offer_type, mapping_confidence, mapping_notes, detected_route, detected_component },
    });

  } catch (err) {
    console.error('[ntaUnifiedIntake] Error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
});
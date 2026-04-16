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

// ── Mapping tables ────────────────────────────────────────────────────────────

// Service interest → offer_type (for Get-Started page)
const SERVICE_INTEREST_TO_OFFER_TYPE = {
  diy_saas:     'diy_growth_system',
  dfy_managed:  'done_for_you_marketing',
  ada_rebuild:  'ada_rebuild',
  streaming_tv: 'streaming_tv',
  not_sure:     'consultation',
};

// service_used slug → offer_type (for CaseStudyDetail)
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

// SignupModal selectedService → offer_type
const SIGNUP_MODAL_SERVICE_TO_OFFER_TYPE = {
  'complete-marketing':  'done_for_you_marketing',
  'dfy-social':          'social_media_management',
  'diy-social':          'diy_growth_system',
};

// Route pattern → offer_type (for SignupModal route inference)
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

// ServiceLocation service slug → offer_type
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
    service_used,        // CaseStudyDetail
    service_slug,        // ServiceLocation
    selected_service,    // SignupModal
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

  // If offer_type already hardcoded by caller, trust it
  if (offer_type && mapping_confidence === 'hardcoded') {
    return { submission_type, offer_type, mapping_confidence, mapping_notes };
  }

  // ── Get-Started: derive from service_interest
  if (submission_type === 'get_started' && service_interest) {
    offer_type = SERVICE_INTEREST_TO_OFFER_TYPE[service_interest] || 'consultation';
    mapping_confidence = 'hardcoded';
    mapping_notes = `get_started form; service_interest=${service_interest}`;
    return { submission_type, offer_type, mapping_confidence, mapping_notes };
  }

  // ── CaseStudyDetail: derive from service_used
  if (submission_type === 'case_study_inquiry' && service_used) {
    offer_type = CASE_STUDY_SERVICE_TO_OFFER_TYPE[service_used] || 'consultation';
    mapping_confidence = 'hardcoded';
    mapping_notes = `case_study_inquiry; service_used=${service_used}`;
    return { submission_type, offer_type, mapping_confidence, mapping_notes };
  }

  // ── ServiceLocation: derive from service_slug
  if (submission_type === 'service_location_inquiry' && service_slug) {
    offer_type = SERVICE_SLUG_TO_OFFER_TYPE[service_slug] || 'local_service_inquiry';
    mapping_confidence = 'hardcoded';
    mapping_notes = `service_location_inquiry; service_slug=${service_slug}`;
    return { submission_type, offer_type, mapping_confidence, mapping_notes };
  }

  // ── SignupModal: derive from selected_service or route
  if (submission_type === 'landing_signup') {
    if (selected_service && SIGNUP_MODAL_SERVICE_TO_OFFER_TYPE[selected_service]) {
      offer_type = SIGNUP_MODAL_SERVICE_TO_OFFER_TYPE[selected_service];
      mapping_confidence = 'hardcoded';
      mapping_notes = `landing_signup; selected_service=${selected_service}`;
    } else {
      // Infer from route
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

  // ── Hardcoded single-source mappings (already set by caller) ─────────────
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

  // ── Fallback
  offer_type = offer_type || 'consultation';
  mapping_confidence = 'fallback';
  mapping_notes = mapping_notes || `unknown submission_type=${submission_type}, defaulted`;
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
      // Service fields for mapping
      service_interest,
      service_used,
      service_slug,
      selected_service,
      // Debug/classification fields
      detected_route = source_page || '',
      detected_component = '',
      // Package data (Ada, etc.)
      selected_package,
      package: packageField,
    } = payload;

    // Resolve final submission_type + offer_type
    const { submission_type, offer_type, mapping_confidence, mapping_notes } = resolveMapping({
      ...payload,
      detected_route,
      detected_component,
    });

    console.log(`[ntaUnifiedIntake] ${submission_type} → ${offer_type} [${mapping_confidence}] | ${business_name || email}`);

    // ── Load existing companies for dedup ─────────────────────────────────
    const existingCompanies = await base44.asServiceRole.entities.NTACompany.filter({ archived: false });

    // ── Create Submission ─────────────────────────────────────────────────
    const packageNotes = selected_package || packageField
      ? `Package: ${selected_package || packageField}` : '';

    const submission = await base44.asServiceRole.entities.Submission.create({
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
        // Debug metadata stored in raw_payload
        _nta_debug: {
          detected_route,
          detected_component,
          mapped_submission_type: submission_type,
          mapped_offer_type: offer_type,
          mapping_confidence,
          mapping_notes,
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

    // ── Match or create Company ───────────────────────────────────────────
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
    }

    // Update submission with matched company
    await base44.asServiceRole.entities.Submission.update(submission.id, {
      matched_company_id: company.id,
      processing_status: 'matched',
    });

    // ── Create/dedup Contact ──────────────────────────────────────────────
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
      } else {
        contact_id = contactExists.id;
      }
    }

    // ── Create Opportunity (dedup: skip if open opp exists within 7 days) ─
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
    }

    // ── Log submission activity ───────────────────────────────────────────
    await base44.asServiceRole.entities.NTAActivity.create({
      company_id: company.id,
      submission_id: submission.id,
      opportunity_id: opportunity_id || null,
      activity_type: 'submission',
      title: `Submission: ${submission_type} from ${business_name || email}`,
      details: `Offer: ${offer_type} | Route: ${detected_route} | Component: ${detected_component} | Confidence: ${mapping_confidence}`,
      source_system,
    });

    // ── Create follow-up task ─────────────────────────────────────────────
    const HIGH_INTENT = ['ada_intake_form', 'ada_assessment_request', 'website_rebuild_intake', 'free_audit_request', 'hvac_funnel_lead'];
    const dueDays = HIGH_INTENT.includes(submission_type) ? 0 : 1;
    const dueDate = new Date(Date.now() + dueDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    await base44.asServiceRole.entities.NTATask.create({
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

    // ── Webhooks (skip if flagged) ────────────────────────────────────────
    let webhook_status = 'skipped';

    if (!skip_webhook) {
      const agentUrl = Deno.env.get('AGENT_WEBHOOK_URL');
      const agentKey = Deno.env.get('AGENT_WEBHOOK_KEY');
      const crmUrl = Deno.env.get('CRM_WEBHOOK_URL');

      const webhookPayload = {
        type: submission_type,
        offer_type,
        mapping_confidence,
        source: source_system,
        source_page,
        name, business_name, email, phone, website, city, state,
        company_id: company.id,
        submission_id: submission.id,
        opportunity_id,
        notes,
      };

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
          company_id: company.id,
          submission_id: submission.id,
          activity_type: 'webhook_sent',
          title: `Webhook sent for ${submission_type}`,
          source_system,
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
          company_id: company.id,
          submission_id: submission.id,
          activity_type: 'webhook_failed',
          title: `Webhook failed for ${submission_type}`,
          details: whErr.message,
          source_system,
        });

        // Urgent retry task
        await base44.asServiceRole.entities.NTATask.create({
          company_id: company.id,
          submission_id: submission.id,
          task_type: 'webhook_retry',
          title: `URGENT: Retry webhook for ${business_name || email}`,
          description: `Webhook failed: ${whErr.message}`,
          status: 'todo',
          priority: 'urgent',
          due_date: new Date().toISOString().split('T')[0],
          source_system,
        });
      }
    } else {
      await base44.asServiceRole.entities.Submission.update(submission.id, {
        processing_status: 'created',
      });
    }

    return Response.json({
      success: true,
      submission_id: submission.id,
      company_id: company.id,
      company_created,
      contact_id,
      opportunity_id,
      webhook_status,
      // Debug output
      debug: {
        submission_type,
        offer_type,
        mapping_confidence,
        mapping_notes,
        detected_route,
        detected_component,
      },
    });

  } catch (err) {
    console.error('[ntaUnifiedIntake] Error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
});
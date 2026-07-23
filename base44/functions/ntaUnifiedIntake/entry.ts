import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function normalizeUrl(value = '') {
  return value.toLowerCase().trim().replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

function normalizePhone(value = '') {
  return value.replace(/\D/g, '');
}

async function writeLog(base44, values) {
  try {
    await base44.asServiceRole.entities.SystemLog.create({
      source_system: 'base44_function',
      source_component: 'ntaUnifiedIntake',
      workflow_type: 'intake',
      status: 'success',
      log_level: 'info',
      message: '',
      error_details: '',
      payload_snapshot: '',
      ...values,
    });
  } catch (error) {
    console.warn('[ntaUnifiedIntake] log failed:', error.message);
  }
}

function resolveOffer(payload) {
  if (payload.offer_type && payload.mapping_confidence === 'hardcoded') {
    return {
      submission_type: payload.submission_type || 'lead',
      offer_type: payload.offer_type,
      mapping_confidence: 'hardcoded',
      mapping_notes: payload.mapping_notes || 'Caller supplied an approved mapping',
    };
  }

  const mapped = {
    free_audit_request: 'marketing_audit',
    growth_conversation: 'growth_conversation',
    trial_signup: 'trial_onboarding',
    website_rebuild_intake: 'website_rebuild',
    ada_assessment_request: 'ada_compliance',
    ada_intake_form: 'ada_compliance',
    hvac_funnel_lead: 'hvac_marketing',
    manual_lead_entry: 'manual_sales_opportunity',
  };

  const submissionType = payload.submission_type || 'lead';
  return {
    submission_type: submissionType,
    offer_type: payload.offer_type || mapped[submissionType] || 'consultation',
    mapping_confidence: mapped[submissionType] ? 'hardcoded' : 'fallback',
    mapping_notes: mapped[submissionType]
      ? `Mapped from submission_type=${submissionType}`
      : `Unknown submission_type=${submissionType}; defaulted to consultation`,
  };
}

function findCompany(companies, payload) {
  const phone = normalizePhone(payload.phone);
  const businessName = (payload.business_name || '').toLowerCase().trim();
  return companies.find((company) => {
    if (payload.website && company.website && normalizeUrl(payload.website) === normalizeUrl(company.website)) return true;
    if (payload.email && company.email && payload.email.toLowerCase() === company.email.toLowerCase()) return true;
    if (phone.length >= 10 && phone === normalizePhone(company.phone)) return true;
    if (businessName && company.company_name && businessName === company.company_name.toLowerCase().trim()) return true;
    return false;
  });
}

async function postWebhook(url, body, headers = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const responseText = await response.text().catch(() => '');
    throw new Error(`Webhook rejected with ${response.status}${responseText ? `: ${responseText.slice(0, 300)}` : ''}`);
  }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const mapping = resolveOffer(payload);

    const sourceSystem = payload.source_system || 'website';
    const sourcePage = payload.source_page || '';
    const detectedRoute = payload.detected_route || sourcePage;
    const detectedComponent = payload.detected_component || '';
    const name = String(payload.name || payload.contact_name || '').trim();
    const businessName = String(payload.business_name || payload.company_name || '').trim();
    const email = String(payload.email || '').trim().toLowerCase();
    const phone = String(payload.phone || '').trim();
    const website = String(payload.website || payload.website_url || '').trim();
    const notes = String(payload.notes || payload.message || '').trim();

    if (!name || !businessName || (!email && !phone)) {
      return Response.json({ error: 'Name, business name, and email or phone are required.' }, { status: 400 });
    }

    const submission = await base44.asServiceRole.entities.Submission.create({
      submission_type: mapping.submission_type,
      source_system: sourceSystem,
      source_page: sourcePage,
      source_campaign: payload.source_campaign || '',
      source_url: payload.source_url || '',
      name,
      business_name: businessName,
      email,
      phone,
      website,
      city: payload.city || '',
      state: payload.state || '',
      notes,
      raw_payload: JSON.stringify({
        ...(typeof payload.raw_payload === 'object' ? payload.raw_payload : {}),
        _nta_debug: {
          detected_route: detectedRoute,
          detected_component: detectedComponent,
          mapped_submission_type: mapping.submission_type,
          mapped_offer_type: mapping.offer_type,
          mapping_confidence: mapping.mapping_confidence,
          mapping_notes: mapping.mapping_notes,
        },
      }),
      processing_status: 'processing',
      webhook_status: payload.skip_webhook ? 'skipped' : 'pending',
      priority: payload.priority || (payload.is_high_intent ? 'high' : 'medium'),
    });

    const companies = await base44.asServiceRole.entities.NTACompany.filter({ archived: false });
    let company = findCompany(companies, { business_name: businessName, email, phone, website });
    let companyCreated = false;

    if (!company) {
      company = await base44.asServiceRole.entities.NTACompany.create({
        company_name: businessName || name,
        website,
        phone,
        email,
        city: payload.city || '',
        state: payload.state || '',
        source: sourceSystem,
        lifecycle_stage: 'lead',
        status: 'prospect',
      });
      companyCreated = true;
    }

    await base44.asServiceRole.entities.Submission.update(submission.id, {
      matched_company_id: company.id,
      processing_status: 'matched',
    });

    const contacts = await base44.asServiceRole.entities.NTAContact.filter({ company_id: company.id });
    let contact = contacts.find((item) =>
      (email && item.email?.toLowerCase() === email) ||
      (normalizePhone(phone).length >= 10 && normalizePhone(item.phone) === normalizePhone(phone))
    );

    if (!contact) {
      contact = await base44.asServiceRole.entities.NTAContact.create({
        company_id: company.id,
        name,
        email,
        phone,
        is_primary: contacts.length === 0,
      });
    }

    const recentOpportunities = await base44.asServiceRole.entities.NTAOpportunity.filter({
      company_id: company.id,
      status: 'open',
    });
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    let opportunity = recentOpportunities.find((item) => new Date(item.created_date).getTime() > sevenDaysAgo);

    if (!opportunity) {
      opportunity = await base44.asServiceRole.entities.NTAOpportunity.create({
        company_id: company.id,
        primary_contact_id: contact.id,
        submission_id: submission.id,
        opportunity_name: `${businessName} — ${mapping.offer_type.replace(/_/g, ' ')}`,
        source: sourceSystem,
        offer_type: mapping.offer_type,
        stage: 'new',
        status: 'open',
        notes,
      });
    }

    await base44.asServiceRole.entities.NTAActivity.create({
      company_id: company.id,
      opportunity_id: opportunity.id,
      submission_id: submission.id,
      activity_type: 'submission',
      title: `Submission: ${mapping.submission_type} from ${businessName}`,
      details: `Offer: ${mapping.offer_type} | Route: ${detectedRoute} | Component: ${detectedComponent}`,
      source_system: sourceSystem,
    });

    const highIntentTypes = ['free_audit_request', 'growth_conversation', 'website_rebuild_intake', 'ada_intake_form', 'ada_assessment_request', 'hvac_funnel_lead'];
    const highIntent = Boolean(payload.is_high_intent || highIntentTypes.includes(mapping.submission_type));
    const dueDate = new Date(Date.now() + (highIntent ? 0 : 1) * 86400000).toISOString().split('T')[0];

    const task = await base44.asServiceRole.entities.NTATask.create({
      company_id: company.id,
      opportunity_id: opportunity.id,
      submission_id: submission.id,
      task_type: 'follow_up',
      title: `Follow up: ${businessName} (${mapping.submission_type})`,
      description: `Source: ${detectedRoute || sourceSystem} | Offer: ${mapping.offer_type} | ${notes}`,
      status: 'todo',
      priority: highIntent ? 'high' : 'medium',
      due_date: dueDate,
      source_system: sourceSystem,
    });

    let salesLead = null;
    let salesDeal = null;
    try {
      const matchingLeads = await base44.asServiceRole.entities.SalesLead.filter(email ? { email } : { business_name: businessName });
      salesLead = matchingLeads[0] || await base44.asServiceRole.entities.SalesLead.create({
        contact_name: name,
        business_name: businessName,
        email,
        phone,
        website,
        city: payload.city || '',
        state: payload.state || '',
        industry: payload.industry || '',
        lead_source: sourceSystem,
        status: 'new',
        notes,
      });

      const deals = await base44.asServiceRole.entities.SalesDeal.filter({ lead_id: salesLead.id, archived: false });
      salesDeal = deals[0] || await base44.asServiceRole.entities.SalesDeal.create({
        lead_id: salesLead.id,
        deal_name: businessName,
        stage: 'New Lead',
        archived: false,
      });
    } catch (pipelineError) {
      console.warn('[ntaUnifiedIntake] Sales pipeline write failed:', pipelineError.message);
    }

    let webhookStatus = payload.skip_webhook ? 'skipped' : 'not_configured';
    if (!payload.skip_webhook) {
      const webhookPayload = {
        type: mapping.submission_type,
        offer_type: mapping.offer_type,
        source: sourceSystem,
        source_page: sourcePage,
        name,
        business_name: businessName,
        email,
        phone,
        website,
        company_id: company.id,
        contact_id: contact.id,
        submission_id: submission.id,
        opportunity_id: opportunity.id,
        notes,
      };

      const destinations = [];
      const agentUrl = Deno.env.get('AGENT_WEBHOOK_URL');
      const agentKey = Deno.env.get('AGENT_WEBHOOK_KEY');
      const crmUrl = Deno.env.get('CRM_WEBHOOK_URL');
      const leadUrl = Deno.env.get('LEAD_WEBHOOK_URL');
      const leadSecret = Deno.env.get('LEAD_WEBHOOK_SECRET');

      if (agentUrl) destinations.push(postWebhook(agentUrl, webhookPayload, agentKey ? { 'x-agent-key': agentKey } : {}));
      if (crmUrl) destinations.push(postWebhook(crmUrl, webhookPayload));
      if (leadUrl) destinations.push(postWebhook(leadUrl, { ...webhookPayload, secret: leadSecret || undefined }));

      if (destinations.length > 0) {
        try {
          await Promise.all(destinations);
          webhookStatus = 'success';
        } catch (webhookError) {
          webhookStatus = 'failed';
          await base44.asServiceRole.entities.NTATask.create({
            company_id: company.id,
            opportunity_id: opportunity.id,
            submission_id: submission.id,
            task_type: 'webhook_retry',
            title: `URGENT: Retry webhook for ${businessName}`,
            description: webhookError.message,
            status: 'todo',
            priority: 'urgent',
            due_date: new Date().toISOString().split('T')[0],
            source_system: sourceSystem,
          });
        }
      }
    }

    await base44.asServiceRole.entities.Submission.update(submission.id, {
      webhook_status: webhookStatus,
      processing_status: webhookStatus === 'failed' ? 'failed' : 'created',
    });

    await writeLog(base44, {
      event_type: 'intake_completed',
      source_route: detectedRoute,
      entity_type: 'Submission',
      entity_id: submission.id,
      related_entity_type: 'NTACompany',
      related_entity_id: company.id,
      workflow_stage: 'completed',
      status: webhookStatus === 'failed' ? 'warning' : 'success',
      message: `Intake completed for ${businessName}: ${mapping.submission_type} → ${mapping.offer_type}`,
      payload_snapshot: JSON.stringify({ webhookStatus, companyCreated, task_id: task.id }),
    });

    return Response.json({
      success: true,
      submission_id: submission.id,
      company_id: company.id,
      company_created: companyCreated,
      contact_id: contact.id,
      opportunity_id: opportunity.id,
      task_id: task.id,
      sales_lead_id: salesLead?.id || null,
      sales_deal_id: salesDeal?.id || null,
      webhook_status: webhookStatus,
      mapping,
    });
  } catch (error) {
    console.error('[ntaUnifiedIntake] failed:', error);
    return Response.json({ error: error.message || 'Intake failed' }, { status: 500 });
  }
});

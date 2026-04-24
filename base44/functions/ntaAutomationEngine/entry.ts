/**
 * NTA AUTOMATION ENGINE
 * ─────────────────────────────────────────────────────────────────
 * Central dispatcher for all canonical automation triggers.
 *
 * POST body:
 * {
 *   trigger_type: "record_created" | "record_updated" | "scheduled_check" | "queued_agent_task"
 *   entity:       "SalesDeals" | "ClientCompanies" | etc.
 *   record_id:    string
 *   old_status:   string (for record_updated)
 *   new_status:   string (for record_updated)
 *   field:        string (for field-level transitions, optional)
 *   data:         object (full record snapshot, optional)
 *   automation_key: string (to run a specific automation directly)
 * }
 *
 * Security: admin-only. All state transitions enforce idempotency.
 * ─────────────────────────────────────────────────────────────────
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const user = await base44.auth.me();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Admin access required' }, { status: 403 });
  }

  const body = await req.json();
  const { trigger_type, entity, record_id, old_status, new_status, field, data, automation_key } = body;

  if (!trigger_type) {
    return Response.json({ error: 'trigger_type is required' }, { status: 400 });
  }

  const results = [];

  try {
    // ── Direct automation key dispatch ──────────────────────────
    if (automation_key) {
      const result = await dispatchAutomation(automation_key, { record_id, old_status, new_status, field, data }, base44);
      return Response.json({ automation_key, result });
    }

    // ── Entity + trigger_type routing ──────────────────────────
    const matched = matchAutomations(trigger_type, entity, { old_status, new_status, field });

    for (const key of matched) {
      const result = await dispatchAutomation(key, { record_id, old_status, new_status, field, data }, base44);
      results.push({ automation: key, result });
    }

    return Response.json({ trigger_type, entity, matched_automations: matched, results });

  } catch (error) {
    console.error('[AutomationEngine] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// ─────────────────────────────────────────────────────────────────
// AUTOMATION DISPATCHER
// Routes automation keys to handler functions
// ─────────────────────────────────────────────────────────────────
async function dispatchAutomation(key, context, base44) {
  console.log(`[AutomationEngine] Running: ${key}`, context);

  const handlers = {
    AUTO_001_new_lead_intake:           () => handleNewLeadIntake(context, base44),
    AUTO_002_demo_request:              () => handleDemoRequest(context, base44),
    AUTO_003_lead_to_deal:              () => handleLeadToDeal(context, base44),
    AUTO_004_proposal_sent:             () => handleProposalSent(context, base44),
    AUTO_005_deal_closed_won:           () => handleDealClosedWon(context, base44),
    AUTO_006_deal_closed_lost:          () => handleDealClosedLost(context, base44),
    AUTO_007_direct_signup:             () => handleDirectSignup(context, base44),
    AUTO_008_reseller_signup_attribution: () => handleResellerAttribution(context, base44),
    AUTO_009_onboarding_completed:      () => handleOnboardingCompleted(context, base44),
    AUTO_010_subscription_activated:    () => handleSubscriptionActivated(context, base44),
    AUTO_011_invoice_paid:              () => handleInvoicePaid(context, base44),
    AUTO_012_payment_failed:            () => handlePaymentFailed(context, base44),
    AUTO_013_subscription_suspended:    () => handleSubscriptionSuspended(context, base44),
    AUTO_014_reseller_revenue_calc:     () => handleResellerRevenueCalc(context, base44),
    AUTO_015_payout_processed:          () => handlePayoutProcessed(context, base44),
    AUTO_016_campaign_created:          () => handleCampaignCreated(context, base44),
    AUTO_020_content_approved:          () => handleContentApproved(context, base44),
    AUTO_021_revision_requested:        () => handleRevisionRequested(context, base44),
    AUTO_022_seo_project_kickoff:       () => handleSeoProjectKickoff(context, base44),
    AUTO_025_new_review:                () => handleNewReview(context, base44),
    AUTO_026_review_response_approved:  () => handleReviewResponseApproved(context, base44),
    AUTO_027_support_ticket_created:    () => handleSupportTicketCreated(context, base44),
    AUTO_029_agent_task_failure:        () => handleAgentTaskFailure(context, base44),
  };

  const handler = handlers[key];
  if (!handler) return { skipped: true, reason: `No handler registered for ${key}` };
  return await handler();
}

// ─────────────────────────────────────────────────────────────────
// AUTOMATION MATCHER
// Returns list of automation keys that match the incoming trigger
// ─────────────────────────────────────────────────────────────────
function matchAutomations(trigger_type, entity, { old_status, new_status, field }) {
  const matched = [];
  const transition = `${old_status}→${new_status}`;

  if (trigger_type === 'record_created') {
    if (entity === 'SalesLead')         matched.push('AUTO_001_new_lead_intake');
    if (entity === 'SalesDeal')         matched.push('AUTO_003_lead_to_deal');
    if (entity === 'ClientCompanies')   matched.push('AUTO_007_direct_signup', 'AUTO_008_reseller_signup_attribution');
    if (entity === 'Campaigns')         matched.push('AUTO_016_campaign_created');
    if (entity === 'SeoProjects')       matched.push('AUTO_022_seo_project_kickoff');
    if (entity === 'ADAAudits')         matched.push('AUTO_024_ada_audit_requested');
    if (entity === 'Reviews')           matched.push('AUTO_025_new_review');
    if (entity === 'SupportTickets')    matched.push('AUTO_027_support_ticket_created');
  }

  if (trigger_type === 'record_updated') {
    if (entity === 'SalesDeal' && new_status === 'closed_won')      matched.push('AUTO_005_deal_closed_won');
    if (entity === 'SalesDeal' && new_status === 'closed_lost')     matched.push('AUTO_006_deal_closed_lost');
    if (entity === 'Proposals' && new_status === 'sent')             matched.push('AUTO_004_proposal_sent');
    if (entity === 'ClientCompanies' && field === 'onboarding_status' && new_status === 'completed') matched.push('AUTO_009_onboarding_completed');
    if (entity === 'ClientSubscriptions' && new_status === 'active')     matched.push('AUTO_010_subscription_activated');
    if (entity === 'ClientSubscriptions' && new_status === 'suspended')  matched.push('AUTO_013_subscription_suspended');
    if (entity === 'BillingInvoices' && new_status === 'paid')           matched.push('AUTO_011_invoice_paid', 'AUTO_014_reseller_revenue_calc');
    if (entity === 'BillingInvoices' && ['open', 'uncollectible'].includes(new_status)) matched.push('AUTO_012_payment_failed');
    if (entity === 'Payouts' && new_status === 'paid')               matched.push('AUTO_015_payout_processed');
    if (['SocialPosts', 'BlogPosts', 'Videos'].includes(entity) && new_status === 'approved')           matched.push('AUTO_020_content_approved');
    if (['SocialPosts', 'BlogPosts', 'Videos'].includes(entity) && new_status === 'revision_requested') matched.push('AUTO_021_revision_requested');
    if (entity === 'ReviewResponses' && new_status === 'approved')   matched.push('AUTO_026_review_response_approved');
    if (['AgentTasks', 'AgentRuns'].includes(entity) && new_status === 'failed') matched.push('AUTO_029_agent_task_failure');
  }

  if (trigger_type === 'queued_agent_task') {
    // Handled by separate agent task processor
    matched.push('AGENT_TASK_PROCESSOR');
  }

  return matched;
}

// ─────────────────────────────────────────────────────────────────
// HANDLERS — TIER 1 REVENUE LOOP
// ─────────────────────────────────────────────────────────────────

async function handleNewLeadIntake({ record_id, data }, base44) {
  const lead = data || await base44.asServiceRole.entities.SalesLead.get(record_id);

  // Idempotency: check for existing activity
  const existing = await base44.asServiceRole.entities.SalesActivity.filter({ deal_id: record_id });
  if (existing.length > 0) return { skipped: true, reason: 'Activity already exists for this lead' };

  await base44.asServiceRole.entities.SalesActivity.create({
    deal_id: record_id,
    activity_type: 'note',
    notes: 'New lead intake — assigned by automation',
    date: new Date().toISOString().split('T')[0],
  });

  await base44.asServiceRole.entities.SalesLead.update(record_id, {
    status: lead.status || 'new',
  });

  return { success: true, action: 'Lead intake processed' };
}

async function handleDemoRequest({ record_id, data }, base44) {
  const lead = data || await base44.asServiceRole.entities.SalesLead.get(record_id);

  const existing = await base44.asServiceRole.entities.SalesActivity.filter({ deal_id: record_id, activity_type: 'demo' });
  if (existing.length > 0) return { skipped: true, reason: 'Demo activity already exists within window' };

  await base44.asServiceRole.entities.SalesActivity.create({
    deal_id: record_id,
    activity_type: 'demo',
    notes: 'Demo requested via public form',
    date: new Date().toISOString().split('T')[0],
  });

  await base44.asServiceRole.entities.SalesLead.update(record_id, { status: 'contacted' });
  return { success: true, action: 'Demo request logged' };
}

async function handleLeadToDeal({ record_id, data }, base44) {
  const deal = data || await base44.asServiceRole.entities.SalesDeal.get(record_id);
  if (!deal.lead_id) return { skipped: true, reason: 'No lead_id on this deal' };

  await base44.asServiceRole.entities.SalesLead.update(deal.lead_id, { status: 'converted' });
  await base44.asServiceRole.entities.SalesActivity.create({
    deal_id: record_id,
    activity_type: 'stage_change',
    notes: 'Lead converted to deal',
    date: new Date().toISOString().split('T')[0],
  });

  return { success: true };
}

async function handleProposalSent({ record_id, data }, base44) {
  const proposal = data || await base44.asServiceRole.entities.Proposals.get(record_id);

  await base44.asServiceRole.entities.SalesActivity.create({
    deal_id: proposal.deal_id || record_id,
    activity_type: 'proposal_sent',
    notes: 'Proposal sent to prospect',
    date: new Date().toISOString().split('T')[0],
  });

  if (proposal.deal_id) {
    await base44.asServiceRole.entities.SalesDeal.update(proposal.deal_id, { stage: 'proposal_sent' });
  }

  return { success: true };
}

async function handleDealClosedWon({ record_id, data }, base44) {
  const deal = data || await base44.asServiceRole.entities.SalesDeal.get(record_id);

  // HARD idempotency check
  if (deal.converted_company_id) {
    return { skipped: true, reason: 'ClientCompany already created for this deal' };
  }
  if (!deal.company_name || !deal.plan) {
    return { skipped: true, reason: 'Missing company_name or plan — cannot bootstrap client' };
  }

  const company = await base44.asServiceRole.entities.ClientCompanies.create({
    company_name: deal.company_name,
    email: deal.email,
    status: 'trial',
    notes: `Created from deal ${record_id}`,
  });

  await base44.asServiceRole.entities.ClientSubscriptions.create({
    company_id: company.id,
    status: 'trialing',
    billing_interval: 'monthly',
    notes: `Auto-created from deal ${record_id}`,
  });

  await base44.asServiceRole.entities.ClientSettings.create({ company_id: company.id });

  await base44.asServiceRole.entities.Campaigns.create({
    company_id: company.id,
    name: 'Initial Campaign',
    campaign_type: 'multi_channel',
    status: 'draft',
  });

  await base44.asServiceRole.entities.AgentTasks.create({
    company_id: company.id,
    agent_id: 'onboarding_agent',
    task_type: 'onboarding_setup',
    status: 'queued',
  });

  await base44.asServiceRole.entities.ClientActivityLog.create({
    company_id: company.id,
    event_type: 'company_created',
    event_label: 'Company bootstrapped from closed-won deal',
    logged_at: new Date().toISOString(),
  });

  await base44.asServiceRole.entities.SalesDeal.update(record_id, {
    converted_company_id: company.id,
  });

  if (deal.lead_id) {
    await base44.asServiceRole.entities.SalesLead.update(deal.lead_id, { status: 'converted' });
  }

  return { success: true, company_id: company.id };
}

async function handleDealClosedLost({ record_id, data }, base44) {
  const deal = data || await base44.asServiceRole.entities.SalesDeal.get(record_id);

  await base44.asServiceRole.entities.SalesActivity.create({
    deal_id: record_id,
    activity_type: 'stage_change',
    notes: `Deal closed lost. Reason: ${deal.lost_reason || 'Not specified'}`,
    date: new Date().toISOString().split('T')[0],
  });

  if (deal.lead_id) {
    await base44.asServiceRole.entities.SalesLead.update(deal.lead_id, { status: 'disqualified' });
  }

  return { success: true };
}

async function handleDirectSignup({ record_id, data }, base44) {
  const company = data || await base44.asServiceRole.entities.ClientCompanies.get(record_id);

  // Idempotency check
  const existing = await base44.asServiceRole.entities.ClientSettings.filter({ company_id: record_id });
  if (existing.length > 0) return { skipped: true, reason: 'Setup already exists for this company' };

  await Promise.all([
    base44.asServiceRole.entities.ClientSettings.create({ company_id: record_id }),
    base44.asServiceRole.entities.ClientSubscriptions.create({
      company_id: record_id,
      status: 'trialing',
      billing_interval: 'monthly',
    }),
    base44.asServiceRole.entities.Campaigns.create({
      company_id: record_id,
      name: 'Initial Campaign',
      campaign_type: 'multi_channel',
      status: 'draft',
    }),
    base44.asServiceRole.entities.AgentTasks.create({
      company_id: record_id,
      agent_id: 'onboarding_agent',
      task_type: 'onboarding_setup',
      status: 'queued',
    }),
    base44.asServiceRole.entities.ClientActivityLog.create({
      company_id: record_id,
      event_type: 'company_created',
      event_label: 'Direct signup bootstrap',
      logged_at: new Date().toISOString(),
    }),
  ]);

  await base44.asServiceRole.entities.ClientCompanies.update(record_id, { status: 'trial' });

  return { success: true };
}

async function handleResellerAttribution({ record_id, data }, base44) {
  const company = data || await base44.asServiceRole.entities.ClientCompanies.get(record_id);
  if (!company.reseller_id) return { skipped: true, reason: 'No reseller_id on this company' };

  const existing = await base44.asServiceRole.entities.ResellerClients.filter({
    company_id: record_id,
    reseller_id: company.reseller_id,
  });
  if (existing.length > 0) return { skipped: true, reason: 'ResellerClient already linked' };

  await base44.asServiceRole.entities.ResellerClients.create({
    reseller_id: company.reseller_id,
    company_id: record_id,
    client_name: company.company_name,
    client_email: company.email,
    status: 'active',
    portal_access_enabled: true,
    branding_override_enabled: false,
    start_date: new Date().toISOString().split('T')[0],
  });

  return { success: true };
}

async function handleOnboardingCompleted({ record_id, data }, base44) {
  // Idempotency: check if SeoProject already exists
  const existing = await base44.asServiceRole.entities.SeoProjects.filter({ company_id: record_id });
  if (existing.length > 0) return { skipped: true, reason: 'Onboarding already completed for this company' };

  const company = data || await base44.asServiceRole.entities.ClientCompanies.get(record_id);

  await Promise.all([
    base44.asServiceRole.entities.SeoProjects.create({
      company_id: record_id,
      project_name: `${company.company_name} SEO`,
      status: 'setup',
    }),
    base44.asServiceRole.entities.ReviewProfiles.create({
      company_id: record_id,
      platform: 'google',
      monitoring_enabled: true,
      auto_respond_enabled: false,
    }),
    base44.asServiceRole.entities.AgentTasks.create({
      company_id: record_id,
      agent_id: 'seo_agent',
      task_type: 'keyword_research',
      status: 'queued',
    }),
    base44.asServiceRole.entities.AgentTasks.create({
      company_id: record_id,
      agent_id: 'social_agent',
      task_type: 'generate_social_posts',
      status: 'queued',
    }),
    base44.asServiceRole.entities.ClientActivityLog.create({
      company_id: record_id,
      event_type: 'onboarding_step_completed',
      event_label: 'Onboarding completed — fulfillment kickoff triggered',
      logged_at: new Date().toISOString(),
    }),
  ]);

  await base44.asServiceRole.entities.ClientCompanies.update(record_id, { status: 'active' });

  return { success: true };
}

// ─────────────────────────────────────────────────────────────────
// HANDLERS — BILLING
// ─────────────────────────────────────────────────────────────────

async function handleSubscriptionActivated({ record_id, data }, base44) {
  const sub = data || await base44.asServiceRole.entities.ClientSubscriptions.get(record_id);
  if (!sub.company_id) return { skipped: true, reason: 'No company_id on subscription' };

  await base44.asServiceRole.entities.ClientCompanies.update(sub.company_id, { status: 'active' });
  await base44.asServiceRole.entities.ClientActivityLog.create({
    company_id: sub.company_id,
    event_type: 'billing_updated',
    event_label: 'Subscription activated',
    logged_at: new Date().toISOString(),
  });

  return { success: true };
}

async function handleInvoicePaid({ record_id, data }, base44) {
  const invoice = data || await base44.asServiceRole.entities.BillingInvoices.get(record_id);

  // Idempotency: check for existing FinanceTransaction
  if (invoice.stripe_invoice_id) {
    const existing = await base44.asServiceRole.entities.FinanceTransactions.filter({
      stripe_invoice_id: invoice.stripe_invoice_id,
    });
    if (existing.length > 0) return { skipped: true, reason: 'FinanceTransaction already exists for this invoice' };
  }

  await base44.asServiceRole.entities.FinanceTransactions.create({
    type: 'revenue',
    category: 'subscription',
    company_id: invoice.company_id,
    billing_customer_id: invoice.billing_customer_id,
    stripe_invoice_id: invoice.stripe_invoice_id,
    amount: invoice.amount,
    date: new Date().toISOString().split('T')[0],
    source: 'stripe_auto',
    notes: `Auto-created from paid invoice ${invoice.stripe_invoice_id}`,
  });

  return { success: true };
}

async function handlePaymentFailed({ record_id, data }, base44) {
  const invoice = data || await base44.asServiceRole.entities.BillingInvoices.get(record_id);
  if (!invoice.company_id) return { skipped: true, reason: 'No company_id on invoice' };

  await base44.asServiceRole.entities.ClientActivityLog.create({
    company_id: invoice.company_id,
    event_type: 'billing_updated',
    event_label: 'Payment failed',
    logged_at: new Date().toISOString(),
  });

  return { success: true };
}

async function handleSubscriptionSuspended({ record_id, data }, base44) {
  const sub = data || await base44.asServiceRole.entities.ClientSubscriptions.get(record_id);
  if (!sub.company_id) return { skipped: true, reason: 'No company_id' };

  await base44.asServiceRole.entities.ClientCompanies.update(sub.company_id, { status: 'suspended' });
  await base44.asServiceRole.entities.ClientActivityLog.create({
    company_id: sub.company_id,
    event_type: 'billing_updated',
    event_label: 'Account suspended due to payment failure',
    logged_at: new Date().toISOString(),
  });

  return { success: true };
}

async function handleResellerRevenueCalc({ record_id, data }, base44) {
  const invoice = data || await base44.asServiceRole.entities.BillingInvoices.get(record_id);
  if (!invoice.company_id) return { skipped: true };

  const company = await base44.asServiceRole.entities.ClientCompanies.get(invoice.company_id);
  if (!company.reseller_id) return { skipped: true, reason: 'Company has no reseller_id' };

  // Idempotency
  if (invoice.stripe_invoice_id) {
    const existing = await base44.asServiceRole.entities.ResellerRevenue.filter({
      reseller_id: company.reseller_id,
      company_id: invoice.company_id,
    });
    const alreadyExists = existing.find(r => r.stripe_transfer_id === invoice.stripe_invoice_id);
    if (alreadyExists) return { skipped: true, reason: 'ResellerRevenue already exists for this invoice' };
  }

  const reseller = await base44.asServiceRole.entities.ResellerAccounts.get(company.reseller_id);
  const rate = reseller.commission_rate || 20;
  const gross = invoice.amount;
  const commission = parseFloat(((gross * rate) / 100).toFixed(2));
  const now = new Date();
  const period_label = now.toLocaleString('default', { month: 'long', year: 'numeric' });

  await base44.asServiceRole.entities.ResellerRevenue.create({
    reseller_id: company.reseller_id,
    company_id: invoice.company_id,
    period_label,
    period_start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
    period_end: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0],
    gross_revenue: gross,
    commission_rate: rate,
    commission_amount: commission,
    payout_status: 'pending',
    source: 'subscription',
    stripe_transfer_id: invoice.stripe_invoice_id,
  });

  return { success: true, commission_amount: commission };
}

async function handlePayoutProcessed({ record_id, data }, base44) {
  const payout = data || await base44.asServiceRole.entities.Payouts.get(record_id);

  // Update all linked reseller revenue records
  const revenues = await base44.asServiceRole.entities.ResellerRevenue.filter({
    reseller_id: payout.reseller_id,
    payout_status: 'processing',
  });

  for (const rev of revenues) {
    await base44.asServiceRole.entities.ResellerRevenue.update(rev.id, {
      payout_status: 'paid',
      paid_at: new Date().toISOString().split('T')[0],
    });
  }

  return { success: true, updated_count: revenues.length };
}

// ─────────────────────────────────────────────────────────────────
// HANDLERS — FULFILLMENT
// ─────────────────────────────────────────────────────────────────

async function handleCampaignCreated({ record_id, data }, base44) {
  const campaign = data || await base44.asServiceRole.entities.Campaigns.get(record_id);
  if (!campaign.company_id) return { skipped: true };

  // Idempotency
  const existing = await base44.asServiceRole.entities.AgentTasks.filter({ campaign_id: record_id });
  if (existing.length > 0) return { skipped: true, reason: 'Kickoff tasks already exist for this campaign' };

  await Promise.all([
    base44.asServiceRole.entities.AgentTasks.create({
      company_id: campaign.company_id,
      campaign_id: record_id,
      agent_id: 'social_agent',
      task_type: 'generate_social_posts',
      status: 'queued',
    }),
    base44.asServiceRole.entities.AgentTasks.create({
      company_id: campaign.company_id,
      campaign_id: record_id,
      agent_id: 'seo_agent',
      task_type: 'generate_blog',
      status: 'queued',
    }),
    base44.asServiceRole.entities.AgentTasks.create({
      company_id: campaign.company_id,
      campaign_id: record_id,
      agent_id: 'video_agent',
      task_type: 'generate_video',
      status: 'queued',
    }),
    base44.asServiceRole.entities.ClientActivityLog.create({
      company_id: campaign.company_id,
      event_type: 'system_event',
      event_label: `Campaign kickoff: ${campaign.name}`,
      entity_type: 'Campaigns',
      entity_id: record_id,
      logged_at: new Date().toISOString(),
    }),
  ]);

  return { success: true };
}

async function handleContentApproved({ record_id, data, entity }, base44) {
  const entityName = entity || 'SocialPosts';
  await base44.asServiceRole.entities.ClientActivityLog.create({
    company_id: data?.company_id,
    event_type: 'content_approved',
    event_label: `${entityName} approved`,
    entity_type: entityName,
    entity_id: record_id,
    logged_at: new Date().toISOString(),
  });
  return { success: true };
}

async function handleRevisionRequested({ record_id, data, entity }, base44) {
  if (!data?.company_id) return { skipped: true };

  const existing = await base44.asServiceRole.entities.AgentTasks.filter({
    company_id: data.company_id,
    task_type: 'revision',
  });
  const openRevision = existing.find(t => t.input_data?.includes(record_id) && t.status !== 'completed');
  if (openRevision) return { skipped: true, reason: 'Open revision task already exists for this content item' };

  await base44.asServiceRole.entities.AgentTasks.create({
    company_id: data.company_id,
    task_type: 'revision',
    status: 'queued',
    input_data: JSON.stringify({ entity, content_id: record_id }),
  });

  return { success: true };
}

async function handleSeoProjectKickoff({ record_id, data }, base44) {
  const existing = await base44.asServiceRole.entities.AgentTasks.filter({ task_type: 'keyword_research' });
  const alreadyQueued = existing.find(t => JSON.parse(t.input_data || '{}').seo_project_id === record_id);
  if (alreadyQueued) return { skipped: true, reason: 'Keyword research task already exists for this project' };

  const project = data || await base44.asServiceRole.entities.SeoProjects.get(record_id);

  await base44.asServiceRole.entities.AgentTasks.create({
    company_id: project.company_id,
    agent_id: 'seo_agent',
    task_type: 'keyword_research',
    status: 'queued',
    input_data: JSON.stringify({ seo_project_id: record_id }),
  });

  await base44.asServiceRole.entities.SeoProjects.update(record_id, { status: 'active' });

  return { success: true };
}

async function handleNewReview({ record_id, data }, base44) {
  const review = data || await base44.asServiceRole.entities.Reviews.get(record_id);
  if (!review.company_id) return { skipped: true };

  // Idempotency
  const existing = await base44.asServiceRole.entities.AgentTasks.filter({
    company_id: review.company_id,
    task_type: 'review_response',
  });
  const alreadyQueued = existing.find(t => JSON.parse(t.input_data || '{}').review_id === record_id);
  if (alreadyQueued) return { skipped: true, reason: 'Review response task already exists' };

  await base44.asServiceRole.entities.ClientNotifications.create({
    company_id: review.company_id,
    user_id: 'admin',
    type: 'review_received',
    title: `New ${review.rating}-star review on ${review.platform}`,
    body: review.review_text?.substring(0, 200),
    read: false,
    sent_via_email: false,
    created_at: new Date().toISOString(),
  });

  await base44.asServiceRole.entities.AgentTasks.create({
    company_id: review.company_id,
    agent_id: 'review_agent',
    task_type: 'review_response',
    status: 'queued',
    input_data: JSON.stringify({ review_id: record_id, rating: review.rating }),
  });

  return { success: true };
}

async function handleReviewResponseApproved({ record_id, data }, base44) {
  const response = data || await base44.asServiceRole.entities.ReviewResponses.get(record_id);

  await base44.asServiceRole.entities.Reviews.update(response.review_id, { responded: true });
  await base44.asServiceRole.entities.ClientActivityLog.create({
    company_id: response.company_id,
    event_type: 'content_approved',
    event_label: 'Review response approved and queued for publishing',
    entity_type: 'ReviewResponses',
    entity_id: record_id,
    logged_at: new Date().toISOString(),
  });

  return { success: true };
}

async function handleSupportTicketCreated({ record_id, data }, base44) {
  const ticket = data || await base44.asServiceRole.entities.SupportTickets.get(record_id);
  if (!ticket.company_id) return { skipped: true };

  await base44.asServiceRole.entities.ClientNotifications.create({
    company_id: ticket.company_id,
    user_id: ticket.submitted_by || 'admin',
    type: 'system_alert',
    title: `Support ticket opened: ${ticket.subject}`,
    body: ticket.description?.substring(0, 200),
    read: false,
    sent_via_email: false,
    created_at: new Date().toISOString(),
  });

  return { success: true };
}

async function handleAgentTaskFailure({ record_id, data }, base44) {
  const task = data || await base44.asServiceRole.entities.AgentTasks.get(record_id);
  const retry_count = (task.retry_count || 0);
  const MAX_RETRIES = 3;

  await base44.asServiceRole.entities.AgentLogs.create({
    company_id: task.company_id,
    agent_run_id: record_id,
    log_level: 'error',
    message: `Task failed: ${task.task_type}. Retry ${retry_count}/${MAX_RETRIES}`,
    logged_at: new Date().toISOString(),
  });

  if (retry_count < MAX_RETRIES) {
    await base44.asServiceRole.entities.AgentTasks.create({
      company_id: task.company_id,
      agent_id: task.agent_id,
      campaign_id: task.campaign_id,
      task_type: task.task_type,
      input_data: task.input_data,
      status: 'queued',
      priority: task.priority,
      input_data: task.input_data,
    });

    return { success: true, action: `Retry task created (attempt ${retry_count + 1})` };
  }

  return { success: true, action: 'Max retries reached — permanent failure logged' };
}
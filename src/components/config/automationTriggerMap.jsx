/**
 * NTA CANONICAL AUTOMATION TRIGGER MAP
 * ─────────────────────────────────────────────────────────────────
 * FROZEN ARCHITECTURE — DO NOT ADD TRIGGERS OUTSIDE THESE 4 TYPES:
 *
 *   1. record_created        — entity was just created
 *   2. record_updated        — explicit status/field transition
 *   3. scheduled_check       — time-based cron job
 *   4. queued_agent_task     — AgentTask picked up from queue
 *
 * RULES:
 *   - Trigger on STATE TRANSITION only, never generic save
 *   - Every automation must have a duplicate_prevention key
 *   - Pages write simple facts; automations do cross-system work
 *   - All client automations must carry company_id
 *   - Reseller automations must carry reseller_id + company_id
 *   - Agent automations must carry task_id + agent_id + related_entity
 * ─────────────────────────────────────────────────────────────────
 */

export const AUTOMATION_TRIGGER_MAP = {

  // ══════════════════════════════════════════════════════════════
  // TIER 1 — REVENUE LOOP
  // ══════════════════════════════════════════════════════════════

  AUTO_001_new_lead_intake: {
    name: 'New Public Lead Intake',
    tier: 1,
    trigger_entity: 'SalesLeads',
    trigger_type: 'record_created',
    trigger_condition: {
      source: ['website', 'demo_form', 'pricing_page', 'vertical_landing_page'],
      email_exists: true,
      status: ['', 'new'],
    },
    actions: [
      'set SalesLeads.status = new',
      'set SalesLeads.created_date = now()',
      'assign SalesLeads.assigned_to via routing rule if exists',
      'create SalesActivities { type: call, notes: "New lead intake", date: today }',
    ],
    creates: ['SalesActivities'],
    updates: ['SalesLeads.status', 'SalesLeads.assigned_to'],
    notifications: [
      'internal: new lead alert → sales/admin',
      'optional: lead confirmation email → lead.email',
    ],
    agent_runs: [],
    duplicate_prevention: 'skip if SalesLead with same email + company_name created within 24h',
  },

  AUTO_002_demo_request: {
    name: 'Demo Request Workflow',
    tier: 1,
    trigger_entity: 'SalesLeads',
    trigger_type: 'record_created',
    trigger_condition: {
      lead_source: 'demo_request',
    },
    actions: [
      'create SalesActivities { type: demo, notes: "Demo requested", date: today }',
      'set SalesLeads.status = contacted',
      'tag lead as high_intent',
    ],
    creates: ['SalesActivities'],
    updates: ['SalesLeads.status'],
    notifications: [
      'email: demo confirmation → lead.email',
      'internal: demo request alert → sales rep',
    ],
    agent_runs: [],
    duplicate_prevention: 'skip if SalesActivity type=demo exists for this lead in last 24h',
  },

  AUTO_003_lead_to_deal: {
    name: 'Lead Converted to Deal',
    tier: 1,
    trigger_entity: 'SalesDeals',
    trigger_type: 'record_created',
    trigger_condition: {
      lead_id_exists: true,
    },
    actions: [
      'link SalesDeals.lead_id → SalesLeads record',
      'set SalesLeads.status = converted',
      'create SalesActivities { type: note, notes: "Deal created from lead", date: today }',
    ],
    creates: ['SalesActivities'],
    updates: ['SalesLeads.status'],
    notifications: ['optional: deal created alert → deal.assigned_to'],
    agent_runs: [],
    duplicate_prevention: 'skip if open SalesDeal already exists for same lead_id',
  },

  AUTO_004_proposal_sent: {
    name: 'Proposal Sent',
    tier: 1,
    trigger_entity: 'Proposals',
    trigger_type: 'record_updated',
    trigger_condition: {
      status_transition: { from: ['draft', 'review'], to: 'sent' },
    },
    actions: [
      'create SalesActivities { type: proposal_sent, date: today }',
      'set SalesDeals.stage = proposal_sent where deal_id matches',
      'log sent_at timestamp on Proposal',
    ],
    creates: ['SalesActivities'],
    updates: ['SalesDeals.stage'],
    notifications: [
      'email: proposal ready → prospect email',
      'internal: proposal sent alert → sales rep',
    ],
    agent_runs: [],
    duplicate_prevention: 'only fire on actual status transition, not every update',
  },

  AUTO_005_deal_closed_won: {
    name: 'Deal Closed Won — Client Bootstrap',
    tier: 1,
    priority: 'CRITICAL',
    trigger_entity: 'SalesDeals',
    trigger_type: 'record_updated',
    trigger_condition: {
      status_transition: { from: '*', to: 'closed_won' },
      converted_company_id_empty: true,
    },
    actions: [
      'create ClientCompanies { company_name, status: trial, plan_id }',
      'create ClientSubscriptions { company_id, status: trialing, plan_id }',
      'invite Users { email: deal.email, role: client }',
      'create ClientSettings { company_id, defaults }',
      'create Campaigns { company_id, status: draft, name: "Initial Campaign" }',
      'create AgentTasks { company_id, agent_id: onboarding_agent, task_type: onboarding_setup }',
      'create ClientActivityLog { company_id, event_type: company_created }',
      'set SalesDeals.converted_company_id = new ClientCompanies.id',
      'set SalesLeads.status = converted',
    ],
    creates: [
      'ClientCompanies',
      'ClientSubscriptions',
      'Users (invite)',
      'ClientSettings',
      'Campaigns',
      'AgentTasks',
      'ClientActivityLog',
    ],
    updates: ['SalesDeals.converted_company_id', 'SalesLeads.status'],
    notifications: [
      'internal: closed-won celebration alert',
      'email: welcome email → new client',
      'email: onboarding start → new client',
    ],
    agent_runs: ['Onboarding Agent'],
    duplicate_prevention: 'HARD CHECK: skip entirely if converted_company_id already set on this deal. Require company_name + plan_id before running.',
  },

  AUTO_006_deal_closed_lost: {
    name: 'Deal Closed Lost',
    tier: 1,
    trigger_entity: 'SalesDeals',
    trigger_type: 'record_updated',
    trigger_condition: {
      status_transition: { from: '*', to: 'closed_lost' },
    },
    actions: [
      'create SalesActivities { type: note, notes: deal.lost_reason, date: today }',
      'set SalesLeads.status = nurture if lead_id exists',
    ],
    creates: ['SalesActivities'],
    updates: ['SalesLeads.status'],
    notifications: ['optional internal: lost deal alert'],
    agent_runs: [],
    duplicate_prevention: 'only fire once per closed_lost transition',
  },

  AUTO_007_direct_signup: {
    name: 'Direct Signup Created',
    tier: 1,
    trigger_entity: 'ClientCompanies',
    trigger_type: 'record_created',
    trigger_condition: {
      source: 'direct_signup',
      owner_user_id_exists: true,
    },
    actions: [
      'create ClientSettings { company_id, defaults }',
      'create ClientSubscriptions { company_id, status: trialing, plan_id }',
      'create ClientPortalVisibilitySettings { company_id, all sections visible }',
      'create ClientApprovalPolicies { company_id, defaults }',
      'create Campaigns { company_id, status: draft, name: "Initial Campaign" }',
      'create AgentTasks { company_id, task_type: onboarding_setup }',
      'create ClientActivityLog { company_id, event_type: company_created }',
      'set ClientCompanies.status = trial',
    ],
    creates: [
      'ClientSettings',
      'ClientSubscriptions',
      'ClientPortalVisibilitySettings',
      'ClientApprovalPolicies',
      'Campaigns',
      'AgentTasks',
      'ClientActivityLog',
    ],
    updates: ['ClientCompanies.status'],
    notifications: [
      'email: welcome → owner email',
      'internal: new signup alert',
    ],
    agent_runs: ['Onboarding Agent'],
    duplicate_prevention: 'only once per company_id — check ClientSettings existence before running',
  },

  AUTO_008_reseller_signup_attribution: {
    name: 'Reseller Signup Attribution',
    tier: 1,
    trigger_entity: 'ClientCompanies',
    trigger_type: 'record_created',
    trigger_condition: {
      reseller_id_exists: true,
      reseller_client_not_linked: true,
    },
    actions: [
      'create ResellerClients { reseller_id, company_id, status: active }',
      'set ClientCompanies.reseller_id = reseller_id',
      'copy WhiteLabelBranding defaults from reseller if white_label_enabled',
    ],
    creates: ['ResellerClients'],
    updates: ['ClientCompanies.reseller_id'],
    notifications: [
      'internal: new reseller client alert → reseller contact',
      'optional: admin alert',
    ],
    agent_runs: [],
    duplicate_prevention: 'skip if ClientCompanies.reseller_id already set for this company',
  },

  AUTO_009_onboarding_completed: {
    name: 'Onboarding Submitted / Completed',
    tier: 1,
    trigger_entity: 'ClientCompanies',
    trigger_type: 'record_updated',
    trigger_condition: {
      field_transition: { field: 'onboarding_status', from: '*', to: 'completed' },
    },
    actions: [
      'create SeoProjects { company_id, status: setup }',
      'create ReviewProfiles { company_id, platform: google }',
      'create ContentCalendar shell records for first 30 days',
      'create WebsiteProjects { company_id } if website_service selected',
      'create AgentTasks for seo_agent, social_agent, video_agent, review_agent',
      'set ClientCompanies.status = active',
      'set Campaigns.status = active where company_id matches',
    ],
    creates: ['SeoProjects', 'ReviewProfiles', 'ContentCalendar', 'WebsiteProjects', 'AgentTasks'],
    updates: ['ClientCompanies.status', 'Campaigns.status'],
    notifications: [
      'email: onboarding complete → client',
      'internal: fulfillment kickoff alert',
    ],
    agent_runs: ['SEO Agent', 'Social Agent', 'Video Agent', 'Review Agent'],
    duplicate_prevention: 'only fire on FIRST transition to completed — check AgentTasks existence before creating',
  },

  // ══════════════════════════════════════════════════════════════
  // BILLING AUTOMATIONS
  // ══════════════════════════════════════════════════════════════

  AUTO_010_subscription_activated: {
    name: 'Subscription Activated',
    tier: 1,
    trigger_entity: 'ClientSubscriptions',
    trigger_type: 'record_updated',
    trigger_condition: {
      status_transition: { from: ['trialing', 'past_due', 'incomplete'], to: 'active' },
    },
    actions: [
      'set ClientCompanies.status = active if not already',
      'create ClientActivityLog { company_id, event_type: billing_updated }',
    ],
    creates: ['ClientActivityLog'],
    updates: ['ClientCompanies.status'],
    notifications: [
      'email: subscription activated → client billing contact',
      'optional internal: billing activation alert',
    ],
    agent_runs: [],
    duplicate_prevention: 'only fire on transition INTO active, not on every active update',
  },

  AUTO_011_invoice_paid: {
    name: 'Invoice Paid',
    tier: 1,
    trigger_entity: 'BillingInvoices',
    trigger_type: 'record_updated',
    trigger_condition: {
      status_transition: { from: '*', to: 'paid' },
    },
    actions: [
      'create FinanceTransactions { type: revenue, category: subscription, company_id, amount, date: today }',
      'restore ClientSubscriptions.status = active if past_due',
      'restore ClientCompanies.status = active if suspended for billing',
      'trigger AUTO_014 if company has reseller_id',
    ],
    creates: ['FinanceTransactions'],
    updates: ['ClientSubscriptions.status', 'ClientCompanies.status'],
    notifications: [
      'email: payment receipt → client billing contact',
    ],
    agent_runs: [],
    duplicate_prevention: 'one FinanceTransaction per stripe_invoice_id — check before creating',
  },

  AUTO_012_payment_failed: {
    name: 'Payment Failed',
    tier: 1,
    trigger_entity: 'BillingInvoices',
    trigger_type: 'record_updated',
    trigger_condition: {
      status_transition: { from: '*', to: ['open', 'uncollectible'] },
      payment_attempt_failed: true,
    },
    actions: [
      'set ClientSubscriptions.status = past_due',
      'set ClientCompanies.status = past_due',
      'increment BillingCustomers.failed_payment_count',
      'create ClientActivityLog { event_type: billing_updated }',
      'create AgentTasks { task_type: billing_reminder } if failed_count <= 3',
    ],
    creates: ['ClientActivityLog', 'AgentTasks'],
    updates: ['ClientSubscriptions.status', 'ClientCompanies.status'],
    notifications: [
      'email: payment failed → client billing contact',
      'email: retry reminder (day 3, day 7)',
      'internal: payment failed alert',
    ],
    agent_runs: ['Billing Reminder Agent (optional)'],
    duplicate_prevention: 'fire once per billing cycle state change — not on every webhook retry',
  },

  AUTO_013_subscription_suspended: {
    name: 'Subscription Suspended',
    tier: 1,
    trigger_entity: 'ClientSubscriptions',
    trigger_type: 'record_updated',
    trigger_condition: {
      status_transition: { from: 'past_due', to: 'suspended' },
      manual_override_false: true,
    },
    actions: [
      'set ClientCompanies.status = suspended',
      'create ClientActivityLog { event_type: billing_updated, notes: "Account suspended" }',
    ],
    creates: ['ClientActivityLog'],
    updates: ['ClientCompanies.status'],
    notifications: [
      'email: suspension notice → client owner',
      'internal: suspension alert',
      'reseller notice if reseller_id exists',
    ],
    agent_runs: [],
    duplicate_prevention: 'do not suspend if manual_override flag is true on this subscription',
  },

  // ══════════════════════════════════════════════════════════════
  // TIER 2 — FULFILLMENT LOOP
  // ══════════════════════════════════════════════════════════════

  AUTO_014_reseller_revenue_calc: {
    name: 'Reseller Revenue Calculation',
    tier: 1,
    trigger_entity: 'BillingInvoices',
    trigger_type: 'record_updated',
    trigger_condition: {
      status_transition: { from: '*', to: 'paid' },
      company_has_reseller_id: true,
    },
    actions: [
      'lookup reseller commission_rate from ResellerAccounts or ResellerClients override',
      'create ResellerRevenue { reseller_id, company_id, gross_revenue: invoice.amount, commission_amount, period_label, payout_status: pending }',
    ],
    creates: ['ResellerRevenue'],
    updates: [],
    notifications: ['optional: earnings notification → reseller contact'],
    agent_runs: [],
    duplicate_prevention: 'one ResellerRevenue record per stripe_invoice_id — check before creating',
  },

  AUTO_015_payout_processed: {
    name: 'Payout Processed',
    tier: 1,
    trigger_entity: 'Payouts',
    trigger_type: 'record_updated',
    trigger_condition: {
      status_transition: { from: '*', to: 'paid' },
    },
    actions: [
      'set ResellerRevenue.payout_status = paid for all linked records',
      'set ResellerRevenue.paid_at = today',
      'create FinanceTransactions { type: commission, amount: payout.commission_amount }',
    ],
    creates: ['FinanceTransactions'],
    updates: ['ResellerRevenue.payout_status', 'ResellerRevenue.paid_at'],
    notifications: ['email: payout statement → reseller contact'],
    agent_runs: [],
    duplicate_prevention: 'one application per payout_id',
  },

  AUTO_016_campaign_created: {
    name: 'Campaign Created — Fulfillment Kickoff',
    tier: 2,
    trigger_entity: 'Campaigns',
    trigger_type: 'record_created',
    trigger_condition: {
      status: ['active', 'scheduled'],
      company_id_exists: true,
    },
    actions: [
      'create AgentTasks { company_id, campaign_id, task_type: generate_social_posts, status: queued }',
      'create AgentTasks { company_id, campaign_id, task_type: generate_blog, status: queued }',
      'create AgentTasks { company_id, campaign_id, task_type: generate_video, status: queued }',
      'create ClientActivityLog { event_type: system_event, notes: "Campaign kickoff" }',
    ],
    creates: ['AgentTasks', 'ClientActivityLog'],
    updates: [],
    notifications: ['internal: fulfillment kickoff alert optional'],
    agent_runs: [],
    duplicate_prevention: 'one kickoff bundle per campaign_id — check AgentTasks for same campaign_id before creating',
  },

  AUTO_017_social_content_generation: {
    name: 'Social Content Generation',
    tier: 2,
    trigger_entity: 'AgentTasks',
    trigger_type: 'queued_agent_task',
    trigger_condition: {
      task_type: 'generate_social_posts',
      status: 'queued',
    },
    actions: [
      'run Social Agent with company_id context and content preferences',
      'create SocialPosts { company_id, campaign_id, status: pending_approval or auto_approved }',
      'create AgentRuns { company_id, agent_id, task_id, status: completed }',
      'write AgentLogs',
      'set AgentTasks.status = completed',
      'update ContentCalendar if auto_schedule enabled',
    ],
    creates: ['SocialPosts', 'AgentRuns', 'AgentLogs'],
    updates: ['AgentTasks.status', 'ContentCalendar.status'],
    notifications: ['client: new posts ready for review if approval required'],
    agent_runs: ['Social Agent'],
    duplicate_prevention: 'idempotency key = task_id; do not generate if AgentRuns already exist for this task_id',
  },

  AUTO_018_blog_generation: {
    name: 'Blog Generation',
    tier: 2,
    trigger_entity: 'AgentTasks',
    trigger_type: 'queued_agent_task',
    trigger_condition: {
      task_type: 'generate_blog',
      status: 'queued',
    },
    actions: [
      'run SEO Agent with company_id, target keyword, seo_project_id context',
      'create BlogPosts { company_id, status: draft, seo_project_id if available }',
      'create AgentRuns + AgentLogs',
      'set AgentTasks.status = completed',
    ],
    creates: ['BlogPosts', 'AgentRuns', 'AgentLogs'],
    updates: ['AgentTasks.status'],
    notifications: ['client: blog draft ready for review if approval required'],
    agent_runs: ['SEO Agent'],
    duplicate_prevention: 'one primary draft per task_id unless task_type contains revision keyword',
  },

  AUTO_019_video_generation: {
    name: 'Video Generation',
    tier: 2,
    trigger_entity: 'AgentTasks',
    trigger_type: 'queued_agent_task',
    trigger_condition: {
      task_type: 'generate_video',
      status: 'queued',
    },
    actions: [
      'run Video Agent with company_id, campaign_id, script context',
      'create Videos { company_id, status: pending_review }',
      'create CreativeAssets for any output files',
      'create AgentRuns + AgentLogs',
      'set AgentTasks.status = completed',
    ],
    creates: ['Videos', 'CreativeAssets', 'AgentRuns', 'AgentLogs'],
    updates: ['AgentTasks.status'],
    notifications: ['client: video ready for review'],
    agent_runs: ['Video Agent'],
    duplicate_prevention: 'idempotency key = task_id; skip if AgentRuns exist for this task_id',
  },

  AUTO_020_content_approved: {
    name: 'Content Approved',
    tier: 2,
    trigger_entity: ['SocialPosts', 'BlogPosts', 'Videos'],
    trigger_type: 'record_updated',
    trigger_condition: {
      field_transition: { field: 'status', from: 'pending_approval', to: 'approved' },
    },
    actions: [
      'set content.status = scheduled or published',
      'update ContentCalendar record to scheduled if applicable',
      'create ClientActivityLog { event_type: content_approved }',
    ],
    creates: ['ClientActivityLog'],
    updates: ['content.status', 'ContentCalendar.status'],
    notifications: [
      'approval confirmation to approver',
      'optional: publishing scheduled notification',
    ],
    agent_runs: [],
    duplicate_prevention: 'only fire on status transition from pending_approval → approved',
  },

  AUTO_021_revision_requested: {
    name: 'Revision Requested',
    tier: 2,
    trigger_entity: ['SocialPosts', 'BlogPosts', 'Videos'],
    trigger_type: 'record_updated',
    trigger_condition: {
      field_transition: { field: 'status', from: 'pending_approval', to: 'revision_requested' },
    },
    actions: [
      'create AgentTasks { company_id, task_type: revision, related_entity_id, notes: revision notes }',
      'set content.status = needs_revision',
    ],
    creates: ['AgentTasks'],
    updates: ['content.status'],
    notifications: ['internal: revision received alert'],
    agent_runs: ['corresponding content agent via new queued task'],
    duplicate_prevention: 'only one open revision AgentTask per content item — check before creating',
  },

  // ══════════════════════════════════════════════════════════════
  // SEO / WEBSITE / ADA
  // ══════════════════════════════════════════════════════════════

  AUTO_022_seo_project_kickoff: {
    name: 'SEO Project Kickoff',
    tier: 2,
    trigger_entity: 'SeoProjects',
    trigger_type: 'record_created',
    trigger_condition: {
      status: 'setup',
      company_id_exists: true,
    },
    actions: [
      'create AgentTasks { company_id, seo_project_id, task_type: keyword_research, status: queued }',
      'create AgentTasks { company_id, seo_project_id, task_type: page_audit, status: queued }',
      'set SeoProjects.status = active',
    ],
    creates: ['AgentTasks'],
    updates: ['SeoProjects.status'],
    notifications: ['internal: SEO project kickoff alert'],
    agent_runs: [],
    duplicate_prevention: 'one kickoff AgentTask set per seo_project_id',
  },

  AUTO_023_keyword_research: {
    name: 'Keyword Research Output',
    tier: 2,
    trigger_entity: 'AgentTasks',
    trigger_type: 'queued_agent_task',
    trigger_condition: {
      task_type: 'keyword_research',
      status: 'queued',
    },
    actions: [
      'run SEO Agent keyword research',
      'create SeoKeywords batch { company_id, seo_project_id }',
      'create AgentRuns + AgentLogs',
      'set AgentTasks.status = completed',
    ],
    creates: ['SeoKeywords', 'AgentRuns', 'AgentLogs'],
    updates: ['AgentTasks.status'],
    notifications: ['optional internal: keyword research complete'],
    agent_runs: ['SEO Agent'],
    duplicate_prevention: 'one batch per task_id',
  },

  AUTO_024_ada_audit_requested: {
    name: 'ADA Audit Requested',
    tier: 2,
    trigger_entity: 'ADAAudits',
    trigger_type: 'record_created',
    trigger_condition: {
      company_id_exists: true,
      website_url_exists: true,
    },
    actions: [
      'create AgentTasks { company_id, task_type: ada_audit, ada_audit_id, status: queued }',
      'create ClientActivityLog { event_type: system_event }',
      'set ADAAudits.status = in_progress',
    ],
    creates: ['AgentTasks', 'ClientActivityLog'],
    updates: ['ADAAudits.status'],
    notifications: ['email: audit request received → client'],
    agent_runs: ['ADA Audit Agent (when built)'],
    duplicate_prevention: 'prevent multiple open audits for same website_url unless previous is completed',
  },

  // ══════════════════════════════════════════════════════════════
  // REVIEWS
  // ══════════════════════════════════════════════════════════════

  AUTO_025_new_review: {
    name: 'New Review Synced',
    tier: 2,
    trigger_entity: 'Reviews',
    trigger_type: 'record_created',
    trigger_condition: {
      responded: false,
    },
    actions: [
      'run sentiment analysis → set Reviews.sentiment',
      'if rating <= 2: flag as urgent, alert admin immediately',
      'if auto_respond_enabled: create AgentTasks { task_type: review_response }',
      'create ClientNotifications { type: review_received }',
    ],
    creates: ['AgentTasks', 'ClientNotifications'],
    updates: ['Reviews.sentiment'],
    notifications: [
      'urgent: negative review alert → admin if rating <= 2',
      'client: new review notification',
    ],
    agent_runs: ['Review Agent (if auto_respond_enabled)'],
    duplicate_prevention: 'one response AgentTask per review_id — check before creating',
  },

  AUTO_026_review_response_approved: {
    name: 'Review Response Approved',
    tier: 2,
    trigger_entity: 'ReviewResponses',
    trigger_type: 'record_updated',
    trigger_condition: {
      status_transition: { from: 'draft', to: 'approved' },
    },
    actions: [
      'queue publishing of response to review platform',
      'set Reviews.responded = true',
      'create ClientActivityLog',
    ],
    creates: ['ClientActivityLog'],
    updates: ['Reviews.responded', 'ReviewResponses.status'],
    notifications: ['confirmation to approver/internal team'],
    agent_runs: [],
    duplicate_prevention: 'only on first approved transition',
  },

  // ══════════════════════════════════════════════════════════════
  // TIER 3 — SUPPORT / STABILITY
  // ══════════════════════════════════════════════════════════════

  AUTO_027_support_ticket_created: {
    name: 'Support Ticket Created',
    tier: 3,
    trigger_entity: 'SupportTickets',
    trigger_type: 'record_created',
    trigger_condition: {
      subject_exists: true,
      company_id_exists: true,
    },
    actions: [
      'set SupportTickets.status = open',
      'assign default priority if missing',
      'create ClientNotifications { type: support_reply } for assigned support agent',
    ],
    creates: ['ClientNotifications'],
    updates: ['SupportTickets.status', 'SupportTickets.priority'],
    notifications: [
      'email: ticket receipt → submitter',
      'internal: new ticket alert → support queue',
    ],
    agent_runs: [],
    duplicate_prevention: 'optional: skip if same subject + user within 10 minutes',
  },

  AUTO_028_ticket_overdue: {
    name: 'Ticket Overdue (SLA Breach)',
    tier: 3,
    trigger_entity: 'SupportTickets',
    trigger_type: 'scheduled_check',
    trigger_condition: {
      status: 'open',
      age_exceeds_sla_hours: true,
      no_recent_staff_reply: true,
    },
    actions: [
      'escalate SupportTickets.priority',
      'notify support manager',
    ],
    creates: [],
    updates: ['SupportTickets.priority'],
    notifications: ['internal: overdue ticket alert → support manager'],
    agent_runs: [],
    duplicate_prevention: 'once per escalation tier per ticket',
  },

  AUTO_029_agent_task_failure: {
    name: 'Agent Task Failure — Retry + Alert',
    tier: 3,
    trigger_entity: 'AgentTasks',
    trigger_type: 'record_updated',
    trigger_condition: {
      status_transition: { from: 'running', to: 'failed' },
    },
    actions: [
      'write AgentLogs { level: error }',
      'if retry_count < max_retries (3): create new AgentTasks retry clone, reset status = queued',
      'if retry_count >= max_retries: set status = failed permanent, notify admin',
    ],
    creates: ['AgentLogs', 'AgentTasks (retry clone)'],
    updates: ['AgentTasks.status', 'AgentTasks.retry_count'],
    notifications: ['internal: agent failure alert (on permanent failure only)'],
    agent_runs: ['retry of same agent if below threshold'],
    duplicate_prevention: 'max_retries = 3, minimum 5 minute cooldown between retries',
  },

  AUTO_030_hourly_health_check: {
    name: 'Hourly System Health Check',
    tier: 3,
    trigger_entity: 'SystemHealthCheck',
    trigger_type: 'scheduled_check',
    trigger_condition: {
      schedule: 'every 1 hour',
    },
    actions: [
      'test auth service',
      'test database connectivity',
      'test Stripe connection',
      'test AI service',
      'test email service',
      'upsert SystemHealthCheck record with results',
    ],
    creates: ['SystemHealthCheck (upsert)'],
    updates: ['SystemHealthCheck.overall_status', 'SystemHealthCheck.run_at'],
    notifications: ['admin alert on critical or degraded status (suppress repeat alerts for same error)'],
    agent_runs: [],
    duplicate_prevention: 'deduplicate repeated alerts for same persistent error — alert once, not every hour',
  },

  AUTO_031_content_performance_sync: {
    name: 'Content Performance Sync',
    tier: 3,
    trigger_entity: 'AnalyticsSocial',
    trigger_type: 'scheduled_check',
    trigger_condition: {
      schedule: 'daily',
      published_content_exists: true,
    },
    actions: [
      'pull latest engagement metrics per connected platform',
      'create or update AnalyticsSocial record per company/platform/date',
    ],
    creates: ['AnalyticsSocial'],
    updates: ['AnalyticsSocial (daily aggregate)'],
    notifications: [],
    agent_runs: [],
    duplicate_prevention: 'one aggregate record per company_id + platform + date',
  },

  AUTO_032_monthly_client_report: {
    name: 'Monthly Client Performance Report',
    tier: 3,
    trigger_entity: 'ClientNotifications',
    trigger_type: 'scheduled_check',
    trigger_condition: {
      schedule: 'first day of month at 08:00',
      company_status: 'active',
    },
    actions: [
      'aggregate AnalyticsTraffic, AnalyticsSocial, AnalyticsLeads, AnalyticsRevenue for prior month',
      'create ClientNotifications { type: report_ready } per active company',
      'send monthly performance summary email',
    ],
    creates: ['ClientNotifications'],
    updates: [],
    notifications: ['email: monthly performance summary → client contacts'],
    agent_runs: ['Reporting Agent (optional later)'],
    duplicate_prevention: 'one report notification per company per calendar month',
  },

};

// ══════════════════════════════════════════════════════════════════
// CANONICAL TRIGGER TYPE REGISTRY
// Only these 4 types are allowed. No exceptions.
// ══════════════════════════════════════════════════════════════════

export const ALLOWED_TRIGGER_TYPES = {
  record_created:    'Entity record was just created',
  record_updated:    'Entity field/status transitioned — must specify from/to values',
  scheduled_check:   'Time-based job — must specify schedule cadence',
  queued_agent_task: 'AgentTask with matching task_type + status=queued was detected',
};

// ══════════════════════════════════════════════════════════════════
// DUPLICATE PREVENTION GOLDEN RULES
// ══════════════════════════════════════════════════════════════════

export const IDEMPOTENCY_RULES = [
  'One ClientCompany per closed-won SalesDeal (check converted_company_id)',
  'One ResellerRevenue record per stripe_invoice_id',
  'One FinanceTransaction per stripe_invoice_id',
  'One onboarding setup batch per company_id (check ClientSettings existence)',
  'One AgentTask kickoff set per campaign_id',
  'One AgentTask kickoff set per seo_project_id',
  'One content generation run per task_id (check AgentRuns by task_id)',
  'One revision AgentTask per content item at a time',
  'One monthly report notification per company per calendar month',
  'One ResellerClient per company_id (check before creating)',
];

// ══════════════════════════════════════════════════════════════════
// BUILD PRIORITY TIERS
// ══════════════════════════════════════════════════════════════════

export const BUILD_ORDER = {
  tier_1_revenue_loop: [
    'AUTO_001_new_lead_intake',
    'AUTO_005_deal_closed_won',
    'AUTO_007_direct_signup',
    'AUTO_010_subscription_activated',
    'AUTO_011_invoice_paid',
    'AUTO_012_payment_failed',
  ],
  tier_2_fulfillment_loop: [
    'AUTO_009_onboarding_completed',
    'AUTO_016_campaign_created',
    'AUTO_017_social_content_generation',
    'AUTO_019_video_generation',
    'AUTO_018_blog_generation',
    'AUTO_020_content_approved',
  ],
  tier_3_scale_stability: [
    'AUTO_008_reseller_signup_attribution',
    'AUTO_014_reseller_revenue_calc',
    'AUTO_027_support_ticket_created',
    'AUTO_029_agent_task_failure',
    'AUTO_030_hourly_health_check',
    'AUTO_032_monthly_client_report',
  ],
};

export default AUTOMATION_TRIGGER_MAP;
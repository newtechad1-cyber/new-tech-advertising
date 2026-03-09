/**
 * NTA CANONICAL PAGE-TO-ENTITY MAP
 * ─────────────────────────────────────────────────────────────────
 * This is the authoritative platform structure reference.
 * Every page is defined with:
 *   - access_roles     → who can view this page
 *   - primary_entity   → the main entity this page manages
 *   - read_entities    → entities read/displayed on this page
 *   - write_entities   → entities this page is allowed to write to
 *   - allowed_actions  → explicit user actions permitted
 *   - automations      → triggers fired from this page
 *
 * RULES:
 *   1. All client pages must filter all queries by company_id
 *   2. All reseller pages must filter by reseller_id + linked company_id
 *   3. Admin pages may query across all entities
 *   4. Cross-module writes happen via AutomationRules, not page logic
 *   5. company_id is always the central ownership key
 * ─────────────────────────────────────────────────────────────────
 */

export const PAGE_ENTITY_MAP = {

  // ── PUBLIC / MARKETING ─────────────────────────────────────────

  '/': {
    label: 'Home',
    access_roles: ['public'],
    primary_entity: 'Plans',
    read_entities: ['Plans'],
    write_entities: [],
    allowed_actions: ['view_pricing', 'click_cta'],
    automations: [],
  },

  '/pricing': {
    label: 'Pricing',
    access_roles: ['public'],
    primary_entity: 'Plans',
    read_entities: ['Plans'],
    write_entities: [],
    allowed_actions: ['view_plans', 'click_start_trial', 'click_book_call'],
    automations: [],
  },

  '/start': {
    label: 'Get Started / Trial Signup',
    access_roles: ['public'],
    primary_entity: 'SalesLeads',
    read_entities: ['Plans', 'ResellerSignupLinks'],
    write_entities: ['SalesLeads', 'Users', 'ClientCompanies'],
    allowed_actions: ['submit_trial_form', 'select_plan'],
    automations: [
      'TRIGGER: SalesLead created → notify sales team',
      'TRIGGER: SalesLead created + reseller link → attach to ResellerClients',
      'TRIGGER: ClientCompany created → create ClientSettings record',
      'TRIGGER: ClientCompany created → queue onboarding agent',
    ],
  },

  '/demo': {
    label: 'Book Demo',
    access_roles: ['public'],
    primary_entity: 'SalesLeads',
    read_entities: [],
    write_entities: ['SalesLeads', 'SalesActivities'],
    allowed_actions: ['submit_demo_request', 'book_call'],
    automations: [
      'TRIGGER: SalesLead created (source=demo) → notify sales rep',
      'TRIGGER: SalesActivity demo_scheduled → update SalesDeal stage',
    ],
  },

  '/login': {
    label: 'Login',
    access_roles: ['public'],
    primary_entity: 'Users',
    read_entities: ['Users'],
    write_entities: [],
    allowed_actions: ['authenticate'],
    automations: [
      'TRIGGER: Login → write ClientActivityLog event_type=login',
    ],
  },

  '/signup': {
    label: 'Signup',
    access_roles: ['public'],
    primary_entity: 'Users',
    read_entities: ['Plans', 'ResellerSignupLinks'],
    write_entities: ['Users', 'ClientCompanies', 'ClientSubscriptions'],
    allowed_actions: ['create_account', 'select_plan', 'enter_payment'],
    automations: [
      'TRIGGER: ClientSubscription created → activate ClientCompany status=trial',
      'TRIGGER: ClientSubscription created → create Stripe customer + subscription',
      'TRIGGER: ClientCompany created → create ClientSettings record',
      'TRIGGER: ClientCompany created → create default ClientPortalVisibilitySettings',
      'TRIGGER: ClientCompany created → queue onboarding agent run',
      'TRIGGER: reseller_id present → create ResellerClient record',
    ],
  },

  '/onboarding': {
    label: 'Client Onboarding',
    access_roles: ['client', 'admin'],
    primary_entity: 'ClientCompanies',
    read_entities: ['ClientCompanies', 'ClientSettings', 'Plans'],
    write_entities: [
      'ClientCompanies',
      'ClientSettings',
      'Campaigns',
      'ClientApprovalPolicies',
      'ClientPortalVisibilitySettings',
    ],
    allowed_actions: [
      'complete_business_profile',
      'set_brand_settings',
      'select_content_preferences',
      'configure_approval_policy',
      'connect_social_accounts',
    ],
    automations: [
      'TRIGGER: onboarding_completed → create first Campaign',
      'TRIGGER: onboarding_completed → trigger social_agent first content run',
      'TRIGGER: onboarding_completed → trigger seo_agent setup run',
      'TRIGGER: onboarding_completed → update ClientCompany status=active',
      'TRIGGER: onboarding_completed → write ClientActivityLog onboarding_step_completed',
    ],
  },

  // ── CLIENT PORTAL ──────────────────────────────────────────────

  '/client': {
    label: 'Client Portal Root',
    access_roles: ['client', 'client_owner', 'admin'],
    primary_entity: 'ClientCompanies',
    read_entities: ['ClientCompanies', 'ClientSubscriptions'],
    write_entities: [],
    allowed_actions: ['navigate_portal'],
    automations: [],
    filter_rule: 'MUST filter all queries by company_id',
  },

  '/client/dashboard': {
    label: 'Client Dashboard',
    access_roles: ['client', 'client_owner', 'admin'],
    primary_entity: 'ClientCompanies',
    read_entities: [
      'ClientCompanies',
      'Campaigns',
      'AnalyticsTraffic',
      'AnalyticsSocial',
      'AgentTasks',
      'ClientNotifications',
      'SupportTickets',
    ],
    write_entities: [],
    allowed_actions: ['view_summary', 'dismiss_notification', 'view_pending_tasks'],
    automations: [],
    filter_rule: 'MUST filter all queries by company_id',
  },

  '/client/profile': {
    label: 'Client Business Profile',
    access_roles: ['client', 'client_owner', 'admin'],
    primary_entity: 'ClientCompanies',
    read_entities: ['ClientCompanies', 'ClientSettings', 'CreativeAssets'],
    write_entities: ['ClientCompanies', 'ClientSettings', 'CreativeAssets'],
    allowed_actions: ['update_business_info', 'upload_logo', 'update_brand_settings'],
    automations: [
      'TRIGGER: ClientCompany updated → write ClientActivityLog settings_changed',
    ],
    filter_rule: 'MUST filter all queries by company_id',
  },

  '/client/settings': {
    label: 'Client Portal Settings',
    access_roles: ['client_owner', 'admin'],
    primary_entity: 'ClientSettings',
    read_entities: [
      'ClientSettings',
      'UserRoleAssignments',
      'ClientApprovalPolicies',
      'ClientPortalVisibilitySettings',
    ],
    write_entities: [
      'ClientSettings',
      'UserRoleAssignments',
      'ClientApprovalPolicies',
      'ClientPortalVisibilitySettings',
    ],
    allowed_actions: [
      'update_notification_prefs',
      'manage_portal_users',
      'set_approval_policy',
      'toggle_portal_sections',
    ],
    automations: [
      'TRIGGER: settings changed → write ClientActivityLog settings_changed',
    ],
    filter_rule: 'MUST filter all queries by company_id',
  },

  // ── SALES ──────────────────────────────────────────────────────

  '/sales': {
    label: 'Sales Dashboard',
    access_roles: ['admin', 'sales_rep'],
    primary_entity: 'SalesDeals',
    read_entities: ['SalesDeals', 'SalesLeads', 'SalesActivities', 'Proposals'],
    write_entities: [],
    allowed_actions: ['view_pipeline_summary', 'view_lead_metrics'],
    automations: [],
  },

  '/sales/leads': {
    label: 'Sales Leads',
    access_roles: ['admin', 'sales_rep'],
    primary_entity: 'SalesLeads',
    read_entities: ['SalesLeads'],
    write_entities: ['SalesLeads', 'SalesActivities'],
    allowed_actions: ['create_lead', 'update_lead', 'qualify_lead', 'convert_to_deal', 'log_activity'],
    automations: [
      'TRIGGER: SalesLead status=converted → create SalesDeal',
    ],
  },

  '/sales/pipeline': {
    label: 'Sales Pipeline',
    access_roles: ['admin', 'sales_rep'],
    primary_entity: 'SalesDeals',
    read_entities: ['SalesDeals', 'SalesActivities', 'SalesLeads'],
    write_entities: ['SalesDeals', 'SalesActivities'],
    allowed_actions: ['move_stage', 'log_activity', 'update_deal', 'mark_closed_won', 'mark_closed_lost'],
    automations: [
      'TRIGGER: SalesDeal stage=closed_won → create ClientCompany',
      'TRIGGER: SalesDeal stage=closed_won → create ClientSubscription status=trialing',
      'TRIGGER: SalesDeal stage=closed_won → invite user to portal',
      'TRIGGER: SalesDeal stage=closed_won → create onboarding AgentTask',
      'TRIGGER: SalesDeal stage=closed_lost → write SalesActivity stage_change',
    ],
  },

  '/sales/proposals': {
    label: 'Proposals',
    access_roles: ['admin', 'sales_rep'],
    primary_entity: 'Proposals',
    read_entities: ['Proposals', 'SalesDeals', 'Plans'],
    write_entities: ['Proposals', 'SalesActivities'],
    allowed_actions: ['create_proposal', 'send_proposal', 'mark_accepted', 'mark_declined'],
    automations: [
      'TRIGGER: Proposal status=accepted → update SalesDeal stage=closed_won',
      'TRIGGER: Proposal sent → write SalesActivity proposal_sent',
    ],
  },

  // ── BILLING ────────────────────────────────────────────────────

  '/client/billing': {
    label: 'Client Billing',
    access_roles: ['client_owner', 'admin'],
    primary_entity: 'ClientSubscriptions',
    read_entities: ['ClientSubscriptions', 'BillingInvoices', 'BillingTransactions', 'PaymentMethods', 'Plans'],
    write_entities: ['PaymentMethods'],
    allowed_actions: ['view_invoices', 'download_invoice', 'update_payment_method', 'cancel_subscription'],
    automations: [
      'TRIGGER: PaymentMethod updated → notify admin',
      'TRIGGER: subscription cancel_at_period_end=true → write ClientActivityLog',
    ],
    filter_rule: 'MUST filter all queries by company_id',
  },

  '/admin/billing': {
    label: 'Admin Billing',
    access_roles: ['admin'],
    primary_entity: 'ClientSubscriptions',
    read_entities: ['ClientSubscriptions', 'BillingInvoices', 'BillingTransactions', 'ClientCompanies', 'Plans'],
    write_entities: ['ClientSubscriptions', 'BillingInvoices'],
    allowed_actions: [
      'view_all_subscriptions',
      'manually_update_status',
      'retry_failed_payment',
      'issue_credit',
      'cancel_subscription',
    ],
    automations: [
      'TRIGGER: BillingInvoice status=paid → update ClientSubscription status=active',
      'TRIGGER: payment_failed → update ClientCompany status=past_due',
      'TRIGGER: payment_failed → create ClientNotification payment_failed',
      'TRIGGER: payment_failed 3x → update ClientCompany status=suspended',
    ],
  },

  '/admin/finance': {
    label: 'Admin Finance',
    access_roles: ['admin'],
    primary_entity: 'FinanceTransactions',
    read_entities: ['FinanceTransactions', 'Expenses', 'Payouts', 'ResellerRevenue'],
    write_entities: ['FinanceTransactions', 'Expenses', 'Payouts'],
    allowed_actions: ['log_transaction', 'log_expense', 'process_payout', 'export_report'],
    automations: [
      'TRIGGER: Payout status=paid → update ResellerRevenue payout_status=paid',
    ],
  },

  // ── RESELLER ───────────────────────────────────────────────────

  '/reseller': {
    label: 'Reseller Dashboard',
    access_roles: ['reseller', 'admin'],
    primary_entity: 'ResellerAccounts',
    read_entities: ['ResellerAccounts', 'ResellerClients', 'ResellerRevenue'],
    write_entities: [],
    allowed_actions: ['view_summary'],
    automations: [],
    filter_rule: 'MUST filter all queries by reseller_id',
  },

  '/reseller/clients': {
    label: 'Reseller Clients',
    access_roles: ['reseller', 'admin'],
    primary_entity: 'ResellerClients',
    read_entities: ['ResellerClients', 'ClientCompanies', 'ClientSubscriptions'],
    write_entities: ['ResellerClients'],
    allowed_actions: ['view_client', 'update_client_status', 'add_client'],
    automations: [],
    filter_rule: 'MUST filter by reseller_id AND link to company_id',
  },

  '/reseller/revenue': {
    label: 'Reseller Revenue',
    access_roles: ['reseller', 'admin'],
    primary_entity: 'ResellerRevenue',
    read_entities: ['ResellerRevenue', 'Payouts', 'ResellerClients'],
    write_entities: [],
    allowed_actions: ['view_commissions', 'view_payout_history'],
    automations: [],
    filter_rule: 'MUST filter all queries by reseller_id',
  },

  '/reseller/branding': {
    label: 'Reseller Branding',
    access_roles: ['reseller', 'admin'],
    primary_entity: 'ResellerBranding',
    read_entities: ['ResellerBranding', 'ResellerAccounts'],
    write_entities: ['ResellerBranding'],
    allowed_actions: ['update_logo', 'update_colors', 'update_support_contact', 'toggle_powered_by'],
    automations: [],
    filter_rule: 'MUST filter all queries by reseller_id',
  },

  '/reseller/signup-links': {
    label: 'Reseller Signup Links',
    access_roles: ['reseller', 'admin'],
    primary_entity: 'ResellerSignupLinks',
    read_entities: ['ResellerSignupLinks', 'Plans'],
    write_entities: ['ResellerSignupLinks'],
    allowed_actions: ['create_link', 'deactivate_link', 'copy_link', 'view_conversions'],
    automations: [
      'TRIGGER: ResellerSignupLink clicked → increment clicks counter',
      'TRIGGER: Client signup via link → increment conversions + create ResellerClient',
    ],
    filter_rule: 'MUST filter all queries by reseller_id',
  },

  // ── CONTENT ────────────────────────────────────────────────────

  '/client/content': {
    label: 'Content Calendar',
    access_roles: ['client', 'client_owner', 'admin'],
    primary_entity: 'ContentCalendar',
    read_entities: ['ContentCalendar', 'SocialPosts', 'BlogPosts', 'Videos', 'Campaigns'],
    write_entities: ['ContentCalendar'],
    allowed_actions: ['view_calendar', 'reschedule_content', 'approve_content', 'reject_content'],
    automations: [
      'TRIGGER: content approved → update ContentCalendar status=scheduled',
      'TRIGGER: scheduled datetime reached → publish content',
      'TRIGGER: content published → write ClientActivityLog content_approved',
    ],
    filter_rule: 'MUST filter all queries by company_id',
  },

  '/client/social': {
    label: 'Social Posts',
    access_roles: ['client', 'client_owner', 'admin'],
    primary_entity: 'SocialPosts',
    read_entities: ['SocialPosts', 'Campaigns', 'ContentCalendar', 'AnalyticsSocial'],
    write_entities: ['SocialPosts'],
    allowed_actions: ['view_posts', 'approve_post', 'reject_post', 'request_edit', 'view_performance'],
    automations: [
      'TRIGGER: SocialPost approved → schedule to ContentCalendar',
      'TRIGGER: SocialPost published → update AnalyticsSocial',
    ],
    filter_rule: 'MUST filter all queries by company_id',
  },

  '/client/blogs': {
    label: 'Blog Posts',
    access_roles: ['client', 'client_owner', 'admin'],
    primary_entity: 'BlogPosts',
    read_entities: ['BlogPosts', 'Campaigns', 'SeoProjects', 'SeoKeywords'],
    write_entities: ['BlogPosts'],
    allowed_actions: ['view_posts', 'approve_post', 'reject_post', 'request_edit', 'publish'],
    automations: [
      'TRIGGER: BlogPost published → update SeoPage record',
      'TRIGGER: BlogPost published → write ClientActivityLog post_published',
    ],
    filter_rule: 'MUST filter all queries by company_id',
  },

  '/client/videos': {
    label: 'Videos',
    access_roles: ['client', 'client_owner', 'admin'],
    primary_entity: 'Videos',
    read_entities: ['Videos', 'Campaigns', 'CreativeAssets'],
    write_entities: ['Videos'],
    allowed_actions: ['view_videos', 'approve_video', 'reject_video', 'download_video', 'request_revision'],
    automations: [
      'TRIGGER: Video approved → schedule to ContentCalendar',
    ],
    filter_rule: 'MUST filter all queries by company_id',
  },

  '/client/campaigns': {
    label: 'Campaigns',
    access_roles: ['client', 'client_owner', 'admin'],
    primary_entity: 'Campaigns',
    read_entities: ['Campaigns', 'SocialPosts', 'BlogPosts', 'Videos', 'AnalyticsSocial'],
    write_entities: ['Campaigns'],
    allowed_actions: ['view_campaign', 'create_campaign', 'pause_campaign', 'view_performance'],
    automations: [
      'TRIGGER: Campaign created → trigger assigned_agent_id run',
    ],
    filter_rule: 'MUST filter all queries by company_id',
  },

  // ── SEO / WEBSITE / ADA ────────────────────────────────────────

  '/client/seo': {
    label: 'SEO Projects',
    access_roles: ['client', 'client_owner', 'admin'],
    primary_entity: 'SeoProjects',
    read_entities: ['SeoProjects', 'SeoKeywords', 'SeoPages', 'AnalyticsTraffic'],
    write_entities: ['SeoProjects', 'SeoKeywords'],
    allowed_actions: ['view_rankings', 'add_keyword', 'view_pages', 'request_content'],
    automations: [
      'TRIGGER: SeoKeyword added → trigger seo_agent keyword research',
    ],
    filter_rule: 'MUST filter all queries by company_id',
  },

  '/client/website': {
    label: 'Website Projects',
    access_roles: ['client', 'client_owner', 'admin'],
    primary_entity: 'WebsiteProjects',
    read_entities: ['WebsiteProjects', 'CreativeAssets'],
    write_entities: ['WebsiteProjects'],
    allowed_actions: ['view_project_status', 'upload_assets', 'approve_design', 'request_revision'],
    automations: [
      'TRIGGER: WebsiteProject status=launched → write ClientActivityLog',
    ],
    filter_rule: 'MUST filter all queries by company_id',
  },

  '/client/ada': {
    label: 'ADA Compliance',
    access_roles: ['client', 'client_owner', 'admin'],
    primary_entity: 'ADAAudits',
    read_entities: ['ADAAudits', 'WebsiteProjects'],
    write_entities: [],
    allowed_actions: ['view_audit_report', 'download_report', 'request_remediation'],
    automations: [
      'TRIGGER: ADAAudit completed → create ClientNotification report_ready',
    ],
    filter_rule: 'MUST filter all queries by company_id',
  },

  // ── REVIEWS ────────────────────────────────────────────────────

  '/client/reviews': {
    label: 'Reviews',
    access_roles: ['client', 'client_owner', 'admin'],
    primary_entity: 'Reviews',
    read_entities: ['Reviews', 'ReviewProfiles', 'ReviewResponses', 'ReviewCampaigns'],
    write_entities: ['ReviewResponses'],
    allowed_actions: [
      'view_reviews',
      'approve_response',
      'edit_response',
      'publish_response',
      'flag_review',
      'manage_review_campaigns',
    ],
    automations: [
      'TRIGGER: Review received → create ClientNotification review_received',
      'TRIGGER: Review received (negative) → alert admin',
      'TRIGGER: ReviewResponse approved → publish to platform',
    ],
    filter_rule: 'MUST filter all queries by company_id',
  },

  // ── ANALYTICS ─────────────────────────────────────────────────

  '/client/analytics': {
    label: 'Client Analytics',
    access_roles: ['client', 'client_owner', 'admin'],
    primary_entity: 'AnalyticsTraffic',
    read_entities: ['AnalyticsTraffic', 'AnalyticsSocial', 'AnalyticsLeads', 'AnalyticsRevenue'],
    write_entities: [],
    allowed_actions: ['view_traffic', 'view_social_metrics', 'view_leads', 'export_report'],
    automations: [],
    filter_rule: 'MUST filter all queries by company_id',
  },

  '/admin/platform-analytics': {
    label: 'Platform Analytics (Admin)',
    access_roles: ['admin'],
    primary_entity: 'ClientCompanies',
    read_entities: [
      'ClientCompanies',
      'ClientSubscriptions',
      'ResellerRevenue',
      'SalesDeals',
      'FinanceTransactions',
      'AnalyticsRevenue',
    ],
    write_entities: [],
    allowed_actions: ['view_platform_mrr', 'view_churn', 'view_reseller_performance', 'export_report'],
    automations: [],
  },

  // ── AGENTS ─────────────────────────────────────────────────────

  '/admin/agents': {
    label: 'Agent Management',
    access_roles: ['admin'],
    primary_entity: 'AgentDefinitions',
    read_entities: ['AgentDefinitions', 'AgentTasks', 'AgentRuns', 'AgentLogs', 'AutomationRules'],
    write_entities: ['AgentDefinitions', 'AgentTasks', 'AutomationRules'],
    allowed_actions: [
      'create_agent',
      'edit_agent',
      'enable_disable_agent',
      'trigger_manual_run',
      'view_run_logs',
      'create_automation_rule',
      'toggle_automation_rule',
    ],
    automations: [
      'TRIGGER: AgentTask created → run assigned backend function',
      'TRIGGER: AgentRun completed → write AgentLogs',
    ],
  },

  '/admin/system-health': {
    label: 'System Health Monitor',
    access_roles: ['admin'],
    primary_entity: 'SystemHealthChecks',
    read_entities: ['SystemHealthChecks'],
    write_entities: ['SystemHealthChecks'],
    allowed_actions: ['view_status', 'trigger_manual_check'],
    automations: [
      'SCHEDULED: every 1 hour → run runSystemHealthCheck function',
    ],
  },

  // ── SUPPORT ────────────────────────────────────────────────────

  '/client/support': {
    label: 'Client Support',
    access_roles: ['client', 'client_owner', 'admin'],
    primary_entity: 'SupportTickets',
    read_entities: ['SupportTickets', 'SupportMessages'],
    write_entities: ['SupportTickets', 'SupportMessages'],
    allowed_actions: ['open_ticket', 'reply_to_ticket', 'close_ticket', 'rate_support'],
    automations: [
      'TRIGGER: SupportTicket created → notify assigned admin',
      'TRIGGER: SupportMessage created (agent) → create ClientNotification support_reply',
    ],
    filter_rule: 'MUST filter all queries by company_id',
  },

  '/admin/support': {
    label: 'Admin Support Queue',
    access_roles: ['admin'],
    primary_entity: 'SupportTickets',
    read_entities: ['SupportTickets', 'SupportMessages', 'ClientCompanies'],
    write_entities: ['SupportTickets', 'SupportMessages'],
    allowed_actions: [
      'view_all_tickets',
      'assign_ticket',
      'reply_to_ticket',
      'close_ticket',
      'add_internal_note',
      'escalate_ticket',
    ],
    automations: [
      'TRIGGER: SupportTicket resolved → send satisfaction survey',
    ],
  },

};

// ── ROLE DEFINITIONS ─────────────────────────────────────────────
export const ROLES = {
  public:       { label: 'Public',         scope: 'platform' },
  admin:        { label: 'Admin',          scope: 'platform' },
  sales_rep:    { label: 'Sales Rep',      scope: 'platform' },
  client:       { label: 'Client User',    scope: 'company'  },
  client_owner: { label: 'Client Owner',   scope: 'company'  },
  reseller:     { label: 'Reseller',       scope: 'reseller' },
};

// ── AUTOMATION RULE CONSTANTS ────────────────────────────────────
export const AUTOMATION_TRIGGERS = {
  DEAL_CLOSED_WON:          'deal_closed_won',
  COMPANY_CREATED:          'company_created',
  SUBSCRIPTION_ACTIVATED:   'subscription_activated',
  TRIAL_STARTED:            'trial_started',
  ONBOARDING_COMPLETED:     'onboarding_completed',
  PAYMENT_FAILED:           'payment_failed',
  REVIEW_RECEIVED:          'review_received',
  CONTENT_PUBLISHED:        'content_published',
  WEEKLY_SCHEDULE:          'weekly_schedule',
  MONTHLY_SCHEDULE:         'monthly_schedule',
};

// ── FILTER ENFORCEMENT HELPER ────────────────────────────────────
// Use this in every client-facing page to enforce company_id scoping
export function getCompanyFilter(company_id) {
  if (!company_id) throw new Error('company_id is required for client page queries');
  return { company_id };
}

export function getResellerFilter(reseller_id) {
  if (!reseller_id) throw new Error('reseller_id is required for reseller page queries');
  return { reseller_id };
}

export default PAGE_ENTITY_MAP;
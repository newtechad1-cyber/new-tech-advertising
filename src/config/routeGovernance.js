/**
 * Route Governance Registry — R-002
 * Release 0.5.1 — Access Governance & SEO Cleanup
 *
 * Central authority for route classification, access control, and SEO policy.
 * Every route in the application is governed by this registry.
 *
 * ACCESS LEVELS:
 *   public         – No auth required. Indexed by search engines.
 *   auth_required  – Any authenticated user.
 *   client_only    – Authenticated user with client or admin role.
 *   ops_only       – Authenticated user with ops or admin role.
 *   admin_only     – Authenticated user with admin role.
 *   noindex        – Public but excluded from search engines.
 *
 * ROLES: admin, ops, client, student, reseller
 */

// ─── Prefix-based classification ─────────────────────────────────────────────
// Routes are matched by prefix (case-insensitive). Most specific match wins.
// Order matters: more specific prefixes MUST come before less specific ones.

export const ROUTE_PREFIX_RULES = [
  // ── Admin routes ──────────────────────────────────────────────────────────
  { prefix: '/admin',                access: 'admin_only' },

  // ── Agency/Ops routes ─────────────────────────────────────────────────────
  { prefix: '/agency',               access: 'admin_only' },
  { prefix: '/ops',                  access: 'ops_only' },

  // ── NTA operating system ──────────────────────────────────────────────────
  { prefix: '/nta/home',             access: 'public' },       // public marketing
  { prefix: '/nta/demo',             access: 'noindex' },      // demo funnel (public but noindex)
  { prefix: '/nta/diy-growth-system',access: 'public' },       // sales page
  { prefix: '/nta/pricing-ladder',   access: 'public' },       // pricing page
  { prefix: '/nta',                  access: 'admin_only' },

  // ── Client-facing authenticated ───────────────────────────────────────────
  { prefix: '/client',               access: 'client_only' },
  { prefix: '/portal',               access: 'client_only' },
  { prefix: '/c/',                   access: 'client_only' },  // /c/:clientId routes

  // ── Sales / internal ──────────────────────────────────────────────────────
  { prefix: '/sales',                access: 'admin_only' },
  { prefix: '/reseller',             access: 'auth_required' },

  // ── Content management (internal) ─────────────────────────────────────────
  { prefix: '/content-command',      access: 'admin_only' },
  { prefix: '/content-center',       access: 'admin_only' },

  // ── Dashboard legacy redirects ────────────────────────────────────────────
  { prefix: '/dashboard',            access: 'admin_only' },

  // ── Billing ───────────────────────────────────────────────────────────────
  { prefix: '/billing',              access: 'auth_required' },
];

// ─── pages.config.js key prefix classification ───────────────────────────────
// The pages.config auto-generates routes as /{PageKey}. These PascalCase routes
// need the same governance. Matched case-insensitively against the key.

export const PAGE_KEY_PREFIX_RULES = [
  { prefix: 'Admin',                 access: 'admin_only' },
  { prefix: 'NTA',                   access: 'admin_only' },
  { prefix: 'Client',                access: 'client_only' },
  { prefix: 'Reseller',              access: 'auth_required' },
  { prefix: 'Sales',                 access: 'admin_only' },
  { prefix: 'Ops',                   access: 'admin_only' },
  { prefix: 'Agency',                access: 'admin_only' },
  { prefix: 'Portal',                access: 'client_only' },
  { prefix: 'Dashboard',             access: 'admin_only' },
  { prefix: 'Deal',                  access: 'noindex' },      // DealRoom pages — semi-public but noindex
  { prefix: 'Proposal',              access: 'admin_only' },
  { prefix: 'Content',               access: 'admin_only' },
  { prefix: 'Streaming',             access: 'noindex' },      // Streaming intake/onboarding
  { prefix: 'DIY',                   access: 'client_only' },
  { prefix: 'Contributor',           access: 'auth_required' },
  { prefix: 'CRM',                   access: 'admin_only' },
  { prefix: 'Lead',                  access: 'admin_only' },
  { prefix: 'Chatbot',               access: 'admin_only' },
  { prefix: 'Debug',                 access: 'admin_only' },
  { prefix: 'GlobalSettings',        access: 'admin_only' },
  { prefix: 'Settings',              access: 'auth_required' },
  { prefix: 'BusinessIntel',         access: 'admin_only' },
  { prefix: 'BusinessProfile',       access: 'admin_only' },
  { prefix: 'IntelAdmin',            access: 'admin_only' },
  { prefix: 'IndustryIntel',         access: 'admin_only' },
  { prefix: 'LocalMarketIntel',      access: 'admin_only' },
  { prefix: 'LocationPage',          access: 'admin_only' },
  { prefix: 'OpportunitySignal',     access: 'admin_only' },
  { prefix: 'PerformanceSignal',     access: 'admin_only' },
  { prefix: 'Programmatic',          access: 'admin_only' },
  { prefix: 'ScheduledQueue',        access: 'admin_only' },
  { prefix: 'SocialAccounts',        access: 'admin_only' },
  { prefix: 'WeeklyPlan',            access: 'admin_only' },
  { prefix: 'WebsiteVideo',          access: 'admin_only' },
  { prefix: 'WorkflowMap',           access: 'admin_only' },
  { prefix: 'YouTube',               access: 'admin_only' },
  { prefix: 'OauthCallback',         access: 'noindex' },
  { prefix: 'MetaConnect',           access: 'admin_only' },
  { prefix: 'FounderScorecard',      access: 'admin_only' },
  { prefix: 'AIWorkforce',           access: 'admin_only' },
  { prefix: 'AiOperations',          access: 'admin_only' },
  { prefix: 'AgentArchitecture',     access: 'admin_only' },
  { prefix: 'MarketingPlan',         access: 'admin_only' },
  { prefix: 'ChatWidget',            access: 'admin_only' },
  { prefix: 'OperationsHub',         access: 'admin_only' },
  { prefix: 'FunnelPage',            access: 'noindex' },
  { prefix: 'StudentAI',             access: 'auth_required' },
];

// ─── Explicit public page keys (pages.config) ───────────────────────────────
// Pages that should remain publicly accessible and indexed.

export const PUBLIC_PAGE_KEYS = new Set([
  'Home', 'HomePage', 'About', 'Services', 'Pricing', 'Contact', 'Blog',
  'BlogPost', 'Start', 'Free-Audit', 'GettingStarted', 'Get-Started',
  'PrivacyPolicy', 'TermsOfService', 'SiteMap',
  // Industry / vertical marketing pages
  'HvacMarketing', 'HvacIndustry', 'DentistMarketing', 'PlumbingMarketing',
  'RoofingMarketing', 'MedSpaMarketing', 'RestaurantMarketing', 'LocalBusinessMarketing',
  'RestaurantSocialMedia',
  'IndustriesHub', 'IndustriesNonprofits', 'IndustriesProfessionals',
  'IndustriesServiceTrades', 'IndustriesSmallLocal',
  'Industry', 'IndustryNonprofit', 'IndustryNonprofits',
  'IndustryProfessional', 'IndustryProfessionals', 'IndustryServiceTrades',
  'IndustrySmall', 'IndustrySmallLocal', 'IndustryTrades',
  // Service pages
  'AiSeo', 'AiSocialMedia', 'AiSocialMediaSmallBusiness', 'AiWebsites',
  'AiAdvertising', 'AiVideos', 'AiMarketingPlatform', 'AiVideoStudio',
  'AiAccessibilityChecker', 'SocialMediaManagement', 'SocialMediaMarketing',
  'WebsiteRebuild', 'Website-Rebuild', 'Rebuild', 'Rebuild-Intake',
  'RebuildIntake', 'RebuildIntakePretty',
  'Streaming-TV', 'StreamingTV', 'StreamingTvAdvertising', 'TvVideo',
  'TvCommercialScriptGenerator',
  'LocalVisibility',
  // ADA / accessibility
  'Ada', 'Ada-Compliance', 'AdaAccessibility', 'AdaWebsiteCompliance',
  'AdaWebsiteLawsuitPrevention', 'AdaWebsiteRebuild',
  'AdaIntake', 'AdaOnboarding', 'AdaQuote', 'AdaSalesAssistant',
  'AdaSuccess', 'AdaThankYou',
  // Marketing / thought leadership
  'what-changed-online', 'AuthorityMap', 'GrowthSystem',
  // Case studies
  'CaseStudies', 'CaseStudyDetail',
  // School public pages
  'SchoolHome', 'SchoolAbout', 'SchoolEvents', 'SchoolEventDetail',
  'SchoolSpotlights', 'SchoolSpotlightDetail',
  'SchoolStories', 'SchoolStoryDetail', 'SchoolStoryLab',
  'SchoolStoryLabPresentation', 'SchoolSubmit', 'SchoolSubmitGuide',
  'SchoolTV', 'SchoolVideoDetail', 'SchoolYearbook',
  'SchoolYearbookCategory', 'SchoolYearbookGallery',
  'SchoolYearbookPage', 'SchoolYearbookSeason',
  'SchoolStudentLogin', 'SchoolStudentDashboard',
  'SchoolStudentProfile', 'SchoolStudentUploadNew', 'SchoolStudentUploads',
  // BulldogTV public
  'BulldogTV', 'BulldogTVSpotlights', 'BulldogTVStories',
  'BulldogTVSubmissions', 'BulldogTVSubmit', 'BulldogTVVideos',
  'BulldogTVWatch', 'BulldogTVYearbook',
  // Demo pages (public but noindex handled separately)
  'Demo', 'DemoExamples', 'DemoFeatures', 'DemoFlow', 'DemoNext',
  'DemoOverview', 'DemoPlatform', 'DemoPricing', 'DemoProblem',
  'DemoRoi', 'DemoStart',
  'DemoSchoolAbout', 'DemoSchoolChannel', 'DemoSchoolStoryDetail',
  // Onboarding / signup / trial public pages
  'Onboarding', 'OnboardingStart', 'OnboardThankYou', 'signup',
  'StartTrial', 'JoinNTA',
  'TrialActivation', 'TrialBusiness', 'TrialChannels',
  'TrialDashboard', 'TrialOnboarding', 'TrialSlug',
  'TrialStart', 'TrialWelcome',
  // Video public
  'VideoIndex', 'VideoDetail',
  // Miscellaneous public
  'BookCall', 'Book-Call', 'HelpAndSupport', 'ChannelHelpCenter',
  'Platform', 'Store', 'ServiceLocation',
  'SetupComplete',
  // School TV deal room (semi-public)
  'SchoolTVDealRoom', 'SchoolTVDemo',
  // Public proposal view
  'PublicProposal',
  // Rebuild proposal (client-facing)
  'RebuildProposal',
]);

// ─── Explicit route overrides ────────────────────────────────────────────────
// When a specific path needs a different classification than its prefix suggests.

export const ROUTE_OVERRIDES = {
  '/':                           'public',
  '/Login':                      'public',
  '/signup':                     'public',
  '/join-nta':                   'public',
  '/find-your-plan':             'public',
  '/book-call':                  'public',
  '/channel-help':               'public',
  '/getting-started':            'public',
  '/ai-policy':                  'public',
  '/aipolicy':                   'public',
  '/community-partner':          'public',
  '/community-growth-conversation': 'public',
  '/community-growth-advisor':   'public',
  '/community-intelligence':     'public',
  '/our-work':                   'public',
  '/our-story':                  'public',
  '/knowledge':                  'public',
  '/brand-book':                 'public',
  '/insights':                   'public',
  '/insights/:slug':             'public',
  '/case-studies/:slug':         'public',
  '/case-studies/johnson-heating': 'public',
  '/case-study/johnson-heating': 'public',
  '/case-study/monson-plumbing': 'public',
  '/case-study/papa-everetts':   'public',
  '/approval/:token':            'noindex',
  '/diy-checkout-success':       'noindex',
  '/demo/flow':                  'noindex',
  '/demo/furniture-mattress-outlet': 'noindex',
  '/deal-room/:company':         'noindex',
  '/restaurant-demo':            'public',
  '/restaurant-demo/pizza':      'public',
  '/restaurant-demo/mexican':    'public',
  '/restaurant-demo/bar':        'public',
  '/restaurants':                'public',
  '/back-office':                'public',
  '/back-office-solutions':      'public',
  '/gap-audit':                  'public',
  '/audit/furniture-mattress-outlet': 'noindex',
  '/rebuild-intake':             'public',
  '/hvac-funnel/1':              'noindex',
  '/hvac-funnel/2':              'noindex',
  '/hvac-funnel/3':              'noindex',
  '/hvac-funnel/4':              'noindex',
  '/hvac-funnel/5':              'noindex',
  '/hvac-funnel/thank-you':      'noindex',
  '/growth-conversation':        'public',
  '/growth-guide':               'public',
  '/growth-roadmap-generator':   'public',
  '/business-score':             'public',
  '/business-journey':           'public',
  '/relationship-builder':       'public',
  '/operating-system':           'public',
  '/learning-center':            'public',
  '/learning-center/videos':     'public',
  '/learning-center/videos/:id': 'public',
  '/learning-center/category/:id': 'public',
  '/start':                      'public',
  '/ai-brought-me-out-of-retirement': 'public',
  '/i-was-early-again':          'public',
  '/what-changed-online':        'public',
  '/ai-visibility-basics':       'public',
  '/practical-ai-for-small-businesses': 'public',
  '/seo-vs-ai-search':           'public',
  '/growth-systems-vs-campaigns':'public',
  '/digital-risks':              'public',
  '/reputation-is-now-a-growth-engine': 'public',
  '/hidden-cost-of-outdated-marketing': 'public',
  '/role-of-ai-in-local-marketing': 'public',
  '/video-storytelling-builds-confidence': 'public',
  '/campaigns-vs-authority':     'public',
  '/the-future-belongs-to-market-leaders': 'public',
  '/building-digital-trust':     'public',
  '/accessible-websites':        'public',
  '/web-accessibility-trust':    'public',
  '/websites-as-salespeople':    'public',
  '/local-lead-systems':         'public',
  '/seo-pages-for-local-businesses': 'public',
  '/seasonal-campaigns':         'public',
  '/social-media-content-system':'public',
  '/ai-video-marketing':         'public',
  '/hvac-marketing-north-iowa':  'public',
  '/contractor-marketing-north-iowa': 'public',
  '/small-business-marketing-north-iowa': 'public',
  '/services/website-rebuilds':  'public',
  '/services/social-media-management': 'public',
  '/social-media/mason-city-ia': 'public',
  '/social-media/rochester-mn':  'public',
  '/social-media/austin-mn':     'public',
  '/social-media/albert-lea-mn': 'public',
  '/website-rebuilds':           'public',
  '/website-rebuilds/mason-city-ia': 'public',
  '/website-rebuilds/rochester-mn': 'public',
  '/website-rebuilds/austin-mn': 'public',
  '/website-rebuilds/albert-lea-mn': 'public',
  // Trial routes are public
  '/trial/welcome':              'public',
  '/trial/business':             'public',
  '/trial/channels':             'public',
  '/trial/activation':           'public',
  // Client portal v2 public document signer
  '/c/:clientId':                'noindex',
  '/c/:clientId/agreement/:agreementId': 'noindex',
  '/client/channel-setup/:clientId': 'noindex',
  // Auth-required overrides
  '/workspace':                  'auth_required',
  '/onboarding':                 'auth_required',
  '/progress':                   'auth_required',
  '/my-growth-journey':          'auth_required',
  '/my-growth-workspace':        'auth_required',
  '/business-profile':           'auth_required',
  '/support':                    'auth_required',
  '/executive-dashboard':        'admin_only',
  '/admin-center':               'admin_only',
  '/admin-dashboard':            'admin_only',
  '/client-dashboard':           'client_only',
  '/partner-portal':             'auth_required',
  '/partner-quick-start':        'auth_required',
  '/nta/data-hub':               'admin_only',
};

// ─── Private route prefixes for robots.txt / sitemap exclusion ───────────────
export const PRIVATE_ROUTE_PREFIXES = [
  '/admin',
  '/agency',
  '/ops',
  '/portal',
  '/client',
  '/client-portal',
  '/client-portal-v2',
  '/dashboard',
  '/nta/operator-command',
  '/nta/command-center',
  '/nta/submissions',
  '/nta/companies',
  '/nta/opportunities',
  '/nta/clients',
  '/nta/projects',
  '/nta/campaigns',
  '/nta/tasks',
  '/nta/activity',
  '/nta/system-health',
  '/nta/migration',
  '/nta/channels',
  '/nta/onboarding',
  '/nta/reseller-command',
  '/nta/ai-workforce',
  '/nta/sales-followup',
  '/nta/pricing-stack',
  '/nta/acquisition-command',
  '/nta/automation-command',
  '/nta/content-dashboard',
  '/nta/deal-room',
  '/sales',
  '/reseller',
  '/billing',
  '/settings',
  '/crm',
  '/leads',
  '/content-command',
  '/content-center',
  '/deal-room',
  '/proposal',
  '/workspace',
  '/executive-dashboard',
  '/admin-dashboard',
  '/admin-center',
];

// ─── Route classification engine ─────────────────────────────────────────────

/**
 * Classify a URL pathname into an access level.
 * @param {string} pathname - The URL pathname (e.g. '/admin/billing')
 * @returns {'public'|'auth_required'|'client_only'|'ops_only'|'admin_only'|'noindex'}
 */
export function classifyRoute(pathname) {
  // 1. Check explicit overrides first
  const normalized = pathname.replace(/\/$/, '') || '/';
  if (ROUTE_OVERRIDES[normalized]) {
    return ROUTE_OVERRIDES[normalized];
  }

  // 2. Check prefix rules (case-insensitive, most specific first)
  const lower = normalized.toLowerCase();
  for (const rule of ROUTE_PREFIX_RULES) {
    const prefix = rule.prefix.toLowerCase();
    if (lower === prefix || lower.startsWith(prefix + '/') || lower.startsWith(prefix)) {
      return rule.access;
    }
  }

  // 3. Default: public
  return 'public';
}

/**
 * Classify a pages.config key into an access level.
 * @param {string} pageKey - The page key from pages.config (e.g. 'AdminBilling')
 * @returns {'public'|'auth_required'|'client_only'|'ops_only'|'admin_only'|'noindex'}
 */
export function classifyPageKey(pageKey) {
  // 1. Check if explicitly public
  if (PUBLIC_PAGE_KEYS.has(pageKey)) {
    return 'public';
  }

  // 2. Check page key prefix rules
  for (const rule of PAGE_KEY_PREFIX_RULES) {
    if (pageKey.startsWith(rule.prefix)) {
      return rule.access;
    }
  }

  // 3. Fall back to URL-based classification (/{pageKey})
  return classifyRoute(`/${pageKey}`);
}

/**
 * Check if a route requires authentication.
 */
export function requiresAuth(access) {
  return access !== 'public' && access !== 'noindex';
}

/**
 * Check if a route should have noindex meta.
 */
export function shouldNoIndex(access) {
  return access !== 'public';
}

/**
 * Check if a user's role satisfies the access requirement.
 * @param {string} access - The access level from classifyRoute
 * @param {object} user - The authenticated user object
 * @returns {boolean}
 */
export function userHasAccess(access, user) {
  if (!user) return false;

  const ADMIN_EMAILS = ['info@newtechadvertising.com', 'newtechad1@gmail.com'];
  const isAdmin = user.role === 'admin' || ADMIN_EMAILS.includes(user.email?.toLowerCase());
  const isOps = user.role === 'ops' || isAdmin;
  const isClient = user.role === 'client' || isAdmin;

  switch (access) {
    case 'admin_only':
      return isAdmin;
    case 'ops_only':
      return isOps;
    case 'client_only':
      return isClient;
    case 'auth_required':
    case 'noindex':
      return true; // any authenticated user
    case 'public':
      return true;
    default:
      return false;
  }
}

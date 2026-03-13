/**
 * NTA CANONICAL ROUTE MAP  v2  (2026-03-11)
 * ─────────────────────────────────────────────────────────────────────────────
 * SINGLE SOURCE OF TRUTH for all page → route-family assignments.
 *
 * HOW TO USE:
 *   import { PAGE_FAMILY_MAP, mainAdminRoutes, validateNavRoutes, ROUTE_FAMILIES }
 *     from '@/components/config/routeMap';
 *
 * ADDING A NEW PAGE:
 *   1. Add it to PAGE_FAMILY_MAP with the correct family.
 *   2. Add its canonical path to CANONICAL_ROUTE_MAP.
 *   3. Derived sets, guards, and validators update automatically.
 *
 * LAYOUT → FAMILY BINDING:
 *   AdminNav          → main_admin    (NTA internal ops dashboard)
 *   AdminLayout       → main_admin    (NTA admin shell w/ full sidebar)
 *   AdminShell        → school_admin  (school-tv shell)
 *   ClientPortal/nav  → client_portal
 *   No layout         → public
 *
 * DO NOT:
 *   - Put a school admin page key in main admin nav without allowCrossFamily: true
 *   - Use 'Dashboard' / 'Settings' / 'Videos' / 'Analytics' as page keys — they are AMBIGUOUS
 *   - Use AdminDashboard as a catch-all; it is the NTA main admin dashboard
 *   - Link to 'Dashboard' from MarketingNav — use 'ClientDashboard' instead
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Route families ────────────────────────────────────────────────────────────
export const ROUTE_FAMILIES = {
  MAIN_ADMIN:    'main_admin',
  SCHOOL_ADMIN:  'school_admin',
  CLIENT_PORTAL: 'client_portal',
  PUBLIC:        'public',
};

// ── Canonical page → family map ───────────────────────────────────────────────
// Keys MUST match the exact page file name (PascalCase, no extension).
export const PAGE_FAMILY_MAP = {

  // ─── MAIN NTA ADMIN ────────────────────────────────────────────────────────
  // Route: /admindashboard  → AdminDashboard  (NTA operations dashboard)
  AdminDashboard:                'main_admin',
  AdminCommandCenter:            'main_admin',
  AdminAIControlCenter:          'main_admin',
  AdminAILab:                    'main_admin',
  AdminAIVideoStudio:            'main_admin',
  AdminAIActivity:               'main_admin',
  AdminAIPrompts:                'main_admin',
  AdminAlerts:                   'main_admin',
  AdminAnalytics:                'main_admin',    // /adminreports
  AdminApproval:                 'main_admin',
  AdminAutopilot:                'main_admin',    // /adminautomation
  AdminBilling:                  'main_admin',    // /adminbilling  ← not AdminDashboard
  AdminBlog:                     'main_admin',
  AdminBranding:                 'main_admin',
  AdminClients:                  'main_admin',    // /adminclients
  AdminClientSettings:           'main_admin',
  AdminConnections:              'main_admin',    // /adminconnections
  AdminContentEngine:            'main_admin',    // /admincontent
  AdminCopilot:                  'main_admin',
  AdminExecutive:                'main_admin',
  AdminFinance:                  'main_admin',
  AdminFounder:                  'main_admin',
  AdminFulfillment:              'main_admin',
  AdminGovernance:               'main_admin',
  AdminHelp:                     'main_admin',    // /adminsupport
  AdminMetaSetup:                'main_admin',
  AdminOnboarding:               'main_admin',
  AdminOperations:               'main_admin',
  AdminOptimizer:                'main_admin',
  AdminOrchestrator:             'main_admin',
  AdminPlatform:                 'main_admin',    // /adminautomation triggers
  AdminQA:                       'main_admin',
  AdminQARuns:                   'main_admin',
  AdminQATests:                  'main_admin',
  AdminQAIssues:                 'main_admin',
  AdminQAReadiness:              'main_admin',
  AdminRecommendations:          'main_admin',
  AdminResellers:                'main_admin',
  AdminRevenueEngine:            'main_admin',
  AdminSales:                    'main_admin',    // /adminsales
  AdminSalesAssets:              'main_admin',
  AdminSalesFollowups:           'main_admin',
  AdminSalesPrompts:             'main_admin',
  AdminSalesProspect:            'main_admin',    // /adminprospects
  AdminSettings:                 'main_admin',    // /adminsettings
  AdminSystemHealth:             'main_admin',
  AdminTasks:                    'main_admin',
  AdminTestMatrix:               'main_admin',
  AdminUsers:                    'main_admin',
  AdminVideoDetail:              'main_admin',    // /adminvideodetail
  AdminVideoLibrary:             'main_admin',
  AdminVideoPublishing:          'main_admin',    // /adminpublishing
  AdminVideoQueue:               'main_admin',    // /adminvideos
  AdminVideoEngineRequests:      'main_admin',
  AdminVideoEngineRenders:       'main_admin',
  AdminVideoEngineApprovals:     'main_admin',
  AdminVideoEngineAnalytics:     'main_admin',
  AdminVideoEngineBrands:        'main_admin',
  AdminVideoEngineTemplates:     'main_admin',
  AdminVideoEngineRequest:       'main_admin',
  AdminVideoEngine:              'main_admin',
  AdminYouTubeSetup:             'main_admin',
  AdminYearbookLibrary:          'main_admin',
  AdminYearbookOverview:         'main_admin',
  AdminYearbookPage:             'main_admin',
  AdminYearbookSeason:           'main_admin',
  AiOperations:                  'main_admin',
  AiVideoStudio:                 'main_admin',
  AdminAgents:                   'main_admin',    // /adminagents
  AdminAgentsWorkflows:          'main_admin',    // /adminagents/workflows
  AdminAgentsRecovery:           'main_admin',    // /adminagents/recovery
  AuthorityMap:                  'main_admin',
  BusinessIntelProfileAdmin:     'main_admin',
  BusinessProfileAdmin:          'main_admin',
  ChatbotManagement:             'main_admin',
  ContentEngine:                 'main_admin',
  ContentQueue:                  'main_admin',
  ContentStudio:                 'main_admin',
  DealRoom:                      'main_admin',
  IntelAdmin:                    'main_admin',
  IndustryIntelAdmin:            'main_admin',
  LeadsDashboard:                'main_admin',
  LocalMarketIntelAdmin:         'main_admin',
  OpportunitySignalAdmin:        'main_admin',
  OperationsHub:                 'main_admin',
  PerformanceSignalAdmin:        'main_admin',
  ProposalPipeline:              'main_admin',
  ProposalsList:                 'main_admin',
  SalesRoom:                     'main_admin',
  ScheduledQueue:                'main_admin',
  SocialAccounts:                'main_admin',
  SocialMediaManagement:         'main_admin',
  WeeklyPlanAdmin:               'main_admin',
  AdminStoryDetail:              'main_admin',
  AdminStoryLibrary:             'main_admin',
  AdminSubmissionDetail:         'main_admin',
  AdminSubmissionsList:          'main_admin',
  AdminContentMultiplier:        'main_admin',    // /admincontentmultiplier
  AdminNavigationQA:             'main_admin',    // /adminqa/navigation (QA-only)

  // ─── SCHOOL ADMIN ─────────────────────────────────────────────────────────
  // All routes begin with /adminschool…
  AdminSchoolDashboard:          'school_admin',  // /adminschooldashboard
  AdminSchoolSubmissions:        'school_admin',  // /adminschoolsubmissions
  AdminSchoolProjects:           'school_admin',
  AdminSchoolStoryLibrary:       'school_admin',  // /adminschoolstories
  AdminSchoolVideoLibrary:       'school_admin',  // /adminschoolvideolibrary
  AdminSchoolYearbook:           'school_admin',
  AdminSchoolYearbookLibrary:    'school_admin',
  AdminSchoolEvents:             'school_admin',
  AdminSchoolEventDetail:        'school_admin',
  AdminSchoolSpotlights:         'school_admin',
  AdminSchoolSpotlightDetail:    'school_admin',
  AdminSchoolRenderQueue:        'school_admin',  // /adminschoolrenderqueue
  AdminSchoolAIDashboard:        'school_admin',
  AdminSchoolAILab:              'school_admin',  // /adminschoolailab
  AdminSchoolAIContentReview:    'school_admin',
  AdminSchoolAnalytics:          'school_admin',  // /adminschoolanalytics
  AdminSchoolBranding:           'school_admin',
  AdminSchoolSettings:           'school_admin',  // /adminschoolsettings
  AdminSchoolSettingsPermissions:'school_admin',
  AdminSchoolSettingsPublishing: 'school_admin',
  AdminSchoolUsers:              'school_admin',  // /adminschoolstaff
  AdminSchoolModeration:         'school_admin',
  AdminSchoolStudentUploads:     'school_admin',
  AdminSchoolStudentUsers:       'school_admin',  // /adminschoolstudents
  AdminSchoolOutreach:           'school_admin',
  AdminSchoolLeads:              'school_admin',
  AdminSchoolLeadDetail:         'school_admin',
  AdminSchoolPipeline:           'school_admin',
  AdminSchoolLibrary:            'school_admin',
  AdminSchoolRoles:              'school_admin',
  AdminSchoolRenderProfile:      'school_admin',
  AdminCreateProject:            'school_admin',
  AdminSchoolProjectDetail:      'school_admin',
  AdminSchoolVideoDetail:        'school_admin',

  // ─── CLIENT PORTAL ────────────────────────────────────────────────────────
  // All routes begin with /client…
  ClientDashboard:               'client_portal', // /clientdashboard  ← EXPLICIT, not 'Dashboard'
  ClientBilling:                 'client_portal', // /clientbilling
  ClientCommerce:                'client_portal', // /clientcommerce
  ClientContentProduction:       'client_portal', // /clientcontentproduction
  ClientFulfillment:             'client_portal', // /clientfulfillment (replaced /clientvideos)
  ClientOnboarding:              'client_portal', // /clientonboarding
  ClientSettings:                'client_portal', // /clientsettings
  ClientPortalRoles:             'client_portal',
  // NOTE: 'Dashboard' is a legacy ambiguous key — do not add new references to it.
  // Pages should link to ClientDashboard explicitly.
  Dashboard:                     'client_portal', // DEPRECATED — use ClientDashboard

  // ─── NTA COMMAND (internal ops — no admin shell, NTACommandNav) ──────────
  NTAOperatorCommand:            'main_admin',
  NTAOnboardingCenter:           'main_admin',
  NTAChannelHub:                 'main_admin',
  NTAAIWorkforceOrchestrator:    'main_admin',
  NTASalesFollowUp:              'main_admin',
  NTAPricingStack:               'main_admin',
  NTAAcquisitionCommand:         'main_admin',
  NTAResellerCommand:            'main_admin',
  NTADealRoom:                   'main_admin',
  NTADemoFunnel:                 'main_admin',
  NTAHomepage:                   'main_admin',

  // ─── PUBLIC SITE ──────────────────────────────────────────────────────────
  Home:                          'public',        // /
  About:                         'public',        // /about
  Pricing:                       'public',        // /pricing
  Contact:                       'public',        // /contact
  Blog:                          'public',        // /blog
  BlogPost:                      'public',
  Services:                      'public',        // /services
  Start:                         'public',        // /start
  Demo:                          'public',        // /demo
  DemoOverview:                  'public',
  DemoFeatures:                  'public',
  CaseStudies:                   'public',        // /case-studies
  CaseStudyDetail:               'public',
  AiVideos:                      'public',        // /video-marketing
  AdaWebsiteRebuild:             'public',        // /ada-websites
  StreamingTV:                   'public',        // /streaming-tv
  AiSocialMedia:                 'public',        // /social-media
  AiSeo:                         'public',        // /seo
  AiMarketingPlatform:           'public',        // /ai-marketing-platform
  SchoolHome:                    'public',        // school public channel home
  SchoolTV:                      'public',
  Platform:                      'public',
  Features:                      'public',
  GrowthSystem:                  'public',
  Rebuild:                       'public',
  AiWebsites:                    'public',
  AiSocialMediaSmallBusiness:    'public',
  AiAdvertising:                 'public',
  AiAccessibilityChecker:        'public',
  StreamingTvAdvertising:        'public',
  LocalVisibility:               'public',
  HelpAndSupport:                'public',
};

// ── Derived O(1) lookup sets ──────────────────────────────────────────────────
export const MAIN_ADMIN_PAGES   = new Set(Object.entries(PAGE_FAMILY_MAP).filter(([, f]) => f === 'main_admin'   ).map(([p]) => p));
export const SCHOOL_ADMIN_PAGES = new Set(Object.entries(PAGE_FAMILY_MAP).filter(([, f]) => f === 'school_admin' ).map(([p]) => p));
export const CLIENT_PAGES       = new Set(Object.entries(PAGE_FAMILY_MAP).filter(([, f]) => f === 'client_portal').map(([p]) => p));
export const PUBLIC_PAGES       = new Set(Object.entries(PAGE_FAMILY_MAP).filter(([, f]) => f === 'public'       ).map(([p]) => p));

// ── Explicit route path arrays (no leading slash, lowercase) ──────────────────
// Use these for guards, middleware, and redirect logic.
export const mainAdminRoutes = [
  'admindashboard',
  'adminclients',
  'adminprospects',       // → AdminSalesProspect
  'adminsales',           // → AdminSalesDashboard
  'adminvideos',          // → AdminVideoQueue
  'adminvideodetail',
  'adminpublishing',      // → AdminVideoPublishing
  'adminconnections',
  'admincontent',         // → AdminContentEngine
  'admincampaigns',
  'adminautomation',      // → AdminAutopilot / AdminPlatform
  'adminagents',          // → AgentArchitecture
  'adminsettings',
  'adminbilling',
  'adminreports',         // → AdminAnalytics
  'adminsupport',         // → AdminHelp
];

export const schoolAdminRoutes = [
  'adminschooldashboard',
  'adminschoolsubmissions',
  'adminschoolanalytics',
  'adminschoolailab',
  'adminschoolvideolibrary',
  'adminschoolrenderqueue',
  'adminschoolsettings',
  'adminschoolstories',   // → AdminSchoolStoryLibrary
  'adminschoolschedule',
  'adminschoolstudents',  // → AdminSchoolStudentUsers
  'adminschoolstaff',     // → AdminSchoolUsers
];

export const clientRoutes = [
  'clientdashboard',
  'clientcontent',
  'clientvideos',
  'clientcampaigns',
  'clientapprovals',
  'clientcalendar',
  'clientanalytics',
  'clientcommerce',
  'clientsettings',
  'clientsupport',
];

export const publicRoutes = [
  '',               // /
  'about',
  'services',
  'pricing',
  'contact',
  'start',
  'features',
  'demo',
  'case-studies',
  'blog',
  'video-marketing',
  'ada-websites',
  'streaming-tv',
  'social-media',
  'seo',
  'ai-marketing-platform',
];

// ── Canonical route map ────────────────────────────────────────────────────────
// Source of truth for: route → page file, layout, nav family, status.
// Status: 'live' | 'pending' (page exists but route not yet canonical) | 'missing' (page TBD)
export const CANONICAL_ROUTE_MAP = {
  // ── PUBLIC ────────────────────────────────────────────────────────────────
  '/':                              { page: 'Home',                    family: 'public',        layout: 'PublicLayout',       nav: 'MarketingNav', status: 'live'    },
  '/about':                         { page: 'About',                   family: 'public',        layout: 'PublicLayout',       nav: 'MarketingNav', status: 'live'    },
  '/services':                      { page: 'Services',                family: 'public',        layout: 'PublicLayout',       nav: 'MarketingNav', status: 'live'    },
  '/pricing':                       { page: 'Pricing',                 family: 'public',        layout: 'PublicLayout',       nav: 'MarketingNav', status: 'live'    },
  '/contact':                       { page: 'Contact',                 family: 'public',        layout: 'PublicLayout',       nav: 'MarketingNav', status: 'live'    },
  '/start':                         { page: 'Start',                   family: 'public',        layout: 'PublicLayout',       nav: 'MarketingNav', status: 'live'    },
  '/features':                      { page: 'Features',                family: 'public',        layout: 'PublicLayout',       nav: 'MarketingNav', status: 'pending' },
  '/demo':                          { page: 'Demo',                    family: 'public',        layout: 'PublicLayout',       nav: 'MarketingNav', status: 'live'    },
  '/case-studies':                  { page: 'CaseStudies',             family: 'public',        layout: 'PublicLayout',       nav: 'MarketingNav', status: 'live'    },
  '/blog':                          { page: 'Blog',                    family: 'public',        layout: 'PublicLayout',       nav: 'MarketingNav', status: 'live'    },
  '/video-marketing':               { page: 'AiVideos',                family: 'public',        layout: 'PublicLayout',       nav: 'MarketingNav', status: 'live'    },
  '/ada-websites':                  { page: 'AdaWebsiteRebuild',       family: 'public',        layout: 'PublicLayout',       nav: 'MarketingNav', status: 'live'    },
  '/streaming-tv':                  { page: 'StreamingTV',             family: 'public',        layout: 'PublicLayout',       nav: 'MarketingNav', status: 'live'    },
  '/social-media':                  { page: 'AiSocialMedia',           family: 'public',        layout: 'PublicLayout',       nav: 'MarketingNav', status: 'live'    },
  '/seo':                           { page: 'AiSeo',                   family: 'public',        layout: 'PublicLayout',       nav: 'MarketingNav', status: 'live'    },
  '/ai-marketing-platform':         { page: 'AiMarketingPlatform',     family: 'public',        layout: 'PublicLayout',       nav: 'MarketingNav', status: 'live'    },

  // ── MAIN NTA ADMIN ────────────────────────────────────────────────────────
  '/admindashboard':                { page: 'AdminDashboard',          family: 'main_admin',    layout: 'AdminNav',           nav: 'AdminNav',     status: 'live'    },
  '/adminclients':                  { page: 'AdminClients',            family: 'main_admin',    layout: 'AdminNav',           nav: 'AdminNav',     status: 'live'    },
  '/adminprospects':                { page: 'AdminSalesProspect',      family: 'main_admin',    layout: 'AdminNav',           nav: 'AdminNav',     status: 'live'    },
  '/adminsales':                    { page: 'AdminSales',              family: 'main_admin',    layout: 'AdminNav',           nav: 'AdminNav',     status: 'live'    },
  '/adminvideos':                   { page: 'AdminVideoQueue',         family: 'main_admin',    layout: 'AdminNav',           nav: 'AdminNav',     status: 'live'    },
  '/adminvideodetail':              { page: 'AdminVideoDetail',        family: 'main_admin',    layout: 'AdminNav',           nav: 'AdminNav',     status: 'live'    },
  '/adminpublishing':               { page: 'AdminVideoPublishing',    family: 'main_admin',    layout: 'AdminNav',           nav: 'AdminNav',     status: 'live'    },
  '/adminconnections':              { page: 'AdminConnections',        family: 'main_admin',    layout: 'AdminNav',           nav: 'AdminNav',     status: 'live'    },
  '/adminconnections/meta':         { page: 'AdminMetaSetup',          family: 'main_admin',    layout: 'AdminNav',           nav: 'AdminNav',     status: 'live'    },
  '/adminconnections/youtube':      { page: 'AdminYouTubeSetup',       family: 'main_admin',    layout: 'AdminNav',           nav: 'AdminNav',     status: 'live'    },
  '/admincontent':                  { page: 'AdminContentEngine',      family: 'main_admin',    layout: 'AdminNav',           nav: 'AdminNav',     status: 'live'    },
  '/admincampaigns':                { page: 'AdminAutopilot',          family: 'main_admin',    layout: 'AdminNav',           nav: 'AdminNav',     status: 'pending' },
  '/adminautomation':               { page: 'AdminPlatform',           family: 'main_admin',    layout: 'AdminNav',           nav: 'AdminNav',     status: 'live'    },
  '/adminagents':                   { page: 'AdminAgents',             family: 'main_admin',    layout: 'AdminNav',           nav: 'AdminNav',     status: 'live'    },
  '/adminagents/workflows':         { page: 'AdminAgentsWorkflows',    family: 'main_admin',    layout: 'AdminNav',           nav: 'AdminNav',     status: 'live'    },
  '/adminagents/recovery':          { page: 'AdminAgentsRecovery',     family: 'main_admin',    layout: 'AdminNav',           nav: 'AdminNav',     status: 'live'    },
  '/adminsettings':                 { page: 'AdminSettings',           family: 'main_admin',    layout: 'AdminNav',           nav: 'AdminNav',     status: 'live'    },
  '/adminbilling':                  { page: 'AdminBilling',            family: 'main_admin',    layout: 'AdminNav',           nav: 'AdminNav',     status: 'live'    },
  '/adminreports':                  { page: 'AdminAnalytics',          family: 'main_admin',    layout: 'AdminNav',           nav: 'AdminNav',     status: 'live'    },
  '/adminsupport':                  { page: 'AdminHelp',               family: 'main_admin',    layout: 'AdminNav',           nav: 'AdminNav',     status: 'live'    },
  '/admincontentmultiplier':        { page: 'AdminContentMultiplier',  family: 'main_admin',    layout: 'AdminNav',           nav: 'AdminNav',     status: 'live'    },
  '/adminqa/navigation':            { page: 'AdminNavigationQA',       family: 'main_admin',    layout: 'AdminNav',           nav: 'AdminNav',     status: 'internal' },

  // ── NTA COMMAND ──────────────────────────────────────────────────────────
  '/nta/operator-command':       { page: 'NTAOperatorCommand',         family: 'main_admin', layout: 'NTACommandNav+LayoutWrapper', nav: 'NTACommandNav', status: 'live' },
  '/nta/onboarding':             { page: 'NTAOnboardingCenter',        family: 'main_admin', layout: 'NTACommandNav+LayoutWrapper', nav: 'NTACommandNav', status: 'live' },
  '/nta/channels':               { page: 'NTAChannelHub',              family: 'main_admin', layout: 'NTACommandNav+LayoutWrapper', nav: 'NTACommandNav', status: 'live' },
  '/nta/ai-workforce':           { page: 'NTAAIWorkforceOrchestrator', family: 'main_admin', layout: 'NTACommandNav+LayoutWrapper', nav: 'NTACommandNav', status: 'live' },
  '/nta/sales-followup':         { page: 'NTASalesFollowUp',           family: 'main_admin', layout: 'NTACommandNav+LayoutWrapper', nav: 'NTACommandNav', status: 'live' },
  '/nta/pricing-stack':          { page: 'NTAPricingStack',            family: 'main_admin', layout: 'NTACommandNav+LayoutWrapper', nav: 'NTACommandNav', status: 'live' },
  '/nta/acquisition-command':    { page: 'NTAAcquisitionCommand',      family: 'main_admin', layout: 'NTACommandNav+LayoutWrapper', nav: 'NTACommandNav', status: 'live' },
  '/nta/reseller-command':       { page: 'NTAResellerCommand',         family: 'main_admin', layout: 'NTACommandNav+LayoutWrapper', nav: 'NTACommandNav', status: 'live' },
  '/nta/deal-room':              { page: 'NTADealRoom',                family: 'main_admin', layout: 'NTACommandNav+LayoutWrapper', nav: 'NTACommandNav', status: 'live' },
  '/nta/demo':                   { page: 'NTADemoFunnel',              family: 'main_admin', layout: 'none (bare)',                 nav: 'none',          status: 'live' },
  '/nta/home':                   { page: 'NTAHomepage',                family: 'main_admin', layout: 'none (bare)',                 nav: 'none',          status: 'live' },
  '/nta':                        { page: null,                         family: 'main_admin', layout: 'redirect',                   nav: 'none',          status: 'redirect→/nta/operator-command' },

  // ── SCHOOL ADMIN ─────────────────────────────────────────────────────────
  '/adminschooldashboard':          { page: 'AdminSchoolDashboard',    family: 'school_admin',  layout: 'AdminLayout/AdminShell', nav: 'AdminSidebar(school)', status: 'live' },
  '/adminschoolsubmissions':        { page: 'AdminSchoolSubmissions',  family: 'school_admin',  layout: 'AdminLayout/AdminShell', nav: 'AdminSidebar(school)', status: 'live' },
  '/adminschoolanalytics':          { page: 'AdminSchoolAnalytics',    family: 'school_admin',  layout: 'AdminLayout/AdminShell', nav: 'AdminSidebar(school)', status: 'live' },
  '/adminschoolailab':              { page: 'AdminSchoolAILab',        family: 'school_admin',  layout: 'AdminLayout/AdminShell', nav: 'AdminSidebar(school)', status: 'live' },
  '/adminschoolvideolibrary':       { page: 'AdminSchoolVideoLibrary', family: 'school_admin',  layout: 'AdminLayout/AdminShell', nav: 'AdminSidebar(school)', status: 'live' },
  '/adminschoolrenderqueue':        { page: 'AdminSchoolRenderQueue',  family: 'school_admin',  layout: 'AdminLayout/AdminShell', nav: 'AdminSidebar(school)', status: 'live' },
  '/adminschoolsettings':           { page: 'AdminSchoolSettings',     family: 'school_admin',  layout: 'AdminLayout/AdminShell', nav: 'AdminSidebar(school)', status: 'live' },
  '/adminschoolstories':            { page: 'AdminSchoolStoryLibrary', family: 'school_admin',  layout: 'AdminLayout/AdminShell', nav: 'AdminSidebar(school)', status: 'live' },
  '/adminschoolschedule':           { page: null,                      family: 'school_admin',  layout: 'AdminLayout/AdminShell', nav: 'AdminSidebar(school)', status: 'missing' },
  '/adminschoolstudents':           { page: 'AdminSchoolStudentUsers', family: 'school_admin',  layout: 'AdminLayout/AdminShell', nav: 'AdminSidebar(school)', status: 'live' },
  '/adminschoolstaff':              { page: 'AdminSchoolUsers',        family: 'school_admin',  layout: 'AdminLayout/AdminShell', nav: 'AdminSidebar(school)', status: 'live' },

  // ── CLIENT PORTAL ─────────────────────────────────────────────────────────
  '/clientdashboard':               { page: 'ClientDashboard',         family: 'client_portal', layout: 'ClientLayout',       nav: 'ClientNav',    status: 'live'    },
  '/clientcontent':                 { page: null,                      family: 'client_portal', layout: 'ClientLayout',       nav: 'ClientNav',    status: 'missing' },
  '/clientvideos':                  { page: null,                      family: 'client_portal', layout: 'ClientLayout',       nav: 'ClientNav',    status: 'missing' },
  '/clientcampaigns':               { page: null,                      family: 'client_portal', layout: 'ClientLayout',       nav: 'ClientNav',    status: 'missing' },
  '/clientapprovals':               { page: null,                      family: 'client_portal', layout: 'ClientLayout',       nav: 'ClientNav',    status: 'missing' },
  '/clientcalendar':                { page: null,                      family: 'client_portal', layout: 'ClientLayout',       nav: 'ClientNav',    status: 'missing' },
  '/clientanalytics':               { page: null,                      family: 'client_portal', layout: 'ClientLayout',       nav: 'ClientNav',    status: 'missing' },
  '/clientcommerce':                { page: 'ClientCommerce',          family: 'client_portal', layout: 'ClientLayout',       nav: 'ClientNav',    status: 'live'    },
  '/clientcontentproduction':       { page: 'ClientContentProduction', family: 'client_portal', layout: 'ClientLayout',       nav: 'ClientNav',    status: 'live'    },
  '/clientsettings':                { page: 'ClientSettings',          family: 'client_portal', layout: 'ClientLayout',       nav: 'ClientNav',    status: 'live'    },
  '/clientsupport':                 { page: null,                      family: 'client_portal', layout: 'ClientLayout',       nav: 'ClientNav',    status: 'missing' },
};

// ── getPageFamily ─────────────────────────────────────────────────────────────
export function getPageFamily(pageName) {
  return PAGE_FAMILY_MAP[pageName] || 'unknown';
}

// ── validateNavRoutes ─────────────────────────────────────────────────────────
/**
 * Call this at module level in any nav/sidebar component.
 * In dev, logs console.error for any cross-family links not marked allowCrossFamily.
 *
 * @param {Array}  items          - flat or nested nav items with `page` keys
 * @param {string} expectedFamily - ROUTE_FAMILIES value
 * @param {string} navSource      - debug label (e.g. 'AdminNav')
 */
export function validateNavRoutes(items, expectedFamily, navSource) {
  if (typeof window === 'undefined') return;
  if (import.meta?.env?.PROD) return;

  const flatten = (arr) => arr.flatMap(i => {
    const children = (i.items || i.sections)
      ? flatten(i.items || i.sections || [])
      : [];
    return [i, ...children];
  });
  const flat = flatten(Array.isArray(items) ? items : []);

  flat.forEach(item => {
    if (!item.page) return;
    if (item.allowCrossFamily) return;

    const family = PAGE_FAMILY_MAP[item.page];
    if (!family) {
      console.warn(
        `%c[RouteGuard] ${navSource}%c — item "${item.label || item.page}" → page "${item.page}" NOT in routeMap. Add it to PAGE_FAMILY_MAP.`,
        'color: orange; font-weight: bold', 'color: inherit'
      );
      return;
    }
    if (family !== expectedFamily) {
      console.error(
        `%c[RouteGuard] CROSS-FAMILY LINK: ${navSource}%c\n` +
        `  Item:            "${item.label || item.page}"\n` +
        `  Expected family: ${expectedFamily}\n` +
        `  Actual family:   ${family}  (page: "${item.page}")\n` +
        `  Fix: use a ${expectedFamily} page key, or add allowCrossFamily:true if intentional.`,
        'color: red; font-weight: bold', 'color: inherit'
      );
    }
  });
}

// ── FAMILY_DISPLAY — used by RouteFamilyBadge and layout dev banners ──────────
export const FAMILY_DISPLAY = {
  main_admin:    { label: 'Main Admin',    bg: 'bg-violet-700',  border: 'border-violet-500', dot: 'bg-violet-300' },
  school_admin:  { label: 'School Admin',  bg: 'bg-blue-700',    border: 'border-blue-500',   dot: 'bg-blue-300'   },
  client_portal: { label: 'Client Portal', bg: 'bg-green-700',   border: 'border-green-500',  dot: 'bg-green-300'  },
  public:        { label: 'Public Site',   bg: 'bg-gray-700',    border: 'border-gray-500',   dot: 'bg-gray-300'   },
};
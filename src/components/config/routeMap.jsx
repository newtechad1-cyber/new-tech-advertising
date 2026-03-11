/**
 * NTA CANONICAL ROUTE MAP
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all page → route-family assignments.
 *
 * Created: 2026-03-11
 * Reason:  pages/AdminDashboard was overwritten with school admin content,
 *          causing /admindashboard to render the School Admin UI. This map
 *          enforces family boundaries and allows nav components to self-validate
 *          at runtime so this class of bug is caught immediately.
 *
 * HOW TO USE:
 *   import { MAIN_ADMIN_PAGES, validateNavRoutes, ROUTE_FAMILIES } from '@/components/config/routeMap';
 *
 * ADDING A NEW PAGE:
 *   1. Add it to PAGE_FAMILY_MAP below with the correct family.
 *   2. That's it — the derived sets and validator update automatically.
 *
 * DO NOT:
 *   - Put a school admin page in MAIN_ADMIN nav without explicit intent
 *   - Put a main admin page as a destination from school admin nav
 *   - Use 'AdminDashboard' as a fallback/catch-all — it is a specific NTA page
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const ROUTE_FAMILIES = {
  MAIN_ADMIN:    'main_admin',
  SCHOOL_ADMIN:  'school_admin',
  CLIENT_PORTAL: 'client_portal',
  PUBLIC:        'public',
};

// ── Canonical page → family map ───────────────────────────────────────────────
export const PAGE_FAMILY_MAP = {

  // ─── MAIN ADMIN ───────────────────────────────────────────────────────────
  AdminDashboard:                'main_admin',   // NTA main admin dashboard — NOT a fallback
  AdminCommandCenter:            'main_admin',
  AdminAIControlCenter:          'main_admin',
  AdminAILab:                    'main_admin',
  AdminAIVideoStudio:            'main_admin',
  AdminAlerts:                   'main_admin',
  AdminAnalytics:                'main_admin',
  AdminAutopilot:                'main_admin',
  AdminBilling:                  'main_admin',   // correct billing page
  AdminBlog:                     'main_admin',
  AdminBranding:                 'main_admin',
  AdminClients:                  'main_admin',
  AdminConnections:              'main_admin',
  AdminContentEngine:            'main_admin',
  AdminCopilot:                  'main_admin',
  AdminExecutive:                'main_admin',
  AdminFounder:                  'main_admin',
  AdminFulfillment:              'main_admin',
  AdminGovernance:               'main_admin',
  AdminMetaSetup:                'main_admin',
  AdminOnboarding:               'main_admin',
  AdminOperations:               'main_admin',
  AdminOptimizer:                'main_admin',
  AdminOrchestrator:             'main_admin',
  AdminPlatform:                 'main_admin',
  AdminQA:                       'main_admin',
  AdminRecommendations:          'main_admin',
  AdminResellers:                'main_admin',
  AdminRevenueEngine:            'main_admin',
  AdminSalesDashboard:           'main_admin',
  AdminSalesAssets:              'main_admin',
  AdminSalesFollowups:           'main_admin',
  AdminSalesPrompts:             'main_admin',
  AdminSettings:                 'main_admin',
  AdminSystemHealth:             'main_admin',
  AdminTasks:                    'main_admin',
  AdminUsers:                    'main_admin',
  AdminVideoDetail:              'main_admin',
  AdminVideoLibrary:             'main_admin',
  AdminVideoPublishing:          'main_admin',
  AdminVideoQueue:               'main_admin',
  AdminVideoEngineRequests:      'main_admin',
  AdminVideoEngineRenders:       'main_admin',
  AdminYouTubeSetup:             'main_admin',
  AiOperations:                  'main_admin',
  AiVideoStudio:                 'main_admin',
  AuthorityMap:                  'main_admin',
  BusinessIntelProfileAdmin:     'main_admin',
  BusinessProfileAdmin:          'main_admin',
  ChatbotManagement:             'main_admin',
  ContentEngine:                 'main_admin',
  ContentQueue:                  'main_admin',
  ContentStudio:                 'main_admin',
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

  // ─── SCHOOL ADMIN ─────────────────────────────────────────────────────────
  AdminSchoolDashboard:          'school_admin',
  AdminSchoolSubmissions:        'school_admin',
  AdminSchoolProjects:           'school_admin',
  AdminSchoolStoryLibrary:       'school_admin',
  AdminSchoolVideoLibrary:       'school_admin',
  AdminSchoolYearbook:           'school_admin',
  AdminSchoolEvents:             'school_admin',
  AdminSchoolSpotlights:         'school_admin',
  AdminSchoolRenderQueue:        'school_admin',
  AdminSchoolAIDashboard:        'school_admin',
  AdminSchoolAILab:              'school_admin',
  AdminSchoolAIContentReview:    'school_admin',
  AdminSchoolAnalytics:          'school_admin',
  AdminSchoolBranding:           'school_admin',
  AdminSchoolSettings:           'school_admin',
  AdminSchoolUsers:              'school_admin',
  AdminSchoolModeration:         'school_admin',
  AdminSchoolStudentUploads:     'school_admin',
  AdminSchoolStudentUsers:       'school_admin',
  AdminSchoolOutreach:           'school_admin',
  AdminSchoolLeads:              'school_admin',

  // ─── CLIENT PORTAL ────────────────────────────────────────────────────────
  ClientDashboard:               'client_portal',
  ClientBilling:                 'client_portal',
  ClientFulfillment:             'client_portal',
  ClientOnboarding:              'client_portal',
  ClientSettings:                'client_portal',
  Dashboard:                     'client_portal',

  // ─── PUBLIC ───────────────────────────────────────────────────────────────
  Home:                          'public',
  About:                         'public',
  Pricing:                       'public',
  Contact:                       'public',
  Blog:                          'public',
  SchoolHome:                    'public',
};

// ── Derived O(1) lookup sets ──────────────────────────────────────────────────
export const MAIN_ADMIN_PAGES   = new Set(Object.entries(PAGE_FAMILY_MAP).filter(([, f]) => f === 'main_admin'   ).map(([p]) => p));
export const SCHOOL_ADMIN_PAGES = new Set(Object.entries(PAGE_FAMILY_MAP).filter(([, f]) => f === 'school_admin' ).map(([p]) => p));
export const CLIENT_PAGES       = new Set(Object.entries(PAGE_FAMILY_MAP).filter(([, f]) => f === 'client_portal').map(([p]) => p));
export const PUBLIC_PAGES       = new Set(Object.entries(PAGE_FAMILY_MAP).filter(([, f]) => f === 'public'       ).map(([p]) => p));

/**
 * getPageFamily(pageName) → family string | 'unknown'
 */
export function getPageFamily(pageName) {
  return PAGE_FAMILY_MAP[pageName] || 'unknown';
}

/**
 * validateNavRoutes(items, expectedFamily, navSource)
 *
 * Call this at module level in any nav component.
 * Logs console.error for cross-family links. Silent in production.
 *
 * @param {Array<{page?: string, label?: string, items?: Array}>} items - flat or nested
 * @param {string} expectedFamily  — ROUTE_FAMILIES value
 * @param {string} navSource       — label for the log e.g. 'AdminNav'
 *
 * Cross-family links that are INTENTIONAL (e.g. main admin nav linking to
 * school admin as an explicit entry point) can be whitelisted by adding
 * `allowCrossFamily: true` to the nav item object.
 */
export function validateNavRoutes(items, expectedFamily, navSource) {
  if (typeof window === 'undefined') return;
  if (import.meta?.env?.PROD) return;

  const flatten = (arr) => arr.flatMap(i => {
    const children = i.items ? flatten(i.items) : [];
    return [i, ...children];
  });
  const flat = flatten(Array.isArray(items) ? items : []);

  flat.forEach(item => {
    if (!item.page) return;
    if (item.allowCrossFamily) return;

    const family = PAGE_FAMILY_MAP[item.page];
    if (!family) {
      console.warn(
        `%c[RouteGuard] ${navSource}%c — nav item "${item.label || item.page}" → page "${item.page}" is NOT in routeMap.js. Add it to PAGE_FAMILY_MAP.`,
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
        `  Fix: use a ${expectedFamily} page, or add allowCrossFamily:true if intentional.`,
        'color: red; font-weight: bold', 'color: inherit'
      );
    }
  });
}

/**
 * Family display config — used by RouteFamilyBadge and layout debug banners.
 */
export const FAMILY_DISPLAY = {
  main_admin:    { label: 'Main Admin',    bg: 'bg-violet-700',  border: 'border-violet-500', dot: 'bg-violet-300' },
  school_admin:  { label: 'School Admin',  bg: 'bg-blue-700',    border: 'border-blue-500',   dot: 'bg-blue-300'   },
  client_portal: { label: 'Client Portal', bg: 'bg-green-700',   border: 'border-green-500',  dot: 'bg-green-300'  },
  public:        { label: 'Public Site',   bg: 'bg-gray-700',    border: 'border-gray-500',   dot: 'bg-gray-300'   },
};
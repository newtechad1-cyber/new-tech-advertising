/**
 * Route QA Detection Utilities
 * Provides route inventory, grouping, and validation
 */

// Complete route inventory for the platform (38 routes)
export const ROUTE_INVENTORY = [
  // Public Family (14 routes)
  { route: '/', page_key: 'Home', page_family: 'public', layout_expected: 'PublicLayout', nav_menu_source: 'MarketingNav' },
  { route: '/pricing', page_key: 'Pricing', page_family: 'public', layout_expected: 'PublicLayout', nav_menu_source: 'MarketingNav' },
  { route: '/about', page_key: 'About', page_family: 'public', layout_expected: 'PublicLayout', nav_menu_source: 'MarketingNav' },
  { route: '/contact', page_key: 'Contact', page_family: 'public', layout_expected: 'PublicLayout', nav_menu_source: 'MarketingNav' },
  { route: '/blog', page_key: 'Blog', page_family: 'public', layout_expected: 'PublicLayout', nav_menu_source: 'MarketingNav' },
  { route: '/case-studies', page_key: 'CaseStudies', page_family: 'public', layout_expected: 'PublicLayout', nav_menu_source: 'MarketingNav' },
  { route: '/demo', page_key: 'Demo', page_family: 'public', layout_expected: 'PublicLayout', nav_menu_source: 'MarketingNav' },
  { route: '/get-started', page_key: 'GetStarted', page_family: 'public', layout_expected: 'PublicLayout', nav_menu_source: 'MarketingNav' },
  { route: '/hvac-industry', page_key: 'HvacIndustry', page_family: 'public', layout_expected: 'PublicLayout', nav_menu_source: 'MarketingNav' },
  { route: '/industries', page_key: 'IndustriesHub', page_family: 'public', layout_expected: 'PublicLayout', nav_menu_source: 'MarketingNav' },
  { route: '/plumbing-marketing', page_key: 'PlumbingMarketing', page_family: 'public', layout_expected: 'PublicLayout', nav_menu_source: 'MarketingNav' },
  { route: '/roofing-marketing', page_key: 'RoofingMarketing', page_family: 'public', layout_expected: 'PublicLayout', nav_menu_source: 'MarketingNav' },
  { route: '/ada-compliance', page_key: 'AdaCompliance', page_family: 'public', layout_expected: 'PublicLayout', nav_menu_source: 'MarketingNav' },
  { route: '/streaming-tv', page_key: 'StreamingTvAdvertising', page_family: 'public', layout_expected: 'PublicLayout', nav_menu_source: 'MarketingNav' },

  // Main Admin Family (18 routes)
  { route: '/admindashboard', page_key: 'AdminDashboard', page_family: 'main_admin', layout_expected: 'AdminNav', nav_menu_source: 'MainSidebar' },
  { route: '/adminclients', page_key: 'AdminClients', page_family: 'main_admin', layout_expected: 'AdminNav', nav_menu_source: 'MainSidebar' },
  { route: '/adminsales', page_key: 'AdminSalesDashboard', page_family: 'main_admin', layout_expected: 'AdminNav', nav_menu_source: 'MainSidebar' },
  { route: '/adminvideos', page_key: 'AdminVideoLibrary', page_family: 'main_admin', layout_expected: 'AdminNav', nav_menu_source: 'MainSidebar' },
  { route: '/adminvideodetail/:id', page_key: 'AdminVideoDetail', page_family: 'main_admin', layout_expected: 'AdminNav', nav_menu_source: 'TableRowLink' },
  { route: '/adminpublishing', page_key: 'AdminVideoPublishing', page_family: 'main_admin', layout_expected: 'AdminNav', nav_menu_source: 'MainSidebar' },
  { route: '/adminconnections', page_key: 'AdminConnections', page_family: 'main_admin', layout_expected: 'AdminNav', nav_menu_source: 'MainSidebar' },
  { route: '/adminconnections/meta', page_key: 'AdminMetaSetup', page_family: 'main_admin', layout_expected: 'AdminNav', nav_menu_source: 'CTAButton' },
  { route: '/adminconnections/youtube', page_key: 'AdminYouTubeSetup', page_family: 'main_admin', layout_expected: 'AdminNav', nav_menu_source: 'CTAButton' },
  { route: '/admincontent', page_key: 'AdminContentEngine', page_family: 'main_admin', layout_expected: 'AdminNav', nav_menu_source: 'MainSidebar' },
  { route: '/admincontentmultiplier', page_key: 'AdminContentMultiplier', page_family: 'main_admin', layout_expected: 'AdminNav', nav_menu_source: 'MainSidebar' },
  { route: '/adminautomation', page_key: 'AdminAutopilot', page_family: 'main_admin', layout_expected: 'AdminNav', nav_menu_source: 'MainSidebar' },
  { route: '/adminagents', page_key: 'AdminAgents', page_family: 'main_admin', layout_expected: 'AdminNav', nav_menu_source: 'MainSidebar' },
  { route: '/adminsettings', page_key: 'AdminSettings', page_family: 'main_admin', layout_expected: 'AdminNav', nav_menu_source: 'MainSidebar' },
  { route: '/adminbilling', page_key: 'AdminBilling', page_family: 'main_admin', layout_expected: 'AdminNav', nav_menu_source: 'MainSidebar' },
  { route: '/adminreports', page_key: 'AdminAnalytics', page_family: 'main_admin', layout_expected: 'AdminNav', nav_menu_source: 'MainSidebar' },
  { route: '/adminsupport', page_key: 'AdminHelp', page_family: 'main_admin', layout_expected: 'AdminNav', nav_menu_source: 'MainSidebar' },
  { route: '/adminqa/navigation', page_key: 'AdminNavigationQA', page_family: 'main_admin', layout_expected: 'AdminNav', nav_menu_source: 'QABanner' },

  // School Admin Family (7 routes)
  { route: '/adminschooldashboard', page_key: 'AdminSchoolDashboard', page_family: 'school_admin', layout_expected: 'AdminShell', nav_menu_source: 'SchoolSidebar' },
  { route: '/adminschoolsubmissions', page_key: 'AdminSchoolSubmissions', page_family: 'school_admin', layout_expected: 'AdminShell', nav_menu_source: 'SchoolSidebar' },
  { route: '/adminschoolanalytics', page_key: 'AdminSchoolAnalytics', page_family: 'school_admin', layout_expected: 'AdminShell', nav_menu_source: 'SchoolSidebar' },
  { route: '/adminschoolailab', page_key: 'AdminSchoolAILab', page_family: 'school_admin', layout_expected: 'AdminShell', nav_menu_source: 'SchoolSidebar' },
  { route: '/adminschoolvideolibrary', page_key: 'AdminSchoolVideoLibrary', page_family: 'school_admin', layout_expected: 'AdminShell', nav_menu_source: 'SchoolSidebar' },
  { route: '/adminschoolrenderqueue', page_key: 'AdminSchoolRenderQueue', page_family: 'school_admin', layout_expected: 'AdminShell', nav_menu_source: 'SchoolSidebar' },
  { route: '/adminschoolsettings', page_key: 'AdminSchoolSettings', page_family: 'school_admin', layout_expected: 'AdminShell', nav_menu_source: 'SchoolSidebar' },

  // Client Portal Family (4 routes)
  { route: '/clientdashboard', page_key: 'ClientDashboard', page_family: 'client_portal', layout_expected: 'ClientNav', nav_menu_source: 'ClientNav' },
  { route: '/clientcommerce', page_key: 'ClientCommerce', page_family: 'client_portal', layout_expected: 'ClientNav', nav_menu_source: 'ClientNav' },
  { route: '/clientcontentproduction', page_key: 'ClientContentProduction', page_family: 'client_portal', layout_expected: 'ClientNav', nav_menu_source: 'ClientNav' },
  { route: '/clientsettings', page_key: 'ClientSettings', page_family: 'client_portal', layout_expected: 'ClientNav', nav_menu_source: 'ClientNav' },
];

/**
 * Group routes by family
 * Returns object with keys: public, main_admin, school_admin, client_portal
 */
export function groupRoutesByFamily() {
  const grouped = {
    public: [],
    main_admin: [],
    school_admin: [],
    client_portal: [],
  };

  ROUTE_INVENTORY.forEach(route => {
    if (grouped[route.page_family]) {
      grouped[route.page_family].push(route);
    }
  });

  return grouped;
}

/**
 * Calculate QA metrics from checks
 */
export function calculateQAMetrics(qaChecks) {
  const total = ROUTE_INVENTORY.length;
  const tested = qaChecks.filter(c => c.tested).length;
  const passed = qaChecks.filter(c => c.status === 'pass').length;
  const broken = qaChecks.filter(c => c.status === 'broken').length;
  const coverage = total > 0 ? Math.round((tested / total) * 100) : 0;

  return {
    total,
    tested,
    passed,
    broken,
    coverage,
  };
}

/**
 * Get route by path
 */
export function getRouteByPath(path) {
  return ROUTE_INVENTORY.find(r => r.route === path);
}

/**
 * Get routes by family
 */
export function getRoutesByFamily(family) {
  return ROUTE_INVENTORY.filter(r => r.page_family === family);
}

/**
 * Detect routing collision
 * Check if a page's detected family doesn't match expected
 */
export function detectRoutingCollision(route, detectedFamily) {
  return route.page_family !== detectedFamily;
}

/**
 * Validate page route against route map
 */
export function validatePageRoute(pageKey, detectedRoute, detectedFamily) {
  const route = ROUTE_INVENTORY.find(r => r.page_key === pageKey);
  
  if (!route) {
    return { valid: false, reason: 'Page not in route inventory' };
  }

  if (detectedRoute !== route.route) {
    return { valid: false, reason: 'Route path mismatch' };
  }

  if (detectedFamily !== route.page_family) {
    return { valid: false, reason: 'Family mismatch - collision detected' };
  }

  return { valid: true };
}
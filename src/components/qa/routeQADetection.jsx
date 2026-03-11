/**
 * Route QA Detection Utilities
 * Provides route inventory, grouping, and validation
 */

export const ROUTE_INVENTORY = [
  { route: '/', page_key: 'Home', page_family: 'public' },
  { route: '/pricing', page_key: 'Pricing', page_family: 'public' },
  { route: '/about', page_key: 'About', page_family: 'public' },
  { route: '/contact', page_key: 'Contact', page_family: 'public' },
  { route: '/admindashboard', page_key: 'AdminDashboard', page_family: 'main_admin' },
  { route: '/adminvideos', page_key: 'AdminVideoLibrary', page_family: 'main_admin' },
  { route: '/adminvideodetail/:id', page_key: 'AdminVideoDetail', page_family: 'main_admin' },
  { route: '/adminpublishing', page_key: 'AdminVideoPublishing', page_family: 'main_admin' },
  { route: '/clientdashboard', page_key: 'ClientDashboard', page_family: 'client_portal' },
];

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

export function calculateQAMetrics(qaChecks) {
  const total = ROUTE_INVENTORY.length;
  const tested = qaChecks?.filter(c => c.tested).length || 0;
  const passed = qaChecks?.filter(c => c.status === 'pass').length || 0;
  const broken = qaChecks?.filter(c => c.status === 'broken').length || 0;
  const coverage = total > 0 ? Math.round((tested / total) * 100) : 0;

  return {
    total,
    tested,
    passed,
    broken,
    coverage,
  };
}

export function getRouteByPath(path) {
  return ROUTE_INVENTORY.find(r => r.route === path);
}

export function getRoutesByFamily(family) {
  return ROUTE_INVENTORY.filter(r => r.page_family === family);
}

export function detectRoutingCollision(route, detectedFamily) {
  return route.page_family !== detectedFamily;
}

export function validatePageRoute(pageKey, detectedRoute, detectedFamily) {
  const route = ROUTE_INVENTORY.find(r => r.page_key === pageKey);
  
  if (!route) {
    return { valid: false, reason: 'Page not in route inventory' };
  }

  if (detectedRoute !== route.route) {
    return { valid: false, reason: 'Route path mismatch' };
  }

  if (detectedFamily !== route.page_family) {
    return { valid: false, reason: 'Family mismatch' };
  }

  return { valid: true };
}
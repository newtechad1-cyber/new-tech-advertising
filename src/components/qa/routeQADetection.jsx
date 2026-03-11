import { PAGE_FAMILY_MAP, CANONICAL_ROUTE_MAP } from '@/components/config/routeMap';

/**
 * Comprehensive route validation and detection utilities for QA.
 */

export const ROUTE_INVENTORY = Object.entries(CANONICAL_ROUTE_MAP).map(([route, meta]) => ({
  route,
  page_key: meta.page,
  page_family: meta.family,
  layout_expected: meta.layout,
  nav_menu_source: meta.nav,
  status: meta.status,
  category: meta.family === 'public' ? 'Public' : 
            meta.family === 'main_admin' ? 'Main Admin' : 
            meta.family === 'school_admin' ? 'School Admin' : 
            meta.family === 'client_portal' ? 'Client Portal' : 'Other',
}));

/**
 * Detects current layout and family from DOM inspection
 */
export function detectRuntimeEnvironment() {
  const hasAdminSidebar = document.querySelector('[data-qa="admin-sidebar"]');
  const hasSchoolSidebar = document.querySelector('[data-qa="school-sidebar"]');
  const hasClientNav = document.querySelector('[data-qa="client-nav"]');
  const hasPublicNav = document.querySelector('[data-qa="public-nav"]');
  const routeFamilyBadge = document.querySelector('[data-qa="route-family-badge"]');

  let detectedFamily = 'unknown';
  let detectedLayout = 'unknown';

  if (hasAdminSidebar) {
    detectedFamily = 'main_admin';
    detectedLayout = 'AdminNav';
  } else if (hasSchoolSidebar) {
    detectedFamily = 'school_admin';
    detectedLayout = 'AdminShell';
  } else if (hasClientNav) {
    detectedFamily = 'client_portal';
    detectedLayout = 'ClientGuard';
  } else if (hasPublicNav) {
    detectedFamily = 'public';
    detectedLayout = 'PublicLayout';
  }

  if (routeFamilyBadge) {
    const badge = routeFamilyBadge.getAttribute('data-family');
    if (badge) detectedFamily = badge;
  }

  return { detectedFamily, detectedLayout };
}

/**
 * Validates page against expected route metadata
 */
export function validatePageRoute(pageKey, expectedFamily) {
  const actualFamily = PAGE_FAMILY_MAP[pageKey];
  
  if (!actualFamily) {
    return {
      valid: false,
      errors: [`Page key "${pageKey}" not found in route map`],
    };
  }

  const errors = [];
  if (actualFamily !== expectedFamily) {
    errors.push(`Family mismatch: expected "${expectedFamily}", got "${actualFamily}"`);
  }

  return {
    valid: errors.length === 0,
    errors,
    actualFamily,
  };
}

/**
 * Detects cross-family navigation attempts
 */
export function detectRoutingCollision(expectedFamily, detectedFamily) {
  if (!expectedFamily || !detectedFamily) return null;
  
  if (expectedFamily !== detectedFamily) {
    return {
      collision: true,
      message: `Potential routing collision detected: expected ${expectedFamily}, rendered as ${detectedFamily}`,
      severity: 'critical',
    };
  }

  return { collision: false };
}

/**
 * Get route metadata from inventory
 */
export function getRouteMetadata(route) {
  return CANONICAL_ROUTE_MAP[route] || null;
}

/**
 * Group routes by family for display
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
 * Calculate QA metrics
 */
export function calculateQAMetrics(qaChecks = []) {
  const total = ROUTE_INVENTORY.length;
  const tested = qaChecks.length;
  const passed = qaChecks.filter(c => c.status === 'pass').length;
  const broken = qaChecks.filter(c => ['broken', 'redirect_issue', 'wrong_layout'].includes(c.status)).length;

  return {
    total,
    tested,
    passRate: tested > 0 ? Math.round((passed / tested) * 100) : 0,
    broken,
    coverage: total > 0 ? Math.round((tested / total) * 100) : 0,
  };
}
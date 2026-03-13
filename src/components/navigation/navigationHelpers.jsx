import { base44 } from '@/api/base44Client';

/**
 * Navigation Helper Library
 * Single source of truth for all page navigation, access control, and routing
 */

// Cache for PageRegistry to avoid repeated queries
let pageRegistryCache = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Load PageRegistry with optional caching
 */
export async function loadPageRegistry(skipCache = false) {
  const now = Date.now();
  
  if (!skipCache && pageRegistryCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_TTL) {
    return pageRegistryCache;
  }

  try {
    const pages = await base44.entities.PageRegistry.filter(
      { isActive: true },
      'pageKey'
    );
    pageRegistryCache = pages;
    cacheTimestamp = now;
    return pages;
  } catch (error) {
    console.error('[navigationHelpers] Failed to load PageRegistry:', error);
    return [];
  }
}

/**
 * Clear navigation cache (call when registry is updated)
 */
export function clearNavigationCache() {
  pageRegistryCache = null;
  cacheTimestamp = null;
}

/**
 * Find page by pageKey
 */
export async function getPageByKey(pageKey) {
  const pages = await loadPageRegistry();
  return pages.find(p => p.pageKey === pageKey);
}

/**
 * Find page by route path
 */
export async function getPageByRoute(routePath) {
  const pages = await loadPageRegistry();
  return pages.find(p => p.routePath === routePath);
}

/**
 * Check if user has access to page
 */
export async function checkPageAccess(pageKey, userContext) {
  const page = await getPageByKey(pageKey);
  
  if (!page) {
    return { allowed: false, reason: 'Page not found in registry' };
  }

  if (!page.isActive) {
    return { allowed: false, reason: 'Page is inactive' };
  }

  // Public pages are always accessible
  if (page.isPublic || page.requiredRole === 'public') {
    return { allowed: true };
  }

  // Check authentication
  if (!userContext?.user) {
    return { allowed: false, reason: 'Authentication required' };
  }

  // Check role
  if (!checkRoleAccess(userContext.user.role, page.requiredRole)) {
    return { allowed: false, reason: `Role ${page.requiredRole} required` };
  }

  // Check plan
  if (page.requiredPlan && page.requiredPlan !== 'none') {
    if (!userContext.userPlan || !checkPlanAccess(userContext.userPlan, page.requiredPlan)) {
      return { allowed: false, reason: `Plan ${page.requiredPlan} required` };
    }
  }

  // Check tenant scope
  if (page.requiredTenantScope && page.requiredTenantScope !== 'any' && page.requiredTenantScope !== 'none') {
    if (!userContext.tenantType || !checkTenantAccess(userContext.tenantType, page.requiredTenantScope)) {
      return { allowed: false, reason: `Tenant scope ${page.requiredTenantScope} required` };
    }
  }

  return { allowed: true };
}

/**
 * Role hierarchy checker
 */
function checkRoleAccess(userRole, requiredRole) {
  const roleHierarchy = {
    'public': 0,
    'authenticated': 1,
    'user': 2,
    'tenant_member': 3,
    'tenant_manager': 4,
    'tenant_admin': 5,
    'reseller_admin': 6,
    'master_admin': 7,
    'super_admin': 8
  };

  const userLevel = roleHierarchy[userRole] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;

  return userLevel >= requiredLevel;
}

/**
 * Plan tier checker
 */
function checkPlanAccess(userPlan, requiredPlan) {
  const planHierarchy = {
    'none': 0,
    'free_trial': 1,
    'diy': 2,
    'guided_growth': 3,
    'done_for_you': 4,
    'premium': 5,
    'enterprise': 6
  };

  const userLevel = planHierarchy[userPlan] || 0;
  const requiredLevel = planHierarchy[requiredPlan] || 0;

  return userLevel >= requiredLevel;
}

/**
 * Tenant scope checker
 */
function checkTenantAccess(userTenant, requiredTenant) {
  if (requiredTenant === 'any') return true;
  if (requiredTenant === 'none') return true;
  return userTenant === requiredTenant;
}

/**
 * Navigate to page with access control
 * Usage: navigateToPage('adminTenantGovernance', navigate, userContext)
 */
export async function navigateToPage(pageKey, navigate, userContext, fallbackRoute = '/') {
  try {
    // Get page from registry
    const page = await getPageByKey(pageKey);
    
    if (!page) {
      console.warn(`[navigationHelpers] Page not found: ${pageKey}`);
      navigate(fallbackRoute);
      return { success: false, reason: 'Page not found' };
    }

    // Check access
    const access = await checkPageAccess(pageKey, userContext);
    
    if (!access.allowed) {
      console.warn(`[navigationHelpers] Access denied for ${pageKey}: ${access.reason}`);
      navigate(fallbackRoute);
      return { success: false, reason: access.reason };
    }

    // Navigate to page
    navigate(page.routePath);
    return { success: true, path: page.routePath };
  } catch (error) {
    console.error(`[navigationHelpers] Navigation error for ${pageKey}:`, error);
    navigate(fallbackRoute);
    return { success: false, reason: error.message };
  }
}

/**
 * Get navigation menu for user
 * Filters pages based on user context and nav group
 */
export async function getNavigationMenu(userContext, navGroup) {
  try {
    const pages = await loadPageRegistry();
    
    // Filter by nav group
    let filtered = pages.filter(p => p.navGroup === navGroup && p.isActive);

    // Filter by access
    const accessible = [];
    for (const page of filtered) {
      const access = await checkPageAccess(page.pageKey, userContext);
      if (access.allowed) {
        accessible.push({
          pageKey: page.pageKey,
          displayName: page.displayName,
          routePath: page.routePath,
          icon: page.icon,
          description: page.description
        });
      }
    }

    // Sort by displayName
    accessible.sort((a, b) => a.displayName.localeCompare(b.displayName));

    return accessible;
  } catch (error) {
    console.error(`[navigationHelpers] Failed to get navigation menu for ${navGroup}:`, error);
    return [];
  }
}

/**
 * Get breadcrumb path for page
 */
export async function getBreadcrumbPath(pageKey) {
  const path = [];
  let currentKey = pageKey;

  while (currentKey) {
    const page = await getPageByKey(currentKey);
    if (!page) break;

    path.unshift({
      pageKey: page.pageKey,
      displayName: page.displayName,
      routePath: page.routePath
    });

    currentKey = page.parentPageKey;
  }

  return path;
}

/**
 * Validate PageRegistry integrity
 * Check for duplicate routes, missing pages, etc.
 */
export async function validatePageRegistry() {
  const pages = await base44.entities.PageRegistry.list('-pageKey', 1000);
  const issues = [];
  const routeMap = {};

  for (const page of pages) {
    // Check for duplicate routes
    if (routeMap[page.routePath]) {
      issues.push({
        type: 'duplicate_route',
        pageKey: page.pageKey,
        routePath: page.routePath,
        message: `Duplicate route: ${page.routePath} (also on ${routeMap[page.routePath]})`
      });
    } else {
      routeMap[page.routePath] = page.pageKey;
    }

    // Check for required fields
    if (!page.pageKey || !page.displayName || !page.routePath) {
      issues.push({
        type: 'missing_required_field',
        pageKey: page.pageKey,
        message: 'Missing required fields'
      });
    }

    // Check parent reference
    if (page.parentPageKey) {
      const parent = await getPageByKey(page.parentPageKey);
      if (!parent) {
        issues.push({
          type: 'invalid_parent',
          pageKey: page.pageKey,
          parentPageKey: page.parentPageKey,
          message: `Parent page not found: ${page.parentPageKey}`
        });
      }
    }
  }

  return {
    totalPages: pages.length,
    issues,
    isValid: issues.length === 0
  };
}

/**
 * Get pages by type
 */
export async function getPagesByType(pageType) {
  const pages = await loadPageRegistry();
  return pages.filter(p => p.pageType === pageType && p.isActive);
}

/**
 * Check if page is linked in the codebase (future: integrate with linter)
 */
export async function checkPageIsLinked(pageKey) {
  // TODO: Integrate with build-time linter to check for actual usage
  // For now, return placeholder
  return { isLinked: null, linkedLocations: [] };
}

/**
 * Get all inactive pages (for audit)
 */
export async function getInactivePages() {
  return await base44.entities.PageRegistry.filter(
    { isActive: false },
    '-lastUpdatedAt'
  );
}

/**
 * Get pages with missing registry entries (future: build-time detection)
 */
export async function getMissingRegistryPages() {
  // TODO: Integrate with build system to detect pages in App.jsx not in registry
  return [];
}
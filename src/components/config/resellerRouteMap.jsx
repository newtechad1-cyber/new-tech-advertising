/**
 * RESELLER ROUTE MAP
 * 
 * Defines all reseller-scoped routes separate from NTA master admin routes.
 * Enables strict tenant isolation and branded portal experience.
 */

export const RESELLER_ROUTE_MAP = {
  // Main Dashboard
  ResellerDashboard: { path: '/resellerdashboard', family: 'reseller_portal' },
  
  // Client Management
  ResellerClients: { path: '/resellerclients', family: 'reseller_portal' },
  ResellerClientDetail: { path: '/resellerclients/:clientId', family: 'reseller_portal' },
  
  // Content Operations
  ResellerPublishing: { path: '/resellerpublishing', family: 'reseller_portal' },
  ResellerApprovals: { path: '/resellerapprovals', family: 'reseller_portal' },
  ResellerReports: { path: '/resellerreports', family: 'reseller_portal' },
  
  // Settings & Configuration
  ResellerSettingsBranding: { path: '/resellersettings/branding', family: 'reseller_portal' },
  ResellerSettingsDomain: { path: '/resellersettings/domain', family: 'reseller_portal' },
  ResellerSettingsFeatures: { path: '/resellersettings/features', family: 'reseller_portal' },
  ResellerSettingsTeam: { path: '/resellersettings/team', family: 'reseller_portal' },
  ResellerSettingsBilling: { path: '/resellersettings/billing', family: 'reseller_portal' },
  
  // Onboarding
  ResellerOnboarding: { path: '/reseller-onboarding', family: 'reseller_portal' },
};

/**
 * NTA MASTER RESELLER MANAGEMENT ROUTES
 */
export const NTA_RESELLER_ROUTE_MAP = {
  AdminResellers: { path: '/adminresellers', family: 'main_admin' },
  AdminResellersDetail: { path: '/adminresellers/:resellerId', family: 'main_admin' },
  AdminResellersOnboarding: { path: '/adminresellers/onboarding', family: 'main_admin' },
  AdminResellersRevenue: { path: '/adminresellers/revenue', family: 'main_admin' },
};

export const getResellerPath = (routeName) => {
  return RESELLER_ROUTE_MAP[routeName]?.path || '/resellerdashboard';
};

export const isResellerRoute = (path) => {
  return Object.values(RESELLER_ROUTE_MAP).some(route => path === route.path);
};
// Canonical route map for the app
// Use these constants for all internal navigation instead of createPageUrl()

export const ROUTES = {
  // Public
  home: '/',

  // Admin
  adminDashboard: '/agency',
  adminCommandCenter: '/nta/command-center',
  adminControlTower: '/admin/control-tower',
  adminAILab: '/admin/ai-lab',
  adminSettings: '/admin/settings',
  adminChannels: '/admin/channels',
  adminAuthority: '/admin/authority',

  // Agency / CRM
  agencyDashboard: '/agency',
  agencyPipeline: '/agency/pipeline',
  agencyLeads: '/agency/leads',
  agencyClients: '/agency/clients',
  agencyContent: '/agency/content',
  agencyWebsites: '/agency/websites',
  agencyChannelConnections: '/agency/channel-connections',
  agencyPublishingQueue: '/agency/publishing-queue',
  agencyPublishingOps: '/agency/publishing-ops',
  agencyContentWizard: '/agency/content-wizard',
  agencyLeadWizard: '/agency/lead-wizard',

  // Client portal
  clientDashboard: '/client/dashboard',
  clientCalendar: '/client/calendar',
  clientCampaigns: '/client/campaigns',
  clientROI: '/client/roi',
  clientChannels: '/client/channels',
  clientResults: '/client/results',
} as const;

// Legacy aliases — map old ambiguous names to canonical routes
const LEGACY_ALIASES: Record<string, string> = {
  Dashboard: ROUTES.clientDashboard,
  ClientDashboard: ROUTES.clientDashboard,
  AdminDashboard: ROUTES.agencyDashboard,
  AgencyDashboard: ROUTES.agencyDashboard,
};

/**
 * createPageUrl - Legacy helper kept for backward compatibility.
 * Prefer using ROUTES constants for new code.
 */
export function createPageUrl(pageName: string): string {
  // Check legacy aliases first (exact match)
  if (LEGACY_ALIASES[pageName]) return LEGACY_ALIASES[pageName];

  // Check ROUTES map (camelCase key match)
  const key = pageName.charAt(0).toLowerCase() + pageName.slice(1);
  if (key in ROUTES) {
    return (ROUTES as Record<string, string>)[key];
  }

  // Fallback: lowercase + hyphenate
  return '/' + pageName.toLowerCase().replace(/ /g, '-');
}
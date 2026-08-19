// Canonical route map for the app
// Use these constants for all internal navigation instead of createPageUrl()

export const ROUTES = {
  // Public
  home: '/',
  tools: '/free-audit',
  services: '/services',
  blogPost: '/blogpost',
  communityPartnerProgram: '/community-partner',
  ourWork: '/our-work',
  marketingPlanGenerator: '/marketing-plan-generator',

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
  clientDashboard: '/portal',
  clientCalendar: '/portal/calendar',
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

  // Public legacy page keys — keep older components on canonical URLs.
  Blog: '/insights',
  PrivacyPolicy: '/privacy-policy',
  TermsOfService: '/terms-of-service',
  AIPolicy: '/ai-policy',
  AiSeo: '/ai-seo',
  AiSocialMedia: '/ai-social-media',
  AiWebsites: '/ai-websites',
  AiAdvertising: '/ai-advertising',
  AiVideos: '/ai-videos',
  KnowledgeLibrary: '/knowledge',
  KnowledgePrompts: '/knowledge/prompts',
  AIHumanityCollection: '/knowledge/ai-humanity',
  LearningCenter: '/learning-center',
  GrowthShow: '/growth-show',
  NtaJournal: '/journal',
  JournalLanding: '/journal',
  HelpAndSupport: '/help-and-support',
  OurStory: '/our-story',
  OurWork: '/our-work',
  PracticalAI: '/practical-ai-for-small-business',
  WhyNTA: '/why-nta',
  CaseStudies: '/case-studies',
  ContractorMarketingNorthIowa: '/contractor-marketing-north-iowa',
  SmallBusinessMarketingNorthIowa: '/small-business-marketing-north-iowa',
  SocialMediaManagement: '/services/social-media-management',
  MarketingPlanGenerator: '/marketing-plan-generator',
  AiSocialMediaSmallBusiness: '/ai-social-media-small-business',
  RestaurantSocialMedia: '/restaurant-social-media',
  LocalBusinessMarketing: '/local-business-marketing',
  SchoolTVDealRoom: '/schooltv-deal-room',
  GrowthSystem: '/growth-system',
  IndustriesHub: '/industries',
  TvCommercialScriptGenerator: '/tv-commercial-script-generator',
  AiMarketingPlatform: '/ai-marketing-platform',
  HvacIndustry: '/hvac-industry',
  Start: '/start',
  GetStarted: '/get-started',
  'Get-Started': '/get-started',
  Rebuild: '/services/website-rebuilds',
  WebsiteRebuild: '/services/website-rebuilds',
  'Website-Rebuild': '/services/website-rebuilds',
  AdaWebsiteRebuild: '/services/website-rebuilds',
  StreamingTV: '/streaming-tv-advertising',
  'Streaming-TV': '/streaming-tv-advertising',
  StreamingTvAdvertising: '/streaming-tv-advertising',
  AdaAccessibility: '/accessible-websites',
  AdaWebsiteCompliance: '/ada-website-compliance',
  AdaWebsiteLawsuitPrevention: '/ada-website-compliance',
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

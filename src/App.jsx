import React, { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { NTADataProvider } from '@/lib/NTADataContext';
import { ExperienceProvider } from '@/lib/ExperienceLayer';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { AdminGuard, ClientGuard } from '@/components/auth/RoleGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import NoIndexMeta from '@/components/auth/NoIndexMeta';
import { classifyRoute, classifyPageKey, requiresAuth, shouldNoIndex, userHasAccess } from '@/config/routeGovernance';
import Login from './pages/Login';
import SignupPage from './pages/SignupPage';
// — Eagerly loaded public pages (tiny, critical for first paint) —
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
// — Lazy loaded: everything else —
const CaseStudyJohnsonHeating = lazy(() => import('./pages/CaseStudyJohnsonHeating'));
const CaseStudyMonsonPlumbing = lazy(() => import('./pages/CaseStudyMonsonPlumbing'));
const CaseStudyPapaEveretts = lazy(() => import('./pages/CaseStudyPapaEveretts'));
const LearningCenter = lazy(() => import('./pages/LearningCenter'));
// GapAuditPage removed
const AiBroughtMeOutOfRetirement = lazy(() => import('./pages/AiBroughtMeOutOfRetirement'));
const PublishingEngine = lazy(() => import('./pages/PublishingEngine'));
const PublishingArticleView = lazy(() => import('./pages/PublishingArticleView'));
const EditorialDashboard = lazy(() => import('./pages/EditorialDashboard'));
const JournalLanding = lazy(() => import('./pages/JournalLanding'));
const JournalIssueView = lazy(() => import('./pages/JournalIssueView'));
const CanonExplorer = lazy(() => import('./pages/CanonExplorer'));
const CanonCollectionView = lazy(() => import('./pages/CanonCollectionView'));
const AdminCanonMigration = lazy(() => import('./pages/AdminCanonMigration'));
const AdminCanonicalManagement = lazy(() => import('./pages/AdminCanonicalManagement'));
const IWasEarlyAgain = lazy(() => import('./pages/IWasEarlyAgain'));
const AIWorkforce = lazy(() => import('./pages/AIWorkforce'));
const FounderScorecard = lazy(() => import('./pages/FounderScorecard'));
const ClientCampaigns = lazy(() => import('./pages/ClientCampaigns'));
const AdminCampaigns = lazy(() => import('./pages/AdminCampaigns'));
const ClientReferrals = lazy(() => import('./pages/ClientReferrals'));
const ClientReferralStatus = lazy(() => import('./pages/ClientReferralStatus'));
const AdminReferrals = lazy(() => import('./pages/AdminReferrals'));
const ClientLocations = lazy(() => import('./pages/ClientLocations'));
const AdminEnterpriseAccounts = lazy(() => import('./pages/AdminEnterpriseAccounts'));
const AdminLocationPerformance = lazy(() => import('./pages/AdminLocationPerformance'));
const AdminVerticalIntelligence = lazy(() => import('./pages/AdminVerticalIntelligence'));
const AdminVerticalRevenue = lazy(() => import('./pages/AdminVerticalRevenue'));
const AdminVerticalCampaigns = lazy(() => import('./pages/AdminVerticalCampaigns'));
const AdminVerticalExpansion = lazy(() => import('./pages/AdminVerticalExpansion'));
const AdminExpansionPlaybook = lazy(() => import('./pages/AdminExpansionPlaybook'));
const AdminExpansionExecution = lazy(() => import('./pages/AdminExpansionExecution'));
const AdminExpansionTerritories = lazy(() => import('./pages/AdminExpansionTerritories'));
const AdminExpansionRevenue = lazy(() => import('./pages/AdminExpansionRevenue'));
const AdminFounderPlanner = lazy(() => import('./pages/AdminFounderPlanner'));
const AdminFounderPriorities = lazy(() => import('./pages/AdminFounderPriorities'));
const AdminFounderScorecardWeekly = lazy(() => import('./pages/AdminFounderScorecardWeekly'));
const AdminFounderScenarios = lazy(() => import('./pages/AdminFounderScenarios'));
const AdminClientSuccess = lazy(() => import('./pages/AdminClientSuccess'));
const AdminClientRetention = lazy(() => import('./pages/AdminClientRetention'));
const AdminClientExpansion = lazy(() => import('./pages/AdminClientExpansion'));
const AdminClientLTV = lazy(() => import('./pages/AdminClientLTV'));
const AdminOperations = lazy(() => import('./pages/AdminOperations'));
const AdminOperationsCapacity = lazy(() => import('./pages/AdminOperationsCapacity'));
const AdminOperationsSLA = lazy(() => import('./pages/AdminOperationsSLA'));
const AdminOperationsEfficiency = lazy(() => import('./pages/AdminOperationsEfficiency'));
const AdminControlTower = lazy(() => import('./pages/AdminControlTower'));
const AdminControlTowerInsights = lazy(() => import('./pages/AdminControlTowerInsights'));
const AdminControlTowerRisk = lazy(() => import('./pages/AdminControlTowerRisk'));
const AdminControlTowerActions = lazy(() => import('./pages/AdminControlTowerActions'));
const AdminROIExpansion = lazy(() => import('./pages/AdminROIExpansion'));
const AdminFunnelOptimization = lazy(() => import('./pages/AdminFunnelOptimization'));
const AdminFunnelPages = lazy(() => import('./pages/AdminFunnelPages'));
const AdminFunnelTests = lazy(() => import('./pages/AdminFunnelTests'));
const AdminFunnelOpportunities = lazy(() => import('./pages/AdminFunnelOpportunities'));
const AdminAIWorkforce = lazy(() => import('./pages/AdminAIWorkforce'));
const AdminAIOrchestration = lazy(() => import('./pages/AdminAIOrchestration'));
const AdminAIRouting = lazy(() => import('./pages/AdminAIRouting'));
const AdminAIGrowthLoops = lazy(() => import('./pages/AdminAIGrowthLoops'));
const AdminAutomationRules = lazy(() => import('./pages/AdminAutomationRules'));
const AdminAutomationConditions = lazy(() => import('./pages/AdminAutomationConditions'));
const AdminAutomationFlows = lazy(() => import('./pages/AdminAutomationFlows'));
const AdminAutomationPerformance = lazy(() => import('./pages/AdminAutomationPerformance'));
const AdminKnowledge = lazy(() => import('./pages/AdminKnowledge'));
const AdminKnowledgeWorkflows = lazy(() => import('./pages/AdminKnowledgeWorkflows'));
const AdminKnowledgeTraining = lazy(() => import('./pages/AdminKnowledgeTraining'));
const AdminKnowledgeIntelligence = lazy(() => import('./pages/AdminKnowledgeIntelligence'));
const AdminPricingIntelligence = lazy(() => import('./pages/AdminPricingIntelligence'));
const AdminPricingPackaging = lazy(() => import('./pages/AdminPricingPackaging'));
const AdminPricingExperiments = lazy(() => import('./pages/AdminPricingExperiments'));
const AdminPricingRecommendations = lazy(() => import('./pages/AdminPricingRecommendations'));
const AdminNavigationAudit = lazy(() => import('./pages/AdminNavigationAudit'));
const AdminChannels = lazy(() => import('./pages/AdminChannels'));
const ClientChannels = lazy(() => import('./pages/ClientChannels'));
const ClientResults = lazy(() => import('./pages/ClientResults'));
const ClientApprovals = lazy(() => import('./pages/ClientApprovals'));
const ClientCalendar = lazy(() => import('./pages/ClientCalendar'));
const AdminProductionStability = lazy(() => import('./pages/AdminProductionStability'));
const AdminPlatformQA = lazy(() => import('./pages/AdminPlatformQA'));
const ClientROI = lazy(() => import('./pages/ClientROI'));
const ClientROIReports = lazy(() => import('./pages/ClientROIReports'));
const ClientROITimeline = lazy(() => import('./pages/ClientROITimeline'));
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));
const TrialWelcome = lazy(() => import('./pages/TrialWelcome'));
const TrialBusiness = lazy(() => import('./pages/TrialBusiness'));
const TrialChannels = lazy(() => import('./pages/TrialChannels'));
const TrialActivation = lazy(() => import('./pages/TrialActivation'));
const DemoFlow = lazy(() => import('./pages/DemoFlow'));
const DealRoom = lazy(() => import('./pages/DealRoom'));
const SalesCommandCenter = lazy(() => import('./pages/SalesCommandCenter'));
const AdminSalesCommand = lazy(() => import('./pages/AdminSalesCommand'));
const NTASalesPipeline = lazy(() => import('./pages/NTASalesPipeline'));
const NTADemoMachine = lazy(() => import('./pages/NTADemoMachine'));
const AdminProposalGenerator = lazy(() => import('./pages/AdminProposalGenerator'));
const NTADealRoom = lazy(() => import('./pages/NTADealRoom'));
const NTAOnboardingCenter = lazy(() => import('./pages/NTAOnboardingCenter'));
const NTAChannelHub = lazy(() => import('./pages/NTAChannelHub'));
const NTAResellerCommand = lazy(() => import('./pages/NTAResellerCommand'));
const NTAAIWorkforceOrchestrator = lazy(() => import('./pages/NTAAIWorkforceOrchestrator'));
const NTAHomepage = lazy(() => import('./pages/NTAHomepage'));
const NTASalesFollowUp = lazy(() => import('./pages/NTASalesFollowUp'));
const NTAPricingStack = lazy(() => import('./pages/NTAPricingStack'));
const ClientGrowthJourney = lazy(() => import('./pages/ClientGrowthJourney'));
const NTAOperatorCommand = lazy(() => import('./pages/NTAOperatorCommand'));
const NTAAcquisitionCommand = lazy(() => import('./pages/NTAAcquisitionCommand'));
const AutomationCommandCenter = lazy(() => import('./pages/AutomationCommandCenter'));
const AdminRetentionDashboard = lazy(() => import('./pages/AdminRetentionDashboard'));
const NTADemoFunnel = lazy(() => import('./pages/NTADemoFunnel'));
const AdminAIOperations = lazy(() => import('./pages/AdminAIOperations'));
const AdminDataGovernance = lazy(() => import('./pages/AdminDataGovernance'));
const AdminAccessGovernance = lazy(() => import('./pages/AdminAccessGovernance'));
const AdminTenantGovernance = lazy(() => import('./pages/AdminTenantGovernance'));
const ResellerDashboard = lazy(() => import('./pages/ResellerDashboard'));
const AdminPageRegistry = lazy(() => import('./pages/AdminPageRegistry'));
const AdminWorkflows = lazy(() => import('./pages/AdminWorkflows'));
const GettingStarted = lazy(() => import('./pages/GettingStarted'));
const AdminHotProspectsAlert = lazy(() => import('./pages/AdminHotProspectsAlert'));
const ChannelHelpCenter = lazy(() => import('./pages/ChannelHelpCenter'));
const BookCall = lazy(() => import('./pages/BookCall'));
const DIYGrowthSystemSales = lazy(() => import('./pages/DIYGrowthSystemSales'));
const DIYOnboarding = lazy(() => import('./pages/DIYOnboarding'));
const DIYDashboard = lazy(() => import('./pages/DIYDashboard'));
const DIYPricingLadder = lazy(() => import('./pages/DIYPricingLadder'));
const DIYBillingSettings = lazy(() => import('./pages/DIYBillingSettings'));
const DIYCheckoutSuccess = lazy(() => import('./pages/DIYCheckoutSuccess'));
const PricingWizard = lazy(() => import('./pages/PricingWizard'));
const NTAPricingLadderPage = lazy(() => import('./pages/NTAPricingLadderPage'));
const JoinNTA = lazy(() => import('./pages/JoinNTA'));
const BusinessFoundationsCollection = lazy(() => import('./pages/BusinessFoundationsCollection'));
const BusinessFoundationsLesson = lazy(() => import('./pages/BusinessFoundationsLesson'));
const TruthAboutBusinessGrowthCollection = lazy(() => import('./pages/TruthAboutBusinessGrowthCollection'));
const HowCustomersDecideWhoToTrustCollection = lazy(() => import('./pages/HowCustomersDecideWhoToTrustCollection'));
const HowCustomersDecideWhoToTrustLesson = lazy(() => import('./pages/HowCustomersDecideWhoToTrustLesson'));
const TruthAboutBusinessGrowthLesson = lazy(() => import('./pages/TruthAboutBusinessGrowthLesson'));
const HowBusinessesTurnTrustIntoLastingRelationshipsCollection = lazy(() => import('./pages/HowBusinessesTurnTrustIntoLastingRelationshipsCollection'));
const HowBusinessesTurnTrustIntoLastingRelationshipsLesson = lazy(() => import('./pages/HowBusinessesTurnTrustIntoLastingRelationshipsLesson'));
const TurningWhatABusinessKnowsIntoAnAssetCollection = lazy(() => import('./pages/TurningWhatABusinessKnowsIntoAnAssetCollection'));
const TurningWhatABusinessKnowsIntoAnAssetLesson = lazy(() => import('./pages/TurningWhatABusinessKnowsIntoAnAssetLesson'));
const AIFoundationsCollection = lazy(() => import('./pages/AIFoundationsCollection'));
const AIFoundationsLesson = lazy(() => import('./pages/AIFoundationsLesson'));
const WebsiteRebuildService = lazy(() => import('./pages/WebsiteRebuildService'));
const WebsiteRebuildsMasonCity = lazy(() => import('./pages/WebsiteRebuildsMasonCity'));
const WebsiteRebuildsRochesterMN = lazy(() => import('./pages/WebsiteRebuildsRochesterMN'));
const WebsiteRebuildsAustinMN = lazy(() => import('./pages/WebsiteRebuildsAustinMN'));
const WebsiteRebuildsAlbertLeaMN = lazy(() => import('./pages/WebsiteRebuildsAlbertLeaMN'));
const NTABrandBook = lazy(() => import('./pages/NTABrandBook'));
const WhyNTA = lazy(() => import('./pages/WhyNTA'));
const KnowledgePrompts = lazy(() => import('./pages/KnowledgePrompts'));
const SalesConversations = lazy(() => import('./pages/SalesConversations'));
const NTAPlaybook = lazy(() => import('./pages/NTAPlaybook'));
const AdminRecruitingCandidates = lazy(() => import('./pages/AdminRecruitingCandidates'));
const AuditFurnitureMattressOutlet = lazy(() => import('./pages/AuditFurnitureMattressOutlet'));
const CommunityPartnerProgram = lazy(() => import('./pages/CommunityPartnerProgram'));
const AIPolicy = lazy(() => import('./pages/AIPolicy'));
const CRMDashboard = lazy(() => import('./pages/CRMDashboard'));
const CRMArchivedLeads = lazy(() => import('./pages/CRMArchivedLeads'));
const ContentCommandDashboard = lazy(() => import('./pages/ContentCommandDashboard'));
const ContentCommandCenter = lazy(() => import('./pages/ContentCommandCenter'));
const ClientManager = lazy(() => import('./pages/ClientManager'));
const ClientDetail = lazy(() => import('./pages/ClientDetail'));
const DemoFurnitureMattressOutlet = lazy(() => import('./pages/DemoFurnitureMattressOutlet'));
const AdminRecentAIActivity = lazy(() => import('./pages/AdminRecentAIActivity'));
const RebuildIntake = lazy(() => import('./pages/Rebuild-Intake'));
const SocialMediaManagement = lazy(() => import('./pages/SocialMediaManagement'));
const SocialMediaMasonCity = lazy(() => import('./pages/SocialMediaMasonCity'));
const SocialMediaRochesterMN = lazy(() => import('./pages/SocialMediaRochesterMN'));
const SocialMediaAustinMN = lazy(() => import('./pages/SocialMediaAustinMN'));
const SocialMediaAlbertLeaMN = lazy(() => import('./pages/SocialMediaAlbertLeaMN'));
const AgencyDashboard = lazy(() => import('./pages/AgencyDashboard'));
const NTACommandDashboard = lazy(() => import('./pages/NTACommandDashboard'));
const AgencyClients = lazy(() => import('./pages/AgencyClients'));
const AgencyPipeline = lazy(() => import('./pages/AgencyPipeline'));
const AgencyContent = lazy(() => import('./pages/AgencyContent'));
const AgencyWebsites = lazy(() => import('./pages/AgencyWebsites'));
const AgencyLeads = lazy(() => import('./pages/AgencyLeads'));
const AgencyClientCMS = lazy(() => import('./pages/agency/AgencyClientCMS'));
const NTAContentDashboard = lazy(() => import('./pages/NTAContentDashboard'));
const HVACFunnel1 = lazy(() => import('./pages/HVACFunnel1'));
const HVACFunnel2 = lazy(() => import('./pages/HVACFunnel2'));
const HVACFunnel3 = lazy(() => import('./pages/HVACFunnel3'));
const HVACFunnel4 = lazy(() => import('./pages/HVACFunnel4'));
const HVACFunnel5 = lazy(() => import('./pages/HVACFunnel5'));
const HVACFunnelThankYou = lazy(() => import('./pages/HVACFunnelThankYou'));
const NTACommandCenter = lazy(() => import('./pages/NTACommandCenter'));
const NTASubmissions = lazy(() => import('./pages/NTASubmissions'));
const NTACompanies = lazy(() => import('./pages/NTACompanies'));
const NTACompanyDetail = lazy(() => import('./pages/NTACompanyDetail'));
const NTAOpportunities = lazy(() => import('./pages/NTAOpportunities'));
const NTAClients = lazy(() => import('./pages/NTAClients'));
const NTAProjects = lazy(() => import('./pages/NTAProjects'));
const NTACampaigns = lazy(() => import('./pages/NTACampaigns'));
const NTATasks = lazy(() => import('./pages/NTATasks'));
const NTAActivityLog = lazy(() => import('./pages/NTAActivityLog'));
const NTASystemHealth = lazy(() => import('./pages/NTASystemHealth'));
const NTAMigration = lazy(() => import('./pages/NTAMigration'));
const ContentWizardList = lazy(() => import('./pages/ContentWizardList'));
const ContentWizardDetail = lazy(() => import('./pages/ContentWizardDetail'));
const LeadWizardList = lazy(() => import('./pages/LeadWizardList'));
const LeadWizardDetail = lazy(() => import('./pages/LeadWizardDetail'));
const ChannelConnections = lazy(() => import('./pages/ChannelConnections'));
const ClientChannelSetup = lazy(() => import('./pages/ClientChannelSetup'));
const ClientChannelSetupPublic = lazy(() => import('./pages/ClientChannelSetupPublic'));
const PublishingQueuePage = lazy(() => import('./pages/PublishingQueue'));
const PublishingOps = lazy(() => import('./pages/PublishingOps'));
const AgencyCampaigns = lazy(() => import('./pages/AgencyCampaigns'));
const AgencyContentQueue = lazy(() => import('./pages/AgencyContentQueue'));
const AgencyApprovals = lazy(() => import('./pages/AgencyApprovals'));
const ClientApprovalSignoff = lazy(() => import('./pages/ClientApprovalSignoff'));
const AgencyPortalManager = lazy(() => import('./pages/AgencyPortalManager'));
const AgencyClientDetail = lazy(() => import('./pages/AgencyClientDetail'));
const ClientSetupWizard = lazy(() => import('./pages/ClientSetupWizard'));
const AgencySpokeCampaigns = lazy(() => import('./pages/AgencySpokeCampaigns'));
const SpokeCampaignDetail = lazy(() => import('./pages/SpokeCampaignDetail'));
const AgencyContentAssets = lazy(() => import('./pages/AgencyContentAssets'));
const ContentLibrary = lazy(() => import('./pages/ContentLibrary'));
const AgencyVideoQueue = lazy(() => import('./pages/AgencyVideoQueue'));
const AgencySocialQueue = lazy(() => import('./pages/AgencySocialQueue'));
const AgencyApprovalCenter = lazy(() => import('./pages/AgencyApprovalCenter'));
const AgencyPublishingCalendar = lazy(() => import('./pages/AgencyPublishingCalendar'));
const AgencyCampaignPerformance = lazy(() => import('./pages/AgencyCampaignPerformance'));
const AgencyInsightPages = lazy(() => import('./pages/AgencyInsightPages'));
const InsightsList = lazy(() => import('./pages/InsightsList'));
const InsightDetail = lazy(() => import('./pages/InsightDetail'));
const OurWork = lazy(() => import('./pages/OurWork'));
const RestaurantDemo = lazy(() => import('./pages/RestaurantDemo'));
const RestaurantDemoPizza = lazy(() => import('./pages/RestaurantDemoPizza'));
const RestaurantDemoMexican = lazy(() => import('./pages/RestaurantDemoMexican'));
const RestaurantDemoBar = lazy(() => import('./pages/RestaurantDemoBar'));
const PortalDashboard = lazy(() => import('./pages/portal/PortalDashboard'));
const PortalApprovals = lazy(() => import('./pages/portal/PortalApprovals'));
const PortalCalendar = lazy(() => import('./pages/portal/PortalCalendar'));
const PortalContent = lazy(() => import('./pages/portal/PortalContent'));
const PortalPerformance = lazy(() => import('./pages/portal/PortalPerformance'));
const PortalMessages = lazy(() => import('./pages/portal/PortalMessages'));
const PortalAccount = lazy(() => import('./pages/portal/PortalAccount'));
const LocalLeadSystems = lazy(() => import('./pages/LocalLeadSystems'));
const WebsiteRebuildsNTA = lazy(() => import('./pages/WebsiteRebuildsNTA'));
const SEOPagesForLocalBusinesses = lazy(() => import('./pages/SEOPagesForLocalBusinesses'));
const SeasonalCampaigns = lazy(() => import('./pages/SeasonalCampaigns'));
const SocialMediaContentSystem = lazy(() => import('./pages/SocialMediaContentSystem'));
const AIVideoMarketing = lazy(() => import('./pages/AIVideoMarketing'));
const HVACMarketingNorthIowa = lazy(() => import('./pages/HVACMarketingNorthIowa'));
const ContractorMarketingNorthIowa = lazy(() => import('./pages/ContractorMarketingNorthIowa'));
const SmallBusinessMarketingNorthIowa = lazy(() => import('./pages/SmallBusinessMarketingNorthIowa'));
const OpsDashboard = lazy(() => import('./pages/ops/OpsDashboard'));
const OpsCampaignDetail = lazy(() => import('./pages/ops/OpsCampaignDetail'));
const AgencyGapAudits = lazy(() => import('./pages/AgencyGapAudits'));
const AgencyGapAuditDetail = lazy(() => import('./pages/AgencyGapAuditDetail'));
// GapAuditPublic removed
const OpsProspects = lazy(() => import('./pages/ops/OpsProspects'));
const OpsClients = lazy(() => import('./pages/ops/OpsClients'));
const OpsAudits = lazy(() => import('./pages/ops/OpsAudits'));
const OpsCampaigns = lazy(() => import('./pages/ops/OpsCampaigns'));
const OpsSEOPages = lazy(() => import('./pages/ops/OpsSEOPages'));
const OpsContent = lazy(() => import('./pages/ops/OpsContent'));
const OpsVideos = lazy(() => import('./pages/ops/OpsVideos'));
const OpsSocial = lazy(() => import('./pages/ops/OpsSocial'));
const OpsApprovals = lazy(() => import('./pages/ops/OpsApprovals'));
const OpsLeads = lazy(() => import('./pages/ops/OpsLeads'));
const OpsOnboarding = lazy(() => import('./pages/ops/OpsOnboarding'));
const OpsAIMonitor = lazy(() => import('./pages/ops/OpsAIMonitor'));
const OpsAgreements = lazy(() => import('./pages/ops/OpsAgreements'));
const OpsDocuments = lazy(() => import('./pages/ops/OpsDocuments'));
const ClientPortalV2 = lazy(() => import('./pages/client-portal-v2/ClientPortal'));
const DocumentSigner = lazy(() => import('./pages/client-portal-v2/DocumentSigner'));
const OpsFollowUps = lazy(() => import('./pages/ops/OpsFollowUps'));
const OpsReports = lazy(() => import('./pages/ops/OpsReports'));
const LeadPipelineKanban = lazy(() => import('./pages/LeadPipelineKanban'));
const LeadDetailPage = lazy(() => import('./pages/LeadDetailPage'));
const CaseStudyDetail = lazy(() => import('./pages/CaseStudyDetail'));
const JohnsonHeatingCaseStudy = lazy(() => import('./pages/JohnsonHeatingCaseStudy'));
const AiGapScanner = lazy(() => import('./pages/AiGapScanner'));
const VideoEngineList = lazy(() => import('./pages/VideoEngineList'));
const VideoEngineDetail = lazy(() => import('./pages/VideoEngineDetail'));
const LCVideoLibrary = lazy(() => import('./pages/LCVideoLibrary'));
const LCVideoDetail = lazy(() => import('./pages/LCVideoDetail'));
const LCCategory = lazy(() => import('./pages/LCCategory'));
const WhatChangedOnline = lazy(() => import('./pages/WhatChangedOnline'));
const AIVisibilityBasics = lazy(() => import('./pages/AIVisibilityBasics'));
const PracticalAIForSmallBusinesses = lazy(() => import('./pages/PracticalAIForSmallBusinesses'));
const SEOVsAISearch = lazy(() => import('./pages/SEOVsAISearch'));
const GrowthSystemsVsCampaigns = lazy(() => import('./pages/GrowthSystemsVsCampaigns'));
const DigitalRisks = lazy(() => import('./pages/DigitalRisks'));
const ReputationIsNowAGrowthEngine = lazy(() => import('./pages/ReputationIsNowAGrowthEngine'));
const TheHiddenCostOfOutdatedMarketing = lazy(() => import('./pages/TheHiddenCostOfOutdatedMarketing'));
const TheRoleOfAIInLocalMarketing = lazy(() => import('./pages/TheRoleOfAIInLocalMarketing'));
const VideoStorytellingBuildsConfidence = lazy(() => import('./pages/VideoStorytellingBuildsConfidence'));
const CampaignsVsAuthority = lazy(() => import('./pages/CampaignsVsAuthority'));
const TheFutureBelongsToMarketLeaders = lazy(() => import('./pages/TheFutureBelongsToMarketLeaders'));
const BuildingDigitalTrust = lazy(() => import('./pages/BuildingDigitalTrust'));
const AccessibleWebsites = lazy(() => import('./pages/AccessibleWebsites'));
const WebAccessibilityTrust = lazy(() => import('./pages/WebAccessibilityTrust'));
const WebsitesAsSalespeople = lazy(() => import('./pages/WebsitesAsSalespeople'));
const BackOfficeSolutions = lazy(() => import('./pages/BackOfficeSolutions'));
const RestaurantSolutions = lazy(() => import('./pages/RestaurantSolutions'));
const NTAGrowthConversation = lazy(() => import('./pages/NTAGrowthConversation'));
const NTARelationshipBuilder = lazy(() => import('./pages/NTARelationshipBuilder.jsx'));
const CommunityGrowthConversation = lazy(() => import('./pages/CommunityGrowthConversation'));
const NTAOperatingSystem = lazy(() => import('./pages/NTAOperatingSystem.jsx'));
const GrowthGuide = lazy(() => import('./pages/GrowthGuide.jsx'));
const MyGrowthJourney = lazy(() => import('./pages/MyGrowthJourney.jsx'));
const NTABusinessScore = lazy(() => import('./pages/NTABusinessScore.jsx'));
const NTAGrowthRoadmapGenerator = lazy(() => import('./pages/NTAGrowthRoadmapGenerator.jsx'));
const NTAExecutiveDashboard = lazy(() => import('./pages/NTAExecutiveDashboard.jsx'));
const PartnerPortal = lazy(() => import('./pages/PartnerPortal.jsx'));
const CommunityIntelligence = lazy(() => import('./pages/CommunityIntelligence.jsx'));
const NTADataHub = lazy(() => import('./pages/NTADataHub.jsx'));
const BusinessProfile = lazy(() => import('./pages/BusinessProfile.jsx'));
const ProgressCenter = lazy(() => import('./pages/ProgressCenter.jsx'));
const MyGrowthWorkspace = lazy(() => import('./pages/MyGrowthWorkspace.jsx'));
const RickAdminCenter = lazy(() => import('./pages/RickAdminCenter.jsx'));
const BillingCenter = lazy(() => import('./pages/BillingCenter.jsx'));
const SupportCenter = lazy(() => import('./pages/SupportCenter.jsx'));
const ClientOnboardingCenter = lazy(() => import('./pages/ClientOnboardingCenter.jsx'));
const CommunityGrowthAdvisor = lazy(() => import('./pages/CommunityGrowthAdvisor.jsx'));
const PartnerQuickStart = lazy(() => import('./pages/PartnerQuickStart.jsx'));
const BusinessJourney = lazy(() => import('./pages/BusinessJourney.jsx'));
const OurStory = lazy(() => import('./pages/OurStory.jsx'));

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const PageLoader = () => (
  <>
    <style>{`@keyframes custom-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #e5e7eb', borderTop: '3px solid #0a7cc4', borderRadius: '50%', animation: 'custom-spin 1s linear infinite', margin: '0 auto 12px' }}></div>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Loading...</p>
      </div>
    </div>
  </>
);

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

// ─── Route Governance (R-002) ────────────────────────────────────────────────
// Access control is driven by src/config/routeGovernance.js — the single source
// of truth for which routes are public, auth-required, or role-restricted.

const AuthGate = ({ children }) => {
  const { user, isLoadingAuth, authError, navigateToLogin } = useAuth();
  const pathname = window.location.pathname;
  const access = classifyRoute(pathname);
  const needsAuth = requiresAuth(access);
  const needsNoIndex = shouldNoIndex(access);

  // Public / noindex paths — no auth needed
  if (!needsAuth) {
    return (
      <>
        {needsNoIndex && <NoIndexMeta />}
        {children}
      </>
    );
  }

  // Protected path — check auth
  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  // User is authenticated — check role access
  if (user && !userHasAccess(access, user)) {
    // Redirect unauthorized users to appropriate dashboard
    const ADMIN_EMAILS = ['info@newtechadvertising.com', 'newtechad1@gmail.com'];
    const isAdmin = user.role === 'admin' || ADMIN_EMAILS.includes(user.email?.toLowerCase());
    if (isAdmin) {
      window.location.href = '/admin-dashboard';
    } else {
      window.location.href = '/client-dashboard';
    }
    return null;
  }

  return (
    <>
      <NoIndexMeta />
      {children}
    </>
  );
};

const AuthenticatedApp = () => {
  const { authError } = useAuth();

  // Render the main app
  return (
    <AuthGate>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={
        <LayoutWrapper currentPageName="Home">
          <Home />
        </LayoutWrapper>
      } />
      <Route path="/Login" element={<LayoutWrapper currentPageName="Login"><Login /></LayoutWrapper>} />
      <Route path="/signup" element={<LayoutWrapper currentPageName="SignupPage"><SignupPage /></LayoutWrapper>} />
      <Route path="/admin-dashboard" element={<AdminGuard><AdminLayout currentPageName="AdminDashboard"><AdminDashboard /></AdminLayout></AdminGuard>} />
      <Route path="/client-dashboard" element={<ClientGuard><LayoutWrapper currentPageName="ClientDashboard"><ClientDashboard /></LayoutWrapper></ClientGuard>} />
      <Route path="/client/dashboard" element={<Navigate to="/client-dashboard" replace />} />
      {Object.entries(Pages).map(([path, Page]) => {
        const pageAccess = classifyPageKey(path);
        const noIndex = shouldNoIndex(pageAccess);
        return (
          <Route
            key={path}
            path={`/${path}`}
            element={
              <LayoutWrapper currentPageName={path}>
                {noIndex && <NoIndexMeta />}
                <Page />
              </LayoutWrapper>
            }
          />
        );
      })}
      <Route path="/admin/ai-workforce-legacy" element={<AdminGuard><AdminLayout currentPageName="AIWorkforce"><AIWorkforce /></AdminLayout></AdminGuard>} />
      <Route path="/admin/founder-scorecard" element={<AdminGuard><AdminLayout currentPageName="FounderScorecard"><FounderScorecard /></AdminLayout></AdminGuard>} />
      <Route path="/client/campaigns" element={<LayoutWrapper currentPageName="ClientCampaigns"><ClientCampaigns /></LayoutWrapper>} />
      <Route path="/admin/campaigns" element={<AdminGuard><AdminLayout currentPageName="AdminCampaigns"><AdminCampaigns /></AdminLayout></AdminGuard>} />
      <Route path="/client/referrals" element={<LayoutWrapper currentPageName="ClientReferrals"><ClientReferrals /></LayoutWrapper>} />
      <Route path="/client/referral-status" element={<LayoutWrapper currentPageName="ClientReferralStatus"><ClientReferralStatus /></LayoutWrapper>} />
      <Route path="/client/roi" element={<LayoutWrapper currentPageName="ClientROI"><ClientROI /></LayoutWrapper>} />
      <Route path="/client/roi-reports" element={<LayoutWrapper currentPageName="ClientROIReports"><ClientROIReports /></LayoutWrapper>} />
      <Route path="/client/roi-timeline" element={<LayoutWrapper currentPageName="ClientROITimeline"><ClientROITimeline /></LayoutWrapper>} />
      <Route path="/admin/referrals" element={<AdminGuard><AdminLayout currentPageName="AdminReferrals"><AdminReferrals /></AdminLayout></AdminGuard>} />
      <Route path="/client/locations" element={<LayoutWrapper currentPageName="ClientLocations"><ClientLocations /></LayoutWrapper>} />
      <Route path="/admin/enterprise-accounts" element={<AdminGuard><AdminLayout currentPageName="AdminEnterpriseAccounts"><AdminEnterpriseAccounts /></AdminLayout></AdminGuard>} />
      <Route path="/admin/location-performance" element={<AdminGuard><AdminLayout currentPageName="AdminLocationPerformance"><AdminLocationPerformance /></AdminLayout></AdminGuard>} />
      <Route path="/admin/vertical-intelligence" element={<AdminGuard><AdminLayout currentPageName="AdminVerticalIntelligence"><AdminVerticalIntelligence /></AdminLayout></AdminGuard>} />
      <Route path="/admin/vertical-revenue" element={<AdminGuard><AdminLayout currentPageName="AdminVerticalRevenue"><AdminVerticalRevenue /></AdminLayout></AdminGuard>} />
      <Route path="/admin/vertical-campaigns" element={<AdminGuard><AdminLayout currentPageName="AdminVerticalCampaigns"><AdminVerticalCampaigns /></AdminLayout></AdminGuard>} />
      <Route path="/admin/vertical-expansion" element={<AdminGuard><AdminLayout currentPageName="AdminVerticalExpansion"><AdminVerticalExpansion /></AdminLayout></AdminGuard>} />
      <Route path="/admin/expansion-playbook" element={<AdminGuard><AdminLayout currentPageName="AdminExpansionPlaybook"><AdminExpansionPlaybook /></AdminLayout></AdminGuard>} />
      <Route path="/admin/expansion-execution" element={<AdminGuard><AdminLayout currentPageName="AdminExpansionExecution"><AdminExpansionExecution /></AdminLayout></AdminGuard>} />
      <Route path="/admin/expansion-territories" element={<AdminGuard><AdminLayout currentPageName="AdminExpansionTerritories"><AdminExpansionTerritories /></AdminLayout></AdminGuard>} />
      <Route path="/admin/expansion-revenue" element={<AdminGuard><AdminLayout currentPageName="AdminExpansionRevenue"><AdminExpansionRevenue /></AdminLayout></AdminGuard>} />
      <Route path="/admin/founder-planner" element={<AdminGuard><AdminLayout currentPageName="AdminFounderPlanner"><AdminFounderPlanner /></AdminLayout></AdminGuard>} />
      <Route path="/admin/founder-priorities" element={<AdminGuard><AdminLayout currentPageName="AdminFounderPriorities"><AdminFounderPriorities /></AdminLayout></AdminGuard>} />
      <Route path="/admin/founder-scorecard-weekly" element={<AdminGuard><AdminLayout currentPageName="AdminFounderScorecardWeekly"><AdminFounderScorecardWeekly /></AdminLayout></AdminGuard>} />
      <Route path="/admin/founder-scenarios" element={<AdminGuard><AdminLayout currentPageName="AdminFounderScenarios"><AdminFounderScenarios /></AdminLayout></AdminGuard>} />
      <Route path="/admin/client-success" element={<AdminGuard><AdminLayout currentPageName="AdminClientSuccess"><AdminClientSuccess /></AdminLayout></AdminGuard>} />
      <Route path="/admin/client-retention" element={<AdminGuard><AdminLayout currentPageName="AdminClientRetention"><AdminClientRetention /></AdminLayout></AdminGuard>} />
      <Route path="/admin/client-expansion" element={<AdminGuard><AdminLayout currentPageName="AdminClientExpansion"><AdminClientExpansion /></AdminLayout></AdminGuard>} />
      <Route path="/admin/client-ltv" element={<AdminGuard><AdminLayout currentPageName="AdminClientLTV"><AdminClientLTV /></AdminLayout></AdminGuard>} />
      <Route path="/admin/operations" element={<AdminGuard><AdminLayout currentPageName="AdminOperations"><AdminOperations /></AdminLayout></AdminGuard>} />
      <Route path="/admin/operations-capacity" element={<AdminGuard><AdminLayout currentPageName="AdminOperationsCapacity"><AdminOperationsCapacity /></AdminLayout></AdminGuard>} />
      <Route path="/admin/operations-sla" element={<AdminGuard><AdminLayout currentPageName="AdminOperationsSLA"><AdminOperationsSLA /></AdminLayout></AdminGuard>} />
      <Route path="/admin/operations-efficiency" element={<AdminGuard><AdminLayout currentPageName="AdminOperationsEfficiency"><AdminOperationsEfficiency /></AdminLayout></AdminGuard>} />
      <Route path="/admin/control-tower" element={<AdminGuard><AdminLayout currentPageName="AdminControlTower"><AdminControlTower /></AdminLayout></AdminGuard>} />
      <Route path="/admin/control-tower-insights" element={<AdminGuard><AdminLayout currentPageName="AdminControlTowerInsights"><AdminControlTowerInsights /></AdminLayout></AdminGuard>} />
      <Route path="/admin/control-tower-risk" element={<AdminGuard><AdminLayout currentPageName="AdminControlTowerRisk"><AdminControlTowerRisk /></AdminLayout></AdminGuard>} />
      <Route path="/admin/control-tower-actions" element={<AdminGuard><AdminLayout currentPageName="AdminControlTowerActions"><AdminControlTowerActions /></AdminLayout></AdminGuard>} />
      <Route path="/admin/roi-expansion" element={<AdminGuard><AdminLayout currentPageName="AdminROIExpansion"><AdminROIExpansion /></AdminLayout></AdminGuard>} />
      <Route path="/admin/funnel-optimization" element={<AdminGuard><AdminLayout currentPageName="AdminFunnelOptimization"><AdminFunnelOptimization /></AdminLayout></AdminGuard>} />
      <Route path="/admin/funnel-pages" element={<AdminGuard><AdminLayout currentPageName="AdminFunnelPages"><AdminFunnelPages /></AdminLayout></AdminGuard>} />
      <Route path="/admin/funnel-tests" element={<AdminGuard><AdminLayout currentPageName="AdminFunnelTests"><AdminFunnelTests /></AdminLayout></AdminGuard>} />
      <Route path="/admin/funnel-opportunities" element={<AdminGuard><AdminLayout currentPageName="AdminFunnelOpportunities"><AdminFunnelOpportunities /></AdminLayout></AdminGuard>} />
      <Route path="/admin/ai-workforce" element={<AdminGuard><AdminLayout currentPageName="AdminAIWorkforce"><AdminAIWorkforce /></AdminLayout></AdminGuard>} />
      <Route path="/admin/ai-orchestration" element={<AdminGuard><AdminLayout currentPageName="AdminAIOrchestration"><AdminAIOrchestration /></AdminLayout></AdminGuard>} />
      <Route path="/admin/ai-routing" element={<AdminGuard><AdminLayout currentPageName="AdminAIRouting"><AdminAIRouting /></AdminLayout></AdminGuard>} />
      <Route path="/admin/ai-growth-loops" element={<AdminGuard><AdminLayout currentPageName="AdminAIGrowthLoops"><AdminAIGrowthLoops /></AdminLayout></AdminGuard>} />
      <Route path="/admin/ai-operations" element={<AdminGuard><AdminLayout currentPageName="AdminAIOperations"><AdminAIOperations /></AdminLayout></AdminGuard>} />
      <Route path="/admin/data-governance" element={<AdminGuard><AdminLayout currentPageName="AdminDataGovernance"><AdminDataGovernance /></AdminLayout></AdminGuard>} />
      <Route path="/admin/access-governance" element={<AdminGuard><AdminLayout currentPageName="AdminAccessGovernance"><AdminAccessGovernance /></AdminLayout></AdminGuard>} />
      <Route path="/admin/tenant-governance" element={<AdminGuard><AdminLayout currentPageName="AdminTenantGovernance"><AdminTenantGovernance /></AdminLayout></AdminGuard>} />
      <Route path="/reseller/dashboard" element={<LayoutWrapper currentPageName="ResellerDashboard"><ResellerDashboard /></LayoutWrapper>} />
      <Route path="/admin/page-registry" element={<AdminGuard><AdminLayout currentPageName="AdminPageRegistry"><AdminPageRegistry /></AdminLayout></AdminGuard>} />
      <Route path="/admin/workflows" element={<AdminGuard><AdminLayout currentPageName="AdminWorkflows"><AdminWorkflows /></AdminLayout></AdminGuard>} />
      <Route path="/admin/automation-rules" element={<AdminGuard><AdminLayout currentPageName="AdminAutomationRules"><AdminAutomationRules /></AdminLayout></AdminGuard>} />
      <Route path="/admin/automation-conditions" element={<AdminGuard><AdminLayout currentPageName="AdminAutomationConditions"><AdminAutomationConditions /></AdminLayout></AdminGuard>} />
      <Route path="/admin/automation-flows" element={<AdminGuard><AdminLayout currentPageName="AdminAutomationFlows"><AdminAutomationFlows /></AdminLayout></AdminGuard>} />
      <Route path="/admin/automation-performance" element={<AdminGuard><AdminLayout currentPageName="AdminAutomationPerformance"><AdminAutomationPerformance /></AdminLayout></AdminGuard>} />
      <Route path="/admin/knowledge" element={<AdminGuard><AdminLayout currentPageName="AdminKnowledge"><AdminKnowledge /></AdminLayout></AdminGuard>} />
      <Route path="/admin/knowledge-workflows" element={<AdminGuard><AdminLayout currentPageName="AdminKnowledgeWorkflows"><AdminKnowledgeWorkflows /></AdminLayout></AdminGuard>} />
      <Route path="/admin/knowledge-training" element={<AdminGuard><AdminLayout currentPageName="AdminKnowledgeTraining"><AdminKnowledgeTraining /></AdminLayout></AdminGuard>} />
      <Route path="/admin/knowledge-intelligence" element={<AdminGuard><AdminLayout currentPageName="AdminKnowledgeIntelligence"><AdminKnowledgeIntelligence /></AdminLayout></AdminGuard>} />
      <Route path="/admin/pricing-intelligence" element={<AdminGuard><AdminLayout currentPageName="AdminPricingIntelligence"><AdminPricingIntelligence /></AdminLayout></AdminGuard>} />
      <Route path="/admin/pricing-packaging" element={<AdminGuard><AdminLayout currentPageName="AdminPricingPackaging"><AdminPricingPackaging /></AdminLayout></AdminGuard>} />
      <Route path="/admin/pricing-experiments" element={<AdminGuard><AdminLayout currentPageName="AdminPricingExperiments"><AdminPricingExperiments /></AdminLayout></AdminGuard>} />
      <Route path="/admin/pricing-recommendations" element={<AdminGuard><AdminLayout currentPageName="AdminPricingRecommendations"><AdminPricingRecommendations /></AdminLayout></AdminGuard>} />
      <Route path="/admin/navigation-audit" element={<AdminGuard><AdminLayout currentPageName="AdminNavigationAudit"><AdminNavigationAudit /></AdminLayout></AdminGuard>} />
      <Route path="/admin/channels" element={<AdminGuard><AdminLayout currentPageName="AdminChannels"><AdminChannels /></AdminLayout></AdminGuard>} />
      <Route path="/client/channels" element={<LayoutWrapper currentPageName="ClientChannels"><ClientChannels /></LayoutWrapper>} />
      <Route path="/client/results" element={<LayoutWrapper currentPageName="ClientResults"><ClientResults /></LayoutWrapper>} />
      <Route path="/client/approvals" element={<LayoutWrapper currentPageName="ClientApprovals"><ClientApprovals /></LayoutWrapper>} />
      <Route path="/client/calendar" element={<LayoutWrapper currentPageName="ClientCalendar"><ClientCalendar /></LayoutWrapper>} />
      <Route path="/admin/production-stability" element={<AdminGuard><AdminLayout currentPageName="AdminProductionStability"><AdminProductionStability /></AdminLayout></AdminGuard>} />
      <Route path="/admin/platform-qa" element={<AdminGuard><AdminLayout currentPageName="AdminPlatformQA"><AdminPlatformQA /></AdminLayout></AdminGuard>} />
      <Route path="/admin/sales-command" element={<AdminGuard><AdminLayout currentPageName="AdminSalesCommand"><AdminSalesCommand /></AdminLayout></AdminGuard>} />
      <Route path="/sales/command-center" element={<LayoutWrapper currentPageName="SalesCommandCenter"><SalesCommandCenter /></LayoutWrapper>} />
      <Route path="/admin/sales-pipeline" element={<AdminGuard><AdminLayout currentPageName="NTASalesPipeline"><NTASalesPipeline /></AdminLayout></AdminGuard>} />
      <Route path="/admin/demo-machine" element={<AdminGuard><AdminLayout currentPageName="NTADemoMachine"><NTADemoMachine /></AdminLayout></AdminGuard>} />
      <Route path="/admin/proposal-generator" element={<AdminGuard><AdminLayout currentPageName="AdminProposalGenerator"><AdminProposalGenerator /></AdminLayout></AdminGuard>} />
      <Route path="/nta/deal-room/:prospectId" element={<LayoutWrapper currentPageName="NTADealRoom"><NTADealRoom /></LayoutWrapper>} />
      <Route path="/nta/onboarding" element={<LayoutWrapper currentPageName="NTAOnboardingCenter"><NTAOnboardingCenter /></LayoutWrapper>} />
      <Route path="/nta/channels" element={<LayoutWrapper currentPageName="NTAChannelHub"><NTAChannelHub /></LayoutWrapper>} />
      <Route path="/nta/reseller-command" element={<LayoutWrapper currentPageName="NTAResellerCommand"><NTAResellerCommand /></LayoutWrapper>} />
      <Route path="/nta/ai-workforce" element={<LayoutWrapper currentPageName="NTAAIWorkforceOrchestrator"><NTAAIWorkforceOrchestrator /></LayoutWrapper>} />
      <Route path="/nta" element={<Navigate to="/nta/operator-command" replace />} />
      <Route path="/nta/home" element={<NTAHomepage />} />
      <Route path="/nta/sales-followup" element={<LayoutWrapper currentPageName="NTASalesFollowUp"><NTASalesFollowUp /></LayoutWrapper>} />
      <Route path="/nta/pricing-stack" element={<LayoutWrapper currentPageName="NTAPricingStack"><NTAPricingStack /></LayoutWrapper>} />
      <Route path="/nta/acquisition-command" element={<LayoutWrapper currentPageName="NTAAcquisitionCommand"><NTAAcquisitionCommand /></LayoutWrapper>} />
      <Route path="/nta/automation-command" element={<LayoutWrapper currentPageName="AutomationCommandCenter"><AutomationCommandCenter /></LayoutWrapper>} />
      <Route path="/nta/operator-command" element={<LayoutWrapper currentPageName="NTAOperatorCommand"><NTAOperatorCommand /></LayoutWrapper>} />
      <Route path="/client/growth-journey" element={<LayoutWrapper currentPageName="ClientGrowthJourney"><ClientGrowthJourney /></LayoutWrapper>} />
      <Route path="/admin/retention-dashboard" element={<AdminGuard><AdminLayout currentPageName="AdminRetentionDashboard"><AdminRetentionDashboard /></AdminLayout></AdminGuard>} />
      <Route path="/nta/demo" element={<NTADemoFunnel />} />
      <Route path="/getting-started" element={<Navigate to="/start" replace />} />
      <Route path="/channel-help" element={<LayoutWrapper currentPageName="ChannelHelpCenter"><ChannelHelpCenter /></LayoutWrapper>} />
      <Route path="/book-call" element={<LayoutWrapper currentPageName="BookCall"><BookCall /></LayoutWrapper>} />
      <Route path="/admin/hot-prospects" element={<AdminGuard><AdminLayout currentPageName="AdminHotProspectsAlert"><AdminHotProspectsAlert /></AdminLayout></AdminGuard>} />
      <Route path="/nta/diy-growth-system" element={<LayoutWrapper currentPageName="DIYGrowthSystemSales"><DIYGrowthSystemSales /></LayoutWrapper>} />
      <Route path="/nta/pricing-ladder" element={<LayoutWrapper currentPageName="NTAPricingLadderPage"><NTAPricingLadderPage /></LayoutWrapper>} />
      <Route path="/client/diy-onboarding" element={<LayoutWrapper currentPageName="DIYOnboarding"><DIYOnboarding /></LayoutWrapper>} />
      <Route path="/client/diy-dashboard" element={<LayoutWrapper currentPageName="DIYDashboard"><DIYDashboard /></LayoutWrapper>} />
      <Route path="/client/diy-billing" element={<LayoutWrapper currentPageName="DIYBillingSettings"><DIYBillingSettings /></LayoutWrapper>} />
      <Route path="/diy-checkout-success" element={<DIYCheckoutSuccess />} />
      <Route path="/find-your-plan" element={<PricingWizard />} />
      {/* Demo Flow */}
      <Route path="/demo/flow" element={<LayoutWrapper currentPageName="DemoFlow"><DemoFlow /></LayoutWrapper>} />

      {/* Deal Room */}
      <Route path="/deal-room/:company" element={<LayoutWrapper currentPageName="DealRoom"><DealRoom /></LayoutWrapper>} />

      {/* Trial Onboarding Flow */}
      <Route path="/trial/welcome" element={<LayoutWrapper currentPageName="TrialWelcome"><TrialWelcome /></LayoutWrapper>} />
      <Route path="/trial/business" element={<LayoutWrapper currentPageName="TrialBusiness"><TrialBusiness /></LayoutWrapper>} />
      <Route path="/trial/channels" element={<LayoutWrapper currentPageName="TrialChannels"><TrialChannels /></LayoutWrapper>} />
      <Route path="/trial/activation" element={<LayoutWrapper currentPageName="TrialActivation"><TrialActivation /></LayoutWrapper>} />
      <Route path="/join-nta" element={<JoinNTA />} />
      <Route path="/services/website-rebuilds" element={<LayoutWrapper currentPageName="WebsiteRebuildService"><WebsiteRebuildService /></LayoutWrapper>} />
      <Route path="/services/social-media-management" element={<LayoutWrapper currentPageName="SocialMediaManagement"><SocialMediaManagement /></LayoutWrapper>} />
      <Route path="/social-media/mason-city-ia" element={<LayoutWrapper currentPageName="SocialMediaMasonCity"><SocialMediaMasonCity /></LayoutWrapper>} />
      <Route path="/social-media/rochester-mn" element={<LayoutWrapper currentPageName="SocialMediaRochesterMN"><SocialMediaRochesterMN /></LayoutWrapper>} />
      <Route path="/social-media/austin-mn" element={<LayoutWrapper currentPageName="SocialMediaAustinMN"><SocialMediaAustinMN /></LayoutWrapper>} />
      <Route path="/social-media/albert-lea-mn" element={<LayoutWrapper currentPageName="SocialMediaAlbertLeaMN"><SocialMediaAlbertLeaMN /></LayoutWrapper>} />
      <Route path="/knowledge" element={<LayoutWrapper currentPageName="NTABrandBook"><NTABrandBook /></LayoutWrapper>} />
      <Route path="/why-nta" element={<LayoutWrapper currentPageName="WhyNTA"><WhyNTA /></LayoutWrapper>} />
      <Route path="/knowledge/business-foundations" element={<LayoutWrapper currentPageName="BusinessFoundationsCollection"><BusinessFoundationsCollection /></LayoutWrapper>} />
      <Route path="/knowledge/business-foundations/:slug" element={<LayoutWrapper currentPageName="BusinessFoundationsLesson"><BusinessFoundationsLesson /></LayoutWrapper>} />
      <Route path="/knowledge/truth-about-business-growth" element={<LayoutWrapper currentPageName="TruthAboutBusinessGrowthCollection"><TruthAboutBusinessGrowthCollection /></LayoutWrapper>} />
      <Route path="/knowledge/truth-about-business-growth/:slug" element={<LayoutWrapper currentPageName="TruthAboutBusinessGrowthLesson"><TruthAboutBusinessGrowthLesson /></LayoutWrapper>} />
      <Route path="/knowledge/how-customers-decide-who-to-trust" element={<LayoutWrapper currentPageName="HowCustomersDecideWhoToTrustCollection"><HowCustomersDecideWhoToTrustCollection /></LayoutWrapper>} />
      <Route path="/knowledge/how-customers-decide-who-to-trust/:slug" element={<LayoutWrapper currentPageName="HowCustomersDecideWhoToTrustLesson"><HowCustomersDecideWhoToTrustLesson /></LayoutWrapper>} />
      <Route path="/knowledge/how-businesses-turn-trust-into-lasting-relationships" element={<LayoutWrapper currentPageName="HowBusinessesTurnTrustIntoLastingRelationshipsCollection"><HowBusinessesTurnTrustIntoLastingRelationshipsCollection /></LayoutWrapper>} />
      <Route path="/knowledge/how-businesses-turn-trust-into-lasting-relationships/:slug" element={<LayoutWrapper currentPageName="HowBusinessesTurnTrustIntoLastingRelationshipsLesson"><HowBusinessesTurnTrustIntoLastingRelationshipsLesson /></LayoutWrapper>} />
      <Route path="/knowledge/turning-what-a-business-knows-into-an-asset" element={<LayoutWrapper currentPageName="TurningWhatABusinessKnowsIntoAnAssetCollection"><TurningWhatABusinessKnowsIntoAnAssetCollection /></LayoutWrapper>} />
      <Route path="/knowledge/turning-what-a-business-knows-into-an-asset/:slug" element={<LayoutWrapper currentPageName="TurningWhatABusinessKnowsIntoAnAssetLesson"><TurningWhatABusinessKnowsIntoAnAssetLesson /></LayoutWrapper>} />
      <Route path="/knowledge/ai-foundations" element={<LayoutWrapper currentPageName="AIFoundationsCollection"><AIFoundationsCollection /></LayoutWrapper>} />
      <Route path="/knowledge/ai-foundations/:slug" element={<LayoutWrapper currentPageName="AIFoundationsLesson"><AIFoundationsLesson /></LayoutWrapper>} />
      <Route path="/knowledge/prompts" element={<LayoutWrapper currentPageName="KnowledgePrompts"><KnowledgePrompts /></LayoutWrapper>} />
      <Route path="/knowledge/sales-conversations" element={<LayoutWrapper currentPageName="SalesConversations"><SalesConversations /></LayoutWrapper>} />
      <Route path="/knowledge/playbook" element={<LayoutWrapper currentPageName="NTAPlaybook"><NTAPlaybook /></LayoutWrapper>} />
      <Route path="/brand-book" element={<LayoutWrapper currentPageName="NTABrandBook"><NTABrandBook /></LayoutWrapper>} />
      <Route path="/website-rebuilds/mason-city-ia" element={<LayoutWrapper currentPageName="WebsiteRebuildsMasonCity"><WebsiteRebuildsMasonCity /></LayoutWrapper>} />
      <Route path="/website-rebuilds/rochester-mn" element={<WebsiteRebuildsRochesterMN />} />
      <Route path="/website-rebuilds/austin-mn" element={<WebsiteRebuildsAustinMN />} />
      <Route path="/website-rebuilds/albert-lea-mn" element={<WebsiteRebuildsAlbertLeaMN />} />
      <Route path="/rebuild-intake" element={<RebuildIntake />} />
      <Route path="/admin/recruiting-candidates" element={<AdminGuard><AdminLayout currentPageName="AdminRecruitingCandidates"><AdminRecruitingCandidates /></AdminLayout></AdminGuard>} />
      <Route path="/admin/recent-ai-activity" element={<AdminGuard><AdminLayout currentPageName="AdminRecentAIActivity"><AdminRecentAIActivity /></AdminLayout></AdminGuard>} />
      <Route path="/audit/furniture-mattress-outlet" element={<AuditFurnitureMattressOutlet />} />
      <Route path="/community-partner" element={<LayoutWrapper currentPageName="CommunityPartnerProgram"><CommunityPartnerProgram /></LayoutWrapper>} />
      <Route path="/ai-policy" element={<LayoutWrapper currentPageName="AIPolicy"><AIPolicy /></LayoutWrapper>} />
      <Route path="/aipolicy" element={<Navigate to="/ai-policy" replace />} />
      {/* LEGACY: /dashboard routes — redirect to canonical Agency CRM */}
      <Route path="/dashboard" element={<Navigate to="/agency" replace />} />
      <Route path="/dashboard/leads" element={<Navigate to="/agency/leads" replace />} />
      <Route path="/dashboard/archived" element={<Navigate to="/agency/leads" replace />} />
      <Route path="/content-command" element={<ContentCommandDashboard />} />
      <Route path="/content-center" element={<ContentCommandCenter />} />
      {/* /clients and /clients/:id legacy redirects are defined below — ClientManager/ClientDetail accessible via /agency/clients */}
      <Route path="/agency/clients/:id/setup" element={<ClientSetupWizard />} />
      <Route path="/agency" element={<AgencyDashboard />} />
      <Route path="/agency/clients" element={<AgencyClients />} />
      <Route path="/agency/clients/:id" element={<LayoutWrapper currentPageName="AgencyClientDetail"><AgencyClientDetail /></LayoutWrapper>} />
      <Route path="/agency/clients/:id/cms" element={<AgencyClientCMS />} />
      <Route path="/agency/pipeline" element={<AgencyPipeline />} />
      <Route path="/agency/content" element={<AgencyContent />} />
      <Route path="/agency/websites" element={<AgencyWebsites />} />
      <Route path="/agency/leads" element={<AgencyLeads />} />
      <Route path="/agency/leads/pipeline" element={<LayoutWrapper currentPageName="LeadPipelineKanban"><LeadPipelineKanban /></LayoutWrapper>} />
      <Route path="/agency/leads/:id" element={<LayoutWrapper currentPageName="LeadDetailPage"><LeadDetailPage /></LayoutWrapper>} />
      <Route path="/case-studies/johnson-heating" element={<LayoutWrapper currentPageName="JohnsonHeatingCaseStudy"><JohnsonHeatingCaseStudy /></LayoutWrapper>} />
      <Route path="/case-studies/:slug" element={<LayoutWrapper currentPageName="CaseStudyDetail"><CaseStudyDetail /></LayoutWrapper>} />
      <Route path="/case-study/johnson-heating" element={<LayoutWrapper currentPageName="CaseStudyJohnsonHeating"><CaseStudyJohnsonHeating /></LayoutWrapper>} />
      <Route path="/case-study/monson-plumbing" element={<LayoutWrapper currentPageName="CaseStudyMonsonPlumbing"><CaseStudyMonsonPlumbing /></LayoutWrapper>} />
      <Route path="/case-study/papa-everetts" element={<LayoutWrapper currentPageName="CaseStudyPapaEveretts"><CaseStudyPapaEveretts /></LayoutWrapper>} />
      <Route path="/agency/ai-gap-scanner" element={<LayoutWrapper currentPageName="AiGapScanner"><AiGapScanner /></LayoutWrapper>} />
      <Route path="/agency/video-engine" element={<LayoutWrapper currentPageName="VideoEngineList"><VideoEngineList /></LayoutWrapper>} />
      <Route path="/agency/video-engine/:id" element={<LayoutWrapper currentPageName="VideoEngineDetail"><VideoEngineDetail /></LayoutWrapper>} />
      <Route path="/nta/content-dashboard" element={<NTAContentDashboard />} />
      <Route path="/hvac-funnel/1" element={<HVACFunnel1 />} />
      <Route path="/hvac-funnel/2" element={<HVACFunnel2 />} />
      <Route path="/hvac-funnel/3" element={<HVACFunnel3 />} />
      <Route path="/hvac-funnel/4" element={<HVACFunnel4 />} />
      <Route path="/hvac-funnel/5" element={<HVACFunnel5 />} />
      <Route path="/hvac-funnel/thank-you" element={<HVACFunnelThankYou />} />
      <Route path="/demo/furniture-mattress-outlet" element={<DemoFurnitureMattressOutlet />} />
      {/* NTA Operating System */}
      <Route path="/nta/command-center" element={<LayoutWrapper currentPageName="NTACommandCenter"><NTACommandCenter /></LayoutWrapper>} />
      <Route path="/nta/submissions" element={<LayoutWrapper currentPageName="NTASubmissions"><NTASubmissions /></LayoutWrapper>} />
      <Route path="/nta/companies" element={<LayoutWrapper currentPageName="NTACompanies"><NTACompanies /></LayoutWrapper>} />
      <Route path="/nta/companies/:id" element={<LayoutWrapper currentPageName="NTACompanyDetail"><NTACompanyDetail /></LayoutWrapper>} />
      <Route path="/nta/opportunities" element={<LayoutWrapper currentPageName="NTAOpportunities"><NTAOpportunities /></LayoutWrapper>} />
      <Route path="/nta/clients" element={<LayoutWrapper currentPageName="NTAClients"><NTAClients /></LayoutWrapper>} />
      <Route path="/nta/projects" element={<LayoutWrapper currentPageName="NTAProjects"><NTAProjects /></LayoutWrapper>} />
      <Route path="/nta/campaigns" element={<LayoutWrapper currentPageName="NTACampaigns"><NTACampaigns /></LayoutWrapper>} />
      <Route path="/nta/tasks" element={<LayoutWrapper currentPageName="NTATasks"><NTATasks /></LayoutWrapper>} />
      <Route path="/nta/activity" element={<LayoutWrapper currentPageName="NTAActivityLog"><NTAActivityLog /></LayoutWrapper>} />
      <Route path="/nta/system-health" element={<LayoutWrapper currentPageName="NTASystemHealth"><NTASystemHealth /></LayoutWrapper>} />
      <Route path="/nta/migration" element={<LayoutWrapper currentPageName="NTAMigration"><NTAMigration /></LayoutWrapper>} />
      <Route path="/agency/content-wizard" element={<ContentWizardList />} />
      <Route path="/agency/content-wizard/:id" element={<ContentWizardDetail />} />
      <Route path="/agency/lead-wizard" element={<LeadWizardList />} />
      <Route path="/agency/lead-wizard/:id" element={<LeadWizardDetail />} />
      <Route path="/agency/channel-connections" element={<LayoutWrapper currentPageName="ChannelConnections"><ChannelConnections /></LayoutWrapper>} />
      <Route path="/agency/channel-setup" element={<LayoutWrapper currentPageName="ClientChannelSetup"><ClientChannelSetup /></LayoutWrapper>} />
      <Route path="/client/channel-setup/:clientId" element={<ClientChannelSetupPublic />} />
      <Route path="/agency/publishing-queue" element={<LayoutWrapper currentPageName="PublishingQueuePage"><PublishingQueuePage /></LayoutWrapper>} />
      <Route path="/agency/publishing-ops" element={<LayoutWrapper currentPageName="PublishingOps"><PublishingOps /></LayoutWrapper>} />
      <Route path="/agency/campaigns" element={<LayoutWrapper currentPageName="AgencyCampaigns"><AgencyCampaigns /></LayoutWrapper>} />
      <Route path="/agency/content-queue" element={<LayoutWrapper currentPageName="AgencyContentQueue"><AgencyContentQueue /></LayoutWrapper>} />
      <Route path="/agency/approvals" element={<LayoutWrapper currentPageName="AgencyApprovals"><AgencyApprovals /></LayoutWrapper>} />
      <Route path="/agency/spoke-campaigns" element={<LayoutWrapper currentPageName="AgencySpokeCampaigns"><AgencySpokeCampaigns /></LayoutWrapper>} />
      <Route path="/agency/spoke-campaigns/:id" element={<LayoutWrapper currentPageName="SpokeCampaignDetail"><SpokeCampaignDetail /></LayoutWrapper>} />
      <Route path="/agency/content-asset" element={<LayoutWrapper currentPageName="AgencyContentAssets"><AgencyContentAssets /></LayoutWrapper>} />
      <Route path="/agency/content-library" element={<LayoutWrapper currentPageName="ContentLibrary"><ContentLibrary /></LayoutWrapper>} />
      <Route path="/agency/video-queue" element={<LayoutWrapper currentPageName="AgencyVideoQueue"><AgencyVideoQueue /></LayoutWrapper>} />
      <Route path="/agency/social-queue" element={<LayoutWrapper currentPageName="AgencySocialQueue"><AgencySocialQueue /></LayoutWrapper>} />
      <Route path="/agency/approval-center" element={<LayoutWrapper currentPageName="AgencyApprovalCenter"><AgencyApprovalCenter /></LayoutWrapper>} />
      <Route path="/agency/publishing-calendar" element={<LayoutWrapper currentPageName="AgencyPublishingCalendar"><AgencyPublishingCalendar /></LayoutWrapper>} />
      <Route path="/agency/campaign-performance" element={<LayoutWrapper currentPageName="AgencyCampaignPerformance"><AgencyCampaignPerformance /></LayoutWrapper>} />
      <Route path="/agency/insight-pages" element={<LayoutWrapper currentPageName="AgencyInsightPages"><AgencyInsightPages /></LayoutWrapper>} />
      <Route path="/our-work" element={<OurWork />} />
      <Route path="/restaurant-demo" element={<RestaurantDemo />} />
      <Route path="/restaurant-demo/pizza" element={<RestaurantDemoPizza />} />
      <Route path="/restaurant-demo/mexican" element={<RestaurantDemoMexican />} />
      <Route path="/restaurant-demo/bar" element={<RestaurantDemoBar />} />
      <Route path="/insights" element={<InsightsList />} />
      <Route path="/insights/:slug" element={<InsightDetail />} />
      <Route path="/agency/portal-manager" element={<LayoutWrapper currentPageName="AgencyPortalManager"><AgencyPortalManager /></LayoutWrapper>} />
      <Route path="/approval/:token" element={<ClientApprovalSignoff />} />
      {/* Client Portal */}
      <Route path="/portal" element={<PortalDashboard />} />
      <Route path="/portal/approvals" element={<PortalApprovals />} />
      <Route path="/portal/calendar" element={<PortalCalendar />} />
      <Route path="/portal/content" element={<PortalContent />} />
      <Route path="/portal/performance" element={<PortalPerformance />} />
      <Route path="/portal/messages" element={<PortalMessages />} />
      <Route path="/portal/account" element={<PortalAccount />} />
      {/* G-002: Homepage consolidation — all variants → canonical / */}
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/Home" element={<Navigate to="/" replace />} />
      <Route path="/index.html" element={<Navigate to="/" replace />} />
      <Route path="/HomePage" element={<Navigate to="/" replace />} />

      {/* Legacy route redirects — keep old URLs working */}
      <Route path="/dashboard" element={<Navigate to="/agency" replace />} />
      <Route path="/clients" element={<Navigate to="/agency/clients" replace />} />
      <Route path="/clients/:id" element={<LegacyClientRedirect />} />

      {/* NTA Service Pages */}
      <Route path="/local-lead-systems" element={<LocalLeadSystems />} />
      <Route path="/website-rebuilds" element={<WebsiteRebuildsNTA />} />
      <Route path="/seo-pages-for-local-businesses" element={<SEOPagesForLocalBusinesses />} />
      <Route path="/seasonal-campaigns" element={<SeasonalCampaigns />} />
      <Route path="/social-media-content-system" element={<SocialMediaContentSystem />} />
      <Route path="/ai-video-marketing" element={<AIVideoMarketing />} />
      <Route path="/gap-audit" element={<Navigate to="/free-audit" replace />} />
      <Route path="/GapAuditPage" element={<Navigate to="/free-audit" replace />} />
      <Route path="/agency/gap-audits" element={<LayoutWrapper currentPageName="AgencyGapAudits"><AgencyGapAudits /></LayoutWrapper>} />
      <Route path="/agency/gap-audits/:id" element={<AgencyGapAuditDetail />} />
      <Route path="/hvac-marketing-north-iowa" element={<HVACMarketingNorthIowa />} />
      <Route path="/contractor-marketing-north-iowa" element={<ContractorMarketingNorthIowa />} />
      <Route path="/small-business-marketing-north-iowa" element={<SmallBusinessMarketingNorthIowa />} />

      {/* NTA Ops Dashboard */}
      <Route path="/ops" element={<OpsDashboard />} />
      <Route path="/ops/prospects" element={<OpsProspects />} />
      <Route path="/ops/clients" element={<OpsClients />} />
      <Route path="/ops/audits" element={<OpsAudits />} />
      <Route path="/ops/campaigns" element={<OpsCampaigns />} />
      <Route path="/ops/campaigns/:id" element={<OpsCampaignDetail />} />
      <Route path="/ops/seo-pages" element={<OpsSEOPages />} />
      <Route path="/ops/content" element={<OpsContent />} />
      <Route path="/ops/videos" element={<OpsVideos />} />
      <Route path="/ops/social" element={<OpsSocial />} />
      <Route path="/ops/approvals" element={<OpsApprovals />} />
      <Route path="/ops/leads" element={<OpsLeads />} />
      <Route path="/ops/onboarding" element={<OpsOnboarding />} />
      <Route path="/ops/ai-monitor" element={<OpsAIMonitor />} />
      <Route path="/ops/agreements" element={<OpsAgreements />} />
      <Route path="/ops/documents" element={<OpsDocuments />} />
      <Route path="/c/:clientId" element={<ClientPortalV2 />} />
      <Route path="/c/:clientId/agreement/:agreementId" element={<DocumentSigner />} />
      <Route path="/ops/followups" element={<OpsFollowUps />} />
      <Route path="/ops/reports" element={<OpsReports />} />

      <Route path="/learning-center" element={<LayoutWrapper currentPageName="LearningCenter"><LearningCenter /></LayoutWrapper>} />
      <Route path="/learning-center/category/:id" element={<LayoutWrapper currentPageName="LCCategory"><LCCategory /></LayoutWrapper>} />
      <Route path="/learning-center/videos" element={<LayoutWrapper currentPageName="LCVideoLibrary"><LCVideoLibrary /></LayoutWrapper>} />
      <Route path="/learning-center/videos/:id" element={<LayoutWrapper currentPageName="LCVideoDetail"><LCVideoDetail /></LayoutWrapper>} />
      <Route path="/what-changed-online" element={<LayoutWrapper currentPageName="WhatChangedOnline"><WhatChangedOnline /></LayoutWrapper>} />
      <Route path="/ai-visibility-basics" element={<LayoutWrapper currentPageName="AIVisibilityBasics"><AIVisibilityBasics /></LayoutWrapper>} />
      <Route path="/practical-ai-for-small-businesses" element={<LayoutWrapper currentPageName="PracticalAIForSmallBusinesses"><PracticalAIForSmallBusinesses /></LayoutWrapper>} />
      <Route path="/seo-vs-ai-search" element={<LayoutWrapper currentPageName="SEOVsAISearch"><SEOVsAISearch /></LayoutWrapper>} />
      <Route path="/growth-systems-vs-campaigns" element={<LayoutWrapper currentPageName="GrowthSystemsVsCampaigns"><GrowthSystemsVsCampaigns /></LayoutWrapper>} />
      <Route path="/digital-risks" element={<LayoutWrapper currentPageName="DigitalRisks"><DigitalRisks /></LayoutWrapper>} />
      <Route path="/digital-risks" element={<LayoutWrapper currentPageName="DigitalRisks"><DigitalRisks /></LayoutWrapper>} />
      <Route path="/reputation-is-now-a-growth-engine" element={<LayoutWrapper currentPageName="ReputationIsNowAGrowthEngine"><ReputationIsNowAGrowthEngine /></LayoutWrapper>} />
      <Route path="/hidden-cost-of-outdated-marketing" element={<LayoutWrapper currentPageName="TheHiddenCostOfOutdatedMarketing"><TheHiddenCostOfOutdatedMarketing /></LayoutWrapper>} />
      <Route path="/role-of-ai-in-local-marketing" element={<LayoutWrapper currentPageName="TheRoleOfAIInLocalMarketing"><TheRoleOfAIInLocalMarketing /></LayoutWrapper>} />
      <Route path="/video-storytelling-builds-confidence" element={<LayoutWrapper currentPageName="VideoStorytellingBuildsConfidence"><VideoStorytellingBuildsConfidence /></LayoutWrapper>} />
      <Route path="/campaigns-vs-authority" element={<LayoutWrapper currentPageName="CampaignsVsAuthority"><CampaignsVsAuthority /></LayoutWrapper>} />
      <Route path="/the-future-belongs-to-market-leaders" element={<LayoutWrapper currentPageName="TheFutureBelongsToMarketLeaders"><TheFutureBelongsToMarketLeaders /></LayoutWrapper>} />
      <Route path="/building-digital-trust" element={<LayoutWrapper currentPageName="BuildingDigitalTrust"><BuildingDigitalTrust /></LayoutWrapper>} />
      <Route path="/accessible-websites" element={<LayoutWrapper currentPageName="AccessibleWebsites"><AccessibleWebsites /></LayoutWrapper>} />
      <Route path="/web-accessibility-trust" element={<LayoutWrapper currentPageName="WebAccessibilityTrust"><WebAccessibilityTrust /></LayoutWrapper>} />
      <Route path="/ada-compliance" element={<Navigate to="/accessible-websites" replace />} />
      <Route path="/ada-website-rebuild" element={<Navigate to="/accessible-websites" replace />} />
      <Route path="/ada-website-lawsuit-prevention" element={<Navigate to="/web-accessibility-trust" replace />} />
      <Route path="/websites-as-salespeople" element={<LayoutWrapper currentPageName="WebsitesAsSalespeople"><WebsitesAsSalespeople /></LayoutWrapper>} />
      <Route path="/ai-brought-me-out-of-retirement" element={<LayoutWrapper currentPageName="AiBroughtMeOutOfRetirement"><AiBroughtMeOutOfRetirement /></LayoutWrapper>} />
      <Route path="/i-was-early-again" element={<LayoutWrapper currentPageName="IWasEarlyAgain"><IWasEarlyAgain /></LayoutWrapper>} />
      <Route path="/PublishingEngine" element={<LayoutWrapper currentPageName="PublishingEngine"><PublishingEngine /></LayoutWrapper>} />
      <Route path="/PublishingArticleView" element={<LayoutWrapper currentPageName="PublishingArticleView"><PublishingArticleView /></LayoutWrapper>} />
      <Route path="/EditorialDashboard" element={<LayoutWrapper currentPageName="EditorialDashboard"><EditorialDashboard /></LayoutWrapper>} />
      <Route path="/journal" element={<LayoutWrapper currentPageName="JournalLanding"><JournalLanding /></LayoutWrapper>} />
      <Route path="/journal/:slug" element={<LayoutWrapper currentPageName="JournalIssueView"><JournalIssueView /></LayoutWrapper>} />
      <Route path="/canon" element={<LayoutWrapper currentPageName="CanonExplorer"><CanonExplorer /></LayoutWrapper>} />
      <Route path="/canon/collection/:slug" element={<LayoutWrapper currentPageName="CanonCollectionView"><CanonCollectionView /></LayoutWrapper>} />
      <Route path="/AdminCanonMigration" element={<LayoutWrapper currentPageName="AdminCanonMigration"><AdminCanonMigration /></LayoutWrapper>} />
      <Route path="/AdminCanonicalManagement" element={<LayoutWrapper currentPageName="AdminCanonicalManagement"><AdminCanonicalManagement /></LayoutWrapper>} />
      <Route path="/back-office" element={<Navigate to="/back-office-solutions" replace />} />
      <Route path="/back-office-solutions" element={<LayoutWrapper currentPageName="BackOfficeSolutions"><BackOfficeSolutions /></LayoutWrapper>} />
      <Route path="/restaurants" element={<LayoutWrapper currentPageName="RestaurantSolutions"><RestaurantSolutions /></LayoutWrapper>} />
      <Route path="/growth-conversation" element={<LayoutWrapper currentPageName="NTAGrowthConversation"><NTAGrowthConversation /></LayoutWrapper>} />
      <Route path="/relationship-builder" element={<LayoutWrapper currentPageName="NTARelationshipBuilder"><NTARelationshipBuilder /></LayoutWrapper>} />
      <Route path="/community-growth-conversation" element={<LayoutWrapper currentPageName="CommunityGrowthConversation"><CommunityGrowthConversation /></LayoutWrapper>} />
      <Route path="/operating-system" element={<LayoutWrapper currentPageName="NTAOperatingSystem"><NTAOperatingSystem /></LayoutWrapper>} />
      <Route path="/growth-guide" element={<GrowthGuide />} />
      <Route path="/my-growth-journey" element={<LayoutWrapper currentPageName="MyGrowthJourney"><MyGrowthJourney /></LayoutWrapper>} />
      <Route path="/business-score" element={<LayoutWrapper currentPageName="NTABusinessScore"><NTABusinessScore /></LayoutWrapper>} />
      <Route path="/growth-roadmap-generator" element={<LayoutWrapper currentPageName="NTAGrowthRoadmapGenerator"><NTAGrowthRoadmapGenerator /></LayoutWrapper>} />
      <Route path="/executive-dashboard" element={<AdminGuard><AdminLayout currentPageName="NTAExecutiveDashboard"><NTAExecutiveDashboard /></AdminLayout></AdminGuard>} />
      <Route path="/partner-portal" element={<AdminGuard><AdminLayout currentPageName="PartnerPortal"><PartnerPortal /></AdminLayout></AdminGuard>} />
      <Route path="/community-intelligence" element={<AdminGuard><AdminLayout currentPageName="CommunityIntelligence"><CommunityIntelligence /></AdminLayout></AdminGuard>} />
      <Route path="/nta/data-hub" element={<AdminGuard><AdminLayout currentPageName="NTADataHub"><NTADataHub /></AdminLayout></AdminGuard>} />
      <Route path="/business-profile" element={<LayoutWrapper currentPageName="BusinessProfile"><BusinessProfile /></LayoutWrapper>} />
      <Route path="/progress" element={<LayoutWrapper currentPageName="ProgressCenter"><ProgressCenter /></LayoutWrapper>} />
      <Route path="/workspace" element={<AdminGuard><AdminLayout currentPageName="MyGrowthWorkspace"><MyGrowthWorkspace /></AdminLayout></AdminGuard>} />
      <Route path="/admin-center" element={<AdminGuard><AdminLayout currentPageName="RickAdminCenter"><RickAdminCenter /></AdminLayout></AdminGuard>} />

      <Route path="/billing" element={<AdminGuard><AdminLayout currentPageName="BillingCenter"><BillingCenter /></AdminLayout></AdminGuard>} />
      <Route path="/support" element={<AdminGuard><AdminLayout currentPageName="SupportCenter"><SupportCenter /></AdminLayout></AdminGuard>} />
      <Route path="/onboarding" element={<AdminGuard><AdminLayout currentPageName="ClientOnboardingCenter"><ClientOnboardingCenter /></AdminLayout></AdminGuard>} />
      <Route path="/community-growth-advisor" element={<LayoutWrapper currentPageName="CommunityGrowthAdvisor"><CommunityGrowthAdvisor /></LayoutWrapper>} />
      <Route path="/partner-quick-start" element={<LayoutWrapper currentPageName="PartnerQuickStart"><PartnerQuickStart /></LayoutWrapper>} />
      <Route path="/business-journey" element={<LayoutWrapper currentPageName="BusinessJourney"><BusinessJourney /></LayoutWrapper>} />
      <Route path="/our-story" element={<LayoutWrapper currentPageName="OurStory"><OurStory /></LayoutWrapper>} />

      <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </AuthGate>
  );
};


function LegacyClientRedirect() {
  const { id } = useParams();
  return <Navigate to={`/agency/clients/${id}`} replace />;
}

function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <NTADataProvider>
          <Router>
            <ExperienceProvider>
              <AuthenticatedApp />
            </ExperienceProvider>
          </Router>
          <Toaster />
        </NTADataProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App; // Trigger rebuild
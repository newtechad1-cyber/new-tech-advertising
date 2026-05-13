import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import AIWorkforce from './pages/AIWorkforce';
import FounderScorecard from './pages/FounderScorecard';
import ClientCampaigns from './pages/ClientCampaigns';
import AdminCampaigns from './pages/AdminCampaigns';
import ClientReferrals from './pages/ClientReferrals';
import ClientReferralStatus from './pages/ClientReferralStatus';
import AdminReferrals from './pages/AdminReferrals';
import ClientLocations from './pages/ClientLocations';
import AdminEnterpriseAccounts from './pages/AdminEnterpriseAccounts';
import AdminLocationPerformance from './pages/AdminLocationPerformance';
import AdminVerticalIntelligence from './pages/AdminVerticalIntelligence';
import AdminVerticalRevenue from './pages/AdminVerticalRevenue';
import AdminVerticalCampaigns from './pages/AdminVerticalCampaigns';
import AdminVerticalExpansion from './pages/AdminVerticalExpansion';
import AdminExpansionPlaybook from './pages/AdminExpansionPlaybook';
import AdminExpansionExecution from './pages/AdminExpansionExecution';
import AdminExpansionTerritories from './pages/AdminExpansionTerritories';
import AdminExpansionRevenue from './pages/AdminExpansionRevenue';
import AdminFounderPlanner from './pages/AdminFounderPlanner';
import AdminFounderPriorities from './pages/AdminFounderPriorities';
import AdminFounderScorecardWeekly from './pages/AdminFounderScorecardWeekly';
import AdminFounderScenarios from './pages/AdminFounderScenarios';
import AdminClientSuccess from './pages/AdminClientSuccess';
import AdminClientRetention from './pages/AdminClientRetention';
import AdminClientExpansion from './pages/AdminClientExpansion';
import AdminClientLTV from './pages/AdminClientLTV';
import AdminOperations from './pages/AdminOperations';
import AdminOperationsCapacity from './pages/AdminOperationsCapacity';
import AdminOperationsSLA from './pages/AdminOperationsSLA';
import AdminOperationsEfficiency from './pages/AdminOperationsEfficiency';
import AdminControlTower from './pages/AdminControlTower';
import AdminControlTowerInsights from './pages/AdminControlTowerInsights';
import AdminControlTowerRisk from './pages/AdminControlTowerRisk';
import AdminControlTowerActions from './pages/AdminControlTowerActions';
import AdminROIExpansion from './pages/AdminROIExpansion';
import AdminFunnelOptimization from './pages/AdminFunnelOptimization';
import AdminFunnelPages from './pages/AdminFunnelPages';
import AdminFunnelTests from './pages/AdminFunnelTests';
import AdminFunnelOpportunities from './pages/AdminFunnelOpportunities';
import AdminAIWorkforce from './pages/AdminAIWorkforce';
import AdminAIOrchestration from './pages/AdminAIOrchestration';
import AdminAIRouting from './pages/AdminAIRouting';
import AdminAIGrowthLoops from './pages/AdminAIGrowthLoops';
import AdminAutomationRules from './pages/AdminAutomationRules';
import AdminAutomationConditions from './pages/AdminAutomationConditions';
import AdminAutomationFlows from './pages/AdminAutomationFlows';
import AdminAutomationPerformance from './pages/AdminAutomationPerformance';
import AdminKnowledge from './pages/AdminKnowledge';
import AdminKnowledgeWorkflows from './pages/AdminKnowledgeWorkflows';
import AdminKnowledgeTraining from './pages/AdminKnowledgeTraining';
import AdminKnowledgeIntelligence from './pages/AdminKnowledgeIntelligence';
import AdminPricingIntelligence from './pages/AdminPricingIntelligence';
import AdminPricingPackaging from './pages/AdminPricingPackaging';
import AdminPricingExperiments from './pages/AdminPricingExperiments';
import AdminPricingRecommendations from './pages/AdminPricingRecommendations';
import AdminNavigationAudit from './pages/AdminNavigationAudit';
import AdminChannels from './pages/AdminChannels';
import ClientChannels from './pages/ClientChannels';
import ClientResults from './pages/ClientResults';
import AdminProductionStability from './pages/AdminProductionStability';
import AdminPlatformQA from './pages/AdminPlatformQA';
import ClientROI from './pages/ClientROI';
import ClientROIReports from './pages/ClientROIReports';
import ClientROITimeline from './pages/ClientROITimeline';
import ClientDashboard from './pages/ClientDashboard';
import Home from './pages/Home';
import TrialWelcome from './pages/TrialWelcome';
import TrialBusiness from './pages/TrialBusiness';
import TrialChannels from './pages/TrialChannels';
import TrialActivation from './pages/TrialActivation';
import DemoFlow from './pages/DemoFlow';
import DealRoom from './pages/DealRoom';
import SalesCommandCenter from './pages/SalesCommandCenter';
import AdminSalesCommand from './pages/AdminSalesCommand';
import NTASalesPipeline from './pages/NTASalesPipeline';
import NTADemoMachine from './pages/NTADemoMachine';
import AdminProposalGenerator from './pages/AdminProposalGenerator';
import NTADealRoom from './pages/NTADealRoom';
import NTAOnboardingCenter from './pages/NTAOnboardingCenter';
import NTAChannelHub from './pages/NTAChannelHub';
import NTAResellerCommand from './pages/NTAResellerCommand';
import NTAAIWorkforceOrchestrator from './pages/NTAAIWorkforceOrchestrator';
import NTAHomepage from './pages/NTAHomepage';
import NTASalesFollowUp from './pages/NTASalesFollowUp';
import NTAPricingStack from './pages/NTAPricingStack';
import ClientGrowthJourney from './pages/ClientGrowthJourney';
import NTAOperatorCommand from './pages/NTAOperatorCommand';
import NTAAcquisitionCommand from './pages/NTAAcquisitionCommand';
import AutomationCommandCenter from './pages/AutomationCommandCenter';
import AdminRetentionDashboard from './pages/AdminRetentionDashboard';
import NTADemoFunnel from './pages/NTADemoFunnel';
import AdminAIOperations from './pages/AdminAIOperations';
import AdminDataGovernance from './pages/AdminDataGovernance';
import AdminAccessGovernance from './pages/AdminAccessGovernance';
import AdminTenantGovernance from './pages/AdminTenantGovernance';
import ResellerDashboard from './pages/ResellerDashboard';
import AdminPageRegistry from './pages/AdminPageRegistry';
import AdminWorkflows from './pages/AdminWorkflows';
import GettingStarted from './pages/GettingStarted';
import AdminHotProspectsAlert from './pages/AdminHotProspectsAlert';
import ChannelHelpCenter from './pages/ChannelHelpCenter';
import BookCall from './pages/BookCall';
import DIYGrowthSystemSales from './pages/DIYGrowthSystemSales';
import DIYOnboarding from './pages/DIYOnboarding';
import DIYDashboard from './pages/DIYDashboard';
import DIYPricingLadder from './pages/DIYPricingLadder';
import DIYBillingSettings from './pages/DIYBillingSettings';
import DIYCheckoutSuccess from './pages/DIYCheckoutSuccess';
import NTAPricingLadderPage from './pages/NTAPricingLadderPage';
import JoinNTA from './pages/JoinNTA';
import WebsiteRebuildService from './pages/WebsiteRebuildService';
import WebsiteRebuildsMasonCity from './pages/WebsiteRebuildsMasonCity';
import WebsiteRebuildsRochesterMN from './pages/WebsiteRebuildsRochesterMN';
import WebsiteRebuildsAustinMN from './pages/WebsiteRebuildsAustinMN';
import WebsiteRebuildsAlbertLeaMN from './pages/WebsiteRebuildsAlbertLeaMN';
import AdminRecruitingCandidates from './pages/AdminRecruitingCandidates';
import AuditFurnitureMattressOutlet from './pages/AuditFurnitureMattressOutlet';
import CRMDashboard from './pages/CRMDashboard';
import CRMArchivedLeads from './pages/CRMArchivedLeads';
import ContentCommandDashboard from './pages/ContentCommandDashboard';
import ContentCommandCenter from './pages/ContentCommandCenter';
import ClientManager from './pages/ClientManager';
import ClientDetail from './pages/ClientDetail';
import DemoFurnitureMattressOutlet from './pages/DemoFurnitureMattressOutlet';
import AdminRecentAIActivity from './pages/AdminRecentAIActivity';
import RebuildIntake from './pages/Rebuild-Intake';
import SocialMediaManagement from './pages/SocialMediaManagement';
import SocialMediaMasonCity from './pages/SocialMediaMasonCity';
import SocialMediaRochesterMN from './pages/SocialMediaRochesterMN';
import SocialMediaAustinMN from './pages/SocialMediaAustinMN';
import SocialMediaAlbertLeaMN from './pages/SocialMediaAlbertLeaMN';
import AgencyDashboard from './pages/AgencyDashboard';
import NTACommandDashboard from './pages/NTACommandDashboard';
import AgencyClients from './pages/AgencyClients';
import AgencyPipeline from './pages/AgencyPipeline';
import AgencyContent from './pages/AgencyContent';
import AgencyWebsites from './pages/AgencyWebsites';
import AgencyLeads from './pages/AgencyLeads';
import AgencyClientCMS from './pages/agency/AgencyClientCMS';
import NTAContentDashboard from './pages/NTAContentDashboard';
import HVACFunnel1 from './pages/HVACFunnel1';
import HVACFunnel2 from './pages/HVACFunnel2';
import HVACFunnel3 from './pages/HVACFunnel3';
import HVACFunnel4 from './pages/HVACFunnel4';
import HVACFunnel5 from './pages/HVACFunnel5';
import HVACFunnelThankYou from './pages/HVACFunnelThankYou';
import NTACommandCenter from './pages/NTACommandCenter';
import NTASubmissions from './pages/NTASubmissions';
import NTACompanies from './pages/NTACompanies';
import NTACompanyDetail from './pages/NTACompanyDetail';
import NTAOpportunities from './pages/NTAOpportunities';
import NTAClients from './pages/NTAClients';
import NTAProjects from './pages/NTAProjects';
import NTACampaigns from './pages/NTACampaigns';
import NTATasks from './pages/NTATasks';
import NTAActivityLog from './pages/NTAActivityLog';
import NTASystemHealth from './pages/NTASystemHealth';
import NTAMigration from './pages/NTAMigration';
import ContentWizardList from './pages/ContentWizardList';
import ContentWizardDetail from './pages/ContentWizardDetail';
import LeadWizardList from './pages/LeadWizardList';
import LeadWizardDetail from './pages/LeadWizardDetail';
import ChannelConnections from './pages/ChannelConnections';
import ClientChannelSetup from './pages/ClientChannelSetup';
import ClientChannelSetupPublic from './pages/ClientChannelSetupPublic';
import PublishingQueuePage from './pages/PublishingQueue';
import PublishingOps from './pages/PublishingOps';
import AgencyCampaigns from './pages/AgencyCampaigns';
import AgencyContentQueue from './pages/AgencyContentQueue';
import AgencyApprovals from './pages/AgencyApprovals';
import ClientApprovalSignoff from './pages/ClientApprovalSignoff';
import AgencyPortalManager from './pages/AgencyPortalManager';
import AgencyClientDetail from './pages/AgencyClientDetail';
import ClientSetupWizard from './pages/ClientSetupWizard';
import AgencySpokeCampaigns from './pages/AgencySpokeCampaigns';
import SpokeCampaignDetail from './pages/SpokeCampaignDetail';
import AgencyContentAssets from './pages/AgencyContentAssets';
import ContentLibrary from './pages/ContentLibrary';
import AgencyVideoQueue from './pages/AgencyVideoQueue';
import AgencySocialQueue from './pages/AgencySocialQueue';
import AgencyApprovalCenter from './pages/AgencyApprovalCenter';
import AgencyPublishingCalendar from './pages/AgencyPublishingCalendar';
import AgencyCampaignPerformance from './pages/AgencyCampaignPerformance';
import AgencyInsightPages from './pages/AgencyInsightPages';
import InsightsList from './pages/InsightsList';
import InsightDetail from './pages/InsightDetail';
import OurWork from './pages/OurWork';
import RestaurantDemo from './pages/RestaurantDemo';
import RestaurantDemoPizza from './pages/RestaurantDemoPizza';
import RestaurantDemoMexican from './pages/RestaurantDemoMexican';
import RestaurantDemoBar from './pages/RestaurantDemoBar';
import PortalDashboard from './pages/portal/PortalDashboard';
import PortalApprovals from './pages/portal/PortalApprovals';
import PortalCalendar from './pages/portal/PortalCalendar';
import PortalContent from './pages/portal/PortalContent';
import PortalPerformance from './pages/portal/PortalPerformance';
import PortalMessages from './pages/portal/PortalMessages';
import PortalAccount from './pages/portal/PortalAccount';
import LocalLeadSystems from './pages/LocalLeadSystems';
import WebsiteRebuildsNTA from './pages/WebsiteRebuildsNTA';
import SEOPagesForLocalBusinesses from './pages/SEOPagesForLocalBusinesses';
import SeasonalCampaigns from './pages/SeasonalCampaigns';
import SocialMediaContentSystem from './pages/SocialMediaContentSystem';
import AIVideoMarketing from './pages/AIVideoMarketing';
import GapAuditPage from './pages/GapAuditPage';
import HVACMarketingNorthIowa from './pages/HVACMarketingNorthIowa';
import ContractorMarketingNorthIowa from './pages/ContractorMarketingNorthIowa';
import SmallBusinessMarketingNorthIowa from './pages/SmallBusinessMarketingNorthIowa';
import OpsDashboard from './pages/ops/OpsDashboard';
import OpsCampaignDetail from './pages/ops/OpsCampaignDetail';
import AgencyGapAudits from './pages/AgencyGapAudits';
import AgencyGapAuditDetail from './pages/AgencyGapAuditDetail';
import GapAuditPublic from './pages/GapAuditPublic';
import OpsProspects from './pages/ops/OpsProspects';
import OpsClients from './pages/ops/OpsClients';
import OpsAudits from './pages/ops/OpsAudits';
import OpsCampaigns from './pages/ops/OpsCampaigns';
import OpsSEOPages from './pages/ops/OpsSEOPages';
import OpsContent from './pages/ops/OpsContent';
import OpsVideos from './pages/ops/OpsVideos';
import OpsSocial from './pages/ops/OpsSocial';
import OpsApprovals from './pages/ops/OpsApprovals';
import OpsLeads from './pages/ops/OpsLeads';
import OpsOnboarding from './pages/ops/OpsOnboarding';
import OpsAIMonitor from './pages/ops/OpsAIMonitor';
import OpsAgreements from './pages/ops/OpsAgreements';
import OpsDocuments from './pages/ops/OpsDocuments';
import ClientPortalV2 from './pages/client-portal-v2/ClientPortal';
import DocumentSigner from './pages/client-portal-v2/DocumentSigner';
import OpsFollowUps from './pages/ops/OpsFollowUps';
import OpsReports from './pages/ops/OpsReports';
import LeadPipelineKanban from './pages/LeadPipelineKanban';
import LeadDetailPage from './pages/LeadDetailPage';
import AiGapScanner from './pages/AiGapScanner';
import VideoEngineList from './pages/VideoEngineList';
import VideoEngineDetail from './pages/VideoEngineDetail';
import LearningCenter from './pages/LearningCenter';
import LCVideoLibrary from './pages/LCVideoLibrary';
import LCVideoDetail from './pages/LCVideoDetail';
import LCCategory from './pages/LCCategory';
import WhatChangedOnline from './pages/WhatChangedOnline';
import AIVisibilityBasics from './pages/AIVisibilityBasics';
import PracticalAIForSmallBusinesses from './pages/PracticalAIForSmallBusinesses';
import SEOVsAISearch from './pages/SEOVsAISearch';
import GrowthSystemsVsCampaigns from './pages/GrowthSystemsVsCampaigns';
import ReputationIsNowAGrowthEngine from './pages/ReputationIsNowAGrowthEngine';
import TheHiddenCostOfOutdatedMarketing from './pages/TheHiddenCostOfOutdatedMarketing';
import TheRoleOfAIInLocalMarketing from './pages/TheRoleOfAIInLocalMarketing';
import AccessibleWebsites from './pages/AccessibleWebsites';
import WebAccessibilityTrust from './pages/WebAccessibilityTrust';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

// Routes that require authentication — any path starting with these prefixes
const PROTECTED_PREFIXES = [
  '/agency', '/admin', '/nta', '/portal', '/ops',
  '/client/', '/reseller', '/sales', '/dashboard',
  '/content-command', '/content-center',
];

const isProtectedPath = (pathname) =>
  PROTECTED_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/') || pathname.startsWith(p));

const AuthGate = ({ children }) => {
  const { isLoadingAuth, authError, navigateToLogin } = useAuth();
  const pathname = window.location.pathname;

  // Public paths — never require auth
  if (!isProtectedPath(pathname)) {
    return <>{children}</>;
  }

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

  return <>{children}</>;
};

const AuthenticatedApp = () => {
  const { authError } = useAuth();

  // Render the main app
  return (
    <AuthGate>
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName="Home">
          <Home />
        </LayoutWrapper>
      } />
      <Route path="/client/dashboard" element={<LayoutWrapper currentPageName="ClientDashboard"><ClientDashboard /></LayoutWrapper>} />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="/admin/ai-workforce-legacy" element={<LayoutWrapper currentPageName="AIWorkforce"><AIWorkforce /></LayoutWrapper>} />
      <Route path="/admin/founder-scorecard" element={<LayoutWrapper currentPageName="FounderScorecard"><FounderScorecard /></LayoutWrapper>} />
      <Route path="/client/campaigns" element={<LayoutWrapper currentPageName="ClientCampaigns"><ClientCampaigns /></LayoutWrapper>} />
      <Route path="/admin/campaigns" element={<LayoutWrapper currentPageName="AdminCampaigns"><AdminCampaigns /></LayoutWrapper>} />
      <Route path="/client/referrals" element={<LayoutWrapper currentPageName="ClientReferrals"><ClientReferrals /></LayoutWrapper>} />
      <Route path="/client/referral-status" element={<LayoutWrapper currentPageName="ClientReferralStatus"><ClientReferralStatus /></LayoutWrapper>} />
      <Route path="/client/roi" element={<LayoutWrapper currentPageName="ClientROI"><ClientROI /></LayoutWrapper>} />
      <Route path="/client/roi-reports" element={<LayoutWrapper currentPageName="ClientROIReports"><ClientROIReports /></LayoutWrapper>} />
      <Route path="/client/roi-timeline" element={<LayoutWrapper currentPageName="ClientROITimeline"><ClientROITimeline /></LayoutWrapper>} />
      <Route path="/admin/referrals" element={<LayoutWrapper currentPageName="AdminReferrals"><AdminReferrals /></LayoutWrapper>} />
      <Route path="/client/locations" element={<LayoutWrapper currentPageName="ClientLocations"><ClientLocations /></LayoutWrapper>} />
      <Route path="/admin/enterprise-accounts" element={<LayoutWrapper currentPageName="AdminEnterpriseAccounts"><AdminEnterpriseAccounts /></LayoutWrapper>} />
      <Route path="/admin/location-performance" element={<LayoutWrapper currentPageName="AdminLocationPerformance"><AdminLocationPerformance /></LayoutWrapper>} />
      <Route path="/admin/vertical-intelligence" element={<LayoutWrapper currentPageName="AdminVerticalIntelligence"><AdminVerticalIntelligence /></LayoutWrapper>} />
      <Route path="/admin/vertical-revenue" element={<LayoutWrapper currentPageName="AdminVerticalRevenue"><AdminVerticalRevenue /></LayoutWrapper>} />
      <Route path="/admin/vertical-campaigns" element={<LayoutWrapper currentPageName="AdminVerticalCampaigns"><AdminVerticalCampaigns /></LayoutWrapper>} />
      <Route path="/admin/vertical-expansion" element={<LayoutWrapper currentPageName="AdminVerticalExpansion"><AdminVerticalExpansion /></LayoutWrapper>} />
      <Route path="/admin/expansion-playbook" element={<LayoutWrapper currentPageName="AdminExpansionPlaybook"><AdminExpansionPlaybook /></LayoutWrapper>} />
      <Route path="/admin/expansion-execution" element={<LayoutWrapper currentPageName="AdminExpansionExecution"><AdminExpansionExecution /></LayoutWrapper>} />
      <Route path="/admin/expansion-territories" element={<LayoutWrapper currentPageName="AdminExpansionTerritories"><AdminExpansionTerritories /></LayoutWrapper>} />
      <Route path="/admin/expansion-revenue" element={<LayoutWrapper currentPageName="AdminExpansionRevenue"><AdminExpansionRevenue /></LayoutWrapper>} />
      <Route path="/admin/founder-planner" element={<LayoutWrapper currentPageName="AdminFounderPlanner"><AdminFounderPlanner /></LayoutWrapper>} />
      <Route path="/admin/founder-priorities" element={<LayoutWrapper currentPageName="AdminFounderPriorities"><AdminFounderPriorities /></LayoutWrapper>} />
      <Route path="/admin/founder-scorecard-weekly" element={<LayoutWrapper currentPageName="AdminFounderScorecardWeekly"><AdminFounderScorecardWeekly /></LayoutWrapper>} />
      <Route path="/admin/founder-scenarios" element={<LayoutWrapper currentPageName="AdminFounderScenarios"><AdminFounderScenarios /></LayoutWrapper>} />
      <Route path="/admin/client-success" element={<LayoutWrapper currentPageName="AdminClientSuccess"><AdminClientSuccess /></LayoutWrapper>} />
      <Route path="/admin/client-retention" element={<LayoutWrapper currentPageName="AdminClientRetention"><AdminClientRetention /></LayoutWrapper>} />
      <Route path="/admin/client-expansion" element={<LayoutWrapper currentPageName="AdminClientExpansion"><AdminClientExpansion /></LayoutWrapper>} />
      <Route path="/admin/client-ltv" element={<LayoutWrapper currentPageName="AdminClientLTV"><AdminClientLTV /></LayoutWrapper>} />
      <Route path="/admin/operations" element={<LayoutWrapper currentPageName="AdminOperations"><AdminOperations /></LayoutWrapper>} />
      <Route path="/admin/operations-capacity" element={<LayoutWrapper currentPageName="AdminOperationsCapacity"><AdminOperationsCapacity /></LayoutWrapper>} />
      <Route path="/admin/operations-sla" element={<LayoutWrapper currentPageName="AdminOperationsSLA"><AdminOperationsSLA /></LayoutWrapper>} />
      <Route path="/admin/operations-efficiency" element={<LayoutWrapper currentPageName="AdminOperationsEfficiency"><AdminOperationsEfficiency /></LayoutWrapper>} />
      <Route path="/admin/control-tower" element={<LayoutWrapper currentPageName="AdminControlTower"><AdminControlTower /></LayoutWrapper>} />
      <Route path="/admin/control-tower-insights" element={<LayoutWrapper currentPageName="AdminControlTowerInsights"><AdminControlTowerInsights /></LayoutWrapper>} />
      <Route path="/admin/control-tower-risk" element={<LayoutWrapper currentPageName="AdminControlTowerRisk"><AdminControlTowerRisk /></LayoutWrapper>} />
      <Route path="/admin/control-tower-actions" element={<LayoutWrapper currentPageName="AdminControlTowerActions"><AdminControlTowerActions /></LayoutWrapper>} />
      <Route path="/admin/roi-expansion" element={<LayoutWrapper currentPageName="AdminROIExpansion"><AdminROIExpansion /></LayoutWrapper>} />
      <Route path="/admin/funnel-optimization" element={<LayoutWrapper currentPageName="AdminFunnelOptimization"><AdminFunnelOptimization /></LayoutWrapper>} />
      <Route path="/admin/funnel-pages" element={<LayoutWrapper currentPageName="AdminFunnelPages"><AdminFunnelPages /></LayoutWrapper>} />
      <Route path="/admin/funnel-tests" element={<LayoutWrapper currentPageName="AdminFunnelTests"><AdminFunnelTests /></LayoutWrapper>} />
      <Route path="/admin/funnel-opportunities" element={<LayoutWrapper currentPageName="AdminFunnelOpportunities"><AdminFunnelOpportunities /></LayoutWrapper>} />
      <Route path="/admin/ai-workforce" element={<LayoutWrapper currentPageName="AdminAIWorkforce"><AdminAIWorkforce /></LayoutWrapper>} />
      <Route path="/admin/ai-orchestration" element={<LayoutWrapper currentPageName="AdminAIOrchestration"><AdminAIOrchestration /></LayoutWrapper>} />
      <Route path="/admin/ai-routing" element={<LayoutWrapper currentPageName="AdminAIRouting"><AdminAIRouting /></LayoutWrapper>} />
      <Route path="/admin/ai-growth-loops" element={<LayoutWrapper currentPageName="AdminAIGrowthLoops"><AdminAIGrowthLoops /></LayoutWrapper>} />
      <Route path="/admin/ai-operations" element={<LayoutWrapper currentPageName="AdminAIOperations"><AdminAIOperations /></LayoutWrapper>} />
      <Route path="/admin/data-governance" element={<LayoutWrapper currentPageName="AdminDataGovernance"><AdminDataGovernance /></LayoutWrapper>} />
      <Route path="/admin/access-governance" element={<LayoutWrapper currentPageName="AdminAccessGovernance"><AdminAccessGovernance /></LayoutWrapper>} />
      <Route path="/admin/tenant-governance" element={<LayoutWrapper currentPageName="AdminTenantGovernance"><AdminTenantGovernance /></LayoutWrapper>} />
      <Route path="/reseller/dashboard" element={<LayoutWrapper currentPageName="ResellerDashboard"><ResellerDashboard /></LayoutWrapper>} />
      <Route path="/admin/page-registry" element={<LayoutWrapper currentPageName="AdminPageRegistry"><AdminPageRegistry /></LayoutWrapper>} />
      <Route path="/admin/workflows" element={<LayoutWrapper currentPageName="AdminWorkflows"><AdminWorkflows /></LayoutWrapper>} />
      <Route path="/admin/automation-rules" element={<LayoutWrapper currentPageName="AdminAutomationRules"><AdminAutomationRules /></LayoutWrapper>} />
      <Route path="/admin/automation-conditions" element={<LayoutWrapper currentPageName="AdminAutomationConditions"><AdminAutomationConditions /></LayoutWrapper>} />
      <Route path="/admin/automation-flows" element={<LayoutWrapper currentPageName="AdminAutomationFlows"><AdminAutomationFlows /></LayoutWrapper>} />
      <Route path="/admin/automation-performance" element={<LayoutWrapper currentPageName="AdminAutomationPerformance"><AdminAutomationPerformance /></LayoutWrapper>} />
      <Route path="/admin/knowledge" element={<LayoutWrapper currentPageName="AdminKnowledge"><AdminKnowledge /></LayoutWrapper>} />
      <Route path="/admin/knowledge-workflows" element={<LayoutWrapper currentPageName="AdminKnowledgeWorkflows"><AdminKnowledgeWorkflows /></LayoutWrapper>} />
      <Route path="/admin/knowledge-training" element={<LayoutWrapper currentPageName="AdminKnowledgeTraining"><AdminKnowledgeTraining /></LayoutWrapper>} />
      <Route path="/admin/knowledge-intelligence" element={<LayoutWrapper currentPageName="AdminKnowledgeIntelligence"><AdminKnowledgeIntelligence /></LayoutWrapper>} />
      <Route path="/admin/pricing-intelligence" element={<LayoutWrapper currentPageName="AdminPricingIntelligence"><AdminPricingIntelligence /></LayoutWrapper>} />
      <Route path="/admin/pricing-packaging" element={<LayoutWrapper currentPageName="AdminPricingPackaging"><AdminPricingPackaging /></LayoutWrapper>} />
      <Route path="/admin/pricing-experiments" element={<LayoutWrapper currentPageName="AdminPricingExperiments"><AdminPricingExperiments /></LayoutWrapper>} />
      <Route path="/admin/pricing-recommendations" element={<LayoutWrapper currentPageName="AdminPricingRecommendations"><AdminPricingRecommendations /></LayoutWrapper>} />
      <Route path="/admin/navigation-audit" element={<LayoutWrapper currentPageName="AdminNavigationAudit"><AdminNavigationAudit /></LayoutWrapper>} />
      <Route path="/admin/channels" element={<LayoutWrapper currentPageName="AdminChannels"><AdminChannels /></LayoutWrapper>} />
      <Route path="/client/channels" element={<LayoutWrapper currentPageName="ClientChannels"><ClientChannels /></LayoutWrapper>} />
      <Route path="/client/results" element={<LayoutWrapper currentPageName="ClientResults"><ClientResults /></LayoutWrapper>} />
      <Route path="/admin/production-stability" element={<LayoutWrapper currentPageName="AdminProductionStability"><AdminProductionStability /></LayoutWrapper>} />
      <Route path="/admin/platform-qa" element={<LayoutWrapper currentPageName="AdminPlatformQA"><AdminPlatformQA /></LayoutWrapper>} />
      <Route path="/admin/sales-command" element={<LayoutWrapper currentPageName="AdminSalesCommand"><AdminSalesCommand /></LayoutWrapper>} />
      <Route path="/sales/command-center" element={<LayoutWrapper currentPageName="SalesCommandCenter"><SalesCommandCenter /></LayoutWrapper>} />
      <Route path="/admin/sales-pipeline" element={<LayoutWrapper currentPageName="NTASalesPipeline"><NTASalesPipeline /></LayoutWrapper>} />
      <Route path="/admin/demo-machine" element={<LayoutWrapper currentPageName="NTADemoMachine"><NTADemoMachine /></LayoutWrapper>} />
      <Route path="/admin/proposal-generator" element={<LayoutWrapper currentPageName="AdminProposalGenerator"><AdminProposalGenerator /></LayoutWrapper>} />
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
      <Route path="/admin/retention-dashboard" element={<LayoutWrapper currentPageName="AdminRetentionDashboard"><AdminRetentionDashboard /></LayoutWrapper>} />
      <Route path="/nta/demo" element={<NTADemoFunnel />} />
      <Route path="/getting-started" element={<LayoutWrapper currentPageName="GettingStarted"><GettingStarted /></LayoutWrapper>} />
      <Route path="/channel-help" element={<LayoutWrapper currentPageName="ChannelHelpCenter"><ChannelHelpCenter /></LayoutWrapper>} />
      <Route path="/book-call" element={<LayoutWrapper currentPageName="BookCall"><BookCall /></LayoutWrapper>} />
      <Route path="/admin/hot-prospects" element={<LayoutWrapper currentPageName="AdminHotProspectsAlert"><AdminHotProspectsAlert /></LayoutWrapper>} />
      <Route path="/nta/diy-growth-system" element={<LayoutWrapper currentPageName="DIYGrowthSystemSales"><DIYGrowthSystemSales /></LayoutWrapper>} />
      <Route path="/nta/pricing-ladder" element={<LayoutWrapper currentPageName="NTAPricingLadderPage"><NTAPricingLadderPage /></LayoutWrapper>} />
      <Route path="/client/diy-onboarding" element={<LayoutWrapper currentPageName="DIYOnboarding"><DIYOnboarding /></LayoutWrapper>} />
      <Route path="/client/diy-dashboard" element={<LayoutWrapper currentPageName="DIYDashboard"><DIYDashboard /></LayoutWrapper>} />
      <Route path="/client/diy-billing" element={<LayoutWrapper currentPageName="DIYBillingSettings"><DIYBillingSettings /></LayoutWrapper>} />
      <Route path="/diy-checkout-success" element={<DIYCheckoutSuccess />} />
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
      <Route path="/website-rebuilds/mason-city-ia" element={<LayoutWrapper currentPageName="WebsiteRebuildsMasonCity"><WebsiteRebuildsMasonCity /></LayoutWrapper>} />
      <Route path="/website-rebuilds/rochester-mn" element={<WebsiteRebuildsRochesterMN />} />
      <Route path="/website-rebuilds/austin-mn" element={<WebsiteRebuildsAustinMN />} />
      <Route path="/website-rebuilds/albert-lea-mn" element={<WebsiteRebuildsAlbertLeaMN />} />
      <Route path="/rebuild-intake" element={<RebuildIntake />} />
      <Route path="/admin/recruiting-candidates" element={<LayoutWrapper currentPageName="AdminRecruitingCandidates"><AdminRecruitingCandidates /></LayoutWrapper>} />
      <Route path="/admin/recent-ai-activity" element={<LayoutWrapper currentPageName="AdminRecentAIActivity"><AdminRecentAIActivity /></LayoutWrapper>} />
      <Route path="/audit/furniture-mattress-outlet" element={<AuditFurnitureMattressOutlet />} />
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
      <Route path="/gap-audit" element={<GapAuditPublic />} />
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

      <Route path="/learning-center" element={<LearningCenter />} />
      <Route path="/learning-center/category/:id" element={<LCCategory />} />
      <Route path="/learning-center/videos" element={<LCVideoLibrary />} />
      <Route path="/learning-center/videos/:id" element={<LCVideoDetail />} />
      <Route path="/what-changed-online" element={<LayoutWrapper currentPageName="WhatChangedOnline"><WhatChangedOnline /></LayoutWrapper>} />
      <Route path="/ai-visibility-basics" element={<LayoutWrapper currentPageName="AIVisibilityBasics"><AIVisibilityBasics /></LayoutWrapper>} />
      <Route path="/practical-ai-for-small-businesses" element={<LayoutWrapper currentPageName="PracticalAIForSmallBusinesses"><PracticalAIForSmallBusinesses /></LayoutWrapper>} />
      <Route path="/seo-vs-ai-search" element={<LayoutWrapper currentPageName="SEOVsAISearch"><SEOVsAISearch /></LayoutWrapper>} />
      <Route path="/growth-systems-vs-campaigns" element={<LayoutWrapper currentPageName="GrowthSystemsVsCampaigns"><GrowthSystemsVsCampaigns /></LayoutWrapper>} />
      <Route path="/reputation-is-now-a-growth-engine" element={<LayoutWrapper currentPageName="ReputationIsNowAGrowthEngine"><ReputationIsNowAGrowthEngine /></LayoutWrapper>} />
      <Route path="/hidden-cost-of-outdated-marketing" element={<LayoutWrapper currentPageName="TheHiddenCostOfOutdatedMarketing"><TheHiddenCostOfOutdatedMarketing /></LayoutWrapper>} />
      <Route path="/role-of-ai-in-local-marketing" element={<LayoutWrapper currentPageName="TheRoleOfAIInLocalMarketing"><TheRoleOfAIInLocalMarketing /></LayoutWrapper>} />
      <Route path="/accessible-websites" element={<LayoutWrapper currentPageName="AccessibleWebsites"><AccessibleWebsites /></LayoutWrapper>} />
      <Route path="/web-accessibility-trust" element={<LayoutWrapper currentPageName="WebAccessibilityTrust"><WebAccessibilityTrust /></LayoutWrapper>} />
      <Route path="/ada-compliance" element={<Navigate to="/accessible-websites" replace />} />
      <Route path="/ada-website-rebuild" element={<Navigate to="/accessible-websites" replace />} />
      <Route path="/ada-website-lawsuit-prevention" element={<Navigate to="/web-accessibility-trust" replace />} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
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
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
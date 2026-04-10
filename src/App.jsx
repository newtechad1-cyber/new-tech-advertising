import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
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
      <Route path="/admin/client-success" element={<LayoutWrapper currentPageName="AdminClientSuccess"><AdminClientSuccess /></LayoutWrapper>} />
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
      <Route path="/dashboard" element={<CRMDashboard />} />
      <Route path="/dashboard/leads" element={<CRMDashboard />} />
      <Route path="/dashboard/archived" element={<CRMArchivedLeads />} />
      <Route path="/content-command" element={<ContentCommandDashboard />} />
      <Route path="/content-center" element={<ContentCommandCenter />} />
      <Route path="/clients" element={<ClientManager />} />
      <Route path="/clients/:id" element={<ClientDetail />} />
      <Route path="/agency" element={<NTACommandDashboard />} />
      <Route path="/agency/clients" element={<AgencyClients />} />
      <Route path="/agency/pipeline" element={<AgencyPipeline />} />
      <Route path="/agency/content" element={<AgencyContent />} />
      <Route path="/agency/websites" element={<AgencyWebsites />} />
      <Route path="/agency/leads" element={<AgencyLeads />} />
      <Route path="/demo/furniture-mattress-outlet" element={<DemoFurnitureMattressOutlet />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


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
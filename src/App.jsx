import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import ClientROI from './pages/ClientROI';
import ClientROIReports from './pages/ClientROIReports';
import ClientROITimeline from './pages/ClientROITimeline';

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
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
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
      <Route path="/admin/ai-workforce" element={<LayoutWrapper currentPageName="AIWorkforce"><AIWorkforce /></LayoutWrapper>} />
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
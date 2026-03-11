/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import About from './pages/About';
import adaCompliance from './pages/Ada-Compliance';
import Ada from './pages/Ada';
import AdaAccessibility from './pages/AdaAccessibility';
import AdaIntake from './pages/AdaIntake';
import AdaOnboarding from './pages/AdaOnboarding';
import AdaQuote from './pages/AdaQuote';
import AdaSalesAssistant from './pages/AdaSalesAssistant';
import AdaSuccess from './pages/AdaSuccess';
import AdaThankYou from './pages/AdaThankYou';
import AdaWebsiteCompliance from './pages/AdaWebsiteCompliance';
import AdaWebsiteLawsuitPrevention from './pages/AdaWebsiteLawsuitPrevention';
import AdaWebsiteRebuild from './pages/AdaWebsiteRebuild';
import Admin from './pages/Admin';
import AdminAIActivity from './pages/AdminAIActivity';
import AdminAIControlCenter from './pages/AdminAIControlCenter';
import AdminAILab from './pages/AdminAILab';
import AdminAIPrompts from './pages/AdminAIPrompts';
import AdminAIVideoStudio from './pages/AdminAIVideoStudio';
import AdminAccess from './pages/AdminAccess';
import AdminAccessAudit from './pages/AdminAccessAudit';
import AdminAccessPermissions from './pages/AdminAccessPermissions';
import AdminAccessRoles from './pages/AdminAccessRoles';
import AdminAccessScopes from './pages/AdminAccessScopes';
import AdminAgents from './pages/AdminAgents';
import AdminAgentsRecovery from './pages/AdminAgentsRecovery';
import AdminAgentsWorkflows from './pages/AdminAgentsWorkflows';
import AdminAlerts from './pages/AdminAlerts';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminApproval from './pages/AdminApproval';
import AdminAutomation from './pages/AdminAutomation';
import AdminAutomationDependencies from './pages/AdminAutomationDependencies';
import AdminAutomationHealth from './pages/AdminAutomationHealth';
import AdminAutomationRuleDetail from './pages/AdminAutomationRuleDetail';
import AdminAutomationRules from './pages/AdminAutomationRules';
import AdminAutomationTriggers from './pages/AdminAutomationTriggers';
import AdminAutopilot from './pages/AdminAutopilot';
import AdminBilling from './pages/AdminBilling';
import AdminBillingContract from './pages/AdminBillingContract';
import AdminBlog from './pages/AdminBlog';
import AdminBranding from './pages/AdminBranding';
import AdminClientSettings from './pages/AdminClientSettings';
import AdminClientSettingsCompany from './pages/AdminClientSettingsCompany';
import AdminClients from './pages/AdminClients';
import AdminCommandCenter from './pages/AdminCommandCenter';
import AdminCommerce from './pages/AdminCommerce';
import AdminCommerceCompany from './pages/AdminCommerceCompany';
import AdminConnections from './pages/AdminConnections';
import AdminContentEngine from './pages/AdminContentEngine';
import AdminContentMultiplier from './pages/AdminContentMultiplier';
import AdminCopilot from './pages/AdminCopilot';
import AdminCopilotAccount from './pages/AdminCopilotAccount';
import AdminCreateProject from './pages/AdminCreateProject';
import AdminDashboard from './pages/AdminDashboard';
import AdminDemoMachine from './pages/AdminDemoMachine';
import AdminDemoMachineAnalytics from './pages/AdminDemoMachineAnalytics';
import AdminDemoMachinePaths from './pages/AdminDemoMachinePaths';
import AdminDemoMachineSessions from './pages/AdminDemoMachineSessions';
import AdminEventsList from './pages/AdminEventsList';
import AdminExecutive from './pages/AdminExecutive';
import AdminFinance from './pages/AdminFinance';
import AdminFounder from './pages/AdminFounder';
import AdminFulfillment from './pages/AdminFulfillment';
import AdminFulfillmentDetail from './pages/AdminFulfillmentDetail';
import AdminGovernance from './pages/AdminGovernance';
import AdminGovernanceAudit from './pages/AdminGovernanceAudit';
import AdminGovernanceDependencies from './pages/AdminGovernanceDependencies';
import AdminGovernanceFields from './pages/AdminGovernanceFields';
import AdminGovernanceLifecycles from './pages/AdminGovernanceLifecycles';
import AdminGovernancePolicy from './pages/AdminGovernancePolicy';
import AdminGovernanceRelationships from './pages/AdminGovernanceRelationships';
import AdminHelp from './pages/AdminHelp';
import AdminIntelligence from './pages/AdminIntelligence';
import AdminIntelligenceAutomation from './pages/AdminIntelligenceAutomation';
import AdminIntelligenceClients from './pages/AdminIntelligenceClients';
import AdminIntelligenceSales from './pages/AdminIntelligenceSales';
import AdminMetaSetup from './pages/AdminMetaSetup';
import AdminNavigation from './pages/AdminNavigation';
import AdminNavigationLayouts from './pages/AdminNavigationLayouts';
import AdminNavigationNav from './pages/AdminNavigationNav';
import AdminNavigationPages from './pages/AdminNavigationPages';
import AdminNavigationQA from './pages/AdminNavigationQA';
import AdminNavigationRoutes from './pages/AdminNavigationRoutes';
import AdminOnboarding from './pages/AdminOnboarding';
import AdminOnboardingDetail from './pages/AdminOnboardingDetail';
import AdminOnboardingQueue from './pages/AdminOnboardingQueue';
import AdminOperations from './pages/AdminOperations';
import AdminOperationsCompany from './pages/AdminOperationsCompany';
import AdminOptimizer from './pages/AdminOptimizer';
import AdminOptimizerDetail from './pages/AdminOptimizerDetail';
import AdminOrchestrator from './pages/AdminOrchestrator';
import AdminOrchestratorDetail from './pages/AdminOrchestratorDetail';
import AdminPlatform from './pages/AdminPlatform';
import AdminProjectWorkspace from './pages/AdminProjectWorkspace';
import AdminProjectsList from './pages/AdminProjectsList';
import AdminQA from './pages/AdminQA';
import AdminQAIssues from './pages/AdminQAIssues';
import AdminQAReadiness from './pages/AdminQAReadiness';
import AdminQARuns from './pages/AdminQARuns';
import AdminQATests from './pages/AdminQATests';
import AdminRecommendationDetail from './pages/AdminRecommendationDetail';
import AdminRecommendations from './pages/AdminRecommendations';
import AdminReports from './pages/AdminReports';
import AdminResellerClients from './pages/AdminResellerClients';
import AdminResellerCommissions from './pages/AdminResellerCommissions';
import AdminResellerRevenue from './pages/AdminResellerRevenue';
import AdminResellers from './pages/AdminResellers';
import AdminRevenueDetail from './pages/AdminRevenueDetail';
import AdminRevenueEngine from './pages/AdminRevenueEngine';
import AdminSales from './pages/AdminSales';
import AdminSalesAssets from './pages/AdminSalesAssets';
import AdminSalesDashboard from './pages/AdminSalesDashboard';
import AdminSalesFollowups from './pages/AdminSalesFollowups';
import AdminSalesPrompts from './pages/AdminSalesPrompts';
import AdminSalesProspect from './pages/AdminSalesProspect';
import AdminSchoolAIContentReview from './pages/AdminSchoolAIContentReview';
import AdminSchoolAIDashboard from './pages/AdminSchoolAIDashboard';
import AdminSchoolAILab from './pages/AdminSchoolAILab';
import AdminSchoolAnalytics from './pages/AdminSchoolAnalytics';
import AdminSchoolBranding from './pages/AdminSchoolBranding';
import AdminSchoolDashboard from './pages/AdminSchoolDashboard';
import AdminSchoolEventDetail from './pages/AdminSchoolEventDetail';
import AdminSchoolEvents from './pages/AdminSchoolEvents';
import AdminSchoolLeadDetail from './pages/AdminSchoolLeadDetail';
import AdminSchoolLeads from './pages/AdminSchoolLeads';
import AdminSchoolLibrary from './pages/AdminSchoolLibrary';
import AdminSchoolModeration from './pages/AdminSchoolModeration';
import AdminSchoolOutreach from './pages/AdminSchoolOutreach';
import AdminSchoolPipeline from './pages/AdminSchoolPipeline';
import AdminSchoolProjectDetail from './pages/AdminSchoolProjectDetail';
import AdminSchoolProjects from './pages/AdminSchoolProjects';
import AdminSchoolRenderQueue from './pages/AdminSchoolRenderQueue';
import AdminSchoolRoles from './pages/AdminSchoolRoles';
import AdminSchoolSettings from './pages/AdminSchoolSettings';
import AdminSchoolSettingsPermissions from './pages/AdminSchoolSettingsPermissions';
import AdminSchoolSettingsPublishing from './pages/AdminSchoolSettingsPublishing';
import AdminSchoolSpotlightDetail from './pages/AdminSchoolSpotlightDetail';
import AdminSchoolSpotlights from './pages/AdminSchoolSpotlights';
import AdminSchoolStoryLibrary from './pages/AdminSchoolStoryLibrary';
import AdminSchoolStudentUploads from './pages/AdminSchoolStudentUploads';
import AdminSchoolStudentUsers from './pages/AdminSchoolStudentUsers';
import AdminSchoolSubmissions from './pages/AdminSchoolSubmissions';
import AdminSchoolUsers from './pages/AdminSchoolUsers';
import AdminSchoolVideoLibrary from './pages/AdminSchoolVideoLibrary';
import AdminSchoolYearbook from './pages/AdminSchoolYearbook';
import AdminSettings from './pages/AdminSettings';
import AdminStoryDetail from './pages/AdminStoryDetail';
import AdminStoryLibrary from './pages/AdminStoryLibrary';
import AdminSubmissionDetail from './pages/AdminSubmissionDetail';
import AdminSubmissionsList from './pages/AdminSubmissionsList';
import AdminSystemHealth from './pages/AdminSystemHealth';
import AdminTasks from './pages/AdminTasks';
import AdminTestMatrix from './pages/AdminTestMatrix';
import AdminUsers from './pages/AdminUsers';
import AdminVideoDetail from './pages/AdminVideoDetail';
import AdminVideoEngine from './pages/AdminVideoEngine';
import AdminVideoEngineAnalytics from './pages/AdminVideoEngineAnalytics';
import AdminVideoEngineApprovals from './pages/AdminVideoEngineApprovals';
import AdminVideoEngineBrands from './pages/AdminVideoEngineBrands';
import AdminVideoEngineRenders from './pages/AdminVideoEngineRenders';
import AdminVideoEngineRequest from './pages/AdminVideoEngineRequest';
import AdminVideoEngineRequests from './pages/AdminVideoEngineRequests';
import AdminVideoEngineTemplates from './pages/AdminVideoEngineTemplates';
import AdminVideoGenerator from './pages/AdminVideoGenerator';
import AdminVideoLibrary from './pages/AdminVideoLibrary';
import AdminVideoPublishing from './pages/AdminVideoPublishing';
import AdminVideoQueue from './pages/AdminVideoQueue';
import AdminVideoRenderDetail from './pages/AdminVideoRenderDetail';
import AdminVideoRenderQueue from './pages/AdminVideoRenderQueue';
import AdminVideos from './pages/AdminVideos';
import AdminYearbookLibrary from './pages/AdminYearbookLibrary';
import AdminYearbookOverview from './pages/AdminYearbookOverview';
import AdminYearbookPage from './pages/AdminYearbookPage';
import AdminYearbookSeason from './pages/AdminYearbookSeason';
import AdminYouTubeSetup from './pages/AdminYouTubeSetup';
import AgentArchitecture from './pages/AgentArchitecture';
import AiAccessibilityChecker from './pages/AiAccessibilityChecker';
import AiAdvertising from './pages/AiAdvertising';
import AiMarketingPlatform from './pages/AiMarketingPlatform';
import AiOperations from './pages/AiOperations';
import AiSeo from './pages/AiSeo';
import AiSocialMedia from './pages/AiSocialMedia';
import AiSocialMediaSmallBusiness from './pages/AiSocialMediaSmallBusiness';
import AiVideoStudio from './pages/AiVideoStudio';
import AiVideos from './pages/AiVideos';
import AiWebsites from './pages/AiWebsites';
import AuthorityMap from './pages/AuthorityMap';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import bookCall from './pages/Book-Call';
import BulldogTV from './pages/BulldogTV';
import BulldogTVSpotlights from './pages/BulldogTVSpotlights';
import BulldogTVStories from './pages/BulldogTVStories';
import BulldogTVSubmissions from './pages/BulldogTVSubmissions';
import BulldogTVSubmit from './pages/BulldogTVSubmit';
import BulldogTVVideos from './pages/BulldogTVVideos';
import BulldogTVWatch from './pages/BulldogTVWatch';
import BulldogTVYearbook from './pages/BulldogTVYearbook';
import BusinessIntelProfileAdmin from './pages/BusinessIntelProfileAdmin';
import BusinessProfileAdmin from './pages/BusinessProfileAdmin';
import CRMHub from './pages/CRMHub';
import CaseStudies from './pages/CaseStudies';
import CaseStudyDetail from './pages/CaseStudyDetail';
import ChatWidget from './pages/ChatWidget';
import ChatbotManagement from './pages/ChatbotManagement';
import ClientApprovals from './pages/ClientApprovals';
import ClientBilling from './pages/ClientBilling';
import ClientCalendar from './pages/ClientCalendar';
import ClientCommerce from './pages/ClientCommerce';
import ClientContentProduction from './pages/ClientContentProduction';
import ClientDashboard from './pages/ClientDashboard';
import ClientDashboardDemo from './pages/ClientDashboardDemo';
import ClientFulfillment from './pages/ClientFulfillment';
import ClientOnboarding from './pages/ClientOnboarding';
import ClientReports from './pages/ClientReports';
import ClientSettings from './pages/ClientSettings';
import Contact from './pages/Contact';
import ContentDrafts from './pages/ContentDrafts';
import ContentEngine from './pages/ContentEngine';
import ContentQueue from './pages/ContentQueue';
import ContentStudio from './pages/ContentStudio';
import ContributorAILab from './pages/ContributorAILab';
import ContributorHub from './pages/ContributorHub';
import ContributorSubmissions from './pages/ContributorSubmissions';
import Dashboard from './pages/Dashboard';
import DealRoom from './pages/DealRoom';
import DealRoomCaseStudies from './pages/DealRoomCaseStudies';
import DealRoomContract from './pages/DealRoomContract';
import DealRoomPricing from './pages/DealRoomPricing';
import DealRoomProposal from './pages/DealRoomProposal';
import DealRoomRoi from './pages/DealRoomRoi';
import DebugOAuthConnections from './pages/DebugOAuthConnections';
import Demo from './pages/Demo';
import DemoExamples from './pages/DemoExamples';
import DemoFeatures from './pages/DemoFeatures';
import DemoNext from './pages/DemoNext';
import DemoOverview from './pages/DemoOverview';
import DemoPlatform from './pages/DemoPlatform';
import DemoPricing from './pages/DemoPricing';
import DemoProblem from './pages/DemoProblem';
import DemoRoi from './pages/DemoRoi';
import DemoSchoolAbout from './pages/DemoSchoolAbout';
import DemoSchoolChannel from './pages/DemoSchoolChannel';
import DemoSchoolStoryDetail from './pages/DemoSchoolStoryDetail';
import DemoStart from './pages/DemoStart';
import DentistMarketing from './pages/DentistMarketing';
import freeAudit from './pages/Free-Audit';
import FunnelPage from './pages/FunnelPage';
import getStarted from './pages/Get-Started';
import GlobalSettings from './pages/GlobalSettings';
import GrowthSystem from './pages/GrowthSystem';
import HelpAndSupport from './pages/HelpAndSupport';
import Home from './pages/Home';
import HvacIndustry from './pages/HvacIndustry';
import HvacMarketing from './pages/HvacMarketing';
import IndustriesHub from './pages/IndustriesHub';
import IndustriesNonprofits from './pages/IndustriesNonprofits';
import IndustriesProfessionals from './pages/IndustriesProfessionals';
import IndustriesServiceTrades from './pages/IndustriesServiceTrades';
import IndustriesSmallLocal from './pages/IndustriesSmallLocal';
import Industry from './pages/Industry';
import IndustryIntelAdmin from './pages/IndustryIntelAdmin';
import IndustryNonprofit from './pages/IndustryNonprofit';
import IndustryNonprofits from './pages/IndustryNonprofits';
import IndustryProfessional from './pages/IndustryProfessional';
import IndustryProfessionals from './pages/IndustryProfessionals';
import IndustryServiceTrades from './pages/IndustryServiceTrades';
import IndustrySmall from './pages/IndustrySmall';
import IndustrySmallLocal from './pages/IndustrySmallLocal';
import IndustryTrades from './pages/IndustryTrades';
import IntelAdmin from './pages/IntelAdmin';
import LeadDetail from './pages/LeadDetail';
import LeadsDashboard from './pages/LeadsDashboard';
import LocalBusinessMarketing from './pages/LocalBusinessMarketing';
import LocalMarketIntelAdmin from './pages/LocalMarketIntelAdmin';
import LocalVisibility from './pages/LocalVisibility';
import LocationPageAdmin from './pages/LocationPageAdmin';
import MarketingPlanGenerator from './pages/MarketingPlanGenerator';
import MedSpaMarketing from './pages/MedSpaMarketing';
import MetaConnect from './pages/MetaConnect';
import OauthCallback from './pages/OauthCallback';
import OnboardThankYou from './pages/OnboardThankYou';
import Onboarding from './pages/Onboarding';
import OnboardingStart from './pages/OnboardingStart';
import OperationsHub from './pages/OperationsHub';
import OpportunitySignalAdmin from './pages/OpportunitySignalAdmin';
import OurWork from './pages/OurWork';
import PerformanceSignalAdmin from './pages/PerformanceSignalAdmin';
import Platform from './pages/Platform';
import PlumbingMarketing from './pages/PlumbingMarketing';
import Pricing from './pages/Pricing';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ProgrammaticSEODashboard from './pages/ProgrammaticSEODashboard';
import Proposal from './pages/Proposal';
import ProposalBuilder from './pages/ProposalBuilder';
import ProposalDetail from './pages/ProposalDetail';
import ProposalPipeline from './pages/ProposalPipeline';
import ProposalPreview from './pages/ProposalPreview';
import ProposalsList from './pages/ProposalsList';
import PublicProposal from './pages/PublicProposal';
import rebuildIntake from './pages/Rebuild-Intake';
import Rebuild from './pages/Rebuild';
import RebuildIntake from './pages/RebuildIntake';
import RebuildIntakePretty from './pages/RebuildIntakePretty';
import RebuildProposal from './pages/RebuildProposal';
import ResellerBranding from './pages/ResellerBranding';
import ResellerClients from './pages/ResellerClients';
import ResellerDashboard from './pages/ResellerDashboard';
import ResellerRevenue from './pages/ResellerRevenue';
import ResellerSettingsBranding from './pages/ResellerSettingsBranding';
import ResellerSignupLinks from './pages/ResellerSignupLinks';
import RestaurantMarketing from './pages/RestaurantMarketing';
import RestaurantSocialMedia from './pages/RestaurantSocialMedia';
import RoofingMarketing from './pages/RoofingMarketing';
import SalesDashboard from './pages/SalesDashboard';
import SalesLeads from './pages/SalesLeads';
import SalesPipeline from './pages/SalesPipeline';
import SalesRoom from './pages/SalesRoom';
import ScheduledQueue from './pages/ScheduledQueue';
import SchoolAbout from './pages/SchoolAbout';
import SchoolEventDetail from './pages/SchoolEventDetail';
import SchoolEvents from './pages/SchoolEvents';
import SchoolHome from './pages/SchoolHome';
import SchoolSpotlightDetail from './pages/SchoolSpotlightDetail';
import SchoolSpotlights from './pages/SchoolSpotlights';
import SchoolStories from './pages/SchoolStories';
import SchoolStoryDetail from './pages/SchoolStoryDetail';
import SchoolStoryLab from './pages/SchoolStoryLab';
import SchoolStoryLabPresentation from './pages/SchoolStoryLabPresentation';
import SchoolStudentDashboard from './pages/SchoolStudentDashboard';
import SchoolStudentLogin from './pages/SchoolStudentLogin';
import SchoolStudentProfile from './pages/SchoolStudentProfile';
import SchoolStudentUploadNew from './pages/SchoolStudentUploadNew';
import SchoolStudentUploads from './pages/SchoolStudentUploads';
import SchoolSubmit from './pages/SchoolSubmit';
import SchoolSubmitGuide from './pages/SchoolSubmitGuide';
import SchoolTV from './pages/SchoolTV';
import SchoolTVDealRoom from './pages/SchoolTVDealRoom';
import SchoolTVDemo from './pages/SchoolTVDemo';
import SchoolVideoDetail from './pages/SchoolVideoDetail';
import SchoolYearbook from './pages/SchoolYearbook';
import SchoolYearbookCategory from './pages/SchoolYearbookCategory';
import SchoolYearbookGallery from './pages/SchoolYearbookGallery';
import SchoolYearbookPage from './pages/SchoolYearbookPage';
import SchoolYearbookSeason from './pages/SchoolYearbookSeason';
import ServiceLocation from './pages/ServiceLocation';
import Services from './pages/Services';
import SetupComplete from './pages/SetupComplete';
import SiteMap from './pages/SiteMap';
import SocialAccounts from './pages/SocialAccounts';
import SocialMediaManagement from './pages/SocialMediaManagement';
import SocialMediaMarketing from './pages/SocialMediaMarketing';
import Start from './pages/Start';
import StartTrial from './pages/StartTrial';
import Store from './pages/Store';
import streamingTv from './pages/Streaming-TV';
import StreamingCreativePayment from './pages/StreamingCreativePayment';
import StreamingDashboard from './pages/StreamingDashboard';
import StreamingIntake from './pages/StreamingIntake';
import StreamingOnboarding from './pages/StreamingOnboarding';
import StreamingProposal from './pages/StreamingProposal';
import StreamingTV from './pages/StreamingTV';
import StreamingThankYou from './pages/StreamingThankYou';
import StreamingTvAdvertising from './pages/StreamingTvAdvertising';
import StudentAIStoryLab from './pages/StudentAIStoryLab';
import TermsOfService from './pages/TermsOfService';
import TrialDashboard from './pages/TrialDashboard';
import TrialOnboarding from './pages/TrialOnboarding';
import TrialSlug from './pages/TrialSlug';
import TrialStart from './pages/TrialStart';
import TvCommercialScriptGenerator from './pages/TvCommercialScriptGenerator';
import TvVideo from './pages/TvVideo';
import VideoDetail from './pages/VideoDetail';
import VideoIndex from './pages/VideoIndex';
import websiteRebuild from './pages/Website-Rebuild';
import WebsiteRebuild from './pages/WebsiteRebuild';
import WebsiteVideoManager from './pages/WebsiteVideoManager';
import WeeklyPlanAdmin from './pages/WeeklyPlanAdmin';
import WorkflowMap from './pages/WorkflowMap';
import YouTubeUploadTest from './pages/YouTubeUploadTest';
import AdminIntelligenceResellers from './pages/AdminIntelligenceResellers';
import AdminAutonomy from './pages/AdminAutonomy';
import AdminAutonomyOpportunities from './pages/AdminAutonomyOpportunities';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "Ada-Compliance": adaCompliance,
    "Ada": Ada,
    "AdaAccessibility": AdaAccessibility,
    "AdaIntake": AdaIntake,
    "AdaOnboarding": AdaOnboarding,
    "AdaQuote": AdaQuote,
    "AdaSalesAssistant": AdaSalesAssistant,
    "AdaSuccess": AdaSuccess,
    "AdaThankYou": AdaThankYou,
    "AdaWebsiteCompliance": AdaWebsiteCompliance,
    "AdaWebsiteLawsuitPrevention": AdaWebsiteLawsuitPrevention,
    "AdaWebsiteRebuild": AdaWebsiteRebuild,
    "Admin": Admin,
    "AdminAIActivity": AdminAIActivity,
    "AdminAIControlCenter": AdminAIControlCenter,
    "AdminAILab": AdminAILab,
    "AdminAIPrompts": AdminAIPrompts,
    "AdminAIVideoStudio": AdminAIVideoStudio,
    "AdminAccess": AdminAccess,
    "AdminAccessAudit": AdminAccessAudit,
    "AdminAccessPermissions": AdminAccessPermissions,
    "AdminAccessRoles": AdminAccessRoles,
    "AdminAccessScopes": AdminAccessScopes,
    "AdminAgents": AdminAgents,
    "AdminAgentsRecovery": AdminAgentsRecovery,
    "AdminAgentsWorkflows": AdminAgentsWorkflows,
    "AdminAlerts": AdminAlerts,
    "AdminAnalytics": AdminAnalytics,
    "AdminApproval": AdminApproval,
    "AdminAutomation": AdminAutomation,
    "AdminAutomationDependencies": AdminAutomationDependencies,
    "AdminAutomationHealth": AdminAutomationHealth,
    "AdminAutomationRuleDetail": AdminAutomationRuleDetail,
    "AdminAutomationRules": AdminAutomationRules,
    "AdminAutomationTriggers": AdminAutomationTriggers,
    "AdminAutopilot": AdminAutopilot,
    "AdminBilling": AdminBilling,
    "AdminBillingContract": AdminBillingContract,
    "AdminBlog": AdminBlog,
    "AdminBranding": AdminBranding,
    "AdminClientSettings": AdminClientSettings,
    "AdminClientSettingsCompany": AdminClientSettingsCompany,
    "AdminClients": AdminClients,
    "AdminCommandCenter": AdminCommandCenter,
    "AdminCommerce": AdminCommerce,
    "AdminCommerceCompany": AdminCommerceCompany,
    "AdminConnections": AdminConnections,
    "AdminContentEngine": AdminContentEngine,
    "AdminContentMultiplier": AdminContentMultiplier,
    "AdminCopilot": AdminCopilot,
    "AdminCopilotAccount": AdminCopilotAccount,
    "AdminCreateProject": AdminCreateProject,
    "AdminDashboard": AdminDashboard,
    "AdminDemoMachine": AdminDemoMachine,
    "AdminDemoMachineAnalytics": AdminDemoMachineAnalytics,
    "AdminDemoMachinePaths": AdminDemoMachinePaths,
    "AdminDemoMachineSessions": AdminDemoMachineSessions,
    "AdminEventsList": AdminEventsList,
    "AdminExecutive": AdminExecutive,
    "AdminFinance": AdminFinance,
    "AdminFounder": AdminFounder,
    "AdminFulfillment": AdminFulfillment,
    "AdminFulfillmentDetail": AdminFulfillmentDetail,
    "AdminGovernance": AdminGovernance,
    "AdminGovernanceAudit": AdminGovernanceAudit,
    "AdminGovernanceDependencies": AdminGovernanceDependencies,
    "AdminGovernanceFields": AdminGovernanceFields,
    "AdminGovernanceLifecycles": AdminGovernanceLifecycles,
    "AdminGovernancePolicy": AdminGovernancePolicy,
    "AdminGovernanceRelationships": AdminGovernanceRelationships,
    "AdminHelp": AdminHelp,
    "AdminIntelligence": AdminIntelligence,
    "AdminIntelligenceAutomation": AdminIntelligenceAutomation,
    "AdminIntelligenceClients": AdminIntelligenceClients,
    "AdminIntelligenceSales": AdminIntelligenceSales,
    "AdminMetaSetup": AdminMetaSetup,
    "AdminNavigation": AdminNavigation,
    "AdminNavigationLayouts": AdminNavigationLayouts,
    "AdminNavigationNav": AdminNavigationNav,
    "AdminNavigationPages": AdminNavigationPages,
    "AdminNavigationQA": AdminNavigationQA,
    "AdminNavigationRoutes": AdminNavigationRoutes,
    "AdminOnboarding": AdminOnboarding,
    "AdminOnboardingDetail": AdminOnboardingDetail,
    "AdminOnboardingQueue": AdminOnboardingQueue,
    "AdminOperations": AdminOperations,
    "AdminOperationsCompany": AdminOperationsCompany,
    "AdminOptimizer": AdminOptimizer,
    "AdminOptimizerDetail": AdminOptimizerDetail,
    "AdminOrchestrator": AdminOrchestrator,
    "AdminOrchestratorDetail": AdminOrchestratorDetail,
    "AdminPlatform": AdminPlatform,
    "AdminProjectWorkspace": AdminProjectWorkspace,
    "AdminProjectsList": AdminProjectsList,
    "AdminQA": AdminQA,
    "AdminQAIssues": AdminQAIssues,
    "AdminQAReadiness": AdminQAReadiness,
    "AdminQARuns": AdminQARuns,
    "AdminQATests": AdminQATests,
    "AdminRecommendationDetail": AdminRecommendationDetail,
    "AdminRecommendations": AdminRecommendations,
    "AdminReports": AdminReports,
    "AdminResellerClients": AdminResellerClients,
    "AdminResellerCommissions": AdminResellerCommissions,
    "AdminResellerRevenue": AdminResellerRevenue,
    "AdminResellers": AdminResellers,
    "AdminRevenueDetail": AdminRevenueDetail,
    "AdminRevenueEngine": AdminRevenueEngine,
    "AdminSales": AdminSales,
    "AdminSalesAssets": AdminSalesAssets,
    "AdminSalesDashboard": AdminSalesDashboard,
    "AdminSalesFollowups": AdminSalesFollowups,
    "AdminSalesPrompts": AdminSalesPrompts,
    "AdminSalesProspect": AdminSalesProspect,
    "AdminSchoolAIContentReview": AdminSchoolAIContentReview,
    "AdminSchoolAIDashboard": AdminSchoolAIDashboard,
    "AdminSchoolAILab": AdminSchoolAILab,
    "AdminSchoolAnalytics": AdminSchoolAnalytics,
    "AdminSchoolBranding": AdminSchoolBranding,
    "AdminSchoolDashboard": AdminSchoolDashboard,
    "AdminSchoolEventDetail": AdminSchoolEventDetail,
    "AdminSchoolEvents": AdminSchoolEvents,
    "AdminSchoolLeadDetail": AdminSchoolLeadDetail,
    "AdminSchoolLeads": AdminSchoolLeads,
    "AdminSchoolLibrary": AdminSchoolLibrary,
    "AdminSchoolModeration": AdminSchoolModeration,
    "AdminSchoolOutreach": AdminSchoolOutreach,
    "AdminSchoolPipeline": AdminSchoolPipeline,
    "AdminSchoolProjectDetail": AdminSchoolProjectDetail,
    "AdminSchoolProjects": AdminSchoolProjects,
    "AdminSchoolRenderQueue": AdminSchoolRenderQueue,
    "AdminSchoolRoles": AdminSchoolRoles,
    "AdminSchoolSettings": AdminSchoolSettings,
    "AdminSchoolSettingsPermissions": AdminSchoolSettingsPermissions,
    "AdminSchoolSettingsPublishing": AdminSchoolSettingsPublishing,
    "AdminSchoolSpotlightDetail": AdminSchoolSpotlightDetail,
    "AdminSchoolSpotlights": AdminSchoolSpotlights,
    "AdminSchoolStoryLibrary": AdminSchoolStoryLibrary,
    "AdminSchoolStudentUploads": AdminSchoolStudentUploads,
    "AdminSchoolStudentUsers": AdminSchoolStudentUsers,
    "AdminSchoolSubmissions": AdminSchoolSubmissions,
    "AdminSchoolUsers": AdminSchoolUsers,
    "AdminSchoolVideoLibrary": AdminSchoolVideoLibrary,
    "AdminSchoolYearbook": AdminSchoolYearbook,
    "AdminSettings": AdminSettings,
    "AdminStoryDetail": AdminStoryDetail,
    "AdminStoryLibrary": AdminStoryLibrary,
    "AdminSubmissionDetail": AdminSubmissionDetail,
    "AdminSubmissionsList": AdminSubmissionsList,
    "AdminSystemHealth": AdminSystemHealth,
    "AdminTasks": AdminTasks,
    "AdminTestMatrix": AdminTestMatrix,
    "AdminUsers": AdminUsers,
    "AdminVideoDetail": AdminVideoDetail,
    "AdminVideoEngine": AdminVideoEngine,
    "AdminVideoEngineAnalytics": AdminVideoEngineAnalytics,
    "AdminVideoEngineApprovals": AdminVideoEngineApprovals,
    "AdminVideoEngineBrands": AdminVideoEngineBrands,
    "AdminVideoEngineRenders": AdminVideoEngineRenders,
    "AdminVideoEngineRequest": AdminVideoEngineRequest,
    "AdminVideoEngineRequests": AdminVideoEngineRequests,
    "AdminVideoEngineTemplates": AdminVideoEngineTemplates,
    "AdminVideoGenerator": AdminVideoGenerator,
    "AdminVideoLibrary": AdminVideoLibrary,
    "AdminVideoPublishing": AdminVideoPublishing,
    "AdminVideoQueue": AdminVideoQueue,
    "AdminVideoRenderDetail": AdminVideoRenderDetail,
    "AdminVideoRenderQueue": AdminVideoRenderQueue,
    "AdminVideos": AdminVideos,
    "AdminYearbookLibrary": AdminYearbookLibrary,
    "AdminYearbookOverview": AdminYearbookOverview,
    "AdminYearbookPage": AdminYearbookPage,
    "AdminYearbookSeason": AdminYearbookSeason,
    "AdminYouTubeSetup": AdminYouTubeSetup,
    "AgentArchitecture": AgentArchitecture,
    "AiAccessibilityChecker": AiAccessibilityChecker,
    "AiAdvertising": AiAdvertising,
    "AiMarketingPlatform": AiMarketingPlatform,
    "AiOperations": AiOperations,
    "AiSeo": AiSeo,
    "AiSocialMedia": AiSocialMedia,
    "AiSocialMediaSmallBusiness": AiSocialMediaSmallBusiness,
    "AiVideoStudio": AiVideoStudio,
    "AiVideos": AiVideos,
    "AiWebsites": AiWebsites,
    "AuthorityMap": AuthorityMap,
    "Blog": Blog,
    "BlogPost": BlogPost,
    "Book-Call": bookCall,
    "BulldogTV": BulldogTV,
    "BulldogTVSpotlights": BulldogTVSpotlights,
    "BulldogTVStories": BulldogTVStories,
    "BulldogTVSubmissions": BulldogTVSubmissions,
    "BulldogTVSubmit": BulldogTVSubmit,
    "BulldogTVVideos": BulldogTVVideos,
    "BulldogTVWatch": BulldogTVWatch,
    "BulldogTVYearbook": BulldogTVYearbook,
    "BusinessIntelProfileAdmin": BusinessIntelProfileAdmin,
    "BusinessProfileAdmin": BusinessProfileAdmin,
    "CRMHub": CRMHub,
    "CaseStudies": CaseStudies,
    "CaseStudyDetail": CaseStudyDetail,
    "ChatWidget": ChatWidget,
    "ChatbotManagement": ChatbotManagement,
    "ClientApprovals": ClientApprovals,
    "ClientBilling": ClientBilling,
    "ClientCalendar": ClientCalendar,
    "ClientCommerce": ClientCommerce,
    "ClientContentProduction": ClientContentProduction,
    "ClientDashboard": ClientDashboard,
    "ClientDashboardDemo": ClientDashboardDemo,
    "ClientFulfillment": ClientFulfillment,
    "ClientOnboarding": ClientOnboarding,
    "ClientReports": ClientReports,
    "ClientSettings": ClientSettings,
    "Contact": Contact,
    "ContentDrafts": ContentDrafts,
    "ContentEngine": ContentEngine,
    "ContentQueue": ContentQueue,
    "ContentStudio": ContentStudio,
    "ContributorAILab": ContributorAILab,
    "ContributorHub": ContributorHub,
    "ContributorSubmissions": ContributorSubmissions,
    "Dashboard": Dashboard,
    "DealRoom": DealRoom,
    "DealRoomCaseStudies": DealRoomCaseStudies,
    "DealRoomContract": DealRoomContract,
    "DealRoomPricing": DealRoomPricing,
    "DealRoomProposal": DealRoomProposal,
    "DealRoomRoi": DealRoomRoi,
    "DebugOAuthConnections": DebugOAuthConnections,
    "Demo": Demo,
    "DemoExamples": DemoExamples,
    "DemoFeatures": DemoFeatures,
    "DemoNext": DemoNext,
    "DemoOverview": DemoOverview,
    "DemoPlatform": DemoPlatform,
    "DemoPricing": DemoPricing,
    "DemoProblem": DemoProblem,
    "DemoRoi": DemoRoi,
    "DemoSchoolAbout": DemoSchoolAbout,
    "DemoSchoolChannel": DemoSchoolChannel,
    "DemoSchoolStoryDetail": DemoSchoolStoryDetail,
    "DemoStart": DemoStart,
    "DentistMarketing": DentistMarketing,
    "Free-Audit": freeAudit,
    "FunnelPage": FunnelPage,
    "Get-Started": getStarted,
    "GlobalSettings": GlobalSettings,
    "GrowthSystem": GrowthSystem,
    "HelpAndSupport": HelpAndSupport,
    "Home": Home,
    "HvacIndustry": HvacIndustry,
    "HvacMarketing": HvacMarketing,
    "IndustriesHub": IndustriesHub,
    "IndustriesNonprofits": IndustriesNonprofits,
    "IndustriesProfessionals": IndustriesProfessionals,
    "IndustriesServiceTrades": IndustriesServiceTrades,
    "IndustriesSmallLocal": IndustriesSmallLocal,
    "Industry": Industry,
    "IndustryIntelAdmin": IndustryIntelAdmin,
    "IndustryNonprofit": IndustryNonprofit,
    "IndustryNonprofits": IndustryNonprofits,
    "IndustryProfessional": IndustryProfessional,
    "IndustryProfessionals": IndustryProfessionals,
    "IndustryServiceTrades": IndustryServiceTrades,
    "IndustrySmall": IndustrySmall,
    "IndustrySmallLocal": IndustrySmallLocal,
    "IndustryTrades": IndustryTrades,
    "IntelAdmin": IntelAdmin,
    "LeadDetail": LeadDetail,
    "LeadsDashboard": LeadsDashboard,
    "LocalBusinessMarketing": LocalBusinessMarketing,
    "LocalMarketIntelAdmin": LocalMarketIntelAdmin,
    "LocalVisibility": LocalVisibility,
    "LocationPageAdmin": LocationPageAdmin,
    "MarketingPlanGenerator": MarketingPlanGenerator,
    "MedSpaMarketing": MedSpaMarketing,
    "MetaConnect": MetaConnect,
    "OauthCallback": OauthCallback,
    "OnboardThankYou": OnboardThankYou,
    "Onboarding": Onboarding,
    "OnboardingStart": OnboardingStart,
    "OperationsHub": OperationsHub,
    "OpportunitySignalAdmin": OpportunitySignalAdmin,
    "OurWork": OurWork,
    "PerformanceSignalAdmin": PerformanceSignalAdmin,
    "Platform": Platform,
    "PlumbingMarketing": PlumbingMarketing,
    "Pricing": Pricing,
    "PrivacyPolicy": PrivacyPolicy,
    "ProgrammaticSEODashboard": ProgrammaticSEODashboard,
    "Proposal": Proposal,
    "ProposalBuilder": ProposalBuilder,
    "ProposalDetail": ProposalDetail,
    "ProposalPipeline": ProposalPipeline,
    "ProposalPreview": ProposalPreview,
    "ProposalsList": ProposalsList,
    "PublicProposal": PublicProposal,
    "Rebuild-Intake": rebuildIntake,
    "Rebuild": Rebuild,
    "RebuildIntake": RebuildIntake,
    "RebuildIntakePretty": RebuildIntakePretty,
    "RebuildProposal": RebuildProposal,
    "ResellerBranding": ResellerBranding,
    "ResellerClients": ResellerClients,
    "ResellerDashboard": ResellerDashboard,
    "ResellerRevenue": ResellerRevenue,
    "ResellerSettingsBranding": ResellerSettingsBranding,
    "ResellerSignupLinks": ResellerSignupLinks,
    "RestaurantMarketing": RestaurantMarketing,
    "RestaurantSocialMedia": RestaurantSocialMedia,
    "RoofingMarketing": RoofingMarketing,
    "SalesDashboard": SalesDashboard,
    "SalesLeads": SalesLeads,
    "SalesPipeline": SalesPipeline,
    "SalesRoom": SalesRoom,
    "ScheduledQueue": ScheduledQueue,
    "SchoolAbout": SchoolAbout,
    "SchoolEventDetail": SchoolEventDetail,
    "SchoolEvents": SchoolEvents,
    "SchoolHome": SchoolHome,
    "SchoolSpotlightDetail": SchoolSpotlightDetail,
    "SchoolSpotlights": SchoolSpotlights,
    "SchoolStories": SchoolStories,
    "SchoolStoryDetail": SchoolStoryDetail,
    "SchoolStoryLab": SchoolStoryLab,
    "SchoolStoryLabPresentation": SchoolStoryLabPresentation,
    "SchoolStudentDashboard": SchoolStudentDashboard,
    "SchoolStudentLogin": SchoolStudentLogin,
    "SchoolStudentProfile": SchoolStudentProfile,
    "SchoolStudentUploadNew": SchoolStudentUploadNew,
    "SchoolStudentUploads": SchoolStudentUploads,
    "SchoolSubmit": SchoolSubmit,
    "SchoolSubmitGuide": SchoolSubmitGuide,
    "SchoolTV": SchoolTV,
    "SchoolTVDealRoom": SchoolTVDealRoom,
    "SchoolTVDemo": SchoolTVDemo,
    "SchoolVideoDetail": SchoolVideoDetail,
    "SchoolYearbook": SchoolYearbook,
    "SchoolYearbookCategory": SchoolYearbookCategory,
    "SchoolYearbookGallery": SchoolYearbookGallery,
    "SchoolYearbookPage": SchoolYearbookPage,
    "SchoolYearbookSeason": SchoolYearbookSeason,
    "ServiceLocation": ServiceLocation,
    "Services": Services,
    "SetupComplete": SetupComplete,
    "SiteMap": SiteMap,
    "SocialAccounts": SocialAccounts,
    "SocialMediaManagement": SocialMediaManagement,
    "SocialMediaMarketing": SocialMediaMarketing,
    "Start": Start,
    "StartTrial": StartTrial,
    "Store": Store,
    "Streaming-TV": streamingTv,
    "StreamingCreativePayment": StreamingCreativePayment,
    "StreamingDashboard": StreamingDashboard,
    "StreamingIntake": StreamingIntake,
    "StreamingOnboarding": StreamingOnboarding,
    "StreamingProposal": StreamingProposal,
    "StreamingTV": StreamingTV,
    "StreamingThankYou": StreamingThankYou,
    "StreamingTvAdvertising": StreamingTvAdvertising,
    "StudentAIStoryLab": StudentAIStoryLab,
    "TermsOfService": TermsOfService,
    "TrialDashboard": TrialDashboard,
    "TrialOnboarding": TrialOnboarding,
    "TrialSlug": TrialSlug,
    "TrialStart": TrialStart,
    "TvCommercialScriptGenerator": TvCommercialScriptGenerator,
    "TvVideo": TvVideo,
    "VideoDetail": VideoDetail,
    "VideoIndex": VideoIndex,
    "Website-Rebuild": websiteRebuild,
    "WebsiteRebuild": WebsiteRebuild,
    "WebsiteVideoManager": WebsiteVideoManager,
    "WeeklyPlanAdmin": WeeklyPlanAdmin,
    "WorkflowMap": WorkflowMap,
    "YouTubeUploadTest": YouTubeUploadTest,
    "AdminIntelligenceResellers": AdminIntelligenceResellers,
    "AdminAutonomy": AdminAutonomy,
    "AdminAutonomyOpportunities": AdminAutonomyOpportunities,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
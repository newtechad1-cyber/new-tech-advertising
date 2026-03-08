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
import AdminAlerts from './pages/AdminAlerts';
import AdminAutopilot from './pages/AdminAutopilot';
import AdminBlog from './pages/AdminBlog';
import AdminClients from './pages/AdminClients';
import AdminCommandCenter from './pages/AdminCommandCenter';
import AdminCopilot from './pages/AdminCopilot';
import AdminCopilotAccount from './pages/AdminCopilotAccount';
import AdminDashboard from './pages/AdminDashboard';
import AdminExecutive from './pages/AdminExecutive';
import AdminFulfillment from './pages/AdminFulfillment';
import AdminFulfillmentDetail from './pages/AdminFulfillmentDetail';
import AdminHelp from './pages/AdminHelp';
import AdminOnboarding from './pages/AdminOnboarding';
import AdminOnboardingDetail from './pages/AdminOnboardingDetail';
import AdminOnboardingQueue from './pages/AdminOnboardingQueue';
import AdminOperations from './pages/AdminOperations';
import AdminOperationsCompany from './pages/AdminOperationsCompany';
import AdminOptimizer from './pages/AdminOptimizer';
import AdminOptimizerDetail from './pages/AdminOptimizerDetail';
import AdminOrchestrator from './pages/AdminOrchestrator';
import AdminOrchestratorDetail from './pages/AdminOrchestratorDetail';
import AdminRecommendationDetail from './pages/AdminRecommendationDetail';
import AdminRecommendations from './pages/AdminRecommendations';
import AdminSales from './pages/AdminSales';
import AdminSettings from './pages/AdminSettings';
import AdminTasks from './pages/AdminTasks';
import AdminUsers from './pages/AdminUsers';
import AdminVideoDetail from './pages/AdminVideoDetail';
import AdminVideoGenerator from './pages/AdminVideoGenerator';
import AdminVideoQueue from './pages/AdminVideoQueue';
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
import BusinessIntelProfileAdmin from './pages/BusinessIntelProfileAdmin';
import BusinessProfileAdmin from './pages/BusinessProfileAdmin';
import CRMHub from './pages/CRMHub';
import CaseStudies from './pages/CaseStudies';
import CaseStudyDetail from './pages/CaseStudyDetail';
import ChatWidget from './pages/ChatWidget';
import ChatbotManagement from './pages/ChatbotManagement';
import ClientDashboard from './pages/ClientDashboard';
import ClientDashboardDemo from './pages/ClientDashboardDemo';
import ClientFulfillment from './pages/ClientFulfillment';
import ClientOnboarding from './pages/ClientOnboarding';
import Contact from './pages/Contact';
import ContentDrafts from './pages/ContentDrafts';
import ContentEngine from './pages/ContentEngine';
import ContentQueue from './pages/ContentQueue';
import ContentStudio from './pages/ContentStudio';
import Dashboard from './pages/Dashboard';
import DebugOAuthConnections from './pages/DebugOAuthConnections';
import Demo from './pages/Demo';
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
import MetaConnect from './pages/MetaConnect';
import OauthCallback from './pages/OauthCallback';
import OnboardThankYou from './pages/OnboardThankYou';
import Onboarding from './pages/Onboarding';
import OnboardingStart from './pages/OnboardingStart';
import OperationsHub from './pages/OperationsHub';
import OurWork from './pages/OurWork';
import OpportunitySignalAdmin from './pages/OpportunitySignalAdmin';
import PerformanceSignalAdmin from './pages/PerformanceSignalAdmin';
import Platform from './pages/Platform';
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
import RestaurantSocialMedia from './pages/RestaurantSocialMedia';
import ScheduledQueue from './pages/ScheduledQueue';
import ServiceLocation from './pages/ServiceLocation';
import Services from './pages/Services';
import SetupComplete from './pages/SetupComplete';
import SiteMap from './pages/SiteMap';
import SocialAccounts from './pages/SocialAccounts';
import SocialMediaManagement from './pages/SocialMediaManagement';
import SocialMediaMarketing from './pages/SocialMediaMarketing';
import Start from './pages/Start';
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
import AdminRevenueEngine from './pages/AdminRevenueEngine';
import AdminRevenueDetail from './pages/AdminRevenueDetail';
import AdminGovernance from './pages/AdminGovernance';
import AdminApproval from './pages/AdminApproval';
import AdminGovernancePolicy from './pages/AdminGovernancePolicy';
import AdminBilling from './pages/AdminBilling';
import AdminBillingContract from './pages/AdminBillingContract';
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
    "AdminAlerts": AdminAlerts,
    "AdminAutopilot": AdminAutopilot,
    "AdminBlog": AdminBlog,
    "AdminClients": AdminClients,
    "AdminCommandCenter": AdminCommandCenter,
    "AdminCopilot": AdminCopilot,
    "AdminCopilotAccount": AdminCopilotAccount,
    "AdminDashboard": AdminDashboard,
    "AdminExecutive": AdminExecutive,
    "AdminFulfillment": AdminFulfillment,
    "AdminFulfillmentDetail": AdminFulfillmentDetail,
    "AdminHelp": AdminHelp,
    "AdminOnboarding": AdminOnboarding,
    "AdminOnboardingDetail": AdminOnboardingDetail,
    "AdminOnboardingQueue": AdminOnboardingQueue,
    "AdminOperations": AdminOperations,
    "AdminOperationsCompany": AdminOperationsCompany,
    "AdminOptimizer": AdminOptimizer,
    "AdminOptimizerDetail": AdminOptimizerDetail,
    "AdminOrchestrator": AdminOrchestrator,
    "AdminOrchestratorDetail": AdminOrchestratorDetail,
    "AdminRecommendationDetail": AdminRecommendationDetail,
    "AdminRecommendations": AdminRecommendations,
    "AdminSales": AdminSales,
    "AdminSettings": AdminSettings,
    "AdminTasks": AdminTasks,
    "AdminUsers": AdminUsers,
    "AdminVideoDetail": AdminVideoDetail,
    "AdminVideoGenerator": AdminVideoGenerator,
    "AdminVideoQueue": AdminVideoQueue,
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
    "BusinessIntelProfileAdmin": BusinessIntelProfileAdmin,
    "BusinessProfileAdmin": BusinessProfileAdmin,
    "CRMHub": CRMHub,
    "CaseStudies": CaseStudies,
    "CaseStudyDetail": CaseStudyDetail,
    "ChatWidget": ChatWidget,
    "ChatbotManagement": ChatbotManagement,
    "ClientDashboard": ClientDashboard,
    "ClientDashboardDemo": ClientDashboardDemo,
    "ClientFulfillment": ClientFulfillment,
    "ClientOnboarding": ClientOnboarding,
    "Contact": Contact,
    "ContentDrafts": ContentDrafts,
    "ContentEngine": ContentEngine,
    "ContentQueue": ContentQueue,
    "ContentStudio": ContentStudio,
    "Dashboard": Dashboard,
    "DebugOAuthConnections": DebugOAuthConnections,
    "Demo": Demo,
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
    "MetaConnect": MetaConnect,
    "OauthCallback": OauthCallback,
    "OnboardThankYou": OnboardThankYou,
    "Onboarding": Onboarding,
    "OnboardingStart": OnboardingStart,
    "OperationsHub": OperationsHub,
    "OurWork": OurWork,
    "OpportunitySignalAdmin": OpportunitySignalAdmin,
    "PerformanceSignalAdmin": PerformanceSignalAdmin,
    "Platform": Platform,
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
    "RestaurantSocialMedia": RestaurantSocialMedia,
    "ScheduledQueue": ScheduledQueue,
    "ServiceLocation": ServiceLocation,
    "Services": Services,
    "SetupComplete": SetupComplete,
    "SiteMap": SiteMap,
    "SocialAccounts": SocialAccounts,
    "SocialMediaManagement": SocialMediaManagement,
    "SocialMediaMarketing": SocialMediaMarketing,
    "Start": Start,
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
    "AdminRevenueEngine": AdminRevenueEngine,
    "AdminRevenueDetail": AdminRevenueDetail,
    "AdminGovernance": AdminGovernance,
    "AdminApproval": AdminApproval,
    "AdminGovernancePolicy": AdminGovernancePolicy,
    "AdminBilling": AdminBilling,
    "AdminBillingContract": AdminBillingContract,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
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
import AdminBlog from './pages/AdminBlog';
import AdminDashboard from './pages/AdminDashboard';
import AdminHelp from './pages/AdminHelp';
import AdminSettings from './pages/AdminSettings';
import AdminVideoDetail from './pages/AdminVideoDetail';
import AdminVideoQueue from './pages/AdminVideoQueue';
import AiAdvertising from './pages/AiAdvertising';
import AiSeo from './pages/AiSeo';
import AiSocialMedia from './pages/AiSocialMedia';
import AiVideos from './pages/AiVideos';
import AiWebsites from './pages/AiWebsites';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import bookCall from './pages/Book-Call';
import Contact from './pages/Contact';
import ContentStudio from './pages/ContentStudio';
import Dashboard from './pages/Dashboard';
import freeAudit from './pages/Free-Audit';
import getStarted from './pages/Get-Started';
import Home from './pages/Home';
import IndustriesHub from './pages/IndustriesHub';
import IndustriesNonprofits from './pages/IndustriesNonprofits';
import IndustriesProfessionals from './pages/IndustriesProfessionals';
import IndustriesServiceTrades from './pages/IndustriesServiceTrades';
import IndustriesSmallLocal from './pages/IndustriesSmallLocal';
import Industry from './pages/Industry';
import IndustryNonprofit from './pages/IndustryNonprofit';
import IndustryNonprofits from './pages/IndustryNonprofits';
import IndustryProfessional from './pages/IndustryProfessional';
import IndustryProfessionals from './pages/IndustryProfessionals';
import IndustryServiceTrades from './pages/IndustryServiceTrades';
import IndustrySmall from './pages/IndustrySmall';
import IndustrySmallLocal from './pages/IndustrySmallLocal';
import IndustryTrades from './pages/IndustryTrades';
import LeadDetail from './pages/LeadDetail';
import LeadsDashboard from './pages/LeadsDashboard';
import LocalVisibility from './pages/LocalVisibility';
import OnboardThankYou from './pages/OnboardThankYou';
import Onboarding from './pages/Onboarding';
import OnboardingStart from './pages/OnboardingStart';
import rebuildIntake from './pages/Rebuild-Intake';
import Rebuild from './pages/Rebuild';
import RebuildIntake from './pages/RebuildIntake';
import RebuildIntakePretty from './pages/RebuildIntakePretty';
import RebuildProposal from './pages/RebuildProposal';
import SetupComplete from './pages/SetupComplete';
import SocialMediaManagement from './pages/SocialMediaManagement';
import SocialMediaMarketing from './pages/SocialMediaMarketing';
import streamingTv from './pages/Streaming-TV';
import StreamingCreativePayment from './pages/StreamingCreativePayment';
import StreamingIntake from './pages/StreamingIntake';
import StreamingOnboarding from './pages/StreamingOnboarding';
import StreamingProposal from './pages/StreamingProposal';
import StreamingTV from './pages/StreamingTV';
import StreamingThankYou from './pages/StreamingThankYou';
import TvVideo from './pages/TvVideo';
import VideoDetail from './pages/VideoDetail';
import VideoIndex from './pages/VideoIndex';
import websiteRebuild from './pages/Website-Rebuild';
import WebsiteRebuild from './pages/WebsiteRebuild';
import SocialAccounts from './pages/SocialAccounts';
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
    "AdminBlog": AdminBlog,
    "AdminDashboard": AdminDashboard,
    "AdminHelp": AdminHelp,
    "AdminSettings": AdminSettings,
    "AdminVideoDetail": AdminVideoDetail,
    "AdminVideoQueue": AdminVideoQueue,
    "AiAdvertising": AiAdvertising,
    "AiSeo": AiSeo,
    "AiSocialMedia": AiSocialMedia,
    "AiVideos": AiVideos,
    "AiWebsites": AiWebsites,
    "Blog": Blog,
    "BlogPost": BlogPost,
    "Book-Call": bookCall,
    "Contact": Contact,
    "ContentStudio": ContentStudio,
    "Dashboard": Dashboard,
    "Free-Audit": freeAudit,
    "Get-Started": getStarted,
    "Home": Home,
    "IndustriesHub": IndustriesHub,
    "IndustriesNonprofits": IndustriesNonprofits,
    "IndustriesProfessionals": IndustriesProfessionals,
    "IndustriesServiceTrades": IndustriesServiceTrades,
    "IndustriesSmallLocal": IndustriesSmallLocal,
    "Industry": Industry,
    "IndustryNonprofit": IndustryNonprofit,
    "IndustryNonprofits": IndustryNonprofits,
    "IndustryProfessional": IndustryProfessional,
    "IndustryProfessionals": IndustryProfessionals,
    "IndustryServiceTrades": IndustryServiceTrades,
    "IndustrySmall": IndustrySmall,
    "IndustrySmallLocal": IndustrySmallLocal,
    "IndustryTrades": IndustryTrades,
    "LeadDetail": LeadDetail,
    "LeadsDashboard": LeadsDashboard,
    "LocalVisibility": LocalVisibility,
    "OnboardThankYou": OnboardThankYou,
    "Onboarding": Onboarding,
    "OnboardingStart": OnboardingStart,
    "Rebuild-Intake": rebuildIntake,
    "Rebuild": Rebuild,
    "RebuildIntake": RebuildIntake,
    "RebuildIntakePretty": RebuildIntakePretty,
    "RebuildProposal": RebuildProposal,
    "SetupComplete": SetupComplete,
    "SocialMediaManagement": SocialMediaManagement,
    "SocialMediaMarketing": SocialMediaMarketing,
    "Streaming-TV": streamingTv,
    "StreamingCreativePayment": StreamingCreativePayment,
    "StreamingIntake": StreamingIntake,
    "StreamingOnboarding": StreamingOnboarding,
    "StreamingProposal": StreamingProposal,
    "StreamingTV": StreamingTV,
    "StreamingThankYou": StreamingThankYou,
    "TvVideo": TvVideo,
    "VideoDetail": VideoDetail,
    "VideoIndex": VideoIndex,
    "Website-Rebuild": websiteRebuild,
    "WebsiteRebuild": WebsiteRebuild,
    "SocialAccounts": SocialAccounts,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
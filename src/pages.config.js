import About from './pages/About';
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
import AdminSettings from './pages/AdminSettings';
import AiAdvertising from './pages/AiAdvertising';
import AiSeo from './pages/AiSeo';
import AiSocialMedia from './pages/AiSocialMedia';
import AiVideos from './pages/AiVideos';
import AiWebsites from './pages/AiWebsites';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
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
import OnboardThankYou from './pages/OnboardThankYou';
import Onboarding from './pages/Onboarding';
import OnboardingStart from './pages/OnboardingStart';
import Rebuild from './pages/Rebuild';
import RebuildIntake from './pages/RebuildIntake';
import RebuildProposal from './pages/RebuildProposal';
import SetupComplete from './pages/SetupComplete';
import SocialMediaManagement from './pages/SocialMediaManagement';
import StreamingCreativePayment from './pages/StreamingCreativePayment';
import StreamingIntake from './pages/StreamingIntake';
import StreamingOnboarding from './pages/StreamingOnboarding';
import StreamingProposal from './pages/StreamingProposal';
import StreamingTV from './pages/StreamingTV';
import StreamingThankYou from './pages/StreamingThankYou';
import TvVideo from './pages/TvVideo';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
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
    "AdminSettings": AdminSettings,
    "AiAdvertising": AiAdvertising,
    "AiSeo": AiSeo,
    "AiSocialMedia": AiSocialMedia,
    "AiVideos": AiVideos,
    "AiWebsites": AiWebsites,
    "Blog": Blog,
    "BlogPost": BlogPost,
    "Contact": Contact,
    "Dashboard": Dashboard,
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
    "OnboardThankYou": OnboardThankYou,
    "Onboarding": Onboarding,
    "OnboardingStart": OnboardingStart,
    "Rebuild": Rebuild,
    "RebuildIntake": RebuildIntake,
    "RebuildProposal": RebuildProposal,
    "SetupComplete": SetupComplete,
    "SocialMediaManagement": SocialMediaManagement,
    "StreamingCreativePayment": StreamingCreativePayment,
    "StreamingIntake": StreamingIntake,
    "StreamingOnboarding": StreamingOnboarding,
    "StreamingProposal": StreamingProposal,
    "StreamingTV": StreamingTV,
    "StreamingThankYou": StreamingThankYou,
    "TvVideo": TvVideo,
}

export const routes = {
    "/industries": "IndustriesHub",
    "/industries/small-local": "IndustriesSmallLocal",
    "/industries/service-trades": "IndustriesServiceTrades",
    "/industries/professionals": "IndustriesProfessionals",
    "/industries/nonprofits": "IndustriesNonprofits",
    "/industry": "IndustriesHub",
    "/industry/small-local": "IndustriesSmallLocal",
    "/industry/service-trades": "IndustriesServiceTrades",
    "/industry/professionals": "IndustriesProfessionals",
    "/industry/nonprofits": "IndustriesNonprofits",
};

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
    routes: routes,
};
/**
 * Public-only route registry.
 *
 * This file is the only page-key registry imported by the public app.
 * Private Admin Hub, client portal, CRM, ops, billing, and agency page
 * components must not be added here. Use src/config/publicRoutes.js for
 * human-readable public aliases.
 */
import SignupPage from './pages/SignupPage';
import About from './pages/About';
import adaCompliance from './pages/Ada-Compliance';
import Ada from './pages/Ada';
import AdaAccessibility from './pages/AdaAccessibility';
import AdaIntake from './pages/AdaIntake';
import AdaOnboarding from './pages/AdaOnboarding';
import AdaQuote from './pages/AdaQuote';
import AdaSuccess from './pages/AdaSuccess';
import AdaThankYou from './pages/AdaThankYou';
import AdaWebsiteCompliance from './pages/AdaWebsiteCompliance';
import AdaWebsiteLawsuitPrevention from './pages/AdaWebsiteLawsuitPrevention';
import AdaWebsiteRebuild from './pages/AdaWebsiteRebuild';
import AiSeo from './pages/AiSeo';
import AiAccessibilityChecker from './pages/AiAccessibilityChecker';
import AiAdvertising from './pages/AiAdvertising';
import AiMarketingPlatform from './pages/AiMarketingPlatform';
import AiSocialMedia from './pages/AiSocialMedia';
import AiSocialMediaSmallBusiness from './pages/AiSocialMediaSmallBusiness';
import AiVideoStudio from './pages/AiVideoStudio';
import AiVideos from './pages/AiVideos';
import AiWebsites from './pages/AiWebsites';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import bookCall from './pages/Book-Call';
import BookCall from './pages/BookCall';
import BulldogTV from './pages/BulldogTV';
import BulldogTVSpotlights from './pages/BulldogTVSpotlights';
import BulldogTVStories from './pages/BulldogTVStories';
import BulldogTVSubmissions from './pages/BulldogTVSubmissions';
import BulldogTVSubmit from './pages/BulldogTVSubmit';
import BulldogTVVideos from './pages/BulldogTVVideos';
import BulldogTVWatch from './pages/BulldogTVWatch';
import BulldogTVYearbook from './pages/BulldogTVYearbook';
import CaseStudies from './pages/CaseStudies';
import CaseStudyDetail from './pages/CaseStudyDetail';
import ChannelHelpCenter from './pages/ChannelHelpCenter';
import Contact from './pages/Contact';
import Demo from './pages/Demo';
import DemoExamples from './pages/DemoExamples';
import DemoFeatures from './pages/DemoFeatures';
import DemoFlow from './pages/DemoFlow';
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
import getStarted from './pages/Get-Started';
import GettingStarted from './pages/GettingStarted';
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
import IndustryNonprofit from './pages/IndustryNonprofit';
import IndustryNonprofits from './pages/IndustryNonprofits';
import IndustryProfessional from './pages/IndustryProfessional';
import IndustryProfessionals from './pages/IndustryProfessionals';
import IndustryServiceTrades from './pages/IndustryServiceTrades';
import IndustrySmall from './pages/IndustrySmall';
import IndustrySmallLocal from './pages/IndustrySmallLocal';
import IndustryTrades from './pages/IndustryTrades';
import LocalBusinessMarketing from './pages/LocalBusinessMarketing';
import LocalVisibility from './pages/LocalVisibility';
import MedSpaMarketing from './pages/MedSpaMarketing';
import JoinNTA from './pages/JoinNTA';
import OnboardThankYou from './pages/OnboardThankYou';
import Onboarding from './pages/Onboarding';
import OnboardingStart from './pages/OnboardingStart';
import Platform from './pages/Platform';
import PlumbingMarketing from './pages/PlumbingMarketing';
import Pricing from './pages/Pricing';
import PrivacyPolicy from './pages/PrivacyPolicy';
import rebuildIntake from './pages/Rebuild-Intake';
import Rebuild from './pages/Rebuild';
import RebuildIntake from './pages/RebuildIntake';
import RebuildIntakePretty from './pages/RebuildIntakePretty';
import RestaurantMarketing from './pages/RestaurantMarketing';
import RestaurantSocialMedia from './pages/RestaurantSocialMedia';
import RoofingMarketing from './pages/RoofingMarketing';
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
import SchoolStudentLogin from './pages/SchoolStudentLogin';
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
import SocialMediaManagement from './pages/SocialMediaManagement';
import SocialMediaMarketing from './pages/SocialMediaMarketing';
import Start from './pages/Start';
import StartTrial from './pages/StartTrial';
import Store from './pages/Store';
import streamingTv from './pages/Streaming-TV';
import StreamingTV from './pages/StreamingTV';
import StreamingTvAdvertising from './pages/StreamingTvAdvertising';
import TermsOfService from './pages/TermsOfService';
import TrialActivation from './pages/TrialActivation';
import TrialBusiness from './pages/TrialBusiness';
import TrialChannels from './pages/TrialChannels';
import TrialDashboard from './pages/TrialDashboard';
import TrialOnboarding from './pages/TrialOnboarding';
import TrialSlug from './pages/TrialSlug';
import TrialStart from './pages/TrialStart';
import TrialWelcome from './pages/TrialWelcome';
import TvCommercialScriptGenerator from './pages/TvCommercialScriptGenerator';
import TvVideo from './pages/TvVideo';
import VideoDetail from './pages/VideoDetail';
import VideoIndex from './pages/VideoIndex';
import websiteRebuild from './pages/Website-Rebuild';
import WebsiteRebuild from './pages/WebsiteRebuild';
import WhatChangedOnline from './pages/WhatChangedOnline';
import CanonExplorer from './pages/CanonExplorer';
import CanonCollectionView from './pages/CanonCollectionView';
import NtaJournal from './pages/NtaJournal';
import JournalLanding from './pages/JournalLanding';
import JournalIssueView from './pages/JournalIssueView';
import __Layout from './Layout.jsx';

export const PAGES = {
  "signup": SignupPage,
  "About": About,
  "Ada-Compliance": adaCompliance,
  "Ada": Ada,
  "AdaAccessibility": AdaAccessibility,
  "AdaIntake": AdaIntake,
  "AdaOnboarding": AdaOnboarding,
  "AdaQuote": AdaQuote,
  "AdaSuccess": AdaSuccess,
  "AdaThankYou": AdaThankYou,
  "AdaWebsiteCompliance": AdaWebsiteCompliance,
  "AdaWebsiteLawsuitPrevention": AdaWebsiteLawsuitPrevention,
  "AdaWebsiteRebuild": AdaWebsiteRebuild,
  "AiSeo": AiSeo,
  "AiAccessibilityChecker": AiAccessibilityChecker,
  "AiAdvertising": AiAdvertising,
  "AiMarketingPlatform": AiMarketingPlatform,
  "AiSocialMedia": AiSocialMedia,
  "AiSocialMediaSmallBusiness": AiSocialMediaSmallBusiness,
  "AiVideoStudio": AiVideoStudio,
  "AiVideos": AiVideos,
  "AiWebsites": AiWebsites,
  "Blog": Blog,
  "BlogPost": BlogPost,
  "Book-Call": bookCall,
  "BookCall": BookCall,
  "BulldogTV": BulldogTV,
  "BulldogTVSpotlights": BulldogTVSpotlights,
  "BulldogTVStories": BulldogTVStories,
  "BulldogTVSubmissions": BulldogTVSubmissions,
  "BulldogTVSubmit": BulldogTVSubmit,
  "BulldogTVVideos": BulldogTVVideos,
  "BulldogTVWatch": BulldogTVWatch,
  "BulldogTVYearbook": BulldogTVYearbook,
  "CaseStudies": CaseStudies,
  "CaseStudyDetail": CaseStudyDetail,
  "ChannelHelpCenter": ChannelHelpCenter,
  "Contact": Contact,
  "Demo": Demo,
  "DemoExamples": DemoExamples,
  "DemoFeatures": DemoFeatures,
  "DemoFlow": DemoFlow,
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
  "Get-Started": getStarted,
  "GettingStarted": GettingStarted,
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
  "IndustryNonprofit": IndustryNonprofit,
  "IndustryNonprofits": IndustryNonprofits,
  "IndustryProfessional": IndustryProfessional,
  "IndustryProfessionals": IndustryProfessionals,
  "IndustryServiceTrades": IndustryServiceTrades,
  "IndustrySmall": IndustrySmall,
  "IndustrySmallLocal": IndustrySmallLocal,
  "IndustryTrades": IndustryTrades,
  "LocalBusinessMarketing": LocalBusinessMarketing,
  "LocalVisibility": LocalVisibility,
  "MedSpaMarketing": MedSpaMarketing,
  "JoinNTA": JoinNTA,
  "OnboardThankYou": OnboardThankYou,
  "Onboarding": Onboarding,
  "OnboardingStart": OnboardingStart,
  "Platform": Platform,
  "PlumbingMarketing": PlumbingMarketing,
  "Pricing": Pricing,
  "PrivacyPolicy": PrivacyPolicy,
  "Rebuild-Intake": rebuildIntake,
  "Rebuild": Rebuild,
  "RebuildIntake": RebuildIntake,
  "RebuildIntakePretty": RebuildIntakePretty,
  "RestaurantMarketing": RestaurantMarketing,
  "RestaurantSocialMedia": RestaurantSocialMedia,
  "RoofingMarketing": RoofingMarketing,
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
  "SchoolStudentLogin": SchoolStudentLogin,
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
  "SocialMediaManagement": SocialMediaManagement,
  "SocialMediaMarketing": SocialMediaMarketing,
  "Start": Start,
  "StartTrial": StartTrial,
  "Store": Store,
  "Streaming-TV": streamingTv,
  "StreamingTV": StreamingTV,
  "StreamingTvAdvertising": StreamingTvAdvertising,
  "TermsOfService": TermsOfService,
  "TrialActivation": TrialActivation,
  "TrialBusiness": TrialBusiness,
  "TrialChannels": TrialChannels,
  "TrialDashboard": TrialDashboard,
  "TrialOnboarding": TrialOnboarding,
  "TrialSlug": TrialSlug,
  "TrialStart": TrialStart,
  "TrialWelcome": TrialWelcome,
  "TvCommercialScriptGenerator": TvCommercialScriptGenerator,
  "TvVideo": TvVideo,
  "VideoDetail": VideoDetail,
  "VideoIndex": VideoIndex,
  "Website-Rebuild": websiteRebuild,
  "WebsiteRebuild": WebsiteRebuild,
  "what-changed-online": WhatChangedOnline,
  "CanonExplorer": CanonExplorer,
  "CanonCollectionView": CanonCollectionView,
  "NtaJournal": NtaJournal,
  "JournalLanding": JournalLanding,
  "JournalIssueView": JournalIssueView,
};

export const pagesConfig = {
  mainPage: "Home",
  Pages: PAGES,
  Layout: __Layout,
};

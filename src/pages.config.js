/**
 * Explicit public page registry for the public NTA site.
 *
 * This registry intentionally contains only pages that are safe to expose as
 * direct public page keys. Human-readable routes and dynamic public content
 * live in src/config/publicRoutes.js. Private Admin Hub, client portal, CRM,
 * operations, billing, sales, trial, student, and internal demo pages do not
 * belong here.
 */
import SignupPage from './pages/SignupPage';
import About from './pages/About';
import AiSeo from './pages/AiSeo';
import AiSocialMedia from './pages/AiSocialMedia';
import AiWebsites from './pages/AiWebsites';
import AiAdvertising from './pages/AiAdvertising';
import AiVideos from './pages/AiVideos';
import bookCall from './pages/Book-Call';
import BookCall from './pages/BookCall';
import CaseStudies from './pages/CaseStudies';
import CaseStudyDetail from './pages/CaseStudyDetail';
import Contact from './pages/Contact';
import FreeAudit from './pages/Free-Audit';
import Home from './pages/Home';
import HvacMarketing from './pages/HvacMarketing';
import JoinNTA from './pages/JoinNTA';
import LocalLeadSystems from './pages/LocalLeadSystems';
import LocalVisibility from './pages/LocalVisibility';
import NtaJournal from './pages/NtaJournal';
import JournalLanding from './pages/JournalLanding';
import JournalIssueView from './pages/JournalIssueView';
import Pricing from './pages/Pricing';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RestaurantMarketing from './pages/RestaurantMarketing';
import Services from './pages/Services';
import TermsOfService from './pages/TermsOfService';
import GrowthShow from './pages/GrowthShow';
import GrowthShowEpisode from './pages/GrowthShowEpisode';
import HelpAndSupport from './pages/HelpAndSupport';
import LearningCenter from './pages/LearningCenter';
import KnowledgeLibrary from './pages/KnowledgeLibrary';
import HowCanASmallBusinessUseAI from './pages/knowledge/questions/how-can-a-small-business-use-ai';
import StartWithTheWorkNativeLesson from './pages/knowledge/ai-foundations/start-with-the-work-not-the-tool';
import AiNeedsContextNativeLesson from './pages/knowledge/ai-foundations/ai-needs-context-before-it-can-be-helpful';
import UnderstandingBeforeSpendingNativeLesson from './pages/knowledge/business-foundations/understanding-before-spending';
import WhereShouldIStartWithAiQuestionPage from './pages/knowledge/questions/where-should-i-start-with-ai';
import WhatCanChatgptDoForASmallBusinessQuestionPage from './pages/knowledge/questions/what-can-chatgpt-do-for-a-small-business';
import DoINeedAPerfectPromptQuestionPage from './pages/knowledge/questions/do-i-need-a-perfect-prompt';
import WhyDoesAiGiveBadAnswersQuestionPage from './pages/knowledge/questions/why-does-ai-give-bad-answers';
import WhatAiToolsDoesASmallBusinessReallyNeedQuestionPage from './pages/knowledge/questions/what-ai-tools-does-a-small-business-really-need';
import HowCanEmployeesUseAiAtWorkQuestionPage from './pages/knowledge/questions/how-can-employees-use-ai-at-work';
import HowMuchShouldASmallBusinessSpendOnMarketingQuestionPage from './pages/knowledge/questions/how-much-should-a-small-business-spend-on-marketing';
import WhatShouldIDoWithMyFirst500MarketingBudgetQuestionPage from './pages/knowledge/questions/what-should-i-do-with-my-first-500-marketing-budget';
import WhyDoesMarketingRequireOngoingSpendingQuestionPage from './pages/knowledge/questions/why-does-marketing-require-ongoing-spending';
import HowDoIKnowWhetherMyMarketingIsWorkingQuestionPage from './pages/knowledge/questions/how-do-i-know-whether-my-marketing-is-working';
import WhyIsntMyWebsiteGeneratingLeadsQuestionPage from './pages/knowledge/questions/why-isnt-my-website-generating-leads';
import HowDoIBuildCustomerTrustQuestionPage from './pages/knowledge/questions/how-do-i-build-customer-trust';
import HowDoIMarketALocalServiceBusinessQuestionPage from './pages/knowledge/questions/how-do-i-market-a-local-service-business';
import IsSocialMediaEnoughForASmallBusinessQuestionPage from './pages/knowledge/questions/is-social-media-enough-for-a-small-business';
import ShouldASmallBusinessStillAdvertiseOnTvQuestionPage from './pages/knowledge/questions/should-a-small-business-still-advertise-on-tv';
import HowCanAiUseKnowledgeAlreadyInsideMyCompanyQuestionPage from './pages/knowledge/questions/how-can-ai-use-knowledge-already-inside-my-company';
import HowCanAiHelpWithCustomerFollowUpQuestionPage from './pages/knowledge/questions/how-can-ai-help-with-customer-follow-up';
import HowCanAiHelpMarketMySmallBusinessQuestionPage from './pages/knowledge/questions/how-can-ai-help-market-my-small-business';
import HowCanAiHelpMeGetMoreCustomersQuestionPage from './pages/knowledge/questions/how-can-ai-help-me-get-more-customers';
import HowCanAiSaveMeTimeInMyBusinessQuestionPage from './pages/knowledge/questions/how-can-ai-save-me-time-in-my-business';
import HowCanAiHelpWithSocialMediaForMyBusinessQuestionPage from './pages/knowledge/questions/how-can-ai-help-with-social-media-for-my-business';
import HowCanAiHelpMySmallBusinessWebsiteQuestionPage from './pages/knowledge/questions/how-can-ai-help-my-small-business-website';
import HowCanMyBusinessShowUpInChatgptAndAiSearchQuestionPage from './pages/knowledge/questions/how-can-my-business-show-up-in-chatgpt-and-ai-search';
import WhatShouldIAutomateInMySmallBusinessQuestionPage from './pages/knowledge/questions/what-should-i-automate-in-my-small-business';
import IsAiSafeForMySmallBusinessAndCustomerDataQuestionPage from './pages/knowledge/questions/is-ai-safe-for-my-small-business-and-customer-data';
import IsAiWorthItForASmallBusinessQuestionPage from './pages/knowledge/questions/is-ai-worth-it-for-a-small-business';
import RestaurantSolutions from './pages/RestaurantSolutions';
import DigitalGrowthAdvisor from './pages/DigitalGrowthAdvisor';
import OurStory from './pages/OurStory';
import OurWork from './pages/OurWork';
import PracticalAI from './pages/PracticalAI';
import WhyNTA from './pages/WhyNTA';
import __Layout from './Layout.jsx';

const PAGES = {
  "Home": Home,
  signup: SignupPage,
  About,
  Services,
  Contact,
  Pricing,
  PrivacyPolicy,
  TermsOfService,
  'Free-Audit': FreeAudit,
  'Book-Call': bookCall,
  BookCall,
  AiSeo,
  AiSocialMedia,
  AiWebsites,
  AiAdvertising,
  AiVideos,
  RestaurantMarketing,
  HvacMarketing,
  JoinNTA,
  LocalLeadSystems,
  LocalVisibility,
  NtaJournal,
  JournalLanding,
  JournalIssueView,
  GrowthShow,
  GrowthShowEpisode,
  HelpAndSupport,
  LearningCenter,
  KnowledgeLibrary,
  knowledge: KnowledgeLibrary,
  'knowledge/questions/how-can-a-small-business-use-ai': HowCanASmallBusinessUseAI,
  'knowledge/ai-foundations/start-with-the-work-not-the-tool': StartWithTheWorkNativeLesson,
  'knowledge/ai-foundations/ai-needs-context-before-it-can-be-helpful': AiNeedsContextNativeLesson,
  'knowledge/business-foundations/understanding-before-spending': UnderstandingBeforeSpendingNativeLesson,
  'knowledge/questions/where-should-i-start-with-ai': WhereShouldIStartWithAiQuestionPage,
  'knowledge/questions/what-can-chatgpt-do-for-a-small-business': WhatCanChatgptDoForASmallBusinessQuestionPage,
  'knowledge/questions/do-i-need-a-perfect-prompt': DoINeedAPerfectPromptQuestionPage,
  'knowledge/questions/why-does-ai-give-bad-answers': WhyDoesAiGiveBadAnswersQuestionPage,
  'knowledge/questions/what-ai-tools-does-a-small-business-really-need': WhatAiToolsDoesASmallBusinessReallyNeedQuestionPage,
  'knowledge/questions/how-can-employees-use-ai-at-work': HowCanEmployeesUseAiAtWorkQuestionPage,
  'knowledge/questions/how-much-should-a-small-business-spend-on-marketing': HowMuchShouldASmallBusinessSpendOnMarketingQuestionPage,
  'knowledge/questions/what-should-i-do-with-my-first-500-marketing-budget': WhatShouldIDoWithMyFirst500MarketingBudgetQuestionPage,
  'knowledge/questions/why-does-marketing-require-ongoing-spending': WhyDoesMarketingRequireOngoingSpendingQuestionPage,
  'knowledge/questions/how-do-i-know-whether-my-marketing-is-working': HowDoIKnowWhetherMyMarketingIsWorkingQuestionPage,
  'knowledge/questions/why-isnt-my-website-generating-leads': WhyIsntMyWebsiteGeneratingLeadsQuestionPage,
  'knowledge/questions/how-do-i-build-customer-trust': HowDoIBuildCustomerTrustQuestionPage,
  'knowledge/questions/how-do-i-market-a-local-service-business': HowDoIMarketALocalServiceBusinessQuestionPage,
  'knowledge/questions/is-social-media-enough-for-a-small-business': IsSocialMediaEnoughForASmallBusinessQuestionPage,
  'knowledge/questions/should-a-small-business-still-advertise-on-tv': ShouldASmallBusinessStillAdvertiseOnTvQuestionPage,
  'knowledge/questions/how-can-ai-use-knowledge-already-inside-my-company': HowCanAiUseKnowledgeAlreadyInsideMyCompanyQuestionPage,
  'knowledge/questions/how-can-ai-help-with-customer-follow-up': HowCanAiHelpWithCustomerFollowUpQuestionPage,
  'knowledge/questions/how-can-ai-help-market-my-small-business': HowCanAiHelpMarketMySmallBusinessQuestionPage,
  'knowledge/questions/how-can-ai-help-me-get-more-customers': HowCanAiHelpMeGetMoreCustomersQuestionPage,
  'knowledge/questions/how-can-ai-save-me-time-in-my-business': HowCanAiSaveMeTimeInMyBusinessQuestionPage,
  'knowledge/questions/how-can-ai-help-with-social-media-for-my-business': HowCanAiHelpWithSocialMediaForMyBusinessQuestionPage,
  'knowledge/questions/how-can-ai-help-my-small-business-website': HowCanAiHelpMySmallBusinessWebsiteQuestionPage,
  'knowledge/questions/how-can-my-business-show-up-in-chatgpt-and-ai-search': HowCanMyBusinessShowUpInChatgptAndAiSearchQuestionPage,
  'knowledge/questions/what-should-i-automate-in-my-small-business': WhatShouldIAutomateInMySmallBusinessQuestionPage,
  'knowledge/questions/is-ai-safe-for-my-small-business-and-customer-data': IsAiSafeForMySmallBusinessAndCustomerDataQuestionPage,
  'knowledge/questions/is-ai-worth-it-for-a-small-business': IsAiWorthItForASmallBusinessQuestionPage,
  restaurants: RestaurantSolutions,
  'digital-growth-advisor': DigitalGrowthAdvisor,
  OurStory,
  OurWork,
  PracticalAI,
  WhyNTA,
  CaseStudies,
  CaseStudyDetail,
};

export const pagesConfig = {
  mainPage: 'Home',
  Pages: PAGES,
  Layout: __Layout,
};

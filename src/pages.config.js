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
import StartWithTheWorkNotTheToolLessonPage from './pages/knowledge/ai-foundations/start-with-the-work-not-the-tool';
// Public canonical route pages for Base44 crawler rendering.
import PublicSeoPage001 from './pages/GrowthSystem';
import PublicSeoPage002 from './pages/IndustriesHub';
import PublicSeoPage003 from './pages/AiMarketingPlatform';
import PublicSeoPage004 from './pages/StreamingTvAdvertising';
import PublicSeoPage005 from './pages/AdaWebsiteCompliance';
import PublicSeoPage006 from './pages/AIVisibilityBasics';
import PublicSeoPage007 from './pages/NTAOperatingSystem';
import PublicSeoPage008 from './pages/WorkWithNTA';
import PublicSeoPage009 from './pages/POVCollection';
import PublicSeoPage010 from './pages/CanonExplorer';
import PublicSeoPage011 from './pages/Books';
import PublicSeoPage012 from './pages/BetterBusinessBook';
import PublicSeoPage013 from './pages/PracticalAI';
import PublicSeoPage014 from './pages/JournalLanding';
import PublicSeoPage015 from './pages/GrowthGuide';
import PublicSeoPage016 from './pages/NTAGrowthConversation';
import PublicSeoPage017 from './pages/CommunityPartnerProgram';
import PublicSeoPage018 from './pages/CommunityGrowthConversation';
import PublicSeoPage019 from './pages/AccountManager';
import PublicSeoPage020 from './pages/AIVideoMarketing';
import PublicSeoPage021 from './pages/BackOfficeSolutions';
import PublicSeoPage022 from './pages/AccessibleWebsites';
import PublicSeoPage023 from './pages/WebAccessibilityTrust';
import PublicSeoPage024 from './pages/DigitalRisks';
import PublicSeoPage025 from './pages/ReputationIsNowAGrowthEngine';
import PublicSeoPage026 from './pages/GrowthSystemsVsCampaigns';
import PublicSeoPage027 from './pages/HVACMarketingNorthIowa';
import PublicSeoPage028 from './pages/SmallBusinessesNationwide';
import PublicSeoPage029 from './pages/BusinessFoundationsCollection';
import PublicSeoPage030 from './pages/TruthAboutBusinessGrowthCollection';
import PublicSeoPage031 from './pages/HowCustomersDecideWhoToTrustCollection';
import PublicSeoPage032 from './pages/HowBusinessesTurnTrustIntoLastingRelationshipsCollection';
import PublicSeoPage033 from './pages/TurningWhatABusinessKnowsIntoAnAssetCollection';
import PublicSeoPage034 from './pages/AIFoundationsCollection';
import PublicSeoPage035 from './pages/WhatIsDigitalTrustCollection';
import PublicSeoPage036 from './pages/AIHumanityCollection';
import PublicSeoPage037 from './pages/AIHumanityArticle';
import PublicSeoPage038 from './pages/KnowledgeQuestions';
import PublicSeoPage039 from './legacy-page-components/LCVideoLibrary';
import PublicSeoPage040 from './pages/KnowledgeBuildingSmallBusinessWithAiCollection';
import PublicSeoPage041 from './pages/KnowledgeLifetimeBusinessCollection';
import PublicJournalIssue01 from './pages/journal/issue-1-the-system-behind-the-work';
import PublicJournalIssue02 from './pages/journal/issue-2-what-i-learned-while-rebuilding-nta';
import PublicJournalIssue03 from './pages/journal/issue-3-what-i-learned-about-making-complicated-things-simple';
import PublicJournalIssue04 from './pages/journal/the-free-ai-guy-comes-to-life';
import PublicJournalIssue05 from './pages/journal/issue-5-build-with-the-budget-you-have';
import PublicJournalIssue06 from './pages/journal/issue-6-ai-finally-taught-me-how-to-multitask';
import PublicJournalIssue07 from './pages/journal/issue-7-are-you-building-a-business-or-just-a-website';
import PublicJournalIssue08 from './pages/journal/issue-8-your-business-already-knows-more-than-you-think';
import CanonNtaPrinciplesCollectionPage from './pages/CanonNtaPrinciplesCollectionPage';
import CanonSetupMattersPage from './pages/CanonSetupMattersPage';
// BEGIN GENERATED NATIVE LESSON IMPORTS
import NativeLessonPage001 from './pages/knowledge/business-foundations/why-nta-exists';
import NativeLessonPage002 from './pages/knowledge/business-foundations/how-businesses-really-grow';
import NativeLessonPage003 from './pages/knowledge/business-foundations/marketing-isnt-magic';
import NativeLessonPage004 from './pages/knowledge/business-foundations/every-system-produces-exactly-what-it-was-designed-to-produce';
import NativeLessonPage005 from './pages/knowledge/business-foundations/understanding-before-spending';
import NativeLessonPage006 from './pages/knowledge/business-foundations/ai-is-my-team-not-my-replacement';
import NativeLessonPage007 from './pages/knowledge/business-foundations/why-trust-comes-before-marketing';
import NativeLessonPage008 from './pages/knowledge/business-foundations/what-building-my-own-digital-growth-office-taught-me';
import NativeLessonPage009 from './pages/knowledge/business-foundations/the-right-decision-should-make-sense';
import NativeLessonPage010 from './pages/knowledge/what-a-lifetime-in-business-taught-me/i-learned-business-by-watching-people';
import NativeLessonPage011 from './pages/knowledge/what-a-lifetime-in-business-taught-me/i-tried-a-lot-of-businesses';
import NativeLessonPage012 from './pages/knowledge/what-a-lifetime-in-business-taught-me/the-gold-is-in-the-niche-the-business-is-in-the-connections';
import NativeLessonPage013 from './pages/knowledge/what-a-lifetime-in-business-taught-me/free-is-free';
import NativeLessonPage014 from './pages/knowledge/what-a-lifetime-in-business-taught-me/ai-didnt-give-me-my-experience';
import NativeLessonPage015 from './pages/knowledge/what-a-lifetime-in-business-taught-me/i-was-afraid-ai-would-take-my-voice-it-helped-me-find-it';
import NativeLessonPage016 from './pages/knowledge/truth-about-business-growth/businesses-dont-need-more-marketing-they-need-a-better-growth-system';
import NativeLessonPage017 from './pages/knowledge/truth-about-business-growth/marketing-doesnt-create-great-businesses';
import NativeLessonPage018 from './pages/knowledge/truth-about-business-growth/every-business-is-already-perfectly-designed';
import NativeLessonPage019 from './pages/knowledge/truth-about-business-growth/the-difference-between-activity-and-progress';
import NativeLessonPage020 from './pages/knowledge/truth-about-business-growth/why-growth-is-a-system';
import NativeLessonPage021 from './pages/knowledge/truth-about-business-growth/what-business-owners-really-buy';
import NativeLessonPage022 from './pages/knowledge/truth-about-business-growth/why-understanding-comes-before-advertising';
import NativeLessonPage023 from './pages/knowledge/how-customers-decide-who-to-trust/trust-begins-before-the-first-conversation';
import NativeLessonPage024 from './pages/knowledge/how-customers-decide-who-to-trust/people-trust-what-they-can-understand';
import NativeLessonPage025 from './pages/knowledge/how-customers-decide-who-to-trust/customers-trust-evidence-more-than-claims';
import NativeLessonPage026 from './pages/knowledge/how-customers-decide-who-to-trust/trust-is-built-through-kept-promises';
import NativeLessonPage027 from './pages/knowledge/how-customers-decide-who-to-trust/people-remember-how-a-business-made-them-feel';
import NativeLessonPage028 from './pages/knowledge/how-customers-decide-who-to-trust/trust-means-putting-the-relationship-before-the-transaction';
import NativeLessonPage029 from './pages/knowledge/how-businesses-turn-trust-into-lasting-relationships/the-sale-is-the-beginning-not-the-end';
import NativeLessonPage030 from './pages/knowledge/how-businesses-turn-trust-into-lasting-relationships/staying-connected-without-always-selling';
import NativeLessonPage031 from './pages/knowledge/how-businesses-turn-trust-into-lasting-relationships/a-business-should-remember-its-customers';
import NativeLessonPage032 from './pages/knowledge/how-businesses-turn-trust-into-lasting-relationships/every-customer-relationship-should-teach-the-business-something';
import NativeLessonPage033 from './pages/knowledge/how-businesses-turn-trust-into-lasting-relationships/customer-feedback-should-change-the-business';
import NativeLessonPage034 from './pages/knowledge/how-businesses-turn-trust-into-lasting-relationships/customers-become-loyal-when-they-help-shape-the-business';
import NativeLessonPage035 from './pages/knowledge/how-businesses-turn-trust-into-lasting-relationships/the-strongest-growth-comes-from-relationships-that-create-more-relationships';
import NativeLessonPage036 from './pages/knowledge/turning-what-a-business-knows-into-an-asset/your-business-knows-more-than-it-has-documented';
import NativeLessonPage037 from './pages/knowledge/turning-what-a-business-knows-into-an-asset/the-most-valuable-knowledge-usually-lives-in-the-owners-head';
import NativeLessonPage038 from './pages/knowledge/turning-what-a-business-knows-into-an-asset/customer-questions-reveal-what-the-business-should-teach';
import NativeLessonPage039 from './pages/knowledge/turning-what-a-business-knows-into-an-asset/stories-turn-experience-into-understanding';
import NativeLessonPage040 from './pages/knowledge/turning-what-a-business-knows-into-an-asset/documenting-a-process-makes-knowledge-repeatable';
import NativeLessonPage041 from './pages/knowledge/turning-what-a-business-knows-into-an-asset/ai-becomes-more-valuable-when-it-learns-from-the-business';
import NativeLessonPage042 from './pages/knowledge/turning-what-a-business-knows-into-an-asset/knowledge-becomes-an-asset-when-it-can-keep-working-without-you';
import NativeLessonPage043 from './pages/knowledge/ai-foundations/ai-isnt-magic-either';
import NativeLessonPage044 from './pages/knowledge/ai-foundations/ai-needs-context-before-it-can-be-helpful';
import NativeLessonPage045 from './pages/knowledge/ai-foundations/ai-can-assist-judgment-it-cannot-own-it';
import NativeLessonPage046 from './pages/knowledge/ai-foundations/a-prompt-is-the-beginning-of-a-conversation';
import NativeLessonPage047 from './pages/knowledge/ai-foundations/automation-comes-after-understanding';
import NativeLessonPage048 from './pages/knowledge/ai-foundations/building-your-first-ai-teammate';
import NativeLessonPage049 from './pages/knowledge/ai-foundations/when-ai-tells-you-youre-different';
import NativeLessonPage050 from './pages/knowledge/ai-foundations/the-team-i-spent-my-life-trying-to-build';
import NativeLessonPage051 from './pages/knowledge/ai-foundations/ai-makes-complicated-work-easier';
import NativeLessonPage052 from './pages/knowledge/ai-foundations/i-see-artificial-intelligence-differently';
import NativeLessonPage053 from './pages/knowledge/ai-foundations/ai-does-not-have-to-be-a-monster';
import NativeLessonPage054 from './pages/knowledge/ai-foundations/you-can-do-what-i-do-but-you-dont-have-to';
import NativeLessonPage055 from './pages/knowledge/ai-foundations/use-the-model-that-gets-the-job-done';
import NativeLessonPage056 from './pages/knowledge/ai-foundations/ai-finally-taught-me-how-to-multitask';
import NativeLessonPage057 from './pages/knowledge/building-a-small-business-with-ai/the-problems-we-learn-to-live-with';
import NativeLessonPage058 from './pages/knowledge/building-a-small-business-with-ai/ai-gives-small-business-its-speed-back';
import NativeLessonPage059 from './pages/knowledge/building-a-small-business-with-ai/you-dont-have-to-become-an-ai-expert';
import NativeLessonPage060 from './pages/knowledge/what-is-digital-trust/what-is-digital-trust';
import NativeLessonPage061 from './pages/knowledge/what-is-digital-trust/your-website-is-no-longer-just-a-website';
import NativeLessonPage062 from './pages/knowledge/what-is-digital-trust/why-traditional-marketing-is-no-longer-enough';
import NativeLessonPage063 from './pages/knowledge/what-is-digital-trust/digital-assets-keep-working';
import NativeLessonPage064 from './pages/knowledge/what-is-digital-trust/ai-is-changing-how-customers-find-businesses';
import NativeLessonPage065 from './pages/knowledge/what-is-digital-trust/relationships-are-your-greatest-competitive-advantage';
import NativeLessonPage066 from './pages/knowledge/what-is-digital-trust/the-connected-business-is-the-future';
// END GENERATED NATIVE LESSON IMPORTS
import HowCanASmallBusinessUseAI from './pages/knowledge/questions/how-can-a-small-business-use-ai';
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
  'knowledge/ai-foundations/start-with-the-work-not-the-tool': StartWithTheWorkNotTheToolLessonPage,
  // Public canonical route pages for Base44 crawler rendering.
  'growth-system': PublicSeoPage001,
  'industries': PublicSeoPage002,
  'ai-marketing-platform': PublicSeoPage003,
  'streaming-tv-advertising': PublicSeoPage004,
  'ada-website-compliance': PublicSeoPage005,
  'ai-visibility-basics': PublicSeoPage006,
  'operating-system': PublicSeoPage007,
  'work-with-nta': PublicSeoPage008,
  'point-of-view': PublicSeoPage009,
  'canon': PublicSeoPage010,
  'books': PublicSeoPage011,
  'better-business-book': PublicSeoPage012,
  'practical-ai-for-small-business': PublicSeoPage013,
  'journal': PublicSeoPage014,
  'growth-guide': PublicSeoPage015,
  'growth-conversation': PublicSeoPage016,
  'community-partner': PublicSeoPage017,
  'community-growth-conversation': PublicSeoPage018,
  'account-manager': PublicSeoPage019,
  'ai-video-marketing': PublicSeoPage020,
  'back-office-solutions': PublicSeoPage021,
  'accessible-websites': PublicSeoPage022,
  'web-accessibility-trust': PublicSeoPage023,
  'digital-risks': PublicSeoPage024,
  'reputation-is-now-a-growth-engine': PublicSeoPage025,
  'growth-systems-vs-campaigns': PublicSeoPage026,
  'hvac-marketing-north-iowa': PublicSeoPage027,
  'small-businesses-nationwide': PublicSeoPage028,
  'knowledge/business-foundations': PublicSeoPage029,
  'knowledge/truth-about-business-growth': PublicSeoPage030,
  'knowledge/how-customers-decide-who-to-trust': PublicSeoPage031,
  'knowledge/how-businesses-turn-trust-into-lasting-relationships': PublicSeoPage032,
  'knowledge/turning-what-a-business-knows-into-an-asset': PublicSeoPage033,
  'knowledge/ai-foundations': PublicSeoPage034,
  'knowledge/what-is-digital-trust': PublicSeoPage035,
  'knowledge/ai-humanity': PublicSeoPage036,
  'knowledge/ai-humanity/ai-is-a-mirror-not-a-god': PublicSeoPage037,
  'knowledge/questions': PublicSeoPage038,
  'learning-center/videos': PublicSeoPage039,
  'knowledge/building-a-small-business-with-ai': PublicSeoPage040,
  'knowledge/what-a-lifetime-in-business-taught-me': PublicSeoPage041,
  'journal/issue-1-the-system-behind-the-work': PublicJournalIssue01,
  'journal/issue-2-what-i-learned-while-rebuilding-nta': PublicJournalIssue02,
  'journal/issue-3-what-i-learned-about-making-complicated-things-simple': PublicJournalIssue03,
  'journal/the-free-ai-guy-comes-to-life': PublicJournalIssue04,
  'journal/issue-5-build-with-the-budget-you-have': PublicJournalIssue05,
  'journal/issue-6-ai-finally-taught-me-how-to-multitask': PublicJournalIssue06,
  'journal/issue-7-are-you-building-a-business-or-just-a-website': PublicJournalIssue07,
  'journal/issue-8-your-business-already-knows-more-than-you-think': PublicJournalIssue08,
  'canon/collection/nta-principles': CanonNtaPrinciplesCollectionPage,
  'canon/the-work-you-dont-see-why-setup-matters': CanonSetupMattersPage,
  // BEGIN GENERATED NATIVE LESSON ROUTES
  'knowledge/business-foundations/why-nta-exists': NativeLessonPage001,
  'knowledge/business-foundations/how-businesses-really-grow': NativeLessonPage002,
  'knowledge/business-foundations/marketing-isnt-magic': NativeLessonPage003,
  'knowledge/business-foundations/every-system-produces-exactly-what-it-was-designed-to-produce': NativeLessonPage004,
  'knowledge/business-foundations/understanding-before-spending': NativeLessonPage005,
  'knowledge/business-foundations/ai-is-my-team-not-my-replacement': NativeLessonPage006,
  'knowledge/business-foundations/why-trust-comes-before-marketing': NativeLessonPage007,
  'knowledge/business-foundations/what-building-my-own-digital-growth-office-taught-me': NativeLessonPage008,
  'knowledge/business-foundations/the-right-decision-should-make-sense': NativeLessonPage009,
  'knowledge/what-a-lifetime-in-business-taught-me/i-learned-business-by-watching-people': NativeLessonPage010,
  'knowledge/what-a-lifetime-in-business-taught-me/i-tried-a-lot-of-businesses': NativeLessonPage011,
  'knowledge/what-a-lifetime-in-business-taught-me/the-gold-is-in-the-niche-the-business-is-in-the-connections': NativeLessonPage012,
  'knowledge/what-a-lifetime-in-business-taught-me/free-is-free': NativeLessonPage013,
  'knowledge/what-a-lifetime-in-business-taught-me/ai-didnt-give-me-my-experience': NativeLessonPage014,
  'knowledge/what-a-lifetime-in-business-taught-me/i-was-afraid-ai-would-take-my-voice-it-helped-me-find-it': NativeLessonPage015,
  'knowledge/truth-about-business-growth/businesses-dont-need-more-marketing-they-need-a-better-growth-system': NativeLessonPage016,
  'knowledge/truth-about-business-growth/marketing-doesnt-create-great-businesses': NativeLessonPage017,
  'knowledge/truth-about-business-growth/every-business-is-already-perfectly-designed': NativeLessonPage018,
  'knowledge/truth-about-business-growth/the-difference-between-activity-and-progress': NativeLessonPage019,
  'knowledge/truth-about-business-growth/why-growth-is-a-system': NativeLessonPage020,
  'knowledge/truth-about-business-growth/what-business-owners-really-buy': NativeLessonPage021,
  'knowledge/truth-about-business-growth/why-understanding-comes-before-advertising': NativeLessonPage022,
  'knowledge/how-customers-decide-who-to-trust/trust-begins-before-the-first-conversation': NativeLessonPage023,
  'knowledge/how-customers-decide-who-to-trust/people-trust-what-they-can-understand': NativeLessonPage024,
  'knowledge/how-customers-decide-who-to-trust/customers-trust-evidence-more-than-claims': NativeLessonPage025,
  'knowledge/how-customers-decide-who-to-trust/trust-is-built-through-kept-promises': NativeLessonPage026,
  'knowledge/how-customers-decide-who-to-trust/people-remember-how-a-business-made-them-feel': NativeLessonPage027,
  'knowledge/how-customers-decide-who-to-trust/trust-means-putting-the-relationship-before-the-transaction': NativeLessonPage028,
  'knowledge/how-businesses-turn-trust-into-lasting-relationships/the-sale-is-the-beginning-not-the-end': NativeLessonPage029,
  'knowledge/how-businesses-turn-trust-into-lasting-relationships/staying-connected-without-always-selling': NativeLessonPage030,
  'knowledge/how-businesses-turn-trust-into-lasting-relationships/a-business-should-remember-its-customers': NativeLessonPage031,
  'knowledge/how-businesses-turn-trust-into-lasting-relationships/every-customer-relationship-should-teach-the-business-something': NativeLessonPage032,
  'knowledge/how-businesses-turn-trust-into-lasting-relationships/customer-feedback-should-change-the-business': NativeLessonPage033,
  'knowledge/how-businesses-turn-trust-into-lasting-relationships/customers-become-loyal-when-they-help-shape-the-business': NativeLessonPage034,
  'knowledge/how-businesses-turn-trust-into-lasting-relationships/the-strongest-growth-comes-from-relationships-that-create-more-relationships': NativeLessonPage035,
  'knowledge/turning-what-a-business-knows-into-an-asset/your-business-knows-more-than-it-has-documented': NativeLessonPage036,
  'knowledge/turning-what-a-business-knows-into-an-asset/the-most-valuable-knowledge-usually-lives-in-the-owners-head': NativeLessonPage037,
  'knowledge/turning-what-a-business-knows-into-an-asset/customer-questions-reveal-what-the-business-should-teach': NativeLessonPage038,
  'knowledge/turning-what-a-business-knows-into-an-asset/stories-turn-experience-into-understanding': NativeLessonPage039,
  'knowledge/turning-what-a-business-knows-into-an-asset/documenting-a-process-makes-knowledge-repeatable': NativeLessonPage040,
  'knowledge/turning-what-a-business-knows-into-an-asset/ai-becomes-more-valuable-when-it-learns-from-the-business': NativeLessonPage041,
  'knowledge/turning-what-a-business-knows-into-an-asset/knowledge-becomes-an-asset-when-it-can-keep-working-without-you': NativeLessonPage042,
  'knowledge/ai-foundations/ai-isnt-magic-either': NativeLessonPage043,
  'knowledge/ai-foundations/ai-needs-context-before-it-can-be-helpful': NativeLessonPage044,
  'knowledge/ai-foundations/ai-can-assist-judgment-it-cannot-own-it': NativeLessonPage045,
  'knowledge/ai-foundations/a-prompt-is-the-beginning-of-a-conversation': NativeLessonPage046,
  'knowledge/ai-foundations/automation-comes-after-understanding': NativeLessonPage047,
  'knowledge/ai-foundations/building-your-first-ai-teammate': NativeLessonPage048,
  'knowledge/ai-foundations/when-ai-tells-you-youre-different': NativeLessonPage049,
  'knowledge/ai-foundations/the-team-i-spent-my-life-trying-to-build': NativeLessonPage050,
  'knowledge/ai-foundations/ai-makes-complicated-work-easier': NativeLessonPage051,
  'knowledge/ai-foundations/i-see-artificial-intelligence-differently': NativeLessonPage052,
  'knowledge/ai-foundations/ai-does-not-have-to-be-a-monster': NativeLessonPage053,
  'knowledge/ai-foundations/you-can-do-what-i-do-but-you-dont-have-to': NativeLessonPage054,
  'knowledge/ai-foundations/use-the-model-that-gets-the-job-done': NativeLessonPage055,
  'knowledge/ai-foundations/ai-finally-taught-me-how-to-multitask': NativeLessonPage056,
  'knowledge/building-a-small-business-with-ai/the-problems-we-learn-to-live-with': NativeLessonPage057,
  'knowledge/building-a-small-business-with-ai/ai-gives-small-business-its-speed-back': NativeLessonPage058,
  'knowledge/building-a-small-business-with-ai/you-dont-have-to-become-an-ai-expert': NativeLessonPage059,
  'knowledge/what-is-digital-trust/what-is-digital-trust': NativeLessonPage060,
  'knowledge/what-is-digital-trust/your-website-is-no-longer-just-a-website': NativeLessonPage061,
  'knowledge/what-is-digital-trust/why-traditional-marketing-is-no-longer-enough': NativeLessonPage062,
  'knowledge/what-is-digital-trust/digital-assets-keep-working': NativeLessonPage063,
  'knowledge/what-is-digital-trust/ai-is-changing-how-customers-find-businesses': NativeLessonPage064,
  'knowledge/what-is-digital-trust/relationships-are-your-greatest-competitive-advantage': NativeLessonPage065,
  'knowledge/what-is-digital-trust/the-connected-business-is-the-future': NativeLessonPage066,
  // END GENERATED NATIVE LESSON ROUTES
  'knowledge/questions/how-can-a-small-business-use-ai': HowCanASmallBusinessUseAI,
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

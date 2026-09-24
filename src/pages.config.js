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
import KnowledgeQuestions from './pages/KnowledgeQuestions';
import KnowledgeQuestion from './pages/KnowledgeQuestion';
import KnowledgeCollection from './pages/KnowledgeCollection';
import KnowledgeLesson from './pages/KnowledgeLesson';
import AIFoundationsCollection from './pages/AIFoundationsCollection';
import BusinessFoundationsCollection from './pages/BusinessFoundationsCollection';
import TruthAboutBusinessGrowthCollection from './pages/TruthAboutBusinessGrowthCollection';
import HowCustomersDecideWhoToTrustCollection from './pages/HowCustomersDecideWhoToTrustCollection';
import HowBusinessesTurnTrustIntoLastingRelationshipsCollection from './pages/HowBusinessesTurnTrustIntoLastingRelationshipsCollection';
import TurningWhatABusinessKnowsIntoAnAssetCollection from './pages/TurningWhatABusinessKnowsIntoAnAssetCollection';
import WhatIsDigitalTrustCollection from './pages/WhatIsDigitalTrustCollection';
import AIHumanityCollection from './pages/AIHumanityCollection';
import AIHumanityArticle from './pages/AIHumanityArticle';
import LCVideoLibrary from './legacy-page-components/LCVideoLibrary';
import CanonExplorer from './pages/CanonExplorer';
import Books from './pages/Books';
import BetterBusinessBook from './pages/BetterBusinessBook';
import POVCollection from './pages/POVCollection';
import NTAOperatingSystem from './pages/NTAOperatingSystem';
import WorkWithNTA from './pages/WorkWithNTA';
import GrowthGuide from './pages/GrowthGuide';
import NTAGrowthConversation from './pages/NTAGrowthConversation';
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
  // Register nested public paths here as well as in publicRoutes so Base44's
  // crawler renderer can identify them as actual pages instead of returning
  // the generic homepage shell for direct requests.
  'knowledge/questions': KnowledgeQuestions,
  // Each approved answer has a literal page entry so the crawler receives
  // that answer's text on a direct request. The dynamic route remains for
  // compatibility as new questions are drafted.
  'knowledge/questions/how-can-a-small-business-use-ai': KnowledgeQuestion,
  'knowledge/questions/where-should-i-start-with-ai': KnowledgeQuestion,
  'knowledge/questions/what-can-chatgpt-do-for-a-small-business': KnowledgeQuestion,
  'knowledge/questions/do-i-need-a-perfect-prompt': KnowledgeQuestion,
  'knowledge/questions/why-does-ai-give-bad-answers': KnowledgeQuestion,
  'knowledge/questions/what-ai-tools-does-a-small-business-really-need': KnowledgeQuestion,
  'knowledge/questions/how-can-employees-use-ai-at-work': KnowledgeQuestion,
  'knowledge/questions/how-much-should-a-small-business-spend-on-marketing': KnowledgeQuestion,
  'knowledge/questions/what-should-i-do-with-my-first-500-marketing-budget': KnowledgeQuestion,
  'knowledge/questions/why-does-marketing-require-ongoing-spending': KnowledgeQuestion,
  'knowledge/questions/how-do-i-know-whether-my-marketing-is-working': KnowledgeQuestion,
  'knowledge/questions/why-isnt-my-website-generating-leads': KnowledgeQuestion,
  'knowledge/questions/how-do-i-build-customer-trust': KnowledgeQuestion,
  'knowledge/questions/how-do-i-market-a-local-service-business': KnowledgeQuestion,
  'knowledge/questions/is-social-media-enough-for-a-small-business': KnowledgeQuestion,
  'knowledge/questions/should-a-small-business-still-advertise-on-tv': KnowledgeQuestion,
  'knowledge/questions/how-can-ai-use-knowledge-already-inside-my-company': KnowledgeQuestion,
  'knowledge/questions/how-can-ai-help-with-customer-follow-up': KnowledgeQuestion,
  'knowledge/questions/how-can-ai-help-market-my-small-business': KnowledgeQuestion,
  'knowledge/questions/how-can-ai-help-me-get-more-customers': KnowledgeQuestion,
  'knowledge/questions/how-can-ai-save-me-time-in-my-business': KnowledgeQuestion,
  'knowledge/questions/how-can-ai-help-with-social-media-for-my-business': KnowledgeQuestion,
  'knowledge/questions/how-can-ai-help-my-small-business-website': KnowledgeQuestion,
  'knowledge/questions/how-can-my-business-show-up-in-chatgpt-and-ai-search': KnowledgeQuestion,
  'knowledge/questions/what-should-i-automate-in-my-small-business': KnowledgeQuestion,
  'knowledge/questions/is-ai-safe-for-my-small-business-and-customer-data': KnowledgeQuestion,
  'knowledge/questions/is-ai-worth-it-for-a-small-business': KnowledgeQuestion,
  'knowledge/questions/:questionSlug': KnowledgeQuestion,
  // Literal collection and lesson pages keep the published Knowledge Library
  // visible in Base44's direct-request crawler renderer.
  'knowledge/business-foundations': BusinessFoundationsCollection,
  'knowledge/business-foundations/why-nta-exists': KnowledgeLesson,
  'knowledge/business-foundations/how-businesses-really-grow': KnowledgeLesson,
  'knowledge/business-foundations/marketing-isnt-magic': KnowledgeLesson,
  'knowledge/business-foundations/every-system-produces-exactly-what-it-was-designed-to-produce': KnowledgeLesson,
  'knowledge/business-foundations/understanding-before-spending': KnowledgeLesson,
  'knowledge/business-foundations/ai-is-my-team-not-my-replacement': KnowledgeLesson,
  'knowledge/business-foundations/why-trust-comes-before-marketing': KnowledgeLesson,
  'knowledge/business-foundations/what-building-my-own-digital-growth-office-taught-me': KnowledgeLesson,
  'knowledge/truth-about-business-growth': TruthAboutBusinessGrowthCollection,
  'knowledge/truth-about-business-growth/businesses-dont-need-more-marketing-they-need-a-better-growth-system': KnowledgeLesson,
  'knowledge/truth-about-business-growth/marketing-doesnt-create-great-businesses': KnowledgeLesson,
  'knowledge/truth-about-business-growth/every-business-is-already-perfectly-designed': KnowledgeLesson,
  'knowledge/truth-about-business-growth/the-difference-between-activity-and-progress': KnowledgeLesson,
  'knowledge/truth-about-business-growth/why-growth-is-a-system': KnowledgeLesson,
  'knowledge/truth-about-business-growth/what-business-owners-really-buy': KnowledgeLesson,
  'knowledge/truth-about-business-growth/why-understanding-comes-before-advertising': KnowledgeLesson,
  'knowledge/how-customers-decide-who-to-trust': HowCustomersDecideWhoToTrustCollection,
  'knowledge/how-customers-decide-who-to-trust/trust-begins-before-the-first-conversation': KnowledgeLesson,
  'knowledge/how-customers-decide-who-to-trust/people-trust-what-they-can-understand': KnowledgeLesson,
  'knowledge/how-customers-decide-who-to-trust/customers-trust-evidence-more-than-claims': KnowledgeLesson,
  'knowledge/how-customers-decide-who-to-trust/trust-is-built-through-kept-promises': KnowledgeLesson,
  'knowledge/how-customers-decide-who-to-trust/people-remember-how-a-business-made-them-feel': KnowledgeLesson,
  'knowledge/how-customers-decide-who-to-trust/trust-means-putting-the-relationship-before-the-transaction': KnowledgeLesson,
  'knowledge/how-businesses-turn-trust-into-lasting-relationships': HowBusinessesTurnTrustIntoLastingRelationshipsCollection,
  'knowledge/how-businesses-turn-trust-into-lasting-relationships/the-sale-is-the-beginning-not-the-end': KnowledgeLesson,
  'knowledge/how-businesses-turn-trust-into-lasting-relationships/staying-connected-without-always-selling': KnowledgeLesson,
  'knowledge/how-businesses-turn-trust-into-lasting-relationships/a-business-should-remember-its-customers': KnowledgeLesson,
  'knowledge/how-businesses-turn-trust-into-lasting-relationships/every-customer-relationship-should-teach-the-business-something': KnowledgeLesson,
  'knowledge/how-businesses-turn-trust-into-lasting-relationships/customer-feedback-should-change-the-business': KnowledgeLesson,
  'knowledge/how-businesses-turn-trust-into-lasting-relationships/customers-become-loyal-when-they-help-shape-the-business': KnowledgeLesson,
  'knowledge/how-businesses-turn-trust-into-lasting-relationships/the-strongest-growth-comes-from-relationships-that-create-more-relationships': KnowledgeLesson,
  'knowledge/turning-what-a-business-knows-into-an-asset': TurningWhatABusinessKnowsIntoAnAssetCollection,
  'knowledge/turning-what-a-business-knows-into-an-asset/your-business-knows-more-than-it-has-documented': KnowledgeLesson,
  'knowledge/turning-what-a-business-knows-into-an-asset/the-most-valuable-knowledge-usually-lives-in-the-owners-head': KnowledgeLesson,
  'knowledge/turning-what-a-business-knows-into-an-asset/customer-questions-reveal-what-the-business-should-teach': KnowledgeLesson,
  'knowledge/turning-what-a-business-knows-into-an-asset/stories-turn-experience-into-understanding': KnowledgeLesson,
  'knowledge/turning-what-a-business-knows-into-an-asset/documenting-a-process-makes-knowledge-repeatable': KnowledgeLesson,
  'knowledge/turning-what-a-business-knows-into-an-asset/ai-becomes-more-valuable-when-it-learns-from-the-business': KnowledgeLesson,
  'knowledge/turning-what-a-business-knows-into-an-asset/knowledge-becomes-an-asset-when-it-can-keep-working-without-you': KnowledgeLesson,
  'knowledge/ai-foundations': AIFoundationsCollection,
  'knowledge/ai-foundations/ai-isnt-magic-either': KnowledgeLesson,
  'knowledge/ai-foundations/start-with-the-work-not-the-tool': KnowledgeLesson,
  'knowledge/ai-foundations/ai-needs-context-before-it-can-be-helpful': KnowledgeLesson,
  'knowledge/ai-foundations/ai-can-assist-judgment-it-cannot-own-it': KnowledgeLesson,
  'knowledge/ai-foundations/a-prompt-is-the-beginning-of-a-conversation': KnowledgeLesson,
  'knowledge/ai-foundations/automation-comes-after-understanding': KnowledgeLesson,
  'knowledge/ai-foundations/building-your-first-ai-teammate': KnowledgeLesson,
  'knowledge/ai-foundations/when-ai-tells-you-youre-different': KnowledgeLesson,
  'knowledge/ai-foundations/the-team-i-spent-my-life-trying-to-build': KnowledgeLesson,
  'knowledge/ai-foundations/ai-makes-complicated-work-easier': KnowledgeLesson,
  'knowledge/ai-foundations/i-see-artificial-intelligence-differently': KnowledgeLesson,
  'knowledge/ai-foundations/ai-does-not-have-to-be-a-monster': KnowledgeLesson,
  'knowledge/ai-foundations/you-can-do-what-i-do-but-you-dont-have-to': KnowledgeLesson,
  'knowledge/ai-foundations/use-the-model-that-gets-the-job-done': KnowledgeLesson,
  'knowledge/what-is-digital-trust': WhatIsDigitalTrustCollection,
  'knowledge/what-is-digital-trust/what-is-digital-trust': KnowledgeLesson,
  'knowledge/what-is-digital-trust/your-website-is-no-longer-just-a-website': KnowledgeLesson,
  'knowledge/what-is-digital-trust/why-traditional-marketing-is-no-longer-enough': KnowledgeLesson,
  'knowledge/what-is-digital-trust/digital-assets-keep-working': KnowledgeLesson,
  'knowledge/what-is-digital-trust/ai-is-changing-how-customers-find-businesses': KnowledgeLesson,
  'knowledge/what-is-digital-trust/relationships-are-your-greatest-competitive-advantage': KnowledgeLesson,
  'knowledge/what-is-digital-trust/the-connected-business-is-the-future': KnowledgeLesson,
  'knowledge/business-foundations/the-right-decision-should-make-sense': KnowledgeLesson,
  'knowledge/ai-humanity': AIHumanityCollection,
  'knowledge/ai-humanity/ai-is-a-mirror-not-a-god': AIHumanityArticle,
  'knowledge/building-a-small-business-with-ai': KnowledgeCollection,
  'knowledge/building-a-small-business-with-ai/the-problems-we-learn-to-live-with': KnowledgeLesson,
  'knowledge/building-a-small-business-with-ai/ai-gives-small-business-its-speed-back': KnowledgeLesson,
  'knowledge/building-a-small-business-with-ai/you-dont-have-to-become-an-ai-expert': KnowledgeLesson,
  'knowledge/ai-foundations/ai-finally-taught-me-how-to-multitask': KnowledgeLesson,
  'knowledge/what-a-lifetime-in-business-taught-me': KnowledgeCollection,
  'knowledge/what-a-lifetime-in-business-taught-me/i-learned-business-by-watching-people': KnowledgeLesson,
  'knowledge/what-a-lifetime-in-business-taught-me/i-tried-a-lot-of-businesses': KnowledgeLesson,
  'knowledge/what-a-lifetime-in-business-taught-me/the-gold-is-in-the-niche-the-business-is-in-the-connections': KnowledgeLesson,
  'knowledge/what-a-lifetime-in-business-taught-me/free-is-free': KnowledgeLesson,
  'knowledge/what-a-lifetime-in-business-taught-me/ai-didnt-give-me-my-experience': KnowledgeLesson,
  'knowledge/what-a-lifetime-in-business-taught-me/i-was-afraid-ai-would-take-my-voice-it-helped-me-find-it': KnowledgeLesson,
  'knowledge/:collectionSlug/:lessonSlug': KnowledgeLesson,
  'knowledge/:collectionSlug': KnowledgeCollection,
  'learning-center/videos': LCVideoLibrary,
  journal: JournalLanding,
  'point-of-view': POVCollection,
  canon: CanonExplorer,
  books: Books,
  'better-business-book': BetterBusinessBook,
  'operating-system': NTAOperatingSystem,
  'work-with-nta': WorkWithNTA,
  'growth-guide': GrowthGuide,
  'growth-conversation': NTAGrowthConversation,
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

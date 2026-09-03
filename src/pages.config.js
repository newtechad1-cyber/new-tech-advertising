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

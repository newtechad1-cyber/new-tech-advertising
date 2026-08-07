/**
 * Canonical public URL aliases.
 *
 * The public site has historically accumulated page components with Base44
 * page-key names (for example, NTAOperatingSystem) while marketing links use
 * human-readable URLs (for example, /operating-system). Keep those concerns
 * separate: this file is the explicit public bridge between them.
 *
 * Do not add Admin Hub, agency, client, CRM, operations, or other protected
 * routes here. Those remain behind the private app boundary.
 */
import About from '@/pages/About';
import AIFoundationsCollection from '@/pages/AIFoundationsCollection';
import AIHumanityArticle from '@/pages/AIHumanityArticle';
import AIHumanityCollection from '@/pages/AIHumanityCollection';
import AIPolicy from '@/pages/AIPolicy';
import AIVideoMarketing from '@/pages/AIVideoMarketing';
import AccessibleWebsites from '@/pages/AccessibleWebsites';
import BackOfficeSolutions from '@/pages/BackOfficeSolutions';
import BetterBusinessBook from '@/pages/BetterBusinessBook';
import Blog from '@/pages/Blog';
import Books from '@/pages/Books';
import BookCall from '@/pages/BookCall';
import BusinessFoundationsCollection from '@/pages/BusinessFoundationsCollection';
import BusinessJourney from '@/pages/BusinessJourney';
import CampaignsVsAuthority from '@/pages/CampaignsVsAuthority';
import CaseStudies from '@/pages/CaseStudies';
import CaseStudyDetail from '@/pages/CaseStudyDetail';
import CaseStudyJohnsonHeating from '@/pages/CaseStudyJohnsonHeating';
import CaseStudyMonsonPlumbing from '@/pages/CaseStudyMonsonPlumbing';
import CaseStudyPapaEveretts from '@/pages/CaseStudyPapaEveretts';
import ChannelHelpCenter from '@/pages/ChannelHelpCenter';
import CommunityGrowthAdvisor from '@/pages/CommunityGrowthAdvisor';
import CommunityGrowthConversation from '@/pages/CommunityGrowthConversation';
import CommunityIntelligence from '@/pages/CommunityIntelligence';
import CommunityPartnerProgram from '@/pages/CommunityPartnerProgram';
import Contact from '@/pages/Contact';
import ContractorMarketingNorthIowa from '@/pages/ContractorMarketingNorthIowa';
import DigitalRisks from '@/pages/DigitalRisks';
import FreeAudit from '@/pages/Free-Audit';
import GettingStarted from '@/pages/GettingStarted';
import GrowthGuide from '@/pages/GrowthGuide';
import GrowthShow from '@/pages/GrowthShow';
import GrowthShowEpisode from '@/pages/GrowthShowEpisode';
import GrowthSystemsVsCampaigns from '@/pages/GrowthSystemsVsCampaigns';
import HelpAndSupport from '@/pages/HelpAndSupport';
import HVACMarketingNorthIowa from '@/pages/HVACMarketingNorthIowa';
import HowBusinessesTurnTrustIntoLastingRelationshipsCollection from '@/pages/HowBusinessesTurnTrustIntoLastingRelationshipsCollection';
import HowCustomersDecideWhoToTrustCollection from '@/pages/HowCustomersDecideWhoToTrustCollection';
import IWasEarlyAgain from '@/pages/IWasEarlyAgain';
import JoinNTA from '@/pages/JoinNTA';
import JournalIssueView from '@/pages/JournalIssueView';
import JournalLanding from '@/pages/JournalLanding';
import KnowledgeCollection from '@/pages/KnowledgeCollection';
import KnowledgeLesson from '@/pages/KnowledgeLesson';
import KnowledgeLibrary from '@/pages/KnowledgeLibrary';
import KnowledgePrompts from '@/pages/KnowledgePrompts';
import LearningCenter from '@/pages/LearningCenter';
import LocalLeadSystems from '@/pages/LocalLeadSystems';
import NTAOperatingSystem from '@/pages/NTAOperatingSystem';
import NTABrandBook from '@/pages/NTABrandBook';
import NTABusinessScore from '@/pages/NTABusinessScore';
import NTAPlaybook from '@/pages/NTAPlaybook';
import NTARelationshipBuilder from '@/pages/NTARelationshipBuilder';
import NTAGrowthConversation from '@/pages/NTAGrowthConversation';
import NTAGrowthRoadmapGenerator from '@/pages/NTAGrowthRoadmapGenerator';
import NtaJournal from '@/pages/NtaJournal';
import OurStory from '@/pages/OurStory';
import OurWork from '@/pages/OurWork';
import POVArticleView from '@/pages/POVArticleView';
import POVCollection from '@/pages/POVCollection';
import PracticalAI from '@/pages/PracticalAI';
import Pricing from '@/pages/Pricing';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import RestaurantDemo from '@/pages/RestaurantDemo';
import RestaurantDemoBar from '@/pages/RestaurantDemoBar';
import RestaurantDemoMexican from '@/pages/RestaurantDemoMexican';
import RestaurantDemoPizza from '@/pages/RestaurantDemoPizza';
import RestaurantSolutions from '@/pages/RestaurantSolutions';
import ReputationIsNowAGrowthEngine from '@/pages/ReputationIsNowAGrowthEngine';
import RebuildIntake from '@/pages/RebuildIntake';
import SalesConversations from '@/pages/SalesConversations';
import SeasonalCampaigns from '@/pages/SeasonalCampaigns';
import SEOPageForLocalBusinesses from '@/pages/SEOPagesForLocalBusinesses';
import SocialMediaContentSystem from '@/pages/SocialMediaContentSystem';
import SocialMediaManagement from '@/pages/SocialMediaManagement';
import SocialMediaMasonCity from '@/pages/SocialMediaMasonCity';
import SocialMediaRochesterMN from '@/pages/SocialMediaRochesterMN';
import SocialMediaAustinMN from '@/pages/SocialMediaAustinMN';
import SocialMediaAlbertLeaMN from '@/pages/SocialMediaAlbertLeaMN';
import SmallBusinessMarketingNorthIowa from '@/pages/SmallBusinessMarketingNorthIowa';
import TermsOfService from '@/pages/TermsOfService';
import TheFutureBelongsToMarketLeaders from '@/pages/TheFutureBelongsToMarketLeaders';
import TheHiddenCostOfOutdatedMarketing from '@/pages/TheHiddenCostOfOutdatedMarketing';
import TheRoleOfAIInLocalMarketing from '@/pages/TheRoleOfAIInLocalMarketing';
import TruthAboutBusinessGrowthCollection from '@/pages/TruthAboutBusinessGrowthCollection';
import TurningWhatABusinessKnowsIntoAnAssetCollection from '@/pages/TurningWhatABusinessKnowsIntoAnAssetCollection';
import VideoStorytellingBuildsConfidence from '@/pages/VideoStorytellingBuildsConfidence';
import WebAccessibilityTrust from '@/pages/WebAccessibilityTrust';
import WebsitesAsSalespeople from '@/pages/WebsitesAsSalespeople';
import WebsiteRebuildService from '@/pages/WebsiteRebuildService';
import WebsiteRebuildsAlbertLeaMN from '@/pages/WebsiteRebuildsAlbertLeaMN';
import WebsiteRebuildsAustinMN from '@/pages/WebsiteRebuildsAustinMN';
import WebsiteRebuildsMasonCity from '@/pages/WebsiteRebuildsMasonCity';
import WebsiteRebuildsRochesterMN from '@/pages/WebsiteRebuildsRochesterMN';
import WhyNTA from '@/pages/WhyNTA';
import WhatIsDigitalTrustCollection from '@/pages/WhatIsDigitalTrustCollection';
import AiVisibilityBasics from '@/pages/AIVisibilityBasics';

const alias = (path, Page) => ({ path, Page });

export const PUBLIC_ROUTE_ALIASES = [
  // Main navigation and footer destinations
  alias('/about', About),
  alias('/contact', Contact),
  alias('/help-and-support', HelpAndSupport),
  alias('/operating-system', NTAOperatingSystem),
  alias('/point-of-view', POVCollection),
  alias('/point-of-view/:slug', POVArticleView),
  alias('/knowledge', KnowledgeLibrary),
  alias('/knowledge/ai-foundations', AIFoundationsCollection),
  alias('/knowledge/business-foundations', BusinessFoundationsCollection),
  alias('/knowledge/truth-about-business-growth', TruthAboutBusinessGrowthCollection),
  alias('/knowledge/how-customers-decide-who-to-trust', HowCustomersDecideWhoToTrustCollection),
  alias('/knowledge/how-businesses-turn-trust-into-lasting-relationships', HowBusinessesTurnTrustIntoLastingRelationshipsCollection),
  alias('/knowledge/turning-what-a-business-knows-into-an-asset', TurningWhatABusinessKnowsIntoAnAssetCollection),
  alias('/knowledge/what-is-digital-trust', WhatIsDigitalTrustCollection),
  alias('/knowledge/ai-humanity', AIHumanityCollection),
  alias('/knowledge/ai-humanity/:slug', AIHumanityArticle),
  alias('/knowledge/prompts', KnowledgePrompts),
  alias('/knowledge/sales-conversations', SalesConversations),
  alias('/knowledge/playbook', NTAPlaybook),
  alias('/knowledge/:collectionSlug/:lessonSlug', KnowledgeLesson),
  alias('/knowledge/:collectionSlug', KnowledgeCollection),
  alias('/books', Books),
  alias('/better-business-book', BetterBusinessBook),
  alias('/practical-ai', PracticalAI),
  alias('/practical-ai-for-small-business', PracticalAI),
  alias('/practical-ai-for-small-businesses', PracticalAI),
  alias('/growth-show', GrowthShow),
  alias('/growth-show/:slug', GrowthShowEpisode),
  alias('/journal', JournalLanding),
  alias('/journal/subscribe', NtaJournal),
  alias('/journal/:slug', JournalIssueView),
  alias('/learning-center', LearningCenter),
  alias('/why-nta', WhyNTA),
  alias('/i-was-early-again', IWasEarlyAgain),
  alias('/brand-book', NTABrandBook),
  alias('/community-partner', CommunityPartnerProgram),
  alias('/community-growth-conversation', CommunityGrowthConversation),
  alias('/community-growth-advisor', CommunityGrowthAdvisor),
  alias('/community-intelligence', CommunityIntelligence),
  alias('/our-story', OurStory),
  alias('/our-work', OurWork),
  alias('/ai-policy', AIPolicy),
  alias('/aipolicy', AIPolicy),
  alias('/privacy-policy', PrivacyPolicy),
  alias('/terms-of-service', TermsOfService),
  alias('/book-call', BookCall),
  alias('/channel-help', ChannelHelpCenter),
  alias('/getting-started', GettingStarted),
  alias('/find-your-plan', Pricing),
  alias('/pricing', Pricing),
  alias('/gap-audit', FreeAudit),
  alias('/free-audit', FreeAudit),
  alias('/join-nta', JoinNTA),
  alias('/rebuild-intake', RebuildIntake),

  // Public solution and service destinations
  alias('/local-lead-systems', LocalLeadSystems),
  alias('/services/website-rebuilds', WebsiteRebuildService),
  alias('/website-rebuilds', WebsiteRebuildService),
  alias('/services/social-media-management', SocialMediaManagement),
  alias('/social-media-content-system', SocialMediaContentSystem),
  alias('/ai-video-marketing', AIVideoMarketing),
  alias('/back-office', BackOfficeSolutions),
  alias('/back-office-solutions', BackOfficeSolutions),
  alias('/restaurants', RestaurantSolutions),
  alias('/restaurant-demo', RestaurantDemo),
  alias('/restaurant-demo/pizza', RestaurantDemoPizza),
  alias('/restaurant-demo/mexican', RestaurantDemoMexican),
  alias('/restaurant-demo/bar', RestaurantDemoBar),
  alias('/seo-pages-for-local-businesses', SEOPageForLocalBusinesses),
  alias('/seasonal-campaigns', SeasonalCampaigns),
  alias('/hvac-marketing-north-iowa', HVACMarketingNorthIowa),
  alias('/contractor-marketing-north-iowa', ContractorMarketingNorthIowa),
  alias('/small-business-marketing-north-iowa', SmallBusinessMarketingNorthIowa),
  alias('/social-media/mason-city-ia', SocialMediaMasonCity),
  alias('/social-media/rochester-mn', SocialMediaRochesterMN),
  alias('/social-media/austin-mn', SocialMediaAustinMN),
  alias('/social-media/albert-lea-mn', SocialMediaAlbertLeaMN),
  alias('/website-rebuilds/mason-city-ia', WebsiteRebuildsMasonCity),
  alias('/website-rebuilds/rochester-mn', WebsiteRebuildsRochesterMN),
  alias('/website-rebuilds/austin-mn', WebsiteRebuildsAustinMN),
  alias('/website-rebuilds/albert-lea-mn', WebsiteRebuildsAlbertLeaMN),

  // Public learning and thought-leadership destinations already referenced
  alias('/ai-visibility-basics', AiVisibilityBasics),
  alias('/digital-risks', DigitalRisks),
  alias('/growth-systems-vs-campaigns', GrowthSystemsVsCampaigns),
  alias('/reputation-is-now-a-growth-engine', ReputationIsNowAGrowthEngine),
  alias('/hidden-cost-of-outdated-marketing', TheHiddenCostOfOutdatedMarketing),
  alias('/role-of-ai-in-local-marketing', TheRoleOfAIInLocalMarketing),
  alias('/video-storytelling-builds-confidence', VideoStorytellingBuildsConfidence),
  alias('/campaigns-vs-authority', CampaignsVsAuthority),
  alias('/the-future-belongs-to-market-leaders', TheFutureBelongsToMarketLeaders),
  alias('/accessible-websites', AccessibleWebsites),
  alias('/web-accessibility-trust', WebAccessibilityTrust),
  alias('/websites-as-salespeople', WebsitesAsSalespeople),
  alias('/growth-guide', GrowthGuide),
  alias('/growth-roadmap-generator', NTAGrowthRoadmapGenerator),
  alias('/growth-conversation', NTAGrowthConversation),
  alias('/business-score', NTABusinessScore),
  alias('/business-journey', BusinessJourney),
  alias('/relationship-builder', NTARelationshipBuilder),

  // Existing public case-study routes
  alias('/case-studies', CaseStudies),
  alias('/case-studies/johnson-heating', CaseStudyJohnsonHeating),
  alias('/case-studies/monson-plumbing', CaseStudyMonsonPlumbing),
  alias('/case-studies/papa-everetts', CaseStudyPapaEveretts),
  alias('/case-studies/:slug', CaseStudyDetail),
  alias('/case-study/johnson-heating', CaseStudyJohnsonHeating),
  alias('/case-study/monson-plumbing', CaseStudyMonsonPlumbing),
  alias('/case-study/papa-everetts', CaseStudyPapaEveretts),

  // Legacy / case-insensitive-friendly paths
  alias('/blog', Blog),
];

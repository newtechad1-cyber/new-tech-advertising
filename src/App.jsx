import React, { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { NTADataProvider } from '@/lib/NTADataContext';
import { ExperienceProvider } from '@/lib/ExperienceLayer';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { AdminGuard, ClientGuard } from '@/components/auth/RoleGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import NoIndexMeta from '@/components/auth/NoIndexMeta';
import { classifyAppRoute, classifyPageKey, requiresAuth, shouldNoIndex, userHasAccess } from '@/config/routeGovernance';
import { wrongHostRedirect } from '@/config/hostGovernance';
import Login from './pages/Login';
import SignupPage from './pages/SignupPage';
// — Eagerly loaded public pages (tiny, critical for first paint) —
import Home from './pages/Home';
// — Lazy loaded: everything else —
const FreshBooksInvoicing = lazy(() => import('./pages/FreshBooksInvoicing'));
const CaseStudyJohnsonHeating = lazy(() => import('./pages/CaseStudyJohnsonHeating'));
const CaseStudyMonsonPlumbing = lazy(() => import('./pages/CaseStudyMonsonPlumbing'));
const CaseStudyPapaEveretts = lazy(() => import('./pages/CaseStudyPapaEveretts'));
const LearningCenter = lazy(() => import('./pages/LearningCenter'));
const GrowthShow = lazy(() => import('./pages/GrowthShow'));
const GrowthShowEpisode = lazy(() => import('./pages/GrowthShowEpisode'));
// GapAuditPage removed
const AiBroughtMeOutOfRetirement = lazy(() => import('./pages/AiBroughtMeOutOfRetirement'));
const PracticalAI = lazy(() => import('./pages/PracticalAI'));
const BetterBusinessBook = lazy(() => import('./pages/BetterBusinessBook'));
const PublishingEngine = lazy(() => import('./pages/PublishingEngine'));
const PublishingArticleView = lazy(() => import('./pages/PublishingArticleView'));
const EditorialDashboard = lazy(() => import('./pages/EditorialDashboard'));
const NtaJournal = lazy(() => import('./pages/NtaJournal'));
const JournalLanding = lazy(() => import('./pages/JournalLanding'));
const JournalIssueView = lazy(() => import('./pages/JournalIssueView'));
const CanonExplorer = lazy(() => import('./pages/CanonExplorer'));
const CanonCollectionView = lazy(() => import('./pages/CanonCollectionView'));
const AdminCanonMigration = lazy(() => import('./pages/AdminCanonMigration'));
const AdminCanonicalManagement = lazy(() => import('./pages/AdminCanonicalManagement'));
const AdminJournalDashboard = lazy(() => import('./pages/AdminJournalDashboard'));
const IWasEarlyAgain = lazy(() => import('./pages/IWasEarlyAgain'));
const AIWorkforce = lazy(() => import('./pages/AIWorkforce'));
const FounderScorecard = lazy(() => import('./pages/FounderScorecard'));
const ClientCampaigns = lazy(() => import('./pages/ClientCampaigns'));
const AdminCampaigns = lazy(() => import('./pages/AdminCampaigns'));
const ClientReferrals = lazy(() => import('./pages/ClientReferrals'));
const ClientReferralStatus = lazy(() => import('./pages/ClientReferralStatus'));
const AdminReferrals = lazy(() => import('./pages/AdminReferrals'));
const ClientLocations = lazy(() => import('./pages/ClientLocations'));
const AdminEnterpriseAccounts = lazy(() => import('./pages/AdminEnterpriseAccounts'));
const AdminLocationPerformance = lazy(() => import('./pages/AdminLocationPerformance'));
const AdminVerticalIntelligence = lazy(() => import('./pages/AdminVerticalIntelligence'));
const AdminVerticalRevenue = lazy(() => import('./pages/AdminVerticalRevenue'));
const AdminVerticalCampaigns = lazy(() => import('./pages/AdminVerticalCampaigns'));
const AdminVerticalExpansion = lazy(() => import('./pages/AdminVerticalExpansion'));
const AdminExpansionPlaybook = lazy(() => import('./pages/AdminExpansionPlaybook'));
const AdminExpansionExecution = lazy(() => import('./pages/AdminExpansionExecution'));
const AdminExpansionTerritories = lazy(() => import('./pages/AdminExpansionTerritories'));
const AdminExpansionRevenue = lazy(() => import('./pages/AdminExpansionRevenue'));
const AdminFounderPlanner = lazy(() => import('./pages/AdminFounderPlanner'));
const AdminFounderPriorities = lazy(() => import('./pages/AdminFounderPriorities'));
const AdminFounderScorecardWeekly = lazy(() => import('./pages/AdminFounderScorecardWeekly'));
const AdminFounderScenarios = lazy(() => import('./pages/AdminFounderScenarios'));
const AdminClientSuccess = lazy(() => import('./pages/AdminClientSuccess'));
const AdminClientRetention = lazy(() => import('./pages/AdminClientRetention'));
const AdminClientExpansion = lazy(() => import('./pages/AdminClientExpansion'));
const AdminClientLTV = lazy(() => import('./pages/AdminClientLTV'));
const AdminOperations = lazy(() => import('./pages/AdminOperations'));
const AdminOperationsCapacity = lazy(() => import('./pages/AdminOperationsCapacity'));
const AdminOperationsSLA = lazy(() => import('./pages/AdminOperationsSLA'));
const AdminOperationsEfficiency = lazy(() => import('./pages/AdminOperationsEfficiency'));
const AdminControlTower = lazy(() => import('./pages/AdminControlTower'));
const AdminControlTowerInsights = lazy(() => import('./pages/AdminControlTowerInsights'));
const AdminControlTowerRisk = lazy(() => import('./pages/AdminControlTowerRisk'));
const AdminControlTowerActions = lazy(() => import('./pages/AdminControlTowerActions'));
const AdminROIExpansion = lazy(() => import('./pages/AdminROIExpansion'));
const AdminFunnelOptimization = lazy(() => import('./pages/AdminFunnelOptimization'));
const AdminFunnelPages = lazy(() => import('./pages/AdminFunnelPages'));
const AdminFunnelTests = lazy(() => import('./pages/AdminFunnelTests'));
const AdminFunnelOpportunities = lazy(() => import('./pages/AdminFunnelOpportunities'));
const AdminAIWorkforce = lazy(() => import('./pages/AdminAIWorkforce'));
const AdminAIOrchestration = lazy(() => import('./pages/AdminAIOrchestration'));
const AdminAIRouting = lazy(() => import('./pages/AdminAIRouting'));
const AdminAIGrowthLoops = lazy(() => import('./pages/AdminAIGrowthLoops'));
const AdminAutomationRules = lazy(() => import('./pages/AdminAutomationRules'));
const AdminAutomationConditions = lazy(() => import('./pages/AdminAutomationConditions'));
const AdminAutomationFlows = lazy(() => import('./pages/AdminAutomationFlows'));
const AdminAutomationPerformance = lazy(() => import('./pages/AdminAutomationPerformance'));
const AdminKnowledge = lazy(() => import('./pages/AdminKnowledge'));
const AdminKnowledgeWorkflows = lazy(() => import('./pages/AdminKnowledgeWorkflows'));
const AdminKnowledgeTraining = lazy(() => import('./pages/AdminKnowledgeTraining'));
const AdminKnowledgeIntelligence = lazy(() => import('./pages/AdminKnowledgeIntelligence'));
const AdminPricingIntelligence = lazy(() => import('./pages/AdminPricingIntelligence'));
const AdminPricingPackaging = lazy(() => import('./pages/AdminPricingPackaging'));
const AdminPricingExperiments = lazy(() => import('./pages/AdminPricingExperiments'));
const AdminPricingRecommendations = lazy(() => import('./pages/AdminPricingRecommendations'));
const AdminNavigationAudit = lazy(() => import('./pages/AdminNavigationAudit'));
const AdminChannels = lazy(() => import('./pages/AdminChannels'));
const ClientChannels = lazy(() => import('./pages/ClientChannels'));
const ClientResults = lazy(() => import('./pages/ClientResults'));
const ClientApprovals = lazy(() => import('./pages/ClientApprovals'));
const ClientCalendar = lazy(() => import('./pages/ClientCalendar'));
const AdminProductionStability = lazy(() => import('./pages/AdminProductionStability'));
const AdminPlatformQA = lazy(() => import('./pages/AdminPlatformQA'));
const ClientROI = lazy(() => import('./pages/ClientROI'));
const ClientROIReports = lazy(() => import('./pages/ClientROIReports'));
const ClientROITimeline = lazy(() => import('./pages/ClientROITimeline'));
const TrialWelcome = lazy(() => import('./pages/TrialWelcome'));
const TrialBusiness = lazy(() => import('./pages/TrialBusiness'));
const TrialChannels = lazy(() => import('./pages/TrialChannels'));
const TrialActivation = lazy(() => import('./pages/TrialActivation'));
const DemoFlow = lazy(() => import('./pages/DemoFlow'));
const DealRoom = lazy(() => import('./pages/DealRoom'));
const SalesCommandCenter = lazy(() => import('./pages/SalesCommandCenter'));
const AdminSalesCommand = lazy(() => import('./pages/AdminSalesCommand'));
const NTASalesPipeline = lazy(() => import('./pages/NTASalesPipeline'));
const NTADemoMachine = lazy(() => import('./pages/NTADemoMachine'));
const AdminProposalGenerator = lazy(() => import('./pages/AdminProposalGenerator'));
const NTADealRoom = lazy(() => import('./pages/NTADealRoom'));
const NTAOnboardingCenter = lazy(() => import('./pages/NTAOnboardingCenter'));
const NTAChannelHub = lazy(() => import('./pages/NTAChannelHub'));
const NTAResellerCommand = lazy(() => import('./pages/NTAResellerCommand'));
const NTAAIWorkforceOrchestrator = lazy(() => import('./pages/NTAAIWorkforceOrchestrator'));
const NTAHomepage = lazy(() => import('./pages/NTAHomepage'));
const NTASalesFollowUp = lazy(() => import('./pages/NTASalesFollowUp'));
const NTAPricingStack = lazy(() => import('./pages/NTAPricingStack'));
const ClientGrowthJourney = lazy(() => import('./pages/ClientGrowthJourney'));
const NTAOperatorCommand = lazy(() => import('./pages/NTAOperatorCommand'));
const NTAAcquisitionCommand = lazy(() => import('./pages/NTAAcquisitionCommand'));
const AutomationCommandCenter = lazy(() => import('./pages/AutomationCommandCenter'));
const AdminRetentionDashboard = lazy(() => import('./pages/AdminRetentionDashboard'));
const NTADemoFunnel = lazy(() => import('./pages/NTADemoFunnel'));
const AdminAIOperations = lazy(() => import('./pages/AdminAIOperations'));
const AdminDataGovernance = lazy(() => import('./pages/AdminDataGovernance'));
const AdminAccessGovernance = lazy(() => import('./pages/AdminAccessGovernance'));
const AdminTenantGovernance = lazy(() => import('./pages/AdminTenantGovernance'));
const ResellerDashboard = lazy(() => import('./pages/ResellerDashboard'));
const AdminPageRegistry = lazy(() => import('./pages/AdminPageRegistry'));
const AdminWorkflows = lazy(() => import('./pages/AdminWorkflows'));
const GettingStarted = lazy(() => import('./pages/GettingStarted'));
const AdminHotProspectsAlert = lazy(() => import('./pages/AdminHotProspectsAlert'));
const ChannelHelpCenter = lazy(() => import('./pages/ChannelHelpCenter'));
const BookCall = lazy(() => import('./pages/BookCall'));
const DIYGrowthSystemSales = lazy(() => import('./pages/DIYGrowthSystemSales'));
const DIYOnboarding = lazy(() => import('./pages/DIYOnboarding'));
const DIYDashboard = lazy(() => import('./pages/DIYDashboard'));
const DIYPricingLadder = lazy(() => import('./pages/DIYPricingLadder'));
const DIYBillingSettings = lazy(() => import('./pages/DIYBillingSettings'));
const DIYCheckoutSuccess = lazy(() => import('./pages/DIYCheckoutSuccess'));
const PricingWizard = lazy(() => import('./pages/PricingWizard'));
const NTAPricingLadderPage = lazy(() => import('./pages/NTAPricingLadderPage'));
const JoinNTA = lazy(() => import('./pages/JoinNTA'));
const Books = lazy(() => import('./pages/Books'));
const BusinessFoundationsCollection = lazy(() => import('./pages/BusinessFoundationsCollection'));
const BusinessFoundationsLesson = lazy(() => import('./pages/BusinessFoundationsLesson'));
const TruthAboutBusinessGrowthCollection = lazy(() => import('./pages/TruthAboutBusinessGrowthCollection'));
const HowCustomersDecideWhoToTrustCollection = lazy(() => import('./pages/HowCustomersDecideWhoToTrustCollection'));
const HowCustomersDecideWhoToTrustLesson = lazy(() => import('./pages/HowCustomersDecideWhoToTrustLesson'));
const TruthAboutBusinessGrowthLesson = lazy(() => import('./pages/TruthAboutBusinessGrowthLesson'));
const HowBusinessesTurnTrustIntoLastingRelationshipsCollection = lazy(() => import('./pages/HowBusinessesTurnTrustIntoLastingRelationshipsCollection'));
const HowBusinessesTurnTrustIntoLastingRelationshipsLesson = lazy(() => import('./pages/HowBusinessesTurnTrustIntoLastingRelationshipsLesson'));
const TurningWhatABusinessKnowsIntoAnAssetCollection = lazy(() => import('./pages/TurningWhatABusinessKnowsIntoAnAssetCollection'));
const TurningWhatABusinessKnowsIntoAnAssetLesson = lazy(() => import('./pages/TurningWhatABusinessKnowsIntoAnAssetLesson'));
const AIFoundationsCollection = lazy(() => import('./pages/AIFoundationsCollection'));
const AIFoundationsLesson = lazy(() => import('./pages/AIFoundationsLesson'));
const WhatIsDigitalTrustCollection = lazy(() => import('./pages/WhatIsDigitalTrustCollection'));
const WhatIsDigitalTrustLesson = lazy(() => import('./pages/WhatIsDigitalTrustLesson'));
const AIHumanityCollection = lazy(() => import('./pages/AIHumanityCollection'));
const AIHumanityArticle = lazy(() => import('./pages/AIHumanityArticle'));
const KnowledgeLibrary = lazy(() => import('./pages/KnowledgeLibrary'));
const KnowledgeCollection = lazy(() => import('./pages/KnowledgeCollection'));
const KnowledgeLesson = lazy(() => import('./pages/KnowledgeLesson'));
const FlagshipArticle = lazy(() => import('./pages/FlagshipArticle'));
const WebsiteRebuildService = lazy(() => import('./pages/WebsiteRebuildService'));
const WebsiteRebuildsMasonCity = lazy(() => import('./pages/WebsiteRebuildsMasonCity'));
const WebsiteRebuildsRochesterMN = lazy(() => import('./pages/WebsiteRebuildsRochesterMN'));
const WebsiteRebuildsAustinMN = lazy(() => import('./pages/WebsiteRebuildsAustinMN'));
const WebsiteRebuildsAlbertLeaMN = lazy(() => import('./pages/WebsiteRebuildsAlbertLeaMN'));
const NTABrandBook = lazy(() => import('./pages/NTABrandBook'));
const WhyNTA = lazy(() => import('./pages/WhyNTA'));
const KnowledgePrompts = lazy(() => import('./pages/KnowledgePrompts'));
const SalesConversations = lazy(() => import('./pages/SalesConversations'));
const NTAPlaybook = lazy(() => import('./pages/NTAPlaybook'));
const AdminRecruitingCandidates = lazy(() => import('./pages/AdminRecruitingCandidates'));
const AuditFurnitureMattressOutlet = lazy(() => import('./pages/AuditFurnitureMattressOutlet'));
const CommunityPartnerProgram = lazy(() => import('./pages/CommunityPartnerProgram'));
const AIPolicy = lazy(() => import('./pages/AIPolicy'));
const CRMDashboard = lazy(() => import('./pages/CRMDashboard'));
const CRMArchivedLeads = lazy(() => import('./pages/CRMArchivedLeads'));
const ContentCommandDashboard = lazy(() => import('./pages/ContentCommandDashboard'));
const ContentCommandCenter = lazy(() => import('./pages/ContentCommandCenter'));
const ClientManager = lazy(() => import('./pages/ClientManager'));
const ClientDetail = lazy(() => import('./pages/ClientDetail'));
const DemoFurnitureMattressOutlet = lazy(() => import('./pages/DemoFurnitureMattressOutlet'));
const AdminRecentAIActivity = lazy(() => import('./pages/AdminRecentAIActivity'));
const RebuildIntake = lazy(() => import('./pages/Rebuild-Intake'));
const SocialMediaManagement = lazy(() => import('./pages/SocialMediaManagement'));
const SocialMediaMasonCity = lazy(() => import('./pages/SocialMediaMasonCity'));
const SocialMediaRochesterMN = lazy(() => import('./pages/SocialMediaRochesterMN'));
const SocialMediaAustinMN = lazy(() => import('./pages/SocialMediaAustinMN'));
const SocialMediaAlbertLeaMN = lazy(() => import('./pages/SocialMediaAlbertLeaMN'));
const AgencyDashboard = lazy(() => import('./pages/AgencyDashboard'));
const AgencyGrowthDiscoveries = lazy(() => import('./pages/AgencyGrowthDiscoveries'));
const NTACommandDashboard = lazy(() => import('./pages/NTACommandDashboard'));
const AgencyClients = lazy(() => import('./pages/AgencyClients'));
const AgencyPipeline = lazy(() => import('./pages/AgencyPipeline'));
const AgencyContent = lazy(() => import('./pages/AgencyContent'));
const AgencyWebsites = lazy(() => import('./pages/AgencyWebsites'));
const AgencyLeads = lazy(() => import('./pages/AgencyLeads'));
const AgencyClientCMS = lazy(() => import('./pages/agency/AgencyClientCMS'));
const NTAContentDashboard = lazy(() => import('./pages/NTAContentDashboard'));
const HVACFunnel1 = lazy(() => import('./pages/HVACFunnel1'));
const HVACFunnel2 = lazy(() => import('./pages/HVACFunnel2'));
const HVACFunnel3 = lazy(() => import('./pages/HVACFunnel3'));
const HVACFunnel4 = lazy(() => import('./pages/HVACFunnel4'));
const HVACFunnel5 = lazy(() => import('./pages/HVACFunnel5'));
const HVACFunnelThankYou = lazy(() => import('./pages/HVACFunnelThankYou'));
const NTACommandCenter = lazy(() => import('./pages/NTACommandCenter'));
const NTASubmissions = lazy(() => import('./pages/NTASubmissions'));
const NTACompanies = lazy(() => import('./pages/NTACompanies'));
const NTACompanyDetail = lazy(() => import('./pages/NTACompanyDetail'));
const NTAOpportunities = lazy(() => import('./pages/NTAOpportunities'));
const NTAClients = lazy(() => import('./pages/NTAClients'));
const NTAProjects = lazy(() => import('./pages/NTAProjects'));
const NTACampaigns = lazy(() => import('./pages/NTACampaigns'));
const NTATasks = lazy(() => import('./pages/NTATasks'));
const NTAActivityLog = lazy(() => import('./pages/NTAActivityLog'));
const NTASystemHealth = lazy(() => import('./pages/NTASystemHealth'));
const NTAMigration = lazy(() => import('./pages/NTAMigration'));
const ContentWizardList = lazy(() => import('./pages/ContentWizardList'));
const ContentWizardDetail = lazy(() => import('./pages/ContentWizardDetail'));
const LeadWizardList = lazy(() => import('./pages/LeadWizardList'));
const LeadWizardDetail = lazy(() => import('./pages/LeadWizardDetail'));
const ChannelConnections = lazy(() => import('./pages/ChannelConnections'));
const ClientChannelSetup = lazy(() => import('./pages/ClientChannelSetup'));
const ClientChannelSetupPublic = lazy(() => import('./pages/ClientChannelSetupPublic'));
const PublishingQueuePage = lazy(() => import('./pages/PublishingQueue'));
const PublishingOps = lazy(() => import('./pages/PublishingOps'));
const AgencyCampaigns = lazy(() => import('./pages/AgencyCampaigns'));
const AgencyContentQueue = lazy(() => import('./pages/AgencyContentQueue'));
const AgencyApprovals = lazy(() => import('./pages/AgencyApprovals'));
const ClientApprovalSignoff = lazy(() => import('./pages/ClientApprovalSignoff'));
const AgencyPortalManager = lazy(() => import('./pages/AgencyPortalManager'));
const AgencyClientDetail = lazy(() => import('./pages/AgencyClientDetail'));
const ClientSetupWizard = lazy(() => import('./pages/ClientSetupWizard'));
const AgencySpokeCampaigns = lazy(() => import('./pages/AgencySpokeCampaigns'));
const SpokeCampaignDetail = lazy(() => import('./pages/SpokeCampaignDetail'));
const AgencyContentAssets = lazy(() => import('./pages/AgencyContentAssets'));
const ContentLibrary = lazy(() => import('./pages/ContentLibrary'));
const AgencyVideoQueue = lazy(() => import('./pages/AgencyVideoQueue'));
const AgencySocialQueue = lazy(() => import('./pages/AgencySocialQueue'));
const AgencyApprovalCenter = lazy(() => import('./pages/AgencyApprovalCenter'));
const AgencyPublishingCalendar = lazy(() => import('./pages/AgencyPublishingCalendar'));
const AgencyCampaignPerformance = lazy(() => import('./pages/AgencyCampaignPerformance'));
const AgencyInsightPages = lazy(() => import('./pages/AgencyInsightPages'));
const InsightsList = lazy(() => import('./pages/InsightsList'));
const InsightDetail = lazy(() => import('./pages/InsightDetail'));
const OurWork = lazy(() => import('./pages/OurWork'));
const RestaurantDemo = lazy(() => import('./pages/RestaurantDemo'));
const RestaurantDemoPizza = lazy(() => import('./pages/RestaurantDemoPizza'));
const RestaurantDemoMexican = lazy(() => import('./pages/RestaurantDemoMexican'));
const RestaurantDemoBar = lazy(() => import('./pages/RestaurantDemoBar'));
const PortalDashboard = lazy(() => import('./pages/portal/PortalDashboard'));
const PortalApprovals = lazy(() => import('./pages/portal/PortalApprovals'));
const PortalCalendar = lazy(() => import('./pages/portal/PortalCalendar'));
const PortalContent = lazy(() => import('./pages/portal/PortalContent'));
const PortalPerformance = lazy(() => import('./pages/portal/PortalPerformance'));
const PortalMessages = lazy(() => import('./pages/portal/PortalMessages'));
const PortalAccount = lazy(() => import('./pages/portal/PortalAccount'));
const LocalLeadSystems = lazy(() => import('./pages/LocalLeadSystems'));
const WebsiteRebuildsNTA = lazy(() => import('./pages/WebsiteRebuildsNTA'));
const SEOPagesForLocalBusinesses = lazy(() => import('./pages/SEOPagesForLocalBusinesses'));
const SeasonalCampaigns = lazy(() => import('./pages/SeasonalCampaigns'));
const SocialMediaContentSystem = lazy(() => import('./pages/SocialMediaContentSystem'));
const AIVideoMarketing = lazy(() => import('./pages/AIVideoMarketing'));
const HVACMarketingNorthIowa = lazy(() => import('./pages/HVACMarketingNorthIowa'));
const ContractorMarketingNorthIowa = lazy(() => import('./pages/ContractorMarketingNorthIowa'));
const SmallBusinessMarketingNorthIowa = lazy(() => import('./pages/SmallBusinessMarketingNorthIowa'));
const OpsDashboard = lazy(() => import('./pages/ops/OpsDashboard'));
const OpsCampaignDetail = lazy(() => import('./pages/ops/OpsCampaignDetail'));
const AgencyGapAudits = lazy(() => import('./pages/AgencyGapAudits'));
const AgencyGapAuditDetail = lazy(() => import('./pages/AgencyGapAuditDetail'));
// GapAuditPublic removed
const OpsProspects = lazy(() => import('./pages/ops/OpsProspects'));
const OpsClients = lazy(() => import('./pages/ops/OpsClients'));
const OpsAudits = lazy(() => import('./pages/ops/OpsAudits'));
const OpsCampaigns = lazy(() => import('./pages/ops/OpsCampaigns'));
const OpsSEOPages = lazy(() => import('./pages/ops/OpsSEOPages'));
const OpsContent = lazy(() => import('./pages/ops/OpsContent'));
const OpsVideos = lazy(() => import('./pages/ops/OpsVideos'));
const OpsSocial = lazy(() => import('./pages/ops/OpsSocial'));
const OpsApprovals = lazy(() => import('./pages/ops/OpsApprovals'));
const OpsLeads = lazy(() => import('./pages/ops/OpsLeads'));
const OpsOnboarding = lazy(() => import('./pages/ops/OpsOnboarding'));
const OpsAIMonitor = lazy(() => import('./pages/ops/OpsAIMonitor'));
const OpsAgreements = lazy(() => import('./pages/ops/OpsAgreements'));
const OpsDocuments = lazy(() => import('./pages/ops/OpsDocuments'));
const ClientPortalV2 = lazy(() => import('./pages/client-portal-v2/ClientPortal'));
const DocumentSigner = lazy(() => import('./pages/client-portal-v2/DocumentSigner'));
const OpsFollowUps = lazy(() => import('./pages/ops/OpsFollowUps'));
const OpsReports = lazy(() => import('./pages/ops/OpsReports'));
const LeadPipelineKanban = lazy(() => import('./pages/LeadPipelineKanban'));
const LeadDetailPage = lazy(() => import('./pages/LeadDetailPage'));
const CaseStudyDetail = lazy(() => import('./pages/CaseStudyDetail'));
const JohnsonHeatingCaseStudy = lazy(() => import('./pages/JohnsonHeatingCaseStudy'));
const AiGapScanner = lazy(() => import('./pages/AiGapScanner'));
const VideoEngineList = lazy(() => import('./pages/VideoEngineList'));
const VideoEngineDetail = lazy(() => import('./pages/VideoEngineDetail'));
const LCVideoLibrary = lazy(() => import('./pages/LCVideoLibrary'));
const LCVideoDetail = lazy(() => import('./pages/LCVideoDetail'));
const LCCategory = lazy(() => import('./pages/LCCategory'));
const WhatChangedOnline = lazy(() => import('./pages/WhatChangedOnline'));
const AIVisibilityBasics = lazy(() => import('./pages/AIVisibilityBasics'));
const PracticalAIForSmallBusinesses = lazy(() => import('./pages/PracticalAIForSmallBusinesses'));
const SEOVsAISearch = lazy(() => import('./pages/SEOVsAISearch'));
const GrowthSystemsVsCampaigns = lazy(() => import('./pages/GrowthSystemsVsCampaigns'));
const DigitalRisks = lazy(() => import('./pages/DigitalRisks'));
const ReputationIsNowAGrowthEngine = lazy(() => import('./pages/ReputationIsNowAGrowthEngine'));
const TheHiddenCostOfOutdatedMarketing = lazy(() => import('./pages/TheHiddenCostOfOutdatedMarketing'));
const TheRoleOfAIInLocalMarketing = lazy(() => import('./pages/TheRoleOfAIInLocalMarketing'));
const VideoStorytellingBuildsConfidence = lazy(() => import('./pages/VideoStorytellingBuildsConfidence'));
const CampaignsVsAuthority = lazy(() => import('./pages/CampaignsVsAuthority'));
const TheFutureBelongsToMarketLeaders = lazy(() => import('./pages/TheFutureBelongsToMarketLeaders'));
const BuildingDigitalTrust = lazy(() => import('./pages/BuildingDigitalTrust'));
const AccessibleWebsites = lazy(() => import('./pages/AccessibleWebsites'));
const WebAccessibilityTrust = lazy(() => import('./pages/WebAccessibilityTrust'));
const WebsitesAsSalespeople = lazy(() => import('./pages/WebsitesAsSalespeople'));
const BackOfficeSolutions = lazy(() => import('./pages/BackOfficeSolutions'));
const RestaurantSolutions = lazy(() => import('./pages/RestaurantSolutions'));
const NTAGrowthConversation = lazy(() => import('./pages/NTAGrowthConversation'));
const NTARelationshipBuilder = lazy(() => import('./pages/NTARelationshipBuilder.jsx'));
const CommunityGrowthConversation = lazy(() => import('./pages/CommunityGrowthConversation'));
const NTAOperatingSystem = lazy(() => import('./pages/NTAOperatingSystem.jsx'));
const GrowthGuide = lazy(() => import('./pages/GrowthGuide.jsx'));
const MyGrowthJourney = lazy(() => import('./pages/MyGrowthJourney.jsx'));
const NTABusinessScore = lazy(() => import('./pages/NTABusinessScore.jsx'));
const NTAGrowthRoadmapGenerator = lazy(() => import('./pages/NTAGrowthRoadmapGenerator.jsx'));
const DigitalGrowthOfficePreview = lazy(() => import('./pages/DigitalGrowthOfficePreview.jsx'));
const POVCollection = lazy(() => import('./pages/POVCollection.jsx'));
const POVArticleView = lazy(() => import('./pages/POVArticleView.jsx'));
const PartnerPortal = lazy(() => import('./pages/PartnerPortal.jsx'));
const CommunityIntelligence = lazy(() => import('./pages/CommunityIntelligence.jsx'));
const NTADataHub = lazy(() => import('./pages/NTADataHub.jsx'));
const BusinessProfile = lazy(() => import('./pages/BusinessProfile.jsx'));
const ProgressCenter = lazy(() => import('./pages/ProgressCenter.jsx'));
const MyGrowthWorkspace = lazy(() => import('./pages/MyGrowthWorkspace.jsx'));
const RickAdminCenter = lazy(() => import('./pages/RickAdminCenter.jsx'));
const BillingCenter = lazy(() => import('./pages/BillingCenter.jsx'));
const SupportCenter = lazy(() => import('./pages/SupportCenter.jsx'));
const ClientOnboardingCenter = lazy(() => import('./pages/ClientOnboardingCenter.jsx'));
const CommunityGrowthAdvisor = lazy(() => import('./pages/CommunityGrowthAdvisor.jsx'));
const PartnerQuickStart = lazy(() => import('./pages/PartnerQuickStart.jsx'));
const BusinessJourney = lazy(() => import('./pages/BusinessJourney.jsx'));
const OurStory = lazy(() => import('./pages/OurStory.jsx'));

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const PageLoader = () => (
  <>
    <style>{`@keyframes custom-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #e5e7eb', borderTop: '3px solid #0a7cc4', borderRadius: '50%', animation: 'custom-spin 1s linear infinite', margin: '0 auto 12px' }}></div>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Loading...</p>
      </div>
    </div>
  </>
);

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

// ─── Route Governance (R-002) ────────────────────────────────────────────────
// Access control is driven by src/config/routeGovernance.js — the single source
// of truth for which routes are public, auth-required, or role-restricted.

const AuthGate = ({ children }) => {
  const { user, isLoadingAuth, authError, navigateToLogin } = useAuth();
  const pathname = window.location.pathname;
  const access = classifyAppRoute(pathname, Object.keys(Pages));
  const needsAuth = requiresAuth(access);
  const needsNoIndex = shouldNoIndex(access);
  const hostRedirect = wrongHostRedirect(window.location, Object.keys(Pages));

  if (hostRedirect) {
    window.location.replace(hostRedirect);
    return null;
  }

  // Public / noindex paths — no auth needed
  if (!needsAuth) {
    return (
      <>
        {needsNoIndex && <NoIndexMeta />}
        {children}
      </>
    );
  }

  // Protected path — check auth
  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  // User is authenticated — check role access
  if (user && !userHasAccess(access, user)) {
    // Redirect unauthorized users to appropriate dashboard
    const ADMIN_EMAILS = ['info@newtechadvertising.com', 'newtechad1@gmail.com'];
    const isAdmin = user.role === 'admin' || ADMIN_EMAILS.includes(user.email?.toLowerCase());
    if (isAdmin) {
      window.location.href = '/agency';
    } else {
      window.location.href = '/portal';
    }
    return null;
  }

  return (
    <>
      <NoIndexMeta />
      {children}
    </>
  );
};

const AuthenticatedApp = () => (
  <AuthGate>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          path="/"
          element={
            <LayoutWrapper currentPageName={mainPageKey}>
              <MainPage />
            </LayoutWrapper>
          }
        />
        <Route path="/Login" element={<LayoutWrapper currentPageName="Login"><Login /></LayoutWrapper>} />
        <Route path="/signup" element={<LayoutWrapper currentPageName="signup"><SignupPage /></LayoutWrapper>} />
        {Object.entries(Pages)
          .filter(([pageKey]) => pageKey !== mainPageKey)
          .map(([pageKey, Page]) => (
            <Route
              key={pageKey}
              path={`/${pageKey}`}
              element={
                <LayoutWrapper currentPageName={pageKey}>
                  <Page />
                </LayoutWrapper>
              }
            />
          ))}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  </AuthGate>
);

function LegacyClientRedirect() {
  const { id } = useParams();
  return <Navigate to={`/agency/clients/${id}`} replace />;
}

function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <NTADataProvider>
          <Router>
            <ExperienceProvider>
              <AuthenticatedApp />
            </ExperienceProvider>
          </Router>
          <Toaster />
        </NTADataProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App; // Trigger rebuild

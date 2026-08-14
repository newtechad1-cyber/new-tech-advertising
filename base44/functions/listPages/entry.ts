// Explicit public page discovery manifest.
// Do not scan ./src/pages: that directory contains implementation files
// that must not become public route inventory merely because they exist.
// Private app/admin/CRM/operations pages are intentionally absent.
const PUBLIC_PAGE_FILES = [
  'About.jsx',
  'AiAdvertising.jsx',
  'AiSeo.jsx',
  'AiSocialMedia.jsx',
  'AiVideos.jsx',
  'AiWebsites.jsx',
  'AIVideoMarketing.jsx',
  'AIVisibilityBasics.jsx',
  'AccessibleWebsites.jsx',
  'BackOfficeSolutions.jsx',
  'BetterBusinessBook.jsx',
  'Blog.jsx',
  'BlogPost.jsx',
  'BookCall.jsx',
  'Books.jsx',
  'CanonArticleView.jsx',
  'CanonCollectionView.jsx',
  'CanonExplorer.jsx',
  'CaseStudies.jsx',
  'CaseStudyDetail.jsx',
  'CommunityPartnerProgram.jsx',
  'Contact.jsx',
  'ContractorMarketingNorthIowa.jsx',
  'DigitalRisks.jsx',
  'Free-Audit.jsx',
  'GrowthGuide.jsx',
  'GrowthShow.jsx',
  'GrowthShowEpisode.jsx',
  'GrowthSystemsVsCampaigns.jsx',
  'HVACMarketingNorthIowa.jsx',
  'JournalIssueView.jsx',
  'JournalLanding.jsx',
  'KnowledgeCollection.jsx',
  'KnowledgeLesson.jsx',
  'KnowledgeLibrary.jsx',
  'LearningCenter.jsx',
  'LocalLeadSystems.jsx',
  'NtaJournal.jsx',
  'NTAOperatingSystem.jsx',
  'OurStory.jsx',
  'OurWork.jsx',
  'PracticalAI.jsx',
  'Pricing.jsx',
  'PrivacyPolicy.jsx',
  'ReputationIsNowAGrowthEngine.jsx',
  'SEOPageForLocalBusinesses.jsx',
  'Services.jsx',
  'SmallBusinessMarketingNorthIowa.jsx',
  'SmallBusinessesNationwide.jsx',
  'SocialMediaContentSystem.jsx',
  'SocialMediaManagement.jsx',
  'TermsOfService.jsx',
  'WebAccessibilityTrust.jsx',
  'WebsiteRebuildService.jsx',
  'WhyNTA.jsx'
];

const PUBLIC_ROUTE_METADATA = [
  {
    path: '/',
    title: 'Practical AI Education for Small Business Owners | New Tech Advertising',
    description: 'Free, practical AI education for small-business owners. Learn how AI can support real work, keep human judgment in control, and help a business grow.',
    canonical: 'https://newtechadvertising.com/'
  },
  {
    path: '/knowledge',
    title: 'AI Lessons for Small Business Owners | NTA Knowledge Library',
    description: 'A connected library of practical AI, small-business growth, customer trust, and business-system lessons from Rick Hesse.',
    canonical: 'https://newtechadvertising.com/knowledge'
  },
  {
    path: '/ai-visibility-basics',
    title: 'How to Get Found in AI Search | AI Visibility Basics',
    description: 'Learn how Google AI Overviews, ChatGPT, and other answer engines understand and recommend local businesses.',
    canonical: 'https://newtechadvertising.com/ai-visibility-basics'
  },
  {
    path: '/services',
    title: 'AI and Digital Growth Services for Small Business | NTA',
    description: 'Practical AI education, local visibility, websites, content, customer follow-up, and connected growth systems for small-business owners.',
    canonical: 'https://newtechadvertising.com/services'
  },
  {
    path: '/free-audit',
    title: 'Free Small Business Marketing and AI Gap Audit | NTA',
    description: 'Start a free small-business gap audit to identify what is working, what is missing, and what deserves attention next.',
    canonical: 'https://newtechadvertising.com/free-audit'
  },
  {
    path: '/book-call',
    title: 'Book a Small Business Growth Conversation | NTA',
    description: 'Talk with New Tech Advertising about your business goals, marketing challenges, practical AI, and the next useful step.',
    canonical: 'https://newtechadvertising.com/book-call'
  }
];

Deno.serve(async () => Response.json({
  files: PUBLIC_PAGE_FILES,
  routes: PUBLIC_ROUTE_METADATA
}));

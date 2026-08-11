// Explicit public page discovery manifest.
// Do not scan ./src/pages: that directory contains implementation files
// that must not become public route inventory merely because they exist.
const PUBLIC_PAGE_FILES = [
  'SignupPage.jsx',
  'About.jsx',
  'AiSeo.jsx',
  'AiSocialMedia.jsx',
  'AiWebsites.jsx',
  'AiAdvertising.jsx',
  'AiVideos.jsx',
  'Blog.jsx',
  'BlogPost.jsx',
  'Book-Call.jsx',
  'BookCall.jsx',
  'CaseStudies.jsx',
  'CaseStudyDetail.jsx',
  'Contact.jsx',
  'Free-Audit.jsx',
  'Home.jsx',
  'HvacMarketing.jsx',
  'JoinNTA.jsx',
  'LocalLeadSystems.jsx',
  'LocalVisibility.jsx',
  'NtaJournal.jsx',
  'JournalLanding.jsx',
  'JournalIssueView.jsx',
  'Pricing.jsx',
  'PrivacyPolicy.jsx',
  'RestaurantMarketing.jsx',
  'Services.jsx',
  'TermsOfService.jsx',
  'GrowthShow.jsx',
  'GrowthShowEpisode.jsx',
  'HelpAndSupport.jsx',
  'LearningCenter.jsx',
  'KnowledgeLibrary.jsx',
  'OurStory.jsx',
  'OurWork.jsx',
  'PracticalAI.jsx',
  'WhyNTA.jsx'
];

Deno.serve(async () => Response.json({ files: PUBLIC_PAGE_FILES }));

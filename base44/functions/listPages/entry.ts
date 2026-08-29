import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

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

// Full public route metadata mirrors the public sitemap so Base44's SEO/discovery layer
// has every crawlable page, including knowledge collections and lessons.
const PUBLIC_ROUTE_METADATA = [
  {
    "path": "/",
    "title": "Practical AI Education for Small Business Owners | New Tech Advertising",
    "description": "Free, practical AI education for small-business owners. Learn how AI can support real work, keep human judgment in control, and help a business grow.",
    "canonical": "https://newtechadvertising.com/"
  },
  {
    "path": "/about",
    "title": "Practical AI for Small Business Owners | About Rick Hesse & NTA",
    "description": "Meet Rick Hesse, founder of New Tech Advertising. Learn how decades of business, advertising, sales, and technology experience shaped NTA's practical AI method.",
    "canonical": "https://newtechadvertising.com/about/"
  },
  {
    "path": "/services",
    "title": "AI and Digital Growth Services for Small Business | NTA",
    "description": "Practical AI education, local visibility, websites, content, customer follow-up, and connected growth systems for small-business owners.",
    "canonical": "https://newtechadvertising.com/services/"
  },
  {
    "path": "/contact",
    "title": "Contact NTA | Practical AI for Small Business",
    "description": "Contact New Tech Advertising in Mason City, Iowa for practical AI education, small-business growth guidance, and connected digital systems.",
    "canonical": "https://newtechadvertising.com/contact/"
  },
  {
    "path": "/pricing",
    "title": "Practical AI and Small Business Growth Options | NTA",
    "description": "Explore practical AI education and small-business growth options from New Tech Advertising. Start with free learning and choose help when it becomes useful.",
    "canonical": "https://newtechadvertising.com/pricing/"
  },
  {
    "path": "/insights",
    "title": "Small Business Growth and Practical AI Insights | NTA",
    "description": "Practical AI, small-business marketing, local visibility, digital trust, and growth-system lessons from Rick Hesse and New Tech Advertising.",
    "canonical": "https://newtechadvertising.com/insights/"
  },
  {
    "path": "/learning-center",
    "title": "AI Learning Center for Small Business Owners | NTA",
    "description": "Free AI lessons and small-business education on AI search, digital trust, local visibility, and connected growth systems.",
    "canonical": "https://newtechadvertising.com/learning-center/"
  },
  {
    "path": "/knowledge",
    "title": "AI Lessons for Small Business Owners | NTA Knowledge Library",
    "description": "A connected library of practical AI, small-business growth, customer trust, and business-system lessons from Rick Hesse.",
    "canonical": "https://newtechadvertising.com/knowledge/"
  },
  {
    "path": "/ai-visibility-basics",
    "title": "How to Get Found in AI Search | AI Visibility Basics",
    "description": "Learn how Google AI Overviews, ChatGPT, and other answer engines understand and recommend local businesses.",
    "canonical": "https://newtechadvertising.com/ai-visibility-basics/"
  },
  {
    "path": "/ai-seo",
    "title": "AI Search Optimization for Small Business | NTA",
    "description": "Learn the practical foundations of AI search visibility, clear business information, useful content, and trustworthy online signals.",
    "canonical": "https://newtechadvertising.com/ai-seo/"
  },
  {
    "path": "/ai-social-media",
    "title": "AI Social Media Content for Small Business | NTA",
    "description": "Use practical AI support to plan, write, and organize social media content while keeping the business owner's voice and judgment in control.",
    "canonical": "https://newtechadvertising.com/ai-social-media/"
  },
  {
    "path": "/ai-websites",
    "title": "AI Website Strategy for Small Business | NTA",
    "description": "Build a clearer small-business website that helps people find, understand, trust, and contact the business.",
    "canonical": "https://newtechadvertising.com/ai-websites/"
  },
  {
    "path": "/ai-advertising",
    "title": "AI Advertising Strategy for Small Business | NTA",
    "description": "Understand where AI can support advertising and customer growth without replacing business strategy, human judgment, or trust.",
    "canonical": "https://newtechadvertising.com/ai-advertising/"
  },
  {
    "path": "/ai-videos",
    "title": "AI Video Marketing for Small Business | NTA",
    "description": "Practical video marketing guidance for small-business owners who want to explain their work, build trust, and stay visible.",
    "canonical": "https://newtechadvertising.com/ai-videos/"
  },
  {
    "path": "/operating-system",
    "title": "Digital Growth Office for Small Business | NTA Operating System",
    "description": "See how NTA connects website, visibility, customer relationships, business knowledge, and practical AI into one Digital Growth Office.",
    "canonical": "https://newtechadvertising.com/operating-system/"
  },
  {
    "path": "/point-of-view",
    "title": "NTA Point of View: Practical AI and Small Business Growth",
    "description": "Clear, experience-based perspectives on practical AI, digital trust, small-business growth, and the systems behind useful results.",
    "canonical": "https://newtechadvertising.com/point-of-view/"
  },
  {
    "path": "/canon",
    "title": "Small Business Growth, AI, and Digital Trust | NTA Point of View",
    "description": "Explore the NTA canon: practical principles for small-business owners learning how growth, trust, knowledge, and AI fit together.",
    "canonical": "https://newtechadvertising.com/canon/"
  },
  {
    "path": "/canon/collection/nta-principles",
    "title": "NTA Principles for Small Business Growth and Practical AI",
    "description": "A collection of practical NTA principles about business growth, digital trust, owner knowledge, and responsible AI use.",
    "canonical": "https://newtechadvertising.com/canon/collection/nta-principles/"
  },
  {
    "path": "/canon/the-work-you-dont-see-why-setup-matters",
    "title": "Why Setup Matters: The Work Behind Useful AI Systems",
    "description": "A practical explanation of why thoughtful discovery, setup, and system design matter when technology is supposed to feel simple to use.",
    "canonical": "https://newtechadvertising.com/canon/the-work-you-dont-see-why-setup-matters/"
  },
  {
    "path": "/books",
    "title": "Practical AI and Business Books for Small Business Owners | NTA",
    "description": "Free practical business books from Rick Hesse on AI, trust, growth, and building stronger systems around the work you already do.",
    "canonical": "https://newtechadvertising.com/books/"
  },
  {
    "path": "/better-business-book",
    "title": "The Better Business Book: Practical Growth Guidance | NTA",
    "description": "A practical business book for owners who want clearer decisions, stronger relationships, and growth that is built on more than constant advertising.",
    "canonical": "https://newtechadvertising.com/better-business-book/"
  },
  {
    "path": "/practical-ai-for-small-business",
    "title": "Practical AI for Small Business Owners | Free Guide",
    "description": "A plainspoken guide to using AI in a real small business without hype, jargon, or giving up human judgment.",
    "canonical": "https://newtechadvertising.com/practical-ai-for-small-business/"
  },
  {
    "path": "/journal",
    "title": "NTA Journal: Practical AI and Small Business Growth Lessons",
    "description": "Weekly practical lessons and observations about AI, business growth, digital trust, customer relationships, and connected systems.",
    "canonical": "https://newtechadvertising.com/journal/"
  },
  {
    "path": "/growth-show",
    "title": "The NTA Growth Show: Practical AI and Small Business Growth",
    "description": "Watch and learn with Rick Hesse about practical AI, digital growth, customer trust, and the real work of building a stronger small business.",
    "canonical": "https://newtechadvertising.com/growth-show/"
  },
  {
    "path": "/growth-guide",
    "title": "Free Small Business Growth Guide | NTA",
    "description": "Use the NTA Growth Guide to clarify where your business is now, what you want to improve, and which practical next step makes sense.",
    "canonical": "https://newtechadvertising.com/growth-guide/"
  },
  {
    "path": "/growth-conversation",
    "title": "Small Business Growth Conversation | New Tech Advertising",
    "description": "Start a practical conversation about your business, current challenges, and the next useful step with New Tech Advertising.",
    "canonical": "https://newtechadvertising.com/growth-conversation/"
  },
  {
    "path": "/free-audit",
    "title": "Free Small Business Marketing and AI Gap Audit | NTA",
    "description": "Start a free small-business gap audit to identify what is working, what is missing, and what deserves attention next.",
    "canonical": "https://newtechadvertising.com/free-audit/"
  },
  {
    "path": "/book-call",
    "title": "Book a Small Business Growth Conversation | NTA",
    "description": "Talk with New Tech Advertising about your business goals, marketing challenges, practical AI, and the next useful step.",
    "canonical": "https://newtechadvertising.com/book-call/"
  },
  {
    "path": "/why-nta",
    "title": "Why NTA Teaches Practical AI for Small Business Owners",
    "description": "Understand Rick Hesse's human-centered approach to practical AI, digital trust, and connected systems for small-business growth.",
    "canonical": "https://newtechadvertising.com/why-nta/"
  },
  {
    "path": "/our-story",
    "title": "Our Story: Practical AI Education for Small Business | NTA",
    "description": "Learn how New Tech Advertising grew from decades of business and advertising experience into a practical AI education platform for owners.",
    "canonical": "https://newtechadvertising.com/our-story/"
  },
  {
    "path": "/our-work",
    "title": "Small Business Growth Work and Connected Systems | NTA",
    "description": "See the kind of website, visibility, content, customer, and practical AI work New Tech Advertising helps small businesses connect.",
    "canonical": "https://newtechadvertising.com/our-work/"
  },
  {
    "path": "/community-partner",
    "title": "Practical AI Education for Community Business Partners | NTA",
    "description": "Help local business owners understand practical AI, digital visibility, and connected growth through the NTA community partner approach.",
    "canonical": "https://newtechadvertising.com/community-partner/"
  },
  {
    "path": "/local-lead-systems",
    "title": "Local Lead Generation Systems for Small Business | NTA",
    "description": "Build a clearer path from local visibility to trust, inquiry, follow-up, and lasting customer relationships.",
    "canonical": "https://newtechadvertising.com/local-lead-systems/"
  },
  {
    "path": "/seo-pages-for-local-businesses",
    "title": "Local SEO Pages for Small Businesses | NTA",
    "description": "Learn when local SEO pages help a small business and how useful, specific content is different from thin doorway pages.",
    "canonical": "https://newtechadvertising.com/seo-pages-for-local-businesses/"
  },
  {
    "path": "/services/website-rebuilds",
    "title": "AI Website Rebuilds for Small Business | NTA",
    "description": "Rebuild a small-business website around clear messaging, search visibility, trust, accessibility, and useful customer action.",
    "canonical": "https://newtechadvertising.com/services/website-rebuilds/"
  },
  {
    "path": "/services/social-media-management",
    "title": "Social Media Management for Small Business | NTA",
    "description": "Organize consistent social media content around your business knowledge, customer questions, and practical growth priorities.",
    "canonical": "https://newtechadvertising.com/services/social-media-management/"
  },
  {
    "path": "/social-media-content-system",
    "title": "Social Media Content System for Small Business | NTA",
    "description": "Create a repeatable social media content system that keeps your business useful, recognizable, and connected to customer questions.",
    "canonical": "https://newtechadvertising.com/social-media-content-system/"
  },
  {
    "path": "/ai-video-marketing",
    "title": "AI Video Marketing for Small Business | NTA",
    "description": "Use practical video to explain your work, build customer confidence, and create useful content without pretending to be a large production company.",
    "canonical": "https://newtechadvertising.com/ai-video-marketing/"
  },
  {
    "path": "/back-office-solutions",
    "title": "Back-Office Systems and Practical AI for Small Business | NTA",
    "description": "Connect the information, follow-up, tasks, and processes behind a small business so the owner does not have to carry everything in memory.",
    "canonical": "https://newtechadvertising.com/back-office-solutions/"
  },
  {
    "path": "/accessible-websites",
    "title": "Accessible Websites for Small Business | NTA",
    "description": "Build a more accessible, understandable website that serves customers better and supports long-term digital trust.",
    "canonical": "https://newtechadvertising.com/accessible-websites/"
  },
  {
    "path": "/web-accessibility-trust",
    "title": "Website Accessibility and Digital Trust for Small Business",
    "description": "Understand why accessibility, clarity, and usability are part of the trust a small-business website creates.",
    "canonical": "https://newtechadvertising.com/web-accessibility-trust/"
  },
  {
    "path": "/digital-risks",
    "title": "Digital Risks Small Business Owners Should Understand | NTA",
    "description": "Learn how outdated information, disconnected tools, weak access controls, and unclear online signals can create business risk.",
    "canonical": "https://newtechadvertising.com/digital-risks/"
  },
  {
    "path": "/reputation-is-now-a-growth-engine",
    "title": "Why Online Reputation Drives Small Business Growth",
    "description": "Learn how reviews, customer experience, consistency, and visible evidence shape whether people trust a small business.",
    "canonical": "https://newtechadvertising.com/reputation-is-now-a-growth-engine/"
  },
  {
    "path": "/growth-systems-vs-campaigns",
    "title": "Growth Systems vs. Marketing Campaigns for Small Business",
    "description": "Understand why short campaigns create activity while connected growth systems help a small business build momentum over time.",
    "canonical": "https://newtechadvertising.com/growth-systems-vs-campaigns/"
  },
  {
    "path": "/small-business-marketing-north-iowa",
    "title": "Small Business Marketing in North Iowa | NTA",
    "description": "Practical marketing, visibility, and AI education for small-business owners in Mason City, North Iowa, and surrounding communities.",
    "canonical": "https://newtechadvertising.com/small-business-marketing-north-iowa/"
  },
  {
    "path": "/contractor-marketing-north-iowa",
    "title": "Contractor Marketing in North Iowa | NTA",
    "description": "Practical marketing, local visibility, and customer follow-up systems for contractors serving North Iowa communities.",
    "canonical": "https://newtechadvertising.com/contractor-marketing-north-iowa/"
  },
  {
    "path": "/hvac-marketing-north-iowa",
    "title": "HVAC Marketing in North Iowa | NTA",
    "description": "Help North Iowa HVAC businesses explain their work, improve local visibility, and build a more dependable path to customer inquiries.",
    "canonical": "https://newtechadvertising.com/hvac-marketing-north-iowa/"
  },
  {
    "path": "/small-businesses-nationwide",
    "title": "Practical AI and Digital Growth for Small Businesses Nationwide",
    "description": "NTA helps small-business owners across the United States understand practical AI and build clearer, connected growth systems.",
    "canonical": "https://newtechadvertising.com/small-businesses-nationwide/"
  },
  {
    "path": "/case-studies",
    "title": "Small Business Growth Case Studies | New Tech Advertising",
    "description": "Explore examples of websites, marketing, visibility, and connected growth work for local and small businesses.",
    "canonical": "https://newtechadvertising.com/case-studies/"
  },
  {
    "path": "/privacy-policy",
    "title": "Privacy Policy | New Tech Advertising",
    "description": "Read the New Tech Advertising privacy policy.",
    "canonical": "https://newtechadvertising.com/privacy-policy/"
  },
  {
    "path": "/terms-of-service",
    "title": "Terms of Service | New Tech Advertising",
    "description": "Read the New Tech Advertising terms of service.",
    "canonical": "https://newtechadvertising.com/terms-of-service/"
  },
  {
    "path": "/knowledge/business-foundations",
    "title": "Business Foundations for Small Business Owners | NTA Knowledge Library",
    "description": "Learn the core principles of building a business that grows through understanding rather than constant selling.",
    "canonical": "https://newtechadvertising.com/knowledge/business-foundations/"
  },
  {
    "path": "/knowledge/business-foundations/why-nta-exists",
    "title": "Why Practical AI Education Matters for Small Business Owners | NTA Knowledge Library",
    "description": "Marketing is broken because it focuses on selling magic pills instead of building long-term systems. NTA exists to change that.",
    "canonical": "https://newtechadvertising.com/knowledge/business-foundations/why-nta-exists/"
  },
  {
    "path": "/knowledge/business-foundations/how-businesses-really-grow",
    "title": "How Small Businesses Really Grow: From Activity to Momentum | NTA Knowledge Library",
    "description": "Understand the difference between unpredictable spikes in activity and compounded digital momentum.",
    "canonical": "https://newtechadvertising.com/knowledge/business-foundations/how-businesses-really-grow/"
  },
  {
    "path": "/knowledge/business-foundations/marketing-isnt-magic",
    "title": "Why Small Business Marketing Is Not Magic | NTA Knowledge Library",
    "description": "Demystifying the process of acquiring and retaining customers in the digital age.",
    "canonical": "https://newtechadvertising.com/knowledge/business-foundations/marketing-isnt-magic/"
  },
  {
    "path": "/knowledge/business-foundations/every-system-produces-exactly-what-it-was-designed-to-produce",
    "title": "Why Small Business Results Reflect the System Behind Them | NTA Knowledge Library",
    "description": "Why your current results are a direct reflection of your current operational structure.",
    "canonical": "https://newtechadvertising.com/knowledge/business-foundations/every-system-produces-exactly-what-it-was-designed-to-produce/"
  },
  {
    "path": "/knowledge/business-foundations/understanding-before-spending",
    "title": "What to Understand Before Spending on Small Business Marketing | NTA Knowledge Library",
    "description": "The importance of education and transparency before investing in growth.",
    "canonical": "https://newtechadvertising.com/knowledge/business-foundations/understanding-before-spending/"
  },
  {
    "path": "/knowledge/business-foundations/ai-is-my-team-not-my-replacement",
    "title": "How AI Can Support a Small Business Team Without Replacing People | NTA Knowledge Library",
    "description": "How to properly frame the role of Artificial Intelligence in a local service business.",
    "canonical": "https://newtechadvertising.com/knowledge/business-foundations/ai-is-my-team-not-my-replacement/"
  },
  {
    "path": "/knowledge/business-foundations/why-trust-comes-before-marketing",
    "title": "Why Customer Trust Comes Before Small Business Marketing | NTA Knowledge Library",
    "description": "The fundamental shift in how consumers choose who to hire in the AI era.",
    "canonical": "https://newtechadvertising.com/knowledge/business-foundations/why-trust-comes-before-marketing/"
  },
  {
    "path": "/knowledge/business-foundations/what-building-my-own-digital-growth-office-taught-me",
    "title": "What Building a Digital Growth Office Taught Me | NTA Knowledge Library",
    "description": "Why a business's public website and private operating system should be connected—but built to do different jobs.",
    "canonical": "https://newtechadvertising.com/knowledge/business-foundations/what-building-my-own-digital-growth-office-taught-me/"
  },
  {
    "path": "/knowledge/truth-about-business-growth",
    "title": "The Truth About Small Business Growth | NTA Knowledge Library",
    "description": "Understand the difference between unpredictable spikes in activity and compounded digital momentum.",
    "canonical": "https://newtechadvertising.com/knowledge/truth-about-business-growth/"
  },
  {
    "path": "/knowledge/truth-about-business-growth/businesses-dont-need-more-marketing-they-need-a-better-growth-system",
    "title": "Why More Marketing Does Not Fix a Weak Small Business Growth System | NTA Knowledge Library",
    "description": "When a business isn’t growing, the first conclusion is usually pretty simple: “We need more marketing.” But bringing more people through the door doesn’t fix what happens after they arrive.",
    "canonical": "https://newtechadvertising.com/knowledge/truth-about-business-growth/businesses-dont-need-more-marketing-they-need-a-better-growth-system/"
  },
  {
    "path": "/knowledge/truth-about-business-growth/marketing-doesnt-create-great-businesses",
    "title": "Why Marketing Alone Does Not Create Small Business Growth | NTA Knowledge Library",
    "description": "Marketing gets blamed for a lot of things. It also gets credit for things it cannot create. Discover why marketing works best as an amplifier for an already solid foundation.",
    "canonical": "https://newtechadvertising.com/knowledge/truth-about-business-growth/marketing-doesnt-create-great-businesses/"
  },
  {
    "path": "/knowledge/truth-about-business-growth/every-business-is-already-perfectly-designed",
    "title": "How a Small Business System Shapes Its Results | NTA Knowledge Library",
    "description": "When business results are frustrating, it can feel like a mystery. But results aren't accidents—they are the direct product of how your business currently operates.",
    "canonical": "https://newtechadvertising.com/knowledge/truth-about-business-growth/every-business-is-already-perfectly-designed/"
  },
  {
    "path": "/knowledge/truth-about-business-growth/the-difference-between-activity-and-progress",
    "title": "Small Business Activity vs. Progress: What Creates Growth? | NTA Knowledge Library",
    "description": "A business can be extremely active without becoming stronger. Learn how to distinguish between merely doing work and actually building the systems that create meaningful, lasting growth.",
    "canonical": "https://newtechadvertising.com/knowledge/truth-about-business-growth/the-difference-between-activity-and-progress/"
  },
  {
    "path": "/knowledge/truth-about-business-growth/why-growth-is-a-system",
    "title": "Why Small Business Growth Is a System | NTA Knowledge Library",
    "description": "Lasting growth rarely comes from one isolated solution. It comes from several parts of the business working together.",
    "canonical": "https://newtechadvertising.com/knowledge/truth-about-business-growth/why-growth-is-a-system/"
  },
  {
    "path": "/knowledge/truth-about-business-growth/what-business-owners-really-buy",
    "title": "What Small Business Owners Really Buy | NTA Knowledge Library",
    "description": "Business owners buy websites, advertising, and software. But what they really want is clarity, confidence, progress, and better outcomes.",
    "canonical": "https://newtechadvertising.com/knowledge/truth-about-business-growth/what-business-owners-really-buy/"
  },
  {
    "path": "/knowledge/truth-about-business-growth/why-understanding-comes-before-advertising",
    "title": "Why Understanding Comes Before Small Business Advertising | NTA Knowledge Library",
    "description": "When a business needs more customers, advertising feels like the logical first step. But spending money and creating growth are not the same thing.",
    "canonical": "https://newtechadvertising.com/knowledge/truth-about-business-growth/why-understanding-comes-before-advertising/"
  },
  {
    "path": "/knowledge/how-customers-decide-who-to-trust",
    "title": "How Customers Decide Whether to Trust a Small Business | NTA Knowledge…",
    "description": "Explore the psychological and practical steps customers take before deciding to hire a business.",
    "canonical": "https://newtechadvertising.com/knowledge/how-customers-decide-who-to-trust/"
  },
  {
    "path": "/knowledge/how-customers-decide-who-to-trust/trust-begins-before-the-first-conversation",
    "title": "How Customers Decide Whether to Trust a Small Business | NTA Knowledge Library",
    "description": "Business owners often believe trust begins when they finally speak with the customer. But by the time customers contact a business, many have already formed an opinion.",
    "canonical": "https://newtechadvertising.com/knowledge/how-customers-decide-who-to-trust/trust-begins-before-the-first-conversation/"
  },
  {
    "path": "/knowledge/how-customers-decide-who-to-trust/people-trust-what-they-can-understand",
    "title": "Why Customers Trust What They Can Understand | NTA Knowledge Library",
    "description": "Customers do not have your experience. When they cannot quickly understand what a business does or how it can help, moving forward feels unsafe.",
    "canonical": "https://newtechadvertising.com/knowledge/how-customers-decide-who-to-trust/people-trust-what-they-can-understand/"
  },
  {
    "path": "/knowledge/how-customers-decide-who-to-trust/customers-trust-evidence-more-than-claims",
    "title": "Why Customer Evidence Matters More Than Marketing Claims | NTA Knowledge Library",
    "description": "Businesses make a lot of claims. But customers have heard the same claims from nearly every business. Evidence is what helps them believe you.",
    "canonical": "https://newtechadvertising.com/knowledge/how-customers-decide-who-to-trust/customers-trust-evidence-more-than-claims/"
  },
  {
    "path": "/knowledge/how-customers-decide-who-to-trust/trust-is-built-through-kept-promises",
    "title": "How Small Businesses Build Trust by Keeping Promises | NTA Knowledge Library",
    "description": "Businesses often think of promises as the large commitments they make. But customers are also paying attention to many smaller promises that the business may not realize it is making.",
    "canonical": "https://newtechadvertising.com/knowledge/how-customers-decide-who-to-trust/trust-is-built-through-kept-promises/"
  },
  {
    "path": "/knowledge/how-customers-decide-who-to-trust/people-remember-how-a-business-made-them-feel",
    "title": "Why Customer Experience Matters to Small Business Growth | NTA Knowledge Library",
    "description": "The technical result can be correct while the relationship still feels wrong. Long after customers forget the details of the transaction, they often remember how the business made them feel.",
    "canonical": "https://newtechadvertising.com/knowledge/how-customers-decide-who-to-trust/people-remember-how-a-business-made-them-feel/"
  },
  {
    "path": "/knowledge/how-customers-decide-who-to-trust/trust-means-putting-the-relationship-before-the-transaction",
    "title": "Why Relationships Matter More Than the Transaction | NTA Knowledge Library",
    "description": "A transaction can produce revenue today while weakening trust tomorrow. Trust reaches its deepest level when customers believe a business will protect their interests, even when doing so may cost an immediate sale.",
    "canonical": "https://newtechadvertising.com/knowledge/how-customers-decide-who-to-trust/trust-means-putting-the-relationship-before-the-transaction/"
  },
  {
    "path": "/knowledge/how-businesses-turn-trust-into-lasting-relationships",
    "title": "How Small Businesses Build Lasting Customer Relationships | NTA…",
    "description": "Learn how to transform one-time transactions into lasting partnerships and ongoing referrals.",
    "canonical": "https://newtechadvertising.com/knowledge/how-businesses-turn-trust-into-lasting-relationships/"
  },
  {
    "path": "/knowledge/how-businesses-turn-trust-into-lasting-relationships/the-sale-is-the-beginning-not-the-end",
    "title": "How to Turn Small Business Customers Into Long-Term Relationships | NTA Knowledge Library",
    "description": "Businesses put enormous effort into getting customers, but often treat them as though the relationship has ended once the sale is complete.",
    "canonical": "https://newtechadvertising.com/knowledge/how-businesses-turn-trust-into-lasting-relationships/the-sale-is-the-beginning-not-the-end/"
  },
  {
    "path": "/knowledge/how-businesses-turn-trust-into-lasting-relationships/staying-connected-without-always-selling",
    "title": "How to Stay Connected With Customers Without Always Selling | NTA Knowledge Library",
    "description": "Staying connected should not mean constantly selling. It should mean continuing to be useful. A healthy business relationship creates value between transactions, not only during them.",
    "canonical": "https://newtechadvertising.com/knowledge/how-businesses-turn-trust-into-lasting-relationships/staying-connected-without-always-selling/"
  },
  {
    "path": "/knowledge/how-businesses-turn-trust-into-lasting-relationships/a-business-should-remember-its-customers",
    "title": "Why Small Businesses Should Remember Their Customers | NTA Knowledge Library",
    "description": "A lasting relationship requires shared memory. Customers should not have to rebuild the relationship every time they contact the business. Memory turns a series of separate transactions into one continuing relationship.",
    "canonical": "https://newtechadvertising.com/knowledge/how-businesses-turn-trust-into-lasting-relationships/a-business-should-remember-its-customers/"
  },
  {
    "path": "/knowledge/how-businesses-turn-trust-into-lasting-relationships/every-customer-relationship-should-teach-the-business-something",
    "title": "How Customer Relationships Improve a Small Business | NTA Knowledge Library",
    "description": "A healthy business should become more understanding with every customer relationship. Every customer relationship contains knowledge that can improve your systems, processes, and communication.",
    "canonical": "https://newtechadvertising.com/knowledge/how-businesses-turn-trust-into-lasting-relationships/every-customer-relationship-should-teach-the-business-something/"
  },
  {
    "path": "/knowledge/how-businesses-turn-trust-into-lasting-relationships/customer-feedback-should-change-the-business",
    "title": "How Customer Feedback Should Change a Small Business | NTA Knowledge Library",
    "description": "Feedback becomes valuable when it influences a decision, explanation, process, priority, or behavior. Listening without learning—and learning without changing—does not improve anything.",
    "canonical": "https://newtechadvertising.com/knowledge/how-businesses-turn-trust-into-lasting-relationships/customer-feedback-should-change-the-business/"
  },
  {
    "path": "/knowledge/how-businesses-turn-trust-into-lasting-relationships/customers-become-loyal-when-they-help-shape-the-business",
    "title": "How Customer Participation Builds Small Business Loyalty | NTA Knowledge Library",
    "description": "Customers become more invested in a business when they are allowed to participate in its improvement. Loyalty grows when customers can see that the relationship has influence.",
    "canonical": "https://newtechadvertising.com/knowledge/how-businesses-turn-trust-into-lasting-relationships/customers-become-loyal-when-they-help-shape-the-business/"
  },
  {
    "path": "/knowledge/how-businesses-turn-trust-into-lasting-relationships/the-strongest-growth-comes-from-relationships-that-create-more-relationships",
    "title": "How Relationships Create Sustainable Small Business Growth | NTA Knowledge Library",
    "description": "The strongest growth often begins with people who already know the business. One trusted relationship creates the beginning of another. This is more than word-of-mouth advertising. It is trust traveling from one person to the next.",
    "canonical": "https://newtechadvertising.com/knowledge/how-businesses-turn-trust-into-lasting-relationships/the-strongest-growth-comes-from-relationships-that-create-more-relationships/"
  },
  {
    "path": "/knowledge/turning-what-a-business-knows-into-an-asset",
    "title": "How to Turn Small Business Knowledge Into an Asset | NTA Knowledge…",
    "description": "Discover how to document and share your expertise so it works for your business 24/7.",
    "canonical": "https://newtechadvertising.com/knowledge/turning-what-a-business-knows-into-an-asset/"
  },
  {
    "path": "/knowledge/turning-what-a-business-knows-into-an-asset/your-business-knows-more-than-it-has-documented",
    "title": "How to Turn Small Business Knowledge Into a Business Asset | NTA Knowledge Library",
    "description": "When business owners think about the assets of their business, they usually think about things they can see. But many businesses overlook one of their most valuable assets: everything the business has learned.",
    "canonical": "https://newtechadvertising.com/knowledge/turning-what-a-business-knows-into-an-asset/your-business-knows-more-than-it-has-documented/"
  },
  {
    "path": "/knowledge/turning-what-a-business-knows-into-an-asset/the-most-valuable-knowledge-usually-lives-in-the-owners-head",
    "title": "Why the Owner's Knowledge Is a Small Business Asset | NTA Knowledge Library",
    "description": "Many business owners assume the important knowledge of the business has already been documented. But those materials usually contain only part of the knowledge required. The rest, and often the most valuable part, is the judgment living in the owner's head.",
    "canonical": "https://newtechadvertising.com/knowledge/turning-what-a-business-knows-into-an-asset/the-most-valuable-knowledge-usually-lives-in-the-owners-head/"
  },
  {
    "path": "/knowledge/turning-what-a-business-knows-into-an-asset/customer-questions-reveal-what-the-business-should-teach",
    "title": "How Customer Questions Reveal What a Business Should Teach | NTA Knowledge Library",
    "description": "Repeated customer questions aren't just customer service tasks; they reveal gaps in understanding and show what your business should be teaching.",
    "canonical": "https://newtechadvertising.com/knowledge/turning-what-a-business-knows-into-an-asset/customer-questions-reveal-what-the-business-should-teach/"
  },
  {
    "path": "/knowledge/turning-what-a-business-knows-into-an-asset/stories-turn-experience-into-understanding",
    "title": "How Stories Turn Small Business Experience Into Understanding | NTA Knowledge Library",
    "description": "Facts by themselves do not always create understanding. A good story helps the customer move from being told something to seeing it in action.",
    "canonical": "https://newtechadvertising.com/knowledge/turning-what-a-business-knows-into-an-asset/stories-turn-experience-into-understanding/"
  },
  {
    "path": "/knowledge/turning-what-a-business-knows-into-an-asset/documenting-a-process-makes-knowledge-repeatable",
    "title": "How to Document a Small Business Process So It Can Be Repeated | NTA Knowledge Library",
    "description": "A process captures how the business moves from one point to another. But a useful process should do more than list steps. It should preserve the thinking behind those steps.",
    "canonical": "https://newtechadvertising.com/knowledge/turning-what-a-business-knows-into-an-asset/documenting-a-process-makes-knowledge-repeatable/"
  },
  {
    "path": "/knowledge/turning-what-a-business-knows-into-an-asset/ai-becomes-more-valuable-when-it-learns-from-the-business",
    "title": "Why AI Works Better When It Learns From the Business | NTA Knowledge Library",
    "description": "Generic AI produces generic results. Documented experience gives AI the context it needs to become relevant, consistent, and genuinely helpful.",
    "canonical": "https://newtechadvertising.com/knowledge/turning-what-a-business-knows-into-an-asset/ai-becomes-more-valuable-when-it-learns-from-the-business/"
  },
  {
    "path": "/knowledge/turning-what-a-business-knows-into-an-asset/knowledge-becomes-an-asset-when-it-can-keep-working-without-you",
    "title": "How to Make Small Business Knowledge Keep Working Without the Owner | NTA Knowledge Library",
    "description": "Knowledge becomes an asset when it can be found, trusted, used, shared, improved, and put to work repeatedly without depending on the owner to personally deliver it every time.",
    "canonical": "https://newtechadvertising.com/knowledge/turning-what-a-business-knows-into-an-asset/knowledge-becomes-an-asset-when-it-can-keep-working-without-you/"
  },
  {
    "path": "/knowledge/ai-foundations",
    "title": "Practical AI Foundations for Small Business | NTA Knowledge Library",
    "description": "A practical, hype-free introduction to using artificial intelligence in a local business.",
    "canonical": "https://newtechadvertising.com/knowledge/ai-foundations/"
  },
  {
    "path": "/knowledge/ai-foundations/ai-isnt-magic-either",
    "title": "Is AI Magic? A Practical Introduction for Small Business | NTA Knowledge Library",
    "description": "Artificial intelligence is powerful, but it is not magic. Understanding what it can and cannot do is the first step toward using it wisely.",
    "canonical": "https://newtechadvertising.com/knowledge/ai-foundations/ai-isnt-magic-either/"
  },
  {
    "path": "/knowledge/ai-foundations/start-with-the-work-not-the-tool",
    "title": "How to Start Using AI in a Small Business: Begin With the Work | NTA Knowledge Library",
    "description": "The best place to begin with AI is not by choosing a product. It is by understanding the work you are trying to accomplish.",
    "canonical": "https://newtechadvertising.com/knowledge/ai-foundations/start-with-the-work-not-the-tool/"
  },
  {
    "path": "/knowledge/ai-foundations/ai-needs-context-before-it-can-be-helpful",
    "title": "Why AI Needs Business Context to Be Useful | NTA Knowledge Library",
    "description": "AI may know a great deal about business in general, but it does not automatically understand your business. Useful results begin by providing the right context.",
    "canonical": "https://newtechadvertising.com/knowledge/ai-foundations/ai-needs-context-before-it-can-be-helpful/"
  },
  {
    "path": "/knowledge/ai-foundations/ai-can-assist-judgment-it-cannot-own-it",
    "title": "Using AI for Business Decisions Without Giving Up Human Judgment | NTA Knowledge Library",
    "description": "AI can organize information, identify patterns, and suggest possible actions. But decisions involving people, values, risk, and responsibility still require human judgment.",
    "canonical": "https://newtechadvertising.com/knowledge/ai-foundations/ai-can-assist-judgment-it-cannot-own-it/"
  },
  {
    "path": "/knowledge/ai-foundations/a-prompt-is-the-beginning-of-a-conversation",
    "title": "Why AI Gives Wrong Answers and How to Correct It | NTA Knowledge Library",
    "description": "AI can sound confident and still be wrong. Learn how to question, correct, guide, and verify AI through conversation instead of trusting its first answer.",
    "canonical": "https://newtechadvertising.com/knowledge/ai-foundations/a-prompt-is-the-beginning-of-a-conversation/"
  },
  {
    "path": "/knowledge/ai-foundations/automation-comes-after-understanding",
    "title": "When to Automate a Small Business Process: Start With Understanding | NTA Knowledge Library",
    "description": "Automation can make good work faster and more consistent. But when we automate a process we do not understand, we often make confusion move faster too.",
    "canonical": "https://newtechadvertising.com/knowledge/ai-foundations/automation-comes-after-understanding/"
  },
  {
    "path": "/knowledge/ai-foundations/building-your-first-ai-teammate",
    "title": "How to Build Your First AI Teammate for Small Business | NTA Knowledge Library",
    "description": "Bring the principles of AI Foundations together by giving AI one clear, useful job with the right context, boundaries, and human oversight.",
    "canonical": "https://newtechadvertising.com/knowledge/ai-foundations/building-your-first-ai-teammate/"
  },
  {
    "path": "/knowledge/ai-foundations/when-ai-tells-you-youre-different",
    "title": "How AI Can Help a Small Business Find Its Difference | NTA Knowledge Library",
    "description": "Artificial intelligence told me I was unusual. I wasn’t quite sure what to do with that.",
    "canonical": "https://newtechadvertising.com/knowledge/ai-foundations/when-ai-tells-you-youre-different/"
  },
  {
    "path": "/knowledge/ai-foundations/the-team-i-spent-my-life-trying-to-build",
    "title": "What AI Changes About Building a Small Business Team | NTA Knowledge Library",
    "description": "For much of my life, I have tried to build things with other people. AI has helped me realize that some of the things I was trying to build were not impossible—they just required more consistent support.",
    "canonical": "https://newtechadvertising.com/knowledge/ai-foundations/the-team-i-spent-my-life-trying-to-build/"
  },
  {
    "path": "/knowledge/ai-foundations/ai-makes-complicated-work-easier",
    "title": "How to Turn AI Conversations Into a Working Business System | NTA Knowledge Library",
    "description": "See how an owner’s spoken knowledge can be clarified, approved, and turned into a practical business system without taking authority away from the owner.",
    "canonical": "https://newtechadvertising.com/knowledge/ai-foundations/ai-makes-complicated-work-easier/"
  },
  {
    "path": "/knowledge/ai-foundations/i-see-artificial-intelligence-differently",
    "title": "A Practical Way to Think About AI for Small Business | NTA Knowledge Library",
    "description": "Why a useful approach to AI begins with people, purpose, trust, and the larger business system—not code, novelty, or another disconnected tool.",
    "canonical": "https://newtechadvertising.com/knowledge/ai-foundations/i-see-artificial-intelligence-differently/"
  },
  {
    "path": "/knowledge/ai-foundations/ai-does-not-have-to-be-a-monster",
    "title": "How to Use AI Without Fear or Hype in a Small Business | NTA Knowledge Library",
    "description": "A respectful way to help people move from fear and uncertainty about AI toward one small, safe, practical experience—without pressure or loss of control.",
    "canonical": "https://newtechadvertising.com/knowledge/ai-foundations/ai-does-not-have-to-be-a-monster/"
  },
  {
    "path": "/knowledge/ai-foundations/you-can-do-what-i-do-but-you-dont-have-to",
    "title": "How Small Business Owners Can Use AI Without Becoming Technicians | NTA Knowledge Library",
    "description": "AI makes complex work more accessible, but small-business owners should not have to spend years becoming experts in websites, software, automation, and AI just to keep up.",
    "canonical": "https://newtechadvertising.com/knowledge/ai-foundations/you-can-do-what-i-do-but-you-dont-have-to/"
  },
  {
    "path": "/knowledge/ai-foundations/use-the-model-that-gets-the-job-done",
    "title": "How to Choose the Right AI Model for the Work | NTA Knowledge Library",
    "description": "The newest or most expensive AI model is not automatically the right choice. Match the capability and cost to the work you actually need done.",
    "canonical": "https://newtechadvertising.com/knowledge/ai-foundations/use-the-model-that-gets-the-job-done/"
  },
  {
    "path": "/knowledge/what-is-digital-trust",
    "title": "What Is Digital Trust for a Small Business? | NTA Knowledge Library",
    "description": "Understand why the internet has changed, and how trust is built in an AI-assisted world.",
    "canonical": "https://newtechadvertising.com/knowledge/what-is-digital-trust/"
  },
  {
    "path": "/knowledge/what-is-digital-trust/what-is-digital-trust",
    "title": "What Is Digital Trust for a Small Business? | NTA Knowledge Library",
    "description": "Digital trust is the confidence customers develop from everything they can find and understand about your business before speaking with you.",
    "canonical": "https://newtechadvertising.com/knowledge/what-is-digital-trust/what-is-digital-trust/"
  },
  {
    "path": "/knowledge/what-is-digital-trust/your-website-is-no-longer-just-a-website",
    "title": "Why a Small Business Website Is More Than a Brochure | NTA Knowledge Library",
    "description": "A modern business website should help people find, understand, trust, and connect with the business. It is becoming the central connection point between what your business knows and the people who need that knowledge.",
    "canonical": "https://newtechadvertising.com/knowledge/what-is-digital-trust/your-website-is-no-longer-just-a-website/"
  },
  {
    "path": "/knowledge/what-is-digital-trust/why-traditional-marketing-is-no-longer-enough",
    "title": "Why Traditional Marketing Is No Longer Enough for Small Business | NTA Knowledge Library",
    "description": "Modern business growth requires a connected path from attention to understanding, understanding to trust, trust to conversation, and conversation to a lasting relationship.",
    "canonical": "https://newtechadvertising.com/knowledge/what-is-digital-trust/why-traditional-marketing-is-no-longer-enough/"
  },
  {
    "path": "/knowledge/what-is-digital-trust/digital-assets-keep-working",
    "title": "How Owned Digital Assets Support Small Business Growth | NTA Knowledge Library",
    "description": "A digital asset is something the business builds, owns, and can continue using. Discover how to build long-term value instead of depending entirely on rented attention.",
    "canonical": "https://newtechadvertising.com/knowledge/what-is-digital-trust/digital-assets-keep-working/"
  },
  {
    "path": "/knowledge/what-is-digital-trust/ai-is-changing-how-customers-find-businesses",
    "title": "How AI Is Changing How Customers Find Small Businesses | NTA Knowledge Library",
    "description": "AI is changing business discovery from a search for links into a search for answers. Discover why being clearly understood is becoming just as important as being highly visible.",
    "canonical": "https://newtechadvertising.com/knowledge/what-is-digital-trust/ai-is-changing-how-customers-find-businesses/"
  },
  {
    "path": "/knowledge/what-is-digital-trust/relationships-are-your-greatest-competitive-advantage",
    "title": "Why Relationships Are a Small Business Competitive Advantage | NTA Knowledge Library",
    "description": "Relationships are your greatest competitive advantage because trust grows through repeated experiences. Discover why genuine human connection becomes more important in an AI-assisted world.",
    "canonical": "https://newtechadvertising.com/knowledge/what-is-digital-trust/relationships-are-your-greatest-competitive-advantage/"
  },
  {
    "path": "/knowledge/what-is-digital-trust/the-connected-business-is-the-future",
    "title": "What a Connected Small Business Looks Like | NTA Knowledge Library",
    "description": "Having several tools does not make a business connected. The future belongs to businesses that learn how to connect their knowledge, people, processes, relationships, and technology around the customer.",
    "canonical": "https://newtechadvertising.com/knowledge/what-is-digital-trust/the-connected-business-is-the-future/"
  }
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = user.role === 'admin' || user.email === 'info@newtechadvertising.com';
    if (!isAdmin) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    return Response.json({
      files: PUBLIC_PAGE_FILES,
      routes: PUBLIC_ROUTE_METADATA
    });
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
});

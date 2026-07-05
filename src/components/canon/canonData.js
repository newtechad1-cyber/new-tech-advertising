/**
 * C-001 Canon Library — Static Canon Data
 *
 * Maps all existing site content into the Canon structure.
 * This is the source of truth until CanonEntry/CanonCollection entities
 * are populated in the database. Pages read from here at runtime.
 *
 * Every entry preserves its original URL — nothing is rewritten,
 * only organized.
 */

// ─── Theme palette ─────────────────────────────────────────────────────────
export const THEME_COLORS = {
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    text: 'text-blue-400',    solid: 'bg-blue-600',    hover: 'hover:bg-blue-500',    ring: 'ring-blue-500/30',    gradient: 'from-blue-600 to-blue-400' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', solid: 'bg-emerald-600', hover: 'hover:bg-emerald-500', ring: 'ring-emerald-500/30', gradient: 'from-emerald-600 to-emerald-400' },
  purple:  { bg: 'bg-purple-500/10',  border: 'border-purple-500/20',  text: 'text-purple-400',  solid: 'bg-purple-600',  hover: 'hover:bg-purple-500',  ring: 'ring-purple-500/30',  gradient: 'from-purple-600 to-purple-400' },
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   text: 'text-amber-400',   solid: 'bg-amber-600',   hover: 'hover:bg-amber-500',   ring: 'ring-amber-500/30',   gradient: 'from-amber-600 to-amber-400' },
  rose:    { bg: 'bg-rose-500/10',    border: 'border-rose-500/20',    text: 'text-rose-400',    solid: 'bg-rose-600',    hover: 'hover:bg-rose-500',    ring: 'ring-rose-500/30',    gradient: 'from-rose-600 to-rose-400' },
  cyan:    { bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20',    text: 'text-cyan-400',    solid: 'bg-cyan-600',    hover: 'hover:bg-cyan-500',    ring: 'ring-cyan-500/30',    gradient: 'from-cyan-600 to-cyan-400' },
  orange:  { bg: 'bg-orange-500/10',  border: 'border-orange-500/20',  text: 'text-orange-400',  solid: 'bg-orange-600',  hover: 'hover:bg-orange-500',  ring: 'ring-orange-500/30',  gradient: 'from-orange-600 to-orange-400' },
  indigo:  { bg: 'bg-indigo-500/10',  border: 'border-indigo-500/20',  text: 'text-indigo-400',  solid: 'bg-indigo-600',  hover: 'hover:bg-indigo-500',  ring: 'ring-indigo-500/30',  gradient: 'from-indigo-600 to-indigo-400' },
  teal:    { bg: 'bg-teal-500/10',    border: 'border-teal-500/20',    text: 'text-teal-400',    solid: 'bg-teal-600',    hover: 'hover:bg-teal-500',    ring: 'ring-teal-500/30',    gradient: 'from-teal-600 to-teal-400' },
  red:     { bg: 'bg-red-500/10',     border: 'border-red-500/20',     text: 'text-red-400',     solid: 'bg-red-600',     hover: 'hover:bg-red-500',     ring: 'ring-red-500/30',     gradient: 'from-red-600 to-red-400' },
};

// ─── Content type badges ────────────────────────────────────────────────────
export const CONTENT_TYPE_META = {
  'Article':         { icon: 'FileText',   label: 'Article' },
  'Journal':         { icon: 'BookOpen',   label: 'Journal' },
  'Video':           { icon: 'PlayCircle', label: 'Video' },
  'Learning Lesson': { icon: 'GraduationCap', label: 'Lesson' },
  'Case Study':      { icon: 'BarChart3',  label: 'Case Study' },
  'Podcast':         { icon: 'Mic',        label: 'Podcast' },
  'Interview':       { icon: 'MessageSquare', label: 'Interview' },
};

// ─── All Canon Entries ──────────────────────────────────────────────────────
export const CANON_ENTRIES = [
  // ── Start Here ────────────────────────────────────────────────────────────
  {
    id: 'canon-001',
    title: 'AI Brought Me Out of Retirement',
    subtitle: "Here's Why I'm Launching the Region's First AI-Powered Marketing Agency",
    summary: "Rick Hesse's story — 45 years of entrepreneurial experience, from waterbeds to TV advertising to AI-powered marketing. Why he came back.",
    content_type: 'Article',
    primary_theme: 'Founder Journey',
    secondary_themes: ['AI & Technology', 'Business Philosophy'],
    series: 'Start Here',
    original_url: '/ai-brought-me-out-of-retirement',
    slug: 'ai-brought-me-out-of-retirement',
    video_url: 'https://www.youtube.com/embed/UPPqjOPkHGc',
    featured: true,
    status: 'Published',
    estimated_read_time: 3,
    difficulty: 'Beginner',
    search_keywords: 'rick hesse,retirement,ai marketing,mason city,founding story,waterbeds,television,agency',
    call_to_action: 'Request Your Free Gap Audit|/gap-audit',
  },
  {
    id: 'canon-002',
    title: 'I Was Early Again',
    subtitle: 'A Pattern of Seeing What Others Miss',
    summary: "Rick reflects on a career-long pattern of adopting technology before the mainstream — and what that means for the businesses he serves today.",
    content_type: 'Journal',
    primary_theme: 'Founder Journey',
    secondary_themes: ['AI & Technology', 'Leadership'],
    series: 'Start Here',
    original_url: '/i-was-early-again',
    slug: 'i-was-early-again',
    featured: true,
    status: 'Published',
    estimated_read_time: 4,
    difficulty: 'Beginner',
    search_keywords: 'early adopter,technology,vision,pattern recognition,innovation',
    call_to_action: 'Start the Growth Conversation|/growth-conversation',
  },

  // ── The NTA Principles ────────────────────────────────────────────────────
  {
    id: 'canon-003',
    title: 'Growth Systems vs. Campaigns',
    subtitle: 'Why One-Off Campaigns Fail and Systems Win',
    summary: 'The fundamental difference between throwing money at campaigns and building a marketing system that compounds over time.',
    content_type: 'Article',
    primary_theme: 'Growth Systems',
    secondary_themes: ['Business Philosophy', 'Sales & Authority'],
    series: 'The NTA Principles',
    original_url: '/growth-systems-vs-campaigns',
    slug: 'growth-systems-vs-campaigns',
    featured: true,
    status: 'Published',
    estimated_read_time: 5,
    difficulty: 'Beginner',
    search_keywords: 'growth systems,campaigns,marketing system,compound growth,strategy',
    call_to_action: 'See How Systems Work|/growth-guide',
  },
  {
    id: 'canon-004',
    title: 'Campaigns vs. Authority',
    subtitle: 'Stop Renting Attention — Start Owning It',
    summary: 'Why building authority in your market is more valuable than any ad campaign. The long game that actually works.',
    content_type: 'Article',
    primary_theme: 'Sales & Authority',
    secondary_themes: ['Growth Systems', 'Business Philosophy'],
    series: 'The NTA Principles',
    original_url: '/campaigns-vs-authority',
    slug: 'campaigns-vs-authority',
    status: 'Published',
    estimated_read_time: 6,
    difficulty: 'Intermediate',
    search_keywords: 'authority,campaigns,brand building,attention,market leadership',
    call_to_action: 'Build Your Authority|/gap-audit',
  },
  {
    id: 'canon-005',
    title: 'The Future Belongs to Market Leaders',
    subtitle: 'Position Yourself Now or Get Left Behind',
    summary: 'The businesses that will thrive in 5 years are the ones building authority today. A look at what market leadership means in the AI era.',
    content_type: 'Article',
    primary_theme: 'Leadership',
    secondary_themes: ['Growth Systems', 'AI & Technology'],
    series: 'The NTA Principles',
    original_url: '/the-future-belongs-to-market-leaders',
    slug: 'the-future-belongs-to-market-leaders',
    status: 'Published',
    estimated_read_time: 5,
    difficulty: 'Intermediate',
    search_keywords: 'market leaders,future,authority,positioning,competitive advantage',
    call_to_action: 'Start Leading Your Market|/growth-conversation',
  },

  // ── Building Trust ────────────────────────────────────────────────────────
  {
    id: 'canon-006',
    title: 'Building Digital Trust',
    subtitle: 'The Foundation Every Local Business Needs',
    summary: 'How local businesses build digital trust through consistent online presence, reviews, and smart marketing. Trust is the new currency.',
    content_type: 'Article',
    primary_theme: 'Digital Trust & Reputation',
    secondary_themes: ['Local Marketing', 'Growth Systems'],
    series: 'Building Trust',
    original_url: '/building-digital-trust',
    slug: 'building-digital-trust',
    video_url: 'https://www.youtube.com/embed/E5vE1kXlAhw',
    status: 'Published',
    estimated_read_time: 6,
    difficulty: 'Beginner',
    search_keywords: 'digital trust,online presence,reviews,reputation,local business',
    call_to_action: 'Get Your Trust Audit|/gap-audit',
  },
  {
    id: 'canon-007',
    title: 'Reputation Is Now a Growth Engine',
    subtitle: 'Your Reviews Are Your Best Marketing',
    summary: "Your online reputation isn't just about damage control — it's your most powerful growth tool. How to turn reviews into revenue.",
    content_type: 'Article',
    primary_theme: 'Digital Trust & Reputation',
    secondary_themes: ['Growth Systems', 'Local Marketing'],
    series: 'Building Trust',
    original_url: '/reputation-is-now-a-growth-engine',
    slug: 'reputation-is-now-a-growth-engine',
    status: 'Published',
    estimated_read_time: 5,
    difficulty: 'Beginner',
    search_keywords: 'reputation,reviews,growth engine,online reviews,customer trust',
    call_to_action: 'Check Your Reputation|/gap-audit',
  },
  {
    id: 'canon-008',
    title: 'Web Accessibility & Trust',
    subtitle: 'Why ADA Compliance Is a Business Advantage',
    summary: 'Accessible websites build trust with every visitor. Why ADA compliance is not just legal protection — it\'s a competitive advantage.',
    content_type: 'Article',
    primary_theme: 'Web Accessibility',
    secondary_themes: ['Digital Trust & Reputation', 'Business Philosophy'],
    series: 'Building Trust',
    original_url: '/web-accessibility-trust',
    slug: 'web-accessibility-trust',
    status: 'Published',
    estimated_read_time: 5,
    difficulty: 'Intermediate',
    search_keywords: 'ada compliance,accessibility,website trust,ada,wcag,inclusive design',
    call_to_action: 'Check Your Accessibility|/accessible-websites',
  },
  {
    id: 'canon-009',
    title: 'Accessible Websites',
    subtitle: 'Building for Everyone',
    summary: 'A comprehensive guide to making your business website accessible to all users, including those with disabilities.',
    content_type: 'Article',
    primary_theme: 'Web Accessibility',
    secondary_themes: ['Digital Trust & Reputation'],
    series: 'Building Trust',
    original_url: '/accessible-websites',
    slug: 'accessible-websites',
    status: 'Published',
    estimated_read_time: 7,
    difficulty: 'Intermediate',
    search_keywords: 'accessible websites,ada,wcag,disability,inclusive,compliance',
    call_to_action: 'Get an Accessibility Audit|/gap-audit',
  },

  // ── The Future of Marketing ───────────────────────────────────────────────
  {
    id: 'canon-010',
    title: 'What Changed Online',
    subtitle: 'The Shift Every Business Owner Needs to Understand',
    summary: 'The internet changed how customers find, evaluate, and choose businesses. Here\'s what happened and what to do about it.',
    content_type: 'Article',
    primary_theme: 'AI & Technology',
    secondary_themes: ['Local Marketing', 'Growth Systems'],
    series: 'The Future of Marketing',
    original_url: '/what-changed-online',
    slug: 'what-changed-online',
    featured: true,
    status: 'Published',
    estimated_read_time: 5,
    difficulty: 'Beginner',
    search_keywords: 'online marketing,digital shift,customer behavior,search,ai search',
    call_to_action: 'See Where You Stand|/gap-audit',
  },
  {
    id: 'canon-011',
    title: 'Practical AI for Small Businesses',
    subtitle: 'No Hype — Just What Works',
    summary: 'Cut through the AI noise. Here are the practical, affordable ways small businesses are using AI to compete with bigger companies.',
    content_type: 'Learning Lesson',
    primary_theme: 'AI & Technology',
    secondary_themes: ['Business Philosophy', 'Local Marketing'],
    series: 'The Future of Marketing',
    original_url: '/practical-ai-for-small-businesses',
    slug: 'practical-ai-for-small-businesses',
    status: 'Published',
    estimated_read_time: 6,
    difficulty: 'Beginner',
    search_keywords: 'practical ai,small business ai,affordable ai,ai tools,automation',
    call_to_action: 'Get Your AI Readiness Score|/business-score',
  },
  {
    id: 'canon-012',
    title: 'SEO vs. AI Search',
    subtitle: 'The Rules Changed — Are You Ready?',
    summary: 'Traditional SEO is dying. AI search engines answer questions differently. Here\'s how to be visible in both worlds.',
    content_type: 'Article',
    primary_theme: 'AI & Technology',
    secondary_themes: ['Growth Systems', 'Local Marketing'],
    series: 'The Future of Marketing',
    original_url: '/seo-vs-ai-search',
    slug: 'seo-vs-ai-search',
    status: 'Published',
    estimated_read_time: 5,
    difficulty: 'Intermediate',
    search_keywords: 'seo,ai search,google,chatgpt,visibility,search optimization',
    call_to_action: 'Check Your AI Visibility|/gap-audit',
  },
  {
    id: 'canon-013',
    title: 'The Role of AI in Local Marketing',
    subtitle: 'How AI Levels the Playing Field',
    summary: 'AI gives small local businesses the same marketing power that used to require big budgets and big teams.',
    content_type: 'Article',
    primary_theme: 'AI & Technology',
    secondary_themes: ['Local Marketing', 'Growth Systems'],
    series: 'The Future of Marketing',
    original_url: '/role-of-ai-in-local-marketing',
    slug: 'role-of-ai-in-local-marketing',
    status: 'Published',
    estimated_read_time: 5,
    difficulty: 'Beginner',
    search_keywords: 'ai local marketing,small business,automation,level playing field',
    call_to_action: 'See AI in Action|/learning-center',
  },
  {
    id: 'canon-014',
    title: 'AI Visibility Basics',
    subtitle: 'Understanding How AI Sees Your Business',
    summary: 'A foundational guide to how AI search engines discover, evaluate, and recommend local businesses.',
    content_type: 'Learning Lesson',
    primary_theme: 'AI & Technology',
    secondary_themes: ['Local Marketing', 'Digital Trust & Reputation'],
    series: 'The Future of Marketing',
    original_url: '/ai-visibility-basics',
    slug: 'ai-visibility-basics',
    status: 'Published',
    estimated_read_time: 4,
    difficulty: 'Beginner',
    search_keywords: 'ai visibility,ai search,business visibility,ai discovery,seo basics',
    call_to_action: 'Check Your Visibility|/gap-audit',
  },

  // ── Building Better Businesses ────────────────────────────────────────────
  {
    id: 'canon-015',
    title: 'The Hidden Cost of Outdated Marketing',
    subtitle: "What You're Losing Every Month You Wait",
    summary: "Outdated marketing doesn't just underperform — it actively costs you customers. The hidden price of standing still.",
    content_type: 'Article',
    primary_theme: 'Business Philosophy',
    secondary_themes: ['Growth Systems', 'Local Marketing'],
    series: 'Building Better Businesses',
    original_url: '/hidden-cost-of-outdated-marketing',
    slug: 'hidden-cost-of-outdated-marketing',
    status: 'Published',
    estimated_read_time: 5,
    difficulty: 'Beginner',
    search_keywords: 'outdated marketing,cost,roi,waste,opportunity cost,modernize',
    call_to_action: 'Stop the Bleed|/gap-audit',
  },
  {
    id: 'canon-016',
    title: 'Digital Risks',
    subtitle: 'The Threats Hiding in Plain Sight',
    summary: 'From ADA lawsuits to invisible search presence — the digital risks that most small business owners don\'t know they\'re facing.',
    content_type: 'Article',
    primary_theme: 'Business Philosophy',
    secondary_themes: ['Web Accessibility', 'Digital Trust & Reputation'],
    series: 'Building Better Businesses',
    original_url: '/digital-risks',
    slug: 'digital-risks',
    status: 'Published',
    estimated_read_time: 5,
    difficulty: 'Beginner',
    search_keywords: 'digital risks,ada lawsuit,security,online threats,compliance',
    call_to_action: 'Assess Your Risk|/gap-audit',
  },
  {
    id: 'canon-017',
    title: 'Websites as Salespeople',
    subtitle: 'Your Website Should Close Deals While You Sleep',
    summary: "Your website isn't a brochure — it's your hardest-working employee. How to build a site that actually sells.",
    content_type: 'Article',
    primary_theme: 'Growth Systems',
    secondary_themes: ['Sales & Authority', 'Digital Trust & Reputation'],
    series: 'Building Better Businesses',
    original_url: '/websites-as-salespeople',
    slug: 'websites-as-salespeople',
    status: 'Published',
    estimated_read_time: 5,
    difficulty: 'Beginner',
    search_keywords: 'website,sales,conversion,lead generation,24/7,automation',
    call_to_action: 'Upgrade Your Sales Machine|/gap-audit',
  },
  {
    id: 'canon-018',
    title: 'Video Storytelling Builds Confidence',
    subtitle: 'Show Your Face — Build Your Business',
    summary: 'Why video is the most powerful trust-building tool for local businesses, and how to start without being a filmmaker.',
    content_type: 'Article',
    primary_theme: 'Video & Storytelling',
    secondary_themes: ['Digital Trust & Reputation', 'Sales & Authority'],
    series: 'Building Better Businesses',
    original_url: '/video-storytelling-builds-confidence',
    slug: 'video-storytelling-builds-confidence',
    status: 'Published',
    estimated_read_time: 5,
    difficulty: 'Beginner',
    search_keywords: 'video marketing,storytelling,trust,confidence,youtube,local video',
    call_to_action: 'Start Your Video Journey|/learning-center',
  },

  // ── Success Stories (Case Studies) ────────────────────────────────────────
  {
    id: 'canon-019',
    title: 'Johnson Heating & AC',
    subtitle: '14 Years of Partnership — From Print Ads to AI Marketing',
    summary: 'How a Mason City HVAC company evolved from traditional advertising to a full AI-powered marketing system over 14 years.',
    content_type: 'Case Study',
    primary_theme: 'Client Success',
    secondary_themes: ['Growth Systems', 'AI & Technology'],
    series: 'Success Stories',
    original_url: '/case-study/johnson-heating',
    slug: 'case-study-johnson-heating',
    featured: true,
    status: 'Published',
    estimated_read_time: 4,
    difficulty: 'Beginner',
    search_keywords: 'hvac,johnson heating,mason city,case study,14 years,client success',
    call_to_action: 'Get Results Like This|/gap-audit',
  },
  {
    id: 'canon-020',
    title: 'Monson Plumbing, Heating & Excavating',
    subtitle: 'Building Visibility for a Trusted Local Trade',
    summary: 'How a Mason City plumbing company built digital visibility while maintaining their trusted local reputation.',
    content_type: 'Case Study',
    primary_theme: 'Client Success',
    secondary_themes: ['Local Marketing', 'Digital Trust & Reputation'],
    series: 'Success Stories',
    original_url: '/case-study/monson-plumbing',
    slug: 'case-study-monson-plumbing',
    status: 'Published',
    estimated_read_time: 3,
    difficulty: 'Beginner',
    search_keywords: 'plumbing,monson,mason city,local business,case study',
    call_to_action: 'Start Your Growth Story|/gap-audit',
  },
  {
    id: 'canon-021',
    title: "Papa Everett's Pizza Co.",
    subtitle: 'A Restaurant Success Story',
    summary: "How a local pizza restaurant used digital marketing to increase visibility and foot traffic in a competitive market.",
    content_type: 'Case Study',
    primary_theme: 'Client Success',
    secondary_themes: ['Local Marketing', 'Video & Storytelling'],
    series: 'Success Stories',
    original_url: '/case-study/papa-everetts',
    slug: 'case-study-papa-everetts',
    status: 'Published',
    estimated_read_time: 3,
    difficulty: 'Beginner',
    search_keywords: 'restaurant,pizza,papa everetts,case study,local business',
    call_to_action: 'Write Your Success Story|/gap-audit',
  },
];

// ─── Collections ────────────────────────────────────────────────────────────
export const CANON_COLLECTIONS = [
  {
    slug: 'start-here',
    title: 'Start Here',
    subtitle: 'Meet Rick Hesse — the man behind the mission',
    purpose: "If you're new, start here. Understand who Rick is, why he built NTA, and the pattern that drives everything.",
    icon: 'Compass',
    color: 'blue',
    display_order: 1,
    featured: true,
    entries: ['canon-001', 'canon-002', 'canon-010'],
  },
  {
    slug: 'nta-principles',
    title: 'The NTA Principles',
    subtitle: 'The philosophy behind everything we build',
    purpose: 'The foundational beliefs that guide NTA. Growth is a system, not a campaign. Authority beats attention. The future rewards leaders.',
    icon: 'Lightbulb',
    color: 'amber',
    display_order: 2,
    featured: true,
    entries: ['canon-003', 'canon-004', 'canon-005'],
  },
  {
    slug: 'building-trust',
    title: 'Building Trust',
    subtitle: 'Trust is the currency of modern business',
    purpose: 'How local businesses earn, build, and protect trust in a digital world. Reviews, accessibility, reputation — the pillars of trust.',
    icon: 'Shield',
    color: 'emerald',
    display_order: 3,
    featured: false,
    entries: ['canon-006', 'canon-007', 'canon-008', 'canon-009'],
  },
  {
    slug: 'future-of-marketing',
    title: 'The Future of Marketing',
    subtitle: 'Where marketing is headed — and how to get there first',
    purpose: 'AI is rewriting the rules. These entries explain what changed, what matters now, and how small businesses stay visible.',
    icon: 'Rocket',
    color: 'purple',
    display_order: 4,
    featured: true,
    entries: ['canon-014', 'canon-010', 'canon-012', 'canon-013', 'canon-011'],
  },
  {
    slug: 'building-better-businesses',
    title: 'Building Better Businesses',
    subtitle: 'Practical strategies for growth',
    purpose: "The tactical side of Rick's philosophy. Hidden costs, digital risks, websites that sell, video that builds confidence.",
    icon: 'Building2',
    color: 'orange',
    display_order: 5,
    featured: false,
    entries: ['canon-015', 'canon-016', 'canon-017', 'canon-018'],
  },
  {
    slug: 'from-ricks-desk',
    title: "From Rick's Desk",
    subtitle: 'Personal reflections and founder wisdom',
    purpose: "Rick's personal journal entries, reflections, and lessons learned across 45 years of business. Raw, honest, unfiltered.",
    icon: 'PenTool',
    color: 'rose',
    display_order: 6,
    featured: false,
    entries: ['canon-001', 'canon-002'],
  },
  {
    slug: 'nta-journal',
    title: 'The NTA Journal',
    subtitle: 'Ongoing insights and updates',
    purpose: 'The living record of NTA — updates, insights, industry analysis, and observations as they happen.',
    icon: 'BookOpen',
    color: 'cyan',
    display_order: 7,
    featured: false,
    entries: [],
  },
  {
    slug: 'ai-learning-center',
    title: 'AI Learning Center',
    subtitle: 'Learn AI marketing at your own pace',
    purpose: 'Practical AI education for small business owners. No jargon, no hype — just what works, explained clearly.',
    icon: 'GraduationCap',
    color: 'indigo',
    display_order: 8,
    featured: false,
    entries: ['canon-011', 'canon-014', 'canon-012', 'canon-013'],
  },
  {
    slug: 'success-stories',
    title: 'Success Stories',
    subtitle: 'Real clients. Real results.',
    purpose: 'See what happens when local businesses commit to growth systems. Every story is a real client, a real journey, real results.',
    icon: 'Trophy',
    color: 'teal',
    display_order: 9,
    featured: true,
    entries: ['canon-019', 'canon-020', 'canon-021'],
  },
  {
    slug: 'legacy',
    title: 'Legacy',
    subtitle: 'Building something that outlasts the founder',
    purpose: "The bigger picture. NTA isn't just a business — it's a system designed to outlive any single person. The operating system, the brand, the mission.",
    icon: 'Landmark',
    color: 'red',
    display_order: 10,
    featured: false,
    entries: ['canon-005', 'canon-003'],
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Look up a canon entry by ID */
export function getCanonEntry(id) {
  return CANON_ENTRIES.find(e => e.id === id);
}

/** Look up a canon entry by slug */
export function getCanonEntryBySlug(slug) {
  return CANON_ENTRIES.find(e => e.slug === slug);
}

/** Look up a collection by slug */
export function getCollection(slug) {
  return CANON_COLLECTIONS.find(c => c.slug === slug);
}

/** Get all entries for a collection, in reading order */
export function getCollectionEntries(collectionSlug) {
  const col = getCollection(collectionSlug);
  if (!col) return [];
  return col.entries.map(id => getCanonEntry(id)).filter(Boolean);
}

/** Get total reading time for a collection */
export function getCollectionReadTime(collectionSlug) {
  const entries = getCollectionEntries(collectionSlug);
  return entries.reduce((sum, e) => sum + (e.estimated_read_time || 0), 0);
}

/** Get all unique themes from entries */
export function getAllThemes() {
  const themes = new Set();
  CANON_ENTRIES.forEach(e => {
    if (e.primary_theme) themes.add(e.primary_theme);
    (e.secondary_themes || []).forEach(t => themes.add(t));
  });
  return [...themes].sort();
}

/** Get all unique series names */
export function getAllSeries() {
  const series = new Set();
  CANON_ENTRIES.forEach(e => {
    if (e.series) series.add(e.series);
  });
  return [...series].sort();
}

/** Get all unique content types */
export function getAllContentTypes() {
  const types = new Set();
  CANON_ENTRIES.forEach(e => {
    if (e.content_type) types.add(e.content_type);
  });
  return [...types].sort();
}

/** Search canon entries by keyword */
export function searchCanon(query) {
  if (!query || !query.trim()) return CANON_ENTRIES.filter(e => e.status === 'Published');
  const q = query.toLowerCase();
  return CANON_ENTRIES.filter(e => {
    if (e.status !== 'Published') return false;
    return (
      e.title.toLowerCase().includes(q) ||
      (e.subtitle || '').toLowerCase().includes(q) ||
      (e.summary || '').toLowerCase().includes(q) ||
      (e.search_keywords || '').toLowerCase().includes(q) ||
      (e.primary_theme || '').toLowerCase().includes(q) ||
      (e.series || '').toLowerCase().includes(q)
    );
  });
}

/** Filter entries by theme, series, content type */
export function filterCanonEntries({ theme, series, contentType, featured } = {}) {
  return CANON_ENTRIES.filter(e => {
    if (e.status !== 'Published') return false;
    if (featured && !e.featured) return false;
    if (theme && e.primary_theme !== theme && !(e.secondary_themes || []).includes(theme)) return false;
    if (series && e.series !== series) return false;
    if (contentType && e.content_type !== contentType) return false;
    return true;
  });
}

/**
 * J-001 NTA Journal — Static Data Layer
 * Categories, series, helpers, and constants.
 */

export const JOURNAL_CATEGORIES = [
  'Building NTA', 'AI & Technology', 'Business Growth', 'Client Stories',
  'Industry Insights', 'Founder Reflections', 'Marketing Strategy', 'Leadership'
];

export const JOURNAL_CATEGORY_GUIDES = {
  'Building NTA': {
    eyebrow: 'Start with the foundation',
    title: 'How NTA is being built as a connected growth system',
    description: 'Read the ideas behind NTA, the Digital Growth Office, and the practical business systems being built in public.',
    collectionLabel: 'Business Foundations',
    collectionUrl: '/knowledge/business-foundations',
    resources: [
      { title: 'Why NTA Exists', url: '/knowledge/business-foundations/why-nta-exists' },
      { title: 'How Businesses Really Grow', url: '/knowledge/business-foundations/how-businesses-really-grow' },
      { title: 'Our Story', url: '/our-story' },
    ],
  },
  'AI & Technology': {
    eyebrow: 'Learn before adding another tool',
    title: 'Practical AI for small-business owners',
    description: 'Understand where AI can help, where human judgment still matters, and how to begin with the work instead of the technology.',
    collectionLabel: 'AI Foundations',
    collectionUrl: '/knowledge/ai-foundations',
    resources: [
      { title: 'Start With the Work, Not the Tool', url: '/knowledge/ai-foundations/start-with-the-work-not-the-tool' },
      { title: 'AI Needs Context Before It Can Be Helpful', url: '/knowledge/ai-foundations/ai-needs-context-before-it-can-be-helpful' },
      { title: 'Practical AI for Small Business', url: '/practical-ai-for-small-business' },
    ],
  },
  'Business Growth': {
    eyebrow: 'Build momentum that lasts',
    title: 'Growth is a system, not a collection of campaigns',
    description: 'Explore the lessons about sustainable growth, owned assets, patience, and the difference between activity and real momentum.',
    collectionLabel: 'The Truth About Business Growth',
    collectionUrl: '/knowledge/truth-about-business-growth',
    resources: [
      { title: 'Why Growth Is a System', url: '/knowledge/truth-about-business-growth/why-growth-is-a-system' },
      { title: 'The Difference Between Activity and Momentum', url: '/knowledge/truth-about-business-growth/the-difference-between-activity-and-momentum' },
      { title: "Businesses Don't Need More Marketing", url: '/knowledge/truth-about-business-growth/businesses-dont-need-more-marketing-they-need-a-better-growth-system' },
    ],
  },
  'Client Stories': {
    eyebrow: 'See the ideas in practice',
    title: 'Stories from businesses doing the work',
    description: 'These case studies show how connected digital systems can support established local businesses over time.',
    collectionLabel: 'Case Studies',
    collectionUrl: '/case-studies',
    resources: [
      { title: 'Johnson Heating & AC', url: '/case-studies/johnson-heating' },
      { title: 'Monson Plumbing', url: '/case-studies/monson-plumbing' },
    ],
  },
  'Industry Insights': {
    eyebrow: 'Understand the market around you',
    title: 'What customers notice, trust, and remember',
    description: 'Read the lessons about customer behavior, digital trust, and the signals that shape decisions before a sales conversation.',
    collectionLabel: 'What Is Digital Trust?',
    collectionUrl: '/knowledge/what-is-digital-trust',
    resources: [
      { title: 'Trust Begins Before the First Conversation', url: '/knowledge/how-customers-decide-who-to-trust/trust-begins-before-the-first-conversation' },
      { title: 'AI Is Changing How Customers Find Businesses', url: '/knowledge/what-is-digital-trust/ai-is-changing-how-customers-find-businesses' },
      { title: 'How Customers Decide Who to Trust', url: '/knowledge/how-customers-decide-who-to-trust' },
    ],
  },
  'Founder Reflections': {
    eyebrow: 'The founder journey',
    title: 'What Rick is learning while building NTA',
    description: 'A plainspoken look at the experiences, decisions, and lessons shaping the work behind New Tech Advertising.',
    collectionLabel: 'Business Foundations',
    collectionUrl: '/knowledge/business-foundations',
    resources: [
      { title: 'Why NTA Exists', url: '/knowledge/business-foundations/why-nta-exists' },
      { title: 'The Most Valuable Knowledge Usually Lives in the Owner’s Head', url: '/knowledge/turning-what-a-business-knows-into-an-asset/the-most-valuable-knowledge-usually-lives-in-the-owners-head' },
      { title: 'Our Story', url: '/our-story' },
    ],
  },
  'Marketing Strategy': {
    eyebrow: 'Replace disconnected tactics with understanding',
    title: 'Marketing that connects to the whole business',
    description: 'Explore why clear communication, trust, owned digital assets, and customer relationships matter more than adding isolated tactics.',
    collectionLabel: 'How Businesses Turn Trust Into Lasting Relationships',
    collectionUrl: '/knowledge/how-businesses-turn-trust-into-lasting-relationships',
    resources: [
      { title: "Marketing Isn't Magic", url: '/knowledge/business-foundations/marketing-isnt-magic' },
      { title: 'Why Traditional Marketing Is No Longer Enough', url: '/knowledge/how-businesses-turn-trust-into-lasting-relationships/why-traditional-marketing-is-no-longer-enough' },
      { title: 'Staying Connected Without Always Selling', url: '/knowledge/how-businesses-turn-trust-into-lasting-relationships/staying-connected-without-always-selling' },
    ],
  },
  'Leadership': {
    eyebrow: 'Make knowledge useful beyond one person',
    title: 'Turn experience into something the business can use',
    description: 'Learn how owners can preserve judgment, organize what they know, and build systems that support people without replacing leadership.',
    collectionLabel: 'Turning What a Business Knows Into an Asset',
    collectionUrl: '/knowledge/turning-what-a-business-knows-into-an-asset',
    resources: [
      { title: 'Your Business Knows More Than It Has Documented', url: '/knowledge/turning-what-a-business-knows-into-an-asset/your-business-knows-more-than-it-has-documented' },
      { title: 'Documenting a Process Makes Knowledge Repeatable', url: '/knowledge/turning-what-a-business-knows-into-an-asset/documenting-a-process-makes-knowledge-repeatable' },
      { title: 'AI Can Assist Judgment; It Cannot Own It', url: '/knowledge/ai-foundations/ai-can-assist-judgment-it-cannot-own-it' },
    ],
  },
};

export const CATEGORY_COLORS = {
  'Building NTA':         { bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/20' },
  'AI & Technology':      { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  'Business Growth':      { bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/20' },
  'Client Stories':       { bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/20' },
  'Industry Insights':    { bg: 'bg-sky-500/10',    text: 'text-sky-400',    border: 'border-sky-500/20' },
  'Founder Reflections':  { bg: 'bg-rose-500/10',   text: 'text-rose-400',   border: 'border-rose-500/20' },
  'Marketing Strategy':   { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  'Leadership':           { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
};

export const SECTION_LABELS = {
  from_ricks_desk: "From Rick's Desk",
  what_we_built: "What We Built",
  what_we_learned: "What We Learned",
  what_it_means_for_your_business: "What It Means For Your Business",
  this_weeks_challenge: "This Week's Challenge",
};

export const SECTION_ICONS = {
  from_ricks_desk: 'Pen',
  what_we_built: 'Hammer',
  what_we_learned: 'Lightbulb',
  what_it_means_for_your_business: 'Target',
  this_weeks_challenge: 'Rocket',
};

export const SECTION_ORDER = [
  'from_ricks_desk',
  'what_we_built',
  'what_we_learned',
  'what_it_means_for_your_business',
  'this_weeks_challenge',
];

/** Format issue date */
export function formatIssueDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

/** Format short date */
export function formatShortDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Calculate estimated read time from all sections */
export function estimateReadTime(issue) {
  const sections = SECTION_ORDER.map(k => issue[k] || '').join(' ');
  const words = sections.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** Generate issue slug from number and title */
export function generateIssueSlug(number, title) {
  const base = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  return `issue-${number}-${base}`;
}

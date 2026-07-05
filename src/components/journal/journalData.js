/**
 * J-001 NTA Journal — Static Data Layer
 * Categories, series, helpers, and constants.
 */

export const JOURNAL_CATEGORIES = [
  'Building NTA', 'AI & Technology', 'Business Growth', 'Client Stories',
  'Industry Insights', 'Founder Reflections', 'Marketing Strategy', 'Leadership'
];

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

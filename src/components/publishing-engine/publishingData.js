/**
 * P-001 NTA Publishing Engine — Static Data Layer
 * Channel configs, workflow states, helpers, and constants.
 */

// ── Channel Configuration ──────────────────────────────────────────────────
export const CHANNELS = {
  Website:        { label: 'Website',             icon: 'Globe',         color: 'blue',    maxChars: null,   supportsMedia: true,  supportsSchedule: true },
  Email:          { label: 'Email Newsletter',    icon: 'Mail',          color: 'purple',  maxChars: null,   supportsMedia: true,  supportsSchedule: true },
  Facebook:       { label: 'Facebook',            icon: 'Facebook',      color: 'sky',     maxChars: 63206,  supportsMedia: true,  supportsSchedule: true },
  LinkedIn:       { label: 'LinkedIn',            icon: 'Linkedin',      color: 'blue',    maxChars: 3000,   supportsMedia: true,  supportsSchedule: true },
  X:              { label: 'X (Twitter)',         icon: 'Twitter',       color: 'slate',   maxChars: 280,    supportsMedia: true,  supportsSchedule: true },
  GBP:            { label: 'Google Business',     icon: 'MapPin',        color: 'green',   maxChars: 1500,   supportsMedia: true,  supportsSchedule: true },
  YouTube:        { label: 'YouTube',             icon: 'Youtube',       color: 'red',     maxChars: 5000,   supportsMedia: true,  supportsSchedule: true },
  LearningCenter: { label: 'AI Learning Center',  icon: 'GraduationCap', color: 'amber',   maxChars: null,   supportsMedia: true,  supportsSchedule: false },
  RSS:            { label: 'RSS Feed',            icon: 'Rss',           color: 'orange',  maxChars: null,   supportsMedia: false, supportsSchedule: false },
  Archive:        { label: 'Archive',             icon: 'Archive',       color: 'slate',   maxChars: null,   supportsMedia: false, supportsSchedule: false },
};

export const CHANNEL_LIST = Object.keys(CHANNELS);

// ── Workflow States ────────────────────────────────────────────────────────
export const WORKFLOW_STATES = {
  Draft:    { label: 'Draft',    color: 'slate',  icon: 'FileEdit',    next: 'Review',   description: 'Content is being written' },
  Review:   { label: 'Review',   color: 'amber',  icon: 'Eye',         next: 'Approved', description: 'Waiting for CEO review' },
  Approved: { label: 'Approved', color: 'blue',   icon: 'CheckCircle', next: 'Queued',   description: 'Approved, ready to queue' },
  Queued:   { label: 'Queued',   color: 'purple', icon: 'Clock',       next: 'Published',description: 'Scheduled for publishing' },
  Published:{ label: 'Published',color: 'green',  icon: 'Send',        next: null,       description: 'Live across channels' },
  Archived: { label: 'Archived', color: 'slate',  icon: 'Archive',     next: null,       description: 'Removed from active rotation' },
};

export const WORKFLOW_ORDER = ['Draft', 'Review', 'Approved', 'Queued', 'Published'];

// ── Publishing Target States ───────────────────────────────────────────────
export const TARGET_STATES = {
  Pending:    { label: 'Pending',    color: 'slate',  icon: 'Circle' },
  Adapted:    { label: 'Adapted',    color: 'blue',   icon: 'FileCheck' },
  Scheduled:  { label: 'Scheduled',  color: 'purple', icon: 'CalendarClock' },
  Publishing: { label: 'Publishing', color: 'amber',  icon: 'Loader2' },
  Published:  { label: 'Published',  color: 'green',  icon: 'CheckCircle2' },
  Failed:     { label: 'Failed',     color: 'red',    icon: 'AlertCircle' },
  Skipped:    { label: 'Skipped',    color: 'slate',  icon: 'SkipForward' },
};

// ── Content Types ──────────────────────────────────────────────────────────
export const CONTENT_TYPES = [
  'Article', 'Journal', 'Video', 'Learning Lesson',
  'Case Study', 'Podcast', 'Interview', 'Announcement'
];

// ── Themes ─────────────────────────────────────────────────────────────────
export const THEMES = [
  'AI & Technology', 'Business Growth', 'Digital Trust', 'Local Marketing',
  'Founder Wisdom', 'SEO & Visibility', 'Content Strategy', 'Client Success',
  'Web Strategy', 'Industry Trends', 'NTA Philosophy', 'Leadership'
];

// ── YouTube Playlists ──────────────────────────────────────────────────────
export const YOUTUBE_PLAYLISTS = [
  'Start Here', 'NTA Journal', 'Marketing Lessons', 'AI Explained',
  'Business Growth', 'Website Strategy', 'Local Business', 'Case Studies'
];

// ── Default Schedule ───────────────────────────────────────────────────────
export const DEFAULT_SCHEDULE = {
  day: 'Monday',
  time: '07:00',
  timezone: 'America/Chicago',
};

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// ── Color Utilities ────────────────────────────────────────────────────────
export const STATUS_COLORS = {
  slate:  { bg: 'bg-slate-500/10',  text: 'text-slate-400',  border: 'border-slate-500/20',  dot: 'bg-slate-400',  solid: 'bg-slate-600' },
  amber:  { bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/20',  dot: 'bg-amber-400',  solid: 'bg-amber-600' },
  blue:   { bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/20',   dot: 'bg-blue-400',   solid: 'bg-blue-600' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', dot: 'bg-purple-400', solid: 'bg-purple-600' },
  green:  { bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/20',  dot: 'bg-green-400',  solid: 'bg-green-600' },
  red:    { bg: 'bg-red-500/10',    text: 'text-red-400',    border: 'border-red-500/20',    dot: 'bg-red-400',    solid: 'bg-red-600' },
  sky:    { bg: 'bg-sky-500/10',    text: 'text-sky-400',    border: 'border-sky-500/20',    dot: 'bg-sky-400',    solid: 'bg-sky-600' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', dot: 'bg-orange-400', solid: 'bg-orange-600' },
};

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Get the next Monday at 7am from today */
export function getNextDefaultSchedule() {
  const now = new Date();
  const day = now.getDay();
  const daysUntilMonday = day === 0 ? 1 : day === 1 ? 7 : 8 - day;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntilMonday);
  const yyyy = next.getFullYear();
  const mm = String(next.getMonth() + 1).padStart(2, '0');
  const dd = String(next.getDate()).padStart(2, '0');
  return { date: `${yyyy}-${mm}-${dd}`, time: DEFAULT_SCHEDULE.time };
}

/** Count targets by status for an article */
export function countTargetsByStatus(targets) {
  const counts = {};
  for (const t of targets) {
    counts[t.status] = (counts[t.status] || 0) + 1;
  }
  return counts;
}

/** Calculate channel coverage for an article */
export function getChannelCoverage(targets) {
  const published = targets.filter(t => t.status === 'Published').length;
  return { published, total: CHANNEL_LIST.length, percent: Math.round((published / CHANNEL_LIST.length) * 100) };
}

/** Format date for display */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Format date + time */
export function formatDateTime(dateStr, timeStr) {
  if (!dateStr) return '—';
  const label = formatDate(dateStr);
  return timeStr ? `${label} at ${timeStr}` : label;
}

/** Generate slug from title */
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

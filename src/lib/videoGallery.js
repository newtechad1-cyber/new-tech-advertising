export const GALLERY_CATEGORY_ORDER = [
  'Growth Show', 'AI & Business', 'Websites & Visibility', 'Video Work', 'Relationships & Opportunities',
];

const LEGACY_CATEGORY_NAMES = {
  'AI Tools': 'AI & Business',
  'Local SEO': 'Websites & Visibility',
  'Marketing Strategy': 'AI & Business',
};

export function galleryCategoryFor(video) {
  if (GALLERY_CATEGORY_ORDER.includes(video.galleryCategory)) return video.galleryCategory;
  const title = String(video.title || '').toLowerCase();
  if (/growth show/.test(title)) return 'Growth Show';
  if (/video|storytelling|commercial|ctv/.test(title)) return 'Video Work';
  if (/website|seo|search|visibility|reputation|digital trust|authority/.test(title)) return 'Websites & Visibility';
  if (/relationship|opportunity|sales rep|selling|commission|rochester|driving all day/.test(title)) return 'Relationships & Opportunities';
  return 'AI & Business';
}

export function normalizeGalleryVideo(video) {
  if (!video || !/^[A-Za-z0-9_-]{11}$/.test(video.youtubeId || '')) return null;
  if (video.status && video.status !== 'published') return null;
  if (video.visibility && video.visibility !== 'Public') return null;
  const title = String(video.title || '').trim().slice(0, 500);
  if (!title || /^(private|deleted) video$/i.test(title)) return null;
  const youtubeId = video.youtubeId;
  const publishedAt = Number.isFinite(Date.parse(video.publishedAt)) ? video.publishedAt : '';
  const description = String(video.summary || video.description || '')
    .split(/\n\s*\n/)[0].replace(/https?:\/\/\S+/g, '').replace(/\s+/g, ' ').trim();
  return {
    ...video,
    id: youtubeId,
    youtubeId,
    title,
    publishedAt,
    date: publishedAt,
    description: description.slice(0, 1200),
    summary: description.length > 190 ? description.slice(0, 187).replace(/\s+\S*$/, '') + '…' : description,
    youtubeUrl: 'https://www.youtube.com/watch?v=' + youtubeId,
    embedUrl: 'https://www.youtube-nocookie.com/embed/' + youtubeId + '?rel=0',
    thumbnail: 'https://i.ytimg.com/vi/' + youtubeId + '/hqdefault.jpg',
    galleryCategory: galleryCategoryFor(video),
    status: 'published',
  };
}

// The feed contains recent public uploads. Keep the verified selection as well,
// so older useful videos do not disappear when they leave YouTube's Atom feed.
export function mergeGalleryVideos(liveVideos = [], verifiedVideos = []) {
  const byId = new Map();
  for (const candidate of [...verifiedVideos, ...liveVideos]) {
    const existing = byId.get(candidate?.youtubeId);
    const video = normalizeGalleryVideo({ ...existing, ...candidate });
    if (video) byId.set(video.youtubeId, video);
  }
  return [...byId.values()].sort((a, b) =>
    (Date.parse(b.publishedAt) || 0) - (Date.parse(a.publishedAt) || 0)
    || a.title.localeCompare(b.title)
  );
}

export function galleryCategories(videos) {
  return GALLERY_CATEGORY_ORDER.filter(category => videos.some(video => video.galleryCategory === category));
}

export function resolveGalleryCategory(value, categories) {
  const category = LEGACY_CATEGORY_NAMES[value] || value;
  return categories.includes(category) ? category : 'All';
}

export function filterGalleryVideos(videos, category = 'All', query = '') {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return videos.filter(video => {
    if (category !== 'All' && video.galleryCategory !== category) return false;
    const haystack = [video.title, video.summary, video.galleryCategory].join(' ').toLowerCase();
    return words.every(word => haystack.includes(word));
  });
}

export function galleryDateLabel(value) {
  if (!value || !Number.isFinite(Date.parse(value))) return '';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(value));
}

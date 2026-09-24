import { VERIFIED_VIDEO_SELECTION } from './videoGallery.js';
import { readingForVideo } from './videoLearningConnections.js';

// Only videos with a useful, distinct on-site watch experience belong here.
// Other verified uploads remain discoverable through the gallery and YouTube.
export const VIDEO_WATCH_IDS = [
  'PmXSEkj03ak', '6lhiYFHFsCQ', 'S-hRkzo6_3M', 'Wz9Gqshyk3o',
  'CbNxn-P74D8', 'scPcJSMFn-E', '6kB55gnGGHo', 'MsiyOAZrCNo',
  '3_P36VrK9jc', 'elcnGAfYdgk',
  'odp74hcdjEA', 'Wkm8FfpxBl0', 'tmpy20Xz1vU',
];

export const VIDEO_WATCH_PAGES = VIDEO_WATCH_IDS.map(id => {
  const source = VERIFIED_VIDEO_SELECTION.find(video => video.youtubeId === id);
  if (!source) throw new Error('Unverified video watch page: ' + id);
  const isGrowthShow = source.relatedUrl?.startsWith('/growth-show/');
  const reading = readingForVideo(id);
  return {
    id,
    title: source.title,
    description: source.summary || ('Watch ' + source.title + ' from New Tech Advertising, then explore related practical business and AI learning.'),
    path: isGrowthShow ? source.relatedUrl : '/learning-center/videos/' + id,
    category: isGrowthShow ? 'Growth Show' : (source.galleryCategory || 'NTA video'),
    youtubeUrl: 'https://www.youtube.com/watch?v=' + id,
    embedUrl: 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0',
    thumbnailUrl: 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg',
    publishedAt: source.publishedAt || null,
    relatedUrl: !isGrowthShow ? source.relatedUrl || null : null,
    reading: reading ? { title: reading.title, href: reading.href } : null,
  };
});

const videosById = new Map(VIDEO_WATCH_PAGES.map(video => [video.id, video]));
const videosByPath = new Map(VIDEO_WATCH_PAGES.map(video => [video.path.toLowerCase(), video]));

export function getVideoWatchById(id) {
  return videosById.get(id) || null;
}

export function getVideoWatchByPath(pathname) {
  return videosByPath.get(String(pathname || '').replace(/\/+$/, '').toLowerCase()) || null;
}

export function videoSchemaFor(video) {
  // Google requires the real upload date. Never substitute a site build date.
  if (!video?.publishedAt) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.publishedAt,
    embedUrl: video.embedUrl,
    url: 'https://newtechadvertising.com' + video.path,
    publisher: { '@type': 'Organization', name: 'New Tech Advertising', url: 'https://newtechadvertising.com' },
  };
}

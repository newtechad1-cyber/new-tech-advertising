import { VERIFIED_VIDEO_SELECTION } from './videoGallery.js';

export const VIDEO_GALLERY_PATH = '/learning-center/videos';

// Editorial topic connections, not claims that a video is a word-for-word
// recording of the lesson. Add only verified public videos and existing pages.
export const VIDEO_READING_CONNECTIONS = [
  { videoId: 'PmXSEkj03ak', title: 'Understanding Before Spending', href: '/knowledge/business-foundations/understanding-before-spending' },
  { videoId: '6lhiYFHFsCQ', title: 'AI Finally Taught Me How to Multitask', href: '/knowledge/ai-foundations/ai-finally-taught-me-how-to-multitask' },
  { videoId: 'S-hRkzo6_3M', title: 'Businesses Don’t Need More Marketing. They Need a Better Growth System.', href: '/knowledge/truth-about-business-growth/businesses-dont-need-more-marketing-they-need-a-better-growth-system' },
  { videoId: '6kB55gnGGHo', title: 'Why Growth Is a System', href: '/knowledge/truth-about-business-growth/why-growth-is-a-system' },
  { videoId: 'CbNxn-P74D8', title: 'Start With the Work, Not the Tool', href: '/knowledge/ai-foundations/start-with-the-work-not-the-tool' },
  { videoId: 'scPcJSMFn-E', title: 'Start With the Work, Not the Tool', href: '/knowledge/ai-foundations/start-with-the-work-not-the-tool' },
  { videoId: 'MsiyOAZrCNo', title: 'Why NTA Exists', href: '/knowledge/business-foundations/why-nta-exists' },
  { videoId: '3_P36VrK9jc', title: 'Customers Trust Evidence More Than Claims', href: '/knowledge/how-customers-decide-who-to-trust/customers-trust-evidence-more-than-claims' },
  { videoId: 'elcnGAfYdgk', title: 'Your Website Is No Longer Just a Website', href: '/knowledge/what-is-digital-trust/your-website-is-no-longer-just-a-website' },
];

export function readingForVideo(videoId) {
  return VIDEO_READING_CONNECTIONS.find(connection => connection.videoId === videoId) || null;
}

export function videoWatchPath(video) {
  return video.relatedUrl?.startsWith('/growth-show/') ? video.relatedUrl : VIDEO_GALLERY_PATH + '/' + video.youtubeId;
}

export function videosForReading(path) {
  return VIDEO_READING_CONNECTIONS.filter(connection => connection.href === path).flatMap(connection => {
    const video = VERIFIED_VIDEO_SELECTION.find(item => item.youtubeId === connection.videoId);
    return video ? [{ path: videoWatchPath(video), title: video.title, kind: 'video' }] : [];
  });
}

export const READ_WATCH_TOPICS = ['PmXSEkj03ak', '6lhiYFHFsCQ', 'S-hRkzo6_3M'].map(videoId => ({
  ...readingForVideo(videoId),
  video: VERIFIED_VIDEO_SELECTION.find(video => video.youtubeId === videoId),
}));

// Representative public work, not a ranking by views or a claim about results.
// Public visibility and channel ownership checked on September 17, 2026.
export const VIDEO_WORK_EXAMPLES = [
  { videoId: 'tmpy20Xz1vU', label: 'Brand message · 41 seconds', note: 'A short introduction to Johnson Heating and the services homeowners can ask about.' },
  { videoId: 'odp74hcdjEA', label: 'Business profile · 25 seconds', note: 'A brief introduction to Monson’s plumbing, boiler, and excavating work.' },
  { videoId: 'Wkm8FfpxBl0', label: 'Business profile · 25 seconds', note: 'A compact introduction to Johnson Heating for people getting to know the business.' },
  { videoId: 'PmXSEkj03ak', label: 'Educational conversation', note: 'The Growth Show format gives a business idea more room for explanation and discussion.' },
].map(example => ({
  ...example,
  video: VERIFIED_VIDEO_SELECTION.find(video => video.youtubeId === example.videoId),
}));

export const CLIENT_SHOWCASE_PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLJV5UUFb70wIuvctlDWxkkn_vFvRc9OUg';

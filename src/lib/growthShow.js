const DEFAULT_BOOKS = [
  {
    slug: 'better-business-book',
    title: 'The Better Business Book',
    description: 'A practical foundation for building a stronger local business.',
  },
  {
    slug: 'practical-ai-for-small-business',
    title: 'Practical AI for Small Business',
    description: 'Plainspoken guidance for using AI in useful, responsible ways.',
  },
];

const DEFAULT_SOCIAL_LINKS = [
  { platform: 'Facebook', label: 'NTA on Facebook', url: 'https://www.facebook.com/newtechadvertising' },
  { platform: 'LinkedIn', label: 'Rick Hesse on LinkedIn', url: 'https://www.linkedin.com/in/rick-hesse-64755946/' },
  { platform: 'YouTube', label: 'NTA on YouTube', url: 'https://www.youtube.com/@RickHesse' },
];

function unique(values) {
  return [...new Set((values || []).filter(Boolean))];
}

function episodeSlug(video, article, overlay) {
  return overlay?.slug || video.source_asset_slug || article?.slug || video.youtube_video_id;
}

function resolveJournalLinks(overlay, journals, video) {
  const requested = new Set(overlay?.related_journal_issue_ids || []);
  const videoKeys = new Set([video.id, video.youtube_video_id].filter(Boolean));

  return (journals || []).filter(issue => (
    requested.has(issue.id) ||
    requested.has(issue.slug) ||
    requested.has(String(issue.issue_number)) ||
    (issue.related_video_ids || []).some(id => videoKeys.has(id))
  ));
}

export function buildGrowthShowEpisodes({ videos = [], articles = [], journals = [], episodeRecords = [], websiteStories = [] }) {
  const byCanonId = new Map();
  const bySlug = new Map();
  const videosById = new Map();
  const videosByCanon = new Map();

  for (const article of articles) {
    if (article.canon_id) byCanonId.set(article.canon_id, article);
    if (article.id) byCanonId.set(article.id, article);
    if (article.slug) bySlug.set(article.slug, article);
  }

  for (const video of videos) {
    if (video.youtube_video_id) videosById.set(video.youtube_video_id, video);
    if (video.source_canon_id) videosByCanon.set(video.source_canon_id, video);
  }

  const websiteOnlyRecords = (websiteStories || []).map(story => ({
    id: story.id,
    title: story.title,
    summary: story.summary,
    slug: story.slug,
    status: story.publish_status === 'published' ? 'Published' : story.publish_status,
    published_date: story.published_at || story.created_date,
    website_video_url: story.video_url,
    thumbnail_url: story.thumbnail_url,
    website_story_id: story.id,
  }));

  // A public show episode must be explicitly classified. Ordinary long-form
  // videos remain in the Learning Center and cannot become show episodes just
  // because they happen to be published on YouTube. A published WebsiteVideoStory
  // is also eligible so the website can go live before YouTube distribution.
  const allRecords = [...episodeRecords, ...websiteOnlyRecords];
  const recordByKey = new Map();
  for (const record of allRecords) {
    if (record.status !== 'Published' || (!record.youtube_video_id && !record.website_video_url)) continue;
    const key = record.slug || record.youtube_video_id || record.id;
    const existing = recordByKey.get(key);
    if (!existing || record.youtube_video_id || !existing.youtube_video_id) {
      recordByKey.set(key, record);
    }
  }

  return [...recordByKey.values()]
    .map((overlay) => {
      const matchedVideo = videosById.get(overlay.youtube_video_id) ||
        videosByCanon.get(overlay.source_canon_id);
      const video = matchedVideo || {
        id: `growth-show-video-${overlay.youtube_video_id}`,
        video_title: overlay.title,
        description: overlay.summary,
        youtube_video_id: overlay.youtube_video_id,
        video_url: overlay.website_video_url || `https://www.youtube.com/watch?v=${overlay.youtube_video_id}`,
        source_canon_id: overlay.source_canon_id,
        source_asset_slug: overlay.source_article_slug || overlay.slug,
        asset_format: 'Long Form',
        playlist_slug: overlay.playlist_slug || 'nta-growth-show',
        publish_status: 'Published',
        visibility: 'Public',
        published_date: overlay.published_date,
      };
      const article = byCanonId.get(overlay.source_canon_id || video.source_canon_id) ||
        bySlug.get(overlay.source_article_slug || video.source_asset_slug) ||
        null;
      const lessonIds = unique([
        overlay.source_canon_id,
        video.source_canon_id,
        ...(overlay.related_lesson_canon_ids || []),
        ...(article?.related_lesson_ids || []),
      ]);
      const lessons = lessonIds.map(id => byCanonId.get(id)).filter(Boolean);
      const journalsForEpisode = resolveJournalLinks(overlay, journals, video);
      const bookSlugs = overlay.related_book_slugs?.length
        ? overlay.related_book_slugs
        : DEFAULT_BOOKS.map(book => book.slug);
      const books = bookSlugs.map(slug => DEFAULT_BOOKS.find(book => book.slug === slug) || {
        slug,
        title: slug.replaceAll('-', ' '),
        description: 'Related NTA publication',
      });

      return {
        id: overlay.id || video.id || `growth-show-${video.youtube_video_id}`,
        episodeNumber: overlay.episode_number || null,
        title: overlay.title || video.video_title || article?.title,
        slug: episodeSlug(video, article, overlay),
        summary: overlay.summary || article?.summary || video.description || 'A practical NTA Growth Show conversation for small business owners.',
        status: overlay.status,
        publishedDate: overlay.published_date || video.published_date || article?.published_date || '',
        featured: Boolean(overlay.featured),
        thumbnailUrl: overlay.thumbnail_url || video.thumbnail_url || (video.youtube_video_id ? `https://i.ytimg.com/vi/${video.youtube_video_id}/hqdefault.jpg` : ''),
        youtubeVideoId: video.youtube_video_id || null,
        youtubeUrl: video.youtube_video_id ? (video.video_url || `https://www.youtube.com/watch?v=${video.youtube_video_id}`) : '',
        videoUrl: video.video_url || overlay.website_video_url || '',
        video,
        article,
        lessons,
        journals: journalsForEpisode,
        books,
        socialAssets: overlay.social_assets?.length ? overlay.social_assets : DEFAULT_SOCIAL_LINKS,
        downloadableResources: overlay.downloadable_resources || [],
        podcastUrl: overlay.podcast_url || '',
        ctaText: overlay.cta_text || article?.cta_text || 'Start a Growth Conversation',
        ctaUrl: overlay.cta_url || article?.cta_url || '/growth-conversation',
        publishingArticleId: overlay.publishing_article_id || video.source_article_id || article?.id || '',
        sourceCanonId: overlay.source_canon_id || video.source_canon_id || article?.canon_id || '',
      };
    })
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (a.publishedDate !== b.publishedDate) return (b.publishedDate || '').localeCompare(a.publishedDate || '');
      return (b.episodeNumber || 0) - (a.episodeNumber || 0);
    });
}

export function findGrowthShowEpisode(episodes, slug) {
  return (episodes || []).find(episode => (
    episode.slug === slug ||
    episode.youtubeVideoId === slug ||
    String(episode.episodeNumber || '') === slug
  )) || null;
}

export { DEFAULT_BOOKS, DEFAULT_SOCIAL_LINKS };

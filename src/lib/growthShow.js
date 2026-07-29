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

export function buildGrowthShowEpisodes({ videos = [], articles = [], journals = [], episodeRecords = [] }) {
  const byCanonId = new Map(articles.map(article => [article.canon_id, article]));
  const overlaysByVideo = new Map();
  const overlaysByCanon = new Map();

  for (const record of episodeRecords) {
    if (record.youtube_video_id) overlaysByVideo.set(record.youtube_video_id, record);
    if (record.source_canon_id) overlaysByCanon.set(record.source_canon_id, record);
  }

  return videos
    .filter(video => (
      video.publish_status === 'Published' &&
      video.visibility !== 'Private' &&
      video.asset_format !== 'Short' &&
      video.youtube_video_id
    ))
    .map((video, index) => {
      const overlay = overlaysByVideo.get(video.youtube_video_id) || overlaysByCanon.get(video.source_canon_id);
      const article = byCanonId.get(overlay?.source_canon_id || video.source_canon_id) || null;
      const lessonIds = unique([
        overlay?.source_canon_id,
        video.source_canon_id,
        ...(overlay?.related_lesson_canon_ids || []),
        ...(article?.related_lesson_ids || []),
      ]);
      const lessons = lessonIds.map(id => byCanonId.get(id)).filter(Boolean);
      const journalsForEpisode = resolveJournalLinks(overlay, journals, video);
      const bookSlugs = overlay?.related_book_slugs?.length
        ? overlay.related_book_slugs
        : DEFAULT_BOOKS.map(book => book.slug);
      const books = bookSlugs.map(slug => DEFAULT_BOOKS.find(book => book.slug === slug) || {
        slug,
        title: slug.replaceAll('-', ' '),
        description: 'Related NTA publication',
      });

      return {
        id: overlay?.id || video.id || `growth-show-${video.youtube_video_id}`,
        episodeNumber: overlay?.episode_number || null,
        title: overlay?.title || video.video_title || article?.title,
        slug: episodeSlug(video, article, overlay),
        summary: overlay?.summary || article?.summary || video.description || 'A practical NTA Growth Show conversation for small business owners.',
        status: overlay?.status || 'Published',
        publishedDate: overlay?.published_date || video.published_date || article?.published_date || '',
        featured: Boolean(overlay?.featured) || index === 0,
        thumbnailUrl: overlay?.thumbnail_url || video.thumbnail_url || `https://i.ytimg.com/vi/${video.youtube_video_id}/hqdefault.jpg`,
        youtubeVideoId: video.youtube_video_id,
        youtubeUrl: video.video_url || `https://www.youtube.com/watch?v=${video.youtube_video_id}`,
        video,
        article,
        lessons,
        journals: journalsForEpisode,
        books,
        socialAssets: overlay?.social_assets?.length ? overlay.social_assets : DEFAULT_SOCIAL_LINKS,
        downloadableResources: overlay?.downloadable_resources || [],
        podcastUrl: overlay?.podcast_url || '',
        ctaText: overlay?.cta_text || article?.cta_text || 'Start a Growth Conversation',
        ctaUrl: overlay?.cta_url || article?.cta_url || '/growth-conversation',
        publishingArticleId: overlay?.publishing_article_id || video.source_article_id || article?.id || '',
        sourceCanonId: overlay?.source_canon_id || video.source_canon_id || article?.canon_id || '',
      };
    })
    .filter(episode => episode.status === 'Published')
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

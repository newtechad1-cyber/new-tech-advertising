/**
 * Resolve a YouTube result to its canonical NTA lesson.
 *
 * Matching order is intentional:
 * 1. A YouTubeKnowledge record supplies the permanent Canon identity.
 * 2. A direct YouTube ID supports records that have not been migrated yet.
 * 3. A slug supports older website content as a final compatibility fallback.
 */
export function findCanonicalLearningMatch(youtubeVideo, learningContent, youtubeKnowledge = []) {
  const knowledgeRecord = youtubeKnowledge.find(record =>
    record.youtube_video_id && record.youtube_video_id === youtubeVideo.youtubeId
  );

  if (knowledgeRecord?.source_canon_id) {
    const canonMatch = learningContent.find(content =>
      content.canonId === knowledgeRecord.source_canon_id
    );
    if (canonMatch) {
      return { content: canonMatch, matchedBy: 'canon_id', knowledgeRecord };
    }
  }

  if (knowledgeRecord?.source_asset_slug) {
    const sourceSlugMatch = learningContent.find(content =>
      content.slug === knowledgeRecord.source_asset_slug
    );
    if (sourceSlugMatch) {
      return { content: sourceSlugMatch, matchedBy: 'source_asset_slug', knowledgeRecord };
    }
  }

  const videoIdMatch = learningContent.find(content =>
    content.youtubeId && content.youtubeId === youtubeVideo.youtubeId
  );
  if (videoIdMatch) {
    return { content: videoIdMatch, matchedBy: 'youtube_id', knowledgeRecord: knowledgeRecord || null };
  }

  const slugMatch = learningContent.find(content =>
    content.slug === youtubeVideo.slug
  );
  if (slugMatch) {
    return { content: slugMatch, matchedBy: 'slug', knowledgeRecord: knowledgeRecord || null };
  }

  return { content: null, matchedBy: null, knowledgeRecord: knowledgeRecord || null };
}

export function getCanonicalVideosForArticle(article, youtubeKnowledge = []) {
  if (!article) return [];

  const byCanonicalIdentity = youtubeKnowledge.filter(video =>
    article.canon_id && video.source_canon_id === article.canon_id
  );
  const legacyVideoIds = new Set(article.related_video_ids || []);
  const byLegacyVideoId = youtubeKnowledge.filter(video =>
    video.youtube_video_id && legacyVideoIds.has(video.youtube_video_id)
  );

  const seen = new Set();
  return [...byCanonicalIdentity, ...byLegacyVideoId]
    .filter(video => {
      const identity = video.youtube_video_id || video.id;
      if (!identity || seen.has(identity)) return false;
      seen.add(identity);
      return true;
    })
    .map(video => ({
      ...video,
      title: video.video_title || video.title,
      canon_id: video.source_canon_id || video.youtube_video_id,
    }));
}

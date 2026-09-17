import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { LEARNING_CONTENT, LEARNING_CATEGORIES } from '@/utils/learningData';
import { findCanonicalLearningMatch } from '@/lib/youtubeLearningIdentity';
import { VERIFIED_VIDEO_SELECTION } from '@/data/videoGallery';
import { mergeGalleryVideos } from '@/lib/videoGallery';

function learningContentFromVideos(liveVideos, feedStatus) {
  const videos = mergeGalleryVideos(liveVideos, VERIFIED_VIDEO_SELECTION).map(video => {
    const publicIdentity = video.canonId ? [{ youtube_video_id: video.youtubeId, source_canon_id: video.canonId }] : [];
    const identityMatch = findCanonicalLearningMatch(video, LEARNING_CONTENT, publicIdentity);
    const localMatch = identityMatch.content;
    const category = localMatch?.category || (video.galleryCategory === 'Websites & Visibility'
      ? 'Local SEO' : video.galleryCategory === 'AI & Business' ? 'AI Tools' : 'Marketing Strategy');
    const categoryId = localMatch?.categoryId || ({ 'Local SEO': 'local-seo', 'AI Tools': 'ai-tools', 'Marketing Strategy': 'marketing-strategy' })[category];
    return {
      ...video,
      canonId: localMatch?.canonId || video.canonId || null,
      slug: localMatch?.slug || video.slug,
      category,
      categoryId,
      tags: localMatch?.tags || [],
      hasArticle: Boolean(localMatch),
      matchedBy: identityMatch.matchedBy,
    };
  });
  return { videos, categories: LEARNING_CATEGORIES, articles: LEARNING_CONTENT, feedStatus };
}

const selectedVideos = learningContentFromVideos([], 'loading');

export function useLearningContent() {
  return useQuery({
    queryKey: ['learning-content-youtube'],
    queryFn: async () => {
      try {
        const response = await base44.functions.invoke('getYouTubePlaylist', {});
        if (!Array.isArray(response.data?.videos) || !response.data.videos.length) {
          throw new Error('No public YouTube videos returned');
        }
        return learningContentFromVideos(response.data.videos, response.data.stale ? 'saved' : 'live');
      } catch {
        // Only verified public videos are used here. Planned lessons and internal
        // YouTubeKnowledge records must never become public gallery results.
        return learningContentFromVideos([], 'saved');
      }
    },
    placeholderData: selectedVideos,
    staleTime: 1000 * 60 * 15,
    refetchInterval: 1000 * 60 * 15,
    retry: false,
  });
}

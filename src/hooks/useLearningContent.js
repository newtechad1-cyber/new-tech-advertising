import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { LEARNING_CONTENT, LEARNING_CATEGORIES } from '@/utils/learningData';

export function useLearningContent() {
  return useQuery({
    queryKey: ['learning-content-youtube'],
    queryFn: async () => {
      try {
        const response = await base44.functions.invoke('getYouTubePlaylist', {});
        const ytVideos = response.data.videos || [];

        const mergedVideos = ytVideos.map(yt => {
          // Find matching local content by slug or exact youtube ID
          const localMatch = LEARNING_CONTENT.find(lc => 
            lc.slug === yt.slug || (lc.youtubeId && lc.youtubeId === yt.youtubeId)
          );
          
          return {
            id: yt.youtubeId,
            title: yt.title,
            slug: localMatch ? localMatch.slug : yt.slug,
            description: yt.description || localMatch?.shortDescription || '',
            category: localMatch?.category || 'Uncategorized',
            categoryId: localMatch?.categoryId || 'uncategorized',
            youtubeId: yt.youtubeId,
            youtubeUrl: yt.youtubeUrl,
            embedUrl: yt.embedUrl,
            thumbnail: yt.thumbnailUrl || localMatch?.thumbnailImage,
            duration: yt.duration,
            status: 'published',
            tags: localMatch?.tags || [],
            hasArticle: !!localMatch
          };
        });

        // Add local planned/placeholder videos that aren't on YouTube yet
        const plannedVideos = LEARNING_CONTENT.filter(lc => !lc.youtubeId).map(item => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            category: item.category,
            categoryId: item.categoryId,
            duration: '',
            youtubeId: item.youtubeId,
            thumbnail: item.thumbnailImage,
            description: item.shortDescription,
            status: 'planned',
            tags: item.tags,
            hasArticle: true
        }));

        return {
          videos: [...mergedVideos, ...plannedVideos],
          categories: LEARNING_CATEGORIES,
          articles: LEARNING_CONTENT
        };
      } catch (error) {
        console.error("Error fetching YouTube playlist:", error);
        // Fallback to local data if API fails
        const fallbackVideos = LEARNING_CONTENT.map(item => ({
          id: item.youtubeId || item.id,
          title: item.title,
          slug: item.slug,
          category: item.category,
          categoryId: item.categoryId,
          duration: '',
          youtubeId: item.youtubeId,
          thumbnail: item.thumbnailImage,
          description: item.shortDescription,
          status: item.youtubeId ? 'published' : 'planned',
          tags: item.tags,
          hasArticle: true
        }));
        return { videos: fallbackVideos, categories: LEARNING_CATEGORIES, articles: LEARNING_CONTENT };
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });
}
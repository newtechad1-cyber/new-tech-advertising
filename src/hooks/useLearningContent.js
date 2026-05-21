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

          let autoCategory = 'Uncategorized';
          let autoCategoryId = 'uncategorized';
          
          if (!localMatch) {
             const title = yt.title.toLowerCase();
             if (title.includes('seo') || title.includes('search') || title.includes('visibility') || title.includes('zero click')) {
                 autoCategory = 'AI Visibility & Search';
                 autoCategoryId = 'ai-visibility-search';
             } else if (title.includes('trust') || title.includes('reputation') || title.includes('review') || title.includes('authority') || title.includes('recommending')) {
                 autoCategory = 'Digital Trust & Reputation';
                 autoCategoryId = 'digital-trust-reputation';
             } else if (title.includes('system') || title.includes('website') || title.includes('outdated') || title.includes('campaign')) {
                 autoCategory = 'Modern Marketing Systems';
                 autoCategoryId = 'modern-marketing-systems';
             } else if (title.includes('video') || title.includes('ctv') || title.includes('storytelling') || title.includes('tv')) {
                 autoCategory = 'Video & CTV Marketing';
                 autoCategoryId = 'video-ctv-marketing';
             } else {
                 autoCategory = 'AI Basics For Small Businesses';
                 autoCategoryId = 'ai-basics-small-businesses';
             }
          }
          
          return {
            id: yt.youtubeId,
            title: yt.title,
            slug: localMatch ? localMatch.slug : yt.slug,
            description: yt.description || localMatch?.shortDescription || '',
            category: localMatch?.category || autoCategory,
            categoryId: localMatch?.categoryId || autoCategoryId,
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
    staleTime: 1000 * 60 * 15, // 15 minutes cache
    refetchInterval: 1000 * 60 * 15, // Auto-refresh every 15 mins
  });
}
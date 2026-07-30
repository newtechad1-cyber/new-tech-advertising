import { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useKnowledgeGraph } from '@/lib/knowledgeGraph';
import { buildGrowthShowEpisodes } from '@/lib/growthShow';
import {
  GROWTH_SHOW_SOURCE_ARTICLES,
  SEED_GROWTH_SHOW_EPISODES,
} from '@/data/growthShowEpisodes';

function mergeEpisodeRecords(seedRecords, entityRecords) {
  const byVideoId = new Map(seedRecords.map(record => [record.youtube_video_id, record]));
  for (const record of entityRecords) {
    byVideoId.set(record.youtube_video_id || record.id, record);
  }
  return [...byVideoId.values()];
}

function mergeSourceArticles(articles, sourceArticles) {
  const existing = new Set(articles.flatMap(article => [article.canon_id, article.slug]).filter(Boolean));
  return [
    ...articles,
    ...sourceArticles.filter(article => !existing.has(article.canon_id) && !existing.has(article.slug)),
  ];
}

export function useGrowthShow() {
  const knowledge = useKnowledgeGraph();
  const [episodeRecords, setEpisodeRecords] = useState([]);
  const [episodeRecordsLoading, setEpisodeRecordsLoading] = useState(true);

  useEffect(() => {
    base44.entities.GrowthShowEpisode.list('-published_date', 200)
      .then(setEpisodeRecords)
      .catch(() => setEpisodeRecords([]))
      .finally(() => setEpisodeRecordsLoading(false));
  }, []);

  const episodes = useMemo(() => buildGrowthShowEpisodes({
    videos: knowledge.videos,
    articles: mergeSourceArticles(knowledge.articles, GROWTH_SHOW_SOURCE_ARTICLES),
    journals: knowledge.journals,
    episodeRecords: mergeEpisodeRecords(SEED_GROWTH_SHOW_EPISODES, episodeRecords),
  }), [knowledge.videos, knowledge.articles, knowledge.journals, episodeRecords]);

  return {
    episodes,
    loading: knowledge.loading || episodeRecordsLoading,
    error: knowledge.error,
    refresh: knowledge.refresh,
  };
}

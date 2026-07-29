import { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useKnowledgeGraph } from '@/lib/knowledgeGraph';
import { buildGrowthShowEpisodes } from '@/lib/growthShow';

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
    articles: knowledge.articles,
    journals: knowledge.journals,
    episodeRecords,
  }), [knowledge.videos, knowledge.articles, knowledge.journals, episodeRecords]);

  return {
    episodes,
    loading: knowledge.loading || episodeRecordsLoading,
    error: knowledge.error,
    refresh: knowledge.refresh,
  };
}

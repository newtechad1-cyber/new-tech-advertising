import React from 'react';
import LCVideoCard from './LCVideoCard';
import { useLearningContent } from '@/hooks/useLearningContent';

export default function LCRelatedVideos({ currentVideoId, category, limit = 3 }) {
  const { data, isLoading } = useLearningContent();
  const videos = data?.videos || [];

  if (isLoading) return null;

  // Filter out current, prioritize same category
  let related = videos.filter(v => v.id !== currentVideoId);
  if (category) {
    const sameCat = related.filter(v => v.category === category);
    const otherCat = related.filter(v => v.category !== category);
    related = [...sameCat, ...otherCat];
  }
  
  related = related.slice(0, limit);

  if (related.length === 0) return null;

  return (
    <div className="pt-12 mb-12 border-t border-slate-800">
      <h3 className="text-2xl font-black text-white mb-6">Related Videos</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map(video => (
          <LCVideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
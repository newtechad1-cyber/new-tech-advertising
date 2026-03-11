import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import VideoCard from './VideoCard';

export default function VideoGridView({
  videos,
  publishJobs,
  selectedVideos,
  onSelectVideo,
  onSelectAll,
}) {
  const allSelected = videos.length > 0 && videos.every(v => selectedVideos.has(v.id));

  return (
    <div className="space-y-4">
      {videos.length > 0 && (
        <div className="flex items-center gap-2 p-4 bg-white rounded-lg border border-slate-200">
          <Checkbox
            checked={allSelected}
            onCheckedChange={(checked) => onSelectAll(checked)}
          />
          <span className="text-sm text-slate-600">
            {selectedVideos.size > 0 ? `${selectedVideos.size} selected` : 'Select all visible'}
          </span>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(video => (
          <div key={video.id} className="relative group">
            <Checkbox
              checked={selectedVideos.has(video.id)}
              onCheckedChange={(checked) => onSelectVideo(video.id, checked)}
              className="absolute top-3 left-3 z-10"
            />
            <VideoCard video={video} publishJobs={publishJobs} />
          </div>
        ))}
      </div>
    </div>
  );
}
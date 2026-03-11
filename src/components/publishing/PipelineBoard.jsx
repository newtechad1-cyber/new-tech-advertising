import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Play, RotateCcw, Eye } from 'lucide-react';

const PIPELINE_STAGES = [
  { id: 'processing', label: 'Processing', color: 'bg-slate-50', border: 'border-slate-200' },
  { id: 'ready_review', label: 'Ready for Review', color: 'bg-blue-50', border: 'border-blue-200' },
  { id: 'approved', label: 'Approved', color: 'bg-green-50', border: 'border-green-200' },
  { id: 'scheduled', label: 'Scheduled', color: 'bg-amber-50', border: 'border-amber-200' },
  { id: 'publishing', label: 'Publishing', color: 'bg-purple-50', border: 'border-purple-200' },
  { id: 'published', label: 'Published', color: 'bg-emerald-50', border: 'border-emerald-200' },
  { id: 'failed', label: 'Failed / Blocked', color: 'bg-red-50', border: 'border-red-200' },
];

export default function PipelineBoard({ videos, onVideoClick }) {
  const groupedByStage = {};
  
  PIPELINE_STAGES.forEach(stage => {
    groupedByStage[stage.id] = [];
  });

  videos.forEach(video => {
    const status = video.processing_status || 'processing';
    let stage = 'processing';

    if (status === 'approved') stage = 'approved';
    else if (status === 'scheduled') stage = 'scheduled';
    else if (status === 'publishing') stage = 'publishing';
    else if (status === 'published') stage = 'published';
    else if (status === 'failed' || status === 'rejected') stage = 'failed';
    else if (status === 'ready_for_review') stage = 'ready_review';

    if (groupedByStage[stage]) {
      groupedByStage[stage].push(video);
    }
  });

  return (
    <div className="px-6 py-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">Publishing Pipeline</h2>
        <p className="text-sm text-gray-600">Drag to move, click to view details</p>
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map(stage => {
          const stageVideos = groupedByStage[stage.id];

          return (
            <div
              key={stage.id}
              className={`flex-1 min-w-[280px] ${stage.color} ${stage.border} border rounded-lg p-4`}
            >
              {/* Stage Header */}
              <div className="mb-4 pb-3 border-b">
                <h3 className="font-semibold text-gray-900 text-sm">{stage.label}</h3>
                <div className="text-2xl font-bold text-gray-700 mt-1">{stageVideos.length}</div>
              </div>

              {/* Stage Cards */}
              <div className="space-y-2">
                {stageVideos.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 text-xs">No items</div>
                ) : (
                  stageVideos.map(video => (
                    <div
                      key={video.id}
                      onClick={() => onVideoClick(video)}
                      className="bg-white border rounded-lg p-3 hover:shadow-md cursor-pointer transition-shadow"
                    >
                      {/* Thumbnail */}
                      {video.thumbnail_url && (
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                      )}

                      {/* Title */}
                      <h4 className="text-xs font-semibold text-gray-900 truncate mb-1">
                        {video.title}
                      </h4>

                      {/* Meta */}
                      <div className="text-xs text-gray-600 mb-2">
                        <p>{video.brand_name || 'Company'}</p>
                      </div>

                      {/* Destination Count */}
                      <div className="text-xs font-medium text-gray-700 mb-2">
                        {video.facebook_publish_enabled && <span>📘 </span>}
                        {video.instagram_publish_enabled && <span>📷 </span>}
                        {video.youtube_publish_enabled && <span>▶️ </span>}
                        {video.tiktok_publish_enabled && <span>🎵 </span>}
                        {video.website_publish_enabled && <span>🌐 </span>}
                      </div>

                      {/* Status Badge */}
                      <Badge variant="outline" className="text-xs">
                        {video.processing_status || 'pending'}
                      </Badge>

                      {/* Actions */}
                      <div className="flex gap-1 mt-2">
                        {stage.id === 'ready_review' && (
                          <button className="flex-1 text-xs bg-blue-100 text-blue-700 rounded py-1 hover:bg-blue-200 transition-colors flex items-center justify-center gap-1">
                            <Eye className="w-3 h-3" />
                            Review
                          </button>
                        )}
                        {stage.id === 'publishing' && (
                          <button className="flex-1 text-xs bg-purple-100 text-purple-700 rounded py-1 hover:bg-purple-200 transition-colors flex items-center justify-center gap-1">
                            <Play className="w-3 h-3" />
                            Live
                          </button>
                        )}
                        {stage.id === 'failed' && (
                          <button className="flex-1 text-xs bg-red-100 text-red-700 rounded py-1 hover:bg-red-200 transition-colors flex items-center justify-center gap-1">
                            <RotateCcw className="w-3 h-3" />
                            Retry
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
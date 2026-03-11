import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Facebook, Instagram, Youtube, Music, Globe, ChevronRight, Zap } from 'lucide-react';
import { format } from 'date-fns';

export default function ApprovalCard({ video, onViewDetails, onApprove, onRejectSwipe }) {
  const [swipeX, setSwipeX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const platformIcons = {
    facebook: <Facebook className="w-4 h-4" />,
    instagram: <Instagram className="w-4 h-4" />,
    youtube: <Youtube className="w-4 h-4" />,
    tiktok: <Music className="w-4 h-4" />,
    website: <Globe className="w-4 h-4" />
  };

  const enabledPlatforms = [];
  if (video.facebook_publish_enabled) enabledPlatforms.push('facebook');
  if (video.instagram_publish_enabled) enabledPlatforms.push('instagram');
  if (video.youtube_publish_enabled) enabledPlatforms.push('youtube');
  if (video.tiktok_publish_enabled) enabledPlatforms.push('tiktok');
  if (video.website_publish_enabled) enabledPlatforms.push('website');

  const statusColors = {
    'Pending': 'bg-blue-100 text-blue-800',
    'Changes Requested': 'bg-amber-100 text-amber-800',
    'Scheduled': 'bg-purple-100 text-purple-800',
    'Published': 'bg-green-100 text-green-800'
  };

  const qualityScore = video.quality_score || 92;
  const qualityLabel = 
    qualityScore >= 95 ? 'Optimized for engagement' :
    qualityScore >= 90 ? 'Seasonal promotion' :
    'Educational content';

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setSwipeX(e.clientX);
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    const diff = e.clientX - swipeX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        onApprove?.(video);
      } else {
        onRejectSwipe?.(video);
      }
    }
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setSwipeX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!isDragging) return;
    const diff = e.changedTouches[0].clientX - swipeX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        onApprove?.(video);
      } else {
        onRejectSwipe?.(video);
      }
    }
    setIsDragging(false);
  };

  return (
    <Card 
      className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <CardContent className="p-0">
        <div className="flex gap-6 p-6">
          {/* Thumbnail */}
          <div className="flex-shrink-0 w-48 h-28 bg-slate-200 rounded-lg overflow-hidden">
            {video.thumbnail_url ? (
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
                <span className="text-slate-600 text-xs">No preview</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-slate-900 truncate">
                  {video.title}
                </h3>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                  {video.goal || 'Ready for your review'}
                </p>
              </div>
              <Badge className={statusColors[video.approval_status] || statusColors.Pending}>
                {video.approval_status || 'Needs Approval'}
              </Badge>
            </div>

            {/* Platforms & Schedule */}
            <div className="flex items-center gap-6 mb-4 text-sm">
              {enabledPlatforms.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">Publishing to:</span>
                  <div className="flex gap-2">
                    {enabledPlatforms.map(platform => (
                      <div key={platform} className="text-slate-600">
                        {platformIcons[platform]}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {video.scheduled_publish_at && (
                <div className="text-slate-600">
                  📅 {format(new Date(video.scheduled_publish_at), 'MMM d, yyyy')}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => onViewDetails(video)}
                className="gap-2"
              >
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(video)}
                className="gap-2"
              >
                View Details
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Clock } from 'lucide-react';
import ChannelPills from './ChannelPills';

export default function RichVideoPreviewCard({ video, onApprove, onReject, onSchedule }) {
  const getDestinations = () => {
    const destinations = [];
    if (video.website_publish_enabled) destinations.push('website');
    if (video.facebook_publish_enabled) destinations.push('facebook');
    if (video.instagram_publish_enabled) destinations.push('instagram');
    if (video.youtube_publish_enabled) destinations.push('youtube');
    if (video.tiktok_publish_enabled) destinations.push('tiktok');
    if (video.gbp_publish_enabled) destinations.push('gbp');
    return destinations;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden">
      <div className="grid grid-cols-4 gap-4 p-4">
        {/* Thumbnail */}
        <div className="col-span-1">
          <div className="relative aspect-video bg-slate-200 rounded-lg overflow-hidden">
            {video.thumbnail_url ? (
              <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                <span className="text-xs text-slate-500">No thumbnail</span>
              </div>
            )}
            <div className="absolute top-1 right-1">
              <Badge className="bg-slate-900 text-white text-xs">
                {video.orientation || 'landscape'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="col-span-2 space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 line-clamp-2">{video.title}</h3>
            <p className="text-xs text-slate-500 mt-1">{video.brand_name || 'Brand: TBD'}</p>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500">Caption Style</span>
                <p className="font-mono text-slate-700">{video.caption_style || 'clean_minimal'}</p>
              </div>
              <div>
                <span className="text-slate-500">Duration</span>
                <p className="font-mono text-slate-700">{video.duration_target || '60s'}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {video.show_cta_banner && <Badge variant="outline" className="text-xs">CTA Enabled</Badge>}
              {video.show_watermark && <Badge variant="outline" className="text-xs">Watermark</Badge>}
              {video.show_lower_third && <Badge variant="outline" className="text-xs">Lower Third</Badge>}
            </div>
          </div>
        </div>

        {/* Destinations & Actions */}
        <div className="col-span-1 space-y-3 flex flex-col justify-between">
          <div>
            <p className="text-xs text-slate-500 mb-2">Destinations</p>
            <ChannelPills channels={getDestinations()} compact />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white gap-1"
              onClick={() => onApprove(video.id)}
            >
              <Check className="w-3 h-3" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1"
              onClick={() => onSchedule(video.id)}
            >
              <Clock className="w-3 h-3" />
              Schedule
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700 gap-1"
              onClick={() => onReject(video.id)}
            >
              <X className="w-3 h-3" />
              Reject
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
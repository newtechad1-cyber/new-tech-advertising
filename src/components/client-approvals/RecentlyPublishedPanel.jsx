import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Facebook, Instagram, Youtube, Music, Globe } from 'lucide-react';
import { format } from 'date-fns';

export default function RecentlyPublishedPanel({ videos }) {
  const platformIcons = {
    facebook: <Facebook className="w-3 h-3" />,
    instagram: <Instagram className="w-3 h-3" />,
    youtube: <Youtube className="w-3 h-3" />,
    tiktok: <Music className="w-3 h-3" />,
    website: <Globe className="w-3 h-3" />
  };

  if (videos.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Recently Published</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            No published content yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Recently Published</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {videos.map(video => {
          const platforms = [];
          if (video.facebook_publish_enabled) platforms.push('facebook');
          if (video.instagram_publish_enabled) platforms.push('instagram');
          if (video.youtube_publish_enabled) platforms.push('youtube');
          if (video.tiktok_publish_enabled) platforms.push('tiktok');
          if (video.website_publish_enabled) platforms.push('website');

          return (
            <div key={video.id} className="pb-3 border-b border-slate-100 last:border-0 last:pb-0">
              <div className="flex gap-3">
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-16 h-16 bg-slate-200 rounded overflow-hidden">
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-300 to-green-400" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-slate-900 truncate">
                    {video.title}
                  </h4>
                  <div className="flex gap-2 mt-2">
                    {platforms.map(p => (
                      <div key={p} className="text-slate-600">
                        {platformIcons[p]}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* View Live Link */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 text-xs justify-center gap-1"
              >
                View Live
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function ScheduledContentPanel({ videos }) {
  if (videos.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Scheduled Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            No content currently scheduled.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Scheduled Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {videos.map(video => (
          <div key={video.id} className="flex gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
            {/* Thumbnail */}
            <div className="flex-shrink-0 w-16 h-16 bg-slate-200 rounded overflow-hidden">
              {video.thumbnail_url ? (
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-300" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-slate-900 truncate">
                {video.title}
              </h4>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                <Clock className="w-3 h-3" />
                {video.scheduled_publish_at && (
                  format(new Date(video.scheduled_publish_at), 'MMM d, yyyy')
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
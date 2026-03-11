import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Clock, Play, TrendingUp } from 'lucide-react';

const EVENT_ICONS = {
  video_approved: CheckCircle2,
  website_published: TrendingUp,
  facebook_failed: AlertCircle,
  youtube_connected: CheckCircle2,
  scheduled_activated: Clock,
  retry_completed: CheckCircle2,
};

const EVENT_COLORS = {
  video_approved: 'text-green-600 bg-green-50 border-green-200',
  website_published: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  facebook_failed: 'text-red-600 bg-red-50 border-red-200',
  youtube_connected: 'text-blue-600 bg-blue-50 border-blue-200',
  scheduled_activated: 'text-amber-600 bg-amber-50 border-amber-200',
  retry_completed: 'text-green-600 bg-green-50 border-green-200',
};

export default function ActivityFeed({ events }) {
  if (!events || events.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">No activity yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
      </div>

      {/* Events */}
      <div className="px-6 pb-6 space-y-3">
        {events.slice(0, 8).map((event, idx) => {
          const Icon = EVENT_ICONS[event.type] || Clock;
          const colors = EVENT_COLORS[event.type] || 'text-gray-600 bg-gray-50 border-gray-200';

          return (
            <div key={idx} className={`flex gap-3 p-3 rounded-lg border ${colors}`}>
              <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{event.message}</p>
                <p className="text-xs text-gray-600 mt-0.5">{event.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
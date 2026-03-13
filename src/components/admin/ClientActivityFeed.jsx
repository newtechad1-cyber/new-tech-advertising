import React from 'react';
import { UserPlus, CheckCircle, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ICON_MAP = {
  'user-plus': UserPlus,
  'check-circle': CheckCircle,
  'alert-circle': AlertTriangle,
  'trending-up': TrendingUp,
  clock: Clock,
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const days = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
};

export default function ClientActivityFeed({ events }) {
  if (events.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-8 text-center">
        <Clock className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-400">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
      <div className="p-6 border-b border-slate-700">
        <h3 className="font-semibold text-white text-lg">Client Activity Feed</h3>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {events.slice(0, 20).map((event, idx) => {
            const Icon = ICON_MAP[event.icon] || Clock;
            return (
              <div key={idx} className="flex gap-4">
                {/* Timeline Dot */}
                <div className="flex flex-col items-center">
                  <div className="p-2 bg-slate-700 rounded-full">
                    <Icon className="w-4 h-4 text-slate-300" />
                  </div>
                  {idx < events.length - 1 && (
                    <div className="w-1 h-12 bg-slate-700 mt-2" />
                  )}
                </div>

                {/* Event Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-white">{event.title}</h4>
                      <p className="text-sm text-slate-400 mt-1">
                        {event.description}
                      </p>
                    </div>
                    {event.severity && (
                      <Badge
                        className={
                          event.severity === 'high'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }
                      >
                        {event.severity}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    {formatDate(event.date)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
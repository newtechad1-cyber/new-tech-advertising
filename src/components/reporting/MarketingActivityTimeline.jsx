import React from 'react';
import { CheckCircle2, Video, Zap, Users } from 'lucide-react';

export default function MarketingActivityTimeline({ report }) {
  const activities = [
    {
      type: 'content',
      label: `${report.content_published_count || 0} pieces of content published`,
      icon: Video,
      color: 'text-blue-400',
    },
    {
      type: 'video',
      label: `${report.videos_created || 0} videos created`,
      icon: Zap,
      color: 'text-violet-400',
    },
    {
      type: 'approval',
      label: `${report.approval_activity_count || 0} approval activities`,
      icon: CheckCircle2,
      color: 'text-emerald-400',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white">Activity Timeline</h3>
      
      <div className="space-y-3">
        {activities.filter(a => {
          const value = parseInt(a.label.match(/\d+/)?.[0] || '0');
          return value > 0;
        }).map((activity, idx) => {
          const Icon = activity.icon;
          return (
            <div key={idx} className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
              <Icon className={`w-5 h-5 ${activity.color} flex-shrink-0`} />
              <p className="text-sm text-slate-300">{activity.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
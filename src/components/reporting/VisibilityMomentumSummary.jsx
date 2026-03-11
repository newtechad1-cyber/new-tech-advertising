import React from 'react';
import { TrendingUp, Video, Zap, Calendar } from 'lucide-react';

export default function VisibilityMomentumSummary({ report }) {
  const metrics = [
    {
      label: 'Content Published',
      value: report.content_published_count || 0,
      icon: Video,
      color: 'text-blue-400',
      bg: 'bg-blue-900/20',
    },
    {
      label: 'Videos Created',
      value: report.videos_created || 0,
      icon: Zap,
      color: 'text-violet-400',
      bg: 'bg-violet-900/20',
    },
    {
      label: 'Campaigns Active',
      value: report.campaigns_active || 0,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-900/20',
    },
    {
      label: 'Scheduled Content',
      value: report.scheduled_content_count || 0,
      icon: Calendar,
      color: 'text-amber-400',
      bg: 'bg-amber-900/20',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white">Marketing Activity</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className={`${metric.bg} border border-slate-700 rounded-lg p-4`}>
              <Icon className={`w-5 h-5 ${metric.color} mb-2`} />
              <p className="text-sm text-slate-400 mb-1">{metric.label}</p>
              <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
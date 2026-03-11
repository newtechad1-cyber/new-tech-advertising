import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { TrendingUp, Calendar, Globe, Send, AlertTriangle } from 'lucide-react';

export default function PublishingMomentumStrip() {
  const { data: publishJobs = [] } = useQuery({
    queryKey: ['publishing-momentum'],
    queryFn: () => base44.entities.VideoPublishJob?.list?.('-created_at', 500).catch(() => []),
  });

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const publishedToday = publishJobs.filter(j => {
    const jobDate = new Date(j.published_at || 0);
    return jobDate >= today;
  }).length;

  const scheduledNext7 = publishJobs.filter(j => {
    if (!j.scheduled_for) return false;
    const schedDate = new Date(j.scheduled_for);
    return schedDate >= today && schedDate <= sevenDaysFromNow;
  }).length;

  const failed = publishJobs.filter(j => j.job_status === 'failed').length;

  const metrics = [
    { label: 'Published Today', value: publishedToday, icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Scheduled (7d)', value: scheduledNext7, icon: Calendar, color: 'text-blue-400' },
    { label: 'Failed Jobs', value: failed, icon: AlertTriangle, color: 'text-red-400' },
  ];

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-4">
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="text-center">
              <Icon className={`w-5 h-5 ${metric.color} mx-auto mb-2`} />
              <p className="text-xs text-slate-400 mb-1">{metric.label}</p>
              <p className={`text-xl font-bold ${metric.color}`}>{metric.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
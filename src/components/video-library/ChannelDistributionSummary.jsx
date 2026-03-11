import React from 'react';
import { CheckCircle2, AlertCircle, Clock, XCircle } from 'lucide-react';

export default function ChannelDistributionSummary({ video, publishJobs }) {
  const channels = [
    { name: 'Website', key: 'website', enabled: video?.export_landscape },
    { name: 'Facebook', key: 'facebook', enabled: video?.facebook_publish_enabled },
    { name: 'Instagram', key: 'instagram', enabled: video?.instagram_publish_enabled },
    { name: 'YouTube', key: 'youtube', enabled: video?.youtube_publish_enabled },
    { name: 'TikTok', key: 'tiktok', enabled: video?.tiktok_publish_enabled },
  ];

  const getChannelStatus = (key) => {
    if (!channels.find(c => c.key === key)?.enabled) return { status: 'disabled', label: 'Not enabled', icon: XCircle };
    
    const job = publishJobs?.find(j => j.destination_type === key);
    if (!job) return { status: 'ready', label: 'Ready', icon: CheckCircle2 };
    if (job.job_status === 'published') return { status: 'published', label: 'Published', icon: CheckCircle2 };
    if (job.job_status === 'failed') return { status: 'blocked', label: 'Blocked', icon: AlertCircle };
    if (job.job_status === 'publishing') return { status: 'publishing', label: 'Publishing', icon: Clock };
    return { status: 'pending', label: 'Pending', icon: Clock };
  };

  const statusColors = {
    published: 'text-green-600',
    ready: 'text-blue-600',
    pending: 'text-yellow-600',
    publishing: 'text-purple-600',
    blocked: 'text-red-600',
    disabled: 'text-slate-400',
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-slate-700">Channel Distribution</p>
      <div className="flex gap-2 flex-wrap">
        {channels.map(ch => {
          const { status, label, icon: Icon } = getChannelStatus(ch.key);
          return (
            <div key={ch.key} className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-xs">
              <Icon className={`w-3 h-3 ${statusColors[status]}`} />
              <span className="text-slate-700">{ch.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
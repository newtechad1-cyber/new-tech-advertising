import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Clock, XCircle } from 'lucide-react';

export default function ChannelReadinessSidebar({ video, publishJobs }) {
  const channels = [
    { name: 'Website', key: 'website', enabled: video?.export_landscape },
    { name: 'Facebook', key: 'facebook', enabled: video?.facebook_publish_enabled },
    { name: 'Instagram', key: 'instagram', enabled: video?.instagram_publish_enabled },
    { name: 'YouTube', key: 'youtube', enabled: video?.youtube_publish_enabled },
    { name: 'TikTok', key: 'tiktok', enabled: video?.tiktok_publish_enabled },
  ];

  const getChannelStatus = (key) => {
    const channel = channels.find(c => c.key === key);
    if (!channel?.enabled) return { status: 'disabled', label: 'Not enabled', icon: XCircle, color: 'text-slate-400' };
    
    const job = publishJobs?.find(j => j.destination_type === key);
    if (!job) return { status: 'ready', label: 'Ready', icon: CheckCircle2, color: 'text-blue-600' };
    if (job.job_status === 'published') return { status: 'published', label: 'Published', icon: CheckCircle2, color: 'text-green-600' };
    if (job.job_status === 'failed') return { status: 'blocked', label: 'Failed', icon: AlertCircle, color: 'text-red-600' };
    if (job.job_status === 'publishing') return { status: 'publishing', label: 'Publishing...', icon: Clock, color: 'text-purple-600' };
    return { status: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-600' };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Channel Readiness</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {channels.map(ch => {
          const { status, label, icon: Icon, color } = getChannelStatus(ch.key);
          return (
            <div key={ch.key} className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">{ch.name}</span>
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-xs text-slate-600">{label}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
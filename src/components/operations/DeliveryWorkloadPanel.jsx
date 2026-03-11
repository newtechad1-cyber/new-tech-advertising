import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { AlertTriangle, Zap, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

export default function DeliveryWorkloadPanel() {
  const { data: videoRequests = [] } = useQuery({
    queryKey: ['delivery-video-requests'],
    queryFn: () => base44.entities.VideoRequests?.list?.('-created_date', 200).catch(() => []),
  });

  const { data: publishJobs = [] } = useQuery({
    queryKey: ['delivery-publish-jobs'],
    queryFn: () => base44.entities.VideoPublishJob?.list?.('-created_at', 200).catch(() => []),
  });

  const awaitingReview = videoRequests.filter(v => v.review_status === 'pending_review').length;
  const failed = publishJobs.filter(j => j.job_status === 'failed').length;
  const inQueue = publishJobs.filter(j => ['queued', 'preparing'].includes(j.job_status)).length;
  const scheduled = publishJobs.filter(j => j.job_status === 'scheduled').length;

  const workloadItems = [
    { label: 'Videos Awaiting Review', value: awaitingReview, icon: Clock, color: 'text-blue-400', critical: awaitingReview > 5 },
    { label: 'Renders In Queue', value: inQueue, icon: Zap, color: 'text-violet-400', critical: inQueue > 10 },
    { label: 'Scheduled Publishes', value: scheduled, icon: CheckCircle, color: 'text-emerald-400', critical: false },
    { label: 'Failed Jobs', value: failed, icon: AlertTriangle, color: 'text-red-400', critical: failed > 0 },
  ];

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
        <Zap className="w-5 h-5 text-violet-400" />
        Delivery Workload
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {workloadItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`border ${item.critical ? 'border-red-700 bg-red-900/20' : 'border-slate-700 bg-slate-800/50'} rounded-lg p-4`}
            >
              <div className="flex items-start justify-between mb-2">
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <p className="text-xs text-slate-400 mb-1">{item.label}</p>
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="space-y-2 border-t border-slate-700 pt-4">
        <Link to={createPageUrl('AdminVideoPublishing')}>
          <Button size="sm" variant="outline" className="w-full border-slate-700 text-slate-400 hover:text-white gap-2">
            <CheckCircle className="w-3 h-3" />
            Review Pending Videos
          </Button>
        </Link>
        {failed > 0 && (
          <Button size="sm" className="w-full bg-red-900/50 hover:bg-red-900 text-red-400 gap-2 border border-red-700">
            <AlertTriangle className="w-3 h-3" />
            Retry {failed} Failed Jobs
          </Button>
        )}
      </div>
    </div>
  );
}
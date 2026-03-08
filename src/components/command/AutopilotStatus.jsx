import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Zap, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const STATUS_CONFIG = {
  completed: { color: 'bg-emerald-900/40 text-emerald-400 border-emerald-800', icon: CheckCircle2, iconColor: 'text-emerald-400' },
  running: { color: 'bg-blue-900/40 text-blue-400 border-blue-800', icon: Loader2, iconColor: 'text-blue-400 animate-spin' },
  failed: { color: 'bg-red-900/40 text-red-400 border-red-800', icon: XCircle, iconColor: 'text-red-400' },
  pending: { color: 'bg-slate-700 text-slate-400', icon: Clock, iconColor: 'text-slate-400' },
  paused: { color: 'bg-slate-700 text-slate-400', icon: Clock, iconColor: 'text-slate-400' },
};

export default function AutopilotStatus() {
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['autopilot-jobs'],
    queryFn: () => base44.entities.AutopilotJobs.list('-last_run_date', 10)
  });

  return (
    <div>
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Autopilot Job Status</h2>
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-700">
          <Zap className="w-4 h-4 text-yellow-400" />
          <p className="text-sm font-semibold text-white">Recent Automation Runs</p>
          <span className="ml-auto text-xs text-slate-500">{jobs.filter(j => j.enabled).length} active</span>
        </div>

        {isLoading ? (
          <div className="p-6 text-center text-slate-500">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="p-6 text-center text-slate-500">No autopilot jobs configured yet.</div>
        ) : (
          <div className="divide-y divide-slate-700/50">
            {jobs.map(job => {
              const cfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.pending;
              const StatusIcon = cfg.icon;
              return (
                <div key={job.id} className="px-5 py-3 flex items-center gap-4">
                  <StatusIcon className={`w-4 h-4 shrink-0 ${cfg.iconColor}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{job.job_name}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {job.output_summary ? job.output_summary.slice(0, 80) + '...' : job.job_type}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge className={`text-xs ${cfg.color} mb-1`}>{job.status}</Badge>
                    <p className="text-xs text-slate-500">
                      {job.last_run_date
                        ? formatDistanceToNow(new Date(job.last_run_date), { addSuffix: true })
                        : 'Never run'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
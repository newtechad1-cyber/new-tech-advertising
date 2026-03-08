import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function FailuresPanel() {
  const qc = useQueryClient();

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['autopilot-failures'],
    queryFn: () => base44.entities.AutopilotJobs.filter({ status: 'failed' }, '-last_run_date', 20)
  });

  const retryMutation = useMutation({
    mutationFn: (job) =>
      base44.functions.invoke('runAutopilotJob', {
        job_type: job.job_type,
        related_service: job.related_service,
        related_city: job.related_city
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['autopilot-failures'] });
      qc.invalidateQueries({ queryKey: ['autopilot-jobs'] });
      toast.success('Job re-triggered successfully');
    },
    onError: () => toast.error('Failed to retry job')
  });

  if (isLoading) return <div className="p-8 text-center text-gray-400">Loading...</div>;

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-4 border-b flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-red-500" />
        <h2 className="font-semibold text-gray-800">Failed Jobs ({jobs.length})</h2>
      </div>
      <div className="divide-y">
        {jobs.map(job => (
          <div key={job.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-medium text-gray-800">{job.job_name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {job.job_type} · {job.last_run_date ? format(new Date(job.last_run_date), 'MMM d, yyyy h:mm a') : '—'}
                </p>
                {job.output_summary && (
                  <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700 border border-red-100">
                    {job.output_summary}
                  </div>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => retryMutation.mutate(job)}
                disabled={retryMutation.isPending}
              >
                <RefreshCw className="w-3 h-3 mr-1" /> Retry
              </Button>
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <div className="p-10 text-center text-gray-400">
            ✅ No failed jobs. All systems operational.
          </div>
        )}
      </div>
    </div>
  );
}
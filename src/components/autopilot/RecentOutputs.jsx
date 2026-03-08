import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

export default function RecentOutputs() {
  const [expanded, setExpanded] = useState(null);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['autopilot-outputs'],
    queryFn: () => base44.entities.AutopilotJobs.filter({ status: 'completed' }, '-last_run_date', 30)
  });

  if (isLoading) return <div className="p-8 text-center text-gray-400">Loading...</div>;

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-4 border-b flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-green-500" />
        <h2 className="font-semibold text-gray-800">Recent Outputs ({jobs.length})</h2>
      </div>
      <div className="divide-y">
        {jobs.map(job => (
          <div key={job.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800">{job.job_name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {job.job_type} · {job.last_run_date ? format(new Date(job.last_run_date), 'MMM d, yyyy h:mm a') : '—'}
                </p>
                {job.output_summary && expanded !== job.id && (
                  <p className="text-sm text-gray-500 mt-2 truncate">{job.output_summary}</p>
                )}
                {expanded === job.id && job.output_summary && (
                  <div className="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-600 whitespace-pre-wrap">
                    {job.output_summary}
                  </div>
                )}
              </div>
              {job.output_summary && (
                <button
                  onClick={() => setExpanded(expanded === job.id ? null : job.id)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0 mt-1"
                >
                  {expanded === job.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <div className="p-10 text-center text-gray-400">No completed job outputs yet.</div>
        )}
      </div>
    </div>
  );
}
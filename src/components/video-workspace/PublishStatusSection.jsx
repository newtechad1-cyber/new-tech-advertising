import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, Clock, RotateCcw } from 'lucide-react';

export default function PublishStatusSection({ video, publishJobs, onRetry }) {
  const activeJobs = publishJobs?.filter(j => j.video_id === video?.id) || [];
  
  if (activeJobs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Publishing Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-slate-600">No active publishing jobs</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Publishing Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeJobs.map(job => {
          const icons = {
            published: <CheckCircle2 className="w-4 h-4 text-green-600" />,
            failed: <AlertCircle className="w-4 h-4 text-red-600" />,
            publishing: <Clock className="w-4 h-4 text-purple-600" />,
            queued: <Clock className="w-4 h-4 text-yellow-600" />,
          };

          return (
            <div key={job.id} className="flex items-start justify-between gap-2 pb-3 border-b border-slate-200 last:border-0 last:pb-0">
              <div className="flex items-start gap-2 flex-1 min-w-0">
                {icons[job.job_status] || icons.queued}
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-700 capitalize">{job.destination_type}</p>
                  <p className="text-xs text-slate-500 capitalize">{job.job_status?.replace(/_/g, ' ')}</p>
                  {job.error_message && <p className="text-xs text-red-600 mt-1">{job.error_message}</p>}
                </div>
              </div>
              {job.job_status === 'failed' && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs flex-shrink-0"
                  onClick={() => onRetry?.()}
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
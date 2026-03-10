import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RotateCcw, Eye, Archive } from 'lucide-react';
import { toast } from 'sonner';

export default function FailedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await base44.asServiceRole.entities.AIJobs.filter(
          { status: 'failed' },
          '-created_date',
          50
        );
        setJobs(data);
      } catch (error) {
        console.error('Error loading failed jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const handleRetry = async (jobId) => {
    try {
      const job = jobs.find((j) => j.id === jobId);
      await base44.asServiceRole.entities.AIJobs.update(jobId, {
        status: 'pending',
        retry_count: (job.retry_count || 0) + 1,
      });
      toast.success('Job queued for retry');
      setJobs(jobs.filter((j) => j.id !== jobId));
    } catch (error) {
      toast.error(`Retry failed: ${error.message}`);
    }
  };

  const handleIgnore = async (jobId) => {
    try {
      await base44.asServiceRole.entities.AIJobs.update(jobId, {
        status: 'cancelled',
      });
      toast.success('Job marked as ignored');
      setJobs(jobs.filter((j) => j.id !== jobId));
    } catch (error) {
      toast.error(`Failed to ignore: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6 text-center">
          <p className="text-green-800 font-semibold">No failed jobs</p>
          <p className="text-green-600 text-sm mt-1">All AI jobs are running smoothly.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 font-semibold">{jobs.length} Failed Job(s)</p>
        <p className="text-red-600 text-sm mt-1">
          Review errors below and retry or mark as ignored.
        </p>
      </div>

      {jobs.map((job) => (
        <Card key={job.id} className="bg-white border-red-100">
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{job.function_name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {job.school_slug ? `School: ${job.school_slug}` : job.client_id ? `Client: ${job.client_id}` : 'No context'}
                </p>
              </div>
              <Badge className="bg-red-100 text-red-800">Failed</Badge>
            </div>

            {job.error_message && (
              <div className="bg-red-50 p-3 rounded border border-red-100">
                <p className="text-xs font-mono text-red-700 break-words">
                  {job.error_message}
                </p>
              </div>
            )}

            <div className="text-xs text-gray-600">
              <p>
                Created: {new Date(job.created_date).toLocaleString()} |
                Retries: {job.retry_count || 0}/{job.max_retries || 3}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => handleRetry(job.id)}
                disabled={job.retry_count >= (job.max_retries || 3)}
                size="sm"
                className="gap-1"
              >
                <RotateCcw className="w-4 h-4" />
                Retry
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Eye className="w-4 h-4" />
                Details
              </Button>
              <Button
                onClick={() => handleIgnore(job.id)}
                variant="outline"
                size="sm"
                className="gap-1"
              >
                <Archive className="w-4 h-4" />
                Ignore
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Pause,
  Play,
  Trash2,
  TrendingUp,
  Search,
  BarChart3,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  pauseJob,
  resumeJob,
  cancelJob,
  reprioritizeJob,
} from '@/components/ai-workforce/aiWorkforceOrchestrator';

export default function AdminAIOperations() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        if (currentUser?.role !== 'admin') {
          window.location.href = '/';
          return;
        }
        setUser(currentUser);
      } catch (error) {
        window.location.href = '/';
      }
    };
    loadUser();
  }, []);

  // Fetch all jobs
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['ai_jobs'],
    queryFn: async () => {
      return await base44.entities.AIJobQueue.list('-created_date', 500);
    },
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  // Job status mutations
  const pauseMutation = useMutation({
    mutationFn: pauseJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai_jobs'] });
    },
  });

  const resumeMutation = useMutation({
    mutationFn: resumeJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai_jobs'] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai_jobs'] });
    },
  });

  const reprioritizeMutation = useMutation({
    mutationFn: ({ jobId, priority }) => reprioritizeJob(jobId, priority),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai_jobs'] });
    },
  });

  // Calculate stats
  const stats = {
    total: jobs.length,
    queued: jobs.filter(j => j.status === 'queued').length,
    running: jobs.filter(j => j.status === 'running').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    failed: jobs.filter(j => j.status === 'failed').length,
    paused: jobs.filter(j => j.status === 'paused').length,
  };

  const categoryStats = {
    content_creation: jobs.filter(j => j.job_category === 'content_creation').length,
    strategy: jobs.filter(j => j.job_category === 'strategy').length,
    growth: jobs.filter(j => j.job_category === 'growth').length,
    retention: jobs.filter(j => j.job_category === 'retention').length,
  };

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchTerm ||
      job.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.client_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.job_type?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || job.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return <Zap className="w-4 h-4 text-blue-400 animate-pulse" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-amber-400" />;
      case 'queued':
        return <Clock className="w-4 h-4 text-slate-400" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-900 text-red-200',
      high: 'bg-orange-900 text-orange-200',
      medium: 'bg-blue-900 text-blue-200',
      low: 'bg-slate-700 text-slate-300',
    };
    return colors[priority] || 'bg-slate-700';
  };

  const getStatusColor = (status) => {
    const colors = {
      running: 'text-blue-400',
      completed: 'text-green-400',
      failed: 'text-red-400',
      paused: 'text-amber-400',
      queued: 'text-slate-400',
      cancelled: 'text-slate-500',
    };
    return colors[status] || 'text-slate-400';
  };

  if (!user) return null;

  return (
    <AdminLayout currentPageName="AdminAIOperations">
      <div className="min-h-screen bg-slate-950">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white">AI Workforce Operations</h1>
              <p className="text-slate-400 mt-1">Monitor and manage AI job queue and agent performance</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <div className="bg-slate-800 rounded p-3 border border-slate-700">
                <p className="text-slate-400 text-xs mb-1">Total Jobs</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-blue-900/30 rounded p-3 border border-blue-800">
                <p className="text-blue-300 text-xs mb-1">Running</p>
                <p className="text-2xl font-bold text-blue-200">{stats.running}</p>
              </div>
              <div className="bg-slate-700 rounded p-3 border border-slate-600">
                <p className="text-slate-300 text-xs mb-1">Queued</p>
                <p className="text-2xl font-bold text-slate-100">{stats.queued}</p>
              </div>
              <div className="bg-green-900/30 rounded p-3 border border-green-800">
                <p className="text-green-300 text-xs mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-200">{stats.completed}</p>
              </div>
              <div className="bg-red-900/30 rounded p-3 border border-red-800">
                <p className="text-red-300 text-xs mb-1">Failed</p>
                <p className="text-2xl font-bold text-red-200">{stats.failed}</p>
              </div>
              <div className="bg-amber-900/30 rounded p-3 border border-amber-800">
                <p className="text-amber-300 text-xs mb-1">Paused</p>
                <p className="text-2xl font-bold text-amber-200">{stats.paused}</p>
              </div>
            </div>

            {/* Category Stats */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              <div className="bg-slate-800 rounded p-3 border border-slate-700 text-center">
                <p className="text-slate-400 text-xs mb-1">Content</p>
                <p className="text-xl font-bold text-white">{categoryStats.content_creation}</p>
              </div>
              <div className="bg-slate-800 rounded p-3 border border-slate-700 text-center">
                <p className="text-slate-400 text-xs mb-1">Strategy</p>
                <p className="text-xl font-bold text-white">{categoryStats.strategy}</p>
              </div>
              <div className="bg-slate-800 rounded p-3 border border-slate-700 text-center">
                <p className="text-slate-400 text-xs mb-1">Growth</p>
                <p className="text-xl font-bold text-white">{categoryStats.growth}</p>
              </div>
              <div className="bg-slate-800 rounded p-3 border border-slate-700 text-center">
                <p className="text-slate-400 text-xs mb-1">Retention</p>
                <p className="text-xl font-bold text-white">{categoryStats.retention}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-900 border-b border-slate-700 sticky top-24 z-9">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search by business name or job type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700"
                  />
                </div>
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px] bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="queued">Queued</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[150px] bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-slate-900 rounded-lg border border-slate-700 p-12 text-center">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">No jobs found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredJobs.map(job => (
                <div key={job.id} className="bg-slate-900 rounded border border-slate-700 p-4 hover:border-slate-600">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(job.status)}
                        <div>
                          <h3 className="font-semibold text-white">
                            {job.business_name || job.client_id}
                          </h3>
                          <p className="text-xs text-slate-400">
                            {job.job_type.replace(/_/g, ' ')} • {job.trigger_source.replace(/_/g, ' ')}
                          </p>
                        </div>
                      </div>

                      {/* Progress bar for running jobs */}
                      {job.status === 'running' && (
                        <div className="w-full bg-slate-800 rounded h-2 mt-2 mb-2">
                          <div
                            className="bg-blue-600 h-full rounded"
                            style={{ width: `${job.progress_percent || 0}%` }}
                          />
                        </div>
                      )}

                      {/* Job details */}
                      <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                        <span className={`font-mono ${getPriorityColor(job.priority)}`}>
                          {job.priority}
                        </span>
                        <span className={`font-semibold ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                        {job.retry_count > 0 && (
                          <span className="text-amber-400">
                            Retry {job.retry_count}/{job.max_retries}
                          </span>
                        )}
                        {job.started_at && (
                          <span>Started: {new Date(job.started_at).toLocaleTimeString()}</span>
                        )}
                        {job.completed_at && (
                          <span>Completed: {new Date(job.completed_at).toLocaleTimeString()}</span>
                        )}
                        {job.last_error && (
                          <span title={job.last_error} className="text-red-400">
                            Error: {job.last_error.substring(0, 30)}...
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      {job.status === 'running' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => pauseMutation.mutate(job.id)}
                          className="border-slate-600 text-slate-300"
                        >
                          <Pause className="w-3 h-3" />
                        </Button>
                      )}

                      {job.status === 'paused' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resumeMutation.mutate(job.id)}
                          className="border-slate-600 text-slate-300"
                        >
                          <Play className="w-3 h-3" />
                        </Button>
                      )}

                      {job.status === 'queued' && (
                        <Select defaultValue={job.priority} onValueChange={(priority) =>
                          reprioritizeMutation.mutate({ jobId: job.id, priority })
                        }>
                          <SelectTrigger className="w-[100px] h-9 text-xs border-slate-600">
                            <SelectValue placeholder="Priority" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="critical">Critical</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      )}

                      {(job.status === 'queued' || job.status === 'paused') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cancelMutation.mutate(job.id)}
                          className="border-red-600 text-red-400 hover:bg-red-900/20"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
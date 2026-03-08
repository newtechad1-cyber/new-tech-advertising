import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Pencil, Plus } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  running: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  paused: 'bg-gray-100 text-gray-600'
};

const JOB_TYPES = [
  'Blog Generation', 'Social Content Generation', 'Video Script Generation',
  'Lead Follow-Up', 'Case Study Promotion', 'City Page Generation',
  'Authority Pack Expansion', 'Email Newsletter Creation', 'SEO Refresh'
];

const FREQUENCIES = ['Daily', 'Weekly', 'Monthly', 'Hourly', 'Once'];

const DEFAULT_JOB = {
  job_name: '', job_type: 'Blog Generation', frequency: 'Daily',
  related_service: '', related_city: '', enabled: true, status: 'pending'
};

export default function JobsTable() {
  const [editingJob, setEditingJob] = useState(null);
  const qc = useQueryClient();

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['autopilot-jobs'],
    queryFn: () => base44.entities.AutopilotJobs.list('-created_date')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.AutopilotJobs.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['autopilot-jobs'] })
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.AutopilotJobs.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['autopilot-jobs'] });
      setEditingJob(null);
    }
  });

  const handleSave = () => {
    if (editingJob.id) {
      updateMutation.mutate({ id: editingJob.id, data: editingJob });
    } else {
      createMutation.mutate(editingJob);
    }
    setEditingJob(null);
  };

  if (isLoading) return <div className="p-8 text-gray-400 text-center">Loading jobs...</div>;

  return (
    <div className="bg-white rounded-lg border">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold text-gray-800">Scheduled Jobs ({jobs.length})</h2>
        <Button size="sm" onClick={() => setEditingJob({ ...DEFAULT_JOB })}>
          <Plus className="w-4 h-4 mr-1" /> Add Job
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Job Name</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Frequency</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Last Run</th>
              <th className="text-left px-4 py-3">Next Run</th>
              <th className="text-left px-4 py-3">Enabled</th>
              <th className="text-left px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {jobs.map(job => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{job.job_name}</td>
                <td className="px-4 py-3 text-gray-600">{job.job_type}</td>
                <td className="px-4 py-3 text-gray-600">{job.frequency}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[job.status] || STATUS_COLORS.pending}`}>
                    {job.status || 'pending'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {job.last_run_date ? format(new Date(job.last_run_date), 'MMM d, h:mm a') : '—'}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {job.next_run_date ? format(new Date(job.next_run_date), 'MMM d, h:mm a') : '—'}
                </td>
                <td className="px-4 py-3">
                  <Switch
                    checked={!!job.enabled}
                    onCheckedChange={() => updateMutation.mutate({ id: job.id, data: { enabled: !job.enabled } })}
                  />
                </td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="icon" onClick={() => setEditingJob({ ...job })}>
                    <Pencil className="w-4 h-4 text-gray-400" />
                  </Button>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-gray-400">
                  No jobs configured yet. Click "Add Job" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editingJob} onOpenChange={(open) => { if (!open) setEditingJob(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingJob?.id ? 'Edit Job' : 'New Autopilot Job'}</DialogTitle>
          </DialogHeader>
          {editingJob && (
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Job Name</label>
                <Input
                  className="mt-1"
                  value={editingJob.job_name}
                  onChange={e => setEditingJob({ ...editingJob, job_name: e.target.value })}
                  placeholder="e.g. Daily Blog Generator"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Job Type</label>
                <Select value={editingJob.job_type} onValueChange={v => setEditingJob({ ...editingJob, job_type: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Frequency</label>
                <Select value={editingJob.frequency} onValueChange={v => setEditingJob({ ...editingJob, frequency: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {FREQUENCIES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Related Service</label>
                  <Input
                    className="mt-1"
                    value={editingJob.related_service || ''}
                    onChange={e => setEditingJob({ ...editingJob, related_service: e.target.value })}
                    placeholder="e.g. streaming-tv"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Related City</label>
                  <Input
                    className="mt-1"
                    value={editingJob.related_city || ''}
                    onChange={e => setEditingJob({ ...editingJob, related_city: e.target.value })}
                    placeholder="e.g. Chicago"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setEditingJob(null)}>Cancel</Button>
                <Button onClick={handleSave}>Save Job</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, AlertTriangle, CheckCircle2, Loader2, Inbox, ExternalLink } from 'lucide-react';

const COLUMNS = [
  { key: 'queued', label: 'Queued', icon: Inbox, color: 'text-slate-400', border: 'border-slate-700' },
  { key: 'running', label: 'Running', icon: Loader2, color: 'text-blue-400', border: 'border-blue-700/50', spin: true },
  { key: 'awaiting_approval', label: 'Awaiting Approval', icon: CheckCircle2, color: 'text-amber-400', border: 'border-amber-700/50' },
  { key: 'failed', label: 'Failed', icon: AlertTriangle, color: 'text-red-400', border: 'border-red-700/50' },
];

const JOB_TYPE_LABELS = {
  video_generation: '🎬 Video Gen',
  content_writing: '✍️ Content',
  seo_analysis: '🔍 SEO',
  social_post: '📱 Social',
  report_generation: '📊 Report',
  website_audit: '🌐 Audit',
  email_campaign: '📧 Email',
};

export default function CTAIProduction({ jobs = [] }) {
  const byStatus = COLUMNS.reduce((acc, col) => {
    acc[col.key] = jobs.filter(j => j.status === col.key);
    return acc;
  }, {});

  const avgTime = (list) => {
    const times = list.filter(j => j.processing_time_seconds).map(j => j.processing_time_seconds);
    if (!times.length) return '—';
    return `${Math.round(times.reduce((a, b) => a + b, 0) / times.length)}s`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">AI Production Operations</h2>
        <Button size="sm" variant="outline" className="text-xs gap-1">
          <ExternalLink className="w-3 h-3" /> AI Console
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {COLUMNS.map(col => {
          const colJobs = byStatus[col.key] || [];
          const ColIcon = col.icon;
          return (
            <Card key={col.key} className={`bg-slate-800/50 border ${col.border}`}>
              <CardHeader className="pb-2 pt-3 px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ColIcon className={`w-4 h-4 ${col.color} ${col.spin ? 'animate-spin' : ''}`} />
                    <CardTitle className="text-xs font-semibold text-slate-300">{col.label}</CardTitle>
                  </div>
                  <span className={`text-xl font-bold ${col.color}`}>{colJobs.length}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>Avg: {avgTime(colJobs)}</span>
                  {col.key === 'failed' && colJobs.length > 0 && (
                    <Badge className="bg-red-950 text-red-300 text-[9px] px-1">{colJobs.length} errors</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="px-3 pb-3 space-y-1 max-h-40 overflow-y-auto">
                {colJobs.length === 0 ? (
                  <p className="text-[10px] text-slate-600 text-center py-2">—</p>
                ) : (
                  colJobs.slice(0, 6).map((job, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-900/50 rounded px-2 py-1">
                      <span className="text-[10px] text-slate-400">{JOB_TYPE_LABELS[job.job_type] || job.job_type}</span>
                      {job.priority === 'urgent' && (
                        <Badge className="text-[9px] bg-red-950 text-red-300 px-1">!</Badge>
                      )}
                    </div>
                  ))
                )}
                {colJobs.length > 6 && (
                  <p className="text-[10px] text-slate-600 text-center">+{colJobs.length - 6} more</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { RotateCcw, Pause, X, ArrowUp, Loader2, CheckCircle2, Clock, AlertCircle, XCircle, PauseCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const PRIORITY_CFG = {
  urgent: { color: '#ef4444', bg: '#2d1010', label: 'Urgent' },
  high:   { color: '#f59e0b', bg: '#2d1f00', label: 'High' },
  normal: { color: '#3b82f6', bg: '#1e3a5f', label: 'Normal' },
  low:    { color: '#64748b', bg: '#1e293b', label: 'Low' },
};

const STATUS_CFG = {
  queued:    { icon: Clock,        color: '#64748b', label: 'Queued' },
  running:   { icon: Loader2,      color: '#3b82f6', label: 'Running', spin: true },
  completed: { icon: CheckCircle2, color: '#10b981', label: 'Done' },
  failed:    { icon: AlertCircle,  color: '#ef4444', label: 'Failed' },
  paused:    { icon: PauseCircle,  color: '#f59e0b', label: 'Paused' },
  cancelled: { icon: XCircle,      color: '#475569', label: 'Cancelled' },
  retrying:  { icon: RotateCcw,    color: '#8b5cf6', label: 'Retrying', spin: true },
};

const JOB_TYPE_LABELS = {
  blog_article: 'Blog Article', social_post: 'Social Post', video_script: 'Video Script',
  email_campaign: 'Email Campaign', seo_page: 'SEO Page', review_response: 'Review Response',
  ranking_report: 'Ranking Report', lead_score: 'Lead Score', monthly_report: 'Monthly Report',
  campaign_launch: 'Campaign Launch', content_calendar: 'Content Calendar',
};

export default function AWJobQueue({ jobs, onReprioritize, onPause, onRetry, onCancel }) {
  const [filter, setFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filtered = jobs.filter(j => {
    const statusOk = filter === 'all' || j.status === filter;
    const priorityOk = priorityFilter === 'all' || j.priority === priorityFilter;
    return statusOk && priorityOk;
  });

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-white font-bold text-sm">Job Queue Control Panel</h3>
        <div className="flex items-center gap-2">
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-2 py-1.5 focus:outline-none">
            <option value="all">All Status</option>
            {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
            className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-2 py-1.5 focus:outline-none">
            <option value="all">All Priority</option>
            {Object.entries(PRIORITY_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              {['Job Type', 'Client', 'Priority', 'Scheduled', 'Status', 'Attempts', 'Actions'].map((h, i) => (
                <th key={i} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filtered.slice(0, 30).map((job, i) => {
              const pCfg = PRIORITY_CFG[job.priority] || PRIORITY_CFG.normal;
              const sCfg = STATUS_CFG[job.status] || STATUS_CFG.queued;
              const Icon = sCfg.icon;
              return (
                <tr key={job.id || i} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-4 py-3 text-slate-300 text-xs font-medium whitespace-nowrap">
                    {JOB_TYPE_LABELS[job.job_type] || job.job_type}
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs max-w-32 truncate">{job.client_name}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: pCfg.color, background: pCfg.bg }}>
                      {pCfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                    {job.scheduled_at ? formatDistanceToNow(new Date(job.scheduled_at), { addSuffix: true }) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Icon className={`w-3.5 h-3.5 ${sCfg.spin ? 'animate-spin' : ''}`} style={{ color: sCfg.color }} />
                      <span className="text-xs font-semibold" style={{ color: sCfg.color }}>{sCfg.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{job.attempts || 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button title="Prioritize" onClick={() => onReprioritize(job)}
                        className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:text-cyan-400 hover:bg-slate-700 transition-colors">
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      {job.status !== 'paused' ? (
                        <button title="Pause" onClick={() => onPause(job)}
                          className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:text-amber-400 hover:bg-slate-700 transition-colors">
                          <Pause className="w-3 h-3" />
                        </button>
                      ) : (
                        <button title="Retry" onClick={() => onRetry(job)}
                          className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:text-green-400 hover:bg-slate-700 transition-colors">
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      )}
                      {job.status === 'failed' && (
                        <button title="Retry" onClick={() => onRetry(job)}
                          className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:text-purple-400 hover:bg-slate-700 transition-colors">
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      )}
                      <button title="Cancel" onClick={() => onCancel(job)}
                        className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:text-red-400 hover:bg-slate-700 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-500 text-sm">No jobs match the current filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
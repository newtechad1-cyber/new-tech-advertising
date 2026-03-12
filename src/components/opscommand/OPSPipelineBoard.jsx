import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { X, AlertTriangle, Flame, Clock, RefreshCw, Flag, Send, CheckCircle2, PauseCircle, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const COLUMNS = [
  { key: 'queued', label: 'Intake Queue', color: 'border-slate-600', dot: 'bg-slate-400', bg: 'bg-slate-800/20' },
  { key: 'running', label: 'AI Generating', color: 'border-violet-700/50', dot: 'bg-violet-400', bg: 'bg-violet-950/10' },
  { key: 'awaiting_approval', label: 'Awaiting Review', color: 'border-amber-700/50', dot: 'bg-amber-400', bg: 'bg-amber-950/10' },
  { key: 'rendering', label: 'Video Rendering', color: 'border-cyan-700/50', dot: 'bg-cyan-400', bg: 'bg-cyan-950/10' },
  { key: 'publishing_ready', label: 'Publishing Ready', color: 'border-emerald-700/50', dot: 'bg-emerald-400', bg: 'bg-emerald-950/10' },
  { key: 'completed', label: 'Published', color: 'border-teal-700/50', dot: 'bg-teal-400', bg: 'bg-teal-950/10' },
  { key: 'failed', label: 'Failed / Blocked', color: 'border-red-700/50', dot: 'bg-red-400', bg: 'bg-red-950/10' },
];

const PRIORITY_BADGE = {
  urgent: 'bg-red-950 text-red-300',
  normal: 'bg-slate-700 text-slate-300',
  low: 'bg-slate-800 text-slate-500',
};

const TYPE_COLORS = {
  video_generation: 'text-violet-300',
  content_writing: 'text-blue-300',
  seo_analysis: 'text-cyan-300',
  social_post: 'text-pink-300',
  report_generation: 'text-amber-300',
  website_audit: 'text-orange-300',
  email_campaign: 'text-emerald-300',
};

const ProgressRing = ({ pct }) => (
  <div className="relative w-8 h-8 flex-shrink-0">
    <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="12" fill="none" stroke="#1e293b" strokeWidth="3" />
      <circle cx="16" cy="16" r="12" fill="none" stroke="#8b5cf6" strokeWidth="3"
        strokeDasharray={`${(pct / 100) * 75.4} 75.4`} strokeLinecap="round" />
    </svg>
    <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white">{pct}%</span>
  </div>
);

const JobModal = ({ job, onClose }) => {
  const actions = [
    { label: 'Retry Job', icon: RefreshCw, color: 'text-blue-300 border-blue-700/50 hover:bg-blue-950/30' },
    { label: 'Reprioritize', icon: Flag, color: 'text-orange-300 border-orange-700/50 hover:bg-orange-950/30' },
    { label: 'Send to Review', icon: Send, color: 'text-violet-300 border-violet-700/50 hover:bg-violet-950/30' },
    { label: 'Mark Approved', icon: CheckCircle2, color: 'text-emerald-300 border-emerald-700/50 hover:bg-emerald-950/30' },
    { label: 'Pause Queue', icon: PauseCircle, color: 'text-amber-300 border-amber-700/50 hover:bg-amber-950/30' },
    { label: 'Escalate to Ops', icon: AlertTriangle, color: 'text-red-300 border-red-700/50 hover:bg-red-950/30' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[88vh] overflow-y-auto">
        <div className="flex items-start justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-violet-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{job.client_name} — {job.job_type?.replace(/_/g, ' ')}</h2>
              <p className="text-xs text-slate-400 capitalize">{job.status?.replace(/_/g, ' ')} · Priority: {job.priority}</p>
            </div>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-500 hover:text-white" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Status', value: job.status?.replace(/_/g, ' ') || '—', color: 'text-violet-300' },
              { label: 'Processing Time', value: job.processing_time_seconds ? `${Math.round(job.processing_time_seconds / 60)}m` : '—', color: 'text-cyan-300' },
              { label: 'Priority', value: job.priority || 'normal', color: job.priority === 'urgent' ? 'text-red-300' : 'text-slate-300' },
            ].map(m => (
              <div key={m.label} className="bg-slate-800 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-500 mb-1">{m.label}</p>
                <p className={`text-sm font-bold capitalize ${m.color}`}>{m.value}</p>
              </div>
            ))}
          </div>
          {job.error_message && (
            <div className="bg-red-950/30 border border-red-700/40 rounded-xl p-3">
              <p className="text-xs font-semibold text-red-300 mb-1">Error Message</p>
              <p className="text-xs text-slate-300">{job.error_message}</p>
            </div>
          )}
          <div className="bg-slate-800 rounded-xl p-3">
            <p className="text-xs font-semibold text-slate-300 mb-2">Job Details</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                ['Job Type', job.job_type?.replace(/_/g, ' ')],
                ['Client', job.client_name],
                ['Started', job.started_at ? new Date(job.started_at).toLocaleString() : 'Not started'],
                ['Completed', job.completed_at ? new Date(job.completed_at).toLocaleString() : 'Pending'],
              ].map(([k, v]) => (
                <div key={k}><span className="text-slate-500">{k}: </span><span className="text-slate-200 capitalize">{v || '—'}</span></div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {actions.map(a => (
              <button key={a.label} className={`flex items-center justify-center gap-2 p-2 rounded-xl border bg-transparent text-xs font-medium transition-colors ${a.color}`}>
                <a.icon className="w-3.5 h-3.5" />{a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const JobCard = ({ job, onClick, onDragStart }) => (
  <div draggable onDragStart={onDragStart} onClick={onClick}
    className="bg-slate-800 border border-slate-700 rounded-lg p-3 cursor-pointer hover:border-slate-500 transition-all group select-none">
    <div className="flex items-start justify-between mb-1.5">
      <p className="text-xs font-semibold text-white leading-tight truncate pr-1 group-hover:text-orange-200">{job.client_name}</p>
      {job.status === 'failed' && <AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0" />}
      {job.priority === 'urgent' && job.status !== 'failed' && <Flame className="w-3 h-3 text-red-400 flex-shrink-0" />}
    </div>
    <p className={`text-[10px] capitalize mb-2 ${TYPE_COLORS[job.job_type] || 'text-slate-400'}`}>{job.job_type?.replace(/_/g, ' ')}</p>
    <div className="flex items-center justify-between">
      <Badge className={`text-[9px] px-1.5 ${PRIORITY_BADGE[job.priority] || PRIORITY_BADGE.normal}`}>{job.priority}</Badge>
      {job.processing_time_seconds && (
        <span className="text-[10px] text-slate-600 flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{Math.round(job.processing_time_seconds / 60)}m</span>
      )}
    </div>
  </div>
);

const FALLBACK_JOBS = [
  { id: 'j1', client_name: 'Arctic Air HVAC', job_type: 'video_generation', status: 'running', priority: 'urgent', processing_time_seconds: 180 },
  { id: 'j2', client_name: 'Mesa Grill Group', job_type: 'content_writing', status: 'queued', priority: 'normal', processing_time_seconds: null },
  { id: 'j3', client_name: 'Precision Plumbing', job_type: 'social_post', status: 'awaiting_approval', priority: 'normal', processing_time_seconds: 65 },
  { id: 'j4', client_name: 'ProHeat Systems', job_type: 'video_generation', status: 'rendering', priority: 'urgent', processing_time_seconds: 840 },
  { id: 'j5', client_name: 'Apex Law Partners', job_type: 'content_writing', status: 'publishing_ready', priority: 'normal', processing_time_seconds: 120 },
  { id: 'j6', client_name: 'Blue Ridge Roofing', job_type: 'seo_analysis', status: 'completed', priority: 'low', processing_time_seconds: 240 },
  { id: 'j7', client_name: 'CoolBreeze HVAC', job_type: 'video_generation', status: 'failed', priority: 'urgent', error_message: 'HeyGen API timeout after 3 retries', processing_time_seconds: 0 },
  { id: 'j8', client_name: 'Taco Loco', job_type: 'email_campaign', status: 'queued', priority: 'normal' },
  { id: 'j9', client_name: 'Sun Valley', job_type: 'social_post', status: 'running', priority: 'normal', processing_time_seconds: 45 },
  { id: 'j10', client_name: 'Citywide Dental', job_type: 'content_writing', status: 'awaiting_approval', priority: 'urgent', processing_time_seconds: 90 },
];

export default function OPSPipelineBoard({ jobs = [], onJobUpdate }) {
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [selected, setSelected] = useState(null);

  const data = jobs.length > 0 ? jobs : FALLBACK_JOBS;

  const byCol = COLUMNS.reduce((acc, col) => {
    acc[col.key] = data.filter(j => (j.status || 'queued') === col.key);
    return acc;
  }, {});

  const handleDrop = async (colKey) => {
    if (!dragging || dragging.status === colKey) { setDragging(null); setDragOver(null); return; }
    if (jobs.length > 0) {
      await base44.entities.AIProductionJob.update(dragging.id, { status: colKey }).catch(() => {});
      onJobUpdate?.();
    }
    setDragging(null); setDragOver(null);
  };

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Production Pipeline Board</h2>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3 min-w-max">
          {COLUMNS.map(col => {
            const colJobs = byCol[col.key] || [];
            return (
              <div key={col.key}
                className={`w-44 flex-shrink-0 rounded-xl border ${col.color} ${dragOver === col.key ? 'ring-2 ring-orange-500' : ''} transition-all`}
                onDragOver={e => { e.preventDefault(); setDragOver(col.key); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => handleDrop(col.key)}>
                <div className={`${col.bg} rounded-t-xl px-3 py-2 border-b ${col.color}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${col.dot} ${col.key === 'running' ? 'animate-pulse' : ''}`} />
                    <p className="text-xs font-semibold text-slate-300 truncate">{col.label}</p>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-0.5 ml-4">{colJobs.length} jobs</p>
                </div>
                <div className="p-2 space-y-2 min-h-[100px] max-h-[420px] overflow-y-auto">
                  {colJobs.map((job, i) => (
                    <JobCard key={job.id || i} job={job}
                      onClick={() => setSelected(job)}
                      onDragStart={() => setDragging(job)} />
                  ))}
                  {colJobs.length === 0 && (
                    <div className="flex items-center justify-center h-10 text-[10px] text-slate-700 border border-dashed border-slate-700 rounded-lg">Empty</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {selected && <JobModal job={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
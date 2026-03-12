import React from 'react';
import { Clock, AlertCircle, ChevronRight } from 'lucide-react';

const JOB_TYPE_CONFIG = {
  content: { label: 'Content', icon: '📝', color: '#3b82f6' },
  video: { label: 'Video', icon: '🎬', color: '#f59e0b' },
  campaign: { label: 'Campaign', icon: '🎯', color: '#ec4899' },
  authority_batch: { label: 'Authority', icon: '📚', color: '#8b5cf6' },
  reporting: { label: 'Reporting', icon: '📊', color: '#10b981' },
  onboarding_setup: { label: 'Onboarding', icon: '🚀', color: '#06b6d4' },
};

const PRIORITY_CONFIG = {
  urgent: { label: 'Urgent', color: '#ef4444', bg: 'bg-red-600/20', text: 'text-red-400' },
  high: { label: 'High', color: '#f97316', bg: 'bg-orange-600/20', text: 'text-orange-400' },
  medium: { label: 'Medium', color: '#eab308', bg: 'bg-yellow-600/20', text: 'text-yellow-400' },
  low: { label: 'Low', color: '#64748b', bg: 'bg-slate-600/20', text: 'text-slate-400' },
};

const STATUS_CONFIG = {
  queued: { label: 'Queued', badge: 'bg-slate-600/20 text-slate-400' },
  in_progress: { label: 'In Progress', badge: 'bg-blue-600/20 text-blue-400' },
  review: { label: 'Review', badge: 'bg-amber-600/20 text-amber-400' },
  completed: { label: 'Completed', badge: 'bg-emerald-600/20 text-emerald-400' },
  blocked: { label: 'Blocked', badge: 'bg-rose-600/20 text-rose-400' },
};

export default function ProductionCard({ job, onClick }) {
  const jobType = JOB_TYPE_CONFIG[job.job_type] || JOB_TYPE_CONFIG.content;
  const priority = PRIORITY_CONFIG[job.priority_level] || PRIORITY_CONFIG.medium;
  const status = STATUS_CONFIG[job.job_status] || STATUS_CONFIG.queued;

  return (
    <div
      onClick={() => onClick(job)}
      className="bg-[#0d1526] border border-slate-800/60 hover:border-cyan-700/50 rounded-2xl p-5 cursor-pointer transition-all group"
    >
      {/* Job Title */}
      <h3 className="text-sm font-black text-white group-hover:text-cyan-200 transition-colors mb-2 leading-snug">
        {job.job_title}
      </h3>

      {/* Client & Vertical */}
      <div className="mb-3">
        <p className="text-[10px] font-bold text-slate-400 leading-tight">{job.client_name}</p>
        {job.vertical && (
          <p className="text-[9px] text-slate-600">{job.vertical}</p>
        )}
      </div>

      {/* Type & Priority Badges */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{jobType.icon}</span>
        <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: jobType.color }}>
          {jobType.label}
        </span>
      </div>

      {/* Estimated Hours */}
      {job.estimated_hours > 0 && (
        <div className="mb-3 flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-500" />
          <span className="text-[10px] font-semibold text-slate-400">
            {job.estimated_hours}h estimate
          </span>
        </div>
      )}

      {/* Priority + Status */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <span className={`text-[9px] font-bold px-2 py-1 rounded-full border border-current/30 ${priority.text}`}>
            {priority.label}
          </span>
          <span className={`text-[8px] font-bold px-2 py-1 rounded-full border border-current/30 ${status.badge}`}>
            {status.label}
          </span>
        </div>
      </div>

      {/* View detail hint */}
      <div className="mt-3 flex items-center gap-1 text-[10px] text-cyan-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-3 h-3" /> Open
      </div>
    </div>
  );
}
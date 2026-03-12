import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, TrendingUp } from 'lucide-react';

const STATUS_CONFIG = {
  on_track: { label: 'On Track', icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-600/20' },
  at_risk: { label: 'At Risk', icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-600/20' },
  overdue: { label: 'Overdue', icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-600/20' },
  delivered: { label: 'Delivered', icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-600/20' },
};

function getDaysStatus(dueDate) {
  const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
  if (days < 0) return { days: Math.abs(days), label: 'overdue', overdue: true };
  if (days === 0) return { days: 0, label: 'today', overdue: false };
  if (days <= 3) return { days, label: 'days remaining', overdue: false };
  return { days, label: 'days remaining', overdue: false };
}

export default function SLACard({ sla, onClick }) {
  const status = STATUS_CONFIG[sla.sla_status] || STATUS_CONFIG.on_track;
  const StatusIcon = status.icon;
  const daysInfo = getDaysStatus(sla.sla_due_date);
  const impact = sla.impact_score || 50;

  return (
    <div
      onClick={() => onClick(sla)}
      className="bg-[#0d1526] border border-slate-800/60 hover:border-indigo-700/50 rounded-2xl p-5 cursor-pointer transition-all group"
    >
      {/* Job Title */}
      <h3 className="text-sm font-black text-white group-hover:text-indigo-200 transition-colors mb-2 leading-snug">
        {sla.job_title}
      </h3>

      {/* Client Name */}
      <p className="text-[10px] font-bold text-slate-400 mb-3">{sla.client_name}</p>

      {/* Due Date */}
      <div className="mb-3">
        <p className="text-[10px] text-slate-500 font-semibold mb-1">Due Date</p>
        <p className="text-xs font-black text-slate-300">
          {new Date(sla.sla_due_date).toLocaleDateString()}
        </p>
        <p className={`text-[9px] font-semibold mt-1 ${daysInfo.overdue ? 'text-rose-400' : 'text-emerald-400'}`}>
          {daysInfo.overdue ? `${daysInfo.days}d overdue` : `${daysInfo.days}d remaining`}
        </p>
      </div>

      {/* Impact Score */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-slate-500 font-semibold">Impact Score</span>
          <span className="text-xs font-black text-slate-300">{impact}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${impact}%`, background: impact >= 75 ? '#ef4444' : impact >= 50 ? '#f59e0b' : '#10b981' }} />
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-1.5">
        <span className={`text-[9px] font-bold px-2 py-1 rounded-full border border-current/30 flex items-center gap-1 ${status.color}`}>
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </span>
      </div>

      {/* View detail hint */}
      <div className="mt-3 flex items-center gap-1 text-[10px] text-indigo-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
        <TrendingUp className="w-3 h-3" /> View SLA
      </div>
    </div>
  );
}
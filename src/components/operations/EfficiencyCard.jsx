import React from 'react';
import { TrendingUp, ChevronRight, Zap } from 'lucide-react';

const WORKFLOW_LABELS = {
  content_production: '📝 Content',
  video_production: '🎬 Video',
  campaign_setup: '🎯 Campaign',
  onboarding: '🚀 Onboarding',
  reporting: '📊 Reporting',
  approvals: '✅ Approvals',
};

const STATUS_CONFIG = {
  deployed: { label: 'Deployed', color: 'text-emerald-400', bg: 'bg-emerald-600/20' },
  building: { label: 'Building', color: 'text-blue-400', bg: 'bg-blue-600/20' },
  planning: { label: 'Planning', color: 'text-amber-400', bg: 'bg-amber-600/20' },
  identified: { label: 'Identified', color: 'text-slate-400', bg: 'bg-slate-600/20' },
};

const COMPLEXITY_CONFIG = {
  low: { label: 'Low', color: 'text-emerald-400' },
  medium: { label: 'Medium', color: 'text-amber-400' },
  high: { label: 'High', color: 'text-rose-400' },
};

export default function EfficiencyCard({ signal, onClick }) {
  const status = STATUS_CONFIG[signal.implementation_status] || STATUS_CONFIG.identified;
  const complexity = COMPLEXITY_CONFIG[signal.automation_complexity] || COMPLEXITY_CONFIG.medium;
  const gain = signal.efficiency_gain_score || 50;
  const hours = signal.manual_hours_reduction_estimate || 0;

  return (
    <div
      onClick={() => onClick(signal)}
      className="bg-[#0d1526] border border-slate-800/60 hover:border-cyan-700/50 rounded-2xl p-5 cursor-pointer transition-all group"
    >
      {/* Title */}
      <h3 className="text-sm font-black text-white group-hover:text-cyan-200 transition-colors mb-2 leading-snug">
        {signal.signal_title}
      </h3>

      {/* Workflow Area Badge */}
      <p className="text-[10px] font-bold text-slate-400 mb-3">{WORKFLOW_LABELS[signal.workflow_area] || signal.workflow_area}</p>

      {/* Efficiency Gain Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-slate-500 font-semibold">Efficiency Gain</span>
          <span className="text-xs font-black text-slate-300">{gain}%</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${gain}%`, background: gain >= 75 ? '#10b981' : gain >= 50 ? '#3b82f6' : '#f59e0b' }} />
        </div>
      </div>

      {/* Hours Estimate */}
      {hours > 0 && (
        <div className="mb-3">
          <p className="text-[10px] text-slate-500 font-semibold">Hours Saved/Month</p>
          <p className="text-xs font-bold text-cyan-400">{hours}h estimated</p>
        </div>
      )}

      {/* Complexity & Status */}
      <div className="flex items-center justify-between gap-2">
        <span className={`text-[8px] font-bold uppercase px-2 py-1 rounded border border-current/30 ${complexity.color}`}>
          {complexity.label}
        </span>
        <span className={`text-[8px] font-bold uppercase px-2 py-1 rounded border border-current/30 ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* View detail hint */}
      <div className="mt-3 flex items-center gap-1 text-[10px] text-cyan-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-3 h-3" /> View opportunity
      </div>
    </div>
  );
}
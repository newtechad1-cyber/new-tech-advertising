import React from 'react';
import { TrendingUp, ChevronRight } from 'lucide-react';

const STAGE_CONFIG = {
  stabilizing: { label: 'Stabilizing', color: 'text-amber-400', bg: 'bg-amber-600/20' },
  growth: { label: 'Growth', color: 'text-blue-400', bg: 'bg-blue-600/20' },
  mature: { label: 'Mature', color: 'text-emerald-400', bg: 'bg-emerald-600/20' },
  decline: { label: 'Decline', color: 'text-rose-400', bg: 'bg-rose-600/20' },
};

function fmt(n) {
  if (!n) return '$0';
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;
}

function retentionColor(score) {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#f43f5e';
}

export default function LTVCard({ metric, onClick }) {
  const stage = STAGE_CONFIG[metric.lifecycle_stage_projection] || STAGE_CONFIG.growth;
  const retention = metric.retention_probability_score || 70;
  const retColor = retentionColor(retention);

  return (
    <div
      onClick={() => onClick(metric)}
      className="bg-[#0d1526] border border-slate-800/60 hover:border-violet-700/50 rounded-2xl p-5 cursor-pointer transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-black text-white group-hover:text-violet-200 transition-colors leading-snug">
            {metric.client_name}
          </h3>
          {metric.vertical && (
            <p className="text-[10px] text-slate-500 mt-1">{metric.vertical}</p>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-3">
        <p className="text-[10px] text-slate-600 font-semibold mb-1">Active Duration</p>
        <p className="text-sm font-black text-slate-300">{metric.months_active} months</p>
      </div>

      {/* Revenue */}
      <div className="mb-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-600 font-semibold">Total Revenue</span>
          <span className="text-sm font-black text-emerald-400">{fmt(metric.total_revenue_generated)}</span>
        </div>
        {metric.expansion_revenue_total > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-600 font-semibold">Expansion Revenue</span>
            <span className="text-xs font-bold text-teal-400">{fmt(metric.expansion_revenue_total)}</span>
          </div>
        )}
      </div>

      {/* Retention */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-slate-500 font-semibold">Retention Probability</span>
          <span className="text-xs font-black" style={{ color: retColor }}>{retention}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${retention}%`, background: retColor }} />
        </div>
      </div>

      {/* Stage */}
      <div className="flex items-center gap-1.5">
        <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full border border-current/30 ${stage.color}`}>
          {stage.label}
        </span>
      </div>

      {/* View detail hint */}
      <div className="mt-3 flex items-center gap-1 text-[10px] text-violet-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
        <TrendingUp className="w-3 h-3" /> View details
      </div>
    </div>
  );
}
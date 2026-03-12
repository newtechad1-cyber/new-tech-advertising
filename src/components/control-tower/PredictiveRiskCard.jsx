import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';

const CATEGORY_CONFIG = {
  revenue: { label: '💰 Revenue', color: 'text-blue-400' },
  churn: { label: '📉 Churn', color: 'text-rose-400' },
  sales: { label: '🎯 Sales', color: 'text-amber-400' },
  operations: { label: '⚙️ Ops', color: 'text-slate-400' },
  expansion: { label: '🚀 Expansion', color: 'text-cyan-400' },
  pricing: { label: '💵 Pricing', color: 'text-emerald-400' },
};

const STATUS_CONFIG = {
  emerging: { label: 'Emerging', color: 'text-yellow-400', bg: 'bg-yellow-600/20' },
  watch: { label: 'Watch', color: 'text-amber-400', bg: 'bg-amber-600/20' },
  intervention: { label: 'Intervention', color: 'text-rose-400', bg: 'bg-rose-600/20' },
  stabilized: { label: 'Stabilized', color: 'text-emerald-400', bg: 'bg-emerald-600/20' },
};

function probabilityColor(score) {
  if (score >= 75) return '#ef4444';
  if (score >= 50) return '#f59e0b';
  return '#eab308';
}

export default function PredictiveRiskCard({ risk, onClick }) {
  const category = CATEGORY_CONFIG[risk.risk_category] || CATEGORY_CONFIG.revenue;
  const status = STATUS_CONFIG[risk.monitoring_status] || STATUS_CONFIG.emerging;
  const prob = risk.probability_score || 50;
  const impact = risk.impact_severity || 50;

  return (
    <div
      onClick={() => onClick(risk)}
      className="bg-[#0d1526] border border-slate-800/60 hover:border-rose-700/50 rounded-2xl p-5 cursor-pointer transition-all group"
    >
      {/* Title */}
      <h3 className="text-sm font-black text-white group-hover:text-rose-200 transition-colors mb-2 leading-snug">
        {risk.risk_title}
      </h3>

      {/* Category & Status */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className={`text-[10px] font-bold ${category.color} uppercase tracking-widest`}>
          {category.label}
        </span>
        <span className={`text-[8px] font-bold uppercase px-2 py-1 rounded border border-current/30 ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Probability */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-slate-500 font-semibold">Probability</span>
          <span className="text-xs font-black text-slate-300">{prob}%</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${prob}%`, background: probabilityColor(prob) }} />
        </div>
      </div>

      {/* Impact */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-slate-500 font-semibold">Impact</span>
          <span className="text-xs font-black text-slate-300">{impact}</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${impact}%`, background: impact >= 75 ? '#ef4444' : impact >= 50 ? '#f59e0b' : '#3b82f6' }} />
        </div>
      </div>

      {/* Risk Score */}
      <div className="text-xs font-black text-slate-400 mb-3">
        Risk Score: {Math.round((prob * impact) / 100)}
      </div>

      {/* View detail hint */}
      <div className="flex items-center gap-1 text-[10px] text-rose-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-3 h-3" /> View analysis
      </div>
    </div>
  );
}
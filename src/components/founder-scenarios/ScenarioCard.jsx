import React from 'react';
import { Star, TrendingUp } from 'lucide-react';

function fmt(n) {
  if (!n) return '$0';
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;
}

const VERTICAL_COLORS = {
  HVAC: '#f59e0b', Plumbing: '#3b82f6', Restaurant: '#f43f5e',
  Roofing: '#10b981', Dental: '#8b5cf6', default: '#64748b',
};

export default function ScenarioCard({ scenario, onClick, onTogglePriority }) {
  const conf = scenario.confidence_score || 0;
  const confColor = conf >= 70 ? 'text-emerald-400' : conf >= 45 ? 'text-amber-400' : 'text-rose-400';
  const confBar   = conf >= 70 ? '#10b981' : conf >= 45 ? '#f59e0b' : '#f43f5e';
  const vColor = VERTICAL_COLORS[scenario.focus_vertical] || VERTICAL_COLORS.default;

  return (
    <div
      onClick={() => onClick(scenario)}
      className="bg-[#0d1526] border border-slate-800/60 hover:border-violet-700/50 rounded-2xl p-5 cursor-pointer transition-all group relative"
    >
      {scenario.is_priority && (
        <div className="absolute top-3 right-3">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        </div>
      )}

      {scenario.focus_vertical && (
        <div className="flex items-center gap-1.5 mb-3">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: vColor }} />
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: vColor }}>
            {scenario.focus_vertical}
          </span>
        </div>
      )}

      <h3 className="text-sm font-black text-white mb-4 leading-snug pr-6 group-hover:text-violet-200 transition-colors">
        {scenario.scenario_name}
      </h3>

      <div className="space-y-2.5 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-semibold">90-Day New MRR</span>
          <span className="text-xs font-black text-emerald-400">{fmt(scenario.projected_new_mrr_90_days)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-semibold">6-Month Total MRR</span>
          <span className="text-xs font-black text-violet-400">{fmt(scenario.projected_total_mrr_6_months)}</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-slate-500 font-semibold">Confidence</span>
          <span className={`text-xs font-black ${confColor}`}>{conf}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${conf}%`, background: confBar }} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] text-violet-400 font-semibold flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> View detail
        </span>
        <button
          onClick={e => { e.stopPropagation(); onTogglePriority(scenario); }}
          className="text-[10px] text-slate-500 hover:text-amber-400 font-semibold transition-colors"
        >
          {scenario.is_priority ? '★ Priority' : '☆ Set priority'}
        </button>
      </div>
    </div>
  );
}
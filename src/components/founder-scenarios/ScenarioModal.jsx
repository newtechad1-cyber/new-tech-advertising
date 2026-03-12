import React from 'react';
import { X, Star, ChevronRight } from 'lucide-react';

function fmt(n) {
  if (!n) return '$0';
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;
}

function AdjBar({ label, value, color }) {
  const pct = Math.max(0, Math.min(100, 50 + (value || 0) / 2));
  const isPos = (value || 0) >= 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-slate-400 font-semibold">{label}</span>
        <span className={`text-xs font-black ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPos ? '+' : ''}{value || 0}%
        </span>
      </div>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-600" />
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default function ScenarioModal({ scenario, onClose, onTogglePriority }) {
  if (!scenario) return null;
  const conf = scenario.confidence_score || 0;
  const confColor = conf >= 70 ? '#10b981' : conf >= 45 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-[#0d1526] border border-slate-700/60 rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800/60">
          <div>
            {scenario.focus_vertical && (
              <p className="text-[10px] text-violet-400 font-black uppercase tracking-wider mb-1">{scenario.focus_vertical}</p>
            )}
            <h2 className="text-lg font-black text-white leading-snug">{scenario.scenario_name}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors ml-4">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Adjustments */}
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3">Scenario Levers</p>
            <div className="space-y-3">
              <AdjBar label="Pricing Adjustment"       value={scenario.pricing_adjustment_percent}          color="#8b5cf6" />
              <AdjBar label="Sales Velocity Change"    value={scenario.sales_velocity_change_percent}       color="#10b981" />
              <AdjBar label="Marketing Intensity"      value={scenario.marketing_intensity_change_percent}  color="#f59e0b" />
            </div>
          </div>

          {/* Revenue summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/60 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">90-Day New MRR</p>
              <p className="text-2xl font-black text-emerald-400">{fmt(scenario.projected_new_mrr_90_days)}</p>
            </div>
            <div className="bg-slate-900/60 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">6-Month Total MRR</p>
              <p className="text-2xl font-black text-violet-400">{fmt(scenario.projected_total_mrr_6_months)}</p>
            </div>
          </div>

          {/* Confidence */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Confidence Score</p>
              <span className="text-sm font-black" style={{ color: confColor }}>{conf}/100</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${conf}%`, background: confColor }} />
            </div>
          </div>

          {/* Notes */}
          {scenario.scenario_notes && (
            <div className="bg-slate-900/40 rounded-2xl p-4">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Strategic Notes</p>
              <p className="text-sm text-slate-300 leading-relaxed">{scenario.scenario_notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button onClick={() => { onTogglePriority(scenario); onClose(); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600/20 border border-amber-700/50 rounded-xl text-xs font-bold text-amber-300 hover:bg-amber-600/30 transition-colors">
              <Star className="w-3.5 h-3.5" />
              {scenario.is_priority ? 'Remove Priority' : 'Mark as Priority'}
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-violet-600/20 border border-violet-700/50 rounded-xl text-xs font-bold text-violet-300 hover:bg-violet-600/30 transition-colors">
              <ChevronRight className="w-3.5 h-3.5" /> Convert to Playbook
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-teal-600/20 border border-teal-700/50 rounded-xl text-xs font-bold text-teal-300 hover:bg-teal-600/30 transition-colors">
              <ChevronRight className="w-3.5 h-3.5" /> Attach to Weekly Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
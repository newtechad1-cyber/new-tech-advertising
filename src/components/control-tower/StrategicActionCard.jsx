import React from 'react';
import { ChevronRight, Zap } from 'lucide-react';

const CATEGORY_CONFIG = {
  expansion_activation: { label: '🚀 Expansion', color: 'text-cyan-400' },
  sales_push: { label: '🎯 Sales Push', color: 'text-emerald-400' },
  retention_intervention: { label: '🛡️ Retention', color: 'text-blue-400' },
  pricing_adjustment: { label: '💰 Pricing', color: 'text-amber-400' },
  operational_optimization: { label: '⚙️ Operations', color: 'text-slate-400' },
  campaign_acceleration: { label: '📢 Campaign', color: 'text-purple-400' },
};

const URGENCY_CONFIG = {
  low: { label: 'Low', color: 'text-slate-400', bg: 'bg-slate-700' },
  medium: { label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-700' },
  high: { label: 'High', color: 'text-orange-400', bg: 'bg-orange-700' },
  critical: { label: 'Critical', color: 'text-rose-400', bg: 'bg-rose-700' },
};

const STATUS_CONFIG = {
  planned: { label: '◉ Planned', color: 'text-slate-400' },
  launched: { label: '▶ Launched', color: 'text-blue-400' },
  in_progress: { label: '⟳ In Progress', color: 'text-amber-400' },
  completed: { label: '✓ Completed', color: 'text-emerald-400' },
};

export default function StrategicActionCard({ initiative, onClick }) {
  const category = CATEGORY_CONFIG[initiative.action_category] || CATEGORY_CONFIG.expansion_activation;
  const urgency = URGENCY_CONFIG[initiative.urgency_level] || URGENCY_CONFIG.medium;
  const status = STATUS_CONFIG[initiative.execution_status] || STATUS_CONFIG.planned;
  const impact = initiative.projected_revenue_impact || 0;

  return (
    <div
      onClick={() => onClick(initiative)}
      className="bg-[#0d1526] border border-slate-800/60 hover:border-blue-700/50 rounded-2xl p-5 cursor-pointer transition-all group"
    >
      {/* Title */}
      <h3 className="text-sm font-black text-white group-hover:text-blue-200 transition-colors mb-2 leading-snug">
        {initiative.initiative_title}
      </h3>

      {/* Category & Urgency */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className={`text-[10px] font-bold ${category.color} uppercase tracking-widest`}>
          {category.label}
        </span>
        <span className={`text-[8px] font-bold uppercase px-2 py-1 rounded ${urgency.bg} ${urgency.color}`}>
          {urgency.label}
        </span>
      </div>

      {/* Owner & Status */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] text-slate-500 font-semibold">{initiative.assigned_owner_role}</span>
        <span className={`text-[9px] font-bold ${status.color}`}>{status.label}</span>
      </div>

      {/* Revenue Impact */}
      {impact > 0 && (
        <div className="mb-3 bg-emerald-900/20 border border-emerald-700/30 rounded-lg px-2 py-1">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-black text-emerald-300">${(impact / 1000).toFixed(1)}k revenue impact</span>
          </div>
        </div>
      )}

      {/* Context */}
      {(initiative.related_vertical || initiative.related_playbook) && (
        <div className="text-[9px] text-slate-500 mb-3">
          {initiative.related_vertical && <p>Vertical: <span className="text-slate-400 font-semibold">{initiative.related_vertical}</span></p>}
          {initiative.related_playbook && <p>Playbook: <span className="text-slate-400 font-semibold">{initiative.related_playbook}</span></p>}
        </div>
      )}

      {/* View detail hint */}
      <div className="flex items-center gap-1 text-[10px] text-blue-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-3 h-3" /> View execution plan
      </div>
    </div>
  );
}
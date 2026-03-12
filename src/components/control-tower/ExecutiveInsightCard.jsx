import React from 'react';
import { ChevronRight, AlertCircle, TrendingUp } from 'lucide-react';

const CATEGORY_CONFIG = {
  revenue: { label: '💰 Revenue', color: 'text-blue-400' },
  sales: { label: '🎯 Sales', color: 'text-emerald-400' },
  lifecycle: { label: '📈 Lifecycle', color: 'text-purple-400' },
  expansion: { label: '🚀 Expansion', color: 'text-orange-400' },
  operations: { label: '⚙️ Operations', color: 'text-slate-400' },
  vertical_strategy: { label: '🏢 Vertical', color: 'text-cyan-400' },
};

const URGENCY_CONFIG = {
  low: { label: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-600/20' },
  medium: { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-600/20' },
  high: { label: 'High', color: 'text-rose-400', bg: 'bg-rose-600/20' },
};

export default function ExecutiveInsightCard({ insight, onClick }) {
  const category = CATEGORY_CONFIG[insight.insight_category] || CATEGORY_CONFIG.revenue;
  const urgency = URGENCY_CONFIG[insight.urgency_level] || URGENCY_CONFIG.medium;
  const impact = insight.impact_score || 50;

  return (
    <div
      onClick={() => onClick(insight)}
      className="bg-[#0d1526] border border-slate-800/60 hover:border-slate-600/80 rounded-2xl p-5 cursor-pointer transition-all group"
    >
      {/* Title */}
      <h3 className="text-sm font-black text-white group-hover:text-slate-100 transition-colors mb-2 leading-snug">
        {insight.insight_title}
      </h3>

      {/* Category & Urgency */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className={`text-[10px] font-bold ${category.color} uppercase tracking-widest`}>
          {category.label}
        </span>
        <span className={`text-[8px] font-bold uppercase px-2 py-1 rounded border border-current/30 ${urgency.color}`}>
          {urgency.label}
        </span>
      </div>

      {/* Impact Score */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-slate-500 font-semibold">Impact Score</span>
          <span className="text-xs font-black text-slate-300">{impact}</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${impact}%`, background: impact >= 75 ? '#ef4444' : impact >= 50 ? '#f59e0b' : '#3b82f6' }} />
        </div>
      </div>

      {/* Status */}
      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3">
        {insight.status === 'action_planned' && '✓ Action Planned'}
        {insight.status === 'reviewed' && '◐ Reviewed'}
        {insight.status === 'new' && '● New'}
      </div>

      {/* View detail hint */}
      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-3 h-3" /> View analysis
      </div>
    </div>
  );
}
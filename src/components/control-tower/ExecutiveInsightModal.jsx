import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight, User } from 'lucide-react';

const CATEGORY_LABELS = {
  revenue: 'Revenue Insight',
  sales: 'Sales Insight',
  lifecycle: 'Client Lifecycle',
  expansion: 'Expansion Opportunity',
  operations: 'Operations Alert',
  vertical_strategy: 'Vertical Strategy',
};

const STATUS_LABELS = {
  new: 'New Insight',
  reviewed: 'Reviewed',
  action_planned: 'Action Planned',
};

export default function ExecutiveInsightModal({ insight, onClose }) {
  if (!insight) return null;
  const [newStatus, setNewStatus] = useState(insight.status);
  const [owner, setOwner] = useState(insight.assigned_owner || '');

  const impact = insight.impact_score || 50;
  const impactLevel = impact >= 75 ? 'Critical' : impact >= 50 ? 'Significant' : 'Moderate';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0d1526] border border-slate-700/60 rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800/60">
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Executive Insight</p>
            <h2 className="text-xl font-black text-white">{insight.insight_title}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Insight Summary */}
          <div className="bg-slate-900/60 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Category</span>
              <span className="text-xs font-bold text-slate-300">{CATEGORY_LABELS[insight.insight_category]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Urgency</span>
              <span className="text-xs font-bold text-slate-300">{insight.urgency_level.charAt(0).toUpperCase() + insight.urgency_level.slice(1)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-700/40">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Status</span>
              <span className="text-xs font-bold text-slate-300">{STATUS_LABELS[insight.status]}</span>
            </div>
          </div>

          {/* Impact Assessment */}
          <div className={`rounded-2xl p-4 border ${impact >= 75 ? 'bg-rose-600/20 border-rose-700/50' : 'bg-slate-900/40 border-slate-700/30'}`}>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Impact Assessment</p>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-black ${impact >= 75 ? 'text-rose-300' : 'text-slate-300'}`}>{impactLevel} Impact</span>
              <span className={`text-sm font-black ${impact >= 75 ? 'text-rose-300' : 'text-slate-300'}`}>{impact}/100</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${impact}%`, background: impact >= 75 ? '#ef4444' : impact >= 50 ? '#f59e0b' : '#3b82f6' }} />
            </div>
          </div>

          {/* Supporting Metric Summary */}
          <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-700/30">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Metric Summary</p>
            <p className="text-sm text-slate-300 leading-relaxed">{insight.supporting_metric_summary}</p>
          </div>

          {/* Recommended Action */}
          <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-700/30">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Recommended Action</p>
            <p className="text-sm text-slate-300 leading-relaxed">{insight.recommended_action}</p>
          </div>

          {/* Status Transition */}
          <div className="border-t border-slate-800/60 pt-4">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-3">Leadership Actions</p>
            <div className="space-y-2">
              <button className={`w-full px-3 py-2 rounded-xl text-xs font-bold transition-colors border flex items-center gap-2 ${
                newStatus === 'reviewed'
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-slate-800/40 border-slate-700 text-slate-300 hover:border-blue-700'
              }`}>
                <CheckCircle2 className="w-3 h-3" /> Mark Reviewed
              </button>
              <button className={`w-full px-3 py-2 rounded-xl text-xs font-bold transition-colors border flex items-center gap-2 ${
                newStatus === 'action_planned'
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-slate-800/40 border-slate-700 text-slate-300 hover:border-emerald-700'
              }`}>
                <ArrowRight className="w-3 h-3" /> Plan Action
              </button>
            </div>
          </div>

          {/* Assign Execution Owner */}
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Assign Execution Owner</p>
            <input
              type="text"
              value={owner}
              onChange={e => setOwner(e.target.value)}
              placeholder="Enter owner name or email…"
              className="w-full bg-slate-800/40 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 mb-2"
            />
            <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white transition-colors flex items-center justify-center gap-2">
              <User className="w-3 h-3" /> Assign Owner
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
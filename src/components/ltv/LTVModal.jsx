import React, { useState } from 'react';
import { X, AlertTriangle, Zap, MessageSquare } from 'lucide-react';

const STAGE_CONFIG = {
  stabilizing: 'Stabilizing Phase',
  growth: 'Growth Phase',
  mature: 'Mature Phase',
  decline: 'Decline Risk',
};

function fmt(n) {
  if (!n) return '$0';
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;
}

function getStageInsight(stage, retention, expansion) {
  if (stage === 'mature') return `This mature client is a reliable long-term revenue foundation. Focus on expansion upsells and engagement to extend lifetime value.`;
  if (stage === 'growth') return `Strong growth trajectory. This client is expanding and shows high retention probability. Prioritize expansion conversations.`;
  if (stage === 'stabilizing') return `Client is stabilizing post-onboarding. Build reporting engagement to move toward growth phase.`;
  return `Declining retention probability detected. Immediate intervention recommended to reverse trend.`;
}

export default function LTVModal({ metric, onClose }) {
  const [newNote, setNewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  if (!metric) return null;
  const retention = metric.retention_probability_score || 70;

  async function addNote() {
    if (!newNote.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setNewNote('');
      setSubmitting(false);
    }, 500);
  }

  const avgMonthlyMRR = metric.average_monthly_value || 0;
  const projectedLTV = avgMonthlyMRR * 36; // 3-year projection
  const stageInsight = getStageInsight(metric.lifecycle_stage_projection, retention, metric.expansion_revenue_total);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0d1526] border border-slate-700/60 rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800/60">
          <div>
            <p className="text-[10px] text-violet-400 uppercase font-bold tracking-wider mb-1">Lifetime Value Analysis</p>
            <h2 className="text-xl font-black text-white">{metric.client_name}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* LTV Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/60 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Total Revenue Generated</p>
              <p className="text-xl font-black text-emerald-400">{fmt(metric.total_revenue_generated)}</p>
            </div>
            <div className="bg-slate-900/60 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">3-Year Projection</p>
              <p className="text-xl font-black text-violet-400">{fmt(projectedLTV)}</p>
            </div>
            <div className="bg-slate-900/60 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Months Active</p>
              <p className="text-xl font-black text-blue-400">{metric.months_active}</p>
            </div>
            <div className="bg-slate-900/60 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Avg Monthly Value</p>
              <p className="text-xl font-black text-teal-400">{fmt(metric.average_monthly_value)}</p>
            </div>
          </div>

          {/* Expansion Contribution */}
          {metric.expansion_revenue_total > 0 && (
            <div className="bg-teal-600/20 border border-teal-700/50 rounded-2xl p-4">
              <p className="text-[10px] text-teal-400 uppercase font-bold mb-2">Expansion Revenue Contribution</p>
              <p className="text-lg font-black text-teal-300">{fmt(metric.expansion_revenue_total)}</p>
              <p className="text-[10px] text-teal-300/70 mt-1">
                {Math.round((metric.expansion_revenue_total / metric.total_revenue_generated) * 100)}% of total revenue from expansion
              </p>
            </div>
          )}

          {/* Retention Probability */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Retention Probability</p>
              <span className="text-sm font-black" style={{ color: retention >= 80 ? '#10b981' : retention >= 60 ? '#f59e0b' : '#f43f5e' }}>
                {retention}/100
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${retention}%`, background: retention >= 80 ? '#10b981' : retention >= 60 ? '#f59e0b' : '#f43f5e' }} />
            </div>
          </div>

          {/* Lifecycle Stage & Insight */}
          <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-700/30">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Lifecycle Projection</p>
            <p className="text-sm text-slate-300 leading-relaxed">{STAGE_CONFIG[metric.lifecycle_stage_projection]}</p>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed italic">{stageInsight}</p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-2 px-3 py-2 bg-amber-600/20 border border-amber-700/50 rounded-xl text-xs font-bold text-amber-300 hover:bg-amber-600/30 transition-colors">
              <AlertTriangle className="w-4 h-4" /> Retention Strategy
            </button>
            <button className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600/20 border border-emerald-700/50 rounded-xl text-xs font-bold text-emerald-300 hover:bg-emerald-600/30 transition-colors">
              <Zap className="w-4 h-4" /> Expansion Review
            </button>
          </div>

          {/* Lifecycle Notes */}
          <div className="border-t border-slate-800/60 pt-4">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Lifecycle Note</p>
            <textarea
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="Add strategic note on this client's long-term value approach…"
              rows={2}
              className="w-full bg-slate-800/40 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none"
            />
            <button
              onClick={addNote}
              disabled={submitting || !newNote.trim()}
              className="mt-2 w-full px-3 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-xl text-xs font-bold text-white transition-colors"
            >
              {submitting ? 'Saving…' : 'Save Note'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
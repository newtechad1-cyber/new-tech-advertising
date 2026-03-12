import React, { useState } from 'react';
import { X, Send, Zap, CheckCircle2, ArrowUp } from 'lucide-react';

const RISK_REASON_CONFIG = {
  low_content_activity: 'Low Content Activity',
  slow_approvals: 'Slow Approvals',
  low_reporting_engagement: 'Low Reporting Engagement',
  performance_concern: 'Performance Concern',
  pricing_objection: 'Pricing Objection',
  competitor_pressure: 'Competitor Pressure',
};

const SEVERITY_CONFIG = {
  watch: { label: 'Watch', color: 'text-slate-400' },
  moderate: { label: 'Moderate', color: 'text-amber-400' },
  high: { label: 'High', color: 'text-orange-400' },
  critical: { label: 'Critical', color: 'text-rose-400' },
};

const STATUS_CONFIG = {
  planned: { label: 'Planned' },
  outreach_sent: { label: 'Outreach Sent' },
  in_discussion: { label: 'In Discussion' },
  resolved: { label: 'Resolved' },
  escalated: { label: 'Escalated' },
};

function fmt(n) {
  if (!n) return '$0';
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;
}

export default function RetentionModal({ intervention, onClose, onStatusUpdate }) {
  if (!intervention) return null;
  const [newNote, setNewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const sevCfg = SEVERITY_CONFIG[intervention.risk_severity] || SEVERITY_CONFIG.moderate;

  async function addNote() {
    if (!newNote.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setNewNote('');
      setSubmitting(false);
    }, 500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0d1526] border border-slate-700/60 rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800/60">
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${sevCfg.color}`}>{sevCfg.label} Risk</p>
            <h2 className="text-xl font-black text-white">{intervention.client_name}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Risk Summary */}
          <div className="bg-slate-900/60 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Risk Reason</span>
              <span className="text-xs font-bold text-slate-300">{RISK_REASON_CONFIG[intervention.risk_reason]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Status</span>
              <span className="text-xs font-bold text-slate-300">{STATUS_CONFIG[intervention.intervention_status]?.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">MRR at Risk</span>
              <span className="text-sm font-black text-rose-400">{fmt(intervention.projected_mrr_at_risk)}</span>
            </div>
            {intervention.assigned_success_manager && (
              <div className="flex justify-between pt-2 border-t border-slate-700/40">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Assigned Manager</span>
                <span className="text-xs font-bold text-slate-300">{intervention.assigned_success_manager}</span>
              </div>
            )}
          </div>

          {/* Recommended Action */}
          {intervention.recommended_action && (
            <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-700/30">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Recommended Action</p>
              <p className="text-sm text-slate-300 leading-relaxed">{intervention.recommended_action}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onStatusUpdate(intervention.id, 'outreach_sent')}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600/20 border border-blue-700/50 rounded-xl text-xs font-bold text-blue-300 hover:bg-blue-600/30 transition-colors"
            >
              <Send className="w-4 h-4" /> Mark Outreach Sent
            </button>
            <button
              onClick={() => onStatusUpdate(intervention.id, 'in_discussion')}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-amber-600/20 border border-amber-700/50 rounded-xl text-xs font-bold text-amber-300 hover:bg-amber-600/30 transition-colors"
            >
              <Zap className="w-4 h-4" /> Mark In Discussion
            </button>
            <button
              onClick={() => onStatusUpdate(intervention.id, 'resolved')}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600/20 border border-emerald-700/50 rounded-xl text-xs font-bold text-emerald-300 hover:bg-emerald-600/30 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" /> Mark Resolved
            </button>
            <button
              onClick={() => onStatusUpdate(intervention.id, 'escalated')}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-rose-600/20 border border-rose-700/50 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-600/30 transition-colors"
            >
              <ArrowUp className="w-4 h-4" /> Escalate
            </button>
          </div>

          {/* Intervention Notes */}
          <div className="border-t border-slate-800/60 pt-4">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Intervention Note</p>
            <textarea
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="Add action taken or discussion notes…"
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
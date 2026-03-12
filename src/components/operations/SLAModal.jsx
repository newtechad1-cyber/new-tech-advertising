import React, { useState } from 'react';
import { X, AlertTriangle, Zap, Send } from 'lucide-react';

const STATUS_CONFIG = {
  on_track: 'On Track',
  at_risk: 'At Risk',
  overdue: 'Overdue',
  delivered: 'Delivered',
};

const DELAY_REASON_LABELS = {
  capacity: 'Capacity Constraints',
  client_delay: 'Client Feedback Delay',
  revision_cycle: 'Revision Cycle',
  priority_shift: 'Priority Shift',
  technical_issue: 'Technical Issue',
};

export default function SLAModal({ sla, onClose, onStatusUpdate }) {
  if (!sla) return null;
  const [newNote, setNewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function addNote() {
    if (!newNote.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setNewNote('');
      setSubmitting(false);
    }, 500);
  }

  const daysOverdue = Math.ceil((new Date() - new Date(sla.sla_due_date)) / (1000 * 60 * 60 * 24));
  const isOverdue = daysOverdue > 0;
  const impact = sla.impact_score || 50;
  const impactLevel = impact >= 75 ? 'Critical' : impact >= 50 ? 'High' : 'Moderate';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0d1526] border border-slate-700/60 rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800/60">
          <div>
            <p className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider mb-1">SLA Fulfillment</p>
            <h2 className="text-xl font-black text-white">{sla.job_title}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* SLA Summary */}
          <div className="bg-slate-900/60 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Client</span>
              <span className="text-xs font-bold text-slate-300">{sla.client_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Due Date</span>
              <span className="text-xs font-bold text-slate-300">{new Date(sla.sla_due_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-700/40">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Status</span>
              <span className="text-xs font-bold text-slate-300">{STATUS_CONFIG[sla.sla_status]}</span>
            </div>
            {sla.actual_completion_date && (
              <div className="flex justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Completed</span>
                <span className="text-xs font-bold text-slate-300">{new Date(sla.actual_completion_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Impact Assessment */}
          <div className={`rounded-2xl p-4 border ${impact >= 75 ? 'bg-rose-600/20 border-rose-700/50' : 'bg-slate-900/40 border-slate-700/30'}`}>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Impact Assessment</p>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-black ${impact >= 75 ? 'text-rose-300' : 'text-slate-300'}`}>{impactLevel} Impact</span>
              <span className={`text-sm font-black ${impact >= 75 ? 'text-rose-300' : 'text-slate-300'}`}>{impact}/100</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${impact}%`, background: impact >= 75 ? '#ef4444' : impact >= 50 ? '#f59e0b' : '#10b981' }} />
            </div>
          </div>

          {/* Delay Reason */}
          {sla.delay_reason && (
            <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-700/30">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Delay Reason</p>
              <p className="text-sm text-slate-300">{DELAY_REASON_LABELS[sla.delay_reason] || sla.delay_reason}</p>
            </div>
          )}

          {/* Overdue Notice */}
          {isOverdue && (
            <div className="bg-rose-600/20 border border-rose-700/50 rounded-2xl p-4">
              <p className="text-[10px] text-rose-400 uppercase font-bold mb-1">Overdue Status</p>
              <p className="text-lg font-black text-rose-300">{daysOverdue} days overdue</p>
              <p className="text-[10px] text-rose-300/80 mt-1">Immediate client communication recommended.</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {sla.sla_status !== 'delivered' && (
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600/20 border border-emerald-700/50 rounded-xl text-xs font-bold text-emerald-300 hover:bg-emerald-600/30 transition-colors">
                <CheckCircle2 className="w-4 h-4" /> Mark Delivered
              </button>
            )}
            {(sla.sla_status === 'at_risk' || sla.sla_status === 'overdue') && (
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-amber-600/20 border border-amber-700/50 rounded-xl text-xs font-bold text-amber-300 hover:bg-amber-600/30 transition-colors">
                <Zap className="w-4 h-4" /> Escalate Priority
              </button>
            )}
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600/20 border border-blue-700/50 rounded-xl text-xs font-bold text-blue-300 hover:bg-blue-600/30 transition-colors">
              <Send className="w-4 h-4" /> Notify Client
            </button>
          </div>

          {/* SLA Note */}
          <div className="border-t border-slate-800/60 pt-4">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">SLA Note</p>
            <textarea
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="Add SLA status or resolution notes…"
              rows={2}
              className="w-full bg-slate-800/40 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
            />
            <button
              onClick={addNote}
              disabled={submitting || !newNote.trim()}
              className="mt-2 w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl text-xs font-bold text-white transition-colors"
            >
              {submitting ? 'Saving…' : 'Save Note'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// Missing import fix
import { CheckCircle2 } from 'lucide-react';
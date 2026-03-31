import React, { useState } from 'react';
import { X, Zap, ArrowRight } from 'lucide-react';

const STATUS_CONFIG = {
  deployed: 'Deployed',
  building: 'Building',
  planning: 'Planning',
  identified: 'Identified',
};

const WORKFLOW_LABELS = {
  content_production: 'Content Production',
  video_production: 'Video Production',
  campaign_setup: 'Campaign Setup',
  onboarding: 'Onboarding',
  reporting: 'Reporting',
  approvals: 'Approvals',
};

const STATUS_TRANSITIONS = {
  identified: ['planning'],
  planning: ['building'],
  building: ['deployed'],
  deployed: [],
};

export default function EfficiencyModal({ signal, onClose, onStatusUpdate }) {
  const [newStatus, setNewStatus] = useState(signal?.implementation_status);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  if (!signal) return null;

  async function updateStatus() {
    if (newStatus === signal.implementation_status) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
    }, 500);
  }

  const gain = signal.efficiency_gain_score || 50;
  const hours = signal.manual_hours_reduction_estimate || 0;
  const margin = signal.estimated_margin_improvement || (hours * 65);

  const nextStatuses = STATUS_TRANSITIONS[signal.implementation_status] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0d1526] border border-slate-700/60 rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800/60">
          <div>
            <p className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider mb-1">Efficiency Signal</p>
            <h2 className="text-xl font-black text-white">{signal.signal_title}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Signal Summary */}
          <div className="bg-slate-900/60 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Workflow Area</span>
              <span className="text-xs font-bold text-slate-300">{WORKFLOW_LABELS[signal.workflow_area]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Status</span>
              <span className="text-xs font-bold text-slate-300">{STATUS_CONFIG[signal.implementation_status]}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-700/40">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Efficiency Gain</span>
              <span className="text-xs font-bold text-cyan-400">{gain}%</span>
            </div>
          </div>

          {/* Impact Assessment */}
          <div className="bg-cyan-600/20 border border-cyan-700/50 rounded-2xl p-4 space-y-2">
            <p className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">Estimated Margin Impact</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-cyan-300">${Math.round(margin)}</span>
              <span className="text-xs text-cyan-300/80">monthly improvement</span>
            </div>
            <p className="text-[11px] text-cyan-300/80 mt-1">
              Based on {hours}h/month savings at $65/hour labor rate.
            </p>
          </div>

          {/* Recommended Solution */}
          <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-700/30">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Recommended Solution</p>
            <p className="text-sm text-slate-300 leading-relaxed">{signal.recommended_solution}</p>
          </div>

          {/* Implementation Notes */}
          {signal.implementation_notes && (
            <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-700/30">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Implementation Notes</p>
              <p className="text-sm text-slate-300 leading-relaxed">{signal.implementation_notes}</p>
            </div>
          )}

          {/* Status Transition */}
          {nextStatuses.length > 0 && (
            <div className="border-t border-slate-800/60 pt-4">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-3">Update Implementation Status</p>
              <div className="space-y-2">
                {nextStatuses.map(status => (
                  <button
                    key={status}
                    onClick={() => setNewStatus(status)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold transition-colors border flex items-center gap-2 ${
                      newStatus === status
                        ? 'bg-cyan-600 border-cyan-600 text-white'
                        : 'bg-slate-800/40 border-slate-700 text-slate-300 hover:border-cyan-700'
                    }`}
                  >
                    <ArrowRight className="w-3 h-3" /> Move to {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
              {newStatus !== signal.implementation_status && (
                <button
                  onClick={updateStatus}
                  disabled={submitting}
                  className="mt-3 w-full px-3 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 rounded-xl text-xs font-bold text-white transition-colors"
                >
                  {submitting ? 'Updating…' : 'Confirm Status Change'}
                </button>
              )}
            </div>
          )}

          {/* Operations Owner */}
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Add Implementation Note</p>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Track progress, blockers, or next steps…"
              rows={2}
              className="w-full bg-slate-800/40 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 resize-none"
            />
            <button className="mt-2 w-full px-3 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-xs font-bold text-white transition-colors">
              Save Note
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
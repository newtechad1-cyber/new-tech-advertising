import React, { useState } from 'react';
import { X, MessageSquare, Send, CheckCircle2, ThumbsDown } from 'lucide-react';

const OPPORTUNITY_CONFIG = {
  premium_video: 'Premium Video',
  authority_content: 'Authority Content',
  multi_location: 'Multi-Location',
  seasonal_campaign: 'Seasonal Campaign',
  pricing_upgrade: 'Pricing Upgrade',
  enterprise_package: 'Enterprise Package',
};

const STATUS_CONFIG = {
  identified: 'Identified',
  conversation_started: 'In Conversation',
  proposal_sent: 'Proposal Sent',
  converted: 'Converted',
  declined: 'Declined',
};

function fmt(n) {
  if (!n) return '+$0';
  return n >= 1000 ? `+$${(n / 1000).toFixed(1)}k` : `+$${n}`;
}

export default function ExpansionModal({ opportunity, onClose, onStatusUpdate }) {
  if (!opportunity) return null;
  const [newNote, setNewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const readiness = opportunity.readiness_score || 60;

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
            <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider mb-1">Expansion Opportunity</p>
            <h2 className="text-xl font-black text-white">{opportunity.client_name}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Opportunity Summary */}
          <div className="bg-slate-900/60 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Opportunity Type</span>
              <span className="text-xs font-bold text-slate-300">{OPPORTUNITY_CONFIG[opportunity.opportunity_type]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Status</span>
              <span className="text-xs font-bold text-slate-300">{STATUS_CONFIG[opportunity.expansion_status]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Projected MRR</span>
              <span className="text-sm font-black text-emerald-400">{fmt(opportunity.projected_mrr_increase)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Readiness</span>
              <span className="text-xs font-bold text-slate-300">{readiness}/100</span>
            </div>
            {opportunity.success_manager_owner && (
              <div className="flex justify-between pt-2 border-t border-slate-700/40">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Manager Owner</span>
                <span className="text-xs font-bold text-slate-300">{opportunity.success_manager_owner}</span>
              </div>
            )}
          </div>

          {/* Recommended Timing */}
          {opportunity.recommended_timing && (
            <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-700/30">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Recommended Timing</p>
              <p className="text-sm text-slate-300 leading-relaxed">{opportunity.recommended_timing}</p>
            </div>
          )}

          {/* Opportunity Notes */}
          {opportunity.opportunity_notes && (
            <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-700/30">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Opportunity Notes</p>
              <p className="text-sm text-slate-300 leading-relaxed">{opportunity.opportunity_notes}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {opportunity.expansion_status === 'identified' && (
              <button
                onClick={() => onStatusUpdate(opportunity.id, 'conversation_started')}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600/20 border border-blue-700/50 rounded-xl text-xs font-bold text-blue-300 hover:bg-blue-600/30 transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> Start Conversation
              </button>
            )}
            {opportunity.expansion_status === 'conversation_started' && (
              <button
                onClick={() => onStatusUpdate(opportunity.id, 'proposal_sent')}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-amber-600/20 border border-amber-700/50 rounded-xl text-xs font-bold text-amber-300 hover:bg-amber-600/30 transition-colors"
              >
                <Send className="w-4 h-4" /> Mark Proposal Sent
              </button>
            )}
            {opportunity.expansion_status !== 'converted' && opportunity.expansion_status !== 'declined' && (
              <button
                onClick={() => onStatusUpdate(opportunity.id, 'converted')}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600/20 border border-emerald-700/50 rounded-xl text-xs font-bold text-emerald-300 hover:bg-emerald-600/30 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" /> Mark Converted
              </button>
            )}
            {opportunity.expansion_status !== 'declined' && (
              <button
                onClick={() => onStatusUpdate(opportunity.id, 'declined')}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-600/20 border border-slate-700/50 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-600/30 transition-colors"
              >
                <ThumbsDown className="w-4 h-4" /> Mark Declined
              </button>
            )}
          </div>

          {/* Expansion Notes */}
          <div className="border-t border-slate-800/60 pt-4">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Expansion Note</p>
            <textarea
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="Add conversation notes or next steps…"
              rows={2}
              className="w-full bg-slate-800/40 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 resize-none"
            />
            <button
              onClick={addNote}
              disabled={submitting || !newNote.trim()}
              className="mt-2 w-full px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-xl text-xs font-bold text-white transition-colors"
            >
              {submitting ? 'Saving…' : 'Save Note'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
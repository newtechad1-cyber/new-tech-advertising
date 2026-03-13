import React, { useState } from 'react';
import { X, Phone, Mail, Calendar, FileText, ExternalLink, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';

const STAGES = [
  { id: 'new_lead', label: 'New Lead' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'discovery', label: 'Discovery' },
  { id: 'demo_scheduled', label: 'Demo Scheduled' },
  { id: 'demo_completed', label: 'Demo Completed' },
  { id: 'proposal_sent', label: 'Proposal Sent' },
  { id: 'verbal_yes', label: 'Verbal Yes' },
  { id: 'closed_won', label: 'Closed Won' },
  { id: 'closed_lost', label: 'Closed Lost' },
];

const ACTION_CONFIG = {
  log_call: { icon: Phone, title: 'Log Call', color: '#3b82f6' },
  send_email: { icon: Mail, title: 'Send Email', color: '#10b981' },
  schedule_demo: { icon: Calendar, title: 'Schedule Demo', color: '#f59e0b' },
  create_proposal: { icon: FileText, title: 'Create Proposal', color: '#8b5cf6' },
  open_deal_room: { icon: ExternalLink, title: 'Open Deal Room', color: '#06b6d4' },
  move_stage: { icon: ChevronRight, title: 'Move Stage', color: '#94a3b8' },
  mark_won: { icon: CheckCircle2, title: 'Mark Won', color: '#10b981' },
  mark_lost: { icon: XCircle, title: 'Mark Lost', color: '#ef4444' },
};

export default function QuickActionModal({ action, opportunity, onClose, onConfirm }) {
  const [data, setData] = useState({
    notes: '', date: '', targetStage: '', lost_reason: '', proposal_value: opportunity.deal_value || ''
  });

  const config = ACTION_CONFIG[action];
  if (!config) return null;
  const Icon = config.icon;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(action, opportunity, data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md">
        <div className="flex items-center gap-3 p-6 border-b border-slate-700">
          <div className="p-2 rounded-lg" style={{ background: `${config.color}22` }}>
            <Icon className="w-5 h-5" style={{ color: config.color }} />
          </div>
          <div>
            <h3 className="text-white font-bold">{config.title}</h3>
            <p className="text-slate-400 text-sm">{opportunity.company_name}</p>
          </div>
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {action === 'log_call' && (
            <>
              <div>
                <label className="text-slate-400 text-xs font-medium block mb-1">Call Date</label>
                <input type="date" value={data.date} onChange={e => setData(d => ({ ...d, date: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-slate-400 text-xs font-medium block mb-1">Call Notes</label>
                <textarea value={data.notes} onChange={e => setData(d => ({ ...d, notes: e.target.value }))} rows={4}
                  className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="What was discussed? Pain points, objections, next steps..." />
              </div>
            </>
          )}

          {action === 'schedule_demo' && (
            <div>
              <label className="text-slate-400 text-xs font-medium block mb-1">Demo Date & Time</label>
              <input type="datetime-local" value={data.date} onChange={e => setData(d => ({ ...d, date: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
            </div>
          )}

          {action === 'send_email' && (
            <div>
              <label className="text-slate-400 text-xs font-medium block mb-1">Email Subject / Notes</label>
              <textarea value={data.notes} onChange={e => setData(d => ({ ...d, notes: e.target.value }))} rows={4}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Subject line or notes for the follow-up email..." />
            </div>
          )}

          {action === 'create_proposal' && (
            <div>
              <label className="text-slate-400 text-xs font-medium block mb-1">Proposal Value ($)</label>
              <input type="number" value={data.proposal_value} onChange={e => setData(d => ({ ...d, proposal_value: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
            </div>
          )}

          {action === 'move_stage' && (
            <div>
              <label className="text-slate-400 text-xs font-medium block mb-1">Move to Stage</label>
              <select value={data.targetStage} onChange={e => setData(d => ({ ...d, targetStage: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                <option value="">Select stage...</option>
                {STAGES.filter(s => s.id !== opportunity.stage).map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          )}

          {action === 'mark_lost' && (
            <div>
              <label className="text-slate-400 text-xs font-medium block mb-1">Lost Reason</label>
              <select value={data.lost_reason} onChange={e => setData(d => ({ ...d, lost_reason: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                <option value="">Select reason...</option>
                {['Price too high', 'Went with competitor', 'Not ready yet', 'No budget', 'No response', 'Wrong fit', 'Other'].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          )}

          {action === 'mark_won' && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-700/40 rounded-lg">
              <p className="text-emerald-400 font-semibold text-sm">🎉 Mark this deal as Closed Won?</p>
              <p className="text-slate-400 text-xs mt-1">This will trigger client onboarding automation and move the deal to the Won stage.</p>
            </div>
          )}

          {action === 'open_deal_room' && (
            <div className="p-4 bg-slate-800 rounded-lg">
              <p className="text-slate-300 text-sm font-medium mb-2">Deal Room Link</p>
              <div className="flex items-center gap-2">
                <input readOnly value={`/deal-room/${encodeURIComponent(opportunity.company_name?.toLowerCase().replace(/\s+/g, '-'))}`}
                  className="flex-1 bg-slate-900 border border-slate-600 text-blue-400 rounded-lg px-3 py-2 text-xs" />
                <button type="button" onClick={() => { window.open(`/deal-room/${encodeURIComponent(opportunity.company_name?.toLowerCase().replace(/\s+/g, '-'))}`, '_blank'); onClose(); }}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors">
                  Open
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 hover:text-white rounded-lg text-sm font-semibold transition-colors">
              Cancel
            </button>
            {action !== 'open_deal_room' && (
              <button type="submit"
                className="flex-1 px-4 py-2 text-white rounded-lg text-sm font-semibold transition-colors"
                style={{ background: config.color }}>
                Confirm
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
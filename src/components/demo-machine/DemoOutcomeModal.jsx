import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, Calendar, FileText, BookOpen, ArrowRight } from 'lucide-react';

const OUTCOME_ACTIONS = [
  { id: 'send_proposal', icon: FileText, label: 'Send Proposal', color: '#8b5cf6', description: 'Generate & send pricing proposal' },
  { id: 'open_deal_room', icon: ArrowRight, label: 'Open Deal Room', color: '#06b6d4', description: 'Launch personalized deal room' },
  { id: 'schedule_strategy', icon: Calendar, label: 'Schedule Strategy Call', color: '#f59e0b', description: 'Book follow-up strategy session' },
  { id: 'send_case_studies', icon: BookOpen, label: 'Send Case Studies', color: '#3b82f6', description: 'Share relevant industry wins' },
  { id: 'mark_no_fit', icon: XCircle, label: 'Mark No Fit', color: '#ef4444', description: 'Remove from active pipeline' },
  { id: 'move_stage', icon: CheckCircle2, label: 'Move Opportunity Stage', color: '#10b981', description: 'Update to Demo Completed' },
];

const NEXT_STAGES = [
  { id: 'demo_completed', label: 'Demo Completed' },
  { id: 'proposal_sent', label: 'Proposal Sent' },
  { id: 'verbal_yes', label: 'Verbal Yes' },
  { id: 'closed_lost', label: 'Closed Lost' },
];

export default function DemoOutcomeModal({ onClose, onConfirm, opportunity, engagementScore }) {
  const [selectedAction, setSelectedAction] = useState('move_stage');
  const [notes, setNotes] = useState('');
  const [targetStage, setTargetStage] = useState('demo_completed');
  const [followupDate, setFollowupDate] = useState('');

  const handleConfirm = () => {
    onConfirm(selectedAction, { notes, targetStage, followupDate });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-white text-xl font-bold">Log Demo Outcome</h2>
            <p className="text-slate-400 text-sm">{opportunity?.company_name} · Engagement: <span className="text-blue-400 font-bold">{engagementScore}%</span></p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Outcome actions grid */}
          <div>
            <p className="text-slate-400 text-xs font-medium mb-3">Next Action</p>
            <div className="grid grid-cols-2 gap-2">
              {OUTCOME_ACTIONS.map((a) => {
                const Icon = a.icon;
                const sel = selectedAction === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => setSelectedAction(a.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                      sel ? 'border-opacity-60 bg-opacity-10' : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800'
                    }`}
                    style={sel ? { borderColor: a.color, background: `${a.color}12` } : {}}
                  >
                    <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: a.color }} />
                    <div>
                      <p className="text-white text-xs font-semibold">{a.label}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{a.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stage picker if move_stage */}
          {selectedAction === 'move_stage' && (
            <div>
              <p className="text-slate-400 text-xs font-medium mb-2">Move to Stage</p>
              <div className="grid grid-cols-2 gap-2">
                {NEXT_STAGES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setTargetStage(s.id)}
                    className={`p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                      targetStage === s.id ? 'border-blue-500 bg-blue-600/15 text-blue-400' : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up date */}
          {(selectedAction === 'schedule_strategy' || selectedAction === 'move_stage') && (
            <div>
              <p className="text-slate-400 text-xs font-medium mb-2">Follow-Up Date</p>
              <input type="datetime-local" value={followupDate} onChange={e => setFollowupDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
            </div>
          )}

          {/* Notes */}
          <div>
            <p className="text-slate-400 text-xs font-medium mb-2">Demo Notes</p>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4}
              className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Key takeaways, objections raised, prospect's main pain points, verbal commitments..." />
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-600 text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition-colors">
              Cancel
            </button>
            <button onClick={handleConfirm} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-colors">
              Confirm & Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
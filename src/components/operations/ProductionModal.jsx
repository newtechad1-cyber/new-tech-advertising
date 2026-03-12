import React, { useState } from 'react';
import { X, CheckCircle2, PlayCircle, AlertTriangle, Lock } from 'lucide-react';

const JOB_TYPE_LABELS = {
  content: 'Content Creation',
  video: 'Video Production',
  campaign: 'Campaign Management',
  authority_batch: 'Authority Building',
  reporting: 'Report Generation',
  onboarding_setup: 'Client Onboarding',
};

const STATUS_CONFIG = {
  queued: 'Queued',
  in_progress: 'In Progress',
  review: 'Review',
  completed: 'Completed',
  blocked: 'Blocked',
};

const PRIORITY_CONFIG = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export default function ProductionModal({ job, onClose, onStatusUpdate }) {
  if (!job) return null;
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

  const daysUntilDue = job.due_date ? Math.ceil((new Date(job.due_date) - new Date()) / (1000 * 60 * 60 * 24)) : null;
  const isOverdue = daysUntilDue !== null && daysUntilDue < 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0d1526] border border-slate-700/60 rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800/60">
          <div>
            <p className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider mb-1">Production Job</p>
            <h2 className="text-xl font-black text-white">{job.job_title}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Job Summary */}
          <div className="bg-slate-900/60 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Job Type</span>
              <span className="text-xs font-bold text-slate-300">{JOB_TYPE_LABELS[job.job_type]}</span>
            </div>
            {job.client_name && (
              <div className="flex justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Client</span>
                <span className="text-xs font-bold text-slate-300">{job.client_name}</span>
              </div>
            )}
            {job.vertical && (
              <div className="flex justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Vertical</span>
                <span className="text-xs font-bold text-slate-300">{job.vertical}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-slate-700/40">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Priority</span>
              <span className="text-xs font-bold text-slate-300">{PRIORITY_CONFIG[job.priority_level]}</span>
            </div>
            {job.estimated_hours > 0 && (
              <div className="flex justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Est. Hours</span>
                <span className="text-xs font-bold text-slate-300">{job.estimated_hours}h</span>
              </div>
            )}
          </div>

          {/* Due Date */}
          {job.due_date && (
            <div className={`rounded-2xl p-4 border ${isOverdue ? 'bg-rose-600/20 border-rose-700/50' : 'bg-slate-900/40 border-slate-700/30'}`}>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Due Date</p>
              <p className={`text-sm font-bold ${isOverdue ? 'text-rose-300' : 'text-slate-300'}`}>
                {new Date(job.due_date).toLocaleDateString()}
              </p>
              {daysUntilDue !== null && (
                <p className={`text-[10px] mt-1 ${isOverdue ? 'text-rose-300/80' : 'text-slate-400'}`}>
                  {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days remaining`}
                </p>
              )}
            </div>
          )}

          {/* Assigned Role */}
          {job.assigned_team_role && (
            <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-700/30">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Assigned Role</p>
              <p className="text-sm text-slate-300">{job.assigned_team_role}</p>
            </div>
          )}

          {/* Status Workflow */}
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-3">Update Status</p>
            <div className="grid grid-cols-2 gap-2">
              {job.job_status !== 'in_progress' && (
                <button
                  onClick={() => onStatusUpdate(job.id, 'in_progress')}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600/20 border border-blue-700/50 rounded-xl text-xs font-bold text-blue-300 hover:bg-blue-600/30 transition-colors"
                >
                  <PlayCircle className="w-4 h-4" /> Start
                </button>
              )}
              {job.job_status === 'in_progress' && (
                <button
                  onClick={() => onStatusUpdate(job.id, 'review')}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-amber-600/20 border border-amber-700/50 rounded-xl text-xs font-bold text-amber-300 hover:bg-amber-600/30 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" /> Review
                </button>
              )}
              {job.job_status === 'review' && (
                <button
                  onClick={() => onStatusUpdate(job.id, 'completed')}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600/20 border border-emerald-700/50 rounded-xl text-xs font-bold text-emerald-300 hover:bg-emerald-600/30 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" /> Complete
                </button>
              )}
              {job.job_status !== 'blocked' && (
                <button
                  onClick={() => onStatusUpdate(job.id, 'blocked')}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-600/20 border border-slate-700/50 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-600/30 transition-colors"
                >
                  <Lock className="w-4 h-4" /> Block
                </button>
              )}
            </div>
          </div>

          {/* Job Notes */}
          <div className="border-t border-slate-800/60 pt-4">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Job Note</p>
            <textarea
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="Add progress update or blocker notes…"
              rows={2}
              className="w-full bg-slate-800/40 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 resize-none"
            />
            <button
              onClick={addNote}
              disabled={submitting || !newNote.trim()}
              className="mt-2 w-full px-3 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 rounded-xl text-xs font-bold text-white transition-colors"
            >
              {submitting ? 'Saving…' : 'Save Note'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
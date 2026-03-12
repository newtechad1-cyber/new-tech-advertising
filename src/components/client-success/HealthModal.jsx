import React, { useState } from 'react';
import { X, Calendar, AlertTriangle, TrendingUp, MessageSquare } from 'lucide-react';

function scoreColor(score) {
  if (score >= 75) return { text: 'text-emerald-400', bar: '#10b981' };
  if (score >= 50) return { text: 'text-amber-400', bar: '#f59e0b' };
  return               { text: 'text-rose-400', bar: '#f43f5e' };
}

const STAGE_CONFIG = {
  onboarding:      'Onboarding',
  stabilizing:     'Stabilizing',
  growing:         'Growing',
  expansion_ready: 'Expansion Ready',
  at_risk:         'At Risk',
};

function ScoreBar({ label, score }) {
  const sc = scoreColor(score);
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-400 font-semibold">{label}</span>
        <span className={`text-sm font-bold ${sc.text}`}>{score}</span>
      </div>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: sc.bar }} />
      </div>
    </div>
  );
}

export default function HealthModal({ profile, onClose }) {
  if (!profile) return null;
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function addNote() {
    if (!note.trim()) return;
    setSubmitting(true);
    // Would save to lifecycle notes entity
    setTimeout(() => {
      setNote('');
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
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">{profile.industry_vertical || 'Client'}</p>
            <h2 className="text-xl font-black text-white">{profile.client_name}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Account & Stage */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/60 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Account Value</p>
              <p className="text-lg font-black text-emerald-400">${(profile.account_value_mrr || 0).toLocaleString()}/mo</p>
            </div>
            <div className="bg-slate-900/60 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Lifecycle Stage</p>
              <p className="text-sm font-bold text-violet-400">{STAGE_CONFIG[profile.lifecycle_stage] || 'Unknown'}</p>
            </div>
          </div>

          {/* Score Bars */}
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-3">Health Metrics</p>
            <ScoreBar label="Overall Health" score={profile.health_score || 70} />
            <ScoreBar label="Content Activity" score={profile.content_activity_score || 60} />
            <ScoreBar label="Approval Responsiveness" score={profile.approval_responsiveness_score || 70} />
            <ScoreBar label="Reporting Engagement" score={profile.reporting_engagement_score || 65} />
            <ScoreBar label="Expansion Readiness" score={profile.expansion_readiness_score || 50} />
          </div>

          {/* Risk Alert */}
          {profile.churn_risk_level === 'high' && (
            <div className="bg-rose-600/20 border border-rose-700/50 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-rose-300 mb-1">High Churn Risk</p>
                <p className="text-xs text-rose-200/70">This client requires immediate retention strategy review and dedicated support intervention.</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Actions</p>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-2 px-3 py-2 bg-violet-600/20 border border-violet-700/50 rounded-xl text-xs font-bold text-violet-300 hover:bg-violet-600/30 transition-colors">
                <Calendar className="w-4 h-4" /> Strategy Review
              </button>
              <button className="flex items-center justify-center gap-2 px-3 py-2 bg-rose-600/20 border border-rose-700/50 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-600/30 transition-colors">
                <AlertTriangle className="w-4 h-4" /> Flag Risk
              </button>
              <button className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600/20 border border-emerald-700/50 rounded-xl text-xs font-bold text-emerald-300 hover:bg-emerald-600/30 transition-colors">
                <TrendingUp className="w-4 h-4" /> Mark Expansion
              </button>
              <button className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-600/20 border border-slate-700/50 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-600/30 transition-colors">
                <MessageSquare className="w-4 h-4" /> Add Note
              </button>
            </div>
          </div>

          {/* Note Input */}
          <div className="border-t border-slate-800/60 pt-4">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Lifecycle Note</p>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add client success note or action item…"
              rows={2}
              className="w-full bg-slate-800/40 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none"
            />
            <button
              onClick={addNote}
              disabled={submitting || !note.trim()}
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
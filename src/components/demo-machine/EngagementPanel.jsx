import React, { useState } from 'react';
import { Activity, MessageSquare, Shield, TrendingUp, CheckCircle2, AlertCircle, Flame } from 'lucide-react';

const OBJECTIONS = [
  {
    obj: "It's too expensive",
    response: "Let's anchor to value. If this system delivers just 3 new clients per month — at your average ticket — what's the annual revenue? The platform pays for itself in the first client.",
  },
  {
    obj: "I don't have time to manage it",
    response: "That's exactly why NTA exists. This is 100% done-for-you. Your job is 30 minutes a month for approval. We handle everything else.",
  },
  {
    obj: "I want to think about it",
    response: "Totally fair. What specific piece of information would help you feel confident? And — just so you know — we limit market spots to one business per territory.",
  },
  {
    obj: "I tried marketing before and it didn't work",
    response: "I hear that a lot. Can you tell me what that looked like? Most failures come from inconsistency or wrong channel mix. We've built a system that removes those variables.",
  },
  {
    obj: "I'm already using someone else",
    response: "What results are you currently getting? If you're happy with 5+ new clients a month and strong visibility, this might not be the right fit. But if not — let's compare directly.",
  },
  {
    obj: "I need to talk to my partner",
    response: "Makes complete sense. Can we schedule a short call with them this week? I can run the full ROI analysis in 15 minutes — it usually makes the decision easy.",
  },
];

const SIGNALS = [
  { id: 'asked_pricing', label: 'Asked about pricing', score: 15 },
  { id: 'viewed_case_studies', label: 'Engaged with case studies', score: 10 },
  { id: 'asked_roi', label: 'Asked about ROI / results', score: 15 },
  { id: 'took_notes', label: 'Took notes during demo', score: 10 },
  { id: 'positive_body_language', label: 'Positive engagement / nodding', score: 8 },
  { id: 'asked_timeline', label: 'Asked about onboarding timeline', score: 20 },
  { id: 'asked_competition', label: 'Asked about competitors', score: 5 },
  { id: 'mentioned_budget', label: 'Mentioned budget range', score: 12 },
  { id: 'asked_next_steps', label: 'Asked about next steps', score: 25 },
];

export default function EngagementPanel({ signals, setSignals }) {
  const [activeObj, setActiveObj] = useState(null);

  const score = SIGNALS.filter(s => signals.includes(s.id)).reduce((sum, s) => sum + s.score, 0);
  const maxScore = SIGNALS.reduce((s, sig) => s + sig.score, 0);
  const pct = Math.round((score / maxScore) * 100);

  const readiness = pct >= 60 ? 'hot' : pct >= 35 ? 'warm' : 'cold';
  const readinessConfig = {
    hot: { label: 'Hot Prospect', color: '#ef4444', bg: 'from-red-950/40 to-slate-900', icon: Flame },
    warm: { label: 'Warm Prospect', color: '#f59e0b', bg: 'from-amber-950/30 to-slate-900', icon: TrendingUp },
    cold: { label: 'Needs Nurturing', color: '#94a3b8', bg: 'from-slate-800 to-slate-900', icon: Activity },
  };
  const rc = readinessConfig[readiness];
  const RCIcon = rc.icon;

  return (
    <div className="flex flex-col h-full bg-slate-900/60 border-l border-slate-800 overflow-y-auto">
      {/* Close Readiness */}
      <div className={`p-4 bg-gradient-to-b ${rc.bg} border-b border-slate-800`}>
        <p className="text-slate-400 text-xs font-medium mb-2">Close Readiness</p>
        <div className="flex items-center gap-2 mb-2">
          <RCIcon className="w-4 h-4" style={{ color: rc.color }} />
          <span className="text-white font-bold text-sm">{rc.label}</span>
          <span className="ml-auto text-xl font-bold" style={{ color: rc.color }}>{pct}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: rc.color }}
          />
        </div>
        <p className="text-slate-600 text-xs mt-1">{score} / {maxScore} engagement points</p>
      </div>

      {/* Engagement Signals */}
      <div className="p-4 border-b border-slate-800">
        <p className="text-slate-300 text-xs font-bold mb-3 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-blue-400" /> Prospect Signals
        </p>
        <div className="space-y-2">
          {SIGNALS.map((s) => {
            const checked = signals.includes(s.id);
            return (
              <label key={s.id} className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  onClick={() => setSignals(prev => checked ? prev.filter(x => x !== s.id) : [...prev, s.id])}
                  className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                    checked ? 'bg-blue-600 border-blue-600' : 'border-slate-600 group-hover:border-slate-500'
                  }`}
                >
                  {checked && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-xs leading-tight ${checked ? 'text-white' : 'text-slate-400'}`}>{s.label}</span>
                <span className="ml-auto text-xs font-bold" style={{ color: checked ? '#3b82f6' : '#475569' }}>+{s.score}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Objection Library */}
      <div className="p-4">
        <p className="text-slate-300 text-xs font-bold mb-3 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-purple-400" /> Objection Responses
        </p>
        <div className="space-y-2">
          {OBJECTIONS.map((o, i) => (
            <div key={i}>
              <button
                onClick={() => setActiveObj(activeObj === i ? null : i)}
                className={`w-full flex items-start gap-2 text-left p-2.5 rounded-lg border transition-all ${
                  activeObj === i
                    ? 'border-purple-500/40 bg-purple-950/20'
                    : 'border-slate-700/40 bg-slate-800/30 hover:bg-slate-800/60'
                }`}
              >
                <AlertCircle className="w-3 h-3 text-orange-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-xs font-medium">{o.obj}</span>
              </button>
              {activeObj === i && (
                <div className="mt-1 ml-2 p-3 bg-purple-950/20 border border-purple-500/20 rounded-lg">
                  <p className="text-purple-200 text-xs leading-relaxed">{o.response}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
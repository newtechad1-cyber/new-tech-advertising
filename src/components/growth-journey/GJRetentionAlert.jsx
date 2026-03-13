import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, BarChart2, MessageSquare, Phone } from 'lucide-react';

const SIGNAL_META = {
  portal_disengagement:   { icon: Clock,          label: 'Portal Engagement', desc: 'Your team has not logged in recently — we want to make sure everything is on track.' },
  approval_delay:         { icon: AlertTriangle,  label: 'Content Approvals', desc: 'A few pieces of content are awaiting your approval. Approving content keeps your publishing cadence on track.' },
  roi_stagnation:         { icon: BarChart2,      label: 'Growth Momentum', desc: 'We are monitoring your ROI trajectory and want to review what is working best together.' },
  support_friction:       { icon: MessageSquare,  label: 'Support Activity', desc: 'We noticed higher than usual support interactions — your strategist will be in touch.' },
  no_strategist_contact:  { icon: Phone,          label: 'Strategist Check-In', desc: 'It has been a while since your last strategy touchpoint. We recommend scheduling a review.' },
  content_backlog:        { icon: Clock,          label: 'Content Pipeline', desc: 'Your content queue has items that need attention to keep momentum.' },
};

export default function GJRetentionAlert({ signals = [], onResolve }) {
  if (!signals.length) return null;

  const topSignal = signals.sort((a, b) => b.score_impact - a.score_impact)[0];
  const meta = SIGNAL_META[topSignal.signal_type] || SIGNAL_META.portal_disengagement;
  const Icon = meta.icon;
  const isCritical = topSignal.severity === 'critical' || topSignal.severity === 'high';

  return (
    <div className={`rounded-2xl p-4 border-2 ${isCritical ? 'border-amber-200 bg-amber-50' : 'border-blue-100 bg-blue-50'}`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isCritical ? 'bg-amber-100' : 'bg-blue-100'}`}>
          <Icon className={`w-4.5 h-4.5 ${isCritical ? 'text-amber-600' : 'text-blue-600'}`} />
        </div>
        <div className="flex-1">
          <p className={`text-sm font-black mb-0.5 ${isCritical ? 'text-amber-900' : 'text-blue-900'}`}>
            {meta.label} — Your Strategist Wants to Connect
          </p>
          <p className={`text-xs leading-relaxed ${isCritical ? 'text-amber-700' : 'text-blue-700'}`}>{meta.desc}</p>
          {signals.length > 1 && (
            <p className="text-xs text-slate-400 mt-1">{signals.length - 1} other item{signals.length > 2 ? 's' : ''} flagged for review</p>
          )}
        </div>
        {onResolve && (
          <button onClick={() => onResolve(topSignal.id)}
            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/60 transition-colors text-slate-400">
            <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
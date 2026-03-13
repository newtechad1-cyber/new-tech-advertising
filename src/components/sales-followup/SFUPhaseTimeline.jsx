import React from 'react';
import { CheckCircle2, Clock, Circle, Zap } from 'lucide-react';

const PHASES = [
  { num: 1, label: 'Recap', color: '#3b82f6', desc: 'Same-day recap + deal room link' },
  { num: 2, label: 'Proof', color: '#8b5cf6', desc: 'Authority case study / testimonial' },
  { num: 3, label: 'ROI', color: '#10b981', desc: '6-month growth timeline perspective' },
  { num: 4, label: 'Urgency', color: '#f59e0b', desc: 'Market timing urgency message' },
  { num: 5, label: 'Check-In', color: '#06b6d4', desc: 'Strategic 1:1 check-in invite' },
  { num: 6, label: 'Nurture', color: '#64748b', desc: 'Long-cycle re-engagement' },
];

export default function SFUPhaseTimeline({ currentPhase = 1, engagementTier = 'warm', compact = false }) {
  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {PHASES.map((p) => (
          <div key={p.num} className="flex items-center gap-1">
            <div
              className="flex items-center justify-center rounded-full text-xs font-black transition-all"
              style={{
                width: 22,
                height: 22,
                background: p.num < currentPhase ? p.color : p.num === currentPhase ? p.color : '#e2e8f0',
                color: p.num <= currentPhase ? 'white' : '#94a3b8',
                opacity: p.num > currentPhase + 1 ? 0.5 : 1,
              }}
            >
              {p.num < currentPhase ? '✓' : p.num}
            </div>
            {p.num < 6 && (
              <div className="w-3 h-0.5 rounded" style={{ background: p.num < currentPhase ? p.color : '#e2e8f0' }} />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-start gap-0">
      {PHASES.map((p, idx) => (
        <div key={p.num} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-sm font-black mb-1.5 transition-all"
              style={{
                background: p.num < currentPhase ? p.color : p.num === currentPhase ? p.color : '#f1f5f9',
                color: p.num <= currentPhase ? 'white' : '#94a3b8',
                boxShadow: p.num === currentPhase ? `0 0 0 4px ${p.color}20` : 'none',
              }}
            >
              {p.num < currentPhase ? '✓' : p.num === currentPhase && engagementTier !== 'cold' ? (
                <Zap className="w-4 h-4" />
              ) : p.num}
            </div>
            <p className="text-xs font-bold text-slate-700 text-center leading-tight">{p.label}</p>
            <p className="text-xs text-slate-400 text-center leading-tight mt-0.5 hidden lg:block max-w-[70px]">{p.desc}</p>
          </div>
          {idx < PHASES.length - 1 && (
            <div className="h-0.5 flex-1 mb-7 mx-1 rounded" style={{ background: p.num < currentPhase ? p.color : '#e2e8f0' }} />
          )}
        </div>
      ))}
    </div>
  );
}
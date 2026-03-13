import React from 'react';

const PHASES = [
  {
    label: 'Week 1–2', title: 'Onboarding & Strategy',
    color: '#3b82f6',
    steps: ['Welcome call + account setup', 'Brand intake + competitor audit', 'Content strategy finalized', 'Approval workflow configured'],
  },
  {
    label: 'Week 2–4', title: 'Production Launch',
    color: '#8b5cf6',
    steps: ['Content calendar live', 'First blog posts + social content published', 'Google Business Profile fully optimized', 'Review generation system activated'],
  },
  {
    label: 'Month 2', title: 'Authority Building',
    color: '#f59e0b',
    steps: ['Video content batch delivered', 'Streaming TV commercial in production', 'SEO link-building campaign begins', 'First performance report delivered'],
  },
  {
    label: 'Month 3', title: 'Market Momentum',
    color: '#10b981',
    steps: ['Streaming TV campaign goes live', 'Ranking improvements visible', 'Lead volume increase measurable', 'Strategy call + optimization'],
  },
  {
    label: 'Month 6+', title: 'Market Authority',
    color: '#ec4899',
    steps: ['Top 3 rankings on primary keywords', 'Consistent inbound lead flow', 'Authority brand established', 'Expansion & upsell strategy'],
  },
];

export default function DRProcessTimeline() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-800/60">
      <div className="text-center mb-10">
        <h2 className="text-white text-3xl font-black mb-3">How It Works — Step by Step</h2>
        <p className="text-slate-400 text-base">Your clear roadmap from onboarding to market authority.</p>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600 opacity-30" />

        <div className="space-y-6">
          {PHASES.map((phase, i) => (
            <div key={i} className="relative pl-16">
              {/* Dot */}
              <div className="absolute left-4 top-5 w-4 h-4 rounded-full border-2 -translate-x-1/2" style={{ borderColor: phase.color, background: `${phase.color}33` }} />

              <div className="bg-slate-800/50 border border-slate-700/40 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ color: phase.color, background: `${phase.color}18` }}>{phase.label}</span>
                    <h3 className="text-white font-bold text-base mt-2">{phase.title}</h3>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {phase.steps.map((step, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: phase.color }} />
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
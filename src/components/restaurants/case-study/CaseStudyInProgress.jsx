import React from 'react';

const CYCLE = ['Listen', 'Capture', 'Understand', 'Decide', 'Act', 'Measure', 'Learn', 'Improve'];

export default function CaseStudyInProgress() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-bold uppercase tracking-widest mb-6">
        Case Study in Progress
      </div>
      <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mb-4">
        This Roadmap is not presented as a finished success story.
      </p>
      <p className="text-slate-400 leading-relaxed max-w-3xl mb-8">
        It's an example of how NTA works with a real business: listen first, understand what already exists, capture what
        people know, identify useful priorities, take action, measure what happens, and keep improving.
      </p>
      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm font-semibold">
          {CYCLE.map((step, i) => (
            <span key={step} className="inline-flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20">{step}</span>
              {i < CYCLE.length - 1 && <span className="text-slate-600">→</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
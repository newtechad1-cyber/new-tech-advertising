import React from 'react';

const QUESTIONS = [
  "What does Cattleman's already have?",
  "What do Pete and his team know about the business?",
  "What are customers telling them?",
  "Where are the opportunities?",
  "What information is getting lost?",
  "What could help the team work better together?",
  "And what part of the business makes the most sense to work on next?",
];

export default function CaseStudyIntro() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 border-t border-slate-800/60">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/25 bg-amber-500/10 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-5">
        A Real Restaurant. A Roadmap in Progress.
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-snug">
        See How We're Building This With Cattleman's
      </h2>
      <p className="text-slate-400 text-lg leading-relaxed mb-6 max-w-3xl">
        Cattleman's gives us a real example of how a Restaurant Growth Roadmap begins.
      </p>
      <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-3xl">
        We didn't start by deciding what software Pete needed or by handing him a package of marketing services. We started
        by looking at the restaurant as a whole.
      </p>

      <ul className="space-y-2.5 mb-8 max-w-3xl">
        {QUESTIONS.map((q, i) => (
          <li key={i} className="flex items-start gap-3 text-slate-300 leading-relaxed">
            <span className="text-blue-400 mt-1 flex-shrink-0">—</span>
            <span>{q}</span>
          </li>
        ))}
      </ul>

      <p className="text-white text-lg leading-relaxed max-w-3xl">
        From those conversations, we're beginning to build a practical{' '}
        <span className="text-blue-300 font-semibold">Cattleman's Growth Roadmap</span>.
      </p>
    </section>
  );
}
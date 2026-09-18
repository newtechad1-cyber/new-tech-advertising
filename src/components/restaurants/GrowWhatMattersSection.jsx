import React from 'react';
import { Target } from 'lucide-react';

const NEEDS = [
  'more lunch traffic', 'catering', 'private events', 'stronger bar business',
  'repeat customers', 'better hiring and training', 'better communication between front and back of house',
  'improved Google visibility', 'a clearer website or menu',
];

export default function GrowWhatMattersSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 border-t border-slate-800/60">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/25 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-5">
        <Target className="w-3.5 h-3.5" /> Grow What Matters Now
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-snug">
        Grow What Matters Now.
      </h2>
      <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-3xl">
        Do not assume every restaurant needs more dinner customers. One restaurant might need:
      </p>

      <div className="flex flex-wrap gap-2.5 mb-10">
        {NEEDS.map((n, i) => (
          <span key={i} className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-900/50 text-slate-200 text-sm">
            {n}
          </span>
        ))}
      </div>

      <p className="text-slate-400 text-lg leading-relaxed mb-6 max-w-3xl">
        The Growth Roadmap helps determine where attention belongs now. Then the website, marketing, content, video,
        Google presence, reviews, social media, customer communication, and useful technology can support that priority.
      </p>
      <p className="text-blue-300 font-semibold text-lg">
        The business determines the marketing priority—not the other way around.
      </p>
    </section>
  );
}
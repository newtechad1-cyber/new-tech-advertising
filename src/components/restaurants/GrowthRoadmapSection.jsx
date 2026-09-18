import React from 'react';
import { Map } from 'lucide-react';

const PARTS = [
  { num: '01', title: 'Foundation', desc: "Website, menu, Google presence, accurate hours and information, ordering where appropriate, location details, reviews, and the customer's path into the restaurant." },
  { num: '02', title: 'Digital Growth Office', desc: 'A practical place where the owner, managers, employees and NTA can communicate, capture questions and ideas, organize useful knowledge, and keep learning together.' },
  { num: '03', title: 'Knowledge', desc: 'Build the Restaurant Knowledge Library from owner knowledge, employee observations, customer questions, reviews, short recordings, documents, procedures, existing systems and everyday restaurant experience.' },
  { num: '04', title: 'Audience & Growth', desc: 'Choose what actually needs growth now — dining traffic, lunch, bar business, catering, private events, repeat visits, loyalty, seasonal opportunities, holiday business, local visibility, reviews, community awareness. Marketing follows the business priority rather than promoting everything equally.' },
  { num: '05', title: 'Connect & Improve', desc: "Understand the restaurant's existing systems first. Connect useful information where it genuinely helps. Measure what happened. Capture what was learned. Feed that knowledge back into the Restaurant Knowledge Library and Growth Roadmap." },
];

const CYCLE = ['Listen', 'Capture', 'Understand', 'Decide', 'Act', 'Measure', 'Learn', 'Improve'];

export default function GrowthRoadmapSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-800/60">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/25 bg-amber-500/10 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-5">
          <Map className="w-3.5 h-3.5" /> An Example, Not a Package
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-5 leading-snug">
          What Could a Restaurant Growth Roadmap Look Like?
        </h2>
        <p className="mx-auto max-w-3xl text-slate-400 text-lg leading-relaxed">
          Every restaurant is different. NTA does not start by selling every restaurant the same collection of technology.
          We start by understanding what the restaurant already has, what the people inside it know, what customers are
          saying, where opportunities exist, and what deserves attention next.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-5 mb-10">
        {PARTS.map(({ num, title, desc }) => (
          <div key={num} className="rounded-2xl border border-blue-500/20 bg-slate-900/60 p-6">
            <span className="text-xs font-black tracking-widest text-blue-400">{num}</span>
            <h3 className="mt-3 text-lg font-bold text-white">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-7">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm font-semibold">
          {CYCLE.map((step, i) => (
            <span key={step} className="inline-flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20">{step}</span>
              {i < CYCLE.length - 1 && <span className="text-slate-600">→</span>}
            </span>
          ))}
        </div>
        <p className="mt-6 text-center text-white font-semibold text-lg">The Roadmap changes as the restaurant learns.</p>
      </div>
    </section>
  );
}
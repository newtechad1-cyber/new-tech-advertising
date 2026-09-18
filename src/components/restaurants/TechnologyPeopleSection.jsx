import React from 'react';
import { Cpu, CheckCircle2 } from 'lucide-react';

const HELPS = [
  'transcribe short recordings', 'organize employee ideas', 'summarize customer feedback',
  'retrieve business knowledge', 'identify recurring questions', 'find patterns',
  'prepare useful follow-up', 'reduce repeated work',
];

const DOES_NOT = [
  'AI does not run the restaurant.',
  'AI does not make employee-management decisions.',
  'AI does not replace hospitality.',
  "AI does not replace the owner's judgment.",
];

export default function TechnologyPeopleSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 border-t border-slate-800/60">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/25 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-5">
        <Cpu className="w-3.5 h-3.5" /> Technology Helps the People
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-snug">
        Technology Helps the People. The People Run the Restaurant.
      </h2>
      <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-3xl">Explain AI simply. AI can help:</p>

      <div className="grid gap-2.5 sm:grid-cols-2 mb-10">
        {HELPS.map((h, i) => (
          <div key={i} className="flex items-center gap-2.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span className="text-sm leading-relaxed">{h}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 mb-8">
        <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-3">But AI does not:</p>
        <ul className="space-y-2.5">
          {DOES_NOT.map((d, i) => (
            <li key={i} className="text-slate-300 leading-relaxed flex items-start gap-2">
              <span className="text-slate-600 mt-1">—</span>
              {d}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-blue-300 font-semibold text-lg leading-snug max-w-3xl">
        People provide the knowledge. AI helps the restaurant remember, organize and use it. People make the decisions.
      </p>
    </section>
  );
}
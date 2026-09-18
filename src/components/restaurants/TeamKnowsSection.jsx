import React from 'react';
import { Users, MessageCircle, ChefHat, ClipboardList, Sparkles } from 'lucide-react';

const EXAMPLES = [
  { icon: MessageCircle, text: 'A server hears the same customer question five times this week.' },
  { icon: Sparkles, text: 'A bartender notices people asking about private parties.' },
  { icon: ChefHat, text: 'Someone in the kitchen sees a process that slows things down every Friday night.' },
  { icon: ClipboardList, text: 'A manager hears employees asking the same question over and over.' },
  { icon: Users, text: 'Customers mention something they wish you offered.' },
];

export default function TeamKnowsSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <div className="max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-snug">
          Your Restaurant Is Full of People Who Know Things You Need to Know.
        </h2>
        <p className="text-slate-400 text-lg leading-relaxed mb-4">
          Running a restaurant puts the owner in the middle of everything. But you can't be everywhere.
        </p>
        <p className="text-slate-400 text-lg leading-relaxed mb-8">
          Your team is already seeing things you don't always see.
        </p>
      </div>

      <ul className="space-y-3 mb-10">
        {EXAMPLES.map(({ icon: Icon, text }, i) => (
          <li key={i} className="flex items-start gap-3 bg-slate-900/40 border border-slate-800 rounded-xl p-4">
            <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Icon className="w-4 h-4" />
            </span>
            <span className="text-slate-300 leading-relaxed">{text}</span>
          </li>
        ))}
      </ul>

      <p className="text-slate-300 text-lg leading-relaxed">Those aren't just conversations.</p>
      <p className="text-white font-semibold text-xl mt-2">That's business knowledge.</p>
      <p className="text-slate-400 text-lg leading-relaxed mt-6 max-w-2xl">
        The first step isn't buying another system. It's learning how to capture what your restaurant already knows.
      </p>
    </section>
  );
}
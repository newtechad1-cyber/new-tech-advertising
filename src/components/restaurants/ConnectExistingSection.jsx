import React from 'react';
import { Plug } from 'lucide-react';

const SYSTEMS = [
  'POS', 'reservations', 'online ordering', 'customer databases', 'loyalty systems', 'gift cards',
  'scheduling', 'payroll', 'accounting', 'email', 'texting', 'website', 'Google Business Profile',
  'social media', 'review platforms', 'vendor systems',
];

export default function ConnectExistingSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 border-t border-slate-800/60">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/25 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-5">
        <Plug className="w-3.5 h-3.5" /> Connect What You Have
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-snug">
        Connect What You Already Have Before Buying More.
      </h2>
      <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-3xl">Restaurants may already use:</p>

      <div className="flex flex-wrap gap-2.5 mb-10">
        {SYSTEMS.map((s, i) => (
          <span key={i} className="px-3.5 py-1.5 rounded-full border border-slate-700 bg-slate-900/50 text-slate-300 text-sm">
            {s}
          </span>
        ))}
      </div>

      <div className="space-y-3 max-w-3xl mb-8">
        <p className="text-slate-300 leading-relaxed">NTA should first understand what is already working.</p>
        <p className="text-slate-400 leading-relaxed">Do not automatically tell the restaurant to replace its technology.</p>
        <ul className="space-y-2 text-slate-400">
          <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span>Some systems may need improvement.</li>
          <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span>Some may need better connections.</li>
          <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span>Some may already be perfectly useful.</li>
          <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span>And sometimes something new really is needed.</li>
        </ul>
      </div>

      <p className="text-blue-300 font-semibold text-lg">
        The goal isn't more technology. The goal is a restaurant that works better together.
      </p>
    </section>
  );
}
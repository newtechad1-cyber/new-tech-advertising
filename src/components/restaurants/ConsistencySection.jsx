import React from 'react';
import { Globe, Users, ClipboardList, Megaphone, RefreshCw } from 'lucide-react';

const POINTS = [
  { icon: Globe, text: 'The website can answer questions customers actually ask.' },
  { icon: Users, text: 'Employees can work from better information.' },
  { icon: ClipboardList, text: 'Menu and service information can stay clearer.' },
  { icon: Megaphone, text: 'Marketing can reflect what is really happening inside the restaurant.' },
  { icon: RefreshCw, text: 'Customer feedback can come back into the business. Training can improve as new questions arise.' },
];

export default function ConsistencySection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 border-t border-slate-800/60">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-snug">
        Give Every Customer a More Consistent Experience.
      </h2>
      <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-3xl">
        Customers should not hear one thing from the website, another from a server, and something different when they
        call. Shared knowledge helps the restaurant become more consistent.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 mb-10">
        {POINTS.map(({ icon: Icon, text }, i) => (
          <div key={i} className="flex items-start gap-3 bg-slate-900/40 border border-slate-800 rounded-xl p-4">
            <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Icon className="w-4 h-4" />
            </span>
            <span className="text-slate-300 leading-relaxed text-sm">{text}</span>
          </div>
        ))}
      </div>

      <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mb-3">
        The goal is not robotic consistency. People still interact with customers as people. The goal is for the restaurant
        to understand itself well enough that customers receive dependable information wherever the conversation happens.
      </p>
      <p className="text-blue-300 font-semibold text-lg">
        Better communication inside the restaurant creates better communication with the customer.
      </p>
    </section>
  );
}
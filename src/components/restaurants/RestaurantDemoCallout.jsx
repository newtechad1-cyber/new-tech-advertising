import React from 'react';
import { ExternalLink, Wrench } from 'lucide-react';

export default function RestaurantDemoCallout() {
  return (
    <section className="max-w-4xl mx-auto px-6 pb-24">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-700 bg-slate-900 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-5">
          <Wrench className="w-3.5 h-3.5" /> An Example of Technology NTA Has Built
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4 leading-snug">
          A Working Restaurant Technology Demo
        </h2>
        <p className="text-slate-400 leading-relaxed mb-6 max-w-2xl">
          This is an example of technology NTA has built for restaurants — not the NTA restaurant solution, and not a
          system every restaurant should adopt. It's here to show the kind of connected work NTA can do once we understand
          what your restaurant actually needs.
        </p>
        <a
          href="https://restaurant-demo-7e61965c.viktor.space"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
        >
          Explore the demo <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}
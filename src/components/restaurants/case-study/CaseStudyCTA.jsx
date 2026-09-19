import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CaseStudyCTA() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-snug text-center">
        Could This Work in Your Restaurant?
      </h2>
      <p className="text-slate-400 text-lg leading-relaxed mb-3 max-w-2xl mx-auto text-center">
        Your Roadmap wouldn't look exactly like the one we're building with Cattleman's Dining.
      </p>
      <p className="text-white font-semibold text-lg leading-relaxed mb-8 max-w-2xl mx-auto text-center">
        That's the point.
      </p>
      <p className="text-slate-400 leading-relaxed mb-8 max-w-2xl mx-auto text-center">
        We start with your restaurant, your people, your customers, your existing systems, and what you're trying to make
        better.
      </p>
      <div className="flex justify-center">
        <Link
          to="/start"
          className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-4 rounded-xl transition-all text-base shadow-[0_0_24px_rgba(59,130,246,0.3)]"
        >
          Start a Free Growth Conversation <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
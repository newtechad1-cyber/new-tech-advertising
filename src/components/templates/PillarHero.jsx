import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function PillarHero({ badge, heading, subheading, primaryCta, primaryHref, secondaryCta, secondaryHref, children }) {
  return (
    <section className="bg-slate-950 pt-24 pb-16 px-4 border-b border-slate-800">
      <div className="max-w-4xl mx-auto text-center">
        {badge && (
          <span className="inline-block text-violet-400 text-xs font-bold uppercase tracking-widest mb-4 bg-violet-500/10 px-3 py-1 rounded-full">
            {badge}
          </span>
        )}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-5">
          {heading}
        </h1>
        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
          {subheading}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {primaryCta && (
            <Link
              to={primaryHref}
              className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2"
            >
              {primaryCta} <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          {secondaryCta && (
            <Link
              to={secondaryHref}
              className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold px-7 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {secondaryCta}
            </Link>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
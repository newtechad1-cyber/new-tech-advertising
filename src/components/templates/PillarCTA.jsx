import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function PillarCTA({
  heading = "Ready to grow your business?",
  subheading = "Start your free trial today. No credit card required.",
  primaryText = "Start Free Trial",
  primaryHref,
  secondaryText = "Book a Strategy Call",
  secondaryHref,
}) {
  return (
    <section className="bg-violet-950/40 border-t border-violet-800/30 py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">{heading}</h2>
        <p className="text-slate-400 text-lg mb-8">{subheading}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={primaryHref || createPageUrl('Start')}
            className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2"
          >
            {primaryText} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to={secondaryHref || createPageUrl('Book-Call')}
            className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold px-8 py-3.5 rounded-xl transition-all flex items-center justify-center"
          >
            {secondaryText}
          </Link>
        </div>
      </div>
    </section>
  );
}
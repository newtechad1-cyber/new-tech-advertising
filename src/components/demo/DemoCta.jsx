import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, Home } from 'lucide-react';

export default function DemoCta() {
  return (
    <section className="bg-violet-950/40 border-t border-violet-800/30 py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Start Building Your Marketing System
        </h2>
        <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Create content, videos, and marketing campaigns from one platform built for small businesses. 14-day free trial — no credit card required.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Link
            to={createPageUrl('MarketingPlanGenerator')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-lg shadow-violet-600/30 hover:scale-105"
          >
            Get Growth Strategy <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to={createPageUrl('Start')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all"
          >
            Start Free Trial
          </Link>
        </div>
        <p className="text-slate-600 text-xs">
          Questions? Call <a href="tel:6414208816" className="text-violet-400 hover:text-violet-300 transition-colors">641-420-8816</a>
        </p>
      </div>
    </section>
  );
}
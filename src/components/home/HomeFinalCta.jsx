import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, Zap } from 'lucide-react';

export default function HomeFinalCta() {
  return (
    <section className="bg-slate-900 py-20 px-4 border-t border-slate-800">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Zap className="w-3.5 h-3.5" />
          Start in 5 minutes
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
          Stop losing customers to competitors who show up online
        </h2>
        <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
          Join hundreds of small businesses using NTA to automate their marketing, build authority, and grow consistently — without the agency price tag.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Link
            to={createPageUrl('Get-Started')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-lg shadow-violet-600/30 hover:scale-105"
          >
            Start Free Trial <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to={createPageUrl('Book-Call')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all"
          >
            Book Strategy Call
          </Link>
        </div>
        <Link
          to={createPageUrl('Free-Audit')}
          className="text-slate-500 hover:text-violet-300 text-sm underline underline-offset-4 transition-colors"
        >
          Or get your free marketing audit →
        </Link>
      </div>
    </section>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, Play, Zap } from 'lucide-react';

export default function DemoHero({ onPlayVideo }) {
  return (
    <section className="relative bg-slate-950 overflow-hidden pt-20 pb-16">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/15 rounded-full blur-[120px]" />
      </div>
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Zap className="w-3.5 h-3.5" />
          2-Minute Platform Overview
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5">
          See the Small Business
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
            Marketing System in Action
          </span>
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          Watch how New Tech Advertising helps small businesses create content, videos, campaigns, and visibility — from one platform.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onPlayVideo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-lg shadow-violet-600/30 hover:scale-105"
          >
            <Play className="w-5 h-5 fill-white" /> Watch the Demo
          </button>
          <Link
            to={createPageUrl('MarketingPlanGenerator')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all"
          >
            Get Growth Strategy <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
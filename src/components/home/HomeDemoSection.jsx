import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Play, ArrowRight, Monitor } from 'lucide-react';

export default function HomeDemoSection() {
  return (
    <section className="bg-slate-950 py-20 px-4 border-t border-slate-800">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-cyan-400 text-sm font-semibold uppercase tracking-widest">Platform Demo</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">
          See the platform in action
        </h2>
        <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
          Watch how NTA helps a local business go from zero presence to consistent content, video, and streaming TV campaigns in one connected system.
        </p>

        {/* Demo placeholder — swap with real embed when video is ready */}
        <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden aspect-video max-w-3xl mx-auto mb-8 group cursor-pointer hover:border-violet-600/50 transition-colors">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 bg-violet-600/90 rounded-full flex items-center justify-center shadow-lg shadow-violet-600/40 group-hover:bg-violet-500 transition-colors">
              <Play className="w-7 h-7 text-white fill-white ml-1" />
            </div>
            <p className="text-slate-400 text-sm">Platform walkthrough — 3 minutes</p>
          </div>
          {/* Placeholder grid pattern */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="absolute inset-0 flex items-start justify-start p-5">
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5">
              <Monitor className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-slate-300 text-xs font-medium">NTA Marketing System — Platform Overview</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={createPageUrl('AiMarketingPlatform')}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm shadow-lg shadow-violet-600/20"
          >
            <Play className="w-4 h-4" /> Watch Demo
          </Link>
          <Link
            to={createPageUrl('Get-Started')}
            className="inline-flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-300 font-semibold px-6 py-3 rounded-xl transition-all text-sm"
          >
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
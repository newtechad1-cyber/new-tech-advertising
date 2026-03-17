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

        <div className="flex justify-center mb-8">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-700 w-full max-w-sm" style={{aspectRatio: '9/16'}}>
            <iframe
              src="https://www.youtube.com/embed/u4RNWisgfHA"
              title="NTA Platform Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
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
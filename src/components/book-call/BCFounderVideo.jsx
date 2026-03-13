import React from 'react';
import { Play } from 'lucide-react';

export default function BCFounderVideo() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">From Our Founder</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
            What you'll get from an NTA strategy call
          </h2>
        </div>

        <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl overflow-hidden aspect-video flex items-center justify-center group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20" />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-all">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
            <p className="text-white text-center">
              <span className="font-semibold">NTA Founder Intro</span>
              <br />
              <span className="text-sm text-slate-400">2:45</span>
            </p>
          </div>
          <p className="absolute bottom-6 left-6 right-6 text-xs text-slate-400">
            Video placeholder — Add your founder intro video here
          </p>
        </div>
      </div>
    </section>
  );
}
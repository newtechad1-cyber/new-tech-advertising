import React from 'react';
import { Play, ArrowRight, CheckCircle } from 'lucide-react';

const TRIAL_URL = 'https://app.newtechadvertising.com/start-trial';

export default function HomeHero() {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              AI Marketing Platform for Small Business
            </div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-6">
              Create Videos, Images, and Social Media Posts in{' '}
              <span className="text-blue-400">Minutes</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
              Marketing tools built for small and mid-sized businesses. No agency. No freelancer. No technical skills required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a
                href={TRIAL_URL}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </a>
              <button className="inline-flex items-center justify-center gap-2 border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold px-6 py-4 rounded-xl text-base transition-all duration-200">
                <Play className="w-4 h-4 fill-current" /> Watch Demo
              </button>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {['No credit card required', 'Cancel anytime', '7-day free trial'].map(item => (
                <div key={item} className="flex items-center gap-1.5 text-slate-400 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Video demo placeholder */}
          <div className="relative">
            <div className="relative bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl aspect-video flex items-center justify-center group cursor-pointer">
              {/* Fake screenshot BG */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900">
                <div className="absolute top-4 left-4 right-4 h-7 bg-slate-600/50 rounded-md flex items-center gap-2 px-3">
                  <div className="flex gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400/60" /><span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" /><span className="w-2.5 h-2.5 rounded-full bg-green-400/60" /></div>
                  <span className="text-slate-400 text-xs ml-2">NTA Platform — Content Studio</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                  <div className="h-20 flex-1 bg-blue-600/20 border border-blue-500/20 rounded-lg" />
                  <div className="h-20 flex-1 bg-purple-600/20 border border-purple-500/20 rounded-lg" />
                  <div className="h-20 flex-1 bg-emerald-600/20 border border-emerald-500/20 rounded-lg" />
                </div>
              </div>
              {/* Play button */}
              <div className="relative z-10 w-20 h-20 rounded-full bg-white/10 border-2 border-white/40 flex items-center justify-center group-hover:bg-white/20 group-hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs px-4 py-1.5 rounded-full font-medium">
                See how it works — 90 sec
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl px-4 py-3 shadow-xl border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Post Scheduled</p>
                <p className="text-slate-500 text-xs">Facebook · Instagram · LinkedIn</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="relative border-t border-slate-700/50 bg-slate-900/50 py-4 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-6 text-slate-400 text-sm font-medium">
          {['Facebook', 'Instagram', 'LinkedIn', 'Google Business', 'Auto-Scheduling', 'AI Captions', 'Video Creation'].map(p => (
            <span key={p} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block shrink-0" />{p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
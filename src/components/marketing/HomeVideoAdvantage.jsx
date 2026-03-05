import React from 'react';
import { Play, TrendingUp, Eye, MessageCircle, Star } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

const TRIAL_URL = 'https://app.newtechadvertising.com/start-trial';

const STATS = [
  { icon: TrendingUp, value: '3x', label: 'More engagement than image posts', color: 'text-blue-600' },
  { icon: Eye, value: '80%', label: 'Of people prefer video over reading', color: 'text-purple-600' },
  { icon: MessageCircle, value: '2x', label: 'More comments on video content', color: 'text-emerald-600' },
  { icon: Star, value: '64%', label: 'More likely to buy after watching a video', color: 'text-orange-500' },
];

export default function HomeVideoAdvantage() {
  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <div>
            <p className="text-blue-400 font-semibold text-sm uppercase tracking-wide mb-3">Why Video Wins</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-6 leading-tight">
              Video isn't a trend.<br /> It's how people decide<br /> who to trust.
            </h2>
            <p className="text-slate-300 text-lg mb-6 leading-relaxed">
              Customers scroll past text. They stop for video. Whether it's a 15-second streaming TV ad or a quick product demo on Instagram — video builds trust faster than anything else.
            </p>
            <p className="text-slate-300 mb-8 leading-relaxed">
              NTA gives you everything you need to create professional videos without a production team. Write a script, pick a format, and your video is ready to post.
            </p>
            <a
              href={TRIAL_URL}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
            >
              Start Creating Videos <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right: video placeholder + stats */}
          <div className="space-y-6">
            <div className="relative bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden aspect-video flex items-center justify-center group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30" />
              <div className="relative z-10 w-16 h-16 rounded-full bg-white/10 border-2 border-white/40 flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
                <Play className="w-7 h-7 text-white fill-white ml-1" />
              </div>
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                Platform Demo — Video Creation Tool
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {STATS.map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                    <Icon className={`w-5 h-5 ${s.color} mb-2`} />
                    <p className={`text-2xl font-extrabold ${s.color} mb-1`}>{s.value}</p>
                    <p className="text-slate-400 text-xs leading-snug">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
import React from 'react';

const TRIAL_URL = 'https://app.newtechadvertising.com/start-trial';

export default function MarketingHero({ headline, subheadline, badge, videoBg = true }) {
  return (
    <section className="relative bg-slate-900 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />
      <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 30% 50%, #3b82f6 0%, transparent 60%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%)'}} />

      <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div>
            {badge && (
              <div className="inline-block bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wider">
                {badge}
              </div>
            )}
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
              {headline}
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              {subheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={TRIAL_URL} className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-lg text-base transition-colors shadow-lg shadow-blue-500/30">
                Start Your 7-Day Free Trial
              </a>
              <a href="#how-it-works" className="inline-flex items-center justify-center border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-lg text-base transition-colors">
                See How It Works ↓
              </a>
            </div>
            <p className="text-slate-500 text-sm mt-4">No credit card required. Cancel anytime.</p>
          </div>

          {/* Right: Video placeholder */}
          <div className="relative">
            <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl aspect-video flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-400 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm font-medium">Platform Demo Video</p>
              <p className="text-slate-600 text-xs">See how fast you can create content</p>
            </div>
            {/* Floating badges */}
            <div className="absolute -top-3 -right-3 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">AI-Powered</div>
            <div className="absolute -bottom-3 -left-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">7-Day Free Trial</div>
          </div>
        </div>
      </div>
    </section>
  );
}
import React from 'react';
import { ArrowDown, CheckCircle, Zap } from 'lucide-react';

const BULLETS = [
  'Weekly marketing plan tailored to your business',
  'Content and video ideas ready to use',
  'Campaign recommendations based on your industry',
  'Marketing tools built around your goals',
];

const STEPS = [
  { num: '1', label: 'Tell us about your business' },
  { num: '2', label: 'We generate your starting plan' },
  { num: '3', label: 'Begin creating content & campaigns' },
];

export default function StartHero({ onScrollToForm }) {
  return (
    <section className="relative bg-slate-950 overflow-hidden pt-16 pb-12">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-600/15 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-2 bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-medium px-4 py-1.5 rounded-full">
            <Zap className="w-3.5 h-3.5" /> Free 14-day trial · No credit card required
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
              Start Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                Free Trial
              </span>
            </h1>
            <p className="text-lg text-slate-300 mb-7 leading-relaxed">
              Tell us about your business and we'll help you start building your marketing system — content, videos, campaigns, and direction all in one place.
            </p>

            <ul className="space-y-3 mb-8">
              {BULLETS.map(b => (
                <li key={b} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={onScrollToForm}
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-violet-600/30"
            >
              Get Started <ArrowDown className="w-4 h-4" />
            </button>
          </div>

          {/* Right: step visual */}
          <div className="hidden lg:block">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
              <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-6">How It Works</p>
              <div className="space-y-5">
                {STEPS.map((step, i) => (
                  <div key={step.num} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-violet-600/20 border border-violet-500/40 flex items-center justify-center flex-shrink-0">
                      <span className="text-violet-300 font-bold text-sm">{step.num}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">{step.label}</p>
                      {i < STEPS.length - 1 && (
                        <div className="mt-3 ml-0.5 w-px h-5 bg-slate-700" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-slate-800">
                <p className="text-slate-500 text-sm">Built for small businesses. Not agencies.</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {['No contracts', 'Cancel anytime', 'Setup in 48 hrs'].map(t => (
                    <span key={t} className="text-xs bg-slate-800 border border-slate-700 text-slate-400 px-3 py-1 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
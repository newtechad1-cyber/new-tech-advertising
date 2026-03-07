import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    color: 'text-violet-400',
    border: 'border-violet-500/30',
    title: 'Sign up & answer a few questions',
    desc: 'Tell us about your business, your audience, and your goals. Takes about 5 minutes.',
  },
  {
    number: '02',
    color: 'text-cyan-400',
    border: 'border-cyan-500/30',
    title: 'AI builds your Authority Plan',
    desc: 'Your brand profile, content pillars, 90-day calendar, and campaign themes are generated automatically.',
  },
  {
    number: '03',
    color: 'text-fuchsia-400',
    border: 'border-fuchsia-500/30',
    title: 'Review and approve content',
    desc: 'AI generates posts, captions, and video scripts. You approve, edit, or let us handle it entirely.',
  },
  {
    number: '04',
    color: 'text-green-400',
    border: 'border-green-500/30',
    title: 'Content publishes automatically',
    desc: 'Approved content goes live at the best times across all your connected social channels.',
  },
  {
    number: '05',
    color: 'text-amber-400',
    border: 'border-amber-500/30',
    title: 'Get monthly performance reports',
    desc: 'AI-generated insights show what worked, what to improve, and recommendations for next month.',
  },
];

export default function HomeHowItWorks() {
  return (
    <section className="bg-slate-900 py-20 px-4 border-t border-slate-800">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-fuchsia-400 text-sm font-semibold uppercase tracking-widest">How It Works</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">
            From signup to published — in 48 hours
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            No agency meetings. No strategy decks. Just a fast, automated path from setup to results.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-8 bottom-8 w-px bg-slate-800 hidden sm:block" />

          <div className="space-y-5">
            {STEPS.map((step, i) => (
              <div key={step.number} className={`relative flex gap-6 bg-slate-950 border ${step.border} rounded-2xl p-6 hover:bg-slate-900 transition-colors`}>
                <div className={`w-12 h-12 rounded-xl bg-slate-900 border ${step.border} flex items-center justify-center flex-shrink-0 font-black text-lg ${step.color}`}>
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-base mb-1.5">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            to={createPageUrl('Get-Started')}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-violet-600/30 text-lg"
          >
            Start Your Free Trial <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-slate-500 text-sm mt-3">14-day free trial · No credit card needed</p>
        </div>
      </div>
    </section>
  );
}
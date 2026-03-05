import React from 'react';
import { UserCheck, Wand2, CalendarCheck, Send, ArrowRight } from 'lucide-react';

const TRIAL_URL = 'https://app.newtechadvertising.com/start-trial';

const STEPS = [
  {
    step: '01',
    icon: UserCheck,
    color: 'bg-blue-600',
    title: 'Tell us about your business',
    description: 'Answer a few quick questions about your business — what you do, who you serve, and what your goals are. This takes about 3 minutes.',
  },
  {
    step: '02',
    icon: Wand2,
    color: 'bg-purple-600',
    title: 'AI builds your content plan',
    description: 'The platform creates a full content calendar, writes captions, generates images, and prepares videos — all matched to your brand and goals.',
  },
  {
    step: '03',
    icon: CalendarCheck,
    color: 'bg-emerald-600',
    title: 'Review and approve',
    description: 'Browse your ready-to-post content. Edit anything you want, or approve it as-is. You stay in control without doing all the work.',
  },
  {
    step: '04',
    icon: Send,
    color: 'bg-orange-500',
    title: 'Post and grow',
    description: 'Connect your social accounts and let the platform post automatically. You focus on running your business — we handle the marketing.',
  },
];

export default function HomeHowItWorks() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-3">How It Works</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
            From signup to first post in under 10 minutes
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            No setup headaches. No technical knowledge required. Just tell us about your business and you're ready to go.
          </p>
        </div>

        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-orange-200 mx-24" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative flex flex-col items-center text-center">
                  {/* Step number badge */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center shadow-lg z-10 relative`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center">
                      <span className="text-xs font-bold text-slate-600">{i + 1}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-14">
          <a
            href={TRIAL_URL}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-base transition-all shadow-lg shadow-blue-600/30"
          >
            Start Free Trial <ArrowRight className="w-5 h-5" />
          </a>
          <p className="text-slate-400 text-sm mt-3">No credit card required. 7-day free trial.</p>
        </div>
      </div>
    </section>
  );
}
import React from 'react';
import { ArrowRight, PlayCircle, Building2, Sparkles, Rocket } from 'lucide-react';

const TRIAL_URL = 'https://app.newtechadvertising.com/start-trial';

const steps = [
  { number: '01', icon: PlayCircle, title: 'Start your free trial', desc: 'Sign up in minutes. No credit card required. 7 days free.' },
  { number: '02', icon: Building2, title: 'Add your business information', desc: 'Tell the platform about your business, industry, and goals.' },
  { number: '03', icon: Sparkles, title: 'Generate marketing content with AI', desc: 'Let the AI create captions, scripts, and campaign ideas instantly.' },
  { number: '04', icon: Rocket, title: 'Schedule posts or upgrade to DFY services', desc: 'Publish yourself or let our team manage everything for you.' },
];

export default function PlatformHowItWorks() {
  return (
    <section className="bg-slate-50 py-20 lg:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            How It Works
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900">
            How It Works
          </h2>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-12 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ number, icon: Icon, title, desc }) => (
              <div key={number} className="relative flex flex-col items-center text-center">
                <div className="relative w-16 h-16 rounded-2xl bg-white border-2 border-blue-200 flex items-center justify-center mb-5 shadow-md z-10">
                  <Icon className="w-7 h-7 text-blue-600" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow">
                    {number.replace('0', '')}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href={TRIAL_URL}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 shadow-lg shadow-blue-600/20 hover:-translate-y-0.5"
          >
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
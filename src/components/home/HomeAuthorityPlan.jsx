import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BrainCircuit, ArrowRight, Target, Calendar, Layers, TrendingUp } from 'lucide-react';

const STEPS = [
  { icon: Target, label: 'Brand Intake', desc: 'AI analyzes your business, audience, competitors, and goals to build your brand DNA.' },
  { icon: Layers, label: 'Content Pillars', desc: 'Creates 4–6 content themes matched to your industry and customer journey.' },
  { icon: Calendar, label: '90-Day Calendar', desc: 'Fills a full quarter of posts, campaigns, and video scripts across all your channels.' },
  { icon: TrendingUp, label: 'Continuous Optimization', desc: 'Monthly performance reports feed back into the next cycle for compounding results.' },
];

export default function HomeAuthorityPlan() {
  return (
    <section className="bg-slate-950 py-20 px-4 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-violet-400 text-sm font-semibold uppercase tracking-widest">The Authority Plan Engine</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">
              A 90-day marketing strategy — generated in minutes
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              When you onboard, our AI builds a complete Authority Plan: content pillars, campaign themes, a 90-day posting calendar, and video scripts — all tailored to your brand, your audience, and your goals.
            </p>
            <p className="text-slate-400 text-base mb-8">
              No strategy consultant. No agency kickoff. Just answer a few questions and your entire marketing engine fires up automatically.
            </p>
            <Link
              to={createPageUrl('Get-Started')}
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-violet-600/30"
            >
              Generate My Authority Plan <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-violet-500/30 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-violet-500 text-xs font-bold">STEP {i + 1}</span>
                      <span className="text-white font-bold text-sm">{step.label}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
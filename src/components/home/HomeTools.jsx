import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Tv, BrainCircuit, ArrowRight, Zap } from 'lucide-react';

const TOOLS = [
  {
    icon: BrainCircuit,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    badge: 'Free Tool',
    title: 'Marketing Plan Generator',
    desc: 'Get a custom 90-day marketing plan built for your business, industry, and goals — in under 60 seconds. No email required.',
    cta: 'Generate My Plan',
    page: 'MarketingPlanGenerator',
    ctaColor: 'bg-violet-600 hover:bg-violet-500 shadow-violet-600/20',
  },
  {
    icon: Tv,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    badge: 'Free Tool',
    title: 'TV Commercial Script Generator',
    desc: 'Generate a professional 15 or 30-second streaming TV commercial script for your business in under 60 seconds.',
    cta: 'Get My Free Script',
    page: 'TvCommercialScriptGenerator',
    ctaColor: 'bg-sky-600 hover:bg-sky-500 shadow-sky-600/20',
  },
];

export default function HomeTools() {
  return (
    <section className="bg-slate-900 py-20 px-4 border-t border-slate-800">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-green-400 text-sm font-semibold uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5" /> Free Marketing Tools
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">
            Free marketing tools for small businesses
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Try the system before you sign up. These tools are free, instant, and actually useful.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {TOOLS.map(tool => {
            const Icon = tool.icon;
            return (
              <div key={tool.title} className="bg-slate-950 border border-slate-800 rounded-2xl p-7 flex flex-col hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-11 h-11 rounded-xl ${tool.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${tool.color}`} />
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest border border-slate-700 px-2 py-0.5 rounded-md">{tool.badge}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{tool.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-6">{tool.desc}</p>
                <Link
                  to={createPageUrl(tool.page)}
                  className={`inline-flex items-center justify-center gap-2 ${tool.ctaColor} text-white font-bold px-5 py-3 rounded-xl transition-all text-sm shadow-lg w-full`}
                >
                  {tool.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
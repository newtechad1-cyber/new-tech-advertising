import React from 'react';
import { TrendingUp, Globe, Video, MessageSquare, BarChart3 } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';

const MODULES = [
  {
    icon: TrendingUp,
    title: 'Marketing Command Center',
    features: ['Weekly action plan', 'Campaign focus system', 'Growth momentum tracker'],
  },
  {
    icon: Globe,
    title: 'AI Website Growth Tools',
    features: ['Service page builder', 'Authority article generator', 'Local SEO page creator'],
  },
  {
    icon: Video,
    title: 'AI Video Creation Studio',
    features: ['Video topic ideas', 'Script generator', 'Captions & hooks'],
  },
  {
    icon: MessageSquare,
    title: 'Social Media Planner',
    features: ['Posting calendar', 'Caption creator', 'Multi-platform variations'],
  },
  {
    icon: BarChart3,
    title: 'Lead & ROI Tracker',
    features: ['Track leads', 'Track conversions', 'See marketing performance trends'],
  },
];

export default function DIYIncluded() {
  return (
    <section className="py-20 px-6 bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">🧠 What's Included</h2>
          <p className="text-xl text-slate-400 mb-2">Your DIY Marketing Command Center</p>
          <p className="text-slate-400 text-base">Inside your NTA dashboard you get access to:</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES.map((module, idx) => {
            const Icon = module.icon;
            return (
              <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <h3 className="font-bold text-white">{module.title}</h3>
                </div>
                <ul className="space-y-2">
                  {module.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-slate-300 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
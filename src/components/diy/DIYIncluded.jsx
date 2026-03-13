import React from 'react';
import { TrendingUp, Globe, Video, MessageSquare, BarChart3 } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';

const MODULES = [
  {
    icon: TrendingUp,
    title: 'Marketing Command Center',
    description: 'Your weekly marketing command center. See priorities, track campaign performance, manage content calendar.',
    features: ['Weekly checklist', 'Growth score', 'Campaign focus', 'Momentum tracking'],
  },
  {
    icon: Globe,
    title: 'AI Website Tools',
    description: 'Build high-converting pages without design or coding skills. AI handles optimization.',
    features: ['Service page generator', 'Authority article writer', 'City page builder', 'Landing page creator'],
  },
  {
    icon: Video,
    title: 'AI Video Studio',
    description: 'Create professional videos without expensive equipment. AI generates scripts and content.',
    features: ['Video script generator', 'Talking head creator', 'Product demo builder', 'Hook generator'],
  },
  {
    icon: MessageSquare,
    title: 'Social Media Planner',
    description: 'Plan, create, and schedule weeks of social content. Works across all platforms.',
    features: ['Post calendar', 'Caption generator', 'Platform variants', 'Posting queue/export'],
  },
  {
    icon: BarChart3,
    title: 'Lead & ROI Tracker',
    description: 'Know exactly which marketing efforts drive leads and revenue. Every dollar tracked.',
    features: ['Lead capture', 'Conversion tracking', 'ROI dashboard', 'Revenue attribution'],
  },
];

export default function DIYIncluded() {
  return (
    <section className="py-20 px-6 bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">What's Included in DIY Plan</h2>
          <p className="text-xl text-slate-400">Complete AI marketing toolkit — everything you need to compete with bigger businesses</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {MODULES.map((module, idx) => {
            const Icon = module.icon;
            return (
              <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
                <div className="flex gap-4 items-start mb-4">
                  <div className="w-12 h-12 bg-violet-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{module.title}</h3>
                  </div>
                </div>
                <p className="text-slate-300 text-sm mb-4">{module.description}</p>
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

        <div className="bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-600/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Plus Essential Bonuses</h3>
          <div className="grid md:grid-cols-4 gap-6 mt-6">
            {[
              'Email support',
              'Knowledge base access',
              'Monthly AI updates',
              'Cancel anytime',
            ].map((bonus, idx) => (
              <div key={idx} className="text-center">
                <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-slate-300 text-sm">{bonus}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
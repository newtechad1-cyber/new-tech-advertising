import React from 'react';
import { Search, Eye, FileText, RefreshCw } from 'lucide-react';

const cards = [
  {
    icon: Search,
    title: 'AI Gap Audit',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    description:
      'We analyze your website, local visibility, and online presence to find exactly where customers are slipping through the cracks — and what to fix first.',
  },
  {
    icon: Eye,
    title: 'Visibility Engine',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    description:
      'Get found by more local customers through SEO pages, Google Business Profile, local search optimization, and targeted advertising that puts you in front of people ready to buy.',
  },
  {
    icon: FileText,
    title: 'Content Engine',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    description:
      'We create consistent social media content, videos, and campaigns that build trust, show your work, and keep your business top-of-mind in your community.',
  },
  {
    icon: RefreshCw,
    title: 'Follow-Up System',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    description:
      'Most businesses lose repeat customers simply because they never follow up. We build systems that stay in touch, bring customers back, and turn one-time jobs into long-term relationships.',
  },
];

export default function NTAGrowthSystem() {
  return (
    <section className="bg-slate-50 py-20 px-6 border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-12">
          <p className="text-blue-600 text-sm font-bold uppercase tracking-widest mb-2">The System</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
            NTA AI Growth System
          </h2>
          <p className="text-slate-500 leading-relaxed">
            Four components working together to generate more leads, build local trust, and grow your business consistently.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map(card => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4">
                <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div>
                  <h3 className="text-slate-900 font-black text-base mb-2">{card.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{card.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
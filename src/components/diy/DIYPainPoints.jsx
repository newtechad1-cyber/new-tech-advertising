import React from 'react';
import { TrendingDown, Clock, MessageSquare, Globe, Video, Search } from 'lucide-react';

const PAIN_POINTS = [
  {
    icon: MessageSquare,
    title: 'Marketing feels confusing and overwhelming',
    description: '',
  },
  {
    icon: MessageSquare,
    title: 'Social media posting is inconsistent',
    description: '',
  },
  {
    icon: Globe,
    title: 'Websites don\'t generate real leads',
    description: '',
  },
  {
    icon: Search,
    title: 'SEO results are slow or unclear',
    description: '',
  },
  {
    icon: Video,
    title: 'Video marketing feels complicated',
    description: '',
  },
  {
    icon: TrendingDown,
    title: 'Hiring an agency is expensive',
    description: '',
  },
];

export default function DIYPainPoints() {
  return (
    <section className="py-20 px-6 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Most Small Businesses Struggle to Grow
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PAIN_POINTS.map((point, idx) => {
            const Icon = point.icon;
            return (
              <div key={idx} className="flex items-start gap-4 p-6 bg-slate-800/50 rounded-lg border border-slate-700">
                <Icon className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <h3 className="text-base font-semibold text-white">{point.title}</h3>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-white font-semibold mb-2">
            👉 Doing nothing means falling behind competitors.
          </p>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            The NTA DIY Growth System gives you a clear plan, powerful AI tools, and weekly direction so your marketing finally starts working.
          </p>
        </div>
      </div>
    </section>
  );
}
import React from 'react';
import { TrendingDown, Clock, MessageSquare, Globe, Video, Search } from 'lucide-react';

const PAIN_POINTS = [
  {
    icon: TrendingDown,
    title: 'Inconsistent Leads',
    description: 'Marketing efforts feel random. No steady flow of qualified leads from your efforts.',
  },
  {
    icon: Clock,
    title: 'No Time for Marketing',
    description: 'Too busy running the business to create content or manage social media consistently.',
  },
  {
    icon: MessageSquare,
    title: 'Weak Social Media',
    description: 'Social profiles look abandoned. Struggling to maintain consistent posting.',
  },
  {
    icon: Globe,
    title: 'Outdated Website',
    description: 'Website doesn\'t convert visitors or rank in search results.',
  },
  {
    icon: Video,
    title: 'No Video Strategy',
    description: 'Video content is too expensive and time-consuming to produce regularly.',
  },
  {
    icon: Search,
    title: 'Poor SEO Visibility',
    description: 'Not found by people searching for your services. Getting outranked by competitors.',
  },
];

export default function DIYPainPoints() {
  return (
    <section className="py-20 px-6 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            If this sounds familiar...
          </h2>
          <p className="text-xl text-slate-400">
            You're not alone. Most small business owners struggle with marketing because it requires skills, tools, and time they don't have.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PAIN_POINTS.map((point, idx) => {
            const Icon = point.icon;
            return (
              <div key={idx} className="p-8 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-red-500/50 transition-colors">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{point.title}</h3>
                <p className="text-slate-400 text-sm">{point.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-lg p-8 text-center">
          <p className="text-lg text-slate-300 mb-4">
            The result? You're leaving money on the table while competitors grab your potential customers.
          </p>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            But there's a better way. What if you had an AI marketing system that handled content, social media, video, and lead tracking — all for $99/month?
          </p>
        </div>
      </div>
    </section>
  );
}
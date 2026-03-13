import React from 'react';
import { Search, Zap, BarChart3, Share2, TrendingUp } from 'lucide-react';

const OUTCOMES = [
  {
    icon: Search,
    title: '✅ Get Found Online',
    description: 'Build SEO-optimized pages, authority articles, and local content that helps customers discover your business.',
  },
  {
    icon: Zap,
    title: '✅ Create Professional Marketing Content Faster',
    description: 'Generate website content, videos, social posts, and campaigns in minutes instead of hours.',
  },
  {
    icon: Share2,
    title: '✅ Post Consistently and Stay Visible',
    description: 'Follow a structured marketing calendar designed for real small-business growth.',
  },
  {
    icon: BarChart3,
    title: '✅ Track Real Growth',
    description: 'See your marketing activity turn into leads, sales conversations, and revenue momentum.',
  },
  {
    icon: TrendingUp,
    title: '✅ Build Long-Term Authority',
    description: 'Position your business as the trusted local expert in your market.',
  },
];

export default function DIYOutcomeStack() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">What This System Helps You Achieve</h2>
        </div>

        <div className="space-y-6">
          {OUTCOMES.map((outcome, idx) => {
            const Icon = outcome.icon;
            return (
              <div
                key={idx}
                className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg p-8 hover:border-violet-600/50 transition-all"
              >
                <div className="flex gap-4 items-start">
                  <Icon className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{outcome.title}</h3>
                    <p className="text-slate-300">{outcome.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
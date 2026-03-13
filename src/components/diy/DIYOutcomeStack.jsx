import React from 'react';
import { Search, Zap, BarChart3, Share2, TrendingUp } from 'lucide-react';

const OUTCOMES = [
  {
    icon: Search,
    title: 'Get Found',
    description: 'AI generates SEO-optimized content so people find you when searching for your services.',
    tools: ['Authority Article Writer', 'City Page Generator', 'Keyword Research'],
  },
  {
    icon: Zap,
    title: 'Create Content Faster',
    description: 'Generate blog posts, social content, and video scripts in minutes instead of hours.',
    tools: ['AI Content Engine', 'Video Script Builder', 'Caption Writer'],
  },
  {
    icon: Share2,
    title: 'Post Consistently',
    description: 'Schedule weeks of social media content in one session. Never miss a posting day.',
    tools: ['Post Calendar', 'Caption Generator', 'Platform Variants'],
  },
  {
    icon: BarChart3,
    title: 'Track Growth',
    description: 'See exactly which marketing efforts drive leads and revenue. Data-driven decisions.',
    tools: ['Lead Tracker', 'ROI Dashboard', 'Conversion Reports'],
  },
  {
    icon: TrendingUp,
    title: 'Turn Marketing Into Revenue',
    description: 'Convert leads to customers with automated follow-up and lead nurturing.',
    tools: ['Chat Assistant', 'Landing Pages', 'Lead Scoring'],
  },
];

export default function DIYOutcomeStack() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">The Outcomes You Get</h2>
          <p className="text-xl text-slate-400">Everything organized around the results that matter to your business</p>
        </div>

        <div className="space-y-8">
          {OUTCOMES.map((outcome, idx) => {
            const Icon = outcome.icon;
            return (
              <div
                key={idx}
                className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg p-8 hover:border-violet-600/50 transition-all"
              >
                <div className="flex gap-6 items-start">
                  <div className="w-16 h-16 bg-violet-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-8 h-8 text-violet-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{outcome.title}</h3>
                    <p className="text-slate-300 mb-4">{outcome.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {outcome.tools.map((tool, toolIdx) => (
                        <span
                          key={toolIdx}
                          className="px-3 py-1 bg-violet-600/20 text-violet-300 text-sm rounded-full border border-violet-600/30"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
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
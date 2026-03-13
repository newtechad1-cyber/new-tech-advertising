import React from 'react';
import { Brain, MessageSquare, Video, BarChart3, Share2, Zap } from 'lucide-react';

const VALUES = [
  {
    icon: Brain,
    title: 'AI Content Engine',
    description: 'Generate 4 blog posts + 20 social posts per month'
  },
  {
    icon: Video,
    title: 'AI Video Studio',
    description: 'Create product videos, testimonials, and promotional content'
  },
  {
    icon: Share2,
    title: 'Social Media Planner',
    description: 'Schedule posts, manage profiles, track engagement'
  },
  {
    icon: BarChart3,
    title: 'Lead & ROI Tracking',
    description: 'Monitor leads, conversions, and marketing ROI in real-time'
  },
  {
    icon: MessageSquare,
    title: 'AI Chat Assistant',
    description: 'Answer customer questions and qualify leads 24/7'
  },
  {
    icon: Zap,
    title: 'Website Tools',
    description: 'AI landing pages, pop-ups, and conversion optimization'
  },
];

export default function DIYValueStack() {
  return (
    <section className="py-20 px-6 bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Everything You Get</h2>
          <p className="text-xl text-slate-400">Complete AI marketing toolkit to grow your business</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {VALUES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-violet-600/50 transition-all"
              >
                <div className="w-12 h-12 bg-violet-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
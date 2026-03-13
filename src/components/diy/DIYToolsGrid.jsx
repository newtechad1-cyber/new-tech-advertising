import React from 'react';
import { Globe, Video, MessageSquare, BarChart3, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TOOLS = [
  {
    id: 'website',
    title: 'AI Website Growth Tools',
    description: 'Build SEO-optimized pages, authority articles, and local content',
    icon: Globe,
    features: ['Service page builder', 'Authority articles', 'Local SEO pages'],
    color: 'from-blue-600/20 to-cyan-600/20',
    borderColor: 'border-blue-600/30',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    id: 'video',
    title: 'AI Video Creation Studio',
    description: 'Create professional videos without equipment. Scripts and captions included.',
    icon: Video,
    features: ['Video scripts', 'Talking head videos', 'Captions & hooks'],
    color: 'from-red-600/20 to-pink-600/20',
    borderColor: 'border-red-600/30',
    buttonColor: 'bg-red-600 hover:bg-red-700',
  },
  {
    id: 'social',
    title: 'Social Media Planner',
    description: 'Plan, create, and schedule weeks of content across all platforms',
    icon: MessageSquare,
    features: ['Post calendar', 'Caption creator', 'Multi-platform posts'],
    color: 'from-purple-600/20 to-pink-600/20',
    borderColor: 'border-purple-600/30',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
  },
  {
    id: 'leads',
    title: 'Lead & ROI Tracker',
    description: 'Track every lead and see exactly which marketing efforts drive revenue',
    icon: BarChart3,
    features: ['Lead capture', 'Conversion tracking', 'ROI dashboard'],
    color: 'from-green-600/20 to-emerald-600/20',
    borderColor: 'border-green-600/30',
    buttonColor: 'bg-green-600 hover:bg-green-700',
  },
];

export default function DIYToolsGrid({ onToolClick }) {
  return (
    <section className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">🛠️ Your AI Marketing Tools</h2>
        <p className="text-slate-400">Everything you need to execute your growth plan</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              className={`bg-gradient-to-br ${tool.color} border ${tool.borderColor} rounded-xl p-6 transition-all hover:shadow-lg hover:shadow-violet-600/10`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-slate-800/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{tool.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">{tool.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs text-slate-400 font-semibold mb-2">Includes:</p>
                <ul className="space-y-2">
                  {tool.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-300 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={() => onToolClick(tool.id)}
                className={`w-full ${tool.buttonColor} text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 text-sm`}
              >
                Open Tool
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
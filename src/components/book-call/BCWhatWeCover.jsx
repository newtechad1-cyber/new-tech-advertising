import React from 'react';
import { CheckCircle2, BarChart3, Video, Share2, Globe, Zap } from 'lucide-react';

export default function BCWhatWeCover() {
  const topics = [
    { icon: BarChart3, label: 'Visibility audit', desc: 'Where you rank, who your competitors are, what you\'re missing' },
    { icon: Video, label: 'Video strategy', desc: 'How streaming TV and video content drives leads in your market' },
    { icon: Globe, label: 'Authority website', desc: 'Why your site is your most important marketing asset' },
    { icon: Share2, label: 'Social automation', desc: 'Publishing content consistently without the manual work' },
    { icon: Zap, label: 'AI implementation', desc: 'Exactly how AI saves you time and money' },
    { icon: BarChart3, label: 'Growth plan', desc: 'Your customized 90-day strategy to dominate your market' },
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">What We'll Discuss</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
            Your personalized strategy call covers
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {topics.map((topic, i) => {
            const Icon = topic.icon;
            return (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 pt-1">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{topic.label}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{topic.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
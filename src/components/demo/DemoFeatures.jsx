import React from 'react';
import { BrainCircuit, Video, Share2, Tv, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const FEATURES = [
  {
    icon: BrainCircuit,
    title: 'AI Content Engine',
    description: 'Generate blog posts, marketing ideas, and social content based on your specific business, industry, and location.',
    link: createPageUrl('AiSocialMedia'),
    linkLabel: 'See AI Content →',
    color: 'violet',
  },
  {
    icon: Video,
    title: 'AI Video Studio',
    description: 'Create professional marketing videos, avatar-driven explainers, and TV-style commercials without a production team.',
    link: createPageUrl('AiVideos'),
    linkLabel: 'See AI Videos →',
    color: 'cyan',
  },
  {
    icon: Share2,
    title: 'Social Media Automation',
    description: 'Schedule, manage, and publish social posts across platforms without spending hours each week.',
    link: createPageUrl('AiSocialMedia'),
    linkLabel: 'See Social Tools →',
    color: 'emerald',
  },
  {
    icon: Tv,
    title: 'Streaming TV Advertising',
    description: 'Create and launch TV-style ads on Hulu, Roku, and 30+ streaming platforms — starting from one script.',
    link: createPageUrl('StreamingTvAdvertising'),
    linkLabel: 'See Streaming TV →',
    color: 'rose',
  },
  {
    icon: CalendarDays,
    title: 'Weekly Marketing Plans',
    description: 'Get a fresh weekly plan every week — what to post, promote, and create — tailored to your business and season.',
    link: createPageUrl('GrowthSystem'),
    linkLabel: 'See Growth System →',
    color: 'amber',
  },
];

const colorMap = {
  violet: { bg: 'bg-violet-600/10', border: 'border-violet-500/20', icon: 'text-violet-400', link: 'text-violet-400 hover:text-violet-300' },
  cyan:   { bg: 'bg-cyan-600/10',   border: 'border-cyan-500/20',   icon: 'text-cyan-400',   link: 'text-cyan-400 hover:text-cyan-300' },
  emerald:{ bg: 'bg-emerald-600/10',border: 'border-emerald-500/20',icon: 'text-emerald-400',link: 'text-emerald-400 hover:text-emerald-300' },
  rose:   { bg: 'bg-rose-600/10',   border: 'border-rose-500/20',   icon: 'text-rose-400',   link: 'text-rose-400 hover:text-rose-300' },
  amber:  { bg: 'bg-amber-600/10',  border: 'border-amber-500/20',  icon: 'text-amber-400',  link: 'text-amber-400 hover:text-amber-300' },
};

export default function DemoFeatures() {
  return (
    <section className="bg-slate-950 py-20 px-4 border-t border-slate-800">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">What's Inside</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Platform Features</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Every tool your small business needs to market consistently — in one system.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => {
            const c = colorMap[f.color];
            const Icon = f.icon;
            return (
              <div key={f.title} className={`${c.bg} border ${c.border} rounded-2xl p-6 flex flex-col`}>
                <div className={`w-10 h-10 ${c.bg} border ${c.border} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${c.icon}`} />
                </div>
                <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-1">{f.description}</p>
                <Link to={f.link} className={`mt-4 text-sm font-semibold transition-colors ${c.link}`}>
                  {f.linkLabel}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
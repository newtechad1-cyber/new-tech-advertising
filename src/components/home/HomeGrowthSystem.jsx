import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BrainCircuit, Video, Share2, Tv, CalendarCheck, BarChart2, ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    icon: BrainCircuit,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    label: 'AI Content Engine',
    desc: 'Automatically generate brand-aligned social posts, captions, and campaign content from your business profile — every week.',
  },
  {
    icon: Video,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    label: 'Video Studio',
    desc: 'Turn scripts and ideas into professional marketing videos with AI avatars, voiceover, and branded overlays. No camera required.',
  },
  {
    icon: Share2,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    label: 'Social Media Automation',
    desc: 'Schedule and publish content across Facebook, Instagram, LinkedIn, and more — automatically, at the right times.',
  },
  {
    icon: Tv,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    label: 'Streaming TV Advertising',
    desc: 'Run local TV commercials on Hulu, Roku, Paramount+, and 30+ streaming platforms — targeted to your exact service area.',
  },
  {
    icon: CalendarCheck,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    label: 'Weekly Marketing Plans',
    desc: 'AI-generated weekly plans with specific tasks, themes, and campaigns based on your business goals and market data.',
  },
  {
    icon: BarChart2,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    label: 'Marketing Dashboard',
    desc: 'See every channel, campaign, and result in one place. AI-generated monthly reports with plain-English insights.',
  },
];

export default function HomeGrowthSystem() {
  return (
    <section className="bg-slate-900 py-20 px-4 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-violet-400 text-sm font-semibold uppercase tracking-widest">The Growth System</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">
            A complete marketing system for small businesses
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Instead of hiring an agency or stitching together 10 different tools, you get one connected system that handles every channel — starting at $99/mo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {FEATURES.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
                <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="text-white font-bold text-base mb-2">{f.label}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={createPageUrl('GrowthSystem')}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm shadow-lg shadow-violet-600/20"
          >
            See the Full System <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to={createPageUrl('AiMarketingPlatform')}
            className="inline-flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-300 font-semibold px-6 py-3 rounded-xl transition-all text-sm"
          >
            Explore the Platform <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
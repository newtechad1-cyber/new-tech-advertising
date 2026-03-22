import React from 'react';
import { Clock, DollarSign, Globe, Video, LayoutDashboard } from 'lucide-react';

const PAINS = [
  {
    icon: Globe,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    title: 'Your website isn\'t generating enough leads',
    desc: 'Most small business websites sit there and look nice. They don\'t capture leads, rank in search, or convert visitors into calls.',
  },
  {
    icon: Clock,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    title: 'Social media takes too much time',
    desc: 'Posting consistently requires a content strategy, design skills, and hours every week. It\'s a full-time job — and it still might not work.',
  },
  {
    icon: DollarSign,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    title: 'Agencies are expensive and slow',
    desc: 'Traditional marketing agencies charge $3,000–$5,000/month and spend the first 90 days on strategy. Most small businesses can\'t wait that long.',
  },
  {
    icon: Video,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    title: 'Video feels impossible to produce',
    desc: 'You know video works. But hiring a videographer, writing scripts, and editing content feels out of reach without a team or budget.',
  },
  {
    icon: LayoutDashboard,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    title: 'You\'re managing too many tools',
    desc: 'Most business owners are juggling 5–10 different platforms for content, scheduling, analytics, and ads — none of them connected.',
  },
];

export default function HomeProblem() {
  return (
    <section className="bg-slate-950 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-rose-400 text-sm font-semibold uppercase tracking-widest">Sound Familiar?</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">
            You're great at your business.<br className="hidden sm:block" /> Marketing it shouldn't feel like a second job.
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            You didn't start your business to spend nights writing captions, chasing agencies, or figuring out algorithms. But here you are — and it's not your fault. The whole system was built for big brands, not you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PAINS.map(pain => {
            const Icon = pain.icon;
            return (
              <div key={pain.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex gap-4 hover:border-slate-700 transition-colors">
                <div className={`w-10 h-10 rounded-xl ${pain.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon className={`w-5 h-5 ${pain.color}`} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-2">{pain.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{pain.desc}</p>
                </div>
              </div>
            );
          })}
          <div className="bg-violet-900/20 border border-violet-700/30 rounded-2xl p-6 flex items-center justify-center lg:col-span-1 sm:col-span-2">
            <p className="text-white font-bold text-xl text-center leading-snug">
              That's why NTA was<br />
              <span className="text-violet-400">built differently.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
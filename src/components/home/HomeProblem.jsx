import React from 'react';
import { Clock, DollarSign, TrendingDown, AlertCircle } from 'lucide-react';

const PAINS = [
  {
    icon: Clock,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    title: 'No time to post consistently',
    desc: 'You know you should be on social media every day — but between running your business and serving customers, content never gets done.',
  },
  {
    icon: DollarSign,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    title: 'Agencies cost $3–5k/month',
    desc: 'Traditional marketing agencies are built for enterprise budgets. Small businesses get the leftover attention and a generic content calendar.',
  },
  {
    icon: TrendingDown,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    title: 'DIY tools don\'t produce results',
    desc: 'Canva, Buffer, and scheduling tools require you to be your own strategist, copywriter, and creative director. That\'s a full-time job.',
  },
  {
    icon: AlertCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    title: 'You\'re invisible online while competitors grow',
    desc: 'Every day without a consistent content strategy is a day your competitors are building the authority and trust you need to win new customers.',
  },
];

export default function HomeProblem() {
  return (
    <section className="bg-slate-950 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-rose-400 text-sm font-semibold uppercase tracking-widest">The Problem</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">
            Small businesses are losing the marketing war
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Not because they don't care — but because the tools weren't built for them.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {PAINS.map(pain => {
            const Icon = pain.icon;
            return (
              <div key={pain.title} className={`${pain.bg} border border-slate-800 rounded-2xl p-6 flex gap-4`}>
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
        </div>

        <div className="mt-10 text-center">
          <p className="text-2xl font-bold text-white">
            There's a better way. <span className="text-violet-400">Introducing NTA.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
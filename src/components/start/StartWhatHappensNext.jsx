import React from 'react';
import { UserCircle, Cpu, LayoutDashboard, Rocket } from 'lucide-react';

const STEPS = [
  {
    icon: UserCircle,
    title: 'Tell Us About Your Business',
    desc: 'We collect a few basics — your industry, location, and goals. Nothing complicated.',
    color: 'text-violet-400',
    bg: 'bg-violet-600/10 border-violet-500/30',
  },
  {
    icon: Cpu,
    title: 'We Build Your Starting Profile',
    desc: 'Our system generates your marketing direction, content ideas, and campaign recommendations based on your business.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-600/10 border-cyan-500/30',
  },
  {
    icon: LayoutDashboard,
    title: 'Your Account Is Set Up Around You',
    desc: 'Your dashboard is configured around your services, location, and goals — not generic templates.',
    color: 'text-green-400',
    bg: 'bg-green-600/10 border-green-500/30',
  },
  {
    icon: Rocket,
    title: 'Start Creating and Publishing',
    desc: 'You get a real marketing system you can actually use — content, videos, social posts, and campaigns.',
    color: 'text-orange-400',
    bg: 'bg-orange-600/10 border-orange-500/30',
  },
];

export default function StartWhatHappensNext() {
  return (
    <section className="bg-slate-900 border-y border-slate-800 py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">What Happens After You Start</h2>
          <p className="text-slate-400 max-w-xl mx-auto">The process is guided, not technical. Here's exactly what to expect.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className={`rounded-xl border p-5 ${step.bg}`}>
                <div className="mb-3">
                  <Icon className={`w-6 h-6 ${step.color}`} />
                </div>
                <h3 className="text-white font-semibold mb-2 text-sm leading-snug">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
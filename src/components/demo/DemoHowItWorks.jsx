import React from 'react';
import { BrainCircuit, FileText, Megaphone, Eye } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    icon: BrainCircuit,
    title: 'Create Your Marketing Plan',
    description: 'The system generates a weekly marketing direction based on your business type, location, and goals. No guesswork — just a clear plan for what to create and promote.',
    color: 'violet',
  },
  {
    number: '02',
    icon: FileText,
    title: 'Generate Content and Videos',
    description: 'Create blog posts, social media content, marketing videos, and streaming TV ad scripts using AI tools built for your industry.',
    color: 'cyan',
  },
  {
    number: '03',
    icon: Megaphone,
    title: 'Launch Campaigns',
    description: 'Schedule posts, launch promotions, and run campaigns across your channels. The system keeps your calendar full without hours of manual work.',
    color: 'emerald',
  },
  {
    number: '04',
    icon: Eye,
    title: 'Stay Visible',
    description: 'Consistent marketing keeps your business in front of customers every week. The system makes "showing up" automatic — not an afterthought.',
    color: 'amber',
  },
];

const colorMap = {
  violet: { bg: 'bg-violet-600/15', border: 'border-violet-500/30', text: 'text-violet-400', num: 'text-violet-600' },
  cyan: { bg: 'bg-cyan-600/15', border: 'border-cyan-500/30', text: 'text-cyan-400', num: 'text-cyan-600' },
  emerald: { bg: 'bg-emerald-600/15', border: 'border-emerald-500/30', text: 'text-emerald-400', num: 'text-emerald-600' },
  amber: { bg: 'bg-amber-600/15', border: 'border-amber-500/30', text: 'text-amber-400', num: 'text-amber-600' },
};

export default function DemoHowItWorks() {
  return (
    <section className="bg-slate-900 py-20 px-4 border-t border-slate-800">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">Platform Walkthrough</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">How the System Works</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Four steps. One platform. Everything your small business needs to market consistently.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {STEPS.map((step) => {
            const c = colorMap[step.color];
            const Icon = step.icon;
            return (
              <div key={step.number} className={`${c.bg} border ${c.border} rounded-2xl p-7 relative overflow-hidden`}>
                <span className={`absolute top-4 right-5 text-6xl font-black ${c.num} opacity-20 select-none leading-none`}>
                  {step.number}
                </span>
                <div className={`w-10 h-10 ${c.bg} border ${c.border} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${c.text}`} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
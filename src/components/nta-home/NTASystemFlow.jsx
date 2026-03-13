import React from 'react';
import { Globe, Cpu, Tv, Send, BarChart2, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    icon: Globe,
    color: '#3b82f6',
    bg: '#eff6ff',
    title: 'Authority Website',
    desc: 'A high-performance local authority site built on NTA\'s proven framework — structured for search dominance and conversion.',
    stat: '3–5× more organic traffic',
  },
  {
    icon: Cpu,
    color: '#8b5cf6',
    bg: '#f5f3ff',
    title: 'AI Content Engine',
    desc: 'Publishes 2 blogs, 5 social posts, and 1 video script per week — all branded, localized, and SEO-optimized automatically.',
    stat: '400+ pieces per year',
  },
  {
    icon: Tv,
    color: '#06b6d4',
    bg: '#ecfeff',
    title: 'Streaming Visibility',
    desc: 'Your business appears on Connected TV platforms reaching local audiences on Roku, Amazon Fire, and Apple TV.',
    stat: '50K+ local impressions/mo',
  },
  {
    icon: Send,
    color: '#10b981',
    bg: '#f0fdf4',
    title: 'Automated Publishing',
    desc: 'Every piece of content is reviewed, approved, and published across Google, Facebook, Instagram, and your website on schedule.',
    stat: 'Zero manual effort',
  },
  {
    icon: BarChart2,
    color: '#f59e0b',
    bg: '#fffbeb',
    title: 'ROI Reporting',
    desc: 'Monthly authority reports showing visibility growth, leads generated, and estimated revenue impact — all in one dashboard.',
    stat: 'Full revenue attribution',
  },
];

export default function NTASystemFlow() {
  return (
    <section id="platform" className="py-24 bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-4">The NTA System</p>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
            One Platform. Five Growth Engines. Zero Guesswork.
          </h2>
          <p className="text-lg text-slate-400">
            Every layer works together in a single automated flywheel — no fragmented tools, no manual handoffs.
          </p>
        </div>

        {/* Flow diagram */}
        <div className="flex flex-col lg:flex-row items-stretch gap-0 max-w-6xl mx-auto">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex lg:flex-col items-center flex-1">
                <div className="flex-1 relative group">
                  <div className="h-full p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition-all hover:border-slate-700 hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${step.color}20`, border: `1px solid ${step.color}30` }}>
                      <Icon className="w-6 h-6" style={{ color: step.color }} />
                    </div>
                    <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Step {i + 1}</div>
                    <h3 className="text-white font-black text-lg mb-3 leading-tight">{step.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-5">{step.desc}</p>
                    <div className="mt-auto pt-4 border-t border-slate-800">
                      <p className="font-bold text-sm" style={{ color: step.color }}>{step.stat}</p>
                    </div>
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-shrink-0 mx-1 hidden lg:flex items-center">
                    <ArrowRight className="w-5 h-5 text-slate-700" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-14 text-center">
          <a href="#demo" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-black text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 transition-all shadow-2xl shadow-blue-600/30 hover:-translate-y-0.5">
            See the Full Platform →
          </a>
        </div>
      </div>
    </section>
  );
}
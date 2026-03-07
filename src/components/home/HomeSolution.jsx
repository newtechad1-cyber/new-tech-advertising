import React from 'react';
import { BrainCircuit, Calendar, BarChart2, Video, Zap, Globe } from 'lucide-react';

const FEATURES = [
  { icon: BrainCircuit, color: 'text-violet-400', bg: 'bg-violet-500/10', label: 'AI Content Engine', desc: 'Generates brand-aligned social posts, captions, and campaigns automatically from your business profile.' },
  { icon: Calendar, color: 'text-cyan-400', bg: 'bg-cyan-500/10', label: 'Auto-Scheduling', desc: 'Content is scheduled to publish at peak engagement times across all your connected social channels.' },
  { icon: Video, color: 'text-pink-400', bg: 'bg-pink-500/10', label: 'AI Video Studio', desc: 'Turn scripts into professional short-form videos with AI avatars, voiceover, and brand overlays.' },
  { icon: Globe, color: 'text-sky-400', bg: 'bg-sky-500/10', label: 'Authority Plan', desc: 'A 90-day strategy built around your brand, audience, and goals — with campaigns, pillars, and a posting calendar.' },
  { icon: BarChart2, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Performance Reports', desc: 'AI-generated monthly reports showing reach, engagement, top posts, and strategic recommendations.' },
  { icon: Zap, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Done-For-You Option', desc: 'Our team handles everything — content, approval, scheduling, and performance optimization. Zero effort required.' },
];

export default function HomeSolution() {
  return (
    <section className="bg-slate-900 py-20 px-4 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-violet-400 text-sm font-semibold uppercase tracking-widest">The Solution</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">
            Your full marketing team — powered by AI
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            NTA combines AI content generation, scheduling, video creation, and strategic planning into one platform. Use it yourself or let us run it for you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
      </div>
    </section>
  );
}
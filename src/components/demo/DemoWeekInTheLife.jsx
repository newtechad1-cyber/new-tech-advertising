import React from 'react';
import { Calendar, BrainCircuit, Video, FileText, Megaphone, BarChart2 } from 'lucide-react';

const WEEK = [
  { day: 'Monday', icon: BrainCircuit,  color: 'violet', action: 'Generate your weekly marketing plan', detail: 'The system reviews your industry, season, and goals and gives you a clear content direction for the week.' },
  { day: 'Tuesday', icon: Video,        color: 'cyan',   action: 'Create a video and social posts',   detail: 'Use the AI Video Studio to produce a short video, then generate 3–5 social posts to go with it.' },
  { day: 'Wednesday', icon: FileText,   color: 'emerald',action: 'Publish blog content',              detail: 'A SEO-ready blog article is drafted for your site. Review it, approve it, and it goes live.' },
  { day: 'Thursday', icon: Megaphone,   color: 'rose',   action: 'Launch a promotion or campaign',   detail: 'Run a seasonal offer, review request campaign, or local visibility push with one click.' },
  { day: 'Friday', icon: BarChart2,     color: 'amber',  action: 'Review results, plan next week',   detail: 'See what performed, what ran, and let the system start building your next week\'s plan.' },
];

const colorMap = {
  violet: { dot: 'bg-violet-500', bg: 'bg-violet-600/10 border-violet-500/20', icon: 'text-violet-400', day: 'text-violet-300' },
  cyan:   { dot: 'bg-cyan-500',   bg: 'bg-cyan-600/10 border-cyan-500/20',     icon: 'text-cyan-400',   day: 'text-cyan-300' },
  emerald:{ dot: 'bg-emerald-500',bg: 'bg-emerald-600/10 border-emerald-500/20',icon:'text-emerald-400', day: 'text-emerald-300' },
  rose:   { dot: 'bg-rose-500',   bg: 'bg-rose-600/10 border-rose-500/20',     icon: 'text-rose-400',   day: 'text-rose-300' },
  amber:  { dot: 'bg-amber-500',  bg: 'bg-amber-600/10 border-amber-500/20',   icon: 'text-amber-400',  day: 'text-amber-300' },
};

export default function DemoWeekInTheLife() {
  return (
    <section className="bg-slate-900 py-20 px-4 border-t border-slate-800">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-4 py-1.5 mb-4">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300 text-sm font-medium">Example Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">What a Week Using the System Looks Like</h2>
          <p className="text-slate-400">Five focused actions. Complete marketing presence. Zero agency required.</p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-5 top-5 bottom-5 w-px bg-slate-800 hidden sm:block" />

          <div className="space-y-4">
            {WEEK.map((item) => {
              const c = colorMap[item.color];
              const Icon = item.icon;
              return (
                <div key={item.day} className={`relative flex gap-5 border rounded-xl p-5 ${c.bg}`}>
                  <div className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-slate-900 border border-slate-700`}>
                    <Icon className={`w-5 h-5 ${c.icon}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${c.day}`}>{item.day}</p>
                    <p className="text-white font-semibold text-sm mb-1">{item.action}</p>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
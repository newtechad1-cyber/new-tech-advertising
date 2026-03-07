import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';

const SCRIPT = [
  {
    label: 'The Problem',
    color: 'rose',
    content: 'Most small businesses know they need to market consistently — but they don\'t have a dedicated marketing team, a clear system, or enough hours in the week. So marketing becomes something that only happens when there\'s time. Which means it almost never happens.',
  },
  {
    label: 'What NTA Is',
    color: 'violet',
    content: 'New Tech Advertising is a connected marketing system built specifically for small businesses. It\'s not a single tool. It\'s an entire platform — one place to generate marketing plans, create content and videos, schedule campaigns, and stay visible online.',
  },
  {
    label: 'What It Does',
    color: 'cyan',
    content: 'Every week, the system gives you a marketing plan tailored to your business, industry, and goals. From there, you can generate blog posts, social media content, marketing videos, and even streaming TV commercial scripts — all without starting from a blank page.',
  },
  {
    label: 'How It Helps',
    color: 'emerald',
    content: 'Instead of guessing what to post or paying an agency to do it for you, the system runs your marketing week from one platform. Small business owners save hours every week, stay consistent, and finally have a system that keeps working even when things get busy.',
  },
  {
    label: 'The Next Step',
    color: 'amber',
    content: 'You can try the full platform free for 14 days — no credit card required. We\'ll build your starting marketing plan, generate your first content ideas, and have your system running in under 48 hours. Visit newtechadvertising.com/start to get started today.',
  },
];

const colorMap = {
  rose:    { bg: 'bg-rose-600/10',    border: 'border-rose-500/20',    text: 'text-rose-400',    dot: 'bg-rose-500' },
  violet:  { bg: 'bg-violet-600/10',  border: 'border-violet-500/20',  text: 'text-violet-400',  dot: 'bg-violet-500' },
  cyan:    { bg: 'bg-cyan-600/10',    border: 'border-cyan-500/20',    text: 'text-cyan-400',    dot: 'bg-cyan-500' },
  emerald: { bg: 'bg-emerald-600/10', border: 'border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-500' },
  amber:   { bg: 'bg-amber-600/10',   border: 'border-amber-500/20',   text: 'text-amber-400',   dot: 'bg-amber-500' },
};

export default function DemoScriptSummary() {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-slate-950 py-14 px-4 border-t border-slate-800">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between gap-4 bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 hover:bg-slate-800 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-violet-600/20 border border-violet-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold text-sm">2-Minute Demo Script Outline</p>
              <p className="text-slate-500 text-xs">What the platform demo covers — section by section</p>
            </div>
          </div>
          {open
            ? <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
            : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
          }
        </button>

        {open && (
          <div className="mt-4 space-y-3">
            {SCRIPT.map((section) => {
              const c = colorMap[section.color];
              return (
                <div key={section.label} className={`${c.bg} border ${c.border} rounded-xl px-5 py-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
                    <p className={`text-xs font-bold uppercase tracking-widest ${c.text}`}>{section.label}</p>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{section.content}</p>
                </div>
              );
            })}
            <p className="text-slate-600 text-xs text-center pt-2">
              This outline is used for the 2-minute narrated demo video production.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
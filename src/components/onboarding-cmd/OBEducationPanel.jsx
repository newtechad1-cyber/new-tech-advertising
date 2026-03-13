import React, { useState } from 'react';
import { BookOpen, ChevronDown, Clock } from 'lucide-react';

const MODULES = [
  {
    title: 'How Your Content Engine Works',
    duration: '3 min',
    content: 'Every month, our AI + human team creates 30–60+ pieces of content for your business — blogs, social posts, emails, and more. All you do is spend 30 minutes approving before anything goes live. The system handles research, writing, designing, scheduling, and posting. You stay visible. We do the work.',
  },
  {
    title: 'Understanding Your Visibility Score',
    duration: '2 min',
    content: 'Your Visibility Score measures how often your business appears when local customers search for your services. A score above 70 means you\'re showing up consistently. We track this monthly and show you exact improvement over time. Most clients see a 40–60% improvement in their first 90 days.',
  },
  {
    title: 'The Streaming TV Authority Advantage',
    duration: '4 min',
    content: 'NTA places real 30-second commercials for your business on platforms like Hulu, Peacock, and YouTube TV. This isn\'t just about views — it\'s about becoming the business everyone recognizes. When your commercial runs alongside major brand ads, local prospects see you as an authority, not just another contractor.',
  },
  {
    title: 'How to Get the Most From Your Reports',
    duration: '2 min',
    content: 'Your monthly report shows lead volume, visibility score, content performance, and revenue attribution. The most important number to track: new inbound leads (people who found you online vs. referrals). This is your clearest signal of system performance. Consistent growth here = your ROI at work.',
  },
  {
    title: 'Your Role in the Process',
    duration: '2 min',
    content: 'Your monthly job: 1) Review content before it posts (30 min), 2) Attend the monthly strategy call (30 min), 3) Respond to the reports we send. That\'s it. We handle everything else. The more feedback you give us in the first 90 days, the faster we tune the system to your business voice.',
  },
];

export default function OBEducationPanel() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800">
        <h3 className="text-white font-bold text-sm flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-400" /> Getting Started Guide
        </h3>
        <p className="text-slate-500 text-xs mt-0.5">5 short modules to maximize your NTA experience</p>
      </div>
      <div className="divide-y divide-slate-800/50">
        {MODULES.map((mod, i) => (
          <div key={i}>
            <button onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-800/30 transition-colors">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                openIdx === i ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}>{i + 1}</div>
              <span className={`flex-1 text-sm font-semibold ${openIdx === i ? 'text-white' : 'text-slate-300'}`}>{mod.title}</span>
              <span className="flex items-center gap-1 text-xs text-slate-600 flex-shrink-0">
                <Clock className="w-3 h-3" />{mod.duration}
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
            </button>
            {openIdx === i && (
              <div className="px-5 pb-5">
                <div className="ml-10 p-4 bg-blue-950/20 border border-blue-800/30 rounded-xl">
                  <p className="text-slate-300 text-sm leading-relaxed">{mod.content}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
import React from 'react';
import { Map } from 'lucide-react';

const PARTS = [
  { num: '01', title: 'Foundation', desc: "Understand Cattleman's existing foundation—website, menu, Google presence, customer access points, existing systems, and how people currently find and interact with Cattleman's." },
  { num: '02', title: 'Digital Growth Office', desc: "Create a practical place where Pete, the Cattleman's team, and NTA can bring questions, ideas, observations, customer feedback, and ongoing work together." },
  { num: '03', title: 'Knowledge', desc: "Begin capturing what the people inside the restaurant already know. That can include owner knowledge, employee observations, customer questions, reviews, procedures, ideas, conversations, and lessons learned. Over time, that becomes the restaurant's shared Knowledge Library." },
  { num: '04', title: 'Audience & Growth', desc: "Instead of trying to market everything at once, identify the part of Cattleman's that deserves attention and build the appropriate website, Google, content, video, social, customer communication, or other marketing around that priority." },
  { num: '05', title: 'Connect & Improve', desc: 'Learn from what happens. Connect useful information from existing systems where it makes sense. Bring what the restaurant learns back into the Knowledge Library and Growth Roadmap so the next decision starts with more knowledge than the last one.' },
];

export default function CaseStudyRoadmap() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/25 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-8">
        <Map className="w-3.5 h-3.5" /> The Cattleman's Growth Roadmap
      </div>
      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-blue-500/20">
        {PARTS.map(({ num, title, desc }) => (
          <div key={num} className="relative">
            <span className="absolute -left-[1.35rem] top-1 w-4 h-4 rounded-full bg-blue-500/20 border-2 border-blue-400" />
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-black tracking-widest text-blue-400">{num}</span>
                <h3 className="text-lg font-bold text-white">{title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
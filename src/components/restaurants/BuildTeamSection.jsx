import React from 'react';
import { Layers, MessageSquareText, Brain, Repeat } from 'lucide-react';

const STEPS = [
  { icon: MessageSquareText, title: 'A Question of the Week', desc: "Invite employees to type a quick answer or record a one- or two-minute response through communication they already receive." },
  { icon: Brain, title: 'AI helps organize it', desc: 'AI can organize responses, find recurring questions and patterns, and bring important information back to the owner.' },
  { icon: MessageSquareText, title: 'The owner responds', desc: "Employees can see that their ideas didn't disappear. Questions can become better training." },
  { icon: Repeat, title: 'It compounds', desc: 'Customer comments become better service. Repeated problems become better processes. Good ideas become opportunities.' },
];

export default function BuildTeamSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 border-t border-slate-800/60">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/25 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-5">
        <Layers className="w-3.5 h-3.5" /> Digital Growth Office&trade;
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-snug">
        Build the Team. Build the Restaurant.
      </h2>
      <p className="text-slate-400 text-lg leading-relaxed mb-4 max-w-3xl">
        Your <span className="text-white font-semibold">Digital Growth Office&trade;</span> gives the owner, managers and
        employees a practical place to share questions, ideas, customer feedback and what they're learning.
      </p>
      <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-3xl">It doesn't have to mean more meetings.</p>

      <div className="grid gap-4 sm:grid-cols-2 mb-10">
        {STEPS.map(({ icon: Icon, title, desc }, i) => (
          <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <span className="flex w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 items-center justify-center mb-4">
              <Icon className="w-5 h-5" />
            </span>
            <h3 className="text-white font-semibold mb-2">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
        Over time, everybody begins working from more of the same information.
      </p>
      <p className="text-blue-300 font-semibold text-lg mt-3">That's not just collecting knowledge. That's building a team.</p>
      <p className="text-slate-500 text-sm mt-6 max-w-2xl">
        This is not employee surveillance, employee scoring, or AI making management decisions. People stay in charge of
        people.
      </p>
    </section>
  );
}
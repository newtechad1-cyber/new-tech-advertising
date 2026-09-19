import React from 'react';
import { MessageSquareText } from 'lucide-react';

export default function CaseStudyTeamCallout() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-8">
      <div className="rounded-2xl border border-blue-500/20 bg-blue-950/20 p-7">
        <div className="inline-flex items-center gap-2 mb-4 text-blue-300">
          <MessageSquareText className="w-4 h-4" />
          <h3 className="text-lg font-bold text-white">The Team Becomes Part of the Roadmap</h3>
        </div>
        <p className="text-slate-300 leading-relaxed mb-4 max-w-3xl">
          One of the ideas we're exploring with Cattleman's is a simple way for employees to contribute what they're seeing
          and learning.
        </p>
        <p className="text-slate-300 leading-relaxed mb-3 max-w-3xl">
          A <span className="text-white font-semibold">Question of the Week</span> could let a server, bartender, manager,
          kitchen employee, or other team member record a short answer or type a response.
        </p>
        <ul className="space-y-2 text-slate-400 max-w-3xl mb-5">
          <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span>AI can help organize those responses and bring useful patterns back to Pete.</li>
          <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span>Pete can respond, clarify, teach, and decide what deserves attention.</li>
        </ul>
        <p className="text-slate-400 leading-relaxed mb-5 max-w-3xl">
          The goal isn't employee surveillance. It's better communication and a restaurant that learns from the people
          closest to the work and the customers.
        </p>
        <p className="text-blue-300 font-semibold leading-snug border-t border-blue-500/15 pt-4">
          People provide the knowledge. AI helps the business remember, organize and use it. People make the decisions.
        </p>
      </div>
    </section>
  );
}
import React from 'react';
import { ShieldCheck, Users, Zap, Link } from 'lucide-react';

const POINTS = [
  { icon: ShieldCheck, text: 'No bloated agency process or long contracts' },
  { icon: Zap, text: 'No guessing what to do next — the system gives you direction' },
  { icon: Users, text: 'Content, video, and campaign ideas built around your business' },
  { icon: Link, text: 'One connected system for content, social, video, and campaigns' },
];

export default function StartTrust() {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mt-6">
      <p className="text-white font-semibold text-sm mb-4">Built for Small Businesses</p>
      <ul className="space-y-3">
        {POINTS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-start gap-3 text-slate-400 text-sm">
            <Icon className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}
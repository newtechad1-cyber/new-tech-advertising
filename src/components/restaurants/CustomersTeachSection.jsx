import React from 'react';
import { Quote } from 'lucide-react';

const SIGNALS = [
  'They ask questions.',
  'They leave reviews.',
  'They request menu items.',
  'They ask about gluten-free or dietary options.',
  'They ask whether you cater.',
  'They ask about private parties.',
  'They tell employees what they loved.',
  'Sometimes they tell you what disappointed them.',
];

const PATTERNS = [
  "Maybe customers want something explained better.",
  "Maybe there's an opportunity for catering.",
  "Maybe people don't know about private events.",
  'Maybe lunch needs attention.',
  'Maybe customers love something the restaurant barely promotes.',
  'Maybe an operational problem keeps affecting the customer experience.',
];

export default function CustomersTeachSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 border-t border-slate-800/60">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-snug">
        Your Customers Are Telling You What to Build Next.
      </h2>
      <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-3xl">A restaurant learns from customers every day.</p>

      <div className="grid gap-3 sm:grid-cols-2 mb-8">
        {SIGNALS.map((s, i) => (
          <div key={i} className="flex items-start gap-2.5 text-slate-300">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
            <span className="leading-relaxed">{s}</span>
          </div>
        ))}
      </div>

      <p className="text-slate-400 text-lg leading-relaxed mb-6 max-w-3xl">
        That information shouldn't disappear when the conversation ends. Customer questions and feedback can become part of
        what the restaurant learns. When the same questions or opportunities keep appearing, the owner can begin seeing
        patterns.
      </p>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 mb-8">
        <Quote className="w-5 h-5 text-blue-400 mb-3" />
        <ul className="space-y-2.5">
          {PATTERNS.map((p, i) => (
            <li key={i} className="text-slate-300 leading-relaxed flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">—</span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-white font-semibold text-xl leading-snug max-w-3xl">
        Your customers aren't just buying from the business. They're continually teaching you something about it.
      </p>
    </section>
  );
}
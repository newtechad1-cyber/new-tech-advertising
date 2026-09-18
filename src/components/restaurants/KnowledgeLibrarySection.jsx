import React from 'react';
import { BookOpen, Search } from 'lucide-react';

const ITEMS = [
  'customer questions', 'employee questions', 'menu information', 'recipes and preparation knowledge',
  'training', 'procedures', 'policies', 'catering information', 'private-event information',
  'vendor information', 'customer feedback', 'reviews', 'successful promotions',
  'lessons from unsuccessful promotions', 'seasonal knowledge', 'frequently asked questions',
  'owner knowledge', 'employee observations', 'documents', 'short recordings',
  'useful information from existing systems',
];

export default function KnowledgeLibrarySection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 border-t border-slate-800/60">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/25 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-5">
        <BookOpen className="w-3.5 h-3.5" /> Restaurant Knowledge Library
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-snug">
        Build a Restaurant Knowledge Library.
      </h2>
      <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-3xl">
        As the team and customers contribute knowledge, the restaurant begins creating something valuable: a shared
        memory of the business.
      </p>

      <div className="flex flex-wrap gap-2.5 mb-10">
        {ITEMS.map((item, i) => (
          <span key={i} className="px-3.5 py-1.5 rounded-full border border-slate-700 bg-slate-900/50 text-slate-300 text-sm">
            {item}
          </span>
        ))}
      </div>

      <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-3xl">
        This is more than document storage. It becomes a place where the business can find and reuse what it has already
        learned.
      </p>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <Search className="w-5 h-5 text-blue-400 mb-3" />
          <p className="text-slate-300 text-sm leading-relaxed">
            An employee should increasingly be able to find a reliable answer instead of asking three different people and
            receiving three different answers.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <BookOpen className="w-5 h-5 text-blue-400 mb-3" />
          <p className="text-slate-300 text-sm leading-relaxed">
            New employees can learn from knowledge the restaurant has already accumulated. Owners don't have to repeatedly
            explain the same things.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <Search className="w-5 h-5 text-blue-400 mb-3" />
          <p className="text-slate-300 text-sm leading-relaxed">
            Customer-facing information can become more consistent. The knowledge of the restaurant becomes a business
            asset.
          </p>
        </div>
      </div>

      <p className="text-blue-300 font-semibold text-lg">The knowledge of the restaurant becomes a business asset.</p>
    </section>
  );
}
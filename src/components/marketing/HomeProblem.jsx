import React from 'react';
import { Clock, DollarSign, Frown, TrendingDown } from 'lucide-react';

const PROBLEMS = [
  {
    icon: Clock,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    title: "You don't have time",
    description: "Running a business leaves no room for planning, creating, and posting content every week. Most business owners give up after a few months."
  },
  {
    icon: DollarSign,
    color: 'text-red-500',
    bg: 'bg-red-50',
    title: "Agencies are expensive",
    description: "A typical marketing agency charges $1,500–$5,000/month. For most small businesses, that's not realistic — especially for results you can't always measure."
  },
  {
    icon: Frown,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
    title: "DIY tools are too complicated",
    description: "Most marketing software is built for full-time marketers, not business owners. Steep learning curves, confusing interfaces, and too many steps to get one post published."
  },
  {
    icon: TrendingDown,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    title: "Inconsistent = invisible",
    description: "The algorithm rewards businesses that show up consistently. If you're only posting once in a while, you're losing ground to competitors who post every day."
  },
];

export default function HomeProblem() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-3">The Real Problem</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
            Small businesses lose customers every day<br className="hidden md:block" /> because marketing is broken for them
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            You're not failing at marketing. The tools just weren't built with you in mind.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROBLEMS.map(p => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className={`${p.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${p.color}`} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{p.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <p className="text-xl font-bold mb-2">There's a better way.</p>
          <p className="text-blue-100 max-w-xl mx-auto">NTA gives small business owners the same marketing power as big brands — without the agency price tag or the learning curve.</p>
        </div>
      </div>
    </section>
  );
}
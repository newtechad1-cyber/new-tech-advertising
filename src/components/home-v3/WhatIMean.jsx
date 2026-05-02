import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const problems = [
  "What's already working",
  "What should stay",
  "What's not helping",
  'What small changes could make the biggest difference',
];

const solutions = [
  'Smarter tools to move faster and create content more efficiently',
  'Reduce unnecessary work and wasted spend',
  '40+ years of real marketing experience guiding every decision',
  'Knowing what to build, what to say, and what not to waste money on',
];

export default function WhatIMean() {
  return (
    <section className="bg-white py-20 px-6 border-t border-slate-100">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">

        {/* LEFT: The Problem */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
            Not Sure What's Working?
          </h2>
          <p className="text-slate-500 mb-5 leading-relaxed">
            Most businesses don't need everything torn apart. They need a clear look at what's helping, what's getting in the way, and what can be improved first. I'll look at your website and marketing and show you:
          </p>
          <ul className="space-y-3 mb-6">
            {problems.map(item => (
              <li key={item} className="flex items-start gap-3 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-slate-800 font-semibold">No obligation. Just a clear, honest look.</p>
        </div>

        {/* RIGHT: The Solution */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
            Smarter Tools. Real Marketing Experience.
          </h2>
          <p className="text-slate-500 mb-5 leading-relaxed">
            There's a lot of noise around AI right now. I use it where it actually helps — but AI does not replace experience. The value comes from knowing what to build, where to focus, and what not to waste money on:
          </p>
          <ul className="space-y-3 mb-6">
            {solutions.map(item => (
              <li key={item} className="flex items-start gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-slate-500 text-sm leading-relaxed">
            That's where 40+ years of marketing experience matters.
          </p>
        </div>

      </div>
    </section>
  );
}
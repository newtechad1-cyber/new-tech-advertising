import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const problems = [
  'Customers never find them online',
  "Customers don't trust them yet",
  'Nobody follows up consistently',
];

const solutions = [
  'More calls, estimates, and booked jobs',
  'Better visibility in local search and social',
  'Content that builds trust before they even call',
  'Consistent follow-up that brings customers back',
];

export default function WhatIMean() {
  return (
    <section className="bg-white py-20 px-6 border-t border-slate-100">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">

        {/* LEFT: The Problem */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
            Most Local Businesses Lose Customers In 3 Places
          </h2>
          <p className="text-slate-500 mb-5 leading-relaxed">
            It's rarely one big problem. It's usually a few small gaps that add up to missed calls, lost trust, and customers going to a competitor instead.
          </p>
          <ul className="space-y-3 mb-6">
            {problems.map(item => (
              <li key={item} className="flex items-start gap-3 text-slate-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-slate-800 font-semibold">NTA helps solve all three.</p>
        </div>

        {/* RIGHT: The Solution */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
            A Growth System Built Around Your Business
          </h2>
          <p className="text-slate-500 mb-5 leading-relaxed">
            We don't just build websites or run ads. We put together a complete system focused on getting your business found, trusted, and chosen — and keeping customers coming back:
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
            Built on 40+ years of real marketing experience — and the right tools to move faster.
          </p>
        </div>

      </div>
    </section>
  );
}
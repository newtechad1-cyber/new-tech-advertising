import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const problems = [
  'Not showing up where people are searching',
  'Messaging that isn\'t clear',
  'A site that doesn\'t guide people to take action',
];

const solutions = [
  'Website structure that actually makes sense',
  'SEO pages built around real searches',
  'Campaigns that give people a reason to act',
  'Clear paths for customers to call or text',
];

export default function WhatIMean() {
  return (
    <section className="bg-white py-20 px-6 border-t border-slate-100">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">

        {/* LEFT: The Problem */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
            What This Means for Your Business
          </h2>
          <p className="text-slate-500 mb-5 leading-relaxed">
            If your website isn't consistently bringing in calls or customers, it's usually not just one issue. It's a combination of:
          </p>
          <ul className="space-y-3 mb-6">
            {problems.map(item => (
              <li key={item} className="flex items-start gap-3 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-slate-800 font-semibold">That's what I help fix.</p>
        </div>

        {/* RIGHT: The Solution */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
            What I Do
          </h2>
          <p className="text-slate-500 mb-5 leading-relaxed">
            I work with local businesses to build simple systems that connect everything:
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
            This isn't about complicated marketing.<br />
            It's about making your business easier to find and easier to contact.
          </p>
        </div>

      </div>
    </section>
  );
}
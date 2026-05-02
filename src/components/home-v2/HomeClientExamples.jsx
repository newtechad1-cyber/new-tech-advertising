import React from 'react';
import { Link } from 'react-router-dom';

const INDUSTRIES = [
  { name: 'HVAC and service businesses' },
  { name: 'Plumbing and excavation companies' },
  { name: 'Restaurants and food businesses' },
  { name: 'Fitness and membership-based businesses' },
];

const OUTCOMES = [
  { type: 'Service businesses', need: 'leads' },
  { type: 'Restaurants', need: 'customers and foot traffic' },
];

export default function HomeClientExamples() {
  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-5">Real Work, Real Businesses</h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-6">
            This is the type of work we've done across North Iowa and beyond.
          </p>
          <ul className="space-y-2 mb-8">
            {INDUSTRIES.map(ind => (
              <li key={ind.name} className="flex items-start gap-2 text-slate-700 text-base">
                <span className="text-blue-500 font-bold mt-0.5">·</span>
                {ind.name}
              </li>
            ))}
          </ul>
          <p className="text-slate-600 text-base leading-relaxed mb-4">
            Different businesses need different outcomes.
          </p>
          <ul className="space-y-2 mb-8">
            {OUTCOMES.map(o => (
              <li key={o.type} className="flex items-start gap-2 text-slate-700 text-base">
                <span className="text-blue-500 font-bold mt-0.5">·</span>
                {o.type} need {o.need}
              </li>
            ))}
          </ul>
          <p className="text-slate-600 text-base mb-8">
            We build systems that support both.
          </p>
          <Link
            to="/our-work"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            View Our Work →
          </Link>
        </div>
      </div>
    </section>
  );
}
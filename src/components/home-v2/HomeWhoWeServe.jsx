import React from 'react';

const INDUSTRIES = [
  'HVAC companies',
  'Plumbing and service businesses',
  'Excavating and trades',
  'Restaurants and local food businesses',
  'Fitness and membership businesses',
];

export default function HomeWhoWeServe() {
  return (
    <section className="bg-slate-50 py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-5">Who This Is For</h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-6">
            This works best for local businesses that rely on being found and contacted:
          </p>
          <ul className="space-y-2 mb-6">
            {INDUSTRIES.map(ind => (
              <li key={ind} className="flex items-start gap-2 text-slate-700 text-base">
                <span className="text-blue-500 font-bold mt-0.5">·</span>
                {ind}
              </li>
            ))}
          </ul>
          <p className="text-slate-600 text-base">
            If your business depends on local visibility, this applies to you.
          </p>
        </div>
      </div>
    </section>
  );
}
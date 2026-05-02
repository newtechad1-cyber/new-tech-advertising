import React from 'react';

const INDUSTRIES = [
  'HVAC and service businesses',
  'Plumbing and trades',
  'Excavating and contractors',
  'Restaurants and local food businesses',
  'Fitness and membership businesses',
];

export default function HomeWhoWeServe() {
  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-5">Who This Works For</h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-6">
            This works best for local businesses that rely on being found and contacted:
          </p>
          <ul className="space-y-2 mb-8">
            {INDUSTRIES.map(item => (
              <li key={item} className="flex items-start gap-2 text-slate-700">
                <span className="text-blue-500 font-bold mt-0.5">·</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-slate-600 leading-relaxed">
            Some businesses need leads. Some need customers walking through the door.<br />
            <span className="font-medium text-slate-700 mt-2 block">The goal is the same: make it easier for people to find you and take the next step.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
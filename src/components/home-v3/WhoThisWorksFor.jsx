import React from 'react';

const industries = [
  'HVAC and service businesses',
  'Plumbing and trades',
  'Excavating and contractors',
  'Restaurants and local businesses',
  'Fitness and membership businesses',
];

export default function WhoThisWorksFor() {
  return (
    <section className="bg-white py-20 px-6 border-t border-slate-100">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT: Image */}
        <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3] bg-slate-200">
          <img
            src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
            alt="Local business owner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT: Text */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6">
            Who This Works For
          </h2>
          <ul className="space-y-3 mb-7">
            {industries.map(item => (
              <li key={item} className="flex items-center gap-3 text-slate-700 text-base">
                <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-slate-500 leading-relaxed text-sm">
            Some need leads. Some need customers walking through the door.<br />
            The goal is the same: make it easier for people to find you and take the next step.
          </p>
        </div>

      </div>
    </section>
  );
}
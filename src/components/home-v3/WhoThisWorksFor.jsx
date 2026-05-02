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
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
            Real Work With Local Businesses
          </h2>
          <p className="text-slate-500 mb-5 leading-relaxed text-sm">
            I've worked with many types of businesses over the years, including service companies, restaurants, fitness businesses, and local trades.
          </p>
          <ul className="space-y-3 mb-6">
            {industries.map(item => (
              <li key={item} className="flex items-center gap-3 text-slate-700 text-base">
                <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-slate-500 leading-relaxed text-sm">
            Service businesses need calls and leads. Restaurants need customers walking in. Fitness businesses need members and inquiries.<br /><br />
            The goal is always the same: help people find you, understand you, and take action.
          </p>
          <a
            href="/our-work"
            className="inline-flex items-center gap-2 mt-6 border border-slate-300 hover:border-slate-400 text-slate-800 font-bold px-5 py-3 rounded-xl transition-colors text-sm"
          >
            See My Work
          </a>
        </div>

      </div>
    </section>
  );
}
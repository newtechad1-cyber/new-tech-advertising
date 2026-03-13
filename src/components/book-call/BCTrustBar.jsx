import React from 'react';

export default function BCTrustBar() {
  const stats = [
    { value: '300+', label: 'Businesses Trust NTA' },
    { value: '97%', label: 'Client Retention' },
    { value: '4.9★', label: 'Average Rating' },
    { value: '2.4M+', label: 'Content Published' },
  ];

  return (
    <section className="bg-gradient-to-r from-slate-900 to-slate-800 border-y border-slate-700/50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
              <p className="text-slate-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
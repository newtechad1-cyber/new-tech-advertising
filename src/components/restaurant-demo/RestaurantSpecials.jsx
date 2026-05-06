import React from 'react';

export default function RestaurantSpecials({ config }) {
  const { specials, primaryColor, name } = config;

  return (
    <section className="py-16 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: primaryColor }}>Deals & Events</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Weekly Specials</h2>
          <p className="text-slate-500 mt-2 text-sm">Always something worth coming back for at {name}.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {specials.map((special) => (
            <div key={special.title} className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all">
              <div className="text-3xl mb-3">{special.icon}</div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{special.day}</p>
              <h3 className="font-black text-slate-900 text-base mb-2">{special.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{special.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
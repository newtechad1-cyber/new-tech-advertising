import React from 'react';

export default function RestaurantAbout({ config }) {
  const { name, description, ownerName, ownerStory, ownerImage, city, state, primaryColor, heroImage } = config;

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="rounded-2xl overflow-hidden aspect-[4/3]">
            <img src={heroImage} alt={name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3">
              <img src={ownerImage} alt={ownerName} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-black text-slate-900 text-sm">{ownerName}</p>
                <p className="text-slate-500 text-xs">Owner, {name}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: primaryColor }}>Our Story</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
            Proudly Serving {city}, {state}
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">{description}</p>
          <p className="text-slate-500 italic text-sm leading-relaxed border-l-4 pl-4" style={{ borderColor: primaryColor }}>
            "{ownerStory}"
          </p>
          <p className="text-slate-400 text-xs mt-2">— {ownerName}</p>
        </div>
      </div>
    </section>
  );
}
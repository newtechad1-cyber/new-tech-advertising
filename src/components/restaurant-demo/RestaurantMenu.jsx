import React, { useState } from 'react';

export default function RestaurantMenu({ config }) {
  const { menuCategories, primaryColor, name } = config;
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="menu" className="py-16 px-6 bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: primaryColor }}>Explore Our Menu</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white">{name} Menu</h2>
          <p className="text-slate-400 mt-2 text-sm">No PDFs. Just easy browsing on any device.</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {menuCategories.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === i
                  ? 'text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
              style={activeTab === i ? { backgroundColor: primaryColor } : {}}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="space-y-3">
          {menuCategories[activeTab].items.map((item) => (
            <div key={item.name} className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-600 transition-colors">
              <div className="flex-1 pr-4">
                <h3 className="font-black text-white text-sm">{item.name}</h3>
                <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
              <span className="font-black text-base flex-shrink-0" style={{ color: primaryColor }}>{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
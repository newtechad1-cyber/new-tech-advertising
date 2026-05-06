import React from 'react';

export default function RestaurantFeaturedDishes({ config }) {
  const { featuredDishes, primaryColor } = config;

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: primaryColor }}>Menu Highlights</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Featured Dishes</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDishes.map((dish) => (
            <div key={dish.name} className="group rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="aspect-square relative overflow-hidden">
                <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {dish.badge && (
                  <div className="absolute top-3 left-3 text-white text-xs font-black px-2.5 py-1 rounded-full" style={{ backgroundColor: primaryColor }}>
                    {dish.badge}
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-black text-slate-900 text-sm leading-tight">{dish.name}</h3>
                  <span className="font-black text-slate-900 text-sm flex-shrink-0" style={{ color: primaryColor }}>{dish.price}</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">{dish.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
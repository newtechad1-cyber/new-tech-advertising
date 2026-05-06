import React from 'react';
import { Phone, MapPin, Clock, ShoppingBag, UtensilsCrossed } from 'lucide-react';

export default function RestaurantHero({ config }) {
  const { name, headline, subheadline, phone, heroImage, rating, reviewCount, hours, primaryColor, orderUrl, menuUrl, directionsUrl } = config;

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-end overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={heroImage} alt={name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-12 pt-32 w-full">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-white font-bold">{rating}</span>
          <span className="text-white/60 text-sm">({reviewCount} reviews)</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
          {headline}
        </h1>
        <p className="text-white/80 text-lg max-w-2xl mb-8 leading-relaxed">
          {subheadline}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <a href={menuUrl} className="flex items-center gap-2 bg-white text-slate-900 font-black px-6 py-3.5 rounded-xl hover:bg-slate-100 transition-colors text-sm">
            <UtensilsCrossed className="w-4 h-4" /> View Menu
          </a>
          <a href={orderUrl} className="flex items-center gap-2 text-white font-black px-6 py-3.5 rounded-xl transition-colors text-sm" style={{ backgroundColor: primaryColor }}>
            <ShoppingBag className="w-4 h-4" /> Order Online
          </a>
          <a href={`tel:${phone}`} className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white font-bold px-6 py-3.5 rounded-xl hover:bg-white/20 transition-colors text-sm">
            <Phone className="w-4 h-4" /> Call Now
          </a>
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white font-bold px-6 py-3.5 rounded-xl hover:bg-white/20 transition-colors text-sm">
            <MapPin className="w-4 h-4" /> Directions
          </a>
        </div>

        {/* Info bar */}
        <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{hours}</span>
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{config.address}</span>
        </div>
      </div>
    </section>
  );
}
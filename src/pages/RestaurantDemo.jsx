import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, MapPin, Phone, Clock, ExternalLink } from 'lucide-react';

const DEMOS = [
  {
    id: 'pizza',
    name: "Marco's Pizzeria",
    tagline: "Handcrafted Pizza. Local Ingredients. Built to Be Found.",
    cuisine: 'Pizza',
    city: 'Mason City, IA',
    color: 'from-red-700 to-orange-600',
    accent: 'bg-red-600',
    accentHover: 'hover:bg-red-500',
    textAccent: 'text-red-600',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop',
    logo: '🍕',
    path: '/restaurant-demo/pizza',
  },
  {
    id: 'mexican',
    name: "Casa Fuego",
    tagline: "Authentic Mexican Flavors. Modern Visibility. More Tables.",
    cuisine: 'Mexican',
    city: 'Clear Lake, IA',
    color: 'from-green-700 to-yellow-600',
    accent: 'bg-green-600',
    accentHover: 'hover:bg-green-500',
    textAccent: 'text-green-600',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop',
    logo: '🌮',
    path: '/restaurant-demo/mexican',
  },
  {
    id: 'bar',
    name: "The Iron Rail Bar & Grill",
    tagline: "Cold Drinks. Great Food. Always on Game Day.",
    cuisine: 'Bar & Grill',
    city: 'Garner, IA',
    color: 'from-slate-800 to-slate-600',
    accent: 'bg-amber-500',
    accentHover: 'hover:bg-amber-400',
    textAccent: 'text-amber-500',
    image: 'https://images.unsplash.com/photo-1554136575-791d2b8e8a4e?w=800&auto=format&fit=crop',
    logo: '🍺',
    path: '/restaurant-demo/bar',
  },
];

export default function RestaurantDemo() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">NTA Demo System</span>
            <h1 className="text-xl font-black text-white mt-2">Restaurant Visibility & Marketing Demos</h1>
            <p className="text-slate-400 text-sm mt-0.5">Click any demo to see a full restaurant marketing site</p>
          </div>
          <Link to="/" className="text-slate-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
            ← Back to NTA
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <p className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-3">NTA Restaurant Marketing System</p>
          <h2 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
            Turn Online Attention<br />Into Tables and Orders.
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Every local restaurant below is a live demo of the NTA Restaurant Visibility System — modern websites built for Google, AI search, voice search, and mobile customers.
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {DEMOS.map(demo => (
            <Link key={demo.id} to={demo.path} className="group block">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img src={demo.image} alt={demo.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{demo.logo}</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-white/60">{demo.cuisine}</span>
                    </div>
                    <h3 className="text-xl font-black text-white">{demo.name}</h3>
                    <p className="text-white/70 text-sm flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />{demo.city}
                    </p>
                  </div>
                </div>
                <div className="bg-slate-900 p-4">
                  <p className="text-slate-300 text-sm leading-relaxed mb-3">{demo.tagline}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <span className="text-blue-400 text-sm font-bold group-hover:gap-2 flex items-center gap-1 transition-all">
                      View Demo <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* What's included */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 mb-12">
          <h3 className="text-xl font-black text-white mb-6 text-center">Every Demo Includes the Full NTA Restaurant System</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '📱', label: 'Mobile-First Design', desc: 'Built for phones first' },
              { icon: '🔍', label: 'SEO + AI Visibility', desc: 'Google, voice & AI search' },
              { icon: '📸', label: 'Visual Food Content', desc: 'Scroll-stopping imagery' },
              { icon: '⭐', label: 'Review Integration', desc: 'Builds trust fast' },
              { icon: '📍', label: 'Local Search Optimized', desc: '"Near me" ready' },
              { icon: '🎬', label: 'Video-Ready', desc: 'Social & promo content' },
              { icon: '📋', label: 'Mobile Menu', desc: 'No PDFs, tab-based' },
              { icon: '🚀', label: 'Lead Generation', desc: 'Feeds your pipeline' },
            ].map(f => (
              <div key={f.label} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl">
                <span className="text-xl flex-shrink-0">{f.icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{f.label}</p>
                  <p className="text-slate-500 text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-slate-400 text-sm mb-4">Want this for your restaurant? Get a free visibility audit.</p>
          <Link to="/gap-audit" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-colors text-lg">
            Free Restaurant Visibility Audit <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
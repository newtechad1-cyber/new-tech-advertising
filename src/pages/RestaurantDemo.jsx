import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, MapPin, CheckCircle2 } from 'lucide-react';

const DEMOS = [
  {
    id: 'pizza',
    name: "Marco's Pizzeria",
    tagline: "Handcrafted Pizza. Local Ingredients. Built to Be Found.",
    cuisine: 'Pizza',
    city: 'Mason City, IA',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop',
    logo: '🍕',
    path: '/restaurant-demo/pizza',
    btnLabel: 'View Pizza Demo',
  },
  {
    id: 'mexican',
    name: "Casa Fuego",
    tagline: "Authentic Mexican Flavors. Modern Visibility. More Tables.",
    cuisine: 'Mexican',
    city: 'Clear Lake, IA',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop',
    logo: '🌮',
    path: '/restaurant-demo/mexican',
    btnLabel: 'View Mexican Demo',
  },
  {
    id: 'bar',
    name: "The Iron Rail Bar & Grill",
    tagline: "Cold Drinks. Great Food. Always on Game Day.",
    cuisine: 'Bar & Grill',
    city: 'Garner, IA',
    image: 'https://images.unsplash.com/photo-1554136575-791d2b8e8a4e?w=800&auto=format&fit=crop',
    logo: '🍺',
    path: '/restaurant-demo/bar',
    btnLabel: 'View Bar & Grill Demo',
  },
];

const WHAT_THIS_SHOWS = [
  'Modern visibility on Google, AI search, and voice search',
  'Mobile-first design built for how customers actually browse',
  'Easy online menus — no PDFs, no friction',
  'Featured dishes with real photography and pricing',
  'Weekly specials and promotions that drive repeat visits',
  'Animated review sections that build trust fast',
  'Social and video-ready layout for Instagram, TikTok, Facebook',
  'Sticky mobile action bar — Call, Order, Directions, Menu',
  'Local SEO structure and schema markup built in',
  'Lead capture tied directly to the NTA sales pipeline',
];

export default function RestaurantDemo() {
  useEffect(() => {
    document.title = 'Restaurant Visibility & Marketing Demo | NTA';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.setAttribute('content', 'See how NTA helps local restaurants get found online, show up in AI search, and turn more online attention into tables, orders, and repeat customers. View our live pizza, Mexican, and bar & grill demos.');
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">NTA Prospecting Demo</span>
            <h1 className="text-lg font-black text-white hidden sm:block">Restaurant Visibility System</h1>
          </div>
          <Link to="/" className="text-slate-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
            ← Back to NTA
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Hero messaging */}
        <div className="text-center mb-6">
          <p className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-3">NTA Restaurant Marketing System</p>
          <h2 className="text-4xl sm:text-5xl font-black mb-6 leading-tight">
            Turn Online Attention<br />Into Tables and Orders.
          </h2>
        </div>

        {/* Explanation section */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 mb-12 max-w-3xl mx-auto text-center">
          <p className="text-slate-200 text-lg leading-relaxed mb-4">
            These demos show how NTA helps local restaurants <strong className="text-white">get found</strong>, <strong className="text-white">get chosen</strong>, and turn online attention into <strong className="text-white">tables, orders, and repeat customers</strong>.
          </p>
          <p className="text-slate-400 leading-relaxed text-sm">
            Every demo below is a live example of the NTA Restaurant Visibility System — built for Google, AI search, voice search, and mobile-first customers. This is not a generic website template. It's a full marketing and conversion system.
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {DEMOS.map(demo => (
            <div key={demo.id} className="rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col">
              <Link to={demo.path} className="block group">
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
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <span className="text-blue-400 text-sm font-bold flex items-center gap-1">
                      Preview <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
              <div className="px-4 pb-4 bg-slate-900">
                <Link to={demo.path} className="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl transition-colors text-sm">
                  {demo.btnLabel}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Big CTA Buttons row */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          <Link to="/restaurant-demo/pizza" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black px-5 py-3 rounded-xl transition-colors text-sm">🍕 View Pizza Demo</Link>
          <Link to="/restaurant-demo/mexican" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-black px-5 py-3 rounded-xl transition-colors text-sm">🌮 View Mexican Demo</Link>
          <Link to="/restaurant-demo/bar" className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-black px-5 py-3 rounded-xl transition-colors text-sm">🍺 View Bar & Grill Demo</Link>
          <Link to="/gap-audit" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black px-5 py-3 rounded-xl transition-colors text-sm">📊 Request a Restaurant Visibility Audit <ChevronRight className="w-4 h-4" /></Link>
        </div>

        {/* What's included */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 mb-12">
          <h3 className="text-xl font-black text-white mb-2 text-center">What Every Demo Shows</h3>
          <p className="text-slate-400 text-sm text-center mb-8">This is the full NTA Restaurant Visibility System — not a template, a marketing machine.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {WHAT_THIS_SHOWS.map(item => (
              <div key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-slate-300 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-blue-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-black text-white mb-2">Ready to See How Your Restaurant Shows Up Online?</h3>
          <p className="text-blue-100 mb-6 text-sm leading-relaxed">We'll show you exactly what customers see when they search for your type of restaurant — and what's missing.</p>
          <Link to="/gap-audit" className="inline-flex items-center gap-2 bg-white text-blue-700 font-black px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors text-base">
            Request a Restaurant Visibility Audit <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
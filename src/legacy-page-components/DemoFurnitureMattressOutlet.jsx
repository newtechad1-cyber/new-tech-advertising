import React, { useEffect } from 'react';
import { Phone, MapPin, Star, Truck, Shield, Users, ChevronRight, CheckCircle, ArrowRight } from 'lucide-react';

const BOOKING_LINK = '/book-a-call';

const TRUST_POINTS = [
  { icon: MapPin, label: 'Local Service You Can Trust', desc: 'Proudly serving our community for years' },
  { icon: Star, label: 'Affordable Pricing', desc: 'Great furniture at prices that make sense' },
  { icon: Truck, label: 'Large Selection', desc: 'Hundreds of options for every room and style' },
  { icon: Users, label: 'Friendly, Helpful Support', desc: 'Real people ready to help you find the right fit' },
];

const CATEGORIES = [
  {
    name: 'Living Room',
    desc: 'Sofas, sectionals, recliners, entertainment centers and more.',
    color: 'from-slate-700 to-slate-900',
    emoji: '🛋️',
  },
  {
    name: 'Bedroom',
    desc: 'Beds, dressers, nightstands, and complete bedroom sets.',
    color: 'from-amber-700 to-amber-900',
    emoji: '🛏️',
  },
  {
    name: 'Mattresses',
    desc: 'Innerspring, memory foam, hybrid, and more — all sizes.',
    color: 'from-blue-700 to-blue-900',
    emoji: '💤',
  },
  {
    name: 'Dining Room',
    desc: 'Tables, chairs, buffets, and complete dining sets.',
    color: 'from-emerald-700 to-emerald-900',
    emoji: '🍽️',
  },
];

const WHY_US = [
  { title: 'Local & Independent', body: 'We\'re a local business, not a big box chain. That means more personal service and a genuine commitment to our community.' },
  { title: 'Helpful, Not Pushy', body: 'Our team is here to help you find the right piece at the right price — no pressure, no gimmicks.' },
  { title: 'Strong Selection', body: 'From living rooms to bedrooms, we carry a wide range of styles and price points to fit any home.' },
  { title: 'Easier Shopping Experience', body: 'We\'ve designed our showroom and selection to make furniture shopping clear, simple, and enjoyable.' },
];

export default function DemoFurnitureMattressOutlet() {
  useEffect(() => {
    document.title = 'Furniture & Mattress Outlet — Sample Redesign Preview';
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* NAV */}
      <nav className="bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-black text-sm">FM</div>
          <div>
            <p className="font-bold text-slate-900 text-sm leading-none">Furniture & Mattress Outlet</p>
            <p className="text-slate-400 text-xs mt-0.5">Quality furniture for every room</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#categories" className="hover:text-slate-900 transition-colors">Shop</a>
          <a href="#why-us" className="hover:text-slate-900 transition-colors">About</a>
          <a href="#contact" className="hover:text-slate-900 transition-colors">Contact</a>
        </div>
        <a href="tel:6414208816" className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
          <Phone className="w-3.5 h-3.5" /> Call Now
        </a>
      </nav>

      {/* DEMO BANNER */}
      <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 text-center">
        <p className="text-amber-800 text-xs font-semibold">
          ✨ This is a <strong>sample homepage redesign preview</strong> created by New Tech Advertising — <a href={BOOKING_LINK} className="underline hover:text-amber-900">book a call</a> to discuss your project.
        </p>
      </div>

      {/* HERO */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5">
              Your Local Furniture Store
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-5 leading-tight">
              Quality Furniture & Mattresses for Every Room in Your Home
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              Shop trusted brands, affordable prices, and a better local furniture buying experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#categories" className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg text-sm">
                Shop Our Selection <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#contact" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-7 py-3.5 rounded-xl transition-all text-sm">
                <MapPin className="w-4 h-4" /> Visit Our Store
              </a>
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-4">
            {['Living Room Sets from $599', 'Queen Mattresses from $299', 'Bedroom Sets from $799', 'Free Local Delivery Available'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3">
                <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span className="text-slate-200 text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="py-12 px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_POINTS.map((pt, i) => {
            const Icon = pt.icon;
            return (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-amber-600" />
                </div>
                <p className="font-bold text-slate-900 text-sm mb-1">{pt.label}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{pt.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">Shop by Category</h2>
            <p className="text-slate-500">Find exactly what you need for every room in your home.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CATEGORIES.map((cat, i) => (
              <div key={i} className={`relative bg-gradient-to-br ${cat.color} rounded-2xl p-8 text-white overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform`}>
                <div className="text-4xl mb-4">{cat.emoji}</div>
                <h3 className="text-xl font-black mb-2">{cat.name} Furniture</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">{cat.desc}</p>
                <div className="inline-flex items-center gap-1.5 text-white font-semibold text-sm">
                  Browse {cat.name} <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY SHOP WITH US */}
      <section id="why-us" className="py-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">Why Shop With Us</h2>
            <p className="text-slate-500 max-w-xl mx-auto">We're not just another furniture store. We're your local neighbors, committed to helping you find the right fit.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WHY_US.map((item, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMO CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-amber-500 to-amber-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
            Looking for Better Furniture at the Right Price?
          </h2>
          <p className="text-amber-100 text-lg leading-relaxed mb-10">
            Discover a more modern, customer-friendly shopping experience designed to help you find what you need faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="inline-flex items-center justify-center gap-2 bg-white hover:bg-amber-50 text-amber-700 font-bold px-8 py-4 rounded-xl transition-all text-sm shadow-lg">
              <MapPin className="w-4 h-4" /> Visit Our Store
            </a>
            <a href="tel:6414208816" className="inline-flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-bold px-8 py-4 rounded-xl transition-all text-sm">
              <Phone className="w-4 h-4" /> Call Now
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-slate-900 text-slate-400 py-14 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white font-black text-xs">FM</div>
              <span className="text-white font-bold text-sm">Furniture & Mattress Outlet</span>
            </div>
            <p className="text-sm leading-relaxed">Quality furniture and mattresses for every home and budget.</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-3 text-sm">Categories</p>
            <ul className="space-y-2 text-sm">
              {['Living Room', 'Bedroom', 'Mattresses', 'Dining Room'].map(c => (
                <li key={c}><a href="#categories" className="hover:text-white transition-colors">{c}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white font-semibold mb-3 text-sm">Contact & Visit</p>
            <ul className="space-y-2 text-sm">
              <li><a href="tel:6414208816" className="hover:text-white transition-colors flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> 641-420-8816</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Visit Our Store</a></li>
            </ul>
            <div className="mt-5">
              <a href={BOOKING_LINK} className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors">
                Book a Consultation
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} Furniture & Mattress Outlet. All rights reserved.</p>
          <p className="text-slate-600">Sample redesign by <a href="https://newtechadvertising.com" className="hover:text-slate-400 transition-colors">New Tech Advertising</a></p>
        </div>
      </footer>
    </div>
  );
}
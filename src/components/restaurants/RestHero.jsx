import React from 'react';
import { Phone } from 'lucide-react';

export default function RestHero() {
  const scrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-[#0B1120] text-white pt-24 pb-16 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium mb-8">
          🍽️ Built for Restaurants, Bars & Cafes
        </div>
        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
          Fill More Seats.<br/>
          <span className="text-amber-500">Stress Less Behind the Counter.</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Online ordering, menu management, and smart systems that help local restaurants get found, serve more customers, and stop losing money to third-party apps.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <button onClick={scrollToFeatures} className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-400 text-[#0B1120] font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            See What We Build ↓
          </button>
          <a href="tel:6414208816" className="inline-flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500 bg-slate-900/50 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-xl transition-all">
            <Phone className="w-5 h-5" />
            Call 641-420-8816
          </a>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-sm text-amber-500/80 font-medium">
          <span className="flex items-center gap-1.5">✓ No DoorDash commissions</span>
          <span className="hidden md:inline text-slate-700">-</span>
          <span className="flex items-center gap-1.5">✓ Your brand, your customers</span>
          <span className="hidden md:inline text-slate-700">-</span>
          <span className="flex items-center gap-1.5">✓ Setup in days</span>
        </div>
      </div>
    </section>
  );
}
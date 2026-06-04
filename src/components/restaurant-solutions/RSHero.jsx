import React from 'react';
import { Phone } from 'lucide-react';

export default function RSHero() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-[#0B1120] pt-20 pb-24 px-6 overflow-hidden relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#F59E0B]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B] text-sm font-medium mb-8">
          🍽️ Built for Restaurants, Bars & Cafes
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
          <span className="text-white block">Fill More Seats.</span>
          <span className="text-[#F59E0B] block mt-2">Stress Less Behind the Counter.</span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
          Online ordering, menu management, and smart systems that help local restaurants get found, serve more customers, and stop losing money to third-party apps.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button 
            onClick={() => scrollTo('features')}
            className="w-full sm:w-auto bg-[#F59E0B] hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          >
            See What We Build ↓
          </button>
          <a 
            href="tel:6414208816"
            className="w-full sm:w-auto flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500 bg-slate-900/50 text-white font-bold px-8 py-4 rounded-xl transition-all"
          >
            <Phone className="w-5 h-5" />
            Call 641-420-8816
          </a>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-sm font-medium text-slate-400">
          <span className="flex items-center gap-2"><span className="text-[#F59E0B]">✓</span> No DoorDash commissions</span>
          <span className="flex items-center gap-2"><span className="text-[#F59E0B]">✓</span> Your brand, your customers</span>
          <span className="flex items-center gap-2"><span className="text-[#F59E0B]">✓</span> Setup in days</span>
        </div>
      </div>
    </section>
  );
}
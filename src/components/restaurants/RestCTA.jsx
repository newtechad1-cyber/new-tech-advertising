import React from 'react';
import { Phone } from 'lucide-react';

export default function RestCTA() {
  return (
    <section id="cta" className="bg-[#0B1120] py-24 px-6 border-t border-slate-900 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
          Ready to Stop Giving Away Your Profits?
        </h2>
        <p className="text-slate-400 text-lg md:text-xl mb-10 leading-relaxed">
          Let's talk about what your restaurant needs. 15-minute call, no pitch deck, no pressure.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <a href="https://calendar.app.google/p6ieYanvwhixXxZ67" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-400 text-[#0B1120] font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            Let's Talk →
          </a>
          <a href="tel:6414208816" className="inline-flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500 bg-slate-900/50 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-xl transition-all">
            <Phone className="w-5 h-5" />
            Call 641-420-8816
          </a>
        </div>
        <p className="text-sm text-slate-500 font-medium">
          Mason City, Iowa - Serving restaurants across Iowa & Southern Minnesota
        </p>
      </div>
    </section>
  );
}
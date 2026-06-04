import React from 'react';
import { Phone, CheckCircle2 } from 'lucide-react';

export default function BOHero() {
  return (
    <section className="pt-24 pb-16 px-6 text-center max-w-5xl mx-auto">
      <div className="inline-flex items-center gap-2 bg-[#10B981]/10 text-[#10B981] px-4 py-1.5 rounded-full text-sm font-semibold mb-8 border border-[#10B981]/20">
        <span>🎉</span> Back-Office Solutions for Service Businesses
      </div>
      <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-white tracking-tight">
        Ditch the Spreadsheets.<br/>
        <span className="text-[#10B981]">Run Your Business From One Screen.</span>
      </h1>
      <p className="text-slate-400 text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed">
        Custom business software that replaces QuickBooks, paper dispatch, and disconnected tools. Built for HVAC, plumbing, and contractor businesses — by someone who actually understands the trade.
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
        <a href="https://johnson-backoffice-f202e3a3.viktor.space" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-[#10B981] hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-xl transition-colors text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20">
          See a Live Demo →
        </a>
        <a href="tel:6414208816" className="w-full sm:w-auto border border-slate-700 hover:border-slate-500 text-white font-bold px-8 py-4 rounded-xl transition-colors text-lg flex items-center justify-center gap-2 bg-slate-900/50">
          <Phone className="w-5 h-5 text-slate-400" /> Call 641-420-8816
        </a>
      </div>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-x-8 gap-y-4 text-slate-300 font-medium text-sm md:text-base">
        <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#10B981]"/> No monthly QuickBooks fees</div>
        <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#10B981]"/> Works on phone & tablet</div>
        <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#10B981]"/> Built in days, not months</div>
      </div>
    </section>
  );
}
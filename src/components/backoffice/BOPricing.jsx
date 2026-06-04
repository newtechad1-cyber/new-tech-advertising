import React from 'react';
import { X, Check } from 'lucide-react';

export default function BOPricing() {
  return (
    <section id="pricing" className="py-24 px-6 bg-[#0B1120] border-t border-slate-800 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#10B981]/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="text-[#E8613A] font-bold text-sm tracking-widest uppercase mb-3">THE MATH</p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Save Thousands. Simplify Everything.</h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            Real numbers from a real HVAC business in Mason City, Iowa.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">
          
          {/* VS Badge */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-slate-900 border border-slate-700 rounded-full items-center justify-center text-slate-300 font-black text-lg z-20 shadow-2xl">
            VS
          </div>

          {/* BEFORE CARD */}
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-8 opacity-80 shadow-lg">
            <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-6">
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                <X className="w-7 h-7" strokeWidth={3} />
              </div>
              <h3 className="text-lg md:text-xl font-black text-white">BEFORE <br/><span className="text-slate-500 text-sm font-bold tracking-widest uppercase">(TYPICAL SETUP)</span></h3>
            </div>
            <div className="space-y-5 mb-10 text-base md:text-lg">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">QuickBooks Online</span>
                <span className="text-red-400 font-bold">$90/mo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Dispatch software</span>
                <span className="text-red-400 font-bold">$150/mo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Invoicing add-on</span>
                <span className="text-red-400 font-bold">$40/mo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Inventory tracking</span>
                <span className="text-red-400 font-bold">$30/mo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Admin time <span className="text-sm">(5+ hrs/wk)</span></span>
                <span className="text-red-400 font-bold">Priceless</span>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-6 flex justify-between items-center">
              <span className="text-slate-300 font-medium text-lg">Annual Cost</span>
              <span className="text-2xl md:text-3xl font-black text-white">~$3,700+/yr</span>
            </div>
          </div>

          {/* AFTER CARD */}
          <div className="flex-1 bg-gradient-to-br from-slate-900 to-[#0B1120] border-2 border-[#10B981]/50 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.15)] md:scale-105 z-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/20 rounded-full blur-3xl"></div>
            <div className="flex items-center gap-4 mb-8 border-b border-[#10B981]/20 pb-6 relative z-10">
              <div className="w-12 h-12 bg-[#10B981] text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/40 shrink-0">
                <Check className="w-7 h-7" strokeWidth={3} />
              </div>
              <h3 className="text-lg md:text-xl font-black text-white">AFTER <br/><span className="text-[#10B981] text-sm font-bold tracking-widest uppercase">(NTA BACK-OFFICE)</span></h3>
            </div>
            <div className="space-y-5 mb-10 text-base md:text-lg relative z-10">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">Everything in one app</span>
                <span className="text-[#10B981] font-black">Included</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">Dispatch & scheduling</span>
                <span className="text-[#10B981] font-black">Included</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">Invoicing</span>
                <span className="text-[#10B981] font-black">Included</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">Inventory & expenses</span>
                <span className="text-[#10B981] font-black">Included</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">Admin time saved</span>
                <span className="text-[#10B981] font-black">5+ hrs/wk</span>
              </div>
            </div>
            <div className="border-t border-[#10B981]/20 pt-6 flex justify-between items-center relative z-10">
              <span className="text-slate-300 font-medium text-lg">Your Savings</span>
              <span className="text-2xl md:text-3xl font-black text-[#10B981]">$3,700+/yr</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-20 relative z-10">
          <p className="text-2xl md:text-4xl font-black text-white tracking-tight">
            That's <span className="text-[#10B981]">$300+</span> back in your pocket every month
          </p>
        </div>
      </div>
    </section>
  );
}
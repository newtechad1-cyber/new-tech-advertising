import React from 'react';

export default function BOMath() {
  return (
    <section className="py-24 px-6 bg-slate-950 overflow-hidden border-t border-slate-900">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#E8613A] font-bold text-sm tracking-widest uppercase mb-3">THE MATH</p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Save Thousands. Simplify Everything.</h2>
          <p className="text-slate-400 text-lg md:text-xl">
            Real numbers from a real HVAC business in Mason City, Iowa.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center relative">
          
          {/* VS Badge */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slate-950 border-4 border-slate-900 rounded-full items-center justify-center text-slate-400 font-black z-10 shadow-xl">
            VS
          </div>

          {/* Left Card - Before */}
          <div className="w-full md:w-1/2 bg-slate-900 border border-slate-800 rounded-3xl p-8 lg:p-10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-500/80"></div>
            <div className="text-red-400 font-black text-xl md:text-2xl mb-8 tracking-tight">❌ BEFORE (TYPICAL SETUP)</div>
            
            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                <span className="text-slate-300 font-medium">QuickBooks Online</span>
                <span className="text-slate-400 font-bold">$90/mo</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                <span className="text-slate-300 font-medium">Dispatch software</span>
                <span className="text-slate-400 font-bold">$150/mo</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                <span className="text-slate-300 font-medium">Invoicing add-on</span>
                <span className="text-slate-400 font-bold">$40/mo</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                <span className="text-slate-300 font-medium">Inventory tracking</span>
                <span className="text-slate-400 font-bold">$30/mo</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                <span className="text-slate-300 font-medium">Admin time (5+ hrs/wk)</span>
                <span className="text-slate-400 font-bold">Priceless</span>
              </div>
            </div>

            <div className="bg-red-500/10 rounded-xl p-6 text-center border border-red-500/20 mt-auto">
              <div className="text-red-400 font-black text-2xl tracking-tight">Annual Cost: ~$3,700+/yr</div>
            </div>
          </div>

          {/* Right Card - After */}
          <div className="w-full md:w-1/2 bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 lg:p-10 shadow-2xl shadow-emerald-900/20 relative overflow-hidden transform md:scale-105 z-0">
            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-[50px]"></div>
            
            <div className="text-emerald-400 font-black text-xl md:text-2xl mb-8 tracking-tight relative z-10">✅ AFTER (NTA BACK-OFFICE)</div>
            
            <div className="space-y-6 mb-10 relative z-10">
              <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                <span className="text-white font-bold">Everything in one app</span>
                <span className="text-emerald-400 font-bold">Included</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                <span className="text-slate-300 font-medium">Dispatch & scheduling</span>
                <span className="text-emerald-400 font-bold">Included</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                <span className="text-slate-300 font-medium">Invoicing</span>
                <span className="text-emerald-400 font-bold">Included</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                <span className="text-slate-300 font-medium">Inventory & expenses</span>
                <span className="text-emerald-400 font-bold">Included</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                <span className="text-slate-300 font-medium">Admin time saved</span>
                <span className="text-emerald-400 font-bold">5+ hrs/wk</span>
              </div>
            </div>

            <div className="bg-emerald-500/10 rounded-xl p-6 text-center border border-emerald-500/30 mt-auto relative z-10">
              <div className="text-emerald-400 font-black text-2xl tracking-tight">Your Savings: $3,700+/yr</div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-2xl md:text-4xl font-black text-white">
            That's <span className="text-emerald-400">$300+</span> back in your pocket every month
          </p>
        </div>
      </div>
    </section>
  );
}
import React from 'react';

export default function BOComparison() {
  return (
    <section className="py-24 px-6 bg-slate-950 border-b border-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950 pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <p className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-4">
            THE MATH
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Save Thousands. Simplify Everything.
          </h2>
          <p className="text-xl text-slate-400 leading-relaxed">
            Real numbers from a real HVAC business in Mason City, Iowa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 relative max-w-4xl mx-auto">
          
          {/* VS Badge */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-slate-900 border border-slate-800 rounded-full items-center justify-center text-slate-400 font-black text-lg z-20 shadow-2xl">
            VS
          </div>

          {/* Left Card - Before */}
          <div className="bg-slate-900/50 border border-red-500/20 rounded-3xl p-8 shadow-xl flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-500/20" />
            
            <h3 className="text-xl font-bold text-red-400 mb-8 flex items-center gap-2 uppercase tracking-wide">
              <span>❌</span> BEFORE (TYPICAL SETUP)
            </h3>
            
            <div className="space-y-6 flex-1">
              <div className="flex justify-between items-end border-b border-slate-800/50 pb-4">
                <span className="text-slate-300 font-medium">QuickBooks Online</span>
                <span className="text-slate-400">$90/mo</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800/50 pb-4">
                <span className="text-slate-300 font-medium">Dispatch software</span>
                <span className="text-slate-400">$150/mo</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800/50 pb-4">
                <span className="text-slate-300 font-medium">Invoicing add-on</span>
                <span className="text-slate-400">$40/mo</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800/50 pb-4">
                <span className="text-slate-300 font-medium">Inventory tracking</span>
                <span className="text-slate-400">$30/mo</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800/50 pb-4">
                <span className="text-slate-300 font-medium">Admin time (5+ hrs/wk)</span>
                <span className="text-slate-400 italic">Priceless</span>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="flex justify-between items-center text-red-400 font-black text-xl">
                <span>Annual Cost:</span>
                <span>~$3,700+/yr</span>
              </div>
            </div>
          </div>

          {/* Right Card - After */}
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl flex flex-col relative overflow-hidden transform md:scale-105 z-10">
            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
            
            <h3 className="text-xl font-bold text-emerald-400 mb-8 flex items-center gap-2 uppercase tracking-wide">
              <span>✅</span> AFTER (NTA BACK-OFFICE)
            </h3>
            
            <div className="space-y-6 flex-1">
              <div className="flex justify-between items-end border-b border-slate-800/50 pb-4">
                <span className="text-white font-medium">Everything in one app</span>
                <span className="text-emerald-500 font-bold">Included</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800/50 pb-4">
                <span className="text-white font-medium">Dispatch & scheduling</span>
                <span className="text-emerald-500 font-bold">Included</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800/50 pb-4">
                <span className="text-white font-medium">Invoicing</span>
                <span className="text-emerald-500 font-bold">Included</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800/50 pb-4">
                <span className="text-white font-medium">Inventory & expenses</span>
                <span className="text-emerald-500 font-bold">Included</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800/50 pb-4">
                <span className="text-white font-medium">Admin time saved</span>
                <span className="text-emerald-500 font-bold">5+ hrs/wk</span>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="flex justify-between items-center text-emerald-400 font-black text-2xl">
                <span>Your Savings:</span>
                <span>$3,700+/yr</span>
              </div>
            </div>
          </div>

        </div>

        <div className="text-center mt-16 max-w-3xl mx-auto">
          <p className="text-3xl md:text-4xl font-black text-white">
            That's <span className="text-emerald-500">$300+ back in your pocket</span> every month
          </p>
        </div>

      </div>
    </section>
  );
}
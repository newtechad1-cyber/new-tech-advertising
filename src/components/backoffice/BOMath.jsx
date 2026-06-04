import React from 'react';

export default function BOMath() {
  return (
    <section className="py-24 px-6 bg-slate-950 border-b border-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-3">
            THE MATH
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Save Thousands. Simplify Everything.
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto">
            Real numbers from a real HVAC business in Mason City, Iowa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 relative max-w-5xl mx-auto">
          {/* VS Badge */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-slate-900 border border-slate-800 rounded-full items-center justify-center text-slate-400 font-bold text-sm z-10 shadow-xl">
            VS
          </div>

          {/* Left Card - Before */}
          <div className="bg-slate-900/50 border border-red-500/20 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-red-500 mb-6 flex items-center gap-2">
              <span>❌</span> BEFORE (TYPICAL SETUP)
            </h3>
            <ul className="space-y-4 text-slate-300 mb-8">
              <li className="flex justify-between items-center border-b border-slate-800 pb-4">
                <span>QuickBooks Online:</span>
                <span className="font-semibold">$90/mo</span>
              </li>
              <li className="flex justify-between items-center border-b border-slate-800 pb-4">
                <span>Dispatch software:</span>
                <span className="font-semibold">$150/mo</span>
              </li>
              <li className="flex justify-between items-center border-b border-slate-800 pb-4">
                <span>Invoicing add-on:</span>
                <span className="font-semibold">$40/mo</span>
              </li>
              <li className="flex justify-between items-center border-b border-slate-800 pb-4">
                <span>Inventory tracking:</span>
                <span className="font-semibold">$30/mo</span>
              </li>
              <li className="flex justify-between items-center border-b border-slate-800 pb-4">
                <span>Admin time (5+ hrs/wk):</span>
                <span className="font-semibold text-slate-400 italic">Priceless</span>
              </li>
            </ul>
            <div className="pt-4 mt-auto">
              <p className="text-2xl font-black text-red-500 text-center">
                Annual Cost: ~$3,700+/yr
              </p>
            </div>
          </div>

          {/* Right Card - After */}
          <div className="bg-slate-900/50 border border-emerald-500/30 rounded-2xl p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500"></div>
            <h3 className="text-2xl font-bold text-emerald-500 mb-6 flex items-center gap-2">
              <span>✅</span> AFTER (NTA BACK-OFFICE)
            </h3>
            <ul className="space-y-4 text-slate-300 mb-8">
              <li className="flex justify-between items-center border-b border-slate-800 pb-4">
                <span>Everything in one app:</span>
                <span className="font-semibold text-emerald-400">Included</span>
              </li>
              <li className="flex justify-between items-center border-b border-slate-800 pb-4">
                <span>Dispatch & scheduling:</span>
                <span className="font-semibold text-emerald-400">Included</span>
              </li>
              <li className="flex justify-between items-center border-b border-slate-800 pb-4">
                <span>Invoicing:</span>
                <span className="font-semibold text-emerald-400">Included</span>
              </li>
              <li className="flex justify-between items-center border-b border-slate-800 pb-4">
                <span>Inventory & expenses:</span>
                <span className="font-semibold text-emerald-400">Included</span>
              </li>
              <li className="flex justify-between items-center border-b border-slate-800 pb-4">
                <span>Admin time saved:</span>
                <span className="font-semibold text-emerald-400">5+ hrs/wk</span>
              </li>
            </ul>
            <div className="pt-4 mt-auto">
              <p className="text-2xl font-black text-emerald-500 text-center">
                Your Savings: $3,700+/yr
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-2xl md:text-4xl font-bold text-white">
            That's <span className="text-emerald-500">$300+ back in your pocket</span> every month
          </p>
        </div>
      </div>
    </section>
  );
}
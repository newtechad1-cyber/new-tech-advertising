import React from 'react';
import { X, Check } from 'lucide-react';

export default function BackOfficeMath() {
  return (
    <section className="py-24 px-6 bg-slate-950 border-b border-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-4">
            THE MATH
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Save Thousands. Simplify Everything.
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Real numbers from a real HVAC business in Mason City, Iowa.
          </p>
        </div>

        <div className="relative grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* VS Badge */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slate-900 border-4 border-slate-950 rounded-full items-center justify-center text-slate-400 font-black text-xl z-10">
            VS
          </div>

          {/* Left Card - Before */}
          <div className="bg-slate-900/50 border border-red-500/20 rounded-3xl p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <X className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-red-400">BEFORE (TYPICAL SETUP)</h3>
            </div>

            <div className="space-y-4 mb-10">
              <div className="flex justify-between items-center text-slate-300">
                <span>QuickBooks Online:</span>
                <span className="font-medium">$90/mo</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Dispatch software:</span>
                <span className="font-medium">$150/mo</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Invoicing add-on:</span>
                <span className="font-medium">$40/mo</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Inventory tracking:</span>
                <span className="font-medium">$30/mo</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 pt-4 border-t border-slate-800/50">
                <span>Admin time (5+ hrs/wk):</span>
                <span className="font-medium text-slate-400 italic">Priceless</span>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
              <div className="text-red-400 font-bold text-2xl">
                Annual Cost: ~$3,700+/yr
              </div>
            </div>
          </div>

          {/* Right Card - After */}
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 lg:p-10 relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.1)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Check className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-emerald-400">AFTER (NTA BACK-OFFICE)</h3>
            </div>

            <div className="space-y-4 mb-10">
              <div className="flex justify-between items-center text-slate-300">
                <span>Everything in one app:</span>
                <span className="font-medium text-emerald-400">Included</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Dispatch & scheduling:</span>
                <span className="font-medium text-emerald-400">Included</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Invoicing:</span>
                <span className="font-medium text-emerald-400">Included</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Inventory & expenses:</span>
                <span className="font-medium text-emerald-400">Included</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 pt-4 border-t border-slate-800">
                <span>Admin time saved:</span>
                <span className="font-medium text-emerald-400">5+ hrs/wk</span>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center">
              <div className="text-emerald-400 font-bold text-2xl">
                Your Savings: $3,700+/yr
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-2xl md:text-3xl font-medium text-slate-300">
            That's <strong className="text-emerald-500 font-black">$300+</strong> back in your pocket every month
          </p>
        </div>
      </div>
    </section>
  );
}
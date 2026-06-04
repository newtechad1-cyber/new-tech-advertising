import React from 'react';

export default function BOCaseStudy() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto border-t border-slate-800">
      <div className="text-center mb-16">
        <p className="text-[#E8613A] font-bold text-sm tracking-widest uppercase mb-3">REAL RESULTS</p>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Built for Johnson Heating & AC</h2>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
          14-year HVAC business in Mason City. Needed to ditch QuickBooks and get organized — without the learning curve.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 md:p-14 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          {/* Left Column (Quote) */}
          <div className="flex flex-col h-full justify-center">
            <div className="text-6xl text-[#10B981]/20 font-serif leading-none mb-2">"</div>
            <p className="text-2xl md:text-3xl text-white font-medium leading-relaxed mb-10 tracking-tight">
              I wanted a local expert I could talk to directly. I didn't want to manage software or track analytics dashboards. I just needed something that works.
            </p>
            <div className="mt-auto">
              <div className="text-[#10B981] font-black text-xl mb-1 uppercase tracking-wider">Tony Johnson</div>
              <div className="text-slate-400 font-medium">Johnson Heating & AC, Mason City, IA</div>
            </div>
          </div>

          {/* Right Column (Stats) */}
          <div className="space-y-6">
            <div className="border border-[#10B981]/20 bg-[#10B981]/5 p-6 rounded-2xl hover:bg-[#10B981]/10 transition-colors">
              <div className="text-3xl md:text-4xl font-black text-[#10B981] mb-2 tracking-tight">~$4,500/yr</div>
              <div className="text-slate-300 font-medium text-lg leading-snug">Saved by replacing QuickBooks and other tools</div>
            </div>
            <div className="border border-[#10B981]/20 bg-[#10B981]/5 p-6 rounded-2xl hover:bg-[#10B981]/10 transition-colors">
              <div className="text-3xl md:text-4xl font-black text-[#10B981] mb-2 tracking-tight">7 Screens</div>
              <div className="text-slate-300 font-medium text-lg leading-snug">Dashboard, Customers, Dispatch, Invoicing, Expenses, Inventory, Field View</div>
            </div>
            <div className="border border-[#10B981]/20 bg-[#10B981]/5 p-6 rounded-2xl hover:bg-[#10B981]/10 transition-colors">
              <div className="text-3xl md:text-4xl font-black text-[#10B981] mb-2 tracking-tight">Days, Not Months</div>
              <div className="text-slate-300 font-medium text-lg leading-snug">Built, customized, and deployed with live demo data</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
import React from 'react';

export default function BOCaseStudySection() {
  return (
    <section className="py-24 px-6 bg-slate-950 border-b border-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-3">
            REAL RESULTS
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Built for Johnson Heating & AC
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto">
            14-year HVAC business in Mason City. Needed to ditch QuickBooks and get organized — without the learning curve.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Testimonial Quote */}
          <div className="bg-slate-900 rounded-2xl p-10 border border-slate-800 flex flex-col justify-center shadow-lg relative">
            <span className="text-6xl text-emerald-500/20 absolute top-6 left-6 leading-none font-serif">"</span>
            <p className="text-xl text-slate-300 leading-relaxed italic mb-8 relative z-10">
              I wanted a local expert I could talk to directly. I didn't want to manage software or track analytics dashboards. I just needed something that works.
            </p>
            <div className="mt-auto relative z-10">
              <p className="text-white font-bold text-lg">— Tony Johnson</p>
              <p className="text-emerald-500">Johnson Heating & AC, Mason City, IA</p>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="flex flex-col gap-4">
            <div className="bg-slate-900 rounded-2xl p-6 border border-emerald-500/30 flex flex-col justify-center shadow-sm">
              <h4 className="text-3xl font-black text-emerald-500 mb-2">~$4,500/yr</h4>
              <p className="text-slate-400">Saved by replacing QuickBooks and other tools</p>
            </div>
            
            <div className="bg-slate-900 rounded-2xl p-6 border border-emerald-500/30 flex flex-col justify-center shadow-sm">
              <h4 className="text-3xl font-black text-emerald-500 mb-2">7 Screens</h4>
              <p className="text-slate-400">Dashboard, Customers, Dispatch, Invoicing, Expenses, Inventory, Field View</p>
            </div>
            
            <div className="bg-slate-900 rounded-2xl p-6 border border-emerald-500/30 flex flex-col justify-center shadow-sm">
              <h4 className="text-3xl font-black text-emerald-500 mb-2">Days, Not Months</h4>
              <p className="text-slate-400">Built, customized, and deployed with live demo data</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
import React from 'react';
import { DollarSign, LayoutDashboard, Truck, FileText, CheckCircle2, TrendingUp, MonitorSmartphone } from 'lucide-react';

export default function BOCaseStudy() {
  return (
    <section className="py-24 px-6 bg-slate-950 border-b border-slate-900 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-950/20 pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-4">
            REAL RESULTS
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Built for Johnson Heating & AC
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            14-year HVAC business in Mason City. Needed to ditch QuickBooks and get organized — without the learning curve.
          </p>
        </div>

        {/* Case Study Grid */}
        <div className="grid md:grid-cols-12 gap-8 max-w-5xl mx-auto">
          
          {/* Testimonial Column (Left) */}
          <div className="md:col-span-5 flex flex-col justify-center bg-slate-900/50 border border-slate-800 rounded-3xl p-8 lg:p-10 shadow-xl relative overflow-hidden">
             {/* Quote styling */}
            <div className="absolute top-6 left-6 text-6xl text-slate-800/50 font-serif leading-none select-none">"</div>
            <div className="relative z-10">
              <p className="text-xl md:text-2xl text-slate-300 italic mb-8 leading-relaxed font-medium">
                I wanted a local expert I could talk to directly. I didn't want to manage software or track analytics dashboards. I just needed something that works.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                  <span className="text-xl font-bold text-slate-400">TJ</span>
                </div>
                <div>
                  <div className="text-white font-bold text-lg">Tony Johnson</div>
                  <div className="text-slate-400 text-sm">Johnson Heating & AC</div>
                  <div className="text-slate-500 text-xs mt-0.5">Mason City, IA</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Column (Right) */}
          <div className="md:col-span-7 grid gap-4">
            
            {/* Stat Card 1 */}
            <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-6 hover:bg-slate-900 transition-colors shadow-lg shadow-emerald-900/5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0 border border-emerald-500/20 mt-1">
                  <DollarSign className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <div className="text-3xl font-black text-emerald-500 mb-1">~$4,500/yr</div>
                  <p className="text-slate-300 text-lg font-medium mb-1">Saved by replacing QuickBooks and other tools</p>
                </div>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-6 hover:bg-slate-900 transition-colors shadow-lg shadow-emerald-900/5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0 border border-emerald-500/20 mt-1">
                  <MonitorSmartphone className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <div className="text-3xl font-black text-emerald-500 mb-1">7 Screens</div>
                  <p className="text-slate-300 text-lg font-medium mb-1">Dashboard, Customers, Dispatch, Invoicing, Expenses, Inventory, Field View</p>
                </div>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-6 hover:bg-slate-900 transition-colors shadow-lg shadow-emerald-900/5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0 border border-emerald-500/20 mt-1">
                  <TrendingUp className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <div className="text-3xl font-black text-emerald-500 mb-1">Days, Not Months</div>
                  <p className="text-slate-300 text-lg font-medium mb-1">Built, customized, and deployed with live demo data</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
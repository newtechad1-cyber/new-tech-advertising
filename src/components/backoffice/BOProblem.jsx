import React from 'react';

export default function BOProblem() {
  return (
    <section className="py-24 px-6 bg-slate-900 border-y border-slate-800">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <p className="text-[#E8613A] font-bold text-sm tracking-widest uppercase mb-3">THE PROBLEM</p>
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Service Businesses Shouldn't Need 5 Tools To Run</h2>
        <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Most HVAC, plumbing, and contractor businesses are duct-taping together tools that weren't built for them.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-[#0B1120] border border-slate-800 p-8 rounded-2xl hover:border-slate-700 transition-colors shadow-lg shadow-black/20">
          <div className="w-14 h-14 flex items-center justify-center bg-slate-800 rounded-2xl text-2xl mb-6 border border-slate-700">💸</div>
          <h3 className="text-xl font-bold text-white mb-4">Paying for Software You Hate</h3>
          <p className="text-slate-400 leading-relaxed">
            QuickBooks, ServiceTitan, Housecall Pro — $50 to $400+/month for tools that do way more (and way less) than what you actually need.
          </p>
        </div>
        
        <div className="bg-[#0B1120] border border-slate-800 p-8 rounded-2xl hover:border-slate-700 transition-colors shadow-lg shadow-black/20">
          <div className="w-14 h-14 flex items-center justify-center bg-slate-800 rounded-2xl text-2xl mb-6 border border-slate-700">📋</div>
          <h3 className="text-xl font-bold text-white mb-4">Dispatch by Whiteboard</h3>
          <p className="text-slate-400 leading-relaxed">
            Jobs tracked on paper, in texts, or in your head. Techs don't know what's next. Things fall through the cracks every week.
          </p>
        </div>
        
        <div className="bg-[#0B1120] border border-slate-800 p-8 rounded-2xl hover:border-slate-700 transition-colors shadow-lg shadow-black/20">
          <div className="w-14 h-14 flex items-center justify-center bg-slate-800 rounded-2xl text-2xl mb-6 border border-slate-700">⏰</div>
          <h3 className="text-xl font-bold text-white mb-4">Hours on Invoicing & Books</h3>
          <p className="text-slate-400 leading-relaxed">
            End-of-day data entry, chasing invoices, manually reconciling expenses. The admin work eats into the time you should be growing.
          </p>
        </div>
      </div>
    </section>
  );
}
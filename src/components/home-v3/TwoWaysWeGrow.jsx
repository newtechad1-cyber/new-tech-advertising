import React from 'react';
import { Link } from 'react-router-dom';

export default function TwoWaysWeGrow() {
  return (
    <section className="py-24 px-6 bg-slate-950 relative overflow-hidden border-b border-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <p className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-3">
            HOW CAN WE HELP?
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Two Ways We Grow Local Businesses
          </h2>
          <p className="text-slate-400 text-lg md:text-xl">
            Whether you need more customers walking through the door or a better system to manage them — we've got you covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 relative">
          {/* OR Badge */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-slate-900 border border-slate-800 rounded-full items-center justify-center text-slate-400 font-bold text-sm z-10 shadow-xl">
            OR
          </div>

          {/* Left Card */}
          <div className="group flex flex-col relative bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:bg-slate-900 transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-lg">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-blue-500"></div>
            
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
              <span className="text-2xl">📣</span>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">Get More Customers</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              AI-powered marketing systems that get your business found online, build trust with local customers, and turn clicks into calls.
            </p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {['Local SEO', 'AI Search Visibility', 'Website Rebuilds', 'Streaming TV', 'Social Content', 'Follow-Up Systems'].map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-slate-800/80 text-slate-300 text-sm rounded-lg border border-slate-700/50">
                  {tag}
                </span>
              ))}
            </div>
            
            <Link to="/services" className="mt-auto inline-flex items-center text-blue-400 font-bold hover:text-blue-300 transition-colors group-hover:gap-2">
              Explore Marketing Solutions <span className="ml-1 transition-all group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* Right Card */}
          <div className="group flex flex-col relative bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:bg-slate-900 transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-lg">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-[#10B981]"></div>
            
            <div className="w-14 h-14 bg-[#10B981]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#10B981]/20">
              <span className="text-2xl">💻</span>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">Run Your Business Smarter</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Custom business software that replaces QuickBooks, spreadsheets, and manual dispatch. Built specifically for service businesses.
            </p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {['Dispatch & Scheduling', 'Invoicing', 'Expense Tracking', 'Customer Management', 'Inventory', 'Field Mobile View'].map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-slate-800/80 text-slate-300 text-sm rounded-lg border border-slate-700/50">
                  {tag}
                </span>
              ))}
            </div>
            
            <Link to="/back-office-solutions" className="mt-auto inline-flex items-center text-[#10B981] font-bold hover:text-emerald-400 transition-colors group-hover:gap-2">
              See Back-Office Solutions <span className="ml-1 transition-all group-hover:translate-x-1">→</span>
            </Link>
          </div>

        </div>

        <div className="text-center mt-12">
          <p className="text-slate-400 text-lg">
            Many clients use <strong className="text-white">both</strong> — we build the complete system around your business.
          </p>
        </div>
      </div>
    </section>
  );
}
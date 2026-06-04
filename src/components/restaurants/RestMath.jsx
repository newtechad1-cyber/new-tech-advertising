import React from 'react';

export default function RestMath() {
  return (
    <section className="bg-[#0B1120] py-20 px-6 border-t border-slate-900">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-amber-500 text-sm font-bold uppercase tracking-widest mb-3">
          THE MATH
        </p>
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
          Keep More of What You Earn
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-16">
          Here's what third-party delivery apps actually cost a typical local restaurant.
        </p>

        <div className="relative grid md:grid-cols-2 gap-8 mb-12">
          {/* VS Badge */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-slate-800 rounded-full border-4 border-[#0B1120] flex items-center justify-center text-white font-black z-10 hidden md:flex">
            VS
          </div>

          {/* Left Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-red-500">✗</span> WITH THIRD-PARTY APPS
            </h3>
            <ul className="space-y-4 text-left flex-1">
              <li className="flex justify-between items-start text-slate-300">
                <span>DoorDash/Grubhub commission (20-30%)</span>
                <span className="text-red-500 font-semibold ml-4">-$1,500/mo</span>
              </li>
              <li className="flex justify-between items-start text-slate-300">
                <span>Lost repeat customers</span>
                <span className="text-red-500 font-semibold ml-4">Priceless</span>
              </li>
              <li className="flex justify-between items-start text-slate-300">
                <span>No customer data or emails</span>
                <span className="text-red-500 font-semibold ml-4">✗</span>
              </li>
              <li className="flex justify-between items-start text-slate-300">
                <span>Their branding, not yours</span>
                <span className="text-red-500 font-semibold ml-4">✗</span>
              </li>
              <li className="flex justify-between items-start text-slate-300">
                <span>You compete with every other restaurant</span>
                <span className="text-red-500 font-semibold ml-4">✗</span>
              </li>
            </ul>
            <div className="mt-8 pt-6 border-t border-slate-800 text-left">
              <div className="text-slate-400 text-sm mb-1">Annual Cost</div>
              <div className="text-red-500 font-bold text-2xl">~$18,000+/yr in commissions</div>
            </div>
          </div>

          {/* Right Card */}
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/5" />
            <div className="relative z-10 flex flex-col h-full">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-emerald-500">✓</span> WITH NTA
              </h3>
              <ul className="space-y-4 text-left flex-1">
                <li className="flex justify-between items-start text-slate-300">
                  <span>Online ordering</span>
                  <span className="text-emerald-400 font-semibold ml-4">0% commission</span>
                </li>
                <li className="flex justify-between items-start text-slate-300">
                  <span>You own every customer</span>
                  <span className="text-emerald-400 font-semibold ml-4">✓</span>
                </li>
                <li className="flex justify-between items-start text-slate-300">
                  <span>Customer emails and order history</span>
                  <span className="text-emerald-400 font-semibold ml-4">✓</span>
                </li>
                <li className="flex justify-between items-start text-slate-300">
                  <span>Your brand, your website</span>
                  <span className="text-emerald-400 font-semibold ml-4">✓</span>
                </li>
                <li className="flex justify-between items-start text-slate-300">
                  <span>AI visibility that sends customers to YOU</span>
                  <span className="text-emerald-400 font-semibold ml-4">✓</span>
                </li>
              </ul>
              <div className="mt-8 pt-6 border-t border-emerald-500/20 text-left">
                <div className="text-slate-400 text-sm mb-1">Your Savings</div>
                <div className="text-emerald-400 font-bold text-2xl">$18,000+/yr back in your pocket</div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          That's <span className="text-emerald-400 font-bold">$1,500/month</span> you're giving away to apps that put your competitor one swipe away.
        </p>
      </div>
    </section>
  );
}
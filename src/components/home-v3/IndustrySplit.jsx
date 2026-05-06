import React from 'react';
import { Wrench, Store } from 'lucide-react';

export default function IndustrySplit() {
  return (
    <section className="bg-white py-20 px-6 border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
            Who We Work With
          </h2>
          <p className="text-slate-500 leading-relaxed">
            Different businesses need different outcomes. We build systems around what actually matters for your type of business.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* LEFT: Service Businesses */}
          <div className="bg-slate-950 text-white rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-black">For Service Businesses</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-5">
              We help service businesses get more calls, estimates, and booked jobs — while building the local trust that makes customers choose you over a competitor they found online.
            </p>
            <ul className="space-y-2 mb-6">
              {['More inbound calls and estimate requests', 'Higher-converting website and local search presence', 'Content that shows your real work and builds credibility', 'Follow-up that keeps past customers coming back'].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <span className="text-blue-400 mt-0.5 flex-shrink-0">→</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              {['HVAC', 'Plumbing', 'Roofing', 'Contractors', 'Excavating', 'Electricians'].map(industry => (
                <span key={industry} className="bg-slate-800 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                  {industry}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT: Retail & Local Brands */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0">
                <Store className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-black text-slate-900">For Retail & Local Brands</h3>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-5">
              We help restaurants, fitness businesses, boutiques, and local retailers grow their visibility, bring in more foot traffic, and build the kind of community presence that drives repeat business.
            </p>
            <ul className="space-y-2 mb-6">
              {['Better visibility in local search and social feeds', 'Content that drives foot traffic and repeat visits', 'Campaigns that build community awareness', 'Consistent presence that keeps customers engaged'].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <span className="text-emerald-500 mt-0.5 flex-shrink-0">→</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              {['Restaurants', 'Fitness', 'Boutiques', 'Retail'].map(industry => (
                <span key={industry} className="bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                  {industry}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
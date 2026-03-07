import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight } from 'lucide-react';

const INDUSTRIES = [
  { label: 'HVAC & Home Services', emoji: '🔧', page: 'HvacMarketing', desc: 'Seasonal campaigns, local targeting, and review generation.' },
  { label: 'Restaurants & Food', emoji: '🍽️', page: 'RestaurantSocialMedia', desc: 'Daily specials, event promos, and mouth-watering content.' },
  { label: 'Service Trades', emoji: '⚡', page: 'IndustriesServiceTrades', desc: 'Plumbing, electrical, roofing — built for tradespeople.' },
  { label: 'Professionals', emoji: '💼', page: 'IndustriesProfessionals', desc: 'Attorneys, accountants, consultants — authority content.' },
  { label: 'Nonprofits', emoji: '❤️', page: 'IndustriesNonprofits', desc: 'Mission-driven storytelling and donor engagement.' },
  { label: 'Local Retail', emoji: '🏪', page: 'IndustriesHub', desc: 'Drive foot traffic and online sales for brick-and-mortar.' },
];

export default function HomeIndustries() {
  return (
    <section className="bg-slate-950 py-20 px-4 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Built for Your Industry</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">
            NTA knows your industry — not just marketing
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Content strategies and messaging templates built for specific industries, not generic templates.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {INDUSTRIES.map(ind => (
            <Link
              key={ind.label}
              to={createPageUrl(ind.page)}
              className="group bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 transition-all hover:bg-slate-800/70"
            >
              <div className="text-3xl mb-3">{ind.emoji}</div>
              <h3 className="text-white font-bold text-sm mb-1.5 group-hover:text-amber-300 transition-colors">{ind.label}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{ind.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to={createPageUrl('IndustriesHub')}
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold text-sm transition-colors"
          >
            See all industries <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
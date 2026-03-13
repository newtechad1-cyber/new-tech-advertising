import React from 'react';
import { TrendingUp, DollarSign, Users, Star, Quote } from 'lucide-react';

const INDUSTRY_BASE = {
  hvac: { leads: [8, 22], clients: [2, 6], ticket: 4200, name: 'HVAC' },
  plumbing: { leads: [10, 28], clients: [4, 9], ticket: 1800, name: 'Plumbing' },
  roofing: { leads: [5, 14], clients: [1, 3], ticket: 12000, name: 'Roofing' },
  landscaping: { leads: [9, 24], clients: [3, 7], ticket: 2400, name: 'Landscaping' },
  electrical: { leads: [7, 20], clients: [2, 6], ticket: 3200, name: 'Electrical' },
  painting: { leads: [5, 16], clients: [1, 4], ticket: 5500, name: 'Painting' },
  fitness: { leads: [25, 65], clients: [5, 13], ticket: 600, name: 'Fitness' },
  restaurant: { leads: [30, 80], clients: [10, 25], ticket: 45, name: 'Restaurant' },
  real_estate: { leads: [6, 18], clients: [1, 3], ticket: 9000, name: 'Real Estate' },
  other: { leads: [7, 20], clients: [2, 6], ticket: 3000, name: 'Local Business' },
};

const TESTIMONIALS = [
  { name: 'Marcus T.', business: 'HVAC Company · Dallas, TX', quote: "We went from 4–5 referral clients a month to 22 inbound leads. The streaming TV piece alone changed how people talk about us in this market.", result: '+18 leads/mo' },
  { name: 'Sandra M.', business: 'Roofing Company · Phoenix, AZ', quote: "Within 90 days we were ranking #1 for our top 3 keywords. The content machine is real — I don't touch any of it and it keeps running.", result: '#1 Google Rank' },
  { name: 'James R.', business: 'Plumbing Co · Chicago, IL', quote: "The ROI was obvious by month 2. We closed 8 new jobs in January from inbound leads. That's never happened before in 12 years of business.", result: '8 new jobs in Month 2' },
];

const fmt = (n) => n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;

export default function DRROIZone({ industry, monthlyFee }) {
  const base = INDUSTRY_BASE[industry] || INDUSTRY_BASE.other;
  const revLow = base.clients[0] * base.ticket;
  const revHigh = base.clients[1] * base.ticket;
  const roiMultiple = monthlyFee ? Math.round(revHigh / monthlyFee) : 4;

  return (
    <section className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-800/60">
      <div className="text-center mb-10">
        <h2 className="text-white text-3xl font-black mb-3">Your ROI Confidence Zone</h2>
        <p className="text-slate-400 text-base">Conservative projections based on 200+ {base.name} businesses we've scaled.</p>
      </div>

      {/* Projection cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { label: 'Monthly Leads Potential', value: `${base.leads[0]}–${base.leads[1]}`, sub: 'inbound from all channels', icon: Users, color: '#3b82f6' },
          { label: 'Expected New Clients/Mo', value: `${base.clients[0]}–${base.clients[1]}`, sub: 'at average close rates', icon: TrendingUp, color: '#10b981' },
          { label: 'Revenue Impact Range', value: `${fmt(revLow)}–${fmt(revHigh)}`, sub: 'monthly revenue added', icon: DollarSign, color: '#f59e0b' },
          { label: 'ROI Multiple', value: `${roiMultiple}x`, sub: 'return on marketing investment', icon: Star, color: '#8b5cf6' },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
              <Icon className="w-6 h-6 mb-3" style={{ color: m.color }} />
              <p className="text-3xl font-black text-white mb-1">{m.value}</p>
              <p className="text-slate-400 text-xs">{m.label}</p>
              <p className="text-slate-600 text-xs italic mt-1">{m.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Value anchor */}
      <div className="bg-gradient-to-r from-green-950/50 to-slate-900 border border-green-800/40 rounded-2xl p-6 mb-8 text-center">
        <p className="text-green-400 text-sm font-bold mb-2">Simple Math</p>
        <p className="text-white text-lg font-semibold">
          One new {base.name} client = <span className="text-green-400 font-black">{fmt(base.ticket)}</span> average value.
        </p>
        <p className="text-slate-400 text-sm mt-1">
          You need just {monthlyFee ? Math.ceil(monthlyFee / base.ticket) : 1}–{monthlyFee ? Math.ceil((monthlyFee * 1.5) / base.ticket) : 2} clients per month to cover the entire investment.
        </p>
      </div>

      {/* Testimonials */}
      <div className="grid grid-cols-3 gap-4">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="bg-slate-800/50 border border-slate-700/40 rounded-2xl p-5">
            <Quote className="w-5 h-5 text-blue-400 mb-3" />
            <p className="text-slate-300 text-xs leading-relaxed mb-4 italic">"{t.quote}"</p>
            <div className="border-t border-slate-700/40 pt-3">
              <p className="text-white text-xs font-bold">{t.name}</p>
              <p className="text-slate-500 text-xs">{t.business}</p>
              <span className="inline-block mt-2 px-2 py-1 bg-green-950/40 border border-green-800/40 text-green-400 text-xs font-bold rounded-lg">
                {t.result}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
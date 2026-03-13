import React from 'react';
import { TrendingUp, Users, DollarSign, Zap, BarChart2 } from 'lucide-react';

const TIER_MULTIPLIERS = { starter: 1.0, authority: 1.8, domination: 2.8 };
const INDUSTRY_BASE = {
  hvac: { leads_mo: 8, close_rate: 0.28, avg_ticket: 4200 },
  plumbing: { leads_mo: 12, close_rate: 0.35, avg_ticket: 1800 },
  roofing: { leads_mo: 5, close_rate: 0.22, avg_ticket: 12000 },
  landscaping: { leads_mo: 10, close_rate: 0.30, avg_ticket: 2400 },
  electrical: { leads_mo: 8, close_rate: 0.30, avg_ticket: 3200 },
  painting: { leads_mo: 6, close_rate: 0.25, avg_ticket: 5500 },
  fitness: { leads_mo: 30, close_rate: 0.20, avg_ticket: 600 },
  restaurant: { leads_mo: 40, close_rate: 0.12, avg_ticket: 45 },
  real_estate: { leads_mo: 8, close_rate: 0.18, avg_ticket: 9000 },
  other: { leads_mo: 8, close_rate: 0.25, avg_ticket: 3000 },
};

const MONTHS = [1, 3, 6, 12];

export default function ROIProjection({ selectedPackage, opportunity, pricing }) {
  const industry = opportunity?.industry || 'other';
  const base = INDUSTRY_BASE[industry] || INDUSTRY_BASE.other;
  const mult = TIER_MULTIPLIERS[selectedPackage] || 1;

  const leadsLow = Math.round(base.leads_mo * mult * 0.7);
  const leadsHigh = Math.round(base.leads_mo * mult * 1.3);
  const closedLow = Math.round(leadsLow * base.close_rate);
  const closedHigh = Math.round(leadsHigh * base.close_rate);
  const revLow = closedLow * base.avg_ticket;
  const revHigh = closedHigh * base.avg_ticket;
  const monthly = pricing.totalMonthly;
  const roiLow = Math.round(((revLow - monthly) / monthly) * 100);
  const roiHigh = Math.round(((revHigh - monthly) / monthly) * 100);

  const fmt = (n) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;

  const cumulativeRev = MONTHS.map(m => ({
    m,
    low: Math.round(revLow * m * 0.85),
    high: Math.round(revHigh * m),
    cost: Math.round(monthly * m + pricing.setup),
  }));

  const maxVal = cumulativeRev[cumulativeRev.length - 1].high;

  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">ROI Projection</p>

      {/* Key metrics */}
      <div className="space-y-2">
        {[
          { label: 'Monthly Leads Potential', value: `${leadsLow}–${leadsHigh}`, icon: Users, color: '#3b82f6' },
          { label: 'Expected New Clients/Mo', value: `${closedLow}–${closedHigh}`, icon: TrendingUp, color: '#10b981' },
          { label: 'Monthly Revenue Impact', value: `${fmt(revLow)}–${fmt(revHigh)}`, icon: DollarSign, color: '#f59e0b' },
          { label: 'First-Year ROI Estimate', value: `${roiLow}%–${roiHigh}%`, icon: BarChart2, color: '#8b5cf6' },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700/40 rounded-xl">
              <Icon className="w-4 h-4 flex-shrink-0" style={{ color: m.color }} />
              <span className="text-slate-400 text-xs flex-1">{m.label}</span>
              <span className="text-white font-bold text-sm">{m.value}</span>
            </div>
          );
        })}
      </div>

      {/* Revenue scenario chart */}
      <div className="bg-slate-800/50 border border-slate-700/40 rounded-2xl p-4">
        <p className="text-white font-semibold text-xs mb-4">Cumulative Revenue vs. Investment</p>
        <div className="space-y-3">
          {cumulativeRev.map(({ m, low, high, cost }) => (
            <div key={m}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-400 text-xs">Month {m}</span>
                <span className="text-xs text-slate-500">{fmt(low)}–{fmt(high)} revenue</span>
              </div>
              <div className="relative h-5 bg-slate-900 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-blue-900/60 rounded-full" style={{ width: `${(cost / maxVal) * 100}%` }} />
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-600 to-green-400 rounded-full opacity-80" style={{ width: `${(high / maxVal) * 100}%` }} />
                <div className="absolute inset-y-0 left-0 bg-green-500/40 rounded-full" style={{ width: `${(low / maxVal) * 100}%` }} />
              </div>
              <div className="flex gap-3 mt-0.5 text-xs text-slate-600">
                <span className="flex items-center gap-1"><span className="w-2 h-1 rounded bg-blue-700 inline-block" />Investment: {fmt(cost)}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-1 rounded bg-green-500 inline-block" />Revenue: {fmt(high)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Single client value anchor */}
      <div className="bg-gradient-to-br from-green-950/40 to-slate-900 border border-green-800/40 rounded-2xl p-4">
        <p className="text-green-400 font-bold text-xs mb-1 flex items-center gap-1.5"><Zap className="w-3 h-3" /> Value Anchor</p>
        <p className="text-white text-sm font-semibold">
          One new {industry.replace('_', ' ')} client = <span className="text-green-400">{fmt(base.avg_ticket)}</span>
        </p>
        <p className="text-slate-400 text-xs mt-1">
          The investment pays for itself in just {Math.ceil(monthly / base.avg_ticket)} new clients/month.
          At your close rate, that happens in the first weeks.
        </p>
      </div>

      {/* Visibility growth */}
      <div className="bg-slate-800/50 border border-slate-700/40 rounded-2xl p-4 space-y-2">
        <p className="text-white font-semibold text-xs mb-3">12-Month Visibility Growth</p>
        {[
          { label: 'Google Visibility Score', from: '12%', to: selectedPackage === 'domination' ? '95%' : selectedPackage === 'authority' ? '78%' : '54%' },
          { label: 'Online Review Volume', from: '8', to: selectedPackage === 'domination' ? '80+' : selectedPackage === 'authority' ? '50+' : '25+' },
          { label: 'Content Pieces Live', from: '0', to: selectedPackage === 'domination' ? '720+' : selectedPackage === 'authority' ? '420+' : '180+' },
        ].map((v, i) => (
          <div key={i} className="flex items-center gap-3 text-xs">
            <span className="text-slate-400 flex-1">{v.label}</span>
            <span className="text-red-400 font-medium">{v.from}</span>
            <span className="text-slate-600">→</span>
            <span className="text-green-400 font-bold">{v.to}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
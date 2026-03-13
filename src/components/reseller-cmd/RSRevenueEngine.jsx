import React, { useState } from 'react';
import { DollarSign, TrendingUp, BarChart2, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MOCK_REVENUE = [
  { name: 'Peak Media', gross: 28400, partnerPct: 20, deals: 12, trend: 18 },
  { name: 'Lone Star', gross: 19200, partnerPct: 22, deals: 8, trend: 31 },
  { name: 'Midwest Auth', gross: 41000, partnerPct: 18, deals: 19, trend: 8 },
  { name: 'NW Growth', gross: 9600, partnerPct: 20, deals: 5, trend: 45 },
];

const STATUS_CFG = {
  calculated: { color: '#94a3b8', label: 'Calculated' },
  approved:   { color: '#3b82f6', label: 'Approved' },
  paid:       { color: '#10b981', label: 'Paid' },
  disputed:   { color: '#ef4444', label: 'Disputed' },
};

const CHART_COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

export default function RSRevenueEngine({ records }) {
  const data = records?.length > 0
    ? records.map(r => ({ name: r.reseller_name?.split(' ')[0], gross: r.gross_revenue, partnerPct: r.partner_share_percent, deals: r.deal_count }))
    : MOCK_REVENUE;

  const totalGross = data.reduce((s, r) => s + r.gross, 0);
  const totalPartner = data.reduce((s, r) => s + (r.gross * (r.partnerPct / 100)), 0);
  const totalPlatform = totalGross - totalPartner;

  const chartData = data.map(r => ({
    name: r.name,
    platform: Math.round(r.gross * ((100 - r.partnerPct) / 100)),
    partner: Math.round(r.gross * (r.partnerPct / 100)),
  }));

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-400" />
          <h3 className="text-white font-bold text-sm">Revenue Share Engine</h3>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-blue-500" /><span className="text-slate-400">Platform</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-purple-500" /><span className="text-slate-400">Partner</span></div>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-0 border-b border-slate-800">
        {[
          { label: 'Total Gross MRR', value: `$${(totalGross / 1000).toFixed(1)}k`, color: '#94a3b8' },
          { label: 'Platform Revenue', value: `$${(totalPlatform / 1000).toFixed(1)}k`, color: '#3b82f6' },
          { label: 'Partner Payouts', value: `$${(totalPartner / 1000).toFixed(1)}k`, color: '#8b5cf6' },
        ].map((item, i) => (
          <div key={i} className={`px-5 py-4 ${i < 2 ? 'border-r border-slate-800' : ''}`}>
            <p className="text-slate-500 text-xs mb-1">{item.label}</p>
            <p className="font-black text-lg" style={{ color: item.color }}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="p-5 space-y-5">
        {/* Chart */}
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={20} barGap={4}>
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: '#e2e8f0' }}
                formatter={(v) => [`$${(v / 1000).toFixed(1)}k`, '']}
              />
              <Bar dataKey="platform" fill="#3b82f6" radius={[4, 4, 0, 0]} stackId="a" />
              <Bar dataKey="partner" fill="#8b5cf6" radius={[4, 4, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Per-reseller breakdown */}
        <div className="space-y-2">
          {data.map((r, i) => {
            const partnerAmt = Math.round(r.gross * (r.partnerPct / 100));
            const platformAmt = r.gross - partnerAmt;
            const annualProjection = r.gross * 12 * (1 + (r.trend || 10) / 100);
            return (
              <div key={i} className="p-3.5 bg-slate-800/30 border border-slate-700/30 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: CHART_COLORS[i] }} />
                    <span className="text-white text-xs font-bold">{r.name}</span>
                    <span className="text-slate-500 text-xs">{r.deals} deals · {r.partnerPct}% share</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-green-400 text-xs font-bold">
                    <TrendingUp className="w-3 h-3" />+{r.trend}% MoM
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div><p className="text-slate-600">Gross</p><p className="text-white font-bold">${(r.gross / 1000).toFixed(1)}k</p></div>
                  <div><p className="text-slate-600">Platform</p><p className="text-blue-400 font-bold">${(platformAmt / 1000).toFixed(1)}k</p></div>
                  <div><p className="text-slate-600">Partner Payout</p><p className="text-purple-400 font-bold">${(partnerAmt / 1000).toFixed(1)}k</p></div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-700/40 flex items-center gap-1.5 text-xs text-slate-500">
                  <BarChart2 className="w-3 h-3 text-slate-600" />
                  Projected annual contribution: <span className="text-green-400 font-bold">${(annualProjection / 1000).toFixed(0)}k</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
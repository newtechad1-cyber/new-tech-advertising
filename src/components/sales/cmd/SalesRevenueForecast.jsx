import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const STAGE_PROBABILITY = {
  new_lead: 5, contacted: 10, demo_scheduled: 25,
  proposal_sent: 40, negotiation: 65, closed_won: 100, closed_lost: 0,
};

const STAGE_COLORS = {
  new_lead: '#6b7280', contacted: '#3b82f6', demo_scheduled: '#a855f7',
  proposal_sent: '#f59e0b', negotiation: '#f97316', closed_won: '#22c55e',
};

export default function SalesRevenueForecast() {
  const { data: deals = [] } = useQuery({ queryKey: ['sc-pipeline-deals'], queryFn: () => base44.entities.SalesDeals.list('-created_date', 500) });
  const { data: subs = [] } = useQuery({ queryKey: ['sc-subs'], queryFn: () => base44.entities.ClientSubscriptions.filter({ status: 'active' }) });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const openDeals = deals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage));
  const pipelineValue = openDeals.reduce((s, d) => s + (d.deal_value || 0), 0);

  const weightedRevenue = openDeals.reduce((s, d) => {
    const prob = (d.probability ?? STAGE_PROBABILITY[d.stage] ?? 10) / 100;
    return s + (d.deal_value || 0) * prob;
  }, 0);

  const currentMRR = subs.reduce((s, sub) => s + (sub.monthly_amount || 0), 0);
  const newMRRMonth = subs.filter(s => new Date(s.created_date) >= startOfMonth).reduce((s, sub) => s + (sub.monthly_amount || 0), 0);
  const closedWon = deals.filter(d => d.stage === 'closed_won');
  const totalDealsWithBoth = deals.filter(d => ['closed_won', 'closed_lost'].includes(d.stage)).length;
  const avgCloseRate = totalDealsWithBoth > 0 ? Math.round((closedWon.length / totalDealsWithBoth) * 100) : 20;
  const projectedMRR = Math.round(pipelineValue * (avgCloseRate / 100));

  const stageData = Object.entries(
    openDeals.reduce((acc, d) => {
      acc[d.stage] = (acc[d.stage] || 0) + (d.deal_value || 0);
      return acc;
    }, {})
  ).map(([stage, value]) => ({ stage: stage.replace('_', ' '), key: stage, value }));

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="w-4 h-4 text-green-400" />
        <h2 className="text-sm font-bold text-white">Revenue Forecast</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">${Math.round(pipelineValue / 1000)}k</div>
          <div className="text-xs text-gray-500 mt-1">Pipeline Value</div>
          <div className="text-xs text-gray-600">{openDeals.length} open deals</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{avgCloseRate}%</div>
          <div className="text-xs text-gray-500 mt-1">Avg Close Rate</div>
          <div className="text-xs text-gray-600">historical</div>
        </div>
        <div className="bg-gray-800 border border-green-900 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">${Math.round(projectedMRR / 1000)}k</div>
          <div className="text-xs text-gray-500 mt-1">Projected MRR</div>
          <div className="text-xs text-gray-600">pipeline × close rate</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">${Math.round(weightedRevenue / 1000)}k</div>
          <div className="text-xs text-gray-500 mt-1">Weighted Revenue</div>
          <div className="text-xs text-gray-600">probability-adjusted</div>
        </div>
      </div>
      <div className="mb-5">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-800 rounded-lg p-3 text-center border border-gray-700">
            <div className="text-lg font-bold text-white">${currentMRR.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-0.5">Current MRR</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 text-center border border-gray-700">
            <div className="text-lg font-bold text-green-400">+${newMRRMonth.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-0.5">New MRR MTD</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 text-center border border-green-900">
            <div className="text-lg font-bold text-green-400">${(currentMRR + projectedMRR).toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-0.5">Projected Total MRR</div>
          </div>
        </div>
      </div>
      {stageData.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-3">Pipeline value by stage</p>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={stageData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="stage" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }} formatter={(v) => [`$${v.toLocaleString()}`, 'Value']} itemStyle={{ color: '#e5e7eb' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {stageData.map((entry) => <Cell key={entry.key} fill={STAGE_COLORS[entry.key] || '#6b7280'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
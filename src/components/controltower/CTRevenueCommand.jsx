import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, RefreshCw, Zap, ChevronRight } from 'lucide-react';

const DEAL_STAGE_COLORS = {
  prospect: 'bg-slate-700 text-slate-300',
  qualified: 'bg-blue-950 text-blue-300',
  proposal: 'bg-violet-950 text-violet-300',
  negotiation: 'bg-amber-950 text-amber-300',
  closed_won: 'bg-emerald-950 text-emerald-300',
  closed_lost: 'bg-red-950 text-red-300',
};

export default function CTRevenueCommand({ deals = [], forecasts = [] }) {
  const [selectedDeal, setSelectedDeal] = useState(null);

  const topDeals = [...deals]
    .filter(d => d.stage !== 'closed_lost')
    .sort((a, b) => (b.deal_value || 0) - (a.deal_value || 0))
    .slice(0, 10);

  const totalPipelineValue = topDeals.reduce((s, d) => s + (d.deal_value || 0), 0);
  const avgCloseProb = topDeals.length > 0
    ? Math.round(topDeals.reduce((s, d) => s + (d.close_probability || 0), 0) / topDeals.length)
    : 0;

  const chartData = forecasts.length > 0
    ? forecasts.map(f => ({ name: f.month_label, projected: f.projected_revenue, actual: f.actual_revenue }))
    : [
        { name: 'Oct', projected: 98000, actual: 94000 },
        { name: 'Nov', projected: 108000, actual: 105000 },
        { name: 'Dec', projected: 115000, actual: 112000 },
        { name: 'Jan', projected: 121000, actual: 119000 },
        { name: 'Feb', projected: 128000, actual: 124800 },
        { name: 'Mar', projected: 138000, actual: null },
        { name: 'Apr', projected: 149000, actual: null },
      ];

  const latestForecast = forecasts[0] || {};

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Revenue Command</h2>

      {/* Pipeline velocity stats */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Pipeline Value', value: `$${(totalPipelineValue / 1000).toFixed(0)}k`, icon: DollarSign, color: 'text-emerald-300' },
          { label: 'Avg Close Prob', value: `${avgCloseProb}%`, icon: TrendingUp, color: 'text-blue-300' },
          { label: 'Renewal Revenue', value: `$${((latestForecast.renewal_revenue || 48000) / 1000).toFixed(1)}k`, icon: RefreshCw, color: 'text-violet-300' },
          { label: 'Upsell Detected', value: latestForecast.upsell_opportunities || 12, icon: Zap, color: 'text-amber-300' },
        ].map(stat => (
          <Card key={stat.label} className="bg-slate-800/50 border-slate-700 p-3">
            <div className="flex items-center gap-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <div>
                <p className="text-xs text-slate-500">{stat.label}</p>
                <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Forecast chart */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Revenue Forecast</CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-3">
          <ResponsiveContainer width="100%" height={110}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }}
                formatter={(v) => v ? `$${(v / 1000).toFixed(0)}k` : 'TBD'}
              />
              <Area type="monotone" dataKey="projected" stroke="#8b5cf6" strokeWidth={2} fill="url(#projGrad)" strokeDasharray="4 2" />
              <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} fill="url(#actGrad)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 justify-center text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-violet-400 inline-block"></span> Projected</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-400 inline-block"></span> Actual</span>
          </div>
        </CardContent>
      </Card>

      {/* Top deals table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Top Open Deals</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {topDeals.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No open deals</p>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {topDeals.map((deal, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2 hover:bg-slate-700/30 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{deal.company_name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge className={`text-[10px] px-1.5 py-0 ${DEAL_STAGE_COLORS[deal.stage] || 'bg-slate-700 text-slate-300'}`}>
                        {deal.stage?.replace('_', ' ')}
                      </Badge>
                      <span className="text-[10px] text-slate-500">{deal.assigned_rep}</span>
                    </div>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-xs font-bold text-emerald-300">${((deal.deal_value || 0) / 1000).toFixed(0)}k</p>
                    <p className="text-[10px] text-slate-500">{deal.close_probability}%</p>
                  </div>
                  <Button size="sm" variant="ghost" className="ml-2 h-6 px-2 text-[10px] text-violet-400 opacity-0 group-hover:opacity-100">
                    Assist <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
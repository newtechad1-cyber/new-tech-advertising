import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, DollarSign, Zap } from 'lucide-react';

export default function SCForecastPanel({ forecasts = [], deals = [] }) {
  const monthlyData = forecasts.length > 0
    ? forecasts.map(f => ({ name: f.month_label, projected: f.projected_revenue, actual: f.actual_revenue }))
    : [
        { name: 'Oct', projected: 38000, actual: 35200 },
        { name: 'Nov', projected: 42000, actual: 41100 },
        { name: 'Dec', projected: 45000, actual: 44600 },
        { name: 'Jan', projected: 49000, actual: 47800 },
        { name: 'Feb', projected: 52000, actual: 48200 },
        { name: 'Mar', projected: 58000, actual: null },
        { name: 'Apr', projected: 64000, actual: null },
      ];

  const weeklyData = [
    { week: 'Wk1', revenue: 11400 }, { week: 'Wk2', revenue: 14200 }, { week: 'Wk3', revenue: 9800 },
    { week: 'Wk4', revenue: 16400 }, { week: 'Wk5', revenue: 13100 }, { week: 'Wk6', revenue: 18200 },
  ];

  const mrrGrowth = [
    { m: 'Sep', mrr: 94 }, { m: 'Oct', mrr: 102 }, { m: 'Nov', mrr: 109 },
    { m: 'Dec', mrr: 112 }, { m: 'Jan', mrr: 119 }, { m: 'Feb', mrr: 124 }, { m: 'Mar', mrr: 131 },
  ];

  const stalledDeals = deals.filter(d => d.stage === 'negotiation' && d.urgency !== 'hot').slice(0, 3);

  const insights = [
    { type: 'stall', icon: AlertTriangle, color: 'text-amber-400 bg-amber-950/30 border-amber-700/40', label: `${stalledDeals.length || 4} deals likely to stall`, desc: 'Negotiation stage with low urgency > 14 days' },
    { type: 'pricing', icon: DollarSign, color: 'text-violet-400 bg-violet-950/30 border-violet-700/40', label: 'Pricing optimization opportunity', desc: 'HVAC vertical 22% below avg deal size benchmark' },
    { type: 'demand', icon: Zap, color: 'text-emerald-400 bg-emerald-950/30 border-emerald-700/40', label: 'Restaurant vertical demand spike', desc: '+41% inbound from restaurant vertical this week' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Revenue Forecasting Panel</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 30-day forecast */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">30-Day Projection</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-3">
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="projG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="actG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }}
                  formatter={v => v ? `$${(v / 1000).toFixed(0)}k` : 'TBD'} />
                <Area type="monotone" dataKey="projected" stroke="#8b5cf6" strokeWidth={2} fill="url(#projG)" strokeDasharray="4 2" />
                <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} fill="url(#actG)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly pipeline */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">90-Day Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-3">
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={weeklyData} barSize={14}>
                <XAxis dataKey="week" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }}
                  formatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* MRR growth */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">MRR Growth Curve ($k)</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-3">
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={mrrGrowth}>
                <XAxis dataKey="m" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }}
                  formatter={v => `$${v}k`} />
                <Line type="monotone" dataKey="mrr" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {insights.map((ins, i) => (
          <div key={i} className={`border rounded-xl p-4 ${ins.color}`}>
            <div className="flex items-center gap-2 mb-2">
              <ins.icon className="w-4 h-4" />
              <p className="text-xs font-semibold text-white">{ins.label}</p>
            </div>
            <p className="text-[10px] text-slate-400">{ins.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const TOOLTIP_STYLE = { background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 11 };

const RANKING_DATA = [
  { client: 'Precision', change: 22, color: '#10b981' },
  { client: 'Arctic Air', change: 18, color: '#10b981' },
  { client: 'Citywide', change: 14, color: '#10b981' },
  { client: 'ProHeat', change: 12, color: '#10b981' },
  { client: 'Apex Law', change: 9, color: '#f59e0b' },
  { client: 'Mesa Grill', change: 6, color: '#f59e0b' },
  { client: 'Taco Loco', change: 4, color: '#f59e0b' },
  { client: 'Blue Ridge', change: -3, color: '#ef4444' },
  { client: 'CoolBreeze', change: -5, color: '#ef4444' },
];

const VISIBILITY_TREND = [
  { week: 'W1', now: 64, prior: 52 }, { week: 'W2', now: 67, prior: 54 }, { week: 'W3', now: 71, prior: 57 },
  { week: 'W4', now: 68, prior: 55 }, { week: 'W5', now: 74, prior: 58 }, { week: 'W6', now: 79, prior: 61 },
  { week: 'W7', now: 76, prior: 59 }, { week: 'W8', now: 83, prior: 63 },
];

const TOP_CONTENT = [
  { title: 'Arctic Air — 5 HVAC Tips', type: 'Article', views: 4820, rank: 2 },
  { title: 'Precision Plumbing — Emergency Guide', type: 'Article', views: 3610, rank: 3 },
  { title: 'Citywide Dental — New Patient FAQ', type: 'Landing Page', views: 2940, rank: 4 },
  { title: 'ProHeat — Spring Tune-Up Guide', type: 'Video', views: 2240, rank: 5 },
  { title: 'Apex Law — Estate Planning 101', type: 'Article', views: 1880, rank: 6 },
];

const BENCHMARKS = [
  { vertical: 'HVAC', avg_improvement: 14.2, top: 22 },
  { vertical: 'Restaurant', avg_improvement: 5.1, top: 9 },
  { vertical: 'Home Services', avg_improvement: 12.8, top: 22 },
  { vertical: 'Legal', avg_improvement: 7.4, top: 11 },
  { vertical: 'Dental', avg_improvement: 11.2, top: 14 },
];

export default function CPRankingAnalytics({ rankings = [] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Ranking & Visibility Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Keyword improvements */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Keyword Ranking Improvements by Client</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-3">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={RANKING_DATA} barSize={14} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="client" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={70} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <ReferenceLine x={0} stroke="#334155" />
                <Bar dataKey="change" radius={[0, 4, 4, 0]}
                  fill="#10b981"
                  label={{ position: 'right', fontSize: 9, fill: '#94a3b8', formatter: v => v > 0 ? `+${v}` : v }} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Visibility trend comparison */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2 pt-3 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Local Search Visibility Index</CardTitle>
              <div className="flex gap-3 text-[10px]">
                <span className="flex items-center gap-1 text-emerald-400"><span className="w-3 h-0.5 bg-emerald-400 inline-block" /> Current</span>
                <span className="flex items-center gap-1 text-slate-500"><span className="w-3 h-0.5 bg-slate-500 inline-block" /> Prior 30d</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2 pb-3">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={VISIBILITY_TREND}>
                <defs>
                  <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                </defs>
                <XAxis dataKey="week" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[40, 100]} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="prior" stroke="#475569" fill="none" strokeDasharray="4 4" strokeWidth={1.5} />
                <Area type="monotone" dataKey="now" stroke="#10b981" fill="url(#vg)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top content assets */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Top Performing Content Assets</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {TOP_CONTENT.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30">
                <span className="text-xs font-bold text-slate-500 w-4 text-center">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{item.title}</p>
                  <p className="text-[10px] text-slate-500">{item.type} · Rank #{item.rank}</p>
                </div>
                <span className="text-xs font-bold text-cyan-300">{item.views.toLocaleString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Vertical benchmarks */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Vertical Performance Benchmarks</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {BENCHMARKS.map((b, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-300">{b.vertical}</span>
                  <span className="text-[10px] text-slate-500">avg +{b.avg_improvement} · top +{b.top}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-700 rounded-full">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${(b.avg_improvement / 25) * 100}%` }} />
                  </div>
                  <div className="flex-1 h-2 bg-slate-700 rounded-full">
                    <div className="h-full bg-teal-400 rounded-full opacity-40" style={{ width: `${(b.top / 25) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
            <div className="flex gap-4 text-[10px] mt-2">
              <span className="flex items-center gap-1 text-emerald-400"><span className="w-3 h-2 bg-emerald-600 rounded inline-block" /> Avg</span>
              <span className="flex items-center gap-1 text-teal-300"><span className="w-3 h-2 bg-teal-400 rounded opacity-40 inline-block" /> Top</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
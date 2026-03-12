import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingDown, Zap } from 'lucide-react';

const WARNING_CONFIG = {
  nearing_capacity: { badge: 'bg-amber-950 text-amber-300', bar: 'bg-amber-500', icon: AlertTriangle, iconColor: 'text-amber-400' },
  bottleneck: { badge: 'bg-red-950 text-red-300', bar: 'bg-red-500', icon: AlertTriangle, iconColor: 'text-red-400' },
  underutilized: { badge: 'bg-blue-950 text-blue-300', bar: 'bg-blue-500', icon: TrendingDown, iconColor: 'text-blue-400' },
  normal: { badge: 'bg-emerald-950 text-emerald-300', bar: 'bg-emerald-500', icon: Zap, iconColor: 'text-emerald-400' },
};

const FALLBACK_CAPACITY = [
  { category: 'content_generation', current_load: 78, max_capacity: 100, utilization_pct: 78, queue_depth: 24, avg_processing_time_minutes: 4.1, warning_state: 'nearing_capacity', throughput_per_hour: 14 },
  { category: 'video_rendering', current_load: 96, max_capacity: 100, utilization_pct: 96, queue_depth: 18, avg_processing_time_minutes: 11.4, warning_state: 'bottleneck', throughput_per_hour: 5 },
  { category: 'approvals', current_load: 42, max_capacity: 100, utilization_pct: 42, queue_depth: 11, avg_processing_time_minutes: 28, warning_state: 'normal', throughput_per_hour: 2 },
  { category: 'publishing', current_load: 31, max_capacity: 100, utilization_pct: 31, queue_depth: 8, avg_processing_time_minutes: 2.2, warning_state: 'underutilized', throughput_per_hour: 22 },
];

const BY_CLIENT = [
  { client: 'Arctic Air', jobs: 84 }, { client: 'Precision', jobs: 71 }, { client: 'ProHeat', jobs: 62 },
  { client: 'Mesa Grill', jobs: 44 }, { client: 'Apex Law', jobs: 38 }, { client: 'Blue Ridge', jobs: 22 },
];
const BY_VERTICAL = [
  { vertical: 'HVAC', count: 188 }, { vertical: 'Home Svc', count: 142 }, { vertical: 'Restaurant', count: 96 },
  { vertical: 'Legal', count: 64 }, { vertical: 'Dental', count: 48 }, { vertical: 'Roofing', count: 36 },
];
const BY_TYPE = [
  { type: 'Social Post', count: 318 }, { type: 'Article', count: 142 }, { type: 'Video', count: 84 },
  { type: 'GBP Post', count: 96 }, { type: 'Email', count: 44 }, { type: 'Ad', count: 38 },
];
const TOOLTIP_STYLE = { background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 11 };

export default function OPSCapacityAnalytics({ capacityMetrics = [] }) {
  const data = capacityMetrics.length > 0 ? capacityMetrics : FALLBACK_CAPACITY;
  const bottlenecks = data.filter(m => ['bottleneck', 'nearing_capacity'].includes(m.warning_state));

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Production Throughput & Capacity Analytics</h2>

      {/* Capacity bars */}
      {bottlenecks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {bottlenecks.map((m, i) => {
            const cfg = WARNING_CONFIG[m.warning_state];
            return (
              <div key={i} className={`border rounded-xl p-3 bg-slate-800/50 ${cfg.badge.includes('red') ? 'border-red-700/40' : 'border-amber-700/40'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <cfg.icon className={`w-4 h-4 ${cfg.iconColor}`} />
                  <p className="text-xs font-semibold text-white capitalize">{m.category.replace(/_/g, ' ')} — {m.warning_state.replace(/_/g, ' ')}</p>
                  <Badge className={`text-[9px] px-1.5 ml-auto ${cfg.badge}`}>{m.utilization_pct}%</Badge>
                </div>
                <div className="h-2 bg-slate-700 rounded-full">
                  <div className={`h-full rounded-full ${cfg.bar}`} style={{ width: `${m.utilization_pct}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Queue: {m.queue_depth} · Avg: {m.avg_processing_time_minutes}m · {m.throughput_per_hour}/hr</p>
              </div>
            );
          })}
        </div>
      )}

      {/* All capacity */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {data.map((m, i) => {
          const cfg = WARNING_CONFIG[m.warning_state] || WARNING_CONFIG.normal;
          return (
            <Card key={i} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-3">
                <p className="text-[10px] text-slate-500 capitalize mb-1">{m.category.replace(/_/g, ' ')}</p>
                <div className="flex items-end justify-between mb-1">
                  <p className="text-2xl font-bold text-white">{m.utilization_pct}%</p>
                  <Badge className={`text-[8px] px-1 ${cfg.badge}`}>{m.warning_state.replace(/_/g, ' ')}</Badge>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full">
                  <div className={`h-full rounded-full ${cfg.bar}`} style={{ width: `${m.utilization_pct}%` }} />
                </div>
                <p className="text-[10px] text-slate-600 mt-1">Queue: {m.queue_depth} · {m.throughput_per_hour}/hr</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          { title: 'By Client', data: BY_CLIENT, key: 'jobs', nameKey: 'client', color: '#f97316' },
          { title: 'By Vertical', data: BY_VERTICAL, key: 'count', nameKey: 'vertical', color: '#8b5cf6' },
          { title: 'By Content Type', data: BY_TYPE, key: 'count', nameKey: 'type', color: '#06b6d4' },
        ].map(chart => (
          <Card key={chart.title} className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Output {chart.title}</CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-3">
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={chart.data} barSize={12} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey={chart.nameKey} tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} width={60} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey={chart.key} fill={chart.color} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
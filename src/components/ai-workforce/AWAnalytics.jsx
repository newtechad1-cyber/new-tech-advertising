import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

const TYPE_COLORS = {
  content_writer: '#3b82f6', social_publisher: '#8b5cf6', seo_optimizer: '#10b981',
  video_producer: '#f59e0b', review_monitor: '#06b6d4', ranking_tracker: '#ec4899',
};

export default function AWAnalytics({ agents }) {
  const byType = {};
  agents.forEach(a => {
    if (!byType[a.agent_type]) byType[a.agent_type] = { type: a.agent_type, count: 0, avgSpeed: 0, avgSuccess: 0, avgImpact: 0 };
    byType[a.agent_type].count++;
    byType[a.agent_type].avgSuccess += a.success_rate || 0;
    byType[a.agent_type].avgImpact += a.impact_score || 0;
    byType[a.agent_type].avgSpeed += a.avg_completion_seconds || 0;
  });

  const chartData = Object.values(byType).map(r => ({
    name: r.type.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()).slice(0, 10),
    fullType: r.type,
    success: r.count ? Math.round(r.avgSuccess / r.count) : 0,
    impact: r.count ? Math.round(r.avgImpact / r.count) : 0,
    speed: r.count ? Math.round(r.avgSpeed / r.count) : 0,
    count: r.count,
  }));

  // Mock if no data
  const data = chartData.length > 0 ? chartData : [
    { name: 'Content', fullType: 'content_writer', success: 97, impact: 84, count: 5 },
    { name: 'Social', fullType: 'social_publisher', success: 99, impact: 78, count: 8 },
    { name: 'SEO', fullType: 'seo_optimizer', success: 94, impact: 91, count: 4 },
    { name: 'Video', fullType: 'video_producer', success: 89, impact: 95, count: 2 },
    { name: 'Review', fullType: 'review_monitor', success: 98, impact: 72, count: 3 },
    { name: 'Ranking', fullType: 'ranking_tracker', success: 95, impact: 88, count: 2 },
  ];

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-green-400" />
        <h3 className="text-white font-bold text-sm">Agent Performance Analytics</h3>
      </div>
      <div className="p-5 grid grid-cols-2 gap-5">
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-3">Success Rate by Agent Type</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barSize={16}>
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 11 }}
                  formatter={(v) => [`${v}%`, 'Success Rate']}
                />
                <Bar dataKey="success" radius={[4, 4, 0, 0]}>
                  {data.map((d, i) => (
                    <Cell key={i} fill={TYPE_COLORS[d.fullType] || '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-3">Impact Score by Agent Type</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barSize={16}>
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 11 }}
                  formatter={(v) => [`${v}`, 'Impact Score']}
                />
                <Bar dataKey="impact" radius={[4, 4, 0, 0]}>
                  {data.map((d, i) => (
                    <Cell key={i} fill={TYPE_COLORS[d.fullType] || '#10b981'} opacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agent perf cards */}
        <div className="col-span-2 grid grid-cols-3 gap-3">
          {data.map((d, i) => (
            <div key={i} className="p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ background: TYPE_COLORS[d.fullType] || '#64748b' }} />
                <p className="text-white text-xs font-bold">{d.name}</p>
                <span className="text-slate-600 text-xs ml-auto">{d.count} agents</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><p className="text-slate-600">Success</p><p className="text-green-400 font-bold">{d.success}%</p></div>
                <div><p className="text-slate-600">Impact</p><p className="text-cyan-400 font-bold">{d.impact}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
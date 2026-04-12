import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const FUNNEL_STAGES = ['Awareness', 'Consideration', 'Demo', 'Close', 'Retention'];
const POSTED_STATUSES = ['Not Created', 'Created', 'Posted'];
const BAR_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export default function NTAAnalytics() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.NTAContent.list('-created_date', 500).then(d => { setItems(d); setLoading(false); });
  }, []);

  const byFunnel = FUNNEL_STAGES.map(s => ({ name: s, count: items.filter(i => i.funnel_stage === s).length }));
  const byStatus = POSTED_STATUSES.map(s => ({ name: s, count: items.filter(i => i.posted_status === s).length }));
  const outreachCount = items.filter(i => i.outreach_compatible).length;
  const demoCount = items.filter(i => i.demo_compatible).length;
  const usedOutreach = items.filter(i => i.used_in_outreach).length;
  const usedDemo = items.filter(i => i.used_in_demo).length;

  // Bottleneck: most items stuck in which script status
  const scriptStatusCounts = ['Idea', 'Script Ready', 'In Production', 'Complete'].map(s => ({
    name: s, count: items.filter(i => i.script_status === s).length,
  }));

  const STAT_CARDS = [
    { label: 'Not Created', value: items.filter(i => i.posted_status === 'Not Created').length, color: 'text-slate-300' },
    { label: 'Created', value: items.filter(i => i.posted_status === 'Created').length, color: 'text-amber-400' },
    { label: 'Posted', value: items.filter(i => i.posted_status === 'Posted').length, color: 'text-emerald-400' },
    { label: 'Used in Outreach', value: usedOutreach, color: 'text-sky-400' },
    { label: 'Used in Demo', value: usedDemo, color: 'text-pink-400' },
    { label: 'Outreach Ready', value: outreachCount, color: 'text-blue-400' },
    { label: 'Demo Ready', value: demoCount, color: 'text-violet-400' },
  ];

  if (loading) return <div className="p-6 flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" /></div>;

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-6">
      <h1 className="text-xl font-black text-white">Analytics</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {STAT_CARDS.map(({ label, value, color }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-slate-500 text-xs mt-1 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Funnel Stage */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm font-bold text-white mb-4">Content by Funnel Stage</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byFunnel} margin={{ left: -20 }}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {byFunnel.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Production Bottleneck */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm font-bold text-white mb-4">Production Bottleneck</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={scriptStatusCounts} margin={{ left: -20 }}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff' }} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Posted vs Not */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm font-bold text-white mb-4">Posted vs Not Posted</p>
          <div className="flex gap-4 items-center">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={byStatus} dataKey="count" cx="50%" cy="50%" outerRadius={65} innerRadius={40}>
                  {byStatus.map((_, i) => <Cell key={i} fill={['#475569', '#f59e0b', '#10b981'][i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {byStatus.map((s, i) => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: ['#475569', '#f59e0b', '#10b981'][i] }} />
                  <span className="text-xs text-slate-300">{s.name}: <strong>{s.count}</strong></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Outreach / Demo stats */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm font-bold text-white mb-4">Reuse Potential</p>
          <div className="space-y-3">
            {[
              { label: 'Outreach Compatible', value: outreachCount, total: items.length, color: 'bg-sky-500' },
              { label: 'Demo Compatible', value: demoCount, total: items.length, color: 'bg-pink-500' },
              { label: 'Used in Outreach', value: usedOutreach, total: outreachCount || 1, color: 'bg-blue-500' },
              { label: 'Used in Demo Pages', value: usedDemo, total: demoCount || 1, color: 'bg-violet-500' },
            ].map(({ label, value, total, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs text-slate-400 mb-1"><span>{label}</span><span>{value} / {total}</span></div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${total ? Math.round(value / total * 100) : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
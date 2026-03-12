import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import {
  TrendingUp, Zap, Target, Eye, BarChart2, Flag,
  ChevronUp, ChevronDown, ChevronsUpDown, CalendarRange
} from 'lucide-react';

const VERTICAL_COLORS = { HVAC: '#6366f1', Restaurant: '#f59e0b', Plumbing: '#10b981' };
const TYPE_COLORS = { seasonal: '#f59e0b', authority: '#6366f1', promotion: '#ec4899', video: '#14b8a6', visibility: '#8b5cf6' };
const TYPE_LABELS = { seasonal: 'Seasonal', authority: 'Authority', promotion: 'Promotion', video: 'Video', visibility: 'Visibility' };

function scoreColor(n) {
  if (n >= 70) return 'bg-emerald-500';
  if (n >= 40) return 'bg-amber-400';
  return 'bg-rose-500';
}
function scoreText(n) {
  if (n >= 70) return 'text-emerald-400';
  if (n >= 40) return 'text-amber-400';
  return 'text-rose-400';
}

function ScoreBar({ value }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <div className={`h-full rounded-full ${scoreColor(value)}`} style={{ width: `${value}%` }} />
      </div>
      <span className={`text-xs font-bold w-6 text-right ${scoreText(value)}`}>{value}</span>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-slate-300">{p.name}:</span>
          <span className="text-white font-bold">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function avg(arr, key) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((s, r) => s + (r[key] || 0), 0) / arr.length);
}

export default function AdminVerticalCampaigns() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterVertical, setFilterVertical] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [sortKey, setSortKey] = useState('overall_success_score');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    base44.entities.VerticalCampaignMetric.list('-overall_success_score', 100).then(d => {
      setData(d);
      setLoading(false);
    });
  }, []);

  const verticals = ['All', ...Object.keys(VERTICAL_COLORS)];
  const types = ['All', ...Object.keys(TYPE_LABELS)];

  const filtered = data.filter(r =>
    (filterVertical === 'All' || r.vertical === filterVertical) &&
    (filterType === 'All' || r.campaign_type === filterType)
  );

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey] ?? '';
    const bv = b[sortKey] ?? '';
    return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
  });

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  function SortIcon({ k }) {
    if (sortKey !== k) return <ChevronsUpDown className="w-3 h-3 text-slate-600" />;
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-violet-400" /> : <ChevronDown className="w-3 h-3 text-violet-400" />;
  }

  // KPIs
  const best = [...data].sort((a, b) => b.overall_success_score - a.overall_success_score)[0];
  const visLeader = [...data].sort((a, b) => b.visibility_impact_score - a.visibility_impact_score)[0];

  // Section 3 — grouped by vertical
  const chartData = Object.keys(VERTICAL_COLORS).map(v => {
    const rows = data.filter(r => r.vertical === v);
    return { vertical: v, Engagement: avg(rows, 'engagement_score'), Visibility: avg(rows, 'visibility_impact_score'), 'Lead Signal': avg(rows, 'lead_signal_strength') };
  });

  // Section 4 — grouped by type
  const typeGrid = Object.keys(TYPE_LABELS).map(t => {
    const rows = data.filter(r => r.campaign_type === t);
    const strongestV = Object.keys(VERTICAL_COLORS).reduce((best, v) => {
      const vRows = rows.filter(r => r.vertical === v);
      const vAvg = avg(vRows, 'overall_success_score');
      return vAvg > best.score ? { v, score: vAvg } : best;
    }, { v: '—', score: 0 });
    return { type: t, count: rows.length, avgScore: avg(rows, 'overall_success_score'), strongestVertical: strongestV.v };
  });

  // Section 5 — insights
  const insights = [];
  const hvacVideo = avg(data.filter(r => r.vertical === 'HVAC' && r.campaign_type === 'video'), 'overall_success_score');
  const hvacAuth = avg(data.filter(r => r.vertical === 'HVAC' && r.campaign_type === 'authority'), 'overall_success_score');
  if (hvacVideo > hvacAuth && hvacVideo > 0) insights.push({ vertical: 'HVAC', rec: `Video campaigns are outperforming authority posts by ${hvacVideo - hvacAuth} pts. Increase video allocation for HVAC.`, color: VERTICAL_COLORS.HVAC });

  const restSeasonal = avg(data.filter(r => r.vertical === 'Restaurant' && r.campaign_type === 'seasonal'), 'engagement_score');
  if (restSeasonal > 65) insights.push({ vertical: 'Restaurant', rec: `Seasonal campaigns driving ${restSeasonal}/100 avg engagement — strongest activation type for this vertical.`, color: VERTICAL_COLORS.Restaurant });

  const plumbAuth = avg(data.filter(r => r.vertical === 'Plumbing' && r.campaign_type === 'authority'), 'lead_signal_strength');
  if (plumbAuth > 0) insights.push({ vertical: 'Plumbing', rec: `Authority campaigns generating ${plumbAuth}/100 lead signal strength — consistent pipeline driver for Plumbing.`, color: VERTICAL_COLORS.Plumbing });

  // Section 6 — timeline
  const timelineCampaigns = [...data].sort((a, b) => (a.start_date || '').localeCompare(b.start_date || '')).slice(0, 8);

  const KPI = ({ label, value, sub, Icon, color }) => (
    <div className="bg-[#0f1729] border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{label}</span>
      </div>
      <p className={`text-xl font-black leading-tight ${color}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-[#080f1e] flex items-center justify-center">
      <div className="text-slate-400 text-sm animate-pulse">Loading campaign data…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080f1e] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-6 rounded-full bg-teal-400" />
              <h1 className="text-2xl font-black text-white">Vertical Campaign Intelligence</h1>
            </div>
            <p className="text-slate-400 text-sm ml-5">Campaign performance patterns by industry vertical · strategy decision support</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={filterVertical} onChange={e => setFilterVertical(e.target.value)}
              className="bg-[#0f1729] border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
              {verticals.map(v => <option key={v}>{v}</option>)}
            </select>
            <select value={filterType} onChange={e => setFilterType(e.target.value)}
              className="bg-[#0f1729] border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
              {types.map(t => <option key={t} value={t}>{t === 'All' ? 'All Types' : TYPE_LABELS[t]}</option>)}
            </select>
          </div>
        </div>

        {/* SECTION 1 — KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPI label="Campaigns Tracked" value={data.length} Icon={BarChart2} color="text-teal-400" />
          <KPI label="Top Campaign" value={best?.campaign_name || '—'} sub={best ? `${best.vertical} · ${best.overall_success_score}/100` : ''} Icon={Zap} color="text-violet-400" />
          <KPI label="Avg Engagement" value={`${avg(data, 'engagement_score')}/100`} Icon={TrendingUp} color="text-amber-400" />
          <KPI label="Visibility Leader" value={visLeader?.vertical || '—'} sub={visLeader ? `${visLeader.campaign_name}` : ''} Icon={Eye} color="text-blue-400" />
          <KPI label="Avg Lead Signal" value={`${avg(data, 'lead_signal_strength')}/100`} Icon={Target} color="text-emerald-400" />
        </div>

        {/* SECTION 2 — Leaderboard */}
        <div className="bg-[#0f1729] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <h2 className="text-sm font-bold text-slate-300">Campaign Performance Leaderboard</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/60">
                <tr>
                  {[
                    { label: 'Vertical', key: 'vertical' },
                    { label: 'Campaign', key: 'campaign_name' },
                    { label: 'Type', key: 'campaign_type' },
                    { label: 'Engagement', key: 'engagement_score' },
                    { label: 'Visibility', key: 'visibility_impact_score' },
                    { label: 'Lead Signal', key: 'lead_signal_strength' },
                    { label: 'Success Score', key: 'overall_success_score' },
                  ].map(col => (
                    <th key={col.key} onClick={() => toggleSort(col.key)}
                      className="px-4 py-3 text-left cursor-pointer select-none group">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-slate-300 transition-colors">{col.label}</span>
                        <SortIcon k={col.key} />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {sorted.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: VERTICAL_COLORS[row.vertical] + '22', color: VERTICAL_COLORS[row.vertical] }}>{row.vertical}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-white font-medium">{row.campaign_name}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: TYPE_COLORS[row.campaign_type] + '22', color: TYPE_COLORS[row.campaign_type] }}>{TYPE_LABELS[row.campaign_type]}</span>
                    </td>
                    <td className="px-4 py-3 w-28"><ScoreBar value={row.engagement_score || 0} /></td>
                    <td className="px-4 py-3 w-28"><ScoreBar value={row.visibility_impact_score || 0} /></td>
                    <td className="px-4 py-3 w-28"><ScoreBar value={row.lead_signal_strength || 0} /></td>
                    <td className="px-4 py-3 w-28"><ScoreBar value={row.overall_success_score || 0} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sorted.length === 0 && <p className="text-center text-slate-600 text-sm py-10">No campaigns match the current filters.</p>}
          </div>
        </div>

        {/* SECTION 3 — Distribution Chart */}
        <div className="bg-[#0f1729] border border-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-slate-300 mb-5">Avg Campaign Performance by Vertical</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="vertical" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
              <Bar dataKey="Engagement" fill="#f59e0b" radius={[4, 4, 0, 0]} animationDuration={700} />
              <Bar dataKey="Visibility" fill="#6366f1" radius={[4, 4, 0, 0]} animationDuration={850} />
              <Bar dataKey="Lead Signal" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* SECTION 4 — Type Effectiveness Grid */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4">Campaign Type Effectiveness</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {typeGrid.map(t => (
              <div key={t.type} className="bg-[#0f1729] border border-slate-800 rounded-2xl p-4 hover:border-slate-600 transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: TYPE_COLORS[t.type] }} />
                  <span className="text-xs font-bold text-white">{TYPE_LABELS[t.type]}</span>
                </div>
                <p className="text-3xl font-black mb-0.5" style={{ color: TYPE_COLORS[t.type] }}>{t.avgScore}</p>
                <p className="text-[10px] text-slate-500 mb-3">Avg Success Score</p>
                <div className="bg-slate-800 rounded-full h-1 mb-3 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${t.avgScore}%`, background: TYPE_COLORS[t.type] }} />
                </div>
                <p className="text-[10px] text-slate-500">{t.count} campaign{t.count !== 1 ? 's' : ''}</p>
                {t.strongestVertical !== '—' && <p className="text-[10px] text-slate-400 mt-0.5">Best in <span className="font-bold" style={{ color: VERTICAL_COLORS[t.strongestVertical] }}>{t.strongestVertical}</span></p>}
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5 — Opportunity Insights */}
        {insights.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-slate-300 mb-4">Campaign Opportunity Insights</h2>
            <div className="space-y-3">
              {insights.map((ins, i) => (
                <div key={i} className="bg-[#0f1729] border border-slate-700 rounded-2xl p-4 flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: ins.color }} />
                  <div className="flex-1">
                    <span className="text-xs font-black mb-1 block" style={{ color: ins.color }}>{ins.vertical}</span>
                    <p className="text-sm text-slate-300 leading-relaxed">{ins.rec}</p>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-[11px] text-slate-300 font-semibold transition-colors flex-shrink-0 mt-0.5">
                    <Flag className="w-3 h-3" /> Flag for Strategy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 6 — Campaign Timeline Strip */}
        <div className="bg-[#0f1729] border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <CalendarRange className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-bold text-slate-300">Campaign Timeline</h2>
          </div>
          <div className="space-y-3">
            {timelineCampaigns.map((c, i) => {
              const start = c.start_date ? new Date(c.start_date) : null;
              const end = c.end_date ? new Date(c.end_date) : null;
              const duration = start && end ? Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24))) : 30;
              const offset = start ? Math.max(0, Math.min(60, Math.round((start - new Date('2025-09-01')) / (1000 * 60 * 60 * 24) / 3))) : i * 8;
              const width = Math.min(100 - offset, Math.max(8, Math.round(duration / 3)));
              const color = VERTICAL_COLORS[c.vertical] || '#6366f1';
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-36 flex-shrink-0">
                    <p className="text-xs text-white font-medium truncate">{c.campaign_name}</p>
                    <p className="text-[10px]" style={{ color }}>{c.vertical}</p>
                  </div>
                  <div className="flex-1 bg-slate-800 rounded-full h-5 relative overflow-hidden">
                    <div className="absolute top-0 h-full rounded-full flex items-center px-2 text-[9px] font-bold text-white"
                      style={{ left: `${offset}%`, width: `${width}%`, background: color + 'cc', minWidth: 40 }}>
                      {TYPE_LABELS[c.campaign_type]}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold w-8 text-right ${scoreText(c.overall_success_score)}`}>{c.overall_success_score}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800">
            {Object.entries(VERTICAL_COLORS).map(([v, c]) => (
              <div key={v} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: c }} />
                <span className="text-[10px] text-slate-500">{v}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
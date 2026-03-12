import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  TrendingUp, DollarSign, Zap, Shield, AlertTriangle,
  MapPin, Flag, ChevronUp, ChevronDown, ChevronsUpDown,
  CheckCircle2, PlayCircle, Target, Star, BarChart2
} from 'lucide-react';

const VERTICAL_COLORS = {
  HVAC: '#6366f1', Restaurant: '#f59e0b', Plumbing: '#10b981',
  'Home Services': '#ec4899', General: '#8b5cf6'
};
const TYPE_COLORS = {
  geographic: '#6366f1', authority: '#8b5cf6', pricing: '#10b981',
  campaign: '#f59e0b', enterprise: '#ec4899'
};
const TYPE_LABELS = {
  geographic: 'Geographic', authority: 'Authority', pricing: 'Pricing',
  campaign: 'Campaign', enterprise: 'Enterprise'
};
const URGENCY_CONFIG = {
  high: { label: 'High', bg: 'bg-rose-900/60 text-rose-300', dot: 'bg-rose-400' },
  medium: { label: 'Medium', bg: 'bg-amber-900/60 text-amber-300', dot: 'bg-amber-400' },
  low: { label: 'Low', bg: 'bg-emerald-900/60 text-emerald-300', dot: 'bg-emerald-400' },
};
const STATUS_CONFIG = {
  identified: { label: 'Identified', color: 'text-slate-400' },
  planning: { label: 'Planning', color: 'text-amber-400' },
  executing: { label: 'Executing', color: 'text-blue-400' },
  completed: { label: 'Completed', color: 'text-emerald-400' },
};
const REGIONS = ['Midwest', 'South', 'Coastal', 'Urban', 'Suburban'];

const INSIGHTS = [
  { vertical: 'HVAC', insight: 'Secondary Midwest markets showing strong homeowner demand signals — low competitor saturation in 12+ cities.', action: 'Launch geographic expansion campaign targeting IL, IN, MO secondary metros.', impact: '+$14,200 projected MRR' },
  { vertical: 'Restaurant', insight: 'Promotional authority content gap detected — competitors not ranking for local dining search terms.', action: 'Deploy 3-month authority content series with seasonal campaign overlaps.', impact: '+$6,800 projected MRR' },
  { vertical: 'Plumbing', insight: 'Premium pricing acceptance increasing — clients in this vertical upgrading from base to authority packages.', action: 'Position authority upsell in all active Plumbing accounts within 30 days.', impact: '+$9,100 projected MRR' },
  { vertical: 'Home Services', insight: 'Franchise operators actively searching for multi-location digital marketing providers — enterprise motion ready.', action: 'Deploy franchise-targeted enterprise sales sequence with multi-location case study.', impact: '+$22,000 projected MRR' },
];

const AUTHORITY_SIGNALS = [
  { vertical: 'HVAC', saturation: 38, frequency: 72, visibility: 81, competition: 44, zone: 'leadership' },
  { vertical: 'Restaurant', saturation: 61, frequency: 48, visibility: 55, competition: 73, zone: 'saturation_risk' },
  { vertical: 'Plumbing', saturation: 29, frequency: 65, visibility: 76, competition: 31, zone: 'opportunity' },
  { vertical: 'Home Services', saturation: 22, frequency: 41, visibility: 49, competition: 28, zone: 'opportunity' },
];

function vColor(v) { return VERTICAL_COLORS[v] || '#94a3b8'; }

function fmt(n) {
  if (!n) return '—';
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
}

function ScoreBar({ value, color }) {
  const bg = color || (value >= 70 ? '#10b981' : value >= 40 ? '#f59e0b' : '#f43f5e');
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: bg }} />
      </div>
      <span className="text-xs font-bold w-6 text-right" style={{ color: bg }}>{value}</span>
    </div>
  );
}

export default function AdminVerticalExpansion() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterVertical, setFilterVertical] = useState('All');
  const [filterUrgency, setFilterUrgency] = useState('All');
  const [sortKey, setSortKey] = useState('opportunity_score');
  const [sortDir, setSortDir] = useState('desc');
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    base44.entities.VerticalExpansionOpportunity.list('-opportunity_score', 100).then(d => {
      setData(d);
      const s = {};
      d.forEach(r => { s[r.id] = r.status; });
      setStatuses(s);
      setLoading(false);
    });
  }, []);

  async function updateStatus(id, newStatus) {
    await base44.entities.VerticalExpansionOpportunity.update(id, { status: newStatus });
    setStatuses(prev => ({ ...prev, [id]: newStatus }));
  }

  const verticals = ['All', ...Object.keys(VERTICAL_COLORS)];
  const urgencies = ['All', 'high', 'medium', 'low'];

  const filtered = data.filter(r =>
    (filterVertical === 'All' || r.vertical === filterVertical) &&
    (filterUrgency === 'All' || r.urgency_level === filterUrgency)
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

  const highOpps = data.filter(r => r.urgency_level === 'high').length;
  const totalMRR = data.reduce((s, r) => s + (r.projected_mrr_impact || 0), 0);
  const active = data.filter(r => r.status === 'executing' || r.status === 'planning').length;
  const avgCompetition = data.length ? Math.round(data.reduce((s, r) => s + (r.competition_intensity || 0), 0) / data.length) : 0;
  const bestScore = data.length ? Math.max(...data.map(r => r.opportunity_score || 0)) : 0;

  // Region grid — count opportunities per region
  const regionData = REGIONS.map(region => {
    const opps = data.filter(r => r.region?.includes(region) || (region === 'Midwest' && r.region?.toLowerCase().includes('midwest')));
    const score = opps.length ? Math.round(opps.reduce((s, r) => s + (r.opportunity_score || 0), 0) / opps.length) : Math.floor(30 + Math.random() * 40);
    const topVertical = opps[0]?.vertical || null;
    return { region, count: opps.length, score, topVertical };
  });

  const KPI = ({ label, value, sub, Ic, color }) => (
    <div className="bg-[#0f1729] border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Ic className={`w-4 h-4 ${color}`} />
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{label}</span>
      </div>
      <p className={`text-2xl font-black leading-tight ${color}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-[#080f1e] flex items-center justify-center">
      <div className="text-slate-400 text-sm animate-pulse">Loading expansion data…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080f1e] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-6 rounded-full bg-emerald-400" />
              <h1 className="text-2xl font-black text-white">Vertical Expansion Engine</h1>
            </div>
            <p className="text-slate-400 text-sm ml-5">Strategic growth intelligence · where to focus next for fastest expansion</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={filterVertical} onChange={e => setFilterVertical(e.target.value)}
              className="bg-[#0f1729] border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {verticals.map(v => <option key={v}>{v}</option>)}
            </select>
            <select value={filterUrgency} onChange={e => setFilterUrgency(e.target.value)}
              className="bg-[#0f1729] border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {urgencies.map(u => <option key={u} value={u}>{u === 'All' ? 'All Urgencies' : u.charAt(0).toUpperCase() + u.slice(1) + ' Urgency'}</option>)}
            </select>
          </div>
        </div>

        {/* SECTION 1 — KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPI label="High Priority Verticals" value={highOpps} sub="urgency: high" Ic={AlertTriangle} color="text-rose-400" />
          <KPI label="Total Expansion MRR" value={fmt(totalMRR)} sub="projected impact" Ic={DollarSign} color="text-emerald-400" />
          <KPI label="Active Initiatives" value={active} sub="planning + executing" Ic={PlayCircle} color="text-blue-400" />
          <KPI label="Top Opportunity Score" value={`${bestScore}/100`} Ic={Star} color="text-amber-400" />
          <KPI label="Avg Competitor Pressure" value={`${avgCompetition}/100`} Ic={Shield} color={avgCompetition > 60 ? 'text-rose-400' : 'text-slate-300'} />
        </div>

        {/* SECTION 2 — Leaderboard */}
        <div className="bg-[#0f1729] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-300">Opportunity Leaderboard</h2>
            <span className="text-xs text-slate-500">{sorted.length} opportunities</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/60">
                <tr>
                  {[
                    { label: 'Vertical', key: 'vertical' },
                    { label: 'Type', key: 'opportunity_type' },
                    { label: 'Region', key: 'region' },
                    { label: 'Opp Score', key: 'opportunity_score' },
                    { label: 'Proj. MRR', key: 'projected_mrr_impact' },
                    { label: 'Competition', key: 'competition_intensity' },
                    { label: 'Urgency', key: 'urgency_level' },
                    { label: 'Status', key: 'status' },
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
                {sorted.map((row, i) => {
                  const urg = URGENCY_CONFIG[row.urgency_level] || URGENCY_CONFIG.medium;
                  const st = STATUS_CONFIG[statuses[row.id] || row.status] || STATUS_CONFIG.identified;
                  const color = vColor(row.vertical);
                  return (
                    <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: color + '22', color }}>{row.vertical}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: TYPE_COLORS[row.opportunity_type] + '22', color: TYPE_COLORS[row.opportunity_type] }}>{TYPE_LABELS[row.opportunity_type]}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">{row.region || '—'}</td>
                      <td className="px-4 py-3 w-28"><ScoreBar value={row.opportunity_score || 0} /></td>
                      <td className="px-4 py-3 text-sm font-bold text-emerald-400">{fmt(row.projected_mrr_impact)}</td>
                      <td className="px-4 py-3 w-24"><ScoreBar value={row.competition_intensity || 0} color="#f43f5e" /></td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${urg.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${urg.dot}`} />
                          {urg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold ${st.color}">
                        <span className={st.color}>{st.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {sorted.length === 0 && <p className="text-center text-slate-600 text-sm py-10">No opportunities match current filters.</p>}
          </div>
        </div>

        {/* SECTION 3 — Strategy Cards */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4">Expansion Strategy Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((opp, i) => {
              const color = vColor(opp.vertical);
              const urg = URGENCY_CONFIG[opp.urgency_level] || URGENCY_CONFIG.medium;
              const currentStatus = statuses[opp.id] || opp.status;
              return (
                <div key={i} className="bg-[#0f1729] border border-slate-800 rounded-2xl p-5 hover:border-slate-600 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                      <span className="text-sm font-black text-white">{opp.vertical}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: TYPE_COLORS[opp.opportunity_type] + '22', color: TYPE_COLORS[opp.opportunity_type] }}>{TYPE_LABELS[opp.opportunity_type]}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${urg.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${urg.dot}`} />{urg.label}
                    </span>
                  </div>

                  {opp.region && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span className="text-xs text-slate-400">{opp.region}</span>
                    </div>
                  )}

                  {opp.recommended_action && (
                    <p className="text-sm text-slate-300 leading-relaxed mb-4">{opp.recommended_action}</p>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-900/60 rounded-xl p-3">
                      <p className="text-[10px] text-slate-500 mb-1">Opportunity Score</p>
                      <ScoreBar value={opp.opportunity_score || 0} />
                    </div>
                    <div className="bg-slate-900/60 rounded-xl p-3">
                      <p className="text-[10px] text-slate-500 mb-1">Projected MRR Impact</p>
                      <p className="text-base font-black text-emerald-400">{fmt(opp.projected_mrr_impact)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {currentStatus === 'identified' && (
                      <button onClick={() => updateStatus(opp.id, 'planning')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-700 rounded-xl text-[11px] text-amber-300 font-semibold transition-colors">
                        <Target className="w-3 h-3" /> Mark as Planning
                      </button>
                    )}
                    {currentStatus === 'planning' && (
                      <button onClick={() => updateStatus(opp.id, 'executing')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-700 rounded-xl text-[11px] text-blue-300 font-semibold transition-colors">
                        <PlayCircle className="w-3 h-3" /> Launch Executing
                      </button>
                    )}
                    {currentStatus === 'executing' && (
                      <button onClick={() => updateStatus(opp.id, 'completed')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-700 rounded-xl text-[11px] text-emerald-300 font-semibold transition-colors">
                        <CheckCircle2 className="w-3 h-3" /> Mark Complete
                      </button>
                    )}
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-[11px] text-slate-300 font-semibold transition-colors">
                      <Zap className="w-3 h-3" /> Launch Authority Campaign
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-[11px] text-slate-300 font-semibold transition-colors">
                      <TrendingUp className="w-3 h-3" /> Trigger Sales Focus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 4 — Geographic Grid */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4">Geographic Expansion Clusters</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {regionData.map(r => {
              const heat = r.score >= 70 ? 'border-emerald-700 bg-emerald-950/20' : r.score >= 45 ? 'border-amber-700 bg-amber-950/10' : 'border-slate-700 bg-[#0f1729]';
              const scoreColor = r.score >= 70 ? 'text-emerald-400' : r.score >= 45 ? 'text-amber-400' : 'text-slate-500';
              return (
                <div key={r.region} className={`border rounded-2xl p-4 transition-all hover:scale-[1.02] ${heat}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-bold text-white">{r.region}</span>
                  </div>
                  <p className={`text-3xl font-black mb-1 ${scoreColor}`}>{r.score}</p>
                  <p className="text-[10px] text-slate-500 mb-2">Expansion Score</p>
                  {r.topVertical && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: vColor(r.topVertical) + '22', color: vColor(r.topVertical) }}>
                      {r.topVertical}
                    </span>
                  )}
                  {r.count > 0 && <p className="text-[10px] text-slate-500 mt-1">{r.count} opp{r.count !== 1 ? 's' : ''}</p>}
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 5 — Authority Domination Panel */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4">Authority Domination Indicators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AUTHORITY_SIGNALS.map(sig => {
              const zoneConfig = {
                leadership: { label: 'Authority Leadership Zone', badge: 'bg-emerald-900/60 text-emerald-300', icon: Star, desc: 'Strong content presence. Defend and expand.' },
                saturation_risk: { label: 'Saturation Risk', badge: 'bg-rose-900/60 text-rose-300', icon: AlertTriangle, desc: 'High competition — differentiation strategy needed.' },
                opportunity: { label: 'Domination Opportunity', badge: 'bg-amber-900/60 text-amber-300', icon: Zap, desc: 'Low saturation — prime for authority push.' },
              }[sig.zone];
              const ZoneIcon = zoneConfig.icon;
              const color = vColor(sig.vertical);
              return (
                <div key={sig.vertical} className="bg-[#0f1729] border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                      <span className="text-sm font-black text-white">{sig.vertical}</span>
                    </div>
                    <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${zoneConfig.badge}`}>
                      <ZoneIcon className="w-3 h-3" />{zoneConfig.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">{zoneConfig.desc}</p>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Content Saturation', value: sig.saturation, invert: true },
                      { label: 'Campaign Frequency', value: sig.frequency },
                      { label: 'Brand Visibility', value: sig.visibility },
                      { label: 'Competitor Intensity', value: sig.competition, invert: true },
                    ].map(m => (
                      <div key={m.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-slate-500">{m.label}</span>
                          <span className="text-[10px] font-bold text-slate-400">{m.value}/100</span>
                        </div>
                        <ScoreBar value={m.value} color={m.invert ? (m.value > 60 ? '#f43f5e' : '#10b981') : undefined} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 6 — Expansion Intelligence Feed */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4">Expansion Intelligence Feed</h2>
          <div className="space-y-3">
            {INSIGHTS.map((ins, i) => {
              const color = vColor(ins.vertical);
              return (
                <div key={i} className="bg-[#0f1729] border border-slate-700 rounded-2xl p-5 flex items-start gap-4 hover:border-slate-500 transition-all">
                  <div className="w-1 h-full rounded-full flex-shrink-0 self-stretch" style={{ background: color, minHeight: 40 }} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black" style={{ color }}>{ins.vertical}</span>
                      <span className="text-[10px] text-slate-500">· Intelligence Signal</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed mb-2">{ins.insight}</p>
                    <div className="bg-slate-900/60 rounded-xl px-3 py-2 flex items-start gap-2">
                      <Target className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-slate-400">{ins.action}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-xs font-black text-emerald-400">{ins.impact}</span>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-[11px] text-slate-300 font-semibold transition-colors">
                      <Flag className="w-3 h-3" /> Flag Leadership
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-800">
          {Object.entries(VERTICAL_COLORS).map(([v, c]) => (
            <div key={v} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: c }} />
              <span className="text-[10px] text-slate-500">{v}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
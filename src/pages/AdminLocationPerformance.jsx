import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

const TP = { background: '#1e293b', border: 'none', borderRadius: 8, fontSize: 11, color: '#e2e8f0' };

const ALL_LOCATIONS = [
  { id:'l1', name:'Downtown Chicago', client:'Arctic Climate Group', region:'North', vertical:'HVAC', tier:'enterprise', visibility:87, engagement:82, content:18, campaign_pct:94, trend:'up', ranking:3.2 },
  { id:'l2', name:'Lincoln Park', client:'Arctic Climate Group', region:'North', vertical:'HVAC', tier:'enterprise', visibility:79, engagement:74, content:14, campaign_pct:88, trend:'up', ranking:4.1 },
  { id:'l3', name:'Evanston', client:'Arctic Climate Group', region:'North', vertical:'HVAC', tier:'enterprise', visibility:71, engagement:68, content:11, campaign_pct:80, trend:'up', ranking:4.7 },
  { id:'l4', name:'Oak Park', client:'Arctic Climate Group', region:'West', vertical:'HVAC', tier:'enterprise', visibility:64, engagement:61, content:9, campaign_pct:72, trend:'stable', ranking:5.8 },
  { id:'l5', name:'Naperville', client:'Arctic Climate Group', region:'West', vertical:'HVAC', tier:'enterprise', visibility:68, engagement:64, content:10, campaign_pct:75, trend:'stable', ranking:5.2 },
  { id:'l6', name:'Schaumburg', client:'Arctic Climate Group', region:'Northwest', vertical:'HVAC', tier:'enterprise', visibility:41, engagement:38, content:4, campaign_pct:31, trend:'down', ranking:9.4 },
  { id:'l7', name:'River North', client:'Summit Dental Group', region:'Metro', vertical:'Dental', tier:'authority', visibility:75, engagement:71, content:12, campaign_pct:82, trend:'up', ranking:4.4 },
  { id:'l8', name:'Wicker Park', client:'Summit Dental Group', region:'Metro', vertical:'Dental', tier:'authority', visibility:62, engagement:58, content:8, campaign_pct:69, trend:'stable', ranking:6.1 },
  { id:'l9', name:'Hyde Park', client:'Summit Dental Group', region:'Metro', vertical:'Dental', tier:'authority', visibility:58, engagement:54, content:7, campaign_pct:64, trend:'down', ranking:7.2 },
  { id:'l10', name:'Lakeview', client:'Summit Dental Group', region:'Metro', vertical:'Dental', tier:'authority', visibility:81, engagement:76, content:13, campaign_pct:87, trend:'up', ranking:3.9 },
  { id:'l11', name:'Orland Park', client:'FastTrack Auto Group', region:'South', vertical:'Auto', tier:'growth', visibility:55, engagement:52, content:6, campaign_pct:58, trend:'stable', ranking:7.8 },
  { id:'l12', name:'Tinley Park', client:'FastTrack Auto Group', region:'South', vertical:'Auto', tier:'growth', visibility:48, engagement:44, content:3, campaign_pct:40, trend:'down', ranking:9.1 },
  { id:'l13', name:'Joliet', client:'FastTrack Auto Group', region:'South', vertical:'Auto', tier:'growth', visibility:44, engagement:41, content:2, campaign_pct:34, trend:'down', ranking:10.2 },
];

const TREND_DATA = [
  { week:'W8', avg_vis:61, avg_eng:57 },
  { week:'W9', avg_vis:63, avg_eng:59 },
  { week:'W10', avg_vis:65, avg_eng:61 },
  { week:'W11', avg_vis:64, avg_eng:62 },
  { week:'W12', avg_vis:67, avg_eng:64 },
];

const TrendIcon = ({ dir }) => dir === 'up' ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> : dir === 'down' ? <TrendingDown className="w-3.5 h-3.5 text-red-500" /> : <Minus className="w-3.5 h-3.5 text-slate-400" />;

export default function AdminLocationPerformance() {
  const [clientFilter, setClientFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [vertFilter, setVertFilter] = useState('all');
  const [sortBy, setSortBy] = useState('visibility');

  const clients = ['all', ...Array.from(new Set(ALL_LOCATIONS.map(l => l.client)))];
  const regions = ['all', ...Array.from(new Set(ALL_LOCATIONS.map(l => l.region)))];
  const verticals = ['all', ...Array.from(new Set(ALL_LOCATIONS.map(l => l.vertical)))];

  const filtered = ALL_LOCATIONS
    .filter(l => clientFilter === 'all' || l.client === clientFilter)
    .filter(l => regionFilter === 'all' || l.region === regionFilter)
    .filter(l => vertFilter === 'all' || l.vertical === vertFilter)
    .sort((a, b) => b[sortBy] - a[sortBy]);

  const chartData = filtered.map(l => ({ name: l.name.split(' ')[0], visibility: l.visibility, engagement: l.engagement }));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-800">Location Performance Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">Deep-dive visibility, engagement, and campaign data across all managed locations</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase">Filter:</span>
          </div>
          {[
            { label:'Client', options:clients, val:clientFilter, set:setClientFilter },
            { label:'Region', options:regions, val:regionFilter, set:setRegionFilter },
            { label:'Vertical', options:verticals, val:vertFilter, set:setVertFilter },
          ].map(f => (
            <select key={f.label} value={f.val} onChange={e => f.set(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
              {f.options.map(o => <option key={o} value={o}>{o === 'all' ? `All ${f.label}s` : o}</option>)}
            </select>
          ))}
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-xs font-semibold text-blue-700 focus:outline-none ml-auto">
            {[['visibility','Sort: Visibility'],['engagement','Sort: Engagement'],['content','Sort: Content'],['campaign_pct','Sort: Campaign %']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-800 mb-1">Visibility Score by Location</p>
            <p className="text-[11px] text-slate-500 mb-3">{filtered.length} locations shown</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize:9, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0,100]} />
                <Tooltip contentStyle={TP} />
                <Bar dataKey="visibility" fill="#3b82f6" radius={[4,4,0,0]} name="Visibility" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-800 mb-1">Network Average Trend</p>
            <p className="text-[11px] text-slate-500 mb-3">Visibility and engagement — last 5 weeks</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={TREND_DATA}>
                <defs>
                  <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.12} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.12} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize:10, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={TP} />
                <Area type="monotone" dataKey="avg_vis" stroke="#3b82f6" fill="url(#vg)" strokeWidth={2} name="Avg Visibility" />
                <Area type="monotone" dataKey="avg_eng" stroke="#10b981" fill="url(#eg)" strokeWidth={2} name="Avg Engagement" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Location Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-black text-slate-800">Location Rankings — {filtered.length} results</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Rank','Location','Client','Region','Visibility','Engagement','Content','Campaign %','Trend'].map(h => (
                    <th key={h} className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-left whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((loc, i) => (
                  <tr key={loc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-black text-slate-400">#{i+1}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-bold text-slate-800">{loc.name}</p>
                      <p className="text-[10px] text-slate-400">{loc.vertical}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{loc.client}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{loc.region}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width:`${loc.visibility}%`, background: loc.visibility>70?'#10b981':loc.visibility>50?'#f59e0b':'#ef4444' }} />
                        </div>
                        <span className={`text-xs font-black ${loc.visibility>70?'text-emerald-600':loc.visibility>50?'text-amber-600':'text-red-600'}`}>{loc.visibility}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-slate-700">{loc.engagement}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{loc.content}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold ${loc.campaign_pct>75?'text-emerald-600':loc.campaign_pct>50?'text-amber-600':'text-red-600'}`}>{loc.campaign_pct}%</span>
                    </td>
                    <td className="px-4 py-3"><TrendIcon dir={loc.trend} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
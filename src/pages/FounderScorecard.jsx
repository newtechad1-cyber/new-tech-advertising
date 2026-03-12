import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Zap, Users, DollarSign, Star } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const TP = { background: '#1e293b', border: 'none', borderRadius: 8, fontSize: 11, color: '#e2e8f0' };

const MRR_DATA = [
  { week:'W6', mrr:38200 }, { week:'W7', mrr:41000 }, { week:'W8', mrr:43500 },
  { week:'W9', mrr:46200 }, { week:'W10', mrr:49800 }, { week:'W11', mrr:52100 },
  { week:'W12', mrr:55400 },
];

const KPIS = [
  { label:'Net New MRR', value:'$6,200', note:'this week', trend:'up', color:'text-emerald-600', bg:'bg-emerald-50 border-emerald-200' },
  { label:'Active Clients', value:'47', note:'+3 this week', trend:'up', color:'text-blue-600', bg:'bg-blue-50 border-blue-200' },
  { label:'Sales Close Rate', value:'38%', note:'vs 31% last month', trend:'up', color:'text-violet-600', bg:'bg-violet-50 border-violet-200' },
  { label:'Client Health Score', value:'81/100', note:'3 at risk', trend:'stable', color:'text-amber-600', bg:'bg-amber-50 border-amber-200' },
  { label:'Content Volume', value:'284', note:'pieces this week', trend:'up', color:'text-teal-600', bg:'bg-teal-50 border-teal-200' },
  { label:'Expansion Score', value:'74/100', note:'2 markets primed', trend:'up', color:'text-slate-700', bg:'bg-slate-50 border-slate-200' },
];

const PRIORITIES = [
  { category:'deal', emoji:'💼', title:'Arctic Climate Group expansion ready', company:'Arctic Climate Group', impact_label:'MRR Opportunity', impact_value:'+$2,400/mo', urgency:'critical', action:'Schedule expansion call' },
  { category:'client_risk', emoji:'⚠️', title:'FastTrack Auto Group showing churn signals', company:'FastTrack Auto Group', impact_label:'MRR at Risk', impact_value:'$2,991/mo', urgency:'critical', action:'Assign CSM intervention' },
  { category:'upsell', emoji:'🚀', title:'Summit Dental authority pack upsell window', company:'Summit Dental Group', impact_label:'Upsell Value', impact_value:'+$1,600/mo', urgency:'high', action:'Send proposal today' },
  { category:'market', emoji:'📍', title:'Wicker Park territory gap detected', company:'Market Intelligence', impact_label:'New Client Potential', impact_value:'+$997/mo', urgency:'high', action:'Add to outreach list' },
];

const TrendIcon = ({ dir }) => dir === 'up' ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : dir === 'down' ? <TrendingDown className="w-4 h-4 text-red-500" /> : <Minus className="w-4 h-4 text-slate-400" />;

export default function FounderScorecard() {
  const [dismissed, setDismissed] = useState([]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-800">NTA Founder Scorecard</h1>
            <p className="text-slate-500 text-sm mt-1">Executive command view — week of March 12, 2026</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700">Growth Trajectory: Strong</span>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {KPIS.map(k => (
            <div key={k.label} className={`border rounded-2xl p-4 ${k.bg}`}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] text-slate-500 font-bold uppercase">{k.label}</p>
                <TrendIcon dir={k.trend} />
              </div>
              <p className={`text-xl font-black ${k.color}`}>{k.value}</p>
              <p className="text-[10px] text-slate-500 mt-1">{k.note}</p>
            </div>
          ))}
        </div>

        {/* MRR Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-800 mb-0.5">Cumulative MRR — Last 7 Weeks</p>
          <p className="text-[11px] text-slate-500 mb-4">$55,400 current · +45% over period</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={MRR_DATA}>
              <defs>
                <linearGradient id="mrrg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize:10, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={TP} formatter={v => [`$${v.toLocaleString()}`, 'MRR']} />
              <Area type="monotone" dataKey="mrr" stroke="#10b981" fill="url(#mrrg)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Actions */}
        <div>
          <h2 className="text-lg font-black text-slate-800 mb-4">Founder Priority Actions</h2>
          <div className="space-y-3">
            {PRIORITIES.filter((_, i) => !dismissed.includes(i)).map((p, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all ${p.urgency === 'critical' ? 'border-red-200' : 'border-slate-200'}`}>
                <span className="text-2xl flex-shrink-0">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800">{p.title}</p>
                  <p className="text-[11px] text-slate-500">{p.company}</p>
                </div>
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <p className="text-[9px] text-slate-400 font-bold uppercase">{p.impact_label}</p>
                  <p className={`text-sm font-black ${p.category === 'client_risk' ? 'text-red-600' : 'text-emerald-600'}`}>{p.impact_value}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors">{p.action}</button>
                  <button onClick={() => setDismissed(d => [...d, i])} className="px-3 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-500 transition-colors">Dismiss</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
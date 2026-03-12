import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, X, ArrowUpRight, Zap, Users, Star, BarChart2, RefreshCw, MessageSquare, Calendar, Download, Award } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';

const MOMENTUM_CONFIG = {
  accelerating: { bar: 'bg-gradient-to-r from-emerald-600 to-teal-400', border: 'border-emerald-700/50', badge: 'bg-emerald-950 text-emerald-300', dot: 'bg-emerald-400', glow: 'shadow-emerald-900/40' },
  stable:       { bar: 'bg-gradient-to-r from-amber-600 to-yellow-400', border: 'border-amber-700/50', badge: 'bg-amber-950 text-amber-300', dot: 'bg-amber-400', glow: '' },
  declining:    { bar: 'bg-gradient-to-r from-red-700 to-rose-500', border: 'border-red-700/50', badge: 'bg-red-950 text-red-300', dot: 'bg-red-500', glow: 'shadow-red-900/40' },
};

const LEAD_COLOR = { strong: 'text-emerald-300', moderate: 'text-amber-300', weak: 'text-red-300' };

const ROI_SPARK = {
  accelerating: [30,38,42,51,48,58,65,72,78,82],
  stable:       [55,57,54,58,56,59,57,60,58,61],
  declining:    [72,68,65,60,58,54,50,47,44,41],
};

const TOOLTIP_STYLE = { background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 10 };

const MODAL_CHART = [
  { m: 'Oct', rank: 24, social: 1200, leads: 8 },
  { m: 'Nov', rank: 19, social: 1800, leads: 11 },
  { m: 'Dec', rank: 15, social: 2400, leads: 14 },
  { m: 'Jan', rank: 12, social: 3100, leads: 18 },
  { m: 'Feb', rank: 8, social: 4200, leads: 22 },
  { m: 'Mar', rank: 6, social: 5600, leads: 27 },
];

const ClientModal = ({ client, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
    <div className="relative z-10 bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
      <div className="flex items-start justify-between p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center font-bold text-white text-sm">
            {client.company_name?.[0]}
          </div>
          <div>
            <h2 className="text-base font-bold text-white">{client.company_name}</h2>
            <p className="text-xs text-slate-400">{client.vertical} · {client.revenue_tier} · {client.city}, {client.state}</p>
          </div>
        </div>
        <button onClick={onClose}><X className="w-5 h-5 text-slate-500 hover:text-white" /></button>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'ROI Score', value: client.roi_score ?? '—', color: 'text-emerald-300' },
            { label: 'Keywords Up', value: client.keywords_improved ?? '—', color: 'text-cyan-300' },
            { label: 'Lead Signal', value: client.lead_signal_strength ?? '—', color: LEAD_COLOR[client.lead_signal_strength] },
          ].map(m => (
            <div key={m.label} className="bg-slate-800 rounded-xl p-3 text-center">
              <p className="text-[10px] text-slate-500 mb-1">{m.label}</p>
              <p className={`text-lg font-bold capitalize ${m.color}`}>{m.value}</p>
            </div>
          ))}
        </div>
        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-300 mb-3">Keyword Ranking Trend</p>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={MODAL_CHART}>
              <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="m" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis reversed hide />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="rank" stroke="#10b981" fill="url(#rg)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-300 mb-3">Social Reach & Lead Growth</p>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={MODAL_CHART}>
              <XAxis dataKey="m" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="social" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="leads" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <span className="flex items-center gap-1 text-[10px] text-violet-400"><span className="w-3 h-0.5 bg-violet-500 inline-block" /> Social Reach</span>
            <span className="flex items-center gap-1 text-[10px] text-amber-400"><span className="w-3 h-0.5 bg-amber-500 inline-block" /> Est. Leads</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { icon: Zap, label: 'Optimization Workflow', color: 'text-emerald-300 border-emerald-700/50 hover:bg-emerald-950/30' },
            { icon: ArrowUpRight, label: 'Upsell Discussion', color: 'text-amber-300 border-amber-700/50 hover:bg-amber-950/30' },
            { icon: Calendar, label: 'Strategy Call', color: 'text-blue-300 border-blue-700/50 hover:bg-blue-950/30' },
            { icon: Download, label: 'Export Summary', color: 'text-slate-300 border-slate-700 hover:bg-slate-700/30' },
            { icon: Award, label: 'Case Study Candidate', color: 'text-violet-300 border-violet-700/50 hover:bg-violet-950/30' },
          ].map(a => (
            <button key={a.label} className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border bg-transparent text-[10px] font-medium transition-colors ${a.color}`}>
              <a.icon className="w-3.5 h-3.5" />{a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const FALLBACK = [
  { id: 'c1', company_name: 'Arctic Air HVAC', vertical: 'HVAC', revenue_tier: 'professional', growth_momentum: 'accelerating', roi_score: 91, keywords_improved: 18, social_reach_trend: 'up', lead_signal_strength: 'strong', roi_confidence: 94, social_reach_growth_pct: 42, city: 'Denver', state: 'CO', mrr: 2400 },
  { id: 'c2', company_name: 'ProHeat Systems', vertical: 'HVAC', revenue_tier: 'growth', growth_momentum: 'accelerating', roi_score: 84, keywords_improved: 12, social_reach_trend: 'up', lead_signal_strength: 'strong', roi_confidence: 88, social_reach_growth_pct: 31, city: 'Dallas', state: 'TX', mrr: 1800 },
  { id: 'c3', company_name: 'Mesa Grill Group', vertical: 'Restaurant', revenue_tier: 'growth', growth_momentum: 'stable', roi_score: 71, keywords_improved: 6, social_reach_trend: 'up', lead_signal_strength: 'moderate', roi_confidence: 74, social_reach_growth_pct: 18, city: 'Phoenix', state: 'AZ', mrr: 1600 },
  { id: 'c4', company_name: 'Precision Plumbing', vertical: 'Home Services', revenue_tier: 'professional', growth_momentum: 'accelerating', roi_score: 88, keywords_improved: 22, social_reach_trend: 'up', lead_signal_strength: 'strong', roi_confidence: 91, social_reach_growth_pct: 38, city: 'Charlotte', state: 'NC', mrr: 2200 },
  { id: 'c5', company_name: 'Taco Loco Franchise', vertical: 'Restaurant', revenue_tier: 'starter', growth_momentum: 'stable', roi_score: 62, keywords_improved: 4, social_reach_trend: 'stable', lead_signal_strength: 'moderate', roi_confidence: 66, social_reach_growth_pct: 9, city: 'Austin', state: 'TX', mrr: 900 },
  { id: 'c6', company_name: 'Blue Ridge Roofing', vertical: 'Home Services', revenue_tier: 'growth', growth_momentum: 'declining', roi_score: 48, keywords_improved: -3, social_reach_trend: 'down', lead_signal_strength: 'weak', roi_confidence: 42, social_reach_growth_pct: -12, city: 'Asheville', state: 'NC', mrr: 1400 },
  { id: 'c7', company_name: 'Apex Law Partners', vertical: 'Legal', revenue_tier: 'enterprise', growth_momentum: 'stable', roi_score: 78, keywords_improved: 9, social_reach_trend: 'stable', lead_signal_strength: 'moderate', roi_confidence: 80, social_reach_growth_pct: 14, city: 'Chicago', state: 'IL', mrr: 3200 },
  { id: 'c8', company_name: 'Citywide Dental', vertical: 'Dental', revenue_tier: 'growth', growth_momentum: 'accelerating', roi_score: 85, keywords_improved: 14, social_reach_trend: 'up', lead_signal_strength: 'strong', roi_confidence: 87, social_reach_growth_pct: 27, city: 'Orlando', state: 'FL', mrr: 1900 },
  { id: 'c9', company_name: 'CoolBreeze HVAC', vertical: 'HVAC', revenue_tier: 'starter', growth_momentum: 'declining', roi_score: 44, keywords_improved: -5, social_reach_trend: 'down', lead_signal_strength: 'weak', roi_confidence: 38, social_reach_growth_pct: -18, city: 'Tampa', state: 'FL', mrr: 800 },
];

export default function CPGrowthGrid({ clients = [], filters = {} }) {
  const [selected, setSelected] = useState(null);
  const data = clients.length > 0 ? clients : FALLBACK;

  const filtered = data.filter(c => {
    if (filters.vertical && c.vertical !== filters.vertical) return false;
    if (filters.tier && c.revenue_tier !== filters.tier) return false;
    return true;
  });

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Client Growth Momentum Grid</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((client, i) => {
          const cfg = MOMENTUM_CONFIG[client.growth_momentum] || MOMENTUM_CONFIG.stable;
          const sparkData = (ROI_SPARK[client.growth_momentum] || ROI_SPARK.stable).map((v, idx) => ({ v }));
          const TrendIcon = client.ranking_trend === 'improving' || client.social_reach_trend === 'up' ? TrendingUp
            : client.growth_momentum === 'declining' ? TrendingDown : Minus;
          return (
            <div key={i} onClick={() => setSelected(client)}
              className={`bg-slate-800/60 border ${cfg.border} rounded-2xl p-4 cursor-pointer hover:border-opacity-100 hover:bg-slate-800 transition-all shadow-lg ${cfg.glow}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                    {client.company_name?.[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">{client.company_name}</p>
                    <p className="text-[10px] text-slate-500">{client.vertical} · {client.city}</p>
                  </div>
                </div>
                <Badge className={`text-[9px] px-1.5 ${cfg.badge} capitalize`}>{client.growth_momentum}</Badge>
              </div>

              {/* Growth momentum meter */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500">ROI Score</span>
                  <span className="text-xs font-bold text-white">{client.roi_score}</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full">
                  <div className={`h-full rounded-full ${cfg.bar}`} style={{ width: `${client.roi_score}%` }} />
                </div>
              </div>

              {/* Sparkline */}
              <div className="h-12 mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparkData}>
                    <Line type="monotone" dataKey="v" stroke={client.growth_momentum === 'accelerating' ? '#10b981' : client.growth_momentum === 'declining' ? '#ef4444' : '#f59e0b'} strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <p className="text-[10px] text-slate-600 mb-0.5">Ranking</p>
                  <TrendIcon className={`w-3.5 h-3.5 mx-auto ${client.growth_momentum === 'accelerating' ? 'text-emerald-400' : client.growth_momentum === 'declining' ? 'text-red-400' : 'text-amber-400'}`} />
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-600 mb-0.5">Social</p>
                  <p className={`text-[10px] font-bold ${client.social_reach_growth_pct > 0 ? 'text-emerald-300' : client.social_reach_growth_pct < 0 ? 'text-red-300' : 'text-slate-400'}`}>
                    {client.social_reach_growth_pct > 0 ? '+' : ''}{client.social_reach_growth_pct}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-600 mb-0.5">Leads</p>
                  <p className={`text-[10px] font-bold ${LEAD_COLOR[client.lead_signal_strength]}`}>{client.lead_signal_strength}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {selected && <ClientModal client={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Flame, MapPin, AlertTriangle } from 'lucide-react';

const TOOLTIP_STYLE = { background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 11 };

const LEAD_TREND = [
  { month: 'Oct', leads: 184 }, { month: 'Nov', leads: 196 }, { month: 'Dec', leads: 172 },
  { month: 'Jan', leads: 218 }, { month: 'Feb', leads: 241 }, { month: 'Mar', leads: 268 },
];

const BY_CLIENT = [
  { client: 'Arctic Air', leads: 42 }, { client: 'Precision', leads: 38 }, { client: 'Citywide', leads: 34 },
  { client: 'ProHeat', leads: 29 }, { client: 'Apex Law', leads: 22 }, { client: 'Mesa Grill', leads: 18 },
  { client: 'Taco Loco', leads: 14 }, { client: 'Blue Ridge', leads: 11 }, { client: 'CoolBreeze', leads: 8 },
];

const AI_INSIGHTS = [
  { icon: Flame, color: 'text-orange-400 bg-orange-950/20 border-orange-700/40', headline: 'HVAC demand surge detected', narrative: 'Seasonal spring demand is driving 34% higher HVAC inquiry velocity vs. last year. Arctic Air and ProHeat seeing record lead signals.' },
  { icon: TrendingUp, color: 'text-emerald-400 bg-emerald-950/20 border-emerald-700/40', headline: 'Restaurant video engagement outperforming', narrative: 'Mesa Grill Group video content generating 2.4x more engagement than written posts — conversion signal improving week over week.' },
  { icon: MapPin, color: 'text-red-400 bg-red-950/20 border-red-700/40', headline: 'Low conversion signals in Tampa market', narrative: 'CoolBreeze HVAC Tampa location showing weak inquiry-to-contact conversion. Market may need localized campaign refresh.' },
  { icon: AlertTriangle, color: 'text-amber-400 bg-amber-950/20 border-amber-700/40', headline: 'Seasonal spike window closing for roofing', narrative: 'Blue Ridge Roofing missing spring demand window — content production delays reducing capture rate.' },
];

const SIGNALS_TABLE = [
  { client: 'Arctic Air HVAC', velocity: 'accelerating', conversion: 'strong', seasonal: true, est_leads: 42, growth: '+28%' },
  { client: 'Precision Plumbing', velocity: 'accelerating', conversion: 'strong', seasonal: false, est_leads: 38, growth: '+22%' },
  { client: 'Citywide Dental', velocity: 'accelerating', conversion: 'strong', seasonal: false, est_leads: 34, growth: '+18%' },
  { client: 'ProHeat Systems', velocity: 'stable', conversion: 'moderate', seasonal: true, est_leads: 29, growth: '+12%' },
  { client: 'Apex Law Partners', velocity: 'stable', conversion: 'moderate', seasonal: false, est_leads: 22, growth: '+8%' },
  { client: 'Blue Ridge Roofing', velocity: 'slowing', conversion: 'weak', seasonal: true, est_leads: 11, growth: '-14%' },
  { client: 'CoolBreeze HVAC', velocity: 'slowing', conversion: 'weak', seasonal: true, est_leads: 8, growth: '-22%' },
];

const VELOCITY_BADGE = { accelerating: 'bg-emerald-950 text-emerald-300', stable: 'bg-amber-950 text-amber-300', slowing: 'bg-red-950 text-red-300' };
const CONV_COLOR = { strong: 'text-emerald-300', moderate: 'text-amber-300', weak: 'text-red-300' };

export default function CPLeadFlow({ signals = [] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Lead Flow & Conversion Signals</h2>

      {/* AI insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {AI_INSIGHTS.map((ins, i) => (
          <div key={i} className={`border rounded-xl p-3 ${ins.color}`}>
            <div className="flex items-center gap-2 mb-2">
              <ins.icon className="w-4 h-4" />
              <p className="text-xs font-semibold text-white">{ins.headline}</p>
            </div>
            <p className="text-[10px] text-slate-400">{ins.narrative}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Estimated Lead Volume Trend</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-3">
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={LEAD_TREND}>
                <defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="leads" stroke="#f59e0b" fill="url(#lg)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Lead Volume by Client</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-3">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={BY_CLIENT} barSize={12} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="client" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={70} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="leads" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Inquiry Velocity & Conversion Signals</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-700/50">
            <div className="hidden sm:grid grid-cols-6 gap-2 px-4 py-2 text-[10px] text-slate-600 uppercase tracking-wider">
              <span className="col-span-2">Client</span><span>Velocity</span><span>Conversion</span><span>Est. Leads</span><span>Growth</span>
            </div>
            {SIGNALS_TABLE.map((row, i) => (
              <div key={i} className="flex flex-col sm:grid sm:grid-cols-6 gap-1 sm:gap-2 items-start sm:items-center px-4 py-2.5 hover:bg-slate-700/30">
                <div className="col-span-2 flex items-center gap-2">
                  <p className="text-xs font-medium text-white">{row.client}</p>
                  {row.seasonal && <Flame className="w-3 h-3 text-orange-400" title="Seasonal spike" />}
                </div>
                <Badge className={`text-[9px] px-1.5 w-fit ${VELOCITY_BADGE[row.velocity]}`}>{row.velocity}</Badge>
                <span className={`text-xs font-semibold ${CONV_COLOR[row.conversion]}`}>{row.conversion}</span>
                <span className="text-xs font-bold text-amber-300">{row.est_leads}</span>
                <span className={`text-xs font-bold ${row.growth.startsWith('+') ? 'text-emerald-300' : 'text-red-300'}`}>{row.growth}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
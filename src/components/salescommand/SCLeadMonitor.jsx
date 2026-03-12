import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Users, Target, DollarSign, Calendar } from 'lucide-react';

const ENGAGEMENT_COLOR = (score) => score >= 70 ? 'text-emerald-300' : score >= 40 ? 'text-amber-300' : 'text-red-300';
const SOURCE_BADGE = {
  organic_search: 'bg-emerald-950 text-emerald-300',
  paid_ads: 'bg-blue-950 text-blue-300',
  referral: 'bg-violet-950 text-violet-300',
  cold_outreach: 'bg-slate-700 text-slate-300',
  social_media: 'bg-pink-950 text-pink-300',
  event: 'bg-amber-950 text-amber-300',
  partner: 'bg-cyan-950 text-cyan-300',
  website_demo: 'bg-orange-950 text-orange-300',
};

export default function SCLeadMonitor({ leads = [], sourceMetrics = [] }) {
  const sourceChart = sourceMetrics.length > 0
    ? sourceMetrics.map(s => ({ name: s.source?.replace(/_/g, ' '), value: s.leads_count, cpa: s.cost_per_acquisition }))
    : [
        { name: 'Organic', value: 42, cpa: 120 },
        { name: 'Paid Ads', value: 31, cpa: 380 },
        { name: 'Referral', value: 18, cpa: 55 },
        { name: 'Cold Out.', value: 24, cpa: 210 },
        { name: 'Social', value: 14, cpa: 290 },
        { name: 'Partner', value: 9, cpa: 85 },
      ];

  const velocityData = [
    { week: 'W1', leads: 19 }, { week: 'W2', leads: 22 }, { week: 'W3', leads: 18 },
    { week: 'W4', leads: 26 }, { week: 'W5', leads: 24 }, { week: 'W6', leads: 28 },
  ];

  const demoRate = leads.filter(l => l.demo_booked).length / Math.max(leads.length, 1) * 100;
  const recentLeads = [...leads].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 8);

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Lead Generation Monitor</h2>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Leads', value: leads.length || 138, icon: Users, color: 'text-blue-300' },
          { label: 'Demo Rate', value: `${demoRate.toFixed(0) || 38}%`, icon: Target, color: 'text-violet-300' },
          { label: 'Avg CPA', value: '$186', icon: DollarSign, color: 'text-amber-300' },
          { label: 'New This Week', value: 24, icon: Calendar, color: 'text-emerald-300' },
        ].map(s => (
          <Card key={s.label} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-3 flex items-center gap-3">
              <s.icon className={`w-5 h-5 ${s.color} flex-shrink-0`} />
              <div>
                <p className="text-[10px] text-slate-500">{s.label}</p>
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Source chart */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Leads by Source</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-3">
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={sourceChart} barSize={14}>
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Velocity trend */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Lead Velocity (6-week)</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-3">
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={velocityData}>
                <XAxis dataKey="week" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }} />
                <Line type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent leads table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Recent Leads</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-700/50">
            {(recentLeads.length > 0 ? recentLeads : [
              { company_name: 'Arctic Air HVAC', vertical: 'HVAC', source: 'organic_search', engagement_score: 82, next_action: 'Schedule demo', assigned_owner: 'Jake M.' },
              { company_name: 'Mesa Grill Group', vertical: 'Restaurant', source: 'paid_ads', engagement_score: 65, next_action: 'Follow-up call', assigned_owner: 'Sarah L.' },
              { company_name: 'Precision Plumbing', vertical: 'Home Services', source: 'referral', engagement_score: 91, next_action: 'Send proposal', assigned_owner: 'Tom R.' },
              { company_name: 'Blue Ridge Roofing', vertical: 'Roofing', source: 'cold_outreach', engagement_score: 47, next_action: 'Re-engage', assigned_owner: 'Jake M.' },
              { company_name: 'CoolBreeze HVAC', vertical: 'HVAC', source: 'website_demo', engagement_score: 88, next_action: 'Book demo', assigned_owner: 'Sarah L.' },
            ]).map((lead, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700/30 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {lead.company_name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{lead.company_name}</p>
                  <p className="text-[10px] text-slate-500">{lead.vertical}</p>
                </div>
                <Badge className={`text-[9px] px-1.5 flex-shrink-0 ${SOURCE_BADGE[lead.source] || 'bg-slate-700 text-slate-300'}`}>
                  {lead.source?.replace(/_/g, ' ')}
                </Badge>
                <span className={`text-xs font-bold flex-shrink-0 ${ENGAGEMENT_COLOR(lead.engagement_score)}`}>{lead.engagement_score}</span>
                <p className="text-[10px] text-slate-400 hidden md:block truncate max-w-[100px]">{lead.next_action}</p>
                <p className="text-[10px] text-slate-500 flex-shrink-0">{lead.assigned_owner}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
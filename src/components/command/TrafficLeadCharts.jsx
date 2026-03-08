import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { format, subWeeks, startOfWeek, endOfWeek } from 'date-fns';

const COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function TrafficLeadCharts() {
  const { data: leads = [] } = useQuery({
    queryKey: ['cc-leads'],
    queryFn: () => base44.entities.Lead.list('-created_date', 500)
  });
  const { data: trials = [] } = useQuery({
    queryKey: ['cc-trials'],
    queryFn: () => base44.entities.TrialAccount.list('-created_date', 200)
  });

  // Leads per week (last 8 weeks)
  const weeklyData = Array.from({ length: 8 }, (_, i) => {
    const weekStart = startOfWeek(subWeeks(new Date(), 7 - i));
    const weekEnd = endOfWeek(weekStart);
    const weekLeads = leads.filter(l => {
      const d = new Date(l.created_date);
      return d >= weekStart && d <= weekEnd;
    }).length;
    const weekTrials = trials.filter(t => {
      const d = new Date(t.created_date);
      return d >= weekStart && d <= weekEnd;
    }).length;
    return {
      week: format(weekStart, 'MMM d'),
      leads: weekLeads,
      trials: weekTrials
    };
  });

  // Lead source breakdown
  const sourceMap = {};
  leads.forEach(l => {
    const src = l.source || 'other';
    sourceMap[src] = (sourceMap[src] || 0) + 1;
  });
  const sourceData = Object.entries(sourceMap)
    .map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div>
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Traffic & Lead Intelligence</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Leads over time */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-5">
          <p className="text-sm font-semibold text-white mb-4">Leads & Trials — Last 8 Weeks</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="trialGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff' }} />
              <Area type="monotone" dataKey="leads" stroke="#7c3aed" fill="url(#leadGrad)" name="Leads" strokeWidth={2} />
              <Area type="monotone" dataKey="trials" stroke="#10b981" fill="url(#trialGrad)" name="Trials" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Lead sources */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <p className="text-sm font-semibold text-white mb-4">Top Lead Sources</p>
          {sourceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`} labelLine={false} fontSize={9}>
                  {sourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-500 text-sm">No lead data yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
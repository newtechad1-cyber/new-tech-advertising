import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Target, Clock } from 'lucide-react';

const STAGE_ORDER = ['Lead', 'Qualified', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'];
const STAGE_COLORS = { 'Lead': '#6b7280', 'Qualified': '#3b82f6', 'Proposal Sent': '#a855f7', 'Negotiation': '#f59e0b', 'Closed Won': '#22c55e', 'Closed Lost': '#ef4444' };

function Stat({ label, value, color = 'text-white' }) {
  return (
    <div className="text-center">
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

export default function FounderSales() {
  const { data: leads = [] } = useQuery({ queryKey: ['founder-leads'], queryFn: () => base44.entities.SalesLead.list('-created_date', 300) });
  const { data: deals = [] } = useQuery({ queryKey: ['founder-deals'], queryFn: () => base44.entities.SalesDeal.list('-created_date', 200) });
  const { data: activities = [] } = useQuery({ queryKey: ['founder-activities'], queryFn: () => base44.entities.SalesActivities.list('-created_date', 200) });

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

  const leadsToday = leads.filter(l => new Date(l.created_date) >= todayStart).length;
  const leadsWeek = leads.filter(l => new Date(l.created_date) >= weekAgo).length;
  const demos = activities.filter(a => a.activity_type?.toLowerCase().includes('demo') || a.activity_type?.toLowerCase().includes('call')).length;
  const openDeals = deals.filter(d => !['Closed Won', 'Closed Lost'].includes(d.stage));
  const pipelineValue = openDeals.reduce((s, d) => s + (d.value || 0), 0);
  const closedWon = deals.filter(d => d.stage === 'Closed Won' && new Date(d.updated_date) >= startOfMonth).length;
  const totalClosed = deals.filter(d => ['Closed Won', 'Closed Lost'].includes(d.stage) && new Date(d.updated_date) >= startOfMonth).length;
  const closeRate = totalClosed > 0 ? Math.round((closedWon / totalClosed) * 100) : 0;
  const needsFollowUp = deals.filter(d => !['Closed Won', 'Closed Lost'].includes(d.stage) && new Date(d.updated_date) < sevenDaysAgo);

  const stageData = STAGE_ORDER.map(stage => ({
    stage: stage.split(' ')[0],
    fullStage: stage,
    count: deals.filter(d => d.stage === stage).length,
  })).filter(s => s.count > 0);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-4 h-4 text-orange-400" />
        <h2 className="text-sm font-bold text-white">Sales Snapshot</h2>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-5">
        <Stat label="Leads Today" value={leadsToday} color={leadsToday > 0 ? 'text-green-400' : 'text-gray-400'} />
        <Stat label="Leads Week" value={leadsWeek} color={leadsWeek >= 3 ? 'text-green-400' : 'text-yellow-400'} />
        <Stat label="Demos" value={demos} color="text-blue-400" />
        <Stat label="Pipeline $" value={`$${Math.round(pipelineValue / 1000)}k`} color="text-purple-400" />
        <Stat label="Closed Won" value={closedWon} color="text-green-400" />
        <Stat label="Close Rate" value={`${closeRate}%`} color={closeRate >= 30 ? 'text-green-400' : closeRate > 0 ? 'text-yellow-400' : 'text-gray-400'} />
      </div>
      <div className="flex-1 min-h-[120px] mb-4">
        <p className="text-xs text-gray-500 mb-2">Deals by stage</p>
        {stageData.length > 0 ? (
          <ResponsiveContainer width="100%" height={110}>
            <BarChart data={stageData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="stage" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, fontSize: 11 }} labelFormatter={(l) => stageData.find(s => s.stage === l)?.fullStage || l} formatter={(v) => [v, 'Deals']} itemStyle={{ color: '#e5e7eb' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {stageData.map((entry, i) => <Cell key={i} fill={STAGE_COLORS[entry.fullStage] || '#6b7280'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[110px] flex items-center justify-center text-gray-600 text-sm">No deal data</div>
        )}
      </div>
      {needsFollowUp.length > 0 && (
        <div className="border-t border-gray-800 pt-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Clock className="w-3.5 h-3.5 text-yellow-500" />
            <span className="text-xs font-medium text-yellow-400">{needsFollowUp.length} deal{needsFollowUp.length > 1 ? 's' : ''} needing follow-up</span>
          </div>
          <div className="space-y-1.5 max-h-28 overflow-y-auto">
            {needsFollowUp.slice(0, 5).map(d => (
              <div key={d.id} className="flex items-center justify-between text-xs bg-yellow-900/20 border border-yellow-900/30 rounded-md px-2.5 py-1.5">
                <span className="text-gray-300 truncate max-w-[60%]">{d.deal_name || d.title || 'Unnamed Deal'}</span>
                <span className="text-yellow-500 flex-shrink-0">{d.stage}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
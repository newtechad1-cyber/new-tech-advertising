import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Users } from 'lucide-react';

export default function SalesTeamTable() {
  const { data: leads = [] } = useQuery({ queryKey: ['sc-leads'], queryFn: () => base44.entities.SalesLeads.list('-created_date', 500) });
  const { data: deals = [] } = useQuery({ queryKey: ['sc-deals'], queryFn: () => base44.entities.SalesDeals.list('-created_date', 500) });
  const { data: activities = [] } = useQuery({ queryKey: ['sc-activities'], queryFn: () => base44.entities.SalesActivities.list('-created_date', 500) });

  const reps = Array.from(new Set([
    ...leads.filter(l => l.assigned_to).map(l => l.assigned_to),
    ...deals.filter(d => d.assigned_to).map(d => d.assigned_to),
  ]));

  if (reps.length === 0) {
    return (
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
        <Users className="w-8 h-8 text-gray-700 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">No sales rep assignments found. Assign reps to leads and deals to see performance.</p>
      </div>
    );
  }

  const repStats = reps.map(rep => {
    const assignedLeads = leads.filter(l => l.assigned_to === rep);
    const assignedDeals = deals.filter(d => d.assigned_to === rep);
    const demosCompleted = activities.filter(a => a.activity_type === 'demo' && a.user === rep).length;
    const dealsClosedWon = assignedDeals.filter(d => d.stage === 'closed_won');
    const totalClosed = assignedDeals.filter(d => ['closed_won', 'closed_lost'].includes(d.stage)).length;
    const convRate = totalClosed > 0 ? Math.round((dealsClosedWon.length / totalClosed) * 100) : 0;
    const revenue = dealsClosedWon.reduce((s, d) => s + (d.deal_value || 0), 0);
    return { rep, leadsAssigned: assignedLeads.length, demosCompleted, dealsClosed: dealsClosedWon.length, convRate, revenue };
  }).sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
        <Users className="w-4 h-4 text-blue-400" />
        <h2 className="text-sm font-bold text-white">Sales Team Performance</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Rep</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">Leads Assigned</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">Demos</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">Deals Closed</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">Conv. Rate</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {repStats.map((r, i) => (
              <tr key={r.rep} className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${i === 0 ? 'bg-yellow-900/10' : ''}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {i === 0 && <span className="text-yellow-400 text-xs">🏆</span>}
                    <div>
                      <p className="text-xs font-semibold text-white">{r.rep.split('@')[0]}</p>
                      <p className="text-xs text-gray-600">{r.rep}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-xs text-gray-300">{r.leadsAssigned}</td>
                <td className="px-4 py-3 text-center text-xs text-gray-300">{r.demosCompleted}</td>
                <td className="px-4 py-3 text-center text-xs font-bold text-green-400">{r.dealsClosed}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.convRate >= 30 ? 'bg-green-900/40 text-green-400' : r.convRate > 0 ? 'bg-yellow-900/40 text-yellow-400' : 'bg-gray-800 text-gray-500'}`}>
                    {r.convRate}%
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-xs font-bold text-green-400">${r.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
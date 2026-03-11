import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Users, Medal } from 'lucide-react';

export default function TeamPerformanceSnapshot() {
  const { data: deals = [] } = useQuery({
    queryKey: ['team-performance'],
    queryFn: () => base44.entities.SalesDeals?.list?.('-created_date', 500).catch(() => []),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['team-users'],
    queryFn: () => base44.entities.User?.list?.('-updated_date', 50).catch(() => []),
  });

  // Aggregate by sales rep (assuming owner field)
  const teamStats = {};
  deals.forEach(deal => {
    const owner = deal.owner_email || 'Unassigned';
    if (!teamStats[owner]) {
      teamStats[owner] = { dealsCount: 0, totalValue: 0, wonCount: 0, wonValue: 0 };
    }
    teamStats[owner].dealsCount += 1;
    teamStats[owner].totalValue += deal.deal_value || 0;
    if (deal.stage === 'closed_won') {
      teamStats[owner].wonCount += 1;
      teamStats[owner].wonValue += deal.deal_value || 0;
    }
  });

  const teamPerformance = Object.entries(teamStats)
    .map(([email, stats]) => ({
      email,
      name: email.split('@')[0],
      ...stats,
      winRate: stats.dealsCount > 0 ? Math.round((stats.wonCount / stats.dealsCount) * 100) : 0,
    }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 4);

  const topPerformer = teamPerformance[0];

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-400" />
        Team Performance
      </h3>

      <div className="space-y-3">
        {teamPerformance.map((member, idx) => (
          <div
            key={idx}
            className={`border rounded-lg p-3 transition-all ${
              idx === 0
                ? 'bg-amber-900/30 border-amber-700'
                : 'bg-slate-800/50 border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {idx === 0 && <Medal className="w-4 h-4 text-amber-400" />}
                <div>
                  <p className="text-sm font-semibold text-white capitalize">{member.name}</p>
                  <p className="text-xs text-slate-400">{member.dealsCount} deals</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-400">${(member.totalValue / 1000).toFixed(0)}k</p>
                <p className="text-xs text-slate-400">{member.winRate}% win rate</p>
              </div>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-blue-600 to-blue-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(member.wonCount / member.dealsCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {teamPerformance.length === 0 && (
        <div className="text-center py-4 text-slate-500">
          <p className="text-sm">No team data available</p>
        </div>
      )}
    </div>
  );
}
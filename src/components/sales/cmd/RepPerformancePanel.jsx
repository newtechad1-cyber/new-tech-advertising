import React from 'react';
import { Users, TrendingUp } from 'lucide-react';

export default function RepPerformancePanel({ deals = [] }) {
  // Group by assigned rep
  const repMap = {};
  deals.forEach(deal => {
    const rep = deal.assigned_to || 'Unassigned';
    if (!repMap[rep]) {
      repMap[rep] = {
        count: 0,
        value: 0,
        won: 0,
        wonValue: 0,
        overdue: 0,
      };
    }
    repMap[rep].count++;
    repMap[rep].value += deal.deal_value || 0;

    if (deal.stage === 'closed_won') {
      repMap[rep].won++;
      repMap[rep].wonValue += deal.deal_value || 0;
    }

    // Count overdue follow-ups
    if (deal.next_followup_date && new Date(deal.next_followup_date) < new Date()) {
      repMap[rep].overdue++;
    }
  });

  const reps = Object.entries(repMap)
    .map(([rep, data]) => ({
      rep,
      ...data,
      closeRate: data.count > 0 ? Math.round((data.won / data.count) * 100) : 0,
    }))
    .sort((a, b) => b.wonValue - a.wonValue);

  const totalValue = reps.reduce((sum, r) => sum + r.value, 0);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 px-4 py-3 flex items-center gap-2">
        <Users className="w-4 h-4 text-violet-400" />
        <h3 className="text-sm font-bold text-white">Sales Rep Performance</h3>
      </div>

      <div className="divide-y divide-slate-700 max-h-96 overflow-y-auto">
        {reps.length === 0 ? (
          <div className="px-4 py-6 text-center text-slate-500 text-sm">No deals assigned</div>
        ) : (
          reps.map(rep => {
            const percentOfTotal = totalValue > 0 ? (rep.value / totalValue) * 100 : 0;
            const repName = rep.rep === 'Unassigned' ? 'Unassigned' : rep.rep.split('@')[0];

            return (
              <div key={rep.rep} className="px-4 py-3 hover:bg-slate-800/50 transition-colors">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{repName}</p>
                  </div>
                  <div className="ml-3 text-right">
                    <p className="text-sm font-bold text-emerald-400">
                      ${(rep.wonValue / 1000).toFixed(0)}k won
                    </p>
                    <p className="text-xs text-slate-500">
                      {rep.won}/{rep.count} deals
                    </p>
                  </div>
                </div>

                {/* Pipeline bar */}
                <div className="mb-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-violet-400 transition-all"
                    style={{ width: `${percentOfTotal}%` }}
                  />
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span>${(rep.value / 1000).toFixed(0)}k pipeline</span>
                  <div className="flex items-center gap-2">
                    {rep.closeRate > 0 && (
                      <span className={rep.closeRate >= 50 ? 'text-green-400' : 'text-yellow-400'}>
                        {rep.closeRate}% close rate
                      </span>
                    )}
                    {rep.overdue > 0 && (
                      <span className="text-orange-400 font-semibold">{rep.overdue} overdue</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
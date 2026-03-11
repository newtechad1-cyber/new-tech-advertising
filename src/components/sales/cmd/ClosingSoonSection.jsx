import React from 'react';
import { TrendingUp, Calendar } from 'lucide-react';

export default function ClosingSoonSection({ deals = [] }) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

  const closingSoon = deals
    .filter(d => {
      if (!d.closing_date || d.stage === 'closed_lost' || d.stage === 'closed_won') return false;
      const closeDate = new Date(d.closing_date);
      return closeDate >= now && closeDate <= endOfMonth;
    })
    .sort((a, b) => new Date(a.closing_date) - new Date(b.closing_date));

  const totalValue = closingSoon.reduce((sum, d) => sum + (d.deal_value || 0), 0);

  return (
    <div className="bg-slate-900 border border-emerald-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Closing This Month</h3>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-emerald-400">
            ${(totalValue / 1000).toFixed(0)}k
          </p>
          <p className="text-xs text-slate-400">{closingSoon.length} deals</p>
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {closingSoon.length > 0 ? (
          closingSoon.map(deal => {
            const daysUntilClose = Math.ceil((new Date(deal.closing_date) - now) / (1000 * 60 * 60 * 24));
            const urgency = daysUntilClose <= 3 ? 'text-red-400' : daysUntilClose <= 7 ? 'text-orange-400' : 'text-emerald-400';
            
            return (
              <div key={deal.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 hover:bg-slate-800 transition-colors">
                <div className="flex items-start justify-between mb-1">
                  <p className="font-semibold text-white text-sm truncate">{deal.company_name}</p>
                  <span className={`text-xs font-bold ${urgency}`}>
                    {daysUntilClose === 0 ? 'TODAY' : `${daysUntilClose}d`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <p className="text-slate-400">
                    {new Date(deal.closing_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="font-bold text-amber-400">
                    ${(deal.deal_value / 1000).toFixed(0)}k
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-slate-500">
            <p className="text-sm">No deals closing this month</p>
          </div>
        )}
      </div>
    </div>
  );
}
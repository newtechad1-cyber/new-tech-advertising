import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { TrendingUp, AlertTriangle } from 'lucide-react';

export default function RevenueMomentumPanel() {
  const { data: deals = [] } = useQuery({
    queryKey: ['revenue-momentum-deals'],
    queryFn: () => base44.entities.SalesDeals?.list?.('-created_date', 500).catch(() => []),
  });

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

  const thisMonthRevenue = deals
    .filter(d => d.stage === 'closed_won' && d.created_date)
    .filter(d => {
      const dateObj = new Date(d.created_date);
      return dateObj.getMonth() === currentMonth && dateObj.getFullYear() === currentYear;
    })
    .reduce((sum, d) => sum + (d.deal_value || 0), 0);

  const nextMonthExpected = deals
    .filter(d => d.stage !== 'closed_lost' && d.closing_date)
    .filter(d => {
      const closeDate = new Date(d.closing_date);
      return closeDate.getMonth() === nextMonth && closeDate.getFullYear() === nextYear;
    })
    .reduce((sum, d) => sum + ((d.deal_value || 0) * ((d.probability || 50) / 100)), 0);

  const atRisk = deals
    .filter(d => d.stage === 'negotiation' && (d.deal_value || 0) > 5000)
    .reduce((sum, d) => sum + (d.deal_value || 0), 0);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-emerald-400" />
        Revenue Momentum
      </h3>

      <div className="space-y-4">
        {/* This Month */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-400">Revenue Won (This Month)</p>
            <p className="text-lg font-bold text-emerald-400">${(thisMonthRevenue / 1000).toFixed(0)}k</p>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-2 rounded-full"
              style={{ width: '68%' }}
            />
          </div>
        </div>

        {/* Next Month Expected */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-400">Expected Revenue (Next Month)</p>
            <p className="text-lg font-bold text-blue-400">${(nextMonthExpected / 1000).toFixed(0)}k</p>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full"
              style={{ width: `${Math.min(Math.floor((nextMonthExpected / (thisMonthRevenue || 1)) * 50), 100)}%` }}
            />
          </div>
        </div>

        {/* At Risk */}
        {atRisk > 0 && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 mt-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <p className="text-xs font-semibold text-red-400">Revenue at Risk</p>
            </div>
            <p className="text-sm text-red-300">${(atRisk / 1000).toFixed(0)}k in stalled negotiations</p>
          </div>
        )}
      </div>
    </div>
  );
}
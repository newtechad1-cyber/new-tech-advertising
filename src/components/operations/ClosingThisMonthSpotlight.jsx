import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Target, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

export default function ClosingThisMonthSpotlight() {
  const { data: deals = [] } = useQuery({
    queryKey: ['closing-this-month'],
    queryFn: () => base44.entities.SalesDeals?.list?.('-deal_value', 500).catch(() => []),
  });

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

  const closingDeals = deals
    .filter(d => {
      if (!d.closing_date || d.stage === 'closed_lost' || d.stage === 'closed_won') return false;
      const closeDate = new Date(d.closing_date);
      return closeDate >= now && closeDate <= endOfMonth;
    })
    .sort((a, b) => (b.deal_value || 0) - (a.deal_value || 0))
    .slice(0, 5);

  const totalClosingValue = closingDeals.reduce((sum, d) => sum + (d.deal_value || 0), 0);
  const daysLeft = Math.ceil((endOfMonth - now) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-gradient-to-br from-violet-900/30 to-slate-900 border border-violet-700 rounded-xl p-6">
      <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
        <Target className="w-5 h-5 text-violet-400" />
        Closing This Month
      </h3>
      <p className="text-xs text-slate-400 mb-4">{daysLeft} days remaining</p>

      <div className="mb-4">
        <p className="text-xs text-slate-400 mb-1">Total Pipeline Closing</p>
        <p className="text-3xl font-bold text-violet-400">${(totalClosingValue / 1000).toFixed(0)}k</p>
      </div>

      <div className="space-y-2 mb-4">
        {closingDeals.map((deal, idx) => (
          <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-white truncate">{deal.company_name}</p>
              <p className="text-sm font-bold text-violet-400 ml-2">${(deal.deal_value / 1000).toFixed(0)}k</p>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{deal.stage.replace(/_/g, ' ')}</span>
              {deal.closing_date && (
                <span>{new Date(deal.closing_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {closingDeals.length === 0 && (
        <div className="text-center py-4 text-slate-500">
          <p className="text-sm">No deals closing this month</p>
        </div>
      )}

      <Link to={createPageUrl('AdminSales')}>
        <Button size="sm" variant="ghost" className="w-full text-violet-400 hover:text-violet-300 gap-1.5">
          <TrendingUp className="w-3 h-3" />
          View Sales Pipeline
        </Button>
      </Link>
    </div>
  );
}
import React, { useMemo } from 'react';
import { TrendingUp, Target, DollarSign, CheckCircle } from 'lucide-react';

export default function PipelineMetrics({ opportunities, timeFrame = '30days' }) {
  const metrics = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentDeals = opportunities.filter((opp) => {
      const closedDate = opp.closed_date ? new Date(opp.closed_date) : null;
      return closedDate && closedDate >= thirtyDaysAgo;
    });

    const closedWonCount = opportunities.filter((opp) => opp.decision_status === 'closed_won')
      .length;
    const totalClosed = opportunities.filter(
      (opp) => opp.decision_status === 'closed_won' || opp.decision_status === 'closed_lost'
    ).length;
    const closeRate = totalClosed > 0 ? Math.round((closedWonCount / totalClosed) * 100) : 0;

    const totalPipeline = opportunities
      .filter((opp) => opp.decision_status !== 'closed_lost')
      .reduce((sum, opp) => sum + (opp.estimated_deal_value || 0), 0);

    const monthlyClosedValue = recentDeals
      .filter((opp) => opp.decision_status === 'closed_won')
      .reduce((sum, opp) => sum + (opp.estimated_deal_value || 0), 0);

    const avgDealSize =
      closedWonCount > 0
        ? Math.round(
            opportunities
              .filter((opp) => opp.decision_status === 'closed_won')
              .reduce((sum, opp) => sum + (opp.estimated_deal_value || 0), 0) / closedWonCount
          )
        : 0;

    return {
      closedWonCount,
      closeRate,
      totalPipeline,
      monthlyClosedValue,
      avgDealSize,
      stageBreakdown: {
        new_lead: opportunities.filter((opp) => opp.stage === 'new_lead').length,
        discovery: opportunities.filter((opp) => opp.stage === 'discovery').length,
        demo: opportunities.filter((opp) => opp.stage === 'demo').length,
        proposal: opportunities.filter((opp) => opp.stage === 'proposal').length,
        decision: opportunities.filter((opp) => opp.stage === 'decision').length,
      },
    };
  }, [opportunities]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {/* Closed Won Count */}
      <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-4 border border-green-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-green-200/70 uppercase tracking-wide">Closed Won</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{metrics.closedWonCount}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-500/50" />
        </div>
      </div>

      {/* Close Rate */}
      <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-4 border border-purple-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-purple-200/70 uppercase tracking-wide">Close Rate</p>
            <p className="text-2xl font-bold text-purple-400 mt-1">{metrics.closeRate}%</p>
          </div>
          <TrendingUp className="w-8 h-8 text-purple-500/50" />
        </div>
      </div>

      {/* Total Pipeline */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4 border border-blue-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-200/70 uppercase tracking-wide">Total Pipeline</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">
              ${(metrics.totalPipeline / 1000).toFixed(0)}k
            </p>
          </div>
          <Target className="w-8 h-8 text-blue-500/50" />
        </div>
      </div>

      {/* Monthly Closed Value */}
      <div className="bg-gradient-to-br from-amber-900 to-amber-800 rounded-lg p-4 border border-amber-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-200/70 uppercase tracking-wide">This Month</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">
              ${(metrics.monthlyClosedValue / 1000).toFixed(0)}k
            </p>
          </div>
          <DollarSign className="w-8 h-8 text-amber-500/50" />
        </div>
      </div>

      {/* Avg Deal Size */}
      <div className="bg-gradient-to-br from-rose-900 to-rose-800 rounded-lg p-4 border border-rose-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-rose-200/70 uppercase tracking-wide">Avg Deal</p>
            <p className="text-2xl font-bold text-rose-400 mt-1">
              ${(metrics.avgDealSize / 1000).toFixed(0)}k
            </p>
          </div>
          <DollarSign className="w-8 h-8 text-rose-500/50" />
        </div>
      </div>
    </div>
  );
}
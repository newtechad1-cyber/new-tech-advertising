import React from 'react';
import { TrendingUp } from 'lucide-react';

const STAGE_PROBABILITIES = {
  new_lead: 10,
  contacted: 15,
  qualified: 25,
  demo_scheduled: 40,
  proposal_sent: 60,
  negotiation: 80,
  closed_won: 100,
  closed_lost: 0,
};

export default function RevenueForecaster({ deals = [] }) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;

  // Current month closings
  const closingThisMonth = deals.filter(d => {
    if (!d.closing_date || d.stage === 'closed_lost') return false;
    const closeDate = new Date(d.closing_date);
    return closeDate.getMonth() === currentMonth;
  });

  // Next month closings
  const closingNextMonth = deals.filter(d => {
    if (!d.closing_date || d.stage === 'closed_lost') return false;
    const closeDate = new Date(d.closing_date);
    return closeDate.getMonth() === nextMonth;
  });

  // Already closed
  const closedWon = deals.filter(d => d.stage === 'closed_won');

  // Pipeline total
  const pipelineTotal = deals
    .filter(d => !['closed_won', 'closed_lost'].includes(d.stage))
    .reduce((sum, d) => sum + (d.deal_value || 0), 0);

  // Weighted forecast (probability-adjusted)
  const weightedForecast = deals
    .filter(d => !['closed_won', 'closed_lost'].includes(d.stage))
    .reduce((sum, d) => {
      const probability = STAGE_PROBABILITIES[d.stage] || 0;
      return sum + (d.deal_value || 0) * (probability / 100);
    }, 0);

  // Expected this month
  const expectedThisMonth = closingThisMonth.reduce((sum, d) => sum + (d.deal_value || 0), 0);

  // Expected next month
  const expectedNextMonth = closingNextMonth.reduce((sum, d) => sum + (d.deal_value || 0), 0);

  // Weighted next month (includes in-progress)
  const weightedNextMonth =
    expectedNextMonth +
    deals
      .filter(d => ['demo_scheduled', 'proposal_sent', 'negotiation'].includes(d.stage))
      .reduce((sum, d) => {
        const probability = STAGE_PROBABILITIES[d.stage] || 0;
        return sum + (d.deal_value || 0) * (probability / 100);
      }, 0);

  const closedThisMonth = closedWon.reduce((sum, d) => sum + (d.deal_value || 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Left: Current State */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Pipeline Overview</h3>
        </div>

        <div className="space-y-4">
          {/* Pipeline Total */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">Active Pipeline</p>
            <p className="text-2xl font-bold text-emerald-400">
              ${(pipelineTotal / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {deals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage)).length} deals
            </p>
          </div>

          {/* Weighted Forecast */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">Weighted Forecast (Probability-Adjusted)</p>
            <p className="text-2xl font-bold text-violet-400">
              ${(weightedForecast / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-slate-600 mt-1">
              {Math.round((weightedForecast / pipelineTotal) * 100)}% confidence
            </p>
          </div>

          {/* Closed This Month */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">Closed Won (This Month)</p>
            <p className="text-2xl font-bold text-green-400">
              ${(closedThisMonth / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-slate-600 mt-1">
              {closedWon.length} won {closedWon.length === 1 ? 'deal' : 'deals'}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Monthly Forecast */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
        <h3 className="text-sm font-bold text-white mb-4">Monthly Revenue Forecast</h3>

        <div className="space-y-3">
          {/* This Month Expected */}
          <div className="bg-amber-900/20 border border-amber-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-amber-400 font-semibold">This Month (Expected)</p>
              <p className="text-xs text-slate-500">
                {closingThisMonth.length} {closingThisMonth.length === 1 ? 'deal' : 'deals'}
              </p>
            </div>
            <p className="text-xl font-bold text-amber-400">
              ${(expectedThisMonth / 1000000).toFixed(1)}M
            </p>
          </div>

          {/* Next Month Expected */}
          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-blue-400 font-semibold">Next Month (Expected)</p>
              <p className="text-xs text-slate-500">
                {closingNextMonth.length} {closingNextMonth.length === 1 ? 'deal' : 'deals'}
              </p>
            </div>
            <p className="text-xl font-bold text-blue-400">
              ${(expectedNextMonth / 1000000).toFixed(1)}M
            </p>
          </div>

          {/* Next Month Weighted */}
          <div className="bg-violet-900/20 border border-violet-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-violet-400 font-semibold">Next Month (Weighted)</p>
              <p className="text-xs text-slate-500">Conservative estimate</p>
            </div>
            <p className="text-xl font-bold text-violet-400">
              ${(weightedNextMonth / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
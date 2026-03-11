import React from 'react';
import { Percent, TrendingUp } from 'lucide-react';

const LEAD_SOURCE_LABELS = {
  website: '🌐 Website',
  referral: '👥 Referral',
  facebook: 'f Facebook',
  seo: '🔍 SEO',
  cold_outreach: '📞 Cold Outreach',
  existing_client: '⭐ Existing Client Upsell',
  demo_request: '🎬 Demo Request',
  school_tv: '📺 School TV Lead',
  ada: '♿ ADA Website',
  trial_signup: '🎯 Trial Signup',
};

export default function LeadSourcePanel({ deals = [] }) {
  // Group by lead source
  const sourceMap = {};
  deals.forEach(deal => {
    const source = deal.lead_source || 'unknown';
    if (!sourceMap[source]) {
      sourceMap[source] = {
        count: 0,
        value: 0,
        closed: 0,
      };
    }
    sourceMap[source].count++;
    sourceMap[source].value += deal.deal_value || 0;
    if (deal.stage === 'closed_won') {
      sourceMap[source].closed += deal.deal_value || 0;
    }
  });

  const sources = Object.entries(sourceMap)
    .map(([source, data]) => ({
      source,
      ...data,
      winRate: data.count > 0 ? Math.round((data.closed / data.value || 0) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value);

  const totalValue = sources.reduce((sum, s) => sum + s.value, 0);
  const totalClosed = sources.reduce((sum, s) => sum + s.closed, 0);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 px-4 py-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-bold text-white">Lead Source Performance</h3>
      </div>

      <div className="divide-y divide-slate-700">
        {sources.length === 0 ? (
          <div className="px-4 py-6 text-center text-slate-500 text-sm">No deals yet</div>
        ) : (
          sources.map(source => {
            const percentOfTotal = totalValue > 0 ? (source.value / totalValue) * 100 : 0;

            return (
              <div key={source.source} className="px-4 py-3 hover:bg-slate-800/50 transition-colors">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">
                      {LEAD_SOURCE_LABELS[source.source] || source.source}
                    </p>
                  </div>
                  <div className="ml-3 text-right">
                    <p className="text-sm font-bold text-amber-400">
                      ${(source.value / 1000).toFixed(0)}k
                    </p>
                    <p className="text-xs text-slate-500">{source.count} leads</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all"
                    style={{ width: `${percentOfTotal}%` }}
                  />
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                  <span>${(source.closed / 1000).toFixed(0)}k closed</span>
                  {source.closed > 0 && (
                    <div className="flex items-center gap-1 text-green-400">
                      <Percent className="w-3 h-3" />
                      <span className="font-semibold">
                        {Math.round((source.closed / source.value) * 100)}% win rate
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
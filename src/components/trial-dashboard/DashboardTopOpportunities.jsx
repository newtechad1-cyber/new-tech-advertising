import React from 'react';
import { Lightbulb, ArrowRight, Sparkles } from 'lucide-react';

export default function DashboardTopOpportunities({ opportunities, readinessState }) {
  if (!opportunities || opportunities.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center">
        <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-300 font-medium mb-1">Finding Your Best Opportunities</p>
        <p className="text-slate-500 text-sm">
          We're analyzing your market and business to identify the best first steps.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
        <Lightbulb className="w-5 h-5 text-amber-400" />
        Your Top Opportunities
      </h3>

      <div className="space-y-4">
        {opportunities.slice(0, 3).map((opp, idx) => (
          <div
            key={opp.id}
            className="bg-slate-800/50 border border-slate-700 hover:border-slate-600 rounded-lg p-5 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-violet-600/30 border border-violet-500/50 rounded-full text-xs font-bold text-violet-300">
                    {idx + 1}
                  </span>
                  <h4 className="text-white font-semibold">{opp.title}</h4>
                </div>
                {opp.description && (
                  <p className="text-slate-400 text-sm leading-relaxed">{opp.description}</p>
                )}
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 flex-shrink-0 mt-0.5 transition-colors" />
            </div>

            {opp.overall_opportunity_score && (
              <div className="flex items-center gap-2 mt-3">
                <div className="h-1.5 flex-1 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                    style={{ width: `${Math.min(opp.overall_opportunity_score, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400">{Math.round(opp.overall_opportunity_score)}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
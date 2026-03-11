import React from 'react';
import { AlertCircle, TrendingUp, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CommandStrip({ deals = [] }) {
  const now = new Date();
  const overdueFolowups = deals.filter(d => 
    d.next_followup_date && new Date(d.next_followup_date) < now
  );
  const atRisk = deals.filter(d => 
    d.stage === 'negotiation' && (d.deal_value || 0) > 5000
  );
  const healthyPipeline = deals.filter(d => 
    !['closed_won', 'closed_lost'].includes(d.stage)
  ).length;

  const nextAction = deals
    .filter(d => d.stage === 'demo_scheduled' || (d.stage === 'contacted' && (d.deal_value || 0) > 10000))
    .sort((a, b) => (b.deal_value || 0) - (a.deal_value || 0))[0];

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Pipeline Health */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-400">Pipeline Health</span>
        </div>
        <p className="text-lg font-bold text-emerald-400">{healthyPipeline}</p>
        <p className="text-xs text-slate-500">active deals</p>
      </div>

      {/* Revenue at Risk */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <AlertCircle className="w-4 h-4 text-orange-400" />
          <span className="text-xs font-semibold text-slate-400">At Risk</span>
        </div>
        <p className="text-lg font-bold text-orange-400">
          ${(atRisk.reduce((sum, d) => sum + (d.deal_value || 0), 0) / 1000).toFixed(0)}k
        </p>
        <p className="text-xs text-slate-500">{atRisk.length} in negotiation</p>
      </div>

      {/* Overdue Follow-Ups */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-red-400" />
          <span className="text-xs font-semibold text-slate-400">Overdue</span>
        </div>
        <p className="text-lg font-bold text-red-400">{overdueFolowups.length}</p>
        <p className="text-xs text-slate-500">follow-ups needed</p>
      </div>

      {/* Next Best Action */}
      <div className="bg-slate-900/50 border border-violet-700 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-semibold text-slate-400">Next Action</span>
        </div>
        {nextAction ? (
          <>
            <p className="text-xs font-semibold text-violet-400 truncate">{nextAction.company_name}</p>
            <p className="text-xs text-slate-500">{nextAction.stage === 'demo_scheduled' ? 'Ready for demo' : 'High-value contact'}</p>
          </>
        ) : (
          <p className="text-xs text-slate-500">All set!</p>
        )}
      </div>
    </div>
  );
}
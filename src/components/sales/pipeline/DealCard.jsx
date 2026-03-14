import React from 'react';
import { Calendar, TrendingUp, AlertCircle } from 'lucide-react';

const stageBadges = {
  new_lead: 'bg-slate-600',
  discovery: 'bg-blue-600',
  demo: 'bg-purple-600',
  proposal: 'bg-amber-600',
  decision: 'bg-rose-600',
  closed_won: 'bg-green-600',
  closed_lost: 'bg-red-600',
};

export default function DealCard({ opportunity, onClick }) {
  return (
    <div
      onClick={onClick}
      className="p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-500 cursor-pointer transition-colors"
    >
      {/* Company and Lead Score */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-white text-sm">{opportunity.company_name}</h4>
          <p className="text-xs text-slate-400">{opportunity.contact_name}</p>
        </div>
        {opportunity.lead_score > 0 && (
          <div className="flex items-center gap-1 ml-2">
            <TrendingUp className="w-3 h-3 text-amber-400" />
            <span className="text-xs font-bold text-amber-400">{opportunity.lead_score}</span>
          </div>
        )}
      </div>

      {/* Deal Value */}
      {opportunity.estimated_deal_value > 0 && (
        <p className="text-sm font-bold text-green-400 mb-2">
          ${opportunity.estimated_deal_value.toLocaleString()}
        </p>
      )}

      {/* Status and Details */}
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <span className={`${stageBadges[opportunity.stage]} text-white px-2 py-1 rounded text-xs`}>
          {opportunity.stage.replace('_', ' ')}
        </span>
        {opportunity.decision_timeline && opportunity.decision_timeline !== 'exploring' && (
          <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
            {opportunity.decision_timeline.replace('_', ' ')}
          </span>
        )}
      </div>

      {/* Engagement/Objections */}
      {opportunity.objection_notes && (
        <div className="flex items-start gap-1 text-xs text-rose-400 mb-2">
          <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
          <span>{opportunity.objection_notes.substring(0, 40)}...</span>
        </div>
      )}

      {/* Demo Status */}
      {opportunity.demo_scheduled_date && (
        <div className="flex items-center gap-1 text-xs text-blue-300">
          <Calendar className="w-3 h-3" />
          <span>Demo: {new Date(opportunity.demo_scheduled_date).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
}
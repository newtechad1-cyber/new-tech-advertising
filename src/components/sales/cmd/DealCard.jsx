import React from 'react';
import { AlertCircle, Clock, Zap, Target } from 'lucide-react';

const HEALTH_INDICATORS = {
  no_followup: { icon: AlertCircle, label: 'No Follow-Up', color: 'text-red-400' },
  overdue: { icon: Clock, label: 'Overdue', color: 'text-orange-400' },
  stalled: { icon: AlertCircle, label: 'Stalled', color: 'text-yellow-400' },
  high_value: { icon: Target, label: 'High Value', color: 'text-green-400' },
  hot: { icon: Zap, label: 'Hot Lead', color: 'text-violet-400' },
};

export default function DealCard({ deal, onOpen, stageColor }) {
  const getHealthIndicators = () => {
    const indicators = [];
    if (!deal.next_followup_date) indicators.push('no_followup');
    if (deal.next_followup_date && new Date(deal.next_followup_date) < new Date()) indicators.push('overdue');
    if (deal.deal_value > 10000) indicators.push('high_value');
    return indicators.slice(0, 2);
  };

  const indicators = getHealthIndicators();
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(deal.deal_value || 0);

  return (
    <button
      onClick={onOpen}
      className="w-full bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 rounded-lg p-3 text-left transition-all cursor-pointer group"
    >
      {/* Company & Contact */}
      <div className="mb-2">
        <p className="text-sm font-bold text-white truncate">{deal.company_name}</p>
        <p className="text-xs text-slate-400 truncate">{deal.contact_name || deal.email}</p>
      </div>

      {/* Deal Value */}
      <div className="mb-2 pb-2 border-b border-slate-600">
        <p className="text-sm font-bold text-amber-400">{formattedValue}</p>
        {deal.probability && (
          <p className="text-xs text-slate-400">
            Probability: <span className="text-slate-300">{deal.probability}%</span>
          </p>
        )}
      </div>

      {/* Lead Source & Rep */}
      <div className="mb-2 space-y-1">
        {deal.lead_source && (
          <p className="text-xs text-slate-400">
            <span className="text-slate-500">Source:</span> {deal.lead_source}
          </p>
        )}
        {deal.assigned_to && (
          <p className="text-xs text-slate-400">
            <span className="text-slate-500">Owner:</span> {deal.assigned_to.split('@')[0]}
          </p>
        )}
      </div>

      {/* Next Follow-Up */}
      {deal.next_followup_date && (
        <div className="mb-2 pb-2 border-b border-slate-600">
          <p className="text-xs text-slate-400">
            <span className="text-slate-500">Follow-up:</span>{' '}
            {new Date(deal.next_followup_date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
      )}

      {/* Health Indicators */}
      {indicators.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {indicators.map(ind => {
            const Icon = HEALTH_INDICATORS[ind].icon;
            return (
              <div
                key={ind}
                className={`flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full bg-slate-600/40 ${HEALTH_INDICATORS[ind].color}`}
              >
                <Icon className="w-2.5 h-2.5" />
                <span>{HEALTH_INDICATORS[ind].label}</span>
              </div>
            );
          })}
        </div>
      )}
    </button>
  );
}
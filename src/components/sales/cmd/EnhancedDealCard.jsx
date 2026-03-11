import React from 'react';
import { AlertCircle, Clock, Zap, Target, MessageCircle } from 'lucide-react';

export default function EnhancedDealCard({ deal, onOpen }) {
  const now = new Date();
  const isHighValue = (deal.deal_value || 0) > 10000;
  const isStalled = deal.last_activity_date && 
    new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) > new Date(deal.last_activity_date);
  const isOverdue = deal.next_followup_date && new Date(deal.next_followup_date) < now;
  const isHot = deal.stage === 'demo_scheduled' || deal.stage === 'proposal_sent';
  const isRecentlyWon = deal.stage === 'closed_won' && 
    new Date(deal.updated_date || 0) > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Determine urgency color
  let urgencyColor = 'border-slate-600';
  let urgencyGlow = '';
  if (isRecentlyWon) {
    urgencyColor = 'border-emerald-600';
    urgencyGlow = 'bg-emerald-900/20';
  } else if (isOverdue) {
    urgencyColor = 'border-red-600';
    urgencyGlow = 'bg-red-900/20';
  } else if (isStalled) {
    urgencyColor = 'border-yellow-600';
    urgencyGlow = 'bg-yellow-900/20';
  } else if (isHot) {
    urgencyColor = 'border-violet-600';
    urgencyGlow = 'bg-violet-900/20';
  } else if (isHighValue) {
    urgencyColor = 'border-amber-600';
    urgencyGlow = 'bg-amber-900/20';
  }

  const daysUntilFollowUp = deal.next_followup_date 
    ? Math.ceil((new Date(deal.next_followup_date) - now) / (1000 * 60 * 60 * 24))
    : null;

  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(deal.deal_value || 0);

  return (
    <button
      onClick={onOpen}
      className={`w-full bg-slate-700/30 hover:bg-slate-700/50 border ${urgencyColor} ${urgencyGlow} rounded-lg p-3 text-left transition-all cursor-pointer group`}
    >
      {/* Header: Company + Badge */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className="text-sm font-bold text-white truncate">{deal.company_name}</p>
          <p className="text-xs text-slate-400 truncate">{deal.contact_name || deal.email}</p>
        </div>
        {isRecentlyWon && <span className="text-xs font-bold text-emerald-400 px-2 py-1 bg-emerald-900/40 rounded">WON</span>}
        {isOverdue && <span className="text-xs font-bold text-red-400 px-2 py-1 bg-red-900/40 rounded">OVERDUE</span>}
        {isHot && <span className="text-xs font-bold text-violet-400 px-2 py-1 bg-violet-900/40 rounded">HOT</span>}
        {isStalled && <span className="text-xs font-bold text-yellow-400 px-2 py-1 bg-yellow-900/40 rounded">STALLED</span>}
      </div>

      {/* Value */}
      <div className="mb-2 pb-2 border-b border-slate-600">
        <p className={`text-sm font-bold ${isHighValue ? 'text-amber-400' : 'text-slate-300'}`}>
          {formattedValue}
        </p>
      </div>

      {/* Last Note Preview */}
      {deal.last_note && (
        <div className="mb-2 pb-2 border-b border-slate-600">
          <div className="flex gap-1">
            <MessageCircle className="w-3 h-3 text-slate-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400 line-clamp-2">{deal.last_note}</p>
          </div>
        </div>
      )}

      {/* Proposal Status + Follow-Up Countdown */}
      <div className="flex items-center justify-between mb-2 text-xs">
        {deal.proposal_sent_date ? (
          <span className="text-emerald-400">✓ Proposal sent</span>
        ) : (
          <span className="text-slate-500">Proposal pending</span>
        )}
        {daysUntilFollowUp !== null && (
          <span className={`font-semibold ${
            daysUntilFollowUp <= 0 ? 'text-red-400' :
            daysUntilFollowUp <= 2 ? 'text-orange-400' :
            'text-slate-400'
          }`}>
            {daysUntilFollowUp <= 0 ? 'TODAY' : `in ${daysUntilFollowUp}d`}
          </span>
        )}
      </div>

      {/* Rep & Source */}
      <div className="space-y-1 text-xs text-slate-500">
        {deal.assigned_to && (
          <p><span className="text-slate-600">Owner:</span> {String(deal.assigned_to).split('@')[0]}</p>
        )}
        {deal.lead_source && (
          <p><span className="text-slate-600">Source:</span> {deal.lead_source}</p>
        )}
      </div>
    </button>
  );
}
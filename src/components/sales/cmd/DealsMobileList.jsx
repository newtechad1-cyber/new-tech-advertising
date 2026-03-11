import React, { useState } from 'react';
import { ChevronDown, Phone, Send, AlertTriangle } from 'lucide-react';

export default function DealsMobileList({ deals = [] }) {
  const [expandedId, setExpandedId] = useState(null);

  const sortedDeals = deals
    .filter(d => !['closed_won', 'closed_lost'].includes(d.stage))
    .sort((a, b) => {
      const aUrgency = (a.next_followup_date && new Date(a.next_followup_date) < new Date()) ? 0 : 1;
      const bUrgency = (b.next_followup_date && new Date(b.next_followup_date) < new Date()) ? 0 : 1;
      return aUrgency - bUrgency || (b.deal_value || 0) - (a.deal_value || 0);
    });

  return (
    <div className="space-y-2">
      {sortedDeals.map(deal => {
        const isExpanded = expandedId === deal.id;
        const isOverdue = deal.next_followup_date && new Date(deal.next_followup_date) < new Date();
        const isHighValue = (deal.deal_value || 0) > 10000;

        return (
          <div
            key={deal.id}
            className={`bg-slate-800 border ${isOverdue ? 'border-red-600' : 'border-slate-700'} rounded-lg overflow-hidden`}
          >
            <button
              onClick={() => setExpandedId(isExpanded ? null : deal.id)}
              className="w-full p-3 text-left hover:bg-slate-700/50 transition-colors flex items-center justify-between"
            >
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${isHighValue ? 'text-amber-400' : 'text-white'}`}>
                  {deal.company_name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs font-semibold text-slate-400">
                    ${(deal.deal_value / 1000).toFixed(0)}k
                  </p>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 capitalize">
                    {deal.stage.replace(/_/g, ' ')}
                  </span>
                  {isOverdue && <span className="text-xs font-bold text-red-400">⚠ Overdue</span>}
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            {isExpanded && (
              <div className="border-t border-slate-700 bg-slate-900/50 p-3 space-y-3 text-xs">
                <div>
                  <p className="text-slate-500 mb-1">Contact</p>
                  <p className="text-white font-semibold">{deal.contact_name || 'N/A'}</p>
                  <p className="text-slate-400">{deal.email || 'N/A'}</p>
                </div>

                {deal.last_note && (
                  <div>
                    <p className="text-slate-500 mb-1">Last Note</p>
                    <p className="text-slate-300">{deal.last_note}</p>
                  </div>
                )}

                {deal.next_followup_date && (
                  <div>
                    <p className="text-slate-500 mb-1">Next Follow-Up</p>
                    <p className={`font-semibold ${isOverdue ? 'text-red-400' : 'text-slate-300'}`}>
                      {new Date(deal.next_followup_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                )}

                {deal.assigned_to && (
                  <div>
                    <p className="text-slate-500 mb-1">Owner</p>
                    <p className="text-slate-300">{String(deal.assigned_to).split('@')[0]}</p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700">
                  <button className="bg-red-900/40 hover:bg-red-900/60 border border-red-700 rounded p-2 flex items-center justify-center gap-1 text-red-400 transition-colors">
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </button>
                  <button className="bg-blue-900/40 hover:bg-blue-900/60 border border-blue-700 rounded p-2 flex items-center justify-center gap-1 text-blue-400 transition-colors">
                    <Send className="w-3 h-3" />
                    <span>Email</span>
                  </button>
                  <button className="bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600 rounded p-2 flex items-center justify-center gap-1 text-slate-300 transition-colors">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Note</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
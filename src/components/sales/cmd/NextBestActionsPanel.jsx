import React from 'react';
import { Phone, Send, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NextBestActionsPanel({ deals = [] }) {
  const now = new Date();
  
  const overdueMissed = deals.filter(d => 
    d.stage !== 'closed_won' && d.stage !== 'closed_lost' && 
    d.next_followup_date && new Date(d.next_followup_date) < now &&
    (d.deal_value || 0) > 5000
  ).slice(0, 1);

  const readyForProposal = deals.filter(d =>
    d.stage === 'demo_scheduled' && (d.deal_value || 0) > 3000
  ).slice(0, 1);

  const stalledNegotiations = deals.filter(d =>
    d.stage === 'negotiation' &&
    d.last_activity_date &&
    new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) > new Date(d.last_activity_date)
  ).slice(0, 1);

  const trialAccounts = deals.filter(d =>
    d.stage === 'trial' || (d.stage === 'demo_scheduled' && !d.proposal_sent_date)
  ).slice(0, 1);

  const actions = [
    {
      icon: Phone,
      color: 'text-red-400',
      bgColor: 'bg-red-900/30',
      borderColor: 'border-red-700',
      title: 'Call Overdue Lead',
      description: overdueMissed[0]?.company_name || 'No overdue leads',
      value: overdueMissed[0]?.deal_value,
      show: overdueMissed.length > 0,
    },
    {
      icon: Send,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/30',
      borderColor: 'border-blue-700',
      title: 'Send Proposal',
      description: readyForProposal[0]?.company_name || 'No ready leads',
      value: readyForProposal[0]?.deal_value,
      show: readyForProposal.length > 0,
    },
    {
      icon: AlertTriangle,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/30',
      borderColor: 'border-yellow-700',
      title: 'Review Stalled Deal',
      description: stalledNegotiations[0]?.company_name || 'All moving',
      value: stalledNegotiations[0]?.deal_value,
      show: stalledNegotiations.length > 0,
    },
    {
      icon: CheckCircle,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-900/30',
      borderColor: 'border-emerald-700',
      title: 'Trial Follow-Up',
      description: trialAccounts[0]?.company_name || 'No trials pending',
      value: trialAccounts[0]?.deal_value,
      show: trialAccounts.length > 0,
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-violet-400" />
        <h3 className="text-sm font-bold text-white">Next Best Actions</h3>
      </div>

      <div className="space-y-2">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return action.show ? (
            <button
              key={idx}
              className={`w-full ${action.bgColor} border ${action.borderColor} rounded-lg p-3 text-left hover:opacity-80 transition-opacity`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${action.color} flex-shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold ${action.color}`}>{action.title}</p>
                  <p className="text-sm font-semibold text-white truncate">{action.description}</p>
                  {action.value && (
                    <p className="text-xs text-slate-400 mt-1">
                      ${(action.value / 1000).toFixed(0)}k deal
                    </p>
                  )}
                </div>
              </div>
            </button>
          ) : null;
        })}

        {!actions.some(a => a.show) && (
          <div className="text-center py-6 text-slate-500">
            <p className="text-sm">Pipeline is flowing smoothly</p>
          </div>
        )}
      </div>
    </div>
  );
}
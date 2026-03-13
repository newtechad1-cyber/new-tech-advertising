import React, { useState } from 'react';
import {
  Phone, Mail, Calendar, FileText, ExternalLink, ChevronRight,
  CheckCircle2, XCircle, AlertTriangle, Clock, User, MapPin,
  Building2, DollarSign, Zap
} from 'lucide-react';
import { format, differenceInDays, isPast, addDays } from 'date-fns';

const INDUSTRY_COLORS = {
  hvac: '#3b82f6', plumbing: '#06b6d4', roofing: '#f59e0b',
  landscaping: '#10b981', electrical: '#eab308', painting: '#8b5cf6',
  fitness: '#ec4899', restaurant: '#f97316', real_estate: '#14b8a6', other: '#94a3b8',
};

const SOURCE_LABELS = {
  referral: 'Referral', website: 'Web', cold_outreach: 'Outreach',
  demo_request: 'Demo Req', paid_ad: 'Paid Ad', partner: 'Partner', event: 'Event', other: 'Other',
};

const fmt = (n) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n || 0}`;
const today = new Date();

export default function DealCard({ opportunity, onAction, dragHandleProps }) {
  const [showActions, setShowActions] = useState(false);

  const dueDate = opportunity.next_step_due ? new Date(opportunity.next_step_due) : null;
  const demoDate = opportunity.demo_date ? new Date(opportunity.demo_date) : null;
  const proposalDate = opportunity.proposal_sent_date ? new Date(opportunity.proposal_sent_date) : null;

  const isOverdue = dueDate && isPast(dueDate) && opportunity.stage !== 'closed_won' && opportunity.stage !== 'closed_lost';
  const proposalAgeDays = proposalDate ? differenceInDays(today, proposalDate) : 0;
  const isProposalAging = proposalDate && proposalAgeDays >= 4;
  const demoDaysLeft = demoDate ? differenceInDays(demoDate, today) : null;
  const isDemoSoon = demoDaysLeft !== null && demoDaysLeft <= 2 && demoDaysLeft >= 0;
  const isStalled = opportunity.last_activity_date && differenceInDays(today, new Date(opportunity.last_activity_date)) > 7;

  const industryColor = INDUSTRY_COLORS[opportunity.industry] || '#94a3b8';

  const quickActions = [
    { id: 'log_call', icon: Phone, label: 'Log Call', color: '#3b82f6' },
    { id: 'send_email', icon: Mail, label: 'Send Email', color: '#10b981' },
    { id: 'schedule_demo', icon: Calendar, label: 'Schedule Demo', color: '#f59e0b' },
    { id: 'create_proposal', icon: FileText, label: 'Proposal', color: '#8b5cf6' },
    { id: 'open_deal_room', icon: ExternalLink, label: 'Deal Room', color: '#06b6d4' },
    { id: 'move_stage', icon: ChevronRight, label: 'Move Stage', color: '#94a3b8' },
    { id: 'mark_won', icon: CheckCircle2, label: 'Mark Won', color: '#10b981' },
    { id: 'mark_lost', icon: XCircle, label: 'Mark Lost', color: '#ef4444' },
  ];

  return (
    <div
      className={`relative group rounded-xl border transition-all duration-200 cursor-grab active:cursor-grabbing select-none
        ${isOverdue ? 'border-red-500/60 bg-gradient-to-b from-slate-800 to-red-950/20 shadow-red-900/20 shadow-lg' :
          isStalled ? 'border-yellow-600/40 bg-gradient-to-b from-slate-800 to-yellow-950/10' :
          'border-slate-700/60 bg-gradient-to-b from-slate-800 to-slate-850 hover:border-slate-600'}
        shadow-md hover:shadow-xl`}
      {...dragHandleProps}
    >
      {/* Industry color accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl" style={{ background: industryColor }} />

      {/* Urgency badges row */}
      <div className="flex gap-1 absolute -top-2 right-2 z-10">
        {isOverdue && (
          <span className="flex items-center gap-0.5 px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg">
            <AlertTriangle className="w-2.5 h-2.5" /> OVERDUE
          </span>
        )}
        {isDemoSoon && (
          <span className="flex items-center gap-0.5 px-2 py-0.5 bg-yellow-500 text-black text-xs font-bold rounded-full shadow-lg">
            <Clock className="w-2.5 h-2.5" /> DEMO {demoDaysLeft === 0 ? 'TODAY' : `IN ${demoDaysLeft}D`}
          </span>
        )}
        {isStalled && !isOverdue && (
          <span className="flex items-center gap-0.5 px-2 py-0.5 bg-slate-600 text-slate-200 text-xs font-bold rounded-full">
            STALLED
          </span>
        )}
      </div>

      <div className="p-4 pt-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0 pr-2">
            <h4 className="text-white font-bold text-sm leading-tight truncate">{opportunity.company_name}</h4>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 flex-wrap">
              {opportunity.city && <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{opportunity.city}</span>}
              {opportunity.industry && (
                <span className="capitalize px-1.5 py-0.5 rounded text-xs font-medium" style={{ color: industryColor, background: `${industryColor}18` }}>
                  {opportunity.industry.replace('_', ' ')}
                </span>
              )}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-white font-bold text-sm">{fmt(opportunity.deal_value)}</p>
            {opportunity.source && (
              <span className="text-xs text-slate-500">{SOURCE_LABELS[opportunity.source]}</span>
            )}
          </div>
        </div>

        {/* Owner & Next Step */}
        <div className="space-y-1.5 mb-3">
          {opportunity.assigned_owner && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <User className="w-3 h-3 flex-shrink-0 text-slate-500" />
              <span className="truncate">{opportunity.assigned_owner}</span>
            </div>
          )}
          {opportunity.next_step_description && (
            <div className="flex items-start gap-1.5 text-xs text-slate-400">
              <Zap className="w-3 h-3 flex-shrink-0 text-slate-500 mt-0.5" />
              <span className="line-clamp-2">{opportunity.next_step_description}</span>
            </div>
          )}
          {dueDate && (
            <div className={`flex items-center gap-1.5 text-xs font-medium ${isOverdue ? 'text-red-400' : 'text-slate-400'}`}>
              <Clock className="w-3 h-3 flex-shrink-0" />
              Due {format(dueDate, 'MMM d')}
            </div>
          )}
        </div>

        {/* Proposal aging bar */}
        {isProposalAging && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-orange-400 mb-1">
              <span className="font-medium">Proposal Age</span>
              <span className="font-bold">{proposalAgeDays}d</span>
            </div>
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-red-500 rounded-full transition-all"
                style={{ width: `${Math.min(proposalAgeDays * 7, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div
          className={`overflow-hidden transition-all duration-200 ${showActions ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="grid grid-cols-4 gap-1 mb-2">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.id}
                  onClick={(e) => { e.stopPropagation(); onAction(a.id, opportunity); }}
                  className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg hover:bg-slate-700 transition-colors group/btn"
                  title={a.label}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: a.color }} />
                  <span className="text-slate-500 group-hover/btn:text-slate-300 text-xs leading-tight text-center" style={{ fontSize: '9px' }}>{a.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Toggle actions */}
        <button
          onClick={(e) => { e.stopPropagation(); setShowActions(s => !s); }}
          className="w-full flex items-center justify-center text-slate-600 hover:text-slate-400 text-xs gap-1 mt-1 py-1 rounded hover:bg-slate-700/50 transition-colors"
        >
          {showActions ? 'Hide' : 'Actions'}
          <ChevronRight className={`w-3 h-3 transition-transform ${showActions ? 'rotate-90' : ''}`} />
        </button>
      </div>
    </div>
  );
}
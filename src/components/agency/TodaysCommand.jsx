import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, Calendar, UserX, Clock, Flame, Target,
  TrendingUp, ChevronRight, X, Phone, Mail,
  CheckCircle, BarChart2
} from 'lucide-react';
import { scoreLead, PRIORITY_STYLES } from '../../lib/leadPriority.js';
import LeadDetailModal from './LeadDetailModal.jsx';

const today = new Date().toISOString().split('T')[0];
const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const staleThreshold = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isOverdue(d) { return !!(d && d < today); }
function isDueToday(d) { return d === today; }

export default function TodaysCommand({ leads, deals, dealsMap, leadsMap, onLeadUpdated }) {
  const navigate = useNavigate();
  const [activeBucket, setActiveBucket] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);

  // ── Bucket logic ──────────────────────────────────────────────────
  const overdueLeads = leads.filter(l => isOverdue(l.next_follow_up));
  const dueTodayLeads = leads.filter(l => isDueToday(l.next_follow_up));
  const incompleteLeads = leads.filter(l => {
    const hasName = !!(l.contact_name || l.first_name || l.last_name);
    const hasContact = !!(l.phone || l.email);
    return !hasName || !hasContact;
  });
  const noActionLeads = leads.filter(l =>
    !l.next_follow_up &&
    !['Closed Won', 'Closed Lost'].includes(dealsMap[l.id]?.stage)
  );
  const newLeads = leads.filter(l => l.created_date && l.created_date.split('T')[0] >= weekAgo);
  const proposalDeals = deals.filter(d => d.stage === 'Proposal');
  const staleDeals = deals.filter(d => {
    if (['Closed Won', 'Closed Lost'].includes(d.stage)) return false;
    const updated = (d.updated_date || d.created_date || '').split('T')[0];
    return updated && updated < staleThreshold;
  });

  // Execution-focused buckets
  // Proposal needs follow-up: in Proposal stage, proposal_follow_up date is overdue or not set
  const proposalFollowUpDeals = proposalDeals.filter(d => {
    if (!d.proposal_follow_up) return true; // no date = needs follow-up
    return d.proposal_follow_up <= today;    // overdue
  });

  // Hot opportunities: High priority score (score >= 40), not closed
  const hotLeads = leads.filter(l => {
    const d = dealsMap[l.id];
    if (['Closed Won', 'Closed Lost'].includes(d?.stage)) return false;
    const { label } = scoreLead(l, d);
    return label === 'High';
  });

  // Waiting on response: proposal sent, no follow-up yet
  const waitingLeads = proposalDeals
    .filter(d => d.proposal_sent_date && !d.proposal_follow_up)
    .map(d => leadsMap[d.lead_id]).filter(Boolean);

  // Ready to close: Proposal stage + follow-up is today or overdue
  const readyToCloseDeals = proposalDeals.filter(d => {
    const lead = leadsMap[d.lead_id];
    if (!lead) return false;
    return lead.next_follow_up && lead.next_follow_up <= today;
  });

  const BUCKETS = [
    {
      id: 'overdue',
      icon: AlertTriangle,
      label: 'Overdue',
      count: overdueLeads.length,
      color: overdueLeads.length > 0 ? 'text-red-400' : 'text-slate-500',
      border: overdueLeads.length > 0 ? 'border-red-800' : 'border-slate-800',
      bg: overdueLeads.length > 0 ? 'bg-red-950/30' : 'bg-slate-900',
      hint: 'Leads past their follow-up date',
      items: overdueLeads,
    },
    {
      id: 'today',
      icon: Calendar,
      label: 'Due Today',
      count: dueTodayLeads.length,
      color: dueTodayLeads.length > 0 ? 'text-amber-400' : 'text-slate-500',
      border: dueTodayLeads.length > 0 ? 'border-amber-700' : 'border-slate-800',
      bg: dueTodayLeads.length > 0 ? 'bg-amber-950/20' : 'bg-slate-900',
      hint: 'Follow-ups scheduled for today',
      items: dueTodayLeads,
    },
    {
      id: 'hot',
      icon: Flame,
      label: 'Hot',
      count: hotLeads.length,
      color: hotLeads.length > 0 ? 'text-orange-400' : 'text-slate-500',
      border: hotLeads.length > 0 ? 'border-orange-800' : 'border-slate-800',
      bg: hotLeads.length > 0 ? 'bg-orange-950/20' : 'bg-slate-900',
      hint: 'High-priority opportunities',
      items: hotLeads,
    },
    {
      id: 'proposal_followup',
      icon: Target,
      label: 'Prop. Follow-Up',
      count: proposalFollowUpDeals.length,
      color: proposalFollowUpDeals.length > 0 ? 'text-blue-400' : 'text-slate-500',
      border: 'border-slate-800',
      bg: 'bg-slate-900',
      hint: 'Proposals needing follow-up',
      items: proposalFollowUpDeals.map(d => leadsMap[d.lead_id]).filter(Boolean),
    },
    {
      id: 'waiting',
      icon: Clock,
      label: 'Waiting',
      count: waitingLeads.length,
      color: waitingLeads.length > 0 ? 'text-violet-400' : 'text-slate-500',
      border: 'border-slate-800',
      bg: 'bg-slate-900',
      hint: 'Proposal sent, waiting on response',
      items: waitingLeads,
    },
    {
      id: 'ready_close',
      icon: TrendingUp,
      label: 'Ready to Close',
      count: readyToCloseDeals.length,
      color: readyToCloseDeals.length > 0 ? 'text-emerald-400' : 'text-slate-500',
      border: readyToCloseDeals.length > 0 ? 'border-emerald-800' : 'border-slate-800',
      bg: readyToCloseDeals.length > 0 ? 'bg-emerald-950/20' : 'bg-slate-900',
      hint: 'In proposal, follow-up overdue or today',
      items: readyToCloseDeals.map(d => leadsMap[d.lead_id]).filter(Boolean),
    },
    {
      id: 'noaction',
      icon: UserX,
      label: 'No Action',
      count: noActionLeads.length,
      color: noActionLeads.length > 0 ? 'text-slate-400' : 'text-slate-600',
      border: 'border-slate-800',
      bg: 'bg-slate-900',
      hint: 'Open leads with no follow-up date',
      items: noActionLeads,
    },
  ];

  const activeBucketData = BUCKETS.find(b => b.id === activeBucket);

  const openLead = (lead) => {
    const deal = dealsMap[lead.id] || { id: null, lead_id: lead.id, deal_name: lead.business_name, stage: 'New Lead' };
    setSelectedLead({ lead, deal });
  };

  const totalUrgent = overdueLeads.length + dueTodayLeads.length;
  const wonThisWeek = deals.filter(d => d.stage === 'Closed Won' && (d.updated_date || '').split('T')[0] >= weekAgo).length;
  const lostThisWeek = deals.filter(d => d.stage === 'Closed Lost' && (d.updated_date || '').split('T')[0] >= weekAgo).length;

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse inline-block" />
            Today's Command
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            {totalUrgent > 0 && <span className="ml-2 text-red-400 font-semibold">· {totalUrgent} urgent</span>}
          </p>
        </div>
      </div>

      {/* Bucket grid */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {BUCKETS.map(b => {
          const Icon = b.icon;
          const isActive = activeBucket === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setActiveBucket(isActive ? null : b.id)}
              className={`rounded-xl border p-3 text-left transition-all ${b.bg} ${
                isActive ? 'border-blue-500 ring-1 ring-blue-500/40' : b.border
              } hover:border-slate-600`}
            >
              <Icon className={`w-4 h-4 ${b.color} mb-2`} />
              <p className={`text-xl font-black ${b.color}`}>{b.count}</p>
              <p className="text-xs text-slate-400 font-semibold leading-tight mt-0.5">{b.label}</p>
            </button>
          );
        })}
      </div>

      {/* Expanded bucket panel */}
      {activeBucketData && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <activeBucketData.icon className={`w-4 h-4 ${activeBucketData.color}`} />
              <p className="text-sm font-bold text-white">{activeBucketData.label}</p>
              <span className="text-xs text-slate-500 hidden sm:inline">{activeBucketData.hint}</span>
            </div>
            <button onClick={() => setActiveBucket(null)} className="text-slate-500 hover:text-white p-1 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>

          {activeBucketData.items.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-slate-400 text-sm font-semibold">All clear!</p>
              <p className="text-slate-600 text-xs mt-1">Nothing in this bucket right now.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800 max-h-80 overflow-y-auto">
              {activeBucketData.items.slice(0, 20).map((lead) => {
                if (!lead?.id) return null;
                const deal = dealsMap[lead.id];
                const { label: pLabel } = scoreLead(lead, deal);
                const ps = PRIORITY_STYLES[pLabel];
                const displayName = lead.contact_name || [lead.first_name, lead.last_name].filter(Boolean).join(' ');
                return (
                  <div key={lead.id}
                    onClick={() => openLead(lead)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 cursor-pointer group transition-colors">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${ps.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                        {lead.business_name || '(no name)'}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {displayName && <span className="text-xs text-slate-500 truncate">{displayName}</span>}
                        {deal?.stage && <span className="text-xs text-slate-600">{deal.stage}</span>}
                        {lead.next_follow_up && (
                          <span className={`text-xs font-semibold ${isOverdue(lead.next_follow_up) ? 'text-red-400' : 'text-amber-400'}`}>
                            📅 {fmtDate(lead.next_follow_up)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                      {lead.phone && (
                        <a href={`tel:${lead.phone.replace(/\D/g,'')}`}
                          className="p-1.5 text-emerald-400 hover:text-emerald-300 bg-emerald-400/10 rounded-lg"
                          title={lead.phone}>
                          <Phone className="w-3 h-3" />
                        </a>
                      )}
                      {lead.email && (
                        <a href={`mailto:${lead.email}`}
                          className="p-1.5 text-blue-400 hover:text-blue-300 bg-blue-400/10 rounded-lg"
                          title={lead.email}>
                          <Mail className="w-3 h-3" />
                        </a>
                      )}
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${ps.badge}`}>{pLabel}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeBucketData.items.length > 0 && (
            <div className="px-4 py-2.5 border-t border-slate-800 flex justify-between items-center">
              <p className="text-xs text-slate-600">{activeBucketData.items.length} lead{activeBucketData.items.length !== 1 ? 's' : ''}</p>
              <button onClick={() => navigate('/agency/leads')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
                Open Leads <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Weekly Snapshot */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart2 className="w-4 h-4 text-slate-500" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">This Week</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { label: 'New Leads', value: newLeads.length, color: 'text-emerald-400' },
            { label: 'Proposals', value: proposalDeals.length, color: 'text-blue-400' },
            { label: 'Won', value: wonThisWeek, color: wonThisWeek > 0 ? 'text-emerald-400' : 'text-slate-600' },
            { label: 'Lost', value: lostThisWeek, color: lostThisWeek > 0 ? 'text-red-400' : 'text-slate-600' },
            { label: 'Overdue', value: overdueLeads.length, color: overdueLeads.length > 0 ? 'text-red-400' : 'text-slate-600' },
            { label: 'Incomplete', value: incompleteLeads.length, color: incompleteLeads.length > 0 ? 'text-amber-400' : 'text-slate-600' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-600 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          deal={selectedLead.deal}
          lead={selectedLead.lead}
          onClose={() => setSelectedLead(null)}
          onUpdated={(updatedDeal, updatedLead) => {
            onLeadUpdated?.(updatedDeal, updatedLead);
            setSelectedLead(s => s ? { ...s, deal: updatedDeal, lead: updatedLead || s.lead } : null);
          }}
        />
      )}
    </div>
  );
}
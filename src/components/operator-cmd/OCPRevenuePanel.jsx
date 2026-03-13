import React from 'react';
import { Clock, User, FileText, ThumbsUp, AlertCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const STAGE_COLOR = {
  new_lead:        { bg: 'bg-blue-100',   text: 'text-blue-700' },
  demo_scheduled:  { bg: 'bg-purple-100', text: 'text-purple-700' },
  proposal_sent:   { bg: 'bg-amber-100',  text: 'text-amber-700' },
  verbal_yes:      { bg: 'bg-green-100',  text: 'text-green-700' },
  stalled:         { bg: 'bg-red-100',    text: 'text-red-700' },
};

function RevRow({ icon: Icon, color, label, items, emptyText, linkTo }) {
  return (
    <div className="border-b border-slate-100 last:border-0 pb-3 last:pb-0 mb-3 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" style={{ color }} />
          <span className="text-xs font-black text-slate-700 uppercase tracking-wide">{label}</span>
          <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">{items.length}</span>
        </div>
        {linkTo && items.length > 0 && (
          <Link to={linkTo} className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-0.5 transition-colors">
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-slate-400 italic pl-6">{emptyText}</p>
      ) : (
        <div className="space-y-1.5 pl-6">
          {items.slice(0, 3).map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              <p className="text-xs text-slate-700 font-semibold truncate">{item.company_name || item.contact_name}</p>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {item.deal_value > 0 && (
                  <span className="text-xs font-bold text-slate-500">${item.deal_value?.toLocaleString()}</span>
                )}
                {item.stage && STAGE_COLOR[item.stageKey || item.stage] && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${STAGE_COLOR[item.stageKey || item.stage]?.bg} ${STAGE_COLOR[item.stageKey || item.stage]?.text}`}>
                    {item.stageLabel || item.stage?.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
            </div>
          ))}
          {items.length > 3 && (
            <p className="text-xs text-slate-400">+{items.length - 3} more</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function OCPRevenuePanel({ opportunities }) {
  const today = new Date().toISOString().split('T')[0];
  const followUpsDue = opportunities.filter(o => o.next_step_due && o.next_step_due <= today && !['closed_won','closed_lost'].includes(o.stage));
  const newLeads = opportunities.filter(o => o.stage === 'new_lead');
  const proposalsPending = opportunities.filter(o => o.stage === 'proposal_sent');
  const verbalYes = opportunities.filter(o => o.stage === 'verbal_yes');
  const stalled = opportunities.filter(o => {
    if (['closed_won','closed_lost','new_lead'].includes(o.stage)) return false;
    const lastAct = o.last_activity_date ? new Date(o.last_activity_date) : null;
    return lastAct && (Date.now() - lastAct) > 7 * 86400000;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 bg-gradient-to-r from-slate-900 to-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-white font-black text-sm">Revenue Control Panel</h2>
          <p className="text-slate-400 text-xs mt-0.5">{opportunities.length} active opportunities</p>
        </div>
        <Link to="/admin/sales-pipeline" className="text-xs font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-1">
          Pipeline <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="p-5">
        <RevRow icon={Clock}      color="#ef4444" label="Follow-Ups Due Today"       items={followUpsDue}    emptyText="All follow-ups current"       linkTo="/admin/sales-pipeline" />
        <RevRow icon={User}       color="#3b82f6" label="New Leads"                  items={newLeads}        emptyText="No new leads in queue"         linkTo="/admin/sales-pipeline" />
        <RevRow icon={FileText}   color="#f59e0b" label="Proposals Awaiting Decision" items={proposalsPending} emptyText="No proposals pending"         linkTo="/admin/proposal-generator" />
        <RevRow icon={ThumbsUp}   color="#10b981" label="Verbal Yes → Close"         items={verbalYes}       emptyText="No verbal confirmations pending" linkTo="/admin/sales-pipeline" />
        <RevRow icon={AlertCircle} color="#f97316" label="Stalled Deals"             items={stalled}         emptyText="No stalled deals detected"     linkTo="/admin/sales-pipeline" />
      </div>
    </div>
  );
}
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { AlertTriangle, Clock, XCircle, Mail, Eye } from 'lucide-react';

function Alert({ icon: Icon, label, items, emptyMsg, colorClass }) {
  if (items.length === 0) return null;
  return (
    <div className={`rounded-xl border p-4 mb-3 ${colorClass}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4" />
        <span className="text-sm font-bold">{label}</span>
        <span className="ml-auto text-xs font-bold bg-white/10 px-2 py-0.5 rounded-full">{items.length}</span>
      </div>
      <div className="space-y-1.5">
        {items.slice(0, 6).map((item, i) => (
          <div key={i} className="flex items-center justify-between text-xs bg-black/20 rounded-md px-3 py-2">
            <span className="text-gray-200 truncate max-w-[55%]">{item.label}</span>
            <span className="text-gray-400 flex-shrink-0">{item.sub}</span>
          </div>
        ))}
        {items.length > 6 && <p className="text-xs text-center opacity-60 mt-1">+{items.length - 6} more</p>}
      </div>
    </div>
  );
}

export default function SalesStallAlerts() {
  const { data: deals = [] } = useQuery({ queryKey: ['sc-deals'], queryFn: () => base44.entities.SalesDeals.list('-created_date', 500) });
  const { data: leads = [] } = useQuery({ queryKey: ['sc-leads'], queryFn: () => base44.entities.SalesLeads.list('-created_date', 500) });
  const { data: activities = [] } = useQuery({ queryKey: ['sc-activities'], queryFn: () => base44.entities.SalesActivities.list('-created_date', 200) });
  const { data: proposals = [] } = useQuery({ queryKey: ['sc-proposals'], queryFn: () => base44.entities.Proposal.list('-created_date', 100) });

  const now = new Date();
  const fiveDaysAgo = new Date(now - 5 * 24 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now - 3 * 24 * 60 * 60 * 1000);
  const today = now.toISOString().slice(0, 10);

  const activityByDeal = activities.reduce((m, a) => {
    const k = a.deal_id;
    if (!m[k] || new Date(a.created_date) > new Date(m[k].created_date)) m[k] = a;
    return m;
  }, {});

  const stalledDeals = deals.filter(d => {
    if (['closed_won', 'closed_lost'].includes(d.stage)) return false;
    const lastAct = activityByDeal[d.id];
    const lastDate = lastAct ? new Date(lastAct.created_date) : new Date(d.updated_date);
    return lastDate < fiveDaysAgo;
  }).map(d => {
    const lastAct = activityByDeal[d.id];
    const lastDate = lastAct ? new Date(lastAct.created_date) : new Date(d.updated_date);
    const days = Math.floor((now - lastDate) / 86400000);
    return { label: d.company_name, sub: `${days}d inactive · ${d.stage.replace('_', ' ')}` };
  });

  const newLeadsNotContacted = leads.filter(l => l.status === 'new' && new Date(l.created_date) < oneDayAgo)
    .map(l => ({ label: l.company_name, sub: `New lead — ${Math.floor((now - new Date(l.created_date)) / 3600000)}h ago` }));

  const missedDemos = activities.filter(a => a.activity_type === 'demo' && a.date < today && new Date(a.created_date) > threeDaysAgo)
    .map(a => ({ label: `Demo on ${a.date}`, sub: a.notes?.slice(0, 40) || 'No notes' }));

  const proposalsNotViewed = proposals.filter(p => p.status === 'sent' && new Date(p.created_date) < threeDaysAgo)
    .map(p => ({ label: p.company_name || 'Unnamed', sub: `Sent ${Math.floor((now - new Date(p.created_date)) / 86400000)}d ago — not viewed` }));

  const totalAlerts = stalledDeals.length + newLeadsNotContacted.length + missedDemos.length + proposalsNotViewed.length;

  if (totalAlerts === 0) {
    return (
      <div className="bg-green-900/20 border border-green-800 rounded-xl p-8 text-center">
        <div className="text-green-400 text-3xl mb-3">✓</div>
        <p className="text-green-400 font-bold">All Clear</p>
        <p className="text-green-600 text-xs mt-1">No stalled deals or missed follow-ups</p>
      </div>
    );
  }

  return (
    <div>
      <Alert icon={Clock} label="Stalled Deals (inactive 5+ days)" items={stalledDeals} colorClass="bg-red-900/20 border-red-800 text-red-400" />
      <Alert icon={Mail} label="New Leads Not Contacted (24h+)" items={newLeadsNotContacted} colorClass="bg-orange-900/20 border-orange-800 text-orange-400" />
      <Alert icon={XCircle} label="Missed Demos" items={missedDemos} colorClass="bg-red-900/20 border-red-800 text-red-400" />
      <Alert icon={Eye} label="Proposals Not Viewed (3+ days)" items={proposalsNotViewed} colorClass="bg-yellow-900/20 border-yellow-800 text-yellow-400" />
    </div>
  );
}
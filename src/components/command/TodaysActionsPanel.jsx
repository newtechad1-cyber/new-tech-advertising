import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { AlertCircle, Clock, Phone } from 'lucide-react';

function daysAgo(dateStr) {
  if (!dateStr) return 999;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

export default function TodaysActionsPanel() {
  const [deals, setDeals] = useState([]);
  const [leadsMap, setLeadsMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.SalesDeal.filter({ archived: false }),
      base44.entities.SalesLead.list('-created_date', 500),
    ]).then(([d, l]) => {
      const map = {};
      l.forEach(lead => { map[lead.id] = lead; });
      setDeals(d);
      setLeadsMap(map);
      setLoading(false);
    });
  }, []);

  const followUps = deals.filter(d => d.stage === 'Follow-Up');
  const stale = deals.filter(d =>
    !['Closed Won', 'Closed Lost', 'Closed'].includes(d.stage) &&
    daysAgo(d.updated_date) >= 2
  );
  const missingContact = deals.filter(d => {
    const lead = leadsMap[d.lead_id];
    return !['Closed Won', 'Closed Lost', 'Closed'].includes(d.stage) && lead && !lead.phone && !lead.email;
  });

  const actions = [
    ...followUps.map(d => ({
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      text: `Follow up with ${leadsMap[d.lead_id]?.contact_name || d.deal_name}`,
      sub: `${d.deal_name} · In Follow-Up`,
    })),
    ...stale.map(d => ({
      icon: AlertCircle,
      color: 'text-red-400',
      bg: 'bg-red-400/10',
      text: `Complete audit for ${d.deal_name}`,
      sub: `No activity in ${daysAgo(d.updated_date)} days · Stage: ${d.stage}`,
    })),
    ...missingContact.map(d => ({
      icon: Phone,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      text: `Add contact info for ${d.deal_name}`,
      sub: 'Missing phone and email',
    })),
  ].slice(0, 8);

  if (loading) return null;
  if (actions.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-3">
        <span className="text-lg">✅</span>
        <p className="text-sm text-slate-400">No urgent actions — you're all caught up.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Today's Actions ({actions.length})</h2>
      <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
        {actions.map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${a.bg}`}>
                <Icon className={`w-3.5 h-3.5 ${a.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{a.text}</p>
                <p className="text-xs text-slate-500 truncate">{a.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
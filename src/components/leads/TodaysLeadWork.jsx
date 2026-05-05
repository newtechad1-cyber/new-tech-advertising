import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Calendar, AlertCircle, Flame, MessageSquare, Search, Plus } from 'lucide-react';

function fmtDate(d) {
  if (!d) return null;
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isOverdue(d) {
  if (!d) return false;
  return new Date(d + 'T12:00:00') < new Date();
}

function isDueToday(d) {
  if (!d) return false;
  const today = new Date().toISOString().split('T')[0];
  return d === today;
}

function addDays(n) {
  const d = new Date(); d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

function MiniLeadRow({ lead, onQuickUpdate }) {
  const navigate = useNavigate();
  const [copying, setCopying] = useState(false);
  const overdue = isOverdue(lead.next_follow_up);

  const copyFollowUp = (e) => {
    e.stopPropagation();
    const name = lead.contact_name || lead.business_name || '[Name]';
    const msg = `Hey ${name} — just wanted to make sure you saw this.`;
    navigator.clipboard.writeText(msg);
    setCopying(true);
    setTimeout(() => setCopying(false), 1500);
  };

  const updateStatus = async (e, status) => {
    e.stopPropagation();
    const today = new Date().toISOString().split('T')[0];
    const updates = { status };
    if (status === 'contacted') {
      updates.last_contacted = today;
      updates.next_follow_up = addDays(2);
    }
    await base44.entities.SalesLead.update(lead.id, updates);
    onQuickUpdate(lead.id, updates);
  };

  return (
    <div
      className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors group ${overdue ? 'bg-red-950/20 hover:bg-red-950/30 border border-red-900/30' : 'bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50'}`}
      onClick={() => navigate(`/agency/leads/${lead.id}`)}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white truncate group-hover:text-blue-300 transition-colors">{lead.business_name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {lead.next_follow_up && (
            <span className={`text-xs font-semibold ${overdue ? 'text-red-400' : 'text-amber-400'}`}>
              {overdue ? '⚠ Overdue' : 'Today'}: {fmtDate(lead.next_follow_up)}
            </span>
          )}
          {lead.contact_name && <span className="text-xs text-slate-600">{lead.contact_name}</span>}
        </div>
      </div>
      <div className="flex gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
        <button onClick={copyFollowUp} className={`text-xs px-2 py-1 rounded-lg font-semibold transition-colors ${copying ? 'bg-emerald-900/60 text-emerald-300' : 'bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white'}`}>
          {copying ? '✓' : '📋'}
        </button>
        {lead.status === 'new' && (
          <button onClick={e => updateStatus(e, 'contacted')} className="text-xs px-2 py-1 bg-blue-900/40 hover:bg-blue-900/60 text-blue-300 rounded-lg font-semibold">
            Mark Contacted
          </button>
        )}
      </div>
    </div>
  );
}

function Section({ icon: SectionIcon, title, color, leads, onQuickUpdate, emptyText }) {
  const Icon = SectionIcon;
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className={`px-4 py-3 border-b border-slate-800 flex items-center gap-2`}>
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-sm font-bold text-white">{title}</span>
        <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 ${color}`}>{leads.length}</span>
      </div>
      <div className="p-2 space-y-1.5">
        {leads.length === 0 ? (
          <p className="text-xs text-slate-700 italic text-center py-3">{emptyText}</p>
        ) : (
          leads.slice(0, 8).map(l => <MiniLeadRow key={l.id} lead={l} onQuickUpdate={onQuickUpdate} />)
        )}
        {leads.length > 8 && (
          <Link to="/agency/leads" className="block text-center text-xs text-blue-400 hover:text-blue-300 py-1">
            +{leads.length - 8} more → View all
          </Link>
        )}
      </div>
    </div>
  );
}

export default function TodaysLeadWork() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.SalesLead.list('-created_date', 300).then(data => {
      setLeads(data);
      setLoading(false);
    });
  }, []);

  const onQuickUpdate = (id, updates) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const today = new Date().toISOString().split('T')[0];

  const overdueFollowUps = leads.filter(l => isOverdue(l.next_follow_up) && !['closed_won', 'closed_lost'].includes(l.status));
  const dueTodayFollowUps = leads.filter(l => isDueToday(l.next_follow_up) && !['closed_won', 'closed_lost'].includes(l.status));
  const newNotContacted = leads.filter(l => l.status === 'new' && !l.outreach_sent);
  const repliedNoAudit = leads.filter(l => l.status === 'replied' && l.audit_status === 'not_started');
  const auditSentNoFollowUp = leads.filter(l => l.status === 'audit_sent' && !l.audit_follow_up_date);
  const hotLeads = leads.filter(l => l.status === 'interested' || l.priority === 'high');

  // Metrics for this week
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];
  const metrics = [
    { label: 'New This Week', value: leads.filter(l => l.created_date >= weekAgoStr).length, color: 'text-blue-400' },
    { label: 'Contacted', value: leads.filter(l => l.status === 'contacted').length, color: 'text-violet-400' },
    { label: 'Interested 🔥', value: hotLeads.length, color: 'text-rose-400' },
    { label: 'Follow-Ups Due', value: overdueFollowUps.length + dueTodayFollowUps.length, color: overdueFollowUps.length > 0 ? 'text-red-400' : 'text-amber-400' },
    { label: 'Closed Won', value: leads.filter(l => l.status === 'closed_won').length, color: 'text-emerald-400' },
    { label: 'Overdue', value: overdueFollowUps.length, color: 'text-red-400' },
  ];

  if (loading) return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-slate-900 rounded-xl animate-pulse" />)}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-400" /> Today's Lead Work
        </h2>
        <div className="flex gap-2">
          <Link to="/agency/leads/pipeline" className="text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors">Pipeline</Link>
          <Link to="/agency/leads" className="text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-900/30 hover:bg-blue-900/50 px-3 py-1.5 rounded-lg transition-colors">All Leads</Link>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
        {metrics.map(m => (
          <div key={m.label} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
            <p className={`text-xl font-black ${m.color}`}>{m.value}</p>
            <p className="text-xs text-slate-600 mt-0.5 leading-tight">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Priority Sections */}
      <div className="grid md:grid-cols-2 gap-4">
        <Section icon={AlertCircle} title="Overdue Follow-Ups" color="text-red-400" leads={overdueFollowUps} onQuickUpdate={onQuickUpdate} emptyText="No overdue follow-ups! 🎉" />
        <Section icon={Calendar} title="Follow-Ups Due Today" color="text-amber-400" leads={dueTodayFollowUps} onQuickUpdate={onQuickUpdate} emptyText="Nothing due today" />
        <Section icon={Plus} title="New — Not Contacted Yet" color="text-blue-400" leads={newNotContacted} onQuickUpdate={onQuickUpdate} emptyText="All new leads have been contacted" />
        <Section icon={Flame} title="Hot Leads / Interested" color="text-rose-400" leads={hotLeads} onQuickUpdate={onQuickUpdate} emptyText="No hot leads right now" />
        <Section icon={MessageSquare} title="Replied — Audit Not Sent" color="text-violet-400" leads={repliedNoAudit} onQuickUpdate={onQuickUpdate} emptyText="All replies have audits started" />
        <Section icon={Search} title="Audit Sent — Needs Follow-Up" color="text-orange-400" leads={auditSentNoFollowUp} onQuickUpdate={onQuickUpdate} emptyText="All audits have follow-ups scheduled" />
      </div>
    </div>
  );
}
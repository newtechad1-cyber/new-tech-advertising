import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import { Plus, RefreshCw, Calendar, AlertCircle } from 'lucide-react';
import AddLeadModal from '../components/agency/AddLeadModal';

const STAGES = [
  { key: 'new',            label: 'New Lead',        color: 'border-slate-600',   badge: 'bg-slate-700 text-slate-300' },
  { key: 'contacted',      label: 'Contacted',        color: 'border-blue-600',    badge: 'bg-blue-900 text-blue-300' },
  { key: 'replied',        label: 'Replied',          color: 'border-violet-600',  badge: 'bg-violet-900 text-violet-300' },
  { key: 'audit_requested',label: 'Audit Requested',  color: 'border-amber-600',   badge: 'bg-amber-900 text-amber-300' },
  { key: 'audit_sent',     label: 'Audit Sent',       color: 'border-orange-600',  badge: 'bg-orange-900 text-orange-300' },
  { key: 'interested',     label: 'Interested 🔥',    color: 'border-rose-600',    badge: 'bg-rose-900 text-rose-300' },
  { key: 'proposal_sent',  label: 'Proposal Sent',    color: 'border-cyan-600',    badge: 'bg-cyan-900 text-cyan-300' },
  { key: 'closed_won',     label: 'Closed Won ✅',    color: 'border-emerald-600', badge: 'bg-emerald-900 text-emerald-300' },
  { key: 'closed_lost',    label: 'Closed Lost',      color: 'border-red-600',     badge: 'bg-red-900 text-red-300' },
  { key: 'no_response',    label: 'No Response',      color: 'border-slate-700',   badge: 'bg-slate-800 text-slate-500' },
];

const PRIORITY_DOT = { high: 'bg-red-400', medium: 'bg-amber-400', low: 'bg-slate-500' };

function fmtDate(d) {
  if (!d) return null;
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isOverdue(d) {
  if (!d) return false;
  return new Date(d + 'T12:00:00') < new Date();
}

function LeadCard({ lead, onStatusChange }) {
  const navigate = useNavigate();
  const overdue = isOverdue(lead.next_follow_up);
  const followUpDate = fmtDate(lead.next_follow_up);

  return (
    <div
      className={`bg-slate-800 border rounded-xl p-3 cursor-pointer hover:border-slate-500 transition-all group ${overdue ? 'border-red-700/60' : 'border-slate-700'}`}
      onClick={() => navigate(`/agency/leads/${lead.id}`)}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors leading-tight">{lead.business_name}</p>
        <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${PRIORITY_DOT[lead.priority] || PRIORITY_DOT.medium}`} title={lead.priority} />
      </div>
      {lead.contact_name && <p className="text-xs text-slate-500 mb-1.5">{lead.contact_name}</p>}
      <div className="flex items-center gap-1.5 flex-wrap">
        {lead.lead_source && (
          <span className="text-xs bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">{lead.lead_source.replace('_', ' ')}</span>
        )}
        {lead.city && <span className="text-xs text-slate-600">{lead.city}</span>}
      </div>
      {followUpDate && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${overdue ? 'text-red-400' : 'text-amber-400'}`}>
          <Calendar className="w-3 h-3" />
          {overdue ? 'Overdue: ' : 'Follow-up: '}{followUpDate}
        </div>
      )}

      {/* Quick status move */}
      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all flex gap-1 flex-wrap" onClick={e => e.stopPropagation()}>
        <select
          defaultValue=""
          onChange={e => { if (e.target.value) onStatusChange(lead, e.target.value); e.target.value = ''; }}
          className="text-xs bg-slate-700 border border-slate-600 text-slate-300 rounded-lg px-2 py-1 w-full focus:outline-none"
        >
          <option value="">Move to stage...</option>
          {STAGES.filter(s => s.key !== lead.status).map(s => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function LeadPipelineKanban() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.SalesLead.list('-created_date', 500);
    setLeads(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onStatusChange = async (lead, newStatus) => {
    const today = new Date().toISOString().split('T')[0];
    const updates = { status: newStatus };
    // Auto follow-up logic
    if (newStatus === 'contacted') {
      updates.last_contacted = today;
      if (!lead.date_first_contacted) updates.date_first_contacted = today;
      const d = new Date(); d.setDate(d.getDate() + 2);
      updates.next_follow_up = d.toISOString().split('T')[0];
    } else if (newStatus === 'audit_sent') {
      updates.audit_status = 'sent';
      updates.audit_sent_date = today;
      const d = new Date(); d.setDate(d.getDate() + 2);
      updates.next_follow_up = d.toISOString().split('T')[0];
    } else if (newStatus === 'replied') {
      updates.reply_received = true;
      updates.reply_date = today;
    }
    await base44.entities.SalesLead.update(lead.id, updates);
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, ...updates } : l));
  };

  const grouped = {};
  STAGES.forEach(s => { grouped[s.key] = []; });
  leads.forEach(l => {
    const key = l.status || 'new';
    if (grouped[key]) grouped[key].push(l);
    else grouped['new'].push(l);
  });

  return (
    <AgencyLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Lead Pipeline</h1>
            <p className="text-slate-500 text-sm mt-0.5">{leads.length} total leads</p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg"><RefreshCw className="w-4 h-4" /></button>
            <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-4 py-2 rounded-lg">
              <Plus className="w-4 h-4" /> Add Lead
            </button>
            <Link to="/agency/leads" className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm px-4 py-2 rounded-lg">
              List View
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {STAGES.map(s => <div key={s.key} className="w-64 flex-shrink-0 h-40 bg-slate-900 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {STAGES.map(stage => {
              const stageLeads = grouped[stage.key] || [];
              return (
                <div key={stage.key} className={`flex-shrink-0 w-64 bg-slate-900 border-t-2 ${stage.color} rounded-xl`}>
                  <div className="px-3 py-3 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">{stage.label}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${stage.badge}`}>{stageLeads.length}</span>
                    </div>
                  </div>
                  <div className="p-2 space-y-2 min-h-32 max-h-[calc(100vh-220px)] overflow-y-auto">
                    {stageLeads.length === 0 ? (
                      <p className="text-xs text-slate-700 italic text-center py-4">No leads</p>
                    ) : (
                      stageLeads.map(lead => (
                        <LeadCard key={lead.id} lead={lead} onStatusChange={onStatusChange} />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAdd && (
        <AddLeadModal
          onClose={() => setShowAdd(false)}
          onSaved={({ lead }) => { setLeads(prev => [lead, ...prev]); setShowAdd(false); }}
        />
      )}
    </AgencyLayout>
  );
}
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Search, Phone, Mail, Calendar, ChevronDown, Trash2 } from 'lucide-react';
import AgencyLayout from '../components/agency/AgencyLayout';
import AddLeadModal from '../components/agency/AddLeadModal';
import LeadDetailModal from '../components/agency/LeadDetailModal';

const STATUS_COLORS = {
  new:          'bg-slate-700 text-slate-300',
  contacted:    'bg-blue-900 text-blue-300',
  qualified:    'bg-emerald-900 text-emerald-300',
  unresponsive: 'bg-red-900 text-red-300',
};

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isOverdue(d) {
  if (!d) return false;
  return new Date(d + 'T12:00:00') < new Date();
}

export default function AgencyLeads() {
  const [leads, setLeads] = useState([]);
  const [dealsMap, setDealsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    const [l, d] = await Promise.all([
      base44.entities.SalesLead.list('-created_date', 500),
      base44.entities.SalesDeal.filter({ archived: false }),
    ]);
    const map = {};
    d.forEach(deal => { if (deal.lead_id) map[deal.lead_id] = deal; });
    setLeads(l);
    setDealsMap(map);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = leads.filter(l => {
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (l.business_name || '').toLowerCase().includes(q)
        || (l.contact_name || '').toLowerCase().includes(q)
        || (l.email || '').toLowerCase().includes(q)
        || (l.city || '').toLowerCase().includes(q);
    }
    return true;
  });

  const onLeadSaved = ({ lead, deal }) => {
    setLeads(prev => [lead, ...prev]);
    setDealsMap(prev => ({ ...prev, [lead.id]: deal }));
    setShowAdd(false);
  };

  const onDealUpdated = (updatedDeal) => {
    setDealsMap(prev => ({ ...prev, [updatedDeal.lead_id]: updatedDeal }));
  };

  const openLead = (lead) => {
    const deal = dealsMap[lead.id];
    // If no deal exists, create a virtual one for the modal
    const virtualDeal = deal || { id: null, lead_id: lead.id, deal_name: lead.business_name, stage: 'New Lead' };
    setSelected({ lead, deal: virtualDeal });
  };

  const onLeadUpdated = (updatedLead) => {
    setLeads(prev => prev.map(l => l.id === updatedLead?.id ? updatedLead : l));
  };

  const deleteLead = async (e, leadId) => {
    e.stopPropagation();
    if (!confirm('Delete this lead? This cannot be undone.')) return;
    await base44.entities.SalesLead.delete(leadId);
    setLeads(prev => prev.filter(l => l.id !== leadId));
  };

  const counts = {
    all: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    unresponsive: leads.filter(l => l.status === 'unresponsive').length,
  };

  return (
    <AgencyLayout>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Leads</h1>
            <p className="text-slate-500 text-sm mt-0.5">{leads.length} total leads · click any row to view or edit</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by business, contact, email, city..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {['all', 'new', 'contacted', 'qualified', 'unresponsive'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  statusFilter === s ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}>
                {s === 'all' ? `All (${counts.all})` : `${s} (${counts[s]})`}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-slate-900 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <p className="text-slate-600 text-sm mb-3">No leads found.</p>
            <button onClick={() => setShowAdd(true)} className="text-blue-500 hover:text-blue-300 text-sm font-semibold">+ Add your first lead</button>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 px-4 py-2.5 border-b border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div className="col-span-4">Business / Contact</div>
              <div className="col-span-2 hidden sm:block">Contact Info</div>
              <div className="col-span-2 hidden md:block">Location</div>
              <div className="col-span-2">Pipeline Stage</div>
              <div className="col-span-2">Follow-Up</div>
            </div>

            <div className="divide-y divide-slate-800/60">
              {filtered.map(lead => {
                const deal = dealsMap[lead.id];
                const displayName = lead.contact_name || [lead.first_name, lead.last_name].filter(Boolean).join(' ');
                return (
                  <div key={lead.id}
                    onClick={() => openLead(lead)}
                    className="grid grid-cols-12 px-4 py-3 hover:bg-slate-800/40 cursor-pointer transition-colors group items-center">
                    <div className="col-span-4 min-w-0">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                        {lead.business_name || '(no name)'}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${STATUS_COLORS[lead.status] || 'bg-slate-700 text-slate-300'} capitalize`}>
                          {lead.status || 'new'}
                        </span>
                        {displayName && <span className="text-xs text-slate-500 truncate">{displayName}</span>}
                      </div>
                    </div>

                    <div className="col-span-2 hidden sm:flex flex-col gap-0.5 min-w-0">
                      {lead.phone && (
                        <a href={`tel:${lead.phone.replace(/\D/g,'')}`} onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 truncate">
                          <Phone className="w-3 h-3 flex-shrink-0" />{lead.phone}
                        </a>
                      )}
                      {lead.email && (
                        <a href={`mailto:${lead.email}`} onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 truncate">
                          <Mail className="w-3 h-3 flex-shrink-0" />{lead.email}
                        </a>
                      )}
                      {!lead.phone && !lead.email && (
                        <span className="text-xs text-amber-600">⚠ No contact info</span>
                      )}
                    </div>

                    <div className="col-span-2 hidden md:block">
                      <span className="text-xs text-slate-400">{[lead.city, lead.state].filter(Boolean).join(', ') || '—'}</span>
                    </div>

                    <div className="col-span-2">
                      {deal ? (
                        <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-2 py-1 rounded-lg">{deal.stage}</span>
                      ) : (
                        <span className="text-xs text-slate-600">No deal</span>
                      )}
                    </div>

                    <div className="col-span-2 flex items-center justify-between gap-2">
                      <div>
                        {lead.next_follow_up ? (
                          <span className={`flex items-center gap-1 text-xs font-medium ${isOverdue(lead.next_follow_up) ? 'text-red-400' : 'text-slate-400'}`}>
                            <Calendar className="w-3 h-3" />{fmtDate(lead.next_follow_up)}{isOverdue(lead.next_follow_up) ? ' ⚠️' : ''}
                          </span>
                        ) : lead.last_contacted ? (
                          <span className="text-xs text-slate-600">Last: {fmtDate(lead.last_contacted)}</span>
                        ) : (
                          <span className="text-xs text-slate-700">—</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => deleteLead(e, lead.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                        title="Delete lead"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {showAdd && <AddLeadModal onClose={() => setShowAdd(false)} onSaved={onLeadSaved} />}

      {selected && (
        <LeadDetailModal
          deal={selected.deal}
          lead={selected.lead}
          onClose={() => setSelected(null)}
          onUpdated={(updatedDeal) => {
            onDealUpdated(updatedDeal);
            setSelected(s => s ? { ...s, deal: updatedDeal } : null);
          }}
        />
      )}
    </AgencyLayout>
  );
}
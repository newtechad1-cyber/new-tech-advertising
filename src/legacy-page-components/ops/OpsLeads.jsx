import React, { useState, useEffect } from 'react';
import OpsLayout from '../../components/ops-dashboard/OpsLayout';
import { base44 } from '@/api/base44Client';
import { Plus, RefreshCw, Search, ChevronRight } from 'lucide-react';

const STATUS_COLORS = {
  new: 'bg-blue-900/40 text-blue-300',
  contacted: 'bg-yellow-900/40 text-yellow-300',
  qualified: 'bg-purple-900/40 text-purple-300',
  booked: 'bg-emerald-900/40 text-emerald-300',
  closed_won: 'bg-green-900/40 text-green-300',
  closed_lost: 'bg-red-900/40 text-red-300',
};

function LeadModal({ lead, clients, onSave, onClose }) {
  const [form, setForm] = useState(lead || { client_id: '', name: '', phone: '', email: '', service_needed: '', source_page: '', source_campaign: '', status: 'new', notes: '' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (lead?.id) { await base44.entities.Lead.update(lead.id, form); }
    else { await base44.entities.Lead.create(form); }
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-white font-bold text-lg mb-4">{lead?.id ? 'Edit Lead' : 'New Lead'}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Client *</label>
            <select required value={form.client_id} onChange={e => set('client_id', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
              <option value="">Select client…</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
            </select>
          </div>
          {[['name','Name'],['phone','Phone'],['email','Email'],['service_needed','Service Needed'],['source_page','Source Page'],['source_campaign','Source Campaign']].map(([k, l]) => (
            <div key={k}>
              <label className="block text-xs text-slate-400 mb-1">{l}</label>
              <input value={form[k] || ''} onChange={e => set(k, e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
          ))}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
              {['new','contacted','qualified','booked','closed_won','closed_lost'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Notes</label>
            <textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)} rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white resize-none" />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-sm text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg disabled:opacity-50">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LeadDetail({ lead, clientName, onClose, onEdit }) {
  const [followUps, setFollowUps] = useState([]);

  useEffect(() => {
    base44.entities.FollowUp.filter({ lead_id: lead.id }).then(setFollowUps);
  }, [lead.id]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white font-bold text-lg">{lead.name || 'Unknown Lead'}</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[lead.status] || 'bg-slate-700 text-slate-400'}`}>{lead.status}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={onEdit} className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">Edit</button>
            <button onClick={onClose} className="text-xs px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg">Close</button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[['Client', clientName],['Phone', lead.phone],['Email', lead.email],['Service', lead.service_needed],['Source', lead.source_page],['Campaign', lead.source_campaign]].filter(([,v]) => v).map(([l, v]) => (
            <div key={l}><p className="text-xs text-slate-500">{l}</p><p className="text-sm text-white">{v}</p></div>
          ))}
        </div>
        {lead.notes && <div className="mb-4"><p className="text-xs text-slate-500 mb-1">Notes</p><p className="text-sm text-slate-300 whitespace-pre-wrap">{lead.notes}</p></div>}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Follow-Ups ({followUps.length})</p>
          {followUps.length === 0 ? <p className="text-slate-600 text-xs">No follow-ups scheduled</p> : followUps.map(f => (
            <div key={f.id} className="bg-slate-800 rounded-lg px-3 py-2 mb-1">
              <p className="text-sm text-white font-medium">{f.type} · <span className="text-slate-400 font-normal">{f.status}</span></p>
              {f.scheduled_date && <p className="text-xs text-slate-500">{new Date(f.scheduled_date).toLocaleString()}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OpsLeads() {
  const [leads, setLeads] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modal, setModal] = useState(null);
  const [detail, setDetail] = useState(null);

  const load = async () => {
    setLoading(true);
    const [l, c] = await Promise.all([
      base44.entities.Lead.list('-created_date', 200),
      base44.entities.Client.list('-created_date', 100),
    ]);
    setLeads(l);
    setClients(c);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const clientName = (id) => clients.find(c => c.id === id)?.business_name || '—';

  const filtered = leads.filter(l => {
    const matchSearch = !search || l.name?.toLowerCase().includes(search.toLowerCase()) || l.service_needed?.toLowerCase().includes(search.toLowerCase()) || l.phone?.includes(search);
    const matchStatus = filterStatus === 'all' || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const kpis = [
    { label: 'New', count: leads.filter(l => l.status === 'new').length, color: 'text-blue-400' },
    { label: 'Contacted', count: leads.filter(l => l.status === 'contacted').length, color: 'text-yellow-400' },
    { label: 'Qualified', count: leads.filter(l => l.status === 'qualified').length, color: 'text-purple-400' },
    { label: 'Booked', count: leads.filter(l => l.status === 'booked').length, color: 'text-emerald-400' },
  ];

  return (
    <OpsLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Leads</h1>
            <p className="text-slate-500 text-sm">{leads.length} total leads</p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg"><RefreshCw className="w-4 h-4" /></button>
            <button onClick={() => setModal({})} className="flex items-center gap-1.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg">
              <Plus className="w-4 h-4" /> New Lead
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {kpis.map(k => (
            <div key={k.label} className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-3 text-center">
              <p className={`text-xl font-black ${k.color}`}>{k.count}</p>
              <p className="text-slate-500 text-xs mt-0.5">{k.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads…"
              className="bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white">
            <option value="all">All Status</option>
            {['new','contacted','qualified','booked','closed_won','closed_lost'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-slate-900 rounded-xl animate-pulse" />)}</div>
        ) : (
          <div className="space-y-2">
            {filtered.map(l => (
              <div key={l.id} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors cursor-pointer" onClick={() => setDetail(l)}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-semibold text-sm">{l.name || 'Unknown'}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[l.status] || 'bg-slate-700 text-slate-400'}`}>{l.status}</span>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">{clientName(l.client_id)} · {l.service_needed || l.phone || '—'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-slate-600 text-xs hidden md:block">{l.created_date ? new Date(l.created_date).toLocaleDateString() : ''}</p>
                  <button onClick={e => { e.stopPropagation(); setModal(l); }} className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg">Edit</button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-center text-slate-600 py-12 text-sm">No leads found.</div>}
          </div>
        )}
      </div>
      {modal !== null && <LeadModal lead={modal?.id ? modal : null} clients={clients} onSave={() => { setModal(null); load(); }} onClose={() => setModal(null)} />}
      {detail && <LeadDetail lead={detail} clientName={clientName(detail.client_id)} onClose={() => setDetail(null)} onEdit={() => { setModal(detail); setDetail(null); }} />}
    </OpsLayout>
  );
}
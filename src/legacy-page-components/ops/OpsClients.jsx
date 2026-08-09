import React, { useState, useEffect } from 'react';
import OpsLayout from '../../components/ops-dashboard/OpsLayout';
import { base44 } from '@/api/base44Client';
import { Plus, RefreshCw, Search, ChevronRight } from 'lucide-react';

const STATUS_COLORS = {
  active: 'bg-emerald-900/40 text-emerald-300',
  onboarding: 'bg-blue-900/40 text-blue-300',
  paused: 'bg-yellow-900/40 text-yellow-300',
  churned: 'bg-red-900/40 text-red-300',
};

function ClientModal({ client, onSave, onClose }) {
  const [form, setForm] = useState(client || { business_name: '', contact_name: '', email: '', phone: '', website: '', industry: '', service_area: '', primary_services: '', brand_voice: '', status: 'onboarding', notes: '' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (client?.id) { await base44.entities.Client.update(client.id, form); }
    else { await base44.entities.Client.create(form); }
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-white font-bold text-lg mb-4">{client?.id ? 'Edit Client' : 'New Client'}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Business Name *</label>
            <input required value={form.business_name} onChange={e => set('business_name', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          {[['contact_name','Contact Name'],['email','Email'],['phone','Phone'],['website','Website'],['industry','Industry'],['service_area','Service Area'],['primary_services','Primary Services'],['call_number','Call Number'],['text_number','Text Number']].map(([k, l]) => (
            <div key={k}>
              <label className="block text-xs text-slate-400 mb-1">{l}</label>
              <input value={form[k] || ''} onChange={e => set(k, e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
          ))}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Brand Voice</label>
            <textarea value={form.brand_voice || ''} onChange={e => set('brand_voice', e.target.value)} rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white resize-none" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
              {['active','onboarding','paused','churned'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Notes</label>
            <textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)} rows={2}
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

function ClientDetail({ client, onClose, onEdit }) {
  const [campaigns, setCampaigns] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Campaign.filter({ client_id: client.id }),
      base44.entities.Lead.filter({ client_id: client.id }),
    ]).then(([c, l]) => { setCampaigns(c); setLeads(l); setLoading(false); });
  }, [client.id]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-white font-bold text-lg">{client.business_name}</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[client.status] || 'bg-slate-700 text-slate-400'}`}>{client.status}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={onEdit} className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">Edit</button>
            <button onClick={onClose} className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg">Close</button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          {[
            ['Contact', client.contact_name], ['Email', client.email], ['Phone', client.phone],
            ['Website', client.website], ['Industry', client.industry], ['Service Area', client.service_area],
          ].filter(([,v]) => v).map(([l, v]) => (
            <div key={l}><p className="text-xs text-slate-500">{l}</p><p className="text-sm text-white">{v}</p></div>
          ))}
        </div>
        {client.brand_voice && <div className="mb-4"><p className="text-xs text-slate-500 mb-1">Brand Voice</p><p className="text-sm text-slate-300">{client.brand_voice}</p></div>}
        {!loading && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Campaigns ({campaigns.length})</p>
              {campaigns.slice(0, 4).map(c => (
                <div key={c.id} className="bg-slate-800 rounded-lg px-3 py-2 mb-1 text-sm text-white">{c.campaign_name} <span className="text-xs text-slate-500">· {c.status}</span></div>
              ))}
              {campaigns.length === 0 && <p className="text-slate-600 text-xs">No campaigns yet</p>}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Leads ({leads.length})</p>
              {leads.slice(0, 4).map(l => (
                <div key={l.id} className="bg-slate-800 rounded-lg px-3 py-2 mb-1 text-sm text-white">{l.name || 'Unknown'} <span className="text-xs text-slate-500">· {l.status}</span></div>
              ))}
              {leads.length === 0 && <p className="text-slate-600 text-xs">No leads yet</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OpsClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modal, setModal] = useState(null);
  const [detail, setDetail] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Client.list('-created_date', 200);
    setClients(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = clients.filter(c => {
    const matchSearch = !search || c.business_name?.toLowerCase().includes(search.toLowerCase()) || c.service_area?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <OpsLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Clients</h1>
            <p className="text-slate-500 text-sm">{clients.filter(c => c.status === 'active').length} active · {clients.filter(c => c.status === 'onboarding').length} onboarding</p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg"><RefreshCw className="w-4 h-4" /></button>
            <button onClick={() => setModal({})} className="flex items-center gap-1.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg">
              <Plus className="w-4 h-4" /> New Client
            </button>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients…"
              className="bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white">
            <option value="all">All Status</option>
            {['active','onboarding','paused','churned'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-slate-900 rounded-xl animate-pulse" />)}</div>
        ) : (
          <div className="space-y-2">
            {filtered.map(c => (
              <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors">
                <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setDetail(c)}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-semibold text-sm">{c.business_name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[c.status] || 'bg-slate-700 text-slate-400'}`}>{c.status}</span>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">{[c.industry, c.service_area, c.contact_name].filter(Boolean).join(' · ')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setDetail(c)} className="p-1.5 text-slate-500 hover:text-white"><ChevronRight className="w-4 h-4" /></button>
                  <button onClick={() => setModal(c)} className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg">Edit</button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-center text-slate-600 py-12 text-sm">No clients found.</div>}
          </div>
        )}
      </div>
      {modal !== null && <ClientModal client={modal?.id ? modal : null} onSave={() => { setModal(null); load(); }} onClose={() => setModal(null)} />}
      {detail && <ClientDetail client={detail} onClose={() => setDetail(null)} onEdit={() => { setModal(detail); setDetail(null); }} />}
    </OpsLayout>
  );
}
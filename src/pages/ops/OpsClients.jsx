import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import OpsLayout from '@/components/ops-dashboard/OpsLayout';
import { Plus, Search, RefreshCw, ExternalLink } from 'lucide-react';

const STATUS_COLORS = {
  active_client: 'bg-emerald-900/40 text-emerald-400',
  lead: 'bg-blue-900/40 text-blue-400',
  paused: 'bg-amber-900/40 text-amber-400',
  former_client: 'bg-slate-800 text-slate-500',
};

function ClientModal({ client, onClose, onSave }) {
  const [form, setForm] = useState(client || {
    business_name: '', website: '', city: '', state: '', primary_contact: '',
    email: '', phone: '', core_services: '', status: 'active_client', notes: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.business_name.trim()) return;
    setSaving(true);
    if (client?.id) {
      await base44.entities.Clients.update(client.id, form);
    } else {
      await base44.entities.Clients.create(form);
    }
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h2 className="font-bold text-white">{client ? 'Edit Client' : 'Add Client'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xl">×</button>
        </div>
        <div className="p-5 space-y-3">
          {[['Business Name *', 'business_name'], ['Website', 'website'], ['Primary Contact', 'primary_contact'], ['Email', 'email'], ['Phone', 'phone']].map(([label, k]) => (
            <div key={k}>
              <label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>
              <input value={form[k] || ''} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">City</label>
              <input value={form.city || ''} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">State</label>
              <input value={form.state || ''} onChange={e => setForm(p => ({ ...p, state: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Status</label>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
              {['active_client','lead','paused','former_client'].map(v => <option key={v} value={v}>{v.replace(/_/g,' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Core Services</label>
            <input value={form.core_services || ''} onChange={e => setForm(p => ({ ...p, core_services: e.target.value }))} placeholder="HVAC, plumbing, excavating…"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Notes</label>
            <textarea value={form.notes || ''} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-slate-800">
          <button onClick={onClose} className="text-sm px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.business_name.trim()}
            className="text-sm font-bold px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OpsClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Clients.filter({ archived: false });
    setClients(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = clients.filter(c => {
    const matchSearch = !search || c.business_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <OpsLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Clients</h1>
            <p className="text-slate-500 text-sm">{filtered.length} clients · {clients.filter(c => c.status === 'active_client').length} active</p>
          </div>
          <button onClick={() => setModal({})} className="flex items-center gap-2 text-sm font-bold px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
            <Plus className="w-4 h-4" /> Add Client
          </button>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients…"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
            <option value="all">All Statuses</option>
            {['active_client','lead','paused','former_client'].map(v => <option key={v} value={v}>{v.replace(/_/g,' ')}</option>)}
          </select>
          <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-xl">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? <div className="col-span-full p-8 text-center text-slate-500 text-sm">Loading…</div> :
           filtered.length === 0 ? <div className="col-span-full p-8 text-center text-slate-500 text-sm">No clients found.</div> :
           filtered.map(c => (
            <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-600 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status] || STATUS_COLORS.lead}`}>{c.status?.replace(/_/g,' ')}</span>
                <button onClick={() => setModal(c)} className="text-xs text-slate-500 hover:text-white px-2 py-0.5 rounded hover:bg-slate-700">Edit</button>
              </div>
              <h3 className="font-bold text-white text-sm mb-0.5">{c.business_name}</h3>
              {[c.city, c.state].filter(Boolean).length > 0 && <p className="text-xs text-slate-500 mb-1">{[c.city, c.state].filter(Boolean).join(', ')}</p>}
              {c.core_services && <p className="text-xs text-slate-400 mb-1">{c.core_services}</p>}
              {c.website && (
                <a href={c.website.startsWith('http') ? c.website : `https://${c.website}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" /> {c.website}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
      {modal !== null && <ClientModal client={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={() => { setModal(null); load(); }} />}
    </OpsLayout>
  );
}
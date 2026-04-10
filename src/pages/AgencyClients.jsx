import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Plus, Search, Archive, Trash2, Edit, X, ChevronDown, ExternalLink } from 'lucide-react';
import AgencyLayout from '../components/agency/AgencyLayout';

const STATUSES = ['lead', 'active_client', 'paused', 'former_client'];
const STATUS_COLORS = {
  active_client: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  lead: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  paused: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  former_client: 'bg-slate-600/40 text-slate-400 border-slate-600/30',
};
const STATUS_LABELS = { active_client: 'Active', lead: 'Lead', paused: 'Paused', former_client: 'Former' };

const BLANK = { business_name: '', city: '', state: '', email: '', phone: '', website: '', core_services: '', target_keywords: '', brand_voice: '', status: 'active_client', notes: '' };

export default function AgencyClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [modal, setModal] = useState(null); // null | 'add' | client object
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = () =>
    base44.entities.Clients.list('-created_date', 200).then(data => {
      setClients(data);
      setLoading(false);
    });

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(BLANK); setModal('add'); };
  const openEdit = (c) => { setForm({ ...c }); setModal(c); };

  const save = async () => {
    if (!form.business_name.trim()) return;
    setSaving(true);
    if (modal === 'add') {
      const created = await base44.entities.Clients.create({ ...form, archived: false });
      setClients(prev => [created, ...prev]);
    } else {
      await base44.entities.Clients.update(modal.id, form);
      setClients(prev => prev.map(c => c.id === modal.id ? { ...c, ...form } : c));
    }
    setSaving(false);
    setModal(null);
  };

  const archive = async (id, val) => {
    await base44.entities.Clients.update(id, { archived: val });
    setClients(prev => prev.map(c => c.id === id ? { ...c, archived: val } : c));
  };

  const deleteClient = async (id) => {
    await base44.entities.Clients.delete(id);
    setClients(prev => prev.filter(c => c.id !== id));
    setDeleteConfirm(null);
  };

  const filtered = clients.filter(c => {
    if (!showArchived && c.archived) return false;
    if (showArchived && !c.archived) return false;
    if (statusFilter && c.status !== statusFilter) return false;
    if (search && !c.business_name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const active = clients.filter(c => !c.archived && c.status === 'active_client').length;
  const leads = clients.filter(c => !c.archived && c.status === 'lead').length;

  return (
    <AgencyLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">Clients</h1>
            <p className="text-slate-500 text-sm mt-0.5">{active} active · {leads} leads</p>
          </div>
          <button onClick={openAdd} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4" /> Add Client
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white appearance-none pr-8 focus:outline-none">
              <option value="">All Statuses</option>
              {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
          <button onClick={() => setShowArchived(!showArchived)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${showArchived ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'}`}>
            {showArchived ? 'Showing Archived' : 'Archived'}
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-slate-900 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <p className="text-slate-500 text-sm mb-4">{showArchived ? 'No archived clients.' : 'No clients found.'}</p>
            {!showArchived && <button onClick={openAdd} className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-500 bg-blue-500/10 px-4 py-2 rounded-lg"><Plus className="w-4 h-4" /> Add First Client</button>}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Services</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="px-4 py-3">
                      <Link to={`/clients/${c.id}`} className="font-semibold text-white hover:text-blue-300 transition-colors">{c.business_name}</Link>
                      {c.email && <p className="text-xs text-slate-500 mt-0.5">{c.email}</p>}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs hidden md:table-cell">{c.city && c.state ? `${c.city}, ${c.state}` : c.city || '—'}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs hidden lg:table-cell max-w-xs truncate">{c.core_services || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[c.status] || 'bg-slate-700 text-slate-400 border-slate-600'}`}>
                        {STATUS_LABELS[c.status] || c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/clients/${c.id}`} className="p-1.5 text-slate-500 hover:text-blue-400 rounded"><ExternalLink className="w-3.5 h-3.5" /></Link>
                        <button onClick={() => openEdit(c)} className="p-1.5 text-slate-500 hover:text-white rounded"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => archive(c.id, !c.archived)} className="p-1.5 text-slate-500 hover:text-amber-400 rounded"><Archive className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteConfirm(c.id)} className="p-1.5 text-slate-500 hover:text-red-400 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-900 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white">{modal === 'add' ? 'Add Client' : `Edit: ${modal.business_name}`}</h3>
              <button onClick={() => setModal(null)} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-3">
              {[
                { key: 'business_name', label: 'Business Name *', type: 'text' },
                { key: 'website', label: 'Website', type: 'text' },
                { key: 'email', label: 'Email', type: 'email' },
                { key: 'phone', label: 'Phone', type: 'text' },
                { key: 'city', label: 'City', type: 'text' },
                { key: 'state', label: 'State', type: 'text' },
                { key: 'core_services', label: 'Core Services', type: 'text' },
                { key: 'target_keywords', label: 'Target Keywords', type: 'text' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">{f.label}</label>
                  <input type={f.type} value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Brand Voice</label>
                <textarea value={form.brand_voice || ''} onChange={e => setForm(p => ({ ...p, brand_voice: e.target.value }))} rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 resize-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Status</label>
                <div className="relative">
                  <select value={form.status || 'active_client'} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white appearance-none focus:outline-none focus:border-blue-500 pr-8">
                    {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Notes</label>
                <textarea value={form.notes || ''} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 resize-none" />
              </div>
            </div>
            <div className="sticky bottom-0 bg-slate-900 px-5 py-4 border-t border-slate-800 flex gap-3">
              <button onClick={save} disabled={saving || !form.business_name?.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-2 rounded-lg text-sm">
                {saving ? 'Saving...' : modal === 'add' ? 'Add Client' : 'Save Changes'}
              </button>
              <button onClick={() => setModal(null)} className="px-4 bg-slate-800 text-white font-semibold py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-bold text-white mb-2">Delete Client?</h3>
            <p className="text-slate-400 text-sm mb-5">This will also remove all related data. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => deleteClient(deleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2 rounded-lg text-sm">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-slate-800 text-white font-semibold py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
}
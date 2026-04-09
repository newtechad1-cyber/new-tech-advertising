import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Plus, Search, Archive, RotateCcw, Trash2, ExternalLink, ChevronDown, X, Edit2 } from 'lucide-react';
import CRMLayout from '../components/crm-dashboard/CRMLayout';

const STATUS_COLORS = {
  lead: 'bg-blue-900 text-blue-300',
  active_client: 'bg-emerald-900 text-emerald-300',
  paused: 'bg-amber-900 text-amber-300',
  former_client: 'bg-slate-700 text-slate-400',
};

const CHANNEL_OPTIONS = ['website', 'facebook', 'linkedin', 'gbp', 'email', 'youtube'];
const STATUS_OPTIONS = ['lead', 'active_client', 'paused', 'former_client'];

const EMPTY_FORM = {
  business_name: '', slug: '', website: '', city: '', state: '',
  primary_contact: '', email: '', phone: '',
  core_services: '', target_keywords: '', brand_voice: '',
  posting_channels: [], status: 'active_client', notes: '',
};

export default function ClientManager() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Clients.list('-created_date', 200);
    setClients(data);
    setLoading(false);
  };

  const openAdd = () => { setForm(EMPTY_FORM); setEditing(null); setModal('add'); };
  const openEdit = (client) => { setForm({ ...EMPTY_FORM, ...client }); setEditing(client); setModal('edit'); };
  const closeModal = () => { setModal(null); setEditing(null); setForm(EMPTY_FORM); };

  const save = async () => {
    if (!form.business_name.trim()) return;
    setSaving(true);
    const slug = form.slug || form.business_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const payload = { ...form, slug };
    if (editing) {
      const updated = await base44.entities.Clients.update(editing.id, payload);
      setClients(prev => prev.map(c => c.id === editing.id ? updated : c));
    } else {
      const created = await base44.entities.Clients.create(payload);
      setClients(prev => [created, ...prev]);
    }
    setSaving(false);
    closeModal();
  };

  const archive = async (id) => {
    await base44.entities.Clients.update(id, { archived: true });
    setClients(prev => prev.map(c => c.id === id ? { ...c, archived: true } : c));
  };
  const restore = async (id) => {
    await base44.entities.Clients.update(id, { archived: false });
    setClients(prev => prev.map(c => c.id === id ? { ...c, archived: false } : c));
  };
  const deleteClient = async (id) => {
    await base44.entities.Clients.delete(id);
    setClients(prev => prev.filter(c => c.id !== id));
    setDeleteConfirm(null);
  };

  const toggleChannel = (ch) => setForm(p => ({
    ...p,
    posting_channels: p.posting_channels.includes(ch)
      ? p.posting_channels.filter(c => c !== ch)
      : [...p.posting_channels, ch],
  }));

  const filtered = clients.filter(c => {
    if (showArchived ? !c.archived : c.archived) return false;
    if (statusFilter && c.status !== statusFilter) return false;
    if (search && !c.business_name.toLowerCase().includes(search.toLowerCase()) &&
        !c.city?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <CRMLayout>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Client Manager</h1>
            <p className="text-slate-400 text-sm mt-0.5">{clients.filter(c => !c.archived && c.status === 'active_client').length} active clients</p>
          </div>
          <button onClick={openAdd} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors">
            <Plus className="w-4 h-4" /> Add Client
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48 max-w-xs">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white appearance-none pr-8 focus:outline-none">
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
          <button onClick={() => setShowArchived(!showArchived)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${showArchived ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            {showArchived ? '← Active' : 'Show Archived'}
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-slate-500 text-sm">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <p className="text-slate-500 text-sm">No clients found.</p>
            <button onClick={openAdd} className="mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium">+ Add your first client</button>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  {['Business', 'Location', 'Status', 'Channels', 'Contact', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map(client => (
                  <tr key={client.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <Link to={`/clients/${client.id}`} className="font-semibold text-white hover:text-blue-400 transition-colors">
                        {client.business_name}
                      </Link>
                      {client.website && (
                        <a href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                          target="_blank" rel="noopener noreferrer" className="ml-2 text-slate-600 hover:text-slate-400">
                          <ExternalLink className="w-3 h-3 inline" />
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{[client.city, client.state].filter(Boolean).join(', ') || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[client.status] || 'bg-slate-700 text-slate-400'}`}>
                        {client.status?.replace('_', ' ') || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{(client.posting_channels || []).join(', ') || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{client.primary_contact || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(client)} className="p-1.5 text-slate-500 hover:text-blue-400 rounded-lg transition-colors" title="Edit">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {client.archived ? (
                          <button onClick={() => restore(client.id)} className="p-1.5 text-slate-500 hover:text-emerald-400 rounded-lg transition-colors" title="Restore">
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button onClick={() => archive(client.id)} className="p-1.5 text-slate-500 hover:text-amber-400 rounded-lg transition-colors" title="Archive">
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button onClick={() => setDeleteConfirm(client.id)} className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
        <div className="fixed inset-0 bg-black/70 flex items-start justify-center z-50 overflow-y-auto py-8 px-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="font-bold text-white">{modal === 'edit' ? 'Edit Client' : 'Add New Client'}</h2>
              <button onClick={closeModal} className="p-1.5 text-slate-500 hover:text-white rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Business Name *">
                  <input value={form.business_name} onChange={e => setForm(p => ({ ...p, business_name: e.target.value }))} placeholder="Acme HVAC" className={inp} />
                </FormField>
                <FormField label="Status">
                  <div className="relative">
                    <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className={`${inp} appearance-none pr-8`}>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </FormField>
                <FormField label="Website">
                  <input value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} placeholder="https://example.com" className={inp} />
                </FormField>
                <FormField label="City">
                  <input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} placeholder="Mason City" className={inp} />
                </FormField>
                <FormField label="State">
                  <input value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} placeholder="IA" className={inp} />
                </FormField>
                <FormField label="Primary Contact">
                  <input value={form.primary_contact} onChange={e => setForm(p => ({ ...p, primary_contact: e.target.value }))} placeholder="John Smith" className={inp} />
                </FormField>
                <FormField label="Email">
                  <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" className={inp} />
                </FormField>
                <FormField label="Phone">
                  <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="641-555-1234" className={inp} />
                </FormField>
              </div>
              <FormField label="Core Services">
                <input value={form.core_services} onChange={e => setForm(p => ({ ...p, core_services: e.target.value }))} placeholder="HVAC repair, AC installation, furnace maintenance" className={inp} />
              </FormField>
              <FormField label="Target Keywords">
                <textarea value={form.target_keywords} onChange={e => setForm(p => ({ ...p, target_keywords: e.target.value }))} placeholder="hvac repair mason city ia, ac installation north iowa..." rows={2} className={inp} />
              </FormField>
              <FormField label="Brand Voice">
                <textarea value={form.brand_voice} onChange={e => setForm(p => ({ ...p, brand_voice: e.target.value }))} placeholder="Friendly, professional, locally trusted..." rows={2} className={inp} />
              </FormField>
              <FormField label="Posting Channels">
                <div className="flex flex-wrap gap-2 mt-1">
                  {CHANNEL_OPTIONS.map(ch => (
                    <button key={ch} onClick={() => toggleChannel(ch)} type="button"
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${form.posting_channels.includes(ch) ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}>
                      {ch}
                    </button>
                  ))}
                </div>
              </FormField>
              <FormField label="Notes">
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Any additional notes..." rows={2} className={inp} />
              </FormField>
            </div>
            <div className="px-6 py-4 border-t border-slate-800 flex gap-3 justify-end">
              <button onClick={closeModal} className="px-4 py-2 bg-slate-800 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-700">Cancel</button>
              <button onClick={save} disabled={saving || !form.business_name.trim()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors">
                {saving ? 'Saving...' : modal === 'edit' ? 'Save Changes' : 'Add Client'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-bold text-white mb-2">Delete Client?</h3>
            <p className="text-slate-400 text-sm mb-5">This cannot be undone. Historical records will remain linked.</p>
            <div className="flex gap-3">
              <button onClick={() => deleteClient(deleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2 rounded-lg text-sm">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-slate-800 text-white font-semibold py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </CRMLayout>
  );
}

const inp = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';

function FormField({ label, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-400 block mb-1">{label}</label>
      {children}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import OpsLayout from '@/components/ops-dashboard/OpsLayout';
import { Plus, Search, Phone, Mail, Globe, RefreshCw, ChevronDown } from 'lucide-react';

const STATUS_COLORS = {
  new: 'bg-blue-900/50 text-blue-400 border-blue-800/60',
  contacted: 'bg-amber-900/40 text-amber-400 border-amber-800/50',
  qualified: 'bg-emerald-900/40 text-emerald-400 border-emerald-800/50',
  unresponsive: 'bg-slate-800 text-slate-500 border-slate-700',
};

function ProspectModal({ prospect, onClose, onSave }) {
  const [form, setForm] = useState(prospect || {
    business_name: '', contact_name: '', phone: '', email: '',
    website: '', city: '', state: '', industry: '', lead_source: 'other',
    status: 'new', notes: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.business_name.trim()) return;
    setSaving(true);
    if (prospect?.id) {
      await base44.entities.SalesLead.update(prospect.id, form);
    } else {
      await base44.entities.SalesLead.create(form);
    }
    setSaving(false);
    onSave();
  };

  const F = ({ label, k, type = 'text', opts }) => (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>
      {opts ? (
        <select value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
          {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} rows={3}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
      ) : (
        <input type={type} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h2 className="font-bold text-white">{prospect ? 'Edit Prospect' : 'Add Prospect'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xl leading-none">×</button>
        </div>
        <div className="p-5 space-y-3">
          <F label="Business Name *" k="business_name" />
          <div className="grid grid-cols-2 gap-3">
            <F label="Contact Name" k="contact_name" />
            <F label="Industry" k="industry" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <F label="Phone" k="phone" />
            <F label="Email" k="email" />
          </div>
          <F label="Website" k="website" />
          <div className="grid grid-cols-2 gap-3">
            <F label="City" k="city" />
            <F label="State" k="state" />
          </div>
          <F label="Status" k="status" opts={[
            { value: 'new', label: 'New' },
            { value: 'contacted', label: 'Contacted' },
            { value: 'qualified', label: 'Qualified' },
            { value: 'unresponsive', label: 'Unresponsive' },
          ]} />
          <F label="Lead Source" k="lead_source" opts={[
            { value: 'website', label: 'Website' },
            { value: 'cold_outreach', label: 'Cold Outreach' },
            { value: 'referral', label: 'Referral' },
            { value: 'other', label: 'Other' },
          ]} />
          <F label="Notes" k="notes" type="textarea" />
        </div>
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-slate-800">
          <button onClick={onClose} className="text-sm px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.business_name.trim()}
            className="text-sm font-bold px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg transition-colors">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OpsProspects() {
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.SalesLead.list('-created_date', 200);
    setProspects(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = prospects.filter(p => {
    const matchSearch = !search || p.business_name?.toLowerCase().includes(search.toLowerCase()) || p.contact_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = async (id) => {
    if (!confirm('Delete this prospect?')) return;
    await base44.entities.SalesLead.delete(id);
    load();
  };

  return (
    <OpsLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Prospects</h1>
            <p className="text-slate-500 text-sm">{filtered.length} records</p>
          </div>
          <button onClick={() => setModal({})} className="flex items-center gap-2 text-sm font-bold px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" /> Add Prospect
          </button>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="unresponsive">Unresponsive</option>
          </select>
          <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-xl">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-sm">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">No prospects found. <button onClick={() => setModal({})} className="text-blue-400 hover:underline">Add the first one.</button></div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Business</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden sm:table-cell">Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden md:table-cell">Source</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden lg:table-cell">Location</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white">{p.business_name}</p>
                      {p.industry && <p className="text-xs text-slate-500">{p.industry}</p>}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="space-y-0.5">
                        {p.contact_name && <p className="text-slate-300 text-xs">{p.contact_name}</p>}
                        {p.phone && <a href={`tel:${p.phone}`} className="text-xs text-blue-400 hover:underline flex items-center gap-1"><Phone className="w-3 h-3" />{p.phone}</a>}
                        {p.email && <a href={`mailto:${p.email}`} className="text-xs text-blue-400 hover:underline flex items-center gap-1"><Mail className="w-3 h-3" />{p.email}</a>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[p.status] || STATUS_COLORS.new}`}>{p.status}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">{p.lead_source || '—'}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden lg:table-cell">{[p.city, p.state].filter(Boolean).join(', ') || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setModal(p)} className="text-xs text-slate-500 hover:text-white px-2 py-1 rounded hover:bg-slate-700 transition-colors mr-1">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-xs text-slate-600 hover:text-red-400 px-2 py-1 rounded hover:bg-slate-700 transition-colors">Del</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {modal !== null && <ProspectModal prospect={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={() => { setModal(null); load(); }} />}
    </OpsLayout>
  );
}
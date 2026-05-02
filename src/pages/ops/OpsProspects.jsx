import React, { useState, useEffect } from 'react';
import OpsLayout from '../../components/ops-dashboard/OpsLayout';
import { base44 } from '@/api/base44Client';
import { Plus, RefreshCw, Zap, ArrowRight, Search } from 'lucide-react';

const STATUS_COLORS = {
  new: 'bg-blue-900/40 text-blue-300',
  contacted: 'bg-yellow-900/40 text-yellow-300',
  audit_requested: 'bg-purple-900/40 text-purple-300',
  qualified: 'bg-emerald-900/40 text-emerald-300',
  converted: 'bg-green-900/40 text-green-300',
  not_a_fit: 'bg-red-900/40 text-red-300',
};

function ProspectModal({ prospect, onSave, onClose }) {
  const [form, setForm] = useState(prospect || { business_name: '', contact_name: '', email: '', phone: '', website: '', industry: '', city: '', status: 'new', notes: '', audit_status: 'none' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (prospect?.id) {
      await base44.entities.Prospect.update(prospect.id, form);
    } else {
      await base44.entities.Prospect.create(form);
    }
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6">
        <h2 className="text-white font-bold text-lg mb-4">{prospect?.id ? 'Edit Prospect' : 'Add Prospect'}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            { key: 'business_name', label: 'Business Name *', required: true },
            { key: 'contact_name', label: 'Contact Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'website', label: 'Website' },
            { key: 'industry', label: 'Industry' },
            { key: 'city', label: 'City' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs text-slate-400 mb-1">{f.label}</label>
              <input required={f.required} value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                {['new','contacted','audit_requested','qualified','converted','not_a_fit'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Audit Status</label>
              <select value={form.audit_status} onChange={e => setForm(p => ({ ...p, audit_status: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                {['none','requested','in_progress','completed'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Notes</label>
            <textarea value={form.notes || ''} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white resize-none" />
          </div>
          <div className="flex gap-2 pt-2">
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

export default function OpsProspects() {
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [converting, setConverting] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Prospect.list('-created_date', 200);
    setProspects(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleConvert = async (prospect) => {
    if (!confirm(`Convert ${prospect.business_name} to a Client?`)) return;
    setConverting(prospect.id);
    await base44.functions.invoke('ntaConvertProspectToClient', { prospect_id: prospect.id });
    setConverting(null);
    load();
  };

  const handleGenerateAudit = async (prospect) => {
    // Find the gap audit for this prospect
    const audits = await base44.entities.GapAudit.filter({ prospect_id: prospect.id });
    if (audits.length === 0) {
      // Create one first
      const audit = await base44.entities.GapAudit.create({ prospect_id: prospect.id, website_url: prospect.website || '', status: 'draft' });
      await base44.functions.invoke('ntaGenerateGapAudit', { audit_id: audit.id });
    } else {
      await base44.functions.invoke('ntaGenerateGapAudit', { audit_id: audits[0].id });
    }
    alert('Gap Audit generated! Check the Gap Audits section.');
  };

  const filtered = prospects.filter(p => !search || p.business_name?.toLowerCase().includes(search.toLowerCase()) || p.city?.toLowerCase().includes(search.toLowerCase()));

  return (
    <OpsLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Prospects</h1>
            <p className="text-slate-500 text-sm">{prospects.length} total prospects</p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg"><RefreshCw className="w-4 h-4" /></button>
            <button onClick={() => setModal({})} className="flex items-center gap-1.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg">
              <Plus className="w-4 h-4" /> Add Prospect
            </button>
          </div>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search prospects…"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>

        {loading ? (
          <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-slate-900 rounded-xl animate-pulse" />)}</div>
        ) : (
          <div className="space-y-2">
            {filtered.map(p => (
              <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-semibold text-sm">{p.business_name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[p.status] || 'bg-slate-800 text-slate-400'}`}>{p.status}</span>
                    {p.audit_status !== 'none' && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-300">{p.audit_status}</span>}
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">{[p.city, p.industry, p.email].filter(Boolean).join(' · ')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleGenerateAudit(p)} title="Generate Gap Audit"
                    className="text-xs px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-medium flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Gap Audit
                  </button>
                  {p.status !== 'converted' && (
                    <button onClick={() => handleConvert(p)} disabled={converting === p.id} title="Convert to Client"
                      className="text-xs px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-medium flex items-center gap-1 disabled:opacity-50">
                      <ArrowRight className="w-3 h-3" /> Convert
                    </button>
                  )}
                  <button onClick={() => setModal(p)} className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg">Edit</button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-center text-slate-600 py-12 text-sm">No prospects found.</div>}
          </div>
        )}
      </div>
      {modal !== null && <ProspectModal prospect={modal?.id ? modal : null} onSave={() => { setModal(null); load(); }} onClose={() => setModal(null)} />}
    </OpsLayout>
  );
}
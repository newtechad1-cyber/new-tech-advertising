import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import OpsLayout from '@/components/ops-dashboard/OpsLayout';
import { Plus, Search, RefreshCw, ExternalLink } from 'lucide-react';

const RISK_COLORS = {
  low: 'bg-emerald-900/40 text-emerald-400',
  medium: 'bg-amber-900/40 text-amber-400',
  high: 'bg-orange-900/40 text-orange-400',
  critical: 'bg-red-900/40 text-red-400',
};

function AuditModal({ audit, onClose, onSave }) {
  const [form, setForm] = useState(audit || {
    website_url: '', audit_type: 'comprehensive', compliance_score: 0,
    risk_level: 'medium', lead_email: '', lead_phone: '', audit_report: '', recommended_actions: []
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.website_url.trim()) return;
    setSaving(true);
    if (audit?.id) {
      await base44.entities.WebsiteAudit.update(audit.id, form);
    } else {
      await base44.entities.WebsiteAudit.create({ ...form, status: 'completed', audit_date: new Date().toISOString() });
    }
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h2 className="font-bold text-white">{audit ? 'Edit Audit' : 'New Gap Audit'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xl">×</button>
        </div>
        <div className="p-5 space-y-3">
          {[
            { label: 'Website URL *', k: 'website_url', placeholder: 'https://example.com' },
            { label: 'Lead Email', k: 'lead_email' },
            { label: 'Lead Phone', k: 'lead_phone' },
          ].map(f => (
            <div key={f.k}>
              <label className="block text-xs font-semibold text-slate-400 mb-1">{f.label}</label>
              <input value={form[f.k] || ''} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Risk Level</label>
              <select value={form.risk_level} onChange={e => setForm(p => ({ ...p, risk_level: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                {['low','medium','high','critical'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Compliance Score (0-100)</label>
              <input type="number" min="0" max="100" value={form.compliance_score}
                onChange={e => setForm(p => ({ ...p, compliance_score: Number(e.target.value) }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Audit Report / Notes</label>
            <textarea value={form.audit_report || ''} onChange={e => setForm(p => ({ ...p, audit_report: e.target.value }))} rows={5}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-slate-800">
          <button onClick={onClose} className="text-sm px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.website_url.trim()}
            className="text-sm font-bold px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OpsAudits() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.WebsiteAudit.list('-created_date', 100);
    setAudits(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = audits.filter(a => !search || a.website_url?.toLowerCase().includes(search.toLowerCase()) || a.lead_email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <OpsLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Gap Audits</h1>
            <p className="text-slate-500 text-sm">{filtered.length} audits</p>
          </div>
          <button onClick={() => setModal({})} className="flex items-center gap-2 text-sm font-bold px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
            <Plus className="w-4 h-4" /> New Audit
          </button>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by URL or email…"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          </div>
          <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-xl">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {loading ? <div className="p-8 text-center text-slate-500 text-sm">Loading…</div> :
           filtered.length === 0 ? <div className="p-8 text-center text-slate-500 text-sm">No audits yet.</div> : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Website</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden sm:table-cell">Lead Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Risk</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden md:table-cell">Score</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map(a => (
                  <tr key={a.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white text-sm truncate max-w-48">{a.website_url}</p>
                        <a href={a.website_url} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-blue-400"><ExternalLink className="w-3 h-3" /></a>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs hidden sm:table-cell">{a.lead_email || a.lead_phone || '—'}</td>
                    <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${RISK_COLORS[a.risk_level] || RISK_COLORS.medium}`}>{a.risk_level}</span></td>
                    <td className="px-4 py-3 hidden md:table-cell"><span className="text-white font-bold">{a.compliance_score ?? '—'}</span><span className="text-slate-500 text-xs">/100</span></td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden lg:table-cell">{a.audit_date ? new Date(a.audit_date).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setModal(a)} className="text-xs text-slate-500 hover:text-white px-2 py-1 rounded hover:bg-slate-700">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {modal !== null && <AuditModal audit={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={() => { setModal(null); load(); }} />}
    </OpsLayout>
  );
}
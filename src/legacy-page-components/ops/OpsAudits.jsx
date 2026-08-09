import React, { useState, useEffect } from 'react';
import OpsLayout from '../../components/ops-dashboard/OpsLayout';
import { base44 } from '@/api/base44Client';
import { Plus, RefreshCw, Zap, Search, ChevronDown, ChevronUp } from 'lucide-react';

const STATUS_COLORS = {
  draft: 'bg-slate-700 text-slate-300',
  completed: 'bg-blue-900/40 text-blue-300',
  delivered: 'bg-emerald-900/40 text-emerald-300',
  archived: 'bg-slate-800 text-slate-500',
};

function AuditModal({ audit, onSave, onClose }) {
  const [form, setForm] = useState(audit || { website_url: '', prospect_id: '', status: 'draft', summary: '', seo_score: '', conversion_score: '', mobile_score: '' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (audit?.id) {
      await base44.entities.GapAudit.update(audit.id, form);
    } else {
      await base44.entities.GapAudit.create(form);
    }
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-white font-bold text-lg mb-4">{audit?.id ? 'Edit Gap Audit' : 'New Gap Audit'}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Website URL *</label>
            <input required value={form.website_url} onChange={e => set('website_url', e.target.value)} placeholder="https://example.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[['seo_score','SEO Score'],['conversion_score','Conv. Score'],['mobile_score','Mobile Score']].map(([k,l]) => (
              <div key={k}>
                <label className="block text-xs text-slate-400 mb-1">{l} (0-100)</label>
                <input type="number" min="0" max="100" value={form[k] || ''} onChange={e => set(k, e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
              {['draft','completed','delivered','archived'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Summary</label>
            <textarea value={form.summary || ''} onChange={e => set('summary', e.target.value)} rows={3}
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

function AuditDetail({ audit, onClose }) {
  const scores = [
    ['SEO', audit.seo_score], ['Conversion', audit.conversion_score], ['Mobile', audit.mobile_score],
    ['Content', audit.content_score], ['Speed', audit.speed_score], ['Trust', audit.trust_score],
  ].filter(([, v]) => v != null && v !== '');

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">Gap Audit: {audit.website_url}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-sm">✕ Close</button>
        </div>
        {scores.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            {scores.map(([label, val]) => (
              <div key={label} className="bg-slate-800 rounded-xl px-3 py-3 text-center">
                <p className={`text-2xl font-black ${val >= 70 ? 'text-emerald-400' : val >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>{val}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}
        {audit.summary && (
          <div className="mb-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Summary</p>
            <p className="text-slate-300 text-sm leading-relaxed">{audit.summary}</p>
          </div>
        )}
        {audit.issues_found?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Issues Found</p>
            <ul className="space-y-1">{audit.issues_found.map((i, idx) => <li key={idx} className="flex items-start gap-2 text-sm text-red-300"><span className="text-red-500 mt-0.5">✗</span>{i}</li>)}</ul>
          </div>
        )}
        {audit.recommendations?.length > 0 && (
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recommendations</p>
            <ul className="space-y-1">{audit.recommendations.map((r, idx) => <li key={idx} className="flex items-start gap-2 text-sm text-emerald-300"><span className="text-emerald-500 mt-0.5">→</span>{r}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OpsAudits() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [detail, setDetail] = useState(null);
  const [generating, setGenerating] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.GapAudit.list('-created_date', 200);
    setAudits(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleGenerate = async (audit) => {
    setGenerating(audit.id);
    await base44.functions.invoke('ntaGenerateGapAudit', { audit_id: audit.id });
    setGenerating(null);
    load();
  };

  const filtered = audits.filter(a => !search || a.website_url?.toLowerCase().includes(search.toLowerCase()) || a.summary?.toLowerCase().includes(search.toLowerCase()));

  return (
    <OpsLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Gap Audits</h1>
            <p className="text-slate-500 text-sm">{audits.length} total · {audits.filter(a => a.status === 'draft').length} open</p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg"><RefreshCw className="w-4 h-4" /></button>
            <button onClick={() => setModal({})} className="flex items-center gap-1.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg">
              <Plus className="w-4 h-4" /> New Audit
            </button>
          </div>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search audits…"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>

        {loading ? (
          <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-slate-900 rounded-xl animate-pulse" />)}</div>
        ) : (
          <div className="space-y-2">
            {filtered.map(a => (
              <div key={a.id} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-semibold text-sm truncate">{a.website_url || 'No URL'}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[a.status] || 'bg-slate-700 text-slate-400'}`}>{a.status}</span>
                  </div>
                  {a.summary && <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{a.summary}</p>}
                </div>
                <div className="flex gap-2">
                  {a.website_url && (
                    <button onClick={() => handleGenerate(a)} disabled={generating === a.id}
                      className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-lg disabled:opacity-50">
                      <Zap className="w-3 h-3" /> {generating === a.id ? 'Generating…' : 'AI Generate'}
                    </button>
                  )}
                  {a.summary && <button onClick={() => setDetail(a)} className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg">View</button>}
                  <button onClick={() => setModal(a)} className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg">Edit</button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-center text-slate-600 py-12 text-sm">No audits found.</div>}
          </div>
        )}
      </div>
      {modal !== null && <AuditModal audit={modal?.id ? modal : null} onSave={() => { setModal(null); load(); }} onClose={() => setModal(null)} />}
      {detail && <AuditDetail audit={detail} onClose={() => setDetail(null)} />}
    </OpsLayout>
  );
}
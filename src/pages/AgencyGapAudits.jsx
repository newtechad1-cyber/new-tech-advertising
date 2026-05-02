import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw, Search, Zap, Clock, CheckCircle2, Send } from 'lucide-react';

const STATUS_COLORS = {
  draft: 'bg-slate-700 text-slate-300',
  completed: 'bg-blue-900/40 text-blue-300',
  delivered: 'bg-emerald-900/40 text-emerald-300',
  archived: 'bg-slate-800 text-slate-500',
};

export default function AgencyGapAudits() {
  const [audits, setAudits] = useState([]);
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [generating, setGenerating] = useState(null);

  const load = async () => {
    setLoading(true);
    const [a, p] = await Promise.all([
      base44.entities.GapAudit.list('-created_date', 200),
      base44.entities.Prospect.list('-created_date', 200),
    ]);
    setAudits(a);
    setProspects(p);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const prospectName = (id) => prospects.find(p => p.id === id)?.business_name || '—';

  const handleGenerate = async (audit) => {
    setGenerating(audit.id);
    await base44.functions.invoke('ntaGenerateGapAudit', { audit_id: audit.id });
    setGenerating(null);
    load();
  };

  const filtered = audits.filter(a => {
    const name = prospectName(a.prospect_id).toLowerCase();
    const url = (a.website_url || '').toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase()) || url.includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = [
    { label: 'Total', count: audits.length, color: 'text-white' },
    { label: 'Draft', count: audits.filter(a => a.status === 'draft').length, color: 'text-slate-400' },
    { label: 'Completed', count: audits.filter(a => a.status === 'completed').length, color: 'text-blue-400' },
    { label: 'Delivered', count: audits.filter(a => a.status === 'delivered').length, color: 'text-emerald-400' },
  ];

  return (
    <div className="p-6 space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Gap Audits</h1>
          <p className="text-gray-500 text-sm">Manage and generate AI-powered gap audits for prospects.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 text-gray-400 hover:text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm"><RefreshCw className="w-4 h-4" /></button>
          <a href="/gap-audit" target="_blank"
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 shadow-sm">
            <Send className="w-4 h-4" /> Public Form ↗
          </a>
        </div>
      </div>

      {/* KPI bar */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.count}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search business or URL…"
            className="bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 shadow-sm" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 shadow-sm">
          <option value="all">All Status</option>
          {['draft','completed','delivered','archived'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">No audits found. Share the <a href="/gap-audit" target="_blank" className="text-blue-500 underline">public form</a> to capture new ones.</div>
      ) : (
        <div className="space-y-2">
          {filtered.map(a => (
            <div key={a.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3 flex-wrap shadow-sm hover:shadow-md transition-shadow">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-gray-900 font-semibold text-sm">{prospectName(a.prospect_id)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[a.status] || ''}`}>{a.status}</span>
                  {a.status === 'draft' && <span className="text-xs text-amber-600 font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> Needs AI Generate</span>}
                  {a.status === 'completed' && <span className="text-xs text-blue-600 font-medium flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Ready to Deliver</span>}
                </div>
                <p className="text-gray-500 text-xs mt-0.5">{a.website_url || 'No URL'}</p>
              </div>
              <div className="flex gap-2">
                {a.website_url && (
                  <button onClick={() => handleGenerate(a)} disabled={generating === a.id}
                    className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg disabled:opacity-50">
                    <Zap className="w-3 h-3" /> {generating === a.id ? 'Generating…' : 'AI Generate'}
                  </button>
                )}
                <Link to={`/agency/gap-audits/${a.id}`}
                  className="text-xs font-semibold px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
                  Open →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
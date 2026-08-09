import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { Plus, ArrowLeft, Edit2, ChevronDown, ChevronUp } from 'lucide-react';

function TagList({ items, color = 'bg-slate-800 text-slate-300' }) {
  if (!items?.length) return <span className="text-slate-600 text-xs">—</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.slice(0, 6).map((item, i) => <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${color}`}>{item}</span>)}
      {items.length > 6 && <span className="text-xs text-slate-500">+{items.length - 6} more</span>}
    </div>
  );
}

function IntelForm({ intel, onSave, onCancel }) {
  const [form, setForm] = useState(intel || {
    industry_name: '', industry_slug: '', description: '', priority: 50, status: 'active',
    core_services: [], top_content_angles: [], top_problem_topics: [], top_social_themes: [],
    top_video_themes: [], top_streaming_tv_angles: [], recommended_offers: [], recommended_campaign_types: [],
    peak_seasons: [], slow_seasons: [], weather_sensitive: false, holiday_sensitive: false,
    source_type: 'seeded', confidence_score: 60, average_sales_cycle_type: 'short'
  });
  const [saving, setSaving] = useState(false);

  const setArr = (field, val) => setForm(f => ({ ...f, [field]: val.split('\n').map(s => s.trim()).filter(Boolean) }));

  const handleSave = async () => {
    setSaving(true);
    if (intel?.id) await base44.entities.IndustryIntel.update(intel.id, form);
    else await base44.entities.IndustryIntel.create(form);
    setSaving(false);
    onSave();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[['industry_name','Industry Name'],['industry_slug','Slug (e.g. hvac)'],['description','Description'],].map(([k,l]) => (
          <div key={k} className={k === 'description' ? 'sm:col-span-2' : ''}>
            <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">{l}</label>
            <input value={form[k] || ''} onChange={e => setForm(f => ({...f, [k]: e.target.value}))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500" />
          </div>
        ))}
        <div>
          <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">Status</label>
          <select value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500">
            {['draft','active','paused','archived'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">Sales Cycle</label>
          <select value={form.average_sales_cycle_type || 'short'} onChange={e => setForm(f => ({...f, average_sales_cycle_type: e.target.value}))}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500">
            {['immediate','short','medium','long'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">Confidence Score (0-100)</label>
          <input type="number" min={0} max={100} value={form.confidence_score || 60} onChange={e => setForm(f => ({...f, confidence_score: +e.target.value}))}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500" />
        </div>
      </div>
      {[
        ['core_services','Core Services (one per line)'],
        ['top_content_angles','Top Content Angles (one per line)'],
        ['top_problem_topics','Top Problem Topics (one per line)'],
        ['top_social_themes','Top Social Themes (one per line)'],
        ['top_video_themes','Top Video Themes (one per line)'],
        ['top_streaming_tv_angles','Top Streaming TV Angles (one per line)'],
        ['recommended_offers','Recommended Offers (one per line)'],
        ['recommended_campaign_types','Recommended Campaign Types (one per line)'],
        ['peak_seasons','Peak Seasons (one per line)'],
        ['slow_seasons','Slow Seasons (one per line)'],
      ].map(([k, l]) => (
        <div key={k}>
          <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">{l}</label>
          <textarea rows={3} value={(form[k] || []).join('\n')} onChange={e => setArr(k, e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500 resize-none" />
        </div>
      ))}
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving}
          className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all disabled:opacity-50">
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button onClick={onCancel} className="border border-slate-700 text-slate-400 px-5 py-2.5 rounded-xl text-sm hover:border-slate-500 transition-all">Cancel</button>
      </div>
    </div>
  );
}

export default function IndustryIntelAdmin() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const load = async () => { setLoading(true); const r = await base44.entities.IndustryIntel.list('-priority'); setRecords(r); setLoading(false); };
  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl('IntelAdmin')} className="text-slate-500 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Industry Intel</h1>
            <p className="text-slate-500 text-xs">{records.length} records</p>
          </div>
          <button onClick={() => setCreating(true)} className="ml-auto bg-violet-600 hover:bg-violet-500 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Industry
          </button>
        </div>

        {creating && <div className="mb-6"><IntelForm onSave={() => { setCreating(false); load(); }} onCancel={() => setCreating(false)} /></div>}
        {loading ? <div className="text-slate-500 text-sm py-10 text-center">Loading...</div> : (
          <div className="space-y-3">
            {records.map(r => (
              <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-bold text-sm">{r.industry_name}</span>
                      <span className="text-slate-500 text-xs">/{r.industry_slug}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>{r.status}</span>
                      <span className="text-xs text-slate-500">Conf: {r.confidence_score}/100</span>
                    </div>
                    <p className="text-slate-500 text-xs mt-1 truncate">{r.description}</p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); setEditing(r.id); }} className="text-slate-500 hover:text-white p-1 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  {expanded === r.id ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </div>
                {editing === r.id && (
                  <div className="border-t border-slate-800 p-4">
                    <IntelForm intel={r} onSave={() => { setEditing(null); load(); }} onCancel={() => setEditing(null)} />
                  </div>
                )}
                {expanded === r.id && editing !== r.id && (
                  <div className="border-t border-slate-800 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      ['Core Services', r.core_services, 'bg-violet-500/10 text-violet-300'],
                      ['Top Content Angles', r.top_content_angles, 'bg-sky-500/10 text-sky-300'],
                      ['Top Problem Topics', r.top_problem_topics, 'bg-red-500/10 text-red-300'],
                      ['Top Social Themes', r.top_social_themes, 'bg-pink-500/10 text-pink-300'],
                      ['Top Video Themes', r.top_video_themes, 'bg-amber-500/10 text-amber-300'],
                      ['Streaming TV Angles', r.top_streaming_tv_angles, 'bg-cyan-500/10 text-cyan-300'],
                      ['Recommended Offers', r.recommended_offers, 'bg-green-500/10 text-green-300'],
                      ['Peak Seasons', r.peak_seasons, 'bg-orange-500/10 text-orange-300'],
                    ].map(([label, items, color]) => (
                      <div key={label}>
                        <p className="text-slate-500 text-xs font-semibold mb-1.5">{label}</p>
                        <TagList items={items} color={color} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
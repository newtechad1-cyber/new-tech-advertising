import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { Plus, ArrowLeft, Edit2, ChevronDown, ChevronUp } from 'lucide-react';

function TagList({ items }) {
  if (!items?.length) return <span className="text-slate-600 text-xs">—</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.slice(0, 5).map((item, i) => <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">{item}</span>)}
      {items.length > 5 && <span className="text-xs text-slate-500">+{items.length - 5} more</span>}
    </div>
  );
}

function MarketForm({ record, onSave, onCancel }) {
  const [form, setForm] = useState(record || {
    city: '', state: '', region: '', country: 'USA', market_slug: '', industry_slug: '', status: 'active',
    market_type: 'small', population_band: 'small', competition_level: 50, digital_maturity_estimate: 50,
    review_competitiveness: 50, source_type: 'seeded', confidence_score: 50,
    top_service_intents: [], top_problem_intents: [], recommended_local_topics: [],
    recommended_local_offers: [], recommended_video_angles: [], recommended_social_angles: [],
    recommended_streaming_tv_angles: [], common_missing_pages: [], local_relevance_notes: ''
  });
  const [saving, setSaving] = useState(false);
  const setArr = (field, val) => setForm(f => ({ ...f, [field]: val.split('\n').map(s => s.trim()).filter(Boolean) }));

  const handleSave = async () => {
    setSaving(true);
    if (record?.id) await base44.entities.LocalMarketIntel.update(record.id, form);
    else await base44.entities.LocalMarketIntel.create(form);
    setSaving(false);
    onSave();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[['city','City'],['state','State'],['region','Region'],['market_slug','Market Slug'],['industry_slug','Industry Slug'],['country','Country']].map(([k,l]) => (
          <div key={k}>
            <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">{l}</label>
            <input value={form[k] || ''} onChange={e => setForm(f => ({...f, [k]: e.target.value}))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500" />
          </div>
        ))}
        {[['market_type',['rural','suburban','urban','mixed'],'Market Type'],['population_band',['very_small','small','medium','large'],'Population Band'],['status',['draft','active','paused','archived'],'Status'],['source_type',['manual','seeded','inferred','observed','proven'],'Source Type']].map(([k,opts,l]) => (
          <div key={k}>
            <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">{l}</label>
            <select value={form[k] || opts[0]} onChange={e => setForm(f => ({...f, [k]: e.target.value}))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500">
              {opts.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
        {[['competition_level','Competition (0-100)'],['digital_maturity_estimate','Digital Maturity (0-100)'],['confidence_score','Confidence (0-100)']].map(([k,l]) => (
          <div key={k}>
            <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">{l}</label>
            <input type="number" min={0} max={100} value={form[k] || 50} onChange={e => setForm(f => ({...f, [k]: +e.target.value}))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500" />
          </div>
        ))}
      </div>
      {[
        ['top_service_intents','Top Service Intents (one per line)'],
        ['top_problem_intents','Top Problem Intents (one per line)'],
        ['recommended_local_topics','Recommended Local Topics (one per line)'],
        ['recommended_local_offers','Recommended Local Offers (one per line)'],
        ['recommended_video_angles','Recommended Video Angles (one per line)'],
        ['recommended_social_angles','Recommended Social Angles (one per line)'],
        ['recommended_streaming_tv_angles','Recommended Streaming TV Angles (one per line)'],
        ['common_missing_pages','Common Missing Pages (one per line)'],
      ].map(([k,l]) => (
        <div key={k}>
          <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">{l}</label>
          <textarea rows={3} value={(form[k] || []).join('\n')} onChange={e => setArr(k, e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500 resize-none" />
        </div>
      ))}
      <div>
        <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">Local Relevance Notes</label>
        <textarea rows={3} value={form.local_relevance_notes || ''} onChange={e => setForm(f => ({...f, local_relevance_notes: e.target.value}))}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500 resize-none" />
      </div>
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
        <button onClick={onCancel} className="border border-slate-700 text-slate-400 px-5 py-2.5 rounded-xl text-sm hover:border-slate-500">Cancel</button>
      </div>
    </div>
  );
}

export default function LocalMarketIntelAdmin() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [filterState, setFilterState] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');

  const load = async () => { setLoading(true); const r = await base44.entities.LocalMarketIntel.list('-confidence_score'); setRecords(r); setLoading(false); };
  useEffect(() => { load(); }, []);

  const filtered = records.filter(r =>
    (!filterState || r.state?.toLowerCase().includes(filterState.toLowerCase())) &&
    (!filterIndustry || r.industry_slug?.toLowerCase().includes(filterIndustry.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl('IntelAdmin')} className="text-slate-500 hover:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Local Market Intel</h1>
            <p className="text-slate-500 text-xs">{filtered.length} of {records.length} records</p>
          </div>
          <button onClick={() => setCreating(true)} className="ml-auto bg-violet-600 hover:bg-violet-500 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Market
          </button>
        </div>

        <div className="flex gap-3 mb-5">
          {[['filterState','Filter by state...'],['filterIndustry','Filter by industry slug...']].map(([k,ph]) => (
            <input key={k} placeholder={ph} value={k === 'filterState' ? filterState : filterIndustry}
              onChange={e => k === 'filterState' ? setFilterState(e.target.value) : setFilterIndustry(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500 placeholder-slate-600" />
          ))}
        </div>

        {creating && <div className="mb-6"><MarketForm onSave={() => { setCreating(false); load(); }} onCancel={() => setCreating(false)} /></div>}

        {loading ? <div className="text-slate-500 text-sm py-10 text-center">Loading...</div> : (
          <div className="space-y-3">
            {filtered.map(r => (
              <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-bold text-sm">{r.city || '(Statewide)'}, {r.state}</span>
                      <span className="text-slate-500 text-xs">·</span>
                      <span className="text-violet-400 text-xs">{r.industry_slug}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>{r.status}</span>
                      <span className="text-xs text-slate-500">Comp: {r.competition_level} | Conf: {r.confidence_score}</span>
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">{r.market_type} · {r.population_band} · {r.source_type}</p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); setEditing(r.id); }} className="text-slate-500 hover:text-white p-1"><Edit2 className="w-4 h-4" /></button>
                  {expanded === r.id ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </div>
                {editing === r.id && (
                  <div className="border-t border-slate-800 p-4">
                    <MarketForm record={r} onSave={() => { setEditing(null); load(); }} onCancel={() => setEditing(null)} />
                  </div>
                )}
                {expanded === r.id && editing !== r.id && (
                  <div className="border-t border-slate-800 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      ['Service Intents', r.top_service_intents],
                      ['Problem Intents', r.top_problem_intents],
                      ['Local Topics', r.recommended_local_topics],
                      ['Local Offers', r.recommended_local_offers],
                      ['Video Angles', r.recommended_video_angles],
                      ['Streaming TV', r.recommended_streaming_tv_angles],
                      ['Missing Pages', r.common_missing_pages],
                      ['Social Angles', r.recommended_social_angles],
                    ].map(([label, items]) => (
                      <div key={label}>
                        <p className="text-slate-500 text-xs font-semibold mb-1.5">{label}</p>
                        <TagList items={items} />
                      </div>
                    ))}
                    {r.local_relevance_notes && (
                      <div className="sm:col-span-2">
                        <p className="text-slate-500 text-xs font-semibold mb-1">Local Notes</p>
                        <p className="text-slate-400 text-xs leading-relaxed">{r.local_relevance_notes}</p>
                      </div>
                    )}
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
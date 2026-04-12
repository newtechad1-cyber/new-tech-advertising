import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, X, Plus, ChevronDown, Check } from 'lucide-react';

const SCRIPT_STATUS = ['Idea', 'Script Ready', 'In Production', 'Complete'];
const POSTED_STATUS = ['Not Created', 'Created', 'Posted'];
const FUNNEL_STAGES = ['Awareness', 'Consideration', 'Demo', 'Close', 'Retention'];

const STATUS_COLORS = {
  'Idea': 'bg-slate-700 text-slate-300',
  'Script Ready': 'bg-blue-900 text-blue-300',
  'In Production': 'bg-violet-900 text-violet-300',
  'Complete': 'bg-emerald-900 text-emerald-300',
  'Not Created': 'bg-slate-700 text-slate-400',
  'Created': 'bg-amber-900 text-amber-300',
  'Posted': 'bg-emerald-900 text-emerald-300',
};

const BLANK = {
  video_title: '', topic: '', funnel_stage: 'Awareness', format: 'Talking Head',
  script: '', facebook_caption: '', gbp_post: '', linkedin_post: '',
  youtube_title: '', youtube_description: '', hashtags: '', cta: '',
  platforms: [], priority: 'Medium', outreach_compatible: false,
  demo_compatible: false, script_status: 'Idea', posted_status: 'Not Created',
  used_in_outreach: false, used_in_demo: false, outreach_use_case: '',
  demo_placement: '', notes: '',
};

export default function NTAContentLibrary() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ funnel_stage: '', script_status: '', posted_status: '', outreach_compatible: '', demo_compatible: '' });
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const load = () => base44.entities.NTAContent.list('-created_date', 500).then(d => { setItems(d); setLoading(false); });
  useEffect(() => { load(); }, []);

  const filtered = items.filter(item => {
    if (search && !item.video_title?.toLowerCase().includes(search.toLowerCase()) && !item.topic?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.funnel_stage && item.funnel_stage !== filters.funnel_stage) return false;
    if (filters.script_status && item.script_status !== filters.script_status) return false;
    if (filters.posted_status && item.posted_status !== filters.posted_status) return false;
    if (filters.outreach_compatible === 'yes' && !item.outreach_compatible) return false;
    if (filters.outreach_compatible === 'no' && item.outreach_compatible) return false;
    if (filters.demo_compatible === 'yes' && !item.demo_compatible) return false;
    if (filters.demo_compatible === 'no' && item.demo_compatible) return false;
    return true;
  });

  const setFilter = (k, v) => setFilters(p => ({ ...p, [k]: v }));

  const openNew = () => { setEditItem({ ...BLANK }); setShowForm(true); };
  const openEdit = (item) => { setEditItem({ ...item }); setShowForm(true); };

  const save = async () => {
    if (editItem.id) {
      await base44.entities.NTAContent.update(editItem.id, editItem);
    } else {
      await base44.entities.NTAContent.create(editItem);
    }
    setShowForm(false);
    setEditItem(null);
    load();
  };

  const del = async (id) => {
    await base44.entities.NTAContent.delete(id);
    setItems(prev => prev.filter(i => i.id !== id));
    setSelected(null);
  };

  return (
    <div className="p-6 space-y-4 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-white">Content Library</h1>
        <button onClick={openNew} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Content
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title or topic..." className="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-52" />
        </div>
        <FilterSelect label="Funnel Stage" options={FUNNEL_STAGES} value={filters.funnel_stage} onChange={v => setFilter('funnel_stage', v)} />
        <FilterSelect label="Script Status" options={SCRIPT_STATUS} value={filters.script_status} onChange={v => setFilter('script_status', v)} />
        <FilterSelect label="Posted" options={POSTED_STATUS} value={filters.posted_status} onChange={v => setFilter('posted_status', v)} />
        <FilterSelect label="Outreach" options={['yes', 'no']} value={filters.outreach_compatible} onChange={v => setFilter('outreach_compatible', v)} />
        <FilterSelect label="Demo" options={['yes', 'no']} value={filters.demo_compatible} onChange={v => setFilter('demo_compatible', v)} />
        {Object.values(filters).some(Boolean) && (
          <button onClick={() => setFilters({ funnel_stage: '', script_status: '', posted_status: '', outreach_compatible: '', demo_compatible: '' })} className="text-xs text-slate-500 hover:text-white px-2 py-1.5 rounded-lg bg-slate-800">Clear</button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-slate-800 rounded-xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-slate-500 text-sm">No content found. <button className="text-blue-500 hover:underline" onClick={openNew}>Add your first item.</button></p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 px-4 py-2.5 border-b border-slate-800 text-xs font-bold text-slate-500 uppercase">
            <div className="col-span-4">Title / Topic</div>
            <div className="col-span-2">Funnel</div>
            <div className="col-span-2">Script</div>
            <div className="col-span-2">Posted</div>
            <div className="col-span-2">Flags</div>
          </div>
          <div className="divide-y divide-slate-800/60">
            {filtered.map(item => (
              <div key={item.id} onClick={() => setSelected(item)} className="grid grid-cols-12 px-4 py-3 hover:bg-slate-800/40 cursor-pointer transition-colors group items-center">
                <div className="col-span-4 min-w-0">
                  <p className="text-sm font-semibold text-white truncate group-hover:text-blue-300">{item.video_title}</p>
                  <p className="text-xs text-slate-500 truncate">{item.topic || '—'}</p>
                </div>
                <div className="col-span-2"><span className="text-xs text-slate-400">{item.funnel_stage || '—'}</span></div>
                <div className="col-span-2"><span className={`text-xs font-bold px-1.5 py-0.5 rounded ${STATUS_COLORS[item.script_status] || ''}`}>{item.script_status}</span></div>
                <div className="col-span-2"><span className={`text-xs font-bold px-1.5 py-0.5 rounded ${STATUS_COLORS[item.posted_status] || ''}`}>{item.posted_status}</span></div>
                <div className="col-span-2 flex gap-1.5">
                  {item.outreach_compatible && <span className="text-xs bg-sky-900 text-sky-300 px-1.5 py-0.5 rounded font-bold">OUT</span>}
                  {item.demo_compatible && <span className="text-xs bg-pink-900 text-pink-300 px-1.5 py-0.5 rounded font-bold">DEMO</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <h2 className="font-bold text-white">{selected.video_title}</h2>
              <div className="flex gap-2">
                <button onClick={() => { openEdit(selected); setSelected(null); }} className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-semibold">Edit</button>
                <button onClick={() => del(selected.id)} className="text-xs bg-red-900 hover:bg-red-800 text-red-300 px-3 py-1.5 rounded-lg font-semibold">Delete</button>
                <button onClick={() => setSelected(null)} className="p-1.5 text-slate-500 hover:text-white rounded-lg"><X className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-5 space-y-4 text-sm">
              <div className="grid grid-cols-3 gap-3">
                <Info label="Topic" value={selected.topic} />
                <Info label="Funnel" value={selected.funnel_stage} />
                <Info label="Format" value={selected.format} />
                <Info label="Script Status" value={selected.script_status} />
                <Info label="Posted" value={selected.posted_status} />
                <Info label="Priority" value={selected.priority} />
              </div>
              <div className="flex gap-3">
                <span className={`text-xs px-2 py-0.5 rounded font-bold ${selected.outreach_compatible ? 'bg-sky-900 text-sky-300' : 'bg-slate-800 text-slate-500'}`}>Outreach: {selected.outreach_compatible ? 'Yes' : 'No'}</span>
                <span className={`text-xs px-2 py-0.5 rounded font-bold ${selected.demo_compatible ? 'bg-pink-900 text-pink-300' : 'bg-slate-800 text-slate-500'}`}>Demo: {selected.demo_compatible ? 'Yes' : 'No'}</span>
              </div>
              {selected.script && <Block label="Script" value={selected.script} />}
              {selected.facebook_caption && <Block label="Facebook Caption" value={selected.facebook_caption} />}
              {selected.gbp_post && <Block label="GBP Post" value={selected.gbp_post} />}
              {selected.linkedin_post && <Block label="LinkedIn Post" value={selected.linkedin_post} />}
              {selected.youtube_title && <Block label="YouTube Title" value={selected.youtube_title} />}
              {selected.youtube_description && <Block label="YouTube Description" value={selected.youtube_description} />}
              {selected.hashtags && <Block label="Hashtags" value={selected.hashtags} />}
              {selected.cta && <Block label="CTA" value={selected.cta} />}
              {selected.notes && <Block label="Notes" value={selected.notes} />}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit form */}
      {showForm && editItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <h2 className="font-bold text-white">{editItem.id ? 'Edit Content' : 'Add New Content'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-slate-500 hover:text-white rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-5">
              <ContentForm item={editItem} setItem={setEditItem} />
            </div>
            <div className="px-5 py-4 border-t border-slate-800 flex gap-3">
              <button onClick={save} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-sm">Save</button>
              <button onClick={() => setShowForm(false)} className="px-5 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ContentForm({ item, setItem }) {
  const set = (k, v) => setItem(p => ({ ...p, [k]: v }));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <F label="Video Title *"><input value={item.video_title || ''} onChange={e => set('video_title', e.target.value)} className={inp} /></F>
        <F label="Topic"><input value={item.topic || ''} onChange={e => set('topic', e.target.value)} className={inp} /></F>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <F label="Funnel Stage">
          <select value={item.funnel_stage || ''} onChange={e => set('funnel_stage', e.target.value)} className={inp}>
            {['Awareness','Consideration','Demo','Close','Retention'].map(v => <option key={v}>{v}</option>)}
          </select>
        </F>
        <F label="Script Status">
          <select value={item.script_status || ''} onChange={e => set('script_status', e.target.value)} className={inp}>
            {['Idea','Script Ready','In Production','Complete'].map(v => <option key={v}>{v}</option>)}
          </select>
        </F>
        <F label="Posted Status">
          <select value={item.posted_status || ''} onChange={e => set('posted_status', e.target.value)} className={inp}>
            {['Not Created','Created','Posted'].map(v => <option key={v}>{v}</option>)}
          </select>
        </F>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <F label="Format">
          <select value={item.format || ''} onChange={e => set('format', e.target.value)} className={inp}>
            {['Talking Head','Slide Deck','Screen Recording','B-Roll + VO','Animation'].map(v => <option key={v}>{v}</option>)}
          </select>
        </F>
        <F label="Priority">
          <select value={item.priority || ''} onChange={e => set('priority', e.target.value)} className={inp}>
            {['High','Medium','Low'].map(v => <option key={v}>{v}</option>)}
          </select>
        </F>
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input type="checkbox" checked={!!item.outreach_compatible} onChange={e => set('outreach_compatible', e.target.checked)} className="rounded" /> Outreach Compatible
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input type="checkbox" checked={!!item.demo_compatible} onChange={e => set('demo_compatible', e.target.checked)} className="rounded" /> Demo Compatible
        </label>
      </div>
      <F label="Script"><textarea value={item.script || ''} onChange={e => set('script', e.target.value)} rows={4} className={inp + ' resize-none'} /></F>
      <F label="Facebook Caption"><textarea value={item.facebook_caption || ''} onChange={e => set('facebook_caption', e.target.value)} rows={2} className={inp + ' resize-none'} /></F>
      <F label="GBP Post"><textarea value={item.gbp_post || ''} onChange={e => set('gbp_post', e.target.value)} rows={2} className={inp + ' resize-none'} /></F>
      <F label="LinkedIn Post"><textarea value={item.linkedin_post || ''} onChange={e => set('linkedin_post', e.target.value)} rows={2} className={inp + ' resize-none'} /></F>
      <div className="grid grid-cols-2 gap-3">
        <F label="YouTube Title"><input value={item.youtube_title || ''} onChange={e => set('youtube_title', e.target.value)} className={inp} /></F>
        <F label="Hashtags"><input value={item.hashtags || ''} onChange={e => set('hashtags', e.target.value)} className={inp} /></F>
      </div>
      <F label="YouTube Description"><textarea value={item.youtube_description || ''} onChange={e => set('youtube_description', e.target.value)} rows={2} className={inp + ' resize-none'} /></F>
      <F label="CTA"><input value={item.cta || ''} onChange={e => set('cta', e.target.value)} className={inp} /></F>
      <F label="Outreach Use Case"><input value={item.outreach_use_case || ''} onChange={e => set('outreach_use_case', e.target.value)} className={inp} /></F>
      <F label="Notes"><textarea value={item.notes || ''} onChange={e => set('notes', e.target.value)} rows={2} className={inp + ' resize-none'} /></F>
    </div>
  );
}

function FilterSelect({ label, options, value, onChange }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500 appearance-none pr-6">
        <option value="">{label}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-1.5 top-2 w-3 h-3 text-slate-500 pointer-events-none" />
    </div>
  );
}

function Info({ label, value }) {
  return <div><p className="text-xs text-slate-500 mb-0.5">{label}</p><p className="text-sm text-white font-medium">{value || '—'}</p></div>;
}

function Block({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold text-slate-500 uppercase mb-1">{label}</p>
      <div className="bg-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-300 whitespace-pre-wrap">{value}</div>
    </div>
  );
}

function F({ label, children }) {
  return <div><label className="text-xs font-semibold text-slate-400 block mb-1">{label}</label>{children}</div>;
}

const inp = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';
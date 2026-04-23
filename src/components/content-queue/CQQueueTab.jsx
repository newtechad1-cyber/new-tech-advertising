import React, { useState } from 'react';
import { Plus, Search, CheckCircle, Archive, Send, Copy } from 'lucide-react';
import { CQStatusBadge, CQApprovalBadge } from './CQUtils';
import ContentQueueDrawer from './ContentQueueDrawer';
import { base44 } from '@/api/base44Client';

const CONTENT_TYPES = ['All', 'Caption', 'Script', 'Image', 'Video', 'Carousel', 'Reel / Short', 'Testimonial', 'Educational', 'Offer', 'FAQ', 'Blog Snippet', 'Email Copy', 'Ad Copy'];
const PLATFORMS = ['All', 'Facebook', 'Instagram', 'LinkedIn', 'X', 'YouTube', 'Google Business Profile', 'TikTok', 'Multiple', 'Any'];
const QUEUE_STATUSES = ['All', 'Backlog', 'Ready to Schedule', 'Assigned to Campaign', 'Scheduled', 'Published'];
const APPROVAL_STATUSES = ['All', 'Pending', 'Approved', 'Rejected', 'Revision Needed', 'Not Needed'];
const SOURCE_TYPES = ['All', 'AI Generated', 'Manual Upload', 'Imported', 'Reworked Content', 'Repurposed Content'];

export default function CQQueueTab({ items, campaigns, clients, onNewContent, onRefresh, onAssign }) {
  const [search, setSearch] = useState('');
  const [clientF, setClientF] = useState('All');
  const [typeF, setTypeF] = useState('All');
  const [platF, setPlatF] = useState('All');
  const [queueF, setQueueF] = useState('All');
  const [approvalF, setApprovalF] = useState('All');
  const [sourceF, setSourceF] = useState('All');
  const [selected, setSelected] = useState(new Set());
  const [drawer, setDrawer] = useState(null);

  const campMap = {};
  campaigns.forEach(c => campMap[c.id] = c.campaign_name);

  const active = items.filter(i => i.queue_status !== 'Archived');

  const filtered = active.filter(i =>
    (clientF === 'All' || i.client_id === clientF || (!i.client_id && clientF === '__nta')) &&
    (typeF === 'All' || i.content_type === typeF) &&
    (platF === 'All' || i.platform_recommended === platF) &&
    (queueF === 'All' || i.queue_status === queueF) &&
    (approvalF === 'All' || i.approval_status === approvalF) &&
    (sourceF === 'All' || i.source_type === sourceF) &&
    (!search || [i.content_title, i.topic, i.caption, i.script, i.tags, i.business_name].join(' ').toLowerCase().includes(search.toLowerCase()))
  );

  const toggleSelect = (id) => setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const selectAll = () => selected.size === filtered.length ? setSelected(new Set()) : setSelected(new Set(filtered.map(i => i.id)));
  const selectedItems = filtered.filter(i => selected.has(i.id));

  const bulkApprove = async () => {
    await Promise.all(selectedItems.map(i => base44.entities.ContentQueueItem.update(i.id, { approval_status: 'Approved', asset_status: 'Approved Asset', queue_status: 'Ready to Schedule' })));
    setSelected(new Set()); onRefresh();
  };
  const bulkArchive = async () => {
    await Promise.all(selectedItems.map(i => base44.entities.ContentQueueItem.update(i.id, { queue_status: 'Archived', asset_status: 'Archived' })));
    setSelected(new Set()); onRefresh();
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title, caption, script, tags, client..."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Sel value={clientF} onChange={setClientF} options={[{ v: 'All', l: 'All' }, { v: '__nta', l: 'NTA Internal' }, ...clients.map(c => ({ v: c.id, l: c.business_name }))]} />
        <Sel value={typeF} onChange={setTypeF} options={CONTENT_TYPES.map(t => ({ v: t, l: t }))} />
        <Sel value={platF} onChange={setPlatF} options={PLATFORMS.map(p => ({ v: p, l: p }))} />
        <Sel value={queueF} onChange={setQueueF} options={QUEUE_STATUSES.map(s => ({ v: s, l: s }))} />
        <Sel value={approvalF} onChange={setApprovalF} options={APPROVAL_STATUSES.map(s => ({ v: s, l: s }))} />
        <Sel value={sourceF} onChange={setSourceF} options={SOURCE_TYPES.map(s => ({ v: s, l: s }))} />
        <button onClick={onNewContent} className="ml-auto flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
          <Plus className="w-3.5 h-3.5" /> Add Content
        </button>
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 flex-wrap">
          <span className="text-xs text-slate-400 font-semibold">{selected.size} selected</span>
          <div className="w-px h-4 bg-slate-700" />
          <button onClick={bulkApprove} className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg">
            <CheckCircle className="w-3.5 h-3.5" /> Approve All
          </button>
          <button onClick={() => onAssign(selectedItems)} className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-violet-700 hover:bg-violet-600 text-white rounded-lg">
            <Send className="w-3.5 h-3.5" /> Assign to Campaign
          </button>
          <button onClick={bulkArchive} className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg">
            <Archive className="w-3.5 h-3.5" /> Archive
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="px-3 py-3 w-8">
                <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={selectAll} className="rounded border-slate-600 accent-blue-500 cursor-pointer" />
              </th>
              {['Title', 'Client', 'Type', 'Platform', 'Campaign', 'Approval', 'Queue Status', 'Source', 'Created', 'Actions'].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length === 0 && (
              <tr><td colSpan={10} className="px-4 py-10 text-center text-slate-600 text-sm">No items match filters</td></tr>
            )}
            {filtered.map(i => (
              <tr key={i.id} className="hover:bg-slate-800/20 transition-colors">
                <td className="px-3 py-3">
                  <input type="checkbox" checked={selected.has(i.id)} onChange={() => toggleSelect(i.id)} className="rounded border-slate-600 accent-blue-500 cursor-pointer" />
                </td>
                <td className="px-3 py-3">
                  <button onClick={() => setDrawer(i)} className="text-left">
                    <p className="font-medium text-white hover:text-blue-300 transition-colors truncate max-w-[200px]">{i.content_title}</p>
                    {i.topic && <p className="text-xs text-slate-500 truncate max-w-[200px]">{i.topic}</p>}
                  </button>
                </td>
                <td className="px-3 py-3 text-slate-400 text-xs">{i.business_name || 'NTA'}</td>
                <td className="px-3 py-3 text-slate-400 text-xs">{i.content_type}</td>
                <td className="px-3 py-3 text-slate-400 text-xs">{i.platform_recommended || '—'}</td>
                <td className="px-3 py-3 text-slate-400 text-xs max-w-[120px] truncate">{campMap[i.campaign_id] || '—'}</td>
                <td className="px-3 py-3"><CQApprovalBadge status={i.approval_status} /></td>
                <td className="px-3 py-3"><CQStatusBadge status={i.queue_status} /></td>
                <td className="px-3 py-3 text-slate-500 text-xs">{i.source_type || '—'}</td>
                <td className="px-3 py-3 text-slate-500 text-xs whitespace-nowrap">{i.created_date ? new Date(i.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setDrawer(i)} className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700">Open</button>
                    <button onClick={() => onAssign([i])} className="text-xs text-violet-400 hover:text-violet-300 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700">Assign</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {drawer && (
        <ContentQueueDrawer
          item={drawer}
          campaigns={campaigns}
          clients={clients}
          onClose={() => setDrawer(null)}
          onUpdated={(updated) => { setDrawer(updated); onRefresh(); }}
          onAssign={(items) => { setDrawer(null); onAssign(items); }}
        />
      )}
    </div>
  );
}

function Sel({ value, onChange, options }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500">
      {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  );
}
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { CQApprovalBadge } from './CQUtils';
import ContentQueueDrawer from './ContentQueueDrawer';

export default function CQAssignTab({ items, campaigns, clients, onRefresh, onAssign }) {
  const [selected, setSelected] = useState(new Set());
  const [drawer, setDrawer] = useState(null);
  const [clientF, setClientF] = useState('All');

  const campMap = {};
  campaigns.forEach(c => campMap[c.id] = c.campaign_name);

  const ready = items.filter(i =>
    i.queue_status !== 'Archived' &&
    i.queue_status !== 'Scheduled' &&
    i.queue_status !== 'Published' &&
    i.approval_status === 'Approved' &&
    (clientF === 'All' || i.client_id === clientF || (!i.client_id && clientF === '__nta'))
  );

  const toggle = (id) => setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const selectedItems = ready.filter(i => selected.has(i.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <p className="text-sm text-slate-400">{ready.length} approved item{ready.length !== 1 ? 's' : ''} ready to assign</p>
          <select value={clientF} onChange={e => setClientF(e.target.value)} className={SEL}>
            <option value="All">All Clients</option>
            <option value="__nta">NTA Internal</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
          </select>
        </div>
        {selectedItems.length > 0 && (
          <button onClick={() => onAssign(selectedItems)} className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
            <Send className="w-3.5 h-3.5" /> Assign {selectedItems.length} to Campaign
          </button>
        )}
      </div>

      {ready.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-slate-600 text-sm">No approved content ready for assignment. Approve items in the Review tab first.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
            <input type="checkbox"
              checked={selected.size === ready.length && ready.length > 0}
              onChange={() => selected.size === ready.length ? setSelected(new Set()) : setSelected(new Set(ready.map(i => i.id)))}
              className="rounded border-slate-600 accent-blue-500 cursor-pointer" />
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Select All</span>
          </div>
          <div className="divide-y divide-slate-800/60">
            {ready.map(i => (
              <div key={i.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/20 transition-colors">
                <input type="checkbox" checked={selected.has(i.id)} onChange={() => toggle(i.id)} className="rounded border-slate-600 accent-blue-500 cursor-pointer flex-shrink-0" />
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setDrawer(i)}>
                  <p className="text-sm font-medium text-white hover:text-blue-300 transition-colors truncate">{i.content_title}</p>
                  <p className="text-xs text-slate-500">{i.business_name || 'NTA'} · {i.content_type} · {i.platform_recommended || '—'}</p>
                </div>
                <CQApprovalBadge status={i.approval_status} />
                <span className="text-xs text-slate-500">{campMap[i.campaign_id] ? `→ ${campMap[i.campaign_id]}` : 'No campaign'}</span>
                <button onClick={() => onAssign([i])} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded-lg flex-shrink-0">
                  <Send className="w-3 h-3" /> Assign
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {drawer && (
        <ContentQueueDrawer item={drawer} campaigns={campaigns} clients={clients}
          onClose={() => setDrawer(null)}
          onUpdated={(updated) => { setDrawer(updated); onRefresh(); }}
          onAssign={(items) => { setDrawer(null); onAssign(items); }} />
      )}
    </div>
  );
}

const SEL = 'bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500';
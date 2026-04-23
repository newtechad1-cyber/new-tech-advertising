import React, { useState } from 'react';
import { RotateCcw, Trash2 } from 'lucide-react';
import { CQApprovalBadge } from './CQUtils';
import { base44 } from '@/api/base44Client';

export default function CQArchiveTab({ items, clients, onRefresh }) {
  const [clientF, setClientF] = useState('All');
  const [typeF, setTypeF] = useState('All');
  const [saving, setSaving] = useState(null);

  const archived = items.filter(i =>
    (i.queue_status === 'Archived' || i.asset_status === 'Archived') &&
    (clientF === 'All' || i.client_id === clientF) &&
    (typeF === 'All' || i.content_type === typeF)
  );

  const types = ['All', ...new Set(items.map(i => i.content_type).filter(Boolean))];

  const restore = async (id) => {
    setSaving(id);
    await base44.entities.ContentQueueItem.update(id, { queue_status: 'Backlog', asset_status: 'Draft' });
    setSaving(null);
    onRefresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <select value={clientF} onChange={e => setClientF(e.target.value)} className={SEL}>
          <option value="All">All Clients</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
        </select>
        <select value={typeF} onChange={e => setTypeF(e.target.value)} className={SEL}>
          {types.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {archived.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-slate-600 text-sm">Archive is empty.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                {['Title', 'Client', 'Type', 'Platform', 'Approval', 'Archived Date', 'Actions'].map(h => (
                  <th key={h} className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {archived.map(i => (
                <tr key={i.id} className="hover:bg-slate-800/20 opacity-75 hover:opacity-100 transition-all">
                  <td className="px-3 py-3">
                    <p className="font-medium text-slate-400 truncate max-w-[200px]">{i.content_title}</p>
                    {i.topic && <p className="text-xs text-slate-600">{i.topic}</p>}
                  </td>
                  <td className="px-3 py-3 text-slate-500 text-xs">{i.business_name || 'NTA'}</td>
                  <td className="px-3 py-3 text-slate-500 text-xs">{i.content_type}</td>
                  <td className="px-3 py-3 text-slate-500 text-xs">{i.platform_recommended || '—'}</td>
                  <td className="px-3 py-3"><CQApprovalBadge status={i.approval_status} /></td>
                  <td className="px-3 py-3 text-slate-600 text-xs">{i.updated_date ? new Date(i.updated_date).toLocaleDateString() : '—'}</td>
                  <td className="px-3 py-3">
                    <button onClick={() => restore(i.id)} disabled={saving === i.id} className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg disabled:opacity-50">
                      <RotateCcw className="w-3 h-3" /> {saving === i.id ? '...' : 'Restore'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const SEL = 'bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500';
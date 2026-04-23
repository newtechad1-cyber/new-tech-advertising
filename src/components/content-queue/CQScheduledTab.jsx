import React, { useState } from 'react';
import { CQStatusBadge } from './CQUtils';

export default function CQScheduledTab({ items, posts, campaigns, clients }) {
  const [clientF, setClientF] = useState('All');
  const [statusF, setStatusF] = useState('All');

  const campMap = {};
  campaigns.forEach(c => campMap[c.id] = c.campaign_name);

  const postMap = {};
  posts.forEach(p => postMap[p.id] = p);

  const used = items.filter(i =>
    ['Assigned to Campaign', 'Scheduled', 'Published'].includes(i.queue_status) &&
    (clientF === 'All' || i.client_id === clientF) &&
    (statusF === 'All' || i.queue_status === statusF)
  ).sort((a, b) => (b.updated_date || '').localeCompare(a.updated_date || ''));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <select value={clientF} onChange={e => setClientF(e.target.value)} className={SEL}>
          <option value="All">All Clients</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
        </select>
        <select value={statusF} onChange={e => setStatusF(e.target.value)} className={SEL}>
          {['All', 'Assigned to Campaign', 'Scheduled', 'Published'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              {['Title', 'Client', 'Type', 'Platform', 'Campaign', 'Queue Status', 'Linked Post', 'Published Date'].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {used.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-600 text-sm">No assigned or published content yet</td></tr>
            )}
            {used.map(i => {
              const linkedPost = postMap[i.scheduled_post_id || i.published_post_id];
              return (
                <tr key={i.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-3 py-3">
                    <p className="font-medium text-white truncate max-w-[180px]">{i.content_title}</p>
                    <p className="text-xs text-slate-500">{i.topic || ''}</p>
                  </td>
                  <td className="px-3 py-3 text-slate-400 text-xs">{i.business_name || 'NTA'}</td>
                  <td className="px-3 py-3 text-slate-400 text-xs">{i.content_type}</td>
                  <td className="px-3 py-3 text-slate-400 text-xs">{i.platform_recommended || '—'}</td>
                  <td className="px-3 py-3 text-slate-400 text-xs max-w-[120px] truncate">{campMap[i.campaign_id] || '—'}</td>
                  <td className="px-3 py-3"><CQStatusBadge status={i.queue_status} /></td>
                  <td className="px-3 py-3 text-slate-400 text-xs">{linkedPost ? linkedPost.title : '—'}</td>
                  <td className="px-3 py-3 text-slate-500 text-xs">{linkedPost?.published_at ? new Date(linkedPost.published_at).toLocaleDateString() : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const SEL = 'bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500';
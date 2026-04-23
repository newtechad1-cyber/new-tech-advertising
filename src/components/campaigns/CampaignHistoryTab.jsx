import React, { useState } from 'react';
import { PLATFORM_ICON, PostStatusBadge } from './CampaignUtils';

export default function CampaignHistoryTab({ posts, campaigns, clients }) {
  const [clientF, setClientF] = useState('All');
  const [platF, setPlatF] = useState('All');
  const [resultF, setResultF] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const campMap = {};
  campaigns.forEach(c => campMap[c.id] = c.campaign_name);

  const history = posts.filter(p =>
    (p.publishing_status === 'Published' || p.publishing_status === 'Failed' || p.publishing_status === 'Cancelled') &&
    (clientF === 'All' || p.client_id === clientF) &&
    (platF === 'All' || p.platform === platF) &&
    (resultF === 'All' || p.publishing_status === resultF) &&
    (!dateFrom || (p.scheduled_date && p.scheduled_date >= dateFrom)) &&
    (!dateTo || (p.scheduled_date && p.scheduled_date <= dateTo))
  ).sort((a, b) => (b.published_at || b.scheduled_date || '').localeCompare(a.published_at || a.scheduled_date || ''));

  const platforms = ['All', ...new Set(posts.map(p => p.platform).filter(Boolean))];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Sel value={clientF} onChange={setClientF} options={[{ value: 'All', label: 'All Clients' }, ...clients.map(c => ({ value: c.id, label: c.business_name }))]} />
        <Sel value={platF} onChange={setPlatF} options={platforms.map(p => ({ value: p, label: p }))} />
        <Sel value={resultF} onChange={setResultF} options={[
          { value: 'All', label: 'All Results' },
          { value: 'Published', label: 'Published' },
          { value: 'Failed', label: 'Failed' },
          { value: 'Cancelled', label: 'Cancelled' },
        ]} />
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2" />
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-left">
              {['Post', 'Client', 'Campaign', 'Platform', 'Scheduled', 'Published At', 'Result', 'Views', 'Clicks', 'Engagement', 'Leads'].map(h => (
                <th key={h} className="px-3 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {history.length === 0 && (
              <tr><td colSpan={11} className="px-4 py-10 text-center text-slate-600 text-sm">No history yet — published and failed posts will appear here</td></tr>
            )}
            {history.map(p => (
              <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                <td className="px-3 py-3">
                  <p className="font-medium text-white truncate max-w-[150px]">{p.title}</p>
                  <p className="text-xs text-slate-500">{p.post_type}</p>
                </td>
                <td className="px-3 py-3 text-slate-400 text-xs">{p.business_name || 'NTA'}</td>
                <td className="px-3 py-3 text-slate-400 text-xs max-w-[120px] truncate">{campMap[p.campaign_id] || '—'}</td>
                <td className="px-3 py-3">
                  <span className="flex items-center gap-1 text-xs text-slate-300">
                    {PLATFORM_ICON[p.platform] || '📱'} {p.platform}
                  </span>
                </td>
                <td className="px-3 py-3 text-slate-400 text-xs">{p.scheduled_date || '—'}</td>
                <td className="px-3 py-3 text-slate-400 text-xs">{p.published_at ? new Date(p.published_at).toLocaleDateString() : '—'}</td>
                <td className="px-3 py-3"><PostStatusBadge status={p.publishing_status} /></td>
                <td className="px-3 py-3 text-slate-400 font-mono text-xs">{p.performance_views || 0}</td>
                <td className="px-3 py-3 text-slate-400 font-mono text-xs">{p.performance_clicks || 0}</td>
                <td className="px-3 py-3 text-slate-400 font-mono text-xs">{p.performance_engagement || 0}</td>
                <td className="px-3 py-3 text-slate-400 font-mono text-xs">{p.performance_leads || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Sel({ value, onChange, options }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
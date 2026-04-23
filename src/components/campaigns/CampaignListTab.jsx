import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { CampaignStatusBadge, PLATFORM_ICON } from './CampaignUtils';
import CreatePostModal from './CreatePostModal';
import { base44 } from '@/api/base44Client';

const STATUSES = ['All', 'Draft', 'Planned', 'Awaiting Approval', 'Approved', 'Active', 'Scheduled', 'Completed', 'Paused', 'Cancelled'];
const TYPES = ['All', 'Social Posting', 'Promo Campaign', 'Seasonal Campaign', 'Local SEO Support', 'Video Campaign', 'Reputation Campaign', 'Lead Generation', 'Offer Launch'];

export default function CampaignListTab({ campaigns, posts, clients, onNewCampaign, onRefresh }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [clientFilter, setClientFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [addPostFor, setAddPostFor] = useState(null);

  const filtered = campaigns.filter(c =>
    (statusFilter === 'All' || c.status === statusFilter) &&
    (typeFilter === 'All' || c.campaign_type === typeFilter) &&
    (clientFilter === 'All' || c.client_id === clientFilter || (!c.client_id && clientFilter === '__nta'))
  );

  const getPostStats = (campaignId) => {
    const cp = posts.filter(p => p.campaign_id === campaignId);
    return {
      total: cp.length,
      scheduled: cp.filter(p => p.publishing_status === 'Scheduled').length,
      published: cp.filter(p => p.publishing_status === 'Published').length,
      pending: cp.filter(p => p.approval_status === 'Pending').length,
    };
  };

  const updateStatus = async (id, status) => {
    await base44.entities.Campaign.update(id, { status });
    onRefresh();
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Select value={clientFilter} onChange={setClientFilter} options={[
          { value: 'All', label: 'All Clients' },
          { value: '__nta', label: 'NTA Internal' },
          ...clients.map(c => ({ value: c.id, label: c.business_name })),
        ]} />
        <Select value={statusFilter} onChange={setStatusFilter} options={STATUSES.map(s => ({ value: s, label: s }))} />
        <Select value={typeFilter} onChange={setTypeFilter} options={TYPES.map(t => ({ value: t, label: t }))} />
        <div className="ml-auto">
          <button onClick={onNewCampaign} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
            <Plus className="w-3.5 h-3.5" /> New Campaign
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-left">
              {['Campaign', 'Client', 'Type', 'Start', 'End', 'Status', 'Posts', 'Scheduled', 'Published', ''].map(h => (
                <th key={h} className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length === 0 && (
              <tr><td colSpan={10} className="px-4 py-10 text-center text-slate-600 text-sm">No campaigns match filters</td></tr>
            )}
            {filtered.map(c => {
              const stats = getPostStats(c.id);
              const isOpen = expanded === c.id;
              const campaignPosts = posts.filter(p => p.campaign_id === c.id);
              return (
                <React.Fragment key={c.id}>
                  <tr className="hover:bg-slate-800/30 transition-colors cursor-pointer" onClick={() => setExpanded(isOpen ? null : c.id)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
                        <span className="font-medium text-white">{c.campaign_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{c.business_name || 'NTA Internal'}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{c.campaign_type}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{c.start_date || '—'}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{c.end_date || '—'}</td>
                    <td className="px-4 py-3"><CampaignStatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 text-slate-300 font-mono text-xs">{stats.total}</td>
                    <td className="px-4 py-3 text-violet-400 font-mono text-xs">{stats.scheduled}</td>
                    <td className="px-4 py-3 text-emerald-400 font-mono text-xs">{stats.published}</td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <select
                        value={c.status}
                        onChange={e => updateStatus(c.id, e.target.value)}
                        className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded px-2 py-1"
                      >
                        {['Draft','Planned','Awaiting Approval','Approved','Active','Scheduled','Completed','Paused','Cancelled'].map(s =>
                          <option key={s}>{s}</option>
                        )}
                      </select>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr>
                      <td colSpan={10} className="bg-slate-800/30 px-6 py-4">
                        <div className="space-y-3">
                          {c.objective && <p className="text-sm text-slate-300"><span className="text-slate-500 text-xs">Objective: </span>{c.objective}</p>}
                          {c.offer_or_message && <p className="text-sm text-slate-300"><span className="text-slate-500 text-xs">Message: </span>{c.offer_or_message}</p>}
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Posts in this campaign ({campaignPosts.length})</p>
                            <button onClick={() => setAddPostFor(c.id)} className="text-xs font-semibold text-blue-400 hover:text-blue-300">+ Add Post</button>
                          </div>
                          {campaignPosts.length === 0 ? (
                            <p className="text-xs text-slate-600">No posts yet.</p>
                          ) : (
                            <div className="grid gap-1">
                              {campaignPosts.map(p => (
                                <div key={p.id} className="flex items-center gap-3 text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
                                  <span>{PLATFORM_ICON[p.platform] || '📱'}</span>
                                  <span className="text-white font-medium flex-1 truncate">{p.title}</span>
                                  <span className="text-slate-500">{p.scheduled_date || 'Unscheduled'}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.publishing_status === 'Published' ? 'bg-emerald-900/40 text-emerald-300' : p.publishing_status === 'Scheduled' ? 'bg-violet-900/40 text-violet-300' : 'bg-slate-700 text-slate-400'}`}>{p.publishing_status}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {addPostFor && (
        <CreatePostModal
          campaigns={campaigns}
          clients={clients}
          prefillCampaignId={addPostFor}
          onClose={() => setAddPostFor(null)}
          onSaved={() => { setAddPostFor(null); onRefresh(); }}
        />
      )}
    </div>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
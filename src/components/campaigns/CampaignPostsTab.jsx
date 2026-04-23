import React, { useState } from 'react';
import { Plus, Edit, Copy, CheckCircle, X } from 'lucide-react';
import { PostStatusBadge, ApprovalBadge, PLATFORM_ICON } from './CampaignUtils';
import { base44 } from '@/api/base44Client';

const PUB_STATUSES = ['All', 'Draft', 'Ready', 'Scheduled', 'Publishing', 'Published', 'Failed', 'Cancelled'];
const APPROVAL_STATUSES = ['All', 'Not Needed', 'Pending', 'Approved', 'Rejected', 'Revision Needed'];
const PLATFORMS = ['All', 'Facebook', 'Instagram', 'LinkedIn', 'X', 'YouTube', 'Google Business Profile', 'TikTok'];

export default function CampaignPostsTab({ posts, campaigns, clients, onNewPost, onRefresh }) {
  const [clientF, setClientF] = useState('All');
  const [platF, setPlatF] = useState('All');
  const [campF, setCampF] = useState('All');
  const [pubF, setPubF] = useState('All');
  const [approvalF, setApprovalF] = useState('All');

  const campMap = {};
  campaigns.forEach(c => campMap[c.id] = c.campaign_name);

  const filtered = posts.filter(p =>
    (clientF === 'All' || p.client_id === clientF) &&
    (platF === 'All' || p.platform === platF) &&
    (campF === 'All' || p.campaign_id === campF) &&
    (pubF === 'All' || p.publishing_status === pubF) &&
    (approvalF === 'All' || p.approval_status === approvalF)
  ).sort((a, b) => (a.scheduled_date || '').localeCompare(b.scheduled_date || ''));

  const handleAction = async (action, post) => {
    if (action === 'approve') {
      await base44.entities.CampaignPost.update(post.id, { approval_status: 'Approved', publishing_status: post.scheduled_date ? 'Scheduled' : 'Ready' });
    } else if (action === 'cancel') {
      await base44.entities.CampaignPost.update(post.id, { publishing_status: 'Cancelled' });
    } else if (action === 'duplicate') {
      const { id, created_date, updated_date, ...rest } = post;
      await base44.entities.CampaignPost.create({ ...rest, title: `${rest.title} (copy)`, publishing_status: 'Draft' });
    }
    onRefresh();
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Sel value={clientF} onChange={setClientF} options={[{ value: 'All', label: 'All Clients' }, ...clients.map(c => ({ value: c.id, label: c.business_name }))]} />
        <Sel value={platF} onChange={setPlatF} options={PLATFORMS.map(p => ({ value: p, label: p }))} />
        <Sel value={campF} onChange={setCampF} options={[{ value: 'All', label: 'All Campaigns' }, ...campaigns.map(c => ({ value: c.id, label: c.campaign_name }))]} />
        <Sel value={pubF} onChange={setPubF} options={PUB_STATUSES.map(s => ({ value: s, label: s }))} />
        <Sel value={approvalF} onChange={setApprovalF} options={APPROVAL_STATUSES.map(s => ({ value: s, label: s }))} />
        <button onClick={onNewPost} className="ml-auto flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
          <Plus className="w-3.5 h-3.5" /> New Post
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-800 text-left">
              {['Post', 'Client', 'Campaign', 'Platform', 'Scheduled', 'Approval', 'Status', 'Published', 'Views', 'Engagement', 'Actions'].map(h => (
                <th key={h} className="px-3 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length === 0 && (
              <tr><td colSpan={11} className="px-4 py-10 text-center text-slate-600 text-sm">No posts match filters</td></tr>
            )}
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                <td className="px-3 py-3">
                  <p className="font-medium text-white truncate max-w-[160px]">{p.title}</p>
                  <p className="text-xs text-slate-500">{p.post_type}</p>
                </td>
                <td className="px-3 py-3 text-slate-400 text-xs">{p.business_name || 'NTA'}</td>
                <td className="px-3 py-3 text-slate-400 text-xs max-w-[120px] truncate">{campMap[p.campaign_id] || '—'}</td>
                <td className="px-3 py-3">
                  <span className="flex items-center gap-1 text-xs text-slate-300">
                    {PLATFORM_ICON[p.platform] || '📱'} {p.platform}
                  </span>
                </td>
                <td className="px-3 py-3 text-slate-400 text-xs whitespace-nowrap">
                  {p.scheduled_date ? `${p.scheduled_date} ${p.scheduled_time || ''}` : '—'}
                </td>
                <td className="px-3 py-3"><ApprovalBadge status={p.approval_status} /></td>
                <td className="px-3 py-3"><PostStatusBadge status={p.publishing_status} /></td>
                <td className="px-3 py-3 text-slate-500 text-xs">{p.published_at ? new Date(p.published_at).toLocaleDateString() : '—'}</td>
                <td className="px-3 py-3 text-slate-400 font-mono text-xs">{p.performance_views || 0}</td>
                <td className="px-3 py-3 text-slate-400 font-mono text-xs">{p.performance_engagement || 0}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    {p.approval_status === 'Pending' && (
                      <ActionBtn onClick={() => handleAction('approve', p)} title="Approve" icon={<CheckCircle className="w-3.5 h-3.5" />} color="text-emerald-400 hover:text-emerald-300" />
                    )}
                    <ActionBtn onClick={() => handleAction('duplicate', p)} title="Duplicate" icon={<Copy className="w-3.5 h-3.5" />} color="text-slate-400 hover:text-white" />
                    {p.publishing_status !== 'Published' && p.publishing_status !== 'Cancelled' && (
                      <ActionBtn onClick={() => handleAction('cancel', p)} title="Cancel" icon={<X className="w-3.5 h-3.5" />} color="text-slate-500 hover:text-red-400" />
                    )}
                  </div>
                </td>
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

function ActionBtn({ onClick, icon, title, color }) {
  return (
    <button onClick={onClick} title={title} className={`p-1 rounded transition-colors ${color}`}>{icon}</button>
  );
}
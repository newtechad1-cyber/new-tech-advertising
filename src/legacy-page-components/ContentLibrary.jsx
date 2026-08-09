import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import ContentAssetDetailDrawer from '../components/content-library/ContentAssetDetailDrawer';
import { Search, Download, Plus, Filter, Copy, Check } from 'lucide-react';

const PLATFORMS = ['facebook', 'instagram', 'linkedin', 'x', 'threads', 'google_business_profile', 'youtube', 'tiktok'];
const PLATFORM_EMOJI = { facebook: '📘', instagram: '📷', linkedin: '💼', x: '𝕏', threads: '🧵', google_business_profile: '🟢', youtube: '▶️', tiktok: '🎵' };
const STATUSES = ['draft', 'needs_review', 'approved', 'exported', 'scheduled', 'published', 'rejected'];
const STATUS_COLORS = {
  draft: 'bg-slate-700 text-slate-300',
  needs_review: 'bg-violet-900/50 text-violet-300',
  approved: 'bg-emerald-900/50 text-emerald-300',
  exported: 'bg-blue-900/50 text-blue-300',
  scheduled: 'bg-cyan-900/50 text-cyan-300',
  published: 'bg-teal-900/50 text-teal-300',
  rejected: 'bg-red-900/50 text-red-300',
};

const SEL = 'text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500';

function QuickCopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  if (!text) return null;
  return (
    <button onClick={copy} className="text-xs px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white rounded transition-colors flex items-center gap-1">
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

function downloadCSV(rows, filename) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = v => `"${String(v || '').replace(/"/g, '""')}"`;
  const csv = [headers.join(','), ...rows.map(r => headers.map(h => escape(r[h])).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ContentLibrary() {
  const [assets, setAssets] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [search, setSearch] = useState('');
  const [filterClient, setFilterClient] = useState('');
  const [filterCampaign, setFilterCampaign] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterC360, setFilterC360] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const [a, c, cl] = await Promise.all([
      base44.entities.NTAContentAsset.list('-created_date', 500),
      base44.entities.SpokeCampaign.list('-created_date', 200),
      base44.entities.Clients.filter({ archived: false }),
    ]);
    setAssets(a); setCampaigns(c); setClients(cl);
    setLoading(false);
  };

  const campMap = useMemo(() => Object.fromEntries(campaigns.map(c => [c.id, c])), [campaigns]);
  const clientMap = useMemo(() => Object.fromEntries(clients.map(c => [c.id, c])), [clients]);

  const filtered = useMemo(() => assets.filter(a => {
    if (filterClient && a.client_id !== filterClient) return false;
    if (filterCampaign && a.campaign_id !== filterCampaign) return false;
    if (filterPlatform && a.platform !== filterPlatform) return false;
    if (filterStatus && a.status !== filterStatus) return false;
    if (filterC360 === 'exported' && !a.exported_to_content360) return false;
    if (filterC360 === 'not_exported' && a.exported_to_content360) return false;
    if (filterC360 === 'scheduled' && !a.scheduled_in_content360) return false;
    if (search) {
      const q = search.toLowerCase();
      const text = [a.asset_name, a.caption_text, a.body_copy, a.headline, a.hashtags, a.cta].join(' ').toLowerCase();
      if (!text.includes(q)) return false;
    }
    return true;
  }), [assets, filterClient, filterCampaign, filterPlatform, filterStatus, filterC360, search]);

  // KPI counts
  const kpis = useMemo(() => ({
    total: filtered.length,
    draft: filtered.filter(a => a.status === 'draft').length,
    needs_review: filtered.filter(a => a.status === 'needs_review').length,
    approved: filtered.filter(a => a.status === 'approved').length,
    exported: filtered.filter(a => a.exported_to_content360).length,
    scheduled: filtered.filter(a => a.scheduled_in_content360).length,
  }), [filtered]);

  const advanceStatus = async (asset, e) => {
    e.stopPropagation();
    const flow = ['draft', 'needs_review', 'approved', 'exported', 'scheduled'];
    const idx = flow.indexOf(asset.status);
    if (idx < 0 || idx >= flow.length - 1) return;
    const next = flow[idx + 1];
    const updates = { status: next };
    if (next === 'exported') updates.exported_to_content360 = true;
    if (next === 'scheduled') updates.scheduled_in_content360 = true;
    await base44.entities.NTAContentAsset.update(asset.id, updates);
    setAssets(prev => prev.map(a => a.id === asset.id ? { ...a, ...updates } : a));
  };

  const downloadCampaignCSV = () => {
    const rows = filtered.map(a => ({
      'Asset Name': a.asset_name,
      'Client': clientMap[a.client_id]?.business_name || '',
      'Campaign': campMap[a.campaign_id]?.campaign_name || '',
      'Platform': a.platform,
      'Status': a.status,
      'Headline': a.headline || '',
      'Post Text': a.caption_text || a.body_copy || '',
      'CTA': a.cta || '',
      'Hashtags': a.hashtags || '',
      'Suggested Image/Video': a.suggested_image_video || '',
      'Suggested Publish Date': a.suggested_publish_date || '',
      'Exported to C360': a.exported_to_content360 ? 'Yes' : 'No',
      'Scheduled in C360': a.scheduled_in_content360 ? 'Yes' : 'No',
      'C360 Scheduled Date': a.content360_scheduled_date || '',
      'C360 Channel': a.content360_channel || '',
      'Notes': a.notes || '',
      'External Notes': a.external_notes || '',
    }));
    downloadCSV(rows, `content_library_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const downloadCalendarCSV = () => {
    const scheduled = filtered.filter(a => a.content360_scheduled_date || a.suggested_publish_date);
    const rows = scheduled
      .sort((a, b) => (a.content360_scheduled_date || a.suggested_publish_date) > (b.content360_scheduled_date || b.suggested_publish_date) ? 1 : -1)
      .map(a => ({
        'Date': a.content360_scheduled_date || a.suggested_publish_date,
        'Client': clientMap[a.client_id]?.business_name || '',
        'Campaign': campMap[a.campaign_id]?.campaign_name || '',
        'Platform': a.platform,
        'Asset Name': a.asset_name,
        'Post Text': a.caption_text || a.body_copy || '',
        'CTA': a.cta || '',
        'Hashtags': a.hashtags || '',
        'Status': a.status,
        'C360 Channel': a.content360_channel || '',
      }));
    downloadCSV(rows, `content_calendar_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <AgencyLayout>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Content Library</h1>
            <p className="text-slate-500 text-sm mt-0.5">All content assets — copy, review, and track exports to Content360</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={downloadCampaignCSV} className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
            <button onClick={downloadCalendarCSV} className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700">
              <Download className="w-3.5 h-3.5" /> Calendar CSV
            </button>
            <a href="/agency/content-asset" className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg">
              <Plus className="w-3.5 h-3.5" /> New Asset
            </a>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            ['Total', kpis.total, 'text-white', ''],
            ['Drafts', kpis.draft, 'text-slate-400', 'draft'],
            ['Needs Review', kpis.needs_review, 'text-violet-400', 'needs_review'],
            ['Approved', kpis.approved, 'text-emerald-400', 'approved'],
            ['Exported', kpis.exported, 'text-blue-400', 'exported'],
            ['Scheduled', kpis.scheduled, 'text-cyan-400', 'scheduled'],
          ].map(([label, val, color, s]) => (
            <button key={label}
              onClick={() => setFilterStatus(s === filterStatus ? '' : s)}
              className={`bg-slate-900 border rounded-xl p-3 text-left transition-all ${filterStatus === s && s ? 'border-blue-500' : 'border-slate-800 hover:border-slate-700'}`}>
              <p className={`text-xl font-black ${color}`}>{val}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search content..." className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-blue-500 w-44" />
          </div>
          <select value={filterClient} onChange={e => setFilterClient(e.target.value)} className={SEL}>
            <option value="">All Clients</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
          </select>
          <select value={filterCampaign} onChange={e => setFilterCampaign(e.target.value)} className={SEL}>
            <option value="">All Campaigns</option>
            {campaigns.map(c => <option key={c.id} value={c.id}>{c.campaign_name}</option>)}
          </select>
          <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)} className={SEL}>
            <option value="">All Platforms</option>
            {PLATFORMS.map(p => <option key={p} value={p}>{PLATFORM_EMOJI[p]} {p.replace(/_/g, ' ')}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={SEL}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
          <select value={filterC360} onChange={e => setFilterC360(e.target.value)} className={SEL}>
            <option value="">All C360 States</option>
            <option value="exported">Exported to C360</option>
            <option value="not_exported">Not Yet Exported</option>
            <option value="scheduled">Scheduled in C360</option>
          </select>
          {(filterClient || filterCampaign || filterPlatform || filterStatus || filterC360 || search) && (
            <button onClick={() => { setFilterClient(''); setFilterCampaign(''); setFilterPlatform(''); setFilterStatus(''); setFilterC360(''); setSearch(''); }} className="text-xs text-slate-500 hover:text-white px-2 py-1 rounded">Clear</button>
          )}
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {loading ? (
            <p className="p-8 text-slate-600 text-sm text-center">Loading content library...</p>
          ) : filtered.length === 0 ? (
            <p className="p-8 text-slate-600 text-sm text-center">No assets match your filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="text-left px-4 py-3">Asset</th>
                    <th className="text-left px-4 py-3 hidden md:table-cell">Client</th>
                    <th className="text-left px-4 py-3 hidden lg:table-cell">Campaign</th>
                    <th className="text-left px-4 py-3">Platform</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3 hidden sm:table-cell">C360</th>
                    <th className="text-left px-4 py-3">Copy</th>
                    <th className="text-left px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filtered.map(a => {
                    const client = clientMap[a.client_id];
                    const camp = campMap[a.campaign_id];
                    const postText = a.caption_text || a.body_copy || '';
                    const flow = ['draft', 'needs_review', 'approved', 'exported', 'scheduled'];
                    const idx = flow.indexOf(a.status);
                    const nextStatus = idx >= 0 && idx < flow.length - 1 ? flow[idx + 1] : null;
                    return (
                      <tr key={a.id} onClick={() => setSelectedAsset(a)} className="hover:bg-slate-800/40 cursor-pointer transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-white text-sm truncate max-w-[200px]">{a.asset_name}</p>
                          {a.headline && <p className="text-xs text-slate-500 truncate max-w-[200px]">{a.headline}</p>}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-xs text-slate-400 whitespace-nowrap">{client?.business_name || '—'}</td>
                        <td className="px-4 py-3 hidden lg:table-cell text-xs text-slate-400 truncate max-w-[150px]">{camp?.campaign_name || '—'}</td>
                        <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{PLATFORM_EMOJI[a.platform]} {a.platform?.replace(/_/g, ' ')}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_COLORS[a.status] || 'bg-slate-700 text-slate-300'}`}>
                            {a.status?.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <div className="flex flex-col gap-0.5">
                            {a.exported_to_content360 && <span className="text-xs text-blue-400">✓ Exported</span>}
                            {a.scheduled_in_content360 && <span className="text-xs text-cyan-400">✓ Scheduled</span>}
                            {!a.exported_to_content360 && !a.scheduled_in_content360 && <span className="text-xs text-slate-600">—</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                          <QuickCopyBtn text={postText} />
                        </td>
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                          {nextStatus && (
                            <button onClick={e => advanceStatus(a, e)} className="text-xs px-2 py-1 bg-slate-700 hover:bg-blue-700 text-slate-300 hover:text-white rounded transition-colors whitespace-nowrap">
                              → {nextStatus.replace(/_/g, ' ')}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedAsset && (
        <ContentAssetDetailDrawer
          asset={selectedAsset}
          campaigns={campaigns}
          clients={clients}
          onClose={() => setSelectedAsset(null)}
          onUpdate={() => { load(); setSelectedAsset(null); }}
        />
      )}
    </AgencyLayout>
  );
}
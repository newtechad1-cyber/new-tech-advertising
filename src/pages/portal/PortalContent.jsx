import React, { useState, useEffect } from 'react';
import PortalLayout from '../../components/portal/PortalLayout';
import { usePortalClient } from '../../lib/usePortalClient';
import { base44 } from '@/api/base44Client';
import { ExternalLink } from 'lucide-react';

const PLATFORM_EMOJI = { Facebook: '👥', Instagram: '📸', LinkedIn: '💼', YouTube: '▶️', 'Google Business Profile': '📍', TikTok: '🎵', X: '✖️' };

export default function PortalContent() {
  const { user, client, loading: authLoading } = usePortalClient();
  const [posts, setPosts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('scheduled');
  const [platformF, setPlatformF] = useState('All');

  useEffect(() => {
    if (!client?.id) return;
    Promise.all([
      base44.entities.CampaignPost.filter({ client_id: client.id }),
      base44.entities.Campaign.filter({ client_id: client.id }),
    ]).then(([p, c]) => { setPosts(p); setCampaigns(c); setLoading(false); });
  }, [client?.id]);

  if (authLoading || loading) return <Loader />;

  const campMap = {};
  campaigns.forEach(c => campMap[c.id] = c.campaign_name);

  const scheduled = posts.filter(p => ['Scheduled', 'Draft', 'Ready'].includes(p.publishing_status) && p.scheduled_date);
  const published = posts.filter(p => p.publishing_status === 'Published');
  const active = tab === 'scheduled' ? scheduled : published;
  const filtered = platformF === 'All' ? active : active.filter(p => p.platform === platformF);
  const platforms = ['All', ...new Set(posts.map(p => p.platform).filter(Boolean))];

  return (
    <PortalLayout client={client} user={user}>
      <div className="px-6 pt-8 pb-12 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Content</h1>
          <p className="text-slate-500 text-sm mt-1">Scheduled and published posts for {client?.business_name}.</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-0">
          {[['scheduled', 'Scheduled'], ['published', 'Published']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`pb-2.5 px-1 text-sm font-semibold border-b-2 transition-colors ${tab === id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {label}
              <span className="ml-1.5 text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">{id === 'scheduled' ? scheduled.length : published.length}</span>
            </button>
          ))}
        </div>

        {/* Platform filter */}
        <div className="flex flex-wrap gap-2">
          {platforms.map(p => (
            <button key={p} onClick={() => setPlatformF(p)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${platformF === p ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}>
              {p === 'All' ? 'All Platforms' : `${PLATFORM_EMOJI[p] || ''} ${p}`}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">No {tab} posts found.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Post', 'Platform', 'Campaign', tab === 'scheduled' ? 'Scheduled Date' : 'Posted Date', 'Status', tab === 'published' ? 'Link' : ''].filter(Boolean).map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.sort((a,b) => {
                  const da = tab === 'scheduled' ? a.scheduled_date : a.published_at;
                  const db = tab === 'scheduled' ? b.scheduled_date : b.published_at;
                  return (da||'').localeCompare(db||'');
                }).map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800 truncate max-w-[200px]">{p.title}</p>
                      {p.content_caption && <p className="text-xs text-slate-400 truncate max-w-[200px] mt-0.5">{p.content_caption}</p>}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{PLATFORM_EMOJI[p.platform] || ''} {p.platform}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{campMap[p.campaign_id] || '—'}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                      {tab === 'scheduled' ? (p.scheduled_date ? new Date(p.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—') : (p.published_at ? new Date(p.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        p.publishing_status === 'Published' ? 'bg-emerald-100 text-emerald-700' :
                        p.publishing_status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>{p.publishing_status === 'Published' ? 'Posted' : p.publishing_status || '—'}</span>
                    </td>
                    {tab === 'published' && (
                      <td className="px-4 py-3">
                        {p.external_post_id ? (
                          <a href={`https://${p.platform?.toLowerCase()}.com`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                            <ExternalLink className="w-3 h-3" /> View
                          </a>
                        ) : <span className="text-xs text-slate-400">—</span>}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}

function Loader() {
  return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" /></div>;
}
import React, { useState, useEffect } from 'react';
import PortalLayout from '../../components/portal/PortalLayout';
import { usePortalClient } from '../../lib/usePortalClient';
import { base44 } from '@/api/base44Client';
import { BarChart2, Eye, Heart, TrendingUp } from 'lucide-react';

const PLATFORM_EMOJI = { Facebook: '👥', Instagram: '📸', LinkedIn: '💼', YouTube: '▶️', 'Google Business Profile': '📍', TikTok: '🎵', X: '✖️' };

export default function PortalPerformance() {
  const { user, client, loading: authLoading } = usePortalClient();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    if (!client?.id) return;
    base44.entities.CampaignPost.filter({ client_id: client.id }).then(p => {
      setPosts(p.filter(post => post.publishing_status === 'Published'));
      setLoading(false);
    });
  }, [client?.id]);

  if (authLoading || loading) return <Loader />;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - parseInt(period));
  const inPeriod = posts.filter(p => p.published_at && new Date(p.published_at) >= cutoff);

  const totalViews = inPeriod.reduce((sum, p) => sum + (p.performance_views || 0), 0);
  const totalEngagement = inPeriod.reduce((sum, p) => sum + (p.performance_engagement || 0), 0);
  const totalLeads = inPeriod.reduce((sum, p) => sum + (p.performance_leads || 0), 0);

  // Platform breakdown
  const byPlatform = {};
  inPeriod.forEach(p => {
    if (!p.platform) return;
    if (!byPlatform[p.platform]) byPlatform[p.platform] = { count: 0, views: 0, engagement: 0 };
    byPlatform[p.platform].count++;
    byPlatform[p.platform].views += p.performance_views || 0;
    byPlatform[p.platform].engagement += p.performance_engagement || 0;
  });

  const topPlatform = Object.entries(byPlatform).sort((a,b) => b[1].count - a[1].count)[0]?.[0] || '—';
  const topPosts = [...inPeriod].sort((a,b) => ((b.performance_views||0) + (b.performance_engagement||0)) - ((a.performance_views||0) + (a.performance_engagement||0))).slice(0, 5);

  return (
    <PortalLayout client={client} user={user}>
      <div className="px-6 pt-8 pb-12 max-w-4xl mx-auto space-y-8">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Performance</h1>
            <p className="text-slate-500 text-sm mt-1">How your content is performing.</p>
          </div>
          <div className="flex gap-2">
            {[['7', '7 days'], ['30', '30 days'], ['90', '90 days']].map(([v, l]) => (
              <button key={v} onClick={() => setPeriod(v)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${period === v ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}>{l}</button>
            ))}
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: FileText2, label: 'Posts Published', value: inPeriod.length, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
            { icon: Eye, label: 'Total Views', value: totalViews.toLocaleString(), color: 'text-violet-600', bg: 'bg-violet-50 border-violet-200' },
            { icon: Heart, label: 'Total Engagement', value: totalEngagement.toLocaleString(), color: 'text-pink-600', bg: 'bg-pink-50 border-pink-200' },
            { icon: TrendingUp, label: 'Top Platform', value: topPlatform ? `${PLATFORM_EMOJI[topPlatform] || ''} ${topPlatform}` : '—', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
          ].map(card => (
            <div key={card.label} className={`border rounded-2xl p-4 ${card.bg}`}>
              <p className={`text-2xl font-black ${card.color}`}>{card.value}</p>
              <p className="text-xs text-slate-500 mt-1 leading-tight">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Platform breakdown */}
        {Object.keys(byPlatform).length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-slate-700 mb-4">Platform Breakdown</h2>
            <div className="space-y-3">
              {Object.entries(byPlatform).sort((a,b) => b[1].count - a[1].count).map(([platform, stats]) => {
                const maxCount = Math.max(...Object.values(byPlatform).map(s => s.count));
                const pct = maxCount > 0 ? Math.round((stats.count / maxCount) * 100) : 0;
                return (
                  <div key={platform} className="flex items-center gap-3">
                    <div className="w-28 text-xs text-slate-600 font-medium flex-shrink-0">{PLATFORM_EMOJI[platform] || ''} {platform}</div>
                    <div className="flex-1 bg-slate-100 rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="text-xs text-slate-500 w-16 text-right flex-shrink-0">{stats.count} post{stats.count !== 1 ? 's' : ''}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Top posts */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-700">Top Posts</h2>
          </div>
          {topPosts.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-sm">No performance data available yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Post', 'Platform', 'Posted', 'Views', 'Engagement'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topPosts.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800 truncate max-w-[180px]">{p.title}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{PLATFORM_EMOJI[p.platform] || ''} {p.platform}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{p.published_at ? new Date(p.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</td>
                    <td className="px-4 py-3 text-slate-700 text-sm font-semibold">{(p.performance_views || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-700 text-sm font-semibold">{(p.performance_engagement || 0).toLocaleString()}</td>
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

function FileText2({ className }) { return <BarChart2 className={className} />; }
function Loader() { return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" /></div>; }
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import ClientGuard from '@/components/auth/ClientGuard';
import { getAssetMeta } from '@/components/content-multiplier/AssetTypeIcon';
import { FileText, Video, Share2, Globe, TrendingUp, Calendar, Play, ChevronRight, Zap } from 'lucide-react';

const ASSET_TYPE_GROUPS = [
  { label: 'SEO Content', types: ['seo_article', 'service_page', 'landing_page', 'ebook_chapter'], icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { label: 'Video Production', types: ['video_script', 'short_video'], icon: Video, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  { label: 'Social Media', types: ['social_post', 'gbp_post'], icon: Share2, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  { label: 'Paid & Email', types: ['ad_copy', 'email'], icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
];

function StatCard({ icon: Icon, value, label, color }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-').replace('400', '500/10')}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function AssetTypeCard({ group, assets }) {
  const groupAssets = assets.filter(a => group.types.includes(a.asset_type));
  const ready = groupAssets.filter(a => a.publish_status === 'ready' || a.publish_status === 'published').length;
  return (
    <div className={`rounded-xl border p-5 ${group.bg}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <group.icon className={`w-5 h-5 ${group.color}`} />
          <span className="text-white font-semibold">{group.label}</span>
        </div>
        <span className="text-2xl font-bold text-white">{groupAssets.length}</span>
      </div>
      <div className="space-y-1 mb-3">
        {group.types.map(t => {
          const count = assets.filter(a => a.asset_type === t).length;
          if (count === 0) return null;
          const meta = getAssetMeta(t);
          return (
            <div key={t} className="flex items-center justify-between text-sm">
              <span className="text-slate-400">{meta.label}</span>
              <span className="text-slate-200 font-medium">{count}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">{ready} ready to publish</span>
        <div className="flex gap-1">
          {groupAssets.map((_, i) => i < 8 && (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${groupAssets[i]?.publish_status === 'published' ? 'bg-green-400' : groupAssets[i]?.publish_status === 'ready' ? 'bg-blue-400' : 'bg-slate-600'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RecentAssetList({ assets }) {
  const recent = assets.slice(0, 12);
  return (
    <div className="space-y-2">
      {recent.map(asset => {
        const meta = getAssetMeta(asset.asset_type);
        return (
          <div key={asset.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
            <span className={`flex-shrink-0 inline-flex items-center justify-center p-1.5 rounded-lg ${meta.bg}`}>
              <meta.icon className={`w-3.5 h-3.5 ${meta.color}`} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{asset.title}</p>
              <p className="text-xs text-slate-500">{meta.label}{asset.platform_target ? ` · ${asset.platform_target}` : ''}</p>
            </div>
            <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full ${
              asset.publish_status === 'published' ? 'bg-green-500/15 text-green-300' :
              asset.publish_status === 'ready' ? 'bg-blue-500/15 text-blue-300' :
              'bg-slate-800 text-slate-400'
            }`}>
              {asset.publish_status}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function ClientContentProduction() {
  const [assets, setAssets] = useState([]);
  const [cores, setCores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [a, c] = await Promise.all([
        base44.entities.ContentAsset.list('-created_date', 200),
        base44.entities.AuthorityContentCore.list('-created_date', 20),
      ]);
      setAssets(a);
      setCores(c);
      setLoading(false);
    };
    load();
  }, []);

  const videoAssets = assets.filter(a => ['video_script','short_video'].includes(a.asset_type));
  const socialAssets = assets.filter(a => a.asset_type === 'social_post');
  const seoAssets = assets.filter(a => ['seo_article','service_page','landing_page'].includes(a.asset_type));

  if (loading) {
    return (
      <ClientGuard>
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="flex items-center gap-3 text-slate-400">
            <Zap className="w-5 h-5 animate-pulse text-blue-400" />
            <span>Loading your content production…</span>
          </div>
        </div>
      </ClientGuard>
    );
  }

  return (
    <ClientGuard>
      <div className="min-h-screen bg-slate-950 text-white">
        {/* Header */}
        <div className="border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 px-6 py-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-xl bg-blue-600/20">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Content Production Dashboard</h1>
            </div>
            <p className="text-slate-400 ml-11">Your AI-powered content engine — producing assets across every channel</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-6 space-y-8">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={FileText} value={assets.length} label="Total Assets" color="text-blue-400" />
            <StatCard icon={Play} value={videoAssets.length} label="Video Scripts" color="text-red-400" />
            <StatCard icon={Share2} value={socialAssets.length} label="Social Posts" color="text-green-400" />
            <StatCard icon={Globe} value={seoAssets.length} label="SEO Pages" color="text-purple-400" />
          </div>

          {/* Content Type Grid */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              This Month's Content Output
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ASSET_TYPE_GROUPS.map(group => (
                <AssetTypeCard key={group.label} group={group} assets={assets} />
              ))}
            </div>
          </div>

          {/* Two-column: Recent + Topics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Assets */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Recent Production
              </h2>
              {assets.length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
                  <Zap className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500">No content generated yet.</p>
                  <p className="text-slate-600 text-sm mt-1">Your NTA team will start producing content soon.</p>
                </div>
              ) : (
                <RecentAssetList assets={assets} />
              )}
            </div>

            {/* SEO Expansion Map */}
            <div>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                SEO Expansion Map
              </h2>
              <div className="space-y-2">
                {cores.slice(0, 8).map(core => {
                  const coreAssets = assets.filter(a => a.core_content_id === core.id);
                  return (
                    <div key={core.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm text-white font-medium truncate">{core.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{core.primary_topic}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          core.status === 'complete' || core.status === 'published' ? 'bg-green-500/15 text-green-300' :
                          core.status === 'generating' ? 'bg-blue-500/15 text-blue-300' :
                          'bg-slate-800 text-slate-400'
                        }`}>{core.status}</span>
                        <span className="text-xs text-slate-500">{coreAssets.length} assets</span>
                      </div>
                    </div>
                  );
                })}
                {cores.length === 0 && (
                  <div className="rounded-xl border border-slate-800 p-6 text-center text-slate-500 text-sm">
                    No campaigns yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientGuard>
  );
}
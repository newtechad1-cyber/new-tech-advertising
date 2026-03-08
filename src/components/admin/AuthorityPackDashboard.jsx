import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen, FileText, Mail, MapPin, Share2, Video,
  Wrench, ChevronDown, ChevronRight, ExternalLink, Tv
} from 'lucide-react';

const ASSET_TYPES = [
  { key: 'cluster_article_ids', label: 'Cluster Articles', icon: FileText, color: 'text-blue-400', entity: 'Page' },
  { key: 'video_topic_ids', label: 'Video Topics', icon: Video, color: 'text-red-400', entity: 'VideoAsset' },
  { key: 'email_sequence_ids', label: 'Email Sequence', icon: Mail, color: 'text-cyan-400', entity: 'EmailTemplate' },
  { key: 'social_post_ids', label: 'Social Posts', icon: Share2, color: 'text-pink-400', entity: 'SocialPost' },
  { key: 'city_page_ids', label: 'City Pages', icon: MapPin, color: 'text-green-400', entity: 'LocationPage' },
];

function PackCard({ pack }) {
  const [expanded, setExpanded] = useState(false);
  const [assets, setAssets] = useState({});
  const [loadingAssets, setLoadingAssets] = useState(false);

  const loadAssets = async () => {
    if (Object.keys(assets).length > 0) { setExpanded(!expanded); return; }
    setLoadingAssets(true);
    setExpanded(true);
    try {
      const results = {};
      // Load pillar page
      if (pack.pillar_page_id) {
        const pages = await base44.entities.Page.filter({ id: pack.pillar_page_id });
        results.pillar = pages[0] || null;
      }
      // Load guide page
      if (pack.guide_page_id) {
        const guides = await base44.entities.Page.filter({ id: pack.guide_page_id });
        results.guide = guides[0] || null;
      }
      // Load service page
      if (pack.service_page_id) {
        const svc = await base44.entities.Page.filter({ id: pack.service_page_id });
        results.service = svc[0] || null;
      }
      // Load tool
      if (pack.tool_id) {
        const tools = await base44.entities.Tool.filter({ id: pack.tool_id });
        results.tool = tools[0] || null;
      }
      setAssets(results);
    } catch (e) {
      console.error('Failed to load pack assets:', e);
    } finally {
      setLoadingAssets(false);
    }
  };

  const statusColor = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    planning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    paused: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  }[pack.status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';

  const totalAssets =
    (pack.cluster_article_ids?.length || 0) +
    (pack.video_topic_ids?.length || 0) +
    (pack.email_sequence_ids?.length || 0) +
    (pack.social_post_ids?.length || 0) +
    (pack.city_page_ids?.length || 0) +
    (pack.pillar_page_id ? 1 : 0) +
    (pack.guide_page_id ? 1 : 0) +
    (pack.service_page_id ? 1 : 0) +
    (pack.tool_id ? 1 : 0);

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-violet-600/20 p-2 rounded-lg">
              <Tv className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <CardTitle className="text-white text-base">{pack.name}</CardTitle>
              <p className="text-slate-500 text-xs mt-0.5">/{pack.topic_slug}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge className={`text-xs border ${statusColor}`}>{pack.status}</Badge>
            <span className="text-slate-500 text-xs">{totalAssets} assets</span>
          </div>
        </div>

        {/* Asset count pills */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-full">
            {pack.cluster_article_ids?.length || 0} articles
          </span>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-full">
            {pack.city_page_ids?.length || 0} city pages
          </span>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-full">
            {pack.email_sequence_ids?.length || 0} emails
          </span>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-full">
            {pack.social_post_ids?.length || 0} social posts
          </span>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-full">
            {pack.video_topic_ids?.length || 0} videos
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {pack.summary && (
          <p className="text-slate-500 text-xs leading-relaxed">{pack.summary}</p>
        )}

        <button
          onClick={loadAssets}
          className="flex items-center gap-2 text-violet-400 hover:text-violet-300 text-xs font-medium transition-colors"
        >
          {loadingAssets ? 'Loading...' : expanded ? (
            <><ChevronDown className="w-3.5 h-3.5" /> Hide Details</>
          ) : (
            <><ChevronRight className="w-3.5 h-3.5" /> View Core Assets</>
          )}
        </button>

        {expanded && !loadingAssets && (
          <div className="space-y-2 pt-1">
            {/* Core pages */}
            {[
              { label: 'Pillar Page', data: assets.pillar, icon: BookOpen },
              { label: 'Lead Magnet Guide', data: assets.guide, icon: FileText },
              { label: 'Service Page', data: assets.service, icon: ExternalLink },
              { label: 'Tool', data: assets.tool, icon: Wrench },
            ].map(({ label, data, icon: AssetIcon }) => data && (
              <div key={label} className="flex items-center justify-between bg-slate-800/50 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                    <AssetIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs text-slate-400">{label}</span>
                </div>
                <span className="text-xs text-white truncate max-w-[200px]">{data.title || data.name || data.slug}</span>
              </div>
            ))}

            {/* Asset type counts */}
            {ASSET_TYPES.map(({ key, label, icon: Icon, color }) => (
              pack[key]?.length > 0 && (
                <div key={key} className="flex items-center justify-between bg-slate-800/50 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                    <span className="text-xs text-slate-400">{label}</span>
                  </div>
                  <span className="text-xs text-white">{pack[key].length} records</span>
                </div>
              )
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AuthorityPackDashboard() {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.AuthorityPack.list('-created_date')
      .then(setPacks)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-slate-500 text-sm">Loading authority packs...</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-bold">Authority Packs</h2>
          <p className="text-slate-400 text-sm mt-1">{packs.length} packs — {packs.filter(p => p.status === 'active').length} active</p>
        </div>
      </div>

      {packs.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 rounded-xl border border-slate-800">
          <Tv className="w-10 h-10 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500">No authority packs yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {packs.map(pack => <PackCard key={pack.id} pack={pack} />)}
        </div>
      )}
    </div>
  );
}
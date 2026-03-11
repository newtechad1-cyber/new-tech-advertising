import React, { useState } from 'react';
import { getAssetMeta } from './AssetTypeIcon';

const ASSET_TYPES = [
  'seo_article','service_page','video_script','short_video',
  'social_post','ad_copy','email','landing_page','gbp_post','ebook_chapter'
];

const STATUS_DOT = {
  draft:     'bg-slate-500',
  ready:     'bg-blue-400',
  scheduled: 'bg-yellow-400',
  published: 'bg-green-400',
};

export default function AssetGrid({ assets, onSelect }) {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? assets : assets.filter(a => a.asset_type === filter);

  const byType = {};
  ASSET_TYPES.forEach(t => { byType[t] = assets.filter(a => a.asset_type === t); });

  return (
    <div className="space-y-4">
      {/* Type filter chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`text-xs px-3 py-1 rounded-full transition-all ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
        >
          All ({assets.length})
        </button>
        {ASSET_TYPES.filter(t => byType[t].length > 0).map(t => {
          const meta = getAssetMeta(t);
          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`text-xs px-3 py-1 rounded-full transition-all ${filter === t ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              {meta.label} ({byType[t].length})
            </button>
          );
        })}
      </div>

      {/* Asset cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(asset => {
          const meta = getAssetMeta(asset.asset_type);
          return (
            <button
              key={asset.id}
              onClick={() => onSelect(asset)}
              className="text-left p-4 rounded-xl border border-slate-800 bg-slate-900 hover:border-slate-600 transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`flex-shrink-0 inline-flex items-center justify-center rounded-lg ${meta.bg} p-1.5`}>
                    <meta.icon className={`w-3.5 h-3.5 ${meta.color}`} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">{meta.label}</p>
                    <p className="text-white text-sm font-medium truncate leading-tight">{asset.title}</p>
                  </div>
                </div>
                <span className={`flex-shrink-0 w-2 h-2 rounded-full mt-1.5 ${STATUS_DOT[asset.publish_status] || STATUS_DOT.draft}`} />
              </div>
              {asset.platform_target && (
                <p className="text-xs text-slate-500 mt-2 ml-8">{asset.platform_target}</p>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-sm">
          No assets yet — hit Generate to multiply this topic.
        </div>
      )}
    </div>
  );
}
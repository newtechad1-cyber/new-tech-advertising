import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Calendar, Package, PauseCircle, RotateCcw, Globe, Facebook, Instagram, Youtube, Mail } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const DEST_CONFIG = {
  website: { icon: Globe, color: 'text-blue-300', badge: 'bg-blue-950 text-blue-300' },
  facebook: { icon: Facebook, color: 'text-indigo-300', badge: 'bg-indigo-950 text-indigo-300' },
  instagram: { icon: Instagram, color: 'text-pink-300', badge: 'bg-pink-950 text-pink-300' },
  tiktok: { icon: Zap, color: 'text-slate-300', badge: 'bg-slate-700 text-slate-300' },
  youtube: { icon: Youtube, color: 'text-red-300', badge: 'bg-red-950 text-red-300' },
  gbp: { icon: Globe, color: 'text-emerald-300', badge: 'bg-emerald-950 text-emerald-300' },
  email: { icon: Mail, color: 'text-amber-300', badge: 'bg-amber-950 text-amber-300' },
};

const URGENCY_COLOR = { urgent: 'text-red-300', normal: 'text-slate-400', scheduled: 'text-slate-500' };

const FALLBACK = [
  { asset_title: 'Arctic Air — 5 HVAC Tips Blog Post', content_type: 'article', client_name: 'Arctic Air HVAC', vertical: 'HVAC', destination: 'website', approval_status: 'approved', urgency: 'urgent', status: 'ready', campaign_tie_in: 'Spring Promo 2026', publish_schedule: '2026-03-12T14:00:00' },
  { asset_title: 'ProHeat Spring Reel', content_type: 'video', client_name: 'ProHeat Systems', vertical: 'HVAC', destination: 'instagram', approval_status: 'approved', urgency: 'urgent', status: 'ready', campaign_tie_in: 'Spring Awareness', publish_schedule: '2026-03-12T16:00:00' },
  { asset_title: 'Precision Plumbing — GBP Weekly Update', content_type: 'gbp_post', client_name: 'Precision Plumbing', vertical: 'Home Services', destination: 'gbp', approval_status: 'approved', urgency: 'normal', status: 'scheduled', publish_schedule: '2026-03-13T09:00:00' },
  { asset_title: 'Mesa Grill — Happy Hour Facebook Post', content_type: 'social_post', client_name: 'Mesa Grill Group', vertical: 'Restaurant', destination: 'facebook', approval_status: 'approved', urgency: 'normal', status: 'ready', campaign_tie_in: 'Happy Hour Q1', publish_schedule: '2026-03-12T17:00:00' },
  { asset_title: 'Apex Law — YouTube Explainer', content_type: 'video', client_name: 'Apex Law Partners', vertical: 'Legal', destination: 'youtube', approval_status: 'approved', urgency: 'scheduled', status: 'scheduled', publish_schedule: '2026-03-14T10:00:00' },
  { asset_title: 'Citywide Dental — March Newsletter', content_type: 'email', client_name: 'Citywide Dental', vertical: 'Dental', destination: 'email', approval_status: 'approved', urgency: 'normal', status: 'ready', publish_schedule: '2026-03-13T08:00:00' },
  { asset_title: 'CoolBreeze — Instagram Reel', content_type: 'social_post', client_name: 'CoolBreeze HVAC', vertical: 'HVAC', destination: 'instagram', approval_status: 'approved', urgency: 'normal', status: 'ready', publish_schedule: '2026-03-12T12:00:00' },
  { asset_title: 'Blue Ridge Roofing TikTok', content_type: 'video', client_name: 'Blue Ridge Roofing', vertical: 'Roofing', destination: 'tiktok', approval_status: 'pending', urgency: 'low', status: 'held', publish_schedule: null },
];

export default function OPSPublishingPanel({ assets = [], onRefresh }) {
  const [destFilter, setDestFilter] = useState('all');
  const data = assets.length > 0 ? assets : FALLBACK;
  const filtered = destFilter === 'all' ? data : data.filter(a => a.destination === destFilter);
  const ready = data.filter(a => a.status === 'ready').length;

  const handleAction = async (asset, action) => {
    const statusMap = { publish: 'published', schedule: 'scheduled', hold: 'held', return: 'returned' };
    if (statusMap[action] && asset.id && assets.length > 0) {
      await base44.entities.PublishingReadyAsset.update(asset.id, { status: statusMap[action] }).catch(() => {});
      onRefresh?.();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Publishing Readiness Command Panel</h2>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 rounded-lg text-xs font-medium text-white transition-colors">
          <Package className="w-3 h-3" /> Batch Publish ({ready})
        </button>
      </div>

      {/* Destination filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {['all', ...Object.keys(DEST_CONFIG)].map(dest => (
          <button key={dest} onClick={() => setDestFilter(dest)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${destFilter === dest ? 'bg-orange-700 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            {dest}
          </button>
        ))}
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Ready to Publish — {filtered.length} assets</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-700/50">
            <div className="hidden sm:grid grid-cols-8 gap-2 px-4 py-2 text-[10px] text-slate-600 uppercase tracking-wider">
              <span className="col-span-2">Asset</span><span>Type</span><span>Client</span><span>Destination</span><span>Schedule</span><span>Urgency</span><span>Actions</span>
            </div>
            {filtered.map((asset, i) => {
              const destCfg = DEST_CONFIG[asset.destination] || DEST_CONFIG.website;
              const DestIcon = destCfg.icon;
              return (
                <div key={i} className={`flex flex-col sm:grid sm:grid-cols-8 gap-2 items-start sm:items-center px-4 py-3 hover:bg-slate-700/30 transition-colors ${asset.urgency === 'urgent' ? 'border-l-2 border-l-red-600' : ''}`}>
                  <div className="col-span-2 flex items-center gap-2">
                    <p className="text-xs font-medium text-white truncate">{asset.asset_title}</p>
                  </div>
                  <Badge className="text-[9px] px-1.5 bg-slate-700 text-slate-300 w-fit">{asset.content_type?.replace(/_/g, ' ')}</Badge>
                  <p className="text-[10px] text-slate-400 truncate">{asset.client_name}</p>
                  <div className="flex items-center gap-1">
                    <DestIcon className={`w-3.5 h-3.5 ${destCfg.color}`} />
                    <Badge className={`text-[9px] px-1.5 ${destCfg.badge}`}>{asset.destination}</Badge>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {asset.publish_schedule ? new Date(asset.publish_schedule).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Not set'}
                  </p>
                  <span className={`text-[10px] font-semibold ${URGENCY_COLOR[asset.urgency]}`}>{asset.urgency}</span>
                  <div className="flex gap-1 flex-wrap">
                    {asset.status !== 'published' && (
                      <>
                        <button onClick={() => handleAction(asset, 'publish')} className="p-1 rounded-md bg-emerald-950/30 border border-emerald-700/40 hover:bg-emerald-950/60 transition-colors" title="Publish Now">
                          <Zap className="w-3 h-3 text-emerald-300" />
                        </button>
                        <button onClick={() => handleAction(asset, 'schedule')} className="p-1 rounded-md border border-slate-700 hover:border-slate-500 transition-colors" title="Schedule">
                          <Calendar className="w-3 h-3 text-slate-400" />
                        </button>
                        <button onClick={() => handleAction(asset, 'hold')} className="p-1 rounded-md border border-slate-700 hover:border-slate-500 transition-colors" title="Hold">
                          <PauseCircle className="w-3 h-3 text-slate-400" />
                        </button>
                        <button onClick={() => handleAction(asset, 'return')} className="p-1 rounded-md border border-slate-700 hover:border-slate-500 transition-colors" title="Return to Revision">
                          <RotateCcw className="w-3 h-3 text-slate-400" />
                        </button>
                      </>
                    )}
                    {asset.status === 'published' && <Badge className="text-[9px] px-1.5 bg-emerald-950 text-emerald-300">Published</Badge>}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
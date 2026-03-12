import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Edit3, Send, Zap, Clock, AlertTriangle, X, Calendar } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STATUS_CONFIG = {
  awaiting_internal: { badge: 'bg-blue-950 text-blue-300', label: 'Internal Review' },
  awaiting_founder: { badge: 'bg-violet-950 text-violet-300', label: 'Founder Review' },
  awaiting_client: { badge: 'bg-amber-950 text-amber-300', label: 'Client Approval' },
  revision_requested: { badge: 'bg-orange-950 text-orange-300', label: 'Revision Needed' },
  approved: { badge: 'bg-emerald-950 text-emerald-300', label: 'Approved' },
};

const TYPE_ICON = {
  article: '📝', social_post: '📱', video: '🎬', email: '📧',
  landing_page: '🌐', ad_creative: '📣', video_script: '📜', gbp_post: '📍',
};

const URGENCY_COLOR = {
  urgent: 'text-red-300 border-red-700/40',
  normal: 'text-slate-400 border-slate-700',
  low: 'text-slate-500 border-slate-700',
};

const FALLBACK = [
  { id: 'a1', asset_title: 'Arctic Air — 5 Tips for Summer AC Prep', asset_type: 'article', client_name: 'Arctic Air HVAC', status: 'awaiting_internal', review_urgency: 'normal', revision_count: 0, submitted_date: '2026-03-11' },
  { id: 'a2', asset_title: 'ProHeat Spring Promo — Facebook Video Ad', asset_type: 'video', client_name: 'ProHeat Systems', status: 'awaiting_founder', review_urgency: 'urgent', revision_count: 1, submitted_date: '2026-03-10' },
  { id: 'a3', asset_title: 'Precision Plumbing — Social Reel Series', asset_type: 'social_post', client_name: 'Precision Plumbing', status: 'awaiting_client', review_urgency: 'normal', revision_count: 0, submitted_date: '2026-03-09' },
  { id: 'a4', asset_title: 'Mesa Grill — Happy Hour Email', asset_type: 'email', client_name: 'Mesa Grill Group', status: 'revision_requested', review_urgency: 'urgent', revision_count: 2, submitted_date: '2026-03-08' },
  { id: 'a5', asset_title: 'Citywide Dental — New Patient Landing Page', asset_type: 'landing_page', client_name: 'Citywide Dental', status: 'awaiting_internal', review_urgency: 'low', revision_count: 0, submitted_date: '2026-03-12' },
  { id: 'a6', asset_title: 'Arctic Air — GBP Weekly Post', asset_type: 'gbp_post', client_name: 'Arctic Air HVAC', status: 'approved', review_urgency: 'normal', revision_count: 0, submitted_date: '2026-03-10' },
];

export default function OPSApprovalQueue({ items = [], onRefresh }) {
  const [filter, setFilter] = useState('all');
  const data = items.length > 0 ? items : FALLBACK;

  const counts = Object.keys(STATUS_CONFIG).reduce((acc, s) => {
    acc[s] = data.filter(i => i.status === s).length;
    return acc;
  }, {});

  const filtered = filter === 'all' ? data : data.filter(i => i.status === filter);

  const handleAction = async (item, action) => {
    const statusMap = { approve: 'approved', send_to_client: 'awaiting_client', revision: 'revision_requested' };
    if (statusMap[action] && item.id && items.length > 0) {
      await base44.entities.ApprovalQueueItem.update(item.id, { status: statusMap[action] }).catch(() => {});
      onRefresh?.();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Approval Queue Workspace</h2>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 flex-wrap">
        <button onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === 'all' ? 'bg-orange-700 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
          All ({data.length})
        </button>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === key ? 'bg-orange-700 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            {cfg.label} ({counts[key] || 0})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((item, i) => {
          const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.awaiting_internal;
          return (
            <Card key={i} className={`bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors ${item.review_urgency === 'urgent' ? 'border-l-2 border-l-red-600' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xl">{TYPE_ICON[item.asset_type] || '📄'}</span>
                  <Badge className={`text-[9px] px-1.5 ${cfg.badge}`}>{cfg.label}</Badge>
                </div>
                <p className="text-xs font-bold text-white mb-1 line-clamp-2">{item.asset_title}</p>
                <p className="text-[10px] text-slate-400 mb-2">{item.client_name}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] border rounded-full px-2 py-0.5 ${URGENCY_COLOR[item.review_urgency]}`}>
                    {item.review_urgency === 'urgent' && <AlertTriangle className="w-2.5 h-2.5 inline mr-0.5" />}
                    {item.review_urgency}
                  </span>
                  {item.revision_count > 0 && (
                    <span className="text-[10px] text-amber-300">Rev #{item.revision_count}</span>
                  )}
                  <span className="text-[10px] text-slate-600 ml-auto">{item.submitted_date}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button onClick={() => handleAction(item, 'approve')}
                    className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-700/40 text-emerald-300 text-[10px] font-medium hover:bg-emerald-950/60 transition-colors">
                    <CheckCircle2 className="w-3 h-3" /> Approve
                  </button>
                  <button onClick={() => handleAction(item, 'revision')}
                    className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-amber-950/20 border border-amber-700/40 text-amber-300 text-[10px] font-medium hover:bg-amber-950/40 transition-colors">
                    <Edit3 className="w-3 h-3" /> Revision
                  </button>
                  <button onClick={() => handleAction(item, 'send_to_client')}
                    className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-blue-950/20 border border-blue-700/40 text-blue-300 text-[10px] font-medium hover:bg-blue-950/40 transition-colors">
                    <Send className="w-3 h-3" /> To Client
                  </button>
                  <button className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-violet-950/20 border border-violet-700/40 text-violet-300 text-[10px] font-medium hover:bg-violet-950/40 transition-colors">
                    <Zap className="w-3 h-3" /> Publish Now
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
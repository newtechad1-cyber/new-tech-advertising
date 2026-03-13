import React from 'react';
import { Loader2, CheckCircle2, Clock, AlertCircle, Zap } from 'lucide-react';

const FULFILLMENT_ITEMS = [
  { id: 'site_build', category: 'Website', label: 'Authority Website Build', assignee: 'Web Team', est: '5–7 days' },
  { id: 'content_q1', category: 'Content', label: 'Month 1 Blog Articles (8)', assignee: 'AI + Editor', est: '3–4 days' },
  { id: 'social_q1', category: 'Content', label: 'Month 1 Social Posts (20)', assignee: 'AI + Designer', est: '2–3 days' },
  { id: 'video_script', category: 'Video', label: 'Video Scripts (4)', assignee: 'Strategist', est: '2 days' },
  { id: 'video_prod', category: 'Video', label: 'Video Production Batch', assignee: 'Video Team', est: '7–10 days' },
  { id: 'streaming_creative', category: 'Streaming TV', label: 'TV Commercial Script + Production', assignee: 'Creative Team', est: '10–14 days' },
  { id: 'seo_setup', category: 'SEO', label: 'Local SEO + Citation Setup', assignee: 'SEO Agent', est: '3–5 days' },
  { id: 'reporting_setup', category: 'Reporting', label: 'ROI Dashboard Configuration', assignee: 'Ops Team', est: '1–2 days' },
];

const STATUS_CONFIG = {
  pending: { icon: Clock, color: '#94a3b8', label: 'Pending', bg: 'bg-slate-800/40' },
  in_progress: { icon: Loader2, color: '#3b82f6', label: 'In Progress', bg: 'bg-blue-950/20', spin: true },
  needs_review: { icon: AlertCircle, color: '#f59e0b', label: 'Needs Review', bg: 'bg-amber-950/20' },
  completed: { icon: CheckCircle2, color: '#10b981', label: 'Complete', bg: 'bg-green-950/20' },
  blocked: { icon: AlertCircle, color: '#ef4444', label: 'Blocked', bg: 'bg-red-950/20' },
};

const CAT_COLORS = {
  Website: '#3b82f6', Content: '#8b5cf6', Video: '#f59e0b', 'Streaming TV': '#ec4899', SEO: '#10b981', Reporting: '#06b6d4',
};

export default function OBFulfillmentQueue({ taskStatuses, onStatusChange }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-sm flex items-center gap-2"><Zap className="w-4 h-4 text-purple-400" /> Internal Fulfillment Queue</h3>
          <p className="text-slate-500 text-xs mt-0.5">Operator view — production status tracking</p>
        </div>
        <span className="text-xs text-purple-400 font-bold px-2 py-1 bg-purple-900/20 rounded-lg border border-purple-800/30">Admin Only</span>
      </div>
      <div className="divide-y divide-slate-800/60">
        {FULFILLMENT_ITEMS.map((item) => {
          const status = taskStatuses[item.id] || 'pending';
          const cfg = STATUS_CONFIG[status];
          const Icon = cfg.icon;
          return (
            <div key={item.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800/20 transition-colors">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: CAT_COLORS[item.category] }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold" style={{ color: CAT_COLORS[item.category] }}>{item.category}</span>
                  <span className="text-slate-300 text-xs font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-600">
                  <span>{item.assignee}</span>
                  <span>Est: {item.est}</span>
                </div>
              </div>
              <select
                value={status}
                onChange={e => onStatusChange(item.id, e.target.value)}
                className="text-xs bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500"
                style={{ color: cfg.color }}
              >
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}
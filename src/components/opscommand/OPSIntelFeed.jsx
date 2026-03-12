import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, Zap, Users, Video, CheckCircle2, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const TYPE_CONFIG = {
  performance_spike: { icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-950/20 border-emerald-700/40', badge: 'bg-emerald-950 text-emerald-300' },
  bottleneck: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-950/20 border-amber-700/40', badge: 'bg-amber-950 text-amber-300' },
  failure_trend: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-950/20 border-red-700/40', badge: 'bg-red-950 text-red-300' },
  capacity_alert: { icon: Zap, color: 'text-orange-400', bg: 'bg-orange-950/20 border-orange-700/40', badge: 'bg-orange-950 text-orange-300' },
  client_anomaly: { icon: Users, color: 'text-violet-400', bg: 'bg-violet-950/20 border-violet-700/40', badge: 'bg-violet-950 text-violet-300' },
  quality_signal: { icon: CheckCircle2, color: 'text-cyan-400', bg: 'bg-cyan-950/20 border-cyan-700/40', badge: 'bg-cyan-950 text-cyan-300' },
  opportunity: { icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-950/20 border-blue-700/40', badge: 'bg-blue-950 text-blue-300' },
};

const SEVERITY_BADGE = {
  critical: 'bg-red-950 text-red-300',
  high: 'bg-orange-950 text-orange-300',
  medium: 'bg-amber-950 text-amber-300',
  info: 'bg-slate-700 text-slate-400',
};

const FALLBACK = [
  { insight_type: 'performance_spike', headline: 'HVAC video output up 34% this week', narrative: 'Arctic Air and ProHeat combined produced 22 videos this week vs. 16 last week — a significant production surge driven by the Spring promo campaign.', severity: 'info', status: 'new', related_system: 'Video Pipeline', related_client: 'Arctic Air HVAC' },
  { insight_type: 'bottleneck', headline: 'Restaurant content approvals lagging behind schedule', narrative: 'Mesa Grill and Taco Loco have 7 combined assets waiting for client approval for over 72 hours. Risk of delayed campaign launches.', severity: 'high', status: 'new', related_system: 'Approval Queue', related_client: 'Mesa Grill Group' },
  { insight_type: 'quality_signal', headline: 'Short-form videos outperforming article production speed', narrative: 'Average video generation now completing in 9.4 minutes vs. articles at 14.2 minutes. Consider pipeline rebalancing toward video.', severity: 'info', status: 'acknowledged', related_system: 'Content Pipeline' },
  { insight_type: 'client_anomaly', headline: 'One client consuming disproportionate production capacity', narrative: 'Apex Law Partners accounts for 22% of all content jobs this week despite being 8% of client base. May need dedicated queue allocation.', severity: 'medium', status: 'new', related_client: 'Apex Law Partners', related_system: 'Capacity Monitor' },
  { insight_type: 'failure_trend', headline: 'Render failure trend isolated to branded intro scenes', narrative: 'Asset ID #1142 (branded intro template) causing 5 of 7 render failures this week. Template likely corrupted — recommend re-upload and re-render.', severity: 'critical', status: 'assigned', assigned_to: 'Ops Team', related_system: 'Video Render Engine' },
  { insight_type: 'capacity_alert', headline: 'Video render queue at 96% capacity — approaching limit', narrative: 'Current render queue depth will exceed maximum capacity within 4 hours if intake rate holds steady. Recommend pausing non-urgent video jobs.', severity: 'high', status: 'new', related_system: 'Render Engine' },
];

export default function OPSIntelFeed({ insights = [], onRefresh }) {
  const [dismissed, setDismissed] = useState([]);
  const data = (insights.length > 0 ? insights : FALLBACK).filter((_, i) => !dismissed.includes(i));

  const handleAction = async (item, action, index) => {
    if (action === 'dismiss') { setDismissed(d => [...d, index]); return; }
    const statusMap = { acknowledge: 'acknowledged', assign: 'assigned', task: 'converted_to_task' };
    if (statusMap[action] && item.id && insights.length > 0) {
      await base44.entities.OpsInsight.update(item.id, { status: statusMap[action] }).catch(() => {});
      onRefresh?.();
    }
  };

  const critical = data.filter(i => i.severity === 'critical' || i.severity === 'high').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Ops Intelligence Feed</h2>
          {critical > 0 && (
            <Badge className="bg-red-950 text-red-300 gap-1 text-xs">
              <AlertTriangle className="w-3 h-3" /> {critical} need attention
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {data.map((insight, i) => {
          const cfg = TYPE_CONFIG[insight.insight_type] || TYPE_CONFIG.opportunity;
          const Icon = cfg.icon;
          return (
            <div key={i} className={`border rounded-xl p-4 ${cfg.bg} relative`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-xs font-bold text-white">{insight.headline}</p>
                    <Badge className={`text-[9px] px-1.5 ${SEVERITY_BADGE[insight.severity]}`}>{insight.severity}</Badge>
                    <Badge className={`text-[9px] px-1.5 ${cfg.badge}`}>{insight.insight_type?.replace(/_/g, ' ')}</Badge>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{insight.narrative}</p>
                  <div className="flex items-center gap-2 flex-wrap text-[10px] text-slate-500 mb-3">
                    {insight.related_client && <span>Client: <span className="text-slate-300">{insight.related_client}</span></span>}
                    {insight.related_system && <span>System: <span className="text-slate-300">{insight.related_system}</span></span>}
                    {insight.assigned_to && <span className="text-violet-300">→ {insight.assigned_to}</span>}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { action: 'acknowledge', label: 'Acknowledge', color: 'border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white' },
                      { action: 'assign', label: 'Assign', color: 'border-violet-700/50 text-violet-300 hover:bg-violet-950/30' },
                      { action: 'task', label: 'Create Task', color: 'border-blue-700/50 text-blue-300 hover:bg-blue-950/30' },
                    ].map(a => (
                      <button key={a.action} onClick={() => handleAction(insight, a.action, i)}
                        className={`px-2.5 py-1 rounded-lg border bg-transparent text-[10px] font-medium transition-colors ${a.color}`}>
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => handleAction(insight, 'dismiss', i)} className="flex-shrink-0 text-slate-600 hover:text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
        {data.length === 0 && (
          <div className="text-center py-8 text-slate-600 text-xs">All insights addressed — production running smoothly</div>
        )}
      </div>
    </div>
  );
}
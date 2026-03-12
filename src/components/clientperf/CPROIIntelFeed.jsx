import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Zap, MapPin, DollarSign, Video, Users, AlertTriangle, X, CheckCircle2, ClipboardList, UserCheck, Paperclip } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const TYPE_CONFIG = {
  roi_curve: { icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-950/20 border-emerald-700/40', badge: 'bg-emerald-950 text-emerald-300' },
  engagement_pattern: { icon: Zap, color: 'text-violet-400', bg: 'bg-violet-950/20 border-violet-700/40', badge: 'bg-violet-950 text-violet-300' },
  geographic_cluster: { icon: MapPin, color: 'text-blue-400', bg: 'bg-blue-950/20 border-blue-700/40', badge: 'bg-blue-950 text-blue-300' },
  pricing_opportunity: { icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-950/20 border-amber-700/40', badge: 'bg-amber-950 text-amber-300' },
  vertical_trend: { icon: Users, color: 'text-teal-400', bg: 'bg-teal-950/20 border-teal-700/40', badge: 'bg-teal-950 text-teal-300' },
  content_performance: { icon: Video, color: 'text-pink-400', bg: 'bg-pink-950/20 border-pink-700/40', badge: 'bg-pink-950 text-pink-300' },
  churn_signal: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-950/20 border-red-700/40', badge: 'bg-red-950 text-red-300' },
};

const SEVERITY_BADGE = {
  critical: 'bg-red-950 text-red-300', high: 'bg-orange-950 text-orange-300',
  medium: 'bg-amber-950 text-amber-300', info: 'bg-slate-700 text-slate-400',
};

const FALLBACK = [
  { insight_type: 'roi_curve', headline: 'HVAC clients achieving fastest ROI curve in portfolio', narrative: 'Arctic Air and ProHeat are on a 94-day average time-to-positive-ROI — 38% faster than the rest of the portfolio. HVAC vertical driving top margin performance.', severity: 'info', status: 'new', related_vertical: 'HVAC', impact_estimate: '+$4,200 avg LTV' },
  { insight_type: 'content_performance', headline: 'Video-first campaigns producing 2x engagement vs. written content', narrative: 'Across 9 active clients, video assets generate 2.1x higher social engagement and 1.6x higher CTR than article-only campaigns. Recommend shifting production budget allocation.', severity: 'info', status: 'new', impact_estimate: 'Portfolio engagement +34%' },
  { insight_type: 'geographic_cluster', headline: 'Denver-Dallas-Charlotte cluster showing performance breakout', narrative: 'Three metro markets are simultaneously hitting ranking milestones. Possible indicator of algorithm update favoring AI-generated authority content in these DMAs.', severity: 'high', status: 'new', related_vertical: 'HVAC / Home Services', impact_estimate: '3 market dominance windows open' },
  { insight_type: 'pricing_opportunity', headline: 'Opportunity to reposition 4 clients to higher pricing tier', narrative: 'Arctic Air, Precision Plumbing, Citywide Dental, and Apex Law are performing at enterprise-level output while on professional or growth plans. Consider tier upgrade conversations.', severity: 'high', status: 'acknowledged', impact_estimate: '+$1,800 MRR potential' },
  { insight_type: 'churn_signal', headline: 'Two HVAC clients entering critical churn risk window', narrative: 'CoolBreeze and Blue Ridge showing compounding negative signals. Combined MRR at risk: $2,200. Intervention window closing within 30 days.', severity: 'critical', status: 'new', related_vertical: 'HVAC / Roofing', impact_estimate: '$2,200 MRR at risk' },
  { insight_type: 'engagement_pattern', headline: 'Restaurant video engagement surpassing vertical benchmark by 2.4x', narrative: 'Mesa Grill and Taco Loco combined engagement rate of 4.8% is 2.4x the restaurant vertical benchmark of 2.0%. Short-form food content is a breakout content type.', severity: 'info', status: 'new', related_vertical: 'Restaurant', impact_estimate: 'Upsell trigger ready' },
];

export default function CPROIIntelFeed({ insights = [], onRefresh }) {
  const [dismissed, setDismissed] = useState([]);
  const data = (insights.length > 0 ? insights : FALLBACK).filter((_, i) => !dismissed.includes(i));
  const urgent = data.filter(i => ['critical', 'high'].includes(i.severity)).length;

  const handleAction = async (item, action, index) => {
    if (action === 'dismiss') { setDismissed(d => [...d, index]); return; }
    const statusMap = { acknowledge: 'acknowledged', task: 'converted_to_task', assign: 'assigned', attach: 'attached_to_review' };
    if (statusMap[action] && item.id && insights.length > 0) {
      await base44.entities.ROIInsight.update(item.id, { status: statusMap[action] }).catch(() => {});
      onRefresh?.();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Executive ROI Intelligence Feed</h2>
          {urgent > 0 && (
            <Badge className="bg-red-950 text-red-300 gap-1 text-xs">
              <AlertTriangle className="w-3 h-3" /> {urgent} need attention
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {data.map((insight, i) => {
          const cfg = TYPE_CONFIG[insight.insight_type] || TYPE_CONFIG.roi_curve;
          const Icon = cfg.icon;
          return (
            <div key={i} className={`border rounded-xl p-4 ${cfg.bg} relative`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap mb-1">
                    <p className="text-xs font-bold text-white flex-1">{insight.headline}</p>
                    <Badge className={`text-[9px] px-1.5 flex-shrink-0 ${SEVERITY_BADGE[insight.severity]}`}>{insight.severity}</Badge>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{insight.narrative}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 mb-3 flex-wrap">
                    {insight.related_vertical && <span>Vertical: <span className="text-slate-300">{insight.related_vertical}</span></span>}
                    {insight.impact_estimate && <span className="text-emerald-400 font-medium">{insight.impact_estimate}</span>}
                    {insight.assigned_to && <span className="text-violet-300">→ {insight.assigned_to}</span>}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { action: 'acknowledge', icon: CheckCircle2, label: 'Acknowledge', color: 'border-slate-700 text-slate-300 hover:border-slate-500' },
                      { action: 'task', icon: ClipboardList, label: 'Create Task', color: 'border-blue-700/50 text-blue-300 hover:bg-blue-950/30' },
                      { action: 'assign', icon: UserCheck, label: 'Assign', color: 'border-violet-700/50 text-violet-300 hover:bg-violet-950/30' },
                      { action: 'attach', icon: Paperclip, label: 'To Review', color: 'border-amber-700/50 text-amber-300 hover:bg-amber-950/30' },
                    ].map(a => (
                      <button key={a.action} onClick={() => handleAction(insight, a.action, i)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border bg-transparent text-[10px] font-medium transition-colors ${a.color}`}>
                        <a.icon className="w-3 h-3" />{a.label}
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
          <div className="col-span-2 text-center py-8 text-slate-600 text-xs">All insights addressed</div>
        )}
      </div>
    </div>
  );
}
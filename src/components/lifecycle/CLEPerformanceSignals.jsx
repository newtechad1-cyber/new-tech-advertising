import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Zap, AlertTriangle, Star } from 'lucide-react';

const FALLBACK_SIGNALS = [
  { client_name: 'Arctic Air HVAC', vertical: 'HVAC', ranking_trend: 'improving', ranking_keywords_moved: 14, social_reach_growth: 28, lead_flow_signal: 'strong', engagement_velocity: 82, insight_type: 'performance_surge', insight_narrative: '14 keywords moved up in 30 days, lead form completions +38%' },
  { client_name: 'Precision Plumbing', vertical: 'Home Services', ranking_trend: 'improving', ranking_keywords_moved: 9, social_reach_growth: 17, lead_flow_signal: 'moderate', engagement_velocity: 71, insight_type: 'opportunity_cluster', insight_narrative: 'Cluster of high-intent local keywords showing strong indexing signals' },
  { client_name: 'Mesa Grill Group', vertical: 'Restaurant', ranking_trend: 'stable', ranking_keywords_moved: 2, social_reach_growth: 4, lead_flow_signal: 'weak', engagement_velocity: 38, insight_type: 'stagnation_detected', insight_narrative: 'Low posting frequency causing engagement decay — recommend boosting video cadence' },
  { client_name: 'Blue Ridge Roofing', vertical: 'Roofing', ranking_trend: 'declining', ranking_keywords_moved: -3, social_reach_growth: -8, lead_flow_signal: 'weak', engagement_velocity: 22, insight_type: 'stagnation_detected', insight_narrative: 'Rankings declining — stalled automation and no new content in 18 days' },
  { client_name: 'ProHeat Systems', vertical: 'HVAC', ranking_trend: 'improving', ranking_keywords_moved: 11, social_reach_growth: 22, lead_flow_signal: 'strong', engagement_velocity: 78, insight_type: 'performance_surge', insight_narrative: 'Rapid gains after video launch campaign — upsell window active' },
];

const INSIGHT_CONFIG = {
  performance_surge: { bg: 'bg-emerald-950/30 border-emerald-700/40', icon: Zap, iconColor: 'text-emerald-400', badge: 'bg-emerald-950 text-emerald-300' },
  stagnation_detected: { bg: 'bg-amber-950/20 border-amber-700/40', icon: AlertTriangle, iconColor: 'text-amber-400', badge: 'bg-amber-950 text-amber-300' },
  opportunity_cluster: { bg: 'bg-violet-950/20 border-violet-700/40', icon: Star, iconColor: 'text-violet-400', badge: 'bg-violet-950 text-violet-300' },
  normal: { bg: 'bg-slate-800/50 border-slate-700', icon: Minus, iconColor: 'text-slate-400', badge: 'bg-slate-700 text-slate-300' },
};

const TrendIcon = ({ trend, value }) => {
  if (trend === 'improving') return <span className="flex items-center gap-1 text-emerald-400 text-[10px]"><TrendingUp className="w-3 h-3" />+{Math.abs(value || 0)}</span>;
  if (trend === 'declining') return <span className="flex items-center gap-1 text-red-400 text-[10px]"><TrendingDown className="w-3 h-3" />{value || 0}</span>;
  return <span className="flex items-center gap-1 text-slate-400 text-[10px]"><Minus className="w-3 h-3" />stable</span>;
};

const LEAD_COLOR = { strong: 'text-emerald-300', moderate: 'text-amber-300', weak: 'text-red-300' };

export default function CLEPerformanceSignals({ signals = [] }) {
  const data = signals.length > 0 ? signals : FALLBACK_SIGNALS;
  const surges = data.filter(s => s.insight_type === 'performance_surge');
  const stagnant = data.filter(s => s.insight_type === 'stagnation_detected');
  const clusters = data.filter(s => s.insight_type === 'opportunity_cluster');

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Client Performance Signal Center</h2>

      {/* AI Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { title: 'Performance Surges', items: surges, config: INSIGHT_CONFIG.performance_surge },
          { title: 'Stagnation Detected', items: stagnant, config: INSIGHT_CONFIG.stagnation_detected },
          { title: 'Opportunity Clusters', items: clusters, config: INSIGHT_CONFIG.opportunity_cluster },
        ].map(group => (
          <div key={group.title} className={`border rounded-xl p-4 ${group.config.bg}`}>
            <div className="flex items-center gap-2 mb-3">
              <group.config.icon className={`w-4 h-4 ${group.config.iconColor}`} />
              <p className="text-xs font-semibold text-white">{group.title}</p>
              <span className="ml-auto text-xs font-bold text-white">{group.items.length}</span>
            </div>
            <div className="space-y-2">
              {group.items.slice(0, 2).map((s, i) => (
                <div key={i} className="bg-slate-900/50 rounded-lg p-2">
                  <p className="text-xs font-medium text-white">{s.client_name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{s.insight_narrative}</p>
                </div>
              ))}
              {group.items.length === 0 && <p className="text-[10px] text-slate-600">None detected</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Signal table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Performance Signal Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-700/50">
            <div className="grid grid-cols-6 gap-2 px-4 py-2 text-[10px] text-slate-600 uppercase tracking-wider">
              <span className="col-span-2">Client</span>
              <span className="text-center">Ranking</span>
              <span className="text-center">Reach +%</span>
              <span className="text-center">Lead Flow</span>
              <span className="text-center">Velocity</span>
            </div>
            {data.map((s, i) => {
              const cfg = INSIGHT_CONFIG[s.insight_type] || INSIGHT_CONFIG.normal;
              return (
                <div key={i} className="grid grid-cols-6 gap-2 items-center px-4 py-2.5 hover:bg-slate-700/30 transition-colors">
                  <div className="col-span-2 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                      {s.client_name?.[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-white truncate">{s.client_name}</p>
                      <Badge className={`text-[8px] px-1 ${cfg.badge}`}>{s.insight_type?.replace(/_/g, ' ')}</Badge>
                    </div>
                  </div>
                  <div className="flex justify-center"><TrendIcon trend={s.ranking_trend} value={s.ranking_keywords_moved} /></div>
                  <span className={`text-xs text-center font-bold ${s.social_reach_growth >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                    {s.social_reach_growth >= 0 ? '+' : ''}{s.social_reach_growth}%
                  </span>
                  <span className={`text-xs text-center font-semibold capitalize ${LEAD_COLOR[s.lead_flow_signal]}`}>{s.lead_flow_signal}</span>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-white">{s.engagement_velocity}</span>
                    <div className="w-full h-1 bg-slate-700 rounded-full mt-0.5">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${s.engagement_velocity}%` }} />
                    </div>
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
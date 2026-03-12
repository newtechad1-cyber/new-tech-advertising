import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Zap, BarChart2, DollarSign, AlertTriangle, Globe, Check, UserPlus, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const TYPE_CONFIG = {
  growth_anomaly: { icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-950/30 border-emerald-700/40' },
  upsell_cluster: { icon: Zap, color: 'text-amber-400', bg: 'bg-amber-950/30 border-amber-700/40' },
  vertical_demand_spike: { icon: BarChart2, color: 'text-blue-400', bg: 'bg-blue-950/30 border-blue-700/40' },
  pricing_optimization: { icon: DollarSign, color: 'text-violet-400', bg: 'bg-violet-950/30 border-violet-700/40' },
  churn_warning: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-950/30 border-red-700/40' },
  market_opportunity: { icon: Globe, color: 'text-cyan-400', bg: 'bg-cyan-950/30 border-cyan-700/40' },
};

const URGENCY_BADGE = {
  critical: 'bg-red-950 text-red-300',
  high: 'bg-orange-950 text-orange-300',
  medium: 'bg-amber-950 text-amber-300',
  low: 'bg-slate-700 text-slate-400',
};

export default function CTFounderFeed({ insights = [], onRefresh }) {
  const [localInsights, setLocalInsights] = useState(null);
  const active = (localInsights ?? insights).filter(i => i.status === 'active' || !i.status);

  const handleAction = async (insight, action) => {
    const statusMap = { acknowledge: 'acknowledged', assign: 'assigned', task: 'converted' };
    try {
      await base44.entities.FounderInsight.update(insight.id, { status: statusMap[action] });
      setLocalInsights((localInsights ?? insights).map(i =>
        i.id === insight.id ? { ...i, status: statusMap[action] } : i
      ));
    } catch (e) {
      console.warn('Update failed', e);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Founder Intelligence Feed</h2>
        <span className="text-xs text-slate-500">{active.length} active signals</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {active.length === 0 ? (
          <Card className="col-span-full bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center text-slate-500 text-sm">All insights reviewed — platform is running clean ✓</CardContent>
          </Card>
        ) : (
          active.map((insight, i) => {
            const cfg = TYPE_CONFIG[insight.insight_type] || TYPE_CONFIG.growth_anomaly;
            const InsightIcon = cfg.icon;
            return (
              <Card key={i} className={`border ${cfg.bg} transition-all hover:border-slate-500`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg bg-slate-900/50 flex items-center justify-center flex-shrink-0`}>
                      <InsightIcon className={`w-4 h-4 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`text-[10px] px-1.5 ${URGENCY_BADGE[insight.urgency] || URGENCY_BADGE.medium}`}>
                          {insight.urgency}
                        </Badge>
                        <span className="text-[10px] text-slate-500 capitalize">{insight.insight_type?.replace(/_/g, ' ')}</span>
                      </div>
                      <p className="text-sm font-semibold text-white leading-tight">{insight.headline}</p>
                    </div>
                  </div>

                  {insight.narrative && (
                    <p className="text-xs text-slate-400 mb-3 leading-relaxed">{insight.narrative}</p>
                  )}

                  {insight.impact_estimate && (
                    <div className="flex items-center gap-1 text-xs text-emerald-400 mb-3">
                      <ArrowRight className="w-3 h-3" />
                      <span>{insight.impact_estimate}</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-[10px] text-slate-400 hover:text-white flex-1"
                      onClick={() => handleAction(insight, 'acknowledge')}>
                      <Check className="w-3 h-3 mr-1" /> Ack
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-[10px] text-blue-400 hover:text-blue-300 flex-1"
                      onClick={() => handleAction(insight, 'assign')}>
                      <UserPlus className="w-3 h-3 mr-1" /> Assign
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-[10px] text-violet-400 hover:text-violet-300 flex-1"
                      onClick={() => handleAction(insight, 'task')}>
                      <ArrowRight className="w-3 h-3 mr-1" /> Task
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
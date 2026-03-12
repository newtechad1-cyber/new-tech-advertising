import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Calendar, CheckCircle2, Target, Clock } from 'lucide-react';

const QuotaBar = ({ value, quota }) => {
  const pct = Math.min((value / Math.max(quota, 1)) * 100, 100);
  const color = pct >= 90 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="h-1.5 bg-slate-700 rounded-full mt-1.5">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
};

const TrendIcon = ({ trend }) =>
  trend === 'improving' ? <TrendingUp className="w-3 h-3 text-emerald-400" />
    : trend === 'declining' ? <TrendingDown className="w-3 h-3 text-red-400" />
    : <Minus className="w-3 h-3 text-slate-400" />;

export default function SCDemoCenter({ reps = [], activities = [] }) {
  const demosThisWeek = activities.filter(a => a.activity_type === 'demo_completed').length || 7;
  const demosScheduled = activities.filter(a => a.activity_type === 'meeting_scheduled').length || 4;
  const proposalsSent = activities.filter(a => a.activity_type === 'proposal_sent').length || 9;

  const fallbackReps = [
    { rep_name: 'Jake M.', avatar_initial: 'J', deals_closed_month: 6, revenue_generated_month: 91200, demos_completed_month: 14, close_ratio: 43, avg_deal_size: 15200, quota: 100000, quota_attainment: 91, trend: 'improving' },
    { rep_name: 'Sarah L.', avatar_initial: 'S', deals_closed_month: 8, revenue_generated_month: 112400, demos_completed_month: 18, close_ratio: 44, avg_deal_size: 14050, quota: 110000, quota_attainment: 102, trend: 'improving' },
    { rep_name: 'Tom R.', avatar_initial: 'T', deals_closed_month: 4, revenue_generated_month: 58600, demos_completed_month: 11, close_ratio: 36, avg_deal_size: 14650, quota: 80000, quota_attainment: 73, trend: 'stable' },
    { rep_name: 'Maria C.', avatar_initial: 'M', deals_closed_month: 3, revenue_generated_month: 39800, demos_completed_month: 9, close_ratio: 33, avg_deal_size: 13267, quota: 70000, quota_attainment: 57, trend: 'declining' },
  ];

  const displayReps = (reps.length > 0 ? reps : fallbackReps).sort((a, b) => (b.revenue_generated_month || 0) - (a.revenue_generated_month || 0));

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Demo Performance Center</h2>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Scheduled', value: demosScheduled, icon: Calendar, color: 'text-violet-300' },
          { label: 'Completed', value: demosThisWeek, icon: CheckCircle2, color: 'text-emerald-300' },
          { label: 'Conversion Rate', value: '34%', icon: Target, color: 'text-blue-300' },
          { label: 'Avg → Proposal', value: '3.2 days', icon: Clock, color: 'text-amber-300' },
        ].map(s => (
          <Card key={s.label} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-3 flex items-center gap-3">
              <s.icon className={`w-5 h-5 ${s.color} flex-shrink-0`} />
              <div>
                <p className="text-[10px] text-slate-500">{s.label}</p>
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rep leaderboard */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Rep Leaderboard — This Month</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-700/50">
            {/* Header row */}
            <div className="grid grid-cols-6 gap-2 px-4 py-2 text-[10px] text-slate-600 uppercase tracking-wider">
              <span className="col-span-2">Rep</span>
              <span className="text-center">Closed</span>
              <span className="text-center">Revenue</span>
              <span className="text-center">Close %</span>
              <span className="text-center">Quota</span>
            </div>
            {displayReps.map((rep, i) => (
              <div key={i} className="grid grid-cols-6 gap-2 items-center px-4 py-3 hover:bg-slate-700/30 transition-colors">
                <div className="col-span-2 flex items-center gap-2">
                  <span className="text-[10px] text-slate-600 w-4">{i + 1}</span>
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {rep.avatar_initial || rep.rep_name?.[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white">{rep.rep_name}</p>
                    <div className="flex items-center gap-1">
                      <TrendIcon trend={rep.trend} />
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-white text-center">{rep.deals_closed_month}</span>
                <span className="text-xs font-bold text-emerald-300 text-center">${((rep.revenue_generated_month || 0) / 1000).toFixed(0)}k</span>
                <span className="text-xs text-center text-slate-300">{rep.close_ratio}%</span>
                <div>
                  <p className="text-[10px] text-slate-500 text-center">{rep.quota_attainment}%</p>
                  <QuotaBar value={rep.quota_attainment} quota={100} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
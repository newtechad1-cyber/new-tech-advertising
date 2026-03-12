import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, Zap, Video, FileText, Clock } from 'lucide-react';

const FALLBACK = [
  { client_name: 'Arctic Air HVAC', vertical: 'HVAC', content_jobs_triggered: 18, publishing_frequency_per_week: 4, videos_produced_month: 6, approvals_pending: 2, low_activity_flag: false, stalled_automation_flag: false },
  { client_name: 'Mesa Grill Group', vertical: 'Restaurant', content_jobs_triggered: 11, publishing_frequency_per_week: 2, videos_produced_month: 3, approvals_pending: 5, low_activity_flag: true, stalled_automation_flag: false },
  { client_name: 'Precision Plumbing', vertical: 'Home Services', content_jobs_triggered: 22, publishing_frequency_per_week: 5, videos_produced_month: 8, approvals_pending: 0, low_activity_flag: false, stalled_automation_flag: false },
  { client_name: 'Blue Ridge Roofing', vertical: 'Roofing', content_jobs_triggered: 4, publishing_frequency_per_week: 1, videos_produced_month: 1, approvals_pending: 3, low_activity_flag: true, stalled_automation_flag: true },
  { client_name: 'ProHeat Systems', vertical: 'HVAC', content_jobs_triggered: 16, publishing_frequency_per_week: 3, videos_produced_month: 5, approvals_pending: 1, low_activity_flag: false, stalled_automation_flag: false },
  { client_name: 'Taco Loco Franchise', vertical: 'Restaurant', content_jobs_triggered: 9, publishing_frequency_per_week: 2, videos_produced_month: 2, approvals_pending: 4, low_activity_flag: false, stalled_automation_flag: true },
];

export default function CLEProductionMonitor({ metrics = [] }) {
  const data = metrics.length > 0 ? metrics : FALLBACK;
  const flagged = data.filter(m => m.low_activity_flag || m.stalled_automation_flag);
  const totalJobs = data.reduce((s, m) => s + (m.content_jobs_triggered || 0), 0);
  const avgFreq = data.length > 0 ? (data.reduce((s, m) => s + (m.publishing_frequency_per_week || 0), 0) / data.length).toFixed(1) : 0;
  const pendingApprovals = data.reduce((s, m) => s + (m.approvals_pending || 0), 0);

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Production Activation Monitor</h2>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Content Jobs', value: totalJobs, icon: Zap, color: 'text-violet-300' },
          { label: 'Avg Posts/Week', value: avgFreq, icon: FileText, color: 'text-cyan-300' },
          { label: 'Videos This Month', value: data.reduce((s, m) => s + (m.videos_produced_month || 0), 0), icon: Video, color: 'text-blue-300' },
          { label: 'Approvals Pending', value: pendingApprovals, icon: Clock, color: pendingApprovals > 10 ? 'text-red-300' : 'text-amber-300' },
        ].map(s => (
          <Card key={s.label} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-3 flex items-center gap-3">
              <s.icon className={`w-5 h-5 ${s.color} flex-shrink-0`} />
              <div>
                <p className="text-[10px] text-slate-500">{s.label}</p>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {flagged.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {flagged.map((m, i) => (
            <div key={i} className={`border rounded-xl p-3 flex items-start gap-3 ${m.stalled_automation_flag ? 'bg-amber-950/20 border-amber-700/40' : 'bg-red-950/10 border-red-700/30'}`}>
              {m.stalled_automation_flag
                ? <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                : <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
              <div>
                <p className="text-xs font-semibold text-white">{m.client_name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {m.stalled_automation_flag ? 'Stalled automation detected' : 'Low activity warning'} · {m.publishing_frequency_per_week}x/week · {m.content_jobs_triggered} jobs
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Client Production Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-700/50">
            <div className="grid grid-cols-6 gap-2 px-4 py-2 text-[10px] text-slate-600 uppercase tracking-wider">
              <span className="col-span-2">Client</span>
              <span className="text-center">Jobs</span>
              <span className="text-center">Posts/wk</span>
              <span className="text-center">Videos</span>
              <span className="text-center">Pending</span>
            </div>
            {data.map((m, i) => (
              <div key={i} className="grid grid-cols-6 gap-2 items-center px-4 py-2.5 hover:bg-slate-700/30 transition-colors">
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                    {m.client_name?.[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-white truncate">{m.client_name}</p>
                    {(m.low_activity_flag || m.stalled_automation_flag) && (
                      <Badge className={`text-[8px] px-1 ${m.stalled_automation_flag ? 'bg-amber-950 text-amber-300' : 'bg-red-950 text-red-300'}`}>
                        {m.stalled_automation_flag ? 'Stalled' : 'Low Activity'}
                      </Badge>
                    )}
                  </div>
                </div>
                <span className="text-xs text-white text-center font-bold">{m.content_jobs_triggered}</span>
                <span className="text-xs text-slate-300 text-center">{m.publishing_frequency_per_week}x</span>
                <span className="text-xs text-blue-300 text-center">{m.videos_produced_month}</span>
                <span className={`text-xs text-center font-bold ${m.approvals_pending > 3 ? 'text-red-300' : 'text-slate-300'}`}>{m.approvals_pending}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Video, RefreshCw, Flag, Send, Copy, Mic, Palette, AlertCircle } from 'lucide-react';

const STATUS_CONFIG = {
  queued: { badge: 'bg-slate-700 text-slate-300', dot: 'bg-slate-400' },
  rendering: { badge: 'bg-violet-950 text-violet-300', dot: 'bg-violet-400 animate-pulse' },
  review_ready: { badge: 'bg-amber-950 text-amber-300', dot: 'bg-amber-400' },
  approved: { badge: 'bg-emerald-950 text-emerald-300', dot: 'bg-emerald-400' },
  published: { badge: 'bg-teal-950 text-teal-300', dot: 'bg-teal-400' },
  failed: { badge: 'bg-red-950 text-red-300', dot: 'bg-red-400' },
};

const FALLBACK_RENDERS = [
  { id: 'v1', project_title: 'Arctic Air — Spring HVAC Service Promo', client_name: 'Arctic Air HVAC', vertical: 'HVAC', format_type: 'social_reel', status: 'rendering', priority: 'urgent', scene_count: 6, voiceover_status: 'generated', branding_status: 'applied', render_progress: 68, avg_render_minutes: 12 },
  { id: 'v2', project_title: 'Mesa Grill — Happy Hour Campaign', client_name: 'Mesa Grill Group', vertical: 'Restaurant', format_type: 'ad_spot', status: 'review_ready', priority: 'normal', scene_count: 4, voiceover_status: 'approved', branding_status: 'approved', render_progress: 100 },
  { id: 'v3', project_title: 'Precision Plumbing — "We Fix It Fast"', client_name: 'Precision Plumbing', vertical: 'Home Services', format_type: 'short_form', status: 'approved', priority: 'normal', scene_count: 5, voiceover_status: 'approved', branding_status: 'approved', render_progress: 100 },
  { id: 'v4', project_title: 'ProHeat — Emergency Heat Repair Spot', client_name: 'ProHeat Systems', vertical: 'HVAC', format_type: 'ad_spot', status: 'failed', priority: 'urgent', scene_count: 3, voiceover_status: 'failed', branding_status: 'pending', render_progress: 22, error_message: 'HeyGen voiceover API timeout' },
  { id: 'v5', project_title: 'Citywide Dental — New Patient Welcome', client_name: 'Citywide Dental', vertical: 'Dental', format_type: 'explainer', status: 'queued', priority: 'normal', scene_count: 8, voiceover_status: 'pending', branding_status: 'pending', render_progress: 0 },
];

const SubStatusBadge = ({ status, icon: IconComp, label }) => (
  <span className={`flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full border ${
    status === 'approved' || status === 'generated' || status === 'applied' ? 'border-emerald-700/40 text-emerald-400' :
    status === 'failed' ? 'border-red-700/40 text-red-400' :
    'border-slate-700 text-slate-500'
  }`}>
    <IconComp className="w-2.5 h-2.5" />{label}: {status}
  </span>
);

export default function OPSVideoCommand({ renders = [] }) {
  const data = renders.length > 0 ? renders : FALLBACK_RENDERS;

  const rendering = data.filter(r => r.status === 'rendering').length;
  const completedToday = data.filter(r => ['approved', 'published'].includes(r.status)).length;
  const failed = data.filter(r => r.status === 'failed').length;
  const avgRender = data.filter(r => r.avg_render_minutes).length > 0
    ? (data.reduce((s, r) => s + (r.avg_render_minutes || 0), 0) / data.length).toFixed(1) : '11.4';

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Video Rendering Command Center</h2>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Rendering Now', value: rendering, color: 'text-violet-300' },
          { label: 'Completed Today', value: completedToday, color: 'text-emerald-300' },
          { label: 'Render Failures', value: failed, color: 'text-red-300' },
          { label: 'Avg Render Time', value: `${avgRender}m`, color: 'text-cyan-300' },
        ].map(s => (
          <Card key={s.label} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-3">
              <p className="text-[10px] text-slate-500">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Video Production Queue</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-700/50">
            {data.map((render, i) => {
              const cfg = STATUS_CONFIG[render.status] || STATUS_CONFIG.queued;
              return (
                <div key={i} className="px-4 py-4 hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="text-xs font-semibold text-white">{render.project_title}</p>
                          <p className="text-[10px] text-slate-400">{render.client_name} · {render.vertical} · {render.format_type?.replace(/_/g, ' ')} · {render.scene_count} scenes</p>
                        </div>
                        <Badge className={`text-[9px] px-1.5 flex-shrink-0 ${cfg.badge}`}>{render.status?.replace(/_/g, ' ')}</Badge>
                      </div>

                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <SubStatusBadge status={render.voiceover_status} icon={Mic} label="VO" />
                        <SubStatusBadge status={render.branding_status} icon={Palette} label="Brand" />
                        {render.priority === 'urgent' && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-950 border border-red-700/40 text-red-300">Urgent</span>
                        )}
                      </div>

                      {render.render_progress > 0 && render.status === 'rendering' && (
                        <div className="mb-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-slate-500">Render Progress</span>
                            <span className="text-[10px] text-violet-300 font-bold">{render.render_progress}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-700 rounded-full">
                            <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${render.render_progress}%` }} />
                          </div>
                        </div>
                      )}

                      {render.error_message && (
                        <div className="flex items-center gap-2 mb-2 p-2 bg-red-950/20 rounded-lg border border-red-700/30">
                          <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
                          <p className="text-[10px] text-red-300">{render.error_message}</p>
                        </div>
                      )}

                      <div className="flex gap-1.5 flex-wrap">
                        {[
                          { icon: RefreshCw, label: 'Re-render' },
                          { icon: Flag, label: 'Prioritize' },
                          { icon: Send, label: 'To Approval' },
                          { icon: Copy, label: 'Duplicate' },
                        ].map(a => (
                          <button key={a.label} className="flex items-center gap-1 px-2 py-1 rounded-md border border-slate-700 hover:border-slate-500 text-[10px] text-slate-400 hover:text-white transition-colors bg-transparent">
                            <a.icon className="w-2.5 h-2.5" />{a.label}
                          </button>
                        ))}
                      </div>
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
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, PauseCircle, Bell, Shield, Zap, Wifi, Video, FileText, Globe } from 'lucide-react';

const SEVERITY_CONFIG = {
  critical: { badge: 'bg-red-950 text-red-300', border: 'border-red-700/40', dot: 'bg-red-500 animate-pulse' },
  high: { badge: 'bg-orange-950 text-orange-300', border: 'border-orange-700/40', dot: 'bg-orange-500' },
  medium: { badge: 'bg-amber-950 text-amber-300', border: 'border-amber-700/40', dot: 'bg-amber-500' },
  low: { badge: 'bg-slate-700 text-slate-400', border: 'border-slate-600', dot: 'bg-slate-500' },
};

const FAILURE_ICONS = { api_error: Wifi, render_failure: Video, publish_failure: Globe, generation_error: FileText, timeout: AlertTriangle };

const AI_INSIGHTS = [
  { icon: Wifi, color: 'text-red-400 bg-red-950/20 border-red-700/40', headline: 'TikTok publish connection unstable', narrative: '4 consecutive publish failures to TikTok in the last 2h. Likely token expiry.' },
  { icon: Video, color: 'text-amber-400 bg-amber-950/20 border-amber-700/40', headline: 'Video render queue overloaded', narrative: 'Render queue depth at 142%. Average render time increased by 6 minutes.' },
  { icon: FileText, color: 'text-violet-400 bg-violet-950/20 border-violet-700/40', headline: 'Article generation latency increasing', narrative: 'GPT-4o average response time up 38% in the last hour. Monitor for degradation.' },
  { icon: Globe, color: 'text-orange-400 bg-orange-950/20 border-orange-700/40', headline: 'Facebook API rejection spike', narrative: '7 ad creative rejections today — may be policy enforcement cycle. Pause ad creatives temporarily.' },
];

const FALLBACK_FAILURES = [
  { failure_type: 'api_error', source_system: 'HeyGen', client_name: 'CoolBreeze HVAC', error_message: 'API timeout after 3 retries — video generation stalled', severity: 'critical', status: 'open', retry_count: 3, affected_destination: 'Video Generation', auto_recoverable: false, occurred_at: new Date(Date.now() - 3600000).toISOString() },
  { failure_type: 'publish_failure', source_system: 'TikTok API', client_name: 'Mesa Grill Group', error_message: 'OAuth token expired — re-auth required', severity: 'high', status: 'open', retry_count: 4, affected_destination: 'TikTok', auto_recoverable: false, occurred_at: new Date(Date.now() - 7200000).toISOString() },
  { failure_type: 'render_failure', source_system: 'Render Engine', client_name: 'ProHeat Systems', error_message: 'Branded intro template missing asset ID #1142', severity: 'high', status: 'retrying', retry_count: 1, affected_destination: 'Video Pipeline', auto_recoverable: true, occurred_at: new Date(Date.now() - 10800000).toISOString() },
  { failure_type: 'timeout', source_system: 'OpenAI GPT-4o', client_name: 'Blue Ridge Roofing', error_message: 'Request timeout at 30s — article generation incomplete', severity: 'medium', status: 'open', retry_count: 2, affected_destination: 'Content Writing', auto_recoverable: true, occurred_at: new Date(Date.now() - 14400000).toISOString() },
  { failure_type: 'publish_failure', source_system: 'Facebook Graph API', client_name: 'Arctic Air HVAC', error_message: 'Ad creative policy rejection — image text ratio exceeded', severity: 'medium', status: 'open', retry_count: 0, affected_destination: 'Facebook', auto_recoverable: false, occurred_at: new Date(Date.now() - 18000000).toISOString() },
];

function timeAgo(dateStr) {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  return mins < 60 ? `${mins}m ago` : `${Math.floor(mins / 60)}h ago`;
}

export default function OPSFailureRecovery({ failures = [] }) {
  const [retrying, setRetrying] = useState(false);
  const data = failures.length > 0 ? failures : FALLBACK_FAILURES;

  const autoRecoverable = data.filter(f => f.auto_recoverable && f.status === 'open');
  const critical = data.filter(f => f.severity === 'critical').length;

  const handleRetryAll = async () => {
    setRetrying(true);
    await new Promise(r => setTimeout(r, 1200));
    setRetrying(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Automation Health & Failure Recovery</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="text-xs border-slate-700 text-slate-300 h-7 gap-1" onClick={handleRetryAll} disabled={retrying}>
            <RefreshCw className={`w-3 h-3 ${retrying ? 'animate-spin' : ''}`} />
            {retrying ? 'Retrying...' : `Retry Safe (${autoRecoverable.length})`}
          </Button>
          <Button size="sm" className="bg-red-800 hover:bg-red-700 text-xs h-7 gap-1">
            <Bell className="w-3 h-3" /> Alert Ops
          </Button>
        </div>
      </div>

      {/* AI insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {AI_INSIGHTS.map((ins, i) => (
          <div key={i} className={`border rounded-xl p-3 ${ins.color}`}>
            <div className="flex items-center gap-2 mb-2">
              <ins.icon className="w-4 h-4" />
              <p className="text-xs font-semibold text-white">{ins.headline}</p>
            </div>
            <p className="text-[10px] text-slate-400">{ins.narrative}</p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Critical', value: critical, color: 'text-red-300' },
          { label: 'Open Failures', value: data.filter(f => f.status === 'open').length, color: 'text-orange-300' },
          { label: 'Retrying', value: data.filter(f => f.status === 'retrying').length, color: 'text-violet-300' },
          { label: 'Auto-Recoverable', value: autoRecoverable.length, color: 'text-emerald-300' },
        ].map(s => (
          <Card key={s.label} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-3">
              <p className="text-[10px] text-slate-500">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Failure list */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Active Failure Log</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-700/50">
            {data.map((failure, i) => {
              const cfg = SEVERITY_CONFIG[failure.severity] || SEVERITY_CONFIG.medium;
              const Icon = FAILURE_ICONS[failure.failure_type] || AlertTriangle;
              return (
                <div key={i} className={`px-4 py-3 flex items-start gap-3 hover:bg-slate-700/30 transition-colors border-l-2 ${cfg.border.replace('border-', 'border-l-')}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Icon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <p className="text-xs font-semibold text-white">{failure.source_system}</p>
                      <Badge className={`text-[9px] px-1.5 ${cfg.badge}`}>{failure.severity}</Badge>
                      <Badge className="text-[9px] px-1.5 bg-slate-700 text-slate-400">{failure.status}</Badge>
                      {failure.auto_recoverable && <Badge className="text-[9px] px-1.5 bg-emerald-950 text-emerald-400">Auto-recoverable</Badge>}
                    </div>
                    <p className="text-xs text-slate-300 mb-1">{failure.error_message}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <span>{failure.client_name}</span>
                      <span>Dest: {failure.affected_destination}</span>
                      <span>Retries: {failure.retry_count}</span>
                      <span className="ml-auto">{timeAgo(failure.occurred_at)}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button className="p-1.5 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white transition-colors">
                      <RefreshCw className="w-3 h-3" />
                    </button>
                    <button className="p-1.5 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white transition-colors">
                      <PauseCircle className="w-3 h-3" />
                    </button>
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
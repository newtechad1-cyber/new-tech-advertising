import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import {
  CheckCircle, AlertTriangle, XCircle, RefreshCw,
  Shield, Database, CreditCard, Bot, Mail, FileText, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATUS_CONFIG = {
  ok:      { color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle, label: 'Operational' },
  warning: { color: 'text-yellow-400',  bg: 'bg-yellow-400/10 border-yellow-400/20',   icon: AlertTriangle, label: 'Warning' },
  error:   { color: 'text-red-400',     bg: 'bg-red-400/10 border-red-400/20',         icon: XCircle, label: 'Failure' },
};

const OVERALL_CONFIG = {
  healthy:  { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'All Systems Operational' },
  degraded: { color: 'text-yellow-400',  bg: 'bg-yellow-500/10',  border: 'border-yellow-500/30',  label: 'Degraded Performance' },
  critical: { color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/30',     label: 'Critical Issues Detected' },
};

const CHECKS = [
  { key: 'auth',     icon: Shield,     label: 'Authentication Service' },
  { key: 'database', icon: Database,   label: 'Database Connection' },
  { key: 'stripe',   icon: CreditCard, label: 'Stripe Billing' },
  { key: 'ai',       icon: Bot,        label: 'AI Agent Execution' },
  { key: 'email',    icon: Mail,       label: 'Email Delivery' },
  { key: 'content',  icon: FileText,   label: 'Content Generation' },
];

export default function AdminSystemHealth() {
  const queryClient = useQueryClient();

  const { data: checks = [], isLoading } = useQuery({
    queryKey: ['system-health'],
    queryFn: () => base44.entities.SystemHealthCheck.list('-run_at', 10),
  });

  const { mutate: runCheck, isPending: isRunning } = useMutation({
    mutationFn: () => base44.functions.invoke('runSystemHealthCheck', {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['system-health'] }),
  });

  const latest = checks[0];
  const overall = latest ? OVERALL_CONFIG[latest.overall_status] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white">System Health Monitor</h1>
            <p className="text-slate-400 text-sm mt-1">Real-time platform status — checks run every hour</p>
          </div>
          <Button
            onClick={() => runCheck()}
            disabled={isRunning}
            className="bg-violet-600 hover:bg-violet-500 text-white font-bold gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Running...' : 'Run Check Now'}
          </Button>
        </div>

        {/* Overall Status Banner */}
        {latest && overall && (
          <div className={`rounded-2xl border p-5 mb-8 ${overall.bg} ${overall.border}`}>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${latest.overall_status === 'healthy' ? 'bg-emerald-400' : latest.overall_status === 'degraded' ? 'bg-yellow-400' : 'bg-red-400'} shadow-lg`} />
              <div>
                <p className={`text-xl font-extrabold ${overall.color}`}>{overall.label}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Last check: {format(new Date(latest.run_at), 'MMM d, yyyy h:mm:ss a')}
                  </span>
                  <span>·</span>
                  <span>{latest.duration_ms}ms</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center text-slate-500 py-20">Loading health data...</div>
        )}

        {!isLoading && !latest && (
          <div className="text-center py-20">
            <p className="text-slate-400 mb-4">No health checks have been run yet.</p>
            <Button onClick={() => runCheck()} disabled={isRunning} className="bg-violet-600 hover:bg-violet-500 text-white font-bold">
              Run First Check
            </Button>
          </div>
        )}

        {/* Service Status Grid */}
        {latest && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {CHECKS.map(({ key, icon: Icon, label }) => {
              const status = latest[`${key}_status`] || 'ok';
              const message = latest[`${key}_message`] || '';
              const cfg = STATUS_CONFIG[status];
              const StatusIcon = cfg.icon;
              return (
                <div key={key} className={`rounded-xl border p-4 flex items-start gap-4 ${cfg.bg}`}>
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-white font-semibold text-sm">{label}</p>
                      <span className={`flex items-center gap-1 text-xs font-bold ${cfg.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs mt-1 truncate">{message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Error Log */}
        {latest?.error_log && (
          <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-5 mb-8">
            <p className="text-red-400 font-bold text-sm mb-2 flex items-center gap-2">
              <XCircle className="w-4 h-4" /> Error Log
            </p>
            <pre className="text-red-300 text-xs whitespace-pre-wrap font-mono leading-relaxed">
              {latest.error_log}
            </pre>
          </div>
        )}

        {/* Recent Check History */}
        {checks.length > 1 && (
          <div>
            <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-3">Recent History</h2>
            <div className="space-y-2">
              {checks.slice(1).map((c) => {
                const cfg = OVERALL_CONFIG[c.overall_status];
                return (
                  <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-slate-400 text-sm">{format(new Date(c.run_at), 'MMM d h:mm a')}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-xs">{c.duration_ms}ms</span>
                      <span className={`text-xs font-bold ${cfg.color}`}>{cfg.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
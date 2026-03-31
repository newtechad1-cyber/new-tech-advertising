import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Clock, CheckCircle, RefreshCw, ChevronDown, ChevronUp, X } from 'lucide-react';

const TYPE_CONFIG = {
  repeated_failures: { label: 'Repeated Failures', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-900/20 border-red-700/50' },
  overdue_run:       { label: 'Overdue Run',        icon: Clock,         color: 'text-amber-400', bg: 'bg-amber-900/20 border-amber-700/50' },
};

export default function AutomationFailureMonitorPanel() {
  const qc = useQueryClient();
  const [expanded, setExpanded] = useState(true);
  const [running, setRunning] = useState(false);

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['automationFailureAlerts'],
    queryFn: () => base44.entities.AutomationFailureAlert.filter({ status: 'open' }, '-created_date', 50),
    refetchInterval: 5 * 60 * 1000,
  });

  const acknowledge = async (alert) => {
    await base44.entities.AutomationFailureAlert.update(alert.id, { status: 'acknowledged' });
    qc.invalidateQueries({ queryKey: ['automationFailureAlerts'] });
  };

  const runMonitor = async () => {
    setRunning(true);
    try {
      await base44.functions.invoke('automationFailureMonitor', {});
      qc.invalidateQueries({ queryKey: ['automationFailureAlerts'] });
    } finally {
      setRunning(false);
    }
  };

  const openAlerts = alerts.filter(a => a.status === 'open');
  const failures = openAlerts.filter(a => a.alert_type === 'repeated_failures');
  const overdue  = openAlerts.filter(a => a.alert_type === 'overdue_run');

  if (isLoading) return null;
  if (openAlerts.length === 0) return (
    <div className="flex items-center gap-2 bg-emerald-900/20 border border-emerald-700/40 rounded-xl px-4 py-3 mb-6 text-emerald-400 text-sm">
      <CheckCircle className="w-4 h-4 flex-shrink-0" />
      <span className="font-medium">All automations healthy — no active alerts</span>
      <button onClick={runMonitor} disabled={running} className="ml-auto text-xs text-emerald-500 hover:text-emerald-300 flex items-center gap-1">
        <RefreshCw className={`w-3 h-3 ${running ? 'animate-spin' : ''}`} /> Run Check
      </button>
    </div>
  );

  return (
    <div className="bg-slate-900 border border-red-800/60 rounded-2xl mb-8 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-800/40 transition"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <div>
            <h2 className="text-sm font-bold text-white">Automation Failure Monitor</h2>
            <p className="text-slate-400 text-xs mt-0.5">
              {failures.length > 0 && `${failures.length} repeated failure${failures.length > 1 ? 's' : ''}`}
              {failures.length > 0 && overdue.length > 0 && ' · '}
              {overdue.length > 0 && `${overdue.length} overdue run${overdue.length > 1 ? 's' : ''}`}
            </p>
          </div>
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {openAlerts.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={e => { e.stopPropagation(); runMonitor(); }}
            disabled={running}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-700 transition"
          >
            <RefreshCw className={`w-3 h-3 ${running ? 'animate-spin' : ''}`} /> {running ? 'Checking…' : 'Run Now'}
          </button>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {/* Alert list */}
      {expanded && (
        <div className="border-t border-slate-800 divide-y divide-slate-800">
          {openAlerts.map(alert => {
            const cfg = TYPE_CONFIG[alert.alert_type] || TYPE_CONFIG.repeated_failures;
            const Icon = cfg.icon;
            return (
              <div key={alert.id} className={`flex items-start gap-4 px-5 py-4 ${cfg.bg} border-l-4 ${alert.alert_type === 'repeated_failures' ? 'border-l-red-500' : 'border-l-amber-500'}`}>
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs font-bold uppercase tracking-wide ${cfg.color}`}>{cfg.label}</span>
                    <span className="text-white text-sm font-semibold">{alert.rule_name}</span>
                  </div>
                  <p className="text-slate-400 text-xs">{alert.details}</p>
                  {alert.notification_sent && (
                    <span className="text-slate-600 text-[10px] mt-1 block">✉ Notification sent</span>
                  )}
                </div>
                <button
                  onClick={() => acknowledge(alert)}
                  className="flex-shrink-0 text-slate-500 hover:text-white p-1 rounded hover:bg-slate-700 transition"
                  title="Acknowledge"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
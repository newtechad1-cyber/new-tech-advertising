/**
 * Reusable system health status widgets.
 * Import on any page: /nta/command-center, /agency, /agency/content, /nta/system-health
 */
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { AlertTriangle, Wifi, FileText, Users, ShieldAlert } from 'lucide-react';

function since24h() {
  return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
}

export function SystemHealthBar({ compact = false }) {
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const logs = await base44.entities.SystemLog.filter({ status: ['failed', 'warning'] });
        const cutoff = since24h();
        const recent = logs.filter(l => l.created_date >= cutoff);
        setCounts({
          failures: recent.filter(l => l.status === 'failed').length,
          warnings: recent.filter(l => l.status === 'warning').length,
          webhooks: recent.filter(l => l.workflow_type === 'webhook' && l.status === 'failed').length,
          content: recent.filter(l => l.workflow_type === 'content' && l.status === 'failed').length,
          clients: recent.filter(l => l.event_type === 'client_sync_failed').length,
        });
      } catch (_) {
        setCounts({ failures: 0, warnings: 0, webhooks: 0, content: 0, clients: 0 });
      }
    };
    load();
  }, []);

  if (!counts) return null;

  const total = counts.failures + counts.warnings;
  if (total === 0 && compact) return (
    <Link to="/nta/system-health" className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-900/20 border border-emerald-800 px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity">
      <ShieldAlert className="w-3.5 h-3.5" /> System OK
    </Link>
  );

  const items = [
    { label: 'Failures', val: counts.failures, icon: AlertTriangle, color: counts.failures > 0 ? 'text-red-400 bg-red-900/20 border-red-800' : 'text-slate-500 bg-slate-800 border-slate-700' },
    { label: 'Warnings', val: counts.warnings, icon: AlertTriangle, color: counts.warnings > 0 ? 'text-amber-400 bg-amber-900/20 border-amber-800' : 'text-slate-500 bg-slate-800 border-slate-700' },
    { label: 'Webhooks', val: counts.webhooks, icon: Wifi, color: counts.webhooks > 0 ? 'text-red-400 bg-red-900/20 border-red-800' : 'text-slate-500 bg-slate-800 border-slate-700' },
    { label: 'Content', val: counts.content, icon: FileText, color: counts.content > 0 ? 'text-amber-400 bg-amber-900/20 border-amber-800' : 'text-slate-500 bg-slate-800 border-slate-700' },
    { label: 'Client Sync', val: counts.clients, icon: Users, color: counts.clients > 0 ? 'text-red-400 bg-red-900/20 border-red-800' : 'text-slate-500 bg-slate-800 border-slate-700' },
  ];

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {items.map(item => {
        const Icon = item.icon;
        if (compact && item.val === 0) return null;
        return (
          <Link key={item.label} to="/nta/system-health"
            className={`inline-flex items-center gap-1.5 text-xs font-semibold border px-2.5 py-1.5 rounded-lg hover:opacity-80 transition-opacity ${item.color}`}>
            <Icon className="w-3 h-3" />
            {item.val} {item.label}
          </Link>
        );
      })}
    </div>
  );
}
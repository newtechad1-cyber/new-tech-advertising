import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  RefreshCw, AlertTriangle, CheckCircle2, AlertCircle, SkipForward,
  ChevronRight, X, Search, Filter, Wifi, FileText, Users, Database
} from 'lucide-react';

const STATUS_STYLES = {
  success: 'bg-emerald-900/30 text-emerald-400 border-emerald-800',
  failed:  'bg-red-900/30 text-red-400 border-red-800',
  warning: 'bg-amber-900/30 text-amber-400 border-amber-800',
  started: 'bg-blue-900/30 text-blue-400 border-blue-800',
  skipped: 'bg-slate-700/50 text-slate-400 border-slate-700',
};

const STATUS_ICONS = {
  success: CheckCircle2,
  failed:  AlertCircle,
  warning: AlertTriangle,
  started: ChevronRight,
  skipped: SkipForward,
};

const LEVEL_STYLES = {
  info:     'text-slate-400',
  warning:  'text-amber-400',
  error:    'text-red-400',
  critical: 'text-red-500 font-bold',
};

const SECTIONS = [
  { key: 'all',        label: 'All Logs',        icon: Database },
  { key: 'failures',   label: 'Failures',         icon: AlertCircle },
  { key: 'warnings',   label: 'Warnings',         icon: AlertTriangle },
  { key: 'webhook',    label: 'Webhooks',          icon: Wifi },
  { key: 'intake',     label: 'Submissions',       icon: ChevronRight },
  { key: 'content',    label: 'Content',           icon: FileText },
  { key: 'client',     label: 'Client Sync',       icon: Users },
];

function fmtTime(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
}

function since24h() {
  return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
}

export default function NTASystemHealth() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState('all');
  const [selected, setSelected] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [workflowFilter, setWorkflowFilter] = useState('');
  const [dateRange, setDateRange] = useState('24h');

  const load = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.SystemLog.list('-created_date', 500);
      setLogs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const cutoff = dateRange === '24h' ? since24h()
    : dateRange === '7d' ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    : dateRange === '30d' ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    : null;

  const inRange = cutoff ? logs.filter(l => l.created_date >= cutoff) : logs;

  // KPI counts (from last 24h always)
  const last24h = logs.filter(l => l.created_date >= since24h());
  const kpis = {
    failures: last24h.filter(l => l.status === 'failed').length,
    warnings: last24h.filter(l => l.status === 'warning').length,
    webhooks: last24h.filter(l => l.workflow_type === 'webhook' && l.status === 'failed').length,
    content:  last24h.filter(l => l.workflow_type === 'content' && l.status === 'failed').length,
    unmapped: last24h.filter(l => l.event_type === 'migration_fallback_used').length,
    clientSync: last24h.filter(l => l.event_type === 'client_sync_failed').length,
  };

  const applySection = (log) => {
    if (section === 'all') return true;
    if (section === 'failures') return log.status === 'failed';
    if (section === 'warnings') return log.status === 'warning';
    if (section === 'webhook') return log.workflow_type === 'webhook';
    if (section === 'intake') return log.workflow_type === 'intake' || log.workflow_type === 'migration';
    if (section === 'content') return log.workflow_type === 'content' || log.workflow_type === 'heygen' || log.workflow_type === 'publishing';
    if (section === 'client') return log.workflow_type === 'client_setup';
    return true;
  };

  const filtered = inRange.filter(log => {
    if (!applySection(log)) return false;
    if (statusFilter && log.status !== statusFilter) return false;
    if (sourceFilter && log.source_system !== sourceFilter) return false;
    if (workflowFilter && log.workflow_type !== workflowFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        log.event_type?.toLowerCase().includes(q) ||
        log.message?.toLowerCase().includes(q) ||
        log.entity_id?.toLowerCase().includes(q) ||
        log.source_route?.toLowerCase().includes(q) ||
        log.source_component?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sourceSystems = [...new Set(logs.map(l => l.source_system).filter(Boolean))];
  const workflowTypes = [...new Set(logs.map(l => l.workflow_type).filter(Boolean))];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/nta/command-center" className="text-slate-500 hover:text-white text-xs transition-colors">← Command Center</Link>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">System Health</h1>
          <p className="text-slate-500 text-sm mt-0.5">Execution log — every critical workflow step traced and visible</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm px-4 py-2 rounded-lg font-semibold">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Failures (24h)', val: kpis.failures, color: kpis.failures > 0 ? 'text-red-400' : 'text-slate-500', border: kpis.failures > 0 ? 'border-red-900' : 'border-slate-800' },
          { label: 'Warnings (24h)', val: kpis.warnings, color: kpis.warnings > 0 ? 'text-amber-400' : 'text-slate-500', border: kpis.warnings > 0 ? 'border-amber-900' : 'border-slate-800' },
          { label: 'Webhook Fails', val: kpis.webhooks, color: kpis.webhooks > 0 ? 'text-red-400' : 'text-slate-500', border: kpis.webhooks > 0 ? 'border-red-900' : 'border-slate-800' },
          { label: 'Content Fails', val: kpis.content, color: kpis.content > 0 ? 'text-amber-400' : 'text-slate-500', border: kpis.content > 0 ? 'border-amber-900' : 'border-slate-800' },
          { label: 'Unmapped Leads', val: kpis.unmapped, color: kpis.unmapped > 0 ? 'text-amber-400' : 'text-slate-500', border: kpis.unmapped > 0 ? 'border-amber-900' : 'border-slate-800' },
          { label: 'Client Sync Fails', val: kpis.clientSync, color: kpis.clientSync > 0 ? 'text-red-400' : 'text-slate-500', border: kpis.clientSync > 0 ? 'border-red-900' : 'border-slate-800' },
        ].map(k => (
          <div key={k.label} className={`bg-slate-900 border ${k.border} rounded-xl p-3 text-center`}>
            <p className={`text-2xl font-black ${k.color}`}>{k.val}</p>
            <p className="text-slate-500 text-xs mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Section tabs */}
      <div className="flex flex-wrap gap-1.5">
        {SECTIONS.map(s => {
          const Icon = s.icon;
          return (
            <button key={s.key} onClick={() => setSection(s.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                section === s.key ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}>
              <Icon className="w-3.5 h-3.5" />{s.label}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events, IDs, routes..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          </div>
          <select value={dateRange} onChange={e => setDateRange(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="all">All time</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
            <option value="">All Statuses</option>
            {['success','failed','warning','started','skipped'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
            <option value="">All Sources</option>
            {sourceSystems.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={workflowFilter} onChange={e => setWorkflowFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
            <option value="">All Workflows</option>
            {workflowTypes.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
          {(search || statusFilter || sourceFilter || workflowFilter) && (
            <button onClick={() => { setSearch(''); setStatusFilter(''); setSourceFilter(''); setWorkflowFilter(''); }}
              className="text-xs text-slate-400 hover:text-white bg-slate-800 px-3 py-2 rounded-lg">Clear</button>
          )}
        </div>
        <p className="text-xs text-slate-600 mt-2">{filtered.length} log entries</p>
      </div>

      {/* Log Table */}
      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-500">Loading logs...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No log entries match your filters.</p>
          <p className="text-slate-600 text-sm mt-1">This is a good thing if filters are loose.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Event</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Source</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Entity</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Message</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(log => {
                const StatusIcon = STATUS_ICONS[log.status] || AlertTriangle;
                return (
                  <tr key={log.id}
                    onClick={() => setSelected(log)}
                    className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                      log.status === 'failed' ? 'bg-red-950/10' :
                      log.status === 'warning' ? 'bg-amber-950/10' : ''
                    }`}>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{fmtTime(log.created_date)}</td>
                    <td className="px-4 py-3">
                      <code className={`text-xs font-mono ${LEVEL_STYLES[log.log_level] || 'text-slate-300'}`}>{log.event_type}</code>
                      {log.workflow_stage && <span className="text-xs text-slate-600 ml-1">/ {log.workflow_stage}</span>}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold border px-2 py-0.5 rounded-full ${STATUS_STYLES[log.status] || STATUS_STYLES.skipped}`}>
                        <StatusIcon className="w-3 h-3" />{log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-slate-500">{log.source_system}</span>
                      {log.source_route && <p className="text-xs text-slate-700 truncate max-w-24">{log.source_route}</p>}
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      {log.entity_type && <span className="text-xs text-slate-400">{log.entity_type}</span>}
                      {log.entity_id && <p className="text-xs text-slate-600 font-mono truncate max-w-28">{log.entity_id.slice(0, 12)}…</p>}
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-sm text-slate-300 truncate">{log.message || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <ChevronRight className="w-4 h-4 text-slate-700 hover:text-white" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Drawer */}
      {selected && (
        <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-slate-900 border-l border-slate-800 z-50 overflow-y-auto shadow-2xl">
          <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-5 py-4 flex items-start justify-between">
            <div>
              <code className="text-sm font-mono text-blue-300">{selected.event_type}</code>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`inline-flex items-center gap-1 text-xs font-semibold border px-2 py-0.5 rounded-full ${STATUS_STYLES[selected.status] || STATUS_STYLES.skipped}`}>
                  {selected.status}
                </span>
                <span className="text-xs text-slate-500">{fmtTime(selected.created_date)}</span>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white p-1"><X className="w-4 h-4" /></button>
          </div>

          <div className="p-5 space-y-4">
            {/* Message */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Message</p>
              <p className="text-sm text-white leading-relaxed">{selected.message || '—'}</p>
            </div>

            {/* Source info */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Source System', val: selected.source_system },
                { label: 'Log Level', val: selected.log_level },
                { label: 'Workflow Type', val: selected.workflow_type },
                { label: 'Workflow Stage', val: selected.workflow_stage },
                { label: 'Source Route', val: selected.source_route },
                { label: 'Source Component', val: selected.source_component },
              ].filter(f => f.val).map(f => (
                <div key={f.label}>
                  <p className="text-xs text-slate-500 mb-0.5">{f.label}</p>
                  <p className="text-xs text-slate-300 font-mono">{f.val}</p>
                </div>
              ))}
            </div>

            {/* Entity links */}
            {(selected.entity_type || selected.entity_id) && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Primary Entity</p>
                <div className="bg-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300">
                  <span className="text-blue-400">{selected.entity_type}</span>
                  {selected.entity_id && <span className="text-slate-500"> · {selected.entity_id}</span>}
                </div>
              </div>
            )}
            {(selected.related_entity_type || selected.related_entity_id) && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Related Entity</p>
                <div className="bg-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300">
                  <span className="text-violet-400">{selected.related_entity_type}</span>
                  {selected.related_entity_id && <span className="text-slate-500"> · {selected.related_entity_id}</span>}
                </div>
              </div>
            )}

            {/* Error details */}
            {selected.error_details && (
              <div>
                <p className="text-xs font-bold text-red-400 uppercase mb-1">Error Details</p>
                <pre className="bg-red-950/30 border border-red-900 rounded-lg p-3 text-xs text-red-300 whitespace-pre-wrap overflow-auto max-h-40">
                  {selected.error_details}
                </pre>
              </div>
            )}

            {/* Payload snapshot */}
            {selected.payload_snapshot && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Payload Snapshot</p>
                <pre className="bg-slate-800 rounded-lg p-3 text-xs text-slate-400 whitespace-pre-wrap overflow-auto max-h-48">
                  {(() => {
                    try { return JSON.stringify(JSON.parse(selected.payload_snapshot), null, 2); }
                    catch (_) { return selected.payload_snapshot; }
                  })()}
                </pre>
              </div>
            )}

            {selected.user_context && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">User Context</p>
                <p className="text-xs text-slate-300">{selected.user_context}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
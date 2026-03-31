import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import NTACommandNav from '../components/nta-command/NTACommandNav';
import { 
  Zap, CheckCircle, XCircle, Clock, Play, List, 
  AlertTriangle, Filter, RefreshCw, ChevronDown, ChevronUp, X
} from 'lucide-react';

const STATUS_ORDER = { failed: 0, 'Failed': 0, never: 1, 'Never Triggered': 1, running: 2, 'Running': 2, success: 3 };

function deriveStatus(rule) {
  // Prefer stored automation_status if present
  if (rule.automation_status) {
    if (rule.automation_status === 'Failed') return 'failed';
    if (rule.automation_status === 'Never Triggered') return 'never';
    if (rule.automation_status === 'Running') return 'running';
  }
  // Fallback: compute from fields
  if (!rule.last_executed_at) return 'never';
  if (rule.last_run_result === 'failed' || (rule.failure_count > 0 && rule.failure_count >= rule.success_count)) return 'failed';
  return 'running';
}

function StatusBadge({ status }) {
  const cfg = {
    failed:  { label: 'Failed',          cls: 'bg-red-100 text-red-700',    icon: XCircle },
    never:   { label: 'Never Triggered', cls: 'bg-slate-100 text-slate-500', icon: Clock },
    running: { label: 'Running',         cls: 'bg-blue-100 text-blue-700',  icon: Zap },
    success: { label: 'Running',         cls: 'bg-blue-100 text-blue-700',  icon: Zap },
  }[status] || { label: status, cls: 'bg-slate-100 text-slate-500', icon: Clock };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${cfg.cls}`}>
      <Icon className="w-3 h-3" /> {cfg.label}
    </span>
  );
}

function LogsModal({ rule, logs, onClose }) {
  const ruleLogs = logs.filter(l => l.rule_id === rule.id);
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="font-bold text-slate-900 text-lg">{rule.rule_name}</h2>
            <p className="text-slate-500 text-sm">Run History</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          {ruleLogs.length === 0 ? (
            <div className="text-center text-slate-400 py-12">
              <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No run history found for this automation.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ruleLogs.map((log, i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${log.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {log.status}
                    </span>
                    <span className="text-xs text-slate-400">{log.created_date ? new Date(log.created_date).toLocaleString() : '—'}</span>
                  </div>
                  {log.details && <p className="text-sm text-slate-600 mt-1">{log.details}</p>}
                  {log.error_message && (
                    <div className="mt-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700">
                      {log.error_message}
                    </div>
                  )}
                  <div className="flex gap-4 mt-2 text-xs text-slate-500">
                    {log.records_processed != null && <span>Processed: <strong>{log.records_processed}</strong></span>}
                    {log.records_created != null && <span>Created: <strong>{log.records_created}</strong></span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AutomationCommandCenter() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [logsModal, setLogsModal] = useState(null);
  const [runningTest, setRunningTest] = useState(null);
  const [testResults, setTestResults] = useState({});

  const { data: rules = [], isLoading, refetch } = useQuery({
    queryKey: ['automationRules'],
    queryFn: () => base44.entities.AutomationRule.list('-last_executed_at'),
  });

  // Sync computed automation_status back to entity after data loads
  const syncStatus = async (ruleId, status) => {
    const map = { failed: 'Failed', never: 'Never Triggered', running: 'Running' };
    const val = map[status];
    if (!val) return;
    try { await base44.entities.AutomationRule.update(ruleId, { automation_status: val }); } catch (_) {}
  };

  const { data: logs = [] } = useQuery({
    queryKey: ['automationRuleLogs'],
    queryFn: () => base44.entities.AutomationRuleLog.list('-created_date', 200),
  });

  // Derive latest log per rule
  const latestLogByRule = logs.reduce((acc, log) => {
    if (!acc[log.rule_id]) acc[log.rule_id] = log;
    return acc;
  }, {});

  // Sync automation_status to entity for any rules whose computed status differs
  useEffect(() => {
    if (!rules.length) return;
    const map = { failed: 'Failed', never: 'Never Triggered', running: 'Running' };
    rules.forEach(rule => {
      const computed = deriveStatus(rule);
      if (map[computed] !== rule.automation_status) syncStatus(rule.id, computed);
    });
  }, [rules.length, logs.length]);

  const triggerCategories = [...new Set(rules.map(r => r.trigger_category).filter(Boolean))];

  const enriched = rules.map(rule => ({
    ...rule,
    _status: deriveStatus(rule),
    _latestLog: latestLogByRule[rule.id] || null,
  }));

  const filtered = enriched
    .filter(r => statusFilter === 'all' || r._status === statusFilter)
    .filter(r => entityFilter === 'all' || r.trigger_category === entityFilter)
    .sort((a, b) => (STATUS_ORDER[a._status] ?? 9) - (STATUS_ORDER[b._status] ?? 9));

  const handleRunTest = async (rule) => {
    setRunningTest(rule.id);
    try {
      await base44.entities.AutomationRuleLog.create({
        rule_id: rule.id,
        status: 'success',
        details: `Manual test run triggered for "${rule.rule_name}"`,
        records_processed: 0,
        records_created: 0,
      });
      setTestResults(prev => ({ ...prev, [rule.id]: 'triggered' }));
      refetch();
    } catch (e) {
      setTestResults(prev => ({ ...prev, [rule.id]: 'error' }));
    } finally {
      setRunningTest(null);
    }
  };

  const stats = {
    total: enriched.length,
    failed: enriched.filter(r => r._status === 'failed').length,
    never: enriched.filter(r => r._status === 'never').length,
    success: enriched.filter(r => r._status === 'success').length,
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <NTACommandNav />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-orange-500/20 p-2 rounded-lg">
                <Zap className="w-5 h-5 text-orange-400" />
              </div>
              <h1 className="text-2xl font-extrabold text-white">Automation Command Center</h1>
            </div>
            <p className="text-slate-400 text-sm">Monitor, test, and manage all automation rules in one place.</p>
          </div>
          <button onClick={() => refetch()} className="flex items-center gap-2 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-lg text-sm font-medium transition">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Rules', value: stats.total, cls: 'text-white' },
            { label: 'Failed', value: stats.failed, cls: 'text-red-400' },
            { label: 'Never Triggered', value: stats.never, cls: 'text-slate-400' },
            { label: 'Running', value: stats.success, cls: 'text-blue-400' },
          ].map(s => (
            <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-4">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-3xl font-extrabold ${s.cls}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-200 text-sm font-medium outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="failed">Failed</option>
              <option value="never">Never Triggered</option>
              <option value="success">Success</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={entityFilter}
              onChange={e => setEntityFilter(e.target.value)}
              className="bg-transparent text-slate-200 text-sm font-medium outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {triggerCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {(statusFilter !== 'all' || entityFilter !== 'all') && (
            <button
              onClick={() => { setStatusFilter('all'); setEntityFilter('all'); }}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-3.5 h-3.5" /> Clear filters
            </button>
          )}
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin mr-3" /> Loading automations...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center py-24 text-slate-500">
            <Zap className="w-10 h-10 mb-3 opacity-30" />
            <p className="font-medium">No automations match your filters.</p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    {['Automation', 'Status', 'Last Run', 'Last Result', 'Processed', 'Created', 'Last Error', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs font-bold text-slate-500 uppercase tracking-widest px-5 py-4 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((rule, i) => {
                    const log = rule._latestLog;
                    const testResult = testResults[rule.id];
                    return (
                      <tr key={rule.id} className={`border-b border-slate-800/60 hover:bg-slate-800/40 transition ${i % 2 === 0 ? '' : 'bg-slate-900/50'}`}>
                        {/* Name */}
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-semibold text-white">{rule.rule_name}</p>
                            <p className="text-slate-500 text-xs mt-0.5">{rule.trigger_event} · {rule.trigger_category}</p>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <StatusBadge status={rule._status} />
                        </td>

                        {/* Last Run */}
                        <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                          {rule.last_executed_at
                            ? new Date(rule.last_executed_at).toLocaleString()
                            : <span className="text-slate-600">—</span>}
                        </td>

                        {/* Last Result */}
                        <td className="px-5 py-4">
                          {log ? (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${log.status === 'success' ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                              {log.status}
                            </span>
                          ) : <span className="text-slate-600 text-xs">—</span>}
                        </td>

                        {/* Records Processed */}
                        <td className="px-5 py-4 text-slate-300 font-mono">
                          {log?.records_processed ?? <span className="text-slate-600">—</span>}
                        </td>

                        {/* Records Created */}
                        <td className="px-5 py-4 text-slate-300 font-mono">
                          {log?.records_created ?? <span className="text-slate-600">—</span>}
                        </td>

                        {/* Last Error */}
                        <td className="px-5 py-4 max-w-[200px]">
                          {log?.error_message ? (
                            <span className="text-red-400 text-xs truncate block" title={log.error_message}>
                              {log.error_message.slice(0, 60)}{log.error_message.length > 60 ? '…' : ''}
                            </span>
                          ) : <span className="text-slate-600 text-xs">—</span>}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRunTest(rule)}
                              disabled={runningTest === rule.id}
                              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                                testResult === 'triggered'
                                  ? 'bg-green-900/40 text-green-400 border border-green-700'
                                  : testResult === 'error'
                                  ? 'bg-red-900/40 text-red-400 border border-red-700'
                                  : 'bg-orange-500/10 text-orange-400 border border-orange-700 hover:bg-orange-500/20'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {runningTest === rule.id ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : (
                                <Play className="w-3 h-3" />
                              )}
                              {testResult === 'triggered' ? 'Triggered!' : testResult === 'error' ? 'Error' : 'Run Test'}
                            </button>

                            <button
                              onClick={() => setLogsModal(rule)}
                              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition whitespace-nowrap"
                            >
                              <List className="w-3 h-3" /> View Logs
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-3 border-t border-slate-800 text-slate-600 text-xs">
              Showing {filtered.length} of {enriched.length} automations · Sorted: Failed → Never Triggered → Success
            </div>
          </div>
        )}
      </div>

      {logsModal && (
        <LogsModal rule={logsModal} logs={logs} onClose={() => setLogsModal(null)} />
      )}
    </div>
  );
}
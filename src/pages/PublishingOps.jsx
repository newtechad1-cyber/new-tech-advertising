import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import { RefreshCw, Play, AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';

const EVENT_COLORS = {
  publish_success:  'text-emerald-400',
  publish_failed:   'text-red-400',
  oauth_callback:   'text-blue-400',
  oauth_error:      'text-red-400',
  token_refresh:    'text-amber-400',
  publish_attempt:  'text-slate-400',
  retry:            'text-amber-400',
  manual_retry:     'text-blue-400',
};

export default function PublishingOps() {
  const [logs, setLogs] = useState([]);
  const [connections, setConnections] = useState([]);
  const [failedItems, setFailedItems] = useState([]);
  const [allQueueItems, setAllQueueItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [activeTab, setActiveTab] = useState('logs');

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    const [l, c, f, q] = await Promise.all([
      base44.entities.PostingLog.list('-created_date', 100),
      base44.entities.ChannelConnection.list('-updated_date', 200),
      base44.entities.PublishingQueue.filter({ publish_status: 'failed' }),
      base44.entities.PublishingQueue.list('-scheduled_for', 200),
    ]);
    setLogs(l);
    setConnections(c);
    setFailedItems(f);
    setAllQueueItems(q);
    setLoading(false);
  };

  const runJobRunner = async () => {
    setRunning(true);
    try {
      const res = await base44.functions.invoke('publishingJobRunner', {});
      setRunResult(res?.data || res);
    } catch (err) {
      setRunResult({ error: err.message });
    }
    setRunning(false);
    loadAll();
  };

  const manualRetry = async (queueId) => {
    await base44.functions.invoke('publishQueueItem', { queue_id: queueId });
    loadAll();
  };

  const reconnectNeeded = connections.filter(c => c.status === 'error' || c.status === 'expired');

  const now = new Date();
  const stuckItems = allQueueItems.filter(item => {
    if (item.publish_status === 'posted' || item.publish_status === 'cancelled' || item.publish_status === 'publishing') return false;
    if (!item.scheduled_for) return false;
    if (new Date(item.scheduled_for) > now) return false;
    return item.approval_status !== 'approved' || !['queued', 'scheduled', 'not_started'].includes(item.publish_status);
  });

  const TABS = [
    { key: 'logs',        label: 'Event Logs',        count: logs.length },
    { key: 'diagnostics', label: 'Queue Diagnostics', count: stuckItems.length },
    { key: 'failed',      label: 'Failed Queue',       count: failedItems.length },
    { key: 'reconnect',   label: 'Reconnect Needed',   count: reconnectNeeded.length },
    { key: 'connections', label: 'All Connections',    count: connections.length },
  ];

  return (
    <AgencyLayout>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Publishing Ops</h1>
            <p className="text-slate-500 text-sm mt-0.5">Internal debug center for OAuth, tokens, and publish attempts</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadAll} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={runJobRunner} disabled={running}
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg">
              <Play className="w-4 h-4" /> {running ? 'Running...' : 'Run Job Runner'}
            </button>
          </div>
        </div>

        {runResult && (
          <div className={`px-4 py-3 rounded-lg text-sm border ${runResult.error ? 'bg-red-900/30 border-red-800 text-red-300' : 'bg-emerald-900/30 border-emerald-800 text-emerald-300'}`}>
            {runResult.error ? `Error: ${runResult.error}` : `Job runner complete: processed ${runResult.processed}, published ${runResult.published}, failed ${runResult.failed}, skipped ${runResult.skipped}`}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Logs', value: logs.length, color: 'text-blue-400' },
            { label: 'Failed Posts', value: failedItems.length, color: failedItems.length > 0 ? 'text-red-400' : 'text-slate-500' },
            { label: 'Reconnect Needed', value: reconnectNeeded.length, color: reconnectNeeded.length > 0 ? 'text-amber-400' : 'text-slate-500' },
            { label: 'Active Connections', value: connections.filter(c => c.status === 'connected').length, color: 'text-emerald-400' },
          ].map(s => (
            <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 flex-wrap">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === t.key ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {t.label}
              {t.count > 0 && <span className="ml-1.5 bg-slate-700 text-slate-300 text-xs px-1.5 py-0.5 rounded-full">{t.count}</span>}
            </button>
          ))}
        </div>

        {/* LOGS TAB */}
        {activeTab === 'logs' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            {logs.length === 0 ? <EmptyState text="No logs yet." /> : (
              <div className="divide-y divide-slate-800">
                {logs.map(log => (
                  <div key={log.id} className="px-4 py-3 flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {log.status === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> :
                       log.status === 'failed'  ? <XCircle className="w-4 h-4 text-red-400" /> :
                       <Clock className="w-4 h-4 text-slate-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold ${EVENT_COLORS[log.event_type] || 'text-slate-400'}`}>{log.event_type}</span>
                        <span className="text-xs text-slate-500">{log.provider}</span>
                        {log.client_id && <span className="text-xs text-slate-600">{log.client_id}</span>}
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">{log.message}</p>
                      {log.error_details && <p className="text-xs text-red-400 mt-0.5">{log.error_details}</p>}
                    </div>
                    <span className="text-xs text-slate-600 flex-shrink-0">
                      {log.event_time ? new Date(log.event_time).toLocaleTimeString() : new Date(log.created_date).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DIAGNOSTICS TAB */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">Items that are past their scheduled time but will NOT run on the next job cycle.</p>
            {stuckItems.length === 0 ? <EmptyState text="No stuck items — all scheduled posts look healthy!" /> : stuckItems.map(item => {
              const isApproved = item.approval_status === 'approved';
              const isActionable = ['queued', 'scheduled', 'not_started'].includes(item.publish_status);
              const reasons = [];
              if (!isApproved) reasons.push(`approval_status is "${item.approval_status}" (need: approved)`);
              if (!isActionable) reasons.push(`publish_status is "${item.publish_status}" (need: queued/scheduled/not_started)`);
              if (!item.connection_id) reasons.push('No connection_id');
              if (item.notes?.includes('[Runner skip')) reasons.push(item.notes);
              return (
                <div key={item.id} className="bg-slate-900 border border-amber-800/50 rounded-xl p-4 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white text-sm">{item.title || item.body_text?.slice(0, 60)}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.provider} · {item.client_name} · scheduled: {item.scheduled_for ? new Date(item.scheduled_for).toLocaleString() : '—'}</p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full border bg-slate-800 text-slate-400 border-slate-700 capitalize">{item.approval_status?.replace(/_/g,' ')}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full border bg-slate-800 text-slate-400 border-slate-700 capitalize">{item.publish_status?.replace(/_/g,' ')}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {reasons.map((r, i) => (
                      <p key={i} className="text-xs text-amber-400 flex items-start gap-1"><span className="text-amber-600 flex-shrink-0">✗</span>{r}</p>
                    ))}
                  </div>
                  <button onClick={() => manualRetry(item.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg">
                    <Play className="w-3.5 h-3.5" /> Force Run Now
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* FAILED TAB */}
        {activeTab === 'failed' && (
          <div className="space-y-2">
            {failedItems.length === 0 ? <EmptyState text="No failed posts. All clear!" /> : failedItems.map(item => (
              <div key={item.id} className="bg-slate-900 border border-red-900 rounded-xl p-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{item.title || item.body_text?.slice(0, 60)}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.provider} · {item.client_name} · Retries: {item.retry_count}</p>
                  {item.error_message && <p className="text-xs text-red-400 mt-1">{item.error_message}</p>}
                </div>
                {item.retry_count < (item.max_retries || 3) && (
                  <button onClick={() => manualRetry(item.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-white rounded-lg">
                    <Play className="w-3.5 h-3.5" /> Retry
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* RECONNECT TAB */}
        {activeTab === 'reconnect' && (
          <div className="space-y-2">
            {reconnectNeeded.length === 0 ? <EmptyState text="All connections are healthy!" /> : reconnectNeeded.map(conn => (
              <div key={conn.id} className="bg-slate-900 border border-amber-800 rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-white text-sm">{conn.client_name} — {conn.provider}</p>
                  <p className="text-xs text-slate-500">{conn.external_account_name}</p>
                  {conn.error_message && <p className="text-xs text-amber-400 mt-1">{conn.error_message}</p>}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full border ${conn.status === 'expired' ? 'bg-amber-900/40 text-amber-400 border-amber-700' : 'bg-red-900/40 text-red-400 border-red-700'}`}>
                  {conn.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* CONNECTIONS TAB */}
        {activeTab === 'connections' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-800">
                {['Client', 'Provider', 'Account', 'Destination', 'Status', 'Expires', 'Last Post'].map(h => (
                  <th key={h} className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-slate-800">
                {connections.map(c => (
                  <tr key={c.id} className="hover:bg-slate-800/40">
                    <td className="px-3 py-3 text-white text-xs">{c.client_name}</td>
                    <td className="px-3 py-3 text-slate-400 text-xs capitalize">{c.provider?.replace(/_/g, ' ')}</td>
                    <td className="px-3 py-3 text-slate-400 text-xs">{c.external_account_name || '—'}</td>
                    <td className="px-3 py-3 text-slate-400 text-xs">{c.selected_destination_name || '—'}</td>
                    <td className="px-3 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                        c.status === 'connected'    ? 'bg-emerald-900/40 text-emerald-400 border-emerald-700' :
                        c.status === 'expired'      ? 'bg-amber-900/40 text-amber-400 border-amber-700' :
                        c.status === 'error'        ? 'bg-red-900/40 text-red-400 border-red-700' :
                        'bg-slate-800 text-slate-500 border-slate-700'
                      }`}>{c.status}</span>
                    </td>
                    <td className="px-3 py-3 text-slate-500 text-xs">{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : '—'}</td>
                    <td className="px-3 py-3 text-slate-500 text-xs">{c.last_successful_post_at ? new Date(c.last_successful_post_at).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AgencyLayout>
  );
}

function EmptyState({ text }) {
  return <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center"><p className="text-slate-500 text-sm">{text}</p></div>;
}
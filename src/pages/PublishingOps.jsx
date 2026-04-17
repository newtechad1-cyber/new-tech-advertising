import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import { RefreshCw, Play, AlertTriangle, CheckCircle2, XCircle, Clock, Info } from 'lucide-react';

const EVENT_COLORS = {
  publish_success:               'text-emerald-400',
  queue_item_publish_success:    'text-emerald-400',
  publish_failed:                'text-red-400',
  queue_item_publish_failed:     'text-red-400',
  oauth_callback:                'text-blue-400',
  oauth_error:                   'text-red-400',
  token_refresh:                 'text-amber-400',
  publish_attempt:               'text-slate-400',
  retry:                         'text-amber-400',
  manual_retry:                  'text-blue-400',
  queue_item_created:            'text-blue-300',
  queue_item_updated:            'text-blue-300',
  queue_item_linked_to_connection: 'text-teal-400',
  queue_item_missing_connection: 'text-red-400',
  queue_item_missing_provider:   'text-red-400',
  queue_item_missing_schedule:   'text-amber-400',
  queue_item_not_approved:       'text-amber-400',
  queue_item_skipped:            'text-amber-400',
  runner_due_items_found:        'text-blue-400',
  runner_skipped_items_found:    'text-amber-400',
  queue_item_picked_up:          'text-teal-400',
};

// Returns skip reason or null if eligible
function getSkipReason(item, now) {
  if (!item.provider) return 'missing_provider: no provider set';
  if (!item.connection_id) return 'missing_connection_id: no connection_id set — go to Channel Connections to link a channel';
  if (!item.scheduled_for) return 'missing_schedule: scheduled_for is empty';
  if (item.approval_status !== 'approved') return `not_approved: approval_status="${item.approval_status}"`;
  if (!['queued', 'scheduled', 'not_started'].includes(item.publish_status)) {
    return `bad_publish_status: publish_status="${item.publish_status}"`;
  }
  if (new Date(item.scheduled_for) > now) return null; // future — not a problem
  return null; // eligible
}

function isReadyToPublish(item) {
  return !!(
    item.provider &&
    item.connection_id &&
    item.scheduled_for &&
    item.approval_status === 'approved' &&
    ['queued', 'scheduled', 'not_started'].includes(item.publish_status)
  );
}

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
      base44.entities.PostingLog.list('-created_date', 150),
      base44.entities.ChannelConnection.list('-updated_date', 200),
      base44.entities.PublishingQueue.filter({ publish_status: 'failed' }),
      base44.entities.PublishingQueue.list('-scheduled_for', 300),
    ]);
    setLogs(l);
    setConnections(c);
    setFailedItems(f);
    setAllQueueItems(q);
    setLoading(false);
  };

  const runJobRunner = async () => {
    setRunning(true);
    setRunResult(null);
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
  const nonTerminal = allQueueItems.filter(item =>
    !['posted', 'cancelled', 'publishing'].includes(item.publish_status)
  );

  // Items that are due (past scheduled_for) but NOT eligible for the runner
  const skippedItems = nonTerminal
    .filter(item => item.scheduled_for && new Date(item.scheduled_for) <= now)
    .map(item => {
      const reasons = [];
      if (!item.provider) reasons.push('No provider set');
      if (!item.connection_id) reasons.push('No connection_id — channel not linked');
      if (!item.scheduled_for) reasons.push('No scheduled_for date');
      if (item.approval_status !== 'approved') reasons.push(`approval_status="${item.approval_status}" (need: approved)`);
      if (!['queued', 'scheduled', 'not_started'].includes(item.publish_status)) {
        reasons.push(`publish_status="${item.publish_status}" (need: queued/scheduled/not_started)`);
      }
      return { item, reasons, eligible: reasons.length === 0 };
    })
    .filter(({ eligible }) => !eligible);

  // Items that ARE eligible and due right now
  const dueItems = nonTerminal.filter(item => {
    if (!item.provider) return false;
    if (!item.connection_id) return false;
    if (!item.scheduled_for) return false;
    if (item.approval_status !== 'approved') return false;
    if (!['queued', 'scheduled', 'not_started'].includes(item.publish_status)) return false;
    return new Date(item.scheduled_for) <= now;
  });

  // Upcoming scheduled (future, eligible)
  const upcomingItems = nonTerminal.filter(item =>
    isReadyToPublish(item) && item.scheduled_for && new Date(item.scheduled_for) > now
  );

  const TABS = [
    { key: 'logs',        label: 'Event Logs',        count: logs.length },
    { key: 'due',         label: 'Due Now',           count: dueItems.length, alert: dueItems.length > 0 },
    { key: 'skipped',     label: 'Skipped Items',     count: skippedItems.length, alert: skippedItems.length > 0 },
    { key: 'upcoming',    label: 'Upcoming',          count: upcomingItems.length },
    { key: 'failed',      label: 'Failed',            count: failedItems.length, alert: failedItems.length > 0 },
    { key: 'reconnect',   label: 'Reconnect Needed',  count: reconnectNeeded.length, alert: reconnectNeeded.length > 0 },
    { key: 'connections', label: 'All Connections',   count: connections.length },
  ];

  return (
    <AgencyLayout>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Publishing Ops</h1>
            <p className="text-slate-500 text-sm mt-0.5">Diagnostics, job runner, and connection health</p>
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

        {/* Run result */}
        {runResult && (
          <div className={`px-4 py-3 rounded-lg text-sm border ${runResult.error ? 'bg-red-900/30 border-red-800 text-red-300' : 'bg-emerald-900/30 border-emerald-800 text-emerald-300'}`}>
            {runResult.error
              ? `Error: ${runResult.error}`
              : `Runner complete — due_items=${runResult.due_items ?? '?'} processed=${runResult.processed} published=${runResult.published} failed=${runResult.failed} skipped=${runResult.skipped}`
            }
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Due Now',          value: dueItems.length,       color: dueItems.length > 0 ? 'text-blue-400' : 'text-slate-500' },
            { label: 'Skipped',          value: skippedItems.length,   color: skippedItems.length > 0 ? 'text-amber-400' : 'text-slate-500' },
            { label: 'Failed Posts',     value: failedItems.length,    color: failedItems.length > 0 ? 'text-red-400' : 'text-slate-500' },
            { label: 'Reconnect Needed', value: reconnectNeeded.length,color: reconnectNeeded.length > 0 ? 'text-amber-400' : 'text-slate-500' },
            { label: 'Active Channels',  value: connections.filter(c => c.status === 'connected').length, color: 'text-emerald-400' },
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
              {t.count > 0 && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${t.alert ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                  {t.count}
                </span>
              )}
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
                       log.status === 'failed'   ? <XCircle className="w-4 h-4 text-red-400" /> :
                       log.status === 'warning'  ? <AlertTriangle className="w-4 h-4 text-amber-400" /> :
                       <Clock className="w-4 h-4 text-slate-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold ${EVENT_COLORS[log.event_type] || 'text-slate-400'}`}>{log.event_type}</span>
                        {log.provider && <span className="text-xs text-slate-500">{log.provider}</span>}
                        {log.queue_id && <span className="text-xs text-slate-600 font-mono">{log.queue_id.slice(0, 8)}…</span>}
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

        {/* DUE NOW TAB */}
        {activeTab === 'due' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">Items that are past their scheduled time AND fully eligible — the runner will attempt to publish these.</p>
            {dueItems.length === 0 ? (
              <EmptyState text="No items due right now. Either nothing is scheduled yet, or items exist but have issues (check Skipped Items tab)." />
            ) : dueItems.map(item => (
              <div key={item.id} className="bg-slate-900 border border-blue-800/50 rounded-xl p-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-emerald-900/50 text-emerald-400 border border-emerald-700 px-2 py-0.5 rounded-full font-bold">✓ READY</span>
                  </div>
                  <p className="font-semibold text-white text-sm">{item.title || item.body_text?.slice(0, 60)}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.provider?.replace(/_/g,' ')} · {item.client_name} · scheduled: {item.scheduled_for ? new Date(item.scheduled_for).toLocaleString() : '—'}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5 font-mono">connection_id: {item.connection_id}</p>
                </div>
                <button onClick={() => manualRetry(item.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg flex-shrink-0">
                  <Play className="w-3.5 h-3.5" /> Publish Now
                </button>
              </div>
            ))}
          </div>
        )}

        {/* SKIPPED ITEMS TAB */}
        {activeTab === 'skipped' && (
          <div className="space-y-3">
            <div className="bg-amber-900/20 border border-amber-800 rounded-lg px-4 py-3 text-xs text-amber-400">
              <p className="font-semibold mb-1">These items are past their scheduled time but are NOT eligible for the runner.</p>
              <p>Fix the issues listed below, then run the job runner again or use Force Publish.</p>
            </div>
            {skippedItems.length === 0 ? <EmptyState text="No skipped items — all scheduled posts are valid!" /> : skippedItems.map(({ item, reasons }) => (
              <div key={item.id} className="bg-slate-900 border border-amber-800/50 rounded-xl p-4 space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white text-sm">{item.title || item.body_text?.slice(0, 60) || '(no title)'}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.client_name || item.client_id} · {item.provider?.replace(/_/g,' ') || <span className="text-red-400">NO PROVIDER</span>}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0 flex-wrap justify-end">
                    <StatusPill label={item.approval_status} />
                    <StatusPill label={item.publish_status} />
                  </div>
                </div>

                {/* Field summary */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <FieldRow label="ID" value={item.id?.slice(0, 12) + '…'} mono />
                  <FieldRow label="scheduled_for" value={item.scheduled_for ? new Date(item.scheduled_for).toLocaleString() : '—'} missing={!item.scheduled_for} />
                  <FieldRow label="provider" value={item.provider || '—'} missing={!item.provider} />
                  <FieldRow label="connection_id" value={item.connection_id ? item.connection_id.slice(0, 10) + '…' : '—'} missing={!item.connection_id} mono />
                  <FieldRow label="approval_status" value={item.approval_status || '—'} missing={item.approval_status !== 'approved'} />
                  <FieldRow label="publish_status" value={item.publish_status || '—'} />
                </div>

                {/* Skip reasons */}
                <div className="space-y-1">
                  {reasons.map((r, i) => (
                    <p key={i} className="text-xs text-amber-400 flex items-start gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                      {r}
                    </p>
                  ))}
                </div>

                {/* Force run if the only issue isn't connection/provider */}
                {item.connection_id && item.provider && (
                  <button onClick={() => manualRetry(item.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg">
                    <Play className="w-3.5 h-3.5" /> Force Publish Anyway
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* UPCOMING TAB */}
        {activeTab === 'upcoming' && (
          <div className="space-y-2">
            <p className="text-xs text-slate-500">Fully valid items scheduled for the future — the runner will pick these up automatically when their time arrives.</p>
            {upcomingItems.length === 0 ? <EmptyState text="No upcoming scheduled posts." /> : upcomingItems.map(item => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs bg-emerald-900/40 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">✓ VALID</span>
                  </div>
                  <p className="font-semibold text-white text-sm">{item.title || item.body_text?.slice(0, 60)}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.provider?.replace(/_/g,' ')} · {item.client_name}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-slate-400">{new Date(item.scheduled_for).toLocaleString()}</p>
                  <p className="text-xs text-slate-600 capitalize">{item.publish_status}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FAILED TAB */}
        {activeTab === 'failed' && (
          <div className="space-y-2">
            {failedItems.length === 0 ? <EmptyState text="No failed posts. All clear!" /> : failedItems.map(item => (
              <div key={item.id} className="bg-slate-900 border border-red-900 rounded-xl p-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{item.title || item.body_text?.slice(0, 60)}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.provider} · {item.client_name} · Retries: {item.retry_count}/{item.max_retries || 3}</p>
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
                        c.status === 'connected' ? 'bg-emerald-900/40 text-emerald-400 border-emerald-700' :
                        c.status === 'expired'   ? 'bg-amber-900/40 text-amber-400 border-amber-700' :
                        c.status === 'error'     ? 'bg-red-900/40 text-red-400 border-red-700' :
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

function StatusPill({ label }) {
  return (
    <span className="text-xs font-bold px-2 py-0.5 rounded-full border bg-slate-800 text-slate-400 border-slate-700 capitalize">
      {label?.replace(/_/g, ' ') || '—'}
    </span>
  );
}

function FieldRow({ label, value, missing, mono }) {
  return (
    <>
      <span className="text-slate-500">{label}</span>
      <span className={`${missing ? 'text-red-400 font-semibold' : 'text-slate-300'} ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </>
  );
}
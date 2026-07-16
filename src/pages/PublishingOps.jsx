import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import { RefreshCw, Play, AlertTriangle, CheckCircle2, XCircle, Clock, Info, RotateCcw } from 'lucide-react';

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
  const [showFacebookTest, setShowFacebookTest] = useState(false);
  const [publishingTest, setPublishingTest] = useState(false);
  const [facebookTest, setFacebookTest] = useState({ connection_id: '', body_text: '', link_url: '' });
  const [facebookTestResult, setFacebookTestResult] = useState(null);

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

  const readyFacebookConnections = connections.filter(c =>
    c.provider === 'facebook' &&
    ['ready', 'connected'].includes(c.status) &&
    (c.selected_destination_id || c.external_parent_id)
  );

  const publishFacebookTest = async () => {
    const connection = readyFacebookConnections.find(c => c.id === facebookTest.connection_id);
    if (!connection || !facebookTest.body_text.trim()) return;
    const pageName = connection.selected_destination_name || connection.external_parent_name || 'selected Facebook Page';
    if (!confirm(`Publish this test post publicly to Facebook Page "${pageName}" now?`)) return;
    setPublishingTest(true);
    setFacebookTestResult(null);
    try {
      const item = await base44.entities.PublishingQueue.create({
        client_id: connection.client_id,
        client_name: connection.client_name || '',
        connection_id: connection.id,
        provider: 'facebook',
        content_type: facebookTest.link_url ? 'link_post' : 'text_post',
        title: '[MANUAL TEST] Facebook publishing verification',
        body_text: facebookTest.body_text.trim(),
        caption: facebookTest.body_text.trim(),
        link_url: facebookTest.link_url.trim() || null,
        scheduled_for: new Date().toISOString(),
        timezone: 'America/Chicago',
        approval_status: 'approved',
        publish_status: 'queued',
        source_wizard: 'manual',
        notes: 'Manually reviewed and approved Facebook connection test',
      });
      const response = await base44.functions.invoke('publishQueueItem', { queue_id: item.id });
      const result = response?.data || response;
      if (result?.success) {
        setFacebookTestResult({ success: true, message: `Facebook confirmed the post${result.platform_post_id ? ` — ID ${result.platform_post_id}` : ''}.`, url: result.platform_post_url });
      } else {
        setFacebookTestResult({ success: false, message: result?.error || 'Facebook publishing failed.' });
      }
      loadAll();
    } catch (err) {
      setFacebookTestResult({ success: false, message: err.message });
    }
    setPublishingTest(false);
  };

  const manualRetry = async (queueId) => {
    await base44.functions.invoke('publishQueueItem', { queue_id: queueId });
    loadAll();
  };

  const reconnectNeeded = connections.filter(c => c.status === 'error' || c.status === 'expired');

  const now = new Date();
  // publishing is NOT excluded — we need to detect stuck items
  const nonTerminal = allQueueItems.filter(item =>
    !['posted', 'cancelled'].includes(item.publish_status)
  );

  // Stuck publishing: status=publishing, updated > 10 min ago
  const stuckThreshold = new Date(now.getTime() - 10 * 60 * 1000);
  const stuckItems = allQueueItems.filter(item => {
    if (item.publish_status !== 'publishing') return false;
    const updatedAt = item.updated_date ? new Date(item.updated_date) : new Date(0);
    return updatedAt < stuckThreshold;
  });

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
    { key: 'stuck',       label: 'Stuck Publishing',  count: stuckItems.length, alert: stuckItems.length > 0 },
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
            <button onClick={() => { setFacebookTestResult(null); setShowFacebookTest(true); }}
              className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold px-4 py-2 rounded-lg">
              <Info className="w-4 h-4" /> Test Facebook
            </button>
            <button onClick={runJobRunner} disabled={running}
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg">
              <Play className="w-4 h-4" /> {running ? 'Running...' : 'Run Job Runner'}
            </button>
          </div>
        </div>

        {showFacebookTest && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl">
              <div className="px-6 py-4 border-b border-slate-800">
                <h2 className="font-bold text-white">Manual Facebook Publishing Test</h2>
                <p className="text-xs text-slate-500 mt-1">You choose the exact Page and approve the exact text before anything is published.</p>
              </div>
              <div className="p-6 space-y-4">
                {readyFacebookConnections.length === 0 ? (
                  <div className="bg-amber-900/20 border border-amber-800 rounded-lg p-3 text-sm text-amber-300">
                    No Facebook connection is ready. Go to Channel Connections and select a Facebook Page first.
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Facebook Page *</label>
                      <select value={facebookTest.connection_id} onChange={e => setFacebookTest(p => ({ ...p, connection_id: e.target.value }))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                        <option value="">Choose the exact Page…</option>
                        {readyFacebookConnections.map(c => (
                          <option key={c.id} value={c.id}>{c.client_name || 'NTA'} — {c.selected_destination_name || c.external_parent_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Post text *</label>
                      <textarea rows={5} value={facebookTest.body_text} onChange={e => setFacebookTest(p => ({ ...p, body_text: e.target.value }))}
                        placeholder="Write the exact test message that will appear publicly…"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Optional link</label>
                      <input value={facebookTest.link_url} onChange={e => setFacebookTest(p => ({ ...p, link_url: e.target.value }))} placeholder="https://newtechadvertising.com/..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500" />
                    </div>
                  </>
                )}

                {facebookTestResult && (
                  <div className={`rounded-lg border p-3 text-sm ${facebookTestResult.success ? 'bg-emerald-900/30 border-emerald-700 text-emerald-300' : 'bg-red-900/30 border-red-800 text-red-300'}`}>
                    {facebookTestResult.message}
                    {facebookTestResult.url && <a href={facebookTestResult.url} target="_blank" rel="noreferrer" className="block underline mt-1">Open Facebook post →</a>}
                  </div>
                )}
              </div>
              <div className="px-6 pb-6 flex justify-end gap-2">
                <button onClick={() => setShowFacebookTest(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm">Close</button>
                <button onClick={publishFacebookTest} disabled={publishingTest || !facebookTest.connection_id || !facebookTest.body_text.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold rounded-lg text-sm">
                  {publishingTest ? 'Publishing…' : 'Review & Publish Now'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Run result */}
        {runResult && (
          <div className={`px-4 py-3 rounded-lg text-sm border ${runResult.error ? 'bg-red-900/30 border-red-800 text-red-300' : 'bg-emerald-900/30 border-emerald-800 text-emerald-300'}`}>
            {runResult.error
              ? `Error: ${runResult.error}`
              : `Runner complete — due_items=${runResult.due_items ?? '?'} processed=${runResult.processed} published=${runResult.published} failed=${runResult.failed} skipped=${runResult.skipped}`
            }
          </div>
        )}

        {/* Stats — publish confirmation counts */}
        {(() => {
          const queuedCount    = allQueueItems.filter(i => ['queued','scheduled','not_started'].includes(i.publish_status)).length;
          const blockedCount   = skippedItems.length;
          const publishingCount = allQueueItems.filter(i => i.publish_status === 'publishing').length;
          const confirmedCount = allQueueItems.filter(i => i.publish_status === 'posted').length;
          const failedCount    = failedItems.length;
          return (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: 'Queued',             value: queuedCount,     color: queuedCount > 0 ? 'text-blue-400' : 'text-slate-500' },
                { label: 'Blocked / Skipped',  value: blockedCount,    color: blockedCount > 0 ? 'text-amber-400' : 'text-slate-500' },
                { label: 'Publishing',         value: publishingCount, color: publishingCount > 0 ? 'text-amber-400' : 'text-slate-500' },
                { label: 'Posted Confirmed',   value: confirmedCount,  color: confirmedCount > 0 ? 'text-emerald-400' : 'text-slate-500' },
                { label: 'Failed',             value: failedCount,     color: failedCount > 0 ? 'text-red-400' : 'text-slate-500' },
              ].map(s => (
                <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                  <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          );
        })()}

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
            {/* Diagnostic counts */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { label: 'Total Queue Items', value: allQueueItems.length, color: 'text-slate-300' },
                { label: 'Due Now (Eligible)', value: dueItems.length, color: dueItems.length > 0 ? 'text-blue-400' : 'text-slate-500' },
                { label: 'Missing Provider', value: nonTerminal.filter(i => !i.provider).length, color: 'text-red-400' },
                { label: 'Missing Connection', value: nonTerminal.filter(i => !i.connection_id).length, color: 'text-red-400' },
                { label: 'Missing Schedule', value: nonTerminal.filter(i => !i.scheduled_for).length, color: 'text-amber-400' },
                { label: 'Not Approved', value: nonTerminal.filter(i => i.approval_status !== 'approved').length, color: 'text-amber-400' },
              ].map(s => (
                <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-center">
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-amber-900/20 border border-amber-800 rounded-lg px-4 py-3 text-xs text-amber-400">
              <p className="font-semibold mb-1">Items below are past their scheduled time but NOT eligible for the runner.</p>
              <p>Fix the issues listed, then run the job runner or use Force Publish.</p>
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
            {failedItems.length === 0 ? <EmptyState text="No failed posts. All clear!" /> : failedItems.map(item => {
              const conn = item.connection_id ? connections.find(c => c.id === item.connection_id) : null;
              const needsDest = ['google_business_profile', 'youtube'].includes(item.provider);
              const missingDest = needsDest && item.connection_id && !conn?.selected_destination_id;
              const isNoDestErr = item.error_message?.includes('no destination') || item.error_message?.includes('No destination');
              return (
                <div key={item.id} className="bg-slate-900 border border-red-900 rounded-xl p-4 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-white text-sm">{item.title || item.body_text?.slice(0, 60)}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.provider?.replace(/_/g,' ')} · {item.client_name} · Retries: {item.retry_count}/{item.max_retries || 3}</p>
                      {item.failure_category && (
                        <p className="text-xs text-amber-400 mt-0.5 font-semibold">
                          ↳ {{'queue_validation_failure':'Queue validation','connection_destination_failure':'Connection/destination','provider_auth_failure':'Auth failure','provider_quota_failure':'Quota exceeded','provider_content_rejection':'Content rejected','unknown_provider_error':'Provider error'}[item.failure_category] || item.failure_category}
                        </p>
                      )}
                      {item.error_message && <p className="text-xs text-red-400 mt-1">{item.error_message}</p>}
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0 flex-wrap justify-end">
                      {/* Reset to queue */}
                      {!missingDest && (
                        <button onClick={async () => {
                          await base44.entities.PublishingQueue.update(item.id, { publish_status: 'queued', error_message: null });
                          loadAll();
                        }} className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">
                          <RotateCcw className="w-3.5 h-3.5" /> Reset to Queue
                        </button>
                      )}
                      {/* Retry now */}
                      {!missingDest && (
                        <button onClick={() => manualRetry(item.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 bg-amber-700 hover:bg-amber-600 text-white rounded-lg">
                          <Play className="w-3.5 h-3.5" /> Retry Now
                        </button>
                      )}
                      {/* Missing destination */}
                      {missingDest && (
                        <a href="/agency/channel-connections"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded-lg">
                          Select Destination →
                        </a>
                      )}
                    </div>
                  </div>
                  {missingDest && (
                    <div className="bg-red-950/40 border border-red-800/60 rounded-lg px-3 py-2 text-xs text-red-400">
                      Cannot retry: no destination selected on connection. Select a {item.provider === 'youtube' ? 'YouTube channel' : 'GBP location'} in Channel Connections first.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* STUCK PUBLISHING TAB */}
        {activeTab === 'stuck' && (
          <div className="space-y-3">
            <div className="bg-amber-900/20 border border-amber-800 rounded-lg px-4 py-3 text-xs text-amber-400">
              <p className="font-semibold mb-1">Stuck Publishing Detection</p>
              <p>Items stuck in "publishing" status for &gt;10 minutes with no worker completion. The job runner auto-resets these on each run. You can also manually reset or mark failed below.</p>
            </div>
            {stuckItems.length === 0 ? <EmptyState text="No stuck publishing items detected." /> : stuckItems.map(item => (
              <div key={item.id} className="bg-slate-900 border border-amber-800 rounded-xl p-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{item.title || item.body_text?.slice(0, 60)}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.provider?.replace(/_/g,' ')} · {item.client_name}</p>
                  <p className="text-xs text-amber-500 mt-1">Stuck in "publishing" since ~{item.updated_date ? new Date(item.updated_date).toLocaleString() : 'unknown'}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={async () => {
                    await base44.entities.PublishingQueue.update(item.id, { publish_status: 'queued', error_message: null });
                    loadAll();
                  }} className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">
                    <RotateCcw className="w-3.5 h-3.5" /> Reset to Queue
                  </button>
                  <button onClick={async () => {
                    await base44.entities.PublishingQueue.update(item.id, { publish_status: 'failed', error_message: 'Manually marked failed: stuck in publishing state' });
                    loadAll();
                  }} className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-red-800 hover:bg-red-700 text-white rounded-lg">
                    <XCircle className="w-3.5 h-3.5" /> Mark Failed
                  </button>
                </div>
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

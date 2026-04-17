import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Send, Clock, Zap, CheckCircle2, Loader2, AlertTriangle, Link } from 'lucide-react';

const PROVIDERS = [
  { key: 'google_business_profile', label: 'GBP', emoji: '📍' },
  { key: 'facebook', label: 'Facebook', emoji: '📘' },
  { key: 'instagram', label: 'Instagram', emoji: '📸' },
  { key: 'youtube', label: 'YouTube', emoji: '▶️' },
];

const CONTENT_TYPE_MAP = {
  gbp_post: 'gbp_cta',
  social_series: 'text_post',
  video_script: 'video_post',
  blog: 'link_post',
  email: 'text_post',
  landing_page: 'link_post',
};

export default function SendToQueueModal({ asset, mode, onClose, onSuccess }) {
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loadingConns, setLoadingConns] = useState(true);
  const [scheduledFor, setScheduledFor] = useState('');
  const [saving, setSaving] = useState(false);
  const [createdItems, setCreatedItems] = useState([]); // [{provider, queueId, error}]
  const [globalError, setGlobalError] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (asset?.client_id) {
        try {
          const conns = await base44.entities.ChannelConnection.filter({ client_id: asset.client_id });
          setConnections(conns);
        } catch (_) {}
      }
      setLoadingConns(false);
    };
    load();

    // Default schedule to +1 hour rounded
    const d = new Date(Date.now() + 60 * 60 * 1000);
    d.setMinutes(0, 0, 0);
    setScheduledFor(d.toISOString().slice(0, 16));
  }, [asset]);

  const toggleProvider = (key) =>
    setSelectedProviders(prev => prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]);

  // Find best connection for a provider (prefer connected, then any)
  const getConnectionForProvider = (providerKey) =>
    connections.find(c => c.provider === providerKey && c.status === 'connected') ||
    connections.find(c => c.provider === providerKey) ||
    null;

  // Validate a single provider — returns error string or null
  const providerError = (providerKey) => {
    const conn = getConnectionForProvider(providerKey);
    if (!conn) return `No channel connection found for ${providerKey}. Go to Channel Connections to set one up.`;
    if (conn.status !== 'connected') return `Connection for ${providerKey} is "${conn.status}" — reconnect it in Channel Connections.`;
    if (!conn.id) return `Connection for ${providerKey} is missing an ID.`;
    return null;
  };

  const handleSubmit = async () => {
    setGlobalError(null);
    setCreatedItems([]);

    // Validate platforms selected
    if (selectedProviders.length === 0) {
      setGlobalError('Select at least one platform.');
      return;
    }

    // Validate schedule time for schedule mode
    if (mode === 'schedule' && !scheduledFor) {
      setGlobalError('Pick a scheduled date and time.');
      return;
    }

    // Validate all selected providers have a valid connection — block if any fail
    const providerErrors = selectedProviders.map(p => ({ p, err: providerError(p) })).filter(x => x.err);
    if (providerErrors.length > 0) {
      setGlobalError(providerErrors.map(x => x.err).join(' | '));
      return;
    }

    setSaving(true);
    const results = [];

    for (const providerKey of selectedProviders) {
      const conn = getConnectionForProvider(providerKey);

      const scheduledAt = mode === 'now'
        ? new Date().toISOString()
        : mode === 'schedule'
          ? new Date(scheduledFor).toISOString()
          : new Date().toISOString(); // 'queue' mode = immediate

      const isScheduledFuture = mode === 'schedule' && new Date(scheduledFor) > new Date();
      const publishStatus = isScheduledFuture ? 'scheduled' : 'queued';

      const queueItem = {
        client_id: asset.client_id,
        client_name: asset.client || '',
        connection_id: conn.id,
        provider: providerKey,
        content_type: CONTENT_TYPE_MAP[asset.asset_type] || 'text_post',
        title: asset.title || asset.topic_title || '',
        body_text: asset.caption || asset.content?.slice(0, 1000) || '',
        caption: asset.caption || '',
        hashtags: asset.hashtags || '',
        media_urls: asset.media_url ? [asset.media_url] : [],
        video_url: asset.video_url || '',
        scheduled_for: scheduledAt,
        timezone: 'America/Chicago',
        approval_status: 'approved',
        publish_status: publishStatus,
        source_wizard: 'content_wizard',
        source_content_id: asset.id,
      };

      try {
        // Log intent
        await base44.entities.PostingLog.create({
          event_time: new Date().toISOString(),
          event_type: 'queue_item_created',
          client_id: asset.client_id,
          provider: providerKey,
          status: 'info',
          message: `Creating queue item: ${providerKey} approval=approved publish=${publishStatus} scheduled=${scheduledAt} connection=${conn.id}`,
          payload: JSON.stringify({ provider: providerKey, connection_id: conn.id, scheduled_for: scheduledAt }),
        }).catch(() => {});

        const created = await base44.entities.PublishingQueue.create(queueItem);
        results.push({ provider: providerKey, queueId: created.id, error: null });

        // Log success
        await base44.entities.PostingLog.create({
          event_time: new Date().toISOString(),
          event_type: 'queue_item_linked_to_connection',
          queue_id: created.id,
          client_id: asset.client_id,
          provider: providerKey,
          status: 'success',
          message: `Queue item ${created.id} created and linked to connection ${conn.id}`,
        }).catch(() => {});

        // If Publish Now — trigger immediately
        if (mode === 'now') {
          base44.functions.invoke('publishQueueItem', { queue_id: created.id }).catch(() => {});
        }
      } catch (err) {
        results.push({ provider: providerKey, queueId: null, error: err.message });

        await base44.entities.PostingLog.create({
          event_time: new Date().toISOString(),
          event_type: 'queue_item_creation_failed',
          client_id: asset.client_id,
          provider: providerKey,
          status: 'failed',
          message: `Failed to create queue item for ${providerKey}: ${err.message}`,
          error_details: err.message,
        }).catch(() => {});
      }
    }

    setCreatedItems(results);

    // Update asset status if at least one succeeded
    const anySuccess = results.some(r => !r.error);
    if (anySuccess) {
      await base44.entities.ContentAssets.update(asset.id, {
        status: mode === 'now' ? 'published' : 'approved',
      }).catch(() => {});
    }

    setSaving(false);
    if (anySuccess) {
      setTimeout(() => { onSuccess?.(); onClose(); }, 2000);
    }
  };

  const modeLabel = { queue: 'Send to Queue', schedule: 'Schedule Post', now: 'Publish Now' }[mode];
  const modeIcon = {
    queue: <Send className="w-4 h-4" />,
    schedule: <Clock className="w-4 h-4" />,
    now: <Zap className="w-4 h-4" />,
  }[mode];

  const allCreated = createdItems.length > 0 && createdItems.every(r => !r.error);
  const someCreated = createdItems.some(r => !r.error);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold">
            {modeIcon} {modeLabel}
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Asset info */}
          <div className="bg-slate-800 rounded-lg px-3 py-2.5">
            <p className="text-xs text-slate-400">Content</p>
            <p className="text-sm font-semibold text-white mt-0.5 truncate">{asset.title || asset.topic_title}</p>
            <p className="text-xs text-slate-500">{asset.client} · {asset.asset_type?.replace(/_/g, ' ')}</p>
          </div>

          {/* Platform selection */}
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-2">Select Platforms</p>
            {loadingConns ? (
              <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading connections...
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {PROVIDERS.map(p => {
                  const conn = getConnectionForProvider(p.key);
                  const selected = selectedProviders.includes(p.key);
                  const hasActive = conn?.status === 'connected';
                  const hasAny = !!conn;
                  return (
                    <button key={p.key} onClick={() => toggleProvider(p.key)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        selected ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                      }`}>
                      <span>{p.emoji}</span>
                      <span className="flex-1 text-left">{p.label}</span>
                      {hasActive
                        ? <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" title="Connected" />
                        : hasAny
                          ? <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" title={`Status: ${conn.status}`} />
                          : <span className="w-2 h-2 rounded-full bg-slate-600 flex-shrink-0" title="No connection" />
                      }
                    </button>
                  );
                })}
              </div>
            )}
            <p className="text-xs text-slate-600 mt-1.5">🟢 connected · 🟡 exists but not active · ⚫ none</p>
          </div>

          {/* Per-provider warnings for selected with issues */}
          {selectedProviders.map(p => {
            const err = providerError(p);
            if (!err) return null;
            const LABELS = { google_business_profile: 'GBP', facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube' };
            return (
              <div key={p} className="flex items-start gap-2 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-red-400 font-semibold">{LABELS[p]}: {err}</p>
                  <a href="/agency/channel-connections" target="_blank" className="text-xs text-blue-400 hover:underline flex items-center gap-0.5 mt-0.5">
                    <Link className="w-3 h-3" /> Open Channel Connections
                  </a>
                </div>
              </div>
            );
          })}

          {/* Schedule datetime */}
          {mode === 'schedule' && (
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Schedule Date & Time</label>
              <input type="datetime-local" value={scheduledFor} onChange={e => setScheduledFor(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
          )}

          {mode === 'now' && (
            <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg px-3 py-2.5 text-xs text-amber-400">
              This will immediately create a queue item and trigger publishing to selected platforms.
            </div>
          )}

          {/* Global error */}
          {globalError && (
            <div className="flex items-start gap-2 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-400">{globalError}</p>
            </div>
          )}

          {/* Per-item results after submit */}
          {createdItems.length > 0 && (
            <div className="space-y-2">
              {createdItems.map((r, i) => (
                <div key={i} className={`flex items-start gap-2 rounded-lg px-3 py-2 border ${r.error ? 'bg-red-900/20 border-red-800' : 'bg-emerald-900/20 border-emerald-800'}`}>
                  {r.error
                    ? <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                    : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  }
                  <div>
                    <p className={`text-xs font-semibold ${r.error ? 'text-red-400' : 'text-emerald-400'}`}>
                      {r.provider?.replace(/_/g, ' ')}: {r.error ? 'Failed' : 'Queue item created ✓'}
                    </p>
                    {r.queueId && <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {r.queueId}</p>}
                    {r.error && <p className="text-xs text-red-300 mt-0.5">{r.error}</p>}
                  </div>
                </div>
              ))}
              {someCreated && (
                <p className="text-xs text-slate-500">Closing in a moment… or <button onClick={onClose} className="text-blue-400 hover:underline">close now</button></p>
              )}
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-slate-800 flex gap-3">
          <button onClick={handleSubmit} disabled={saving || allCreated}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-2 rounded-lg text-sm">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : modeIcon}
            {saving ? 'Creating queue items...' : modeLabel}
          </button>
          <button onClick={onClose} className="px-4 bg-slate-800 text-white font-semibold py-2 rounded-lg text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
}
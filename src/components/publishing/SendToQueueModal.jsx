import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Send, Clock, Zap, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';

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

async function logQueueEvent(eventType, data) {
  try {
    await base44.entities.PostingLog.create({
      event_time: new Date().toISOString(),
      event_type: eventType,
      status: data.status || 'info',
      ...data,
    });
  } catch (_) {}
}

export default function SendToQueueModal({ asset, mode, onClose, onSuccess }) {
  // mode: 'queue' | 'schedule' | 'now'
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [connections, setConnections] = useState([]);
  const [scheduledFor, setScheduledFor] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (asset?.client_id) {
      base44.entities.ChannelConnection.filter({ client_id: asset.client_id, status: 'connected' })
        .then(setConnections);
    }
    // Default schedule to +1 hour rounded to the hour
    const d = new Date(Date.now() + 60 * 60 * 1000);
    d.setMinutes(0, 0, 0);
    setScheduledFor(d.toISOString().slice(0, 16));
  }, [asset]);

  const toggleProvider = (key) =>
    setSelectedProviders(prev => prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]);

  const getConnectionForProvider = (providerKey) =>
    connections.find(c => c.provider === providerKey && c.status === 'connected') || null;

  // Returns null if valid, string reason if invalid
  const validateProvider = (providerKey) => {
    const conn = getConnectionForProvider(providerKey);
    if (!conn) return `No active connection for ${providerKey}`;
    if (!conn.id) return `Connection missing ID for ${providerKey}`;
    return null; // valid
  };

  const buildQueueItem = (providerKey, scheduledAt, publishStatus) => {
    const conn = getConnectionForProvider(providerKey);
    return {
      client_id: asset.client_id,
      client_name: asset.client || '',
      connection_id: conn?.id || null,
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
      notes: null,
    };
  };

  const handleSubmit = async () => {
    setError(null);
    if (selectedProviders.length === 0) { setError('Select at least one platform.'); return; }
    if (mode === 'schedule' && !scheduledFor) { setError('Pick a date/time.'); return; }

    // Validate connections — block if any selected provider has no active connection
    const connectionErrors = selectedProviders
      .map(p => validateProvider(p))
      .filter(Boolean);

    if (connectionErrors.length > 0) {
      setError(`Missing connections: ${connectionErrors.join('; ')}. Connect these channels first in Channel Connections.`);
      return;
    }

    setSaving(true);
    try {
      const scheduledAt = mode === 'now'
        ? new Date().toISOString()
        : mode === 'schedule'
          ? new Date(scheduledFor).toISOString()
          : null;

      // For 'queue' mode (no schedule) — set scheduled_for to now so runner picks it up immediately
      const finalScheduledAt = scheduledAt ?? new Date().toISOString();

      // publish_status: scheduled (has future time), queued (immediate/now/queue)
      const isScheduledFuture = mode === 'schedule' && scheduledAt && new Date(scheduledAt) > new Date();
      const publishStatus = isScheduledFuture ? 'scheduled' : 'queued';

      const creates = selectedProviders.map(async (p) => {
        const conn = getConnectionForProvider(p);
        const item = buildQueueItem(p, finalScheduledAt, publishStatus);

        await logQueueEvent('queue_item_created', {
          client_id: asset.client_id,
          provider: p,
          status: 'info',
          message: `Creating queue item for ${p} — approval=approved publish=${publishStatus} scheduled=${finalScheduledAt}`,
          payload: JSON.stringify({ provider: p, connection_id: conn?.id, scheduled_for: finalScheduledAt, publish_status: publishStatus }),
        });

        const created = await base44.entities.PublishingQueue.create(item);

        await logQueueEvent('queue_item_linked_to_connection', {
          queue_id: created.id,
          client_id: asset.client_id,
          provider: p,
          status: 'success',
          message: `Queue item ${created.id} linked to connection ${conn?.id} (${conn?.external_account_name || ''})`,
          payload: JSON.stringify({ queue_id: created.id, connection_id: conn?.id }),
        });

        return created;
      });

      const created = await Promise.all(creates);

      // If "Publish Now" — trigger publishQueueItem immediately for each
      if (mode === 'now') {
        await Promise.allSettled(
          created.map(item => base44.functions.invoke('publishQueueItem', { queue_id: item.id }))
        );
      }

      // Update asset status
      await base44.entities.ContentAssets.update(asset.id, {
        status: mode === 'now' ? 'published' : 'approved',
      });

      setDone(true);
      setTimeout(() => { onSuccess?.(); onClose(); }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const modeLabel = { queue: 'Send to Queue', schedule: 'Schedule Post', now: 'Publish Now' }[mode];
  const modeIcon = {
    queue: <Send className="w-4 h-4" />,
    schedule: <Clock className="w-4 h-4" />,
    now: <Zap className="w-4 h-4" />,
  }[mode];

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
            <p className="text-sm font-semibold text-white mt-0.5">{asset.title || asset.topic_title}</p>
            <p className="text-xs text-slate-500">{asset.client} · {asset.asset_type?.replace('_', ' ')}</p>
          </div>

          {/* Platform selection */}
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-2">Select Platforms</p>
            <div className="grid grid-cols-2 gap-2">
              {PROVIDERS.map(p => {
                const conn = getConnectionForProvider(p.key);
                const selected = selectedProviders.includes(p.key);
                const noConn = selected && !conn;
                return (
                  <button key={p.key} onClick={() => toggleProvider(p.key)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      noConn
                        ? 'bg-red-900/30 border-red-700 text-red-300'
                        : selected
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                    }`}>
                    <span>{p.emoji}</span>
                    <span className="flex-1 text-left">{p.label}</span>
                    {conn
                      ? <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" title="Connection found" />
                      : <span className="w-2 h-2 rounded-full bg-slate-600 flex-shrink-0" title="No connection" />
                    }
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-600 mt-1.5">🟢 = active connection found · red = no connection (will block)</p>
          </div>

          {/* Missing connection warnings */}
          {selectedProviders.map(p => {
            const err = validateProvider(p);
            if (!err) return null;
            return (
              <div key={p} className="flex items-start gap-2 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-400">{err} — go to Channel Connections to connect this platform.</p>
              </div>
            );
          })}

          {/* Schedule date/time */}
          {mode === 'schedule' && (
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Schedule Date & Time</label>
              <input type="datetime-local" value={scheduledFor} onChange={e => setScheduledFor(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
          )}

          {/* Ready-to-publish indicator */}
          {selectedProviders.length > 0 && (
            <div className={`rounded-lg px-3 py-2.5 text-xs border ${
              selectedProviders.every(p => !validateProvider(p))
                ? 'bg-emerald-900/20 border-emerald-800 text-emerald-400'
                : 'bg-amber-900/20 border-amber-800 text-amber-400'
            }`}>
              {selectedProviders.every(p => !validateProvider(p))
                ? '✓ Ready to publish — all selected platforms have active connections'
                : '⚠ Fix missing connections before submitting'
              }
            </div>
          )}

          {mode === 'now' && selectedProviders.every(p => !validateProvider(p)) && (
            <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg px-3 py-2.5 text-xs text-amber-400">
              This will immediately trigger publishing to the selected platforms.
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          {done && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Done! Added to queue.
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-slate-800 flex gap-3">
          <button onClick={handleSubmit} disabled={saving || done}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-2 rounded-lg text-sm">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : modeIcon}
            {saving ? 'Processing...' : modeLabel}
          </button>
          <button onClick={onClose} className="px-4 bg-slate-800 text-white font-semibold py-2 rounded-lg text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
}
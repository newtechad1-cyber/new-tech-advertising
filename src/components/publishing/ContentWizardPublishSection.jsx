import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Zap, Calendar, Repeat, ChevronDown, ChevronUp, Loader2, CheckCircle2, XCircle, ExternalLink, AlertTriangle, Link } from 'lucide-react';

const PROVIDER_LABELS = {
  google_business_profile: '📍 Google Business Profile',
  facebook: '👥 Facebook',
  instagram: '📸 Instagram',
  youtube: '▶️ YouTube',
};

const FREQ_OPTIONS = [
  { value: 'daily',    label: 'Daily' },
  { value: 'weekdays', label: 'Weekdays only (Mon–Fri)' },
  { value: 'every_x',  label: 'Every X days' },
];

function buildQueuePayload(wf, extra = {}) {
  return {
    client_id: wf.client_id || '',
    client_name: wf.client || '',
    provider: extra.provider || 'google_business_profile',
    connection_id: extra.connection_id || '',
    content_type: 'text_post',
    title: wf.title,
    body_text: wf.caption_primary || wf.caption_text || '',
    caption: wf.caption_primary || wf.caption_text || '',
    hashtags: wf.hashtags || '',
    video_url: wf.heygen_video_url || '',
    media_urls: wf.image_url ? [wf.image_url] : [],
    source_wizard: 'content_wizard',
    source_content_id: wf.id,
    ...extra,
  };
}

function generateOccurrences(startDate, timeStr, frequency, everyXDays, endType, endDate, occurrenceCount) {
  const dates = [];
  const [hh, mm] = (timeStr || '09:00').split(':').map(Number);
  let current = new Date(startDate);
  current.setHours(hh, mm, 0, 0);

  const maxOccurrences = endType === 'count' ? (occurrenceCount || 1) : 365;
  const endLimit = endType === 'date' && endDate ? new Date(endDate) : null;

  while (dates.length < maxOccurrences) {
    if (endLimit && current > endLimit) break;

    const dow = current.getDay(); // 0=Sun
    if (frequency === 'daily') {
      dates.push(new Date(current));
      current = new Date(current.getTime() + 86400000);
    } else if (frequency === 'weekdays') {
      if (dow >= 1 && dow <= 5) dates.push(new Date(current));
      current = new Date(current.getTime() + 86400000);
    } else if (frequency === 'every_x') {
      dates.push(new Date(current));
      current = new Date(current.getTime() + (everyXDays || 7) * 86400000);
    } else {
      break;
    }
    if (dates.length >= 52) break; // safety cap
  }
  return dates;
}

export default function ContentWizardPublishSection({ wf, connections, onSaved }) {
  const [mode, setMode] = useState(null); // 'now' | 'once' | 'recurring'
  const [provider, setProvider] = useState('google_business_profile');
  const [connectionId, setConnectionId] = useState('');

  // Schedule Once
  const [scheduleDate, setScheduleDate] = useState('');

  // Recurring
  const [recurStart, setRecurStart] = useState('');
  const [recurTime, setRecurTime] = useState('09:00');
  const [recurFreq, setRecurFreq] = useState('daily');
  const [recurEveryX, setRecurEveryX] = useState(7);
  const [recurEndType, setRecurEndType] = useState('count'); // 'count' | 'date'
  const [recurCount, setRecurCount] = useState(5);
  const [recurEndDate, setRecurEndDate] = useState('');

  // Advanced / manual override
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [manualUrl, setManualUrl] = useState('');

  const [acting, setActing] = useState(false);
  const [result, setResult] = useState(null); // { type: 'success'|'error', msg }

  const providerConnections = connections.filter(c => c.provider === provider && c.status === 'connected');
  const selectedConn = providerConnections.find(c => c.id === connectionId) || providerConnections[0];

  const logEvent = async (type, message, extra = {}) => {
    try {
      await base44.entities.PostingLog.create({
        event_time: new Date().toISOString(),
        client_id: wf.client_id || '',
        event_type: type,
        status: 'info',
        message,
        payload: JSON.stringify(extra),
      });
    } catch (_) {}
  };

  const showResult = (type, msg) => {
    setResult({ type, msg });
    setTimeout(() => setResult(null), 6000);
  };

  // ---- PUBLISH NOW ----
  const handlePublishNow = async () => {
    if (!selectedConn) { showResult('error', 'No connected account found for this provider'); return; }
    setActing(true);
    try {
      const now = new Date().toISOString();
      // Upsert queue item
      let queueItem;
      const existing = await base44.entities.PublishingQueue.filter({ source_content_id: wf.id, provider, publish_status: 'queued' });
      const payload = buildQueuePayload(wf, {
        provider,
        connection_id: selectedConn.id,
        approval_status: 'approved',
        publish_status: 'queued',
        scheduled_for: now,
      });
      if (existing.length > 0) {
        queueItem = await base44.entities.PublishingQueue.update(existing[0].id, payload);
      } else {
        queueItem = await base44.entities.PublishingQueue.create(payload);
      }
      await logEvent('queue_item_created', `Publish Now: created queue item for "${wf.title}"`, { queue_id: queueItem.id, provider });

      // Immediately invoke publisher
      const res = await base44.functions.invoke('publishQueueItem', { queue_id: queueItem.id });
      if (res?.data?.success) {
        showResult('success', `Published! ${res.data.platform_post_url ? '' : 'Post is live.'}`);
        await logEvent('queue_item_publish_success', `Publish Now succeeded for "${wf.title}"`, { post_url: res.data.platform_post_url });
      } else {
        showResult('error', `Publish failed: ${res?.data?.error || 'Unknown error'}`);
      }
      onSaved && onSaved();
    } catch (err) {
      showResult('error', err.message);
    }
    setActing(false);
  };

  // ---- SCHEDULE ONCE ----
  const handleScheduleOnce = async () => {
    if (!scheduleDate) { showResult('error', 'Please select a date and time'); return; }
    if (!selectedConn) { showResult('error', 'No connected account found for this provider'); return; }
    setActing(true);
    try {
      const payload = buildQueuePayload(wf, {
        provider,
        connection_id: selectedConn.id,
        approval_status: 'approved',
        publish_status: 'queued',
        scheduled_for: new Date(scheduleDate).toISOString(),
      });
      const existing = await base44.entities.PublishingQueue.filter({ source_content_id: wf.id, provider, publish_status: 'queued' });
      let queueItem;
      if (existing.length > 0) {
        queueItem = await base44.entities.PublishingQueue.update(existing[0].id, payload);
      } else {
        queueItem = await base44.entities.PublishingQueue.create(payload);
      }
      await logEvent('queue_item_scheduled', `Scheduled once: "${wf.title}" for ${scheduleDate}`, { queue_id: queueItem.id, provider, scheduled_for: scheduleDate });
      showResult('success', `Scheduled for ${new Date(scheduleDate).toLocaleString()}. Runner will pick it up automatically.`);
      onSaved && onSaved();
    } catch (err) {
      showResult('error', err.message);
    }
    setActing(false);
  };

  // ---- RECURRING ----
  const handleRecurring = async () => {
    if (!recurStart) { showResult('error', 'Please select a start date'); return; }
    if (!selectedConn) { showResult('error', 'No connected account found for this provider'); return; }
    const occurrences = generateOccurrences(recurStart, recurTime, recurFreq, recurEveryX, recurEndType, recurEndDate, recurCount);
    if (occurrences.length === 0) { showResult('error', 'No occurrences generated — check your settings'); return; }
    setActing(true);
    try {
      const created = [];
      for (const date of occurrences) {
        const item = await base44.entities.PublishingQueue.create(buildQueuePayload(wf, {
          provider,
          connection_id: selectedConn.id,
          approval_status: 'approved',
          publish_status: 'queued',
          scheduled_for: date.toISOString(),
          notes: `Recurring: ${recurFreq}`,
        }));
        created.push(item.id);
      }
      await logEvent('queue_item_scheduled', `Recurring schedule created: ${created.length} items for "${wf.title}"`, { count: created.length, provider, frequency: recurFreq });
      showResult('success', `Created ${created.length} scheduled posts! First: ${occurrences[0].toLocaleString()}`);
      onSaved && onSaved();
    } catch (err) {
      showResult('error', err.message);
    }
    setActing(false);
  };

  // ---- MARK POSTED MANUALLY ----
  const handleMarkPosted = async () => {
    if (!confirm('Mark this workflow as manually posted?')) return;
    await base44.entities.ContentWorkflow.update(wf.id, { publishing_status: 'posted', published_date: new Date().toISOString(), current_stage: 'published' });
    if (manualUrl) await base44.entities.ContentWorkflow.update(wf.id, { publish_urls: [...(wf.publish_urls || []), manualUrl] });
    showResult('success', 'Marked as manually posted.');
    onSaved && onSaved();
  };

  const previewOccurrences = mode === 'recurring' && recurStart
    ? generateOccurrences(recurStart, recurTime, recurFreq, recurEveryX, recurEndType, recurEndDate, recurCount).slice(0, 5)
    : [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-blue-400" />
        <h2 className="text-sm font-bold text-white">Publishing</h2>
      </div>

      {/* Result notice */}
      {result && (
        <div className={`flex items-start gap-2 px-3 py-2.5 rounded-lg text-sm border ${result.type === 'success' ? 'bg-emerald-900/30 border-emerald-700 text-emerald-300' : 'bg-red-900/30 border-red-800 text-red-300'}`}>
          {result.type === 'success' ? <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" /> : <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
          {result.msg}
        </div>
      )}

      {/* Provider + Connection selector */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">Platform</label>
          <select value={provider} onChange={e => { setProvider(e.target.value); setConnectionId(''); }}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
            {Object.entries(PROVIDER_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">Account</label>
          {providerConnections.length === 0 ? (
            <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-900/20 border border-amber-800 rounded-lg px-3 py-2">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" /> No connected account
            </div>
          ) : (
            <select value={connectionId || selectedConn?.id || ''} onChange={e => setConnectionId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
              {providerConnections.map(c => (
                <option key={c.id} value={c.id}>{c.external_account_name || c.selected_destination_name || c.id}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Mode selector */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { key: 'now',       icon: Zap,      label: 'Publish Now',        desc: 'Immediately' },
          { key: 'once',      icon: Calendar, label: 'Schedule Once',      desc: 'One time' },
          { key: 'recurring', icon: Repeat,   label: 'Recurring',          desc: 'Repeating' },
        ].map(({ key, icon: Icon, label, desc }) => (
          <button key={key} onClick={() => setMode(mode === key ? null : key)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center ${
              mode === key
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
            }`}>
            <Icon className="w-4 h-4" />
            <span className="text-xs font-bold leading-none">{label}</span>
            <span className={`text-xs leading-none ${mode === key ? 'text-blue-200' : 'text-slate-600'}`}>{desc}</span>
          </button>
        ))}
      </div>

      {/* PUBLISH NOW */}
      {mode === 'now' && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-3">
          <p className="text-xs text-slate-400">Content will be published <strong className="text-white">immediately</strong> to the selected platform.</p>
          {selectedConn && (
            <div className="text-xs text-slate-500">
              → {selectedConn.external_account_name} {selectedConn.selected_destination_name ? `(${selectedConn.selected_destination_name})` : ''}
            </div>
          )}
          <button onClick={handlePublishNow} disabled={acting || !selectedConn}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors">
            {acting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {acting ? 'Publishing...' : 'Publish Now'}
          </button>
        </div>
      )}

      {/* SCHEDULE ONCE */}
      {mode === 'once' && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Date & Time</label>
            <input type="datetime-local" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <button onClick={handleScheduleOnce} disabled={acting || !scheduleDate || !selectedConn}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors">
            {acting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
            {acting ? 'Scheduling...' : 'Schedule Post'}
          </button>
        </div>
      )}

      {/* RECURRING */}
      {mode === 'recurring' && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Start Date</label>
              <input type="date" value={recurStart} onChange={e => setRecurStart(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Time of Day</label>
              <input type="time" value={recurTime} onChange={e => setRecurTime(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Frequency</label>
            <div className="flex flex-wrap gap-2">
              {FREQ_OPTIONS.map(f => (
                <button key={f.value} onClick={() => setRecurFreq(f.value)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${recurFreq === f.value ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          {recurFreq === 'every_x' && (
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Every X days</label>
              <input type="number" min="1" max="365" value={recurEveryX} onChange={e => setRecurEveryX(parseInt(e.target.value) || 7)}
                className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" />
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">End Condition</label>
            <div className="flex gap-2 mb-2">
              {[{ v: 'count', l: '# of times' }, { v: 'date', l: 'End date' }].map(o => (
                <button key={o.v} onClick={() => setRecurEndType(o.v)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${recurEndType === o.v ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}>
                  {o.l}
                </button>
              ))}
            </div>
            {recurEndType === 'count' && (
              <input type="number" min="1" max="52" value={recurCount} onChange={e => setRecurCount(parseInt(e.target.value) || 5)}
                className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" />
            )}
            {recurEndType === 'date' && (
              <input type="date" value={recurEndDate} onChange={e => setRecurEndDate(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" />
            )}
          </div>

          {/* Preview */}
          {previewOccurrences.length > 0 && (
            <div className="bg-slate-900 rounded-lg p-3 space-y-1">
              <p className="text-xs font-semibold text-slate-400 mb-2">Preview ({previewOccurrences.length} shown):</p>
              {previewOccurrences.map((d, i) => (
                <p key={i} className="text-xs text-slate-300">
                  {d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              ))}
              {recurEndType === 'count' && recurCount > 5 && <p className="text-xs text-slate-600">...and {recurCount - 5} more</p>}
            </div>
          )}

          <button onClick={handleRecurring} disabled={acting || !recurStart || !selectedConn}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors">
            {acting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Repeat className="w-4 h-4" />}
            {acting ? 'Creating...' : `Create ${recurEndType === 'count' ? recurCount : '?'} Scheduled Posts`}
          </button>
        </div>
      )}

      {/* Advanced / Manual Tracking */}
      <div className="border-t border-slate-800 pt-3">
        <button onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          Advanced / Manual Override
        </button>
        {showAdvanced && (
          <div className="mt-3 space-y-3 bg-slate-800/40 rounded-xl p-3">
            <p className="text-xs text-slate-500">Use these if you published manually outside this system.</p>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Add Post URL</label>
              <div className="flex gap-2">
                <input value={manualUrl} onChange={e => setManualUrl(e.target.value)} placeholder="https://..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" />
              </div>
            </div>
            <button onClick={handleMarkPosted} disabled={acting}
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg border border-slate-600 transition-colors">
              <CheckCircle2 className="w-3.5 h-3.5" /> Mark as Manually Posted
            </button>
            {wf.publish_urls?.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500">Saved URLs:</p>
                {wf.publish_urls.map((u, i) => (
                  <a key={i} href={u} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-400 hover:underline">
                    <ExternalLink className="w-3 h-3" /> {u}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
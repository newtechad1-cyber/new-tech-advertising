import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import {
  CheckCircle2, Circle, XCircle, AlertTriangle, Search, RefreshCw,
  Copy, Check, ChevronDown, ChevronRight, Zap, Link2, Info,
  Clock, MapPin, Settings, Users, ExternalLink
} from 'lucide-react';

// ─── Provider config ──────────────────────────────────────────────────────────

const PROVIDERS = ['facebook', 'instagram', 'google_business_profile', 'youtube'];

const PROVIDER_META = {
  facebook: {
    label: 'Facebook',
    icon: '📘',
    color: 'text-blue-400',
    border: 'border-blue-800/60',
    activeBg: 'bg-blue-950/20',
    loginHint: 'Log in with the Facebook account that manages this business Page.',
    noDestHuman: 'No Facebook Pages were found on this account. Make sure you are logged into the Facebook account that has access to this business Page.',
    destNeededHuman: 'Connected, but no Facebook Page has been selected yet. Select a page below to finish setup.',
    expiredHuman: 'This Facebook connection has expired. Please reconnect to restore publishing.',
    errorHuman: 'Facebook connection has an error. Please reconnect.',
  },
  instagram: {
    label: 'Instagram',
    icon: '📸',
    color: 'text-pink-400',
    border: 'border-pink-800/60',
    activeBg: 'bg-pink-950/20',
    loginHint: 'Log in with the Facebook account linked to the Instagram Business account. Instagram must be a Business account connected to a Facebook Page.',
    noDestHuman: 'No Instagram Business accounts found. Make sure the Instagram account is a Business account and is linked to a Facebook Page.',
    destNeededHuman: 'Connected, but no Instagram account has been selected yet. Select one below to finish setup.',
    expiredHuman: 'This Instagram connection has expired. Please reconnect.',
    errorHuman: 'Instagram connection has an error. Please reconnect.',
  },
  google_business_profile: {
    label: 'Google Business Profile',
    icon: '📍',
    color: 'text-emerald-400',
    border: 'border-emerald-800/60',
    activeBg: 'bg-emerald-950/20',
    loginHint: 'Log in with the Google account that manages this business\'s Google Business Profile.',
    noDestHuman: 'No Google Business Profile locations found. Make sure this Google account manages the business profile and that it is verified.',
    destNeededHuman: 'Connected, but no business location has been selected yet. Select a location below to finish setup.',
    expiredHuman: 'This Google connection has expired. Please reconnect.',
    errorHuman: 'Google Business Profile connection has an error. Please reconnect.',
  },
  youtube: {
    label: 'YouTube',
    icon: '▶️',
    color: 'text-red-400',
    border: 'border-red-800/60',
    activeBg: 'bg-red-950/20',
    loginHint: 'Log in with the Google account that manages this YouTube channel.',
    noDestHuman: 'No YouTube channels found on this account.',
    destNeededHuman: 'Connected, but no YouTube channel has been selected yet.',
    expiredHuman: 'YouTube connection expired. Please reconnect.',
    errorHuman: 'YouTube connection has an error. Please reconnect.',
    notImplemented: 'YouTube connection can be saved, but automated publishing is not ready yet.',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getHumanStatus(conn) {
  if (!conn || conn.status === 'disconnected') return { label: 'Not Connected', color: 'text-slate-500', bg: 'bg-slate-800', badge: 'bg-slate-800 text-slate-500' };
  if (conn.status === 'ready') return { label: 'Ready to Publish', color: 'text-emerald-400', bg: 'bg-emerald-950/30', badge: 'bg-emerald-900/40 text-emerald-400 border border-emerald-700' };
  if (conn.status === 'expired') return { label: 'Connection Expired', color: 'text-orange-400', bg: 'bg-orange-950/20', badge: 'bg-orange-900/30 text-orange-400 border border-orange-700' };
  if (conn.status === 'error') return { label: 'Connection Error', color: 'text-red-400', bg: 'bg-red-950/20', badge: 'bg-red-900/30 text-red-400 border border-red-700' };
  if (conn.status === 'connected_no_destination' || conn.status === 'connected') return { label: 'Destination Needed', color: 'text-amber-400', bg: 'bg-amber-950/20', badge: 'bg-amber-900/30 text-amber-400 border border-amber-700' };
  return { label: conn.status, color: 'text-slate-400', bg: 'bg-slate-800', badge: 'bg-slate-800 text-slate-400' };
}

function getChecklistState(conn) {
  const isExpired = conn?.expires_at && new Date(conn.expires_at) < new Date();
  return {
    connected: !!conn && conn.status !== 'disconnected' && !isExpired,
    destSelected: !!conn?.selected_destination_id,
    testPassed: conn?.status === 'ready',
  };
}

function getDests(conn) {
  if (!conn?.destinations_json) return [];
  try { return JSON.parse(conn.destinations_json); } catch { return []; }
}

async function writeLog(payload) {
  try {
    await base44.entities.PostingLog.create({
      client_id: payload.client_id || '',
      provider: payload.provider || '',
      event_type: payload.event_type,
      event_time: new Date().toISOString(),
      status: payload.ok ? 'success' : 'failed',
      message: payload.message,
      payload: payload.meta ? JSON.stringify(payload.meta) : undefined,
    });
  } catch {/* non-blocking */}
}

// ─── Checklist component ──────────────────────────────────────────────────────

function SetupChecklist({ conn, provider }) {
  const { connected, destSelected, testPassed } = getChecklistState(conn);
  const meta = PROVIDER_META[provider];

  const steps = [
    { label: `Log in with the account that manages the ${meta.label} Page/Profile`, done: connected },
    { label: `Connect ${meta.label}`, done: connected },
    { label: 'Select the page / location / channel', done: destSelected },
    { label: 'Run a test connection', done: testPassed },
    { label: 'Ready to publish ✓', done: testPassed },
  ];

  const allDone = steps.every(s => s.done);

  return (
    <div className={`rounded-xl border px-4 py-3 space-y-1.5 ${allDone ? 'bg-emerald-950/20 border-emerald-800/40' : 'bg-slate-900/60 border-slate-800'}`}>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Setup Checklist</p>
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          {s.done
            ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            : <Circle className="w-3.5 h-3.5 text-slate-700 flex-shrink-0" />}
          <span className={`text-xs ${s.done ? 'text-slate-300' : 'text-slate-600'}`}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Copy Link Button ─────────────────────────────────────────────────────────

function CopySetupLink({ clientId, clientName }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `${window.location.origin}/agency/channel-setup?client=${clientId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <button
      onClick={handleCopy}
      title={`Copy the channel setup link for ${clientName}`}
      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Link Copied!' : 'Copy Client Setup Link'}
    </button>
  );
}

// ─── Platform Card ────────────────────────────────────────────────────────────

function PlatformCard({ provider, conn, clientId, clientName, onConnect, onRefresh }) {
  const meta = PROVIDER_META[provider];
  const humanStatus = getHumanStatus(conn);
  const dests = getDests(conn);
  const { connected, destSelected, testPassed } = getChecklistState(conn);
  const isExpired = conn?.expires_at && new Date(conn.expires_at) < new Date();

  const [showDests, setShowDests] = useState(false);
  const [selectingDest, setSelectingDest] = useState(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  // Derive the right human-friendly error message
  const errorMsg = (() => {
    if (!conn || conn.status === 'disconnected') return null;
    if (isExpired || conn.status === 'expired') return meta.expiredHuman;
    if (conn.status === 'error') return meta.errorHuman;
    if ((conn.status === 'connected_no_destination' || conn.status === 'connected') && dests.length === 0 && conn.dest_sync_at) return meta.noDestHuman;
    if ((conn.status === 'connected_no_destination' || conn.status === 'connected') && !conn.selected_destination_id) return meta.destNeededHuman;
    return null;
  })();

  const handleConnect = async () => {
    await writeLog({ client_id: clientId, provider, event_type: 'oauth_connect', ok: true, message: 'oauth_connect_started', meta: { clientName } });
    onConnect(provider, clientId, clientName);
  };

  const handleSelectDest = async (dest) => {
    setSelectingDest(dest.id);
    await base44.entities.ChannelConnection.update(conn.id, {
      selected_destination_id: dest.id,
      selected_destination_name: dest.name,
      status: 'ready',
      error_message: null,
    });
    await writeLog({ client_id: clientId, provider, event_type: 'oauth_connect', ok: true, message: `destination_selected — ${dest.name} (${dest.id})`, meta: { dest_id: dest.id, dest_name: dest.name } });
    setSelectingDest(null);
    setShowDests(false);
    onRefresh();
  };

  const handleSyncDests = async () => {
    if (!conn) return;
    setSyncing(true);
    setSyncResult(null);
    try {
      const fn = provider === 'google_business_profile' ? 'fetchGBPLocations' : 'syncChannelDestinations';
      const res = await base44.functions.invoke(fn, { connection_id: conn.id });
      const d = res?.data;
      if (d?.success) {
        setSyncResult({ ok: true, msg: `Found ${d.locations?.length || d.count || 0} destination(s)${d.auto_selected ? ` — auto-selected: ${d.auto_selected}` : ''}` });
      } else if (d?.locked || d?.too_soon) {
        setSyncResult({ ok: false, msg: 'Google is temporarily rate-limiting this sync. Please wait a few minutes and try again.' });
      } else {
        setSyncResult({ ok: false, msg: d?.error ? humanizeError(d.error) : 'Sync failed. Please try again.' });
      }
    } catch (err) {
      setSyncResult({ ok: false, msg: 'Could not reach sync service. Please try again.' });
    }
    setSyncing(false);
    onRefresh();
  };

  const handleTest = async () => {
    if (!conn) return;
    setTesting(true);
    setTestResult(null);
    await new Promise(r => setTimeout(r, 500));
    let ok = false;
    let msg = '';
    if (isExpired || conn.status === 'expired') {
      msg = meta.expiredHuman;
    } else if (conn.status === 'error') {
      msg = meta.errorHuman;
    } else if (!conn.selected_destination_id) {
      msg = 'No destination selected yet. Select a page, location, or channel first.';
    } else if (conn.status === 'ready') {
      ok = true;
      msg = `Connection is healthy. Publishing to "${conn.selected_destination_name}".`;
    } else {
      msg = 'Connection is not fully set up. Check the checklist above.';
    }
    setTestResult({ ok, msg });
    await writeLog({
      client_id: clientId, provider,
      event_type: ok ? 'oauth_connect' : 'oauth_error',
      ok,
      message: ok ? 'connection_test_success' : 'connection_test_failed',
      meta: { result: msg, status: conn?.status },
    });
    setTesting(false);
  };

  const isYouTube = provider === 'youtube';

  return (
    <div className={`rounded-2xl border ${conn && conn.status !== 'disconnected' ? meta.border : 'border-slate-800'} ${conn && conn.status !== 'disconnected' ? meta.activeBg : 'bg-slate-900/60'} p-4 space-y-3 flex flex-col`}>

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{meta.icon}</span>
          <div>
            <p className={`text-sm font-bold ${meta.color}`}>{meta.label}</p>
            {conn?.external_account_name && (
              <p className="text-xs text-slate-400 mt-0.5">{conn.external_account_name}</p>
            )}
          </div>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${humanStatus.badge}`}>
          {humanStatus.label}
        </span>
      </div>

      {/* Selected destination */}
      {conn?.selected_destination_name && (
        <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2">
          <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-slate-500">Publishing to</p>
            <p className="text-xs font-semibold text-white truncate">{conn.selected_destination_name}</p>
          </div>
        </div>
      )}

      {/* Token / sync metadata */}
      {conn && (
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
          {conn.expires_at && (
            <>
              <span className="text-slate-600">Token expires</span>
              <span className={isExpired ? 'text-red-400 font-semibold' : 'text-slate-400'}>
                {isExpired ? 'Expired' : new Date(conn.expires_at).toLocaleDateString()}
              </span>
            </>
          )}
          {conn.last_sync_at && (
            <>
              <span className="text-slate-600">Last sync</span>
              <span className="text-slate-400">{new Date(conn.last_sync_at).toLocaleDateString()}</span>
            </>
          )}
          {conn.last_successful_post_at && (
            <>
              <span className="text-slate-600">Last post</span>
              <span className="text-slate-400">{new Date(conn.last_successful_post_at).toLocaleDateString()}</span>
            </>
          )}
        </div>
      )}

      {/* Human-friendly error / guidance */}
      {errorMsg && (
        <div className="flex items-start gap-2 bg-amber-950/30 border border-amber-800/50 rounded-lg px-3 py-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300">{errorMsg}</p>
        </div>
      )}

      {/* YouTube not-implemented notice */}
      {isYouTube && conn && conn.status !== 'disconnected' && (
        <div className="flex items-start gap-2 bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2">
          <Info className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500">{meta.notImplemented}</p>
        </div>
      )}

      {/* Login hint when not connected */}
      {(!conn || conn.status === 'disconnected') && (
        <div className="flex items-start gap-2 bg-blue-950/20 border border-blue-900/30 rounded-lg px-3 py-2">
          <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-300">{meta.loginHint}</p>
        </div>
      )}

      {/* Destination picker */}
      {conn && (conn.status === 'connected_no_destination' || conn.status === 'connected' || conn.status === 'ready') && dests.length > 0 && (
        <div>
          <button
            onClick={() => setShowDests(p => !p)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            {destSelected ? 'Change Destination' : 'Select Destination'}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDests ? 'rotate-180' : ''}`} />
            <span className="text-slate-600">({dests.length})</span>
          </button>
          {showDests && (
            <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
              {dests.map(d => (
                <button
                  key={d.id}
                  onClick={() => handleSelectDest(d)}
                  disabled={selectingDest === d.id}
                  className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-colors disabled:opacity-60 ${
                    conn.selected_destination_id === d.id
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                  }`}
                >
                  <span className="font-semibold">{d.name}</span>
                  {d.account_name && <span className="text-slate-500 ml-1.5">({d.account_name})</span>}
                  {selectingDest === d.id && <span className="text-slate-400"> — saving…</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sync result */}
      {syncResult && (
        <p className={`text-xs px-2 py-1.5 rounded-lg ${syncResult.ok ? 'text-emerald-400 bg-emerald-950/30' : 'text-amber-400 bg-amber-950/20'}`}>
          {syncResult.ok ? '✓' : '⚠'} {syncResult.msg}
        </p>
      )}

      {/* Test result */}
      {testResult && (
        <p className={`text-xs px-2 py-1.5 rounded-lg ${testResult.ok ? 'text-emerald-400 bg-emerald-950/30' : 'text-amber-400 bg-amber-950/20'}`}>
          {testResult.ok ? '✓' : '⚠'} {testResult.msg}
        </p>
      )}

      {/* Checklist */}
      <SetupChecklist conn={conn} provider={provider} />

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 pt-1 mt-auto">
        {!conn || conn.status === 'disconnected' ? (
          <button
            onClick={handleConnect}
            className="flex-1 text-xs font-bold px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            Connect {meta.label}
          </button>
        ) : (
          <>
            {/* Reconnect */}
            <button
              onClick={handleConnect}
              className="text-xs font-semibold px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-300 rounded-lg transition-colors"
            >
              Reconnect
            </button>

            {/* Sync destinations for GBP / YouTube / Instagram */}
            {(provider === 'google_business_profile' || provider === 'youtube' || provider === 'instagram') && (
              <button
                onClick={handleSyncDests}
                disabled={syncing}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 disabled:opacity-40 text-slate-300 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing…' : 'Sync Destinations'}
              </button>
            )}

            {/* Select Destination shortcut for Facebook when dests exist but none selected */}
            {provider === 'facebook' && dests.length > 0 && !destSelected && (
              <button
                onClick={() => setShowDests(true)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <Users className="w-3 h-3" /> Select Page
              </button>
            )}

            {/* Test Connection */}
            <button
              onClick={handleTest}
              disabled={testing}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 disabled:opacity-40 text-slate-300 rounded-lg transition-colors"
            >
              <Zap className={`w-3 h-3 ${testing ? 'animate-pulse' : ''}`} />
              {testing ? 'Testing…' : 'Test Connection'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Error humanizer ──────────────────────────────────────────────────────────

function humanizeError(raw) {
  if (!raw) return 'An unexpected error occurred. Please try again.';
  const r = raw.toLowerCase();
  if (r.includes('quota') || r.includes('rate limit')) return 'Google is temporarily rate-limiting this connection. Please wait a few minutes and try again.';
  if (r.includes('token') || r.includes('401') || r.includes('unauthorized')) return 'Authorization expired or was revoked. Please reconnect.';
  if (r.includes('403') || r.includes('permission') || r.includes('forbidden')) return 'This account does not have permission to access the required resource.';
  if (r.includes('no locations') || r.includes('no accounts')) return 'No business profile locations found for this Google account.';
  if (r.includes('no pages') || r.includes('no facebook')) return 'No Facebook Pages found. Make sure you are logged in as the Page admin.';
  return 'Something went wrong. Please try reconnecting this platform.';
}

// ─── Client Row ───────────────────────────────────────────────────────────────

function ClientChannelRow({ client, connections, onConnect, onRefresh }) {
  const params = new URLSearchParams(window.location.search);
  const preClient = params.get('client') || '';
  const [expanded, setExpanded] = useState(!!preClient && preClient === client.id);

  const getConn = p => connections.find(c => c.client_id === client.id && c.provider === p);
  const allConns = PROVIDERS.map(p => getConn(p));
  const readyCount = allConns.filter(c => c?.status === 'ready').length;
  const issueCount = allConns.filter(c => c && ['expired', 'error'].includes(c.status)).length;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded(p => !p)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-800/20 transition-colors text-left"
      >
        <div>
          <p className="text-sm font-bold text-white">{client.business_name}</p>
          <p className="text-xs text-slate-500 mt-0.5">{[client.city, client.state].filter(Boolean).join(', ') || client.email || ''}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Status dots */}
          <div className="flex items-center gap-1">
            {PROVIDERS.map(p => {
              const conn = getConn(p);
              const dot = conn?.status === 'ready' ? 'bg-emerald-500' :
                          conn?.status === 'connected_no_destination' || conn?.status === 'connected' ? 'bg-amber-400' :
                          conn?.status === 'expired' ? 'bg-orange-500' :
                          conn?.status === 'error' ? 'bg-red-500' : 'bg-slate-700';
              return <span key={p} title={`${PROVIDER_META[p].label}: ${conn?.status || 'not connected'}`} className={`w-2.5 h-2.5 rounded-full ${dot}`} />;
            })}
          </div>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
            readyCount === 4 ? 'bg-emerald-900/40 text-emerald-400' :
            issueCount > 0 ? 'bg-red-900/30 text-red-400' :
            readyCount > 0 ? 'bg-amber-900/30 text-amber-400' : 'bg-slate-800 text-slate-500'
          }`}>
            {readyCount}/{PROVIDERS.length} ready
          </span>
          {expanded ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-slate-800 pt-4">
          {/* No-password banner */}
          <div className="flex items-start gap-2 bg-blue-950/20 border border-blue-900/30 rounded-xl px-4 py-3">
            <Link2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-300">
              <strong>No passwords required.</strong> Clients connect their own accounts securely via OAuth. Share the "Copy Client Setup Link" to let them connect without any help from you.
            </p>
          </div>

          {/* Copy link + client name */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm font-semibold text-white">{client.business_name} — Channel Setup</p>
            <CopySetupLink clientId={client.id} clientName={client.business_name} />
          </div>

          {/* Platform cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {PROVIDERS.map(p => (
              <PlatformCard
                key={p}
                provider={p}
                conn={getConn(p)}
                clientId={client.id}
                clientName={client.business_name}
                onConnect={onConnect}
                onRefresh={onRefresh}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ClientChannelSetup() {
  const [clients, setClients] = useState([]);
  const [connections, setConnections] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);

  const params = new URLSearchParams(window.location.search);
  const preClient = params.get('client') || '';

  useEffect(() => {
    loadAll();

    const oauthSuccess = params.get('oauth_success');
    const oauthError = params.get('oauth_error');
    const account = params.get('account');

    if (oauthSuccess) {
      window.history.replaceState({}, '', window.location.pathname + (preClient ? `?client=${preClient}` : ''));
      showNotice('success', `${oauthSuccess} connected${account ? ` as ${account}` : ''}. Now select a destination to complete setup.`);
      writeLog({ provider: oauthSuccess, event_type: 'oauth_connect', ok: true, message: 'oauth_connect_success', meta: { account } });
    } else if (oauthError) {
      window.history.replaceState({}, '', window.location.pathname + (preClient ? `?client=${preClient}` : ''));
      showNotice('error', humanizeError(oauthError));
      writeLog({ provider: '', event_type: 'oauth_error', ok: false, message: 'oauth_connect_failed', meta: { raw: oauthError } });
    }
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const [c, cn] = await Promise.all([
      base44.entities.Clients.filter({ archived: false }),
      base44.entities.ChannelConnection.list('-updated_date', 400),
    ]);
    setClients(c);
    setConnections(cn);
    setLoading(false);
  };

  const showNotice = (type, msg) => {
    setNotice({ type, msg });
    setTimeout(() => setNotice(null), 6000);
  };

  const handleConnect = async (provider, clientId, clientName) => {
    try {
      await writeLog({ client_id: clientId, provider, event_type: 'oauth_connect', ok: true, message: 'oauth_connect_started', meta: { clientName } });
      let res;
      if (provider === 'facebook' || provider === 'instagram') {
        res = await base44.functions.invoke('facebookOAuthStart', { client_id: clientId, client_name: clientName, enable_video: true });
      } else {
        res = await base44.functions.invoke('channelOAuthStart', { provider, client_id: clientId, client_name: clientName });
      }
      if (res?.data?.auth_url) {
        window.location.href = res.data.auth_url;
      } else {
        showNotice('error', 'Could not start the connection flow. Please try again.');
      }
    } catch {
      showNotice('error', 'Could not start the connection flow. Please try again.');
    }
  };

  const totalReady = connections.filter(c => c.status === 'ready').length;
  const totalIssues = connections.filter(c => ['expired', 'error'].includes(c.status)).length;

  const filtered = clients.filter(c =>
    (!search || c.business_name.toLowerCase().includes(search.toLowerCase())) &&
    (!preClient || c.id === preClient)
  );

  // When filtered to one client via ?client=, show client name prominently
  const singleClient = preClient ? clients.find(c => c.id === preClient) : null;

  return (
    <AgencyLayout>
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            {singleClient ? (
              <>
                <h1 className="text-xl font-bold text-white">{singleClient.business_name} — Channel Setup</h1>
                <p className="text-slate-500 text-sm mt-0.5">Connect this client's social accounts securely via OAuth — no passwords required</p>
              </>
            ) : (
              <>
                <h1 className="text-xl font-bold text-white">Client Channel Setup</h1>
                <p className="text-slate-500 text-sm mt-0.5">Guide clients through connecting their social accounts — no passwords needed</p>
              </>
            )}
          </div>
          <button onClick={loadAll} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Stats strip */}
        {!preClient && (
          <div className="flex gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-xl font-black text-emerald-400">{totalReady}</p>
                <p className="text-xs text-slate-500">Ready Channels</p>
              </div>
            </div>
            {totalIssues > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-xl font-black text-amber-400">{totalIssues}</p>
                  <p className="text-xs text-slate-500">Need Attention</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notice banner */}
        {notice && (
          <div className={`px-4 py-3 rounded-xl text-sm font-medium border flex items-start gap-2 ${
            notice.type === 'success'
              ? 'bg-emerald-900/30 border-emerald-700/60 text-emerald-300'
              : 'bg-red-900/20 border-red-800/60 text-red-300'
          }`}>
            {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
            {notice.msg}
          </div>
        )}

        {/* Search */}
        {!preClient && (
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search clients…"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        )}

        {/* Client rows */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-slate-900 rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <p className="text-slate-500 text-sm">No clients found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(client => (
              <ClientChannelRow
                key={client.id}
                client={client}
                connections={connections}
                onConnect={handleConnect}
                onRefresh={loadAll}
              />
            ))}
          </div>
        )}
      </div>
    </AgencyLayout>
  );
}
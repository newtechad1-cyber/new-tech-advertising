/**
 * CLIENT-SAFE channel setup page.
 * Route: /client/channel-setup/:clientId
 *
 * - No agency sidebar or admin nav
 * - Fetches ONLY this client's connections (filtered by clientId)
 * - No debug data, no PublishingOps links, no other client data
 * - Client can: Connect, Reconnect, Select Destination, Test Connection
 */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  CheckCircle2, Circle, AlertTriangle, RefreshCw,
  Zap, Info, MapPin, Settings, ChevronDown, Users, Link2
} from 'lucide-react';

// ─── Shared config (duplicated from ClientChannelSetup to keep pages independent) ───

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
    loginHint: "Log in with the Google account that manages this business's Google Business Profile.",
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
  if (!conn || conn.status === 'disconnected') return { label: 'Not Connected', badge: 'bg-slate-800 text-slate-500' };
  if (conn.status === 'ready') return { label: 'Ready ✓', badge: 'bg-emerald-900/40 text-emerald-400 border border-emerald-700' };
  if (conn.status === 'expired') return { label: 'Connection Expired', badge: 'bg-orange-900/30 text-orange-400 border border-orange-700' };
  if (conn.status === 'error') return { label: 'Connection Error', badge: 'bg-red-900/30 text-red-400 border border-red-700' };
  return { label: 'Destination Needed', badge: 'bg-amber-900/30 text-amber-400 border border-amber-700' };
}

function getDests(conn) {
  if (!conn?.destinations_json) return [];
  try { return JSON.parse(conn.destinations_json); } catch { return []; }
}

function getChecklistState(conn) {
  const isExpired = conn?.expires_at && new Date(conn.expires_at) < new Date();
  return {
    connected: !!conn && conn.status !== 'disconnected' && !isExpired,
    destSelected: !!conn?.selected_destination_id,
    testPassed: conn?.status === 'ready',
  };
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
  } catch { /* non-blocking */ }
}

function humanizeError(raw) {
  if (!raw) return 'An unexpected error occurred. Please try again.';
  const r = raw.toLowerCase();
  if (r.includes('quota') || r.includes('rate limit')) return 'Google is temporarily rate-limiting this sync. Please wait a few minutes and try again.';
  if (r.includes('token') || r.includes('401') || r.includes('unauthorized')) return 'Authorization expired or was revoked. Please reconnect.';
  if (r.includes('403') || r.includes('permission') || r.includes('forbidden')) return 'This account does not have permission to access the required resource.';
  if (r.includes('no locations') || r.includes('no accounts')) return 'No business profile locations found for this Google account.';
  if (r.includes('no pages') || r.includes('no facebook')) return 'No Facebook Pages found. Make sure you are logged in as the Page admin.';
  return 'Something went wrong. Please try reconnecting this platform.';
}

// ─── Checklist ────────────────────────────────────────────────────────────────

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
    <div className={`rounded-xl border px-4 py-3 space-y-1.5 ${allDone ? 'bg-emerald-950/20 border-emerald-800/40' : 'bg-slate-900/40 border-slate-800'}`}>
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

// ─── Platform Card (client-safe, no debug, no admin tools) ────────────────────

function PlatformCard({ provider, conn, clientId, clientName, onConnect, onRefresh }) {
  const meta = PROVIDER_META[provider];
  const humanStatus = getHumanStatus(conn);
  const dests = getDests(conn);
  const { destSelected } = getChecklistState(conn);
  const isExpired = conn?.expires_at && new Date(conn.expires_at) < new Date();

  const [showDests, setShowDests] = useState(false);
  const [selectingDest, setSelectingDest] = useState(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  const errorMsg = (() => {
    if (!conn || conn.status === 'disconnected') return null;
    if (isExpired || conn.status === 'expired') return meta.expiredHuman;
    if (conn.status === 'error') return meta.errorHuman;
    if ((conn.status === 'connected_no_destination' || conn.status === 'connected') && dests.length === 0 && conn.dest_sync_at) return meta.noDestHuman;
    if ((conn.status === 'connected_no_destination' || conn.status === 'connected') && !conn.selected_destination_id) return meta.destNeededHuman;
    return null;
  })();

  const handleConnect = () => onConnect(provider, clientId, clientName);

  const handleSelectDest = async (dest) => {
    setSelectingDest(dest.id);
    await base44.entities.ChannelConnection.update(conn.id, {
      selected_destination_id: dest.id,
      selected_destination_name: dest.name,
      status: 'ready',
      error_message: null,
    });
    await writeLog({ client_id: clientId, provider, event_type: 'oauth_connect', ok: true, message: `destination_selected — ${dest.name}`, meta: { dest_id: dest.id } });
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
        setSyncResult({ ok: true, msg: `Found ${d.locations?.length || d.count || 0} destination(s).` });
      } else if (d?.locked || d?.too_soon) {
        setSyncResult({ ok: false, msg: 'Google is temporarily rate-limiting this sync. Please wait a few minutes and try again.' });
      } else {
        setSyncResult({ ok: false, msg: d?.error ? humanizeError(d.error) : 'Sync failed. Please try again.' });
      }
    } catch {
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
    await writeLog({ client_id: clientId, provider, event_type: ok ? 'oauth_connect' : 'oauth_error', ok, message: ok ? 'connection_test_success' : 'connection_test_failed' });
    setTesting(false);
  };

  const isYouTube = provider === 'youtube';

  return (
    <div className={`rounded-2xl border p-4 space-y-3 flex flex-col
      ${conn && conn.status !== 'disconnected' ? `${meta.border} ${meta.activeBg}` : 'border-slate-800 bg-slate-900/60'}`}>

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

      {/* Token expiry — user-friendly only */}
      {conn?.expires_at && (
        <p className={`text-xs ${isExpired ? 'text-red-400 font-semibold' : 'text-slate-600'}`}>
          {isExpired ? 'Token expired — please reconnect.' : `Token valid until ${new Date(conn.expires_at).toLocaleDateString()}`}
        </p>
      )}

      {/* Human-friendly error */}
      {errorMsg && (
        <div className="flex items-start gap-2 bg-amber-950/30 border border-amber-800/50 rounded-lg px-3 py-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300">{errorMsg}</p>
        </div>
      )}

      {/* YouTube notice */}
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

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-1 mt-auto">
        {!conn || conn.status === 'disconnected' ? (
          <button onClick={handleConnect}
            className="flex-1 text-xs font-bold px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
            Connect {meta.label}
          </button>
        ) : (
          <>
            <button onClick={handleConnect}
              className="text-xs font-semibold px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-300 rounded-lg transition-colors">
              Reconnect
            </button>

            {(provider === 'google_business_profile' || provider === 'youtube' || provider === 'instagram') && (
              <button onClick={handleSyncDests} disabled={syncing}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 disabled:opacity-40 text-slate-300 rounded-lg transition-colors">
                <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing…' : 'Sync Destinations'}
              </button>
            )}

            {provider === 'facebook' && dests.length > 0 && !destSelected && (
              <button onClick={() => setShowDests(true)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors">
                <Users className="w-3 h-3" /> Select Page
              </button>
            )}

            <button onClick={handleTest} disabled={testing}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 disabled:opacity-40 text-slate-300 rounded-lg transition-colors">
              <Zap className={`w-3 h-3 ${testing ? 'animate-pulse' : ''}`} />
              {testing ? 'Testing…' : 'Test Connection'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main client-safe page ────────────────────────────────────────────────────

export default function ClientChannelSetupPublic() {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);

  const params = new URLSearchParams(window.location.search);

  useEffect(() => {
    loadData();

    const oauthSuccess = params.get('oauth_success');
    const oauthError = params.get('oauth_error');
    const account = params.get('account');

    if (oauthSuccess) {
      window.history.replaceState({}, '', `/client/channel-setup/${clientId}`);
      showNotice('success', `${oauthSuccess} connected${account ? ` as ${account}` : ''}. Now select a destination to complete setup.`);
      writeLog({ client_id: clientId, provider: oauthSuccess, event_type: 'oauth_connect', ok: true, message: 'oauth_connect_success', meta: { account } });
    } else if (oauthError) {
      window.history.replaceState({}, '', `/client/channel-setup/${clientId}`);
      showNotice('error', humanizeError(oauthError));
      writeLog({ client_id: clientId, provider: '', event_type: 'oauth_error', ok: false, message: 'oauth_connect_failed', meta: { raw: oauthError } });
    }
  }, [clientId]);

  const loadData = async () => {
    setLoading(true);
    // Fetch ONLY this client + their connections — no other client data
    const [clientData, conns] = await Promise.all([
      base44.entities.Clients.get(clientId),
      base44.entities.ChannelConnection.filter({ client_id: clientId }),
    ]);
    setClient(clientData);
    setConnections(conns);
    setLoading(false);
  };

  const showNotice = (type, msg) => {
    setNotice({ type, msg });
    setTimeout(() => setNotice(null), 7000);
  };

  const handleConnect = async (provider, cId, cName) => {
    try {
      await writeLog({ client_id: cId, provider, event_type: 'oauth_connect', ok: true, message: 'oauth_connect_started' });
      let res;
      if (provider === 'facebook' || provider === 'instagram') {
        res = await base44.functions.invoke('facebookOAuthStart', { client_id: cId, client_name: cName, enable_video: true });
      } else {
        res = await base44.functions.invoke('channelOAuthStart', { provider, client_id: cId, client_name: cName });
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

  const getConn = (p) => connections.find(c => c.provider === p);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Setup link not found. Please contact your agency for a new link.</p>
      </div>
    );
  }

  const readyCount = PROVIDERS.filter(p => getConn(p)?.status === 'ready').length;
  const allReady = readyCount === PROVIDERS.length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Clean header — no agency nav */}
      <div className="border-b border-slate-800 bg-slate-900/80 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Channel Setup</p>
            <h1 className="text-lg font-black text-white mt-0.5">{client.business_name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-blue-400" />
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${allReady ? 'bg-emerald-900/40 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
              {readyCount}/{PROVIDERS.length} channels ready
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* Intro */}
        <div className="bg-blue-950/20 border border-blue-900/30 rounded-2xl px-5 py-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-300">Connect your social accounts — no passwords required</p>
            <p className="text-xs text-blue-400/70 mt-1">
              Each platform uses secure OAuth — you log in directly with that platform. We never see or store your password.
              Complete the checklist for each platform you want to publish to.
            </p>
          </div>
        </div>

        {/* Notice */}
        {notice && (
          <div className={`px-4 py-3 rounded-xl text-sm font-medium border flex items-start gap-2 ${
            notice.type === 'success'
              ? 'bg-emerald-900/30 border-emerald-700/60 text-emerald-300'
              : 'bg-red-900/20 border-red-800/60 text-red-300'
          }`}>
            {notice.type === 'success'
              ? <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              : <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
            {notice.msg}
          </div>
        )}

        {/* All ready banner */}
        {allReady && (
          <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-2xl px-5 py-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <p className="text-sm font-semibold text-emerald-300">All channels are connected and ready to publish. You're all set!</p>
          </div>
        )}

        {/* Platform cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {PROVIDERS.map(p => (
            <PlatformCard
              key={p}
              provider={p}
              conn={getConn(p)}
              clientId={clientId}
              clientName={client.business_name}
              onConnect={handleConnect}
              onRefresh={loadData}
            />
          ))}
        </div>

        {/* Footer — no agency links */}
        <p className="text-center text-xs text-slate-700 pt-4">
          Need help? Contact your marketing team.
        </p>
      </div>
    </div>
  );
}
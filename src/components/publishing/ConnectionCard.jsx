import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, Unlink, Settings, ChevronDown, Star, MapPin, Circle, Clock, Users } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import FacebookPageSelectModal from './FacebookPageSelectModal';

const PROVIDER_CONFIG = {
  google_business_profile: { label: 'Google Business Profile', icon: '📍', color: 'text-blue-400', border: 'border-blue-800' },
  youtube:                  { label: 'YouTube Channel',         icon: '▶️', color: 'text-red-400',  border: 'border-red-800' },
  facebook:                 { label: 'Facebook Page',           icon: '👥', color: 'text-blue-500', border: 'border-blue-700' },
  instagram:                { label: 'Instagram',               icon: '📸', color: 'text-pink-400', border: 'border-pink-800' },
};

const STATUS_BADGE = {
  ready:                    'bg-emerald-900/40 text-emerald-400 border-emerald-700',
  connected:                'bg-blue-900/40 text-blue-400 border-blue-700',
  connected_no_destination: 'bg-amber-900/40 text-amber-400 border-amber-700',
  expired:                  'bg-amber-900/40 text-amber-400 border-amber-700',
  error:                    'bg-red-900/40 text-red-400 border-red-700',
  disconnected:             'bg-slate-800 text-slate-500 border-slate-700',
};

const REQUIRES_DESTINATION = ['google_business_profile', 'youtube', 'facebook', 'instagram'];

export default function ConnectionCard({ provider, connection, clientId, clientName, onConnect, onRefresh }) {
  const [showDests, setShowDests] = useState(false);
  const [refreshingLocations, setRefreshingLocations] = useState(false);
  const [refreshResult, setRefreshResult] = useState(null);
  const [disconnecting, setDisconnecting] = useState(false);
  const [settingDefault, setSettingDefault] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [selectingDest, setSelectingDest] = useState(null);
  const [showFBPageModal, setShowFBPageModal] = useState(false);
  const [syncingDests, setSyncingDests] = useState(false);
  const [syncDestResult, setSyncDestResult] = useState(null);

  const cfg = PROVIDER_CONFIG[provider];
  const conn = connection;
  const status = conn?.status || 'disconnected';
  const isGBP = provider === 'google_business_profile';
  const isFacebook = provider === 'facebook';
  const isYouTube = provider === 'youtube';
  const isInstagram = provider === 'instagram';
  const needsDest = REQUIRES_DESTINATION.includes(provider);

  // Parse stored destinations (written by fetchGBPLocations or OAuth callback)
  const storedDestinations = (() => {
    if (!conn?.destinations_json) return [];
    try { return JSON.parse(conn.destinations_json); } catch { return []; }
  })();

  // Parse GBP diagnostic JSON
  const diag = (() => {
    if (!conn?.gbp_diag_json) return null;
    try { return JSON.parse(conn.gbp_diag_json); } catch { return null; }
  })();

  const hasDestination = !!conn?.selected_destination_id;
  const destSyncCount = conn?.dest_sync_count ?? storedDestinations.length;
  const destSyncAt = conn?.dest_sync_at || conn?.last_sync_at;
  const destSyncError = conn?.dest_sync_error;
  const lastSuccess = conn?.dest_sync_last_success;
  const lastQuotaError = conn?.dest_sync_last_quota_error;

  // Cooldown state
  const cooldownUntil = conn?.dest_sync_cooldown_until ? new Date(conn.dest_sync_cooldown_until) : null;
  const inCooldown = cooldownUntil && cooldownUntil > new Date();
  const cooldownMinsLeft = inCooldown ? Math.ceil((cooldownUntil - Date.now()) / 60000) : 0;

  // Whether we're showing cached (stale) destinations during an error
  const isCached = storedDestinations.length > 0 && !!destSyncError;

  // Show GBP diag panel when: error/connected state, synced at least once, no locations found
  const showDiagPanel = isGBP && conn && (status === 'connected' || status === 'error' || status === 'connected_no_destination') && destSyncAt && storedDestinations.length === 0;

  // Refresh GBP locations
  const handleRefreshLocations = async (force = false) => {
    if (!conn || (inCooldown && !force)) return;
    setRefreshingLocations(true);
    setRefreshResult(null);
    try {
      const res = await base44.functions.invoke('fetchGBPLocations', { connection_id: conn.id, force });
      const d = res?.data;
      if (d?.success) {
        setRefreshResult({ ok: true, msg: `Found ${d.locations?.length || 0} location${d.locations?.length !== 1 ? 's' : ''}${d.auto_selected ? ` — auto-selected: ${d.auto_selected}` : ''}` });
        if (d.locations?.length > 0) setShowDests(true);
      } else if (d?.cooldown) {
        setRefreshResult({ ok: false, cooldown: true, msg: d.error });
      } else {
        setRefreshResult({ ok: false, msg: d?.error || 'Location sync failed' });
      }
      onRefresh();
    } catch (err) {
      setRefreshResult({ ok: false, msg: err.message });
    }
    setRefreshingLocations(false);
  };

  const handleSelectDestination = async (dest) => {
    if (!conn) return;
    setSelectingDest(dest.id);
    await base44.entities.ChannelConnection.update(conn.id, {
      selected_destination_id: dest.id,
      selected_destination_name: dest.name,
      status: 'ready',
      error_message: null,
    });
    await base44.asServiceRole?.entities?.PostingLog?.create?.({
      client_id: conn.client_id,
      provider: conn.provider,
      event_type: 'oauth_connect',
      event_time: new Date().toISOString(),
      status: 'success',
      message: `destination_selected — ${dest.name} (${dest.id}) → channel_ready`,
    }).catch(() => {});
    onRefresh();
    setSelectingDest(null);
    setShowDests(false);
  };

  const handleSyncDestinations = async () => {
    if (!conn) return;
    setSyncingDests(true);
    setSyncDestResult(null);
    try {
      const res = await base44.functions.invoke('syncChannelDestinations', { connection_id: conn.id });
      const d = res?.data;
      if (d?.success) {
        setSyncDestResult({ ok: true, msg: `Found ${d.count || 0} destination${d.count !== 1 ? 's' : ''}${d.auto_selected ? ` — auto-selected: ${d.auto_selected}` : ''}` });
        if (d.count > 0) setShowDests(true);
      } else {
        setSyncDestResult({ ok: false, msg: d?.error || 'Sync failed' });
      }
      onRefresh();
    } catch (err) {
      setSyncDestResult({ ok: false, msg: err.message });
    }
    setSyncingDests(false);
  };

  const handleConnectFacebook = async () => {
    try {
      const res = await base44.functions.invoke('facebookOAuthStart', {
        client_id: clientId,
        client_name: clientName,
        enable_video: true,
      });
      if (res?.data?.auth_url) {
        window.location.href = res.data.auth_url;
      }
    } catch (err) {
      console.error('[ConnectionCard] facebookOAuthStart failed:', err.message);
    }
  };

  const handleDisconnect = async () => {
    if (!conn) return;
    setDisconnecting(true);
    await base44.entities.ChannelConnection.update(conn.id, {
      status: 'disconnected', access_token: null, refresh_token: null,
      selected_destination_id: null, selected_destination_name: null,
    });
    onRefresh();
    setDisconnecting(false);
  };

  const handleSetDefault = async () => {
    if (!conn) return;
    setSettingDefault(true);
    await base44.entities.ChannelConnection.update(conn.id, { is_default: true });
    onRefresh();
    setSettingDefault(false);
  };

  const badgeLabel = (() => {
    if (!conn || status === 'disconnected') return 'Not Connected';
    if (status === 'ready') return '✓ Ready';
    if (status === 'connected_no_destination') return '⚠ Destination Required';
    if (status === 'connected') return '⚠ Destination Required';
    if (status === 'expired') return 'Expired';
    if (status === 'error') return 'Error';
    return status;
  })();
  const badgeClass = STATUS_BADGE[status] || STATUS_BADGE.disconnected;

  return (
    <div className={`bg-slate-900 border ${conn ? cfg.border : 'border-slate-800'} rounded-xl p-4 space-y-3`}>

      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{cfg.icon}</span>
          <div>
            <p className={`text-sm font-bold ${cfg.color}`}>{cfg.label}</p>
            {conn?.external_account_name && (
              <p className="text-xs text-slate-400">{conn.external_account_name}</p>
            )}
          </div>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${badgeClass}`}>
          {badgeLabel}
        </span>
      </div>

      {/* Selected destination */}
      {conn?.selected_destination_name && (
        <div className="bg-slate-800/50 rounded-lg px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Publishing to</p>
              <p className="text-xs font-semibold text-white truncate">{conn.selected_destination_name}</p>
            </div>
          </div>
          {conn.is_default && <span className="text-xs text-amber-400 font-bold flex-shrink-0">★ Default</span>}
        </div>
      )}

      {/* Destination Required warning */}
      {conn && (status === 'connected_no_destination' || (status === 'connected' && needsDest && !hasDestination)) && (
        <div className="flex items-start gap-1.5 bg-amber-900/20 border border-amber-800 rounded-lg px-3 py-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-amber-400">Destination Required</p>
            <p className="text-xs text-amber-600">
              {isFacebook
                      ? storedDestinations.length > 0
                        ? `${storedDestinations.length} Page${storedDestinations.length !== 1 ? 's' : ''} available — select a Page to enable publishing`
                        : 'No Facebook Pages found. Reconnect to retry.'
                      : isInstagram
                      ? storedDestinations.length > 0
                        ? `${storedDestinations.length} Instagram account${storedDestinations.length !== 1 ? 's' : ''} available — select one below`
                        : 'No Instagram Business accounts found. Use Sync Destinations or reconnect.'
                      : isYouTube
                      ? storedDestinations.length > 0
                        ? `${storedDestinations.length} channel${storedDestinations.length !== 1 ? 's' : ''} available — select one below`
                        : 'No YouTube channels found. Use Sync Destinations or reconnect.'
                      : storedDestinations.length > 0
                        ? `${storedDestinations.length} location${storedDestinations.length !== 1 ? 's' : ''} available — select one below`
                        : 'No locations loaded yet. Use Refresh Locations below.'}
            </p>
            {isFacebook && storedDestinations.length > 0 && (
              <button
                onClick={() => setShowFBPageModal(true)}
                className="mt-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 underline underline-offset-2">
                Select a Page →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Cached destinations stale notice */}
      {isCached && (
        <div className="flex items-center gap-1.5 bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2">
          <Clock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <p className="text-xs text-slate-500">
            Showing {storedDestinations.length} cached location{storedDestinations.length !== 1 ? 's' : ''} from last successful sync
            {lastSuccess ? ` (${new Date(lastSuccess).toLocaleDateString()})` : ''}
          </p>
        </div>
      )}

      {/* Cooldown banner */}
      {inCooldown && (
        <div className="flex items-start gap-2 bg-amber-900/20 border border-amber-800 rounded-lg px-3 py-2">
          <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-400">Google temporarily rate-limited this project</p>
            <p className="text-xs text-amber-600">Try again in ~{cooldownMinsLeft} minute{cooldownMinsLeft !== 1 ? 's' : ''}.</p>
          </div>
        </div>
      )}

      {/* GBP Diagnostic panel (only when no stored destinations) */}
      {showDiagPanel && (
        <GBPDiagPanel
          diag={diag}
          syncError={destSyncError}
          syncAt={destSyncAt}
          onReconnect={() => onConnect(provider)}
        />
      )}

      {/* Sync destinations result feedback */}
      {syncDestResult && (
        <div className={`text-xs px-3 py-2 rounded-lg border ${
          syncDestResult.ok ? 'bg-emerald-900/30 border-emerald-700 text-emerald-300' : 'bg-red-900/20 border-red-800 text-red-300'
        }`}>
          {syncDestResult.msg}
        </div>
      )}

      {/* Refresh result feedback */}
      {refreshResult && (
        <div className={`text-xs px-3 py-2 rounded-lg border ${
          refreshResult.ok      ? 'bg-emerald-900/30 border-emerald-700 text-emerald-300' :
          refreshResult.cooldown? 'bg-amber-900/20 border-amber-800 text-amber-300' :
                                  'bg-red-900/20 border-red-800 text-red-300'
        }`}>
          {refreshResult.msg}
        </div>
      )}

      {/* Meta info */}
      {conn && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          {conn.last_successful_post_at && (
            <div>
              <p className="text-slate-600">Last Post</p>
              <p className="text-slate-400">{new Date(conn.last_successful_post_at).toLocaleDateString()}</p>
            </div>
          )}
          {conn.expires_at && (
            <div>
              <p className="text-slate-600">Token Expires</p>
              <p className={`font-medium ${new Date(conn.expires_at) < new Date() ? 'text-red-400' : 'text-slate-400'}`}>
                {new Date(conn.expires_at).toLocaleDateString()}
              </p>
            </div>
          )}
          {destSyncAt && (
            <div>
              <p className="text-slate-600">Last Sync Attempt</p>
              <p className="text-slate-400">{new Date(destSyncAt).toLocaleDateString()}</p>
            </div>
          )}
          {lastSuccess && (
            <div>
              <p className="text-slate-600">Last Successful Sync</p>
              <p className="text-emerald-600">{new Date(lastSuccess).toLocaleDateString()}</p>
            </div>
          )}
          {needsDest && (
            <div>
              <p className="text-slate-600">Locations</p>
              <p className={`font-medium ${storedDestinations.length === 0 && destSyncAt ? 'text-amber-400' : 'text-slate-400'}`}>
                {destSyncAt ? `${storedDestinations.length} cached` : 'Not synced'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Destination selector — shown when we have stored destinations and need one or already have one (allow change) */}
      {conn && (status === 'connected_no_destination' || status === 'connected' || status === 'ready') && needsDest && storedDestinations.length > 0 && (
        <div>
          <button
            onClick={() => setShowDests(p => !p)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            {hasDestination ? 'Change Destination' : 'Select Destination'}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDests ? 'rotate-180' : ''}`} />
            <span className="text-slate-600">({storedDestinations.length})</span>
          </button>
          {showDests && (
            <div className="mt-2 space-y-1 max-h-36 overflow-y-auto">
              {storedDestinations.map(d => (
                <button
                  key={d.id}
                  onClick={() => handleSelectDestination(d)}
                  disabled={selectingDest === d.id}
                  className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-colors disabled:opacity-60 ${
                    conn.selected_destination_id === d.id
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                  }`}
                >
                  <span className="font-semibold">{d.name}</span>
                  {d.account_name && <span className="text-slate-500 ml-2">({d.account_name})</span>}
                  {selectingDest === d.id && ' — saving…'}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 flex-wrap pt-1">
        {!conn || status === 'disconnected' ? (
          <button
            onClick={() => isFacebook ? handleConnectFacebook() : onConnect(provider)}
            className="flex-1 text-xs font-semibold px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
            {isFacebook ? '👥 Connect Facebook' : 'Connect'}
          </button>
        ) : (
          <>
            {/* GBP: Refresh Locations */}
            {isGBP && (
              <button
                onClick={() => handleRefreshLocations(false)}
                disabled={refreshingLocations || inCooldown}
                title={inCooldown ? `Cooling down — retry in ~${cooldownMinsLeft} min` : 'Refresh GBP locations'}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-blue-700 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors">
                <RefreshCw className={`w-3.5 h-3.5 ${refreshingLocations ? 'animate-spin' : ''}`} />
                {refreshingLocations ? 'Syncing…' : inCooldown ? `Cooldown (~${cooldownMinsLeft}m)` : 'Refresh Locations'}
              </button>
            )}

            {/* YouTube / Instagram: Sync Destinations */}
            {(isYouTube || isInstagram) && (
              <button
                onClick={handleSyncDestinations}
                disabled={syncingDests}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-blue-700 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors">
                <RefreshCw className={`w-3.5 h-3.5 ${syncingDests ? 'animate-spin' : ''}`} />
                {syncingDests ? 'Syncing…' : 'Sync Destinations'}
              </button>
            )}

            {/* Facebook: Select Page button when no destination */}
            {isFacebook && !hasDestination && storedDestinations.length > 0 && (
              <button
                onClick={() => setShowFBPageModal(true)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors">
                <Users className="w-3.5 h-3.5" />
                Select Page
              </button>
            )}

            {/* Facebook: Change page when destination is set */}
            {isFacebook && hasDestination && storedDestinations.length > 1 && (
              <button
                onClick={() => setShowFBPageModal(true)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-300 rounded-lg transition-colors">
                <Users className="w-3.5 h-3.5" />
                Change Page
              </button>
            )}

            {conn.selected_destination_id && !conn.is_default && (
              <button onClick={handleSetDefault} disabled={settingDefault}
                className="text-xs font-semibold px-3 py-2 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-800 text-amber-400 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5" />
                {settingDefault ? 'Saving…' : 'Set Default'}
              </button>
            )}

            <button
              onClick={() => isFacebook ? handleConnectFacebook() : onConnect(provider)}
              className="text-xs font-semibold px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg transition-colors">
              {status === 'error' || status === 'expired' ? 'Reconnect' : 'Reconnect'}
            </button>

            <button onClick={handleDisconnect} disabled={disconnecting}
              className="text-xs font-semibold px-3 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-800 text-red-400 rounded-lg transition-colors disabled:opacity-50">
              {disconnecting ? '...' : <Unlink className="w-3.5 h-3.5" />}
            </button>
          </>
        )}
      </div>

      {/* Facebook Page Select Modal */}
      {showFBPageModal && conn && (
        <FacebookPageSelectModal
          connection={conn}
          onSaved={(page) => {
            setShowFBPageModal(false);
            onRefresh();
          }}
          onClose={() => setShowFBPageModal(false)}
        />
      )}

      {/* Debug toggle */}
      {conn && (
        <button onClick={() => setShowDebug(p => !p)}
          className="text-xs text-slate-700 hover:text-slate-500 transition-colors w-full text-left pt-1">
          {showDebug ? '▲ Hide debug' : '▼ Debug info'}
        </button>
      )}

      {/* Debug panel */}
      {showDebug && conn && (
        <div className="bg-slate-950 border border-slate-700 rounded-lg p-3 space-y-1 text-xs font-mono">
          <DebugRow label="conn_id" value={conn.id} />
          <DebugRow label="provider" value={conn.provider} highlight />
          <DebugRow label="status" value={conn.status} highlight />
          <DebugRow label="account_email" value={conn.external_account_name || '—'} />
          <DebugRow label="dest_id" value={conn.selected_destination_id || '(none)'} />
          <DebugRow label="dest_name" value={conn.selected_destination_name || '(none)'} />
          <DebugRow label="cached_dests" value={`${storedDestinations.length} stored`} />
          <DebugRow label="dest_sync_at" value={destSyncAt ? new Date(destSyncAt).toLocaleString() : '—'} />
          <DebugRow label="last_success" value={lastSuccess ? new Date(lastSuccess).toLocaleString() : '—'} />
          <DebugRow label="last_quota_err" value={lastQuotaError ? new Date(lastQuotaError).toLocaleString() : '—'} />
          <DebugRow label="cooldown_until" value={cooldownUntil ? cooldownUntil.toLocaleString() : '—'} highlight={inCooldown} />
          <DebugRow label="in_cooldown" value={String(inCooldown)} highlight={inCooldown} />
          <DebugRow label="dest_sync_error" value={destSyncError || '—'} />
          <DebugRow label="is_default" value={String(!!conn.is_default)} />
          <DebugRow label="token_expires" value={conn.expires_at || '—'} />
          {storedDestinations.slice(0, 3).map((d, i) => (
            <DebugRow key={i} label={`  dest[${i}]`} value={`${d.name} — ${d.id}`} />
          ))}
          {diag && <DebugRow label="diag_diagnosis" value={diag.final_diagnosis || '—'} highlight />}
          {diag && <DebugRow label="step_outcome" value={diag.step_outcome || diag.step || '—'} highlight />}
          {diag && <DebugRow label="token_refresh" value={diag.token_refresh_attempted ? (diag.token_refresh_succeeded ? '✓ succeeded' : '✗ failed') : 'not attempted'} />}
          {diag && <DebugRow label="diag_accts" value={String(diag.accounts_returned ?? '—')} />}
          {diag && <DebugRow label="diag_locs" value={String(diag.locations_returned ?? '—')} />}
          {diag?.account_api_raw_body && <DebugRow label="raw_body" value={diag.account_api_raw_body.slice(0, 120)} />}
          {/* Force retry from debug mode */}
          {isGBP && conn && status === 'connected' && (
            <button
              onClick={() => handleRefreshLocations(true)}
              disabled={refreshingLocations}
              className="mt-2 w-full text-xs font-bold text-amber-400 bg-amber-900/20 hover:bg-amber-900/40 border border-amber-800 rounded px-2 py-1.5 disabled:opacity-50">
              ⚡ Force Refresh (bypass cooldown)
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function DebugRow({ label, value, highlight }) {
  return (
    <div className="flex gap-2">
      <span className="text-slate-600 w-36 flex-shrink-0">{label}</span>
      <span className={`break-all ${highlight ? 'text-amber-300' : 'text-slate-300'}`}>{value}</span>
    </div>
  );
}

// ── GBP Diagnostic Panel ──────────────────────────────────────────────────────

// Maps every possible final_diagnosis to { title, color, detail, needsReconnect, isQuota }
const DIAGNOSIS_CONFIG = {
  // Token/auth
  oauth_token_missing:       { color: 'text-red-400',    title: 'No access token stored',              detail: 'OAuth must be re-done to generate a new access token.',                                                              needsReconnect: true },
  token_refresh_failed:      { color: 'text-red-400',    title: 'Google connection needs to be refreshed', detail: 'Token refresh failed — the stored refresh token was rejected.',                                                 needsReconnect: true },
  missing_refresh_token:     { color: 'text-red-400',    title: 'Google connection needs to be refreshed', detail: 'No refresh token is stored. Reconnect Google to grant offline access.',                                        needsReconnect: true },
  token_expired:             { color: 'text-red-400',    title: 'Google connection needs to be refreshed', detail: 'Access token was rejected by Google (401). The token may have been revoked.',                                  needsReconnect: true },
  auth_failed:               { color: 'text-red-400',    title: 'Google connection needs to be refreshed', detail: 'OAuth token was rejected. Reconnect to re-authorize.',                                                         needsReconnect: true },
  // Quota
  provider_quota_failure:    { color: 'text-amber-400',  title: 'Google API quota exceeded',           detail: 'This Google Cloud project is being rate-limited. Check Quotas in Cloud Console → APIs & Services.',               isQuota: true },
  // API disabled
  provider_api_disabled:     { color: 'text-red-400',    title: 'Google API not enabled',               detail: 'My Business Account Management API must be enabled in Google Cloud Console for this project.' },
  // Permission
  provider_permission_failure:{ color: 'text-amber-400', title: 'Permission denied',                   detail: 'This Google account lacks permission to access the Business Profile API. Check scopes.' },
  // Accounts
  no_accounts_returned:      { color: 'text-amber-400',  title: 'No Business Profile accounts found',  detail: 'The connected Google account has no accessible Business Profile accounts.' },
  // Locations
  locations_api_errors:      { color: 'text-red-400',    title: 'Locations API errors',                detail: 'All location fetch requests failed — see step trace for per-account details.' },
  no_locations_returned:     { color: 'text-amber-400',  title: 'No locations found',                  detail: 'Account(s) were found but returned zero locations. The account may have no verified listings.' },
  // Misc
  network_error:             { color: 'text-red-400',    title: 'Network error',                       detail: 'Could not reach Google APIs — check connectivity.' },
  normalization_failure:     { color: 'text-red-400',    title: 'Response parse error',                detail: 'Google returned a non-JSON or unexpected response.' },
  unknown_provider_error:    { color: 'text-amber-400',  title: 'Unclassified provider error',         detail: 'An unexpected error was returned by Google. See raw details in step trace.' },
  // Legacy keys from older diag objects
  no_token:                  { color: 'text-red-400',    title: 'No access token stored',              detail: 'OAuth must be re-done.',                                                                                           needsReconnect: true },
  api_disabled:              { color: 'text-red-400',    title: 'Google API not enabled',               detail: 'My Business Account Management API must be enabled in Google Cloud Console.' },
  no_permission:             { color: 'text-amber-400',  title: 'Permission denied',                   detail: 'This Google account lacks permission to access the Business Profile API.' },
  quota_exceeded:            { color: 'text-amber-400',  title: 'Google API quota exceeded',           detail: 'This project is being rate-limited. Check Cloud Console quotas.',                                                  isQuota: true },
  no_accounts:               { color: 'text-amber-400',  title: 'No Business Profile accounts found',  detail: 'The connected Google account has no accessible Business Profile accounts.' },
  locations_api_disabled:    { color: 'text-red-400',    title: 'Locations API not enabled',           detail: 'My Business Business Information API must be enabled in Google Cloud Console.' },
  locations_no_permission:   { color: 'text-amber-400',  title: 'Permission denied',                   detail: 'Token scope missing — business.manage required for reading locations.' },
  accounts_exist_no_locations:{ color: 'text-amber-400', title: 'No locations found',                  detail: 'Account(s) found but zero locations returned — may have no verified listings.' },
  success:                   { color: 'text-emerald-400', title: 'Sync succeeded',                     detail: '' },
};

function StepRow({ label, value, valueClass = 'text-slate-300' }) {
  return (
    <div className="flex items-start gap-2">
      <Circle className="w-3 h-3 text-slate-600 flex-shrink-0 mt-0.5" />
      <span className="text-slate-500 w-44 flex-shrink-0">{label}</span>
      <span className={`break-all text-xs ${valueClass}`}>{value}</span>
    </div>
  );
}

function GBPDiagPanel({ diag, syncError, syncAt, onReconnect }) {
  const [open, setOpen] = useState(false);
  const diagnosis = diag?.final_diagnosis;

  // Use human_message from diag if available (new format), fall back to DIAGNOSIS_CONFIG, fall back to syncError
  const cfg = DIAGNOSIS_CONFIG[diagnosis] || { color: 'text-slate-400', title: 'Destination sync failed', detail: '' };
  const displayDetail = diag?.human_message || cfg.detail || syncError || 'Unknown failure — enable step trace for details';

  const isQuota = cfg.isQuota;
  const needsReconnect = cfg.needsReconnect;

  // Step outcome (new diag format) or legacy step field
  const stepOutcome = diag?.step_outcome || diag?.step || '—';

  return (
    <div className={`border rounded-lg p-3 space-y-2 ${isQuota ? 'bg-amber-950/20 border-amber-800/60' : needsReconnect ? 'bg-red-950/20 border-red-900/60' : 'bg-slate-800/60 border-slate-700'}`}>

      {/* Classified error title */}
      <div className={`flex items-start gap-2 ${cfg.color}`}>
        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold">{cfg.title}</p>
          <p className="text-xs mt-0.5 opacity-80">{displayDetail}</p>
          {/* Step where it failed */}
          <p className="text-xs mt-1 text-slate-600">Step: <span className="text-slate-400 font-mono">{stepOutcome}</span>
            {diag?.account_api_http_status && <span className="ml-2">HTTP <span className={diag.account_api_http_status === 200 ? 'text-emerald-400' : 'text-red-400'}>{diag.account_api_http_status}</span></span>}
          </p>
        </div>
      </div>

      {/* Quota-specific guidance */}
      {isQuota && (
        <p className="text-xs text-amber-600">
          Cloud Console → APIs &amp; Services → Quotas → <code>mybusinessaccountmanagement.googleapis.com</code> → request increase.
        </p>
      )}

      {/* Token refresh summary */}
      {diag && (diag.token_refresh_attempted || diag.token_refresh_error) && (
        <div className="text-xs flex items-center gap-2 flex-wrap">
          <span className="text-slate-500">Token refresh:</span>
          {diag.token_refresh_attempted
            ? <span className={diag.token_refresh_succeeded ? 'text-emerald-400' : 'text-red-400'}>
                {diag.token_refresh_succeeded ? '✓ Succeeded' : '✗ Failed'}
              </span>
            : <span className="text-slate-600">Not attempted</span>
          }
          {diag.token_refresh_error && <span className="text-red-400">— {diag.token_refresh_error}</span>}
        </div>
      )}

      {/* Reconnect CTA */}
      {needsReconnect && onReconnect && (
        <button onClick={onReconnect}
          className="flex items-center gap-1.5 text-xs font-bold text-white bg-red-700 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors">
          Reconnect Google →
        </button>
      )}

      {syncAt && (
        <p className="text-xs text-slate-600">Last attempted: {new Date(syncAt).toLocaleString()}</p>
      )}

      {/* Step trace toggle */}
      {diag && (
        <button onClick={() => setOpen(p => !p)}
          className="text-xs text-slate-600 hover:text-slate-400 flex items-center gap-1">
          <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
          {open ? 'Hide step trace' : 'Show step trace'}
        </button>
      )}

      {open && diag && (
        <div className="bg-slate-950 border border-slate-700 rounded-lg p-3 space-y-1.5 text-xs font-mono">
          <StepRow label="step_outcome" value={stepOutcome} valueClass="text-amber-300" />
          <StepRow label="final_diagnosis" value={diag.final_diagnosis || '—'} valueClass="text-amber-300" />
          <StepRow label="token_present" value={String(diag.token_present)} valueClass={diag.token_present ? 'text-emerald-400' : 'text-red-400'} />
          <StepRow label="has_refresh_token" value={String(diag.has_refresh_token ?? '—')} />
          <StepRow label="token_refresh_attempted" value={String(diag.token_refresh_attempted ?? '—')} />
          <StepRow label="token_refresh_succeeded" value={String(diag.token_refresh_succeeded ?? '—')} valueClass={diag.token_refresh_succeeded ? 'text-emerald-400' : 'text-slate-400'} />
          {diag.token_refresh_error && <StepRow label="token_refresh_error" value={diag.token_refresh_error} valueClass="text-red-400" />}
          {diag.token_refresh_raw && <StepRow label="token_refresh_raw" value={diag.token_refresh_raw} valueClass="text-red-300" />}
          <StepRow label="acct_api_attempted" value={String(diag.account_api_attempted)} />
          <StepRow label="acct_api_http" value={String(diag.account_api_http_status ?? '—')} valueClass={diag.account_api_http_status === 200 ? 'text-emerald-400' : 'text-red-400'} />
          {diag.account_api_error && <StepRow label="acct_api_error" value={diag.account_api_error} valueClass="text-red-400" />}
          {diag.account_api_error_class && <StepRow label="acct_error_class" value={diag.account_api_error_class} valueClass="text-amber-300" />}
          {diag.account_api_raw_body && <StepRow label="acct_raw_body" value={diag.account_api_raw_body} valueClass="text-red-300" />}
          <StepRow label="accounts_returned" value={String(diag.accounts_returned ?? '—')} valueClass={diag.accounts_returned > 0 ? 'text-emerald-400' : 'text-amber-400'} />
          {diag.account_sample?.map((a, i) => <StepRow key={i} label={`  account[${i}]`} value={`${a.name} | ${a.id}`} />)}
          <StepRow label="loc_api_attempted" value={String(diag.location_api_attempted)} />
          <StepRow label="locations_returned" value={String(diag.locations_returned ?? '—')} valueClass={diag.locations_returned > 0 ? 'text-emerald-400' : 'text-amber-400'} />
          {diag.location_sample?.map((l, i) => <StepRow key={i} label={`  location[${i}]`} value={`${l.name} | ${l.id}`} />)}
          {diag.location_api_errors?.map((e, i) => <StepRow key={i} label={`  loc_err[${i}]`} value={`${e.class} (${e.http_status ?? '?'}) ${e.error}`} valueClass="text-red-400" />)}
          <StepRow label="destinations_saved" value={String(diag.destinations_saved ?? '—')} />
          <StepRow label="synced_at" value={diag.synced_at || '—'} />
          {diag.forced && <StepRow label="forced" value="true" valueClass="text-amber-300" />}
        </div>
      )}
    </div>
  );
}
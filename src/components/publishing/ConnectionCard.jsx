import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, Unlink, Settings, ChevronDown, Star, MapPin, Info, CheckCircle2, XCircle, Circle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const PROVIDER_CONFIG = {
  google_business_profile: { label: 'Google Business Profile', icon: '📍', color: 'text-blue-400', border: 'border-blue-800' },
  youtube:                  { label: 'YouTube Channel',         icon: '▶️', color: 'text-red-400',  border: 'border-red-800' },
  facebook:                 { label: 'Facebook Page',           icon: '👥', color: 'text-blue-500', border: 'border-blue-700' },
  instagram:                { label: 'Instagram',               icon: '📸', color: 'text-pink-400', border: 'border-pink-800' },
};

const STATUS_BADGE = {
  connected:    'bg-emerald-900/40 text-emerald-400 border-emerald-700',
  expired:      'bg-amber-900/40 text-amber-400 border-amber-700',
  error:        'bg-red-900/40 text-red-400 border-red-700',
  disconnected: 'bg-slate-800 text-slate-500 border-slate-700',
};

const REQUIRES_DESTINATION = ['google_business_profile', 'youtube'];

export default function ConnectionCard({ provider, connection, clientId, clientName, onConnect, onRefresh }) {
  const [showDests, setShowDests] = useState(false);
  const [refreshingLocations, setRefreshingLocations] = useState(false);
  const [refreshResult, setRefreshResult] = useState(null); // { ok, msg, count }
  const [disconnecting, setDisconnecting] = useState(false);
  const [refreshingToken, setRefreshingToken] = useState(false);
  const [settingDefault, setSettingDefault] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [selectingDest, setSelectingDest] = useState(null);

  const cfg = PROVIDER_CONFIG[provider];
  const conn = connection;
  const status = conn?.status || 'disconnected';
  const isGBP = provider === 'google_business_profile';
  const needsDest = REQUIRES_DESTINATION.includes(provider);

  // Parse destinations stored on connection record (written by OAuth callback or fetchGBPLocations)
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
  const noLocationsAfterSync = needsDest && conn && status === 'connected' && destSyncCount === 0 && destSyncAt;

  // Refresh GBP locations — calls backend which re-fetches and saves
  const handleRefreshLocations = async () => {
    if (!conn) return;
    setRefreshingLocations(true);
    setRefreshResult(null);
    try {
      const res = await base44.functions.invoke('fetchGBPLocations', { connection_id: conn.id });
      const d = res?.data;
      if (d?.success) {
        setRefreshResult({ ok: true, msg: `Found ${d.locations?.length || 0} location${d.locations?.length !== 1 ? 's' : ''}${d.auto_selected ? ` — auto-selected: ${d.auto_selected}` : ''}` });
        if (!showDests && d.locations?.length > 0) setShowDests(true);
      } else {
        setRefreshResult({ ok: false, msg: d?.error || 'Location sync failed' });
      }
      onRefresh();
    } catch (err) {
      setRefreshResult({ ok: false, msg: err.message });
    }
    setRefreshingLocations(false);
  };

  // Select a destination — direct DB update (no extra backend function needed)
  const handleSelectDestination = async (dest) => {
    if (!conn) return;
    setSelectingDest(dest.id);
    await base44.entities.ChannelConnection.update(conn.id, {
      selected_destination_id: dest.id,
      selected_destination_name: dest.name,
    });
    onRefresh();
    setSelectingDest(null);
    setShowDests(false);
  };

  const handleDisconnect = async () => {
    if (!conn) return;
    setDisconnecting(true);
    await base44.entities.ChannelConnection.update(conn.id, {
      status: 'disconnected',
      access_token: null,
      refresh_token: null,
    });
    onRefresh();
    setDisconnecting(false);
  };

  const handleRefreshToken = async () => {
    if (!conn) return;
    setRefreshingToken(true);
    try {
      // For GBP, just re-trigger location sync which also refreshes token
      if (isGBP) {
        await handleRefreshLocations();
      } else {
        await base44.functions.invoke('channelRefreshToken', { connection_id: conn.id });
        onRefresh();
      }
    } catch (err) {
      alert('Token refresh failed: ' + err.message);
    }
    setRefreshingToken(false);
  };

  const handleSetDefault = async () => {
    if (!conn) return;
    setSettingDefault(true);
    await base44.entities.ChannelConnection.update(conn.id, { is_default: true });
    onRefresh();
    setSettingDefault(false);
  };

  // Determine badge label
  const badgeLabel = (() => {
    if (!conn || status === 'disconnected') return 'Not Connected';
    if (status === 'expired') return 'Expired';
    if (status === 'error') return 'Error';
    if (needsDest && !hasDestination) return '⚠ Dest. Required';
    return '✓ Connected';
  })();
  const badgeClass = (status === 'connected' && needsDest && !hasDestination)
    ? 'bg-amber-900/40 text-amber-400 border-amber-700'
    : STATUS_BADGE[status] || STATUS_BADGE.disconnected;

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
      {conn && status === 'connected' && needsDest && !hasDestination && (
        <div className="flex items-start gap-1.5 bg-amber-900/20 border border-amber-800 rounded-lg px-3 py-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-400">Destination Required</p>
            <p className="text-xs text-amber-600">
              {storedDestinations.length > 0
                ? `${storedDestinations.length} location${storedDestinations.length !== 1 ? 's' : ''} available — select one below`
                : 'No locations loaded yet. Use Refresh Locations below.'}
            </p>
          </div>
        </div>
      )}

      {/* GBP Diagnostic panel */}
      {isGBP && conn && status === 'connected' && destSyncAt && storedDestinations.length === 0 && (
        <GBPDiagPanel diag={diag} syncError={destSyncError} syncAt={destSyncAt} />
      )}

      {/* Error */}
      {conn?.error_message && !noLocationsAfterSync && (
        <div className="flex items-start gap-2 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-300">{conn.error_message}</p>
        </div>
      )}

      {/* Refresh result feedback */}
      {refreshResult && (
        <div className={`text-xs px-3 py-2 rounded-lg border ${refreshResult.ok ? 'bg-emerald-900/30 border-emerald-700 text-emerald-300' : 'bg-red-900/20 border-red-800 text-red-300'}`}>
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
              <p className="text-slate-600">Dest. Sync</p>
              <p className="text-slate-400">{new Date(destSyncAt).toLocaleDateString()}</p>
            </div>
          )}
          {needsDest && (
            <div>
              <p className="text-slate-600">Locations</p>
              <p className={`font-medium ${destSyncCount === 0 && destSyncAt ? 'text-amber-400' : 'text-slate-400'}`}>
                {destSyncAt ? `${destSyncCount} found` : 'Not synced'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* GBP / YouTube: Destination selector */}
      {conn && status === 'connected' && needsDest && storedDestinations.length > 0 && (
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
          <button onClick={() => onConnect(provider)}
            className="flex-1 text-xs font-semibold px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
            Connect
          </button>
        ) : (
          <>
            {/* Refresh Locations — GBP primary action when no dest */}
            {isGBP && (
              <button onClick={handleRefreshLocations} disabled={refreshingLocations}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg transition-colors">
                <RefreshCw className={`w-3.5 h-3.5 ${refreshingLocations ? 'animate-spin' : ''}`} />
                {refreshingLocations ? 'Syncing…' : 'Refresh Locations'}
              </button>
            )}

            {conn.selected_destination_id && !conn.is_default && (
              <button onClick={handleSetDefault} disabled={settingDefault}
                className="text-xs font-semibold px-3 py-2 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-800 text-amber-400 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5 justify-center">
                <Star className="w-3.5 h-3.5" />
                {settingDefault ? 'Saving…' : 'Set Default'}
              </button>
            )}

            <button onClick={() => onConnect(provider)}
              className="text-xs font-semibold px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg transition-colors">
              Reconnect
            </button>

            {!isGBP && (provider === 'youtube') && (
              <button onClick={handleRefreshToken} disabled={refreshingToken}
                className="text-xs font-semibold px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 rounded-lg transition-colors disabled:opacity-50">
                <RefreshCw className={`w-3.5 h-3.5 ${refreshingToken ? 'animate-spin' : ''}`} />
              </button>
            )}

            <button onClick={handleDisconnect} disabled={disconnecting}
              className="text-xs font-semibold px-3 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-800 text-red-400 rounded-lg transition-colors disabled:opacity-50">
              {disconnecting ? '...' : <Unlink className="w-3.5 h-3.5" />}
            </button>
          </>
        )}
      </div>

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
          <DebugRow label="dest_count" value={String(destSyncCount)} />
          <DebugRow label="dest_sync_at" value={destSyncAt ? new Date(destSyncAt).toLocaleString() : '—'} />
          <DebugRow label="dest_sync_error" value={destSyncError || '—'} />
          <DebugRow label="is_default" value={String(!!conn.is_default)} />
          <DebugRow label="token_expires" value={conn.expires_at || '—'} />
          <DebugRow label="stored_dests" value={`${storedDestinations.length} destinations in JSON`} />
          {storedDestinations.slice(0, 3).map((d, i) => (
            <DebugRow key={i} label={`  dest[${i}]`} value={`${d.name} — ${d.id}`} />
          ))}
          {diag && <DebugRow label="diag_diagnosis" value={diag.final_diagnosis || '—'} highlight />}
          {diag && <DebugRow label="diag_step" value={diag.step || '—'} />}
          {diag && <DebugRow label="diag_accts" value={String(diag.accounts_returned ?? '—')} />}
          {diag && <DebugRow label="diag_locs" value={String(diag.locations_returned ?? '—')} />}
        </div>
      )}
    </div>
  );
}

function DebugRow({ label, value, highlight }) {
  return (
    <div className="flex gap-2">
      <span className="text-slate-600 w-32 flex-shrink-0">{label}</span>
      <span className={`break-all ${highlight ? 'text-amber-300' : 'text-slate-300'}`}>{value}</span>
    </div>
  );
}

// ── GBP Step-by-Step Diagnostic Panel ────────────────────────────────────────
const DIAGNOSIS_MESSAGES = {
  no_token:                   { color: 'text-red-400',    msg: 'No access token stored — OAuth must be redone' },
  auth_failed:                { color: 'text-red-400',    msg: 'OAuth token was rejected — reconnect' },
  api_disabled:               { color: 'text-red-400',    msg: 'My Business Account Management API is not enabled in Google Cloud Console for this project' },
  no_permission:              { color: 'text-amber-400',  msg: 'Authenticated Google user lacks GBP API permissions' },
  quota_exceeded:             { color: 'text-amber-400',  msg: 'API quota exceeded — try again later' },
  network_error:              { color: 'text-red-400',    msg: 'Network error reaching Google APIs' },
  no_accounts:                { color: 'text-amber-400',  msg: 'Connected Google user has no accessible Business Profile accounts' },
  locations_api_disabled:     { color: 'text-red-400',    msg: 'My Business Business Information API is not enabled in Google Cloud Console' },
  locations_no_permission:    { color: 'text-amber-400',  msg: 'Token scope missing — business.manage required for reading locations' },
  locations_api_errors:       { color: 'text-red-400',    msg: 'Locations API returned errors for all accounts — see details below' },
  accounts_exist_no_locations:{ color: 'text-amber-400',  msg: 'Account(s) found but no locations returned — may have no published/verified locations' },
  success:                    { color: 'text-emerald-400', msg: 'Sync succeeded' },
};

function StepRow({ icon, label, value, valueClass = 'text-slate-300' }) {
  const Icon = icon;
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-3 h-3 text-slate-600 flex-shrink-0 mt-0.5" />
      <span className="text-slate-500 w-44 flex-shrink-0">{label}</span>
      <span className={`break-all text-xs ${valueClass}`}>{value}</span>
    </div>
  );
}

function GBPDiagPanel({ diag, syncError, syncAt }) {
  const [open, setOpen] = useState(false);
  const diagnosis = diag?.final_diagnosis;
  const dm = DIAGNOSIS_MESSAGES[diagnosis] || { color: 'text-slate-400', msg: syncError || 'Unknown sync failure' };

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 space-y-2">
      {/* Plain-language blocker */}
      <div className={`flex items-start gap-2 ${dm.color}`}>
        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
        <p className="text-xs font-semibold">{dm.msg}</p>
      </div>

      {syncAt && (
        <p className="text-xs text-slate-600">Last sync: {new Date(syncAt).toLocaleString()}</p>
      )}

      {/* Expandable step trace */}
      {diag && (
        <button onClick={() => setOpen(p => !p)}
          className="text-xs text-slate-600 hover:text-slate-400 flex items-center gap-1">
          <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
          {open ? 'Hide step trace' : 'Show step trace'}
        </button>
      )}

      {open && diag && (
        <div className="bg-slate-950 border border-slate-700 rounded-lg p-3 space-y-1.5 text-xs font-mono">
          <StepRow icon={Circle} label="step_reached" value={diag.step || '—'} valueClass="text-amber-300" />
          <StepRow icon={Circle} label="token_present" value={String(diag.token_present)} valueClass={diag.token_present ? 'text-emerald-400' : 'text-red-400'} />
          {diag.token_refresh_error && (
            <StepRow icon={Circle} label="token_refresh_err" value={diag.token_refresh_error} valueClass="text-red-400" />
          )}
          <StepRow icon={Circle} label="acct_api_attempted" value={String(diag.account_api_attempted)} />
          <StepRow icon={Circle} label="acct_api_http" value={String(diag.account_api_http_status ?? '—')} valueClass={diag.account_api_http_status === 200 ? 'text-emerald-400' : 'text-red-400'} />
          {diag.account_api_error && (
            <StepRow icon={Circle} label="acct_api_error" value={diag.account_api_error} valueClass="text-red-400" />
          )}
          {diag.account_api_error_class && (
            <StepRow icon={Circle} label="acct_error_class" value={diag.account_api_error_class} valueClass="text-amber-300" />
          )}
          <StepRow icon={Circle} label="accounts_returned" value={String(diag.accounts_returned ?? '—')} valueClass={diag.accounts_returned > 0 ? 'text-emerald-400' : 'text-amber-400'} />
          {diag.account_sample?.map((a, i) => (
            <StepRow key={i} icon={Circle} label={`  account[${i}]`} value={`${a.name} | ${a.id}`} />
          ))}
          <StepRow icon={Circle} label="loc_api_attempted" value={String(diag.location_api_attempted)} />
          <StepRow icon={Circle} label="locations_returned" value={String(diag.locations_returned ?? '—')} valueClass={diag.locations_returned > 0 ? 'text-emerald-400' : 'text-amber-400'} />
          {diag.location_sample?.map((l, i) => (
            <StepRow key={i} icon={Circle} label={`  location[${i}]`} value={`${l.name} | ${l.id}`} />
          ))}
          {diag.location_api_errors?.map((e, i) => (
            <StepRow key={i} icon={Circle} label={`  loc_err[${i}]`} value={`${e.class} (${e.http_status ?? '?'}) ${e.error}`} valueClass="text-red-400" />
          ))}
          <StepRow icon={Circle} label="destinations_saved" value={String(diag.destinations_saved ?? '—')} />
          <StepRow icon={Circle} label="final_diagnosis" value={diag.final_diagnosis || '—'} valueClass="text-amber-300" />
          <StepRow icon={Circle} label="synced_at" value={diag.synced_at || '—'} />
        </div>
      )}
    </div>
  );
}
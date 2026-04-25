import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Shield, ShieldCheck, ShieldAlert, ShieldX, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

const PROVIDER_LABELS = {
  google_business_profile: 'GBP',
  youtube: 'YouTube',
  facebook: 'Facebook',
  instagram: 'Instagram',
};

function runCheck(conn) {
  if (!conn.access_token) return { result: 'Token Missing', color: 'text-red-400', bg: 'bg-red-900/20 border-red-800' };
  if (conn.expires_at && new Date(conn.expires_at) < new Date()) return { result: 'Token Expired', color: 'text-orange-400', bg: 'bg-orange-900/20 border-orange-800' };
  let destinations = [];
  try { destinations = JSON.parse(conn.destinations_json || '[]'); } catch {}
  if (destinations.length === 0) return { result: 'No Destinations Found', color: 'text-amber-400', bg: 'bg-amber-900/20 border-amber-800' };
  if (!conn.selected_destination_id) return { result: 'Needs Destination', color: 'text-amber-300', bg: 'bg-amber-900/20 border-amber-700' };
  if (conn.status === 'ready') return { result: 'Ready', color: 'text-emerald-400', bg: 'bg-emerald-900/20 border-emerald-800' };
  return { result: 'Needs Destination', color: 'text-amber-300', bg: 'bg-amber-900/20 border-amber-700' };
}

function HealthRow({ conn, clientName, latestLog, checked }) {
  const [expanded, setExpanded] = useState(false);
  let destinations = [];
  try { destinations = JSON.parse(conn.destinations_json || '[]'); } catch {}
  const check = checked ? runCheck(conn) : null;

  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-slate-900 hover:bg-slate-800/60 transition-colors text-left"
      >
        <span className="text-xs font-bold text-slate-400 w-20 flex-shrink-0">
          {PROVIDER_LABELS[conn.provider] || conn.provider}
        </span>
        <span className="text-sm text-white font-medium flex-1 truncate">{clientName}</span>

        {/* Status badge */}
        <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold flex-shrink-0 ${
          conn.status === 'ready'                    ? 'bg-emerald-900/30 border-emerald-700 text-emerald-400' :
          conn.status === 'connected_no_destination' ? 'bg-amber-900/30 border-amber-700 text-amber-300' :
          conn.status === 'expired'                  ? 'bg-orange-900/30 border-orange-700 text-orange-400' :
          conn.status === 'error'                    ? 'bg-red-900/30 border-red-800 text-red-400' :
          conn.status === 'connected'                ? 'bg-blue-900/30 border-blue-700 text-blue-400' :
          'bg-slate-800 border-slate-700 text-slate-500'
        }`}>{conn.status || 'disconnected'}</span>

        {/* Health check result */}
        {check && (
          <span className={`text-xs px-2 py-0.5 rounded-full border font-bold flex-shrink-0 ${check.bg} ${check.color}`}>
            {check.result}
          </span>
        )}

        {expanded ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="px-4 py-4 bg-slate-950 border-t border-slate-800 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 text-xs">
          <Field label="Token Present" value={conn.access_token ? '✅ Yes' : '❌ No'} />
          <Field label="Expires At" value={conn.expires_at ? new Date(conn.expires_at).toLocaleString() : '—'} warn={conn.expires_at && new Date(conn.expires_at) < new Date()} />
          <Field label="Scopes" value={conn.scopes || '—'} mono />
          <Field label="Destinations" value={`${destinations.length} found`} />
          <Field label="Selected Dest ID" value={conn.selected_destination_id || '—'} mono />
          <Field label="Selected Dest Name" value={conn.selected_destination_name || '—'} />
          <Field label="Last Sync At" value={conn.last_sync_at ? new Date(conn.last_sync_at).toLocaleString() : '—'} />
          <Field label="Error Message" value={conn.error_message || '—'} warn={!!conn.error_message} />
          {latestLog && (
            <div className="col-span-full">
              <p className="text-slate-500 mb-1">Latest Log Event</p>
              <div className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2">
                <span className={`font-semibold mr-2 ${latestLog.status === 'success' ? 'text-emerald-400' : latestLog.status === 'failed' ? 'text-red-400' : 'text-blue-400'}`}>
                  [{latestLog.status}]
                </span>
                <span className="text-slate-300">{latestLog.event_type}</span>
                <span className="text-slate-500 ml-2">{latestLog.message}</span>
                <span className="text-slate-600 ml-2 text-xs">{latestLog.event_time ? new Date(latestLog.event_time).toLocaleString() : ''}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, mono, warn }) {
  return (
    <div>
      <p className="text-slate-500 mb-0.5">{label}</p>
      <p className={`font-medium break-all ${warn ? 'text-red-400' : 'text-slate-200'} ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </p>
    </div>
  );
}

export default function OAuthHealthPanel({ connections, clients }) {
  const [checked, setChecked] = useState(false);
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);
  const [filter, setFilter] = useState('all');

  const clientMap = Object.fromEntries((clients || []).map(c => [c.id, c.business_name]));

  const runHealthCheck = async () => {
    setRunning(true);
    setChecked(false);
    try {
      // Fetch latest PostingLog entries
      const allLogs = await base44.entities.PostingLog.list('-event_time', 500);
      setLogs(allLogs);
      setChecked(true);
    } catch (err) {
      console.error('Health check failed', err);
    }
    setRunning(false);
  };

  const getLatestLog = (conn) => {
    return logs.find(l => l.client_id === conn.client_id && l.provider === conn.provider);
  };

  const FILTERS = ['all', 'ready', 'needs_destination', 'token_missing', 'token_expired', 'error'];

  const filteredConnections = connections.filter(conn => {
    if (filter === 'all') return true;
    const check = runCheck(conn);
    if (filter === 'ready') return check.result === 'Ready';
    if (filter === 'needs_destination') return check.result === 'Needs Destination';
    if (filter === 'token_missing') return check.result === 'Token Missing';
    if (filter === 'token_expired') return check.result === 'Token Expired';
    if (filter === 'error') return ['No Destinations Found', 'API Error'].includes(check.result);
    return true;
  });

  // Summary counts (only when checked)
  const summary = checked ? {
    ready: connections.filter(c => runCheck(c).result === 'Ready').length,
    needs_dest: connections.filter(c => runCheck(c).result === 'Needs Destination').length,
    token_missing: connections.filter(c => runCheck(c).result === 'Token Missing').length,
    token_expired: connections.filter(c => runCheck(c).result === 'Token Expired').length,
    no_dest: connections.filter(c => runCheck(c).result === 'No Destinations Found').length,
  } : null;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
      {/* Panel header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          <h2 className="font-bold text-white">OAuth Health Check</h2>
          <span className="text-xs text-slate-500">{connections.length} connections</span>
        </div>
        <button
          onClick={runHealthCheck}
          disabled={running}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} />
          {running ? 'Running…' : 'Run Health Check'}
        </button>
      </div>

      {/* Summary row (after check) */}
      {summary && (
        <div className="grid grid-cols-5 gap-2">
          {[
            { label: 'Ready', val: summary.ready, color: 'text-emerald-400', key: 'ready' },
            { label: 'Needs Dest', val: summary.needs_dest, color: 'text-amber-300', key: 'needs_destination' },
            { label: 'Token Missing', val: summary.token_missing, color: 'text-red-400', key: 'token_missing' },
            { label: 'Token Expired', val: summary.token_expired, color: 'text-orange-400', key: 'token_expired' },
            { label: 'No Dests', val: summary.no_dest, color: 'text-amber-400', key: 'error' },
          ].map(s => (
            <button
              key={s.key}
              onClick={() => setFilter(filter === s.key ? 'all' : s.key)}
              className={`rounded-xl p-2 text-center border transition-colors ${filter === s.key ? 'border-blue-500 bg-blue-900/20' : 'border-slate-800 bg-slate-900 hover:border-slate-600'}`}
            >
              <p className={`text-xl font-black ${s.color}`}>{s.val}</p>
              <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
            </button>
          ))}
        </div>
      )}

      {/* Filter tabs (only when checked) */}
      {checked && (
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${
                filter === f ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
              }`}
            >
              {f.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      )}

      {/* Connection rows */}
      <div className="space-y-2">
        {connections.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">No connections found. Connect channels above.</div>
        ) : (filteredConnections.length === 0 && checked) ? (
          <div className="text-center py-8 text-slate-500 text-sm">No connections match this filter.</div>
        ) : (
          (checked ? filteredConnections : connections).map(conn => (
            <HealthRow
              key={conn.id}
              conn={conn}
              clientName={clientMap[conn.client_id] || conn.client_name || conn.client_id}
              latestLog={checked ? getLatestLog(conn) : null}
              checked={checked}
            />
          ))
        )}
      </div>

      {!checked && connections.length > 0 && (
        <p className="text-center text-slate-600 text-xs">Click "Run Health Check" to evaluate all connections and fetch latest logs.</p>
      )}
    </div>
  );
}
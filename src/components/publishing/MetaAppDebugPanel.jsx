import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Bug, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

/**
 * Shows live Meta OAuth config loaded on the backend:
 *  - Meta App ID (from META_APP_ID secret)
 *  - Whether the App Secret is set
 *  - Redirect URIs used for FB + channel callbacks
 *  - Scopes / config_id
 *
 * Only visible to admin users. Collapsed by default.
 */
export default function MetaAppDebugPanel() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('metaOAuthDebug', {});
      setData(res.data);
    } catch (e) {
      setError(e.message || 'Failed to load debug info');
    }
    setLoading(false);
  };

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next && !data) load();
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-bold text-violet-300 uppercase tracking-widest">Meta OAuth Debug</span>
          <span className="text-xs text-slate-600">(admin only)</span>
        </div>
        <div className="flex items-center gap-2">
          {loading && <RefreshCw className="w-3.5 h-3.5 text-slate-500 animate-spin" />}
          {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-slate-800">
          {error && (
            <p className="text-xs text-red-400 mt-3">{error}</p>
          )}
          {data && (
            <div className="mt-3 space-y-2">
              <Row label="Meta App ID (META_APP_ID)" value={data.meta_app_id} highlight={data.meta_app_id !== '(not set)'} />
              <Row label="App Secret set?" value={data.meta_app_secret_set ? '✅ Yes' : '❌ NOT SET'} />
              <Row label="META_OAUTH_SCOPES" value={data.meta_oauth_scopes} />
              <Row label="META_FACEBOOK_LOGIN_CONFIG_ID" value={data.meta_facebook_login_config_id} />
              <Row label="Facebook Redirect URI" value={data.facebook_redirect_uri} mono />
              <Row label="Channel Callback URI" value={data.channel_callback_uri} mono />
              <p className="text-xs text-slate-600 pt-1 border-t border-slate-800 mt-2">{data.note}</p>
            </div>
          )}
          <button onClick={load} disabled={loading} className="mt-3 text-xs text-slate-400 hover:text-white flex items-center gap-1.5">
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, highlight, mono }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xs text-slate-500 w-52 flex-shrink-0">{label}</span>
      <span className={`text-xs font-semibold break-all ${highlight ? 'text-emerald-400' : 'text-slate-300'} ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  );
}
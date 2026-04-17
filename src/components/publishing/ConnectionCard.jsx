import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Clock, RefreshCw, Unlink, Settings, ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const PROVIDER_CONFIG = {
  google_business_profile: { label: 'Google Business Profile', icon: '📍', color: 'text-blue-400', border: 'border-blue-800' },
  youtube: { label: 'YouTube Channel', icon: '▶️', color: 'text-red-400', border: 'border-red-800' },
  facebook: { label: 'Facebook Page', icon: '👥', color: 'text-blue-500', border: 'border-blue-700' },
  instagram: { label: 'Instagram', icon: '📸', color: 'text-pink-400', border: 'border-pink-800' },
};

const STATUS_BADGE = {
  connected: 'bg-emerald-900/40 text-emerald-400 border-emerald-700',
  expired:   'bg-amber-900/40 text-amber-400 border-amber-700',
  error:     'bg-red-900/40 text-red-400 border-red-700',
  disconnected: 'bg-slate-800 text-slate-500 border-slate-700',
};

export default function ConnectionCard({ provider, connection, clientId, clientName, onConnect, onRefresh }) {
  const [showDests, setShowDests] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [loadingDests, setLoadingDests] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const cfg = PROVIDER_CONFIG[provider];
  const conn = connection;
  const status = conn?.status || 'disconnected';

  const handleLoadDestinations = async () => {
    if (showDests) { setShowDests(false); return; }
    setLoadingDests(true);
    try {
      const res = await base44.functions.invoke('getChannelDestinations', { connection_id: conn.id });
      setDestinations(res?.data?.destinations || []);
    } catch { /* ignore */ }
    setLoadingDests(false);
    setShowDests(true);
  };

  const handleSelectDestination = async (dest) => {
    await base44.functions.invoke('getChannelDestinations', {
      connection_id: conn.id,
      destination_id: dest.id,
      destination_name: dest.name,
    });
    onRefresh();
  };

  const handleDisconnect = async () => {
    if (!conn) return;
    setDisconnecting(true);
    await base44.entities.ChannelConnection.update(conn.id, { status: 'disconnected', access_token: null, refresh_token: null });
    onRefresh();
    setDisconnecting(false);
  };

  const handleRefreshToken = async () => {
    if (!conn) return;
    setRefreshing(true);
    try {
      await base44.functions.invoke('channelRefreshToken', { connection_id: conn.id });
      onRefresh();
    } catch (err) {
      alert('Token refresh failed: ' + err.message);
    }
    setRefreshing(false);
  };

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
        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${STATUS_BADGE[status]}`}>
          {status === 'connected' ? '✓ Connected' : status === 'expired' ? 'Expired' : status === 'error' ? 'Error' : 'Not Connected'}
        </span>
      </div>

      {/* Destination */}
      {conn?.selected_destination_name && (
        <div className="bg-slate-800/50 rounded-lg px-3 py-2">
          <p className="text-xs text-slate-500">Default Destination</p>
          <p className="text-xs font-semibold text-white">{conn.selected_destination_name}</p>
        </div>
      )}

      {/* Error */}
      {conn?.error_message && (
        <div className="flex items-start gap-2 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-300">{conn.error_message}</p>
        </div>
      )}

      {/* Meta */}
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
              <p className="text-slate-600">Expires</p>
              <p className={`font-medium ${new Date(conn.expires_at) < new Date() ? 'text-red-400' : 'text-slate-400'}`}>
                {new Date(conn.expires_at).toLocaleDateString()}
              </p>
            </div>
          )}
          {conn.last_sync_at && (
            <div>
              <p className="text-slate-600">Last Sync</p>
              <p className="text-slate-400">{new Date(conn.last_sync_at).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      )}

      {/* Destinations selector */}
      {conn && status === 'connected' && (
        <div>
          <button
            onClick={handleLoadDestinations}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            {loadingDests ? 'Loading...' : 'Select Destination'}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDests ? 'rotate-180' : ''}`} />
          </button>
          {showDests && destinations.length > 0 && (
            <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
              {destinations.map(d => (
                <button
                  key={d.id}
                  onClick={() => handleSelectDestination(d)}
                  className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-colors ${
                    conn.selected_destination_id === d.id
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          )}
          {showDests && destinations.length === 0 && (
            <p className="text-xs text-slate-600 mt-2">No destinations found.</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 flex-wrap pt-1">
        {status === 'disconnected' || !conn ? (
          <button onClick={() => onConnect(provider)}
            className="flex-1 text-xs font-semibold px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
            Connect
          </button>
        ) : (
          <>
            <button onClick={() => onConnect(provider)}
              className="flex-1 text-xs font-semibold px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg transition-colors">
              Reconnect
            </button>
            {(provider === 'google_business_profile' || provider === 'youtube') && (
              <button onClick={handleRefreshToken} disabled={refreshing}
                className="text-xs font-semibold px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 rounded-lg transition-colors disabled:opacity-50">
                {refreshing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              </button>
            )}
            <button onClick={handleDisconnect} disabled={disconnecting}
              className="text-xs font-semibold px-3 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-800 text-red-400 rounded-lg transition-colors disabled:opacity-50">
              {disconnecting ? '...' : <Unlink className="w-3.5 h-3.5" />}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
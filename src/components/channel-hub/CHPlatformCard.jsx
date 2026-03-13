import React from 'react';
import { CheckCircle2, AlertCircle, Clock, RefreshCw, ExternalLink, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const STATUS_CFG = {
  not_connected: { label: 'Not Connected', color: '#64748b', bg: '#1e293b', icon: WifiOff, pulse: false },
  connecting:    { label: 'Connecting...', color: '#3b82f6', bg: '#1e3a5f', icon: Loader2,  pulse: true, spin: true },
  connected:     { label: 'Connected',     color: '#10b981', bg: '#052e16', icon: CheckCircle2, pulse: false },
  error:         { label: 'Error',         color: '#ef4444', bg: '#2d1010', icon: AlertCircle, pulse: false },
  expired:       { label: 'Token Expired', color: '#f59e0b', bg: '#2d1f00', icon: Clock, pulse: false },
  disconnected:  { label: 'Disconnected',  color: '#94a3b8', bg: '#1e293b', icon: WifiOff, pulse: false },
};

export default function CHPlatformCard({ platform, connection, onConnect, onReconnect, onDisconnect, isOptional }) {
  const status = connection?.status || 'not_connected';
  const cfg = STATUS_CFG[status];
  const Icon = cfg.icon;

  const lastSync = connection?.last_sync_at
    ? formatDistanceToNow(new Date(connection.last_sync_at), { addSuffix: true })
    : null;

  return (
    <div className={`relative rounded-2xl border overflow-hidden transition-all duration-300 ${
      status === 'connected'
        ? 'border-green-800/50 shadow-lg shadow-green-950/20'
        : status === 'error' || status === 'expired'
        ? 'border-red-800/40'
        : 'border-slate-700/50'
    }`} style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>

      {/* Optional badge */}
      {isOptional && (
        <div className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 bg-slate-800 border border-slate-600 rounded-full text-slate-400">
          Optional
        </div>
      )}

      {/* Status glow strip */}
      <div className="h-1 w-full" style={{ background: cfg.color, opacity: status === 'connected' ? 1 : 0.4 }} />

      <div className="p-5">
        {/* Logo + name row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${platform.color}15`, border: `1px solid ${platform.color}30` }}>
            <platform.Logo />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-base">{platform.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Icon className={`w-3 h-3 ${cfg.spin ? 'animate-spin' : ''}`} style={{ color: cfg.color }} />
              <span className="text-xs font-semibold" style={{ color: cfg.color }}>{cfg.label}</span>
            </div>
          </div>
        </div>

        {/* Benefit message */}
        <p className="text-slate-400 text-xs leading-relaxed mb-4">{platform.benefit}</p>

        {/* Connected account info */}
        {status === 'connected' && connection.page_name && (
          <div className="mb-4 p-3 bg-green-950/20 border border-green-800/30 rounded-xl">
            <p className="text-green-400 text-xs font-bold">✓ {connection.page_name}</p>
            {connection.account_name && <p className="text-slate-500 text-xs mt-0.5">Account: {connection.account_name}</p>}
            {lastSync && <p className="text-slate-600 text-xs mt-1">Last sync {lastSync}</p>}
          </div>
        )}

        {/* Error message */}
        {(status === 'error' || status === 'expired') && (
          <div className="mb-4 p-3 bg-red-950/20 border border-red-800/30 rounded-xl">
            <p className="text-red-400 text-xs font-semibold">{connection?.error_message || 'Connection issue detected'}</p>
            <a href="#diagnostics" className="text-xs text-blue-400 hover:underline mt-1 block">View diagnostics →</a>
          </div>
        )}

        {/* Permissions chips */}
        {status === 'connected' && platform.perms && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {platform.perms.map((p, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">{p}</span>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-auto">
          {status === 'not_connected' || status === 'disconnected' ? (
            <button onClick={onConnect}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: `linear-gradient(135deg, ${platform.color}, ${platform.color}bb)` }}>
              <ExternalLink className="w-3.5 h-3.5" /> Connect {platform.name}
            </button>
          ) : status === 'connecting' ? (
            <button disabled className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-700 cursor-not-allowed opacity-60">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Connecting...
            </button>
          ) : status === 'connected' ? (
            <>
              <button onClick={onReconnect}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 border border-slate-700 hover:bg-slate-800 transition-colors">
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
              <button onClick={onDisconnect}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 border border-slate-700 hover:bg-slate-800 transition-colors">
                Disconnect
              </button>
            </>
          ) : (
            <button onClick={onReconnect}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: '#ef444430', border: '1px solid #ef444450', color: '#fca5a5' }}>
              <RefreshCw className="w-3.5 h-3.5" /> Reconnect
            </button>
          )}
        </div>

        {/* Troubleshoot link */}
        {(status === 'error' || status === 'expired') && (
          <a href="#diagnostics" className="block text-center text-xs text-slate-600 hover:text-slate-400 mt-2 transition-colors">
            Troubleshoot this connection
          </a>
        )}
      </div>
    </div>
  );
}
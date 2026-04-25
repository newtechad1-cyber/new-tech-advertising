import React from 'react';
import { CheckCircle, AlertCircle, WifiOff, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const platformMeta = {
  facebook:           { name: 'Facebook',          emoji: '📘', color: 'bg-blue-600' },
  instagram:          { name: 'Instagram',          emoji: '📷', color: 'bg-pink-500' },
  youtube:            { name: 'YouTube',            emoji: '▶️', color: 'bg-red-600' },
  google_my_business: { name: 'Google My Business', emoji: '🗺️', color: 'bg-green-600' },
  tiktok:             { name: 'TikTok',             emoji: '🎵', color: 'bg-slate-900' },
  linkedin:           { name: 'LinkedIn',           emoji: '💼', color: 'bg-blue-700' },
};

const STATUS_CONFIG = {
  ready:                    { label: 'Ready',               icon: CheckCircle, color: 'text-green-500', border: 'border-green-200', badge: 'bg-green-100 text-green-700' },
  connected_no_destination: { label: 'Select Destination',  icon: Clock,       color: 'text-amber-500', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700' },
  error:                    { label: 'Error',               icon: AlertCircle, color: 'text-red-500',   border: 'border-red-200',   badge: 'bg-red-100 text-red-700' },
  expired:                  { label: 'Expired',             icon: AlertCircle, color: 'text-orange-500',border: 'border-orange-200',badge: 'bg-orange-100 text-orange-700' },
  disconnected:             { label: 'Not Connected',       icon: WifiOff,     color: 'text-slate-300', border: 'border-slate-100', badge: null },
  connecting:               { label: 'Connecting…',         icon: Clock,       color: 'text-blue-400',  border: 'border-blue-100',  badge: 'bg-blue-100 text-blue-700' },
};

export default function PlatformCard({ account, onConnect, onDisconnect }) {
  const meta = platformMeta[account.platform] || { name: account.platform, emoji: '🔗', color: 'bg-slate-500' };
  const status = account.status || 'disconnected';
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.disconnected;
  const Icon = cfg.icon;
  const isReady = status === 'ready';
  const needsAction = status === 'connected_no_destination' || status === 'error' || status === 'expired';

  return (
    <div className={`rounded-xl border-2 bg-white p-5 flex flex-col gap-3 transition-all ${cfg.border}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{meta.emoji}</span>
          <div>
            <p className="font-semibold text-slate-800">{meta.name}</p>
            {account.account_name && account.account_name !== meta.name && (
              <p className="text-xs text-slate-500 truncate max-w-[140px]">{account.account_name}</p>
            )}
            {account.selected_destination_name && (
              <p className="text-xs text-green-600 font-medium truncate max-w-[140px]">📍 {account.selected_destination_name}</p>
            )}
          </div>
        </div>
        <Icon className={`w-5 h-5 shrink-0 ${cfg.color}`} />
      </div>

      {/* Status badge */}
      {cfg.badge && (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full self-start ${cfg.badge}`}>
          {cfg.label}
        </span>
      )}

      {/* Error message */}
      {status === 'error' && account.error_message && (
        <p className="text-xs text-red-600">{account.error_message}</p>
      )}

      <div className="flex gap-2 mt-auto">
        {isReady ? (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-red-500 border-red-200 hover:bg-red-50"
            onClick={() => onDisconnect(account)}
          >
            Disconnect
          </Button>
        ) : needsAction ? (
          <>
            <Button size="sm" className={`flex-1 text-white ${meta.color}`} onClick={() => onConnect(account)}>
              Fix Connection
            </Button>
          </>
        ) : (
          <Button size="sm" className={`flex-1 text-white ${meta.color}`} onClick={() => onConnect(account)}>
            Connect
          </Button>
        )}
      </div>
    </div>
  );
}
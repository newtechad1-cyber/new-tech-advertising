import React from 'react';
import { CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

const platformMeta = {
  facebook:          { name: 'Facebook',          emoji: '📘', color: 'bg-blue-600' },
  instagram:         { name: 'Instagram',          emoji: '📷', color: 'bg-pink-500' },
  youtube:           { name: 'YouTube',            emoji: '▶️', color: 'bg-red-600' },
  google_my_business:{ name: 'Google My Business', emoji: '🗺️', color: 'bg-green-600' },
  tiktok:            { name: 'TikTok',             emoji: '🎵', color: 'bg-slate-900' },
  linkedin:          { name: 'LinkedIn',           emoji: '💼', color: 'bg-blue-700' },
};

export default function PlatformCard({ account, onConnect, onDisconnect }) {
  const meta = platformMeta[account.platform] || { name: account.platform, emoji: '🔗', color: 'bg-slate-500' };
  const isConnected = account.status === 'connected';
  const needsReauth = account.status === 'reauthentication_needed';

  return (
    <div className={`rounded-xl border-2 bg-white p-5 flex flex-col gap-3 transition-all ${
      isConnected ? 'border-green-200' : needsReauth ? 'border-amber-200' : 'border-slate-100'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{meta.emoji}</span>
          <div>
            <p className="font-semibold text-slate-800">{meta.name}</p>
            {isConnected && account.account_name && (
              <p className="text-xs text-slate-500 truncate max-w-[140px]">{account.account_name}</p>
            )}
          </div>
        </div>
        {isConnected ? (
          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
        ) : needsReauth ? (
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
        ) : (
          <WifiOff className="w-5 h-5 text-slate-300 shrink-0" />
        )}
      </div>

      <div className="flex gap-2 mt-auto">
        {isConnected ? (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-red-500 border-red-200 hover:bg-red-50"
            onClick={() => onDisconnect(account)}
          >
            Disconnect
          </Button>
        ) : (
          <Button
            size="sm"
            className={`flex-1 text-white ${meta.color}`}
            onClick={() => onConnect(account)}
          >
            {needsReauth ? 'Reconnect' : 'Connect'}
          </Button>
        )}
      </div>
    </div>
  );
}
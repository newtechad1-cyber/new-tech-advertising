import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, WifiOff, ExternalLink, Trash2 } from 'lucide-react';

const statusConfig = {
  connected: { label: 'Connected', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  disconnected: { label: 'Not Connected', icon: WifiOff, color: 'text-slate-400', bg: 'bg-slate-50 border-slate-200' },
  reauthentication_needed: { label: 'Needs Reconnect', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
};

const platformMeta = {
  facebook: { name: 'Facebook', color: '#1877F2', emoji: '📘' },
  instagram: { name: 'Instagram', color: '#E1306C', emoji: '📷' },
  youtube: { name: 'YouTube', color: '#FF0000', emoji: '▶️' },
  google_my_business: { name: 'Google My Business', color: '#4285F4', emoji: '🗺️' },
  tiktok: { name: 'TikTok', color: '#000000', emoji: '🎵' },
  linkedin: { name: 'LinkedIn', color: '#0A66C2', emoji: '💼' },
};

export default function PlatformCard({ account, onConnect, onDisconnect }) {
  const meta = platformMeta[account.platform];
  const status = statusConfig[account.status] || statusConfig.disconnected;
  const StatusIcon = status.icon;
  const isConnected = account.status === 'connected';
  const needsReauth = account.status === 'reauthentication_needed';

  return (
    <div className={`rounded-xl border-2 p-5 transition-all ${status.bg}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: meta.color + '15' }}
          >
            {meta.emoji}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{meta.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <StatusIcon className={`w-3.5 h-3.5 ${status.color}`} />
              <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
            </div>
          </div>
        </div>
        {isConnected && account.profile_image_url && (
          <img src={account.profile_image_url} alt="" className="w-9 h-9 rounded-full object-cover border-2 border-white shadow" />
        )}
      </div>

      {isConnected && (
        <div className="mt-3 pt-3 border-t border-current/10">
          <p className="text-sm font-medium text-slate-700">{account.account_name}</p>
          {account.profile_url && (
            <a href={account.profile_url} target="_blank" rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-0.5">
              View profile <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {account.last_synced_at && (
            <p className="text-xs text-slate-400 mt-1">
              Last synced: {new Date(account.last_synced_at).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        {!isConnected || needsReauth ? (
          <Button
            size="sm"
            className="flex-1 text-white"
            style={{ backgroundColor: meta.color }}
            onClick={() => onConnect(account)}
          >
            {needsReauth ? 'Reconnect' : 'Connect'}
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onDisconnect(account)}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Disconnect
          </Button>
        )}
      </div>
    </div>
  );
}
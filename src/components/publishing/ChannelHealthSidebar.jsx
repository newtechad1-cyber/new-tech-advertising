import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, AlertTriangle, Link2, Settings } from 'lucide-react';

const CHANNELS = [
  { id: 'website', label: 'Website', icon: '🌐', color: 'green' },
  { id: 'facebook', label: 'Facebook', icon: '📘', color: 'blue' },
  { id: 'instagram', label: 'Instagram', icon: '📷', color: 'pink' },
  { id: 'youtube', label: 'YouTube', icon: '▶️', color: 'red' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵', color: 'black' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼', color: 'blue' },
  { id: 'gbp', label: 'Google Business', icon: '🔍', color: 'amber' },
];

const STATUS_CONFIG = {
  ready: { badge: 'default', label: 'Ready', icon: CheckCircle2, color: 'text-green-600' },
  connected: { badge: 'secondary', label: 'Connected', icon: Link2, color: 'text-blue-600' },
  incomplete: { badge: 'outline', label: 'Incomplete', icon: AlertTriangle, color: 'text-amber-600' },
  needs_setup: { badge: 'outline', label: 'Setup Needed', icon: Settings, color: 'text-gray-600' },
  expired: { badge: 'destructive', label: 'Token Expired', icon: AlertCircle, color: 'text-red-600' },
  error: { badge: 'destructive', label: 'Error', icon: AlertCircle, color: 'text-red-600' },
};

export default function ChannelHealthSidebar({ connectionStatuses, blockedJobs, failedJobs }) {
  const getChannelStatus = (channelId) => {
    const conn = connectionStatuses?.[channelId];
    if (!conn) return 'needs_setup';
    return conn.status || 'connected';
  };

  const getBlockedCount = (channelId) => {
    return (blockedJobs?.[channelId] || 0);
  };

  const getFailedCount = (channelId) => {
    return (failedJobs?.[channelId] || 0);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-bold text-gray-900">Channel Readiness</h2>
        <p className="text-xs text-gray-600 mt-1">Connection status & issues</p>
      </div>

      {/* Channels */}
      <div className="px-6 space-y-3 pb-6">
        {CHANNELS.map(channel => {
          const status = getChannelStatus(channel.id);
          const config = STATUS_CONFIG[status] || STATUS_CONFIG.needs_setup;
          const Icon = config.icon;
          const blocked = getBlockedCount(channel.id);
          const failed = getFailedCount(channel.id);

          return (
            <Card key={channel.id} className="p-3 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-lg">{channel.icon}</span>
                  <h3 className="font-semibold text-sm text-gray-900">{channel.label}</h3>
                </div>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>

              {/* Status Badge */}
              <Badge variant={config.badge} className="text-xs mb-2">
                {config.label}
              </Badge>

              {/* Issues */}
              {(blocked > 0 || failed > 0) && (
                <div className="space-y-1 mb-3 text-xs">
                  {blocked > 0 && (
                    <div className="flex items-center justify-between p-2 rounded bg-amber-50 border border-amber-200">
                      <span className="text-amber-900">{blocked} blocked</span>
                    </div>
                  )}
                  {failed > 0 && (
                    <div className="flex items-center justify-between p-2 rounded bg-red-50 border border-red-200">
                      <span className="text-red-900">{failed} failed</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action */}
              {['needs_setup', 'expired', 'error'].includes(status) && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs gap-1"
                  onClick={() => console.log('Open connection setup', channel.id)}
                >
                  <Settings className="w-3 h-3" />
                  Setup
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
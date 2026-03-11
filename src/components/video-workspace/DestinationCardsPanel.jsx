import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, LinkIcon } from 'lucide-react';
import { Globe, Facebook, Instagram, Youtube, Music, Briefcase } from 'lucide-react';

const DESTINATIONS = [
  { key: 'website', label: 'Website', icon: Globe, enableField: 'website_publish_enabled', color: 'blue' },
  { key: 'facebook', label: 'Facebook', icon: Facebook, enableField: 'facebook_publish_enabled', color: 'blue' },
  { key: 'instagram', label: 'Instagram', icon: Instagram, enableField: 'instagram_publish_enabled', color: 'pink' },
  { key: 'youtube', label: 'YouTube', icon: Youtube, enableField: 'youtube_publish_enabled', color: 'red' },
  { key: 'tiktok', label: 'TikTok', icon: Music, enableField: 'tiktok_publish_enabled', color: 'black' },
  { key: 'gbp', label: 'Google Biz', icon: Briefcase, enableField: 'gbp_publish_enabled', color: 'green' },
];

export default function DestinationCardsPanel({ video, onChange, connectionStatuses = {} }) {
  const getStatus = (dest) => {
    const isEnabled = video[dest.enableField];
    const connStatus = connectionStatuses[dest.key];
    
    if (!isEnabled) return 'disabled';
    if (connStatus === 'error' || connStatus === 'token_expired') return 'blocked';
    if (connStatus === 'connected') return 'ready';
    return 'needs_setup';
  };

  const statusConfig = {
    disabled: { bg: 'bg-slate-50', border: 'border-slate-200', icon: 'text-slate-400', text: 'text-slate-600' },
    ready: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600', text: 'text-green-700' },
    blocked: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600', text: 'text-red-700' },
    needs_setup: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', text: 'text-amber-700' },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          Destination Selection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {DESTINATIONS.map(dest => {
            const isEnabled = video[dest.enableField];
            const status = getStatus(dest);
            const config = statusConfig[status];
            const Icon = dest.icon;

            return (
              <div key={dest.key} className={`p-3 rounded-lg border transition-all ${config.bg} ${config.border}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <Icon className={`w-5 h-5 ${config.icon} flex-shrink-0 mt-0.5`} />
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold ${config.text}`}>{dest.label}</p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {status === 'disabled' && 'Not selected'}
                        {status === 'ready' && 'Connected'}
                        {status === 'blocked' && 'Issue detected'}
                        {status === 'needs_setup' && 'Setup needed'}
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={(e) => onChange({ [dest.enableField]: e.target.checked })}
                    className="rounded w-4 h-4 cursor-pointer"
                  />
                </div>

                {/* Fix link if blocked */}
                {status === 'blocked' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 h-auto p-0 text-xs text-red-600 hover:text-red-700 gap-1 w-full justify-start"
                  >
                    <AlertCircle className="w-3 h-3" />
                    Fix connection
                  </Button>
                )}

                {/* Needs setup */}
                {status === 'needs_setup' && isEnabled && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 h-auto p-0 text-xs text-amber-600 hover:text-amber-700 gap-1 w-full justify-start"
                  >
                    <LinkIcon className="w-3 h-3" />
                    Setup connection
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
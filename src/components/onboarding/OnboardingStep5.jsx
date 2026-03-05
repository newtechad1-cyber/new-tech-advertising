import React from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';

const PLATFORMS = [
  { key: 'meta', label: 'Meta (Facebook + Instagram)', icon: '📘', desc: 'Auto-post to your Facebook Page and Instagram Business account', connectFn: 'startMetaConnect' },
  { key: 'linkedin', label: 'LinkedIn', icon: '💼', desc: 'Coming soon', disabled: true },
  { key: 'google', label: 'Google Business', icon: '🔍', desc: 'Coming soon', disabled: true },
];

export default function OnboardingStep5({ data, accountId, metaConnected }) {
  const [connecting, setConnecting] = React.useState(null);

  const handleConnect = async (platform) => {
    if (platform.disabled) return;
    setConnecting(platform.key);
    if (platform.key === 'meta') {
      const res = await base44.functions.invoke('startMetaConnect', { accountId });
      if (res.data?.authUrl) window.location.href = res.data.authUrl;
    }
    setConnecting(null);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500 mb-4">Connect your social accounts so we can auto-publish content. You can skip and connect later.</p>
      {PLATFORMS.map(p => {
        const isConnected = p.key === 'meta' && metaConnected;
        return (
          <div key={p.key} className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 ${isConnected ? 'border-green-200 bg-green-50' : 'border-slate-200 bg-white'} ${p.disabled ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{p.icon}</span>
              <div>
                <p className="font-medium text-slate-800 text-sm">{p.label}</p>
                <p className="text-xs text-slate-500">{p.desc}</p>
              </div>
            </div>
            {isConnected ? (
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
            ) : (
              <Button
                size="sm"
                variant={p.disabled ? 'outline' : 'default'}
                disabled={p.disabled || connecting === p.key}
                onClick={() => handleConnect(p)}
                className={p.disabled ? '' : 'bg-blue-600 hover:bg-blue-700 text-white'}
              >
                {connecting === p.key ? <Loader2 className="w-3 h-3 animate-spin" /> : p.disabled ? 'Soon' : 'Connect'}
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
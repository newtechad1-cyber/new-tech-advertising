import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import PlatformCard from '@/components/social/PlatformCard';
import ConnectModal from '@/components/social/ConnectModal';
import MetaConnectCard from '@/components/social/MetaConnectCard';
import { RefreshCw } from 'lucide-react';

const PLATFORMS = ['facebook', 'instagram', 'youtube', 'google_my_business', 'tiktok', 'linkedin'];

const platformMeta = {
  facebook: { name: 'Facebook' },
  instagram: { name: 'Instagram' },
  youtube: { name: 'YouTube' },
  google_my_business: { name: 'Google My Business' },
  tiktok: { name: 'TikTok' },
  linkedin: { name: 'LinkedIn' },
};

export default function SocialAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectingAccount, setConnectingAccount] = useState(null);

  const accountId = new URLSearchParams(window.location.search).get('account_id');

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.SocialAccount.list();
    setAccounts(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Build a unified list: one slot per platform
  const platformSlots = PLATFORMS.map(platform => {
    const existing = accounts.find(a => a.platform === platform);
    return existing || { platform, status: 'disconnected', account_name: platformMeta[platform].name };
  });

  const connected = platformSlots.filter(a => a.status === 'connected').length;

  const handleConnect = (account) => {
    setConnectingAccount(account);
  };

  const handleDisconnect = async (account) => {
    if (!account.id) return;
    await base44.entities.SocialAccount.update(account.id, { status: 'disconnected' });
    load();
  };

  const handleSaved = () => {
    setConnectingAccount(null);
    load();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Social Accounts</h1>
            <p className="text-slate-500 mt-1">
              {connected} of {PLATFORMS.length} platforms connected
            </p>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 rounded-full h-2 mb-8">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(connected / PLATFORMS.length) * 100}%` }}
          />
        </div>

        {/* Platform Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLATFORMS.map(p => (
              <div key={p} className="rounded-xl border-2 border-slate-100 bg-slate-50 p-5 animate-pulse h-36" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {platformSlots.map(account => (
              <PlatformCard
                key={account.platform}
                account={account}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
              />
            ))}
          </div>
        )}

        {/* Info Note */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
          <strong>Note:</strong> Connecting a social account allows the platform to post, schedule, and sync analytics on your behalf. Each platform requires its own account credentials.
        </div>
      </div>

      <ConnectModal
        account={connectingAccount}
        open={!!connectingAccount}
        onClose={() => setConnectingAccount(null)}
        onSaved={handleSaved}
      />
    </div>
  );
}
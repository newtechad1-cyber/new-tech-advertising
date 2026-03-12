import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const CHANNEL_CONFIG = {
  facebook: { label: 'Facebook', icon: '👥', color: '#1877f2' },
  instagram: { label: 'Instagram', icon: '📷', color: '#e4405f' },
  google_business: { label: 'Google Business', icon: '🔍', color: '#4285f4' },
  youtube: { label: 'YouTube', icon: '📹', color: '#ff0000' },
  tiktok: { label: 'TikTok', icon: '🎵', color: '#000000' },
  website: { label: 'Website', icon: '🌐', color: '#6b7280' },
  email: { label: 'Email', icon: '✉️', color: '#ea580c' },
  sms: { label: 'SMS', icon: '💬', color: '#25d366' },
};

const STATUS_CONFIG = {
  connected: { label: 'Connected', badge: 'bg-emerald-100 text-emerald-700', color: '#10b981' },
  error: { label: 'Connection Error', badge: 'bg-red-100 text-red-700', color: '#ef4444' },
  expired: { label: 'Permission Expired', badge: 'bg-orange-100 text-orange-700', color: '#f97316' },
  pending: { label: 'Pending Approval', badge: 'bg-blue-100 text-blue-700', color: '#3b82f6' },
  disconnected: { label: 'Not Connected', badge: 'bg-slate-100 text-slate-700', color: '#94a3b8' },
};

export default function ClientChannels() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState(null);

  useEffect(() => {
    base44.entities.MarketingChannelConnection.list('-connection_status', 100)
      .then(data => {
        setConnections(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600 text-sm animate-pulse">Loading your channels…</div>
      </div>
    );
  }

  const connected = connections.filter(c => c.connection_status === 'connected').length;
  const issues = connections.filter(c => ['error', 'expired', 'disconnected'].includes(c.connection_status)).length;

  // Publish readiness
  const publishReady = connected > 0 && !connections.some(c => ['error', 'expired'].includes(c.connection_status));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">🔗</div>
            <h1 className="text-3xl font-black text-slate-900">Your Channel Connections</h1>
          </div>
          <p className="text-slate-600 text-sm">View and manage your marketing channel status</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Health Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Channels Connected</p>
            <p className="text-3xl font-black text-emerald-600">{connected}</p>
            <p className="text-xs text-slate-600 mt-2">Ready to use</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Needs Attention</p>
            <p className="text-3xl font-black text-orange-600">{issues}</p>
            <p className="text-xs text-slate-600 mt-2">Requires action</p>
          </div>

          <div className={`rounded-2xl p-5 shadow-sm border-2 ${
            publishReady
              ? 'bg-emerald-50 border-emerald-300'
              : 'bg-orange-50 border-orange-300'
          }`}>
            <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${
              publishReady ? 'text-emerald-700' : 'text-orange-700'
            }`}>Publish Status</p>
            <p className={`text-2xl font-black ${
              publishReady ? 'text-emerald-600' : 'text-orange-600'
            }`}>
              {publishReady ? '✓ Ready' : '⚠️ Not Ready'}
            </p>
            <p className={`text-xs mt-2 ${
              publishReady ? 'text-emerald-700' : 'text-orange-700'
            }`}>
              {publishReady ? 'Safe to publish' : 'Fix issues first'}
            </p>
          </div>
        </div>

        {/* Channel Cards */}
        <div>
          <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Your Marketing Channels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {connections.map(channel => {
              const channelCfg = CHANNEL_CONFIG[channel.channel_type];
              const statusCfg = STATUS_CONFIG[channel.connection_status];
              const isHealthy = channel.connection_status === 'connected';
              return (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={`rounded-2xl p-6 text-center transition-all hover:shadow-lg border-2 ${
                    isHealthy
                      ? 'bg-white border-emerald-200'
                      : 'bg-white border-orange-200'
                  }`}
                >
                  <div className="text-4xl mb-3">{channelCfg.icon}</div>
                  <h4 className="text-sm font-black text-slate-900 mb-2">{channelCfg.label}</h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded inline-block mb-3 ${statusCfg.badge}`}>
                    {statusCfg.label}
                  </span>
                  {channel.connected_account_name && (
                    <p className="text-xs text-slate-600">{channel.connected_account_name}</p>
                  )}
                  {!isHealthy && (
                    <div className="mt-3 pt-3 border-t border-slate-200 text-xs font-bold text-orange-600">
                      Action Required
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-sm font-black text-blue-900 mb-3">Need Help?</h3>
          <p className="text-sm text-blue-800 mb-4">
            If a channel shows an error or needs reconnection, click the channel card to see details and reconnect. Contact support if you need additional help.
          </p>
          <button className="text-sm font-bold text-blue-700 hover:text-blue-900">
            📖 View Channel Guide →
          </button>
        </div>

      </div>

      {/* Detail Modal */}
      {selectedChannel && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{CHANNEL_CONFIG[selectedChannel.channel_type].icon}</div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{CHANNEL_CONFIG[selectedChannel.channel_type].label}</h3>
                  <span className={`text-sm font-bold px-2 py-1 rounded inline-block mt-2 ${STATUS_CONFIG[selectedChannel.connection_status].badge}`}>
                    {STATUS_CONFIG[selectedChannel.connection_status].label}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedChannel(null)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <div className="space-y-6 mb-6 pb-6 border-b border-slate-200">
              {selectedChannel.connected_account_name && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Connected Account</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedChannel.connected_account_name}</p>
                </div>
              )}

              {selectedChannel.permission_level_summary && (
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Permissions</p>
                  <p className="text-sm text-slate-700">{selectedChannel.permission_level_summary}</p>
                </div>
              )}

              {selectedChannel.last_successful_sync && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">Last Synced</p>
                  <p className="text-sm font-semibold text-emerald-900">{selectedChannel.last_successful_sync}</p>
                </div>
              )}

              {selectedChannel.last_error_message && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-red-600 mb-1">Issue Details</p>
                  <p className="text-sm text-red-900">{selectedChannel.last_error_message}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {selectedChannel.connection_status === 'connected' && (
                <button className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 text-sm font-bold py-2 rounded-lg transition-colors">
                  ✓ Status: Connected and Working
                </button>
              )}
              {['disconnected', 'error', 'expired'].includes(selectedChannel.connection_status) && (
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                  🔗 Reconnect This Channel
                </button>
              )}
              {selectedChannel.connection_status === 'pending' && (
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                  ⏳ Complete Connection
                </button>
              )}
              <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-bold py-2 rounded-lg transition-colors">
                📖 View Help Guide
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
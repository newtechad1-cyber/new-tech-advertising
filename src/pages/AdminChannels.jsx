import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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
  connected: { label: 'Connected', badge: 'bg-emerald-100 text-emerald-700', color: '#10b981', indicator: '✓' },
  error: { label: 'Error', badge: 'bg-red-100 text-red-700', color: '#ef4444', indicator: '!' },
  expired: { label: 'Expired', badge: 'bg-orange-100 text-orange-700', color: '#f97316', indicator: '⚠️' },
  pending: { label: 'Pending', badge: 'bg-blue-100 text-blue-700', color: '#3b82f6', indicator: '…' },
  disconnected: { label: 'Disconnected', badge: 'bg-slate-100 text-slate-700', color: '#94a3b8', indicator: '○' },
};

export default function AdminChannels() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterChannel, setFilterChannel] = useState('all');

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
        <div className="text-slate-600 text-sm animate-pulse">Loading channel connections…</div>
      </div>
    );
  }

  // Filter connections
  const filtered = connections.filter(c => {
    if (filterStatus !== 'all' && c.connection_status !== filterStatus) return false;
    if (filterChannel !== 'all' && c.channel_type !== filterChannel) return false;
    return true;
  });

  // KPIs
  const connected = connections.filter(c => c.connection_status === 'connected').length;
  const errors = connections.filter(c => c.connection_status === 'error').length;
  const disconnected = connections.filter(c => c.connection_status === 'disconnected').length;
  const expired = connections.filter(c => c.connection_status === 'expired').length;
  const lastSuccessfulSync = connections
    .filter(c => c.last_successful_sync)
    .sort((a, b) => new Date(b.last_successful_sync) - new Date(a.last_successful_sync))[0]?.last_successful_sync;

  // Channel distribution
  const channelDistribution = Object.keys(CHANNEL_CONFIG).map(type => ({
    name: CHANNEL_CONFIG[type].label,
    connected: connections.filter(c => c.channel_type === type && c.connection_status === 'connected').length,
    error: connections.filter(c => c.channel_type === type && c.connection_status === 'error').length,
    disconnected: connections.filter(c => c.channel_type === type && c.connection_status === 'disconnected').length,
    other: connections.filter(c => c.channel_type === type && !['connected', 'error', 'disconnected'].includes(c.connection_status)).length,
  })).filter(item => item.connected + item.error + item.disconnected + item.other > 0);

  // Issues
  const issues = [];
  const expiredConns = connections.filter(c => c.connection_status === 'expired');
  if (expiredConns.length > 0) {
    issues.push({
      severity: 'high',
      title: `${expiredConns.length} Channel Permission(s) Expired`,
      affected: expiredConns.map(c => CHANNEL_CONFIG[c.channel_type].label).join(', '),
      fix: 'Reconnect channels to refresh permissions. Publishing will fail without valid tokens.',
    });
  }

  const errorConns = connections.filter(c => c.connection_status === 'error');
  if (errorConns.length > 0) {
    issues.push({
      severity: 'high',
      title: `${errorConns.length} Channel(s) Showing Connection Errors`,
      affected: errorConns.map(c => CHANNEL_CONFIG[c.channel_type].label).join(', '),
      fix: 'Click channel card to see error details. May require account permission review.',
    });
  }

  const pendingConns = connections.filter(c => c.connection_status === 'pending');
  if (pendingConns.length > 0) {
    issues.push({
      severity: 'medium',
      title: `${pendingConns.length} Channel Connection(s) Pending Approval`,
      affected: pendingConns.map(c => CHANNEL_CONFIG[c.channel_type].label).join(', '),
      fix: 'Check connected accounts for approval prompts. Complete OAuth flow to activate channels.',
    });
  }

  const disconnectedConns = connections.filter(c => c.connection_status === 'disconnected');
  if (disconnectedConns.length > 0) {
    issues.push({
      severity: 'low',
      title: `${disconnectedConns.length} Channel(s) Not Connected`,
      affected: disconnectedConns.map(c => CHANNEL_CONFIG[c.channel_type].label).join(', '),
      fix: 'Connect channels to enable publishing. Publishing will only work on connected channels.',
    });
  }

  // Publish readiness
  const publishReadiness = [
    { step: 'Content Ready', status: true, icon: '📝' },
    { step: 'Channels Ready', status: connected > 0, icon: '🔗' },
    { step: 'Approval Complete', status: errors === 0 && expired === 0, icon: '✓' },
    { step: 'Safe to Publish', status: connected > 0 && errors === 0 && expired === 0, icon: '🚀' },
  ];

  const handleStatusUpdate = async (connectionId, newStatus) => {
    await base44.entities.MarketingChannelConnection.update(connectionId, { connection_status: newStatus });
    setConnections(connections.map(c => c.id === connectionId ? { ...c, connection_status: newStatus } : c));
    setSelectedChannel(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">🔗</div>
            <h1 className="text-3xl font-black text-slate-900">Channel Connections</h1>
          </div>
          <p className="text-slate-600 text-sm">Centralized control interface for connecting and monitoring all marketing channels</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Channels Connected</p>
            <p className="text-3xl font-black text-emerald-600">{connected}</p>
            <p className="text-xs text-slate-600 mt-2">Ready to publish</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Channels With Errors</p>
            <p className="text-3xl font-black text-red-600">{errors}</p>
            <p className="text-xs text-slate-600 mt-2">Require attention</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Channels Disconnected</p>
            <p className="text-3xl font-black text-slate-600">{disconnected}</p>
            <p className="text-xs text-slate-600 mt-2">Not active</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Expired Permissions</p>
            <p className="text-3xl font-black text-orange-600">{expired}</p>
            <p className="text-xs text-slate-600 mt-2">Need refresh</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Last Successful Publish</p>
            <p className="text-sm font-black text-slate-900">{lastSuccessfulSync || 'Never'}</p>
            <p className="text-xs text-slate-600 mt-2">Across all channels</p>
          </div>
        </div>

        {/* SECTION 6 — Publish Readiness Indicator */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Publish Readiness</h3>
          <div className="flex gap-2">
            {publishReadiness.map((item, idx) => (
              <div key={idx} className="flex-1">
                <div className={`rounded-lg p-4 text-center transition-all ${
                  item.status
                    ? 'bg-emerald-100 border border-emerald-300'
                    : 'bg-slate-100 border border-slate-300'
                }`}>
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className={`text-xs font-bold ${item.status ? 'text-emerald-700' : 'text-slate-600'}`}>
                    {item.step}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className={`mt-4 p-3 rounded-lg text-sm font-bold ${
            publishReadiness[3].status
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {publishReadiness[3].status ? '✓ Safe to publish' : '⚠️ Not ready for publishing'}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="connected">Connected</option>
            <option value="error">Error</option>
            <option value="expired">Expired</option>
            <option value="pending">Pending</option>
            <option value="disconnected">Disconnected</option>
          </select>
          <select
            value={filterChannel}
            onChange={(e) => setFilterChannel(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg"
          >
            <option value="all">All Channels</option>
            {Object.entries(CHANNEL_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
        </div>

        {/* SECTION 2 — Channel Status Grid */}
        <div>
          <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Channel Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map(channel => {
              const channelCfg = CHANNEL_CONFIG[channel.channel_type];
              const statusCfg = STATUS_CONFIG[channel.connection_status];
              return (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className="rounded-2xl p-6 text-center transition-all hover:shadow-lg bg-white border border-slate-200"
                >
                  <div className="text-4xl mb-3">{channelCfg.icon}</div>
                  <h4 className="text-sm font-black text-slate-900 mb-2">{channelCfg.label}</h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded inline-block mb-3 ${statusCfg.badge}`}>
                    {statusCfg.indicator} {statusCfg.label}
                  </span>
                  {channel.connected_account_name && (
                    <p className="text-xs text-slate-600 mb-2">Account: {channel.connected_account_name}</p>
                  )}
                  {channel.last_successful_sync && (
                    <p className="text-xs text-slate-600">Synced: {channel.last_successful_sync}</p>
                  )}
                  {channel.reconnect_required && (
                    <div className="mt-3 pt-3 border-t border-slate-200 text-xs font-bold text-orange-600">
                      Reconnection Required
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 4 — Channel Reliability Chart */}
        {channelDistribution.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Channel Connection Reliability</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelDistribution} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="connected" stackId="a" fill="#10b981" />
                <Bar dataKey="error" stackId="a" fill="#ef4444" />
                <Bar dataKey="disconnected" stackId="a" fill="#94a3b8" />
                <Bar dataKey="other" stackId="a" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* SECTION 5 — Integration Issue Feed */}
        {issues.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Channel Issues</h3>
            <div className="space-y-3">
              {issues.map((issue, idx) => {
                const severityColor = issue.severity === 'high' ? 'bg-red-50 border-red-200' : issue.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200';
                const severityText = issue.severity === 'high' ? 'text-red-900' : issue.severity === 'medium' ? 'text-yellow-900' : 'text-blue-900';
                const icon = issue.severity === 'high' ? '🚨' : issue.severity === 'medium' ? '⚠️' : 'ℹ️';
                return (
                  <div key={idx} className={`border rounded-xl p-5 ${severityColor}`}>
                    <div className="flex items-start gap-4">
                      <div className="text-2xl flex-shrink-0">{icon}</div>
                      <div className="flex-1">
                        <h4 className={`text-sm font-black ${severityText}`}>{issue.title}</h4>
                        <p className={`text-sm mt-1 ${severityText}`}>
                          <span className="font-bold">Affected: </span>{issue.affected}
                        </p>
                        <div className={`mt-2 text-xs font-bold ${severityText}`}>
                          <span className="font-black">Action: </span>{issue.fix}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Permission Level</p>
                  <p className="text-sm text-slate-700">{selectedChannel.permission_level_summary}</p>
                </div>
              )}

              {selectedChannel.last_successful_sync && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">Last Successful Sync</p>
                  <p className="text-sm font-semibold text-emerald-900">{selectedChannel.last_successful_sync}</p>
                </div>
              )}

              {selectedChannel.last_error_message && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-red-600 mb-1">Last Error</p>
                  <p className="text-sm text-red-900">{selectedChannel.last_error_message}</p>
                </div>
              )}

              {selectedChannel.test_publish_status !== 'not_tested' && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Test Publish Status</p>
                  <p className={`text-sm font-semibold ${
                    selectedChannel.test_publish_status === 'success'
                      ? 'text-emerald-700'
                      : 'text-red-700'
                  }`}>
                    {selectedChannel.test_publish_status === 'success' ? '✓ Test Successful' : '✗ Test Failed'}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {selectedChannel.connection_status === 'connected' && (
                <>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                    🧪 Run Test Publish
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedChannel.id, 'disconnected')}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ↔️ Disconnect Channel
                  </button>
                </>
              )}
              {(selectedChannel.connection_status === 'disconnected' || selectedChannel.connection_status === 'error' || selectedChannel.connection_status === 'expired') && (
                <button
                  onClick={() => handleStatusUpdate(selectedChannel.id, 'pending')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  🔗 Connect Channel
                </button>
              )}
              {selectedChannel.reconnect_required && (
                <button
                  onClick={() => handleStatusUpdate(selectedChannel.id, 'connected')}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  ⚡ Reconnect Now
                </button>
              )}
              <button className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 text-sm font-bold py-2 rounded-lg transition-colors">
                📖 View Troubleshooting Guide
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import ConnectionCard from '../components/publishing/ConnectionCard';
import { RefreshCw, Plus, Search } from 'lucide-react';

const PROVIDERS = ['google_business_profile', 'youtube', 'facebook', 'instagram'];

export default function ChannelConnections() {
  const [clients, setClients] = useState([]);
  const [connections, setConnections] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    loadAll();
    // Check for OAuth return params
    const params = new URLSearchParams(window.location.search);
    const oauthSuccess = params.get('oauth_success');
    const oauthError = params.get('oauth_error');
    const account = params.get('account');
    const missingScopes = params.get('missing_scopes');
    const pagesCount = params.get('pages_count');
    const autoSelected = params.get('auto_selected');

    if (oauthSuccess === 'facebook') {
      window.history.replaceState({}, '', window.location.pathname);
      if (autoSelected) {
        showNotice('success', `Facebook connected — Page "${autoSelected}" auto-selected and ready to publish!`);
      } else if (pagesCount === '0') {
        showNotice('error', `Facebook connected but no Pages found for "${account}". Make sure you manage a Facebook Page.`);
      } else {
        showNotice('success', `Facebook connected as ${account} — ${pagesCount || 'multiple'} Page${pagesCount !== '1' ? 's' : ''} found. Select a Page to start publishing.`);
      }
      if (missingScopes) {
        showNotice('error', `Warning: missing permissions: ${missingScopes}. Reconnect Facebook to grant all required permissions.`);
      }
      loadAll();
      return;
    }

    if (oauthSuccess) {
      showNotice('success', `Connected ${oauthSuccess}${account ? ` — ${account}` : ''}! Loading destinations…`);
      window.history.replaceState({}, '', window.location.pathname);
      // Auto-refresh GBP locations after connect (slight delay to ensure connection is saved)
      if (oauthSuccess === 'google_business_profile') {
        setTimeout(async () => {
          const [cn] = await Promise.all([base44.entities.ChannelConnection.list('-updated_date', 300)]);
          setConnections(cn);
          // Find the freshly connected GBP connection and trigger location sync (once only)
          const freshConn = cn.find(c => c.provider === 'google_business_profile' && c.status === 'connected');
          if (freshConn) {
            // Skip auto-sync if an active cooldown is already on this connection
            const cooldownUntil = freshConn.dest_sync_cooldown_until ? new Date(freshConn.dest_sync_cooldown_until) : null;
            if (cooldownUntil && cooldownUntil > new Date()) {
              const mins = Math.ceil((cooldownUntil - Date.now()) / 60000);
              showNotice('info', `GBP connected. Rate-limit cooldown active (~${mins}m). Use Refresh Locations after cooldown expires.`);
              loadAll();
            } else {
              try {
                const res = await base44.functions.invoke('fetchGBPLocations', { connection_id: freshConn.id });
                const d = res?.data;
                if (d?.success) {
                  showNotice('success', `GBP connected — ${d.locations?.length || 0} location${d.locations?.length !== 1 ? 's' : ''} loaded${d.auto_selected ? `. Auto-selected: ${d.auto_selected}` : '. Select a destination below.'}`);
                } else if (d?.cooldown) {
                  showNotice('info', `GBP connected. ${d.error} Use Refresh Locations to retry.`);
                } else {
                  showNotice('error', `Connected but location sync failed: ${d?.error || 'unknown error'}. Use Refresh Locations to retry.`);
                }
                loadAll();
              } catch (err) {
                showNotice('error', `Connected but location sync failed: ${err.message}`);
                loadAll();
              }
            }
          }
        }, 1500);
      }
    } else if (oauthError) {
      showNotice('error', `OAuth failed: ${oauthError}`);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const [c, cn] = await Promise.all([
      base44.entities.Clients.filter({ archived: false }),
      base44.entities.ChannelConnection.list('-updated_date', 300),
    ]);
    setClients(c);
    setConnections(cn);
    setLoading(false);
  };

  const showNotice = (type, msg) => { setNotice({ type, msg }); setTimeout(() => setNotice(null), 4000); };

  const getConnection = (clientId, provider) =>
    connections.find(c => c.client_id === clientId && c.provider === provider);

  const handleConnect = async (provider, clientId, clientName) => {
    try {
      let res;
      if (provider === 'facebook') {
        // Facebook uses its own dedicated OAuth start function
        res = await base44.functions.invoke('facebookOAuthStart', {
          client_id: clientId,
          client_name: clientName,
          enable_video: true,
        });
      } else {
        res = await base44.functions.invoke('channelOAuthStart', {
          provider, client_id: clientId, client_name: clientName,
        });
      }
      if (res?.data?.auth_url) {
        window.location.href = res.data.auth_url;
      }
    } catch (err) {
      showNotice('error', 'Failed to start OAuth: ' + err.message);
    }
  };

  const filteredClients = clients.filter(c =>
    !search || c.business_name.toLowerCase().includes(search.toLowerCase())
  );

  const totalConnected = connections.filter(c => c.status === 'connected').length;
  const totalExpired = connections.filter(c => c.status === 'expired').length;
  const totalErrors = connections.filter(c => c.status === 'error').length;

  return (
    <AgencyLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Channel Connections</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage OAuth connections for publishing channels</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadAll} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-emerald-400">{totalConnected}</p>
            <p className="text-slate-500 text-xs mt-0.5">Connected</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-amber-400">{totalExpired}</p>
            <p className="text-slate-500 text-xs mt-0.5">Expired</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-red-400">{totalErrors}</p>
            <p className="text-slate-500 text-xs mt-0.5">Errors</p>
          </div>
        </div>

        {/* Notice */}
        {notice && (
          <div className={`px-4 py-3 rounded-lg text-sm font-medium border ${
            notice.type === 'success' ? 'bg-emerald-900/40 border-emerald-700 text-emerald-300' :
            notice.type === 'error'   ? 'bg-red-900/30 border-red-800 text-red-300' :
            'bg-blue-900/30 border-blue-800 text-blue-300'
          }`}>
            {notice.msg}
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>

        {/* Client connection grids */}
        {loading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-slate-900 rounded-xl animate-pulse" />)}</div>
        ) : filteredClients.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <p className="text-slate-500 text-sm">No clients found. Add clients first.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredClients.map(client => (
              <div key={client.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-white">{client.business_name}</h2>
                    <p className="text-xs text-slate-500">{client.city ? `${client.city}, ${client.state}` : ''}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {PROVIDERS.map(p => {
                      const conn = getConnection(client.id, p);
                      const dot = conn?.status === 'connected' ? 'bg-emerald-500' :
                                  conn?.status === 'expired'   ? 'bg-amber-500' :
                                  conn?.status === 'error'     ? 'bg-red-500' : 'bg-slate-700';
                      return <span key={p} className={`w-2 h-2 rounded-full ${dot}`} title={p} />;
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                  {PROVIDERS.map(provider => (
                    <ConnectionCard
                      key={provider}
                      provider={provider}
                      connection={getConnection(client.id, provider)}
                      clientId={client.id}
                      clientName={client.business_name}
                      onConnect={(p) => handleConnect(p, client.id, client.business_name)}
                      onRefresh={loadAll}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AgencyLayout>
  );
}
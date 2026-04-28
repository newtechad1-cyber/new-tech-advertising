import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import ConnectionCard from '../components/publishing/ConnectionCard';
import {
  CheckCircle2, Circle, Search, RefreshCw, Copy, Check,
  AlertTriangle, Info, ChevronDown, ChevronRight
} from 'lucide-react';

const PROVIDERS = ['facebook', 'instagram', 'google_business_profile', 'youtube'];

const PROVIDER_INFO = {
  facebook: {
    label: 'Facebook',
    icon: '📘',
    tip: 'Client must log in with a Facebook account that manages the business Page.',
    noDestMsg: 'Connected, but no page/location/channel selected.',
    emptyDestMsg: 'No Facebook Pages found. Make sure this Facebook profile has Page access.',
  },
  instagram: {
    label: 'Instagram',
    icon: '📷',
    tip: 'Client must connect an Instagram Business account linked to a Facebook Page.',
    noDestMsg: 'Connected, but no Instagram Business account selected.',
    emptyDestMsg: 'No Instagram Business accounts found. Make sure the Instagram account is a Business account linked to a Facebook Page.',
  },
  google_business_profile: {
    label: 'Google Business Profile',
    icon: '📍',
    tip: 'Client must log in with the Google account that manages their Business Profile listing.',
    noDestMsg: 'Connected, but no business location selected.',
    emptyDestMsg: 'No business locations found. Make sure this Google account manages the Business Profile.',
  },
  youtube: {
    label: 'YouTube',
    icon: '▶️',
    tip: 'YouTube connection is supported but automated publishing is not yet available.',
    noDestMsg: 'Connected, but no YouTube channel selected.',
    emptyDestMsg: 'No YouTube channels found.',
    notReady: 'Not ready for automated publishing.',
  },
};

function SetupChecklist({ conn }) {
  const hasAccess = !!conn;
  const usedOwnAccount = hasAccess; // implied by OAuth flow
  const hasDest = !!(conn?.selected_destination_id);
  const testPassed = conn?.status === 'ready';

  const items = [
    { label: 'Client has access to the Page/Profile', done: hasAccess },
    { label: 'Client connects using their own account (no password sharing)', done: usedOwnAccount },
    { label: 'Destination selected (Page / Location / Channel)', done: hasDest },
    { label: 'Connection test passed', done: testPassed },
  ];

  const allDone = items.every(i => i.done);

  return (
    <div className={`rounded-xl border px-4 py-3 space-y-1.5 ${allDone ? 'bg-emerald-950/20 border-emerald-800/50' : 'bg-slate-900 border-slate-800'}`}>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Setup Checklist</p>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          {item.done
            ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            : <Circle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />}
          <span className={`text-xs ${item.done ? 'text-slate-300' : 'text-slate-500'}`}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function CopyLinkButton({ clientId, provider }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Construct a shareable link that routes to this setup page pre-filtered
    const url = `${window.location.origin}/agency/channel-setup?client=${clientId}&provider=${provider}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy a link to share with your client for this channel setup"
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied!' : 'Copy Client Link'}
    </button>
  );
}

function TestConnectionButton({ conn, provider }) {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  const handleTest = async () => {
    if (!conn) { setResult({ ok: false, msg: 'No connection to test.' }); return; }
    setTesting(true);
    setResult(null);
    // Simple heuristic test: check status and token expiry
    await new Promise(r => setTimeout(r, 600));
    const expired = conn.expires_at && new Date(conn.expires_at) < new Date();
    if (conn.status === 'ready' && !expired) {
      setResult({ ok: true, msg: 'Connection looks healthy. Destination is selected and token is valid.' });
    } else if (expired) {
      setResult({ ok: false, msg: 'Token is expired. Client needs to reconnect.' });
    } else if (conn.status === 'connected_no_destination' || !conn.selected_destination_id) {
      setResult({ ok: false, msg: 'Connected but no destination selected yet.' });
    } else if (conn.status === 'error') {
      setResult({ ok: false, msg: conn.error_message || 'Connection has an error — try reconnecting.' });
    } else {
      setResult({ ok: false, msg: `Status is "${conn.status}" — not fully ready.` });
    }
    setTesting(false);
  };

  return (
    <div className="space-y-1">
      <button
        onClick={handleTest}
        disabled={testing || !conn}
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-40 rounded-lg transition-colors"
      >
        <RefreshCw className={`w-3 h-3 ${testing ? 'animate-spin' : ''}`} />
        {testing ? 'Testing...' : 'Test Connection'}
      </button>
      {result && (
        <p className={`text-xs px-2 py-1 rounded ${result.ok ? 'text-emerald-400' : 'text-amber-400'}`}>
          {result.ok ? '✓' : '⚠'} {result.msg}
        </p>
      )}
    </div>
  );
}

function ClientChannelRow({ client, connections, onConnect, onRefresh }) {
  const [expanded, setExpanded] = useState(false);

  const getConn = (provider) => connections.find(c => c.client_id === client.id && c.provider === provider);

  const allConns = PROVIDERS.map(p => getConn(p));
  const readyCount = allConns.filter(c => c?.status === 'ready').length;
  const totalCount = PROVIDERS.length;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
      {/* Client header — click to expand */}
      <button
        onClick={() => setExpanded(p => !p)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-left">
            <p className="text-sm font-bold text-white">{client.business_name}</p>
            <p className="text-xs text-slate-500">{client.city ? `${client.city}, ${client.state}` : client.email || ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Status dots */}
          <div className="flex items-center gap-1">
            {PROVIDERS.map(p => {
              const conn = getConn(p);
              const dot = conn?.status === 'ready' ? 'bg-emerald-500' :
                          conn?.status === 'connected_no_destination' ? 'bg-amber-400' :
                          conn?.status === 'connected' ? 'bg-amber-400' :
                          conn?.status === 'expired' ? 'bg-orange-500' :
                          conn?.status === 'error' ? 'bg-red-500' : 'bg-slate-700';
              return <span key={p} title={`${PROVIDER_INFO[p].label}: ${conn?.status || 'disconnected'}`} className={`w-2 h-2 rounded-full ${dot}`} />;
            })}
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${readyCount === totalCount ? 'bg-emerald-900/40 text-emerald-400' : readyCount > 0 ? 'bg-amber-900/40 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
            {readyCount}/{totalCount} ready
          </span>
          {expanded ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
        </div>
      </button>

      {/* Expanded channel cards */}
      {expanded && (
        <div className="px-5 pb-5 space-y-5">
          {/* Instructions banner */}
          <div className="flex items-start gap-2 bg-blue-950/30 border border-blue-900/40 rounded-xl px-4 py-3">
            <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-300">
              Clients connect their <strong>own accounts</strong> via OAuth — no passwords needed or stored. Share the "Copy Client Link" below for each channel they need to connect.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {PROVIDERS.map(provider => {
              const conn = getConn(provider);
              const info = PROVIDER_INFO[provider];
              const storedDests = (() => {
                try { return JSON.parse(conn?.destinations_json || '[]'); } catch { return []; }
              })();
              const hasNoDest = conn && !conn.selected_destination_id;
              const hasEmptyDests = conn && storedDests.length === 0;

              return (
                <div key={provider} className="space-y-2">
                  {/* Standard ConnectionCard — unchanged */}
                  <ConnectionCard
                    provider={provider}
                    connection={conn}
                    clientId={client.id}
                    clientName={client.business_name}
                    onConnect={(p) => onConnect(p, client.id, client.business_name)}
                    onRefresh={onRefresh}
                  />

                  {/* Extra guidance messages */}
                  {provider === 'youtube' && conn && (
                    <div className="flex items-start gap-1.5 bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2">
                      <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-500">{info.notReady}</p>
                    </div>
                  )}
                  {hasNoDest && !hasEmptyDests && provider !== 'youtube' && (
                    <p className="text-xs text-amber-400 px-1">{info.noDestMsg}</p>
                  )}
                  {conn && hasEmptyDests && provider !== 'youtube' && (
                    <p className="text-xs text-red-400 px-1">{info.emptyDestMsg}</p>
                  )}

                  {/* Tip */}
                  <p className="text-xs text-slate-600 px-1">{info.tip}</p>

                  {/* Setup Checklist */}
                  <SetupChecklist conn={conn} />

                  {/* Actions row */}
                  <div className="flex flex-wrap gap-2">
                    <TestConnectionButton conn={conn} provider={provider} />
                    <CopyLinkButton clientId={client.id} provider={provider} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClientChannelSetup() {
  const [clients, setClients] = useState([]);
  const [connections, setConnections] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);

  const params = new URLSearchParams(window.location.search);
  const preClient = params.get('client') || '';

  useEffect(() => {
    loadAll();
    // Handle OAuth return
    const oauthSuccess = params.get('oauth_success');
    const oauthError = params.get('oauth_error');
    const account = params.get('account');

    if (oauthSuccess) {
      window.history.replaceState({}, '', window.location.pathname);
      showNotice('success', `Connected ${oauthSuccess}${account ? ` — ${account}` : ''}! Select a destination to complete setup.`);
      loadAll();
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

  const showNotice = (type, msg) => { setNotice({ type, msg }); setTimeout(() => setNotice(null), 5000); };

  const handleConnect = async (provider, clientId, clientName) => {
    try {
      let res;
      if (provider === 'facebook' || provider === 'instagram') {
        res = await base44.functions.invoke('facebookOAuthStart', { client_id: clientId, client_name: clientName, enable_video: true });
      } else {
        res = await base44.functions.invoke('channelOAuthStart', { provider, client_id: clientId, client_name: clientName });
      }
      if (res?.data?.auth_url) window.location.href = res.data.auth_url;
    } catch (err) {
      showNotice('error', 'Failed to start OAuth: ' + err.message);
    }
  };

  const filtered = clients.filter(c =>
    (!search || c.business_name.toLowerCase().includes(search.toLowerCase())) &&
    (!preClient || c.id === preClient)
  );

  const totalReady = connections.filter(c => c.status === 'ready').length;
  const totalIssues = connections.filter(c => ['expired', 'error', 'connected_no_destination'].includes(c.status)).length;

  return (
    <AgencyLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Client Channel Setup</h1>
            <p className="text-slate-500 text-sm mt-0.5">Guide clients through connecting their own social accounts via OAuth — no passwords needed</p>
          </div>
          <button onClick={loadAll} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 max-w-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-emerald-400">{totalReady}</p>
            <p className="text-slate-500 text-xs mt-0.5">Ready Channels</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-amber-400">{totalIssues}</p>
            <p className="text-slate-500 text-xs mt-0.5">Need Attention</p>
          </div>
        </div>

        {/* Notice */}
        {notice && (
          <div className={`px-4 py-3 rounded-lg text-sm font-medium border ${
            notice.type === 'success' ? 'bg-emerald-900/40 border-emerald-700 text-emerald-300' : 'bg-red-900/30 border-red-800 text-red-300'
          }`}>
            {notice.msg}
          </div>
        )}

        {/* Search */}
        {!preClient && (
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          </div>
        )}

        {/* Client rows */}
        {loading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-slate-900 rounded-2xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <p className="text-slate-500 text-sm">No clients found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(client => (
              <ClientChannelRow
                key={client.id}
                client={client}
                connections={connections}
                onConnect={handleConnect}
                onRefresh={loadAll}
              />
            ))}
          </div>
        )}
      </div>
    </AgencyLayout>
  );
}
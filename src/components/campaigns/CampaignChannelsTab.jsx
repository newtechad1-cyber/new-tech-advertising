import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { PLATFORM_ICON } from './CampaignUtils';

const STATUS_CONFIG = {
  connected:            { label: 'Connected',           color: 'bg-emerald-900/40 text-emerald-400 border-emerald-700' },
  expired:              { label: 'Expired',             color: 'bg-amber-900/40 text-amber-400 border-amber-700' },
  error:                { label: 'Error',               color: 'bg-red-900/40 text-red-400 border-red-700' },
  disconnected:         { label: 'Not Connected',       color: 'bg-slate-800 text-slate-500 border-slate-700' },
};

const PROVIDER_LABEL = {
  google_business_profile: { label: 'Google Business Profile', icon: '📍' },
  youtube:                 { label: 'YouTube',                  icon: '▶️' },
  facebook:                { label: 'Facebook',                 icon: '👥' },
  instagram:               { label: 'Instagram',                icon: '📸' },
};

export default function CampaignChannelsTab({ clients, connections }) {
  const connByClient = {};
  connections.forEach(c => {
    if (!connByClient[c.client_id]) connByClient[c.client_id] = [];
    connByClient[c.client_id].push(c);
  });

  const allClients = [
    { id: '__nta', business_name: 'NTA Internal', city: null },
    ...clients,
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{connections.filter(c => c.status === 'connected').length} connected channels across {clients.length} clients</p>
        <Link to="/agency/channel-connections" className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
          <ExternalLink className="w-3.5 h-3.5" /> Manage Connections
        </Link>
      </div>

      {allClients.map(client => {
        const clientConns = (client.id === '__nta'
          ? connections.filter(c => !c.client_id || c.client_id === 'unknown')
          : connByClient[client.id] || []
        );

        return (
          <div key={client.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
              <div>
                <p className="font-semibold text-white">{client.business_name}</p>
                <p className="text-xs text-slate-500">{client.city || (client.id === '__nta' ? 'Internal Brand' : '')}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {(['google_business_profile', 'facebook', 'instagram', 'youtube']).map(prov => {
                  const conn = clientConns.find(c => c.provider === prov);
                  const dot = conn?.status === 'connected' ? 'bg-emerald-500'
                            : conn?.status === 'expired'   ? 'bg-amber-500'
                            : conn?.status === 'error'     ? 'bg-red-500'
                            : 'bg-slate-700';
                  return <span key={prov} className={`w-2 h-2 rounded-full ${dot}`} title={prov} />;
                })}
              </div>
            </div>

            {clientConns.length === 0 ? (
              <div className="px-5 py-4 text-sm text-slate-600 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-slate-700" />
                No channels connected.
                <Link to="/agency/channel-connections" className="text-blue-500 hover:text-blue-300 text-xs">Connect →</Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {clientConns.map(c => {
                  const provCfg = PROVIDER_LABEL[c.provider] || { label: c.provider, icon: '📡' };
                  const statusCfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.disconnected;
                  return (
                    <div key={c.id} className="flex items-center gap-4 px-5 py-3">
                      <span className="text-lg">{provCfg.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{provCfg.label}</p>
                        <p className="text-xs text-slate-500">
                          {c.external_account_name || '—'}
                          {c.selected_destination_name ? ` → ${c.selected_destination_name}` : ''}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusCfg.color}`}>{statusCfg.label}</span>
                      {c.expires_at && (
                        <span className="text-xs text-slate-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(c.expires_at) < new Date() ? <span className="text-red-400">Expired</span> : new Date(c.expires_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <div className="text-center py-4">
        <Link to="/agency/channel-connections" className="text-xs text-blue-500 hover:text-blue-300">
          → Go to Channel Connections for full OAuth management
        </Link>
      </div>
    </div>
  );
}
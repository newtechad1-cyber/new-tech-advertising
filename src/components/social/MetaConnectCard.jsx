import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, WifiOff, Loader2, RefreshCw, Unlink } from 'lucide-react';
import MetaPageSelector from './MetaPageSelector';

const STATUS_CONFIG = {
  connected:     { label: 'Connected',     color: 'bg-green-100 text-green-800', icon: CheckCircle,  iconColor: 'text-green-500' },
  not_connected: { label: 'Not Connected', color: 'bg-slate-100 text-slate-600', icon: WifiOff,      iconColor: 'text-slate-400' },
  expired:       { label: 'Token Expired', color: 'bg-amber-100 text-amber-800', icon: AlertCircle,  iconColor: 'text-amber-500' },
  error:         { label: 'Error',         color: 'bg-red-100 text-red-800',     icon: AlertCircle,  iconColor: 'text-red-500' },
  blocked:       { label: 'Blocked',       color: 'bg-red-100 text-red-800',     icon: AlertCircle,  iconColor: 'text-red-500' },
};

export default function MetaConnectCard({ accountId }) {
  const [connection, setConnection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [showPageSelector, setShowPageSelector] = useState(false);

  const load = async () => {
    setLoading(true);
    const rows = await base44.entities.MetaConnection.filter({ account_id: accountId });
    setConnection(rows?.[0] || null);
    setLoading(false);
  };

  useEffect(() => { if (accountId) load(); }, [accountId]);

  const handleConnect = async () => {
    setConnecting(true);
    const res = await base44.functions.invoke('startMetaConnect', { accountId });
    setConnecting(false);
    if (res.data?.authUrl) {
      window.location.href = res.data.authUrl;
    }
  };

  const handleDisconnect = async () => {
    if (!connection) return;
    await base44.entities.MetaConnection.update(connection.id, {
      status: 'not_connected',
      facebook_page_id: null,
      facebook_page_name: null,
      instagram_business_account_id: null,
      instagram_username: null,
      page_access_token: null,
      available_pages: [],
      last_error: null,
    });
    load();
  };

  const handlePageSelected = () => {
    setShowPageSelector(false);
    load();
  };

  if (loading) return (
    <div className="rounded-xl border-2 border-slate-100 bg-white p-5 flex items-center gap-3 animate-pulse h-36" />
  );

  const status = connection?.status || 'not_connected';
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.not_connected;
  const Icon = cfg.icon;
  const hasPages = connection?.available_pages?.length > 0;

  return (
    <>
      <div className={`rounded-xl border-2 bg-white p-5 flex flex-col gap-3 transition-all ${status === 'connected' ? 'border-green-200' : status === 'expired' || status === 'error' ? 'border-amber-200' : 'border-slate-100'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📘</span>
            <div>
              <p className="font-semibold text-slate-800">Meta (Facebook + Instagram)</p>
              {status === 'connected' && connection?.facebook_page_name && (
                <p className="text-xs text-slate-500 truncate max-w-[200px]">
                  📄 {connection.facebook_page_name}
                  {connection.instagram_username && ` · 📷 @${connection.instagram_username}`}
                </p>
              )}
              {status !== 'connected' && (
                <Badge className={`${cfg.color} border-0 text-xs mt-0.5`}>{cfg.label}</Badge>
              )}
            </div>
          </div>
          <Icon className={`w-5 h-5 shrink-0 ${cfg.iconColor}`} />
        </div>

        {connection?.last_error && status !== 'connected' && (
          <p className="text-xs text-red-600 bg-red-50 rounded p-2 border border-red-100">{connection.last_error}</p>
        )}

        <div className="flex gap-2 mt-auto flex-wrap">
          {status === 'connected' ? (
            <>
              <Button variant="outline" size="sm" className="flex-1" onClick={handleConnect} disabled={connecting}>
                <RefreshCw className="w-3 h-3 mr-1.5" />Reconnect
              </Button>
              <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50" onClick={handleDisconnect}>
                <Unlink className="w-3 h-3 mr-1.5" />Disconnect
              </Button>
            </>
          ) : (
            <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleConnect} disabled={connecting}>
              {connecting ? <Loader2 className="w-3 h-3 animate-spin mr-1.5" /> : null}
              {status === 'expired' ? 'Reconnect' : 'Connect Meta'}
            </Button>
          )}
          {hasPages && (
            <Button variant="outline" size="sm" onClick={() => setShowPageSelector(true)}>
              Change Page
            </Button>
          )}
        </div>
      </div>

      <MetaPageSelector
        open={showPageSelector}
        accountId={accountId}
        pages={connection?.available_pages || []}
        onClose={() => setShowPageSelector(false)}
        onSelected={handlePageSelected}
      />
    </>
  );
}
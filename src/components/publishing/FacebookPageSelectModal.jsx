import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Users, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function FacebookPageSelectModal({ connection, onSaved, onClose }) {
  const [selecting, setSelecting] = useState(null);
  const [error, setError] = useState(null);

  const pages = (() => {
    if (!connection?.destinations_json) return [];
    try { return JSON.parse(connection.destinations_json); } catch { return []; }
  })();

  const handleSelect = async (page) => {
    setSelecting(page.id);
    setError(null);
    try {
      await base44.entities.ChannelConnection.update(connection.id, {
        selected_destination_id: page.id,
        selected_destination_name: page.name,
        // Store the page access token as the primary token for publishing
        access_token: page.access_token,
        status: 'connected',
        error_message: null,
      });

      // Log the destination save
      await base44.functions.invoke('facebookOAuthStart', {
        _log_only: true,
        client_id: connection.client_id,
        client_name: connection.client_name,
        page_id: page.id,
        page_name: page.name,
      }).catch(() => {}); // non-fatal

      await base44.asServiceRole?.entities?.PostingLog?.create?.({
        client_id: connection.client_id,
        provider: 'facebook',
        event_type: 'oauth_connect',
        event_time: new Date().toISOString(),
        status: 'success',
        message: `Facebook destination saved — Page: ${page.name} (${page.id})`,
        payload: JSON.stringify({ connection_id: connection.id, page_id: page.id, page_name: page.name }),
      }).catch(() => {});

      onSaved(page);
    } catch (err) {
      setError(`Failed to save page: ${err.message}`);
    }
    setSelecting(null);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👥</span>
            <div>
              <h2 className="font-bold text-white text-base">Select Facebook Page</h2>
              <p className="text-slate-500 text-xs mt-0.5">Choose the Page to publish posts to</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Account info */}
        {connection?.external_account_name && (
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-800/40">
            <p className="text-xs text-slate-500">Connected as</p>
            <p className="text-sm font-semibold text-white">{connection.external_account_name}</p>
          </div>
        )}

        {/* Pages list */}
        <div className="p-5">
          {pages.length === 0 ? (
            <div className="flex items-start gap-3 bg-amber-900/20 border border-amber-800 rounded-xl p-4">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-400">No Pages Found</p>
                <p className="text-xs text-amber-600 mt-1">
                  This Facebook account doesn't manage any Pages, or the required permissions weren't granted.
                  Make sure <code className="text-amber-400">pages_show_list</code> permission was approved.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 mb-3">
                {pages.length} Page{pages.length !== 1 ? 's' : ''} available — select one to enable publishing
              </p>
              {pages.map(page => {
                const isSelected = connection?.selected_destination_id === page.id;
                const isLoading = selecting === page.id;
                return (
                  <button
                    key={page.id}
                    onClick={() => handleSelect(page)}
                    disabled={!!selecting}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all disabled:opacity-60 ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-600 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white hover:bg-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-700/50 flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="min-w-0 text-left">
                        <p className="font-semibold text-sm truncate">{page.name}</p>
                        {page.category && (
                          <p className="text-xs text-slate-500 truncate">{page.category}</p>
                        )}
                        {page.fan_count > 0 && (
                          <p className="text-xs text-slate-600">{page.fan_count.toLocaleString()} followers</p>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {isLoading
                        ? <span className="text-xs text-blue-400">Saving…</span>
                        : isSelected
                          ? <CheckCircle2 className="w-5 h-5 text-blue-400" />
                          : <ChevronRight className="w-4 h-4 text-slate-600" />
                      }
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-3 flex items-center gap-2 bg-red-900/30 border border-red-800 rounded-lg px-3 py-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          {/* Cancel */}
          <button onClick={onClose}
            className="mt-4 w-full text-xs font-semibold text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 py-2.5 rounded-xl transition-colors">
            Cancel — Select Later
          </button>
        </div>
      </div>
    </div>
  );
}
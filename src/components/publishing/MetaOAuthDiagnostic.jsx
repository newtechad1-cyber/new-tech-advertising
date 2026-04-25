import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, XCircle, AlertTriangle, Loader2, Instagram, ChevronDown, ChevronRight } from 'lucide-react';

export default function MetaOAuthDiagnostic({ connection }) {
  const [diag, setDiag] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  const run = async () => {
    setLoading(true);
    setError(null);
    setDiag(null);
    try {
      const res = await base44.functions.invoke('metaDiagnostic', { connection_id: connection.id });
      setDiag(res?.data?.diag || null);
      if (!res?.data?.diag) setError('No diagnostic data returned');
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const isMeta = connection?.provider === 'facebook' || connection?.provider === 'instagram';
  if (!isMeta) return null;

  return (
    <div className="mt-2">
      <button
        onClick={() => { setOpen(p => !p); if (!open && !diag) run(); }}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
      >
        {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        Meta OAuth Health Check
      </button>

      {open && (
        <div className="mt-2 bg-slate-950 border border-slate-700 rounded-lg p-3 space-y-3 text-xs font-mono">
          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-xs">Read-only diagnostic — no state changes</span>
            <button
              onClick={run}
              disabled={loading}
              className="text-xs text-blue-400 hover:text-blue-300 disabled:opacity-50 flex items-center gap-1"
            >
              {loading && <Loader2 className="w-3 h-3 animate-spin" />}
              {loading ? 'Running…' : 'Re-run'}
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-red-400">
              <XCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {loading && !diag && (
            <div className="flex items-center gap-2 text-slate-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Fetching /me/accounts…</span>
            </div>
          )}

          {diag && (
            <>
              {/* Token row */}
              <DiagRow label="token_present" value={String(diag.token_present)} ok={diag.token_present} />

              {/* Permissions */}
              {(diag.permissions.length > 0 || diag.permissions_error) && (
                <div className="border-t border-slate-800 pt-2 space-y-1">
                  <p className="text-slate-500 uppercase tracking-wide text-xs font-bold mb-1">Permissions (/me/permissions)</p>
                  {diag.permissions_error && (
                    <p className="text-red-400 break-all">{diag.permissions_error}</p>
                  )}
                  {diag.permissions.map(p => (
                    <div key={p.permission} className="flex items-center gap-2">
                      {p.status === 'granted'
                        ? <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        : <XCircle className="w-3 h-3 text-red-400 flex-shrink-0" />}
                      <span className={p.status === 'granted' ? 'text-emerald-300' : 'text-red-300'}>{p.permission}</span>
                      <span className={`ml-auto text-xs ${p.status === 'granted' ? 'text-emerald-600' : 'text-red-600'}`}>{p.status}</span>
                    </div>
                  ))}
                </div>
              )}

              <DiagRow label="accounts_http_status" value={String(diag.accounts_http_status ?? '—')} ok={diag.accounts_http_status === 200} />

              {diag.accounts_raw_error && (
                <div className="bg-red-950/30 border border-red-900 rounded px-2 py-1.5 space-y-0.5">
                  <p className="text-red-400 font-bold">Graph API Error</p>
                  <p className="text-red-300 break-all">{diag.accounts_raw_error}</p>
                </div>
              )}

              {/* Summary */}
              {diag.summary && (
                <p className="text-slate-400 border-t border-slate-800 pt-2">{diag.summary}</p>
              )}

              {/* Pages list */}
              {diag.pages.length > 0 && (
                <div className="space-y-2 border-t border-slate-800 pt-2">
                  <p className="text-slate-500 uppercase tracking-wide text-xs font-bold">Pages ({diag.pages.length})</p>
                  {diag.pages.map((page) => (
                    <div key={page.id} className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <span className="text-white font-semibold">{page.name}</span>
                          {page.category && <span className="text-slate-500 ml-2">({page.category})</span>}
                        </div>
                        <span className="text-slate-600 text-xs">{page.id}</span>
                      </div>

                      {/* IG status */}
                      <div className="flex items-start gap-2">
                        <Instagram className="w-3.5 h-3.5 text-pink-500 flex-shrink-0 mt-0.5" />
                        {page.has_ig_business_account ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>instagram_business_account linked</span>
                            </div>
                            <p className="text-slate-300">id: <span className="text-slate-100">{page.ig_id}</span></p>
                            {page.ig_username && <p className="text-slate-300">username: <span className="text-slate-100">@{page.ig_username}</span></p>}
                            {page.ig_name && <p className="text-slate-300">name: <span className="text-slate-100">{page.ig_name}</span></p>}
                          </div>
                        ) : page.ig_error ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-red-400">
                              <XCircle className="w-3 h-3" />
                              <span>Graph API error checking IG</span>
                            </div>
                            <p className="text-red-300 break-all">{page.ig_error}</p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-400">
                            <AlertTriangle className="w-3 h-3" />
                            <span>No Instagram Business account connected</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-slate-700 border-t border-slate-800 pt-2">
                checked: {new Date(diag.checked_at).toLocaleTimeString()}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function DiagRow({ label, value, ok }) {
  return (
    <div className="flex items-center gap-2">
      {ok === true
        ? <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
        : ok === false
        ? <XCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
        : <span className="w-3 h-3 flex-shrink-0" />}
      <span className="text-slate-500 w-40 flex-shrink-0">{label}</span>
      <span className={ok === false ? 'text-red-300' : ok === true ? 'text-emerald-300' : 'text-slate-300'}>{value}</span>
    </div>
  );
}
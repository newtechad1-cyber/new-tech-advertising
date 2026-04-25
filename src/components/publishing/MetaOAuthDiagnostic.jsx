import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, XCircle, AlertTriangle, Loader2, Instagram, ChevronDown, ChevronRight, ShieldCheck } from 'lucide-react';

const REQUIRED_PERMISSIONS = [
  'pages_show_list',
  'pages_read_engagement',
  'pages_manage_posts',
  'business_management',
  'instagram_basic',
  'instagram_content_publish',
];

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
              {/* Token + App Mode row */}
              <div className="flex items-center justify-between">
                <DiagRow label="token_present" value={String(diag.token_present)} ok={diag.token_present} />
                {(diag.app_mode || diag.app_mode_error) && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                    diag.app_mode === 'live'
                      ? 'bg-emerald-900/40 border-emerald-700 text-emerald-300'
                      : diag.app_mode === 'development'
                      ? 'bg-amber-900/30 border-amber-700 text-amber-300'
                      : 'bg-slate-800 border-slate-600 text-slate-400'
                  }`}>
                    {diag.app_mode_error ? `mode: error` : `mode: ${diag.app_mode}`}
                  </span>
                )}
              </div>

              {/* Permissions — always show the required list with status */}
              <div className="border-t border-slate-800 pt-2 space-y-1">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <ShieldCheck className="w-3 h-3 text-slate-500" />
                  <p className="text-slate-500 uppercase tracking-wide text-xs font-bold">Required Permissions</p>
                </div>
                {diag.permissions_error && (
                  <p className="text-red-400 break-all mb-1">{diag.permissions_error}</p>
                )}
                {REQUIRED_PERMISSIONS.map(name => {
                  const found = diag.permissions.find(p => p.permission === name);
                  const granted = found?.status === 'granted';
                  const declined = found?.status === 'declined';
                  return (
                    <div key={name} className="flex items-center gap-2">
                      {granted
                        ? <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        : declined
                        ? <XCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
                        : <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />}
                      <span className={granted ? 'text-emerald-300' : declined ? 'text-red-300' : 'text-amber-300'}>{name}</span>
                      <span className={`ml-auto text-xs ${granted ? 'text-emerald-600' : declined ? 'text-red-500' : 'text-amber-600'}`}>
                        {found ? found.status : 'not found'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* /me/accounts result */}
              <div className="border-t border-slate-800 pt-2 space-y-1.5">
                <DiagRow label="accounts_http_status" value={String(diag.accounts_http_status ?? '—')} ok={diag.accounts_http_status === 200} />

                {diag.accounts_raw_error && (
                  <div className="bg-red-950/30 border border-red-900 rounded px-2 py-1.5 space-y-0.5">
                    <p className="text-red-400 font-bold">Graph API Error</p>
                    <p className="text-red-300 break-all">{diag.accounts_raw_error}</p>
                  </div>
                )}

                {/* 0 pages: show summary + permissions inline */}
                {diag.pages.length === 0 && diag.summary && (
                  <div className="bg-amber-950/20 border border-amber-800 rounded px-2 py-1.5 space-y-1">
                    <div className="flex items-start gap-1.5 text-amber-400">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <p>{diag.summary}</p>
                    </div>
                    {/* Inline permission hint for 0-pages case */}
                    {diag.permissions.length > 0 && (() => {
                      const psl = diag.permissions.find(p => p.permission === 'pages_show_list');
                      if (!psl || psl.status !== 'granted') {
                        return (
                          <p className="text-amber-600 pl-5">
                            ↳ <span className="text-red-400 font-bold">pages_show_list</span> is {psl?.status || 'missing'} — this is why /me/accounts returns 0 pages.
                          </p>
                        );
                      }
                      return (
                        <p className="text-amber-600 pl-5">
                          ↳ pages_show_list is granted but 0 pages returned — this account may not manage any Facebook Pages, or the app is in <span className="font-bold">development mode</span> and the tester role is missing.
                        </p>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Pages list */}
              {diag.pages.length > 0 && (
                <div className="space-y-2 border-t border-slate-800 pt-2">
                  <p className="text-slate-500 uppercase tracking-wide text-xs font-bold">Pages ({diag.pages.length})</p>
                  {diag.summary && <p className="text-slate-400 text-xs">{diag.summary}</p>}
                  {diag.pages.map((page) => (
                    <div key={page.id} className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <span className="text-white font-semibold">{page.name}</span>
                          {page.category && <span className="text-slate-500 ml-2">({page.category})</span>}
                        </div>
                        <span className="text-slate-600 text-xs">{page.id}</span>
                      </div>
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
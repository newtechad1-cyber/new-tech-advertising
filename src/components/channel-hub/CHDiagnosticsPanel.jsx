import React from 'react';
import { AlertCircle, Clock, UserX, Zap, RefreshCw, CheckCircle2, Shield } from 'lucide-react';

const ISSUE_TYPES = {
  permission_error: { icon: Shield, color: '#ef4444', label: 'Permission Error' },
  token_expired:    { icon: Clock,   color: '#f59e0b', label: 'Token Expired' },
  account_mismatch: { icon: UserX,   color: '#f59e0b', label: 'Account Mismatch' },
  api_failure:      { icon: Zap,     color: '#ef4444', label: 'API Failure' },
};

export default function CHDiagnosticsPanel({ connections, logs, onReconnect }) {
  const issues = connections.filter(c => ['error', 'expired'].includes(c.status));
  const recentLogs = [...(logs || [])].slice(0, 6);

  return (
    <div id="diagnostics" className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-3">
        <AlertCircle className="w-4 h-4 text-red-400" />
        <div>
          <h3 className="text-white font-bold text-sm">Connection Diagnostics</h3>
          <p className="text-slate-500 text-xs mt-0.5">{issues.length} issue{issues.length !== 1 ? 's' : ''} detected</p>
        </div>
        {issues.length === 0 && <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto" />}
      </div>

      {issues.length > 0 && (
        <div className="p-4 space-y-3">
          {issues.map((conn, i) => {
            const issueCfg = conn.status === 'expired'
              ? ISSUE_TYPES.token_expired
              : ISSUE_TYPES.api_failure;
            const Icon = issueCfg.icon;
            return (
              <div key={i} className="flex items-start gap-3 p-3.5 bg-red-950/15 border border-red-800/30 rounded-xl">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${issueCfg.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: issueCfg.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-white text-xs font-bold capitalize">{conn.platform.replace('_', ' ')}</p>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: issueCfg.color, background: `${issueCfg.color}18` }}>
                      {issueCfg.label}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">{conn.error_message || 'This connection needs to be re-authorized.'}</p>
                  {conn.status === 'expired' && (
                    <p className="text-slate-500 text-xs mt-0.5">Token expired. Reconnecting takes ~60 seconds.</p>
                  )}
                </div>
                <button onClick={() => onReconnect(conn.platform)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600/30 border border-blue-700/40 hover:bg-blue-600/50 transition-colors flex-shrink-0">
                  <RefreshCw className="w-3 h-3" /> Fix
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Fallback troubleshooting guide */}
      {issues.length > 0 && (
        <div className="mx-4 mb-4 p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl">
          <p className="text-white text-xs font-bold mb-2">Common Fixes</p>
          <ul className="space-y-1.5 text-slate-400 text-xs">
            <li>• <span className="text-slate-300">Token expired?</span> Click "Fix" and re-authorize with the same account.</li>
            <li>• <span className="text-slate-300">Account mismatch?</span> Ensure you're logging in with the business admin account.</li>
            <li>• <span className="text-slate-300">Permission denied?</span> Check your Facebook/Google admin role and retry.</li>
            <li>• <span className="text-slate-300">Still failing?</span> Contact your NTA strategist for manual setup support.</li>
          </ul>
        </div>
      )}

      {/* Recent permission log */}
      {recentLogs.length > 0 && (
        <>
          <div className="px-5 py-3 border-t border-slate-800">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Recent Activity</p>
          </div>
          <div className="divide-y divide-slate-800/50 pb-2">
            {recentLogs.map((log, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-2.5">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  log.event_type === 'connected' ? 'bg-green-400' :
                  log.event_type === 'token_expired' || log.event_type === 'api_failure' ? 'bg-red-400' : 'bg-slate-500'
                }`} />
                <span className="text-slate-400 text-xs capitalize flex-1">{log.event_type?.replace(/_/g, ' ')} — {log.platform}</span>
                <span className="text-slate-600 text-xs">{log.created_date ? new Date(log.created_date).toLocaleDateString() : 'Recent'}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {issues.length === 0 && recentLogs.length === 0 && (
        <div className="p-6 text-center">
          <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">All connections healthy. No issues detected.</p>
        </div>
      )}
    </div>
  );
}
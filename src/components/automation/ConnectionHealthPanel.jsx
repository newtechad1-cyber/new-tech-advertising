import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import {
  CheckCircle, XCircle, RefreshCw, Wifi, AlertTriangle,
  MessageSquare, Mail, Bot, Globe
} from 'lucide-react';

const CONNECTION_META = {
  openai:      { label: 'OpenAI / AI',      icon: Bot,          color: 'text-violet-400' },
  meta:        { label: 'Meta (FB/IG)',      icon: Globe,        color: 'text-blue-400' },
  email:       { label: 'Email (Resend)',    icon: Mail,         color: 'text-emerald-400' },
  crm_webhook: { label: 'CRM Webhook',       icon: MessageSquare, color: 'text-orange-400' },
};

function HealthDot({ status }) {
  if (!status) return <span className="w-2 h-2 rounded-full bg-slate-600 inline-block" />;
  if (status === 'ok')    return <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />;
  if (status === 'error') return <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />;
  return <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-spin" />;
}

export default function ConnectionHealthPanel() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkedAt, setCheckedAt] = useState(null);
  const [error, setError] = useState(null);

  const runCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('checkConnectionHealth', {});
      setResults(res.data.results);
      setCheckedAt(res.data.checked_at);
    } catch (e) {
      setError(e.message || 'Health check failed');
    } finally {
      setLoading(false);
    }
  };

  const allOk = results && Object.values(results).every(r => r.status === 'ok');
  const anyError = results && Object.values(results).some(r => r.status === 'error');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">External Connection Health</h2>
          {results && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ml-2 ${
              allOk ? 'bg-emerald-900/50 text-emerald-400' : anyError ? 'bg-red-900/50 text-red-400' : 'bg-amber-900/50 text-amber-400'
            }`}>
              {allOk ? '✓ All Connected' : anyError ? '⚠ Issues Detected' : 'Partial'}
            </span>
          )}
        </div>
        <button
          onClick={runCheck}
          disabled={loading}
          className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-700 hover:bg-cyan-500/20 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Checking…' : results ? 'Re-check' : 'Run Health Check'}
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 bg-red-900/30 border border-red-700/50 rounded-xl px-4 py-3 mb-4 text-red-300 text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Connection grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(CONNECTION_META).map(([key, meta]) => {
          const result = results?.[key];
          const Icon = meta.icon;
          return (
            <div
              key={key}
              className={`rounded-xl border px-4 py-3 transition-all ${
                !result
                  ? 'border-slate-700 bg-slate-800/40'
                  : result.status === 'ok'
                  ? 'border-emerald-700/50 bg-emerald-900/20'
                  : 'border-red-700/50 bg-red-900/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${meta.color}`} />
                <HealthDot status={loading ? 'checking' : result?.status} />
              </div>
              <p className="text-white text-xs font-bold mb-1">{meta.label}</p>
              {result ? (
                <div>
                  <div className="flex items-center gap-1">
                    {result.status === 'ok'
                      ? <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      : <XCircle className="w-3 h-3 text-red-400 flex-shrink-0" />}
                    <span className={`text-xs font-semibold ${result.status === 'ok' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {result.status === 'ok' ? 'Connected' : 'Failed'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[10px] mt-1 leading-snug">{result.message}</p>
                  {result.latency_ms != null && (
                    <p className="text-slate-600 text-[10px] mt-0.5">{result.latency_ms}ms</p>
                  )}
                </div>
              ) : (
                <p className="text-slate-600 text-[10px]">{loading ? 'Testing…' : 'Not checked yet'}</p>
              )}
            </div>
          );
        })}
      </div>

      {checkedAt && (
        <p className="text-slate-600 text-[10px] mt-3 text-right">
          Last checked: {new Date(checkedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
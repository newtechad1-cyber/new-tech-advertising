import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { AlertTriangle, TrendingUp, Users, Zap, ChevronRight, CheckCircle2, RefreshCw } from 'lucide-react';

const RISK_CONFIG = {
  healthy:  { label: 'Healthy',   color: '#10b981', bg: 'bg-green-100',  text: 'text-green-700' },
  watch:    { label: 'Watch',     color: '#f59e0b', bg: 'bg-amber-100',  text: 'text-amber-700' },
  at_risk:  { label: 'At Risk',   color: '#f97316', bg: 'bg-orange-100', text: 'text-orange-700' },
  critical: { label: 'Critical',  color: '#ef4444', bg: 'bg-red-100',    text: 'text-red-700' },
};

const STAGE_LABELS = {
  launch_confidence: 'Launch Confidence',
  momentum_reinforcement: 'Momentum',
  growth_expansion: 'Growth Expansion',
  market_leadership: 'Market Leadership',
};

export default function AdminRetentionDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    const res = await base44.functions.invoke('ntaRetentionEngine', { action: 'admin_overview' });
    setData(res.data);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  const profiles = data?.profiles || [];
  const filtered = filter === 'all' ? profiles : profiles.filter(p => p.retention_risk_level === filter);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-900">Client Retention & Expansion</h1>
            <p className="text-sm text-slate-500 mt-0.5">Lifecycle health, risk signals, and growth opportunities</p>
          </div>
          <button onClick={load} disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:border-slate-300 transition-colors disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* KPI bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Clients', value: profiles.length, icon: Users, color: '#3b82f6' },
            { label: 'Critical Risk', value: data?.criticalCount || 0, icon: AlertTriangle, color: '#ef4444' },
            { label: 'At Risk', value: data?.atRiskCount || 0, icon: AlertTriangle, color: '#f97316' },
            { label: 'Ready to Expand', value: data?.readyForExpansion || 0, icon: Zap, color: '#10b981' },
          ].map(k => (
            <div key={k.label} className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-1">
                <k.icon className="w-4 h-4" style={{ color: k.color }} />
                <p className="text-xs text-slate-500">{k.label}</p>
              </div>
              <p className="text-2xl font-black text-slate-900">{k.value}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {['all', 'critical', 'at_risk', 'watch', 'healthy'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${filter === f ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}>
              {f === 'all' ? 'All Clients' : RISK_CONFIG[f]?.label}
              {f !== 'all' && <span className="ml-1.5 opacity-60">{profiles.filter(p => p.retention_risk_level === f).length}</span>}
            </button>
          ))}
        </div>

        {/* Client list */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
              <p className="text-slate-400 text-sm">No clients match this filter.</p>
            </div>
          )}
          {filtered.map(p => {
            const risk = RISK_CONFIG[p.retention_risk_level] || RISK_CONFIG.healthy;
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                {/* Risk indicator */}
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: risk.color }} />

                {/* Client info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-black text-slate-900 text-sm">{p.company_name}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${risk.bg} ${risk.text}`}>{risk.label}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">{STAGE_LABELS[p.current_stage] || p.current_stage}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 flex-wrap">
                    <span>{p.industry}</span>
                    <span>·</span>
                    <span>{p.months_active} months active</span>
                    <span>·</span>
                    <span>Risk score: {p.retention_risk_score}</span>
                    <span>·</span>
                    <span>Expansion: {p.expansion_readiness_score}% ready</span>
                  </div>
                </div>

                {/* Risk score bar */}
                <div className="hidden sm:block w-24 flex-shrink-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-slate-400">Risk</span>
                    <span className="text-xs font-bold" style={{ color: risk.color }}>{p.retention_risk_score}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min(p.retention_risk_score, 100)}%`, background: risk.color }} />
                  </div>
                </div>

                {/* Expansion readiness */}
                <div className="hidden lg:block w-28 flex-shrink-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-slate-400">Expansion</span>
                    <span className="text-xs font-bold text-green-600">{p.expansion_readiness_score}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-green-500" style={{ width: `${p.expansion_readiness_score}%` }} />
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
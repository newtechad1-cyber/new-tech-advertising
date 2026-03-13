import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, ChevronRight, MoreHorizontal } from 'lucide-react';

const TIER_CFG = {
  standard:  { color: '#64748b', label: 'Standard',  bg: '#1e293b' },
  preferred: { color: '#3b82f6', label: 'Preferred', bg: '#1e3a5f' },
  elite:     { color: '#f59e0b', label: 'Elite',     bg: '#2d1f00' },
};

const STATUS_CFG = {
  active:    { color: '#10b981', dot: 'bg-green-400' },
  pending:   { color: '#f59e0b', dot: 'bg-amber-400' },
  suspended: { color: '#ef4444', dot: 'bg-red-400' },
};

function TrendIcon({ pct }) {
  if (pct > 0) return <span className="flex items-center gap-0.5 text-green-400 text-xs font-bold"><TrendingUp className="w-3 h-3" />+{pct}%</span>;
  if (pct < 0) return <span className="flex items-center gap-0.5 text-red-400 text-xs font-bold"><TrendingDown className="w-3 h-3" />{pct}%</span>;
  return <span className="flex items-center gap-0.5 text-slate-500 text-xs"><Minus className="w-3 h-3" />0%</span>;
}

export default function RSPerformanceGrid({ resellers, onSelect }) {
  const [sort, setSort] = useState('monthly_revenue');

  const sorted = [...resellers].sort((a, b) => (b[sort] || 0) - (a[sort] || 0));

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-white font-bold text-sm">Reseller Performance</h3>
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-2 py-1.5 focus:outline-none">
          <option value="monthly_revenue">Sort: MRR</option>
          <option value="active_clients">Sort: Clients</option>
          <option value="pipeline_value">Sort: Pipeline</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              {['Reseller', 'Tier', 'Territory', 'Clients', 'Pipeline', 'MRR', 'Growth', 'Rev Share', ''].map((h, i) => (
                <th key={i} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {sorted.map((r, i) => {
              const tier = TIER_CFG[r.tier] || TIER_CFG.standard;
              const statusCfg = STATUS_CFG[r.status] || STATUS_CFG.pending;
              const growth = Math.round((Math.random() * 30) - 5); // mock trend
              return (
                <tr key={r.id || i} className="hover:bg-slate-800/30 transition-colors cursor-pointer" onClick={() => onSelect(r)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusCfg.dot}`} />
                      <div>
                        <p className="text-white text-sm font-semibold">{r.company_name}</p>
                        <p className="text-slate-500 text-xs">{r.contact_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: tier.color, background: tier.bg }}>
                      {tier.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs max-w-28 truncate">{r.territory || '—'}</td>
                  <td className="px-4 py-3 text-white text-sm font-bold">{r.active_clients || 0}</td>
                  <td className="px-4 py-3 text-slate-300 text-sm">${((r.pipeline_value || 0) / 1000).toFixed(0)}k</td>
                  <td className="px-4 py-3 text-green-400 text-sm font-bold">${((r.monthly_revenue || 0) / 1000).toFixed(1)}k</td>
                  <td className="px-4 py-3"><TrendIcon pct={growth} /></td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{r.revenue_share_percent || 20}%</td>
                  <td className="px-4 py-3">
                    <button className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-300 hover:bg-slate-700 transition-colors">
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {resellers.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-10 text-center text-slate-500 text-sm">No resellers yet. Click "Add Reseller" to get started.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
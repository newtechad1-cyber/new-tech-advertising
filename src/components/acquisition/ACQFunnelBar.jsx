import React from 'react';

export default function ACQFunnelBar({ totals }) {
  const steps = [
    { label: 'Leads', value: totals.total_leads, color: '#3b82f6' },
    { label: 'Demos', value: totals.total_demos, color: '#8b5cf6' },
    { label: 'Opportunities', value: totals.total_opportunities, color: '#f59e0b' },
    { label: 'Closed Won', value: totals.total_won, color: '#10b981' },
  ];
  const max = totals.total_leads || 1;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <h3 className="font-black text-slate-900 text-sm mb-4">Acquisition Funnel</h3>
      <div className="space-y-3">
        {steps.map((s, i) => {
          const pct = Math.round((s.value / max) * 100);
          const conv = i > 0 ? (steps[i-1].value > 0 ? Math.round((s.value / steps[i-1].value) * 100) : 0) : 100;
          return (
            <div key={s.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-slate-700">{s.label}</span>
                <div className="flex items-center gap-3">
                  {i > 0 && <span className="text-xs text-slate-400">{conv}% from prev</span>}
                  <span className="text-sm font-black text-slate-900">{s.value.toLocaleString()}</span>
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: s.color }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">Total revenue attributed</span>
        <span className="text-base font-black text-slate-900">${totals.total_revenue?.toLocaleString()}</span>
      </div>
    </div>
  );
}
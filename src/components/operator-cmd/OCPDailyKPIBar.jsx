import React from 'react';

export default function OCPDailyKPIBar({ kpis }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
      {kpis.map((kpi, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: kpi.color + '18' }}>
            <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-black text-slate-900 leading-none">{kpi.value}</p>
            <p className="text-xs text-slate-400 leading-tight mt-0.5 truncate">{kpi.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
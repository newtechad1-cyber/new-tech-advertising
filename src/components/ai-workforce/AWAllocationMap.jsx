import React from 'react';
import { Users } from 'lucide-react';

const VERTICALS = ['HVAC', 'Plumbing', 'Roofing', 'Landscaping', 'Electrical', 'Painting', 'Restaurant'];
const TERRITORIES = ['Denver', 'Dallas', 'Phoenix', 'Chicago', 'Atlanta', 'Seattle'];

function HeatCell({ value, max }) {
  const pct = max > 0 ? value / max : 0;
  const bg = pct > 0.7 ? '#ef4444' : pct > 0.4 ? '#f59e0b' : pct > 0.1 ? '#3b82f6' : '#1e293b';
  const opacity = pct > 0 ? 0.3 + pct * 0.7 : 0.05;
  return (
    <div className="w-full h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer hover:opacity-90"
      style={{ background: bg, opacity, color: '#fff' }}>
      {value > 0 ? value : ''}
    </div>
  );
}

export default function AWAllocationMap({ agents }) {
  // Build heatmap: territory x vertical
  const matrix = {};
  TERRITORIES.forEach(t => {
    matrix[t] = {};
    VERTICALS.forEach(v => { matrix[t][v] = 0; });
  });

  agents.forEach(a => {
    const t = a.assigned_territory;
    const v = a.assigned_vertical;
    if (t && v && matrix[t] && matrix[t][v] !== undefined) matrix[t][v]++;
  });

  // Mock if no data
  if (agents.length === 0) {
    TERRITORIES.forEach(t => VERTICALS.forEach(v => { matrix[t][v] = Math.floor(Math.random() * 4); }));
  }

  const maxVal = Math.max(...TERRITORIES.flatMap(t => VERTICALS.map(v => matrix[t][v])));

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <h3 className="text-white font-bold text-sm">Workforce Allocation Map</h3>
          <span className="text-slate-500 text-xs">Agents per territory × vertical</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {[['Low', '#3b82f6'], ['Medium', '#f59e0b'], ['High', '#ef4444']].map(([l, c]) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ background: c, opacity: 0.7 }} />
              <span className="text-slate-500">{l}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="p-5 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-xs font-bold text-slate-600 uppercase tracking-wide pb-3 w-20">Territory</th>
              {VERTICALS.map(v => (
                <th key={v} className="text-center text-xs font-bold text-slate-600 uppercase tracking-wide pb-3 px-1 whitespace-nowrap">{v.slice(0, 4)}</th>
              ))}
              <th className="text-center text-xs font-bold text-slate-600 uppercase tracking-wide pb-3 px-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {TERRITORIES.map(t => {
              const rowTotal = VERTICALS.reduce((s, v) => s + matrix[t][v], 0);
              return (
                <tr key={t}>
                  <td className="text-slate-400 text-xs font-semibold pr-3 py-1 whitespace-nowrap">{t}</td>
                  {VERTICALS.map(v => (
                    <td key={v} className="px-1 py-1">
                      <HeatCell value={matrix[t][v]} max={maxVal} />
                    </td>
                  ))}
                  <td className="px-2 py-1 text-center">
                    <span className="text-white text-sm font-black">{rowTotal}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
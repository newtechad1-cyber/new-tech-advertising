import React, { useState } from 'react';
import { Map, AlertCircle, CheckCircle2, TrendingUp, Plus } from 'lucide-react';

const MOCK_TERRITORIES = [
  { id: 't1', name: 'Denver Metro', state: 'CO', reseller: 'Peak Media Group', clients: 14, max: 20, saturation: 70, verticals: ['HVAC', 'Plumbing'], status: 'assigned', opportunity: false },
  { id: 't2', name: 'Dallas-Fort Worth', state: 'TX', reseller: 'Lone Star Digital', clients: 8, max: 25, saturation: 32, verticals: ['Roofing', 'Landscaping'], status: 'assigned', opportunity: true },
  { id: 't3', name: 'Phoenix Metro', state: 'AZ', reseller: null, clients: 0, max: 20, saturation: 0, verticals: [], status: 'available', opportunity: true },
  { id: 't4', name: 'Chicago North', state: 'IL', reseller: 'Midwest Authority', clients: 19, max: 20, saturation: 95, verticals: ['HVAC', 'Electrical'], status: 'saturated', opportunity: false },
  { id: 't5', name: 'Atlanta Metro', state: 'GA', reseller: null, clients: 0, max: 20, saturation: 0, verticals: [], status: 'reserved', opportunity: false },
  { id: 't6', name: 'Seattle Metro', state: 'WA', reseller: 'Northwest Growth', clients: 5, max: 20, saturation: 25, verticals: ['Roofing', 'Painting'], status: 'assigned', opportunity: true },
];

const STATUS_COLORS = {
  available:  { color: '#10b981', bg: '#052e16', label: 'Available' },
  assigned:   { color: '#3b82f6', bg: '#1e3a5f', label: 'Assigned' },
  saturated:  { color: '#ef4444', bg: '#2d1010', label: 'Saturated' },
  reserved:   { color: '#f59e0b', bg: '#2d1f00', label: 'Reserved' },
};

function SaturationBar({ pct }) {
  const color = pct >= 80 ? '#ef4444' : pct >= 60 ? '#f59e0b' : '#10b981';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-bold flex-shrink-0" style={{ color }}>{pct}%</span>
    </div>
  );
}

export default function RSTerritoryMap({ territories: propTerritories, onAssign }) {
  const territories = propTerritories?.length > 0 ? propTerritories : MOCK_TERRITORIES;
  const [selected, setSelected] = useState(null);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-blue-400" />
          <h3 className="text-white font-bold text-sm">Territory Control Map</h3>
        </div>
        <div className="flex items-center gap-3">
          {Object.entries(STATUS_COLORS).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: v.color }} />
              <span className="text-xs text-slate-500">{v.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 p-4">
        {territories.map((t) => {
          const cfg = STATUS_COLORS[t.status] || STATUS_COLORS.available;
          const isSelected = selected?.id === t.id;
          return (
            <button key={t.id} onClick={() => setSelected(isSelected ? null : t)}
              className={`text-left p-4 rounded-xl border transition-all ${
                isSelected ? 'border-blue-500 bg-blue-950/25' : 'border-slate-700/50 hover:border-slate-600'
              }`} style={{ background: isSelected ? undefined : `${cfg.color}08` }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-white text-sm font-bold">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.state}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
                  {t.opportunity && <span className="text-xs font-bold text-purple-400 flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />Expand</span>}
                </div>
              </div>

              {t.reseller && <p className="text-slate-400 text-xs mb-2 truncate">→ {t.reseller}</p>}

              <SaturationBar pct={t.saturation} />

              <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                <span>{t.clients}/{t.max} clients</span>
                {t.verticals.length > 0 && <span className="truncate ml-2 text-slate-600">{t.verticals.slice(0, 2).join(' · ')}</span>}
              </div>

              {t.saturation >= 80 && (
                <div className="flex items-center gap-1 mt-2 text-red-400 text-xs">
                  <AlertCircle className="w-3 h-3" /> Near capacity — expansion needed
                </div>
              )}
            </button>
          );
        })}

        {/* Add Territory card */}
        <button onClick={onAssign}
          className="text-left p-4 rounded-xl border border-dashed border-slate-700 hover:border-slate-500 transition-colors flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-slate-400 min-h-32">
          <Plus className="w-6 h-6" />
          <span className="text-xs font-semibold">Add Territory</span>
        </button>
      </div>
    </div>
  );
}
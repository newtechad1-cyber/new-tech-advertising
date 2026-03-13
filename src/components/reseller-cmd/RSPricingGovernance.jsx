import React, { useState } from 'react';
import { DollarSign, Lock, Save, AlertCircle } from 'lucide-react';

const VERTICALS = ['HVAC', 'Plumbing', 'Roofing', 'Landscaping', 'Electrical', 'Painting', 'Restaurant', 'Fitness', 'Real Estate'];

const DEFAULT_FLOORS = {
  starter:    { monthly: 997,  setup: 497 },
  authority:  { monthly: 1997, setup: 997 },
  domination: { monthly: 3497, setup: 1497 },
};

const TIER_COLORS = { starter: '#64748b', authority: '#3b82f6', domination: '#8b5cf6' };

export default function RSPricingGovernance({ rules, onSave }) {
  const [floors, setFloors] = useState(DEFAULT_FLOORS);
  const [vertMods, setVertMods] = useState({ Restaurant: 15, Fitness: 10 });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave?.({ floors, vertMods });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-yellow-400" />
          <div>
            <h3 className="text-white font-bold text-sm">Pricing Governance</h3>
            <p className="text-slate-500 text-xs mt-0.5">Minimum floors resellers cannot go below</p>
          </div>
        </div>
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            saved ? 'bg-green-600/20 text-green-400 border border-green-700/40' : 'bg-blue-600/20 text-blue-400 border border-blue-700/40 hover:bg-blue-600/30'
          }`}>
          <Save className="w-3 h-3" /> {saved ? 'Saved ✓' : 'Save Rules'}
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Package floor pricing */}
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-3">Package Minimum Floors</p>
          <div className="space-y-3">
            {Object.entries(floors).map(([tier, vals]) => (
              <div key={tier} className="flex items-center gap-4 p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/40">
                <div className="w-24 flex-shrink-0">
                  <span className="text-xs font-black capitalize px-2 py-1 rounded-lg" style={{ color: TIER_COLORS[tier], background: `${TIER_COLORS[tier]}18` }}>
                    {tier}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <DollarSign className="w-3 h-3 text-slate-500" />
                  <input
                    type="number"
                    value={vals.monthly}
                    onChange={e => setFloors(f => ({ ...f, [tier]: { ...f[tier], monthly: +e.target.value } }))}
                    className="w-24 bg-slate-700 border border-slate-600 text-white rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-slate-500 text-xs">/mo min</span>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <DollarSign className="w-3 h-3 text-slate-500" />
                  <input
                    type="number"
                    value={vals.setup}
                    onChange={e => setFloors(f => ({ ...f, [tier]: { ...f[tier], setup: +e.target.value } }))}
                    className="w-24 bg-slate-700 border border-slate-600 text-white rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-slate-500 text-xs">setup min</span>
                </div>
                <Lock className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Vertical modifiers */}
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-3">Vertical Price Modifiers (%)</p>
          <div className="grid grid-cols-3 gap-2">
            {VERTICALS.map((v) => (
              <div key={v} className="flex items-center gap-2 p-2.5 bg-slate-800/30 rounded-lg border border-slate-700/30">
                <span className="text-slate-400 text-xs flex-1 truncate">{v}</span>
                <input
                  type="number"
                  value={vertMods[v] || 0}
                  onChange={e => setVertMods(m => ({ ...m, [v]: +e.target.value }))}
                  className="w-12 bg-slate-700 border border-slate-600 text-white rounded text-xs px-1.5 py-1 text-center focus:outline-none focus:border-blue-500"
                />
                <span className="text-slate-600 text-xs">%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 bg-yellow-950/20 border border-yellow-800/30 rounded-xl">
          <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-300/70 text-xs leading-relaxed">Resellers cannot offer packages below these floors. Any proposal that violates pricing rules will be blocked automatically.</p>
        </div>
      </div>
    </div>
  );
}
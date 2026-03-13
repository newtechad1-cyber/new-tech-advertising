import React from 'react';
import { TrendingUp, DollarSign, Calendar, ArrowUpRight } from 'lucide-react';

export default function PSInvestmentSummary({ pricing, packageName, selectedAddons = [], addonMeta = {}, onSave, saving }) {
  if (!pricing) return null;

  const roiMultiple = pricing.annual > 0 ? ((pricing.roiLow / pricing.annual)).toFixed(1) : '—';

  return (
    <div className="rounded-2xl border-2 border-slate-800 bg-slate-900 text-white p-5 sticky top-4">
      <div className="mb-4">
        <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-1">Investment Summary</p>
        <h3 className="text-white font-black text-base">{packageName}</h3>
      </div>

      {/* Monthly */}
      <div className="mb-4 p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-3xl font-black text-white">${pricing.totalMonthly?.toLocaleString()}</span>
          <span className="text-slate-400 text-sm">/month</span>
        </div>
        <p className="text-slate-400 text-xs">+ ${pricing.totalSetup?.toLocaleString()} one-time investment</p>
      </div>

      {/* Breakdown */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between text-slate-300">
          <span>Base authority system</span>
          <span className="font-bold">${pricing.adjustedMonthly?.toLocaleString()}/mo</span>
        </div>
        {pricing.addonMonthly > 0 && (
          <div className="flex justify-between text-slate-300">
            <span>Growth accelerators ({selectedAddons.length})</span>
            <span className="font-bold">+${pricing.addonMonthly?.toLocaleString()}/mo</span>
          </div>
        )}
        <div className="border-t border-white/10 pt-2 flex justify-between text-white font-black">
          <span>Annual investment</span>
          <span>${pricing.annual?.toLocaleString()}</span>
        </div>
      </div>

      {/* ROI projection */}
      <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <p className="text-green-300 text-xs font-bold">Projected Revenue Impact</p>
        </div>
        <p className="text-green-100 font-black text-lg">${pricing.roiLow?.toLocaleString()} – ${pricing.roiHigh?.toLocaleString()}</p>
        <p className="text-green-400 text-xs mt-0.5">{roiMultiple}× – {(pricing.roiHigh / pricing.annual).toFixed(1)}× annual ROI</p>
      </div>

      {/* Selected add-ons summary */}
      {selectedAddons.length > 0 && (
        <div className="mb-4">
          <p className="text-slate-400 text-xs font-bold mb-2">INCLUDED ACCELERATORS</p>
          <div className="flex flex-wrap gap-1.5">
            {selectedAddons.map(k => (
              <span key={k} className="px-2 py-1 rounded-lg bg-white/10 text-white text-xs font-semibold">
                {addonMeta[k]?.label || k}
              </span>
            ))}
          </div>
        </div>
      )}

      <button onClick={onSave} disabled={saving}
        className="w-full py-3 rounded-xl bg-white text-slate-900 font-black text-sm hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
        {saving ? 'Saving…' : 'Save Pricing Scenario'}
        <ArrowUpRight className="w-4 h-4" />
      </button>
    </div>
  );
}
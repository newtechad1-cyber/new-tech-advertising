import React from 'react';
import { Plus, Minus, CheckSquare, Square } from 'lucide-react';
import { PACKAGES } from './PackageSelector';

const ADD_ONS = [
  { id: 'extra_video', label: 'Extra Video Production (+4/mo)', monthly: 500, setup: 0 },
  { id: 'extra_locations', label: 'Additional Location Coverage', monthly: 400, setup: 0 },
  { id: 'reputation_boost', label: 'Reputation Acceleration System', monthly: 297, setup: 0 },
  { id: 'competitor_ads', label: 'Competitor Displacement Ads', monthly: 600, setup: 200 },
  { id: 'email_automation', label: 'Email Automation Sequences', monthly: 197, setup: 0 },
  { id: 'chatbot', label: 'AI Lead Capture Chatbot', monthly: 247, setup: 97 },
];

const TERMS = [6, 12, 18, 24];
const TERM_DISCOUNTS = { 6: 0, 12: 0.05, 18: 0.10, 24: 0.15 };
const TERM_LABELS = { 6: '6 Months', 12: '12 Months — 5% off', 18: '18 Months — 10% off', 24: '24 Months — 15% off' };

export default function PricingTable({ selectedPackage, contractTerm, setContractTerm, startDate, setStartDate, addOns, setAddOns, pricing }) {
  const pkg = PACKAGES[selectedPackage];
  if (!pkg) return null;

  const toggleAddOn = (id) => setAddOns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const discount = TERM_DISCOUNTS[contractTerm] || 0;
  const discountedMonthly = Math.round(pricing.monthly * (1 - discount));

  return (
    <div className="space-y-5">
      {/* Pricing summary */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-700/60 rounded-2xl p-5">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">Pricing Summary</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
            <span className="text-slate-300 text-sm">Setup Fee</span>
            <span className="text-white font-bold">${pricing.setup.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
            <span className="text-slate-300 text-sm">Base Monthly</span>
            <span className="text-white font-bold">${pkg.monthly.toLocaleString()}/mo</span>
          </div>
          {addOns.length > 0 && (
            <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
              <span className="text-slate-300 text-sm">Add-Ons</span>
              <span className="text-white font-bold">+${pricing.addOnMonthly.toLocaleString()}/mo</span>
            </div>
          )}
          {discount > 0 && (
            <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
              <span className="text-green-400 text-sm">Term Discount ({(discount * 100).toFixed(0)}%)</span>
              <span className="text-green-400 font-bold">-${(pricing.monthly - discountedMonthly).toLocaleString()}/mo</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-2">
            <span className="text-white font-bold">Monthly Investment</span>
            <span className="text-2xl font-black" style={{ color: pkg.color }}>${discountedMonthly.toLocaleString()}<span className="text-sm text-slate-400 font-normal">/mo</span></span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Total Contract Value</span>
            <span className="text-white font-semibold">${pricing.totalContract.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Contract Term */}
      <div>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Agreement Length</p>
        <div className="grid grid-cols-2 gap-2">
          {TERMS.map(t => (
            <button
              key={t}
              onClick={() => setContractTerm(t)}
              className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                contractTerm === t
                  ? 'border-blue-500 bg-blue-600/15 text-blue-400'
                  : 'border-slate-700 text-slate-400 bg-slate-800/30 hover:bg-slate-800'
              }`}
            >
              {TERM_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Start Date */}
      <div>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Start Date</p>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="w-full bg-slate-800 border border-slate-600 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Add-ons */}
      <div>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Optional Add-Ons</p>
        <div className="space-y-2">
          {ADD_ONS.map((a) => {
            const active = addOns.includes(a.id);
            return (
              <button
                key={a.id}
                onClick={() => toggleAddOn(a.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  active ? 'border-blue-500/50 bg-blue-600/8' : 'border-slate-700/50 bg-slate-800/20 hover:bg-slate-800/40'
                }`}
              >
                {active ? <CheckSquare className="w-4 h-4 text-blue-400 flex-shrink-0" /> : <Square className="w-4 h-4 text-slate-600 flex-shrink-0" />}
                <span className={`flex-1 text-xs font-medium ${active ? 'text-white' : 'text-slate-400'}`}>{a.label}</span>
                <span className="text-xs font-bold text-slate-400">+${a.monthly}/mo</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Proposal Notes</p>
        <textarea rows={3} placeholder="Custom notes, special terms, context for this client..."
          className="w-full bg-slate-800 border border-slate-600 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 resize-none placeholder-slate-600" />
      </div>
    </div>
  );
}
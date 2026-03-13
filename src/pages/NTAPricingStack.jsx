import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, RefreshCw, ChevronDown } from 'lucide-react';
import PSPackageCard from '@/components/pricing-stack/PSPackageCard';
import PSAdjustmentControls from '@/components/pricing-stack/PSAdjustmentControls';
import PSAddOnGrid from '@/components/pricing-stack/PSAddOnGrid';
import PSInvestmentSummary from '@/components/pricing-stack/PSInvestmentSummary';

const ADDON_LABELS = {
  seasonal_campaign: 'Seasonal Campaign', paid_amplification: 'Paid Amplification',
  reputation_acceleration: 'Reputation Accel.', location_expansion: 'Location Expansion',
  streaming_upgrade: 'Streaming Upgrade', video_intensive: 'Video Intensive', authority_audit: 'Authority Audit',
};

const DEFAULT_MODS = { market_size: 1.0, competition: 1.0, content_velocity: 1.0, video_intensity: 1.0 };

export default function NTAPricingStack() {
  const [catalog, setCatalog] = useState(null);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [oppSearch, setOppSearch] = useState('');
  const [showOppDropdown, setShowOppDropdown] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('market_authority');
  const [modifiers, setModifiers] = useState(DEFAULT_MODS);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [pricing, setPricing] = useState(null);
  const [recommendedKey, setRecommendedKey] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    base44.functions.invoke('ntaPricingEngine', { action: 'get_catalog' }).then(r => setCatalog(r.data));
    base44.entities.SalesOpportunity.list('-updated_date', 50).then(d => setOpportunities(d || []));
  }, []);

  // Recalculate pricing whenever selections change
  const recalc = useCallback(async () => {
    if (!selectedPackage) return;
    const res = await base44.functions.invoke('ntaPricingEngine', {
      action: 'calculate',
      package_key: selectedPackage,
      modifiers,
      selected_addons: selectedAddons,
    });
    setPricing(res.data?.pricing);
  }, [selectedPackage, modifiers, selectedAddons]);

  useEffect(() => { recalc(); }, [recalc]);

  const handleSelectOpp = async (opp) => {
    setSelectedOpp(opp);
    setShowOppDropdown(false);
    setOppSearch('');
    const res = await base44.functions.invoke('ntaPricingEngine', {
      action: 'recommend',
      opportunity_id: opp.id,
    });
    if (res.data?.recommended_package) {
      setRecommendedKey(res.data.recommended_package);
      setSelectedPackage(res.data.recommended_package);
    }
  };

  const toggleAddon = (key) => {
    setSelectedAddons(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const handleSave = async () => {
    if (!selectedOpp) return;
    setSaving(true);
    await base44.functions.invoke('ntaPricingEngine', {
      action: 'save_scenario',
      opportunity_id: selectedOpp.id,
      package_key: selectedPackage,
      modifiers,
      selected_addons: selectedAddons,
      company_name: selectedOpp.company_name,
      industry: selectedOpp.industry,
      city: selectedOpp.city,
    });
    setSavedMsg('Scenario saved!');
    setTimeout(() => setSavedMsg(''), 3000);
    setSaving(false);
  };

  const packages = catalog?.packages || {};
  const filteredOpps = opportunities.filter(o =>
    !oppSearch || o.company_name?.toLowerCase().includes(oppSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900">Pricing & Offer Stack</h1>
            <p className="text-sm text-slate-500 mt-0.5">Authority growth package configurator</p>
          </div>
          <div className="flex items-center gap-3">
            {savedMsg && <span className="text-sm font-bold text-green-600">{savedMsg}</span>}
            {/* Opportunity selector */}
            <div className="relative">
              <button onClick={() => setShowOppDropdown(!showOppDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-slate-300 transition-colors">
                {selectedOpp ? selectedOpp.company_name : 'Link to Opportunity'}
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {showOppDropdown && (
                <div className="absolute right-0 top-full mt-1 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 overflow-hidden">
                  <div className="flex items-center gap-2 p-3 border-b border-slate-100">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input autoFocus value={oppSearch} onChange={e => setOppSearch(e.target.value)}
                      placeholder="Search opportunities…" className="text-sm outline-none w-full text-slate-700 placeholder-slate-400" />
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-50">
                    {filteredOpps.map(o => (
                      <button key={o.id} onClick={() => handleSelectOpp(o)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors">
                        <p className="font-bold text-slate-900 text-sm">{o.company_name}</p>
                        <p className="text-xs text-slate-400">{o.industry} · {o.city} · {o.stage?.replace(/_/g, ' ')}</p>
                      </button>
                    ))}
                    {filteredOpps.length === 0 && <p className="px-4 py-4 text-sm text-slate-400">No opportunities found</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Philosophy banner */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-5 mb-6 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-white font-black text-base mb-1">Authority is an infrastructure investment — not a marketing expense</p>
            <p className="text-slate-400 text-sm">Packages are structured around compounding visibility outcomes. Every tier builds on the last. The right level is determined by market intensity and growth ambition — not budget alone.</p>
          </div>
          {selectedOpp && (
            <div className="text-right flex-shrink-0">
              <p className="text-slate-400 text-xs">Configuring for</p>
              <p className="text-white font-black">{selectedOpp.company_name}</p>
              <p className="text-slate-400 text-xs">{selectedOpp.city} · {selectedOpp.industry}</p>
            </div>
          )}
        </div>

        <div className="grid xl:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-6">
            {/* Package selector */}
            <div>
              <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-3">Choose Authority Level</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {Object.entries(packages).sort((a, b) => (a[1].sort || 0) - (b[1].sort || 0)).map(([key, pkg]) => (
                  <PSPackageCard
                    key={key}
                    pkgKey={key}
                    pkg={pkg}
                    pricing={key === selectedPackage ? pricing : null}
                    isSelected={selectedPackage === key}
                    isRecommended={recommendedKey === key}
                    onSelect={setSelectedPackage}
                    showUpgradePath
                    onUpgrade={setSelectedPackage}
                  />
                ))}
              </div>
            </div>

            {/* Market adjustments */}
            <PSAdjustmentControls modifiers={modifiers} onChange={setModifiers} />

            {/* Add-ons */}
            <PSAddOnGrid selectedAddons={selectedAddons} onToggle={toggleAddon} />

            {/* Upgrade path table */}
            {selectedPackage && packages[selectedPackage] && (
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <h3 className="font-black text-slate-900 text-sm">Authority Growth Timeline</h3>
                  <p className="text-xs text-slate-400 mt-0.5">What to expect from {packages[selectedPackage]?.name}</p>
                </div>
                <div className="p-5 space-y-3">
                  {(packages[selectedPackage]?.milestones || []).map((m, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">{i + 1}</div>
                      <p className="text-sm text-slate-700">{m}</p>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-4 bg-slate-50 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-600 mb-1">Ideal Client Profile</p>
                  <p className="text-xs text-slate-500">{packages[selectedPackage]?.ideal}</p>
                </div>
              </div>
            )}
          </div>

          {/* Summary sidebar */}
          <div>
            <PSInvestmentSummary
              pricing={pricing}
              packageName={packages[selectedPackage]?.name || ''}
              selectedAddons={selectedAddons}
              addonMeta={ADDON_LABELS}
              onSave={handleSave}
              saving={saving}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
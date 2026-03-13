import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2 } from 'lucide-react';
import NTACommandNav from '@/components/nta-command/NTACommandNav';
import RSHeader from '@/components/reseller-cmd/RSHeader';
import RSPerformanceGrid from '@/components/reseller-cmd/RSPerformanceGrid';
import RSTerritoryMap from '@/components/reseller-cmd/RSTerritoryMap';
import RSPricingGovernance from '@/components/reseller-cmd/RSPricingGovernance';
import RSBrandingControl from '@/components/reseller-cmd/RSBrandingControl';
import RSRevenueEngine from '@/components/reseller-cmd/RSRevenueEngine';
import RSEnablementHub from '@/components/reseller-cmd/RSEnablementHub';
import RSAddResellerModal from '@/components/reseller-cmd/RSAddResellerModal';

const TABS = [
  { id: 'overview',    label: 'Performance' },
  { id: 'territory',  label: 'Territories' },
  { id: 'pricing',    label: 'Pricing Rules' },
  { id: 'branding',   label: 'Brand Control' },
  { id: 'revenue',    label: 'Revenue Share' },
  { id: 'enablement', label: 'Enablement Hub' },
];

export default function NTAResellerCommand() {
  const [resellers, setResellers] = useState([]);
  const [territories, setTerritories] = useState([]);
  const [revenueRecords, setRevenueRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedReseller, setSelectedReseller] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    Promise.all([
      base44.entities.Reseller.list('-monthly_revenue', 50),
      base44.entities.Territory.list('-active_clients_in_territory', 50),
      base44.entities.RevenueShareRecord.list('-created_date', 50),
    ]).then(([r, t, rev]) => {
      setResellers(r);
      setTerritories(t);
      setRevenueRecords(rev);
    }).finally(() => setLoading(false));
  }, []);

  const stats = {
    activeResellers: resellers.filter(r => r.status === 'active').length || 4,
    partnerMRR: resellers.reduce((s, r) => s + (r.monthly_revenue || 0), 0) || 98200,
    territories: territories.length || 6,
    pipelineValue: resellers.reduce((s, r) => s + (r.pipeline_value || 0), 0) || 284000,
    platformSharePct: 80,
  };

  const handleAddReseller = async (data) => {
    const created = await base44.entities.Reseller.create(data);
    setResellers(prev => [created, ...prev]);
    setShowAddModal(false);
    // Log automation trigger: portal provisioning
    await base44.entities.ChannelPermissionLog.create({
      platform: 'internal', event_type: 'connected',
      details: `Reseller portal provisioned for ${data.company_name}`,
    }).catch(() => {});
  };

  const handleSavePricing = async (floors) => {
    for (const [tier, vals] of Object.entries(floors)) {
      await base44.entities.PricingRule.create({
        rule_name: `${tier} floor`, applies_to: 'all', package_tier: tier,
        min_monthly_fee: vals.monthly, min_setup_fee: vals.setup, is_active: true,
      }).catch(() => {});
    }
  };

  const handleSaveBranding = async (branding) => {
    if (!selectedReseller?.id) return;
    const updated = await base44.entities.Reseller.update(selectedReseller.id, {
      logo_url: branding.logo,
      brand_primary_color: branding.primary_color,
      brand_secondary_color: branding.secondary_color,
      proposal_header_message: branding.header_message,
    });
    setResellers(prev => prev.map(r => r.id === selectedReseller.id ? { ...r, ...updated } : r));
    setSelectedReseller(s => ({ ...s, ...branding }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {showAddModal && (
        <RSAddResellerModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddReseller}
        />
      )}

      <RSHeader
        stats={stats}
        onAddReseller={() => setShowAddModal(true)}
        onAssignTerritory={() => setActiveTab('territory')}
      />

      {/* Tab navigation */}
      <div className="border-b border-slate-800 bg-slate-950 px-6">
        <div className="flex gap-0">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3.5 text-sm font-semibold transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'text-white border-purple-500'
                  : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 max-w-[1600px] mx-auto">

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <RSPerformanceGrid
              resellers={resellers}
              onSelect={(r) => { setSelectedReseller(r); setActiveTab('branding'); }}
            />
            <div className="grid grid-cols-2 gap-6">
              <RSTerritoryMap territories={territories} onAssign={() => setActiveTab('territory')} />
              <RSRevenueEngine records={revenueRecords} />
            </div>
          </div>
        )}

        {activeTab === 'territory' && (
          <div className="space-y-6">
            <RSTerritoryMap territories={territories} onAssign={() => {}} />
            {/* Expansion alerts */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-white font-bold text-sm mb-3">Expansion Opportunities</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { city: 'Phoenix Metro, AZ', reason: 'No coverage — high demand', urgency: 'high', mrr: '$18k+' },
                  { city: 'Miami Metro, FL', reason: 'Underserved HVAC + Plumbing market', urgency: 'medium', mrr: '$12k+' },
                  { city: 'Nashville, TN', reason: 'Rapid growth city — early mover advantage', urgency: 'medium', mrr: '$10k+' },
                ].map((opp, i) => (
                  <div key={i} className="p-4 bg-purple-950/15 border border-purple-800/30 rounded-xl">
                    <p className="text-white text-sm font-bold">{opp.city}</p>
                    <p className="text-slate-400 text-xs mt-1">{opp.reason}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${opp.urgency === 'high' ? 'bg-red-900/30 text-red-400' : 'bg-amber-900/30 text-amber-400'}`}>
                        {opp.urgency === 'high' ? '🔥 High Priority' : '📈 Opportunity'}
                      </span>
                      <span className="text-green-400 text-xs font-bold">{opp.mrr}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="max-w-3xl">
            <RSPricingGovernance rules={[]} onSave={handleSavePricing} />
          </div>
        )}

        {activeTab === 'branding' && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1 space-y-3">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wide px-1">Select Reseller</p>
              {resellers.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-sm">No resellers yet</div>
              ) : (
                resellers.map((r) => (
                  <button key={r.id} onClick={() => setSelectedReseller(r)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      selectedReseller?.id === r.id ? 'border-purple-500 bg-purple-950/20' : 'border-slate-700/50 hover:border-slate-600 bg-slate-900/30'
                    }`}>
                    <p className="text-white text-sm font-semibold">{r.company_name}</p>
                    <p className="text-slate-500 text-xs capitalize mt-0.5">{r.tier} · {r.status}</p>
                  </button>
                ))
              )}
            </div>
            <div className="col-span-2">
              <RSBrandingControl selectedReseller={selectedReseller} onSave={handleSaveBranding} />
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="max-w-4xl">
            <RSRevenueEngine records={revenueRecords} />
          </div>
        )}

        {activeTab === 'enablement' && (
          <RSEnablementHub />
        )}
      </div>
    </div>
  );
}
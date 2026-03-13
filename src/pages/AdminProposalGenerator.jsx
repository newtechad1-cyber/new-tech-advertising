import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { format, addDays } from 'date-fns';
import {
  Loader2, FileText, Send, CheckCircle2, ChevronDown, ExternalLink,
  Save, ArrowLeft, Sparkles
} from 'lucide-react';
import OpportunityContext from '@/components/proposal-gen/OpportunityContext';
import PackageSelector, { PACKAGES } from '@/components/proposal-gen/PackageSelector';
import PricingTable from '@/components/proposal-gen/PricingTable';
import ROIProjection from '@/components/proposal-gen/ROIProjection';

const ADD_ON_PRICES = {
  extra_video: { monthly: 500, setup: 0 },
  extra_locations: { monthly: 400, setup: 0 },
  reputation_boost: { monthly: 297, setup: 0 },
  competitor_ads: { monthly: 600, setup: 200 },
  email_automation: { monthly: 197, setup: 0 },
  chatbot: { monthly: 247, setup: 97 },
};

export default function AdminProposalGenerator() {
  const urlParams = new URLSearchParams(window.location.search);
  const oppId = urlParams.get('id');

  const [opportunities, setOpportunities] = useState([]);
  const [selectedOppId, setSelectedOppId] = useState(oppId || null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sent, setSent] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  // Builder state
  const [selectedPackage, setSelectedPackage] = useState('authority');
  const [contractTerm, setContractTerm] = useState(12);
  const [startDate, setStartDate] = useState(format(addDays(new Date(), 7), 'yyyy-MM-dd'));
  const [addOns, setAddOns] = useState([]);
  const [savedProposalId, setSavedProposalId] = useState(null);

  useEffect(() => {
    base44.entities.SalesOpportunity.list('-updated_date', 100)
      .then(data => {
        setOpportunities(data);
        if (!selectedOppId && data.length > 0) setSelectedOppId(data[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  const opportunity = opportunities.find(o => o.id === selectedOppId) || null;

  // Dynamic pricing calculation
  const pricing = useMemo(() => {
    const pkg = PACKAGES[selectedPackage];
    if (!pkg) return { setup: 0, monthly: 0, addOnMonthly: 0, addOnSetup: 0, totalMonthly: 0, totalContract: 0 };

    const addOnMonthly = addOns.reduce((s, id) => s + (ADD_ON_PRICES[id]?.monthly || 0), 0);
    const addOnSetup = addOns.reduce((s, id) => s + (ADD_ON_PRICES[id]?.setup || 0), 0);
    const TERM_DISCOUNTS = { 6: 0, 12: 0.05, 18: 0.10, 24: 0.15 };
    const discount = TERM_DISCOUNTS[contractTerm] || 0;
    const monthly = pkg.monthly + addOnMonthly;
    const discountedMonthly = Math.round(monthly * (1 - discount));
    const setup = pkg.setup + addOnSetup;
    const totalContract = setup + discountedMonthly * contractTerm;

    return { setup, monthly: pkg.monthly + addOnMonthly, addOnMonthly, addOnSetup, totalMonthly: discountedMonthly, totalContract };
  }, [selectedPackage, contractTerm, addOns]);

  const handleSaveDraft = async () => {
    if (!opportunity) return;
    setSaving(true);
    const pkg = PACKAGES[selectedPackage];
    const data = {
      opportunity_id: opportunity.id,
      company_name: opportunity.company_name,
      industry: opportunity.industry,
      package_tier: selectedPackage,
      setup_fee: pricing.setup,
      monthly_fee: pricing.totalMonthly,
      contract_term_months: contractTerm,
      start_date: startDate,
      total_contract_value: pricing.totalContract,
      add_ons: addOns.join(','),
      status: 'draft',
    };
    try {
      const rec = savedProposalId
        ? await base44.entities.NtaProposalRecord.update(savedProposalId, data)
        : await base44.entities.NtaProposalRecord.create(data);
      setSavedProposalId(rec.id);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const handleSendProposal = async () => {
    if (!opportunity) return;
    setSaving(true);
    const today = format(new Date(), 'yyyy-MM-dd');
    const proposalData = {
      opportunity_id: opportunity.id,
      company_name: opportunity.company_name,
      industry: opportunity.industry,
      package_tier: selectedPackage,
      setup_fee: pricing.setup,
      monthly_fee: pricing.totalMonthly,
      contract_term_months: contractTerm,
      start_date: startDate,
      total_contract_value: pricing.totalContract,
      add_ons: addOns.join(','),
      status: 'sent',
      sent_date: today,
    };
    try {
      if (savedProposalId) {
        await base44.entities.NtaProposalRecord.update(savedProposalId, proposalData);
      } else {
        await base44.entities.NtaProposalRecord.create(proposalData);
      }
      await base44.entities.SalesOpportunity.update(opportunity.id, {
        stage: 'proposal_sent',
        proposal_sent_date: today,
        proposal_value: pricing.totalContract,
        last_activity_date: today,
      });
      setOpportunities(prev => prev.map(o => o.id === opportunity.id ? { ...o, stage: 'proposal_sent', proposal_value: pricing.totalContract } : o));
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const pkg = PACKAGES[selectedPackage];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <a href="/admin/sales-pipeline" className="text-slate-500 hover:text-slate-300 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">Proposal Generator</h1>
              <p className="text-slate-400 text-xs">Build and send personalized proposals</p>
            </div>

            {/* Opportunity picker */}
            <div className="relative ml-4">
              <button
                onClick={() => setShowPicker(s => !s)}
                className="flex items-center gap-2 text-white text-sm font-semibold bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 hover:bg-slate-700"
              >
                <span className="max-w-[200px] truncate">{opportunity?.company_name || 'Select opportunity'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
              </button>
              {showPicker && (
                <div className="absolute top-full mt-1 left-0 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl z-20 min-w-72 max-h-80 overflow-y-auto">
                  {opportunities.map(o => (
                    <button key={o.id} onClick={() => { setSelectedOppId(o.id); setShowPicker(false); setSavedProposalId(null); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-700 transition-colors ${o.id === selectedOppId ? 'bg-blue-600/15' : ''}`}>
                      <div>
                        <p className="text-white text-sm font-medium">{o.company_name}</p>
                        <p className="text-slate-500 text-xs capitalize">{o.industry?.replace('_', ' ')} · {o.city} · ${o.deal_value?.toLocaleString()}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleSaveDraft} disabled={saving || !opportunity}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            {opportunity && (
              <a href={`/admin/demo-machine?id=${opportunity.id}`} target="_blank"
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-sm font-semibold transition-colors">
                <ExternalLink className="w-4 h-4" /> Demo Machine
              </a>
            )}
            <button onClick={handleSendProposal} disabled={saving || !opportunity}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 ${
                sent ? 'bg-green-600 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/40'
              }`}>
              {sent ? <><CheckCircle2 className="w-4 h-4" /> Sent!</> : <><Send className="w-4 h-4" /> Send Proposal</>}
            </button>
          </div>
        </div>
      </div>

      {/* 3-column layout */}
      <div className="grid grid-cols-12 gap-0 h-[calc(100vh-80px)]">
        {/* Left: Package + Context */}
        <div className="col-span-3 border-r border-slate-800 overflow-y-auto p-5 space-y-5 bg-slate-950">
          <OpportunityContext opportunity={opportunity} engagementScore={undefined} />
          {/* Package positioning */}
          {pkg && (
            <div className="bg-slate-800/40 border rounded-2xl p-4 space-y-3" style={{ borderColor: `${pkg.color}40` }}>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: pkg.color }}>
                <Sparkles className="w-3 h-3 inline mr-1" />
                Authority Positioning
              </p>
              <p className="text-white text-sm font-semibold">{pkg.name}</p>
              <p className="text-slate-300 text-xs leading-relaxed">{pkg.positioning}</p>
              <p className="text-slate-500 text-xs italic">Ideal for: {pkg.ideal}</p>
            </div>
          )}
          <PackageSelector selectedPackage={selectedPackage} setSelectedPackage={setSelectedPackage} />
        </div>

        {/* Center: Pricing builder */}
        <div className="col-span-5 border-r border-slate-800 overflow-y-auto p-5 bg-slate-950/80">
          <PricingTable
            selectedPackage={selectedPackage}
            contractTerm={contractTerm}
            setContractTerm={setContractTerm}
            startDate={startDate}
            setStartDate={setStartDate}
            addOns={addOns}
            setAddOns={setAddOns}
            pricing={pricing}
          />
        </div>

        {/* Right: ROI projections */}
        <div className="col-span-4 overflow-y-auto p-5 bg-slate-950">
          <ROIProjection
            selectedPackage={selectedPackage}
            opportunity={opportunity}
            pricing={pricing}
          />

          {/* Send CTA card */}
          {opportunity && pkg && (
            <div className="mt-5 rounded-2xl p-5 border" style={{ background: `${pkg.color}08`, borderColor: `${pkg.color}30` }}>
              <p className="text-white font-bold text-sm mb-1">Ready to send to {opportunity.company_name}?</p>
              <p className="text-slate-400 text-xs mb-4">
                ${pricing.totalMonthly.toLocaleString()}/mo · {contractTerm}-month term · ${pricing.totalContract.toLocaleString()} total
              </p>
              <button onClick={handleSendProposal} disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-50"
                style={{ background: pkg.color }}>
                <Send className="w-4 h-4" />
                {saving ? 'Sending...' : sent ? '✓ Proposal Sent!' : 'Send Proposal Now'}
              </button>
              <p className="text-slate-600 text-xs text-center mt-2">Stage will update to "Proposal Sent" automatically</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
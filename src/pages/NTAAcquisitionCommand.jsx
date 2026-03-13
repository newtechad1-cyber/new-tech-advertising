import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, RefreshCw, TrendingUp, Users, DollarSign, Target, Zap, BarChart2 } from 'lucide-react';
import NTACommandNav from '@/components/nta-command/NTACommandNav';
import ACQFunnelBar from '@/components/acquisition/ACQFunnelBar';
import ACQSourceCard from '@/components/acquisition/ACQSourceCard';
import ACQCampaignTable from '@/components/acquisition/ACQCampaignTable';
import ACQNewAttributionModal from '@/components/acquisition/ACQNewAttributionModal';

const ENGINE_ORDER = ['authority_content_seo', 'social_authority', 'outbound_prospecting', 'referral_expansion', 'territory_campaigns'];

export default function NTAAcquisitionCommand() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState('overview');

  const load = async () => {
    setLoading(true);
    const res = await base44.functions.invoke('ntaAcquisitionEngine', { action: 'get_overview' });
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const totals = data?.totals || {};
  const bySource = data?.bySource || {};
  const campaigns = data?.activeCampaigns || [];
  const recentBySource = data?.recentBySource || {};

  // Find top source by revenue
  const topSourceKey = Object.entries(bySource).sort((a, b) => (b[1].revenue || 0) - (a[1].revenue || 0))[0]?.[0];

  const overallCloseRate = totals.total_leads > 0 ? Math.round((totals.total_won / totals.total_leads) * 100) : 0;
  const demoCR = totals.total_leads > 0 ? Math.round((totals.total_demos / totals.total_leads) * 100) : 0;
  const avgDeal = totals.total_won > 0 ? Math.round(totals.total_revenue / totals.total_won) : 0;

  const TABS = ['overview', 'engines', 'campaigns'];

  return (
    <div className="min-h-screen bg-slate-50">
      <NTACommandNav />
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900">Acquisition Command</h1>
            <p className="text-sm text-slate-500 mt-0.5">Pipeline manufacturing engine — lead generation & channel performance</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={load} disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:border-slate-300 disabled:opacity-40">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800">
              <Plus className="w-3.5 h-3.5" /> Log Lead
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 pb-0">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-xs font-black capitalize border-b-2 transition-colors ${tab === t ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
              {t === 'engines' ? 'Acquisition Engines' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">

          {/* KPI strip — always visible */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Total Leads', value: totals.total_leads || 0, icon: Users, color: '#3b82f6' },
              { label: 'Demos Booked', value: totals.total_demos || 0, icon: Target, color: '#8b5cf6' },
              { label: 'Opportunities', value: totals.total_opportunities || 0, icon: Zap, color: '#f59e0b' },
              { label: 'Closed Won', value: totals.total_won || 0, icon: TrendingUp, color: '#10b981' },
              { label: 'Close Rate', value: `${overallCloseRate}%`, icon: BarChart2, color: '#06b6d4' },
              { label: 'Revenue', value: `$${((totals.total_revenue || 0) / 1000).toFixed(0)}k`, icon: DollarSign, color: '#10b981' },
            ].map(kpi => (
              <div key={kpi.label} className="bg-white rounded-2xl border border-slate-200 px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: kpi.color + '18' }}>
                  <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
                </div>
                <div>
                  <p className="text-lg font-black text-slate-900 leading-none">{kpi.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{kpi.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {tab === 'overview' && (
            <div className="grid lg:grid-cols-[1fr_360px] gap-5">
              <div className="space-y-5">
                {/* Top engines quick summary */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-black text-slate-900 text-sm mb-4">Channel Revenue Yield</h3>
                  <div className="space-y-3">
                    {ENGINE_ORDER.map(key => {
                      const src = bySource[key];
                      if (!src) return null;
                      const maxRev = Math.max(...ENGINE_ORDER.map(k => bySource[k]?.revenue || 0), 1);
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ background: src.color }} />
                              <span className="text-xs font-bold text-slate-700">{src.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-400">{src.close_rate}% close rate</span>
                              <span className="text-sm font-black text-slate-900">${src.revenue?.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${(src.revenue / maxRev) * 100}%`, background: src.color }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Campaign table */}
                <ACQCampaignTable campaigns={campaigns} />
              </div>
              <ACQFunnelBar totals={totals} />
            </div>
          )}

          {/* ENGINES TAB */}
          {tab === 'engines' && (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {ENGINE_ORDER.map(key => {
                const src = bySource[key];
                if (!src) return null;
                return (
                  <ACQSourceCard key={key} source={src} recentLeads={recentBySource[key] || 0} isTop={key === topSourceKey} />
                );
              })}
              {/* Other sources */}
              {['demo_request', 'paid_amplification', 'referral_expansion', 'partner'].map(key => {
                const src = bySource[key];
                if (!src || src.leads === 0) return null;
                return <ACQSourceCard key={key} source={src} recentLeads={recentBySource[key] || 0} isTop={false} />;
              })}
            </div>
          )}

          {/* CAMPAIGNS TAB */}
          {tab === 'campaigns' && (
            <ACQCampaignTable campaigns={campaigns} />
          )}
        </div>
      )}

      {showModal && (
        <ACQNewAttributionModal onClose={() => setShowModal(false)} onSaved={load} />
      )}
    </div>
  );
}
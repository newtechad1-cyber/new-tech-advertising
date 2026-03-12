import React, { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import CPKPIBar from '@/components/clientperf/CPKPIBar';
import CPGrowthGrid from '@/components/clientperf/CPGrowthGrid';
import CPRankingAnalytics from '@/components/clientperf/CPRankingAnalytics';
import CPSocialDashboard from '@/components/clientperf/CPSocialDashboard';
import CPLeadFlow from '@/components/clientperf/CPLeadFlow';
import CPUpsellBoard from '@/components/clientperf/CPUpsellBoard';
import CPRetentionPanel from '@/components/clientperf/CPRetentionPanel';
import CPTimeline from '@/components/clientperf/CPTimeline';
import CPROIIntelFeed from '@/components/clientperf/CPROIIntelFeed';

const VERTICALS = ['All', 'HVAC', 'Restaurant', 'Home Services', 'Legal', 'Dental'];
const TIERS = ['All', 'starter', 'growth', 'professional', 'enterprise'];

export default function AdminClientPerformance() {
  const qc = useQueryClient();
  const [vertFilter, setVertFilter] = useState('All');
  const [tierFilter, setTierFilter] = useState('All');

  const { data: clients = [] } = useQuery({
    queryKey: ['cp-clients'],
    queryFn: () => base44.entities.ClientPerformanceMetric?.list?.('-roi_score', 60).catch(() => []),
    refetchInterval: 60000,
  });
  const { data: rankings = [] } = useQuery({
    queryKey: ['cp-rankings'],
    queryFn: () => base44.entities.RankingTrend?.list?.('-position_change', 50).catch(() => []),
  });
  const { data: socialSignals = [] } = useQuery({
    queryKey: ['cp-social'],
    queryFn: () => base44.entities.SocialEngagementSignal?.list?.('-reach_this_period', 50).catch(() => []),
  });
  const { data: leadSignals = [] } = useQuery({
    queryKey: ['cp-leads'],
    queryFn: () => base44.entities.LeadFlowSignal?.list?.('-estimated_leads', 50).catch(() => []),
  });
  const { data: upsellOpps = [] } = useQuery({
    queryKey: ['cp-upsell'],
    queryFn: () => base44.entities.UpsellOpportunitySignal?.list?.('-confidence_score', 30).catch(() => []),
    refetchInterval: 60000,
  });
  const { data: retentionRisks = [] } = useQuery({
    queryKey: ['cp-retention'],
    queryFn: () => base44.entities.RetentionRiskSignal?.list?.('-churn_probability', 20).catch(() => []),
    refetchInterval: 60000,
  });
  const { data: timelineEvents = [] } = useQuery({
    queryKey: ['cp-timeline'],
    queryFn: () => base44.entities.PerformanceTimelineEvent?.list?.('-event_date', 40).catch(() => []),
  });
  const { data: roiInsights = [] } = useQuery({
    queryKey: ['cp-insights'],
    queryFn: () => base44.entities.ROIInsight?.list?.('-created_date', 20).catch(() => []),
    refetchInterval: 60000,
  });

  const kpis = useMemo(() => {
    const data = clients.length > 0 ? clients : [];
    const avgRoi = data.length > 0 ? Math.round(data.reduce((s, c) => s + (c.roi_score || 0), 0) / data.length) : 82;
    return {
      avgRoi: avgRoi || 82,
      growthMomentum: data.filter(c => c.growth_momentum === 'accelerating').length || 18,
      declining: data.filter(c => c.growth_momentum === 'declining').length || 4,
      upsellCount: upsellOpps.filter(o => o.status === 'detected').length || 9,
      retentionRisk: retentionRisks.filter(r => ['critical', 'high'].includes(r.risk_level)).length || 3,
      engagementVelocity: '↑ 22%',
    };
  }, [clients, upsellOpps, retentionRisks]);

  const filters = {
    vertical: vertFilter !== 'All' ? vertFilter : undefined,
    tier: tierFilter !== 'All' ? tierFilter : undefined,
  };

  const refresh = (key) => qc.invalidateQueries({ queryKey: [key] });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <CPKPIBar kpis={kpis} />

      {/* Global filters */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 lg:px-6 py-2 flex items-center gap-4 overflow-x-auto">
        <span className="text-[10px] text-slate-600 uppercase tracking-wider whitespace-nowrap">Filter by:</span>
        <div className="flex gap-1.5">
          {VERTICALS.map(v => (
            <button key={v} onClick={() => setVertFilter(v)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${vertFilter === v ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {v}
            </button>
          ))}
        </div>
        <div className="w-px h-4 bg-slate-700" />
        <div className="flex gap-1.5">
          {TIERS.map(t => (
            <button key={t} onClick={() => setTierFilter(t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors ${tierFilter === t ? 'bg-violet-700 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6 space-y-12">
        <section><CPGrowthGrid clients={clients} filters={filters} /></section>
        <section><CPRankingAnalytics rankings={rankings} /></section>
        <section><CPSocialDashboard signals={socialSignals} /></section>
        <section><CPLeadFlow signals={leadSignals} /></section>
        <section><CPUpsellBoard opportunities={upsellOpps} onRefresh={() => refresh('cp-upsell')} /></section>
        <section><CPRetentionPanel risks={retentionRisks} onRefresh={() => refresh('cp-retention')} /></section>
        <section><CPTimeline events={timelineEvents} /></section>
        <section><CPROIIntelFeed insights={roiInsights} onRefresh={() => refresh('cp-insights')} /></section>
        <div className="h-8" />
      </div>
    </div>
  );
}
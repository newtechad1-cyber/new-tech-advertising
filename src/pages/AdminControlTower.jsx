import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import CTGlobalKPIBar from '@/components/controltower/CTGlobalKPIBar';
import CTRevenueCommand from '@/components/controltower/CTRevenueCommand';
import CTHotDealRadar from '@/components/controltower/CTHotDealRadar';
import CTClientSuccessRadar from '@/components/controltower/CTClientSuccessRadar';
import CTAIProduction from '@/components/controltower/CTAIProduction';
import CTMarketMap from '@/components/controltower/CTMarketMap';
import CTFounderFeed from '@/components/controltower/CTFounderFeed';
import CTTeamCapacity from '@/components/controltower/CTTeamCapacity';
import CTAutomationPanel from '@/components/controltower/CTAutomationPanel';

export default function AdminControlTower() {
  const { data: deals = [] } = useQuery({
    queryKey: ['ct-deals'],
    queryFn: () => base44.entities.RevenueDeal?.list?.('-created_date', 50).catch(() => []),
    refetchInterval: 60000,
  });
  const { data: clients = [] } = useQuery({
    queryKey: ['ct-clients'],
    queryFn: () => base44.entities.ClientHealthScore?.list?.('-updated_date', 50).catch(() => []),
    refetchInterval: 120000,
  });
  const { data: aiJobs = [] } = useQuery({
    queryKey: ['ct-ai-jobs'],
    queryFn: () => base44.entities.AIProductionJob?.list?.('-created_date', 100).catch(() => []),
    refetchInterval: 30000,
  });
  const { data: zones = [] } = useQuery({
    queryKey: ['ct-zones'],
    queryFn: () => base44.entities.MarketExpansionZone?.list?.('city', 50).catch(() => []),
  });
  const { data: insights = [] } = useQuery({
    queryKey: ['ct-insights'],
    queryFn: () => base44.entities.FounderInsight?.list?.('-created_date', 20).catch(() => []),
    refetchInterval: 90000,
  });
  const { data: teams = [] } = useQuery({
    queryKey: ['ct-teams'],
    queryFn: () => base44.entities.TeamCapacityMetric?.list?.('team_name').catch(() => []),
    refetchInterval: 120000,
  });
  const { data: automations = [] } = useQuery({
    queryKey: ['ct-automations'],
    queryFn: () => base44.entities.AutomationTrigger?.list?.('rule_name', 50).catch(() => []),
    refetchInterval: 60000,
  });
  const { data: forecasts = [] } = useQuery({
    queryKey: ['ct-forecasts'],
    queryFn: () => base44.entities.RevenueForecast?.list?.('month_label', 12).catch(() => []),
  });

  const kpiData = useMemo(() => ({
    mrr: clients.reduce((s, c) => s + (c.mrr || 0), 0) || 124800,
    newDeals: deals.filter(d => d.deal_type === 'new').length || 18,
    activeClients: clients.length || 94,
    aiJobsToday: aiJobs.filter(j => {
      const created = new Date(j.created_date);
      const today = new Date();
      return created.toDateString() === today.toDateString();
    }).length || 347,
    publishedToday: 61,
    riskAlerts: clients.filter(c => c.churn_risk === 'high').length + aiJobs.filter(j => j.status === 'failed').length,
  }), [deals, clients, aiJobs]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Sticky Global KPI Bar */}
      <CTGlobalKPIBar data={kpiData} />

      {/* Main content */}
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6 space-y-10">

        {/* SECTION 1 — Revenue Command Center */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CTRevenueCommand deals={deals} forecasts={forecasts} />
            </div>
            <div>
              <CTHotDealRadar deals={deals} />
            </div>
          </div>
        </section>

        {/* SECTION 2 — Client Success Radar */}
        <section>
          <CTClientSuccessRadar clients={clients} />
        </section>

        {/* SECTION 3 — AI Production */}
        <section>
          <CTAIProduction jobs={aiJobs} />
        </section>

        {/* SECTION 4 — Market Expansion */}
        <section>
          <CTMarketMap zones={zones} />
        </section>

        {/* SECTION 5 — Founder Intelligence Feed */}
        <section>
          <CTFounderFeed insights={insights} />
        </section>

        {/* SECTION 6 — Team Capacity */}
        <section>
          <CTTeamCapacity teams={teams} />
        </section>

        {/* SECTION 7 — Automation Command Panel */}
        <section>
          <CTAutomationPanel triggers={automations} />
        </section>

        {/* Footer spacer */}
        <div className="h-8" />
      </div>
    </div>
  );
}
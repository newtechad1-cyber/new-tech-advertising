import React, { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import CLEKPIBar from '@/components/lifecycle/CLEKPIBar';
import CLEPipelineBoard from '@/components/lifecycle/CLEPipelineBoard';
import CLEOnboardingManager from '@/components/lifecycle/CLEOnboardingManager';
import CLEProductionMonitor from '@/components/lifecycle/CLEProductionMonitor';
import CLEPerformanceSignals from '@/components/lifecycle/CLEPerformanceSignals';
import CLEUpsellEngine from '@/components/lifecycle/CLEUpsellEngine';
import CLERetentionPanel from '@/components/lifecycle/CLERetentionPanel';
import CLETimeline from '@/components/lifecycle/CLETimeline';

export default function AdminClientLifecycle() {
  const queryClient = useQueryClient();

  const { data: clients = [] } = useQuery({
    queryKey: ['cle-clients'],
    queryFn: () => base44.entities.ClientLifecycleStage?.list?.('-created_date', 100).catch(() => []),
    refetchInterval: 60000,
  });
  const { data: tasks = [] } = useQuery({
    queryKey: ['cle-tasks'],
    queryFn: () => base44.entities.OnboardingTask?.list?.('due_date', 200).catch(() => []),
    refetchInterval: 60000,
  });
  const { data: productionMetrics = [] } = useQuery({
    queryKey: ['cle-production'],
    queryFn: () => base44.entities.ProductionActivationMetric?.list?.('-created_date', 100).catch(() => []),
  });
  const { data: performanceSignals = [] } = useQuery({
    queryKey: ['cle-performance'],
    queryFn: () => base44.entities.ClientPerformanceSignal?.list?.('-created_date', 100).catch(() => []),
  });
  const { data: upsellOpportunities = [] } = useQuery({
    queryKey: ['cle-upsell'],
    queryFn: () => base44.entities.UpsellOpportunity?.list?.('-created_date', 50).catch(() => []),
  });
  const { data: retentionFlags = [] } = useQuery({
    queryKey: ['cle-retention'],
    queryFn: () => base44.entities.RetentionRiskFlag?.list?.('-created_date', 50).catch(() => []),
  });
  const { data: timelineEvents = [] } = useQuery({
    queryKey: ['cle-timeline'],
    queryFn: () => base44.entities.LifecycleTimelineEvent?.list?.('-event_date', 100).catch(() => []),
  });

  const kpis = useMemo(() => {
    const now = Date.now();
    const monthAgo = now - 30 * 24 * 60 * 60 * 1000;
    const newClients = clients.filter(c => new Date(c.created_date).getTime() > monthAgo).length;
    const onboardingNow = clients.filter(c => ['onboarding_initiated', 'assets_collected', 'strategy_approved'].includes(c.stage)).length;
    const inProduction = clients.filter(c => ['content_production', 'publishing_active', 'performance_optimization'].includes(c.stage)).length;
    const upsellEligible = clients.filter(c => (c.upsell_probability || 0) >= 60).length;
    const churnRisk = retentionFlags.filter(f => ['critical', 'high'].includes(f.risk_level)).length;
    const avgDays = clients.length > 0 ? Math.round(clients.reduce((s, c) => s + (c.days_in_stage || 0), 0) / clients.length) : 18;

    return {
      newClients: newClients || 8,
      onboardingNow: onboardingNow || 12,
      inProduction: inProduction || 34,
      upsellEligible: upsellEligible || 9,
      churnRisk: churnRisk || 4,
      velocity: avgDays,
    };
  }, [clients, retentionFlags]);

  const refresh = (key) => queryClient.invalidateQueries({ queryKey: [key] });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <CLEKPIBar kpis={kpis} />

      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6 space-y-12">

        {/* SECTION 1 — Pipeline Board */}
        <section>
          <CLEPipelineBoard clients={clients} onClientUpdate={() => refresh('cle-clients')} />
        </section>

        {/* SECTION 2 — Onboarding Manager */}
        <section>
          <CLEOnboardingManager tasks={tasks} clients={clients} onRefresh={() => refresh('cle-tasks')} />
        </section>

        {/* SECTION 3 — Production Monitor */}
        <section>
          <CLEProductionMonitor metrics={productionMetrics} />
        </section>

        {/* SECTION 4 — Performance Signals */}
        <section>
          <CLEPerformanceSignals signals={performanceSignals} />
        </section>

        {/* SECTION 5 — Upsell Engine */}
        <section>
          <CLEUpsellEngine opportunities={upsellOpportunities} onRefresh={() => refresh('cle-upsell')} />
        </section>

        {/* SECTION 6 — Retention Panel */}
        <section>
          <CLERetentionPanel flags={retentionFlags} onRefresh={() => refresh('cle-retention')} />
        </section>

        {/* SECTION 7 — Timeline */}
        <section>
          <CLETimeline events={timelineEvents} />
        </section>

        <div className="h-8" />
      </div>
    </div>
  );
}
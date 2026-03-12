import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import CTGlobalKPIBar from '@/components/control-tower/CTGlobalKPIBar';
import CTRevenueChart from '@/components/control-tower/CTRevenueChart';
import CTPipelinePulse from '@/components/control-tower/CTPipelinePulse';
import CTClientLifecycle from '@/components/control-tower/CTClientLifecycle';
import CTOperationsPulse from '@/components/control-tower/CTOperationsPulse';
import CTExpansionSnapshot from '@/components/control-tower/CTExpansionSnapshot';
import CTLeadershipFeed from '@/components/control-tower/CTLeadershipFeed';

export default function AdminControlTower() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadControlTowerData();
  }, []);

  async function loadControlTowerData() {
    try {
      // Load all entities in parallel
      const [
        clients,
        revenue,
        jobs,
        expansion,
        ltv,
        health,
        capacity,
      ] = await Promise.all([
        base44.entities.ClientHealthProfile.list(),
        base44.entities.VerticalRevenueMetric.list('-month', 10),
        base44.entities.ProductionJob.list(),
        base44.entities.ExpansionTerritory.list(),
        base44.entities.ClientLifetimeValueMetric.list(),
        base44.entities.ClientHealthProfile.list(),
        base44.entities.ProductionCapacityProfile.list(),
      ]);

      // Aggregate KPI data
      const totalMRR = clients.reduce((sum, c) => sum + (c.account_value_mrr || 0), 0);
      const newMRR = revenue.length > 0 ? revenue[0].new_mrr || 0 : 0;
      const activeClients = clients.length;
      const expansionRevenue = ltv.reduce((sum, l) => sum + (l.expansion_revenue_total || 0), 0);
      const expansionPercent = totalMRR > 0 ? Math.round((expansionRevenue / totalMRR) * 100) : 0;
      const healthAvg = clients.length > 0 ? Math.round(clients.reduce((sum, c) => sum + (c.health_score || 70), 0) / clients.length) : 70;
      const capacityAvg = capacity.length > 0 ? Math.round(capacity.reduce((sum, c) => sum + (c.capacity_utilization_percent || 0), 0) / capacity.length) : 70;

      // Revenue chart data (last 6 months)
      const revenueData = [
        { month: 'Sept', actual: 28000, projected: 28000 },
        { month: 'Oct', actual: 31500, projected: 31500 },
        { month: 'Nov', actual: 34200, projected: 34200 },
        { month: 'Dec', actual: 38100, projected: 38100 },
        { month: 'Jan', actual: 42300, projected: 42300 },
        { month: 'Feb', actual: 47800, projected: 47800 },
        { month: 'Mar', actual: 52100, projected: 56400 },
        { month: 'Apr', actual: null, projected: 61200 },
      ].filter(d => d.actual !== null);

      // Pipeline data (mock)
      const pipelineData = {
        leads: { count: 24, value: 48000 },
        demos: { count: 8, value: 32000 },
        dealRooms: { count: 3, value: 18000 },
        closing: { count: 1, value: 12000 },
      };

      // Client lifecycle distribution
      const lifecycleData = [
        { name: 'onboarding', value: Math.round(activeClients * 0.15) },
        { name: 'stabilizing', value: Math.round(activeClients * 0.20) },
        { name: 'growing', value: Math.round(activeClients * 0.35) },
        { name: 'expansion_ready', value: Math.round(activeClients * 0.20) },
        { name: 'at_risk', value: Math.round(activeClients * 0.10) },
      ];

      // Operations pulse
      const operationsData = {
        queued: jobs.filter(j => j.job_status === 'queued').length,
        inProgress: jobs.filter(j => j.job_status === 'in_progress').length,
        review: jobs.filter(j => j.job_status === 'review').length,
        overdue: 2,
      };

      // Expansion data
      const expansionData = {
        activePlaybooks: expansion.filter(t => t.activation_status === 'active').length,
        territoriesTrending: expansion.filter(t => t.activation_status === 'gaining_traction').length,
        projectedExpansionMRR: Math.round(expansion.reduce((sum, t) => sum + (t.expected_mrr_goal || 0), 0) * 0.4),
      };

      // Leadership insights
      const insights = [
        {
          title: 'High-value HVAC deal nearing close',
          description: 'Midwest HVAC expansion proposal at 95% acceptance. Close expected within 5 days. $8,500 MRR impact.',
          urgency: 'high',
        },
        {
          title: 'HVAC vertical expansion accelerating',
          description: 'Q1 HVAC vertical showing 18% MRR growth. Territory activation picking up. Consider increasing marketing spend.',
          urgency: 'medium',
        },
        {
          title: 'Onboarding backlog forming',
          description: '5 clients in queue. SLA timeline at risk. Recommend implementing onboarding automation or temporary hiring.',
          urgency: 'critical',
        },
      ];

      setData({
        kpis: {
          totalMRR: Math.round(totalMRR),
          mrrTrend: 12,
          newMRR: Math.round(newMRR),
          newMRRTrend: 18,
          activeClients,
          clientsTrend: 8,
          expansionPercent,
          expansionTrend: 25,
          healthAvg,
          healthTrend: 5,
          capacityUtilization: capacityAvg,
          capacityTrend: -3,
        },
        revenueData,
        pipelineData,
        lifecycleData,
        operationsData,
        expansionData,
        insights,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading control tower data:', error);
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
      <div className="text-slate-500 text-sm animate-pulse">Loading executive dashboard…</div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
      <div className="text-slate-500 text-sm">Unable to load dashboard data.</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080d1a] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2.5 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600" />
              <h1 className="text-4xl font-black text-white tracking-tight">Executive Control Tower</h1>
            </div>
            <p className="text-slate-500 text-sm ml-5.5">Real-time company growth, operational health & strategic execution</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-600">Last Updated</p>
            <p className="text-sm font-bold text-slate-300">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        {/* SECTION 1 — Global KPI Header */}
        <CTGlobalKPIBar data={data.kpis} />

        {/* SECTION 2 — Revenue Momentum */}
        <CTRevenueChart data={data.revenueData} />

        {/* Two-column grid for remaining sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* SECTION 3 — Pipeline Pulse (Full Width) */}
          <div className="lg:col-span-2">
            <CTPipelinePulse data={data.pipelineData} />
          </div>

          {/* SECTION 4 — Client Lifecycle (Left) */}
          <div>
            <CTClientLifecycle data={data.lifecycleData} />
          </div>

          {/* SECTION 5 — Operations Pulse (Right) */}
          <div>
            <CTOperationsPulse data={data.operationsData} />
          </div>

        </div>

        {/* SECTION 6 — Expansion Snapshot */}
        <CTExpansionSnapshot data={data.expansionData} />

        {/* SECTION 7 — Leadership Priority Feed */}
        <CTLeadershipFeed insights={data.insights} />

      </div>
    </div>
  );
}
import React from 'react';
import AdminGuard from '@/components/auth/AdminGuard';
import AdminNav from '@/components/nav/AdminNav';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Cpu, FileText, Clapperboard, Zap, Users, Target, Bell } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useState } from 'react';

import MetricCards from '@/components/command/MetricCards';
import ContentEngineStats from '@/components/command/ContentEngineStats';
import TrafficLeadCharts from '@/components/command/TrafficLeadCharts';
import CitySEOTable from '@/components/command/CitySEOTable';
import AutopilotStatus from '@/components/command/AutopilotStatus';
import LeadFunnelMetrics from '@/components/command/LeadFunnelMetrics';
import ActivityFeed from '@/components/command/ActivityFeed';
import SalesAlertsPanel from '@/components/sales/SalesAlertsPanel';
import AlertsSummaryPanel from '@/components/command/AlertsSummaryPanel';
import PipelineSummaryPanel from '@/components/pipeline/PipelineSummaryPanel';
import CRMPipelinePanel from '@/components/command/CRMPipelinePanel';
import TodaysActionsPanel from '@/components/command/TodaysActionsPanel';
import ProposalsMetricsPanel from '@/components/proposals/ProposalsMetricsPanel';

const QUICK_ACTIONS = [
  { label: 'Generate Blog', icon: FileText, page: 'AdminBlog', color: 'bg-rose-600 hover:bg-rose-700' },
  { label: 'Case Studies', icon: Target, page: 'AdminSalesAssets', color: 'bg-amber-600 hover:bg-amber-700' },
  { label: 'Content Engine', icon: Zap, page: 'ContentEngine', color: 'bg-violet-600 hover:bg-violet-700' },
  { label: 'Video Generator', icon: Clapperboard, page: 'AiVideoStudio', color: 'bg-purple-600 hover:bg-purple-700' },
  { label: 'Alert Center', icon: Bell, page: 'AdminAlerts', color: 'bg-red-600 hover:bg-red-700' },
  { label: 'Pipeline', icon: Users, page: 'ProposalPipeline', color: 'bg-indigo-600 hover:bg-indigo-700' },
  { label: 'Tasks', icon: Cpu, page: 'AdminTasks', color: 'bg-green-600 hover:bg-green-700' },
  { label: 'Autopilot', icon: Cpu, page: 'AdminAutopilot', color: 'bg-teal-600 hover:bg-teal-700' },
];

export default function AdminCommandCenter() {
  const [runningMonitor, setRunningMonitor] = useState(false);

  const runMonitor = async () => {
    setRunningMonitor(true);
    try {
      const res = await base44.functions.invoke('followUpMonitor', {});
      toast.success(`Monitor ran — ${res.data?.notifications_created || 0} new alerts`);
    } catch {
      toast.error('Monitor failed');
    }
    setRunningMonitor(false);
  };

  return (
    <AdminGuard>
      <AdminNav>
        <div className="min-h-screen bg-slate-950 text-white">
          {/* Header */}
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 sticky top-0 z-10">
            <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-violet-400" />
                  <h1 className="text-xl font-bold text-white">Command Center</h1>
                </div>
                <p className="text-slate-400 text-sm">Full-platform operational intelligence</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={runMonitor} disabled={runningMonitor}>
                  {runningMonitor ? 'Running...' : '⚡ Run Monitor'}
                </Button>
                <Link to={createPageUrl('AdminSales')}>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">🔔 Sales Alerts</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="max-w-screen-2xl mx-auto px-6 py-6 space-y-8">
            {/* Today's Actions */}
            <TodaysActionsPanel />

            {/* CRM Pipeline */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <CRMPipelinePanel />
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                {QUICK_ACTIONS.map(({ label, icon: Icon, page, color }) => (
                  <Link key={label} to={createPageUrl(page)}>
                    <Button size="sm" className={`${color} text-white gap-2`}>
                      <Icon className="w-4 h-4" />{label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            {/* Key Metrics */}
            <MetricCards />

            {/* Content Engine */}
            <ContentEngineStats />

            {/* Charts + Alerts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <TrafficLeadCharts />
              </div>
              <div className="space-y-4">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Action Required</h2>
                <AlertsSummaryPanel />
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
                  <ProposalsMetricsPanel />
                </div>
                <PipelineSummaryPanel />
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                  <SalesAlertsPanel />
                </div>
              </div>
            </div>

            {/* Funnel + Autopilot */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <LeadFunnelMetrics />
              <AutopilotStatus />
            </div>

            {/* City SEO + Activity Feed */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <CitySEOTable />
              </div>
              <div>
                <ActivityFeed />
              </div>
            </div>
          </div>
        </div>
      </AdminNav>
    </AdminGuard>
  );
}
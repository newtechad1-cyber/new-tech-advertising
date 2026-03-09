import React, { useState } from 'react';
import AdminGuard from '@/components/auth/AdminGuard';
import AdminNav from '@/components/nav/AdminNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Target, Loader2, RefreshCw, LayoutDashboard, Kanban, Users, Activity, Globe, AlertTriangle, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

import SalesKPIRow from '@/components/sales/cmd/SalesKPIRow.jsx';
import SalesPipelineBoard from '@/components/sales/cmd/SalesPipelineBoard.jsx';
import SalesTeamTable from '@/components/sales/cmd/SalesTeamTable.jsx';
import SalesActivityFeed from '@/components/sales/cmd/SalesActivityFeed.jsx';
import SalesLeadSources from '@/components/sales/cmd/SalesLeadSources.jsx';
import SalesStallAlerts from '@/components/sales/cmd/SalesStallAlerts.jsx';
import SalesRevenueForecast from '@/components/sales/cmd/SalesRevenueForecast.jsx';
import SalesQuickActions from '@/components/sales/cmd/SalesQuickActions.jsx';

// Legacy panels kept accessible via dedicated tab
import SalesAlertsPanel from '@/components/sales/SalesAlertsPanel';
import HotLeadsPanel from '@/components/sales/HotLeadsPanel';
import ProposalTracker from '@/components/sales/ProposalTracker';
import TrialSignupsPanel from '@/components/sales/TrialSignupsPanel';

export default function AdminSales() {
  const [runningMonitor, setRunningMonitor] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const tabFromUrl = urlParams.get('tab') || 'overview';
  const highlightProposalId = urlParams.get('proposal_id');

  const runMonitor = async () => {
    setRunningMonitor(true);
    try {
      const res = await base44.functions.invoke('followUpMonitor', {});
      toast.success(`Monitor complete — ${res.data?.notifications_created || 0} new alerts`);
    } catch {
      toast.error('Monitor run failed');
    }
    setRunningMonitor(false);
  };

  return (
    <AdminGuard>
      <AdminNav>
        <div className="min-h-screen bg-gray-950 text-white">
          {/* Header */}
          <div className="border-b border-gray-800 bg-gray-900 sticky top-0 z-20">
            <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-900/40 border border-orange-800 rounded-lg">
                  <Target className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Sales Command Center</h1>
                  <p className="text-xs text-gray-500">Leads · Pipeline · Team · Forecast</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <SalesQuickActions />
                <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800" asChild>
                  <Link to={createPageUrl('LeadsDashboard')}>All Leads</Link>
                </Button>
                <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800" onClick={runMonitor} disabled={runningMonitor}>
                  {runningMonitor ? <><Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> Running...</> : <><RefreshCw className="w-3.5 h-3.5 mr-1" /> Run Monitor</>}
                </Button>
              </div>
            </div>
          </div>

          {highlightProposalId && (
            <div className="max-w-screen-2xl mx-auto px-6 pt-4">
              <div className="bg-blue-900/30 border border-blue-700 text-blue-300 text-sm px-4 py-2 rounded-lg">
                📄 Viewing proposal context from Alert Center — ID: <code className="font-mono text-xs">{highlightProposalId}</code>
              </div>
            </div>
          )}

          {/* KPI Row — always visible */}
          <div className="max-w-screen-2xl mx-auto px-6 py-5">
            <SalesKPIRow />
          </div>

          {/* Tabs */}
          <div className="max-w-screen-2xl mx-auto px-6 pb-10">
            <Tabs defaultValue={tabFromUrl}>
              <TabsList className="bg-gray-900 border border-gray-800 mb-6 flex-wrap h-auto gap-1 p-1">
                <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700 text-gray-400 data-[state=active]:text-white gap-1.5">
                  <LayoutDashboard className="w-3.5 h-3.5" /> Overview
                </TabsTrigger>
                <TabsTrigger value="pipeline" className="data-[state=active]:bg-gray-700 text-gray-400 data-[state=active]:text-white gap-1.5">
                  <Kanban className="w-3.5 h-3.5" /> Pipeline Board
                </TabsTrigger>
                <TabsTrigger value="team" className="data-[state=active]:bg-gray-700 text-gray-400 data-[state=active]:text-white gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Team Performance
                </TabsTrigger>
                <TabsTrigger value="activity" className="data-[state=active]:bg-gray-700 text-gray-400 data-[state=active]:text-white gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Activity Feed
                </TabsTrigger>
                <TabsTrigger value="sources" className="data-[state=active]:bg-gray-700 text-gray-400 data-[state=active]:text-white gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Lead Sources
                </TabsTrigger>
                <TabsTrigger value="alerts" className="data-[state=active]:bg-gray-700 text-gray-400 data-[state=active]:text-white gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Stall Alerts
                </TabsTrigger>
                <TabsTrigger value="forecast" className="data-[state=active]:bg-gray-700 text-gray-400 data-[state=active]:text-white gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Forecast
                </TabsTrigger>
                <TabsTrigger value="legacy" className="data-[state=active]:bg-gray-700 text-gray-400 data-[state=active]:text-white">
                  🔔 Notifications
                </TabsTrigger>
              </TabsList>

              {/* OVERVIEW — pipeline + activity side-by-side */}
              <TabsContent value="overview">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                  <div className="xl:col-span-2 space-y-5">
                    <div>
                      <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Pipeline</h2>
                      <SalesPipelineBoard />
                    </div>
                    <SalesRevenueForecast />
                  </div>
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Stall Alerts</h2>
                      <SalesStallAlerts />
                    </div>
                    <SalesActivityFeed limit={20} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pipeline">
                <div className="mb-3 text-sm text-gray-500">Drag and drop deals between stages to update their status.</div>
                <SalesPipelineBoard />
              </TabsContent>

              <TabsContent value="team">
                <SalesTeamTable />
              </TabsContent>

              <TabsContent value="activity">
                <div className="max-w-2xl">
                  <SalesActivityFeed limit={100} />
                </div>
              </TabsContent>

              <TabsContent value="sources">
                <div className="max-w-3xl">
                  <SalesLeadSources />
                </div>
              </TabsContent>

              <TabsContent value="alerts">
                <div className="max-w-2xl">
                  <div className="mb-4 text-sm text-gray-500">Warning panel for stalled deals and missed follow-ups.</div>
                  <SalesStallAlerts />
                </div>
              </TabsContent>

              <TabsContent value="forecast">
                <div className="max-w-3xl">
                  <SalesRevenueForecast />
                </div>
              </TabsContent>

              {/* Legacy notification/hot leads tabs */}
              <TabsContent value="legacy">
                <Tabs defaultValue="notifications">
                  <TabsList className="mb-4">
                    <TabsTrigger value="notifications">🔔 Alerts</TabsTrigger>
                    <TabsTrigger value="hot">🔥 Hot Leads</TabsTrigger>
                    <TabsTrigger value="proposals">📄 Proposals</TabsTrigger>
                    <TabsTrigger value="trials">🚀 Trials</TabsTrigger>
                  </TabsList>
                  <TabsContent value="notifications"><SalesAlertsPanel /></TabsContent>
                  <TabsContent value="hot"><HotLeadsPanel /></TabsContent>
                  <TabsContent value="proposals"><ProposalTracker /></TabsContent>
                  <TabsContent value="trials"><TrialSignupsPanel /></TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </AdminNav>
    </AdminGuard>
  );
}
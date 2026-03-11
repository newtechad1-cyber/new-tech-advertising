import React from 'react';
import AdminNav from '@/components/nav/AdminNav';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Database, Map, Settings, Clock, AlertTriangle, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import NavigationHealthScore from '@/components/navigation/NavigationHealthScore';
import RouteConflictDetection from '@/components/navigation/RouteConflictDetection';
import RecentPageGovernanceChanges from '@/components/navigation/RecentPageGovernanceChanges';
import ArchitectureHealthScoring from '@/components/navigation/ArchitectureHealthScoring';
import NextBestArchitectureAction from '@/components/navigation/NextBestArchitectureAction';
import HighRiskPagesPanel from '@/components/navigation/HighRiskPagesPanel';
import ArchitectureConflictAlerts from '@/components/navigation/ArchitectureConflictAlerts';
import PageCategoryBrowser from '@/components/navigation/PageCategoryBrowser';

export default function AdminNavigation() {
  const { data: pages = [] } = useQuery({
    queryKey: ['master-pages'],
    queryFn: () => base44.entities.MasterPageDefinition?.list?.().catch(() => []),
  });

  const { data: routes = [] } = useQuery({
    queryKey: ['master-routes'],
    queryFn: () => base44.entities.MasterRouteDefinition?.list?.().catch(() => []),
  });

  const { data: navs = [] } = useQuery({
    queryKey: ['navigation-definitions'],
    queryFn: () => base44.entities.NavigationDefinition?.list?.().catch(() => []),
  });

  const { data: layouts = [] } = useQuery({
    queryKey: ['layout-definitions'],
    queryFn: () => base44.entities.LayoutDefinition?.list?.().catch(() => []),
  });

  const { data: health = [] } = useQuery({
    queryKey: ['route-health'],
    queryFn: () => base44.entities.RouteHealthSnapshot?.list?.('-snapshot_time', 100).catch(() => []),
  });

  const { data: audits = [] } = useQuery({
    queryKey: ['page-governance-audits'],
    queryFn: () => base44.entities.PageGovernanceAuditLog?.list?.('-created_at', 50).catch(() => []),
  });

  const activePages = pages.filter(p => p.active).length;
  const activeRoutes = routes.filter(r => r.active).length;
  const activeNavs = navs.filter(n => n.active).length;
  const activeLayouts = layouts.filter(l => l.active).length;

  const kpis = [
    { label: 'Registered Pages', value: activePages, icon: Database, color: 'blue' },
    { label: 'Registered Routes', value: activeRoutes, icon: Map, color: 'cyan' },
    { label: 'Nav Families', value: activeNavs, icon: Settings, color: 'purple' },
    { label: 'Layout Definitions', value: activeLayouts, icon: Eye, color: 'emerald' },
  ];

  return (
    <AdminNav currentPage="AdminNavigation">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Navigation & Page Registry</h1>
          <p className="text-slate-400 mt-1">Master control center for routes, pages, navigation families, and layouts</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            const colors = {
              blue: 'bg-blue-900/20 border-blue-700 text-blue-400',
              cyan: 'bg-cyan-900/20 border-cyan-700 text-cyan-400',
              purple: 'bg-purple-900/20 border-purple-700 text-purple-400',
              emerald: 'bg-emerald-900/20 border-emerald-700 text-emerald-400',
            };

            return (
              <div key={idx} className={`border rounded-lg p-4 ${colors[kpi.color]}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold opacity-70">{kpi.label}</p>
                    <p className="text-2xl font-bold mt-2">{kpi.value}</p>
                  </div>
                  <Icon className="w-5 h-5 opacity-50" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="layouts">Layouts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <NavigationHealthScore pages={pages} routes={routes} navs={navs} health={health} />
            <RouteConflictDetection routes={routes} pages={pages} />
            <RecentPageGovernanceChanges audits={audits} />
          </TabsContent>

          <TabsContent value="pages">
            <Card className="bg-slate-950 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Page Registry Explorer</span>
                  <Link
                    to={createPageUrl('AdminNavigationPages')}
                    className="text-xs bg-blue-900/50 hover:bg-blue-900 text-blue-300 px-3 py-1.5 rounded border border-blue-700"
                  >
                    View All Pages →
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-400">
                <p className="text-sm">
                  View all registered pages, their routes, layouts, navigation families, owners, and health status.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routes">
            <Card className="bg-slate-950 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Route Registry Explorer</span>
                  <Link
                    to={createPageUrl('AdminNavigationRoutes')}
                    className="text-xs bg-blue-900/50 hover:bg-blue-900 text-blue-300 px-3 py-1.5 rounded border border-blue-700"
                  >
                    View All Routes →
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-400">
                <p className="text-sm">
                  Explore all registered routes, their mappings, families, layouts, guards, and conflict status.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="navigation">
            <Card className="bg-slate-950 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Navigation Families</span>
                  <Link
                    to={createPageUrl('AdminNavigationNav')}
                    className="text-xs bg-blue-900/50 hover:bg-blue-900 text-blue-300 px-3 py-1.5 rounded border border-blue-700"
                  >
                    View All Navs →
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-400">
                <p className="text-sm">
                  Explore navigation families, their items, route family coverage, and deprecated targets.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layouts">
            <Card className="bg-slate-950 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Layout Governance</span>
                  <Link
                    to={createPageUrl('AdminNavigationLayouts')}
                    className="text-xs bg-blue-900/50 hover:bg-blue-900 text-blue-300 px-3 py-1.5 rounded border border-blue-700"
                  >
                    View All Layouts →
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-400">
                <p className="text-sm">
                  Monitor layouts, allowed route families, allowed page categories, and layout mismatch alerts.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminNav>
  );
}
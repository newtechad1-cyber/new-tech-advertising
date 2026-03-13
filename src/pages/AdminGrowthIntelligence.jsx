import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, AlertTriangle, Target, Users, Zap } from 'lucide-react';

export default function AdminGrowthIntelligence() {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch all growth snapshots
  const { data: snapshots, isLoading } = useQuery({
    queryKey: ['all-growth-snapshots'],
    queryFn: async () => {
      return await base44.entities.GrowthMetricsSnapshot.list('-snapshotDate', 500);
    }
  });

  // Fetch organizations
  const { data: organizations } = useQuery({
    queryKey: ['all-organizations'],
    queryFn: async () => {
      return await base44.entities.Organization.list('-created_date', 500);
    }
  });

  if (isLoading) return <AdminLayout><div className="p-6 animate-pulse">Loading...</div></AdminLayout>;

  // Calculate analytics
  const latestSnapshots = new Map();
  snapshots?.forEach(s => {
    if (!latestSnapshots.has(s.organizationId) || 
        new Date(s.snapshotDate) > new Date(latestSnapshots.get(s.organizationId).snapshotDate)) {
      latestSnapshots.set(s.organizationId, s);
    }
  });

  const latestSnapshotsArray = Array.from(latestSnapshots.values());

  const stats = {
    totalOrgs: organizations?.length || 0,
    activeOrgs: latestSnapshotsArray.length,
    avgGrowthScore: latestSnapshotsArray.length > 0
      ? Math.round(latestSnapshotsArray.reduce((sum, s) => sum + (s.growthScore || 0), 0) / latestSnapshotsArray.length)
      : 0,
    totalRevenueAttributed: latestSnapshotsArray.reduce((sum, s) => sum + (s.revenueAttributed || 0), 0) / 100,
    upgradeReady: latestSnapshotsArray.filter(s => s.upgradeReadinessScore > 75).length,
    atRisk: latestSnapshotsArray.filter(s => s.churnRiskScore > 70).length
  };

  // Top performers
  const topPerformers = latestSnapshotsArray
    .sort((a, b) => (b.growthScore || 0) - (a.growthScore || 0))
    .slice(0, 5);

  // At-risk clients
  const atRiskClients = latestSnapshotsArray
    .filter(s => s.churnRiskScore > 70)
    .sort((a, b) => (b.churnRiskScore || 0) - (a.churnRiskScore || 0))
    .slice(0, 5);

  // Upgrade-ready clients
  const upgradeReadyClients = latestSnapshotsArray
    .filter(s => s.upgradeReadinessScore > 75)
    .sort((a, b) => (b.upgradeReadinessScore || 0) - (a.upgradeReadinessScore || 0))
    .slice(0, 5);

  // Growth score distribution
  const growthDistribution = [
    { range: '80-100', count: latestSnapshotsArray.filter(s => s.growthScore >= 80).length, color: '#10b981' },
    { range: '60-79', count: latestSnapshotsArray.filter(s => s.growthScore >= 60 && s.growthScore < 80).length, color: '#3b82f6' },
    { range: '40-59', count: latestSnapshotsArray.filter(s => s.growthScore >= 40 && s.growthScore < 60).length, color: '#f59e0b' },
    { range: '0-39', count: latestSnapshotsArray.filter(s => s.growthScore < 40).length, color: '#ef4444' }
  ];

  // Revenue influence scatter
  const revenueScatter = latestSnapshotsArray.map(s => ({
    growthScore: s.growthScore,
    revenue: (s.revenueAttributed || 0) / 100,
    orgId: s.organizationId,
    momentumScore: s.momentumScore
  }));

  const getOrgName = (orgId) => {
    return organizations?.find(o => o.id === orgId)?.organizationName || orgId.slice(0, 8);
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Growth Intelligence Dashboard</h1>
          <p className="text-slate-600 mt-2">
            Real-time ROI, growth metrics, and client readiness analysis
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600">Active Organizations</p>
                <p className="text-2xl font-bold mt-1">{stats.activeOrgs}</p>
              </div>
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600">Avg Growth Score</p>
                <p className="text-2xl font-bold mt-1">{stats.avgGrowthScore}</p>
              </div>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600">Total Revenue</p>
                <p className="text-xl font-bold mt-1">
                  ${stats.totalRevenueAttributed.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <Zap className="w-6 h-6 text-amber-500" />
            </div>
          </Card>

          <Card className="p-4 border-2 border-green-200 bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600">Upgrade Ready</p>
                <p className="text-2xl font-bold mt-1">{stats.upgradeReady}</p>
              </div>
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </Card>

          <Card className="p-4 border-2 border-red-200 bg-red-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600">At-Risk</p>
                <p className="text-2xl font-bold mt-1">{stats.atRisk}</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600">Total Organizations</p>
                <p className="text-2xl font-bold mt-1">{stats.totalOrgs}</p>
              </div>
              <Users className="w-6 h-6 text-slate-500" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="topperformers">Top Performers</TabsTrigger>
            <TabsTrigger value="atrisk">At-Risk</TabsTrigger>
            <TabsTrigger value="upgrade">Upgrade Ready</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            {/* Growth Score Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Growth Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={growthDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Influenced by Growth Score */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Influenced by Growth Score</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="growthScore" name="Growth Score" />
                    <YAxis type="number" dataKey="revenue" name="Revenue ($)" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Organizations" data={revenueScatter} fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Top Performers */}
          <TabsContent value="topperformers">
            <Card>
              <CardHeader>
                <CardTitle>🏆 Top Performing Organizations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerformers.map((snapshot, idx) => (
                    <div key={snapshot.id} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-green-600 text-white">#{idx + 1}</Badge>
                            <h4 className="font-semibold">{getOrgName(snapshot.organizationId)}</h4>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-sm mt-2">
                            <div>
                              <p className="text-xs text-slate-600">Growth Score</p>
                              <p className="font-bold">{snapshot.growthScore}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-600">Revenue</p>
                              <p className="font-bold">${(snapshot.revenueAttributed / 100).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-600">Content</p>
                              <p className="font-bold">{snapshot.contentPublishedCount}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-600">Leads</p>
                              <p className="font-bold">{snapshot.leadsLoggedCount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* At-Risk */}
          <TabsContent value="atrisk">
            <Card>
              <CardHeader>
                <CardTitle>⚠️ At-Risk Organizations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {atRiskClients.length === 0 ? (
                    <p className="text-slate-600">No at-risk organizations detected.</p>
                  ) : (
                    atRiskClients.map((snapshot, idx) => (
                      <div key={snapshot.id} className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-red-600 text-white">Churn Risk: {snapshot.churnRiskScore}</Badge>
                              <h4 className="font-semibold">{getOrgName(snapshot.organizationId)}</h4>
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-sm mt-2">
                              <div>
                                <p className="text-xs text-slate-600">Growth Score</p>
                                <p className="font-bold">{snapshot.growthScore}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-600">Days Inactive</p>
                                <p className="font-bold">?</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-600">Content</p>
                                <p className="font-bold">{snapshot.contentPublishedCount}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-600">Recommendation</p>
                                <p className="font-bold text-red-600">Intervention</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upgrade Ready */}
          <TabsContent value="upgrade">
            <Card>
              <CardHeader>
                <CardTitle>🚀 Upgrade-Ready Organizations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upgradeReadyClients.length === 0 ? (
                    <p className="text-slate-600">No upgrade-ready organizations detected.</p>
                  ) : (
                    upgradeReadyClients.map((snapshot, idx) => (
                      <div key={snapshot.id} className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-green-600 text-white">Upgrade Ready: {snapshot.upgradeReadinessScore}</Badge>
                              <h4 className="font-semibold">{getOrgName(snapshot.organizationId)}</h4>
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-sm mt-2">
                              <div>
                                <p className="text-xs text-slate-600">Growth Score</p>
                                <p className="font-bold">{snapshot.growthScore}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-600">Current Plan</p>
                                <p className="font-bold">{snapshot.planKey}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-600">Content</p>
                                <p className="font-bold">{snapshot.contentPublishedCount}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-600">Recommendation</p>
                                <p className="font-bold text-green-600">Upgrade Offer</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, Share2, ArrowRight, TrendingUp } from 'lucide-react';

export default function ClientMonthlyGrowthReport() {
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  // Fetch latest snapshot
  const { data: currentSnapshot, isLoading } = useQuery({
    queryKey: ['current-growth-snapshot'],
    queryFn: async () => {
      const user = await base44.auth.me();
      if (!user) return null;

      // Get organization for this user
      const orgs = await base44.entities.Organization.filter(
        { ownerUserId: user.id },
        '-created_date',
        1
      );

      if (!orgs || orgs.length === 0) return null;

      // Get latest growth snapshot
      const snapshots = await base44.entities.GrowthMetricsSnapshot.filter(
        { organizationId: orgs[0].id },
        '-snapshotDate',
        1
      );

      return snapshots?.[0];
    }
  });

  // Fetch historical snapshots for chart
  const { data: historicalData } = useQuery({
    queryKey: ['historical-growth-snapshots'],
    queryFn: async () => {
      const user = await base44.auth.me();
      if (!user) return [];

      const orgs = await base44.entities.Organization.filter(
        { ownerUserId: user.id },
        '-created_date',
        1
      );

      if (!orgs || orgs.length === 0) return [];

      const snapshots = await base44.entities.GrowthMetricsSnapshot.filter(
        { organizationId: orgs[0].id },
        '-snapshotDate',
        12
      );

      return snapshots?.reverse() || [];
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="animate-pulse">Loading report...</div>
      </div>
    );
  }

  if (!currentSnapshot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <Card className="max-w-2xl mx-auto p-8">
          <p className="text-slate-600">No growth data available yet.</p>
        </Card>
      </div>
    );
  }

  const trendData = historicalData?.map(s => ({
    date: new Date(s.snapshotDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    growthScore: s.growthScore,
    momentum: s.momentumScore,
    revenue: (s.revenueAttributed / 100) || 0,
    leads: s.leadsLoggedCount,
    content: s.contentPublishedCount
  })) || [];

  const getInsightColor = (score) => {
    if (score >= 75) return 'bg-green-50 border-green-200';
    if (score >= 50) return 'bg-blue-50 border-blue-200';
    if (score >= 25) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Monthly Growth Report</h1>
              <p className="text-slate-600 mt-1">
                {new Date(currentSnapshot.snapshotDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long'
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <Card className={`border-2 mb-6 ${getInsightColor(currentSnapshot.growthScore)}`}>
          <CardHeader>
            <CardTitle>Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-600">Growth Score</p>
                <p className="text-3xl font-bold mt-1">{currentSnapshot.growthScore}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Momentum</p>
                <p className="text-3xl font-bold mt-1">{currentSnapshot.momentumScore}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Content Published</p>
                <p className="text-3xl font-bold mt-1">{currentSnapshot.contentPublishedCount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Revenue Attributed</p>
                <p className="text-2xl font-bold mt-1">
                  ${(currentSnapshot.revenueAttributed / 100).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Completed */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>📊 Work Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-slate-700">Content Created</p>
                <p className="text-3xl font-bold mt-2">{currentSnapshot.contentCreatedCount}</p>
                <p className="text-xs text-slate-600 mt-1">pieces</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-slate-700">Videos Produced</p>
                <p className="text-3xl font-bold mt-2">{currentSnapshot.videosCreatedCount}</p>
                <p className="text-xs text-slate-600 mt-1">videos</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-slate-700">Pages Published</p>
                <p className="text-3xl font-bold mt-2">{currentSnapshot.pagesPublishedCount}</p>
                <p className="text-xs text-slate-600 mt-1">pages</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm font-medium text-slate-700">Content Published</p>
                <p className="text-3xl font-bold mt-2">{currentSnapshot.contentPublishedCount}</p>
                <p className="text-xs text-slate-600 mt-1">total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leads & Revenue */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🎯 Leads & Revenue Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-slate-700">Leads Captured</p>
                <p className="text-4xl font-bold mt-2">{currentSnapshot.leadsLoggedCount}</p>
                <p className="text-xs text-slate-600 mt-1">this month</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                <p className="text-sm font-medium text-slate-700">Deals Closed</p>
                <p className="text-4xl font-bold mt-2">{currentSnapshot.dealsClosedCount}</p>
                <p className="text-xs text-slate-600 mt-1">conversions</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-slate-700">Revenue Attributed</p>
                <p className="text-3xl font-bold mt-2">
                  ${(currentSnapshot.revenueAttributed / 100).toLocaleString()}
                </p>
                <p className="text-xs text-slate-600 mt-1">total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Growth Trend */}
        {trendData.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>📈 Growth Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="growthScore" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="momentum" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* ROI Estimate */}
        <Card className="mb-6 border-2 border-emerald-200 bg-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>💰 Estimated ROI</span>
              <Badge className="bg-emerald-100 text-emerald-800">
                {currentSnapshot.roiConfidence} confidence
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-white rounded-lg border border-emerald-200">
              <p className="text-sm text-slate-600 mb-2">Your ROI This Period</p>
              <p className="text-5xl font-bold text-emerald-600">{currentSnapshot.roiEstimate}%</p>
              <p className="text-sm text-slate-600 mt-3">
                Based on {currentSnapshot.contentPublishedCount} content pieces, {currentSnapshot.leadsLoggedCount} leads, and ${(currentSnapshot.revenueAttributed / 100).toLocaleString()} in attributed revenue.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Next Action */}
        {currentSnapshot.nextBestAction && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="w-5 h-5" />
                Recommended Next Action
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const action = JSON.parse(currentSnapshot.nextBestAction);
                return (
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-lg">{action.title}</p>
                      <p className="text-slate-700 mt-1">{action.description}</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-slate-900 mb-2">Next Step:</p>
                      <p className="text-sm text-slate-700">{action.suggestedAction}</p>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      {action.title}
                    </Button>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
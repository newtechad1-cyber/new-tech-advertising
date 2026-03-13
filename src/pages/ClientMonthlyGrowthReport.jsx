import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, Target, AlertCircle, Zap, ArrowRight } from 'lucide-react';

export default function ClientMonthlyGrowthReport() {
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [communicationHistory, setCommunicationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const authenticatedUser = await base44.auth.me();
        if (!authenticatedUser) {
          window.location.href = '/';
          return;
        }
        setUser(authenticatedUser);

        // Fetch organization (assume single org for now)
        const orgs = await base44.entities.Organization.filter(
          { created_by: authenticatedUser.email },
          '-created_date',
          1
        );

        if (orgs.length === 0) {
          setIsLoading(false);
          return;
        }

        const org = orgs[0];
        setOrganization(org);

        // Fetch latest growth snapshot
        const snapshots = await base44.entities.GrowthMetricsSnapshot.filter(
          { organizationId: org.id },
          '-snapshotDate',
          1
        );

        if (snapshots.length > 0) {
          setSnapshot(snapshots[0]);
        }

        // Fetch communication history for this org
        const comms = await base44.entities.ClientCommunicationLog.filter(
          { organizationId: org.id },
          '-sentAt',
          20
        );
        setCommunicationHistory(comms.filter(c => c.status !== 'draft'));

        // Build report data from snapshot
        if (snapshots.length > 0) {
          const s = snapshots[0];
          setReportData({
            executiveSummary: {
              growthScore: s.growthScore || 0,
              momentumScore: s.momentumScore || 0,
              revenue: s.revenueAttributed || 0,
              roiEstimate: s.roiEstimate || 0,
              roiConfidence: s.roiConfidence || 'low'
            },
            whatWeBuilt: {
              contentPublished: s.contentPublishedCount || 0,
              videosCreated: s.videosCreatedCount || 0,
              pagesPublished: s.pagesPublishedCount || 0
            },
            leads: {
              logsCount: s.leadsLoggedCount || 0,
              dealsClosedCount: s.dealsClosedCount || 0
            },
            nextBestActions: buildRecommendations(s)
          });
        }
      } catch (error) {
        console.error('Error loading report:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const buildRecommendations = (snapshot) => {
    const recs = [];
    if (snapshot.contentPublishedCount < 4) {
      recs.push("Increase publishing frequency to weekly");
    }
    if (snapshot.leadsLoggedCount === 0 && snapshot.contentPublishedCount > 0) {
      recs.push("Add lead capture forms to your content");
    }
    if (snapshot.growthScore > 70 && snapshot.upgradeReadinessScore > 65) {
      recs.push("You're ready for a managed service upgrade");
    }
    return recs;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-5xl mx-auto flex items-center justify-center h-96">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!organization || !reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-5xl mx-auto">
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6">
              <p className="text-slate-700">No report data available yet. Start publishing content to generate your first growth report.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const trendColor = reportData.executiveSummary.growthScore >= 60 ? 'text-green-600' : 'text-amber-600';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Monthly Growth Report</h1>
              <p className="text-slate-600 mt-1">{organization?.organizationName}</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-600">Growth Score</p>
              <p className={`text-3xl font-bold mt-2 ${trendColor}`}>{reportData.executiveSummary.growthScore}</p>
              <p className="text-xs text-slate-500 mt-1">0-100</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-600">Momentum</p>
              <p className="text-3xl font-bold mt-2 text-blue-600">{reportData.executiveSummary.momentumScore}</p>
              <p className="text-xs text-slate-500 mt-1">Week-over-week</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-600">Revenue</p>
              <p className="text-2xl font-bold mt-2">${(reportData.executiveSummary.revenue / 100).toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-1">Attributed</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-600">ROI Estimate</p>
              <p className="text-3xl font-bold mt-2 text-green-600">{reportData.executiveSummary.roiEstimate}%</p>
              <Badge className="mt-2 text-xs">{reportData.executiveSummary.roiConfidence} confidence</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="summary" className="mb-8">
          <TabsList className="mb-6 grid w-full grid-cols-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="builtwhat">What We Built</TabsTrigger>
            <TabsTrigger value="impact">Business Impact</TabsTrigger>
            <TabsTrigger value="next">What's Next</TabsTrigger>
          </TabsList>

          {/* Summary */}
          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>This Month at a Glance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Overall Trajectory</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Your growth score of <span className="font-bold">{reportData.executiveSummary.growthScore}</span> shows a{' '}
                    {reportData.executiveSummary.growthScore >= 70 ? 'strong acceleration' : 'solid progression'} in your marketing execution.
                    {reportData.executiveSummary.momentumScore > 50 && ' Your momentum is building week-over-week.'}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Key Highlights</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-slate-700">
                        {reportData.whatWeBuilt.contentPublished} pieces of content published
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span className="text-slate-700">
                        {reportData.leads.logsCount} qualified leads captured
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-amber-600 mt-1 flex-shrink-0" />
                      <span className="text-slate-700">
                        ${(reportData.executiveSummary.revenue / 100).toLocaleString()} in attributed revenue
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* What We Built */}
          <TabsContent value="builtwhat">
            <Card>
              <CardHeader>
                <CardTitle>Marketing Execution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{reportData.whatWeBuilt.contentPublished}</p>
                    <p className="text-sm text-slate-600 mt-1">Content Pieces</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{reportData.whatWeBuilt.videosCreated}</p>
                    <p className="text-sm text-slate-600 mt-1">Videos Created</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{reportData.whatWeBuilt.pagesPublished}</p>
                    <p className="text-sm text-slate-600 mt-1">Pages Published</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">What This Means</h3>
                  <p className="text-slate-700">
                    Your team executed on content across multiple channels. This consistent publishing builds authority,
                    keeps you top-of-mind with prospects, and feeds your SEO visibility.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Impact */}
          <TabsContent value="impact">
            <Card>
              <CardHeader>
                <CardTitle>Leads, Revenue & ROI</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-3xl font-bold text-slate-900">{reportData.leads.logsCount}</p>
                    <p className="text-sm text-slate-600 mt-1">Qualified Leads</p>
                    <p className="text-xs text-slate-500 mt-2">From your content strategy</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-3xl font-bold text-slate-900">{reportData.leads.dealsClosedCount}</p>
                    <p className="text-sm text-slate-600 mt-1">Deals Closed</p>
                    <p className="text-xs text-slate-500 mt-2">${(reportData.executiveSummary.revenue / 100).toLocaleString()} revenue</p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">ROI Explanation</h3>
                  <p className="text-sm text-blue-800">
                    Your estimated ROI of {reportData.executiveSummary.roiEstimate}% reflects the revenue generated relative to your marketing investment.
                    {reportData.executiveSummary.roiConfidence === 'high' && ' This is based on solid data.'}
                    {reportData.executiveSummary.roiConfidence === 'medium' && ' Additional data will refine this estimate.'}
                    {reportData.executiveSummary.roiConfidence === 'low' && ' More lead tracking will improve accuracy.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* What's Next */}
          <TabsContent value="next">
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportData.nextBestActions.map((action, idx) => (
                    <div key={idx} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                      <div className="flex items-start gap-3">
                        <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                        <p className="text-slate-700">{action}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {reportData.executiveSummary.growthScore > 70 && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">🚀 Upgrade Opportunity</h3>
                    <p className="text-sm text-green-800 mb-3">
                      Your execution metrics show you're ready for professional management. Let our team take over strategy and execution.
                    </p>
                    <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-semibold">
                      Explore Upgrade
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Communication History */}
        {communicationHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Communication History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {communicationHistory.slice(0, 5).map((comm) => (
                  <div key={comm.id} className="p-3 border border-slate-200 rounded-lg text-sm">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-900">{comm.subject}</p>
                      <Badge>{comm.communicationType.replace('_', ' ')}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Sent {new Date(comm.sentAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, AlertTriangle, Zap, Target, Users, Wrench } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function AdminIntelligence() {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');

  const { data: scores = [] } = useQuery({
    queryKey: ['intelligence-scores'],
    queryFn: () => base44.entities.IntelligenceScore?.list?.('-calculated_at', 100).catch(() => []),
  });

  const { data: insights = [] } = useQuery({
    queryKey: ['intelligence-insights'],
    queryFn: () => base44.entities.IntelligenceInsight?.list?.('-generated_at', 50).catch(() => []),
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ['intelligence-recommendations'],
    queryFn: () => base44.entities.IntelligenceRecommendation?.list?.('-created_at', 30).catch(() => []),
  });

  const { data: signals = [] } = useQuery({
    queryKey: ['intelligence-signals'],
    queryFn: () => base44.entities.IntelligenceSignalSnapshot?.list?.('-captured_at', 200).catch(() => []),
  });

  // Calculate KPIs
  const kpis = useMemo(() => {
    const clientRetentionScores = scores.filter(s => s.score_type === 'client_retention_risk');
    const dealScores = scores.filter(s => s.score_type === 'deal_close_probability');
    const publishingScores = scores.filter(s => s.score_type === 'publishing_momentum');
    const automationScores = scores.filter(s => s.score_type === 'automation_reliability');

    const clientsAtRisk = clientRetentionScores.filter(s => s.score_value < 40).length;
    const dealsClosing = dealScores.filter(s => s.score_value > 70).length;
    const publishingMomentum = publishingScores.length > 0
      ? Math.round(publishingScores.reduce((a, s) => a + s.score_value, 0) / publishingScores.length)
      : 0;
    const automationHealth = automationScores.length > 0
      ? Math.round(automationScores.reduce((a, s) => a + s.score_value, 0) / automationScores.length)
      : 0;

    const criticalInsights = insights.filter(i => i.priority_level === 'critical').length;
    const resellerSignals = signals.filter(s => s.context_type === 'reseller').length;
    const immediatePriority = recommendations.filter(r => r.urgency === 'immediate').length;
    const onboardingBottlenecks = signals.filter(s => s.signal_type === 'onboarding_duration').length;

    return {
      clientsAtRisk,
      dealsClosing,
      publishingMomentum,
      automationHealth,
      criticalInsights,
      resellerSignals,
      immediatePriority,
      onboardingBottlenecks,
    };
  }, [scores, insights, signals, recommendations]);

  const topInsights = useMemo(() => {
    return insights
      .filter(i => i.status === 'active')
      .sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority_level] - priorityOrder[b.priority_level];
      })
      .slice(0, 5);
  }, [insights]);

  const topRecommendations = useMemo(() => {
    return recommendations
      .filter(r => r.status === 'pending')
      .sort((a, b) => {
        const urgencyOrder = { immediate: 0, high: 1, medium: 2, low: 3 };
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      })
      .slice(0, 6);
  }, [recommendations]);

  const priorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-950/30 border-red-700/50 text-red-300',
      high: 'bg-orange-950/30 border-orange-700/50 text-orange-300',
      medium: 'bg-yellow-950/30 border-yellow-700/50 text-yellow-300',
      low: 'bg-slate-800/30 border-slate-700/50 text-slate-300',
    };
    return colors[priority] || colors.low;
  };

  const urgencyColor = (urgency) => {
    const colors = {
      immediate: 'bg-red-950 text-red-300',
      high: 'bg-orange-950 text-orange-300',
      medium: 'bg-yellow-950 text-yellow-300',
      low: 'bg-slate-800 text-slate-300',
    };
    return colors[urgency] || colors.low;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Intelligence Command Center</h1>
          <p className="text-slate-400">Predictive insights and recommended actions</p>
        </div>

        {/* Period Filter */}
        <div className="flex gap-2">
          {['daily', 'weekly', 'monthly'].map(period => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className="capitalize"
            >
              {period}
            </Button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card className="bg-gradient-to-br from-red-950/40 to-red-950/10 border-red-700/30">
            <CardContent className="p-4">
              <p className="text-xs text-red-400 mb-1">Clients At Risk</p>
              <p className="text-2xl font-bold text-red-300">{kpis.clientsAtRisk}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-red-400">
                <AlertTriangle className="w-3 h-3" />
                <span>retention_risk</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-950/40 to-emerald-950/10 border-emerald-700/30">
            <CardContent className="p-4">
              <p className="text-xs text-emerald-400 mb-1">Deals Likely Close</p>
              <p className="text-2xl font-bold text-emerald-300">{kpis.dealsClosing}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-emerald-400">
                <TrendingUp className="w-3 h-3" />
                <span>closing_soon</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-950/40 to-blue-950/10 border-blue-700/30">
            <CardContent className="p-4">
              <p className="text-xs text-blue-400 mb-1">Publishing Momentum</p>
              <p className="text-2xl font-bold text-blue-300">{kpis.publishingMomentum}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-blue-400">
                <Zap className="w-3 h-3" />
                <span>/100 score</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-950/40 to-cyan-950/10 border-cyan-700/30">
            <CardContent className="p-4">
              <p className="text-xs text-cyan-400 mb-1">Automation Health</p>
              <p className="text-2xl font-bold text-cyan-300">{kpis.automationHealth}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-cyan-400">
                <Wrench className="w-3 h-3" />
                <span>/100 health</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-950/40 to-purple-950/10 border-purple-700/30">
            <CardContent className="p-4">
              <p className="text-xs text-purple-400 mb-1">Reseller Growth</p>
              <p className="text-2xl font-bold text-purple-300">{kpis.resellerSignals}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-purple-400">
                <Users className="w-3 h-3" />
                <span>signals</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-950/40 to-indigo-950/10 border-indigo-700/30">
            <CardContent className="p-4">
              <p className="text-xs text-indigo-400 mb-1">Immediate Actions</p>
              <p className="text-2xl font-bold text-indigo-300">{kpis.immediatePriority}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-indigo-400">
                <Target className="w-3 h-3" />
                <span>pending</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="insights">Top Insights</TabsTrigger>
            <TabsTrigger value="recommendations">Recommended Actions</TabsTrigger>
            <TabsTrigger value="risk">Risk Detection</TabsTrigger>
            <TabsTrigger value="opportunity">Opportunities</TabsTrigger>
          </TabsList>

          {/* Top Insights */}
          <TabsContent value="insights">
            <div className="space-y-3">
              {topInsights.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6 text-center text-slate-400">
                    No insights generated yet
                  </CardContent>
                </Card>
              ) : (
                topInsights.map((insight, idx) => (
                  <Card key={idx} className={`${priorityColor(insight.priority_level)} border`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-white">{insight.headline}</p>
                          <p className="text-xs text-slate-400 mt-1">{insight.narrative_text}</p>
                        </div>
                        <Badge className={`text-xs ${urgencyColor(insight.priority_level === 'critical' ? 'immediate' : 'high')}`}>
                          {insight.priority_level}
                        </Badge>
                      </div>
                      {insight.recommended_action && (
                        <div className="mt-3 p-2 bg-slate-800/50 rounded text-sm text-slate-300">
                          <p className="text-xs text-slate-500 mb-1">Recommended Action</p>
                          <p>{insight.recommended_action}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Recommended Actions */}
          <TabsContent value="recommendations">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {topRecommendations.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-700 md:col-span-2">
                  <CardContent className="p-6 text-center text-slate-400">
                    All recommendations completed
                  </CardContent>
                </Card>
              ) : (
                topRecommendations.map((rec, idx) => (
                  <Card key={idx} className="bg-slate-800/30 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-white text-sm">{rec.suggested_action}</p>
                          <p className="text-xs text-slate-500 mt-1 capitalize">{rec.recommendation_type}</p>
                        </div>
                        <Badge className={`text-xs ${urgencyColor(rec.urgency)}`}>
                          {rec.urgency}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mt-3">
                        <span>Confidence: {rec.confidence_score}%</span>
                        <Button size="xs" variant="outline" className="h-6">
                          Act Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Risk Detection */}
          <TabsContent value="risk">
            <div className="space-y-3">
              {insights
                .filter(i => i.insight_category === 'retention_risk' || i.insight_category === 'early_warning')
                .slice(0, 8)
                .map((risk, idx) => (
                  <Card key={idx} className="bg-red-950/20 border-red-700/50">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold text-red-300 text-sm">{risk.headline}</p>
                          <p className="text-xs text-slate-400 mt-1">{risk.narrative_text}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Opportunities */}
          <TabsContent value="opportunity">
            <div className="space-y-3">
              {insights
                .filter(i => i.insight_category === 'growth_opportunity' || i.insight_category === 'success_pattern')
                .slice(0, 8)
                .map((opp, idx) => (
                  <Card key={idx} className="bg-emerald-950/20 border-emerald-700/50">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-emerald-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold text-emerald-300 text-sm">{opp.headline}</p>
                          <p className="text-xs text-slate-400 mt-1">{opp.narrative_text}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Specialized Views Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-8 border-t border-slate-700">
          <Button variant="outline" asChild className="justify-start">
            <a href={createPageUrl('AdminIntelligenceClients')}>Clients Intelligence</a>
          </Button>
          <Button variant="outline" asChild className="justify-start">
            <a href={createPageUrl('AdminIntelligenceSales')}>Sales Intelligence</a>
          </Button>
          <Button variant="outline" asChild className="justify-start">
            <a href={createPageUrl('AdminIntelligenceAutomation')}>Automation Intelligence</a>
          </Button>
          <Button variant="outline" asChild className="justify-start">
            <a href={createPageUrl('AdminIntelligenceResellers')}>Reseller Intelligence</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
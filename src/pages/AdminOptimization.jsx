import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, TrendingUp, AlertCircle, CheckCircle2, RotateCcw, Settings } from 'lucide-react';
import { createPageUrl } from '@/utils';
import OptimizationMaturityScore from '@/components/optimization/OptimizationMaturityScore';
import NextBestOptimizationAction from '@/components/optimization/NextBestOptimizationAction';
import OptimizationAlerts from '@/components/optimization/OptimizationAlerts';
import TopLearningWins from '@/components/optimization/TopLearningWins';
import OptimizationCategoryGroup from '@/components/optimization/OptimizationCategoryGroup';

export default function AdminOptimization() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { data: candidates = [] } = useQuery({
    queryKey: ['optimization-candidates'],
    queryFn: () => base44.entities.OptimizationCandidate?.list?.('-detected_at', 100).catch(() => []),
  });

  const { data: experiments = [] } = useQuery({
    queryKey: ['optimization-experiments'],
    queryFn: () => base44.entities.OptimizationExperiment?.list?.('-created_at', 100).catch(() => []),
  });

  const { data: outcomes = [] } = useQuery({
    queryKey: ['optimization-outcomes'],
    queryFn: () => base44.entities.OptimizationOutcome?.list?.('-measured_at', 150).catch(() => []),
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ['optimization-recommendations'],
    queryFn: () => base44.entities.OptimizationRecommendation?.list?.('-created_at', 50).catch(() => []),
  });

  const { data: health = [] } = useQuery({
    queryKey: ['optimization-health'],
    queryFn: () => base44.entities.OptimizationHealthSnapshot?.list?.('-snapshot_time', 8).catch(() => []),
  });

  const { data: policies = [] } = useQuery({
    queryKey: ['optimization-policies'],
    queryFn: () => base44.entities.OptimizationPolicy?.list?.('policy_key').catch(() => []),
  });

  const stats = useMemo(() => {
    return {
      activeCanditates: candidates.filter(c => c.status === 'detected').length,
      runningExperiments: experiments.filter(e => e.status === 'running').length,
      adopted: outcomes.filter(o => o.outcome_direction === 'positive').length,
      rollbacks: health.reduce((sum, h) => sum + (h.rollback_count || 0), 0),
      highRisk: candidates.filter(c => c.risk_level === 'high' || c.risk_level === 'critical').length,
      healthScore: health.length > 0 ? health[0].health_score : 0,
    };
  }, [candidates, experiments, outcomes, health]);

  const categoryStats = useMemo(() => {
    const CATEGORY_GROUPS = {
      'Publishing': ['publishing_performance'],
      'Sales': ['sales_conversion'],
      'Onboarding': ['onboarding_efficiency'],
      'Automation': ['automation_reliability'],
      'Reporting': ['reporting_effectiveness'],
      'Reseller Growth': ['reseller_growth'],
      'Client Engagement': ['client_engagement'],
    };

    const stats = {};
    Object.entries(CATEGORY_GROUPS).forEach(([group, categories]) => {
      stats[group] = {
        candidates: candidates.filter(c => categories.includes(c.optimization_category) && c.status === 'detected').length,
        experiments: experiments.filter(e => categories.includes(e.optimization_category) && e.status === 'running').length,
        wins: outcomes.filter(o => {
          const exp = experiments.find(e => e.experiment_key === o.experiment_key);
          return exp && categories.includes(exp.optimization_category) && o.outcome_direction === 'positive';
        }).length,
      };
    });

    return stats;
  }, [candidates, experiments, outcomes]);

  const topOpportunities = useMemo(() => {
    return candidates
      .filter(c => c.status === 'detected')
      .sort((a, b) => (b.confidence_score || 0) - (a.confidence_score || 0))
      .slice(0, 5);
  }, [candidates]);

  const activeExperiments = useMemo(() => {
    return experiments.filter(e => e.status === 'running').slice(0, 5);
  }, [experiments]);

  const recentWins = useMemo(() => {
    return outcomes
      .filter(o => o.outcome_direction === 'positive')
      .sort((a, b) => new Date(b.measured_at) - new Date(a.measured_at))
      .slice(0, 5);
  }, [outcomes]);

  const failedExperiments = useMemo(() => {
    return experiments
      .filter(e => e.status === 'rolled_back' || e.status === 'failed')
      .slice(0, 5);
  }, [experiments]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Self-Optimization Control Center</h1>
          <p className="text-slate-400 text-sm mt-1">Adaptive intelligence platform continuous improvement</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <Card className="bg-purple-950/20 border-purple-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-purple-400 mb-1">Candidates</p>
              <p className="text-2xl font-bold text-purple-300">{stats.activeCanditates}</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-950/20 border-blue-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-blue-400 mb-1">Running</p>
              <p className="text-2xl font-bold text-blue-300">{stats.runningExperiments}</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-950/20 border-emerald-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-emerald-400 mb-1">Adopted</p>
              <p className="text-2xl font-bold text-emerald-300">{stats.adopted}</p>
            </CardContent>
          </Card>
          <Card className="bg-red-950/20 border-red-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-red-400 mb-1">Rollbacks</p>
              <p className="text-2xl font-bold text-red-300">{stats.rollbacks}</p>
            </CardContent>
          </Card>
          <Card className="bg-orange-950/20 border-orange-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-orange-400 mb-1">High-Risk</p>
              <p className="text-2xl font-bold text-orange-300">{stats.highRisk}</p>
            </CardContent>
          </Card>
          <Card className="bg-indigo-950/20 border-indigo-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-indigo-400 mb-1">Health Score</p>
              <p className="text-2xl font-bold text-indigo-300">{stats.healthScore}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <a href={createPageUrl('AdminOptimizationCandidates')}>
              <Zap className="w-4 h-4 mr-2" />
              Candidates
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href={createPageUrl('AdminOptimizationExperiments')}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Experiments
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href={createPageUrl('AdminOptimizationOutcomes')}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Outcomes
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href={createPageUrl('AdminOptimizationPolicies')}>
              <Settings className="w-4 h-4 mr-2" />
              Policies
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column: Maturity + Category Selector */}
          <div className="space-y-6">
            <OptimizationMaturityScore
              candidates={candidates}
              experiments={experiments}
              outcomes={outcomes}
            />
            <OptimizationCategoryGroup
              selected={selectedCategory}
              onSelect={setSelectedCategory}
              stats={categoryStats}
            />
          </div>

          {/* Middle Column: Alerts + Wins */}
          <div className="space-y-6">
            <OptimizationAlerts
              candidates={candidates}
              experiments={experiments}
              outcomes={outcomes}
              policies={policies}
            />
            <TopLearningWins
              outcomes={outcomes}
              experiments={experiments}
              candidates={candidates}
            />
          </div>

          {/* Right Column: Next Best Action + Tabs */}
          <div className="space-y-6">
            <NextBestOptimizationAction
              candidates={candidates}
              experiments={experiments}
              outcomes={outcomes}
              policies={policies}
            />

            {/* Tabs */}
            <Tabs defaultValue="candidates">
              <TabsList className="bg-slate-800 border border-slate-700 w-full">
                <TabsTrigger value="candidates">Candidates</TabsTrigger>
                <TabsTrigger value="experiments">Active</TabsTrigger>
                <TabsTrigger value="wins">Wins</TabsTrigger>
              </TabsList>

              {/* Top Candidates */}
              <TabsContent value="candidates" className="space-y-2">
                {topOpportunities.length === 0 ? (
                  <Card className="bg-slate-900/50 border-slate-700">
                    <CardContent className="p-4 text-center text-slate-400 text-xs">
                      No candidates detected
                    </CardContent>
                  </Card>
                ) : (
                  topOpportunities.map((cand, i) => (
                    <Card key={i} className="bg-slate-800/30 border-slate-700">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white text-xs capitalize">{cand.optimization_category.replace(/_/g, ' ')}</p>
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{cand.reason_detected}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-purple-300">{cand.confidence_score}%</p>
                            <Badge
                              className={`text-xs ${
                                cand.risk_level === 'low'
                                  ? 'bg-emerald-950 text-emerald-300'
                                  : cand.risk_level === 'medium'
                                    ? 'bg-yellow-950 text-yellow-300'
                                    : 'bg-red-950 text-red-300'
                              }`}
                            >
                              {cand.risk_level}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* Active Experiments */}
              <TabsContent value="experiments" className="space-y-2">
                {activeExperiments.length === 0 ? (
                  <Card className="bg-slate-900/50 border-slate-700">
                    <CardContent className="p-4 text-center text-slate-400 text-xs">
                      No experiments running
                    </CardContent>
                  </Card>
                ) : (
                  activeExperiments.map((exp, i) => (
                    <Card key={i} className="bg-blue-950/20 border-blue-700/50">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white text-xs">{exp.experiment_name}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{exp.strategy_type.replace(/_/g, ' ')}</p>
                          </div>
                          <Badge className="bg-blue-950 text-blue-300 text-xs flex-shrink-0">Running</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* Recent Wins */}
              <TabsContent value="wins" className="space-y-2">
                {recentWins.length === 0 ? (
                  <Card className="bg-slate-900/50 border-slate-700">
                    <CardContent className="p-4 text-center text-slate-400 text-xs">
                      No wins yet
                    </CardContent>
                  </Card>
                ) : (
                  recentWins.map((outcome, i) => (
                    <Card key={i} className="bg-emerald-950/20 border-emerald-700/50">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-emerald-300 text-xs">{outcome.metric_name}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{outcome.baseline_value} → {outcome.observed_value}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-emerald-300">+{outcome.delta_value}%</p>
                            <p className="text-xs text-slate-500">{outcome.confidence_level}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
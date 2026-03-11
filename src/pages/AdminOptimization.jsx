import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, TrendingUp, AlertCircle, CheckCircle2, RotateCcw, Settings } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function AdminOptimization() {
  const { data: candidates = [] } = useQuery({
    queryKey: ['optimization-candidates'],
    queryFn: () => base44.entities.OptimizationCandidate?.list?.('-detected_at', 50).catch(() => []),
  });

  const { data: experiments = [] } = useQuery({
    queryKey: ['optimization-experiments'],
    queryFn: () => base44.entities.OptimizationExperiment?.list?.('-created_at', 50).catch(() => []),
  });

  const { data: outcomes = [] } = useQuery({
    queryKey: ['optimization-outcomes'],
    queryFn: () => base44.entities.OptimizationOutcome?.list?.('-measured_at', 100).catch(() => []),
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ['optimization-recommendations'],
    queryFn: () => base44.entities.OptimizationRecommendation?.list?.('-created_at', 50).catch(() => []),
  });

  const { data: health = [] } = useQuery({
    queryKey: ['optimization-health'],
    queryFn: () => base44.entities.OptimizationHealthSnapshot?.list?.('-snapshot_time', 8).catch(() => []),
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
          <p className="text-slate-400 text-sm mt-1">Platform self-improvement & A/B testing hub</p>
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

        {/* Tabs */}
        <Tabs defaultValue="candidates">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="candidates">Top Candidates</TabsTrigger>
            <TabsTrigger value="experiments">Active Experiments</TabsTrigger>
            <TabsTrigger value="wins">Recent Wins</TabsTrigger>
            <TabsTrigger value="failures">Failures & Rollbacks</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          {/* Top Candidates */}
          <TabsContent value="candidates" className="space-y-2">
            {topOpportunities.length === 0 ? (
              <Card className="bg-slate-900/50 border-slate-700">
                <CardContent className="p-6 text-center text-slate-400">No candidates detected</CardContent>
              </Card>
            ) : (
              topOpportunities.map((cand, i) => (
                <Card key={i} className="bg-slate-800/30 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-white capitalize">{cand.optimization_category.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-slate-400 mt-1">{cand.reason_detected}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xl font-bold text-purple-300">{cand.confidence_score}%</p>
                        <Badge className={cand.risk_level === 'low' ? 'bg-emerald-950 text-emerald-300' : cand.risk_level === 'medium' ? 'bg-yellow-950 text-yellow-300' : 'bg-red-950 text-red-300'}>
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
                <CardContent className="p-6 text-center text-slate-400">No experiments running</CardContent>
              </Card>
            ) : (
              activeExperiments.map((exp, i) => (
                <Card key={i} className="bg-blue-950/20 border-blue-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{exp.experiment_name}</p>
                        <p className="text-xs text-slate-400 mt-1">{exp.strategy_type.replace(/_/g, ' ')}</p>
                      </div>
                      <Badge className="bg-blue-950 text-blue-300">Running</Badge>
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
                <CardContent className="p-6 text-center text-slate-400">No wins yet</CardContent>
              </Card>
            ) : (
              recentWins.map((outcome, i) => (
                <Card key={i} className="bg-emerald-950/20 border-emerald-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-emerald-300">{outcome.metric_name}</p>
                        <p className="text-xs text-slate-400 mt-1">{outcome.baseline_value} → {outcome.observed_value}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-300">+{outcome.delta_value}%</p>
                        <p className="text-xs text-slate-500">{outcome.confidence_level}% confident</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Failures & Rollbacks */}
          <TabsContent value="failures" className="space-y-2">
            {failedExperiments.length === 0 ? (
              <Card className="bg-emerald-950/20 border-emerald-700/50">
                <CardContent className="p-6 text-center text-emerald-400">✓ No failures or rollbacks</CardContent>
              </Card>
            ) : (
              failedExperiments.map((exp, i) => (
                <Card key={i} className="bg-red-950/20 border-red-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <RotateCcw className="w-5 h-5 text-red-400" />
                      <div className="flex-1">
                        <p className="font-semibold text-red-300">{exp.experiment_name}</p>
                        <p className="text-xs text-slate-400 mt-1">Status: {exp.status}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Recommendations */}
          <TabsContent value="recommendations" className="space-y-2">
            {recommendations.length === 0 ? (
              <Card className="bg-slate-900/50 border-slate-700">
                <CardContent className="p-6 text-center text-slate-400">No recommendations</CardContent>
              </Card>
            ) : (
              recommendations.slice(0, 5).map((rec, i) => (
                <Card key={i} className="bg-slate-800/30 border-slate-700">
                  <CardContent className="p-4">
                    <p className="font-semibold text-white text-sm">{rec.recommendation_text}</p>
                    <p className="text-xs text-slate-400 mt-2">{rec.suggested_action}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
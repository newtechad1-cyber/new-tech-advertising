import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function AdminOptimizationOutcomes() {
  const [search, setSearch] = useState('');

  const { data: outcomes = [] } = useQuery({
    queryKey: ['optimization-outcomes-dashboard'],
    queryFn: () => base44.entities.OptimizationOutcome?.list?.('-measured_at', 200).catch(() => []),
  });

  const metrics = useMemo(() => {
    return {
      positive: outcomes.filter(o => o.outcome_direction === 'positive').length,
      neutral: outcomes.filter(o => o.outcome_direction === 'neutral').length,
      negative: outcomes.filter(o => o.outcome_direction === 'negative').length,
      avgConfidence: outcomes.length > 0
        ? (outcomes.reduce((a, o) => a + (o.confidence_level || 0), 0) / outcomes.length).toFixed(1)
        : 0,
      avgDelta: outcomes.length > 0
        ? (outcomes.reduce((a, o) => a + (o.delta_value || 0), 0) / outcomes.length).toFixed(1)
        : 0,
    };
  }, [outcomes]);

  const filtered = useMemo(() => {
    return outcomes.filter(o =>
      o.metric_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.experiment_key?.toLowerCase().includes(search.toLowerCase())
    );
  }, [outcomes, search]);

  const byExperiment = useMemo(() => {
    const grouped = {};
    filtered.forEach(outcome => {
      if (!grouped[outcome.experiment_key]) {
        grouped[outcome.experiment_key] = [];
      }
      grouped[outcome.experiment_key].push(outcome);
    });
    return grouped;
  }, [filtered]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild className="text-slate-400">
            <a href={createPageUrl('AdminOptimization')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </a>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Outcome Analytics</h1>
            <p className="text-slate-400 text-sm">Experiment results & learning insights</p>
          </div>
        </div>

        {/* Outcome Metrics */}
        <div className="grid grid-cols-5 gap-3">
          <Card className="bg-emerald-950/20 border-emerald-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-emerald-400 mb-1">Positive</p>
              <p className="text-2xl font-bold text-emerald-300">{metrics.positive}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/30 border-slate-700">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-slate-400 mb-1">Neutral</p>
              <p className="text-2xl font-bold text-slate-300">{metrics.neutral}</p>
            </CardContent>
          </Card>
          <Card className="bg-red-950/20 border-red-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-red-400 mb-1">Negative</p>
              <p className="text-2xl font-bold text-red-300">{metrics.negative}</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-950/20 border-blue-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-blue-400 mb-1">Avg Confidence</p>
              <p className="text-2xl font-bold text-blue-300">{metrics.avgConfidence}%</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-950/20 border-purple-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-purple-400 mb-1">Avg Delta</p>
              <p className="text-2xl font-bold text-purple-300">+{metrics.avgDelta}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Input
          placeholder="Search outcomes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-800 border-slate-700"
        />

        {/* Results by Direction */}
        <Tabs defaultValue="all">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="all">All Outcomes</TabsTrigger>
            <TabsTrigger value="positive">✓ Positive</TabsTrigger>
            <TabsTrigger value="neutral">— Neutral</TabsTrigger>
            <TabsTrigger value="negative">✗ Negative</TabsTrigger>
          </TabsList>

          {/* All */}
          <TabsContent value="all">
            <div className="space-y-6">
              {Object.entries(byExperiment).length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6 text-center text-slate-400">No outcomes</CardContent>
                </Card>
              ) : (
                Object.entries(byExperiment).map(([expKey, outcomes]) => (
                  <div key={expKey}>
                    <h3 className="text-sm font-semibold text-slate-300 mb-3 capitalize">{expKey}</h3>
                    <div className="space-y-2">
                      {outcomes.map((outcome, idx) => (
                        <Card
                          key={idx}
                          className={outcome.outcome_direction === 'positive'
                            ? 'bg-emerald-950/20 border-emerald-700/50'
                            : outcome.outcome_direction === 'negative'
                              ? 'bg-red-950/20 border-red-700/50'
                              : 'bg-slate-800/30 border-slate-700'}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-semibold text-white">{outcome.metric_name}</p>
                                <p className="text-xs text-slate-400 mt-1">
                                  {outcome.baseline_value} → {outcome.observed_value}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-2 mb-1">
                                  {outcome.outcome_direction === 'positive' ? (
                                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                                  ) : outcome.outcome_direction === 'negative' ? (
                                    <TrendingDown className="w-4 h-4 text-red-400" />
                                  ) : (
                                    <Minus className="w-4 h-4 text-slate-400" />
                                  )}
                                  <span className={`text-lg font-bold ${
                                    outcome.outcome_direction === 'positive'
                                      ? 'text-emerald-300'
                                      : outcome.outcome_direction === 'negative'
                                        ? 'text-red-300'
                                        : 'text-slate-300'
                                  }`}>
                                    {outcome.delta_value > 0 ? '+' : ''}{outcome.delta_value}%
                                  </span>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {outcome.confidence_level}% confident
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Positive */}
          <TabsContent value="positive">
            <div className="space-y-2">
              {filtered.filter(o => o.outcome_direction === 'positive').length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6 text-center text-slate-400">No positive outcomes yet</CardContent>
                </Card>
              ) : (
                filtered
                  .filter(o => o.outcome_direction === 'positive')
                  .sort((a, b) => (b.delta_value || 0) - (a.delta_value || 0))
                  .map((outcome, idx) => (
                    <Card key={idx} className="bg-emerald-950/20 border-emerald-700/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-emerald-300">{outcome.metric_name}</p>
                            <p className="text-xs text-slate-400 mt-1">{outcome.experiment_key}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-5 h-5 text-emerald-400" />
                              <span className="text-xl font-bold text-emerald-300">+{outcome.delta_value}%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>

          {/* Neutral */}
          <TabsContent value="neutral">
            <div className="space-y-2">
              {filtered.filter(o => o.outcome_direction === 'neutral').length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6 text-center text-slate-400">No neutral outcomes</CardContent>
                </Card>
              ) : (
                filtered
                  .filter(o => o.outcome_direction === 'neutral')
                  .map((outcome, idx) => (
                    <Card key={idx} className="bg-slate-800/30 border-slate-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-300">{outcome.metric_name}</p>
                            <p className="text-xs text-slate-400 mt-1">{outcome.experiment_key}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>

          {/* Negative */}
          <TabsContent value="negative">
            <div className="space-y-2">
              {filtered.filter(o => o.outcome_direction === 'negative').length === 0 ? (
                <Card className="bg-emerald-950/20 border-emerald-700/50">
                  <CardContent className="p-6 text-center text-emerald-400">✓ No negative outcomes</CardContent>
                </Card>
              ) : (
                filtered
                  .filter(o => o.outcome_direction === 'negative')
                  .map((outcome, idx) => (
                    <Card key={idx} className="bg-red-950/20 border-red-700/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-red-300">{outcome.metric_name}</p>
                            <p className="text-xs text-slate-400 mt-1">{outcome.experiment_key}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <TrendingDown className="w-5 h-5 text-red-400" />
                              <span className="text-xl font-bold text-red-300">{outcome.delta_value}%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function AdminIntelligenceAutomation() {
  const { data: scores = [] } = useQuery({
    queryKey: ['automation-intelligence-scores'],
    queryFn: () => base44.entities.IntelligenceScore?.list?.('-calculated_at', 100).catch(() => []),
  });

  const { data: insights = [] } = useQuery({
    queryKey: ['automation-intelligence-insights'],
    queryFn: () => base44.entities.IntelligenceInsight?.list?.('-generated_at', 100).catch(() => []),
  });

  const { data: signals = [] } = useQuery({
    queryKey: ['automation-signals'],
    queryFn: () => base44.entities.IntelligenceSignalSnapshot?.list?.('-captured_at', 200).catch(() => []),
  });

  const automationScores = useMemo(() => {
    return scores.filter(s => s.score_type === 'automation_reliability');
  }, [scores]);

  const automationInsights = useMemo(() => {
    return insights.filter(i => i.related_entity_type === 'Automation');
  }, [insights]);

  const automationFailures = useMemo(() => {
    return signals.filter(s => s.signal_type === 'automation_failure');
  }, [signals]);

  const reliabilityBreakdown = useMemo(() => {
    return {
      healthy: automationScores.filter(s => s.score_value > 80).length,
      caution: automationScores.filter(s => s.score_value > 60 && s.score_value <= 80).length,
      critical: automationScores.filter(s => s.score_value <= 60).length,
    };
  }, [automationScores]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild className="text-slate-400">
            <a href={createPageUrl('AdminIntelligence')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </a>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Automation Intelligence</h1>
            <p className="text-slate-400 text-sm">Reliability scoring and failure detection</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-emerald-950/30 border-emerald-700/50">
            <CardContent className="p-4">
              <p className="text-xs text-emerald-400 mb-1">Healthy</p>
              <p className="text-2xl font-bold text-emerald-300">{reliabilityBreakdown.healthy}</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-950/30 border-yellow-700/50">
            <CardContent className="p-4">
              <p className="text-xs text-yellow-400 mb-1">Caution</p>
              <p className="text-2xl font-bold text-yellow-300">{reliabilityBreakdown.caution}</p>
            </CardContent>
          </Card>
          <Card className="bg-red-950/30 border-red-700/50">
            <CardContent className="p-4">
              <p className="text-xs text-red-400 mb-1">Critical</p>
              <p className="text-2xl font-bold text-red-300">{reliabilityBreakdown.critical}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="reliability">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="reliability">Reliability Scores</TabsTrigger>
            <TabsTrigger value="failures">Recent Failures ({automationFailures.length})</TabsTrigger>
            <TabsTrigger value="insights">Insights ({automationInsights.length})</TabsTrigger>
          </TabsList>

          {/* Reliability Scores */}
          <TabsContent value="reliability">
            <div className="space-y-2">
              {automationScores.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6 text-center text-slate-400">
                    No automation scores available
                  </CardContent>
                </Card>
              ) : (
                automationScores.map((score, idx) => {
                  const isHealthy = score.score_value > 80;
                  const isWarning = score.score_value > 60 && score.score_value <= 80;
                  return (
                    <Card
                      key={idx}
                      className={
                        isHealthy
                          ? 'bg-emerald-950/20 border-emerald-700/50'
                          : isWarning
                            ? 'bg-yellow-950/20 border-yellow-700/50'
                            : 'bg-red-950/20 border-red-700/50'
                      }
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-white">{score.score_label}</p>
                            <p className="text-xs text-slate-400 mt-1">{score.related_entity_id}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-xl font-bold ${isHealthy ? 'text-emerald-300' : isWarning ? 'text-yellow-300' : 'text-red-300'}`}>
                              {Math.round(score.score_value)}%
                            </p>
                            <p className="text-xs text-slate-500 mt-1">{score.trend_direction}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Recent Failures */}
          <TabsContent value="failures">
            <div className="space-y-2">
              {automationFailures.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6 text-center text-slate-400">
                    No recent automation failures
                  </CardContent>
                </Card>
              ) : (
                automationFailures
                  .slice(0, 20)
                  .map((failure, idx) => (
                    <Card key={idx} className="bg-red-950/20 border-red-700/50">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-semibold text-red-300 text-sm">
                              {failure.related_entity_type || 'Automation'} Failure
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              Severity: {failure.signal_value}/10
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {new Date(failure.captured_at).toLocaleString()}
                            </p>
                          </div>
                          <Badge className="bg-red-950 text-red-300">{failure.signal_trend}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>

          {/* Insights */}
          <TabsContent value="insights">
            <div className="space-y-2">
              {automationInsights.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6 text-center text-slate-400">
                    No automation insights generated
                  </CardContent>
                </Card>
              ) : (
                automationInsights
                  .slice(0, 15)
                  .map((insight, idx) => (
                    <Card key={idx} className="bg-slate-800/30 border-slate-700">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-white text-sm">{insight.headline}</p>
                            <p className="text-xs text-slate-400 mt-1">{insight.narrative_text}</p>
                          </div>
                          <Badge
                            className={
                              insight.priority_level === 'critical'
                                ? 'bg-red-950 text-red-300'
                                : insight.priority_level === 'high'
                                  ? 'bg-orange-950 text-orange-300'
                                  : 'bg-slate-700 text-slate-300'
                            }
                          >
                            {insight.priority_level}
                          </Badge>
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
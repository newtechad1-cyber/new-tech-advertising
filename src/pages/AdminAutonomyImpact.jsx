import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function AdminAutonomyImpact() {
  const [search, setSearch] = useState('');

  const { data: impacts = [] } = useQuery({
    queryKey: ['autonomy-impact-snapshots'],
    queryFn: () => base44.entities.AutonomousImpactSnapshot?.list?.('-measured_at', 200).catch(() => []),
  });

  const metrics = useMemo(() => {
    return {
      improving: impacts.filter(i => i.impact_trend === 'improving').length,
      neutral: impacts.filter(i => i.impact_trend === 'neutral').length,
      declining: impacts.filter(i => i.impact_trend === 'declining').length,
      avgImpact: impacts.length > 0
        ? (impacts.reduce((a, i) => a + (i.impact_percentage || 0), 0) / impacts.length).toFixed(1)
        : 0,
    };
  }, [impacts]);

  const filtered = useMemo(() => {
    return impacts.filter(i =>
      i.impact_metric?.toLowerCase().includes(search.toLowerCase()) ||
      i.strategy_key?.toLowerCase().includes(search.toLowerCase())
    );
  }, [impacts, search]);

  const byStrategy = useMemo(() => {
    const grouped = {};
    filtered.forEach(impact => {
      if (!grouped[impact.strategy_key]) {
        grouped[impact.strategy_key] = [];
      }
      grouped[impact.strategy_key].push(impact);
    });
    return grouped;
  }, [filtered]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild className="text-slate-400">
            <a href={createPageUrl('AdminAutonomy')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </a>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Impact Analytics</h1>
            <p className="text-slate-400 text-sm">Autonomous action impact measurements</p>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="bg-emerald-950/20 border-emerald-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-emerald-400 mb-1">Improving</p>
              <p className="text-2xl font-bold text-emerald-300">{metrics.improving}</p>
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
              <p className="text-xs text-red-400 mb-1">Declining</p>
              <p className="text-2xl font-bold text-red-300">{metrics.declining}</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-950/20 border-blue-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-blue-400 mb-1">Avg Impact</p>
              <p className="text-2xl font-bold text-blue-300">{metrics.avgImpact}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Input
          placeholder="Search impacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-800 border-slate-700"
        />

        {/* Impact by Strategy */}
        <Tabs defaultValue="all">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="all">All Impacts</TabsTrigger>
            <TabsTrigger value="improving">Improving</TabsTrigger>
            <TabsTrigger value="declining">Declining</TabsTrigger>
          </TabsList>

          {/* All Impacts */}
          <TabsContent value="all">
            <div className="space-y-6">
              {Object.entries(byStrategy).length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6 text-center text-slate-400">
                    No impact measurements
                  </CardContent>
                </Card>
              ) : (
                Object.entries(byStrategy).map(([strategy, impacts]) => (
                  <div key={strategy}>
                    <h3 className="text-sm font-semibold text-slate-300 mb-3 capitalize">
                      {strategy.replace(/_/g, ' ')}
                    </h3>
                    <div className="space-y-2">
                      {impacts.map((impact, idx) => (
                        <Card
                          key={idx}
                          className={impact.impact_trend === 'improving'
                            ? 'bg-emerald-950/20 border-emerald-700/50'
                            : impact.impact_trend === 'declining'
                              ? 'bg-red-950/20 border-red-700/50'
                              : 'bg-slate-800/30 border-slate-700'}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-semibold text-white">{impact.impact_metric}</p>
                                <p className="text-xs text-slate-400 mt-1">
                                  {impact.baseline_value} → {impact.post_action_value}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-2 mb-1">
                                  {impact.impact_trend === 'improving' ? (
                                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                                  ) : impact.impact_trend === 'declining' ? (
                                    <TrendingDown className="w-4 h-4 text-red-400" />
                                  ) : null}
                                  <span className={`text-lg font-bold ${
                                    impact.impact_trend === 'improving'
                                      ? 'text-emerald-300'
                                      : impact.impact_trend === 'declining'
                                        ? 'text-red-300'
                                        : 'text-slate-300'
                                  }`}>
                                    {impact.impact_percentage > 0 ? '+' : ''}{impact.impact_percentage}%
                                  </span>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {impact.measurement_window_days}d window
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

          {/* Improving */}
          <TabsContent value="improving">
            <div className="space-y-2">
              {filtered.filter(i => i.impact_trend === 'improving').length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6 text-center text-slate-400">
                    No improving impacts
                  </CardContent>
                </Card>
              ) : (
                filtered
                  .filter(i => i.impact_trend === 'improving')
                  .sort((a, b) => (b.impact_percentage || 0) - (a.impact_percentage || 0))
                  .map((impact, idx) => (
                    <Card key={idx} className="bg-emerald-950/20 border-emerald-700/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-emerald-300">{impact.impact_metric}</p>
                            <p className="text-xs text-slate-400 mt-1">{impact.strategy_key}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-5 h-5 text-emerald-400" />
                              <span className="text-xl font-bold text-emerald-300">
                                +{impact.impact_percentage}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>

          {/* Declining */}
          <TabsContent value="declining">
            <div className="space-y-2">
              {filtered.filter(i => i.impact_trend === 'declining').length === 0 ? (
                <Card className="bg-emerald-950/20 border-emerald-700/50">
                  <CardContent className="p-6 text-center text-emerald-400">
                    ✓ No declining impacts
                  </CardContent>
                </Card>
              ) : (
                filtered
                  .filter(i => i.impact_trend === 'declining')
                  .map((impact, idx) => (
                    <Card key={idx} className="bg-red-950/20 border-red-700/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-red-300">{impact.impact_metric}</p>
                            <p className="text-xs text-slate-400 mt-1">{impact.strategy_key}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <TrendingDown className="w-5 h-5 text-red-400" />
                              <span className="text-xl font-bold text-red-300">
                                {impact.impact_percentage}%
                              </span>
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
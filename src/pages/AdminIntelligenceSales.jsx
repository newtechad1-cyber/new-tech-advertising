import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, TrendingUp, Clock } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function AdminIntelligenceSales() {
  const [search, setSearch] = useState('');

  const { data: scores = [] } = useQuery({
    queryKey: ['sales-intelligence-scores'],
    queryFn: () => base44.entities.IntelligenceScore?.list?.('-calculated_at', 100).catch(() => []),
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ['sales-recommendations'],
    queryFn: () => base44.entities.IntelligenceRecommendation?.list?.('-created_at', 50).catch(() => []),
  });

  const dealScores = useMemo(() => {
    return scores
      .filter(s => s.score_type === 'deal_close_probability')
      .sort((a, b) => b.score_value - a.score_value);
  }, [scores]);

  const salesRecs = useMemo(() => {
    return recommendations
      .filter(r => ['follow_up_deal', 'prioritize_opportunity'].includes(r.recommendation_type))
      .sort((a, b) => {
        const urgencyOrder = { immediate: 0, high: 1, medium: 2, low: 3 };
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      });
  }, [recommendations]);

  const dealsByProbability = useMemo(() => {
    return {
      closing: dealScores.filter(s => s.score_value > 75).length,
      likely: dealScores.filter(s => s.score_value > 50 && s.score_value <= 75).length,
      uncertain: dealScores.filter(s => s.score_value <= 50).length,
    };
  }, [dealScores]);

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
            <h1 className="text-3xl font-bold text-white">Sales Intelligence</h1>
            <p className="text-slate-400 text-sm">Deal close probability and sales momentum</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-emerald-950/30 border-emerald-700/50">
            <CardContent className="p-4">
              <p className="text-xs text-emerald-400 mb-1">Likely to Close</p>
              <p className="text-2xl font-bold text-emerald-300">{dealsByProbability.closing}</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-950/30 border-blue-700/50">
            <CardContent className="p-4">
              <p className="text-xs text-blue-400 mb-1">Moderate Probability</p>
              <p className="text-2xl font-bold text-blue-300">{dealsByProbability.likely}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/30 border-slate-700">
            <CardContent className="p-4">
              <p className="text-xs text-slate-400 mb-1">Uncertain</p>
              <p className="text-2xl font-bold text-slate-300">{dealsByProbability.uncertain}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="closing">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="closing">Likely Closing ({dealsByProbability.closing})</TabsTrigger>
            <TabsTrigger value="actions">Follow-up Actions ({salesRecs.length})</TabsTrigger>
          </TabsList>

          {/* Deals Likely to Close */}
          <TabsContent value="closing">
            <div className="space-y-3">
              {dealScores.filter(s => s.score_value > 75).length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6 text-center text-slate-400">
                    No high-probability deals identified
                  </CardContent>
                </Card>
              ) : (
                dealScores
                  .filter(s => s.score_value > 75)
                  .map((deal, idx) => (
                    <Card key={idx} className="bg-emerald-950/20 border-emerald-700/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-emerald-300">{deal.related_entity_id}</p>
                            <p className="text-xs text-slate-400 mt-1">{deal.score_label}</p>
                            {deal.contributing_factors_json && (
                              <p className="text-xs text-slate-500 mt-2">
                                Contributing: {JSON.parse(deal.contributing_factors_json).map(f => f.factor).join(', ')}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-300">{Math.round(deal.score_value)}%</div>
                            <p className="text-xs text-slate-400 mt-1">{deal.trend_direction}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>

          {/* Follow-up Actions */}
          <TabsContent value="actions">
            <div className="space-y-3">
              {salesRecs.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6 text-center text-slate-400">
                    No pending follow-up actions
                  </CardContent>
                </Card>
              ) : (
                salesRecs.slice(0, 20).map((rec, idx) => (
                  <Card key={idx} className="bg-slate-800/30 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-white">{rec.suggested_action}</p>
                          <p className="text-xs text-slate-400 mt-1">{rec.impact_estimate}</p>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <Badge
                            className={
                              rec.urgency === 'immediate'
                                ? 'bg-red-950 text-red-300'
                                : rec.urgency === 'high'
                                  ? 'bg-orange-950 text-orange-300'
                                  : 'bg-slate-700 text-slate-300'
                            }
                          >
                            {rec.urgency}
                          </Badge>
                          <span className="text-xs text-slate-500">Confidence: {rec.confidence_score}%</span>
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
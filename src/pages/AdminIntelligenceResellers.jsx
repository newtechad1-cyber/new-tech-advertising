import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function AdminIntelligenceResellers() {
  const [search, setSearch] = useState('');

  const { data: scores = [] } = useQuery({
    queryKey: ['reseller-intelligence-scores'],
    queryFn: () => base44.entities.IntelligenceScore?.list?.('-calculated_at', 100).catch(() => []),
  });

  const { data: insights = [] } = useQuery({
    queryKey: ['reseller-intelligence-insights'],
    queryFn: () => base44.entities.IntelligenceInsight?.list?.('-generated_at', 100).catch(() => []),
  });

  const resellerScores = useMemo(() => {
    const resellerGroups = {};
    scores
      .filter(s => s.reseller_id && ['reseller_growth_potential', 'operational_health'].includes(s.score_type))
      .forEach(score => {
        if (!resellerGroups[score.reseller_id]) {
          resellerGroups[score.reseller_id] = { scores: [], insights: [] };
        }
        resellerGroups[score.reseller_id].scores.push(score);
      });

    insights
      .filter(i => i.reseller_id)
      .forEach(insight => {
        if (!resellerGroups[insight.reseller_id]) {
          resellerGroups[insight.reseller_id] = { scores: [], insights: [] };
        }
        resellerGroups[insight.reseller_id].insights.push(insight);
      });

    return Object.entries(resellerGroups)
      .map(([resellerId, data]) => {
        const growthScore = data.scores.find(s => s.score_type === 'reseller_growth_potential')?.score_value || 50;
        return {
          resellerId,
          growthScore,
          health: data.scores.find(s => s.score_type === 'operational_health')?.score_value || 50,
          insightCount: data.insights.length,
          opportunities: data.insights.filter(i => i.insight_category === 'growth_opportunity').length,
        };
      })
      .sort((a, b) => b.growthScore - a.growthScore);
  }, [scores, insights]);

  const filteredResellers = useMemo(() => {
    return resellerScores.filter(r => r.resellerId.toLowerCase().includes(search.toLowerCase()));
  }, [resellerScores, search]);

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
            <h1 className="text-3xl font-bold text-white">Reseller Intelligence</h1>
            <p className="text-slate-400 text-sm">Growth potential and operational health</p>
          </div>
        </div>

        {/* Search */}
        <Input
          placeholder="Search resellers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-800 border-slate-700"
        />

        {/* Resellers List */}
        <div className="space-y-3">
          {filteredResellers.length === 0 ? (
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-6 text-center text-slate-400">
                No reseller intelligence data
              </CardContent>
            </Card>
          ) : (
            filteredResellers.map((reseller) => {
              const highGrowth = reseller.growthScore > 75;
              return (
                <Card
                  key={reseller.resellerId}
                  className={highGrowth ? 'bg-emerald-950/20 border-emerald-700/50' : 'bg-slate-800/30 border-slate-700'}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-white text-lg">{reseller.resellerId}</p>
                        <div className="grid grid-cols-3 gap-4 mt-3">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Growth Potential</p>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${highGrowth ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                  style={{ width: `${reseller.growthScore}%` }}
                                />
                              </div>
                              <span className={highGrowth ? 'text-emerald-300' : 'text-blue-300'} style={{ fontSize: '11px' }}>
                                {reseller.growthScore}%
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Health Score</p>
                            <p className="text-white font-semibold">{reseller.health}/100</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Opportunities</p>
                            <p className="text-emerald-300 font-semibold">{reseller.opportunities}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        {reseller.opportunities > 0 && (
                          <Badge className="bg-emerald-950 text-emerald-300">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {reseller.opportunities} opps
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {reseller.insightCount} insights
                        </Badge>
                        <Button size="xs" variant="outline" className="mt-2">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
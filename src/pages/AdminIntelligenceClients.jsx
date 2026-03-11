import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function AdminIntelligenceClients() {
  const [search, setSearch] = useState('');

  const { data: scores = [] } = useQuery({
    queryKey: ['client-intelligence-scores'],
    queryFn: () => base44.entities.IntelligenceScore?.list?.('-calculated_at', 100).catch(() => []),
  });

  const { data: insights = [] } = useQuery({
    queryKey: ['client-intelligence-insights'],
    queryFn: () => base44.entities.IntelligenceInsight?.list?.('-generated_at', 100).catch(() => []),
  });

  const clientScores = useMemo(() => {
    const clientGroups = {};
    scores
      .filter(s => s.client_id && ['client_retention_risk', 'operational_health'].includes(s.score_type))
      .forEach(score => {
        if (!clientGroups[score.client_id]) {
          clientGroups[score.client_id] = { scores: [], insights: [] };
        }
        clientGroups[score.client_id].scores.push(score);
      });

    insights
      .filter(i => i.client_id)
      .forEach(insight => {
        if (!clientGroups[insight.client_id]) {
          clientGroups[insight.client_id] = { scores: [], insights: [] };
        }
        clientGroups[insight.client_id].insights.push(insight);
      });

    return Object.entries(clientGroups)
      .map(([clientId, data]) => {
        const retentionScore = data.scores.find(s => s.score_type === 'client_retention_risk')?.score_value || 50;
        return {
          clientId,
          retentionScore,
          health: data.scores.find(s => s.score_type === 'operational_health')?.score_value || 50,
          insightCount: data.insights.length,
          criticalInsights: data.insights.filter(i => i.priority_level === 'critical').length,
        };
      })
      .sort((a, b) => a.retentionScore - b.retentionScore);
  }, [scores, insights]);

  const filteredClients = useMemo(() => {
    return clientScores.filter(c => c.clientId.toLowerCase().includes(search.toLowerCase()));
  }, [clientScores, search]);

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
            <h1 className="text-3xl font-bold text-white">Client Intelligence</h1>
            <p className="text-slate-400 text-sm">Retention risk, health scores, and engagement signals</p>
          </div>
        </div>

        {/* Search */}
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-800 border-slate-700"
        />

        {/* Clients List */}
        <div className="space-y-3">
          {filteredClients.length === 0 ? (
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-6 text-center text-slate-400">
                No client intelligence data
              </CardContent>
            </Card>
          ) : (
            filteredClients.map((client) => {
              const isAtRisk = client.retentionScore < 40;
              return (
                <Card
                  key={client.clientId}
                  className={isAtRisk ? 'bg-red-950/20 border-red-700/50' : 'bg-slate-800/30 border-slate-700'}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-white">{client.clientId}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="text-xs">
                            <p className="text-slate-500 mb-1">Retention Risk</p>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${isAtRisk ? 'bg-red-500' : 'bg-emerald-500'}`}
                                  style={{ width: `${100 - client.retentionScore}%` }}
                                />
                              </div>
                              <span className={isAtRisk ? 'text-red-300' : 'text-emerald-300'}>
                                {client.retentionScore}%
                              </span>
                            </div>
                          </div>
                          <div className="text-xs ml-4">
                            <p className="text-slate-500 mb-1">Health Score</p>
                            <span className="text-slate-300">{client.health}/100</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        {client.criticalInsights > 0 && (
                          <Badge className="bg-red-950 text-red-300">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {client.criticalInsights} Critical
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {client.insightCount} insights
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
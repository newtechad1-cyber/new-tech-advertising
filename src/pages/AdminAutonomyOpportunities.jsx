import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function AdminAutonomyOpportunities() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const { data: opportunities = [] } = useQuery({
    queryKey: ['autonomy-opportunities-explorer'],
    queryFn: () => base44.entities.AutonomousOpportunity?.list?.('-detected_at', 200).catch(() => []),
  });

  const opportunityTypes = [
    'client_retention',
    'publishing_acceleration',
    'deal_close',
    'onboarding_speedup',
    'reseller_expansion',
    'automation_stabilization',
  ];

  const filtered = useMemo(() => {
    return opportunities.filter(o => {
      const matchesType = selectedType === 'all' || o.opportunity_type === selectedType;
      const matchesSearch = o.related_entity_id?.toLowerCase().includes(search.toLowerCase()) ||
        o.detected_reason?.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
    }).sort((a, b) => {
      const scoreA = a.opportunity_score || 0;
      const scoreB = b.opportunity_score || 0;
      return scoreB - scoreA;
    });
  }, [opportunities, search, selectedType]);

  const byStatus = useMemo(() => {
    return {
      detected: filtered.filter(o => o.status === 'detected').length,
      launched: filtered.filter(o => o.status === 'action_launched').length,
      completed: filtered.filter(o => o.status === 'completed').length,
      blocked: filtered.filter(o => o.status === 'blocked').length,
    };
  }, [filtered]);

  const urgencyColor = (level) => {
    const colors = {
      critical: 'bg-red-950/20 border-red-700/50',
      high: 'bg-orange-950/20 border-orange-700/50',
      medium: 'bg-yellow-950/20 border-yellow-700/50',
      low: 'bg-slate-800/30 border-slate-700',
    };
    return colors[level] || colors.low;
  };

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
            <h1 className="text-3xl font-bold text-white">Opportunity Explorer</h1>
            <p className="text-slate-400 text-sm">Autonomous growth opportunities detected across platform</p>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="bg-purple-950/20 border-purple-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-purple-400 mb-1">Detected</p>
              <p className="text-2xl font-bold text-purple-300">{byStatus.detected}</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-950/20 border-blue-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-blue-400 mb-1">Launched</p>
              <p className="text-2xl font-bold text-blue-300">{byStatus.launched}</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-950/20 border-emerald-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-emerald-400 mb-1">Completed</p>
              <p className="text-2xl font-bold text-emerald-300">{byStatus.completed}</p>
            </CardContent>
          </Card>
          <Card className="bg-red-950/20 border-red-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-red-400 mb-1">Blocked</p>
              <p className="text-2xl font-bold text-red-300">{byStatus.blocked}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <Input
            placeholder="Search opportunities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-800 border-slate-700"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('all')}
            >
              All Types
            </Button>
            {opportunityTypes.map(type => (
              <Button
                key={type}
                variant={selectedType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type)}
                className="capitalize"
              >
                {type.replace(/_/g, ' ')}
              </Button>
            ))}
          </div>
        </div>

        {/* Opportunities List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-6 text-center text-slate-400">
                No opportunities found
              </CardContent>
            </Card>
          ) : (
            filtered.map((opp, idx) => (
              <Card key={idx} className={`${urgencyColor(opp.urgency_level)} border`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                        <p className="font-semibold text-white capitalize">{opp.opportunity_type}</p>
                        <Badge className={`text-xs ${opp.urgency_level === 'critical' ? 'bg-red-950 text-red-300' : opp.urgency_level === 'high' ? 'bg-orange-950 text-orange-300' : 'bg-slate-700 text-slate-300'}`}>
                          {opp.urgency_level}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400">{opp.detected_reason}</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-300 ml-4">{opp.opportunity_score}</p>
                  </div>

                  {opp.recommended_strategy && (
                    <div className="mb-3 p-2 bg-slate-900/50 rounded text-sm">
                      <p className="text-xs text-slate-500 mb-1">Recommended Strategy</p>
                      <p className="text-slate-300">{opp.recommended_strategy}</p>
                      {opp.strategy_confidence && (
                        <p className="text-xs text-slate-500 mt-1">Confidence: {opp.strategy_confidence}%</p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <Badge variant="outline" className="capitalize">{opp.status}</Badge>
                    <Button size="xs" variant="outline">Execute</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
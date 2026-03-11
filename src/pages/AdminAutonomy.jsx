import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, AlertTriangle, Zap, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function AdminAutonomy() {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');

  const { data: opportunities = [] } = useQuery({
    queryKey: ['autonomous-opportunities'],
    queryFn: () => base44.entities.AutonomousOpportunity?.list?.('-detected_at', 100).catch(() => []),
  });

  const { data: actions = [] } = useQuery({
    queryKey: ['autonomous-growth-actions'],
    queryFn: () => base44.entities.AutonomousGrowthAction?.list?.('-created_at', 100).catch(() => []),
  });

  const { data: impacts = [] } = useQuery({
    queryKey: ['autonomous-impact-snapshots'],
    queryFn: () => base44.entities.AutonomousImpactSnapshot?.list?.('-measured_at', 100).catch(() => []),
  });

  const { data: governance = [] } = useQuery({
    queryKey: ['autonomous-governance-logs'],
    queryFn: () => base44.entities.AutonomousGovernanceLog?.list?.('-created_at', 100).catch(() => []),
  });

  // Calculate KPIs
  const kpis = useMemo(() => {
    const detected = opportunities.filter(o => o.status === 'detected').length;
    const executed = actions.filter(a => a.execution_status === 'completed').length;
    const blocked = governance.filter(g => g.governance_decision === 'blocked').length;
    const improving = impacts.filter(i => i.impact_trend === 'improving').length;
    const avgImpact = impacts.length > 0
      ? Math.round(impacts.reduce((a, i) => a + (i.impact_percentage || 0), 0) / impacts.length)
      : 0;
    const retentionActions = actions.filter(a => a.strategy_key?.includes('retention')).length;
    const dealActions = actions.filter(a => a.strategy_key?.includes('deal')).length;

    return {
      detected,
      executed,
      blocked,
      improving,
      avgImpact,
      retentionActions,
      dealActions,
      riskScore: Math.max(0, 100 - (blocked * 5)),
    };
  }, [opportunities, actions, governance, impacts]);

  const topOpportunities = useMemo(() => {
    return opportunities
      .filter(o => o.status === 'detected')
      .sort((a, b) => {
        const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return urgencyOrder[a.urgency_level] - urgencyOrder[b.urgency_level];
      })
      .slice(0, 6);
  }, [opportunities]);

  const activeActions = useMemo(() => {
    return actions
      .filter(a => a.execution_status === 'in_progress')
      .slice(0, 5);
  }, [actions]);

  const recentImpacts = useMemo(() => {
    return impacts
      .filter(i => i.impact_trend === 'improving')
      .sort((a, b) => new Date(b.measured_at) - new Date(a.measured_at))
      .slice(0, 5);
  }, [impacts]);

  const govBlocks = useMemo(() => {
    return governance.filter(g => g.governance_decision === 'blocked').slice(0, 5);
  }, [governance]);

  const urgencyColor = (level) => {
    const colors = {
      critical: 'bg-red-950 text-red-300',
      high: 'bg-orange-950 text-orange-300',
      medium: 'bg-yellow-950 text-yellow-300',
      low: 'bg-slate-800 text-slate-300',
    };
    return colors[level] || colors.low;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Autonomous Growth Command Center</h1>
          </div>
          <p className="text-slate-400">AI-directed growth operations with governance safeguards</p>
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
          <Card className="bg-gradient-to-br from-purple-950/40 to-purple-950/10 border-purple-700/30">
            <CardContent className="p-4">
              <p className="text-xs text-purple-400 mb-1">Opportunities Detected</p>
              <p className="text-2xl font-bold text-purple-300">{kpis.detected}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-950/40 to-emerald-950/10 border-emerald-700/30">
            <CardContent className="p-4">
              <p className="text-xs text-emerald-400 mb-1">Actions Executed</p>
              <p className="text-2xl font-bold text-emerald-300">{kpis.executed}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-950/40 to-blue-950/10 border-blue-700/30">
            <CardContent className="p-4">
              <p className="text-xs text-blue-400 mb-1">Avg Impact</p>
              <p className="text-2xl font-bold text-blue-300">{kpis.avgImpact}%</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-950/40 to-red-950/10 border-red-700/30">
            <CardContent className="p-4">
              <p className="text-xs text-red-400 mb-1">Blocked (Safety)</p>
              <p className="text-2xl font-bold text-red-300">{kpis.blocked}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-950/40 to-cyan-950/10 border-cyan-700/30">
            <CardContent className="p-4">
              <p className="text-xs text-cyan-400 mb-1">Retention Stabilized</p>
              <p className="text-2xl font-bold text-cyan-300">{kpis.retentionActions}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-950/40 to-indigo-950/10 border-indigo-700/30">
            <CardContent className="p-4">
              <p className="text-xs text-indigo-400 mb-1">Governance Score</p>
              <p className="text-2xl font-bold text-indigo-300">{kpis.riskScore}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="opportunities" className="space-y-6">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="opportunities">Opportunities ({kpis.detected})</TabsTrigger>
            <TabsTrigger value="actions">Active Actions ({activeActions.length})</TabsTrigger>
            <TabsTrigger value="impact">Impact Results ({kpis.improving})</TabsTrigger>
            <TabsTrigger value="governance">Governance Blocks ({kpis.blocked})</TabsTrigger>
          </TabsList>

          {/* Opportunities */}
          <TabsContent value="opportunities">
            <div className="space-y-3">
              {topOpportunities.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6 text-center text-slate-400">
                    No opportunities detected
                  </CardContent>
                </Card>
              ) : (
                topOpportunities.map((opp, idx) => (
                  <Card key={idx} className="bg-slate-800/30 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-semibold text-white capitalize">{opp.opportunity_type}</p>
                            <Badge className={urgencyColor(opp.urgency_level)}>{opp.urgency_level}</Badge>
                          </div>
                          <p className="text-xs text-slate-400">{opp.detected_reason}</p>
                          {opp.recommended_strategy && (
                            <p className="text-xs text-purple-400 mt-2">
                              Strategy: {opp.recommended_strategy}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-purple-300">{opp.opportunity_score}</p>
                          <p className="text-xs text-slate-500">score</p>
                          <Button size="xs" variant="outline" className="mt-2">
                            Execute
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Active Actions */}
          <TabsContent value="actions">
            <div className="space-y-3">
              {activeActions.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6 text-center text-slate-400">
                    No active growth actions
                  </CardContent>
                </Card>
              ) : (
                activeActions.map((action, idx) => (
                  <Card key={idx} className="bg-emerald-950/20 border-emerald-700/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-emerald-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold text-emerald-300 capitalize">{action.action_type}</p>
                          <p className="text-xs text-slate-400 mt-1">Strategy: {action.strategy_key}</p>
                          <p className="text-xs text-slate-500 mt-1">Target: {action.target_entity_type}</p>
                        </div>
                        <Badge className="bg-emerald-950 text-emerald-300">
                          {action.execution_mode}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Impact Results */}
          <TabsContent value="impact">
            <div className="space-y-3">
              {recentImpacts.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6 text-center text-slate-400">
                    No impact measurements yet
                  </CardContent>
                </Card>
              ) : (
                recentImpacts.map((impact, idx) => (
                  <Card key={idx} className="bg-emerald-950/20 border-emerald-700/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-emerald-300">{impact.impact_metric}</p>
                          <p className="text-xs text-slate-400 mt-1">Strategy: {impact.strategy_key}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <span className="text-lg font-bold text-emerald-300">
                              +{impact.impact_percentage}%
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {impact.baseline_value} → {impact.post_action_value}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Governance Blocks */}
          <TabsContent value="governance">
            <div className="space-y-3">
              {govBlocks.length === 0 ? (
                <Card className="bg-emerald-950/20 border-emerald-700/50">
                  <CardContent className="p-6 text-center text-emerald-400">
                    ✓ No blocks - all safeguards satisfied
                  </CardContent>
                </Card>
              ) : (
                govBlocks.map((block, idx) => (
                  <Card key={idx} className="bg-red-950/20 border-red-700/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 text-red-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold text-red-300">Governance Block</p>
                          <p className="text-xs text-slate-400 mt-1">{block.blocked_reason}</p>
                          {block.blocked_by_rule && (
                            <p className="text-xs text-red-400 mt-1">Rule: {block.blocked_by_rule}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-8 border-t border-slate-700">
          <Button variant="outline" asChild className="justify-start">
            <a href={createPageUrl('AdminAutonomyOpportunities')}>Opportunity Explorer</a>
          </Button>
          <Button variant="outline" asChild className="justify-start">
            <a href={createPageUrl('AdminAutonomyStrategies')}>Strategy Registry</a>
          </Button>
          <Button variant="outline" asChild className="justify-start">
            <a href={createPageUrl('AdminAutonomyImpact')}>Impact Analytics</a>
          </Button>
          <Button variant="outline" asChild className="justify-start">
            <a href={createPageUrl('AdminAutonomyGovernance')}>Governance Log</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
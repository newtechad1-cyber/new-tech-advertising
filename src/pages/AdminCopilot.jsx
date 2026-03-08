import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain, Zap, AlertTriangle, TrendingUp, CheckCircle2, Clock,
  ChevronRight, Loader2, Eye, Archive, Copy
} from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';
import { createPageUrl } from '@/utils';

export default function AdminCopilot() {
  const queryClient = useQueryClient();
  const [selectedBriefType, setSelectedBriefType] = useState('daily_brief');
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: briefs, isLoading: briufsLoading } = useQuery({
    queryKey: ['copilotBriefs'],
    queryFn: () => base44.entities.CopilotBriefs.list('-updated_date', 20),
    initialData: []
  });

  const { data: insights } = useQuery({
    queryKey: ['copilotInsights'],
    queryFn: () => base44.entities.CopilotInsights.list('-created_date', 100),
    initialData: []
  });

  const { data: actionQueue } = useQuery({
    queryKey: ['copilotActionQueue'],
    queryFn: () => base44.entities.CopilotActionQueue.list('-sort_order', 100),
    initialData: []
  });

  const generateMutation = useMutation({
    mutationFn: async (briefType) => {
      setIsGenerating(true);
      const response = await base44.functions.invoke('generateExecutiveCopilotBrief', {
        brief_type: briefType
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['copilotBriefs'] });
      queryClient.invalidateQueries({ queryKey: ['copilotInsights'] });
      queryClient.invalidateQueries({ queryKey: ['copilotActionQueue'] });
      setIsGenerating(false);
    }
  });

  const latestBrief = briefs.find(b => b.brief_type === selectedBriefType && b.status === 'ready');
  const briefInsights = latestBrief ? insights.filter(i => i.copilot_brief_id === latestBrief.id) : [];
  const briefActions = latestBrief ? actionQueue.filter(a => a.copilot_brief_id === latestBrief.id) : [];

  const priorityColor = {
    urgent: 'bg-red-50 border-red-200',
    high: 'bg-orange-50 border-orange-200',
    medium: 'bg-yellow-50 border-yellow-200',
    low: 'bg-blue-50 border-blue-200'
  };

  const priorityBadgeColor = {
    urgent: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800'
  };

  return (
    <AdminNav>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-8 h-8 text-violet-600" />
            <h1 className="text-3xl font-bold text-slate-900">Executive AI Copilot</h1>
          </div>
          <p className="text-slate-600">AI-powered intelligence layer for business decisions</p>
        </div>

        {/* Brief Selector & Generate */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Generate Brief</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { id: 'daily_brief', label: 'Daily Brief' },
                { id: 'weekly_brief', label: 'Weekly Brief' },
                { id: 'monthly_brief', label: 'Monthly Brief' },
                { id: 'on_demand', label: 'On-Demand' }
              ].map(type => (
                <Button
                  key={type.id}
                  variant={selectedBriefType === type.id ? 'default' : 'outline'}
                  onClick={() => setSelectedBriefType(type.id)}
                  disabled={isGenerating}
                >
                  {type.label}
                </Button>
              ))}
            </div>
            <Button
              onClick={() => generateMutation.mutate(selectedBriefType)}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate {selectedBriefType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {latestBrief && (
          <>
            {/* Brief Summary */}
            <Card className="mb-6 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{latestBrief.summary_headline}</CardTitle>
                    <p className="text-xs text-slate-600 mt-2">{latestBrief.period_label}</p>
                  </div>
                  <Badge variant="outline">{latestBrief.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-1">Executive Summary</p>
                  <p className="text-sm text-slate-700">{latestBrief.executive_summary}</p>
                </div>

                <Tabs defaultValue="wins" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="wins">✓ Wins</TabsTrigger>
                    <TabsTrigger value="risks">⚠️ Risks</TabsTrigger>
                    <TabsTrigger value="opps">📈 Opps</TabsTrigger>
                    <TabsTrigger value="outlook">🎯 Outlook</TabsTrigger>
                  </TabsList>

                  <TabsContent value="wins" className="mt-4">
                    <p className="text-sm text-slate-700">{latestBrief.wins_summary}</p>
                  </TabsContent>

                  <TabsContent value="risks" className="mt-4">
                    <p className="text-sm text-slate-700">{latestBrief.risks_summary}</p>
                  </TabsContent>

                  <TabsContent value="opps" className="mt-4">
                    <p className="text-sm text-slate-700">{latestBrief.opportunities_summary}</p>
                  </TabsContent>

                  <TabsContent value="outlook" className="mt-4 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-1">Revenue Outlook</p>
                      <p className="text-sm text-slate-700">{latestBrief.revenue_outlook_summary}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-1">Operations Outlook</p>
                      <p className="text-sm text-slate-700">{latestBrief.operations_outlook_summary}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-1">Client Health Outlook</p>
                      <p className="text-sm text-slate-700">{latestBrief.client_health_outlook_summary}</p>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm font-semibold text-slate-900 mb-2">Actions & Decisions</p>
                  <div className="space-y-2">
                    {latestBrief.action_recommendations && (
                      <div>
                        <p className="text-xs text-slate-600">Recommendations:</p>
                        <p className="text-sm text-slate-700">{latestBrief.action_recommendations}</p>
                      </div>
                    )}
                    {latestBrief.decisions_needed && (
                      <div>
                        <p className="text-xs text-slate-600">Decisions Needed:</p>
                        <p className="text-sm text-slate-700">{latestBrief.decisions_needed}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Priority Insights */}
            {briefInsights.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    Priority Insights ({briefInsights.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {briefInsights.slice(0, 5).map(insight => (
                      <div key={insight.id} className={`p-4 border rounded-lg ${priorityColor[insight.priority]}`}>
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold text-slate-900">{insight.title}</p>
                          <Badge className={priorityBadgeColor[insight.priority]}>
                            {insight.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-700 mb-2">{insight.description}</p>
                        {insight.recommended_action && (
                          <p className="text-xs text-slate-600 italic">→ {insight.recommended_action}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Queue */}
            {briefActions.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Owner Action Queue ({briefActions.filter(a => a.status === 'pending').length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {briefActions
                      .filter(a => a.status === 'pending')
                      .sort((a, b) => {
                        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
                        return priorityOrder[a.priority] - priorityOrder[b.priority];
                      })
                      .map(action => (
                        <div key={action.id} className={`p-4 border rounded-lg ${priorityColor[action.priority]}`}>
                          <div className="flex items-start justify-between mb-2">
                            <p className="font-semibold text-slate-900">{action.action_title}</p>
                            <Badge className={priorityBadgeColor[action.priority]}>
                              {action.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-700">{action.description}</p>
                          {action.recommended_due_date && (
                            <p className="text-xs text-slate-600 mt-2 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Due: {new Date(action.recommended_due_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={createPageUrl('AdminExecutive')}>Executive Dashboard</a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={createPageUrl('AdminCommandCenter')}>Command Center</a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={createPageUrl('AdminClients')}>Clients</a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={createPageUrl('ProposalPipeline')}>Pipeline</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {!latestBrief && !briufsLoading && (
          <Card className="text-center py-12">
            <Brain className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">No brief generated yet</p>
            <p className="text-sm text-slate-500 mb-6">Generate your first brief to get started</p>
          </Card>
        )}
      </div>
    </AdminNav>
  );
}
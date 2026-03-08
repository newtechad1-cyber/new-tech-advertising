import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Loader2, ChevronLeft, AlertTriangle, TrendingUp } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';
import { createPageUrl } from '@/utils';

export default function AdminCopilotAccount() {
  const { company_id } = useParams();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: company } = useQuery({
    queryKey: ['company', company_id],
    queryFn: () => base44.asServiceRole.entities.Company.list({ id: company_id }),
    select: data => data[0]
  });

  const { data: briefs } = useQuery({
    queryKey: ['copilotBriefs', company_id],
    queryFn: () => base44.entities.CopilotBriefs.filter({ brief_type: 'account_brief' }, '-updated_date', 10),
    initialData: []
  });

  const latestBrief = briefs.find(b => b.status === 'ready');

  const generateMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      const response = await base44.functions.invoke('generateExecutiveCopilotBrief', {
        brief_type: 'account_brief',
        company_id
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['copilotBriefs', company_id] });
      setIsGenerating(false);
    }
  });

  if (!company) {
    return (
      <AdminNav>
        <div className="p-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-400 mb-4" />
          <p className="text-slate-600">Loading account...</p>
        </div>
      </AdminNav>
    );
  }

  return (
    <AdminNav>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <a href={createPageUrl('AdminCopilot')}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Copilot
            </a>
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{company.business_name}</h1>
              <p className="text-slate-600 mt-1">Account Intelligence Brief</p>
            </div>
            <Button onClick={() => generateMutation.mutate()} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Refresh Analysis
                </>
              )}
            </Button>
          </div>
        </div>

        {latestBrief ? (
          <>
            {/* Main Brief */}
            <Card className="mb-6 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50">
              <CardHeader>
                <CardTitle>{latestBrief.summary_headline}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-2">Account Summary</p>
                  <p className="text-sm text-slate-700">{latestBrief.executive_summary}</p>
                </div>

                <Tabs defaultValue="health" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="health">📊 Health</TabsTrigger>
                    <TabsTrigger value="results">📈 Results</TabsTrigger>
                    <TabsTrigger value="risks">⚠️ Risks</TabsTrigger>
                    <TabsTrigger value="growth">🚀 Growth</TabsTrigger>
                  </TabsList>

                  <TabsContent value="health" className="mt-4">
                    {latestBrief.client_health_outlook_summary && (
                      <p className="text-sm text-slate-700">{latestBrief.client_health_outlook_summary}</p>
                    )}
                  </TabsContent>

                  <TabsContent value="results" className="mt-4">
                    {latestBrief.wins_summary && (
                      <p className="text-sm text-slate-700">{latestBrief.wins_summary}</p>
                    )}
                  </TabsContent>

                  <TabsContent value="risks" className="mt-4">
                    {latestBrief.risks_summary && (
                      <p className="text-sm text-slate-700">{latestBrief.risks_summary}</p>
                    )}
                  </TabsContent>

                  <TabsContent value="growth" className="mt-4">
                    {latestBrief.opportunities_summary && (
                      <p className="text-sm text-slate-700">{latestBrief.opportunities_summary}</p>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Talking Points */}
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm font-semibold text-slate-900 mb-3">Talking Points for Next Call</p>
                  <div className="bg-white rounded-lg p-4 border border-slate-200 space-y-2">
                    {latestBrief.action_recommendations && (
                      <>
                        <p className="text-xs font-semibold text-slate-700 text-uppercase">What to discuss:</p>
                        <p className="text-sm text-slate-700 ml-3">{latestBrief.action_recommendations}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Decisions */}
                {latestBrief.decisions_needed && (
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-sm font-semibold text-slate-900 mb-3">Recommended Next Steps</p>
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <p className="text-sm text-slate-700">{latestBrief.decisions_needed}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={createPageUrl(`AdminClients?company=${company_id}`)}>View Account</a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={createPageUrl('AdminFulfillment')}>Fulfillment Status</a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={createPageUrl('OperationsHub')}>Growth Opps</a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={createPageUrl('ProposalPipeline')}>Proposals</a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={createPageUrl('AdminCopilot')}>Full Analysis</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="text-center py-12">
            <Brain className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">No analysis generated yet</p>
            <Button onClick={() => generateMutation.mutate()}>
              <Brain className="w-4 h-4 mr-2" />
              Generate Account Brief
            </Button>
          </Card>
        )}
      </div>
    </AdminNav>
  );
}
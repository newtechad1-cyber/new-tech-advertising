import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, AlertTriangle, TrendingUp, ChevronRight, Loader2 } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function CopilotSummary() {
  const { data: briefs, isLoading } = useQuery({
    queryKey: ['copilotBriefs', 'summary'],
    queryFn: () => base44.entities.CopilotBriefs.filter({ status: 'ready' }, '-updated_date', 5),
    initialData: []
  });

  const { data: insights } = useQuery({
    queryKey: ['copilotInsights', 'summary'],
    queryFn: () => base44.entities.CopilotInsights.list('-created_date', 50),
    initialData: []
  });

  const { data: actions } = useQuery({
    queryKey: ['copilotActionQueue', 'summary'],
    queryFn: () => base44.entities.CopilotActionQueue.filter({ status: 'pending' }, '-sort_order', 50),
    initialData: []
  });

  const latestBrief = briefs[0];
  const briefInsights = latestBrief ? insights.filter(i => i.copilot_brief_id === latestBrief.id).slice(0, 2) : [];
  const briefActions = latestBrief ? actions.filter(a => a.copilot_brief_id === latestBrief.id) : [];

  const urgentActions = briefActions.filter(a => a.priority === 'urgent' || a.priority === 'high').length;
  const topRisk = briefInsights.find(i => i.priority === 'urgent' || i.priority === 'high');
  const topOpp = briefInsights.find(i => i.insight_type === 'revenue_opportunity' || i.insight_type === 'renewal_window');

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
        </CardContent>
      </Card>
    );
  }

  if (!latestBrief) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Copilot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-4">No brief generated yet</p>
          <Button size="sm" asChild>
            <a href={createPageUrl('AdminCopilot')}>Generate Brief</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="w-5 h-5 text-violet-600" />
          AI Copilot Summary
        </CardTitle>
        <p className="text-xs text-slate-600 mt-1">{latestBrief.period_label}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Headline */}
        <div className="p-3 bg-white rounded border border-violet-200">
          <p className="text-sm font-semibold text-slate-900">{latestBrief.summary_headline}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-white rounded border">
            <p className="text-lg font-bold text-violet-600">{urgentActions}</p>
            <p className="text-xs text-slate-600">Action Items</p>
          </div>
          <div className="text-center p-2 bg-white rounded border">
            <p className="text-lg font-bold text-amber-600">{briefInsights.length}</p>
            <p className="text-xs text-slate-600">Insights</p>
          </div>
          <div className="text-center p-2 bg-white rounded border">
            <p className="text-lg font-bold text-green-600">{briefActions.length}</p>
            <p className="text-xs text-slate-600">Pending</p>
          </div>
        </div>

        {/* Top Risk */}
        {topRisk && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-red-900">Top Risk</p>
                <p className="text-sm text-red-800 mt-0.5">{topRisk.title}</p>
              </div>
            </div>
          </div>
        )}

        {/* Top Opportunity */}
        {topOpp && (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-green-900">Biggest Opportunity</p>
                <p className="text-sm text-green-800 mt-0.5">{topOpp.title}</p>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <Button size="sm" asChild className="w-full">
          <a href={createPageUrl('AdminCopilot')}>
            View Full Analysis
            <ChevronRight className="w-4 h-4 ml-2" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
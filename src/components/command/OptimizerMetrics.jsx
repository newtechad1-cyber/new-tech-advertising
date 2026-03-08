import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, AlertCircle, TrendingUp } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function OptimizerMetrics() {
  const { data: opportunities } = useQuery({
    queryKey: ['optimizer-metrics'],
    queryFn: async () => {
      return base44.asServiceRole.entities.OptimizationOpportunities.filter({
        status: { $nin: ['completed', 'dismissed'] }
      }, '-confidence_score', 50);
    },
    initialData: []
  });

  const openCount = opportunities.length;
  const highConfidence = opportunities.filter(o => o.confidence_score >= 70).length;
  const urgent = opportunities.filter(o => o.priority === 'urgent').length;
  const topOpportunity = opportunities[0];

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-600" />
          Campaign Optimizer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-white rounded-lg border">
            <p className="text-xs text-gray-600">Open</p>
            <p className="text-2xl font-bold text-gray-900">{openCount}</p>
          </div>
          <div className="p-3 bg-white rounded-lg border">
            <p className="text-xs text-gray-600">High Conf</p>
            <p className="text-2xl font-bold text-green-600">{highConfidence}</p>
          </div>
          <div className={`p-3 rounded-lg border ${urgent > 0 ? 'bg-red-50' : 'bg-white'}`}>
            <p className="text-xs text-gray-600">Urgent</p>
            <p className={`text-2xl font-bold ${urgent > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {urgent}
            </p>
          </div>
        </div>

        {/* Top Opportunity */}
        {topOpportunity && (
          <div className="p-3 bg-white rounded-lg border border-purple-200 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{topOpportunity.title}</p>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{topOpportunity.description}</p>
              </div>
              <Badge className={`whitespace-nowrap ${
                topOpportunity.priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
              }`}>
                {topOpportunity.priority}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-purple-600">{topOpportunity.confidence_score}% confidence</span>
              <span className="text-gray-600">{topOpportunity.impact_potential} impact</span>
            </div>
          </div>
        )}

        {/* CTA */}
        <Button size="sm" asChild className="w-full">
          <a href={createPageUrl('AdminOptimizer')}>
            View All Opportunities
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
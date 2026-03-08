import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function RecommendationsSummaryCard() {
  const { data: recommendations = [] } = useQuery({
    queryKey: ['recommendations_summary'],
    queryFn: () => base44.asServiceRole.entities.UnifiedRecommendations.filter({
      status: { $nin: ['completed', 'dismissed', 'expired'] }
    })
  });

  const critical = recommendations.filter(r => r.urgency_level === 'critical').length;
  const total = recommendations.length;
  const topRec = recommendations.sort((a, b) => b.priority_score - a.priority_score)[0];

  return (
    <Card className={critical > 0 ? 'border-red-200 bg-red-50' : ''}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-600">Unified Recommendations</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{total}</p>
            {critical > 0 && (
              <p className="text-sm text-red-600 mt-2 font-semibold">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                {critical} Critical
              </p>
            )}
          </div>
          <a href={createPageUrl('AdminRecommendations')} className="text-blue-600 hover:underline text-sm">
            View Queue →
          </a>
        </div>
        {topRec && (
          <div className="mt-4 p-3 bg-white rounded border border-slate-200">
            <p className="text-xs text-slate-600">Top Recommendation</p>
            <p className="font-semibold text-slate-900 text-sm mt-1">{topRec.title}</p>
            <Badge className="mt-2">{topRec.recommendation_type}</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
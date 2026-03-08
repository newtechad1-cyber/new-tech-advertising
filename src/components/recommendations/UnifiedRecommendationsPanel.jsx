import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, TrendingUp, ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function UnifiedRecommendationsPanel({ role = null, company_id = null, limit = 5 }) {
  const { data: recommendations = [], isLoading } = useQuery({
    queryKey: ['recommendations_panel', role, company_id],
    queryFn: async () => {
      let filter = { status: { $nin: ['completed', 'dismissed'] } };
      
      if (role) {
        filter.role_target = { $in: [role, 'shared'] };
      }
      if (company_id) {
        filter.company_id = company_id;
      }

      return base44.asServiceRole.entities.UnifiedRecommendations.filter(filter)
        .then(recs => recs.sort((a, b) => b.priority_score - a.priority_score).slice(0, limit));
    }
  });

  if (isLoading) {
    return <div className="p-4 text-center text-slate-600">Loading recommendations...</div>;
  }

  if (recommendations.length === 0) {
    return <div className="p-4 text-center text-slate-600">No active recommendations</div>;
  }

  const critical = recommendations.filter(r => r.urgency_level === 'critical');
  const urgent = recommendations.filter(r => r.urgency_level === 'urgent');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg">Unified Recommendations</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => window.location.href = createPageUrl('AdminRecommendations')}>
          View All <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {critical.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-red-900">{critical.length} Critical Issues</p>
                {critical.slice(0, 1).map(rec => (
                  <p key={rec.id} className="text-sm text-red-700 mt-1">{rec.title}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {recommendations.slice(0, 4).map(rec => (
            <div key={rec.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
              onClick={() => window.location.href = createPageUrl(`AdminRecommendationDetail?id=${rec.id}`)}>
              <div className="flex items-start justify-between mb-1">
                <p className="font-semibold text-slate-900 text-sm flex-1">{rec.title}</p>
                <Badge className="ml-2" variant="outline">{rec.priority_score}</Badge>
              </div>
              <div className="flex gap-2 items-center text-xs">
                <Badge className={
                  rec.urgency_level === 'critical' ? 'bg-red-100 text-red-800' :
                  rec.urgency_level === 'urgent' ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }>
                  {rec.urgency_level}
                </Badge>
                <Badge variant="outline">{rec.recommendation_type}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
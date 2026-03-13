import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Quote, TrendingUp } from 'lucide-react';

const TYPE_ICONS = {
  growth_milestone: '📈',
  revenue_result: '💰',
  content_win: '📝',
  lead_breakthrough: '🎯',
  efficiency_gain: '⚡',
  testimonial: '💬'
};

const TYPE_COLORS = {
  growth_milestone: 'bg-green-100 text-green-900',
  revenue_result: 'bg-purple-100 text-purple-900',
  content_win: 'bg-blue-100 text-blue-900',
  lead_breakthrough: 'bg-orange-100 text-orange-900',
  efficiency_gain: 'bg-yellow-100 text-yellow-900',
  testimonial: 'bg-pink-100 text-pink-900'
};

export default function DealRoomProofSection({ organizationId }) {
  const [highlights, setHighlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const data = await base44.entities.SuccessHighlight.filter(
          {
            organizationId,
            approvalStatus: 'approved',
            visibility: { $in: ['deal_room', 'all'] },
            taggedForSales: true
          },
          '-createdAt',
          6
        );
        setHighlights(data || []);
      } catch (error) {
        console.error('Error fetching highlights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (organizationId) {
      fetchHighlights();
    }
  }, [organizationId]);

  if (isLoading) {
    return (
      <Card className="border border-slate-200">
        <CardContent className="py-8 text-center text-slate-500">
          Loading proof...
        </CardContent>
      </Card>
    );
  }

  if (!highlights || highlights.length === 0) {
    return null;
  }

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-slate-50 to-blue-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <CardTitle>Early Traction & Proof</CardTitle>
        </div>
        <p className="text-sm text-slate-600 mt-2">
          Real results from clients using our platform
        </p>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {highlights.map((highlight) => (
            <div
              key={highlight.id}
              className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition space-y-3"
            >
              {/* Type + Industry */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={TYPE_COLORS[highlight.highlightType]}>
                  {TYPE_ICONS[highlight.highlightType]}{' '}
                  {highlight.highlightType.replace(/_/g, ' ')}
                </Badge>
                {highlight.industry && (
                  <Badge variant="outline" className="text-xs">
                    {highlight.industry}
                  </Badge>
                )}
              </div>

              {/* Summary */}
              <p className="text-sm font-medium text-slate-900 leading-relaxed">
                {highlight.summaryText}
              </p>

              {/* Metric */}
              {highlight.metricReference && (
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-50 p-2 rounded">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  {highlight.metricReference}
                </div>
              )}

              {/* Testimonial */}
              {highlight.testimonialQuote && (
                <div className="border-l-4 border-blue-300 bg-blue-50 p-3 rounded text-sm italic text-slate-700">
                  <Quote className="w-3 h-3 text-blue-400 mb-1" />
                  "{highlight.testimonialQuote}"
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 text-center text-sm text-slate-600">
          <p>
            These are just a few of the wins our clients are seeing. Let's build
            your success story next.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
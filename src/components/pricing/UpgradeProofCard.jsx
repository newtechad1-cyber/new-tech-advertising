import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Quote } from 'lucide-react';

export default function UpgradeProofCard({
  organizationId,
  filterByIndustry,
  filterByType,
  maxCards = 2
}) {
  const [highlights, setHighlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        // Build filter
        let filter = {
          organizationId,
          approvalStatus: 'approved',
          visibility: { $in: ['upgrade_panels', 'all'] },
          taggedForSales: true
        };

        if (filterByIndustry) {
          filter.industry = filterByIndustry;
        }
        if (filterByType) {
          filter.highlightType = filterByType;
        }

        const data = await base44.entities.SuccessHighlight.filter(
          filter,
          '-createdAt',
          maxCards
        );
        setHighlights(data || []);
      } catch (error) {
        console.error('Error fetching upgrade proof:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (organizationId) {
      fetchHighlights();
    }
  }, [organizationId, filterByIndustry, filterByType, maxCards]);

  if (isLoading || !highlights || highlights.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="w-4 h-4 text-blue-600" />
        <p className="text-xs font-semibold text-slate-700 uppercase">
          Success Stories
        </p>
      </div>

      {highlights.slice(0, maxCards).map((highlight, idx) => (
        <Card key={highlight.id} className="border border-slate-200 bg-gradient-to-br from-white to-slate-50">
          <CardContent className="p-3 space-y-2">
            {/* Type + Industry */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {highlight.highlightType.replace(/_/g, ' ')}
              </Badge>
              {highlight.industry && (
                <Badge variant="outline" className="text-xs bg-slate-100">
                  {highlight.industry}
                </Badge>
              )}
            </div>

            {/* Summary */}
            <p className="text-sm font-medium text-slate-900">
              {highlight.summaryText}
            </p>

            {/* Metric */}
            {highlight.metricReference && (
              <p className="text-sm text-green-700 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {highlight.metricReference}
              </p>
            )}

            {/* Testimonial */}
            {highlight.testimonialQuote && (
              <p className="text-xs italic text-slate-600 border-l-2 border-blue-300 pl-2">
                <Quote className="w-3 h-3 inline text-blue-400 mr-1" />
                {highlight.testimonialQuote.substring(0, 80)}
                {highlight.testimonialQuote.length > 80 ? '...' : ''}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
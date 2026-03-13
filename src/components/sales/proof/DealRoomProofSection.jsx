import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Award, TrendingUp, Users, Zap } from 'lucide-react';

const HIGHLIGHT_ICONS = {
  growth_milestone: TrendingUp,
  revenue_result: Award,
  content_win: Zap,
  lead_breakthrough: Users,
  efficiency_gain: TrendingUp,
  testimonial: Users
};

const HIGHLIGHT_COLORS = {
  growth_milestone: 'from-blue-50 to-blue-100 border-blue-200',
  revenue_result: 'from-green-50 to-green-100 border-green-200',
  content_win: 'from-purple-50 to-purple-100 border-purple-200',
  lead_breakthrough: 'from-orange-50 to-orange-100 border-orange-200',
  efficiency_gain: 'from-teal-50 to-teal-100 border-teal-200',
  testimonial: 'from-pink-50 to-pink-100 border-pink-200'
};

export default function DealRoomProofSection({ organizationId, title = 'Success Highlights' }) {
  const [highlights, setHighlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHighlights = async () => {
      try {
        const approved = await base44.entities.SuccessHighlight.filter(
          {
            organizationId,
            approvalStatus: 'approved',
            dealRoomVisibility: 'public'
          },
          '-createdAt',
          6
        );
        setHighlights(approved || []);
      } catch (error) {
        console.error('Error loading highlights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (organizationId) {
      loadHighlights();
    }
  }, [organizationId]);

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400 mx-auto" />
      </div>
    );
  }

  if (!highlights || highlights.length === 0) {
    return (
      <div className="py-12 text-center">
        <Award className="w-8 h-8 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">No success highlights yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600">Real results from clients using our platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {highlights.map((highlight) => (
          <HighlightCard key={highlight.id} highlight={highlight} />
        ))}
      </div>

      {/* Testimonial Placeholder Section */}
      {highlights.some(h => h.testimonialPlaceholder) && (
        <div className="border-t-2 border-slate-200 pt-6">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">Client Testimonials</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highlights
              .filter(h => h.testimonialPlaceholder)
              .map((highlight) => (
                <TestimonialBlock key={highlight.id} highlight={highlight} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HighlightCard({ highlight }) {
  const Icon = HIGHLIGHT_ICONS[highlight.highlightType] || Award;
  const colorClass = HIGHLIGHT_COLORS[highlight.highlightType];

  const metrics = highlight.metrics ? JSON.parse(highlight.metrics) : {};

  return (
    <Card className={`border-2 bg-gradient-to-br ${colorClass}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-white/60">
              <Icon className="w-5 h-5 text-slate-700" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900 mb-1">
              {highlight.highlightLabel}
            </p>
            <p className="text-sm text-slate-700 leading-relaxed mb-2">
              {highlight.summaryText}
            </p>
            {Object.keys(metrics).length > 0 && (
              <div className="text-xs text-slate-600 space-y-1 mt-2">
                {Object.entries(metrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                    <span className="font-semibold text-slate-900">
                      {typeof value === 'number' ? (key.includes('score') ? `${value}/100` : value) : value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TestimonialBlock({ highlight }) {
  return (
    <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100">
      <CardContent className="p-4">
        <div className="space-y-3">
          {highlight.testimonialText ? (
            <>
              <p className="italic text-slate-700">"{highlight.testimonialText}"</p>
              <div className="text-sm">
                <p className="font-semibold text-slate-900">{highlight.attributionName}</p>
                <p className="text-slate-600">{highlight.attributionTitle}</p>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <Badge variant="outline" className="mb-3">Testimonial Block</Badge>
              <p className="text-sm text-slate-600">
                {highlight.highlightLabel || 'Client Success Story'}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Customize with client quote and details
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
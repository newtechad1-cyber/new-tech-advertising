import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Loader2, Zap } from 'lucide-react';

const HIGHLIGHT_COLORS = {
  growth_milestone: 'border-blue-200 bg-blue-50',
  revenue_result: 'border-green-200 bg-green-50',
  content_win: 'border-purple-200 bg-purple-50',
  lead_breakthrough: 'border-orange-200 bg-orange-50',
  efficiency_gain: 'border-teal-200 bg-teal-50',
  testimonial: 'border-pink-200 bg-pink-50'
};

const HIGHLIGHT_LABELS = {
  growth_milestone: 'Growth Milestone',
  revenue_result: 'Revenue Win',
  content_win: 'Content Achievement',
  lead_breakthrough: 'Lead Generation',
  efficiency_gain: 'Momentum Gain',
  testimonial: 'Testimonial'
};

export default function AdminSalesProofGenerator({ organizationId, onGenerated }) {
  const [snapshot, setSnapshot] = useState(null);
  const [generated, setGenerated] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const loadLatestSnapshot = async () => {
      try {
        setIsLoading(true);
        const snapshots = await base44.entities.GrowthMetricsSnapshot.filter(
          { organizationId },
          '-snapshotDate',
          1
        );
        if (snapshots.length > 0) {
          setSnapshot(snapshots[0]);
        }
      } catch (err) {
        setError('Failed to load metrics');
      } finally {
        setIsLoading(false);
      }
    };

    if (organizationId) {
      loadLatestSnapshot();
    }
  }, [organizationId]);

  const handleGenerate = async () => {
    if (!snapshot) return;

    try {
      setIsGenerating(true);
      setError(null);

      const response = await base44.functions.invoke('generateSalesProof', {
        organizationId,
        metricSnapshotId: snapshot.snapshotId
      });

      if (response.data.success) {
        setGenerated(response.data.highlights);
        if (onGenerated) {
          onGenerated(response.data.highlights);
        }
      }
    } catch (err) {
      setError('Failed to generate highlights');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = async (highlightId) => {
    try {
      await base44.entities.SuccessHighlight.update(highlightId, {
        approvalStatus: 'approved',
        approvedBy: (await base44.auth.me()).email,
        approvedAt: new Date().toISOString(),
        taggedForSales: true,
        dealRoomVisibility: 'public'
      });

      setGenerated(prev =>
        prev.map(h => h.id === highlightId ? { ...h, status: 'approved' } : h)
      );
    } catch (err) {
      setError('Failed to approve highlight');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-slate-600">Loading metrics...</div>;
  }

  if (!snapshot) {
    return (
      <Card className="border-slate-200">
        <CardContent className="py-8 text-center">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-600">No metrics available for this organization</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Metrics Summary */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Current Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-600">Growth Score</p>
              <p className="text-lg font-bold text-blue-600">{snapshot.growthScore}/100</p>
            </div>
            <div>
              <p className="text-slate-600">Momentum</p>
              <p className="text-lg font-bold text-emerald-600">{snapshot.momentumScore}/100</p>
            </div>
            <div>
              <p className="text-slate-600">Leads Logged</p>
              <p className="text-lg font-bold">{snapshot.leadsLoggedCount || 0}</p>
            </div>
            <div>
              <p className="text-slate-600">Deals Closed</p>
              <p className="text-lg font-bold text-green-600">{snapshot.dealsClosedCount || 0}</p>
            </div>
            <div>
              <p className="text-slate-600">Content Published</p>
              <p className="text-lg font-bold">{snapshot.contentPublishedCount || 0}</p>
            </div>
            <div>
              <p className="text-slate-600">Revenue Attributed</p>
              <p className="text-lg font-bold text-green-600">
                ${(snapshot.revenueAttributed || 0) / 100}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full bg-blue-600 text-white hover:bg-blue-700"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 mr-2" />
            Generate Sales Highlights
          </>
        )}
      </Button>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Generated Highlights */}
      {generated.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-900">
              <CheckCircle className="w-4 h-4" />
              Generated Highlights ({generated.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {generated.map((highlight, idx) => (
              <div
                key={idx}
                className={`p-3 border-l-4 rounded ${HIGHLIGHT_COLORS[highlight.type]}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <Badge className="mb-2">{HIGHLIGHT_LABELS[highlight.type]}</Badge>
                    <p className="font-semibold text-slate-900">{highlight.label}</p>
                    <p className="text-sm text-slate-700 mt-1">{highlight.summary}</p>
                  </div>
                  <Button
                    onClick={() => handleApprove(highlight.id)}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-slate-500 text-center">
        Generated highlights can be approved and made visible in deal rooms
      </p>
    </div>
  );
}
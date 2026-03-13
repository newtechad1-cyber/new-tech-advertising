import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown } from 'lucide-react';

export default function ClientROIExplainedPanel({ snapshot }) {
  const [expanded, setExpanded] = useState(false);

  if (!snapshot) return null;

  const getConfidenceExplanation = (confidence) => {
    const explanations = {
      low: 'We need more data to give you an accurate ROI estimate. Keep tracking content and leads for better insights.',
      medium: 'Based on your recent activity, this is a reasonable estimate but may change with more data.',
      high: 'Confidence is high based on consistent content, lead tracking, and revenue attribution.'
    };
    return explanations[confidence] || '';
  };

  const getConfidenceColor = (confidence) => {
    const colors = {
      low: 'bg-amber-50 border-amber-200',
      medium: 'bg-blue-50 border-blue-200',
      high: 'bg-green-50 border-green-200'
    };
    return colors[confidence] || 'bg-slate-50 border-slate-200';
  };

  return (
    <Card className={`border-2 ${getConfidenceColor(snapshot.roiConfidence)}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>💡 How We Calculate Your ROI</span>
          <Badge className={
            snapshot.roiEstimate > 0
              ? 'bg-green-100 text-green-800'
              : snapshot.roiEstimate === 0
              ? 'bg-slate-100 text-slate-800'
              : 'bg-red-100 text-red-800'
          }>
            {snapshot.roiEstimate}% estimated ROI
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ROI Explanation */}
        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <p className="text-sm font-medium mb-2">What's Your ROI?</p>
          <p className="text-xs text-slate-600">
            ROI measures the return on your marketing investment. We calculate it by comparing the revenue attributed to your campaigns against your investment.
          </p>
          <div className="mt-3 p-2 bg-slate-50 rounded text-xs font-mono text-slate-700">
            ROI = (Revenue - Spend) / Spend × 100
          </div>
        </div>

        {/* Your Numbers */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-slate-600">Revenue Generated</p>
            <p className="text-xl font-bold mt-1">
              ${(snapshot.revenueAttributed / 100).toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-xs text-slate-600">Content Published</p>
            <p className="text-xl font-bold mt-1">{snapshot.contentPublishedCount}</p>
          </div>
        </div>

        {/* Confidence Indicator */}
        <div
          className="p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium capitalize">
                {snapshot.roiConfidence === 'low' && '⚠️ Low Confidence'}
                {snapshot.roiConfidence === 'medium' && '🔶 Medium Confidence'}
                {snapshot.roiConfidence === 'high' && '✅ High Confidence'}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {getConfidenceExplanation(snapshot.roiConfidence)}
              </p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="space-y-3 pt-3 border-t">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-medium text-blue-900 mb-2">📊 Key Metrics for ROI</p>
              <ul className="text-xs space-y-1 text-blue-800">
                <li>✓ {snapshot.contentPublishedCount} pieces of content published</li>
                <li>✓ {snapshot.leadsLoggedCount} leads captured</li>
                <li>✓ {snapshot.dealsClosedCount} deals closed</li>
                <li>✓ ${(snapshot.revenueAttributed / 100).toLocaleString()} in revenue attributed</li>
              </ul>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-xs font-medium text-amber-900 mb-2">💡 How to Improve ROI</p>
              <ul className="text-xs space-y-1 text-amber-800">
                <li>• Publish more content consistently</li>
                <li>• Track all leads and revenue sources</li>
                <li>• Focus on high-converting content types</li>
                <li>• Build longer nurture sequences</li>
              </ul>
            </div>
          </div>
        )}

        <p className="text-xs text-slate-600 border-t pt-3">
          💬 <strong>Note:</strong> ROI estimates assume consistent tracking of content, leads, and revenue. The more complete your data, the more accurate our estimates.
        </p>
      </CardContent>
    </Card>
  );
}
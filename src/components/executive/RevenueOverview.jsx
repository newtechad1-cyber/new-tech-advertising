import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Eye, CheckCircle2 } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function RevenueOverview({ data }) {
  if (!data || !data.summary) return null;

  const { summary } = data;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Revenue & Pipeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Pipeline Value</p>
            <p className="text-3xl font-bold text-gray-900">${(summary.pipeline_value / 1000).toFixed(0)}k</p>
            <p className="text-xs text-gray-500 mt-1">{summary.proposals_total} proposals total</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">90-Day Renewal Revenue</p>
            <p className="text-3xl font-bold text-green-600">${(summary.renewal_revenue_90d / 1000).toFixed(0)}k</p>
            <p className="text-xs text-gray-500 mt-1">{Math.round((summary.renewal_revenue_90d / summary.pipeline_value) * 100) || 0}% of pipeline</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <p className="text-sm font-semibold text-gray-900 mb-4">Proposal Status</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800">Sent</Badge>
                <span className="text-sm text-gray-600">{summary.proposals_sent} proposals this month</span>
              </div>
              <span className="font-semibold">{summary.proposals_sent}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-600">{summary.proposals_viewed} viewed this week</span>
              </div>
              <span className="font-semibold">{summary.proposals_viewed}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">{summary.proposals_accepted} accepted this month</span>
              </div>
              <span className="font-semibold">{summary.proposals_accepted}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6 pt-6 border-t">
          <Button variant="outline" size="sm" asChild>
            <a href={createPageUrl('/admin/pipeline')}>View Pipeline</a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={createPageUrl('/admin/proposals')}>All Proposals</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
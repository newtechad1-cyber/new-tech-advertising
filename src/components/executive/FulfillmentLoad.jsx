import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function FulfillmentLoad({ data }) {
  if (!data || !data.summary) return null;

  const { summary } = data;

  const workloadMetrics = [
    {
      label: 'Active Fulfillment Workrooms',
      value: summary.active_fulfillment_workrooms || 0,
      severity: summary.active_fulfillment_workrooms > 10 ? 'high' : 'normal'
    },
    {
      label: 'Active Onboarding Workrooms',
      value: summary.active_onboarding_workrooms || 0,
      severity: summary.active_onboarding_workrooms > 5 ? 'high' : 'normal'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Fulfillment Load & Delivery Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workloadMetrics.map((metric, idx) => (
            <div key={idx} className="py-3 border-b last:border-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                <Badge className={
                  metric.severity === 'high' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }>
                  {metric.value}
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${metric.severity === 'high' ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min((metric.value / 15) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm font-semibold text-blue-900">📋 Delivery Status</p>
          <p className="text-xs text-blue-700 mt-2">
            {summary.active_fulfillment_workrooms} active fulfillment workrooms · {summary.active_onboarding_workrooms} onboarding workrooms
          </p>
        </div>

        <Button variant="outline" size="sm" className="w-full mt-4" asChild>
          <a href={createPageUrl('/admin/fulfillment')}>View Fulfillment Hub</a>
        </Button>
      </CardContent>
    </Card>
  );
}
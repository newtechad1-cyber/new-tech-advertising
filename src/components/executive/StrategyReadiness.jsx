import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function StrategyReadiness({ data }) {
  if (!data || !data.summary) return null;

  const { summary, metadata } = data;

  const strategyMetrics = [
    {
      label: 'Strategy Reviews Active',
      value: metadata.strategy_reviews_active || 0,
      color: 'blue'
    },
    {
      label: 'Executive Reports Ready',
      value: summary.reports_ready || 0,
      color: 'green'
    },
    {
      label: 'Reports Published This Month',
      value: summary.reports_published || 0,
      color: 'purple'
    },
    {
      label: 'Active Success Playbooks',
      value: metadata.success_playbooks_active || 0,
      color: 'orange'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    orange: 'bg-orange-100 text-orange-800'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Strategy & Review Readiness
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {strategyMetrics.map((metric, idx) => (
            <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
              <Badge className={colorClasses[metric.color]}>
                <span className="text-lg font-bold">{metric.value}</span>
              </Badge>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm font-semibold text-blue-900">📊 Planning Status</p>
          <p className="text-xs text-blue-700 mt-2">
            {metadata.strategy_reviews_active} strategy reviews active · {summary.reports_ready} reports ready for approval
          </p>
        </div>

        <div className="flex gap-2 mt-6 pt-6 border-t">
          <Button variant="outline" size="sm" asChild>
            <a href={createPageUrl('/admin/strategy')}>View Strategy Hub</a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={createPageUrl('/admin/results')}>View Results</a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={createPageUrl('/admin/success')}>View Success Playbooks</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
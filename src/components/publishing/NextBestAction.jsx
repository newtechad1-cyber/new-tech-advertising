import React from 'react';
import { ChevronRight, AlertTriangle, CheckCircle2, Settings, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NextBestAction({ metrics, connectionStatuses }) {
  // Determine recommended action based on metrics
  const getRecommendation = () => {
    if (metrics.failed > 0) {
      return {
        icon: AlertTriangle,
        title: `Fix ${metrics.failed} Failed Jobs`,
        description: 'Resolve publishing failures and reconnect channels',
        action: 'Review Issues',
        color: 'red',
        priority: 1,
      };
    }

    if (metrics.awaitingReview > 0) {
      return {
        icon: CheckCircle2,
        title: `Review ${metrics.awaitingReview} Videos`,
        description: 'Approve or request changes on pending content',
        action: 'Start Review',
        color: 'blue',
        priority: 2,
      };
    }

    if (metrics.ready > 0) {
      return {
        icon: Settings,
        title: `Publish ${metrics.ready} Ready Items`,
        description: 'Approve and schedule content for distribution',
        action: 'Publish Now',
        color: 'green',
        priority: 3,
      };
    }

    // Check for connection issues
    const failedConnections = Object.entries(connectionStatuses || {}).filter(
      ([_, status]) => status === 'error' || status === 'token_expired'
    );

    if (failedConnections.length > 0) {
      const platform = failedConnections[0][0];
      return {
        icon: RotateCcw,
        title: `Reconnect ${platform}`,
        description: `Token expired or connection failed. Reconnect to resume publishing.`,
        action: 'Fix Connection',
        color: 'amber',
        priority: 4,
      };
    }

    return {
      icon: CheckCircle2,
      title: 'All Systems Healthy',
      description: 'No action needed. Publishing pipeline is ready.',
      action: 'Monitor',
      color: 'slate',
      priority: 5,
    };
  };

  const recommendation = getRecommendation();
  const Icon = recommendation.icon;

  const colorMap = {
    red: 'bg-red-50 border-red-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    amber: 'bg-amber-50 border-amber-200',
    slate: 'bg-slate-50 border-slate-200',
  };

  const buttonColorMap = {
    red: 'bg-red-600 hover:bg-red-700',
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    amber: 'bg-amber-600 hover:bg-amber-700',
    slate: 'bg-slate-600 hover:bg-slate-700',
  };

  return (
    <Card className={`${colorMap[recommendation.color]} border-2`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className={`p-2 rounded-lg ${buttonColorMap[recommendation.color]}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-slate-900">{recommendation.title}</h3>
              <p className="text-sm text-slate-600">{recommendation.description}</p>
            </div>
          </div>
          <Button
            className={`${buttonColorMap[recommendation.color]} text-white gap-2`}
            size="sm"
          >
            {recommendation.action}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, TrendingUp, Zap, Target, PauseCircle, ArrowRight } from 'lucide-react';

export default function ClientNextBestActionPanel({ snapshot }) {
  if (!snapshot || !snapshot.nextBestAction) return null;

  const nextAction = JSON.parse(snapshot.nextBestAction);

  const getActionConfig = (actionType) => {
    const configs = {
      retention_intervention: {
        icon: AlertCircle,
        color: 'text-red-600',
        bg: 'bg-red-50 border-red-200',
        badgeColor: 'bg-red-100 text-red-800',
        emoji: '🆘'
      },
      upgrade_offer: {
        icon: TrendingUp,
        color: 'text-green-600',
        bg: 'bg-green-50 border-green-200',
        badgeColor: 'bg-green-100 text-green-800',
        emoji: '📈'
      },
      content_boost: {
        icon: Zap,
        color: 'text-amber-600',
        bg: 'bg-amber-50 border-amber-200',
        badgeColor: 'bg-amber-100 text-amber-800',
        emoji: '⚡'
      },
      lead_generation: {
        icon: Target,
        color: 'text-blue-600',
        bg: 'bg-blue-50 border-blue-200',
        badgeColor: 'bg-blue-100 text-blue-800',
        emoji: '🎯'
      },
      roi_optimization: {
        icon: Zap,
        color: 'text-purple-600',
        bg: 'bg-purple-50 border-purple-200',
        badgeColor: 'bg-purple-100 text-purple-800',
        emoji: '💰'
      },
      maintain_momentum: {
        icon: PauseCircle,
        color: 'text-slate-600',
        bg: 'bg-slate-50 border-slate-200',
        badgeColor: 'bg-slate-100 text-slate-800',
        emoji: '✨'
      }
    };
    return configs[actionType] || configs.maintain_momentum;
  };

  const config = getActionConfig(nextAction.action);
  const Icon = config.icon;

  return (
    <Card className={`border-2 ${config.bg}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span>{config.emoji}</span>
            {nextAction.title}
          </span>
          <Badge className={config.badgeColor}>
            {nextAction.priority}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-slate-700">{nextAction.description}</p>

        {/* Key Metrics that triggered this */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-white rounded-lg border border-slate-200">
          <div>
            <p className="text-xs text-slate-600">Content</p>
            <p className="text-lg font-bold">{snapshot.contentPublishedCount}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600">Leads</p>
            <p className="text-lg font-bold">{snapshot.leadsLoggedCount}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600">Revenue</p>
            <p className="text-lg font-bold">
              ${(snapshot.revenueAttributed / 100).toLocaleString('en-US', {
                maximumFractionDigits: 0
              })}
            </p>
          </div>
        </div>

        {/* Suggested Action */}
        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <p className="text-sm font-semibold text-slate-900 mb-2">Suggested Next Step:</p>
          <p className="text-sm text-slate-700 mb-3">{nextAction.suggestedAction}</p>
          
          {/* Action button based on type */}
          {nextAction.action === 'retention_intervention' && (
            <Button className="w-full bg-red-600 hover:bg-red-700">
              Schedule Retention Call
            </Button>
          )}
          {nextAction.action === 'upgrade_offer' && (
            <Button className="w-full bg-green-600 hover:bg-green-700">
              View Upgrade Options
            </Button>
          )}
          {nextAction.action === 'content_boost' && (
            <Button className="w-full bg-amber-600 hover:bg-amber-700">
              Start Content Sprint
            </Button>
          )}
          {nextAction.action === 'lead_generation' && (
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Set Up Lead Capture
            </Button>
          )}
          {nextAction.action === 'roi_optimization' && (
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Optimize Funnel
            </Button>
          )}
          {nextAction.action === 'maintain_momentum' && (
            <Button variant="outline" className="w-full">
              View Weekly Progress
            </Button>
          )}
        </div>

        {/* Impact indicator */}
        <div className="p-3 bg-white rounded-lg border border-slate-200">
          <p className="text-xs font-medium text-slate-600 mb-2">Expected Impact</p>
          <div className="flex items-center gap-2">
            <ArrowRight className={`w-4 h-4 ${config.color}`} />
            <p className="text-sm font-semibold">
              {nextAction.action === 'retention_intervention' && 'Prevent churn, maintain revenue'}
              {nextAction.action === 'upgrade_offer' && 'Increase MRR, expand capabilities'}
              {nextAction.action === 'content_boost' && 'Build visibility, increase leads'}
              {nextAction.action === 'lead_generation' && 'Convert existing audience'}
              {nextAction.action === 'roi_optimization' && 'Higher conversion rates'}
              {nextAction.action === 'maintain_momentum' && 'Continue growth trajectory'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
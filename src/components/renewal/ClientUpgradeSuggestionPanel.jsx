import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { calculateRenewalSignals, shouldShowUpgradeSuggestion } from './renewalSignalEngine';
import { Zap, ArrowRight, TrendingUp } from 'lucide-react';

const PLAN_INFO = {
  diy: {
    name: 'DIY Growth',
    nextPlan: 'guided_growth',
    nextName: 'Guided Growth',
    reason: 'Your growth momentum shows you\'re ready for professional guidance on strategy and execution.'
  },
  guided_growth: {
    name: 'Guided Growth',
    nextPlan: 'done_for_you',
    nextName: 'Done For You',
    reason: 'Your proven execution metrics mean you\'re ready to hand off content creation to our team.'
  },
  done_for_you: {
    name: 'Done For You',
    nextPlan: 'premium',
    nextName: 'Premium',
    reason: 'Your consistent results and growth justify full-service support with premium features.'
  }
};

export default function ClientUpgradeSuggestionPanel({ subscription, organizationId, onUpgradeClick }) {
  const [signals, setSignals] = useState(null);
  const [growthSnapshot, setGrowthSnapshot] = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch latest growth snapshot
        const snapshots = await base44.entities.GrowthMetricsSnapshot.filter(
          { organizationId },
          '-snapshotDate',
          1
        );

        if (snapshots.length > 0) {
          setGrowthSnapshot(snapshots[0]);

          // Calculate renewal signals
          const renewalSignals = calculateRenewalSignals(subscription, snapshots[0]);
          setSignals(renewalSignals);

          // Check if should show upgrade
          const shouldShow = shouldShowUpgradeSuggestion(subscription, renewalSignals, snapshots[0]);
          setShowUpgrade(shouldShow);
        }
      } catch (error) {
        console.error('Error loading upgrade data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (subscription && organizationId) {
      loadData();
    }
  }, [subscription, organizationId]);

  if (isLoading || !showUpgrade || !signals || !growthSnapshot) {
    return null;
  }

  const currentPlanConfig = PLAN_INFO[subscription.current_plan];
  if (!currentPlanConfig) return null;

  return (
    <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-emerald-900">
            <Zap className="w-5 h-5" />
            Ready for Your Next Phase?
          </CardTitle>
          <Badge className="bg-emerald-600 text-white">Upgrade Available</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Metrics That Support Upgrade */}
        <div className="p-3 bg-white rounded border border-emerald-200">
          <p className="text-xs text-slate-600 font-semibold mb-2">Why Now?</p>
          <ul className="space-y-2 text-sm text-slate-700">
            {growthSnapshot.growthScore > 65 && (
              <li className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Your growth score ({growthSnapshot.growthScore}) shows strong execution
              </li>
            )}
            {growthSnapshot.momentumScore > 60 && (
              <li className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Growth is accelerating week-over-week ({growthSnapshot.momentumScore} momentum)
              </li>
            )}
            {growthSnapshot.leadsLoggedCount > 2 && (
              <li className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                You're capturing consistent leads ({growthSnapshot.leadsLoggedCount} this period)
              </li>
            )}
            {growthSnapshot.dealsClosedCount > 0 && (
              <li className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Your content is converting to revenue ({growthSnapshot.dealsClosedCount} deals)
              </li>
            )}
          </ul>
        </div>

        {/* Upgrade Value Proposition */}
        <div className="p-3 bg-emerald-50 rounded border border-emerald-300">
          <p className="text-sm text-emerald-900 font-semibold mb-2">
            Upgrade to {currentPlanConfig.nextName}
          </p>
          <p className="text-sm text-emerald-800 leading-relaxed">
            {currentPlanConfig.reason}
          </p>
        </div>

        {/* What Changes */}
        <div className="text-sm">
          <p className="text-xs text-slate-600 font-semibold mb-2">What You'll Get</p>
          <ul className="space-y-1 text-slate-700 text-xs">
            {subscription.current_plan === 'diy' && (
              <>
                <li>• Strategy reviews with our team</li>
                <li>• Content calendar planning</li>
                <li>• Monthly growth analysis & recommendations</li>
                <li>• Priority support</li>
              </>
            )}
            {subscription.current_plan === 'guided_growth' && (
              <>
                <li>• We create all content (blogs, videos, social)</li>
                <li>• Full marketing execution</li>
                <li>• Lead management & nurturing</li>
                <li>• Weekly strategy adjustments</li>
              </>
            )}
            {subscription.current_plan === 'done_for_you' && (
              <>
                <li>• Premium analytics dashboard</li>
                <li>• Executive reporting & insights</li>
                <li>• Advanced integrations</li>
                <li>• Dedicated account team</li>
              </>
            )}
          </ul>
        </div>

        {/* CTA */}
        <div className="pt-2 border-t border-emerald-200">
          <Button
            onClick={() => onUpgradeClick?.(currentPlanConfig.nextPlan)}
            className="w-full bg-emerald-600 text-white hover:bg-emerald-700 font-semibold"
          >
            <Zap className="w-4 h-4 mr-2" />
            Explore {currentPlanConfig.nextName}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-xs text-slate-600 text-center mt-2">
            Upgrade at your next renewal or anytime
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
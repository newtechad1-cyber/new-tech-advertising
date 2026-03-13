import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { calculateRenewalSignals, shouldShowRenewalWarning, getRenewalMessage } from './renewalSignalEngine';
import { Calendar, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const PLAN_LABELS = {
  diy: 'DIY Growth',
  guided_growth: 'Guided Growth',
  done_for_you: 'Done For You',
  premium: 'Premium'
};

const RISK_COLORS = {
  healthy: 'border-green-200 bg-green-50',
  moderate: 'border-yellow-200 bg-yellow-50',
  at_risk: 'border-orange-200 bg-orange-50',
  critical: 'border-red-200 bg-red-50'
};

const RISK_TEXT = {
  healthy: 'text-green-800',
  moderate: 'text-yellow-800',
  at_risk: 'text-orange-800',
  critical: 'text-red-800'
};

export default function ClientRenewalPanel({ subscription, organizationId }) {
  const [signals, setSignals] = useState(null);
  const [growthSnapshot, setGrowthSnapshot] = useState(null);
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
        }

        // Calculate renewal signals
        const subs = subscription || (await base44.entities.DIYSubscription.filter(
          { id: subscription?.id },
          '-created_date',
          1
        ));

        if (subs) {
          const renewalSignals = calculateRenewalSignals(subs[0] || subs, snapshots[0]);
          setSignals(renewalSignals);
        }
      } catch (error) {
        console.error('Error loading renewal data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (subscription || organizationId) {
      loadData();
    }
  }, [subscription, organizationId]);

  if (isLoading || !signals) {
    return <div className="animate-pulse h-48 bg-slate-200 rounded"></div>;
  }

  const renewalMsg = getRenewalMessage(signals, subscription);
  const showWarning = shouldShowRenewalWarning(signals);

  return (
    <Card className={`border-2 ${RISK_COLORS[signals.riskLevel]}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Plan & Renewal Status
          </CardTitle>
          <Badge 
            className={`${signals.riskLevel === 'healthy' ? 'bg-green-600 text-white' : signals.riskLevel === 'critical' ? 'bg-red-600 text-white' : 'bg-slate-600 text-white'}`}
          >
            {signals.riskLevel.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Plan & Renewal Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-600 mb-1">Current Plan</p>
            <p className="font-semibold text-slate-900">{PLAN_LABELS[subscription?.current_plan] || subscription?.current_plan}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600 mb-1">Renews In</p>
            <p className={`font-semibold text-lg ${signals.daysUntilRenewal <= 14 ? 'text-red-600' : 'text-slate-900'}`}>
              {signals.daysUntilRenewal} day{signals.daysUntilRenewal !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Growth & Momentum Summary */}
        {growthSnapshot && (
          <div className="grid grid-cols-2 gap-4 p-3 bg-white rounded border border-slate-200">
            <div>
              <p className="text-xs text-slate-600">Growth Score</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl font-bold text-blue-600">{growthSnapshot.growthScore}</p>
                {growthSnapshot.growthScore > 60 && <TrendingUp className="w-4 h-4 text-green-600" />}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-600">Momentum</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{growthSnapshot.momentumScore}</p>
            </div>
          </div>
        )}

        {/* Marketing Wins Summary */}
        {growthSnapshot && (
          <div className="p-3 bg-white rounded border border-slate-200 text-sm">
            <p className="text-xs text-slate-600 mb-2">Recent Marketing Activity</p>
            <ul className="space-y-1 text-slate-700">
              {growthSnapshot.contentPublishedCount > 0 && (
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  {growthSnapshot.contentPublishedCount} pieces published
                </li>
              )}
              {growthSnapshot.leadsLoggedCount > 0 && (
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  {growthSnapshot.leadsLoggedCount} qualified leads
                </li>
              )}
              {growthSnapshot.dealsClosedCount > 0 && (
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  {growthSnapshot.dealsClosedCount} deals closed
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Renewal Message */}
        {showWarning && (
          <div className="p-3 bg-red-50 border border-red-300 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 text-sm">
                <p className="font-semibold text-red-900">{renewalMsg.title}</p>
                <p className="text-red-800 mt-1">Your plan expires on {signals.renewalDate}. Keep your momentum going by renewing.</p>
              </div>
            </div>
          </div>
        )}

        {/* Value Reinforcement Message */}
        <div className="p-3 bg-blue-50 border border-blue-300 rounded-lg text-sm">
          <p className="text-blue-900 font-semibold mb-2">Keep Pushing Forward</p>
          <p className="text-blue-800 leading-relaxed">
            Your growth is working. With consistent effort on content and lead capture, your ROI only improves. Renewing locks in your momentum.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-2 pt-2">
          <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
            {renewalMsg.cta}
          </Button>
          <Button variant="outline" className="flex-1">
            View Billing
          </Button>
        </div>

        {/* Renewal Confidence Meter */}
        <div className="pt-2 border-t border-slate-200">
          <p className="text-xs text-slate-600 mb-2">Renewal Confidence</p>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                signals.renewalConfidenceScore > 70 ? 'bg-green-600' :
                signals.renewalConfidenceScore > 50 ? 'bg-yellow-600' :
                'bg-red-600'
              }`}
              style={{ width: `${signals.renewalConfidenceScore}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {signals.renewalConfidenceScore}% likely to renew
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
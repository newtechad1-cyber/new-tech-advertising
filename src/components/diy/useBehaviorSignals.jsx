import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  calculateUpgradeReadinessAndSignals,
  detectLowMomentumRisk,
  detectHighEffortLowExecution,
  detectLeadMomentum,
  detectTimeConstraintPattern,
  detectAggressiveGrowthIntent,
} from './ntaUpgradeRecommendationEngine';

/**
 * Hook to track and calculate behavior signals for a user
 * Handles alert creation when high-value signals detected
 */
export const useBehaviorSignals = (subscription) => {
  const [signals, setSignals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!subscription) return;

    const loadSignals = async () => {
      try {
        setLoading(true);

        // Fetch growth stage data
        const growthStages = await base44.entities.ClientGrowthStage.filter(
          { onboarding_id: subscription.id },
          '-created_date',
          1
        );

        const growthStage = growthStages.length > 0 ? growthStages[0] : null;

        // Calculate signals
        const analysis = calculateUpgradeReadinessAndSignals(subscription, growthStage);

        setSignals({
          analysis,
          growthStage,
          subscription,
        });

        // Create HotProspectAlert if readiness is high
        if (analysis.shouldShowAlert && analysis.readinessScore >= 50) {
          try {
            // Check if alert already exists for this subscription
            const existingAlerts = await base44.entities.HotProspectAlert.filter(
              {
                subscription_id: subscription.id,
                signal_type: analysis.primarySignal,
                status: 'new',
              },
              '-created_date',
              1
            );

            // Only create if no recent alert exists
            if (existingAlerts.length === 0) {
              await base44.entities.HotProspectAlert.create({
                subscription_id: subscription.id,
                user_email: subscription.user_email,
                business_name: subscription.business_name,
                signal_type: analysis.primarySignal,
                readiness_score: analysis.readinessScore,
                recommended_plan: analysis.recommendedPlan,
                trigger_data: JSON.stringify(analysis.signals),
                alert_priority: analysis.alertPriority,
                status: 'new',
                detected_at: new Date().toISOString(),
              });
            }
          } catch (alertError) {
            console.warn('Could not create HotProspectAlert:', alertError);
          }
        }

        setError(null);
      } catch (err) {
        console.error('Error loading behavior signals:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSignals();
  }, [subscription?.id]);

  return {
    signals,
    loading,
    error,
    readinessScore: signals?.analysis?.readinessScore || 0,
    recommendedPlan: signals?.analysis?.recommendedPlan,
    primarySignal: signals?.analysis?.primarySignal,
    detectedSignals: signals?.analysis?.detectedSignals || [],
    shouldShowAlert: signals?.analysis?.shouldShowAlert || false,
    alertPriority: signals?.analysis?.alertPriority,
  };
};
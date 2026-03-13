/**
 * Renewal Signal Engine
 * Calculates lightweight signals for retention and upsell triggers
 */

export const calculateRenewalSignals = (subscription, growthSnapshot) => {
  // subscription: DIYSubscription or similar billing entity
  // growthSnapshot: Latest GrowthMetricsSnapshot
  
  if (!subscription) return null;

  // Calculate days until renewal
  const nextRenewalDate = subscription.next_renewal_date 
    ? new Date(subscription.next_renewal_date)
    : new Date(subscription.billing_cycle_end);
  
  const daysUntilRenewal = Math.ceil((nextRenewalDate - new Date()) / (1000 * 60 * 60 * 24));

  // Renewal confidence score (0-100)
  // Higher = more likely to renew; lower = at risk
  const renewalConfidenceScore = calculateConfidenceScore(subscription, growthSnapshot, daysUntilRenewal);

  // Suggested next plan based on growth
  const suggestedNextPlan = getNextPlanSuggestion(subscription.current_plan, growthSnapshot);

  return {
    daysUntilRenewal,
    renewalConfidenceScore,
    suggestedNextPlan,
    riskLevel: getRiskLevel(renewalConfidenceScore),
    isAtRisk: renewalConfidenceScore < 40,
    isReadyForUpgrade: renewalConfidenceScore > 70 && suggestedNextPlan !== subscription.current_plan,
    renewalDate: nextRenewalDate.toISOString().split('T')[0]
  };
};

const calculateConfidenceScore = (subscription, snapshot, daysUntilRenewal) => {
  let score = 50; // Baseline

  if (!snapshot) {
    // No activity = risky
    return Math.max(20, score - 30);
  }

  // Growth trajectory bonus
  if (snapshot.growthScore > 70) score += 20;
  else if (snapshot.growthScore > 50) score += 10;
  else if (snapshot.growthScore < 30) score -= 20;

  // Activity signals
  if (snapshot.contentPublishedCount > 0) score += 10;
  if (snapshot.leadsLoggedCount > 2) score += 15;
  if (snapshot.dealsClosedCount > 0) score += 20;

  // Momentum matters
  if (snapshot.momentumScore > 60) score += 15;
  else if (snapshot.momentumScore < 20) score -= 10;

  // Early in cycle = more stable
  if (daysUntilRenewal > 60) score += 5;
  if (daysUntilRenewal < 14) score -= 10; // Urgent renewal near

  // Onboarding completion
  if (subscription.onboarding_completed) score += 10;

  return Math.min(100, Math.max(0, score));
};

const getNextPlanSuggestion = (currentPlan, snapshot) => {
  if (!snapshot) return currentPlan;

  const planUpgrades = {
    diy: {
      threshold: 65,
      nextPlan: 'guided_growth',
      label: 'Guided Growth'
    },
    guided_growth: {
      threshold: 75,
      nextPlan: 'done_for_you',
      label: 'Done For You'
    },
    done_for_you: {
      threshold: 80,
      nextPlan: 'premium',
      label: 'Premium'
    }
  };

  const config = planUpgrades[currentPlan];
  if (!config) return currentPlan;

  // Suggest upgrade if growth score + upgrade readiness both strong
  if ((snapshot.growthScore || 0) > config.threshold && 
      (snapshot.upgradeReadinessScore || 0) > 70) {
    return config.nextPlan;
  }

  return currentPlan;
};

const getRiskLevel = (score) => {
  if (score >= 70) return 'healthy';
  if (score >= 50) return 'moderate';
  if (score >= 30) return 'at_risk';
  return 'critical';
};

export const shouldShowRenewalWarning = (signals) => {
  // Show warning if renewal < 30 days AND confidence < 60
  return signals.daysUntilRenewal <= 30 && signals.renewalConfidenceScore < 60;
};

export const shouldShowUpgradeSuggestion = (subscription, signals, growthSnapshot) => {
  // Show upgrade if:
  // 1. Has been active (growth score > 50)
  // 2. Ready for upgrade (confidence > 70 and suggested plan differs)
  // 3. Not already at highest tier
  
  if (!growthSnapshot || !signals) return false;

  const hasHighestPlan = ['premium', 'enterprise'].includes(subscription.current_plan);
  
  return !hasHighestPlan && 
         signals.isReadyForUpgrade && 
         growthSnapshot.growthScore > 50;
};

export const getRenewalMessage = (signals, subscription) => {
  const daysUntil = signals.daysUntilRenewal;

  if (daysUntil <= 0) {
    return {
      title: 'Your plan expires today',
      urgency: 'critical',
      cta: 'Renew Now'
    };
  }

  if (daysUntil <= 7) {
    return {
      title: `Renewing in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`,
      urgency: 'high',
      cta: 'Review & Renew'
    };
  }

  if (daysUntil <= 30) {
    return {
      title: `Your renewal is coming up on ${signals.renewalDate}`,
      urgency: 'medium',
      cta: 'Review Plan'
    };
  }

  return {
    title: 'Keep the momentum going',
    urgency: 'low',
    cta: 'View Plan Details'
  };
};
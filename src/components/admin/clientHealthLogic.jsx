/**
 * Client Health Scoring and Segmentation Logic
 */

/**
 * Calculate client health score (0-100)
 */
export const calculateClientHealthScore = (subscription, retention, growthStage) => {
  if (!subscription) return 0;

  let score = 50; // Base

  // Subscription status (20 points)
  if (subscription.status === 'active') score += 20;
  else if (subscription.status === 'past_due') score -= 20;
  else if (subscription.status === 'cancelled') return 0;

  // Onboarding completion (15 points)
  if (subscription.onboarding_completed) {
    score += 15;
  } else if (subscription.onboarding_step) {
    score += (subscription.onboarding_step / 11) * 15;
  }

  // Retention streak (15 points)
  if (retention?.streak_weeks) {
    score += Math.min(15, retention.streak_weeks * 3);
  }

  // Activity (15 points)
  if (retention?.inactive_days === 0) {
    score += 15;
  } else if (retention?.inactive_days && retention.inactive_days <= 7) {
    score += Math.max(5, 15 - retention.inactive_days * 2);
  } else if (retention?.inactive_days && retention.inactive_days > 14) {
    score -= 10;
  }

  // Growth momentum (15 points)
  if (growthStage?.visibility_trend === 'rising') {
    score += 10;
  }
  if (growthStage?.roi_trend === 'accelerating') {
    score += 5;
  }

  // Growth score contribution (5 points)
  if (retention?.growth_score) {
    score += Math.min(5, retention.growth_score * 0.05);
  }

  return Math.min(100, Math.max(0, score));
};

/**
 * Determine churn risk level
 */
export const calculateChurnRisk = (retention) => {
  if (!retention) return 'unknown';

  const inactiveDays = retention.inactive_days || 0;
  const retentionHealth = retention.retention_health_score || 50;

  if (inactiveDays > 21 && retentionHealth < 30) {
    return 'critical';
  } else if (inactiveDays > 14 && retentionHealth < 40) {
    return 'high';
  } else if (inactiveDays > 7 && retentionHealth < 50) {
    return 'medium';
  } else if (inactiveDays > 3) {
    return 'low';
  }

  return 'healthy';
};

/**
 * Segment clients by various criteria
 */
export const segmentClients = (subscriptions, retentionMap, growthStageMap) => {
  const segments = {
    atRisk: [],
    upgradeReady: [],
    highMomentum: [],
    healthy: [],
  };

  subscriptions.forEach((sub) => {
    const retention = retentionMap[sub.id];
    const growthStage = growthStageMap[sub.id];
    const health = calculateClientHealthScore(sub, retention, growthStage);
    const churnRisk = calculateChurnRisk(retention);

    const clientData = {
      ...sub,
      health,
      churnRisk,
      retention,
      growthStage,
    };

    // At-risk: low health or high churn risk
    if (health < 40 || churnRisk === 'critical' || churnRisk === 'high') {
      segments.atRisk.push(clientData);
    }
    // Upgrade ready: high readiness score
    else if (sub.upgrade_readiness_score >= 50 && health >= 60) {
      segments.upgradeReady.push(clientData);
    }
    // High momentum: strong growth indicators
    else if (
      retention?.growth_score >= 60 &&
      growthStage?.roi_trend === 'accelerating'
    ) {
      segments.highMomentum.push(clientData);
    }
    // Healthy: everything looking good
    else if (health >= 60) {
      segments.healthy.push(clientData);
    }
  });

  return segments;
};

/**
 * Get summary of recent client events for activity feed
 */
export const getClientActivityEvents = async (base44, subscription) => {
  const events = [];

  // Signup
  if (subscription.created_date_custom) {
    events.push({
      type: 'signup',
      date: subscription.created_date_custom,
      title: 'Signed Up',
      description: `${subscription.business_name} joined NTA DIY Growth System`,
      icon: 'user-plus',
    });
  }

  // Onboarding completion
  if (subscription.onboarding_completed && subscription.created_date_custom) {
    // Estimate completion date ~1 week after signup
    const completionDate = new Date(subscription.created_date_custom);
    completionDate.setDate(completionDate.getDate() + 7);
    events.push({
      type: 'onboarding_complete',
      date: completionDate.toISOString(),
      title: 'Completed Onboarding',
      description: 'User finished NTA onboarding workflow',
      icon: 'check-circle',
    });
  }

  // Billing issues
  if (subscription.billing_status === 'past_due') {
    events.push({
      type: 'billing_issue',
      date: new Date().toISOString(),
      title: 'Payment Past Due',
      description: `Subscription ${subscription.stripe_subscription_id} requires payment`,
      icon: 'alert-circle',
      severity: 'high',
    });
  }

  // Upgrade signals (from HotProspectAlert)
  try {
    const alerts = await base44.entities.HotProspectAlert.filter(
      { subscription_id: subscription.id },
      '-detected_at',
      3
    );
    alerts.forEach((alert) => {
      events.push({
        type: 'upgrade_signal',
        date: alert.detected_at,
        title: `Upgrade Signal: ${alert.signal_type}`,
        description: `Recommended plan: ${alert.recommended_plan}`,
        icon: 'trending-up',
        metadata: alert,
      });
    });
  } catch (e) {
    // Silently fail if HotProspectAlert not available
  }

  return events.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
};
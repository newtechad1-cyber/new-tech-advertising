/**
 * NTA Automated Sales Engine
 * Detects behavior signals and calculates upgrade readiness dynamically
 */

// Signal scoring constants
const SIGNAL_WEIGHTS = {
  momentum_score: 0.25,
  effort_to_outcome_ratio: 0.20,
  lead_momentum: 0.20,
  time_constraint: 0.20,
  growth_aggressiveness: 0.15,
};

/**
 * Calculate momentum score based on platform engagement
 * Factors: onboarding completion, recent activity, content published
 */
export const calculateMomentumScore = (subscription, growthStage) => {
  if (!subscription) return 0;

  let score = 0;

  // Onboarding completion (0-25 points)
  if (subscription.onboarding_completed) {
    score += 25;
  } else if (subscription.onboarding_step) {
    score += (subscription.onboarding_step / 11) * 25;
  }

  // Recent activity (0-25 points)
  if (growthStage) {
    const monthsActive = growthStage.months_active || 0;
    const contentPublished = growthStage.content_pieces_published || 0;
    
    if (monthsActive > 0) {
      score += Math.min(15, monthsActive * 3);
    }
    
    if (contentPublished > 0) {
      score += Math.min(10, contentPublished * 0.5);
    }

    // Visibility trend bonus
    if (growthStage.visibility_trend === 'rising') {
      score += 10;
    }
  }

  return Math.min(100, score);
};

/**
 * Detect Low Momentum Risk signal
 * Triggers: momentum < 40, onboarding incomplete, inactivity
 */
export const detectLowMomentumRisk = (subscription, growthStage) => {
  const momentum = calculateMomentumScore(subscription, growthStage);
  
  const isInactive = growthStage?.months_active <= 1;
  const incompleteOnboarding = !subscription.onboarding_completed;
  
  const detected = momentum < 40 || (isInactive && incompleteOnboarding);
  
  return {
    detected,
    severity: momentum < 20 ? 'critical' : momentum < 40 ? 'high' : 'medium',
    momentum,
    recommendation: detected ? 'guided_growth' : null,
    message: 'Keep momentum going with expert guidance',
  };
};

/**
 * Detect High Effort / Low Execution signal
 * Triggers: drafts created but not published, tools heavily used without outcomes
 */
export const detectHighEffortLowExecution = (growthStage) => {
  if (!growthStage) return { detected: false };

  // If content published is 0 but months active > 1 = high effort, low execution
  const contentPublished = growthStage.content_pieces_published || 0;
  const monthsActive = growthStage.months_active || 0;
  const portalEngagement = growthStage.portal_engagement_score || 0;

  const detected = monthsActive > 1 && contentPublished < 5 && portalEngagement > 50;

  return {
    detected,
    severity: detected ? 'high' : 'low',
    contentGap: Math.max(0, 5 - contentPublished),
    recommendation: detected ? 'done_for_you' : null,
    message: 'We can handle the execution while you focus on strategy',
  };
};

/**
 * Detect Lead Momentum signal
 * Triggers: leads logged, revenue growth tracked
 */
export const detectLeadMomentum = (growthStage) => {
  if (!growthStage) return { detected: false };

  // Rising ROI trend indicates lead momentum
  const roiTrend = growthStage.roi_trend;
  const visibilityScore = growthStage.visibility_score || 0;

  const detected = roiTrend === 'accelerating' || visibilityScore > 70;

  return {
    detected,
    severity: visibilityScore > 80 ? 'critical' : 'high',
    visibility: visibilityScore,
    recommendation: detected ? 'premium' : null,
    message: 'Your visibility is strong—Premium tier amplifies your lead flow',
  };
};

/**
 * Detect Time Constraint Pattern signal
 * Triggers: low time availability + inconsistent usage
 */
export const detectTimeConstraintPattern = (subscription, growthStage) => {
  if (!subscription) return { detected: false };

  const timeAvailable = subscription.time_commitment_level;
  const monthsActive = growthStage?.months_active || 0;

  const lowTimeOptions = ['minimal', '5_10_hours'];
  const isLowTime = lowTimeOptions.includes(timeAvailable);
  
  // Inconsistent usage = long gaps between activity
  const approvalAvgDays = growthStage?.approval_avg_days || 0;
  const inconsistentUsage = approvalAvgDays > 7 && monthsActive > 1;

  const detected = isLowTime && (monthsActive > 0 && monthsActive <= 3);

  return {
    detected,
    severity: detected ? 'high' : 'low',
    timeConstraint: timeAvailable,
    inconsistent: inconsistentUsage,
    recommendation: detected ? (isLowTime ? 'done_for_you' : 'guided_growth') : null,
    message: `With just ${subscription.time_commitment_level?.replace(/_/g, ' ')} available, let us handle the heavy lifting`,
  };
};

/**
 * Detect Aggressive Growth Intent signal
 * Triggers: high revenue target + aggressive growth speed selection
 */
export const detectAggressiveGrowthIntent = (subscription) => {
  if (!subscription) return { detected: false };

  const revenueTargets = ['25k_50k', '50k_plus'];
  const aggressiveSpeeds = ['aggressive', 'very_aggressive'];

  const highRevenue = revenueTargets.includes(subscription.revenue_growth_target);
  const aggressiveSpeed = aggressiveSpeeds.includes(subscription.growth_speed_intent);

  const detected = highRevenue && aggressiveSpeed;

  return {
    detected,
    severity: detected ? 'critical' : 'low',
    revenueTarget: subscription.revenue_growth_target,
    growthSpeed: subscription.growth_speed_intent,
    recommendation: detected ? 'premium' : null,
    message: 'Premium tier with dedicated support matches your aggressive growth goals',
  };
};

/**
 * Main engine: Calculate overall upgrade readiness and detect all signals
 */
export const calculateUpgradeReadinessAndSignals = (subscription, growthStage) => {
  const signals = {
    momentum: detectLowMomentumRisk(subscription, growthStage),
    effort: detectHighEffortLowExecution(growthStage),
    leadMomentum: detectLeadMomentum(growthStage),
    timeConstraint: detectTimeConstraintPattern(subscription, growthStage),
    aggressiveGrowth: detectAggressiveGrowthIntent(subscription),
  };

  // Calculate readiness score
  let readinessScore = 0;
  const detectedSignals = [];

  // Weight each signal
  readinessScore += signals.momentum.severity === 'critical' ? 25 : signals.momentum.severity === 'high' ? 15 : 5;
  if (signals.momentum.detected) detectedSignals.push('low_momentum_risk');

  readinessScore += signals.effort.detected ? 20 : 0;
  if (signals.effort.detected) detectedSignals.push('high_effort_low_execution');

  readinessScore += signals.leadMomentum.detected ? 20 : 0;
  if (signals.leadMomentum.detected) detectedSignals.push('lead_momentum');

  readinessScore += signals.timeConstraint.detected ? 18 : 0;
  if (signals.timeConstraint.detected) detectedSignals.push('time_constraint_pattern');

  readinessScore += signals.aggressiveGrowth.severity === 'critical' ? 20 : 0;
  if (signals.aggressiveGrowth.detected) detectedSignals.push('aggressive_growth_intent');

  // Determine recommended plan
  let recommendedPlan = 'none';
  let primarySignal = null;

  if (signals.aggressiveGrowth.detected) {
    recommendedPlan = 'premium';
    primarySignal = 'aggressive_growth_intent';
  } else if (signals.leadMomentum.detected) {
    recommendedPlan = 'premium';
    primarySignal = 'lead_momentum';
  } else if (signals.effort.detected) {
    recommendedPlan = 'done_for_you';
    primarySignal = 'high_effort_low_execution';
  } else if (signals.timeConstraint.detected && signals.timeConstraint.timeConstraint === 'minimal') {
    recommendedPlan = 'done_for_you';
    primarySignal = 'time_constraint_pattern';
  } else if (signals.timeConstraint.detected) {
    recommendedPlan = 'guided_growth';
    primarySignal = 'time_constraint_pattern';
  } else if (signals.momentum.detected && signals.momentum.severity === 'high') {
    recommendedPlan = 'guided_growth';
    primarySignal = 'low_momentum_risk';
  }

  return {
    readinessScore: Math.min(100, readinessScore),
    recommendedPlan,
    primarySignal,
    detectedSignals,
    signals,
    shouldShowAlert: readinessScore >= 40 || detectedSignals.length >= 2,
    alertPriority: readinessScore >= 70 ? 'critical' : readinessScore >= 50 ? 'high' : 'medium',
  };
};

/**
 * Get personalized upgrade messaging
 */
export const getUpgradeMessage = (signal) => {
  const messages = {
    low_momentum_risk: {
      title: 'Keep Your Momentum',
      body: 'We notice you\'re building your foundation. Get expert guidance to accelerate results.',
      cta: 'Explore Guided Growth',
      color: 'amber',
    },
    high_effort_low_execution: {
      title: 'Focus on Strategy',
      body: 'You\'re doing great work planning. Let us handle the execution so you can focus on bigger picture thinking.',
      cta: 'Explore Done-For-You',
      color: 'orange',
    },
    lead_momentum: {
      title: 'Amplify Your Success',
      body: 'Your visibility is increasing and leads are coming in. Premium tier accelerates your momentum.',
      cta: 'Explore Premium',
      color: 'green',
    },
    time_constraint_pattern: {
      title: 'Respect Your Time',
      body: 'We see your time is limited. Let experts handle the daily marketing so you can focus on business.',
      cta: 'See Your Options',
      color: 'indigo',
    },
    aggressive_growth_intent: {
      title: 'Achieve Your Goals',
      body: 'You\'re aiming for aggressive growth. Premium tier with dedicated support is built for your ambition.',
      cta: 'Explore Premium',
      color: 'violet',
    },
  };

  return messages[signal] || messages.low_momentum_risk;
};
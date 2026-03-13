/**
 * Subscription state guards and upgrade triggers for DIY Growth System
 */

export const SUBSCRIPTION_STATES = {
  ACTIVE: 'active',
  TRIALING: 'trialing',
  PAST_DUE: 'past_due',
  CANCELLED: 'cancelled',
  INCOMPLETE: 'incomplete',
};

export const isSubscriptionActive = (subscription) => {
  if (!subscription) return false;
  return subscription.status === SUBSCRIPTION_STATES.ACTIVE ||
         subscription.status === SUBSCRIPTION_STATES.TRIALING;
};

export const isSubscriptionAtRisk = (subscription) => {
  if (!subscription) return false;
  return subscription.status === SUBSCRIPTION_STATES.PAST_DUE ||
         subscription.billing_status === SUBSCRIPTION_STATES.PAST_DUE;
};

export const isSubscriptionCancelled = (subscription) => {
  if (!subscription) return false;
  return subscription.status === SUBSCRIPTION_STATES.CANCELLED ||
         subscription.billing_status === SUBSCRIPTION_STATES.CANCELLED;
};

export const calculateUpgradeTriggerScore = (subscription, activity = {}) => {
  let score = 0;
  const momentumScore = activity.momentumScore || 50;

  if (momentumScore < 40) score += 30;
  else if (momentumScore < 60) score += 15;

  if (!subscription.onboarding_completed) score += 25;

  const toolUsageCount = (activity.contentCreated || 0) +
                         (activity.postsScheduled || 0) +
                         (activity.videosCreated || 0);
  if (toolUsageCount > 10) score += 20;
  if (toolUsageCount > 20) score += 25;

  if (activity.leadsLogged > 5) score += 20;

  if (subscription.upsell_intent === 'wants_guidance') score += 25;
  if (subscription.upsell_intent === 'wants_full_service') score += 25;

  return Math.min(Math.max(score, 0), 100);
};

export const shouldShowUpgradePrompt = (subscription, activity = {}) => {
  const triggerScore = calculateUpgradeTriggerScore(subscription, activity);
  return triggerScore >= 50;
};

export const getUpgradeRecommendation = (subscription, activity = {}) => {
  const triggerScore = calculateUpgradeTriggerScore(subscription, activity);

  if (subscription.upsell_intent === 'wants_guidance') {
    return {
      plan: 'Guided Growth',
      headline: 'Ready for 1-on-1 Strategy?',
      message: 'Based on your goals, having a dedicated strategist could help you move faster.',
    };
  }

  if (subscription.upsell_intent === 'wants_full_service') {
    return {
      plan: 'Done-For-You',
      headline: 'Let Us Handle Execution',
      message: 'You\'ve proven the opportunity. Let our team scale it while you focus on sales.',
    };
  }

  if (!subscription.onboarding_completed) {
    return {
      plan: 'Guided Growth',
      headline: 'Complete Setup with a Strategist',
      message: 'A 30-min strategy session helps ensure success from day one.',
    };
  }

  const momentumScore = activity.momentumScore || 50;
  if (momentumScore < 40) {
    return {
      plan: 'Guided Growth',
      headline: 'Stuck on Momentum?',
      message: 'Our strategists specialize in identifying what\'s missing and getting you back on track.',
    };
  }

  const toolUsageCount = (activity.contentCreated || 0) + (activity.postsScheduled || 0) + (activity.videosCreated || 0);
  if (toolUsageCount > 15) {
    return {
      plan: 'Guided Growth',
      headline: 'You\'re Ready to Accelerate',
      message: 'A strategist can help you amplify results and scale faster.',
    };
  }

  if (activity.leadsLogged > 5) {
    return {
      plan: 'Done-For-You',
      headline: 'Proven Model, Scale It Up',
      message: 'Let us help you generate more leads while you close them.',
    };
  }

  return null;
};
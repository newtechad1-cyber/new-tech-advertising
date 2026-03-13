/**
 * Behavioral upgrade logic for pricing ladder
 * Recommends next best plan based on user activity and goals
 */

export const UPGRADE_RECOMMENDATIONS = {
  DIY: {
    nextPlan: 'guided',
    headline: 'Ready to Accelerate?',
    message: 'You\'ve learned the system. A strategist can help you scale 2x faster.',
    triggers: {
      lowMomentum: true,
      highToolUsage: true,
      inconsistentResults: true,
    },
  },
  GUIDED: {
    nextPlan: 'done-for-you',
    headline: 'Proven Model, Scale It',
    message: 'Your strategy is working. Let us handle execution so you can focus on sales.',
    triggers: {
      provableROI: true,
      inconsistentExecution: true,
      highWorkload: true,
    },
  },
  'DONE-FOR-YOU': {
    nextPlan: 'premium',
    headline: 'Go All-In',
    message: 'You\'ve proven the opportunity. Premium packages help you dominate your market.',
    triggers: {
      aggressiveGrowthGoals: true,
      multipleLocations: true,
      marketDominance: true,
    },
  },
};

/**
 * Calculate upgrade readiness score (0-100)
 */
export const calculateUpgradeReadiness = (currentPlan, activity = {}) => {
  let score = 0;

  if (currentPlan === 'diy') {
    // DIY → Guided Growth triggers
    const momentumScore = activity.momentumScore || 50;
    const contentCreated = activity.contentCreated || 0;
    const leadsLogged = activity.leadsLogged || 0;

    if (momentumScore < 40) score += 25; // Struggling
    if (contentCreated > 5) score += 20; // Actively using tools
    if (leadsLogged > 0) score += 20; // Getting results but wants more
    if (activity.timeInvested > 10) score += 15; // Spending significant time
    if (activity.upsellIntent === 'wants_guidance') score += 20;

    return Math.min(score, 100);
  }

  if (currentPlan === 'guided') {
    // Guided → Done-For-You triggers
    const roi = activity.estimatedMonthlyROI || 0;
    const contentQuality = activity.contentApprovalRate || 0;
    const executionConsistency = activity.executionConsistency || 0;

    if (roi > 5000) score += 30; // Proven ROI
    if (contentQuality < 60) score += 25; // Quality issues (want execution help)
    if (executionConsistency < 60) score += 25; // Execution gaps
    if (activity.timeInvested > 20) score += 20; // Too much manual work
    if (activity.upsellIntent === 'wants_full_service') score += 25;

    return Math.min(score, 100);
  }

  if (currentPlan === 'done-for-you') {
    // Done-For-You → Premium triggers
    const monthlyRevenue = activity.monthlyRevenue || 0;
    const growthVelocity = activity.growthVelocity || 0; // % MoM growth
    const marketOpportunity = activity.marketOpportunity || 'small'; // small, medium, large

    if (growthVelocity > 20) score += 30; // Aggressive growth trajectory
    if (monthlyRevenue > 50000) score += 25; // Can afford premium
    if (marketOpportunity === 'large') score += 25; // Big market to dominate
    if (activity.multipleLocations) score += 15;
    if (activity.upsellIntent === 'wants_premium') score += 20;

    return Math.min(score, 100);
  }

  return 0;
};

/**
 * Get upgrade recommendation for current plan
 */
export const getUpgradeRecommendation = (currentPlan, activity = {}) => {
  if (!currentPlan || currentPlan === 'premium') return null;

  const readinessScore = calculateUpgradeReadiness(currentPlan, activity);

  // Only show if readiness is above 40
  if (readinessScore < 40) return null;

  const recommendation = UPGRADE_RECOMMENDATIONS[currentPlan.toUpperCase()] || null;

  return recommendation
    ? {
        ...recommendation,
        readinessScore,
        priority: readinessScore >= 75 ? 'high' : readinessScore >= 50 ? 'medium' : 'low',
      }
    : null;
};

/**
 * Get upgrade CTA based on plan and recommendation
 */
export const getUpgradeCTA = (currentPlan) => {
  const ctaMap = {
    diy: {
      text: 'Upgrade to Guided',
      href: '/nta/pricing-ladder?plan=guided',
      action: 'upgrade',
    },
    guided: {
      text: 'Talk With NTA',
      href: 'mailto:sales@newtechadvertising.com?subject=Upgrade to Done-For-You',
      action: 'contact',
    },
    'done-for-you': {
      text: 'Book Strategy Call',
      href: 'https://calendly.com/nta/premium-strategy',
      action: 'schedule',
    },
    premium: null,
  };

  return ctaMap[currentPlan] || null;
};

/**
 * Get plan description based on current and recommended plan
 */
export const getPlanTransitionDescription = (currentPlan, nextPlan) => {
  const transitions = {
    'diy-guided': {
      title: 'Upgrade to Guided Growth',
      description: 'Get 1-on-1 support from a growth strategist',
      benefits: [
        'Dedicated strategist for your account',
        'Bi-weekly strategy calls',
        'Custom growth plan',
        'Priority support',
      ],
    },
    'guided-done-for-you': {
      title: 'Move to Done-For-You',
      description: 'Let NTA handle content creation and publishing',
      benefits: [
        'We create and publish all content',
        'Weekly performance reports',
        'Dedicated account manager',
        'Faster growth with less work',
      ],
    },
    'done-for-you-premium': {
      title: 'Go Premium Authority Growth',
      description: 'Dominate your market with premium support',
      benefits: [
        'Premium authority building',
        'Streaming TV campaigns',
        'Market expansion strategy',
        'Executive-level support',
      ],
    },
  };

  const key = `${currentPlan}-${nextPlan}`;
  return transitions[key] || null;
};
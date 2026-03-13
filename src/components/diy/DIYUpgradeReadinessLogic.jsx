/**
 * Smart scoring logic for DIY upgrade readiness
 * Predicts upgrade potential based on onboarding data
 */

export const calculateUpgradeReadinessScore = (formData = {}) => {
  let score = 0;

  // Factor 1: Revenue Growth Target (0-25 points)
  // Higher targets indicate serious growth intent
  const revenueTargetMap = {
    'under_5k': 5,
    '5k_10k': 10,
    '10k_25k': 15,
    '25k_50k': 20,
    '50k_plus': 25,
  };
  score += revenueTargetMap[formData.revenue_growth_target] || 0;

  // Factor 2: Growth Speed Intent (0-25 points)
  // Aggressive growth indicates readiness for premium support
  const growthSpeedMap = {
    'slow_steady': 5,
    'moderate': 10,
    'aggressive': 20,
    'very_aggressive': 25,
  };
  score += growthSpeedMap[formData.growth_speed_intent] || 0;

  // Factor 3: Primary Growth Goal (0-20 points)
  // Certain goals correlate with upgrade readiness
  const growthGoalMap = {
    'more_leads': 10,
    'higher_ticket_sales': 15,
    'brand_authority': 12,
    'beat_competitors': 18,
    'expand_locations': 20, // Multi-location = premium candidate
    'faster_growth': 15,
  };
  score += growthGoalMap[formData.primary_growth_goal] || 0;

  // Factor 4: Time Commitment Level (0-20 points)
  // Low time = high upgrade candidate (done-for-you/premium)
  // High time = content with DIY
  const timeCommitmentMap = {
    'minimal': 20,
    '5_10_hours': 15,
    '10_15_hours': 10,
    '15_20_hours': 5,
    '20_plus_hours': 0,
  };
  score += timeCommitmentMap[formData.time_commitment_level] || 0;

  // Factor 5: Marketing Frustration (0-15 points)
  // Execution gaps = done-for-you/premium candidate
  const frustrationMap = {
    'no_consistency': 8,
    'no_leads': 10,
    'low_roi': 12,
    'too_much_work': 15, // Can't execute = upgrade candidate
    'execution_gaps': 15,
  };
  score += frustrationMap[formData.marketing_frustration] || 0;

  // Bonus: Stated Upsell Intent (up to 15 bonus points)
  // Direct signals from user
  if (formData.upsell_intent === 'wants_guidance') {
    score += 10;
  } else if (formData.upsell_intent === 'wants_full_service') {
    score += 15;
  }

  return Math.min(Math.max(score, 0), 100);
};

/**
 * Determine recommended next plan based on profile
 */
export const getRecommendedNextPlan = (formData = {}) => {
  const score = calculateUpgradeReadinessScore(formData);

  // Explicit intent signals (highest priority)
  if (formData.upsell_intent === 'wants_full_service') {
    return 'done_for_you';
  }
  if (formData.upsell_intent === 'wants_guidance') {
    return 'guided_growth';
  }

  // Score-based recommendations
  if (score >= 75) {
    // High upgrade readiness
    const timeCommitment = formData.time_commitment_level;
    const revenueTarget = formData.revenue_growth_target;

    // Minimal time + high revenue = done-for-you/premium
    if (timeCommitment === 'minimal' && (revenueTarget === '25k_50k' || revenueTarget === '50k_plus')) {
      return 'premium';
    }
    if (timeCommitment === 'minimal') {
      return 'done_for_you';
    }

    // Multi-location = premium
    if (formData.primary_growth_goal === 'expand_locations') {
      return 'premium';
    }

    // Otherwise guided growth
    return 'guided_growth';
  }

  if (score >= 50) {
    // Moderate readiness - guided growth
    return 'guided_growth';
  }

  // Low score - stay DIY
  return 'none';
};

/**
 * Get personalized recommendation messaging
 */
export const getUpgradeRecommendation = (formData = {}) => {
  const score = calculateUpgradeReadinessScore(formData);
  const nextPlan = getRecommendedNextPlan(formData);

  const recommendations = {
    'none': {
      headline: 'You\'re Set Up for DIY Success',
      message: 'Your profile shows DIY is a great fit. You have time and want control.',
      cta: 'Go to Dashboard',
      ctaHref: '/client/diy-dashboard',
      color: 'blue',
      emoji: '🚀',
    },
    'guided_growth': {
      headline: 'Accelerate With Expert Guidance',
      message: 'Your goals and effort level suggest you\'d benefit from strategy support. Get bi-weekly calls with a growth strategist.',
      subMessage: `Your upgrade readiness score: ${score}/100`,
      benefits: [
        'Dedicated growth strategist',
        'Bi-weekly strategy calls',
        'Custom growth plan',
        'Priority support',
      ],
      cta: 'Explore Guided Growth',
      ctaHref: 'mailto:sales@newtechadvertising.com?subject=Upgrade to Guided Growth',
      color: 'violet',
      emoji: '⚡',
    },
    'done_for_you': {
      headline: 'Delegate & Focus on Sales',
      message: 'Your limited availability and growth targets show you\'d benefit from full execution. We handle content, you close deals.',
      subMessage: `Your upgrade readiness score: ${score}/100`,
      benefits: [
        'Complete content execution',
        'Weekly published campaigns',
        'Full video production',
        'Dedicated account manager',
      ],
      cta: 'Talk With NTA',
      ctaHref: 'mailto:sales@newtechadvertising.com?subject=Explore Done-For-You',
      color: 'amber',
      emoji: '🎯',
    },
    'premium': {
      headline: 'Dominate Your Market',
      message: 'Your aggressive growth goals and expansion plans position you for premium authority building. Let\'s dominate together.',
      subMessage: `Your upgrade readiness score: ${score}/100`,
      benefits: [
        'Premium authority building',
        'Streaming TV campaigns',
        'Market expansion strategy',
        'Executive-level support',
      ],
      cta: 'Book Strategy Call',
      ctaHref: 'mailto:sales@newtechadvertising.com?subject=Premium Authority Growth',
      color: 'emerald',
      emoji: '👑',
    },
  };

  return recommendations[nextPlan] || recommendations['none'];
};

/**
 * Get insight label based on profile
 */
export const getProfileInsight = (formData = {}) => {
  const frustration = formData.marketing_frustration;
  const timeCommitment = formData.time_commitment_level;
  const revenueTarget = formData.revenue_growth_target;

  if (frustration === 'too_much_work' && timeCommitment === 'minimal') {
    return 'You\'re looking for efficiency — Done-For-You could save you 20+ hours/month';
  }

  if (formData.primary_growth_goal === 'expand_locations') {
    return 'Multi-location growth requires coordination — Premium packages include expansion support';
  }

  if (revenueTarget === '50k_plus' && formData.growth_speed_intent === 'very_aggressive') {
    return 'Your targets require expert execution — Premium support accelerates your timeline';
  }

  if (timeCommitment === 'minimal' && frustration === 'no_leads') {
    return 'You need leads but no time to generate them — Let\'s outsource this';
  }

  return null;
};
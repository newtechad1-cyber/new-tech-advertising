/**
 * NTA Growth Scoring Engine
 * Calculates growth, momentum, upgrade readiness, and churn risk scores
 */

/**
 * Calculate Growth Score (0-100)
 * Factors: content activity, lead generation, revenue, consistency
 */
export function calculateGrowthScore(metrics) {
  if (!metrics) return 0;

  const {
    contentPublishedCount = 0,
    leadsLoggedCount = 0,
    dealsClosedCount = 0,
    revenueAttributed = 0,
    planKey = 'diy',
    daysSinceLastAction = 999
  } = metrics;

  // Base scores from activity
  const contentScore = Math.min((contentPublishedCount / 12) * 30, 30); // 30 points max
  const leadScore = Math.min((leadsLoggedCount / 10) * 30, 30); // 30 points max
  const revenueScore = revenueAttributed > 0 ? 20 : 0; // 20 points for any revenue
  const consistencyScore = daysSinceLastAction <= 7 ? 20 : daysSinceLastAction <= 30 ? 10 : 0; // 20 points max

  const totalScore = contentScore + leadScore + revenueScore + consistencyScore;

  // Boost for higher plans
  const planMultiplier = {
    'free_trial': 0.8,
    'diy': 1.0,
    'guided_growth': 1.15,
    'done_for_you': 1.25,
    'premium': 1.35,
    'enterprise': 1.5
  }[planKey] || 1.0;

  return Math.min(Math.round(totalScore * planMultiplier), 100);
}

/**
 * Calculate Momentum Score (0-100)
 * Week-over-week growth rate and acceleration
 */
export function calculateMomentumScore(currentMetrics, previousMetrics) {
  if (!currentMetrics || !previousMetrics) return 0;

  const {
    contentPublishedCount: currentContent = 0,
    leadsLoggedCount: currentLeads = 0,
    revenueAttributed: currentRevenue = 0
  } = currentMetrics;

  const {
    contentPublishedCount: prevContent = 0,
    leadsLoggedCount: prevLeads = 0,
    revenueAttributed: prevRevenue = 0
  } = previousMetrics;

  // Calculate week-over-week growth rates
  const contentGrowth = prevContent > 0 ? ((currentContent - prevContent) / prevContent) * 100 : (currentContent > 0 ? 100 : 0);
  const leadGrowth = prevLeads > 0 ? ((currentLeads - prevLeads) / prevLeads) * 100 : (currentLeads > 0 ? 100 : 0);
  const revenueGrowth = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : (currentRevenue > 0 ? 100 : 0);

  // Cap growth rates at 100% for scoring
  const contentMomentum = Math.min(Math.max(contentGrowth, -50), 100) / 2;
  const leadMomentum = Math.min(Math.max(leadGrowth, -50), 100) / 2;
  const revenueMomentum = Math.min(Math.max(revenueGrowth, -50), 100) / 2;

  // Average the three momentum indicators
  const momentumScore = (contentMomentum + leadMomentum + revenueMomentum) / 3;

  // Shift from -50 to +100 scale to 0-100 scale
  return Math.round(Math.max(0, Math.min(100, momentumScore + 50)));
}

/**
 * Calculate Upgrade Readiness Score (0-100)
 * Predicts likelihood client is ready for upgrade
 */
export function calculateUpgradeReadinessScore(metrics) {
  if (!metrics) return 0;

  const {
    contentPublishedCount = 0,
    leadsLoggedCount = 0,
    dealsClosedCount = 0,
    revenueAttributed = 0,
    engagementScore = 0,
    daysAsCustomer = 0,
    planKey = 'diy'
  } = metrics;

  // Don't score for already premium/enterprise
  if (['premium', 'enterprise'].includes(planKey)) return 0;

  let readinessScore = 0;

  // Activity signals
  if (contentPublishedCount >= 8) readinessScore += 15;
  else if (contentPublishedCount >= 4) readinessScore += 10;

  if (leadsLoggedCount >= 5) readinessScore += 20;
  else if (leadsLoggedCount >= 2) readinessScore += 10;

  if (dealsClosedCount >= 2) readinessScore += 25;
  else if (dealsClosedCount === 1) readinessScore += 15;

  if (revenueAttributed >= 5000) readinessScore += 20;
  else if (revenueAttributed >= 1000) readinessScore += 10;

  // Engagement and tenure
  if (engagementScore > 75) readinessScore += 10;
  if (daysAsCustomer >= 60) readinessScore += 10;

  return Math.min(readinessScore, 100);
}

/**
 * Calculate Churn Risk Score (0-100)
 * Higher score = higher churn risk
 */
export function calculateChurnRiskScore(metrics) {
  if (!metrics) return 50;

  const {
    contentPublishedCount = 0,
    leadsLoggedCount = 0,
    daysSinceLastAction = 999,
    daysSinceLastEngagement = 999,
    supportTicketsOpen = 0,
    reportedIssues = 0,
    revenueAttributed = 0,
    contractExpiresInDays = 999
  } = metrics;

  let riskScore = 50; // Start at neutral

  // Inactivity increases risk
  if (daysSinceLastAction > 60) riskScore += 25;
  else if (daysSinceLastAction > 30) riskScore += 15;
  else if (daysSinceLastAction > 14) riskScore += 5;

  if (daysSinceLastEngagement > 90) riskScore += 15;
  else if (daysSinceLastEngagement > 60) riskScore += 8;

  // Low activity decreases engagement
  if (contentPublishedCount === 0) riskScore += 15;
  if (leadsLoggedCount === 0) riskScore += 10;
  if (revenueAttributed === 0) riskScore += 10;

  // Support issues increase risk
  if (supportTicketsOpen > 2) riskScore += 20;
  if (reportedIssues > 0) riskScore += 10;

  // Contract expiration proximity
  if (contractExpiresInDays < 30 && contractExpiresInDays > 0) riskScore += 30;
  else if (contractExpiresInDays < 60 && contractExpiresInDays > 0) riskScore += 15;

  return Math.max(0, Math.min(100, riskScore));
}

/**
 * Calculate ROI Estimate
 * Returns { estimate, confidence, formula }
 */
export function calculateROIEstimate(metrics, spendData = {}) {
  if (!metrics) return { estimate: 0, confidence: 'low', formula: 'insufficient_data' };

  const { revenueAttributed = 0 } = metrics;
  const { monthlySpend = 0 } = spendData;

  // Without spend data, can't calculate true ROI
  if (!monthlySpend || monthlySpend <= 0) {
    return {
      estimate: 0,
      confidence: 'low',
      formula: 'no_spend_data',
      message: 'ROI requires spend tracking'
    };
  }

  // Calculate simple ROI: (Revenue - Spend) / Spend * 100
  const roi = ((revenueAttributed / 100 - monthlySpend) / monthlySpend) * 100;

  // Determine confidence based on data quality
  let confidence = 'low';
  if (metrics.contentPublishedCount >= 4 && metrics.leadsLoggedCount >= 3) {
    confidence = 'medium';
  }
  if (metrics.contentPublishedCount >= 8 && metrics.leadsLoggedCount >= 8 && metrics.dealsClosedCount >= 2) {
    confidence = 'high';
  }

  return {
    estimate: Math.round(roi),
    confidence,
    formula: 'roi_simple',
    revenue: revenueAttributed / 100,
    spend: monthlySpend,
    message: `${confidence} confidence based on ${metrics.contentPublishedCount} content pieces and ${metrics.leadsLoggedCount} leads`
  };
}

/**
 * Get next best action recommendation
 */
export function getNextBestAction(metrics, growthScore, upgradeReadiness, churnRisk) {
  // Priority 1: At-risk clients
  if (churnRisk > 70) {
    return {
      action: 'retention_intervention',
      title: 'Schedule Retention Call',
      description: 'Client showing churn risk signals. Schedule executive touch point.',
      priority: 'critical',
      suggestedAction: 'Schedule 30-min strategy call within 48 hours'
    };
  }

  // Priority 2: Upgrade-ready
  if (upgradeReadiness > 75) {
    return {
      action: 'upgrade_offer',
      title: 'Present Upgrade Opportunity',
      description: 'Client is ready for next tier. Send personalized proposal.',
      priority: 'high',
      suggestedAction: 'Send upgrade proposal and schedule strategy call'
    };
  }

  // Priority 3: Boost engagement
  if (metrics.contentPublishedCount < 4) {
    return {
      action: 'content_boost',
      title: 'Launch Content Sprint',
      description: 'Increase content frequency to build momentum.',
      priority: 'high',
      suggestedAction: 'Create 4-week content acceleration plan'
    };
  }

  // Priority 4: Lead generation
  if (metrics.leadsLoggedCount < 3 && metrics.contentPublishedCount >= 4) {
    return {
      action: 'lead_generation',
      title: 'Activate Lead Capture',
      description: 'Have content but need to capture more leads.',
      priority: 'medium',
      suggestedAction: 'Add CTAs to existing content, set up lead magnets'
    };
  }

  // Priority 5: ROI optimization
  if (metrics.leadsLoggedCount > 0 && metrics.dealsClosedCount === 0) {
    return {
      action: 'roi_optimization',
      title: 'Convert Leads to Revenue',
      description: 'Have leads but not converting. Optimize funnel.',
      priority: 'medium',
      suggestedAction: 'Review sales process, add lead nurture sequences'
    };
  }

  // Default: maintain momentum
  return {
    action: 'maintain_momentum',
    title: 'Continue Current Strategy',
    description: 'Client is on good trajectory. Maintain current approach.',
    priority: 'low',
    suggestedAction: 'Monitor metrics weekly, celebrate wins'
  };
}

/**
 * Build comprehensive analytics snapshot
 */
export function buildAnalyticsSnapshot(orgId, rawMetrics, previousMetrics = null) {
  const snapshotId = `snapshot_${orgId}_${Date.now()}`;
  const snapshotDate = new Date().toISOString();

  const growthScore = calculateGrowthScore(rawMetrics);
  const momentumScore = calculateMomentumScore(rawMetrics, previousMetrics);
  const upgradeReadiness = calculateUpgradeReadinessScore(rawMetrics);
  const churnRisk = calculateChurnRiskScore(rawMetrics);
  const roiData = calculateROIEstimate(rawMetrics, rawMetrics.spendData);
  const nextAction = getNextBestAction(rawMetrics, growthScore, upgradeReadiness, churnRisk);

  return {
    snapshotId,
    organizationId: orgId,
    snapshotDate,
    planKey: rawMetrics.planKey || 'diy',
    growthScore,
    momentumScore,
    contentCreatedCount: rawMetrics.contentCreatedCount || 0,
    contentPublishedCount: rawMetrics.contentPublishedCount || 0,
    videosCreatedCount: rawMetrics.videosCreatedCount || 0,
    pagesPublishedCount: rawMetrics.pagesPublishedCount || 0,
    leadsLoggedCount: rawMetrics.leadsLoggedCount || 0,
    dealsClosedCount: rawMetrics.dealsClosedCount || 0,
    revenueAttributed: rawMetrics.revenueAttributed || 0,
    roiEstimate: roiData.estimate,
    roiConfidence: roiData.confidence,
    upgradeReadinessScore: upgradeReadiness,
    churnRiskScore: churnRisk,
    activityIntelligence: JSON.stringify({
      contentPublishedThisPeriod: rawMetrics.contentPublishedCount,
      contentVelocity: rawMetrics.contentVelocity,
      publishingConsistency: rawMetrics.publishingConsistency,
      averageEngagementRate: rawMetrics.avgEngagementRate
    }),
    visibilityIntelligence: JSON.stringify({
      searchRankingsImproved: rawMetrics.rankingsImproved,
      visibilityScore: rawMetrics.visibilityScore,
      trafficTrend: rawMetrics.trafficTrend
    }),
    leadIntelligence: JSON.stringify({
      leadsGenerated: rawMetrics.leadsLoggedCount,
      leadQualityScore: rawMetrics.leadQualityScore,
      conversionRate: rawMetrics.conversionRate
    }),
    revenueIntelligence: JSON.stringify({
      revenueAttributed: rawMetrics.revenueAttributed,
      costPerLead: rawMetrics.costPerLead,
      costPerAcquisition: rawMetrics.costPerAcquisition,
      roi: roiData.estimate
    }),
    growthReadinessIntelligence: JSON.stringify({
      upgradeReadiness,
      churnRisk,
      recommendedNextPlan: upgradeReadiness > 75 ? 'guided_growth' : null
    }),
    nextBestAction: JSON.stringify(nextAction),
    createdAt: snapshotDate,
    updatedAt: snapshotDate
  };
}
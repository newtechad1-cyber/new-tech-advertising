// Score Engine — pure calculation utilities
// Imported inline by other functions (no local imports allowed)

export function computeBusinessInputCompleteness(bp) {
  let score = 0;
  if (bp.business_name) score += 5;
  if (bp.industry_slug) score += 10;
  if (bp.city) score += 10;
  if (bp.state) score += 10;
  if (bp.core_services && bp.core_services.length > 0) score += 15;
  if (bp.target_customers && bp.target_customers.length > 0) score += 10;
  if (bp.primary_goal) score += 10;
  if (bp.preferred_channels && bp.preferred_channels.length > 0) score += 10;
  // Assets flags (8 flags, ~1.25 each = 10)
  const assetFlags = ['has_blog','has_video_assets','has_email_list','has_google_business_profile','has_reviews','has_location_pages','has_service_pages','has_social_presence'];
  const assetsCompleted = assetFlags.filter(f => bp[f] !== undefined && bp[f] !== null).length;
  score += Math.round((assetsCompleted / assetFlags.length) * 10);
  // Capacity fields
  const capacities = ['marketing_maturity','content_capacity','video_capacity','sales_followup_capacity'];
  const capsCompleted = capacities.filter(f => bp[f] !== undefined && bp[f] !== null && bp[f] !== 30).length;
  score += Math.round((capsCompleted / capacities.length) * 10);
  return Math.min(100, score);
}

export function computeDemandScore({ industryRelevance = 50, localRelevance = 50, seasonalityFit = 50, urgencyFit = 50, serviceAlignment = 50 }) {
  return Math.round(
    industryRelevance * 0.25 +
    localRelevance * 0.25 +
    seasonalityFit * 0.20 +
    urgencyFit * 0.15 +
    serviceAlignment * 0.15
  );
}

export function computeCompetitionScore({ localCompetition = 50, pageSaturation = 50, reviewCompetition = 50, adSaturation = 50, differentiationStrength = 30 }) {
  const raw = (
    localCompetition * 0.35 +
    pageSaturation * 0.20 +
    reviewCompetition * 0.20 +
    adSaturation * 0.15 -
    differentiationStrength * 0.10
  );
  return Math.min(100, Math.max(0, Math.round(raw)));
}

export function computeReadinessScore(bp) {
  const serviceAvail = bp.core_services?.length > 0 ? 80 : 30;
  const contentCap = bp.content_capacity ?? 30;
  const videoCap = bp.video_capacity ?? 30;
  const followupCap = bp.sales_followup_capacity ?? 30;
  const ctaReadiness = bp.has_service_pages ? 70 : 30;
  const assetReadiness = (bp.has_video_assets || bp.has_blog) ? 60 : 25;
  const techReadiness = (bp.has_google_business_profile || bp.website_url) ? 70 : 30;
  return Math.round(
    serviceAvail * 0.20 +
    contentCap * 0.15 +
    videoCap * 0.15 +
    followupCap * 0.15 +
    ctaReadiness * 0.15 +
    assetReadiness * 0.10 +
    techReadiness * 0.10
  );
}

export function computeRevenuePotentialScore({ marginPotential = 50, leadIntentStrength = 50, servicePriority = 50, repeatPotential = 40, urgencyValue = 50, seasonalRevenueFit = 50 }) {
  return Math.round(
    marginPotential * 0.20 +
    leadIntentStrength * 0.25 +
    servicePriority * 0.20 +
    repeatPotential * 0.10 +
    urgencyValue * 0.15 +
    seasonalRevenueFit * 0.10
  );
}

export function computeConfidenceScore({ industryDataQuality = 60, localDataQuality = 50, businessInputCompleteness = 30, observedPerformanceWeight = 0, provenHistoricalEvidence = 0, recency = 50 }) {
  return Math.round(
    industryDataQuality * 0.20 +
    localDataQuality * 0.20 +
    businessInputCompleteness * 0.20 +
    observedPerformanceWeight * 0.20 +
    provenHistoricalEvidence * 0.15 +
    recency * 0.05
  );
}

export function computeOverallOpportunityScore({ demandScore = 50, competitionScore = 50, readinessScore = 50, revenuePotentialScore = 50, confidenceScore = 50 }) {
  return Math.round(
    demandScore * 0.30 +
    (100 - competitionScore) * 0.15 +
    readinessScore * 0.20 +
    revenuePotentialScore * 0.25 +
    confidenceScore * 0.10
  );
}

export function determineTruthState(completeness, hasLocalMarket, hasServiceAlignment, signalCount, avgSignalConfidence) {
  if (signalCount >= 3 && avgSignalConfidence >= 70) return 'proven';
  if (signalCount >= 1 && avgSignalConfidence >= 50) return 'observed';
  if (completeness >= 60 && hasLocalMarket && hasServiceAlignment) return 'inferred';
  return 'assumed';
}
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Inline scoring utilities (no local imports in Deno)
function computeBusinessInputCompleteness(bp) {
  let score = 0;
  if (bp.business_name) score += 5;
  if (bp.industry_slug) score += 10;
  if (bp.city) score += 10;
  if (bp.state) score += 10;
  if (bp.core_services?.length > 0) score += 15;
  if (bp.target_customers?.length > 0) score += 10;
  if (bp.primary_goal) score += 10;
  if (bp.preferred_channels?.length > 0) score += 10;
  const assetFlags = ['has_blog','has_video_assets','has_email_list','has_google_business_profile','has_reviews','has_location_pages','has_service_pages','has_social_presence'];
  const assetsCompleted = assetFlags.filter(f => bp[f] !== undefined && bp[f] !== null).length;
  score += Math.round((assetsCompleted / assetFlags.length) * 10);
  const capacities = ['marketing_maturity','content_capacity','video_capacity','sales_followup_capacity'];
  const capsCompleted = capacities.filter(f => bp[f] !== undefined && bp[f] !== null && bp[f] !== 30).length;
  score += Math.round((capsCompleted / capacities.length) * 10);
  return Math.min(100, score);
}

function computeConfidenceScore({ industryDataQuality, localDataQuality, businessInputCompleteness, observedPerformanceWeight, provenHistoricalEvidence, recency }) {
  return Math.round(
    (industryDataQuality ?? 60) * 0.20 +
    (localDataQuality ?? 50) * 0.20 +
    (businessInputCompleteness ?? 30) * 0.20 +
    (observedPerformanceWeight ?? 0) * 0.20 +
    (provenHistoricalEvidence ?? 0) * 0.15 +
    (recency ?? 50) * 0.05
  );
}

function determineTruthState(completeness, hasLocalMarket, hasServiceAlignment, signalCount, avgSignalConfidence) {
  if (signalCount >= 3 && avgSignalConfidence >= 70) return 'proven';
  if (signalCount >= 1 && avgSignalConfidence >= 50) return 'observed';
  if (completeness >= 60 && hasLocalMarket && hasServiceAlignment) return 'inferred';
  return 'assumed';
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { business_profile_id } = await req.json();
    if (!business_profile_id) return Response.json({ error: 'business_profile_id required' }, { status: 400 });

    // Load business profile
    const bp = await base44.asServiceRole.entities.BusinessProfile.get(business_profile_id);
    if (!bp) return Response.json({ error: 'BusinessProfile not found' }, { status: 404 });

    // Load IndustryIntel
    const intelList = await base44.asServiceRole.entities.IndustryIntel.filter({ industry_slug: bp.industry_slug });
    const intel = intelList[0] || null;

    // Load LocalMarketIntel — fallback chain
    let localIntel = null;
    const localByCity = await base44.asServiceRole.entities.LocalMarketIntel.filter({ city: bp.city, state: bp.state, industry_slug: bp.industry_slug });
    if (localByCity.length > 0) {
      localIntel = localByCity[0];
    } else {
      const localByState = await base44.asServiceRole.entities.LocalMarketIntel.filter({ state: bp.state, industry_slug: bp.industry_slug, city: '' });
      if (localByState.length > 0) localIntel = localByState[0];
      else {
        const localByIndustry = await base44.asServiceRole.entities.LocalMarketIntel.filter({ industry_slug: bp.industry_slug });
        if (localByIndustry.length > 0) localIntel = localByIndustry[0];
      }
    }

    // Load performance signals
    const signals = await base44.asServiceRole.entities.PerformanceSignal.filter({ business_profile_id });
    const signalCount = signals.length;
    const avgSignalConfidence = signalCount > 0
      ? signals.reduce((sum, s) => sum + (s.signal_confidence_score || 50), 0) / signalCount
      : 0;

    // Scoring
    const completeness = computeBusinessInputCompleteness(bp);
    const hasLocalMarket = !!localIntel;
    const hasServiceAlignment = !!(bp.core_services?.length > 0 && intel?.core_services?.length > 0);

    const truthState = determineTruthState(completeness, hasLocalMarket, hasServiceAlignment, signalCount, avgSignalConfidence);

    const overallConf = computeConfidenceScore({
      industryDataQuality: intel?.confidence_score ?? 60,
      localDataQuality: localIntel?.confidence_score ?? 50,
      businessInputCompleteness: completeness,
      observedPerformanceWeight: signalCount > 0 ? Math.min(100, signalCount * 15) : 0,
      provenHistoricalEvidence: signalCount >= 3 ? 70 : 0,
      recency: 60
    });

    // Build derived recommendations
    const contentPillars = [
      ...(intel?.top_content_angles?.slice(0, 3) || []),
      ...(localIntel?.recommended_local_topics?.slice(0, 2) || [])
    ].slice(0, 5);

    const videoPillars = [
      ...(intel?.top_video_themes?.slice(0, 3) || []),
      ...(localIntel?.recommended_video_angles?.slice(0, 2) || [])
    ].slice(0, 5);

    const streamingTvAngles = [
      ...(intel?.top_streaming_tv_angles?.slice(0, 3) || []),
      ...(localIntel?.recommended_streaming_tv_angles?.slice(0, 2) || [])
    ].slice(0, 5);

    const servicePages = (bp.core_services || intel?.core_services || [])
      .slice(0, 6)
      .map(s => `${s} page for ${bp.city}, ${bp.state}`);

    const locationPages = (bp.priority_locations_goal?.length > 0 ? bp.priority_locations_goal : [bp.city])
      .slice(0, 5)
      .map(loc => `${bp.industry_slug.replace('-marketing','')} services in ${loc}`);

    const problemArticles = (intel?.top_problem_topics || []).slice(0, 5);
    const socialSeries = (intel?.top_social_themes || []).slice(0, 4);
    const campaignTypes = intel?.recommended_campaign_types || ['social_campaign', 'seo_campaign'];
    const ctaMix = intel?.recommended_cta_types || ['free_estimate', 'call_now'];
    const primaryOffer = intel?.recommended_offers?.[0] || `Free ${bp.industry_slug.replace('-marketing','')} consultation`;
    const secondaryOffers = (intel?.recommended_offers || []).slice(1, 4);

    const positioning = `${bp.business_name} is a ${bp.business_stage || 'growing'} ${bp.industry_slug.replace('-marketing','')} business in ${bp.city}, ${bp.state}. ` +
      `Primary goal: ${bp.primary_goal || 'leads'}. ` +
      `Core strengths: ${(bp.core_services || []).slice(0, 3).join(', ') || 'service excellence'}. ` +
      `Recommended positioning: local authority provider emphasizing speed, trust, and results.`;

    const quickWins = [];
    if (!bp.has_google_business_profile) quickWins.push('Claim and optimize Google Business Profile');
    if (!bp.has_reviews) quickWins.push('Launch a review generation campaign — ask last 20 customers');
    if (!bp.has_service_pages) quickWins.push('Create individual service pages for each core service');
    if (!bp.has_social_presence) quickWins.push('Set up Facebook and Instagram business profiles');
    quickWins.push('Publish first streaming TV commercial script using the TV Script Generator');
    quickWins.push('Generate and post 4 social media posts for the current week');

    const topOpportunities = [
      'Create service-specific landing pages for top 3 services',
      'Launch streaming TV campaign targeting service area',
      'Build review generation email sequence',
      ...(localIntel?.common_missing_pages?.slice(0, 2) || []),
    ].slice(0, 5);

    const topGaps = [
      ...(intel?.common_customer_types?.length ? [] : ['Missing customer persona definition']),
      ...(bp.has_service_pages ? [] : ['No individual service pages exist']),
      ...(bp.has_video_assets ? [] : ['No video content assets']),
      ...(bp.has_email_list ? [] : ['No email list or automation']),
      ...(localIntel?.common_missing_content_types?.slice(0, 2) || []),
    ].slice(0, 5);

    const topRisks = [
      ...(!bp.has_reviews ? ['Zero online reviews — critical trust gap'] : []),
      ...(!bp.has_google_business_profile ? ['Google Business Profile unclaimed'] : []),
      'Competitor content volume likely outpacing current output',
    ].slice(0, 3);

    // Check for existing BIP
    const existing = await base44.asServiceRole.entities.BusinessIntelProfile.filter({ business_profile_id });
    const now = new Date().toISOString();

    const bipData = {
      business_profile_id,
      industry_slug: bp.industry_slug,
      city: bp.city,
      state: bp.state,
      status: 'active',
      recommended_positioning: positioning,
      recommended_primary_offer: primaryOffer,
      recommended_secondary_offers: secondaryOffers,
      recommended_content_pillars: contentPillars,
      recommended_video_pillars: videoPillars,
      recommended_campaign_types: campaignTypes,
      recommended_streaming_tv_angles: streamingTvAngles,
      recommended_cta_mix: ctaMix,
      priority_service_pages: servicePages,
      priority_location_pages: locationPages,
      priority_problem_articles: problemArticles,
      priority_playbook_topics: (intel?.top_education_topics || []).slice(0, 4),
      priority_tool_page_topics: ['marketing-plan-generator', 'tv-commercial-script-generator'],
      priority_video_topics: videoPillars,
      priority_social_series: socialSeries,
      top_opportunities: topOpportunities,
      top_gaps: topGaps,
      top_risks: topRisks,
      quick_win_actions: quickWins,
      overall_confidence_score: overallConf,
      seo_confidence_score: Math.min(100, overallConf + (bp.has_service_pages ? 15 : -10)),
      content_confidence_score: Math.min(100, overallConf + (bp.has_blog ? 10 : -5)),
      offer_confidence_score: Math.min(100, overallConf + (intel?.recommended_offers?.length > 0 ? 10 : 0)),
      campaign_confidence_score: Math.min(100, overallConf + (hasLocalMarket ? 10 : 0)),
      positioning_source_state: truthState,
      offer_source_state: truthState,
      content_source_state: truthState,
      campaign_source_state: truthState,
      last_generated_at: now,
      last_refreshed_at: now,
      version: '1.0'
    };

    let bip;
    if (existing.length > 0) {
      bip = await base44.asServiceRole.entities.BusinessIntelProfile.update(existing[0].id, bipData);
    } else {
      bip = await base44.asServiceRole.entities.BusinessIntelProfile.create(bipData);
    }

    return Response.json({ success: true, bip_id: bip.id, confidence: overallConf, truth_state: truthState, completeness });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
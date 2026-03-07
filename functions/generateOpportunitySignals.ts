import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

function computeReadinessScore(bp) {
  const serviceAvail = bp.core_services?.length > 0 ? 80 : 30;
  const contentCap = bp.content_capacity ?? 30;
  const videoCap = bp.video_capacity ?? 30;
  const followupCap = bp.sales_followup_capacity ?? 30;
  const ctaReadiness = bp.has_service_pages ? 70 : 30;
  const assetReadiness = (bp.has_video_assets || bp.has_blog) ? 60 : 25;
  const techReadiness = (bp.has_google_business_profile || bp.website_url) ? 70 : 30;
  return Math.round(
    serviceAvail * 0.20 + contentCap * 0.15 + videoCap * 0.15 +
    followupCap * 0.15 + ctaReadiness * 0.15 + assetReadiness * 0.10 + techReadiness * 0.10
  );
}

function computeOverallOpportunityScore({ demandScore, competitionScore, readinessScore, revenuePotentialScore, confidenceScore }) {
  return Math.round(
    (demandScore ?? 50) * 0.30 +
    (100 - (competitionScore ?? 50)) * 0.15 +
    (readinessScore ?? 50) * 0.20 +
    (revenuePotentialScore ?? 50) * 0.25 +
    (confidenceScore ?? 50) * 0.10
  );
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { business_profile_id } = await req.json();
    if (!business_profile_id) return Response.json({ error: 'business_profile_id required' }, { status: 400 });

    const bpList = await base44.asServiceRole.entities.BusinessProfile.filter({ id: business_profile_id });
    const bp = bpList[0];
    if (!bp) return Response.json({ error: 'BusinessProfile not found' }, { status: 404 });

    const bipList = await base44.asServiceRole.entities.BusinessIntelProfile.filter({ business_profile_id });
    const bip = bipList[0];

    const intelList = await base44.asServiceRole.entities.IndustryIntel.filter({ industry_slug: bp.industry_slug });
    const intel = intelList[0] || null;

    const localList = await base44.asServiceRole.entities.LocalMarketIntel.filter({ city: bp.city, state: bp.state, industry_slug: bp.industry_slug });
    const localIntel = localList[0] || null;

    const readiness = computeReadinessScore(bp);
    const baseConf = bip?.overall_confidence_score || 50;
    const compLevel = localIntel?.competition_level || 50;

    // Delete old signals for this business
    const existing = await base44.asServiceRole.entities.OpportunitySignal.filter({ business_profile_id });
    for (const sig of existing) {
      await base44.asServiceRole.entities.OpportunitySignal.delete(sig.id);
    }

    const opportunities = [];

    // Missing service pages
    const coreServices = bp.core_services || intel?.core_services || [];
    if (!bp.has_service_pages && coreServices.length > 0) {
      for (const svc of coreServices.slice(0, 3)) {
        const demand = 75;
        const rev = 70;
        const overall = computeOverallOpportunityScore({ demandScore: demand, competitionScore: compLevel, readinessScore: readiness, revenuePotentialScore: rev, confidenceScore: baseConf });
        opportunities.push({
          business_profile_id, industry_slug: bp.industry_slug, city: bp.city, state: bp.state,
          opportunity_type: 'missing_service_page',
          title: `Create service page: ${svc}`,
          description: `No dedicated service page exists for "${svc}". This page would capture search intent for people looking for this service in ${bp.city}.`,
          priority: overall,
          demand_score: demand, competition_score: compLevel, readiness_score: readiness,
          revenue_potential_score: rev, confidence_score: baseConf, overall_opportunity_score: overall,
          recommended_action_type: 'create_page', recommended_page_type: 'service_page',
          recommended_content_type: 'landing_page',
          recommended_cta: 'Request a Free Estimate',
          truth_state: bip?.positioning_source_state || 'assumed', status: 'active'
        });
      }
    }

    // Missing location pages
    if (!bp.has_location_pages) {
      const locations = bp.priority_locations_goal?.length > 0 ? bp.priority_locations_goal : [bp.city];
      for (const loc of locations.slice(0, 2)) {
        const demand = 65;
        const overall = computeOverallOpportunityScore({ demandScore: demand, competitionScore: compLevel, readinessScore: readiness, revenuePotentialScore: 60, confidenceScore: baseConf });
        opportunities.push({
          business_profile_id, industry_slug: bp.industry_slug, city: bp.city, state: bp.state,
          opportunity_type: 'missing_location_page',
          title: `Create location page: ${bp.industry_slug.replace('-marketing','')} in ${loc}`,
          description: `No location-specific landing page for ${loc}. Local SEO requires geo-targeted pages to capture "near me" and city-specific searches.`,
          priority: overall, demand_score: demand, competition_score: compLevel,
          readiness_score: readiness, revenue_potential_score: 60, confidence_score: baseConf, overall_opportunity_score: overall,
          recommended_action_type: 'create_page', recommended_page_type: 'location_page',
          recommended_content_type: 'landing_page', recommended_cta: 'Get a Free Quote',
          truth_state: bip?.positioning_source_state || 'assumed', status: 'active'
        });
      }
    }

    // Missing streaming TV
    const streamingAngles = intel?.top_streaming_tv_angles || [];
    if (streamingAngles.length > 0) {
      const demand = 70;
      const overall = computeOverallOpportunityScore({ demandScore: demand, competitionScore: Math.max(20, compLevel - 20), readinessScore: readiness, revenuePotentialScore: 75, confidenceScore: baseConf });
      opportunities.push({
        business_profile_id, industry_slug: bp.industry_slug, city: bp.city, state: bp.state,
        opportunity_type: 'streaming_tv_gap',
        title: `Launch streaming TV campaign: ${streamingAngles[0]}`,
        description: `No streaming TV ads detected. Streaming TV reaches cord-cutters in ${bp.city} with high completion rates and precise geographic targeting.`,
        priority: overall, demand_score: demand, competition_score: Math.max(20, compLevel - 20),
        readiness_score: readiness, revenue_potential_score: 75, confidence_score: baseConf, overall_opportunity_score: overall,
        recommended_action_type: 'create_campaign', recommended_video_type: 'streaming_tv_ad',
        recommended_offer: intel?.recommended_offers?.[0] || 'Free estimate',
        recommended_cta: 'Call Now or Visit Our Website',
        truth_state: bip?.positioning_source_state || 'assumed', status: 'active'
      });
    }

    // Review gap
    if (!bp.has_reviews) {
      const demand = 80;
      const overall = computeOverallOpportunityScore({ demandScore: demand, competitionScore: 30, readinessScore: readiness, revenuePotentialScore: 65, confidenceScore: baseConf });
      opportunities.push({
        business_profile_id, industry_slug: bp.industry_slug, city: bp.city, state: bp.state,
        opportunity_type: 'review_gap',
        title: 'Launch review generation campaign',
        description: 'No online reviews detected. Reviews are a top local SEO ranking factor. A simple email/SMS sequence can generate 10+ reviews in the first 30 days.',
        priority: overall, demand_score: demand, competition_score: 30,
        readiness_score: readiness, revenue_potential_score: 65, confidence_score: baseConf, overall_opportunity_score: overall,
        recommended_action_type: 'create_email_sequence',
        recommended_cta: 'Leave us a Google Review',
        truth_state: bip?.positioning_source_state || 'assumed', status: 'active'
      });
    }

    // Missing offer
    const hasOffers = bp.preferred_offer_types?.length > 0;
    if (!hasOffers) {
      const demand = 65;
      const overall = computeOverallOpportunityScore({ demandScore: demand, competitionScore: compLevel, readinessScore: readiness, revenuePotentialScore: 70, confidenceScore: baseConf });
      opportunities.push({
        business_profile_id, industry_slug: bp.industry_slug, city: bp.city, state: bp.state,
        opportunity_type: 'missing_offer',
        title: `Create entry offer: ${intel?.recommended_offers?.[0] || 'Free consultation or estimate'}`,
        description: 'No entry offer defined. A low-friction offer converts more website visitors into leads.',
        priority: overall, demand_score: demand, competition_score: compLevel,
        readiness_score: readiness, revenue_potential_score: 70, confidence_score: baseConf, overall_opportunity_score: overall,
        recommended_action_type: 'create_offer', recommended_offer: intel?.recommended_offers?.[0] || 'Free consultation',
        recommended_cta: 'Claim Your Free Estimate',
        truth_state: 'assumed', status: 'active'
      });
    }

    // Social theme gap
    if (!bp.has_social_presence) {
      const demand = 60;
      const overall = computeOverallOpportunityScore({ demandScore: demand, competitionScore: compLevel, readinessScore: readiness, revenuePotentialScore: 55, confidenceScore: baseConf });
      opportunities.push({
        business_profile_id, industry_slug: bp.industry_slug, city: bp.city, state: bp.state,
        opportunity_type: 'missing_social_theme',
        title: 'Launch weekly social media content series',
        description: `No consistent social media presence. A weekly social content series positions the business as the local authority in ${bp.city}.`,
        priority: overall, demand_score: demand, competition_score: compLevel,
        readiness_score: readiness, revenue_potential_score: 55, confidence_score: baseConf, overall_opportunity_score: overall,
        recommended_action_type: 'create_social_series',
        recommended_content_type: 'social_post',
        recommended_cta: 'Follow us for weekly tips',
        truth_state: 'assumed', status: 'active'
      });
    }

    // CTA gap
    if (!bp.has_service_pages || !bp.primary_goal) {
      const demand = 60;
      const overall = computeOverallOpportunityScore({ demandScore: demand, competitionScore: 40, readinessScore: readiness, revenuePotentialScore: 65, confidenceScore: baseConf });
      opportunities.push({
        business_profile_id, industry_slug: bp.industry_slug, city: bp.city, state: bp.state,
        opportunity_type: 'cta_gap',
        title: 'Add primary CTA to all pages and social profiles',
        description: 'No clear primary CTA strategy. Every digital touchpoint should drive toward one high-intent action.',
        priority: overall, demand_score: demand, competition_score: 40,
        readiness_score: readiness, revenue_potential_score: 65, confidence_score: baseConf, overall_opportunity_score: overall,
        recommended_action_type: 'improve_cta',
        recommended_cta: intel?.recommended_cta_types?.[0] || 'Get a Free Estimate',
        truth_state: 'assumed', status: 'active'
      });
    }

    // Seasonal campaign gap
    const slowSeasons = intel?.slow_seasons || [];
    if (slowSeasons.length > 0) {
      const demand = 62;
      const overall = computeOverallOpportunityScore({ demandScore: demand, competitionScore: compLevel, readinessScore: readiness, revenuePotentialScore: 68, confidenceScore: baseConf });
      opportunities.push({
        business_profile_id, industry_slug: bp.industry_slug, city: bp.city, state: bp.state,
        opportunity_type: 'seasonal_gap',
        title: `Create slow-season campaign for ${slowSeasons[0]}`,
        description: `${slowSeasons[0]} is typically slow for this industry. A proactive campaign during this period can keep the pipeline full.`,
        priority: overall, demand_score: demand, competition_score: compLevel,
        readiness_score: readiness, revenue_potential_score: 68, confidence_score: baseConf, overall_opportunity_score: overall,
        recommended_action_type: 'create_campaign', recommended_content_type: 'landing_page',
        recommended_offer: intel?.recommended_offers?.[1] || 'Seasonal special',
        recommended_cta: 'Book Before the Rush',
        truth_state: 'assumed', status: 'active'
      });
    }

    // Create all signals
    const created = [];
    for (const opp of opportunities) {
      const rec = await base44.asServiceRole.entities.OpportunitySignal.create(opp);
      created.push(rec.id);
    }

    return Response.json({ success: true, created_count: created.length, signal_ids: created });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
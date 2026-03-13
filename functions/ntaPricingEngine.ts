import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Base package definitions — source of truth
const PACKAGES = {
  visibility_foundation: {
    name: 'Visibility Foundation',
    tagline: 'Establish your digital presence and start building local authority',
    base_setup: 1500,
    base_monthly: 997,
    content_articles: 4,
    social_posts: 12,
    videos: 1,
    streaming: false,
    roi_dashboard: true,
    strategist: false,
    locations: 1,
    sort: 1,
    ideal: 'Single-location service businesses entering digital marketing or replacing ineffective agencies',
    capabilities: ['SEO-Optimized Blog Content', 'Social Media Publishing', 'Google Business Optimization', 'Monthly Performance Report', 'ROI Dashboard'],
    milestones: ['Month 1-2: Foundation & content pipeline live', 'Month 3-4: Visibility score improvement', 'Month 5-6: Measurable lead attribution'],
    upgrade_path: 'market_authority',
  },
  market_authority: {
    name: 'Market Authority Growth',
    tagline: 'Own your market category with dominant content velocity and streaming presence',
    base_setup: 2500,
    base_monthly: 1997,
    content_articles: 8,
    social_posts: 20,
    videos: 2,
    streaming: true,
    roi_dashboard: true,
    strategist: true,
    locations: 1,
    sort: 2,
    ideal: 'Established businesses ready to outpace competitors and become the recognizable authority in their city and vertical',
    capabilities: ['All Visibility Foundation capabilities', 'Streaming TV Placement (Roku, Fire TV, Apple TV)', 'Video Script & Production', 'Dedicated Growth Strategist', 'Advanced Competitor Intelligence', 'Weekly Content Calendar'],
    milestones: ['Month 1: Streaming campaign live', 'Month 2-3: Authority content compounding', 'Month 4-6: Market share growth visible in rankings'],
    upgrade_path: 'market_domination',
  },
  market_domination: {
    name: 'Market Domination Strategy',
    tagline: 'Full-spectrum authority deployment across every visibility channel in your market',
    base_setup: 4500,
    base_monthly: 3997,
    content_articles: 16,
    social_posts: 30,
    videos: 4,
    streaming: true,
    roi_dashboard: true,
    strategist: true,
    locations: 3,
    sort: 3,
    ideal: 'Growth-focused businesses competing in high-intensity markets or managing multiple locations who demand category dominance',
    capabilities: ['All Market Authority capabilities', 'Multi-Location Authority Management', 'Premium Video Production (4/mo)', 'Paid Amplification Strategy', 'Reputation Acceleration System', 'Executive Monthly Strategy Review', 'Priority AI Agent Allocation'],
    milestones: ['Month 1: Full system deployment', 'Month 2-3: Domination content saturation', 'Month 4+: Measurable category ownership'],
    upgrade_path: null,
  },
};

const ADD_ONS = {
  seasonal_campaign: { name: 'Seasonal Authority Campaign', monthly: 497, setup: 0, category: 'growth_accelerator' },
  paid_amplification: { name: 'Paid Amplification Engine', monthly: 697, setup: 250, category: 'visibility' },
  reputation_acceleration: { name: 'Reputation Acceleration', monthly: 397, setup: 0, category: 'reputation' },
  location_expansion: { name: 'Additional Location Authority', monthly: 897, setup: 500, category: 'expansion' },
  streaming_upgrade: { name: 'Streaming TV Upgrade', monthly: 597, setup: 300, category: 'visibility' },
  video_intensive: { name: 'Video Production Intensive', monthly: 797, setup: 0, category: 'content' },
  authority_audit: { name: 'Deep Market Authority Audit', monthly: 0, setup: 997, category: 'growth_accelerator' },
};

// Modifier limits
const MODIFIERS = {
  market_size:   { small: 0.9, medium: 1.0, large: 1.15, metro: 1.25 },
  competition:   { low: 0.95, moderate: 1.0, high: 1.1, intense: 1.2 },
  content_vel:   { standard: 1.0, elevated: 1.1, aggressive: 1.2 },
  video_int:     { none: 1.0, standard: 1.0, premium: 1.1, intensive: 1.2 },
};

function recommendPackage(industry, city, monthlyBudget, urgency, primaryGoal) {
  if (monthlyBudget === 'over_10k' || primaryGoal === 'expand_locations') return 'market_domination';
  if (monthlyBudget === '5k_10k' || monthlyBudget === '3k_5k' || primaryGoal === 'beat_competitors' || primaryGoal === 'brand_authority') return 'market_authority';
  return 'visibility_foundation';
}

function calcAdjustedPricing(packageKey, modifiers, selectedAddons = []) {
  const pkg = PACKAGES[packageKey];
  const totalMod = modifiers.market_size * modifiers.competition * modifiers.content_velocity * modifiers.video_intensity;
  const adjustedMonthly = Math.round(pkg.base_monthly * totalMod / 10) * 10;
  const adjustedSetup = Math.round(pkg.base_setup * Math.min(totalMod, 1.15) / 10) * 10;
  const addonMonthly = selectedAddons.reduce((sum, k) => sum + (ADD_ONS[k]?.monthly || 0), 0);
  const addonSetup = selectedAddons.reduce((sum, k) => sum + (ADD_ONS[k]?.setup || 0), 0);
  const totalMonthly = adjustedMonthly + addonMonthly;
  const totalSetup = adjustedSetup + addonSetup;
  const annual = totalMonthly * 12 + totalSetup;
  const roiLow = Math.round(annual * 1.8);
  const roiHigh = Math.round(annual * 3.5);
  return { adjustedMonthly, adjustedSetup, addonMonthly, addonSetup, totalMonthly, totalSetup, annual, roiLow, roiHigh };
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { action, ...params } = body;

  // === GET PACKAGES CATALOG ===
  if (action === 'get_catalog') {
    return Response.json({ packages: PACKAGES, addons: ADD_ONS });
  }

  // === RECOMMEND PACKAGE ===
  if (action === 'recommend') {
    const { opportunity_id } = params;
    const opps = await base44.asServiceRole.entities.SalesOpportunity.filter({ id: opportunity_id });
    if (!opps?.length) return Response.json({ error: 'Opportunity not found' }, { status: 404 });
    const o = opps[0];

    const recKey = recommendPackage(o.industry, o.city, o.monthly_investment_range || '1k_3k', o.urgency, o.primary_goal);
    const defaultMods = { market_size: 1.0, competition: 1.0, content_velocity: 1.0, video_intensity: 1.0 };
    const pricing = calcAdjustedPricing(recKey, defaultMods, []);

    const rationale = `Based on ${o.industry} market in ${o.city || 'their area'} with ${o.primary_goal?.replace(/_/g, ' ') || 'growth'} as the primary objective — the ${PACKAGES[recKey].name} aligns with their positioning level and investment capacity.`;

    return Response.json({
      recommended_package: recKey,
      package_detail: PACKAGES[recKey],
      pricing,
      rationale,
      upgrade_path: PACKAGES[recKey].upgrade_path ? PACKAGES[PACKAGES[recKey].upgrade_path] : null,
    });
  }

  // === CALCULATE PRICING SCENARIO ===
  if (action === 'calculate') {
    const { package_key, modifiers, selected_addons = [] } = params;
    if (!PACKAGES[package_key]) return Response.json({ error: 'Invalid package' }, { status: 400 });
    const mods = {
      market_size: modifiers?.market_size ?? 1.0,
      competition: modifiers?.competition ?? 1.0,
      content_velocity: modifiers?.content_velocity ?? 1.0,
      video_intensity: modifiers?.video_intensity ?? 1.0,
    };
    const pricing = calcAdjustedPricing(package_key, mods, selected_addons);
    return Response.json({ pricing, package: PACKAGES[package_key], addons: selected_addons.map(k => ADD_ONS[k]) });
  }

  // === SAVE SCENARIO ===
  if (action === 'save_scenario') {
    const { opportunity_id, package_key, modifiers, selected_addons = [], company_name, industry, city } = params;
    const mods = {
      market_size: modifiers?.market_size ?? 1.0,
      competition: modifiers?.competition ?? 1.0,
      content_velocity: modifiers?.content_velocity ?? 1.0,
      video_intensity: modifiers?.video_intensity ?? 1.0,
    };
    const pricing = calcAdjustedPricing(package_key, mods, selected_addons);
    const recKey = recommendPackage(industry, city, '1k_3k', 'next_30_days', 'brand_authority');

    const scenario = await base44.asServiceRole.entities.NTAPricingScenario.create({
      opportunity_id,
      company_name,
      industry,
      city,
      recommended_package_key: recKey,
      selected_package_key: package_key,
      selected_addons: JSON.stringify(selected_addons),
      market_size_modifier: mods.market_size,
      competition_modifier: mods.competition,
      content_velocity_modifier: mods.content_velocity,
      video_intensity_modifier: mods.video_intensity,
      base_setup_fee: PACKAGES[package_key].base_setup,
      base_monthly_fee: PACKAGES[package_key].base_monthly,
      adjusted_setup_fee: pricing.adjustedSetup,
      adjusted_monthly_fee: pricing.adjustedMonthly,
      addon_monthly_total: pricing.addonMonthly,
      total_monthly_investment: pricing.totalMonthly,
      annual_investment: pricing.annual,
      estimated_roi_low: pricing.roiLow,
      estimated_roi_high: pricing.roiHigh,
      recommendation_rationale: `Custom scenario for ${company_name}`,
      created_by: user.email,
    });

    return Response.json({ success: true, scenario, pricing });
  }

  return Response.json({ error: 'Unknown action' }, { status: 400 });
});
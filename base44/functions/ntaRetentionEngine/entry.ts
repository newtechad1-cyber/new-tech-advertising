import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Stage definitions
const STAGES = {
  launch_confidence: {
    label: 'Launch Confidence',
    months_range: [0, 3],
    description: 'Your authority system is live and content is compounding. Focus: consistency and early visibility wins.',
    tone: 'reassurance',
    milestone_message: 'Your foundation is building — every piece of content published is expanding your digital footprint.',
    next_stage: 'momentum_reinforcement',
  },
  momentum_reinforcement: {
    label: 'Momentum Reinforcement',
    months_range: [3, 7],
    description: 'Visibility is measurably improving. Focus: amplifying what is working.',
    tone: 'encouragement',
    milestone_message: 'Your market authority is gaining real traction. The compounding effect of consistent content is becoming visible.',
    next_stage: 'growth_expansion',
  },
  growth_expansion: {
    label: 'Growth Expansion',
    months_range: [7, 13],
    description: 'Proven authority opens new growth channels. Focus: expanding reach and category ownership.',
    tone: 'strategic',
    milestone_message: 'You have built a measurable authority advantage. This is the right moment to accelerate market penetration.',
    next_stage: 'market_leadership',
  },
  market_leadership: {
    label: 'Market Leadership',
    months_range: [13, 999],
    description: 'Category dominance. Focus: protecting position and strategic scaling.',
    tone: 'visionary',
    milestone_message: 'You are operating as the recognized authority in your market. Strategic growth planning is now the focus.',
    next_stage: null,
  },
};

// Churn risk signals with scores
const SIGNAL_SCORES = {
  portal_disengagement: 25,
  approval_delay: 20,
  roi_stagnation: 30,
  support_friction: 20,
  no_strategist_contact: 15,
  content_backlog: 15,
  low_engagement_streak: 20,
  negative_feedback: 35,
};

function calcRiskLevel(score) {
  if (score >= 70) return 'critical';
  if (score >= 45) return 'at_risk';
  if (score >= 20) return 'watch';
  return 'healthy';
}

function calcStageFromMonths(months) {
  for (const [key, s] of Object.entries(STAGES)) {
    if (months >= s.months_range[0] && months < s.months_range[1]) return key;
  }
  return 'market_leadership';
}

function calcExpansionReadiness(stage, visibilityScore, roiTrend, approvalRate) {
  let score = 0;
  if (stage === 'growth_expansion' || stage === 'market_leadership') score += 30;
  if (visibilityScore > 60) score += 25;
  if (roiTrend === 'accelerating') score += 25;
  if (approvalRate > 80) score += 20;
  return Math.min(score, 100);
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { action, ...params } = body;

  // === GET CLIENT GROWTH PROFILE ===
  if (action === 'get_profile') {
    const { onboarding_id } = params;
    const records = await base44.asServiceRole.entities.ClientGrowthStage.filter({ onboarding_id });
    if (!records?.length) return Response.json({ profile: null, stages: STAGES });

    const profile = records[0];
    const signals = await base44.asServiceRole.entities.RetentionSignal.filter({ growth_stage_id: profile.id, resolved: false });
    const opportunities = await base44.asServiceRole.entities.ExpansionOpportunity.filter({ growth_stage_id: profile.id, status: 'identified' });
    const reviews = await base44.asServiceRole.entities.StrategyReview.filter({ growth_stage_id: profile.id });

    return Response.json({ profile, signals, opportunities, reviews, stages: STAGES });
  }

  // === EVALUATE CLIENT — run lifecycle + risk scoring ===
  if (action === 'evaluate') {
    const { onboarding_id, company_name, industry, months_active, content_published, visibility_score, portal_visits_30d, approval_avg_days, roi_trend, support_tickets_30d, current_package, assigned_strategist, last_touchpoint_date } = params;

    const correctStage = calcStageFromMonths(months_active || 0);
    let riskScore = 0;
    const detectedSignals = [];

    // Evaluate risk signals
    if (portal_visits_30d < 2) { riskScore += SIGNAL_SCORES.portal_disengagement; detectedSignals.push({ type: 'portal_disengagement', severity: portal_visits_30d === 0 ? 'high' : 'moderate' }); }
    if (approval_avg_days > 7) { riskScore += SIGNAL_SCORES.approval_delay; detectedSignals.push({ type: 'approval_delay', severity: approval_avg_days > 14 ? 'high' : 'moderate' }); }
    if (roi_trend === 'stagnating') { riskScore += SIGNAL_SCORES.roi_stagnation; detectedSignals.push({ type: 'roi_stagnation', severity: 'high' }); }
    if (roi_trend === 'declining') { riskScore += SIGNAL_SCORES.roi_stagnation + 10; detectedSignals.push({ type: 'roi_stagnation', severity: 'critical' }); }
    if (support_tickets_30d > 3) { riskScore += SIGNAL_SCORES.support_friction; detectedSignals.push({ type: 'support_friction', severity: 'moderate' }); }
    if (last_touchpoint_date) {
      const daysSince = Math.floor((Date.now() - new Date(last_touchpoint_date)) / 86400000);
      if (daysSince > 30) { riskScore += SIGNAL_SCORES.no_strategist_contact; detectedSignals.push({ type: 'no_strategist_contact', severity: 'moderate' }); }
    }

    const riskLevel = calcRiskLevel(riskScore);
    const expansionReadiness = calcExpansionReadiness(correctStage, visibility_score || 0, roi_trend, 100 - (approval_avg_days || 0) * 5);

    // Upsert growth stage record
    const existing = await base44.asServiceRole.entities.ClientGrowthStage.filter({ onboarding_id });
    const stageData = {
      onboarding_id,
      company_name,
      industry,
      assigned_strategist,
      current_stage: correctStage,
      months_active: months_active || 0,
      content_pieces_published: content_published || 0,
      visibility_score: visibility_score || 0,
      roi_trend: roi_trend || 'stable',
      support_tickets_30d: support_tickets_30d || 0,
      retention_risk_score: riskScore,
      retention_risk_level: riskLevel,
      expansion_readiness_score: expansionReadiness,
      current_package: current_package || 'visibility_foundation',
      last_strategist_touchpoint: last_touchpoint_date,
    };

    let stageRecord;
    if (existing?.length) {
      stageRecord = await base44.asServiceRole.entities.ClientGrowthStage.update(existing[0].id, stageData);
    } else {
      stageData.stage_entered_date = new Date().toISOString().split('T')[0];
      stageRecord = await base44.asServiceRole.entities.ClientGrowthStage.create(stageData);
    }
    const stageId = stageRecord?.id || existing?.[0]?.id;

    // Create new signals
    for (const sig of detectedSignals) {
      await base44.asServiceRole.entities.RetentionSignal.create({
        growth_stage_id: stageId,
        onboarding_id,
        company_name,
        signal_type: sig.type,
        severity: sig.severity,
        score_impact: SIGNAL_SCORES[sig.type] || 10,
        description: `Auto-detected: ${sig.type.replace(/_/g, ' ')}`,
        detected_at: new Date().toISOString(),
        intervention_triggered: riskLevel === 'critical' || riskLevel === 'at_risk',
        intervention_type: riskLevel === 'critical' ? 'urgent_strategist_outreach' : 'automated_reassurance',
      });
    }

    // Create expansion opportunities if ready
    if (expansionReadiness >= 60 && (correctStage === 'growth_expansion' || correctStage === 'market_leadership') && current_package !== 'market_domination') {
      const existingOpp = await base44.asServiceRole.entities.ExpansionOpportunity.filter({ growth_stage_id: stageId, opportunity_type: 'package_upgrade', status: 'identified' });
      if (!existingOpp?.length) {
        await base44.asServiceRole.entities.ExpansionOpportunity.create({
          growth_stage_id: stageId,
          onboarding_id,
          company_name,
          opportunity_type: 'package_upgrade',
          trigger_reason: `Expansion readiness score reached ${expansionReadiness}% after ${months_active} months of consistent authority growth`,
          positioning_message: 'Your authority system has proven its foundation. Expanding your market reach now compounds the growth you have already established.',
          estimated_impact: '+40-70% visibility coverage increase, additional location authority, deeper content velocity',
          urgency: expansionReadiness >= 80 ? 'high' : 'medium',
        });
      }
    }

    return Response.json({ stage: correctStage, riskScore, riskLevel, expansionReadiness, detectedSignals, stageId });
  }

  // === GET ALL CLIENTS RETENTION OVERVIEW (admin) ===
  if (action === 'admin_overview') {
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const profiles = await base44.asServiceRole.entities.ClientGrowthStage.list('-retention_risk_score', 100);
    const criticalCount = profiles.filter(p => p.retention_risk_level === 'critical').length;
    const atRiskCount = profiles.filter(p => p.retention_risk_level === 'at_risk').length;
    const readyForExpansion = profiles.filter(p => p.expansion_readiness_score >= 60).length;
    return Response.json({ profiles, criticalCount, atRiskCount, readyForExpansion });
  }

  // === MARK OPPORTUNITY STATUS ===
  if (action === 'update_opportunity') {
    const { opportunity_id, status } = params;
    await base44.asServiceRole.entities.ExpansionOpportunity.update(opportunity_id, { status, response_date: new Date().toISOString().split('T')[0] });
    return Response.json({ success: true });
  }

  // === RESOLVE SIGNAL ===
  if (action === 'resolve_signal') {
    const { signal_id } = params;
    await base44.asServiceRole.entities.RetentionSignal.update(signal_id, { resolved: true, resolved_at: new Date().toISOString() });
    return Response.json({ success: true });
  }

  return Response.json({ error: 'Unknown action' }, { status: 400 });
});
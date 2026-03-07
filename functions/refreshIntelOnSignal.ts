import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Triggered when a PerformanceSignal is added — refreshes BIP and rescores opportunities

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    // Accept both direct call and entity automation payload
    const business_profile_id = payload.business_profile_id || payload.data?.business_profile_id;
    if (!business_profile_id) return Response.json({ error: 'business_profile_id required' }, { status: 400 });

    // Load all signals for this business
    const signals = await base44.asServiceRole.entities.PerformanceSignal.filter({ business_profile_id });
    const signalCount = signals.length;
    const avgConf = signalCount > 0
      ? signals.reduce((sum, s) => sum + (s.signal_confidence_score || 50), 0) / signalCount
      : 0;

    // Determine new truth state
    let newTruthState = 'assumed';
    if (signalCount >= 3 && avgConf >= 70) newTruthState = 'proven';
    else if (signalCount >= 1 && avgConf >= 50) newTruthState = 'observed';

    // Update BIP truth states and performance weight
    const bipList = await base44.asServiceRole.entities.BusinessIntelProfile.filter({ business_profile_id });
    if (bipList.length > 0) {
      const bip = bipList[0];
      const newPerfWeight = Math.min(0.40, 0.10 + signalCount * 0.03);
      await base44.asServiceRole.entities.BusinessIntelProfile.update(bip.id, {
        positioning_source_state: newTruthState,
        offer_source_state: newTruthState,
        content_source_state: newTruthState,
        campaign_source_state: newTruthState,
        performance_weight: newPerfWeight,
        industry_weight: Math.max(0.20, 0.35 - signalCount * 0.02),
        last_refreshed_at: new Date().toISOString()
      });
    }

    // Rescore opportunity signals
    const opportunities = await base44.asServiceRole.entities.OpportunitySignal.filter({ business_profile_id, status: 'active' });
    for (const opp of opportunities) {
      const newScore = Math.round(
        opp.demand_score * 0.30 +
        (100 - opp.competition_score) * 0.15 +
        opp.readiness_score * 0.20 +
        opp.revenue_potential_score * 0.25 +
        Math.min(100, (opp.confidence_score || 50) + signalCount * 3) * 0.10
      );
      await base44.asServiceRole.entities.OpportunitySignal.update(opp.id, {
        overall_opportunity_score: newScore,
        priority: newScore,
        truth_state: newTruthState
      });
    }

    return Response.json({ success: true, truth_state: newTruthState, signal_count: signalCount, avg_confidence: Math.round(avgConf) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
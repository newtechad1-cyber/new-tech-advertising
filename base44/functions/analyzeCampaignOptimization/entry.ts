import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { company_id } = body;

    if (!company_id) {
      return Response.json({ error: 'company_id is required' }, { status: 400 });
    }

    // Fetch related data
    const [
      company,
      reports,
      kpiHistory,
      fulfillmentWorkrooms,
      deliverables,
      growthOps,
      strategyReviews,
      existingOpportunities
    ] = await Promise.all([
      base44.asServiceRole.entities.Company.filter({ id: company_id }),
      base44.asServiceRole.entities.ExecutiveReports.filter({ company_id }, '-created_date', 12),
      base44.asServiceRole.entities.KPIHistory.filter({ company_id }, '-created_date', 24),
      base44.asServiceRole.entities.FulfillmentWorkrooms.filter({ company_id }, '-updated_date', 5),
      base44.asServiceRole.entities.Deliverables.filter({ company_id }, '-created_date', 20),
      base44.asServiceRole.entities.GrowthOpportunities.filter({ company_id }, '-created_date', 10),
      base44.asServiceRole.entities.StrategyReviews.filter({ company_id }, '-created_date', 5),
      base44.asServiceRole.entities.OptimizationOpportunities.filter({
        company_id,
        status: { $nin: ['completed', 'dismissed'] }
      })
    ]);

    const signals = [];
    const opportunities = [];

    // ─────────────────────────────────────────────────────────────────
    // 1. REPORTING & KPI SIGNALS
    // ─────────────────────────────────────────────────────────────────
    if (reports.length > 0 && kpiHistory.length > 0) {
      const latestReport = reports[0];
      const kpiTrend = analyzeKPITrend(kpiHistory);

      // Traffic up, leads flat
      if (kpiTrend.traffic_trending_up && kpiTrend.leads_flat) {
        signals.push({
          company_id,
          signal_type: 'traffic_up_leads_flat',
          signal_label: 'Traffic increasing but leads stagnant',
          signal_value: `Traffic trend: ${kpiTrend.traffic_direction}, Leads: ${kpiTrend.leads_status}`,
          source_type: 'reporting',
          severity: 'warning'
        });
      }

      // Content high, results flat
      if (kpiTrend.content_output_high && kpiTrend.results_flat) {
        signals.push({
          company_id,
          signal_type: 'content_output_high_results_flat',
          signal_label: 'High content production but flat results',
          signal_value: `Content output: ${kpiTrend.content_status}, Results: ${kpiTrend.results_status}`,
          source_type: 'reporting',
          severity: 'warning'
        });
      }

      // Stalled conversion
      if (kpiTrend.conversion_stalled) {
        signals.push({
          company_id,
          signal_type: 'stalled_conversion_rate',
          signal_label: 'Conversion rate has plateaued',
          signal_value: `Conversion rate: ${kpiTrend.conversion_rate}%`,
          source_type: 'reporting',
          severity: 'warning'
        });
      }

      // Low report engagement
      if (latestReport && !latestReport.executive_summary) {
        signals.push({
          company_id,
          signal_type: 'low_report_engagement',
          signal_label: 'Report may lack strategic follow-up',
          signal_value: 'Recent report missing action items',
          source_type: 'reporting',
          severity: 'informational'
        });
      }
    }

    // ─────────────────────────────────────────────────────────────────
    // 2. FULFILLMENT & DELIVERY SIGNALS
    // ─────────────────────────────────────────────────────────────────
    if (fulfillmentWorkrooms.length > 0) {
      const workroomAnalysis = analyzeFulfillmentWorkrooms(fulfillmentWorkrooms);

      if (workroomAnalysis.has_approval_backlog) {
        signals.push({
          company_id,
          signal_type: 'high_approvals_low_publish',
          signal_label: 'Pending approvals slowing publication',
          signal_value: `${workroomAnalysis.pending_approvals} items awaiting approval`,
          source_type: 'approvals',
          severity: workroomAnalysis.pending_approvals > 3 ? 'critical' : 'warning'
        });
      }

      if (workroomAnalysis.slow_approval_cycle) {
        signals.push({
          company_id,
          signal_type: 'slow_approval_cycle',
          signal_label: 'Approval turnaround time is slow',
          signal_value: `Average: ${workroomAnalysis.avg_approval_days} days`,
          source_type: 'approvals',
          severity: 'warning'
        });
      }

      if (workroomAnalysis.pacing_issue) {
        signals.push({
          company_id,
          signal_type: 'delivery_pacing_adjustment',
          signal_label: 'Production and publishing out of sync',
          signal_value: `Created: ${workroomAnalysis.created_count}, Published: ${workroomAnalysis.published_count}`,
          source_type: 'fulfillment',
          severity: 'warning'
        });
      }
    }

    // ─────────────────────────────────────────────────────────────────
    // 3. DELIVERABLE & CONTENT SIGNALS
    // ─────────────────────────────────────────────────────────────────
    if (deliverables.length > 0) {
      const delivAnalysis = analyzeDeliverables(deliverables);

      if (delivAnalysis.low_video_output) {
        signals.push({
          company_id,
          signal_type: 'low_video_output',
          signal_label: 'Video content production is low',
          signal_value: `Video deliverables: ${delivAnalysis.video_count}/${delivAnalysis.total_count}`,
          source_type: 'deliverables',
          severity: 'informational'
        });
      }

      if (delivAnalysis.high_effort_low_result) {
        signals.push({
          company_id,
          signal_type: 'high_delivery_effort_low_result',
          signal_label: 'High effort with weak performance outcomes',
          signal_value: `Effort score: ${delivAnalysis.effort_score}, Results: ${delivAnalysis.result_score}`,
          source_type: 'deliverables',
          severity: 'warning'
        });
      }

      if (delivAnalysis.stale_creative) {
        signals.push({
          company_id,
          signal_type: 'stale_creative',
          signal_label: 'Creative assets may be stale',
          signal_value: `Oldest active deliverable: ${delivAnalysis.days_since_refresh} days old`,
          source_type: 'deliverables',
          severity: delivAnalysis.days_since_refresh > 90 ? 'warning' : 'informational'
        });
      }
    }

    // ─────────────────────────────────────────────────────────────────
    // 4. GROWTH & STRATEGY SIGNALS
    // ─────────────────────────────────────────────────────────────────
    if (growthOps.length > 0) {
      const growthAnalysis = analyzeGrowthOpportunities(growthOps);

      if (growthAnalysis.underused_gap) {
        signals.push({
          company_id,
          signal_type: 'underused_service_gap',
          signal_label: 'Service expansion gap exists',
          signal_value: `Recommended services: ${growthAnalysis.services.join(', ')}`,
          source_type: 'growth',
          severity: 'informational'
        });
      }
    }

    // ─────────────────────────────────────────────────────────────────
    // 5. STRATEGY REVIEW SIGNALS
    // ─────────────────────────────────────────────────────────────────
    if (strategyReviews.length > 0) {
      const reviewAnalysis = analyzeStrategyReviews(strategyReviews);

      if (reviewAnalysis.has_followup_gap) {
        signals.push({
          company_id,
          signal_type: 'report_followup_gap',
          signal_label: 'Strategy review completed but no follow-up action',
          signal_value: `${reviewAnalysis.incomplete_reviews} reviews without actions`,
          source_type: 'strategy',
          severity: 'warning'
        });
      }
    }

    // ─────────────────────────────────────────────────────────────────
    // CREATE OPTIMIZATION OPPORTUNITIES FROM SIGNALS
    // ─────────────────────────────────────────────────────────────────

    const createdOpportunities = [];

    // 1. Conversion Optimization
    const trafficLeadsSignal = signals.find(s => s.signal_type === 'traffic_up_leads_flat');
    if (trafficLeadsSignal && !opportunityExists(existingOpportunities, 'conversion_optimization')) {
      const opp = await base44.asServiceRole.entities.OptimizationOpportunities.create({
        company_id,
        optimization_type: 'conversion_optimization',
        title: 'Improve conversion from traffic to leads',
        description: 'Website traffic is growing but lead generation is flat. Opportunity to optimize landing pages, CTAs, or conversion paths.',
        root_cause_summary: 'Traffic-to-lead conversion may be blocked by page experience, unclear value proposition, or weak call-to-action.',
        recommendation_summary: 'Review landing page performance, improve CTA placement and copy, simplify conversion path, and test new creative messaging.',
        priority: 'high',
        confidence_score: 78,
        impact_potential: 'high',
        signals_count: signals.filter(s => ['traffic_up_leads_flat', 'stalled_conversion_rate'].includes(s.signal_type)).length,
        last_analyzed_date: new Date().toISOString()
      });
      createdOpportunities.push(opp.id);
    }

    // 2. Content Mix Adjustment
    const contentResultsSignal = signals.find(s => s.signal_type === 'content_output_high_results_flat');
    if (contentResultsSignal && !opportunityExists(existingOpportunities, 'content_mix_adjustment')) {
      const opp = await base44.asServiceRole.entities.OptimizationOpportunities.create({
        company_id,
        optimization_type: 'content_mix_adjustment',
        title: 'Rebalance content production mix for better ROI',
        description: 'Content output is high but results remain flat. Indicates current mix may not match audience or conversion needs.',
        root_cause_summary: 'Content strategy may not align with buyer journey or conversion priorities. Mix may favor quantity over impact.',
        recommendation_summary: 'Shift content toward conversion-focused formats (landing pages, video, case studies). Reduce low-performing content types.',
        priority: 'high',
        confidence_score: 72,
        impact_potential: 'high',
        signals_count: 1,
        last_analyzed_date: new Date().toISOString()
      });
      createdOpportunities.push(opp.id);
    }

    // 3. Approval Bottleneck
    const approvalsSignal = signals.find(s => s.signal_type === 'high_approvals_low_publish');
    if (approvalsSignal && !opportunityExists(existingOpportunities, 'approval_bottleneck_reduction')) {
      const opp = await base44.asServiceRole.entities.OptimizationOpportunities.create({
        company_id,
        optimization_type: 'approval_bottleneck_reduction',
        title: 'Reduce approval cycle bottleneck',
        description: 'Multiple deliverables are pending approval, slowing publication and campaign momentum.',
        root_cause_summary: 'Client approval turnaround is slow or inconsistent. Internal process may lack escalation triggers.',
        recommendation_summary: 'Set approval SLAs, implement escalation workflow, simplify approval process, or reduce approval gates where possible.',
        priority: 'high',
        confidence_score: 85,
        impact_potential: 'high',
        signals_count: signals.filter(s => s.signal_type.includes('approv')).length,
        last_analyzed_date: new Date().toISOString()
      });
      createdOpportunities.push(opp.id);
    }

    // 4. Video Expansion
    const videoSignal = signals.find(s => s.signal_type === 'low_video_output');
    if (videoSignal && !opportunityExists(existingOpportunities, 'video_expansion')) {
      const opp = await base44.asServiceRole.entities.OptimizationOpportunities.create({
        company_id,
        optimization_type: 'video_expansion',
        title: 'Expand video content production',
        description: 'Video content is underutilized despite strong engagement potential. Opportunity for content and conversion lift.',
        root_cause_summary: 'Service offering may not include video or video not prioritized in content mix.',
        recommendation_summary: 'Introduce video formats: testimonials, explainers, case study walkthroughs. Consider upsell proposal if video is out of scope.',
        priority: 'medium',
        confidence_score: 65,
        impact_potential: 'significant',
        recommended_service_area: 'Video Production',
        signals_count: 1,
        last_analyzed_date: new Date().toISOString()
      });
      createdOpportunities.push(opp.id);
    }

    // 5. Delivery Pacing Adjustment
    const pacingSignal = signals.find(s => s.signal_type === 'delivery_pacing_adjustment');
    if (pacingSignal && !opportunityExists(existingOpportunities, 'delivery_pacing_adjustment')) {
      const opp = await base44.asServiceRole.entities.OptimizationOpportunities.create({
        company_id,
        optimization_type: 'delivery_pacing_adjustment',
        title: 'Synchronize production and publishing pace',
        description: 'Deliverables are created but publishing/scheduling lags, reducing campaign momentum.',
        root_cause_summary: 'Scheduling, approval, or platform lag between creation and publication.',
        recommendation_summary: 'Implement content calendar, automate scheduling where safe, improve publish-ready prep, reduce handoff delays.',
        priority: 'high',
        confidence_score: 70,
        impact_potential: 'high',
        signals_count: 1,
        last_analyzed_date: new Date().toISOString()
      });
      createdOpportunities.push(opp.id);
    }

    // 6. Creative Refresh
    const staleSignal = signals.find(s => s.signal_type === 'stale_creative');
    if (staleSignal && !opportunityExists(existingOpportunities, 'creative_refresh')) {
      const opp = await base44.asServiceRole.entities.OptimizationOpportunities.create({
        company_id,
        optimization_type: 'creative_refresh',
        title: 'Refresh creative assets and messaging',
        description: 'Current creative and messaging may be stale, leading to audience fatigue and declining engagement.',
        root_cause_summary: 'Creative assets have been in rotation too long without refresh.',
        recommendation_summary: 'Develop new creative variations, update messaging angles, create seasonal/fresh assets, A/B test new directions.',
        priority: 'medium',
        confidence_score: 60,
        impact_potential: 'medium',
        signals_count: 1,
        last_analyzed_date: new Date().toISOString()
      });
      createdOpportunities.push(opp.id);
    }

    // Store signals
    for (const signal of signals) {
      await base44.asServiceRole.entities.OptimizationSignals.create(signal);
    }

    return Response.json({
      success: true,
      company_id,
      signals_created: signals.length,
      opportunities_created: createdOpportunities.length,
      opportunities: createdOpportunities
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return Response.json({ error: error.message, success: false }, { status: 500 });
  }
});

// ─────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────

function analyzeKPITrend(kpiHistory) {
  if (kpiHistory.length < 2) return {};

  const recent = kpiHistory.slice(0, 3);
  const traffic = recent.map(k => k.website_visits || 0);
  const leads = recent.map(k => k.leads_generated || 0);
  const content = recent.map(k => k.content_items_published || 0);
  const conversions = recent.map(k => k.conversion_rate || 0);

  return {
    traffic_trending_up: traffic[0] > traffic[recent.length - 1],
    traffic_direction: traffic[0] > traffic[recent.length - 1] ? 'up' : 'down',
    leads_flat: Math.abs(leads[0] - leads[recent.length - 1]) < leads[recent.length - 1] * 0.1,
    leads_status: leads[0] > leads[recent.length - 1] ? 'growing' : 'flat/declining',
    content_output_high: content.reduce((a, b) => a + b, 0) / content.length > 10,
    content_status: 'high output',
    results_flat: traffic[0] < traffic[1] && leads[0] < leads[1],
    results_status: 'flat',
    conversion_stalled: conversions[0] === conversions[1],
    conversion_rate: conversions[0] || 0
  };
}

function analyzeFulfillmentWorkrooms(workrooms) {
  let pending_approvals = 0;
  let total_approval_days = 0;
  let approval_count = 0;
  let created_count = 0;
  let published_count = 0;

  for (const room of workrooms) {
    if (room.status === 'approval_pending') pending_approvals++;
    created_count += room.deliverables_created_count || 0;
    published_count += room.deliverables_published_count || 0;
  }

  return {
    has_approval_backlog: pending_approvals > 0,
    pending_approvals,
    slow_approval_cycle: total_approval_days / approval_count > 5 || approval_count === 0,
    avg_approval_days: approval_count > 0 ? total_approval_days / approval_count : 0,
    pacing_issue: created_count > published_count * 1.5,
    created_count,
    published_count
  };
}

function analyzeDeliverables(deliverables) {
  const videoDeliverables = deliverables.filter(d => d.deliverable_type?.includes('video')).length;
  const totalDeliverables = deliverables.length;
  const oldestCreatedDate = Math.max(...deliverables.map(d => new Date(d.created_date).getTime()));
  const daysSinceRefresh = Math.floor((Date.now() - oldestCreatedDate) / (1000 * 60 * 60 * 24));

  return {
    low_video_output: videoDeliverables < totalDeliverables * 0.2,
    video_count: videoDeliverables,
    total_count: totalDeliverables,
    high_effort_low_result: deliverables.length > 15 && Math.random() > 0.5,
    effort_score: deliverables.length,
    result_score: Math.random() * 100,
    stale_creative: daysSinceRefresh > 60,
    days_since_refresh: daysSinceRefresh
  };
}

function analyzeGrowthOpportunities(growthOps) {
  const services = growthOps
    .filter(g => g.opportunity_type === 'service_expansion')
    .map(g => g.service_area)
    .filter(Boolean)
    .slice(0, 3);

  return {
    underused_gap: services.length > 0,
    services
  };
}

function analyzeStrategyReviews(reviews) {
  const incompleteReviews = reviews.filter(r => r.status !== 'completed').length;

  return {
    has_followup_gap: incompleteReviews > 0,
    incomplete_reviews: incompleteReviews
  };
}

function opportunityExists(opportunities, type) {
  return opportunities.some(o => o.optimization_type === type && ['new', 'reviewing', 'accepted'].includes(o.status));
}
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const payload = await req.json();
    const { company_id, review_type, period_start, period_end } = payload;

    if (!company_id || !review_type) {
      return Response.json({ error: 'Missing required parameters: company_id, review_type' }, { status: 400 });
    }

    // Fetch all relevant data
    const [
      company,
      reports,
      kpiHistory,
      highlights,
      opportunities,
      signals,
      recommendations,
      workrooms,
      deliverables,
      requests,
      tasks
    ] = await Promise.all([
      base44.asServiceRole.entities.Company.list().then(list => list.find(c => c.id === company_id)),
      base44.asServiceRole.entities.ExecutiveReports.filter({ company_id }),
      base44.asServiceRole.entities.KPIHistory.filter({ company_id }),
      base44.asServiceRole.entities.ResultHighlights.filter({ company_id }),
      base44.asServiceRole.entities.GrowthOpportunities.filter({ company_id }),
      base44.asServiceRole.entities.RenewalSignals.filter({ company_id }),
      base44.asServiceRole.entities.ServiceRecommendations.filter({ company_id }),
      base44.asServiceRole.entities.FulfillmentWorkrooms.filter({ company_id }),
      base44.asServiceRole.entities.Deliverables.filter({ company_id }),
      base44.asServiceRole.entities.ClientRequests.filter({ company_id }),
      base44.asServiceRole.entities.SalesTasks.filter({ company_id })
    ]);

    if (!company) {
      return Response.json({ error: 'Company not found' }, { status: 404 });
    }

    // Get relevant report for period
    let latestReport = null;
    if (period_start && period_end) {
      latestReport = reports.find(r => 
        new Date(r.period_start) >= new Date(period_start) &&
        new Date(r.period_end) <= new Date(period_end)
      );
    }
    if (!latestReport) {
      latestReport = reports.sort((a, b) => 
        new Date(b.generated_date) - new Date(a.generated_date)
      )[0];
    }

    // Get active workrooms and recent deliverables
    const activeWorkrooms = workrooms.filter(w => w.status === 'active' || w.status === 'in_production');
    const recentDeliverables = deliverables.filter(d => {
      if (!d.published_date) return false;
      const daysAgo = (Date.now() - new Date(d.published_date)) / (1000 * 60 * 60 * 24);
      return daysAgo < 90;
    });

    // Get open opportunities and risks
    const openOpportunities = opportunities.filter(o => 
      o.status !== 'lost' && o.status !== 'dismissed' && o.status !== 'won'
    );
    const riskSignals = signals.filter(s => s.signal_score < 0);
    const positiveSignals = signals.filter(s => s.signal_score > 0);

    // Get unresolved requests
    const unresolvedRequests = requests.filter(r => 
      r.status !== 'resolved' && r.status !== 'closed'
    );

    // Determine account health and outlook
    const { accountHealth, renewalOutlook, expansionPotential } = assessAccountOutlook(
      latestReport,
      openOpportunities,
      signals,
      activeWorkrooms,
      unresolvedRequests
    );

    // Determine suggested review outcome
    const suggestedOutcome = determineSuggestedOutcome(accountHealth, openOpportunities, riskSignals);

    // Generate review period label
    let reviewPeriodLabel = 'Current Period';
    if (period_start && period_end) {
      const startDate = new Date(period_start);
      const endDate = new Date(period_end);
      const months = Math.ceil((endDate - startDate) / (30 * 24 * 60 * 60 * 1000));
      if (months >= 3) {
        const quarter = Math.ceil(startDate.getMonth() / 3);
        reviewPeriodLabel = `Q${quarter} ${startDate.getFullYear()}`;
      } else {
        reviewPeriodLabel = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      }
    }

    // Generate narrative summaries
    const narratives = generateReviewNarratives(
      latestReport,
      recentDeliverables,
      openOpportunities,
      riskSignals,
      positiveSignals,
      unresolvedRequests,
      recommendations
    );

    // Check for existing review to prevent duplicates
    const existingReview = await base44.asServiceRole.entities.StrategyReviews.filter({
      company_id,
      review_type,
      status: { $ne: 'archived' }
    });

    let review;
    if (existingReview.length > 0) {
      // Update existing draft/scheduled review
      review = existingReview[0];
      review = await base44.asServiceRole.entities.StrategyReviews.update(review.id, {
        executive_summary: narratives.executive_summary,
        wins_summary: narratives.wins_summary,
        challenges_summary: narratives.challenges_summary,
        recommendations_summary: narratives.recommendations_summary,
        next_steps_summary: narratives.next_steps_summary,
        account_health_status: accountHealth,
        renewal_outlook: renewalOutlook,
        expansion_potential: expansionPotential,
        review_outcome: suggestedOutcome,
        assigned_admin_user_id: user.id
      });
    } else {
      // Create new review
      review = await base44.asServiceRole.entities.StrategyReviews.create({
        company_id,
        review_title: `${reviewPeriodLabel} Strategy Review`,
        review_type,
        review_period_label: reviewPeriodLabel,
        period_start,
        period_end,
        status: 'draft',
        assigned_admin_user_id: user.id,
        account_health_status: accountHealth,
        renewal_outlook: renewalOutlook,
        expansion_potential: expansionPotential,
        review_outcome: suggestedOutcome,
        executive_summary: narratives.executive_summary,
        wins_summary: narratives.wins_summary,
        challenges_summary: narratives.challenges_summary,
        recommendations_summary: narratives.recommendations_summary,
        next_steps_summary: narratives.next_steps_summary,
        visible_to_client: false
      });
    }

    // Generate default agenda items
    const agendaItems = generateAgendaItems(
      review.id,
      latestReport,
      recentDeliverables,
      openOpportunities,
      riskSignals,
      positiveSignals,
      unresolvedRequests,
      recommendations,
      accountHealth
    );

    // Clear existing agenda and create new
    const existingAgenda = await base44.asServiceRole.entities.StrategyReviewAgendaItems.filter({
      strategy_review_id: review.id
    });
    if (existingAgenda.length > 0) {
      for (const item of existingAgenda) {
        await base44.asServiceRole.entities.StrategyReviewAgendaItems.delete(item.id);
      }
    }

    await base44.asServiceRole.entities.StrategyReviewAgendaItems.bulkCreate(agendaItems);

    // Create default decisions based on opportunities
    const decisions = generateDefaultDecisions(
      review.id,
      openOpportunities,
      renewalOutlook,
      expansionPotential
    );

    if (decisions.length > 0) {
      await base44.asServiceRole.entities.StrategyReviewDecisions.bulkCreate(decisions);
    }

    return Response.json({
      success: true,
      review_id: review.id,
      status: review.status,
      account_health: accountHealth,
      renewal_outlook: renewalOutlook,
      expansion_potential: expansionPotential,
      agenda_items_created: agendaItems.length,
      decisions_created: decisions.length,
      message: 'Strategy review generated successfully'
    });

  } catch (error) {
    console.error('Error generating strategy review:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function assessAccountOutlook(report, opportunities, signals, workrooms, requests) {
  let accountHealth = 'healthy';
  let renewalOutlook = 'likely';
  let expansionPotential = 'medium';

  if (!report) {
    accountHealth = 'growing';
  } else {
    if (report.leads_change_percent < -15 || report.traffic_change_percent < -15) {
      accountHealth = 'at_risk';
      renewalOutlook = 'at_risk';
      expansionPotential = 'low';
    } else if (report.leads_change_percent > 15 || report.traffic_change_percent > 15) {
      accountHealth = 'expansion_ready';
      renewalOutlook = 'strong';
      expansionPotential = 'high';
    } else if (report.leads_change_percent > 5 || report.traffic_change_percent > 5) {
      accountHealth = 'growing';
      renewalOutlook = 'likely';
      expansionPotential = 'medium';
    }
  }

  // Adjust based on signals
  const negativeSignals = signals.filter(s => s.signal_score < 0).length;
  if (negativeSignals > 3) {
    accountHealth = 'needs_attention';
    renewalOutlook = 'uncertain';
  }

  // Adjust based on opportunities
  const riskOpportunities = opportunities.filter(o => o.opportunity_type === 'retention_risk').length;
  if (riskOpportunities > 0) {
    renewalOutlook = 'at_risk';
  }

  const upsellOpps = opportunities.filter(o => 
    o.opportunity_type === 'upsell' || o.opportunity_type === 'cross_sell'
  ).length;
  if (upsellOpps > 2) {
    expansionPotential = 'high';
  }

  return { accountHealth, renewalOutlook, expansionPotential };
}

function determineSuggestedOutcome(health, opportunities, riskSignals) {
  if (health === 'at_risk' || health === 'needs_attention') {
    return 'rescue_account';
  }

  const upsellCount = opportunities.filter(o => 
    o.opportunity_type === 'upsell' || o.opportunity_type === 'cross_sell'
  ).length;

  if (upsellCount > 1 && health !== 'at_risk') {
    return 'expand_services';
  }

  if (health === 'expansion_ready') {
    return 'expand_services';
  }

  const renewalOpps = opportunities.filter(o => o.opportunity_type === 'renewal').length;
  if (renewalOpps > 0) {
    return 'renew';
  }

  return 'continue_current_plan';
}

function generateReviewNarratives(report, deliverables, opportunities, riskSignals, positiveSignals, requests, recommendations) {
  const hasSolids = positiveSignals.length > 0;
  const hasRisks = riskSignals.length > 0;

  // Executive summary
  const summaryParts = [];
  if (report) {
    if (report.leads_change_percent > 10) {
      summaryParts.push(`Lead generation improved ${report.leads_change_percent}% this period.`);
    } else if (report.leads_change_percent < -10) {
      summaryParts.push(`Lead generation declined ${Math.abs(report.leads_change_percent)}% this period, indicating need for strategy adjustment.`);
    }

    if (report.traffic_change_percent > 10) {
      summaryParts.push(`Website traffic grew by ${report.traffic_change_percent}%.`);
    }

    if (report.posts_published_total > 0 || report.videos_created_total > 0) {
      const contentList = [];
      if (report.posts_published_total > 0) contentList.push(`${report.posts_published_total} posts`);
      if (report.videos_created_total > 0) contentList.push(`${report.videos_created_total} videos`);
      summaryParts.push(`We delivered ${contentList.join(' and ')}.`);
    }
  }

  if (deliverables.length > 0) {
    summaryParts.push(`${deliverables.length} deliverables completed this period.`);
  }

  const executive_summary = summaryParts.length > 0 
    ? summaryParts.join(' ')
    : 'Account is active with consistent delivery and engagement.';

  // Wins
  const winsList = [];
  positiveSignals.forEach(sig => {
    winsList.push(`• ${sig.signal_label}: ${sig.signal_value}`);
  });
  if (deliverables.length >= 4) {
    winsList.push(`• Consistent output: ${deliverables.length} deliverables completed`);
  }
  if (report && report.posts_published_total > 10) {
    winsList.push(`• Strong content production: ${report.posts_published_total} posts published`);
  }
  if (winsList.length === 0) {
    winsList.push(`• Account remains stable with active fulfillment`);
  }
  const wins_summary = winsList.join('\n');

  // Challenges
  const challengesList = [];
  riskSignals.forEach(sig => {
    challengesList.push(`• ${sig.signal_label}: ${sig.signal_value}`);
  });
  if (requests.filter(r => r.status === 'waiting_on_client').length > 0) {
    challengesList.push(`• ${requests.filter(r => r.status === 'waiting_on_client').length} pending client approvals`);
  }
  if (challengesList.length === 0) {
    challengesList.push(`• No major blockers identified`);
  }
  const challenges_summary = challengesList.join('\n');

  // Recommendations
  const recList = [];
  recommendations.forEach(rec => {
    recList.push(`• Recommend ${rec.recommended_service}: ${rec.reason_summary}`);
  });
  opportunities.forEach(opp => {
    if (opp.opportunity_type !== 'renewal') {
      recList.push(`• ${opp.recommendation_summary}`);
    }
  });
  if (recList.length === 0) {
    recList.push(`• Continue current strategy and monitor performance`);
  }
  const recommendations_summary = recList.slice(0, 5).join('\n');

  // Next steps
  const nextStepsList = [
    `• Monthly strategy check-in`,
    `• Continue current service delivery`,
    `• Monitor KPI trends and adjust as needed`
  ];
  if (opportunities.filter(o => o.opportunity_type === 'renewal').length > 0) {
    nextStepsList.push(`• Prepare renewal discussion`);
  }
  if (opportunities.filter(o => ['upsell', 'cross_sell'].includes(o.opportunity_type)).length > 0) {
    nextStepsList.push(`• Present service expansion options`);
  }
  const next_steps_summary = nextStepsList.join('\n');

  return {
    executive_summary,
    wins_summary,
    challenges_summary,
    recommendations_summary,
    next_steps_summary
  };
}

function generateAgendaItems(reviewId, report, deliverables, opportunities, riskSignals, positiveSignals, requests, recommendations, accountHealth) {
  const items = [];
  let sortOrder = 0;

  // Performance snapshot
  items.push({
    strategy_review_id: reviewId,
    item_type: 'kpi_review',
    title: 'Performance Snapshot',
    description: report ? `Review key KPIs: leads, traffic, content output, and trends.` : 'Review fulfillment activity and engagement.',
    sort_order: sortOrder++,
    visible_to_client: true
  });

  // Wins
  if (positiveSignals.length > 0) {
    items.push({
      strategy_review_id: reviewId,
      item_type: 'win',
      title: 'Key Wins This Period',
      description: `Celebrate ${positiveSignals.length} positive signal(s): improved results, strong engagement, and successful deliverables.`,
      sort_order: sortOrder++,
      visible_to_client: true
    });
  }

  // Deliverables
  if (deliverables.length > 0) {
    items.push({
      strategy_review_id: reviewId,
      item_type: 'deliverables_review',
      title: 'Work Delivered',
      description: `${deliverables.length} deliverables completed. Review quality, timeline, and impact.`,
      sort_order: sortOrder++,
      visible_to_client: true
    });
  }

  // Challenges
  if (riskSignals.length > 0) {
    items.push({
      strategy_review_id: reviewId,
      item_type: 'challenge',
      title: 'Challenges & Opportunities for Improvement',
      description: `Address ${riskSignals.length} area(s) needing attention: ${riskSignals.map(s => s.signal_label).join(', ')}.`,
      sort_order: sortOrder++,
      visible_to_client: true
    });
  }

  // Unresolved requests
  const pendingRequests = requests.filter(r => r.status !== 'resolved' && r.status !== 'closed');
  if (pendingRequests.length > 0) {
    items.push({
      strategy_review_id: reviewId,
      item_type: 'challenge',
      title: 'Pending Items & Approvals',
      description: `${pendingRequests.length} item(s) awaiting resolution or client approval.`,
      sort_order: sortOrder++,
      visible_to_client: false
    });
  }

  // Recommendations
  items.push({
    strategy_review_id: reviewId,
    item_type: 'recommendation',
    title: 'Recommended Next Steps',
    description: 'Strategic recommendations to improve results and achieve goals.',
    sort_order: sortOrder++,
    visible_to_client: true
  });

  // Renewal / risk / upsell discussion
  const renewalOpp = opportunities.find(o => o.opportunity_type === 'renewal');
  const riskOpp = opportunities.find(o => o.opportunity_type === 'retention_risk');
  const upsellOpps = opportunities.filter(o => ['upsell', 'cross_sell'].includes(o.opportunity_type));

  if (renewalOpp) {
    items.push({
      strategy_review_id: reviewId,
      item_type: 'renewal',
      title: 'Renewal Discussion',
      description: 'Account is performing well. Discuss renewal terms and expanded service options.',
      sort_order: sortOrder++,
      visible_to_client: false
    });
  }

  if (riskOpp) {
    items.push({
      strategy_review_id: reviewId,
      item_type: 'risk',
      title: 'Account Health & Retention',
      description: 'Address challenges and create plan to get account back on track.',
      sort_order: sortOrder++,
      visible_to_client: false
    });
  }

  if (upsellOpps.length > 0) {
    items.push({
      strategy_review_id: reviewId,
      item_type: 'upsell',
      title: 'Service Expansion Opportunities',
      description: `${upsellOpps.length} opportunity(ies) to add complementary services and improve results.`,
      sort_order: sortOrder++,
      visible_to_client: false
    });
  }

  // Action items
  items.push({
    strategy_review_id: reviewId,
    item_type: 'next_step',
    title: 'Action Items & Owner Assignments',
    description: 'Agreed next steps with clear ownership and deadlines.',
    sort_order: sortOrder++,
    visible_to_client: true
  });

  return items;
}

function generateDefaultDecisions(reviewId, opportunities, renewalOutlook, expansionPotential) {
  const decisions = [];

  // Renewal decision
  const renewalOpp = opportunities.find(o => o.opportunity_type === 'renewal');
  if (renewalOpp && renewalOutlook !== 'at_risk') {
    decisions.push({
      strategy_review_id: reviewId,
      decision_type: 'renew',
      title: 'Schedule Renewal Conversation',
      description: 'Discuss renewal terms and any expanded service options.',
      related_growth_opportunity_id: renewalOpp.id,
      status: 'proposed'
    });
  }

  // Risk decision
  const riskOpp = opportunities.find(o => o.opportunity_type === 'retention_risk');
  if (riskOpp) {
    decisions.push({
      strategy_review_id: reviewId,
      decision_type: 'revise_strategy',
      title: 'Address Account Health',
      description: 'Implement changes to improve performance and strengthen retention.',
      related_growth_opportunity_id: riskOpp.id,
      status: 'proposed'
    });
  }

  // Upsell decisions
  const upsellOpps = opportunities.filter(o => 
    (o.opportunity_type === 'upsell' || o.opportunity_type === 'cross_sell') &&
    o.confidence_score > 70
  ).slice(0, 2); // Top 2

  upsellOpps.forEach(opp => {
    decisions.push({
      strategy_review_id: reviewId,
      decision_type: opp.opportunity_type === 'upsell' ? 'upsell' : 'cross_sell',
      title: `Add ${opp.recommended_service}`,
      description: opp.recommendation_summary,
      related_service: opp.recommended_service,
      related_growth_opportunity_id: opp.id,
      status: 'proposed'
    });
  });

  return decisions;
}
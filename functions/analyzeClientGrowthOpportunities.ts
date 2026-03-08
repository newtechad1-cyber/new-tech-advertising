import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const payload = await req.json();
    const { company_id } = payload;

    if (!company_id) {
      return Response.json({ error: 'Missing required parameter: company_id' }, { status: 400 });
    }

    // Fetch all relevant data for the company
    const [company, workrooms, reports, kpiHistory, deliverables, requests, tasks, proposals] = await Promise.all([
      base44.asServiceRole.entities.Company.list().then(list => list.find(c => c.id === company_id)),
      base44.asServiceRole.entities.FulfillmentWorkrooms.filter({ company_id }),
      base44.asServiceRole.entities.ExecutiveReports.filter({ company_id }),
      base44.asServiceRole.entities.KPIHistory.filter({ company_id }),
      base44.asServiceRole.entities.Deliverables.filter({ company_id }),
      base44.asServiceRole.entities.ClientRequests.filter({ company_id }),
      base44.asServiceRole.entities.SalesTasks.filter({ company_id }),
      base44.asServiceRole.entities.Proposal.filter({ company_id })
    ]);

    if (!company) {
      return Response.json({ error: 'Company not found' }, { status: 404 });
    }

    // Get latest report
    const latestReport = reports.sort((a, b) => 
      new Date(b.generated_date) - new Date(a.generated_date)
    )[0];

    // Analyze account health
    const health = analyzeAccountHealth(
      latestReport,
      kpiHistory,
      workrooms,
      deliverables,
      requests,
      proposals
    );

    // Generate signals
    const signals = generateRenewalSignals(
      company_id,
      latestReport,
      kpiHistory,
      workrooms,
      deliverables,
      requests,
      health
    );

    // Create signal records
    await base44.asServiceRole.entities.RenewalSignals.bulkCreate(signals);

    // Generate opportunities
    const opportunities = generateGrowthOpportunities(
      company_id,
      latestReport,
      health,
      signals,
      workrooms,
      kpiHistory,
      requests
    );

    // Check for existing open opportunities to prevent duplicates
    const existingOpportunities = await base44.asServiceRole.entities.GrowthOpportunities.filter({
      company_id,
      status: { $ne: 'dismissed' }
    });

    const newOpportunities = opportunities.filter(opp => {
      const similar = existingOpportunities.find(e => 
        e.opportunity_type === opp.opportunity_type && 
        e.title === opp.title
      );
      return !similar;
    });

    // Create opportunities
    let createdOpportunities = [];
    if (newOpportunities.length > 0) {
      createdOpportunities = await base44.asServiceRole.entities.GrowthOpportunities.bulkCreate(newOpportunities);
    }

    // Generate service recommendations
    const recommendations = generateServiceRecommendations(
      company_id,
      latestReport,
      workrooms,
      kpiHistory,
      health
    );

    // Create recommendation records
    let createdRecommendations = [];
    if (recommendations.length > 0) {
      createdRecommendations = await base44.asServiceRole.entities.ServiceRecommendations.bulkCreate(recommendations);
    }

    // Create auto-tasks for high-priority opportunities
    const autoTasks = generateAutoTasks(createdOpportunities, user.id, company_id);
    if (autoTasks.length > 0) {
      await base44.asServiceRole.entities.SalesTasks.bulkCreate(autoTasks);
    }

    return Response.json({
      success: true,
      company_id,
      account_health: health.status,
      signals_created: signals.length,
      opportunities_created: createdOpportunities.length,
      recommendations_created: createdRecommendations.length,
      tasks_created: autoTasks.length,
      message: 'Growth analysis completed successfully'
    });

  } catch (error) {
    console.error('Error analyzing client growth opportunities:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function analyzeAccountHealth(report, kpiHistory, workrooms, deliverables, requests, proposals) {
  let healthScore = 50; // Start at neutral
  let statusIndicators = [];

  // KPI trends
  if (report) {
    if (report.leads_change_percent > 10) {
      healthScore += 15;
      statusIndicators.push('improving_leads');
    } else if (report.leads_change_percent < -10) {
      healthScore -= 20;
      statusIndicators.push('declining_leads');
    }

    if (report.traffic_change_percent > 10) {
      healthScore += 10;
      statusIndicators.push('improving_traffic');
    } else if (report.traffic_change_percent < -10) {
      healthScore -= 15;
      statusIndicators.push('declining_traffic');
    }

    // Content output
    if ((report.posts_published_total || 0) > 0) {
      healthScore += 5;
      statusIndicators.push('strong_output');
    }
  }

  // Workroom activity
  const activeWorkrooms = workrooms.filter(w => 
    w.status === 'active' || w.status === 'in_production'
  );
  if (activeWorkrooms.length > 0) {
    healthScore += 10;
    statusIndicators.push('active_fulfillment');
  }

  // Deliverables consistency
  const recentDeliverables = deliverables.filter(d => {
    const daysAgo = (Date.now() - new Date(d.published_date || d.created_date)) / (1000 * 60 * 60 * 24);
    return daysAgo < 60;
  });
  if (recentDeliverables.length >= 4) {
    healthScore += 10;
    statusIndicators.push('consistent_delivery');
  } else if (recentDeliverables.length === 0) {
    healthScore -= 15;
    statusIndicators.push('no_recent_delivery');
  }

  // Request volume and delays
  const unresolved = requests.filter(r => r.status !== 'resolved' && r.status !== 'closed');
  if (unresolved.length > 5) {
    healthScore -= 10;
    statusIndicators.push('high_request_volume');
  }

  // Approval delays
  const oldPending = requests.filter(r => 
    r.status === 'waiting_on_client' &&
    (Date.now() - new Date(r.created_date)) > 7 * 24 * 60 * 60 * 1000
  );
  if (oldPending.length > 2) {
    healthScore -= 15;
    statusIndicators.push('approval_delays');
  }

  // Determine status
  let status = 'healthy';
  if (healthScore >= 70) {
    status = 'expansion_ready';
  } else if (healthScore >= 50) {
    status = 'healthy';
  } else if (healthScore >= 30) {
    status = 'at_risk';
  } else {
    status = 'needs_attention';
  }

  return {
    status,
    score: healthScore,
    indicators: statusIndicators
  };
}

function generateRenewalSignals(companyId, report, kpiHistory, workrooms, deliverables, requests, health) {
  const signals = [];
  let signalId = 0;

  // KPI improvement signals
  if (report) {
    if (report.leads_change_percent > 15) {
      signals.push({
        company_id: companyId,
        signal_type: 'positive_trend',
        signal_label: 'Strong Lead Growth',
        signal_value: `+${report.leads_change_percent}% leads vs last month`,
        signal_score: Math.min(report.leads_change_percent, 50),
        source_type: 'kpi_trend',
        related_report_id: report.id
      });
    } else if (report.leads_change_percent < -15) {
      signals.push({
        company_id: companyId,
        signal_type: 'declining_results',
        signal_label: 'Lead Decline',
        signal_value: `${report.leads_change_percent}% leads vs last month`,
        signal_score: report.leads_change_percent,
        source_type: 'kpi_trend',
        related_report_id: report.id
      });
    }

    if (report.traffic_change_percent > 15) {
      signals.push({
        company_id: companyId,
        signal_type: 'improving_results',
        signal_label: 'Traffic Growth',
        signal_value: `+${report.traffic_change_percent}% website visits`,
        signal_score: Math.min(report.traffic_change_percent, 40),
        source_type: 'kpi_trend',
        related_report_id: report.id
      });
    } else if (report.traffic_change_percent < -15) {
      signals.push({
        company_id: companyId,
        signal_type: 'declining_results',
        signal_label: 'Traffic Decline',
        signal_value: `${report.traffic_change_percent}% website visits`,
        signal_score: report.traffic_change_percent,
        source_type: 'kpi_trend',
        related_report_id: report.id
      });
    }

    // Conversion quality signal
    if (report.website_visits_total > 0 && report.leads_total > 0) {
      const conversionRate = (report.leads_total / report.website_visits_total) * 100;
      if (conversionRate < 1) {
        signals.push({
          company_id: companyId,
          signal_type: 'poor_conversion',
          signal_label: 'Low Conversion Rate',
          signal_value: `${conversionRate.toFixed(2)}% website to leads`,
          signal_score: -30,
          source_type: 'kpi_trend',
          related_report_id: report.id
        });
      }
    }

    // Content output
    if (report.posts_published_total > 10) {
      signals.push({
        company_id: companyId,
        signal_type: 'strong_output',
        signal_label: 'Strong Content Production',
        signal_value: `${report.posts_published_total} posts published`,
        signal_score: 25,
        source_type: 'fulfillment_activity',
        related_report_id: report.id
      });
    }
  }

  // Fulfillment consistency
  const activeWorkrooms = workrooms.filter(w => w.status === 'active' || w.status === 'in_production');
  if (activeWorkrooms.length > 0) {
    signals.push({
      company_id: companyId,
      signal_type: 'high_engagement',
      signal_label: 'Active Fulfillment',
      signal_value: `${activeWorkrooms.length} active service${activeWorkrooms.length !== 1 ? 's' : ''}`,
      signal_score: 20,
      source_type: 'fulfillment_activity',
      related_workroom_id: activeWorkrooms[0].id
    });
  }

  // Request volume
  const unresolved = requests.filter(r => r.status !== 'resolved' && r.status !== 'closed');
  if (unresolved.length > 5) {
    signals.push({
      company_id: companyId,
      signal_type: 'high_request_volume',
      signal_label: 'High Support Requests',
      signal_value: `${unresolved.length} unresolved requests`,
      signal_score: -25,
      source_type: 'support'
    });
  }

  // Approval delays
  const oldPending = requests.filter(r => 
    r.status === 'waiting_on_client' &&
    (Date.now() - new Date(r.created_date)) > 7 * 24 * 60 * 60 * 1000
  );
  if (oldPending.length > 0) {
    signals.push({
      company_id: companyId,
      signal_type: 'approval_delays',
      signal_label: 'Pending Client Approvals',
      signal_value: `${oldPending.length} items waiting > 7 days`,
      signal_score: -20,
      source_type: 'approval'
    });
  }

  return signals;
}

function generateGrowthOpportunities(companyId, report, health, signals, workrooms, kpiHistory, requests) {
  const opportunities = [];
  const today = new Date();
  const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Renewal opportunity
  if (health.status === 'healthy' || health.status === 'expansion_ready') {
    const positiveSignals = signals.filter(s => s.signal_score > 0).length;
    const confidence = Math.min(50 + positiveSignals * 10, 95);
    
    opportunities.push({
      company_id: companyId,
      opportunity_type: 'renewal',
      title: 'Strong Candidate for Renewal',
      description: 'Account is performing well with positive KPI trends and consistent activity. Ready to discuss renewal and expanded services.',
      recommendation_summary: 'Schedule a strategy call to review results and discuss renewal terms. This is a strong account with good retention potential.',
      priority: 'high',
      confidence_score: confidence,
      due_date: nextMonth.toISOString().split('T')[0],
      potential_value_estimate: 0
    });
  }

  // Retention risk
  if (health.status === 'at_risk' || health.status === 'needs_attention') {
    const negativeSignals = signals.filter(s => s.signal_score < 0).length;
    const confidence = Math.min(60 + negativeSignals * 10, 95);
    
    opportunities.push({
      company_id: companyId,
      opportunity_type: 'retention_risk',
      title: 'Account Needs Attention',
      description: 'Recent activity and results show concerning trends. Account may be at churn risk and needs immediate intervention.',
      recommendation_summary: 'Reach out immediately to understand challenges. Offer a strategy session to get account back on track.',
      priority: 'urgent',
      confidence_score: confidence,
      due_date: today.toISOString().split('T')[0]
    });
  }

  // Upsell opportunities based on KPI gaps
  if (report) {
    // Traffic without conversion
    if (report.website_visits_total > 1000 && report.leads_total < 20) {
      opportunities.push({
        company_id: companyId,
        opportunity_type: 'upsell',
        title: 'Conversion Optimization Opportunity',
        description: 'Strong website traffic but conversion to leads is low. Could benefit from landing page optimization or CRO service.',
        recommendation_summary: 'Recommend conversion rate optimization service or dedicated landing page strategy.',
        recommended_service: 'Conversion Optimization / Landing Pages',
        priority: 'high',
        confidence_score: 75,
        due_date: nextMonth.toISOString().split('T')[0],
        potential_value_estimate: 2000
      });
    }

    // Content production opportunity
    if (report.posts_published_total > 0 && !report.pages_published_total) {
      opportunities.push({
        company_id: companyId,
        opportunity_type: 'cross_sell',
        title: 'Expand to Website Content',
        description: 'Strong social media production but no website SEO work. Could add blog/landing page strategy.',
        recommendation_summary: 'Propose adding SEO content and landing pages to complement social media efforts.',
        recommended_service: 'SEO Content / Blog Strategy',
        priority: 'medium',
        confidence_score: 70,
        due_date: nextMonth.toISOString().split('T')[0],
        potential_value_estimate: 1500
      });
    }

    // Video expansion
    if (report.posts_published_total > 0 && report.videos_created_total === 0) {
      opportunities.push({
        company_id: companyId,
        opportunity_type: 'cross_sell',
        title: 'Add Video Marketing',
        description: 'Client has strong social media activity but no video content. Video could significantly boost engagement.',
        recommendation_summary: 'Recommend video production service to complement existing content strategy.',
        recommended_service: 'Video Marketing / Production',
        priority: 'medium',
        confidence_score: 65,
        due_date: nextMonth.toISOString().split('T')[0],
        potential_value_estimate: 2500
      });
    }
  }

  // Optimization opportunity
  if (report && report.posts_published_total > 15 && report.leads_change_percent < 5) {
    opportunities.push({
      company_id: companyId,
      opportunity_type: 'optimization',
      title: 'Strategic Optimization Needed',
      description: 'High output volume but results are flat. Account needs strategy review and refinement.',
      recommendation_summary: 'Schedule strategy session to review what\'s working, optimize underperforming areas, and refocus efforts.',
      priority: 'medium',
      confidence_score: 70,
      due_date: nextMonth.toISOString().split('T')[0]
    });
  }

  return opportunities;
}

function generateServiceRecommendations(companyId, report, workrooms, kpiHistory, health) {
  const recommendations = [];
  const confidence_threshold = 60;

  if (!report) return recommendations;

  // Service gap analysis
  const hasWebsite = workrooms.some(w => 
    w.service_type === 'website_rebuild' || w.service_type === 'ada_rebuild'
  );
  const hasSEO = workrooms.some(w => w.service_type === 'local_seo');
  const hasVideo = workrooms.some(w => w.service_type === 'video_marketing');
  const hasSocial = workrooms.some(w => w.service_type === 'social_media');
  const hasStreaming = workrooms.some(w => w.service_type === 'streaming_tv');

  // Website without SEO
  if (hasWebsite && !hasSEO && report.website_visits_total < 500) {
    recommendations.push({
      company_id: companyId,
      current_service_type: 'website_rebuild',
      recommended_service: 'Local SEO',
      reason_code: 'website_without_seo',
      reason_summary: 'Website is in place but not driving organic traffic. Adding SEO would help improve visibility and lead generation.',
      confidence_score: 80
    });
  }

  // Good results + expand content
  if ((report.leads_change_percent > 10 || report.traffic_change_percent > 10) && !hasVideo) {
    recommendations.push({
      company_id: companyId,
      recommended_service: 'Video Marketing',
      reason_code: 'good_results_expand_content',
      reason_summary: 'Results are improving. Adding video content would help scale success and boost engagement further.',
      confidence_score: 75
    });
  }

  // Traffic without conversion
  if (report.website_visits_total > 1000 && report.leads_total < 20) {
    recommendations.push({
      company_id: companyId,
      recommended_service: 'Conversion Optimization',
      reason_code: 'traffic_without_conversion',
      reason_summary: 'Strong traffic but low conversion to leads. Implement conversion landing pages and CTAs.',
      confidence_score: 85
    });
  }

  // Social without landing pages
  if (hasSocial && !hasWebsite && report.posts_published_total > 5) {
    recommendations.push({
      company_id: companyId,
      current_service_type: 'social_media',
      recommended_service: 'Landing Pages / Website Updates',
      reason_code: 'social_without_landing_pages',
      reason_summary: 'Social content is active but missing owned landing pages to drive conversions. Add destination pages.',
      confidence_score: 70
    });
  }

  // Strong engagement + expand campaign
  if ((report.posts_published_total > 10 || report.ad_impressions_total > 5000) && !hasStreaming) {
    recommendations.push({
      company_id: companyId,
      recommended_service: 'Streaming TV Campaign',
      reason_code: 'strong_engagement_expand_campaign',
      reason_summary: 'Strong digital engagement and proven audience interest. Expand reach with streaming TV advertising.',
      confidence_score: 65
    });
  }

  return recommendations.filter(r => r.confidence_score >= confidence_threshold);
}

function generateAutoTasks(opportunities, userId, companyId) {
  const tasks = [];

  opportunities.forEach(opp => {
    if (opp.priority === 'urgent' || opp.priority === 'high') {
      if (opp.opportunity_type === 'renewal') {
        tasks.push({
          task_title: `Schedule renewal review call for ${opp.company_id}`,
          task_type: 'call',
          company_id: companyId,
          assigned_admin_user_id: userId,
          due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'high',
          notes: 'Review account results and discuss renewal terms'
        });
      } else if (opp.opportunity_type === 'retention_risk') {
        tasks.push({
          task_title: `Check in with at-risk account - ${companyId}`,
          task_type: 'call',
          company_id: companyId,
          assigned_admin_user_id: userId,
          due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'urgent',
          notes: 'Account shows warning signs. Immediate outreach needed.'
        });
      } else if (opp.opportunity_type === 'upsell') {
        tasks.push({
          task_title: `Propose ${opp.recommended_service} to ${companyId}`,
          task_type: 'email_followup',
          company_id: companyId,
          assigned_admin_user_id: userId,
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'medium',
          notes: opp.recommendation_summary
        });
      }
    }
  });

  return tasks;
}
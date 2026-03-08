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
      return Response.json({ error: 'Missing company_id' }, { status: 400 });
    }

    // Fetch all account data
    const [
      company,
      reports,
      kpiHistory,
      opportunities,
      signals,
      recommendations,
      workrooms,
      deliverables,
      requests,
      reviews,
      threads,
      tasks,
      proposals
    ] = await Promise.all([
      base44.asServiceRole.entities.Company.get(company_id),
      base44.asServiceRole.entities.ExecutiveReports.filter({ company_id }),
      base44.asServiceRole.entities.KPIHistory.filter({ company_id }),
      base44.asServiceRole.entities.GrowthOpportunities.filter({ company_id }),
      base44.asServiceRole.entities.RenewalSignals.filter({ company_id }),
      base44.asServiceRole.entities.ServiceRecommendations.filter({ company_id }),
      base44.asServiceRole.entities.FulfillmentWorkrooms.filter({ company_id }),
      base44.asServiceRole.entities.Deliverables.filter({ company_id }),
      base44.asServiceRole.entities.ClientRequests.filter({ company_id }),
      base44.asServiceRole.entities.StrategyReviews.filter({ company_id }),
      base44.asServiceRole.entities.MessageThreads.filter({ company_id }),
      base44.asServiceRole.entities.SalesTasks.filter({ company_id }),
      base44.asServiceRole.entities.Proposals.filter({ company_id })
    ]);

    if (!company) {
      return Response.json({ error: 'Company not found' }, { status: 404 });
    }

    // Analyze account state
    const latestReport = reports.sort((a, b) => new Date(b.generated_date) - new Date(a.generated_date))[0];
    const activeWorkrooms = workrooms.filter(w => w.status === 'active' || w.status === 'in_production');
    const recentDeliverables = deliverables.filter(d => {
      if (!d.published_date) return false;
      const daysAgo = (Date.now() - new Date(d.published_date)) / (1000 * 60 * 60 * 24);
      return daysAgo < 60;
    });
    const unresolvedRequests = requests.filter(r => r.status !== 'resolved' && r.status !== 'closed');
    const openOpportunities = opportunities.filter(o => o.status !== 'lost' && o.status !== 'won' && o.status !== 'dismissed');
    const waitingOnAdminThreads = threads.filter(t => t.status === 'waiting_on_admin');

    // Generate signals
    const playbookSignals = generateSignals(
      latestReport,
      openOpportunities,
      signals,
      activeWorkrooms,
      unresolvedRequests,
      waitingOnAdminThreads,
      recommendations,
      company_id
    );

    // Determine playbook type and metrics
    const accountAnalysis = analyzeAccountState(
      latestReport,
      openOpportunities,
      signals,
      activeWorkrooms,
      unresolvedRequests,
      playbookSignals,
      reviews
    );

    // Check for existing active playbook of same type
    const existingPlaybook = await base44.asServiceRole.entities.SuccessPlaybooks.filter({
      company_id,
      playbook_type: accountAnalysis.playbookType,
      status: { $in: ['draft', 'active'] }
    }).then(list => list[0]);

    if (existingPlaybook) {
      // Mark as superseded
      await base44.asServiceRole.entities.SuccessPlaybooks.update(existingPlaybook.id, {
        status: 'superseded'
      });
    }

    // Generate playbook content
    const playbookContent = generatePlaybookContent(
      accountAnalysis,
      latestReport,
      openOpportunities,
      recommendations,
      activeWorkrooms,
      unresolvedRequests,
      playbookSignals
    );

    // Create playbook
    const playbook = await base44.asServiceRole.entities.SuccessPlaybooks.create({
      company_id,
      playbook_type: accountAnalysis.playbookType,
      title: playbookContent.title,
      summary: playbookContent.summary,
      account_health_status: accountAnalysis.healthStatus,
      primary_goal: playbookContent.primaryGoal,
      main_risk: playbookContent.mainRisk,
      main_opportunity: playbookContent.mainOpportunity,
      recommended_actions_summary: playbookContent.actionsOverview,
      talking_points_summary: playbookContent.talkingPoints,
      next_quarter_focus: playbookContent.nextQuarterFocus,
      renewal_readiness: accountAnalysis.renewalReadiness,
      upsell_readiness: accountAnalysis.upsellReadiness,
      churn_risk_level: accountAnalysis.churnRiskLevel,
      confidence_score: accountAnalysis.confidenceScore,
      status: 'active',
      assigned_admin_user_id: user.id,
      visible_to_client: false
    });

    // Create playbook signals
    const signalsToCreate = playbookSignals.map(sig => ({
      ...sig,
      success_playbook_id: playbook.id
    }));
    if (signalsToCreate.length > 0) {
      await base44.asServiceRole.entities.PlaybookSignals.bulkCreate(signalsToCreate);
    }

    // Generate and create actions
    const actions = generatePlaybookActions(
      playbook.id,
      accountAnalysis.playbookType,
      playbookContent,
      accountAnalysis,
      activeWorkrooms,
      unresolvedRequests
    );

    await base44.asServiceRole.entities.PlaybookActions.bulkCreate(actions);

    // Create high-priority tasks from actions
    const urgentActions = actions.filter(a => a.priority === 'urgent' || a.priority === 'high');
    for (const action of urgentActions.slice(0, 3)) {
      const existingTask = await base44.asServiceRole.entities.SalesTasks.filter({
        company_id,
        task_type: actionTypeToTaskType(action.action_type),
        status: 'pending'
      }).then(list => list[0]);

      if (!existingTask) {
        const task = await base44.asServiceRole.entities.SalesTasks.create({
          company_id,
          task_title: action.title,
          task_type: actionTypeToTaskType(action.action_type),
          assigned_admin_user_id: user.id,
          due_date: action.due_date,
          priority: action.priority,
          status: 'pending',
          notes: `From playbook: ${accountAnalysis.playbookType}`
        });

        // Link action to task
        await base44.asServiceRole.entities.PlaybookActions.update(action.id, {
          related_task_id: task.id
        });
      }
    }

    // Create alert if rescue playbook
    if (accountAnalysis.playbookType === 'rescue') {
      await base44.asServiceRole.entities.SalesNotification.create({
        company_id,
        notification_type: 'playbook_alert',
        priority: 'urgent',
        message: `🚨 Rescue playbook generated for ${company.name || company_id}. Account needs immediate attention.`,
        status: 'active'
      });
    }

    return Response.json({
      success: true,
      playbook_id: playbook.id,
      playbook_type: accountAnalysis.playbookType,
      health_status: accountAnalysis.healthStatus,
      churn_risk: accountAnalysis.churnRiskLevel,
      actions_created: actions.length,
      signals_created: signalsToCreate.length,
      confidence_score: accountAnalysis.confidenceScore
    });

  } catch (error) {
    console.error('Error generating success playbook:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function generateSignals(report, opportunities, signals, workrooms, requests, threads, recommendations, companyId) {
  const playbookSignals = [];

  // KPI trend signals
  if (report) {
    if (report.leads_change_percent < -15) {
      playbookSignals.push({
        company_id: companyId,
        signal_type: 'declining_leads',
        signal_label: 'Lead generation decline',
        signal_value: `${report.leads_change_percent}% vs previous period`,
        impact_level: 'high',
        source_type: 'kpi_trend'
      });
    }
    if (report.traffic_change_percent > 15) {
      playbookSignals.push({
        company_id: companyId,
        signal_type: 'rising_traffic',
        signal_label: 'Traffic growth',
        signal_value: `${report.traffic_change_percent}% increase`,
        impact_level: 'high',
        source_type: 'kpi_trend'
      });
    }
    if (report.website_visits_total > 1000 && report.leads_total < 20) {
      playbookSignals.push({
        company_id: companyId,
        signal_type: 'low_conversion',
        signal_label: 'Conversion opportunity',
        signal_value: `${report.website_visits_total} visits but low leads`,
        impact_level: 'medium',
        source_type: 'kpi_trend'
      });
    }
  }

  // Fulfillment signals
  if (workrooms.length === 0) {
    playbookSignals.push({
      company_id: companyId,
      signal_type: 'stalled_fulfillment',
      signal_label: 'No active fulfillment',
      signal_value: 'Account has no active workrooms',
      impact_level: 'high',
      source_type: 'fulfillment_activity'
    });
  }

  // Request signals
  if (requests.filter(r => r.status === 'waiting_on_client').length > 3) {
    playbookSignals.push({
      company_id: companyId,
      signal_type: 'approval_delay',
      signal_label: 'Approval bottleneck',
      signal_value: `${requests.filter(r => r.status === 'waiting_on_client').length} pending approvals`,
      impact_level: 'medium',
      source_type: 'approval'
    });
  }

  if (requests.filter(r => r.status === 'in_progress').length > 5) {
    playbookSignals.push({
      company_id: companyId,
      signal_type: 'support_volume',
      signal_label: 'High support volume',
      signal_value: `${requests.filter(r => r.status === 'in_progress').length} open requests`,
      impact_level: 'medium',
      source_type: 'communication'
    });
  }

  // Communication signals
  if (threads.length > 3) {
    playbookSignals.push({
      company_id: companyId,
      signal_type: 'no_recent_contact',
      signal_label: 'Pending communication',
      signal_value: `${threads.length} threads awaiting admin response`,
      impact_level: 'medium',
      source_type: 'communication'
    });
  }

  // Opportunity signals
  const renewalOpps = opportunities.filter(o => o.opportunity_type === 'renewal');
  if (renewalOpps.length > 0) {
    playbookSignals.push({
      company_id: companyId,
      signal_type: 'renewal_window',
      signal_label: 'Renewal approaching',
      signal_value: 'Strategy review and renewal discussion needed',
      impact_level: 'high',
      source_type: 'opportunities'
    });
  }

  const upsellOpps = opportunities.filter(o => ['upsell', 'cross_sell'].includes(o.opportunity_type));
  if (upsellOpps.length > 1) {
    playbookSignals.push({
      company_id: companyId,
      signal_type: 'expansion_ready',
      signal_label: 'Strong expansion opportunity',
      signal_value: `${upsellOpps.length} service expansion opportunities`,
      impact_level: 'high',
      source_type: 'opportunities'
    });
  }

  const riskSignals = signals.filter(s => s.signal_score < 0);
  if (riskSignals.length > 2) {
    playbookSignals.push({
      company_id: companyId,
      signal_type: 'declining_leads',
      signal_label: 'Multiple risk signals',
      signal_value: `${riskSignals.length} negative indicators`,
      impact_level: 'high',
      source_type: 'health'
    });
  }

  return playbookSignals;
}

function analyzeAccountState(report, opportunities, signals, workrooms, requests, playbookSignals, reviews) {
  let playbookType = 'retention';
  let healthStatus = 'healthy';
  let renewalReadiness = 'preparing';
  let upsellReadiness = 'weak';
  let churnRiskLevel = 'low';
  let confidenceScore = 70;

  // Health status determination
  if (report) {
    if (report.leads_change_percent < -15 || report.traffic_change_percent < -15) {
      healthStatus = 'at_risk';
      churnRiskLevel = 'high';
      confidenceScore = 85;
    } else if (report.leads_change_percent > 15 || report.traffic_change_percent > 15) {
      healthStatus = 'expansion_ready';
      churnRiskLevel = 'low';
    } else if (report.leads_change_percent > 5 || report.traffic_change_percent > 5) {
      healthStatus = 'growing';
      churnRiskLevel = 'low';
    }
  }

  // Adjust health based on negative signals
  const negativeSignalsCount = playbookSignals.filter(s => 
    s.impact_level === 'critical' || s.impact_level === 'high'
  ).length;
  if (negativeSignalsCount > 3) {
    healthStatus = 'needs_attention';
    churnRiskLevel = 'critical';
  }

  // Playbook type selection
  const renewalOpps = opportunities.filter(o => o.opportunity_type === 'renewal');
  const riskOpps = opportunities.filter(o => o.opportunity_type === 'retention_risk');
  const upsellOpps = opportunities.filter(o => ['upsell', 'cross_sell'].includes(o.opportunity_type));
  const unresolved = requests.filter(r => r.status !== 'resolved' && r.status !== 'closed');

  if (riskOpps.length > 0 || churnRiskLevel === 'critical' || churnRiskLevel === 'high') {
    playbookType = 'rescue';
    confidenceScore = 90;
  } else if (renewalOpps.length > 0 && healthStatus !== 'at_risk') {
    playbookType = 'renewal';
    renewalReadiness = 'ready';
    confidenceScore = 85;
  } else if (healthStatus === 'expansion_ready' && upsellOpps.length > 1) {
    playbookType = 'expansion';
    upsellReadiness = 'strong';
    confidenceScore = 80;
  } else if (healthStatus === 'expansion_ready' && upsellOpps.length > 0) {
    playbookType = 'expansion';
    upsellReadiness = 'moderate';
    confidenceScore = 75;
  } else if (workrooms.length > 0 && unresolved.length > 3) {
    playbookType = 'fulfillment_stabilization';
    confidenceScore = 80;
  } else {
    playbookType = 'retention';
    renewalReadiness = 'preparing';
    confidenceScore = 65;
  }

  return {
    playbookType,
    healthStatus,
    renewalReadiness,
    upsellReadiness,
    churnRiskLevel,
    confidenceScore
  };
}

function generatePlaybookContent(analysis, report, opportunities, recommendations, workrooms, requests, signals) {
  let title = `${analysis.playbookType.replace(/_/g, ' ').toUpperCase()} Playbook`;
  let summary = '';
  let primaryGoal = '';
  let mainRisk = '';
  let mainOpportunity = '';
  let actionsOverview = '';
  let talkingPoints = '';
  let nextQuarterFocus = '';

  const renewalOpps = opportunities.filter(o => o.opportunity_type === 'renewal');
  const upsellOpps = opportunities.filter(o => ['upsell', 'cross_sell'].includes(o.opportunity_type));

  if (analysis.playbookType === 'rescue') {
    title = 'Account Rescue Playbook';
    primaryGoal = 'Stabilize account and prevent churn';
    mainRisk = analysis.churnRiskLevel === 'critical' ? 'Immediate churn risk' : 'Declining performance and engagement';
    summary = `This account needs immediate intervention. ${analysis.churnRiskLevel === 'critical' ? 'Churn risk is critical.' : 'Performance is declining.'} Focus on understanding challenges, fixing delivery issues, and rebuilding confidence.`;
    actionsOverview = '1. Schedule emergency check-in call\n2. Review and resolve open issues\n3. Commit to specific wins in next 30 days\n4. Daily delivery monitoring\n5. Weekly check-ins until stable';
    talkingPoints = 'What are the biggest challenges right now? / How can we improve? / Let\'s commit to specific wins and I\'ll personally ensure delivery.';
  } else if (analysis.playbookType === 'renewal') {
    title = 'Renewal Playbook';
    primaryGoal = 'Secure renewal and expand service scope';
    mainRisk = 'Renewal may be lost if not actively managed';
    mainOpportunity = upsellOpps.length > 0 ? `Expand into ${upsellOpps[0].recommended_service}` : 'Expand current services';
    summary = 'Results support renewal. Focus on summarizing wins, addressing any concerns, and presenting expansion options.';
    actionsOverview = '1. Schedule renewal strategy call\n2. Prepare wins summary and trends\n3. Present expansion options\n4. Create renewal proposal\n5. Send recap and next steps';
    talkingPoints = `Your results this period show solid progress in ${report?.report_period_label || 'this period'}. / Here's what we accomplished together. / Here are opportunities to expand and improve further. / Let's talk about renewal and next-level growth.`;
  } else if (analysis.playbookType === 'expansion') {
    title = 'Expansion Playbook';
    primaryGoal = 'Upsell complementary services';
    mainOpportunity = upsellOpps.length > 0 ? upsellOpps[0].recommendation_summary : 'Service expansion opportunities';
    mainRisk = 'Expansion may not be received without proper positioning';
    summary = 'Account is healthy and ready for growth. Best time to introduce complementary services.';
    actionsOverview = '1. Review expansion opportunities\n2. Prepare recommendation with ROI\n3. Create upsell proposal\n4. Schedule expansion discussion\n5. Support decision process';
    talkingPoints = `Your recent wins in ${recommendations[0]?.recommended_service || 'current service'} show strong momentum. / Here's how we can accelerate results further. / Adding [service] would help you achieve [goal]. / Let's discuss timing and approach.`;
  } else {
    title = 'Retention Playbook';
    primaryGoal = 'Maintain strong relationship and engagement';
    summary = 'Account is stable. Focus on consistent delivery, proactive communication, and keeping ahead of needs.';
    actionsOverview = '1. Monthly results review\n2. Proactive opportunity identification\n3. Consistent delivery and quality\n4. Regular strategic check-ins\n5. Testimonial / case study request';
    talkingPoints = 'How are results tracking against your goals? / What's working best for you? / Where should we focus next? / I want to make sure we\'re delivering maximum value.';
  }

  return {
    title,
    summary,
    primaryGoal,
    mainRisk,
    mainOpportunity,
    actionsOverview,
    talkingPoints,
    nextQuarterFocus: generateNextQuarterFocus(analysis, report, recommendations)
  };
}

function generatePlaybookActions(playbookId, playbookType, content, analysis, workrooms, requests) {
  const actions = [];
  let sortOrder = 0;

  if (playbookType === 'rescue') {
    actions.push(
      {
        success_playbook_id: playbookId,
        action_type: 'schedule_call',
        title: 'Schedule emergency account check-in',
        description: 'Get on the phone with the client immediately to understand challenges and commit to fixes.',
        sort_order: sortOrder++,
        priority: 'urgent',
        owner_type: 'admin',
        visible_to_client: false,
        status: 'pending',
        due_date: addDays(new Date(), 1).toISOString().split('T')[0]
      },
      {
        success_playbook_id: playbookId,
        action_type: 'close_open_requests',
        title: `Resolve ${requests.length} open client requests`,
        description: 'Prioritize and close all pending approvals, questions, and support items this week.',
        sort_order: sortOrder++,
        priority: 'urgent',
        owner_type: 'admin',
        visible_to_client: false,
        status: 'pending',
        due_date: addDays(new Date(), 7).toISOString().split('T')[0]
      },
      {
        success_playbook_id: playbookId,
        action_type: 'review_results',
        title: 'Prepare account recovery plan',
        description: 'Document what went wrong, what will change, and commit to specific wins.',
        sort_order: sortOrder++,
        priority: 'high',
        owner_type: 'admin',
        visible_to_client: false,
        status: 'pending',
        due_date: addDays(new Date(), 3).toISOString().split('T')[0]
      },
      {
        success_playbook_id: playbookId,
        action_type: 'fix_bottleneck',
        title: 'Daily delivery monitoring',
        description: 'Implement daily check-ins on account deliverables until stable.',
        sort_order: sortOrder++,
        priority: 'high',
        owner_type: 'admin',
        visible_to_client: false,
        status: 'pending',
        due_date: addDays(new Date(), 30).toISOString().split('T')[0]
      }
    );
  } else if (playbookType === 'renewal') {
    actions.push(
      {
        success_playbook_id: playbookId,
        action_type: 'schedule_call',
        title: 'Schedule renewal strategy call',
        description: 'Discuss past results, future goals, and present renewal proposal.',
        sort_order: sortOrder++,
        priority: 'high',
        owner_type: 'admin',
        visible_to_client: false,
        status: 'pending',
        due_date: addDays(new Date(), 7).toISOString().split('T')[0]
      },
      {
        success_playbook_id: playbookId,
        action_type: 'review_results',
        title: 'Prepare renewal summary',
        description: 'Document wins, trends, and ROI achieved in current term.',
        sort_order: sortOrder++,
        priority: 'high',
        owner_type: 'admin',
        visible_to_client: true,
        status: 'pending',
        due_date: addDays(new Date(), 3).toISOString().split('T')[0]
      },
      {
        success_playbook_id: playbookId,
        action_type: 'create_proposal',
        title: 'Create renewal proposal',
        description: 'Prepare renewal terms and expansion options.',
        sort_order: sortOrder++,
        priority: 'high',
        owner_type: 'admin',
        visible_to_client: false,
        status: 'pending',
        due_date: addDays(new Date(), 5).toISOString().split('T')[0]
      },
      {
        success_playbook_id: playbookId,
        action_type: 'renewal_conversation',
        title: 'Execute renewal conversation',
        description: 'Present recap, expansion options, and next steps.',
        sort_order: sortOrder++,
        priority: 'high',
        owner_type: 'admin',
        visible_to_client: false,
        status: 'pending',
        due_date: addDays(new Date(), 14).toISOString().split('T')[0]
      }
    );
  } else if (playbookType === 'expansion') {
    actions.push(
      {
        success_playbook_id: playbookId,
        action_type: 'review_results',
        title: 'Review best-performing areas',
        description: 'Identify what\'s working best and use as foundation for expansion.',
        sort_order: sortOrder++,
        priority: 'medium',
        owner_type: 'admin',
        visible_to_client: false,
        status: 'pending',
        due_date: addDays(new Date(), 3).toISOString().split('T')[0]
      },
      {
        success_playbook_id: playbookId,
        action_type: 'create_proposal',
        title: 'Prepare upsell proposal',
        description: 'Create proposal for new service with clear ROI.',
        sort_order: sortOrder++,
        priority: 'high',
        owner_type: 'admin',
        visible_to_client: false,
        status: 'pending',
        due_date: addDays(new Date(), 5).toISOString().split('T')[0]
      },
      {
        success_playbook_id: playbookId,
        action_type: 'schedule_call',
        title: 'Schedule expansion discussion call',
        description: 'Present opportunity and discuss approach.',
        sort_order: sortOrder++,
        priority: 'high',
        owner_type: 'admin',
        visible_to_client: false,
        status: 'pending',
        due_date: addDays(new Date(), 7).toISOString().split('T')[0]
      }
    );
  } else {
    // Retention
    actions.push(
      {
        success_playbook_id: playbookId,
        action_type: 'review_results',
        title: 'Monthly results review',
        description: 'Review latest KPIs and communicate wins to client.',
        sort_order: sortOrder++,
        priority: 'medium',
        owner_type: 'admin',
        visible_to_client: true,
        status: 'pending',
        due_date: addDays(new Date(), 10).toISOString().split('T')[0]
      },
      {
        success_playbook_id: playbookId,
        action_type: 'schedule_call',
        title: 'Proactive strategy check-in',
        description: 'Touch base on goals, results, and strategic priorities.',
        sort_order: sortOrder++,
        priority: 'medium',
        owner_type: 'admin',
        visible_to_client: false,
        status: 'pending',
        due_date: addDays(new Date(), 21).toISOString().split('T')[0]
      }
    );
  }

  return actions;
}

function generateNextQuarterFocus(analysis, report, recommendations) {
  if (!report) return 'Establish baseline metrics and delivery rhythm.';

  if (analysis.playbookType === 'rescue') {
    return 'Stabilize delivery, resolve pending items, rebuild trust.';
  }
  if (analysis.playbookType === 'renewal') {
    return 'Close renewal, integrate expansion services, accelerate results.';
  }
  if (analysis.playbookType === 'expansion') {
    return `Execute ${recommendations[0]?.recommended_service || 'new service'}, measure impact, plan next expansion.`;
  }

  if (report.website_visits_total > 1000 && report.leads_total < 20) {
    return 'Improve conversion from traffic. Optimize landing pages and calls-to-action.';
  }
  if (report.traffic_change_percent > 10) {
    return 'Build on traffic gains. Increase content output and expand city targeting.';
  }
  if (report.posts_published_total < 4) {
    return 'Increase content production consistency. Establish monthly publishing rhythm.';
  }

  return 'Continue current strategy while monitoring for expansion opportunities.';
}

function actionTypeToTaskType(actionType) {
  const mapping = {
    schedule_call: 'call',
    create_proposal: 'proposal_revision',
    fix_bottleneck: 'email_followup',
    close_open_requests: 'email_followup',
    review_results: 'email_followup',
    rescue_outreach: 'call',
    renewal_conversation: 'call',
    upsell_followup: 'email_followup'
  };
  return mapping[actionType] || 'follow_up';
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
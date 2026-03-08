import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { brief_type = 'daily_brief', company_id, period_start, period_end } = await req.json();

    // Calculate date range based on brief type
    const today = new Date();
    let dateRange = {};
    let periodLabel = '';

    if (brief_type === 'daily_brief') {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      dateRange = { start: yesterday, end: today };
      periodLabel = today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } else if (brief_type === 'weekly_brief') {
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      dateRange = { start: weekStart, end: today };
      periodLabel = `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    } else if (brief_type === 'monthly_brief') {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      dateRange = { start: monthStart, end: today };
      periodLabel = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    } else if (brief_type === 'account_brief' && company_id) {
      periodLabel = 'Current Status';
    } else {
      periodLabel = 'On-Demand Analysis';
    }

    // Fetch all relevant data in parallel
    const [
      proposals,
      companies,
      salestasks,
      executiveReports,
      kpiHistory,
      growthOpportunities,
      renewalSignals,
      serviceRecommendations,
      strategyReviews,
      successPlaybooks,
      slaEvents,
      messageThreads,
      onboardingWorkrooms,
      fulfillmentWorkrooms,
      deliverables,
      clientRequests
    ] = await Promise.all([
      base44.asServiceRole.entities.Proposal.list('-updated_date', 100),
      base44.asServiceRole.entities.Company.list('-updated_date', 100),
      base44.asServiceRole.entities.SalesTasks.list('-updated_date', 100),
      base44.asServiceRole.entities.ExecutiveReports.list('-created_date', 50),
      base44.asServiceRole.entities.KPIHistory.list('-period_end', 100),
      base44.asServiceRole.entities.GrowthOpportunities.list('-updated_date', 100),
      base44.asServiceRole.entities.RenewalSignals.list('-updated_date', 100),
      base44.asServiceRole.entities.ServiceRecommendations.list('-updated_date', 50),
      base44.asServiceRole.entities.StrategyReviews.list('-completed_date', 50),
      base44.asServiceRole.entities.SuccessPlaybooks.list('-updated_date', 50),
      base44.asServiceRole.entities.SLAEvents.list('-breached_at', 50),
      base44.asServiceRole.entities.MessageThreads.list('-last_message_date', 100),
      base44.asServiceRole.entities.OnboardingWorkrooms.list('-updated_date', 50),
      base44.asServiceRole.entities.FulfillmentWorkrooms.list('-updated_date', 50),
      base44.asServiceRole.entities.Deliverables.list('-updated_date', 100),
      base44.asServiceRole.entities.ClientRequests.list('-updated_date', 100)
    ]);

    // Analyze revenue / sales
    const recentProposals = proposals.filter(p => new Date(p.updated_date) >= dateRange.start);
    const acceptedProposals = proposals.filter(p => p.status === 'accepted' && new Date(p.updated_date) >= dateRange.start);
    const viewedProposals = proposals.filter(p => p.status === 'viewed' && new Date(p.updated_date) >= dateRange.start);
    const pipelineValue = proposals.filter(p => p.status !== 'rejected' && p.status !== 'expired').reduce((sum, p) => sum + (p.estimated_value || 0), 0);
    const renewalOpportunities = growthOpportunities.filter(o => o.opportunity_type === 'renewal' && o.status === 'new');
    const upsellOpportunities = growthOpportunities.filter(o => o.opportunity_type === 'upsell' && o.status === 'new');

    // Analyze client health
    const rescuePlaybooks = successPlaybooks.filter(p => p.playbook_type === 'rescue' && p.status === 'active');
    const highRiskAccounts = successPlaybooks.filter(p => p.churn_risk_level === 'critical' || p.churn_risk_level === 'high');
    const activeGrowthOpps = growthOpportunities.filter(o => o.status !== 'won' && o.status !== 'lost' && o.status !== 'dismissed');

    // Analyze fulfillment / operations
    const activeSLABreaches = slaEvents.filter(s => s.status === 'breached' && s.severity === 'critical');
    const overdueTasks = salestasks.filter(t => t.due_date && new Date(t.due_date) < today && t.status !== 'completed');
    const staleWorkrooms = fulfillmentWorkrooms.filter(w => {
      const lastUpdate = new Date(w.updated_date);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return lastUpdate < weekAgo;
    });
    const overdueReports = executiveReports.filter(r => r.status !== 'published' && new Date(r.period_end) < today);

    // Analyze communication
    const urgentThreads = messageThreads.filter(m => m.priority === 'urgent' && m.status !== 'closed');
    const waitingOnAdmin = messageThreads.filter(m => m.status === 'waiting_on_admin');

    // Generate synthesis
    const summaryHeadline = generateHeadline({
      acceptedProposals,
      activeSLABreaches,
      rescuePlaybooks,
      renewalOpportunities,
      briefType: brief_type
    });

    const executiveSummary = generateExecutiveSummary({
      recentProposals,
      acceptedProposals,
      viewedProposals,
      activeSLABreaches,
      rescuePlaybooks,
      activeGrowthOpps,
      briefType: brief_type
    });

    const winsSummary = generateWins({
      acceptedProposals,
      viewedProposals,
      strongAccounts: companies.filter(c => c.account_health === 'healthy'),
      kpiHistory
    });

    const risksSummary = generateRisks({
      activeSLABreaches,
      highRiskAccounts,
      overdueTasks,
      staleWorkrooms,
      urgentThreads
    });

    const opportunitiesSummary = generateOpportunities({
      renewalOpportunities,
      upsellOpportunities,
      serviceRecommendations,
      activeGrowthOpps
    });

    const actionRecommendations = generateActions({
      activeSLABreaches,
      rescuePlaybooks,
      renewalOpportunities,
      overdueReports,
      urgentThreads
    });

    const decisionsNeeded = generateDecisions({
      highRiskAccounts,
      renewalOpportunities,
      upsellOpportunities,
      activeSLABreaches
    });

    const revenueOutlook = generateRevenueOutlook({ pipelineValue, acceptedProposals, renewalOpportunities });
    const operationsOutlook = generateOperationsOutlook({ activeSLABreaches, staleWorkrooms, overdueTasks });
    const clientHealthOutlook = generateClientHealthOutlook({ rescuePlaybooks, highRiskAccounts, companies });

    // Create brief
    const briefTitle = `${brief_type.replace('_', ' ').toUpperCase()} - ${periodLabel}`;
    const brief = await base44.asServiceRole.entities.CopilotBriefs.create({
      brief_title: briefTitle,
      brief_type,
      period_label: periodLabel,
      period_start: dateRange.start ? dateRange.start.toISOString().split('T')[0] : undefined,
      period_end: dateRange.end ? dateRange.end.toISOString().split('T')[0] : undefined,
      generated_for_user_id: user.id,
      generated_by_function: 'generateExecutiveCopilotBrief',
      status: 'ready',
      summary_headline: summaryHeadline,
      executive_summary: executiveSummary,
      wins_summary: winsSummary,
      risks_summary: risksSummary,
      opportunities_summary: opportunitiesSummary,
      action_recommendations: actionRecommendations,
      decisions_needed: decisionsNeeded,
      revenue_outlook_summary: revenueOutlook,
      operations_outlook_summary: operationsOutlook,
      client_health_outlook_summary: clientHealthOutlook
    });

    // Create insights
    const insights = generateInsights({
      activeSLABreaches,
      rescuePlaybooks,
      renewalOpportunities,
      acceptedProposals,
      upsellOpportunities,
      urgentThreads
    });

    if (insights.length > 0) {
      await Promise.all(
        insights.map(insight =>
          base44.asServiceRole.entities.CopilotInsights.create({
            ...insight,
            copilot_brief_id: brief.id
          })
        )
      );
    }

    // Create action queue
    const actions = generateActionQueue({
      rescuePlaybooks,
      renewalOpportunities,
      upsellOpportunities,
      activeSLABreaches,
      overdueReports,
      companies
    });

    if (actions.length > 0) {
      await Promise.all(
        actions.map((action, idx) =>
          base44.asServiceRole.entities.CopilotActionQueue.create({
            ...action,
            copilot_brief_id: brief.id,
            sort_order: idx
          })
        )
      );
    }

    return Response.json({
      success: true,
      brief_id: brief.id,
      brief,
      insights_count: insights.length,
      actions_count: actions.length
    });
  } catch (error) {
    console.error('Error generating copilot brief:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// ── Helper functions ──

function generateHeadline({ acceptedProposals, activeSLABreaches, rescuePlaybooks, renewalOpportunities, briefType }) {
  if (acceptedProposals.length > 0 && activeSLABreaches.length === 0) {
    return `Strong week: ${acceptedProposals.length} new client${acceptedProposals.length > 1 ? 's' : ''} closed and operations stable.`;
  }
  if (activeSLABreaches.length > 2) {
    return `⚠️ Critical: ${activeSLABreaches.length} operational breaches affecting delivery. Owner intervention needed.`;
  }
  if (rescuePlaybooks.length > 0) {
    return `${rescuePlaybooks.length} at-risk accounts need immediate attention to prevent churn.`;
  }
  if (renewalOpportunities.length > 2) {
    return `Strong renewal window: ${renewalOpportunities.length} accounts ready for conversation.`;
  }
  return `Business stable. ${renewalOpportunities.length || 'Several'} renewal opportunities and ${activeSLABreaches.length || 0} operational items to address.`;
}

function generateExecutiveSummary({ recentProposals, acceptedProposals, viewedProposals, activeSLABreaches, rescuePlaybooks, activeGrowthOpps, briefType }) {
  const parts = [];
  if (acceptedProposals.length > 0) parts.push(`${acceptedProposals.length} proposal${acceptedProposals.length > 1 ? 's' : ''} accepted`);
  if (viewedProposals.length > 0) parts.push(`${viewedProposals.length} now in client review`);
  if (activeSLABreaches.length > 0) parts.push(`${activeSLABreaches.length} critical SLA breaches`);
  if (rescuePlaybooks.length > 0) parts.push(`${rescuePlaybooks.length} rescue-risk account${rescuePlaybooks.length > 1 ? 's' : ''}`);
  if (activeGrowthOpps.length > 0) parts.push(`${activeGrowthOpps.length} growth opportunity${activeGrowthOpps.length > 1 ? 'ies' : ''} in progress`);

  return parts.length > 0
    ? `${parts.join('. ')}. Business state: ${activeSLABreaches.length > 0 ? 'operational attention needed' : 'stable operations'}.`
    : 'Business operations running normally. Review growth opportunities and renewal pipeline.';
}

function generateWins({ acceptedProposals, viewedProposals, strongAccounts, kpiHistory }) {
  const wins = [];
  if (acceptedProposals.length > 0) wins.push(`${acceptedProposals.length} new client${acceptedProposals.length > 1 ? 's' : ''} signed`);
  if (viewedProposals.length > 0) wins.push(`${viewedProposals.length} proposal${viewedProposals.length > 1 ? 's' : ''} moving forward`);
  if (strongAccounts.length > 3) wins.push(`${strongAccounts.length} accounts in healthy status`);
  return wins.length > 0 ? wins.join('. ') + '.' : 'Steady business progress with healthy account base.';
}

function generateRisks({ activeSLABreaches, highRiskAccounts, overdueTasks, staleWorkrooms, urgentThreads }) {
  const risks = [];
  if (activeSLABreaches.length > 0) risks.push(`${activeSLABreaches.length} critical SLA breach${activeSLABreaches.length > 1 ? 'es' : ''}`);
  if (highRiskAccounts.length > 0) risks.push(`${highRiskAccounts.length} high-churn-risk account${highRiskAccounts.length > 1 ? 's' : ''}`);
  if (overdueTasks.length > 0) risks.push(`${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}`);
  if (staleWorkrooms.length > 0) risks.push(`${staleWorkrooms.length} stalled fulfillment workroom${staleWorkrooms.length > 1 ? 's' : ''}`);
  if (urgentThreads.length > 0) risks.push(`${urgentThreads.length} urgent client message${urgentThreads.length > 1 ? 's' : ''}`);
  return risks.length > 0 ? risks.join('. ') + '.' : 'No critical risks identified.';
}

function generateOpportunities({ renewalOpportunities, upsellOpportunities, serviceRecommendations, activeGrowthOpps }) {
  const opps = [];
  if (renewalOpportunities.length > 0) opps.push(`${renewalOpportunities.length} renewal conversation${renewalOpportunities.length > 1 ? 's' : ''} ready`);
  if (upsellOpportunities.length > 0) opps.push(`${upsellOpportunities.length} upsell opportunity${upsellOpportunities.length > 1 ? 'ies' : ''}`);
  if (serviceRecommendations.length > 0) opps.push(`${serviceRecommendations.length} service expansion recommendation${serviceRecommendations.length > 1 ? 's' : ''}`);
  return opps.length > 0 ? opps.join('. ') + '.' : 'Monitor growth opportunities in coming weeks.';
}

function generateActions({ activeSLABreaches, rescuePlaybooks, renewalOpportunities, overdueReports, urgentThreads }) {
  const actions = [];
  if (activeSLABreaches.length > 0) actions.push(`Resolve ${activeSLABreaches.length} SLA breach${activeSLABreaches.length > 1 ? 'es' : ''}`);
  if (rescuePlaybooks.length > 0) actions.push(`Execute rescue playbook${rescuePlaybooks.length > 1 ? 's' : ''} for ${rescuePlaybooks.length} at-risk account${rescuePlaybooks.length > 1 ? 's' : ''}`);
  if (renewalOpportunities.length > 0) actions.push(`Initiate renewal conversation${renewalOpportunities.length > 1 ? 's' : ''} (${renewalOpportunities.length})`);
  if (overdueReports.length > 0) actions.push(`Publish ${overdueReports.length} overdue report${overdueReports.length > 1 ? 's' : ''}`);
  if (urgentThreads.length > 0) actions.push(`Address ${urgentThreads.length} urgent client message${urgentThreads.length > 1 ? 's' : ''}`);
  return actions.length > 0 ? actions.join('. ') + '.' : 'No critical actions required at this time.';
}

function generateDecisions({ highRiskAccounts, renewalOpportunities, upsellOpportunities, activeSLABreaches }) {
  const decisions = [];
  if (highRiskAccounts.length > 0) decisions.push(`Decide on rescue intervention for ${highRiskAccounts.length > 1 ? 'multiple' : 'the'} high-churn account${highRiskAccounts.length > 1 ? 's' : ''}`);
  if (renewalOpportunities.length > 1) decisions.push(`Prioritize which ${renewalOpportunities.length} renewal opportunity${renewalOpportunities.length > 1 ? 'ies' : ''} to approach first`);
  if (upsellOpportunities.length > 0) decisions.push(`Approve service expansion proposal${upsellOpportunities.length > 1 ? 's' : ''}`);
  if (activeSLABreaches.length > 1) decisions.push(`Decide on operational restructuring to prevent SLA breach recurrence`);
  return decisions.length > 0 ? decisions.join('. ') + '.' : 'No major decisions pending.';
}

function generateRevenueOutlook({ pipelineValue, acceptedProposals, renewalOpportunities }) {
  return `Pipeline: $${(pipelineValue / 1000).toFixed(0)}k. Recent wins: ${acceptedProposals.length} client${acceptedProposals.length > 1 ? 's' : ''}. Renewals coming: ${renewalOpportunities.length}. Outlook: positive.`;
}

function generateOperationsOutlook({ activeSLABreaches, staleWorkrooms, overdueTasks }) {
  if (activeSLABreaches.length === 0 && staleWorkrooms.length === 0 && overdueTasks.length < 3) {
    return 'Operations stable. Fulfillment workrooms on track. No critical delays.';
  }
  return `Needs attention: ${activeSLABreaches.length} SLA breach${activeSLABreaches.length > 1 ? 'es' : ''}, ${staleWorkrooms.length} stalled workroom${staleWorkrooms.length > 1 ? 's' : ''}, ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}.`;
}

function generateClientHealthOutlook({ rescuePlaybooks, highRiskAccounts, companies }) {
  const healthyCount = companies.filter(c => c.account_health === 'healthy').length;
  return `${healthyCount} healthy account${healthyCount > 1 ? 's' : ''}. ${highRiskAccounts.length} at risk. ${rescuePlaybooks.length} active rescue. Overall: ${highRiskAccounts.length > 3 ? 'focus on retention' : 'stable'}.`;
}

function generateInsights({ activeSLABreaches, rescuePlaybooks, renewalOpportunities, acceptedProposals, upsellOpportunities, urgentThreads }) {
  const insights = [];

  if (activeSLABreaches.length > 0) {
    insights.push({
      insight_type: 'operational_risk',
      title: `${activeSLABreaches.length} Critical SLA Breach${activeSLABreaches.length > 1 ? 'es' : ''}`,
      description: `Delivery deadlines missed on ${activeSLABreaches.length} account${activeSLABreaches.length > 1 ? 's' : ''}. Risk of churn if not addressed immediately.`,
      priority: 'urgent',
      severity: 'critical',
      recommended_action: 'Review each SLA event and create remediation plan'
    });
  }

  if (rescuePlaybooks.length > 0) {
    insights.push({
      insight_type: 'churn_risk',
      title: `${rescuePlaybooks.length} Rescue Playbook${rescuePlaybooks.length > 1 ? 's' : ''} Active`,
      description: `${rescuePlaybooks.length} account${rescuePlaybooks.length > 1 ? 's' : ''} at churn risk. Rescue playbook${rescuePlaybooks.length > 1 ? 's' : ''} in place but need owner oversight.`,
      priority: 'high',
      severity: 'warning',
      recommended_action: 'Schedule rescue calls this week'
    });
  }

  if (renewalOpportunities.length > 1) {
    insights.push({
      insight_type: 'renewal_window',
      title: `${renewalOpportunities.length} Renewal Conversations Ready`,
      description: `Multiple accounts ready for renewal discussion. High success probability if approached this week.`,
      priority: 'high',
      severity: 'informational',
      recommended_action: 'Send renewal proposals to qualified accounts'
    });
  }

  if (acceptedProposals.length > 0) {
    insights.push({
      insight_type: 'proposal_movement',
      title: `${acceptedProposals.length} New Client${acceptedProposals.length > 1 ? 's' : ''} Closed`,
      description: `Strong pipeline momentum with recent wins.`,
      priority: 'medium',
      severity: 'informational'
    });
  }

  if (upsellOpportunities.length > 0) {
    insights.push({
      insight_type: 'upsell_ready',
      title: `${upsellOpportunities.length} Upsell Opportunity${upsellOpportunities.length > 1 ? 'ies' : ''}`,
      description: `Existing clients showing strong usage and requesting additional services.`,
      priority: 'medium',
      severity: 'informational',
      recommended_action: 'Prepare service expansion proposals'
    });
  }

  if (urgentThreads.length > 0) {
    insights.push({
      insight_type: 'communication_issue',
      title: `${urgentThreads.length} Urgent Client Message${urgentThreads.length > 1 ? 's' : ''}`,
      description: `${urgentThreads.length} high-priority client communication pending response.`,
      priority: 'high',
      severity: 'warning',
      recommended_action: 'Respond to urgent client messages today'
    });
  }

  return insights;
}

function generateActionQueue({ rescuePlaybooks, renewalOpportunities, upsellOpportunities, activeSLABreaches, overdueReports, companies }) {
  const actions = [];
  let sortOrder = 0;

  if (activeSLABreaches.length > 0) {
    actions.push({
      action_title: `Resolve ${activeSLABreaches.length} Critical SLA Breach${activeSLABreaches.length > 1 ? 'es' : ''}`,
      action_type: 'resolve_breach',
      description: `Immediate action required to prevent client churn and account fallout.`,
      priority: 'urgent',
      owner_type: 'owner',
      sort_order: sortOrder++
    });
  }

  if (rescuePlaybooks.length > 0) {
    actions.push({
      action_title: `Execute Rescue Playbook${rescuePlaybooks.length > 1 ? 's' : ''} (${rescuePlaybooks.length})`,
      action_type: 'call_client',
      description: `${rescuePlaybooks.length} account${rescuePlaybooks.length > 1 ? 's' : ''} at churn risk. Personal outreach from owner recommended.`,
      priority: 'urgent',
      owner_type: 'owner',
      sort_order: sortOrder++
    });
  }

  if (renewalOpportunities.length > 0) {
    actions.push({
      action_title: `Initiate Renewal Conversation${renewalOpportunities.length > 1 ? 's' : ''} (${renewalOpportunities.length}})`,
      action_type: 'schedule_review',
      description: `${renewalOpportunities.length} account${renewalOpportunities.length > 1 ? 's' : ''} ready for renewal. High success probability.`,
      priority: 'high',
      owner_type: 'admin',
      sort_order: sortOrder++
    });
  }

  if (upsellOpportunities.length > 1) {
    actions.push({
      action_title: `Review Upsell Opportunity${upsellOpportunities.length > 1 ? 'ies' : ''} (${upsellOpportunities.length}})`,
      action_type: 'create_proposal',
      description: `Existing clients showing strong demand for service expansion.`,
      priority: 'high',
      owner_type: 'admin',
      sort_order: sortOrder++
    });
  }

  if (overdueReports.length > 0) {
    actions.push({
      action_title: `Publish ${overdueReports.length} Overdue Report${overdueReports.length > 1 ? 's' : ''}`,
      action_type: 'review_report',
      description: `Executive report${overdueReports.length > 1 ? 's' : ''} delayed. Publish to maintain client trust.`,
      priority: 'medium',
      owner_type: 'admin',
      sort_order: sortOrder++
    });
  }

  return actions;
}
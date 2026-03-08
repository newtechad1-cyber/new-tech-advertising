import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    // Parallel data fetching
    const [
      companies,
      proposals,
      growthOpps,
      slaEvents,
      accountabilityScores,
      messageThreads,
      strategyReviews,
      execReports,
      successPlaybooks,
      fulfillmentWorkrooms,
      onboardingWorkrooms,
      kpiHistory,
      clientRequests
    ] = await Promise.all([
      base44.asServiceRole.entities.Company.list(),
      base44.asServiceRole.entities.Proposal.list(),
      base44.asServiceRole.entities.GrowthOpportunities.list(),
      base44.asServiceRole.entities.SLAEvents.filter({ status: { $in: ['active', 'breached'] } }),
      base44.asServiceRole.entities.AccountabilityScores.list(),
      base44.asServiceRole.entities.MessageThreads.list(),
      base44.asServiceRole.entities.StrategyReviews.filter({ status: { $nin: ['archived', 'completed'] } }),
      base44.asServiceRole.entities.ExecutiveReports.list(),
      base44.asServiceRole.entities.SuccessPlaybooks.filter({ status: { $in: ['active', 'draft'] } }),
      base44.asServiceRole.entities.FulfillmentWorkrooms.list(),
      base44.asServiceRole.entities.OnboardingWorkrooms.list(),
      base44.asServiceRole.entities.KPIHistory.list(),
      base44.asServiceRole.entities.ClientRequests.filter({ status: { $in: ['pending', 'in_progress'] } })
    ]);

    // ===== AGGREGATIONS =====

    // 1. Active Clients
    const activeClients = companies.filter(c => c.subscription_status === 'active' || c.status === 'active').length;

    // 2. Pipeline Metrics
    const sentProposals = proposals.filter(p => p.status === 'sent');
    const viewedProposals = proposals.filter(p => p.status === 'viewed');
    const acceptedProposals = proposals.filter(p => p.status === 'accepted');
    const totalPipelineValue = proposals
      .filter(p => p.status !== 'rejected' && p.status !== 'expired')
      .reduce((sum, p) => sum + (p.estimated_value || 0), 0);

    // 3. Renewals
    const upcomingRenewals = growthOpps.filter(
      g => g.opportunity_type === 'renewal' && 
           g.due_date &&
           new Date(g.due_date) <= ninetyDaysFromNow &&
           new Date(g.due_date) > now &&
           g.status !== 'won'
    );
    const renewalValue = upcomingRenewals.reduce((sum, r) => sum + (r.potential_value_estimate || 0), 0);

    // 4. Upsell Opportunities
    const upsellOpps = growthOpps.filter(
      g => (g.opportunity_type === 'upsell' || g.opportunity_type === 'expansion') &&
           g.status !== 'won' &&
           g.status !== 'lost'
    );
    const upsellValue = upsellOpps.reduce((sum, u) => sum + (u.potential_value_estimate || 0), 0);

    // 5. At-Risk Accounts
    const atRiskPlaybooks = successPlaybooks.filter(p => p.playbook_type === 'rescue' || p.churn_risk_level === 'high');
    const atRiskCount = new Set(atRiskPlaybooks.map(p => p.company_id)).size;

    // 6. Operational Load
    const activeFulfillmentWorkrooms = fulfillmentWorkrooms.filter(w => w.status !== 'completed' && w.status !== 'archived').length;
    const activeOnboardingWorkrooms = onboardingWorkrooms.filter(w => w.status !== 'completed' && w.status !== 'archived').length;

    // 7. SLA Breaches
    const criticalBreaches = slaEvents.filter(e => e.severity === 'critical' && e.status === 'breached').length;
    const totalBreaches = slaEvents.filter(e => e.status === 'breached').length;

    // 8. Reports Ready
    const reportsReady = execReports.filter(r => r.status === 'ready' || r.status === 'draft').length;
    const reportsPublished = execReports.filter(r => r.status === 'published').length;

    // 9. Unread Messages
    const unreadMessages = messageThreads.filter(t => 
      (t.status === 'waiting_on_admin' || t.status === 'open') &&
      t.last_message_date &&
      new Date(t.last_message_date) > thirtyDaysAgo
    ).length;

    // 10. Client Health Distribution
    const healthDistribution = {
      expansion_ready: playbooks => playbooks.filter(p => p.account_health_status === 'expansion_ready').length,
      healthy: playbooks => playbooks.filter(p => p.account_health_status === 'healthy').length,
      growing: playbooks => playbooks.filter(p => p.account_health_status === 'growing').length,
      needs_attention: playbooks => playbooks.filter(p => p.account_health_status === 'needs_attention').length,
      at_risk: playbooks => playbooks.filter(p => p.account_health_status === 'at_risk').length
    };

    // 11. Owner Action Queue (high priority items)
    const ownerActions = [];

    // Add critical SLA breaches
    slaEvents.filter(e => e.severity === 'critical' && e.status === 'breached').forEach(breach => {
      const company = companies.find(c => c.id === breach.company_id);
      if (company) {
        ownerActions.push({
          type: 'sla_critical',
          company_id: breach.company_id,
          company_name: company.name,
          urgency: 'critical',
          title: `Critical SLA Breach: ${breach.event_type}`,
          notes: breach.notes,
          created_date: breach.created_date
        });
      }
    });

    // Add rescue playbooks
    atRiskPlaybooks.slice(0, 5).forEach(pb => {
      const company = companies.find(c => c.id === pb.company_id);
      if (company) {
        ownerActions.push({
          type: 'rescue_playbook',
          company_id: pb.company_id,
          company_name: company.name,
          urgency: 'high',
          title: `${pb.playbook_type === 'rescue' ? 'Account Rescue' : 'Churn Risk'}: ${company.name}`,
          notes: pb.summary,
          created_date: pb.created_date
        });
      }
    });

    // Add high-value proposals close to decision
    viewedProposals.filter(p => p.estimated_value > 50000).slice(0, 3).forEach(prop => {
      const company = companies.find(c => c.id === prop.company_id);
      if (company) {
        ownerActions.push({
          type: 'proposal_viewed',
          company_id: prop.company_id,
          company_name: company.name,
          urgency: 'high',
          title: `High-Value Proposal Viewed: ${prop.title}`,
          notes: `Value: $${prop.estimated_value.toLocaleString()}`,
          created_date: prop.last_viewed_date
        });
      }
    });

    // Add approaching renewals
    upcomingRenewals.filter(r => r.confidence_score > 70).slice(0, 3).forEach(renewal => {
      const company = companies.find(c => c.id === renewal.company_id);
      if (company) {
        ownerActions.push({
          type: 'renewal_due',
          company_id: renewal.company_id,
          company_name: company.name,
          urgency: 'medium',
          title: `Renewal Approaching: ${company.name}`,
          notes: `Due: ${renewal.due_date}`,
          created_date: renewal.created_date
        });
      }
    });

    // Add overdue strategy reviews
    strategyReviews.filter(sr => 
      sr.scheduled_date && 
      new Date(sr.scheduled_date) < now &&
      sr.status !== 'completed'
    ).slice(0, 3).forEach(review => {
      const company = companies.find(c => c.id === review.company_id);
      if (company) {
        ownerActions.push({
          type: 'overdue_review',
          company_id: review.company_id,
          company_name: company.name,
          urgency: 'medium',
          title: `Overdue Strategy Review: ${company.name}`,
          notes: `Scheduled: ${review.scheduled_date}`,
          created_date: review.created_date
        });
      }
    });

    // Sort by urgency and recency
    ownerActions.sort((a, b) => {
      const urgencyMap = { critical: 3, high: 2, medium: 1, low: 0 };
      if (urgencyMap[b.urgency] !== urgencyMap[a.urgency]) {
        return urgencyMap[b.urgency] - urgencyMap[a.urgency];
      }
      return new Date(b.created_date) - new Date(a.created_date);
    });

    // 12. Account Spotlights
    const spotlights = {
      strongest_growth: null,
      biggest_rescue_risk: null,
      biggest_upsell: null,
      most_operationally_blocked: null
    };

    // Strongest growth
    const growthAccounts = successPlaybooks.filter(p => p.account_health_status === 'growing' && p.upsell_readiness === 'strong');
    if (growthAccounts.length > 0) {
      const top = growthAccounts[0];
      const company = companies.find(c => c.id === top.company_id);
      if (company) {
        spotlights.strongest_growth = {
          company_id: top.company_id,
          company_name: company.name,
          reason: 'High growth and upsell ready',
          metric: `Health: ${top.account_health_status}`,
          confidence: top.confidence_score
        };
      }
    }

    // Biggest rescue risk
    const rescueRisks = successPlaybooks.filter(p => p.churn_risk_level === 'critical');
    if (rescueRisks.length > 0) {
      const top = rescueRisks[0];
      const company = companies.find(c => c.id === top.company_id);
      if (company) {
        spotlights.biggest_rescue_risk = {
          company_id: top.company_id,
          company_name: company.name,
          reason: 'Critical churn risk',
          metric: `Risk Level: ${top.churn_risk_level}`,
          confidence: top.confidence_score
        };
      }
    }

    // Biggest upsell opportunity
    const topUpsell = upsellOpps.sort((a, b) => (b.potential_value_estimate || 0) - (a.potential_value_estimate || 0))[0];
    if (topUpsell) {
      const company = companies.find(c => c.id === topUpsell.company_id);
      if (company) {
        spotlights.biggest_upsell = {
          company_id: topUpsell.company_id,
          company_name: company.name,
          reason: 'Highest upsell potential',
          metric: `Value: $${topUpsell.potential_value_estimate?.toLocaleString()}`,
          confidence: topUpsell.confidence_score
        };
      }
    }

    // Most operationally blocked
    const blockedAccounts = slaEvents.filter(e => e.status === 'breached').map(e => ({
      company_id: e.company_id,
      breach_count: 1
    }));
    const breachCounts = {};
    blockedAccounts.forEach(a => {
      breachCounts[a.company_id] = (breachCounts[a.company_id] || 0) + 1;
    });
    const mostBlocked = Object.entries(breachCounts).sort((a, b) => b[1] - a[1])[0];
    if (mostBlocked) {
      const company = companies.find(c => c.id === mostBlocked[0]);
      if (company) {
        spotlights.most_operationally_blocked = {
          company_id: mostBlocked[0],
          company_name: company.name,
          reason: 'Multiple SLA breaches',
          metric: `Breaches: ${mostBlocked[1]}`,
          confidence: 100
        };
      }
    }

    // 13. Urgent client requests
    const urgentRequests = clientRequests.filter(r => 
      r.status === 'pending' &&
      r.created_date &&
      new Date(now.getTime() - new Date(r.created_date)) > 24 * 60 * 60 * 1000
    ).length;

    return Response.json({
      timestamp: now,
      summary: {
        active_clients: activeClients,
        monthly_recurring_revenue: 0, // Would need subscription data
        pipeline_value: totalPipelineValue,
        renewal_revenue_30d: upcomingRenewals.filter(r => 
          new Date(r.due_date) <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        ).reduce((sum, r) => sum + (r.potential_value_estimate || 0), 0),
        renewal_revenue_90d: renewalValue,
        upsell_opportunities_count: upsellOpps.length,
        upsell_value: upsellValue,
        at_risk_accounts: atRiskCount,
        active_fulfillment_workrooms: activeFulfillmentWorkrooms,
        active_onboarding_workrooms: activeOnboardingWorkrooms,
        critical_sla_breaches: criticalBreaches,
        total_sla_breaches: totalBreaches,
        reports_ready: reportsReady,
        reports_published: reportsPublished,
        unread_messages: unreadMessages,
        urgent_client_requests: urgentRequests,
        proposals_sent: sentProposals.length,
        proposals_viewed: viewedProposals.length,
        proposals_accepted: acceptedProposals.length
      },
      health_distribution: {
        expansion_ready: healthDistribution.expansion_ready(successPlaybooks),
        healthy: healthDistribution.healthy(successPlaybooks),
        growing: healthDistribution.growing(successPlaybooks),
        needs_attention: healthDistribution.needs_attention(successPlaybooks),
        at_risk: healthDistribution.at_risk(successPlaybooks)
      },
      owner_action_queue: ownerActions.slice(0, 15),
      spotlights: spotlights,
      metadata: {
        companies_total: companies.length,
        proposals_total: proposals.length,
        success_playbooks_active: successPlaybooks.length,
        strategy_reviews_active: strategyReviews.length
      }
    });

  } catch (error) {
    console.error('Error fetching executive summary:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
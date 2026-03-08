import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Autonomous Revenue Engine
 * Analyzes all revenue signals and automatically moves opportunities forward
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { scope_type = 'platform', scope_id = null } = body;

    // Gather all revenue-relevant signals
    const signals = await gatherRevenueSignals(base44, scope_type, scope_id);

    // Detect revenue opportunities from signals
    const opportunities = detectRevenueOpportunities(signals);

    // Create or update RevenueOpportunities
    const created = await persistRevenueOpportunities(base44, opportunities);

    // Launch or update RevenueSequences
    const sequences = await launchRevenueSequences(base44, created);

    // Create internal tasks and alerts
    await createRevenueActions(base44, created);

    // Escalate high-priority items to Copilot
    await escalateToCopilot(base44, created);

    return Response.json({
      status: 'success',
      opportunities_detected: opportunities.length,
      opportunities_created: created.length,
      sequences_launched: sequences.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// SIGNAL GATHERING
// ═══════════════════════════════════════════════════════════════════════════════

async function gatherRevenueSignals(base44, scope_type, scope_id) {
  const signals = {
    growth_opportunities: [],
    unified_recommendations: [],
    renewal_signals: [],
    success_playbooks: [],
    strategy_reviews: [],
    proposals: [],
    proposal_views: [],
    kpi_history: [],
    messages: [],
    deliverables: [],
    executive_reports: []
  };

  try {
    // Growth opportunities
    signals.growth_opportunities = await base44.asServiceRole.entities.GrowthOpportunities.list('-priority');

    // Unified recommendations (high priority)
    signals.unified_recommendations = await base44.asServiceRole.entities.UnifiedRecommendations.filter({
      status: { $in: ['new', 'queued', 'acknowledged'] },
      priority_score: { $gte: 50 }
    });

    // Renewal signals
    signals.renewal_signals = await base44.asServiceRole.entities.RenewalSignals.filter({
      signal_status: 'active'
    });

    // Success playbooks
    signals.success_playbooks = await base44.asServiceRole.entities.SuccessPlaybooks.filter({
      status: { $in: ['draft', 'active'] }
    });

    // Strategy reviews
    signals.strategy_reviews = await base44.asServiceRole.entities.StrategyReviews.filter({
      status: 'completed'
    }).then(r => r.slice(0, 100));

    // Proposals (sent, viewed, stalled)
    signals.proposals = await base44.asServiceRole.entities.Proposals.list('-updated_date', 500);

    // KPI history (for account health trends)
    signals.kpi_history = await base44.asServiceRole.entities.KPIHistory.list('-created_date', 200);

    // Messages (activity indicator)
    signals.messages = await base44.asServiceRole.entities.Messages.list('-created_date', 100);

    // Deliverables (results wins)
    signals.deliverables = await base44.asServiceRole.entities.Deliverables.filter({
      status: 'delivered'
    }).then(d => d.slice(0, 50));

    // Executive reports (signal major account changes)
    signals.executive_reports = await base44.asServiceRole.entities.ExecutiveReports.list('-created_date', 20);
  } catch (error) {
    console.error('Signal gathering error:', error);
  }

  return signals;
}

// ═══════════════════════════════════════════════════════════════════════════════
// OPPORTUNITY DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

function detectRevenueOpportunities(signals) {
  const opportunities = [];
  const seen = new Set();

  // 1. RENEWAL MOTIONS
  signals.renewal_signals.forEach(sig => {
    if (sig.company_id && sig.renewal_likelihood !== 'likely') {
      const key = `renewal_${sig.company_id}`;
      if (!seen.has(key)) {
        opportunities.push({
          company_id: sig.company_id,
          opportunity_type: 'renewal',
          revenue_motion_type: 'renewal_motion',
          title: `Renewal Motion: ${sig.signal_label}`,
          summary: sig.signal_value,
          probability_score: mapRenewalProbability(sig.renewal_likelihood),
          urgency_level: mapRenewalUrgency(sig.renewal_likelihood),
          stage: 'detected',
          related_unified_recommendation_id: null,
          source: 'renewal_signal'
        });
        seen.add(key);
      }
    }
  });

  // 2. UPSELL / EXPANSION MOTIONS
  signals.unified_recommendations.forEach(rec => {
    if ((rec.recommendation_type === 'upsell' || rec.recommendation_type === 'expansion') && rec.company_id) {
      const key = `upsell_${rec.company_id}`;
      if (!seen.has(key) && rec.priority_score >= 65) {
        opportunities.push({
          company_id: rec.company_id,
          opportunity_type: rec.recommendation_type === 'expansion' ? 'expansion' : 'upsell',
          revenue_motion_type: 'create_proposal',
          title: rec.title,
          summary: rec.summary,
          recommended_offer: rec.recommended_action,
          probability_score: rec.confidence_score,
          urgency_level: rec.urgency_level,
          stage: 'detected',
          related_unified_recommendation_id: rec.id,
          source: 'unified_recommendation'
        });
        seen.add(key);
      }
    }
  });

  // 3. PROPOSAL FOLLOW-UP MOTIONS
  signals.proposals.forEach(prop => {
    if (prop.status === 'sent' && prop.company_id) {
      const viewCount = prop.view_count || 0;
      const daysSinceSent = daysDiff(new Date(), new Date(prop.sent_date));

      if (viewCount > 2 && daysSinceSent > 3) {
        const key = `followup_${prop.id}`;
        if (!seen.has(key)) {
          opportunities.push({
            company_id: prop.company_id,
            opportunity_type: 'proposal_followup',
            revenue_motion_type: 'followup_sequence',
            title: `Follow-up: ${prop.proposal_title}`,
            summary: `Proposal viewed ${viewCount} times, no response in ${daysSinceSent} days`,
            estimated_value: prop.total_value,
            probability_score: Math.min(85, 60 + viewCount * 5),
            urgency_level: daysSinceSent > 7 ? 'high' : 'medium',
            stage: 'contacted',
            related_proposal_id: prop.id,
            source: 'proposal_activity'
          });
          seen.add(key);
        }
      }
    }
  });

  // 4. STALLED DEAL RECOVERY
  signals.proposals.forEach(prop => {
    if (prop.status === 'sent' && prop.company_id) {
      const daysSinceSent = daysDiff(new Date(), new Date(prop.sent_date));
      
      if (daysSinceSent > 14) {
        const key = `stalled_${prop.id}`;
        if (!seen.has(key)) {
          opportunities.push({
            company_id: prop.company_id,
            opportunity_type: 'stalled_deal',
            revenue_motion_type: 'recovery',
            title: `Stalled Deal Recovery: ${prop.proposal_title}`,
            summary: `Proposal sent ${daysSinceSent} days ago with no movement`,
            estimated_value: prop.total_value,
            probability_score: 40,
            urgency_level: 'high',
            stage: 'awaiting_response',
            related_proposal_id: prop.id,
            owner_action_required: true,
            source: 'proposal_stalled'
          });
          seen.add(key);
        }
      }
    }
  });

  // 5. RESCUE RECOVERY MOTIONS
  signals.success_playbooks.forEach(pb => {
    if (pb.playbook_type === 'rescue' && pb.account_health_status === 'healthy') {
      const key = `rescue_recovery_${pb.company_id}`;
      if (!seen.has(key)) {
        opportunities.push({
          company_id: pb.company_id,
          opportunity_type: 'rescue_recovery',
          revenue_motion_type: 'prepare_review',
          title: `Rescue Recovery: Account Stabilized`,
          summary: `Account recovered to healthy status. Ready for expanded offer discussion.`,
          probability_score: 70,
          urgency_level: 'medium',
          stage: 'prepared',
          related_playbook_id: pb.id,
          source: 'playbook_recovery'
        });
        seen.add(key);
      }
    }
  });

  // 6. REACTIVATION MOTIONS
  signals.growth_opportunities.forEach(go => {
    if (go.opportunity_type === 'reactivation' && go.company_id) {
      const key = `reactivation_${go.company_id}`;
      if (!seen.has(key)) {
        opportunities.push({
          company_id: go.company_id,
          opportunity_type: 'reactivation',
          revenue_motion_type: 'start_outreach',
          title: `Reactivation: ${go.title}`,
          summary: go.description,
          probability_score: go.confidence_score || 55,
          urgency_level: 'medium',
          stage: 'detected',
          related_growth_opportunity_id: go.id,
          source: 'growth_engine'
        });
        seen.add(key);
      }
    }
  });

  return opportunities;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PERSISTENCE
// ═══════════════════════════════════════════════════════════════════════════════

async function persistRevenueOpportunities(base44, opportunities) {
  const created = [];

  for (const opp of opportunities) {
    try {
      // Check for existing equivalent
      const existing = await base44.asServiceRole.entities.RevenueOpportunities.filter({
        company_id: opp.company_id,
        opportunity_type: opp.opportunity_type,
        status: { $nin: ['won', 'lost', 'dismissed'] }
      });

      if (existing.length > 0) {
        // Update if exists
        await base44.asServiceRole.entities.RevenueOpportunities.update(existing[0].id, {
          summary: opp.summary,
          probability_score: opp.probability_score,
          urgency_level: opp.urgency_level,
          last_activity_date: new Date().toISOString()
        });
        created.push(existing[0]);
      } else {
        // Create new
        const newOpp = await base44.asServiceRole.entities.RevenueOpportunities.create({
          ...opp,
          status: 'new',
          auto_progression_enabled: true,
          next_action_date: calculateNextActionDate(opp)
        });
        created.push(newOpp);
      }
    } catch (error) {
      console.error('Error persisting opportunity:', error);
    }
  }

  return created;
}

async function launchRevenueSequences(base44, opportunities) {
  const sequences = [];

  for (const opp of opportunities) {
    try {
      // Check if active sequence exists
      const activeSeq = await base44.asServiceRole.entities.RevenueSequences.filter({
        revenue_opportunity_id: opp.id,
        status: { $in: ['active', 'paused'] }
      });

      if (activeSeq.length > 0) continue;

      // Create sequence based on opportunity type
      const template = getSequenceTemplate(opp.opportunity_type);
      if (!template) continue;

      const sequence = await base44.asServiceRole.entities.RevenueSequences.create({
        revenue_opportunity_id: opp.id,
        sequence_name: template.name,
        sequence_type: template.type,
        status: 'active',
        step_count: template.steps.length,
        current_step_index: 0,
        auto_run_enabled: opp.auto_progression_enabled
      });

      // Create sequence steps
      for (let i = 0; i < template.steps.length; i++) {
        const step = template.steps[i];
        await base44.asServiceRole.entities.RevenueSequenceSteps.create({
          revenue_sequence_id: sequence.id,
          step_order: i + 1,
          step_type: step.type,
          title: step.title,
          description: step.description,
          due_offset_days: step.due_offset_days || i * 3,
          requires_human_approval: step.requires_human_approval || false,
          action_status: 'pending'
        });
      }

      sequences.push(sequence);
    } catch (error) {
      console.error('Error launching sequence:', error);
    }
  }

  return sequences;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIONS & ESCALATIONS
// ═══════════════════════════════════════════════════════════════════════════════

async function createRevenueActions(base44, opportunities) {
  for (const opp of opportunities) {
    try {
      // Create initial task for human touch
      if (opp.stage === 'detected' || opp.stage === 'prepared') {
        await base44.asServiceRole.entities.SalesTasks.create({
          company_id: opp.company_id,
          task_type: mapTaskType(opp.opportunity_type),
          title: `${opp.opportunity_type.toUpperCase()}: ${opp.title}`,
          description: opp.summary,
          priority: opp.urgency_level === 'critical' ? 'high' : 'medium',
          status: 'pending',
          due_date: opp.next_action_date,
          internal_note: `Auto-created by Revenue Engine. Probability: ${opp.probability_score}%`
        });
      }

      // Create alert for critical situations
      if (opp.urgency_level === 'critical' && opp.estimated_value > 50000) {
        await base44.asServiceRole.entities.SalesNotifications.create({
          related_entity_type: 'RevenueOpportunities',
          related_entity_id: opp.id,
          notification_type: 'revenue_alert',
          title: `CRITICAL: ${opp.title}`,
          message: opp.summary,
          severity: 'critical',
          status: 'unread'
        });
      }
    } catch (error) {
      console.error('Error creating revenue actions:', error);
    }
  }
}

async function escalateToCopilot(base44, opportunities) {
  const highPriority = opportunities.filter(o =>
    (o.estimated_value > 100000 || o.urgency_level === 'critical') &&
    o.owner_action_required
  );

  for (const opp of highPriority) {
    try {
      // Create copilot insight
      await base44.asServiceRole.entities.CopilotInsights.create({
        copilot_brief_id: 'default', // Will need to match actual brief
        insight_type: 'revenue_opportunity',
        title: opp.title,
        description: opp.summary,
        priority: opp.urgency_level,
        severity: opp.urgency_level === 'critical' ? 'critical' : 'warning',
        related_entity_type: 'RevenueOpportunities',
        related_entity_id: opp.id
      });

      // Create action queue item
      await base44.asServiceRole.entities.CopilotActionQueue.create({
        copilot_brief_id: 'default',
        action_title: opp.title,
        action_type: 'review_account',
        description: opp.summary,
        priority: opp.urgency_level,
        owner_type: 'owner',
        related_entity_type: 'RevenueOpportunities',
        related_entity_id: opp.id,
        sort_order: opp.estimated_value || 0
      });
    } catch (error) {
      console.error('Error escalating to copilot:', error);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEQUENCE TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

function getSequenceTemplate(opportunity_type) {
  const templates = {
    renewal: {
      name: 'Renewal Sequence',
      type: 'renewal_sequence',
      steps: [
        { type: 'create_task', title: 'Check Renewal Readiness', description: 'Verify account health and renewal terms', due_offset_days: 0 },
        { type: 'create_review', title: 'Create Renewal Review', description: 'Prepare strategy review for renewal discussion', due_offset_days: 2, requires_human_approval: true },
        { type: 'create_proposal_draft', title: 'Prepare Proposal Draft', description: 'Create renewal proposal draft', due_offset_days: 5, requires_human_approval: true },
        { type: 'create_task', title: 'Schedule Renewal Call', description: 'Schedule discussion with client', due_offset_days: 7 },
        { type: 'followup_check', title: 'Follow-up Check', description: 'Verify proposal received and discussed', due_offset_days: 10 }
      ]
    },
    upsell: {
      name: 'Upsell Sequence',
      type: 'upsell_sequence',
      steps: [
        { type: 'create_task', title: 'Confirm Account Health', description: 'Verify account is ready for expansion', due_offset_days: 0 },
        { type: 'create_review', title: 'Strategy Review', description: 'Create strategy review for upsell discussion', due_offset_days: 3, requires_human_approval: true },
        { type: 'create_proposal_draft', title: 'Prepare Upsell Proposal', description: 'Draft expanded scope proposal', due_offset_days: 6, requires_human_approval: true },
        { type: 'create_task', title: 'Schedule Discussion', description: 'Book call to present expansion', due_offset_days: 8 },
        { type: 'followup_check', title: 'Follow-up', description: 'Check proposal feedback', due_offset_days: 12 }
      ]
    },
    proposal_followup: {
      name: 'Proposal Follow-up Sequence',
      type: 'proposal_followup_sequence',
      steps: [
        { type: 'create_task', title: 'Initial Follow-up', description: 'Reach out to check proposal status', due_offset_days: 0, requires_human_approval: true },
        { type: 'followup_check', title: 'Check Activity', description: 'Monitor proposal views and engagement', due_offset_days: 3 },
        { type: 'create_task', title: 'Second Follow-up', description: 'Escalate if no response', due_offset_days: 7, requires_human_approval: true },
        { type: 'escalate_owner', title: 'Owner Alert', description: 'Escalate stalled deal to owner', due_offset_days: 10, requires_human_approval: true }
      ]
    },
    reactivation: {
      name: 'Reactivation Sequence',
      type: 'reactivation_sequence',
      steps: [
        { type: 'create_task', title: 'Review History', description: 'Analyze past engagement and wins', due_offset_days: 0 },
        { type: 'create_task', title: 'Outreach', description: 'Initial reactivation outreach', due_offset_days: 2, requires_human_approval: true },
        { type: 'followup_check', title: 'Follow-up', description: 'Check response and interest level', due_offset_days: 7 }
      ]
    },
    stalled_deal: {
      name: 'Deal Recovery Sequence',
      type: 'proposal_followup_sequence',
      steps: [
        { type: 'create_task', title: 'Recovery Outreach', description: 'Direct outreach to understand delay', due_offset_days: 0, requires_human_approval: true },
        { type: 'followup_check', title: 'Status Check', description: 'Verify deal status and next steps', due_offset_days: 3 },
        { type: 'escalate_owner', title: 'Owner Escalation', description: 'Escalate to owner if no progress', due_offset_days: 7, requires_human_approval: true }
      ]
    }
  };

  return templates[opportunity_type] || null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function mapRenewalProbability(likelihood) {
  const map = {
    at_risk: 30,
    unlikely: 40,
    uncertain: 60,
    likely: 85
  };
  return map[likelihood] || 50;
}

function mapRenewalUrgency(likelihood) {
  if (likelihood === 'at_risk') return 'critical';
  if (likelihood === 'unlikely') return 'high';
  if (likelihood === 'uncertain') return 'medium';
  return 'low';
}

function mapTaskType(opportunityType) {
  const map = {
    renewal: 'renewal_preparation',
    upsell: 'upsell_outreach',
    proposal_followup: 'follow_up',
    stalled_deal: 'deal_recovery',
    reactivation: 'reactivation'
  };
  return map[opportunityType] || 'general';
}

function calculateNextActionDate(opp) {
  const days = opp.urgency_level === 'critical' ? 1 :
               opp.urgency_level === 'urgent' ? 2 :
               opp.urgency_level === 'high' ? 3 : 7;
  
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

function daysDiff(d1, d2) {
  return Math.floor((d1 - d2) / (1000 * 60 * 60 * 24));
}
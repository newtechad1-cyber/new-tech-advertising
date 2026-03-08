import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Unified AI Recommendation Layer
 * Aggregates, normalizes, deduplicates, and prioritizes recommendations from all systems
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role === 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { scope_type, scope_id, role_target, period_start, period_end } = body;

    // Gather recommendations from all sources
    const sources = await gatherRecommendations(base44, {
      scope_type,
      scope_id,
      period_start,
      period_end
    });

    // Normalize recommendations
    const normalized = normalizeRecommendations(sources);

    // Deduplicate and merge overlapping recommendations
    const deduplicated = deduplicateAndMerge(normalized);

    // Calculate priority scores
    const scored = scorePriorities(deduplicated, base44);

    // Target recommendations to roles
    const roleTargeted = targetRoles(scored);

    // Filter by role if specified
    let final = roleTargeted;
    if (role_target) {
      final = roleTargeted.filter(r => r.role_target === role_target || r.role_target === 'shared');
    }

    // Create/update unified recommendations in database
    const results = await createUnifiedRecommendations(base44, final);

    // Generate bundles
    await generateRecommendationBundles(base44, final);

    return Response.json({
      status: 'success',
      recommendations_created: results.length,
      bundles_generated: true,
      sample_top_3: final.slice(0, 3).map(r => ({
        title: r.title,
        type: r.recommendation_type,
        priority: r.priority_score,
        role: r.role_target
      }))
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// SOURCE INGESTION
// ═══════════════════════════════════════════════════════════════════════════════

async function gatherRecommendations(base44, filters) {
  const sources = {};

  // Growth Engine
  sources.growth = await base44.asServiceRole.entities.GrowthOpportunities.list();

  // Success Playbooks
  sources.playbooks = await base44.asServiceRole.entities.SuccessPlaybooks.list();
  sources.playbook_signals = await base44.asServiceRole.entities.PlaybookSignals.list();
  sources.playbook_actions = await base44.asServiceRole.entities.PlaybookActions.list();

  // Strategy Reviews
  sources.strategy_reviews = await base44.asServiceRole.entities.StrategyReviews.list();
  sources.strategy_decisions = await base44.asServiceRole.entities.StrategyReviewDecisions.list();

  // Optimizer
  sources.optimization_opportunities = await base44.asServiceRole.entities.OptimizationOpportunities.list();
  sources.optimization_signals = await base44.asServiceRole.entities.OptimizationSignals.list();

  // Executive Copilot
  sources.copilot_briefs = await base44.asServiceRole.entities.CopilotBriefs.list();
  sources.copilot_insights = await base44.asServiceRole.entities.CopilotInsights.list();
  sources.copilot_actions = await base44.asServiceRole.entities.CopilotActionQueue.list();

  // Workflow Orchestrator
  sources.orchestrations = await base44.asServiceRole.entities.WorkflowOrchestrations.list();
  sources.workflow_runs = await base44.asServiceRole.entities.WorkflowRuns.list();

  // SLA & Operations
  sources.sla_events = await base44.asServiceRole.entities.SLAEvents.list();

  // Renewal Signals
  sources.renewal_signals = await base44.asServiceRole.entities.RenewalSignals.list();

  // Service Recommendations
  sources.service_recommendations = await base44.asServiceRole.entities.ServiceRecommendations.list();

  return sources;
}

// ═══════════════════════════════════════════════════════════════════════════════
// NORMALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

function normalizeRecommendations(sources) {
  const normalized = [];

  // Growth opportunities
  sources.growth.forEach(g => {
    normalized.push({
      source: 'growth_engine',
      entity_type: 'GrowthOpportunities',
      entity_id: g.id,
      company_id: g.company_id,
      type: mapGrowthType(g.opportunity_type),
      title: g.title,
      summary: g.description,
      action: g.recommended_next_step || 'Review opportunity',
      urgency: mapUrgency(g.priority),
      impact: g.impact_level,
      confidence: g.confidence_score || 70,
      signals: []
    });
  });

  // Success playbooks
  sources.playbooks.forEach(p => {
    normalized.push({
      source: 'success_playbook',
      entity_type: 'SuccessPlaybooks',
      entity_id: p.id,
      company_id: p.company_id,
      type: mapPlaybookType(p.playbook_type),
      title: p.title,
      summary: p.summary,
      action: p.recommended_actions_summary || 'Execute playbook',
      urgency: mapPlaybookUrgency(p.account_health_status),
      impact: 'high',
      confidence: p.confidence_score || 75,
      signals: []
    });
  });

  // Strategy reviews with pending decisions
  sources.strategy_reviews.forEach(r => {
    if (r.status === 'completed' && r.review_outcome !== 'continue_current_plan') {
      normalized.push({
        source: 'strategy_review',
        entity_type: 'StrategyReviews',
        entity_id: r.id,
        company_id: r.company_id,
        type: 'review',
        title: 'Follow-up: ' + r.review_title,
        summary: 'Review outcome: ' + r.review_outcome,
        action: r.next_steps_summary || 'Execute review outcomes',
        urgency: 'high',
        impact: 'high',
        confidence: 80,
        signals: []
      });
    }
  });

  // Optimization opportunities
  sources.optimization_opportunities.forEach(o => {
    if (o.status === 'new' || o.status === 'reviewing') {
      normalized.push({
        source: 'optimizer',
        entity_type: 'OptimizationOpportunities',
        entity_id: o.id,
        company_id: o.company_id,
        type: o.optimization_type,
        title: o.title,
        summary: o.recommendation_summary,
        action: 'Review and implement optimization',
        urgency: o.priority,
        impact: o.impact_potential,
        confidence: o.confidence_score,
        signals: []
      });
    }
  });

  // Copilot insights
  sources.copilot_insights.forEach(i => {
    if (i.visible_in_brief) {
      normalized.push({
        source: 'executive_copilot',
        entity_type: 'CopilotInsights',
        entity_id: i.id,
        company_id: i.related_company_id,
        type: mapInsightType(i.insight_type),
        title: i.title,
        summary: i.description,
        action: i.recommended_action || 'Review insight',
        urgency: i.priority,
        impact: mapInsightImpact(i.severity),
        confidence: 75,
        signals: []
      });
    }
  });

  // SLA breaches
  sources.sla_events.forEach(e => {
    if (e.status === 'breached' && e.severity !== 'low') {
      normalized.push({
        source: 'sla_engine',
        entity_type: 'SLAEvents',
        entity_id: e.id,
        company_id: e.company_id,
        type: 'approval',
        title: mapSLATitle(e.event_type),
        summary: 'SLA breach: ' + e.event_type,
        action: 'Resolve SLA breach',
        urgency: e.severity,
        impact: 'high',
        confidence: 90,
        signals: []
      });
    }
  });

  // Renewal signals
  sources.renewal_signals.forEach(s => {
    if (s.signal_status === 'active' && s.renewal_likelihood !== 'likely') {
      normalized.push({
        source: 'growth_engine',
        entity_type: 'RenewalSignals',
        entity_id: s.id,
        company_id: s.company_id,
        type: 'renewal',
        title: 'Renewal Risk: ' + s.signal_label,
        summary: s.signal_value,
        action: 'Schedule renewal conversation',
        urgency: mapRenewalUrgency(s.renewal_likelihood),
        impact: 'significant',
        confidence: 80,
        signals: []
      });
    }
  });

  return normalized;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEDUPLICATION & MERGING
// ═══════════════════════════════════════════════════════════════════════════════

function deduplicateAndMerge(recommendations) {
  const merged = [];
  const grouped = {};

  // Group by company + normalized type + root issue
  recommendations.forEach(r => {
    const key = `${r.company_id}||${normalizeType(r.type)}||${normalizeIssue(r)}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(r);
  });

  // Merge groups
  Object.values(grouped).forEach(group => {
    if (group.length === 1) {
      merged.push(group[0]);
    } else {
      // Multiple sources for same issue → merge
      const strongest = group.reduce((prev, curr) =>
        (curr.confidence * (curr.urgency === 'critical' ? 1.5 : 1)) >
        (prev.confidence * (prev.urgency === 'critical' ? 1.5 : 1))
          ? curr
          : prev
      );

      merged.push({
        ...strongest,
        confidence: Math.min(100, strongest.confidence + (group.length - 1) * 5),
        merged_sources: group.map(g => g.source),
        signals: group
      });
    }
  });

  return merged;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRIORITY SCORING
// ═══════════════════════════════════════════════════════════════════════════════

function scorePriorities(recommendations, base44) {
  const urgencyWeights = { critical: 40, urgent: 30, high: 20, medium: 10, low: 5 };
  const impactWeights = { significant: 35, high: 25, medium: 15, low: 5 };

  return recommendations.map(r => {
    let score = 0;

    // Urgency component (40%)
    score += urgencyWeights[r.urgency] || 5;

    // Impact component (35%)
    score += impactWeights[r.impact] || 5;

    // Confidence component (20%)
    score += (r.confidence / 100) * 20;

    // Signal stack bonus (5%)
    const signalCount = r.signals?.length || 0;
    score += Math.min(5, signalCount * 0.5);

    // Cap at 100
    score = Math.min(100, Math.max(0, score));

    return {
      ...r,
      priority_score: Math.round(score)
    };
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROLE TARGETING
// ═══════════════════════════════════════════════════════════════════════════════

function targetRoles(recommendations) {
  return recommendations.map(r => {
    let role = 'shared';

    // Heuristics for role targeting
    if (r.type === 'renewal' || r.type === 'upsell') {
      role = r.priority_score >= 75 ? 'owner' : 'sales';
    } else if (r.type === 'rescue') {
      role = 'client_success';
    } else if (r.type === 'approval' || r.type === 'fulfillment') {
      role = 'fulfillment';
    } else if (r.type === 'operations') {
      role = 'operations';
    } else if (r.urgency === 'critical' || r.priority_score >= 85) {
      role = 'owner';
    } else if (r.type === 'proposal') {
      role = 'sales';
    } else if (r.type === 'review') {
      role = 'client_success';
    }

    return {
      ...r,
      role_target: role
    };
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATABASE PERSISTENCE
// ═══════════════════════════════════════════════════════════════════════════════

async function createUnifiedRecommendations(base44, recommendations) {
  const results = [];

  for (const rec of recommendations) {
    try {
      // Check for existing
      const existing = await base44.asServiceRole.entities.UnifiedRecommendations.filter({
        company_id: rec.company_id,
        recommendation_type: rec.type,
        status: { $in: ['new', 'queued', 'acknowledged'] }
      });

      if (existing.length > 0) {
        // Update existing
        await base44.asServiceRole.entities.UnifiedRecommendations.update(existing[0].id, {
          confidence_score: rec.confidence,
          priority_score: rec.priority_score,
          summary: rec.summary
        });
        results.push(existing[0].id);
      } else {
        // Create new
        const created = await base44.asServiceRole.entities.UnifiedRecommendations.create({
          company_id: rec.company_id,
          recommendation_type: rec.type,
          recommendation_source: rec.source,
          source_entity_type: rec.entity_type,
          source_entity_id: rec.entity_id,
          title: rec.title,
          summary: rec.summary,
          recommended_action: rec.action,
          role_target: rec.role_target,
          urgency_level: rec.urgency,
          impact_level: rec.impact,
          confidence_score: rec.confidence,
          priority_score: rec.priority_score,
          status: 'new',
          visible_to_client: false
        });
        results.push(created.id);

        // Create signals
        if (rec.merged_sources) {
          rec.merged_sources.forEach((src, idx) => {
            base44.asServiceRole.entities.RecommendationSignals.create({
              unified_recommendation_id: created.id,
              signal_source: src,
              signal_type: rec.type,
              signal_label: rec.title,
              signal_value: rec.summary,
              weight_value: 1
            });
          });
        }
      }
    } catch (error) {
      console.error('Error creating recommendation:', error);
    }
  }

  return results;
}

async function generateRecommendationBundles(base44, recommendations) {
  const bundleTypes = ['owner_queue', 'sales_queue', 'fulfillment_queue', 'operations_queue'];

  for (const bundleType of bundleTypes) {
    const roleMap = {
      owner_queue: 'owner',
      sales_queue: 'sales',
      fulfillment_queue: 'fulfillment',
      operations_queue: 'operations'
    };

    const filtered = recommendations.filter(r => r.role_target === roleMap[bundleType] || r.role_target === 'shared');

    if (filtered.length > 0) {
      const bundle = await base44.asServiceRole.entities.RecommendationBundles.create({
        bundle_name: `${bundleType} - ${new Date().toLocaleDateString()}`,
        bundle_type: bundleType,
        role_target: roleMap[bundleType],
        summary: `${filtered.length} recommendations for ${roleMap[bundleType]}`,
        priority_score: Math.round(filtered.reduce((sum, r) => sum + r.priority_score, 0) / filtered.length),
        status: 'active'
      });

      // Add items to bundle
      for (let i = 0; i < filtered.length; i++) {
        await base44.asServiceRole.entities.RecommendationBundleItems.create({
          recommendation_bundle_id: bundle.id,
          unified_recommendation_id: filtered[i].id,
          sort_order: i + 1
        });
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAPPING & NORMALIZATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function mapGrowthType(type) {
  const map = {
    renewal_opportunity: 'renewal',
    upsell_opportunity: 'upsell',
    retention_risk: 'rescue',
    service_recommendation: 'growth'
  };
  return map[type] || 'growth';
}

function mapPlaybookType(type) {
  const map = {
    retention: 'rescue',
    renewal: 'renewal',
    expansion: 'upsell',
    rescue: 'rescue'
  };
  return map[type] || 'growth';
}

function mapUrgency(priority) {
  const map = { low: 'low', medium: 'medium', high: 'high', urgent: 'urgent' };
  return map[priority] || 'medium';
}

function mapPlaybookUrgency(health) {
  if (health === 'at_risk') return 'urgent';
  if (health === 'needs_attention') return 'high';
  return 'medium';
}

function mapInsightType(type) {
  const map = {
    revenue_opportunity: 'growth',
    churn_risk: 'rescue',
    operational_risk: 'operations',
    renewal_window: 'renewal'
  };
  return map[type] || 'growth';
}

function mapInsightImpact(severity) {
  const map = { informational: 'low', warning: 'medium', critical: 'high' };
  return map[severity] || 'medium';
}

function mapSLATitle(event) {
  const map = {
    response_breached: 'Response SLA Breached',
    task_overdue: 'Task Overdue',
    approval_blocked: 'Approval Blocked'
  };
  return map[event] || 'SLA Breach';
}

function mapRenewalUrgency(likelihood) {
  if (likelihood === 'at_risk') return 'critical';
  if (likelihood === 'uncertain') return 'high';
  return 'medium';
}

function normalizeType(type) {
  return type.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function normalizeIssue(rec) {
  return rec.title.toLowerCase().replace(/[^a-z0-9]/g, '');
}
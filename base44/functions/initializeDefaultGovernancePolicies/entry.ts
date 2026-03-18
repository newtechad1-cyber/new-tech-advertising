import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Initialize Default Governance Policies
 * Creates sensible baseline policies for AI safety and control
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if policies already exist
    const existing = await base44.asServiceRole.entities.GovernancePolicies.list();
    if (existing.length > 0) {
      return Response.json({ status: 'policies_already_initialized', count: existing.length });
    }

    const createdPolicies = [];

    // Policy 1: Client-facing communication approval
    const commPolicy = await base44.asServiceRole.entities.GovernancePolicies.create({
      policy_name: 'Client-Facing Communication Approval',
      policy_type: 'communication_policy',
      description: 'AI cannot send client-facing messages automatically without approval. Internal messages and logs are allowed.',
      scope_type: 'global',
      active: true,
      enforcement_mode: 'require_approval',
      priority: 'critical',
      created_by_user_id: user.id
    });
    createdPolicies.push(commPolicy);

    // Rules for communication policy
    await base44.asServiceRole.entities.GovernanceRules.create({
      governance_policy_id: commPolicy.id,
      rule_name: 'Block Automated Client Messages',
      rule_category: 'client_messaging',
      action_type: 'send_client_message',
      trigger_condition: 'actor_type == "ai" || actor_type == "automation"',
      rule_effect: 'require_approval',
      human_approval_required: true,
      active: true
    });

    await base44.asServiceRole.entities.GovernanceRules.create({
      governance_policy_id: commPolicy.id,
      rule_name: 'Allow Internal Messages',
      rule_category: 'client_messaging',
      action_type: 'create_internal_task',
      trigger_condition: 'message_scope == "internal"',
      rule_effect: 'allow',
      active: true
    });

    // Policy 2: Proposal sending approval
    const proposalPolicy = await base44.asServiceRole.entities.GovernancePolicies.create({
      policy_name: 'Proposal Sending Controls',
      policy_type: 'proposal_policy',
      description: 'Proposal drafts may be created automatically. External proposal sending requires approval.',
      scope_type: 'global',
      active: true,
      enforcement_mode: 'require_approval',
      priority: 'critical',
      created_by_user_id: user.id
    });
    createdPolicies.push(proposalPolicy);

    await base44.asServiceRole.entities.GovernanceRules.create({
      governance_policy_id: proposalPolicy.id,
      rule_name: 'Require Approval for External Proposal Sending',
      rule_category: 'proposal_sending',
      action_type: 'send_proposal',
      trigger_condition: 'proposal_visibility == "external"',
      rule_effect: 'require_approval',
      human_approval_required: true,
      active: true
    });

    await base44.asServiceRole.entities.GovernanceRules.create({
      governance_policy_id: proposalPolicy.id,
      rule_name: 'Allow Proposal Draft Creation',
      rule_category: 'proposal_sending',
      action_type: 'create_proposal_draft',
      trigger_condition: 'proposal_status == "draft"',
      rule_effect: 'allow',
      active: true
    });

    // Policy 3: Revenue motion safety
    const revenuePolicy = await base44.asServiceRole.entities.GovernancePolicies.create({
      policy_name: 'Revenue Motion Safety',
      policy_type: 'revenue_policy',
      description: 'Revenue sequences may start internally. Client-facing steps require approval. Rescue accounts block aggressive automation.',
      scope_type: 'global',
      active: true,
      enforcement_mode: 'require_approval',
      priority: 'high',
      created_by_user_id: user.id
    });
    createdPolicies.push(revenuePolicy);

    await base44.asServiceRole.entities.GovernanceRules.create({
      governance_policy_id: revenuePolicy.id,
      rule_name: 'Require Approval for Client-Facing Revenue Steps',
      rule_category: 'revenue_motion',
      action_type: 'launch_sequence',
      trigger_condition: 'sequence_has_client_facing_steps == true',
      rule_effect: 'require_approval',
      human_approval_required: true,
      active: true
    });

    await base44.asServiceRole.entities.GovernanceRules.create({
      governance_policy_id: revenuePolicy.id,
      rule_name: 'Block Aggressive Upsell on Rescue Accounts',
      rule_category: 'revenue_motion',
      action_type: 'launch_sequence',
      trigger_condition: 'account_status == "rescue" && sequence_type == "upsell_sequence"',
      rule_effect: 'require_approval',
      human_approval_required: true,
      active: true
    });

    // Policy 4: Review/report publication
    const publicationPolicy = await base44.asServiceRole.entities.GovernancePolicies.create({
      policy_name: 'Review and Report Publication Control',
      policy_type: 'approval_policy',
      description: 'AI may prepare reports and review drafts. Publishing to client requires approval.',
      scope_type: 'global',
      active: true,
      enforcement_mode: 'require_approval',
      priority: 'high',
      created_by_user_id: user.id
    });
    createdPolicies.push(publicationPolicy);

    await base44.asServiceRole.entities.GovernanceRules.create({
      governance_policy_id: publicationPolicy.id,
      rule_name: 'Require Approval for Client Review Publication',
      rule_category: 'review_publication',
      action_type: 'publish_review',
      trigger_condition: 'target_audience == "client"',
      rule_effect: 'require_approval',
      human_approval_required: true,
      active: true
    });

    await base44.asServiceRole.entities.GovernanceRules.create({
      governance_policy_id: publicationPolicy.id,
      rule_name: 'Allow Draft Review Creation',
      rule_category: 'review_publication',
      action_type: 'create_review',
      trigger_condition: 'review_status == "draft"',
      rule_effect: 'allow',
      active: true
    });

    // Policy 5: Owner escalation
    const escalationPolicy = await base44.asServiceRole.entities.GovernancePolicies.create({
      policy_name: 'Owner Escalation Policy',
      policy_type: 'escalation_policy',
      description: 'Low/medium items do not auto-escalate. High/critical items may escalate based on rules.',
      scope_type: 'global',
      active: true,
      enforcement_mode: 'require_approval',
      priority: 'medium',
      created_by_user_id: user.id
    });
    createdPolicies.push(escalationPolicy);

    await base44.asServiceRole.entities.GovernanceRules.create({
      governance_policy_id: escalationPolicy.id,
      rule_name: 'Auto-Escalate Critical Revenue Opportunities',
      rule_category: 'escalation',
      action_type: 'escalate_owner',
      trigger_condition: 'urgency_level == "critical" && estimated_value > 100000',
      rule_effect: 'escalate_owner',
      active: true
    });

    // Policy 6: Client automation permissions
    const clientPolicy = await base44.asServiceRole.entities.GovernancePolicies.create({
      policy_name: 'Per-Client Automation Permission Policy',
      policy_type: 'client_policy',
      description: 'Different clients may have different automation permissions based on relationship and risk profile.',
      scope_type: 'company',
      active: true,
      enforcement_mode: 'monitor_only',
      priority: 'high',
      created_by_user_id: user.id
    });
    createdPolicies.push(clientPolicy);

    // Policy 7: Rollback capability
    const rollbackPolicy = await base44.asServiceRole.entities.GovernancePolicies.create({
      policy_name: 'Rollback Capability Preservation',
      policy_type: 'rollback_policy',
      description: 'Important AI actions must log state to allow rollback when feasible.',
      scope_type: 'global',
      active: true,
      enforcement_mode: 'monitor_only',
      priority: 'medium',
      created_by_user_id: user.id
    });
    createdPolicies.push(rollbackPolicy);

    await base44.asServiceRole.entities.GovernanceRules.create({
      governance_policy_id: rollbackPolicy.id,
      rule_name: 'Log State for Rollback',
      rule_category: 'rollback',
      action_type: 'launch_sequence',
      trigger_condition: 'sequence_type == "revenue_sequence" || sequence_type == "proposal_followup_sequence"',
      rule_effect: 'log_only',
      active: true
    });

    return Response.json({
      status: 'success',
      policies_created: createdPolicies.length,
      policies: createdPolicies.map(p => ({ id: p.id, name: p.policy_name }))
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
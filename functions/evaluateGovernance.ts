import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Governance Evaluation Gatekeeper
 * Called before important AI/automation actions to determine if allowed/blocked/approval-required
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const {
      action_type,
      related_entity_type,
      related_entity_id,
      company_id,
      actor_type = 'ai',
      actor_user_id = null,
      requested_payload = {}
    } = body;

    // Get applicable policies and rules
    const policies = await getApplicablePolicies(base44, action_type, related_entity_type, company_id);
    const rules = await getApplicableRules(base44, policies, action_type, related_entity_type);

    // Get automation permissions for scope
    const permissions = await getAutomationPermissions(base44, company_id, action_type);

    // Get company/account context if applicable
    const company = company_id ? await base44.asServiceRole.entities.Companies.filter({ id: company_id }).then(c => c[0]) : null;

    // Evaluate decision
    const decision = evaluateDecision(
      action_type,
      actor_type,
      policies,
      rules,
      permissions,
      company,
      requested_payload
    );

    // Log audit entry
    await createAuditLog(base44, action_type, related_entity_type, related_entity_id, company_id, actor_type, actor_user_id, decision);

    // Create approval request if needed
    if (decision.decision === 'approval_required') {
      const approvalReq = await createApprovalRequest(
        base44,
        action_type,
        related_entity_type,
        related_entity_id,
        company_id,
        actor_user_id,
        decision
      );
      decision.approval_request_id = approvalReq.id;
    }

    // Check for duplicate approval requests
    if (decision.decision === 'approval_required') {
      const existing = await checkDuplicateApprovalRequest(base44, action_type, related_entity_id, company_id);
      if (existing) {
        decision.duplicate_request_id = existing.id;
        decision.decision = 'duplicate_approval_pending';
      }
    }

    return Response.json(decision);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// POLICY & RULE RETRIEVAL
// ═══════════════════════════════════════════════════════════════════════════════

async function getApplicablePolicies(base44, action_type, entity_type, company_id) {
  try {
    // Get all active policies
    const allPolicies = await base44.asServiceRole.entities.GovernancePolicies.filter({
      active: true
    });

    // Filter by scope and applicability
    const applicable = allPolicies.filter(p => {
      // Global policies always apply
      if (p.scope_type === 'global') return true;

      // Company-specific policies
      if (p.scope_type === 'company' && p.scope_target_id === company_id) return true;

      // Action-type specific policies
      if (p.scope_type === 'action_type' && p.scope_target_id === action_type) return true;

      // Entity-type specific policies
      if (p.scope_type === 'entity_type' && p.scope_target_id === entity_type) return true;

      return false;
    });

    return applicable;
  } catch (error) {
    console.error('Error retrieving policies:', error);
    return [];
  }
}

async function getApplicableRules(base44, policies, action_type, entity_type) {
  try {
    const rules = [];

    for (const policy of policies) {
      const policyRules = await base44.asServiceRole.entities.GovernanceRules.filter({
        governance_policy_id: policy.id,
        active: true
      });

      rules.push(...policyRules);
    }

    return rules;
  } catch (error) {
    console.error('Error retrieving rules:', error);
    return [];
  }
}

async function getAutomationPermissions(base44, company_id, action_type) {
  try {
    const perms = await base44.asServiceRole.entities.AutomationPermissions.filter({
      active: true,
      action_type: action_type
    });

    // Filter by company if applicable
    if (company_id) {
      return perms.filter(p => !p.company_id || p.company_id === company_id);
    }

    return perms;
  } catch (error) {
    console.error('Error retrieving permissions:', error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DECISION EVALUATION
// ═══════════════════════════════════════════════════════════════════════════════

function evaluateDecision(action_type, actor_type, policies, rules, permissions, company, payload) {
  const decision = {
    decision: 'allowed',
    reason: 'No restrictions apply',
    policies_checked: [],
    rules_applied: [],
    requires_approval: false,
    escalate_to_owner: false,
    blocked: false,
    override_available: false
  };

  // Step 1: Check permission level
  if (permissions.length > 0) {
    const perm = permissions[0];

    if (perm.permission_level === 'blocked') {
      decision.decision = 'blocked';
      decision.reason = `Action blocked by automation permission for ${action_type}`;
      decision.blocked = true;
      return decision;
    }

    if (perm.permission_level === 'approval_required') {
      decision.decision = 'approval_required';
      decision.reason = `Automation permission requires approval for ${action_type}`;
      decision.requires_approval = true;
      decision.override_available = true;
      return decision;
    }

    if (perm.permission_level === 'restricted') {
      decision.decision = 'restricted';
      decision.reason = `Action restricted for this scope`;
      decision.blocked = false;
    }
  }

  // Step 2: Check applicable rules
  for (const rule of rules) {
    decision.policies_checked.push(rule.governance_policy_id);
    decision.rules_applied.push(rule.id);

    if (rule.rule_effect === 'block') {
      decision.decision = 'blocked';
      decision.reason = `Blocked by rule: ${rule.rule_name}`;
      decision.blocked = true;
      return decision;
    }

    if (rule.rule_effect === 'require_approval' || rule.human_approval_required) {
      decision.decision = 'approval_required';
      decision.reason = `Requires approval: ${rule.rule_name}`;
      decision.requires_approval = true;
      decision.override_available = true;
    }

    if (rule.rule_effect === 'escalate_owner') {
      decision.escalate_to_owner = true;
    }
  }

  // Step 3: High-value payload checks
  if (payload.estimated_value && payload.estimated_value > 100000) {
    // High-value actions may require additional scrutiny
    if (!decision.requires_approval && actor_type === 'ai') {
      decision.decision = 'approval_required';
      decision.reason = `High-value action ($${payload.estimated_value}) requires approval for AI actor`;
      decision.requires_approval = true;
      decision.override_available = true;
    }
  }

  // Step 4: Client-facing message checks
  if (action_type === 'send_client_message' || action_type === 'send_proposal') {
    if (!decision.requires_approval) {
      decision.decision = 'approval_required';
      decision.reason = `Client-facing ${action_type} requires approval`;
      decision.requires_approval = true;
      decision.override_available = true;
    }
  }

  return decision;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUDIT LOGGING
// ═══════════════════════════════════════════════════════════════════════════════

async function createAuditLog(base44, action_type, entity_type, entity_id, company_id, actor_type, actor_user_id, decision) {
  try {
    await base44.asServiceRole.entities.GovernanceAuditLog.create({
      event_type: 'governance_decision',
      action_type: action_type,
      related_entity_type: entity_type,
      related_entity_id: entity_id,
      company_id: company_id,
      actor_type: actor_type,
      actor_user_id: actor_user_id,
      decision_result: mapDecisionResult(decision.decision),
      decision_reason: decision.reason,
      rollback_available: !decision.blocked
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
}

function mapDecisionResult(decision) {
  const map = {
    allowed: 'allowed',
    approval_required: 'approval_requested',
    blocked: 'blocked',
    escalate_owner: 'logged',
    duplicate_approval_pending: 'logged'
  };
  return map[decision] || 'logged';
}

// ═══════════════════════════════════════════════════════════════════════════════
// APPROVAL REQUEST CREATION
// ═══════════════════════════════════════════════════════════════════════════════

async function createApprovalRequest(base44, action_type, entity_type, entity_id, company_id, requested_by, decision) {
  try {
    // Determine approver (for now, first admin user)
    const admins = await base44.asServiceRole.entities.User.filter({ role: 'admin' });
    const approver = admins.length > 0 ? admins[0] : null;

    if (!approver) {
      throw new Error('No admin users found to assign approval');
    }

    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 7); // 7-day expiry

    const approval = await base44.asServiceRole.entities.ApprovalRequests.create({
      request_type: action_type,
      related_entity_type: entity_type,
      related_entity_id: entity_id,
      company_id: company_id,
      requested_by_user_id: requested_by,
      assigned_approver_user_id: approver.id,
      title: `Approval: ${action_type}`,
      summary: decision.reason,
      approval_reason: decision.reason,
      priority: decision.blocked ? 'critical' : 'high',
      status: 'pending',
      expires_at: expireDate.toISOString()
    });

    return approval;
  } catch (error) {
    console.error('Error creating approval request:', error);
    throw error;
  }
}

async function checkDuplicateApprovalRequest(base44, action_type, entity_id, company_id) {
  try {
    const existing = await base44.asServiceRole.entities.ApprovalRequests.filter({
      request_type: action_type,
      related_entity_id: entity_id,
      company_id: company_id,
      status: 'pending'
    });

    return existing.length > 0 ? existing[0] : null;
  } catch (error) {
    return null;
  }
}
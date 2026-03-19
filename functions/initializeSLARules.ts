import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Check if default rules already exist
    const existingProfiles = await base44.asServiceRole.entities.SLAProfiles.list();
    if (existingProfiles.length > 0) {
      return Response.json({ message: 'SLA rules already initialized' }, { status: 200 });
    }

    const defaultProfiles = [
      {
        profile_name: 'Communication SLA',
        profile_type: 'communication',
        description: 'Standards for responding to client messages and threads'
      },
      {
        profile_name: 'Approval SLA',
        profile_type: 'approval',
        description: 'Standards for client approvals and review cycles'
      },
      {
        profile_name: 'Fulfillment SLA',
        profile_type: 'fulfillment',
        description: 'Standards for delivery and task completion'
      },
      {
        profile_name: 'Onboarding SLA',
        profile_type: 'onboarding',
        description: 'Standards for onboarding completion and workflow'
      },
      {
        profile_name: 'Reporting SLA',
        profile_type: 'reporting',
        description: 'Standards for report generation and publication'
      },
      {
        profile_name: 'Strategy Review SLA',
        profile_type: 'strategy_review',
        description: 'Standards for scheduled strategy reviews'
      },
      {
        profile_name: 'Proposal Follow-Up SLA',
        profile_type: 'proposal_followup',
        description: 'Standards for proposal tracking and follow-up'
      },
      {
        profile_name: 'Support SLA',
        profile_type: 'support',
        description: 'Standards for urgent client request resolution'
      }
    ];

    // Create profiles
    const createdProfiles = await base44.asServiceRole.entities.SLAProfiles.bulkCreate(defaultProfiles);

    // Map profile names to IDs for rule creation
    const profileMap = {};
    createdProfiles.forEach(p => {
      profileMap[p.profile_name] = p.id;
    });

    // Define default rules
    const defaultRules = [
      {
        sla_profile_id: profileMap['Communication SLA'],
        rule_name: 'Admin Response to Waiting Threads',
        rule_type: 'response_time',
        applies_to_entity: 'MessageThreads',
        target_status: 'waiting_on_admin',
        threshold_value: 1,
        threshold_unit: 'days',
        severity: 'high',
        breach_action: 'create_alert'
      },
      {
        sla_profile_id: profileMap['Approval SLA'],
        rule_name: 'Client Approval Response',
        rule_type: 'approval_wait_time',
        applies_to_entity: 'Deliverables',
        target_status: 'pending_approval',
        threshold_value: 3,
        threshold_unit: 'days',
        severity: 'medium',
        breach_action: 'create_alert'
      },
      {
        sla_profile_id: profileMap['Fulfillment SLA'],
        rule_name: 'High Priority Task Completion',
        rule_type: 'completion_time',
        applies_to_entity: 'FulfillmentTasks',
        target_status: 'pending',
        threshold_value: 1,
        threshold_unit: 'days',
        severity: 'high',
        breach_action: 'create_alert'
      },
      {
        sla_profile_id: profileMap['Onboarding SLA'],
        rule_name: 'Onboarding Task Completion',
        rule_type: 'completion_time',
        applies_to_entity: 'OnboardingTasks',
        target_status: 'pending',
        threshold_value: 7,
        threshold_unit: 'days',
        severity: 'medium',
        breach_action: 'flag_account'
      },
      {
        sla_profile_id: profileMap['Reporting SLA'],
        rule_name: 'Executive Report Publication',
        rule_type: 'publication_delay',
        applies_to_entity: 'ExecutiveReports',
        target_status: 'draft',
        threshold_value: 3,
        threshold_unit: 'days',
        severity: 'high',
        breach_action: 'notify_admin'
      },
      {
        sla_profile_id: profileMap['Strategy Review SLA'],
        rule_name: 'Scheduled Strategy Review Completion',
        rule_type: 'review_due',
        applies_to_entity: 'StrategyReviews',
        target_status: 'scheduled',
        threshold_value: 0,
        threshold_unit: 'days',
        severity: 'high',
        breach_action: 'create_alert'
      },
      {
        sla_profile_id: profileMap['Proposal Follow-Up SLA'],
        rule_name: 'Proposal Follow-Up After View',
        rule_type: 'followup_delay',
        applies_to_entity: 'Proposals',
        target_status: 'viewed',
        threshold_value: 2,
        threshold_unit: 'days',
        severity: 'high',
        breach_action: 'create_alert'
      },
      {
        sla_profile_id: profileMap['Support SLA'],
        rule_name: 'Urgent Client Request Resolution',
        rule_type: 'completion_time',
        applies_to_entity: 'ClientRequests',
        target_status: 'pending',
        threshold_value: 1,
        threshold_unit: 'days',
        severity: 'critical',
        breach_action: 'create_alert'
      },
      {
        sla_profile_id: profileMap['Fulfillment SLA'],
        rule_name: 'Fulfillment Workroom Inactivity',
        rule_type: 'inactivity',
        applies_to_entity: 'FulfillmentTasks',
        target_status: 'in_progress',
        threshold_value: 5,
        threshold_unit: 'days',
        severity: 'medium',
        breach_action: 'create_alert'
      },
      {
        sla_profile_id: profileMap['Fulfillment SLA'],
        rule_name: 'High Priority Sales Task Completion',
        rule_type: 'completion_time',
        applies_to_entity: 'SalesTasks',
        target_status: 'pending',
        threshold_value: 2,
        threshold_unit: 'days',
        severity: 'high',
        breach_action: 'create_alert'
      }
    ];

    // Create rules
    const createdRules = await base44.asServiceRole.entities.SLARules.bulkCreate(defaultRules);

    return Response.json({
      success: true,
      profiles_created: createdProfiles.length,
      rules_created: createdRules.length,
      message: 'Default SLA profiles and rules initialized'
    });

  } catch (error) {
    console.error('Error initializing SLA rules:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
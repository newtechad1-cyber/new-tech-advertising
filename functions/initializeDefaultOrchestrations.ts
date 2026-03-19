import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Check if orchestrations already exist
    const existing = await base44.asServiceRole.entities.WorkflowOrchestrations.list();
    if (existing && existing.length > 0) {
      return Response.json({ 
        success: true, 
        message: 'Orchestrations already initialized',
        count: existing.length 
      });
    }

    const defaultOrchestrations = [
      {
        orchestration_name: 'Sales Follow-Up Orchestrator',
        orchestration_type: 'sales_followup',
        description: 'Automatically creates follow-up tasks when proposals are viewed multiple times or leads are hot',
        status: 'active',
        trigger_type: 'event',
        trigger_source: 'proposal_viewed',
        trigger_event: 'proposal_viewed_multiple_times',
        rule_set_name: 'Sales Follow-Up Rules',
        enabled: true,
        priority: 'high'
      },
      {
        orchestration_name: 'Onboarding Recovery Orchestrator',
        orchestration_type: 'onboarding',
        description: 'Monitors onboarding workrooms for stalls and automatically initiates recovery workflows',
        status: 'active',
        trigger_type: 'state_change',
        trigger_source: 'onboarding_activity',
        trigger_event: 'onboarding_stalled',
        rule_set_name: 'Onboarding Recovery Rules',
        enabled: true,
        priority: 'high'
      },
      {
        orchestration_name: 'Fulfillment Stabilization Orchestrator',
        orchestration_type: 'fulfillment',
        description: 'Detects fulfillment bottlenecks and creates stabilization tasks and playbooks',
        status: 'active',
        trigger_type: 'threshold',
        trigger_source: 'fulfillment_metrics',
        trigger_event: 'fulfillment_stalled',
        rule_set_name: 'Fulfillment Stabilization Rules',
        enabled: true,
        priority: 'high'
      },
      {
        orchestration_name: 'Rescue Account Orchestrator',
        orchestration_type: 'rescue',
        description: 'Activates when accounts show churn risk or critical SLA breaches',
        status: 'active',
        trigger_type: 'threshold',
        trigger_source: 'account_health',
        trigger_event: 'account_at_critical_risk',
        rule_set_name: 'Rescue Account Rules',
        enabled: true,
        priority: 'urgent'
      },
      {
        orchestration_name: 'Renewal & Upsell Orchestrator',
        orchestration_type: 'renewal',
        description: 'Creates renewal reviews and proposals when renewal windows open or upsell opportunities emerge',
        status: 'active',
        trigger_type: 'event',
        trigger_source: 'growth_opportunity',
        trigger_event: 'renewal_window_opening',
        rule_set_name: 'Renewal & Upsell Rules',
        enabled: true,
        priority: 'high'
      },
      {
        orchestration_name: 'Reporting-to-Review Orchestrator',
        orchestration_type: 'reporting',
        description: 'Automatically creates strategy reviews and refreshes playbooks when reports are generated',
        status: 'active',
        trigger_type: 'event',
        trigger_source: 'executive_report',
        trigger_event: 'report_generated',
        rule_set_name: 'Reporting-to-Review Rules',
        enabled: true,
        priority: 'medium'
      },
      {
        orchestration_name: 'Communication Recovery Orchestrator',
        orchestration_type: 'communication',
        description: 'Tracks message threads and creates response tasks when admin response is overdue',
        status: 'active',
        trigger_type: 'threshold',
        trigger_source: 'message_thread',
        trigger_event: 'admin_response_overdue',
        rule_set_name: 'Communication Recovery Rules',
        enabled: true,
        priority: 'medium'
      },
      {
        orchestration_name: 'Operations SLA Orchestrator',
        orchestration_type: 'operations',
        description: 'Creates alerts and escalations when SLA rules are breached',
        status: 'active',
        trigger_type: 'event',
        trigger_source: 'sla_event',
        trigger_event: 'sla_breach_detected',
        rule_set_name: 'Operations SLA Rules',
        enabled: true,
        priority: 'urgent'
      },
      {
        orchestration_name: 'Executive Escalation Orchestrator',
        orchestration_type: 'executive',
        description: 'Generates urgent owner insights when multiple systems signal critical issues',
        status: 'active',
        trigger_type: 'state_change',
        trigger_source: 'platform_state',
        trigger_event: 'multiple_critical_signals',
        rule_set_name: 'Executive Escalation Rules',
        enabled: true,
        priority: 'urgent'
      }
    ];

    const created = [];
    for (const orch of defaultOrchestrations) {
      const newOrch = await base44.asServiceRole.entities.WorkflowOrchestrations.create(orch);
      created.push(newOrch.id);
    }

    // Create default rules for each orchestration
    const defaultRules = [
      {
        workflow_orchestration_id: created[0], // Sales Follow-Up
        rule_name: 'Create follow-up task on multiple views',
        rule_category: 'sales',
        condition_logic: 'Proposal has been viewed 2 or more times within 7 days',
        action_logic: 'Create sales follow-up task with high priority',
        applies_to_entity: 'Proposal',
        active: true,
        priority: 'high',
        stop_after_success: false
      },
      {
        workflow_orchestration_id: created[1], // Onboarding Recovery
        rule_name: 'Recovery task on stalled onboarding',
        rule_category: 'client_success',
        condition_logic: 'Onboarding workroom has no activity for 5+ days',
        action_logic: 'Create onboarding recovery task and send reminder message to client',
        applies_to_entity: 'OnboardingWorkrooms',
        active: true,
        priority: 'high',
        stop_after_success: false
      },
      {
        workflow_orchestration_id: created[2], // Fulfillment Stabilization
        rule_name: 'Create stabilization task for stalled fulfillment',
        rule_category: 'operations',
        condition_logic: 'Fulfillment workroom with no activity for 7+ days',
        action_logic: 'Create fulfillment check-in task and refresh success playbook',
        applies_to_entity: 'FulfillmentWorkrooms',
        active: true,
        priority: 'high',
        stop_after_success: false
      },
      {
        workflow_orchestration_id: created[3], // Rescue Account
        rule_name: 'Initiate rescue playbook for at-risk account',
        rule_category: 'client_success',
        condition_logic: 'Account health status is critical or churn risk is high',
        action_logic: 'Create rescue playbook and urgent outreach task; assign to owner',
        applies_to_entity: 'Company',
        active: true,
        priority: 'urgent',
        stop_after_success: true
      },
      {
        workflow_orchestration_id: created[4], // Renewal & Upsell
        rule_name: 'Create renewal review when window opens',
        rule_category: 'renewal',
        condition_logic: 'Renewal date within 90 days or upsell confidence > 80%',
        action_logic: 'Create strategy review and renewal preparation task',
        applies_to_entity: 'RenewalSignals',
        active: true,
        priority: 'high',
        stop_after_success: false
      },
      {
        workflow_orchestration_id: created[5], // Reporting-to-Review
        rule_name: 'Create strategy review after report generation',
        rule_category: 'review',
        condition_logic: 'Executive report is generated and published',
        action_logic: 'Create strategy review and refresh success playbook',
        applies_to_entity: 'ExecutiveReports',
        active: true,
        priority: 'medium',
        stop_after_success: false
      }
    ];

    let rulesCreated = 0;
    for (const rule of defaultRules) {
      await base44.asServiceRole.entities.WorkflowRules.create(rule);
      rulesCreated++;
    }

    return Response.json({
      success: true,
      message: 'Default orchestrations initialized',
      orchestrations_created: created.length,
      rules_created: rulesCreated
    });

  } catch (error) {
    console.error('Initialization error:', error);
    return Response.json({ 
      error: error.message,
      success: false 
    }, { status: 500 });
  }
});
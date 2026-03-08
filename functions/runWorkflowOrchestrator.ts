import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { trigger_source, trigger_event, related_entity_type, related_entity_id, company_id } = await req.json();

    if (!trigger_source || !trigger_event || !related_entity_type || !related_entity_id) {
      return Response.json({ 
        error: 'Missing required parameters: trigger_source, trigger_event, related_entity_type, related_entity_id' 
      }, { status: 400 });
    }

    // Fetch applicable orchestrations
    const orchestrations = await base44.asServiceRole.entities.WorkflowOrchestrations.filter({
      status: 'active',
      enabled: true,
      trigger_source: trigger_source,
      trigger_event: trigger_event
    });

    if (!orchestrations || orchestrations.length === 0) {
      return Response.json({ 
        success: true,
        message: 'No applicable orchestrations found',
        runs_created: 0
      });
    }

    const results = [];

    for (const orchestration of orchestrations) {
      const runStartTime = new Date().toISOString();

      // Create workflow run record
      const workflowRun = await base44.asServiceRole.entities.WorkflowRuns.create({
        workflow_orchestration_id: orchestration.id,
        related_company_id: company_id || null,
        related_entity_type: related_entity_type,
        related_entity_id: related_entity_id,
        trigger_source: trigger_source,
        trigger_event: trigger_event,
        run_status: 'started',
        result_summary: `Workflow triggered by ${trigger_source}: ${trigger_event}`,
        started_at: runStartTime,
        actions_created_count: 0,
        alerts_created_count: 0,
        tasks_created_count: 0,
        proposals_created_count: 0,
        reviews_created_count: 0,
        playbooks_created_count: 0
      });

      // Fetch rules for this orchestration
      const rules = await base44.asServiceRole.entities.WorkflowRules.filter({
        workflow_orchestration_id: orchestration.id,
        active: true
      }, '-priority');

      const actionsSummary = [];
      let actionCounts = {
        tasks: 0,
        alerts: 0,
        proposals: 0,
        reviews: 0,
        playbooks: 0,
        messages: 0,
        escalations: 0
      };

      // Execute rules in priority order
      for (const rule of rules) {
        // Route to appropriate action handler based on rule
        const ruleResult = await executeRule(
          base44,
          rule,
          orchestration,
          company_id,
          related_entity_type,
          related_entity_id,
          workflowRun.id
        );

        if (ruleResult.success) {
          actionCounts = {
            tasks: actionCounts.tasks + (ruleResult.tasks_created || 0),
            alerts: actionCounts.alerts + (ruleResult.alerts_created || 0),
            proposals: actionCounts.proposals + (ruleResult.proposals_created || 0),
            reviews: actionCounts.reviews + (ruleResult.reviews_created || 0),
            playbooks: actionCounts.playbooks + (ruleResult.playbooks_created || 0),
            messages: actionCounts.messages + (ruleResult.messages_created || 0),
            escalations: actionCounts.escalations + (ruleResult.escalations_created || 0)
          };
          
          if (ruleResult.summary) {
            actionsSummary.push(ruleResult.summary);
          }

          if (rule.stop_after_success) {
            break;
          }
        }
      }

      // Update workflow run with final status
      const completedAt = new Date().toISOString();
      await base44.asServiceRole.entities.WorkflowRuns.update(workflowRun.id, {
        run_status: actionCounts.tasks > 0 || actionCounts.alerts > 0 ? 'completed' : 'skipped',
        result_summary: actionsSummary.join('; '),
        completed_at: completedAt,
        actions_created_count: Object.values(actionCounts).reduce((a, b) => a + b, 0),
        tasks_created_count: actionCounts.tasks,
        alerts_created_count: actionCounts.alerts,
        proposals_created_count: actionCounts.proposals,
        reviews_created_count: actionCounts.reviews,
        playbooks_created_count: actionCounts.playbooks
      });

      // Update orchestration last_run_date
      await base44.asServiceRole.entities.WorkflowOrchestrations.update(orchestration.id, {
        last_run_date: completedAt
      });

      results.push({
        orchestration_id: orchestration.id,
        orchestration_name: orchestration.orchestration_name,
        run_id: workflowRun.id,
        actions_created: actionCounts
      });
    }

    return Response.json({
      success: true,
      runs_created: results.length,
      results: results
    });

  } catch (error) {
    console.error('Orchestrator error:', error);
    return Response.json({ 
      error: error.message,
      success: false 
    }, { status: 500 });
  }
});

// Helper function to execute individual rules
async function executeRule(base44, rule, orchestration, company_id, entity_type, entity_id, workflowRunId) {
  try {
    const actionCreated = {
      success: true,
      summary: '',
      tasks_created: 0,
      alerts_created: 0,
      proposals_created: 0,
      reviews_created: 0,
      playbooks_created: 0,
      messages_created: 0,
      escalations_created: 0
    };

    // Route based on rule category and orchestration type
    if (orchestration.orchestration_type === 'sales_followup') {
      const { created, summary } = await handleSalesFollowup(base44, company_id, entity_type, entity_id, workflowRunId);
      actionCreated.tasks_created = created.tasks || 0;
      actionCreated.alerts_created = created.alerts || 0;
      actionCreated.summary = summary;
    }
    else if (orchestration.orchestration_type === 'onboarding') {
      const { created, summary } = await handleOnboarding(base44, company_id, entity_type, entity_id, workflowRunId);
      actionCreated.tasks_created = created.tasks || 0;
      actionCreated.messages_created = created.messages || 0;
      actionCreated.playbooks_created = created.playbooks || 0;
      actionCreated.summary = summary;
    }
    else if (orchestration.orchestration_type === 'fulfillment') {
      const { created, summary } = await handleFulfillment(base44, company_id, entity_type, entity_id, workflowRunId);
      actionCreated.tasks_created = created.tasks || 0;
      actionCreated.alerts_created = created.alerts || 0;
      actionCreated.playbooks_created = created.playbooks || 0;
      actionCreated.summary = summary;
    }
    else if (orchestration.orchestration_type === 'rescue') {
      const { created, summary } = await handleRescue(base44, company_id, entity_type, entity_id, workflowRunId);
      actionCreated.tasks_created = created.tasks || 0;
      actionCreated.alerts_created = created.alerts || 0;
      actionCreated.playbooks_created = created.playbooks || 0;
      actionCreated.summary = summary;
    }
    else if (orchestration.orchestration_type === 'renewal') {
      const { created, summary } = await handleRenewal(base44, company_id, entity_type, entity_id, workflowRunId);
      actionCreated.tasks_created = created.tasks || 0;
      actionCreated.proposals_created = created.proposals || 0;
      actionCreated.reviews_created = created.reviews || 0;
      actionCreated.summary = summary;
    }

    return actionCreated;

  } catch (error) {
    console.error('Rule execution error:', error);
    return {
      success: false,
      summary: `Error: ${error.message}`
    };
  }
}

// Sales follow-up handler
async function handleSalesFollowup(base44, company_id, entity_type, entity_id, workflowRunId) {
  const created = { tasks: 0, alerts: 0 };
  let summary = '';

  try {
    if (entity_type === 'Proposal' && company_id) {
      // Create follow-up task
      const task = await base44.asServiceRole.entities.SalesTasks.create({
        company_id: company_id,
        related_proposal_id: entity_id,
        task_type: 'follow_up',
        title: 'Follow up on proposal',
        description: 'Automatically created by workflow orchestrator',
        status: 'pending',
        priority: 'high'
      });
      created.tasks = 1;

      // Record action
      await base44.asServiceRole.entities.WorkflowActions.create({
        workflow_run_id: workflowRunId,
        action_type: 'create_task',
        action_target_type: 'SalesTasks',
        action_target_id: task.id,
        company_id: company_id,
        status: 'completed',
        summary: `Created sales follow-up task for proposal ${entity_id}`
      });

      summary = `Sales follow-up task created for proposal`;
    }
  } catch (error) {
    console.error('Sales followup handler error:', error);
  }

  return { created, summary };
}

// Onboarding handler
async function handleOnboarding(base44, company_id, entity_type, entity_id, workflowRunId) {
  const created = { tasks: 0, messages: 0, playbooks: 0 };
  let summary = '';

  try {
    if (entity_type === 'OnboardingWorkrooms' && company_id) {
      // Create recovery task
      const task = await base44.asServiceRole.entities.OnboardingTasks.create({
        onboarding_workroom_id: entity_id,
        task_title: 'Onboarding recovery - reconnect with client',
        task_type: 'followup',
        status: 'pending',
        priority: 'high'
      });
      created.tasks = 1;

      await base44.asServiceRole.entities.WorkflowActions.create({
        workflow_run_id: workflowRunId,
        action_type: 'create_task',
        action_target_type: 'OnboardingTasks',
        action_target_id: task.id,
        company_id: company_id,
        status: 'completed',
        summary: `Created onboarding recovery task`
      });

      summary = `Onboarding recovery initiated`;
    }
  } catch (error) {
    console.error('Onboarding handler error:', error);
  }

  return { created, summary };
}

// Fulfillment handler
async function handleFulfillment(base44, company_id, entity_type, entity_id, workflowRunId) {
  const created = { tasks: 0, alerts: 0, playbooks: 0 };
  let summary = '';

  try {
    if (entity_type === 'FulfillmentWorkrooms' && company_id) {
      // Create stabilization task
      const task = await base44.asServiceRole.entities.FulfillmentTasks.create({
        fulfillment_workroom_id: entity_id,
        task_title: 'Fulfillment stabilization check',
        task_type: 'check_in',
        status: 'pending',
        priority: 'high'
      });
      created.tasks = 1;

      await base44.asServiceRole.entities.WorkflowActions.create({
        workflow_run_id: workflowRunId,
        action_type: 'create_task',
        action_target_type: 'FulfillmentTasks',
        action_target_id: task.id,
        company_id: company_id,
        status: 'completed',
        summary: `Created fulfillment stabilization task`
      });

      summary = `Fulfillment stabilization workflow triggered`;
    }
  } catch (error) {
    console.error('Fulfillment handler error:', error);
  }

  return { created, summary };
}

// Rescue account handler
async function handleRescue(base44, company_id, entity_type, entity_id, workflowRunId) {
  const created = { tasks: 0, alerts: 0, playbooks: 0 };
  let summary = '';

  try {
    if (company_id) {
      // Create rescue playbook
      const playbook = await base44.asServiceRole.entities.SuccessPlaybooks.create({
        company_id: company_id,
        playbook_type: 'rescue',
        title: 'Account Rescue Playbook - Automated',
        summary: 'Automatically triggered rescue workflow',
        account_health_status: 'at_risk',
        primary_goal: 'Stabilize and retain account',
        confidence_score: 75,
        status: 'active'
      });
      created.playbooks = 1;

      // Create urgent task
      const task = await base44.asServiceRole.entities.SalesTasks.create({
        company_id: company_id,
        task_type: 'urgent_outreach',
        title: 'URGENT: Account rescue outreach',
        description: 'High-priority rescue account engagement',
        status: 'pending',
        priority: 'urgent'
      });
      created.tasks = 1;

      await base44.asServiceRole.entities.WorkflowActions.create({
        workflow_run_id: workflowRunId,
        action_type: 'create_playbook',
        action_target_type: 'SuccessPlaybooks',
        action_target_id: playbook.id,
        company_id: company_id,
        status: 'completed',
        summary: `Created rescue playbook and urgent task`
      });

      summary = `Rescue account workflow activated with playbook and urgent task`;
    }
  } catch (error) {
    console.error('Rescue handler error:', error);
  }

  return { created, summary };
}

// Renewal handler
async function handleRenewal(base44, company_id, entity_type, entity_id, workflowRunId) {
  const created = { tasks: 0, proposals: 0, reviews: 0 };
  let summary = '';

  try {
    if (company_id) {
      // Create renewal review
      const review = await base44.asServiceRole.entities.StrategyReviews.create({
        company_id: company_id,
        review_title: 'Renewal Strategy Review - Automated',
        review_type: 'renewal_review',
        review_period_label: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
        period_start: new Date().toISOString().split('T')[0],
        period_end: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
        status: 'draft'
      });
      created.reviews = 1;

      // Create renewal task
      const task = await base44.asServiceRole.entities.SalesTasks.create({
        company_id: company_id,
        related_review_id: review.id,
        task_type: 'renewal_preparation',
        title: 'Prepare for renewal discussion',
        status: 'pending',
        priority: 'high'
      });
      created.tasks = 1;

      await base44.asServiceRole.entities.WorkflowActions.create({
        workflow_run_id: workflowRunId,
        action_type: 'create_review',
        action_target_type: 'StrategyReviews',
        action_target_id: review.id,
        company_id: company_id,
        status: 'completed',
        summary: `Created renewal review and prep task`
      });

      summary = `Renewal workflow initiated with review and task`;
    }
  } catch (error) {
    console.error('Renewal handler error:', error);
  }

  return { created, summary };
}
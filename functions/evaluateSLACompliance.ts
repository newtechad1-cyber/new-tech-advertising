import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Fetch all SLA rules
    const rules = await base44.asServiceRole.entities.SLARules.filter({ active: true });
    if (rules.length === 0) {
      return Response.json({ message: 'No active SLA rules found' }, { status: 200 });
    }

    const now = new Date();
    let eventsCreated = 0;
    let eventsResolved = 0;
    let alertsCreated = 0;

    // Process each rule
    for (const rule of rules) {
      const results = await evaluateRule(rule, base44, now);
      eventsCreated += results.created;
      eventsResolved += results.resolved;
      alertsCreated += results.alerts;
    }

    // Calculate accountability scores
    await calculateAccountabilityScores(base44);

    return Response.json({
      success: true,
      events_created: eventsCreated,
      events_resolved: eventsResolved,
      alerts_created: alertsCreated,
      timestamp: now.toISOString()
    });

  } catch (error) {
    console.error('Error evaluating SLA compliance:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function evaluateRule(rule, base44, now) {
  let created = 0;
  let resolved = 0;
  let alerts = 0;

  try {
    const thresholdMs = convertThresholdToMs(rule.threshold_value, rule.threshold_unit);
    let items = [];

    // Fetch items to evaluate based on entity type
    if (rule.applies_to_entity === 'MessageThreads') {
      items = await base44.asServiceRole.entities.MessageThreads.filter({
        status: 'waiting_on_admin'
      });
    } else if (rule.applies_to_entity === 'ClientRequests') {
      items = await base44.asServiceRole.entities.ClientRequests.filter({
        status: { $in: ['pending', 'waiting_on_client', 'in_progress'] }
      });
    } else if (rule.applies_to_entity === 'FulfillmentTasks') {
      items = await base44.asServiceRole.entities.FulfillmentTasks.filter({
        status: { $in: ['pending', 'in_progress'] }
      });
    } else if (rule.applies_to_entity === 'OnboardingTasks') {
      items = await base44.asServiceRole.entities.OnboardingTasks.filter({
        status: { $in: ['pending', 'in_progress'] }
      });
    } else if (rule.applies_to_entity === 'Deliverables') {
      items = await base44.asServiceRole.entities.Deliverables.filter({
        status: { $in: ['pending_approval', 'requested'] }
      });
    } else if (rule.applies_to_entity === 'StrategyReviews') {
      items = await base44.asServiceRole.entities.StrategyReviews.filter({
        status: { $in: ['scheduled', 'ready'] }
      });
    } else if (rule.applies_to_entity === 'ExecutiveReports') {
      items = await base44.asServiceRole.entities.ExecutiveReports.filter({
        status: { $in: ['draft', 'ready'] }
      });
    } else if (rule.applies_to_entity === 'SalesTasks') {
      items = await base44.asServiceRole.entities.SalesTasks.filter({
        status: 'pending'
      });
    } else if (rule.applies_to_entity === 'Proposals') {
      items = await base44.asServiceRole.entities.Proposals.filter({
        status: { $in: ['sent', 'viewed'] }
      });
    }

    // Evaluate each item
    for (const item of items) {
      const result = await evaluateItem(item, rule, base44, now, thresholdMs);
      if (result.eventCreated) created++;
      if (result.eventResolved) resolved++;
      if (result.alertCreated) alerts++;
    }

  } catch (error) {
    console.error(`Error evaluating rule ${rule.id}:`, error);
  }

  return { created, resolved, alerts };
}

async function evaluateItem(item, rule, base44, now, thresholdMs) {
  let eventCreated = false;
  let eventResolved = false;
  let alertCreated = false;

  try {
    const itemAgeMs = now - new Date(item.created_date || item.started_at || item.scheduled_date);
    const isBreached = itemAgeMs > thresholdMs;
    const companyId = item.company_id;
    const userId = item.assigned_admin_user_id || item.assigned_user_id;

    // Check for existing event
    const existingEvent = await base44.asServiceRole.entities.SLAEvents.filter({
      sla_rule_id: rule.id,
      related_entity_id: item.id,
      status: { $in: ['active', 'breached'] }
    }).then(list => list[0]);

    if (isBreached) {
      if (!existingEvent) {
        // Create new breach event
        const event = await base44.asServiceRole.entities.SLAEvents.create({
          company_id: companyId,
          user_id: userId,
          sla_rule_id: rule.id,
          related_entity_type: rule.applies_to_entity,
          related_entity_id: item.id,
          related_workroom_id: item.workroom_id || item.fulfillment_workroom_id || item.onboarding_workroom_id,
          event_type: determineEventType(rule.rule_type, true),
          severity: rule.severity,
          status: 'breached',
          started_at: item.created_date || item.started_at || item.scheduled_date,
          due_at: new Date(itemAgeMs + thresholdMs).toISOString(),
          breached_at: now.toISOString(),
          notes: `${rule.rule_name}: Item overdue by ${Math.floor((itemAgeMs - thresholdMs) / (1000 * 60 * 60))} hours`
        });
        eventCreated = true;

        // Execute breach action
        const actionResult = await executeSLAAction(rule.breach_action, event, companyId, userId, base44);
        if (actionResult.alertCreated) alertCreated = true;
      }
    } else {
      // Item is not breached but approaching
      if (!existingEvent) {
        const timeToBreachMs = thresholdMs - itemAgeMs;
        const hoursToBreachMs = 24 * 60 * 60 * 1000; // 24 hours

        if (timeToBreachMs < hoursToBreachMs && timeToBreachMs > 0) {
          // Create warning event
          const event = await base44.asServiceRole.entities.SLAEvents.create({
            company_id: companyId,
            user_id: userId,
            sla_rule_id: rule.id,
            related_entity_type: rule.applies_to_entity,
            related_entity_id: item.id,
            related_workroom_id: item.workroom_id || item.fulfillment_workroom_id || item.onboarding_workroom_id,
            event_type: determineEventType(rule.rule_type, false),
            severity: downgradeForWarning(rule.severity),
            status: 'active',
            started_at: item.created_date || item.started_at || item.scheduled_date,
            due_at: new Date(now.getTime() + thresholdMs - itemAgeMs).toISOString(),
            notes: `${rule.rule_name}: Item will breach in ${Math.ceil(timeToBreachMs / (1000 * 60 * 60))} hours`
          });
          eventCreated = true;
        }
      }
    }

  } catch (error) {
    console.error(`Error evaluating item ${item.id}:`, error);
  }

  return { eventCreated, eventResolved, alertCreated };
}

async function executeSLAAction(action, event, companyId, userId, base44) {
  let alertCreated = false;

  try {
    if (action === 'create_alert') {
      await base44.asServiceRole.entities.SalesNotification.create({
        company_id: companyId,
        notification_type: 'sla_breach',
        priority: event.severity === 'critical' ? 'urgent' : 'high',
        message: `SLA Breach: ${event.related_entity_type} overdue. ${event.notes}`,
        status: 'active'
      });
      alertCreated = true;
    } else if (action === 'create_task') {
      const taskTitle = buildTaskTitle(event.event_type, event.related_entity_type);
      const existingTask = await base44.asServiceRole.entities.SalesTasks.filter({
        company_id: companyId,
        task_title: taskTitle,
        status: 'pending'
      }).then(list => list[0]);

      if (!existingTask) {
        await base44.asServiceRole.entities.SalesTasks.create({
          company_id: companyId,
          task_title: taskTitle,
          task_type: 'follow_up',
          assigned_admin_user_id: userId,
          priority: event.severity === 'critical' ? 'urgent' : 'high',
          status: 'pending',
          due_date: new Date().toISOString().split('T')[0],
          notes: `SLA Event ${event.id}: ${event.notes}`
        });
      }
    } else if (action === 'escalate_owner') {
      if (userId) {
        // Create escalation task
        await base44.asServiceRole.entities.SalesTasks.create({
          company_id: companyId,
          task_title: `ESCALATION: ${event.event_type} for admin ${userId}`,
          task_type: 'follow_up',
          assigned_admin_user_id: userId,
          priority: 'urgent',
          status: 'pending',
          notes: `Escalated SLA Event ${event.id}: ${event.notes}`
        });
      }
    } else if (action === 'flag_account') {
      // Flag in success playbook or create alert
      await base44.asServiceRole.entities.SalesNotification.create({
        company_id: companyId,
        notification_type: 'account_flag',
        priority: 'urgent',
        message: `Account flagged for operational review due to SLA breach: ${event.related_entity_type}`,
        status: 'active'
      });
      alertCreated = true;
    } else if (action === 'notify_admin') {
      await base44.asServiceRole.entities.SalesNotification.create({
        company_id: companyId,
        notification_type: 'sla_notification',
        priority: 'high',
        message: `SLA Compliance Notice: ${event.notes}`,
        status: 'active'
      });
      alertCreated = true;
    }
  } catch (error) {
    console.error(`Error executing action ${action}:`, error);
  }

  return { alertCreated };
}

async function calculateAccountabilityScores(base44) {
  try {
    // Get all companies with active fulfillment
    const companies = await base44.asServiceRole.entities.Company.list();

    for (const company of companies) {
      const score = await calculateCompanyScore(company, base44);
      if (score) {
        await base44.asServiceRole.entities.AccountabilityScores.create(score);
      }
    }

    // Get all admin users
    const users = await base44.asServiceRole.entities.User.list();
    for (const user of users) {
      const score = await calculateAdminScore(user, base44);
      if (score) {
        await base44.asServiceRole.entities.AccountabilityScores.create(score);
      }
    }
  } catch (error) {
    console.error('Error calculating accountability scores:', error);
  }
}

async function calculateCompanyScore(company, base44) {
  try {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get SLA events for this company
    const breaches = await base44.asServiceRole.entities.SLAEvents.filter({
      company_id: company.id,
      status: 'breached'
    });

    // Get approval times
    const requests = await base44.asServiceRole.entities.ClientRequests.filter({
      company_id: company.id
    });
    const slowRequests = requests.filter(r => {
      if (!r.created_date) return false;
      const ageMs = now - new Date(r.created_date);
      return ageMs > 7 * 24 * 60 * 60 * 1000; // > 7 days
    }).length;

    // Get stalled tasks
    const tasks = await base44.asServiceRole.entities.OnboardingTasks.filter({
      company_id: company.id,
      status: { $in: ['pending', 'in_progress'] }
    });
    const stalledTasks = tasks.filter(t => {
      if (!t.created_date) return false;
      const ageMs = now - new Date(t.created_date);
      return ageMs > 14 * 24 * 60 * 60 * 1000; // > 14 days
    }).length;

    // Calculate score
    const breachPenalty = Math.min(breaches.length * 10, 30);
    const requestPenalty = Math.min(slowRequests * 2, 20);
    const stalledPenalty = Math.min(stalledTasks * 3, 20);
    const score = Math.max(0, 100 - breachPenalty - requestPenalty - stalledPenalty);

    const factors = `Breaches: ${breaches.length}, Slow requests: ${slowRequests}, Stalled tasks: ${stalledTasks}`;

    return {
      company_id: company.id,
      scope_type: 'company',
      score_label: 'Operational Responsiveness',
      score_value: score,
      score_period_label: `${periodStart.toLocaleDateString()}–${periodEnd.toLocaleDateString()}`,
      period_start: periodStart.toISOString().split('T')[0],
      period_end: periodEnd.toISOString().split('T')[0],
      factors_summary: factors
    };
  } catch (error) {
    console.error(`Error calculating score for company ${company.id}:`, error);
    return null;
  }
}

async function calculateAdminScore(user, base44) {
  try {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get tasks assigned to this admin
    const tasks = await base44.asServiceRole.entities.SalesTasks.filter({
      assigned_admin_user_id: user.id
    });

    const overdueTasks = tasks.filter(t => {
      if (!t.due_date) return false;
      return new Date(t.due_date) < now && t.status === 'pending';
    }).length;

    // Get waiting_on_admin threads
    const threads = await base44.asServiceRole.entities.MessageThreads.filter({
      assigned_admin_user_id: user.id,
      status: 'waiting_on_admin'
    });

    const slowThreads = threads.filter(t => {
      if (!t.last_message_date) return false;
      const ageMs = now - new Date(t.last_message_date);
      return ageMs > 24 * 60 * 60 * 1000; // > 24 hours
    }).length;

    // Calculate score
    const taskPenalty = Math.min(overdueTasks * 5, 25);
    const threadPenalty = Math.min(slowThreads * 5, 25);
    const score = Math.max(0, 100 - taskPenalty - threadPenalty);

    const factors = `Overdue tasks: ${overdueTasks}, Slow response threads: ${slowThreads}`;

    return {
      user_id: user.id,
      scope_type: 'admin_user',
      score_label: 'Response & Delivery Consistency',
      score_value: score,
      score_period_label: `${periodStart.toLocaleDateString()}–${periodEnd.toLocaleDateString()}`,
      period_start: periodStart.toISOString().split('T')[0],
      period_end: periodEnd.toISOString().split('T')[0],
      factors_summary: factors
    };
  } catch (error) {
    console.error(`Error calculating score for user ${user.id}:`, error);
    return null;
  }
}

function convertThresholdToMs(value, unit) {
  const multipliers = {
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    weeks: 7 * 24 * 60 * 60 * 1000
  };
  return value * (multipliers[unit] || 24 * 60 * 60 * 1000);
}

function determineEventType(ruleType, isBreached) {
  const mapping = {
    response_time: isBreached ? 'response_breached' : 'response_due',
    completion_time: isBreached ? 'task_overdue' : 'task_overdue',
    approval_wait_time: 'approval_blocked',
    delivery_deadline: 'delivery_missed',
    review_due: 'review_late',
    inactivity: 'inactivity_breach',
    publication_delay: 'report_late',
    followup_delay: 'followup_late'
  };
  return mapping[ruleType] || 'task_overdue';
}

function downgradeForWarning(severity) {
  const downgrades = {
    critical: 'high',
    high: 'medium',
    medium: 'low',
    low: 'low'
  };
  return downgrades[severity] || 'medium';
}

function buildTaskTitle(eventType, entityType) {
  const titles = {
    response_breached: `Respond to pending ${entityType}`,
    approval_blocked: `Follow up on blocked approval`,
    delivery_missed: `Recover missed ${entityType}`,
    report_late: `Publish overdue report`,
    review_late: `Complete overdue strategy review`,
    inactivity_breach: `Address inactive account`,
    followup_late: `Complete follow-up action`,
    task_overdue: `Complete overdue task`
  };
  return titles[eventType] || `Follow up on ${entityType}`;
}
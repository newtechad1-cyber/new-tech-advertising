/**
 * NTA Master Automation Rules Engine
 * Central system for triggering platform actions based on lifecycle events
 */

import { base44 } from '@/api/base44Client';

/**
 * Default rule templates for each category
 */
export const DEFAULT_RULES = [
  // LIFECYCLE
  {
    rule_name: 'Welcome New User',
    trigger_event: 'user_signup',
    trigger_category: 'lifecycle',
    description: 'Send welcome email and start onboarding flow',
    action_type: 'send_email',
    action_target: 'user',
    action_payload: JSON.stringify({
      template: 'welcome',
      redirect: '/client/diy-onboarding',
    }),
    priority: 10,
  },
  {
    rule_name: 'Onboarding Complete Celebration',
    trigger_event: 'onboarding_complete',
    trigger_category: 'lifecycle',
    description: 'Show celebration modal and create first campaign',
    action_type: 'show_modal',
    action_target: 'user',
    action_payload: JSON.stringify({
      modal_type: 'milestone_celebration',
      message: 'Welcome to NTA! Your first campaign is ready.',
      action_button: 'View Campaign',
    }),
    priority: 9,
    cooldown_hours: 0,
  },
  {
    rule_name: 'First Milestone Achievement',
    trigger_event: 'first_milestone',
    trigger_category: 'lifecycle',
    description: 'Increment growth score and show achievement badge',
    action_type: 'update_record',
    action_target: 'growth_metrics',
    action_payload: JSON.stringify({
      growth_score_increment: 10,
      show_badge: true,
    }),
    priority: 8,
  },
  // RETENTION
  {
    rule_name: 'Inactivity Warning',
    trigger_event: 'inactivity_detected',
    trigger_category: 'retention',
    description: 'Show nudge after 7 days of inactivity',
    action_type: 'show_modal',
    action_target: 'user',
    action_payload: JSON.stringify({
      modal_type: 'inactivity_nudge',
      title: "We've missed you!",
      message: 'Your next action is waiting. Get back to growing your business.',
      delay_days: 7,
    }),
    priority: 7,
    execution_limit_per_user: 2,
    cooldown_hours: 168,
  },
  {
    rule_name: 'Momentum Drop Alert',
    trigger_event: 'momentum_drop',
    trigger_category: 'retention',
    description: 'Flag for strategist review when growth momentum slows',
    action_type: 'flag_entity',
    action_target: 'diy_subscription',
    action_payload: JSON.stringify({
      flag_type: 'momentum_risk',
      severity: 'medium',
      notify_strategist: true,
    }),
    priority: 6,
  },
  // SALES SIGNALS
  {
    rule_name: 'High Upgrade Readiness',
    trigger_event: 'upgrade_readiness_high',
    trigger_category: 'sales_signals',
    description: 'Show upgrade panel when user scores 75+ on readiness',
    action_type: 'show_modal',
    action_target: 'user',
    action_payload: JSON.stringify({
      modal_type: 'upgrade_recommendation',
      threshold: 75,
      recommended_plan: 'guided_growth',
    }),
    priority: 8,
    trigger_condition: 'upgrade_readiness_score >= 75',
  },
  {
    rule_name: 'Create Hot Prospect Alert',
    trigger_event: 'upgrade_readiness_high',
    trigger_category: 'sales_signals',
    description: 'Create hot prospect alert for sales follow-up',
    action_type: 'create_record',
    action_target: 'hot_prospect_alert',
    action_payload: JSON.stringify({
      alert_priority: 'high',
      recommended_action: 'outreach',
    }),
    priority: 9,
    trigger_condition: 'upgrade_readiness_score >= 75',
  },
  {
    rule_name: 'Premium Growth Suggestion',
    trigger_event: 'leads_logged',
    trigger_category: 'sales_signals',
    description: 'Recommend premium upgrade after logging 20+ leads',
    action_type: 'show_modal',
    action_target: 'user',
    action_payload: JSON.stringify({
      modal_type: 'upgrade_suggestion',
      trigger_metric: 'leads_logged',
      trigger_threshold: 20,
      message: 'You are crushing it! Scale with guided growth support.',
    }),
    priority: 6,
    trigger_condition: 'leads_logged >= 20',
  },
  // BILLING
  {
    rule_name: 'Payment Failed Warning',
    trigger_event: 'payment_failed',
    trigger_category: 'billing',
    description: 'Show billing warning banner and email user',
    action_type: 'show_modal',
    action_target: 'user',
    action_payload: JSON.stringify({
      modal_type: 'billing_warning',
      severity: 'warning',
      action: 'update_payment_method',
    }),
    priority: 10,
    cooldown_hours: 0,
  },
  {
    rule_name: 'Subscription Cancelled Restriction',
    trigger_event: 'subscription_cancelled',
    trigger_category: 'billing',
    description: 'Restrict premium tools and show reactivation CTA',
    action_type: 'update_record',
    action_target: 'diy_subscription',
    action_payload: JSON.stringify({
      restrict_tools: true,
      show_reactivation_cta: true,
      message: 'Your subscription has ended. Reactivate to continue.',
    }),
    priority: 10,
  },
  // SALES PIPELINE
  {
    rule_name: 'Demo Follow-up Reminder',
    trigger_event: 'discovery_done',
    trigger_category: 'pipeline',
    description: 'Alert sales if demo not scheduled within 3 days',
    action_type: 'send_notification',
    action_target: 'sales_team',
    action_payload: JSON.stringify({
      notification_type: 'pipeline_alert',
      message: 'Discovery complete but no demo scheduled',
      wait_days: 3,
    }),
    priority: 7,
    trigger_condition: 'demo_scheduled_date IS NULL',
  },
  {
    rule_name: 'Proposal View Alert',
    trigger_event: 'proposal_not_viewed',
    trigger_category: 'pipeline',
    description: 'Alert sales if proposal not viewed within 2 days',
    action_type: 'send_notification',
    action_target: 'sales_team',
    action_payload: JSON.stringify({
      notification_type: 'pipeline_alert',
      message: 'Proposal sent but not viewed by prospect',
      wait_days: 2,
    }),
    priority: 7,
    trigger_condition: 'proposal_status = "sent" AND days_since_sent > 2',
  },
  {
    rule_name: 'Deal Won - Start Onboarding',
    trigger_event: 'deal_won',
    trigger_category: 'pipeline',
    description: 'Create subscription and onboarding when deal closes',
    action_type: 'create_record',
    action_target: 'diy_subscription',
    action_payload: JSON.stringify({
      auto_provision: true,
      start_onboarding: true,
      send_welcome_email: true,
    }),
    priority: 10,
    execution_limit_per_user: 1,
    cooldown_hours: 0,
  },
];

/**
 * Check if rule should fire based on conditions
 */
export const evaluateRule = (rule, entityData) => {
  if (!rule.is_active) return false;

  // Check execution limit
  if (rule.execution_count >= rule.execution_limit_per_user) {
    return false;
  }

  // Evaluate trigger condition if present
  if (rule.trigger_condition) {
    return evaluateCondition(rule.trigger_condition, entityData);
  }

  return true;
};

/**
 * Evaluate a conditional expression against entity data
 */
const evaluateCondition = (condition, data) => {
  try {
    // Simple condition evaluator
    // Handles: field >= value, field = value, field > value, field IS NULL, etc.
    const comparison = condition.match(
      /(\w+)\s*(>=|<=|>|<|=|IS\s+NULL)\s*(.+)/i
    );

    if (!comparison) return true;

    const [, field, operator, value] = comparison;
    const fieldValue = data[field.trim()];

    switch (operator.toUpperCase()) {
      case '>=':
        return fieldValue >= parseFloat(value);
      case '<=':
        return fieldValue <= parseFloat(value);
      case '>':
        return fieldValue > parseFloat(value);
      case '<':
        return fieldValue < parseFloat(value);
      case '=':
        return fieldValue == value.trim();
      case 'IS NULL':
        return fieldValue === null || fieldValue === undefined;
      default:
        return true;
    }
  } catch (e) {
    console.warn('Failed to evaluate condition:', condition, e);
    return true;
  }
};

/**
 * Execute a rule action
 */
export const executeRuleAction = async (rule, entityId, entityType) => {
  const logEntry = {
    rule_id: rule.id,
    rule_name: rule.rule_name,
    entity_id: entityId,
    entity_type: entityType,
    executed_at: new Date().toISOString(),
    status: 'pending',
  };

  try {
    const payload = JSON.parse(rule.action_payload || '{}');

    switch (rule.action_type) {
      case 'send_email':
        // Trigger email via function
        await base44.functions.invoke('sendAutomationEmail', {
          entity_id: entityId,
          template: payload.template,
          redirect: payload.redirect,
        });
        break;

      case 'show_modal':
        // Modal shown client-side, just log
        console.log('Modal action:', payload);
        break;

      case 'create_record':
        // Create related entity
        await base44.entities[payload.entity_type]?.create({
          ...payload,
          source_rule_id: rule.id,
        });
        break;

      case 'update_record':
        // Update entity
        const entity = await base44.entities[rule.action_target]?.read(entityId);
        if (entity) {
          await base44.entities[rule.action_target]?.update(entityId, payload);
        }
        break;

      case 'flag_entity':
        // Add flag/tag to entity
        await base44.entities[rule.action_target]?.update(entityId, {
          flag_type: payload.flag_type,
          flag_severity: payload.severity,
        });
        break;

      case 'send_notification':
        // Send notification to admin/sales
        await base44.functions.invoke('sendAdminNotification', {
          target: rule.action_target,
          message: payload.message,
        });
        break;

      case 'trigger_workflow':
        // Invoke a backend workflow
        await base44.functions.invoke('triggerWorkflow', {
          workflow_id: payload.workflow_id,
          entity_id: entityId,
        });
        break;

      default:
        console.warn('Unknown action type:', rule.action_type);
    }

    logEntry.status = 'success';

    // Update rule execution stats
    await base44.entities.AutomationRule.update(rule.id, {
      execution_count: (rule.execution_count || 0) + 1,
      success_count: (rule.success_count || 0) + 1,
      last_executed_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Rule execution failed:', error);
    logEntry.status = 'failed';
    logEntry.error = error.message;

    // Update failure count
    await base44.entities.AutomationRule.update(rule.id, {
      execution_count: (rule.execution_count || 0) + 1,
      failure_count: (rule.failure_count || 0) + 1,
    });
  }

  // Log execution
  if (base44.entities.AutomationRuleLog) {
    await base44.entities.AutomationRuleLog.create(logEntry);
  }

  return logEntry;
};

/**
 * Batch evaluate and execute rules for a trigger event
 */
export const fireRules = async (triggerEvent, entityId, entityData) => {
  try {
    const rules = await base44.entities.AutomationRule.filter({
      trigger_event: triggerEvent,
      is_active: true,
    });

    const results = [];

    for (const rule of rules) {
      if (evaluateRule(rule, entityData)) {
        const result = await executeRuleAction(rule, entityId, entityData.entity_type);
        results.push(result);
      }
    }

    return results;
  } catch (error) {
    console.error('Error firing rules:', error);
    return [];
  }
};

/**
 * Get rule performance stats
 */
export const getRuleStats = (rule) => {
  const successRate = rule.execution_count > 0 
    ? ((rule.success_count / rule.execution_count) * 100).toFixed(1) 
    : 0;

  return {
    total_executions: rule.execution_count || 0,
    success_count: rule.success_count || 0,
    failure_count: rule.failure_count || 0,
    success_rate: `${successRate}%`,
    last_executed: rule.last_executed_at ? new Date(rule.last_executed_at).toLocaleDateString() : 'Never',
  };
};
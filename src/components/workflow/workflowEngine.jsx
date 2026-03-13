/**
 * NTA Workflow Engine
 * Central orchestration for all operational workflows
 */

export const WORKFLOW_CATEGORIES = {
  ONBOARDING: 'onboarding',
  MARKETING_EXECUTION: 'marketing_execution',
  LEAD_MANAGEMENT: 'lead_management',
  SALES_PIPELINE: 'sales_pipeline',
  RETENTION: 'retention',
  UPGRADE_CONVERSION: 'upgrade_conversion',
  CONTENT_PRODUCTION: 'content_production',
  TEAM_OPERATIONS: 'team_operations'
};

export const START_TRIGGERS = {
  SUBSCRIPTION_CREATED: 'subscription_created',
  CAMPAIGN_LAUNCHED: 'campaign_launched',
  LEAD_QUALIFIED: 'lead_qualified',
  RETENTION_SIGNAL: 'retention_signal',
  ENGAGEMENT_MILESTONE: 'engagement_milestone',
  MANUAL_TRIGGER: 'manual_trigger',
  SCHEDULED_WEEKLY: 'scheduled_weekly',
  SCHEDULED_DAILY: 'scheduled_daily',
  API_WEBHOOK: 'api_webhook'
};

/**
 * Workflow stage structure
 */
export function createStage(config) {
  return {
    stageId: config.stageId,
    stageName: config.stageName,
    order: config.order,
    description: config.description,
    action: config.action, // Entity action, function call, etc
    automationHook: config.automationHook, // Automation rule to trigger
    gatingLogic: config.gatingLogic, // Condition to proceed to next stage
    expectedDurationDays: config.expectedDurationDays || 0,
    isParallel: config.isParallel || false, // Can execute in parallel with other stages
    successCriteria: config.successCriteria // What constitutes stage success
  };
}

/**
 * Workflow definition structure
 */
export function createWorkflowDefinition(config) {
  return {
    workflowId: config.workflowId,
    workflowName: config.workflowName,
    workflowCategory: config.workflowCategory,
    description: config.description,
    startTrigger: config.startTrigger,
    stages: config.stages, // Array of stage objects
    relatedEntities: config.relatedEntities || [],
    relatedAgents: config.relatedAgents || [],
    automationHooks: config.automationHooks || [],
    successMetrics: config.successMetrics || {},
    avgDurationDays: config.avgDurationDays || 0,
    activeStatus: config.activeStatus !== false,
    executionCount: 0,
    completionRate: 0,
    lastExecutedAt: null,
    createdAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString()
  };
}

/**
 * Calculate workflow duration
 */
export function getWorkflowDuration(stages) {
  const parallelStages = stages.filter(s => s.isParallel);
  const sequentialStages = stages.filter(s => !s.isParallel);
  
  const parallelDuration = parallelStages.length > 0
    ? Math.max(...parallelStages.map(s => s.expectedDurationDays || 0))
    : 0;

  const sequentialDuration = sequentialStages.reduce(
    (sum, s) => sum + (s.expectedDurationDays || 0),
    0
  );

  return parallelDuration + sequentialDuration;
}

/**
 * Get workflow by ID
 */
export async function getWorkflow(base44, workflowId) {
  const workflows = await base44.entities.WorkflowDefinition.filter(
    { workflowId },
    null,
    1
  );
  return workflows?.[0];
}

/**
 * Get workflows by category
 */
export async function getWorkflowsByCategory(base44, category) {
  return await base44.entities.WorkflowDefinition.filter(
    { workflowCategory: category, activeStatus: true },
    'workflowName'
  );
}

/**
 * Get all active workflows
 */
export async function getActiveWorkflows(base44) {
  return await base44.entities.WorkflowDefinition.filter(
    { activeStatus: true },
    'workflowName'
  );
}

/**
 * Check if workflow can start (gating logic)
 */
export function checkWorkflowGating(stage, stageData) {
  if (!stage.gatingLogic) return true;

  // Simple gating logic evaluation
  if (stage.gatingLogic.requiresManualApproval && !stageData.isApproved) {
    return false;
  }

  if (stage.gatingLogic.minEngagementScore && stageData.engagementScore < stage.gatingLogic.minEngagementScore) {
    return false;
  }

  if (stage.gatingLogic.requiredPlan && stageData.currentPlan !== stage.gatingLogic.requiredPlan) {
    return false;
  }

  return true;
}

/**
 * Validate workflow definition
 */
export function validateWorkflow(workflow) {
  const errors = [];

  if (!workflow.workflowId) errors.push('Missing workflowId');
  if (!workflow.workflowName) errors.push('Missing workflowName');
  if (!workflow.workflowCategory) errors.push('Missing workflowCategory');
  if (!workflow.startTrigger) errors.push('Missing startTrigger');
  if (!workflow.stages || workflow.stages.length === 0) errors.push('Missing stages');

  // Validate stages
  if (workflow.stages) {
    const stageIds = new Set();
    workflow.stages.forEach((stage, i) => {
      if (!stage.stageId) errors.push(`Stage ${i} missing stageId`);
      if (!stage.stageName) errors.push(`Stage ${i} missing stageName`);
      if (stageIds.has(stage.stageId)) errors.push(`Duplicate stageId: ${stage.stageId}`);
      stageIds.add(stage.stageId);
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Get stage by ID
 */
export function getStage(workflow, stageId) {
  return workflow.stages?.find(s => s.stageId === stageId);
}

/**
 * Get next stage in workflow
 */
export function getNextStage(workflow, currentStageId) {
  const currentIndex = workflow.stages?.findIndex(s => s.stageId === currentStageId);
  if (currentIndex === -1 || currentIndex === undefined) return null;
  return workflow.stages?.[currentIndex + 1];
}

/**
 * Calculate workflow progress
 */
export function getWorkflowProgress(stages, completedStages) {
  const totalStages = stages.length;
  const percentComplete = (completedStages / totalStages) * 100;
  return Math.round(percentComplete);
}
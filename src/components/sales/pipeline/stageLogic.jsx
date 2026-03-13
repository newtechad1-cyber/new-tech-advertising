/**
 * Sales Pipeline Stage Logic
 * Manages transitions and validations between pipeline stages
 */

const stageTransitions = {
  new_lead: ['discovery', 'closed_lost'],
  discovery: ['demo', 'closed_lost'],
  demo: ['proposal', 'closed_lost'],
  proposal: ['decision', 'closed_lost'],
  decision: ['closed_won', 'closed_lost', 'delayed'],
  closed_won: [],
  closed_lost: [],
  delayed: ['decision'],
};

const requiredFieldsPerStage = {
  new_lead: ['company_name', 'contact_email'],
  discovery: [
    'company_name',
    'contact_email',
    'growth_goal',
    'marketing_challenges',
  ],
  demo: [
    'company_name',
    'contact_email',
    'growth_goal',
    'demo_scheduled_date',
  ],
  proposal: [
    'company_name',
    'contact_email',
    'recommended_plan',
    'estimated_deal_value',
  ],
  decision: [
    'company_name',
    'contact_email',
    'recommended_plan',
    'estimated_deal_value',
    'decision_timeline',
  ],
  closed_won: [
    'company_name',
    'contact_email',
    'recommended_plan',
    'estimated_deal_value',
  ],
  closed_lost: ['company_name', 'contact_email'],
};

/**
 * Validate transition between stages
 */
export const canTransition = (fromStage, toStage) => {
  return stageTransitions[fromStage]?.includes(toStage) || false;
};

/**
 * Get available next stages for current stage
 */
export const getNextStages = (currentStage) => {
  return stageTransitions[currentStage] || [];
};

/**
 * Check if required fields are completed for a stage
 */
export const isStageComplete = (opportunity, stage) => {
  const required = requiredFieldsPerStage[stage] || [];
  return required.every((field) => opportunity[field]);
};

/**
 * Calculate lead qualification score (0-100)
 */
export const calculateQualificationScore = (opportunity) => {
  let score = 0;

  // Stage progress (0-20 points)
  const stageValues = {
    new_lead: 5,
    discovery: 10,
    demo: 15,
    proposal: 18,
    decision: 20,
    closed_won: 20,
  };
  score += stageValues[opportunity.stage] || 0;

  // Lead score (0-30 points)
  score += Math.min(opportunity.lead_score || 0, 30);

  // Engagement (0-20 points)
  score += Math.min(opportunity.engagement_score || 0, 20);

  // Demo completion (0-15 points)
  if (opportunity.demo_completed) score += 15;

  // Proposal viewed (0-15 points)
  if (opportunity.proposal_status === 'viewed' || opportunity.proposal_status === 'discussed') {
    score += 15;
  }

  return Math.min(score, 100);
};

/**
 * Suggest next action based on opportunity stage
 */
export const suggestNextAction = (opportunity) => {
  const actions = {
    new_lead: 'Schedule initial discovery call',
    discovery: 'Share demo strategy and schedule demo',
    demo: 'Send proposal and pricing summary',
    proposal: 'Follow up on proposal review',
    decision: 'Schedule decision call',
    closed_won: 'Begin onboarding process',
    closed_lost: 'Document learnings',
  };

  return actions[opportunity.stage] || 'Continue engagement';
};

/**
 * Calculate days in current stage
 */
export const getDaysInStage = (opportunity) => {
  if (!opportunity.created_date) return 0;
  const created = new Date(opportunity.created_date);
  const now = new Date();
  return Math.floor((now - created) / (1000 * 60 * 60 * 24));
};

/**
 * Determine stage health color
 */
export const getStageColor = (stage) => {
  const colors = {
    new_lead: 'bg-slate-500',
    discovery: 'bg-blue-500',
    demo: 'bg-purple-500',
    proposal: 'bg-amber-500',
    decision: 'bg-rose-500',
    closed_won: 'bg-green-500',
    closed_lost: 'bg-red-500',
    delayed: 'bg-orange-500',
  };
  return colors[stage] || 'bg-slate-500';
};
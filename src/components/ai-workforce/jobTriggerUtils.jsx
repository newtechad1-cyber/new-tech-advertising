/**
 * Job Trigger Utilities
 * Helper functions to create AI jobs from various system events
 */

import { createJobsFromTrigger } from './aiWorkforceOrchestrator';

/**
 * Trigger jobs when onboarding completes
 */
export const triggerOnboardingJobs = async (clientId, businessName) => {
  try {
    await createJobsFromTrigger('onboarding_completion', clientId, {
      business_name: businessName,
    });
    console.log('[JobTrigger] Onboarding jobs created for:', clientId);
  } catch (error) {
    console.error('[JobTrigger] Failed to create onboarding jobs:', error);
  }
};

/**
 * Trigger weekly content planning job
 */
export const triggerWeeklyContentJobs = async (clientId, businessName) => {
  try {
    await createJobsFromTrigger('weekly_schedule', clientId, {
      business_name: businessName,
      scheduled_for: 'weekly',
    });
    console.log('[JobTrigger] Weekly content jobs created for:', clientId);
  } catch (error) {
    console.error('[JobTrigger] Failed to create weekly content jobs:', error);
  }
};

/**
 * Trigger retention rescue job
 */
export const triggerRetentionRescueJob = async (clientId, businessName, inactivityDays) => {
  try {
    await createJobsFromTrigger('retention_inactivity', clientId, {
      business_name: businessName,
      inactivity_days: inactivityDays,
    });
    console.log('[JobTrigger] Retention rescue job created for:', clientId);
  } catch (error) {
    console.error('[JobTrigger] Failed to create retention rescue job:', error);
  }
};

/**
 * Trigger upgrade campaign job
 */
export const triggerUpgradeCampaignJob = async (clientId, businessName, recommendedPlan) => {
  try {
    await createJobsFromTrigger('upgrade_signal', clientId, {
      business_name: businessName,
      recommended_plan: recommendedPlan,
    });
    console.log('[JobTrigger] Upgrade campaign job created for:', clientId);
  } catch (error) {
    console.error('[JobTrigger] Failed to create upgrade campaign job:', error);
  }
};

/**
 * Trigger manual content generation job
 */
export const triggerContentGenerationJob = async (clientId, jobType, priority = 'medium') => {
  try {
    await createJobsFromTrigger('manual_generation', clientId, {
      job_type: jobType,
      priority: priority,
    });
    console.log('[JobTrigger] Content generation job created:', jobType);
  } catch (error) {
    console.error('[JobTrigger] Failed to create content generation job:', error);
  }
};

/**
 * Check if client has active jobs
 * Returns true if any jobs are running or queued
 */
export const hasActiveJobs = (jobs) => {
  return jobs && jobs.some(j => ['queued', 'running'].includes(j.status));
};

/**
 * Get client's active job count
 */
export const getActiveJobCount = (jobs) => {
  return jobs ? jobs.filter(j => ['queued', 'running'].includes(j.status)).length : 0;
};

/**
 * Get estimated time until completion for all active jobs
 */
export const getEstimatedCompletionTime = (jobs) => {
  const activeJobs = jobs?.filter(j => j.status === 'running') || [];
  if (activeJobs.length === 0) return null;

  // Use the latest estimated completion time
  const times = activeJobs
    .map(j => new Date(j.estimated_completion_time))
    .filter(t => !isNaN(t.getTime()));

  if (times.length === 0) return null;
  return new Date(Math.max(...times.map(t => t.getTime())));
};

/**
 * Get summary of job types in queue
 */
export const getJobTypeSummary = (jobs) => {
  const activeJobs = jobs?.filter(j => ['queued', 'running'].includes(j.status)) || [];
  const summary = {};

  activeJobs.forEach(job => {
    const type = job.job_type.replace(/_/g, ' ');
    summary[type] = (summary[type] || 0) + 1;
  });

  return summary;
};

/**
 * Format job status for display
 */
export const getJobStatusDisplay = (job) => {
  switch (job.status) {
    case 'running':
      return `🚀 ${job.progress_percent || 0}% complete`;
    case 'queued':
      return '⏳ Waiting to start';
    case 'completed':
      return '✅ Complete';
    case 'failed':
      return '❌ Failed';
    case 'paused':
      return '⏸ Paused';
    case 'cancelled':
      return '⭕ Cancelled';
    default:
      return job.status;
  }
};
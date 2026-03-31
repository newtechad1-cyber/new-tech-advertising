/**
 * AI Agent Workforce Orchestrator
 * Central job coordination system for all AI content and marketing agents
 */

import { base44 } from '@/api/base44Client';

/**
 * Priority configuration and weights
 */
const PRIORITY_CONFIG = {
  critical: { weight: 100, timeout_hours: 1, max_retries: 5 },
  high: { weight: 75, timeout_hours: 4, max_retries: 4 },
  medium: { weight: 50, timeout_hours: 12, max_retries: 3 },
  low: { weight: 25, timeout_hours: 24, max_retries: 2 },
};

/**
 * Job type to priority mapping and estimated duration
 */
const JOB_TYPE_CONFIG = {
  // High priority
  onboarding_campaign: {
    priority: 'high',
    category: 'strategy',
    estimated_duration_minutes: 15,
    max_retries: 4,
  },
  retention_rescue: {
    priority: 'high',
    category: 'retention',
    estimated_duration_minutes: 10,
    max_retries: 4,
  },
  upgrade_campaign: {
    priority: 'high',
    category: 'growth',
    estimated_duration_minutes: 12,
    max_retries: 4,
  },

  // Medium priority
  weekly_content_plan: {
    priority: 'medium',
    category: 'strategy',
    estimated_duration_minutes: 20,
    max_retries: 3,
  },
  content_generation: {
    priority: 'medium',
    category: 'content_creation',
    estimated_duration_minutes: 25,
    max_retries: 3,
  },
  video_script: {
    priority: 'medium',
    category: 'content_creation',
    estimated_duration_minutes: 30,
    max_retries: 3,
  },
  social_posts: {
    priority: 'medium',
    category: 'content_creation',
    estimated_duration_minutes: 15,
    max_retries: 3,
  },
  seo_article: {
    priority: 'medium',
    category: 'content_creation',
    estimated_duration_minutes: 40,
    max_retries: 3,
  },

  // Low priority
  content_refresh: {
    priority: 'low',
    category: 'content_creation',
    estimated_duration_minutes: 20,
    max_retries: 2,
  },
  optimization_pass: {
    priority: 'low',
    category: 'growth',
    estimated_duration_minutes: 25,
    max_retries: 2,
  },
};

/**
 * Create a job and add to queue
 */
export const createJob = async (jobData) => {
  try {
    const jobConfig = JOB_TYPE_CONFIG[jobData.job_type] || {};
    
    const job = await base44.entities.AIJobQueue.create({
      ...jobData,
      priority: jobData.priority || jobConfig.priority || 'medium',
      job_category: jobConfig.category,
      status: 'queued',
      retry_count: 0,
      max_retries: jobConfig.max_retries || 3,
      progress_percent: 0,
    });

    console.log('[AIOrchestrator] Job created:', job.id, jobData.job_type);
    return job;
  } catch (error) {
    console.error('[AIOrchestrator] Failed to create job:', error);
    throw error;
  }
};

/**
 * Get next job to run based on priority and status
 */
export const getNextJob = async () => {
  try {
    const queuedJobs = await base44.entities.AIJobQueue.filter({
      status: 'queued',
    });

    if (queuedJobs.length === 0) return null;

    // Sort by priority weight and created date
    const sorted = queuedJobs.sort((a, b) => {
      const priorityDiff = 
        (PRIORITY_CONFIG[b.priority]?.weight || 0) - 
        (PRIORITY_CONFIG[a.priority]?.weight || 0);
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // Same priority: FIFO
      return new Date(a.created_date) - new Date(b.created_date);
    });

    return sorted[0];
  } catch (error) {
    console.error('[AIOrchestrator] Failed to get next job:', error);
    return null;
  }
};

/**
 * Start job execution
 */
export const startJob = async (jobId) => {
  try {
    const now = new Date().toISOString();
    const jobRecord = await base44.entities.AIJobQueue.read(jobId);
    const jobConfig = JOB_TYPE_CONFIG[jobRecord?.job_type] || {};
    const estimatedCompletion = new Date(
      Date.now() + (jobConfig.estimated_duration_minutes || 30) * 60000
    );

    await base44.entities.AIJobQueue.update(jobId, {
      status: 'running',
      started_at: now,
      estimated_completion_time: estimatedCompletion.toISOString(),
      progress_percent: 5,
    });

    console.log('[AIOrchestrator] Job started:', jobId);
  } catch (error) {
    console.error('[AIOrchestrator] Failed to start job:', error);
    throw error;
  }
};

/**
 * Complete job with results
 */
export const completeJob = async (jobId, resultData, qualityScore = 85) => {
  try {
    await base44.entities.AIJobQueue.update(jobId, {
      status: 'completed',
      completed_at: new Date().toISOString(),
      result_data: JSON.stringify(resultData),
      output_quality_score: qualityScore,
      progress_percent: 100,
    });

    console.log('[AIOrchestrator] Job completed:', jobId);

    // Send completion notification
    await notifyJobCompletion(jobId);
  } catch (error) {
    console.error('[AIOrchestrator] Failed to complete job:', error);
    throw error;
  }
};

/**
 * Handle job failure with retry logic
 */
export const failJob = async (jobId, error) => {
  try {
    const job = await base44.entities.AIJobQueue.read(jobId);
    
    if (!job) return;

    const errorDetails = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
    };

    // Check if we should retry
    if (job.retry_count < job.max_retries) {
      await base44.entities.AIJobQueue.update(jobId, {
        status: 'queued',
        retry_count: job.retry_count + 1,
        last_error: error.message,
        error_details: JSON.stringify(errorDetails),
        progress_percent: 0,
      });

      console.log('[AIOrchestrator] Job failed, retrying:', jobId, `(attempt ${job.retry_count + 1}/${job.max_retries})`);
    } else {
      // Max retries exceeded
      await base44.entities.AIJobQueue.update(jobId, {
        status: 'failed',
        last_error: error.message,
        error_details: JSON.stringify(errorDetails),
      });

      console.error('[AIOrchestrator] Job failed permanently:', jobId);

      // Notify admin
      await notifyAdminJobFailure(jobId, error);
    }
  } catch (err) {
    console.error('[AIOrchestrator] Failed to handle job failure:', err);
  }
};

/**
 * Pause job
 */
export const pauseJob = async (jobId) => {
  try {
    await base44.entities.AIJobQueue.update(jobId, {
      status: 'paused',
    });
    console.log('[AIOrchestrator] Job paused:', jobId);
  } catch (error) {
    console.error('[AIOrchestrator] Failed to pause job:', error);
  }
};

/**
 * Resume paused job
 */
export const resumeJob = async (jobId) => {
  try {
    await base44.entities.AIJobQueue.update(jobId, {
      status: 'queued',
    });
    console.log('[AIOrchestrator] Job resumed:', jobId);
  } catch (error) {
    console.error('[AIOrchestrator] Failed to resume job:', error);
  }
};

/**
 * Cancel job
 */
export const cancelJob = async (jobId) => {
  try {
    await base44.entities.AIJobQueue.update(jobId, {
      status: 'cancelled',
    });
    console.log('[AIOrchestrator] Job cancelled:', jobId);
  } catch (error) {
    console.error('[AIOrchestrator] Failed to cancel job:', error);
  }
};

/**
 * Reprioritize job
 */
export const reprioritizeJob = async (jobId, newPriority) => {
  try {
    await base44.entities.AIJobQueue.update(jobId, {
      priority: newPriority,
    });
    console.log('[AIOrchestrator] Job reprioritized:', jobId, 'to', newPriority);
  } catch (error) {
    console.error('[AIOrchestrator] Failed to reprioritize job:', error);
  }
};

/**
 * Update job progress
 */
export const updateJobProgress = async (jobId, progressPercent, message = '') => {
  try {
    await base44.entities.AIJobQueue.update(jobId, {
      progress_percent: progressPercent,
    });
  } catch (error) {
    console.error('[AIOrchestrator] Failed to update progress:', error);
  }
};

/**
 * Get queue statistics
 */
export const getQueueStats = async () => {
  try {
    const allJobs = await base44.entities.AIJobQueue.list('', 1000);

    const stats = {
      total: allJobs.length,
      queued: allJobs.filter(j => j.status === 'queued').length,
      running: allJobs.filter(j => j.status === 'running').length,
      completed: allJobs.filter(j => j.status === 'completed').length,
      failed: allJobs.filter(j => j.status === 'failed').length,
      paused: allJobs.filter(j => j.status === 'paused').length,
      
      // By priority
      critical: allJobs.filter(j => j.priority === 'critical' && j.status !== 'completed').length,
      high: allJobs.filter(j => j.priority === 'high' && j.status !== 'completed').length,
      medium: allJobs.filter(j => j.priority === 'medium' && j.status !== 'completed').length,
      low: allJobs.filter(j => j.priority === 'low' && j.status !== 'completed').length,

      // By category
      content_creation: allJobs.filter(j => j.job_category === 'content_creation' && j.status !== 'completed').length,
      strategy: allJobs.filter(j => j.job_category === 'strategy' && j.status !== 'completed').length,
      growth: allJobs.filter(j => j.job_category === 'growth' && j.status !== 'completed').length,
      retention: allJobs.filter(j => j.job_category === 'retention' && j.status !== 'completed').length,

      // Performance
      avg_completion_time_minutes: 0,
      success_rate: allJobs.length > 0 
        ? ((allJobs.filter(j => j.status === 'completed').length / allJobs.filter(j => j.status !== 'queued').length) * 100).toFixed(1)
        : 0,
    };

    return stats;
  } catch (error) {
    console.error('[AIOrchestrator] Failed to get queue stats:', error);
    return null;
  }
};

/**
 * Get agent performance metrics
 */
export const getAgentMetrics = async () => {
  try {
    const allJobs = await base44.entities.AIJobQueue.list('', 1000);
    const agents = {};

    allJobs.forEach(job => {
      const agent = job.assigned_agent || 'unassigned';
      if (!agents[agent]) {
        agents[agent] = {
          total_jobs: 0,
          completed: 0,
          failed: 0,
          success_rate: 0,
          avg_quality_score: 0,
          avg_duration_minutes: 0,
        };
      }

      agents[agent].total_jobs++;
      if (job.status === 'completed') agents[agent].completed++;
      if (job.status === 'failed') agents[agent].failed++;
    });

    // Calculate rates
    Object.keys(agents).forEach(agent => {
      const agentData = agents[agent];
      if (agentData.total_jobs > 0) {
        agentData.success_rate = ((agentData.completed / agentData.total_jobs) * 100).toFixed(1);
      }
    });

    return agents;
  } catch (error) {
    console.error('[AIOrchestrator] Failed to get agent metrics:', error);
    return {};
  }
};

/**
 * Send notification when job completes
 */
const notifyJobCompletion = async (jobId) => {
  try {
    const job = await base44.entities.AIJobQueue.read(jobId);
    if (!job || !job.notifications_sent) {
      // Trigger notification function
      await base44.functions.invoke('notifyJobCompletion', { job_id: jobId });
      
      await base44.entities.AIJobQueue.update(jobId, {
        notifications_sent: true,
      });
    }
  } catch (error) {
    console.error('[AIOrchestrator] Failed to send completion notification:', error);
  }
};

/**
 * Notify admin of permanent job failure
 */
const notifyAdminJobFailure = async (jobId, error) => {
  try {
    await base44.functions.invoke('notifyAdminJobFailure', {
      job_id: jobId,
      error_message: error.message,
    });
  } catch (err) {
    console.error('[AIOrchestrator] Failed to notify admin:', err);
  }
};

/**
 * Batch create jobs from trigger event
 */
export const createJobsFromTrigger = async (triggerEvent, clientId, context = {}) => {
  const jobMappings = {
    onboarding_completion: [
      {
        job_type: 'onboarding_campaign',
        priority: 'high',
        trigger_source: 'onboarding_completion',
      },
    ],
    weekly_schedule: [
      {
        job_type: 'weekly_content_plan',
        priority: 'medium',
        trigger_source: 'weekly_schedule',
      },
    ],
    retention_inactivity: [
      {
        job_type: 'retention_rescue',
        priority: 'high',
        trigger_source: 'retention_engine',
      },
    ],
    upgrade_signal: [
      {
        job_type: 'upgrade_campaign',
        priority: 'high',
        trigger_source: 'automation_engine',
      },
    ],
    manual_generation: [
      {
        job_type: context.job_type || 'content_generation',
        priority: context.priority || 'medium',
        trigger_source: 'user_request',
      },
    ],
  };

  const jobsToCreate = jobMappings[triggerEvent] || [];
  const createdJobs = [];

  for (const jobConfig of jobsToCreate) {
    try {
      const job = await createJob({
        client_id: clientId,
        ...jobConfig,
        metadata: JSON.stringify(context),
      });
      createdJobs.push(job);
    } catch (error) {
      console.error('[AIOrchestrator] Failed to create job from trigger:', error);
    }
  }

  return createdJobs;
};
import { base44 } from '@/api/base44Client';

/**
 * School Video Render Engine
 * High-level API for managing the complete video rendering pipeline
 * Abstracts away individual service management
 */
class SchoolRenderEngine {
  /**
   * Start complete render pipeline for a project
   * @param {string} projectId - SchoolVideoProjects ID
   * @param {string} submissionId - SchoolSubmissions ID
   * @param {object} options - Configuration overrides
   * @returns {Promise<object>} Render job with status
   */
  static async startRenderPipeline(projectId, submissionId, options = {}) {
    const renderJob = await base44.functions.invoke('schoolSubmissionIntakeService', {
      project_id: projectId,
      submission_id: submissionId
    });

    if (!renderJob.data.success) {
      throw new Error(renderJob.data.error);
    }

    // Start orchestration pipeline
    const orchestration = await base44.functions.invoke('schoolRenderOrchestrator', {
      render_job_id: renderJob.data.render_job_id,
      skip_stages: options.skip_stages || []
    });

    return {
      render_job_id: renderJob.data.render_job_id,
      status: orchestration.data.status,
      message: orchestration.data.message
    };
  }

  /**
   * Get current render job status
   * @param {string} renderJobId - SchoolVideoRenderJobs ID
   * @returns {Promise<object>} Current job status and progress
   */
  static async getRenderJobStatus(renderJobId) {
    const job = await base44.entities.SchoolVideoRenderJobs.get(renderJobId);
    
    if (!job) {
      throw new Error(`Render job ${renderJobId} not found`);
    }

    const processingLog = JSON.parse(job.processing_log || '[]');
    const completedStages = processingLog.filter(e => e.event === 'stage_completed').length;
    const totalStages = 15; // Total pipeline stages

    return {
      id: job.id,
      project_id: job.project_id,
      status: job.status,
      current_stage: job.stage,
      progress_percent: Math.round((completedStages / totalStages) * 100),
      completed_stages: completedStages,
      total_stages: totalStages,
      started_at: job.started_at,
      completed_at: job.completed_at,
      failure_reason: job.failure_reason,
      failure_stage: job.failure_stage,
      retry_count: job.retry_count,
      max_retries: job.max_retries
    };
  }

  /**
   * Get render plan for a job
   * @param {string} renderJobId - SchoolVideoRenderJobs ID
   * @returns {Promise<object>} Machine-usable render plan JSON
   */
  static async getRenderPlan(renderJobId) {
    const job = await base44.entities.SchoolVideoRenderJobs.get(renderJobId);
    if (!job) {
      throw new Error(`Render job ${renderJobId} not found`);
    }

    return JSON.parse(job.render_plan_json || '{}');
  }

  /**
   * Get output manifest with all rendered variants
   * @param {string} renderJobId - SchoolVideoRenderJobs ID
   * @returns {Promise<object>} Output manifest with URLs
   */
  static async getOutputManifest(renderJobId) {
    const job = await base44.entities.SchoolVideoRenderJobs.get(renderJobId);
    if (!job) {
      throw new Error(`Render job ${renderJobId} not found`);
    }

    return JSON.parse(job.output_manifest || '{}');
  }

  /**
   * Render specific output variant (landscape, square, vertical, preview)
   * @param {string} renderJobId - SchoolVideoRenderJobs ID
   * @param {string} variant - Output variant
   * @returns {Promise<object>} Rendered variant info
   */
  static async renderVariant(renderJobId, variant) {
    const ffmpegResult = await base44.functions.invoke('schoolFFmpegRenderAdapter', {
      render_job_id: renderJobId,
      output_variant: variant
    });

    if (!ffmpegResult.data.success) {
      throw new Error(ffmpegResult.data.error);
    }

    return ffmpegResult.data;
  }

  /**
   * Enhance render with creative service (Pika, Runway, HeyGen)
   * @param {string} renderJobId - SchoolVideoRenderJobs ID
   * @param {string} enhancementType - 'pika_ai', 'runway_gen3', 'heygen_avatar'
   * @returns {Promise<object>} Enhanced output info
   */
  static async enhanceRender(renderJobId, enhancementType) {
    const enhancement = await base44.functions.invoke('schoolCreativeEnhancementAdapter', {
      render_job_id: renderJobId,
      enhancement_type: enhancementType
    });

    if (!enhancement.data.success) {
      throw new Error(enhancement.data.error);
    }

    return enhancement.data;
  }

  /**
   * Prepare renders for publishing to all platforms
   * @param {string} renderJobId - SchoolVideoRenderJobs ID
   * @returns {Promise<object>} Publishing preparation result
   */
  static async prepareForPublishing(renderJobId) {
    const preparation = await base44.functions.invoke('schoolPublishingPreparationService', {
      render_job_id: renderJobId
    });

    if (!preparation.data.success) {
      throw new Error(preparation.data.error);
    }

    return preparation.data;
  }

  /**
   * Publish to configured platforms
   * @param {string} renderJobId - SchoolVideoRenderJobs ID
   * @param {array} platforms - ['gallery', 'youtube', 'facebook', 'instagram']
   * @returns {Promise<object>} Publishing results per platform
   */
  static async publishToPlattforms(renderJobId, platforms = []) {
    const publishing = await base44.functions.invoke('schoolPublishingDispatcher', {
      render_job_id: renderJobId,
      target_platforms: platforms
    });

    if (!publishing.data.success && publishing.data.overall_status !== 'partial_publish') {
      throw new Error('Publishing failed');
    }

    return publishing.data;
  }

  /**
   * Retry failed render job from last failure stage
   * @param {string} renderJobId - SchoolVideoRenderJobs ID
   * @returns {Promise<object>} Retry result
   */
  static async retryRenderJob(renderJobId) {
    const job = await base44.entities.SchoolVideoRenderJobs.get(renderJobId);
    
    if (!job) {
      throw new Error(`Render job ${renderJobId} not found`);
    }

    if (job.retry_count >= job.max_retries) {
      throw new Error(`Max retries (${job.max_retries}) exceeded`);
    }

    // Restart orchestration from failure stage
    const orchestration = await base44.functions.invoke('schoolRenderOrchestrator', {
      render_job_id: renderJobId,
      skip_stages: [job.failure_stage] // Skip already-failed stage on retry would go here
    });

    return {
      render_job_id: renderJobId,
      retry_attempt: job.retry_count + 1,
      status: orchestration.data.status
    };
  }

  /**
   * Get detailed processing log
   * @param {string} renderJobId - SchoolVideoRenderJobs ID
   * @returns {Promise<array>} Processing events with timestamps
   */
  static async getProcessingLog(renderJobId) {
    const job = await base44.entities.SchoolVideoRenderJobs.get(renderJobId);
    if (!job) {
      throw new Error(`Render job ${renderJobId} not found`);
    }

    return JSON.parse(job.processing_log || '[]');
  }

  /**
   * Cancel render job
   * @param {string} renderJobId - SchoolVideoRenderJobs ID
   * @returns {Promise<object>} Cancellation result
   */
  static async cancelRenderJob(renderJobId) {
    const job = await base44.entities.SchoolVideoRenderJobs.get(renderJobId);
    if (!job) {
      throw new Error(`Render job ${renderJobId} not found`);
    }

    await base44.entities.SchoolVideoRenderJobs.update(renderJobId, {
      status: 'cancelled',
      stage: `Cancelled at ${new Date().toISOString()}`
    });

    return {
      render_job_id: renderJobId,
      status: 'cancelled'
    };
  }

  /**
   * Get list of active render jobs
   * @param {object} filters - Query filters
   * @returns {Promise<array>} Render jobs
   */
  static async getActiveRenderJobs(filters = {}) {
    const query = {
      status: { $in: ['pending', 'intake', 'normalizing', 'analyzing', 'planning', 'generating_assets', 'ready_for_render', 'rendering'] },
      ...filters
    };

    return await base44.entities.SchoolVideoRenderJobs.filter(query);
  }

  /**
   * Get completed render jobs
   * @param {object} filters - Query filters
   * @returns {Promise<array>} Render jobs
   */
  static async getCompletedRenderJobs(filters = {}) {
    const query = {
      status: 'completed',
      ...filters
    };

    return await base44.entities.SchoolVideoRenderJobs.filter(query);
  }
}

export default SchoolRenderEngine;
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * AI JOB PROCESSOR AUTOMATION
 * Runs when AIJobs status changes from pending to running
 * Invokes the appropriate function based on function_name
 * Handles status transitions and error tracking
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { job_id } = await req.json();

    if (!job_id) {
      return Response.json({ error: 'job_id required' }, { status: 400 });
    }

    // Fetch job
    const jobs = await base44.asServiceRole.entities.AIJobs.filter({ id: job_id });
    if (jobs.length === 0) {
      return Response.json({ error: 'Job not found' }, { status: 404 });
    }

    const job = jobs[0];

    // CRITICAL: Prevent duplicate execution
    if (job.status !== 'pending') {
      return Response.json(
        { error: `Job already in ${job.status} state. Cannot process.` },
        { status: 409 }
      );
    }

    // CRITICAL: Prevent infinite retry loops
    if ((job.retry_count || 0) >= (job.max_retries || 3)) {
      await base44.asServiceRole.entities.AIJobs.update(job_id, {
        status: 'failed',
        completed_at: new Date().toISOString(),
        error_message: `Max retries exceeded (${job.retry_count} of ${job.max_retries || 3})`,
      });
      return Response.json(
        { error: 'Max retries exceeded' },
        { status: 410 }
      );
    }

    // Atomically update to running with timestamp
    const startTime = new Date();
    await base44.asServiceRole.entities.AIJobs.update(job_id, {
      status: 'running',
      started_at: startTime.toISOString(),
    });

    let result = null;
    let outputData = null;

    try {
      const inputData = job.input_data ? JSON.parse(job.input_data) : {};

      // Route to appropriate function based on function_name
      switch (job.function_name) {
        case 'generateSchoolStoryContent':
          result = await base44.asServiceRole.functions.invoke('generateSchoolStoryContent', inputData);
          outputData = result?.generatedContent;
          break;

        case 'schoolVideoScriptGeneration':
          result = await base44.asServiceRole.functions.invoke('schoolVideoScriptGeneration', inputData);
          outputData = result?.script;
          break;

        case 'generateBlogArticle':
          result = await base44.asServiceRole.functions.invoke('generateBlogArticle', inputData);
          outputData = { post_id: result?.post_id, slug: result?.slug };
          break;

        case 'aiVideoStudio':
          result = await base44.asServiceRole.functions.invoke('aiVideoStudio', inputData);
          outputData = result;
          break;

        case 'authorityPlanner':
          result = await base44.asServiceRole.functions.invoke('authorityPlanner', {});
          outputData = result;
          break;

        case 'monthlyReportGenerator':
          result = await base44.asServiceRole.functions.invoke('monthlyReportGenerator', {});
          outputData = result;
          break;

        case 'generateContentFromTopic':
          result = await base44.asServiceRole.functions.invoke('generateContentFromTopic', inputData);
          outputData = result?.generated;
          break;

        case 'adaSalesAssistant':
          result = await base44.asServiceRole.functions.invoke('adaSalesAssistant', inputData);
          outputData = result?.result;
          break;

        case 'createAIContentJob':
          result = await base44.asServiceRole.functions.invoke('createAIContentJob', inputData);
          outputData = { jobId: result?.jobId };
          break;

        default:
          throw new Error(`Unknown function: ${job.function_name}`);
      }

      // Mark job as completed
      const completedAt = new Date();
      const startedAtTime = new Date(job.started_at);
      const durationMs = completedAt.getTime() - startedAtTime.getTime();

      await base44.asServiceRole.entities.AIJobs.update(job_id, {
        status: 'completed',
        completed_at: completedAt.toISOString(),
        output_data: outputData ? JSON.stringify(outputData) : null,
        duration_ms: durationMs,
      });

      // Create or update AIOutput record if applicable
      if (outputData) {
        try {
          await base44.asServiceRole.entities.AIOutputs.create({
            ai_job_id: job_id,
            function_name: job.function_name,
            output_type: determineOutputType(job.function_name),
            title: `${job.function_name} - ${new Date().toLocaleString()}`,
            content: JSON.stringify(outputData),
            client_id: job.client_id,
            school_slug: job.school_slug,
            approval_status: 'pending_review',
          });
        } catch (outputErr) {
          console.warn('[AIJobProcessor] Failed to create AIOutput:', outputErr.message);
        }
      }

      return Response.json({ success: true, job_id, status: 'completed' });
    } catch (funcErr) {
      // CRITICAL: Only update retry_count if under max_retries
      const currentRetry = job.retry_count || 0;
      const maxRetries = job.max_retries || 3;
      const nextStatus = currentRetry >= maxRetries ? 'failed' : 'pending';
      const nextRetryCount = currentRetry + 1;

      await base44.asServiceRole.entities.AIJobs.update(job_id, {
        status: nextStatus,
        completed_at: nextStatus === 'failed' ? new Date().toISOString() : null,
        error_message: funcErr.message,
        retry_count: nextRetryCount,
      });

      console.error('[AIJobProcessor] Function execution failed:', funcErr.message);
      return Response.json(
        { 
          success: false, 
          job_id, 
          error: funcErr.message,
          retryable: nextStatus === 'pending',
          nextRetry: nextStatus === 'pending' ? nextRetryCount : null,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[AIJobProcessor] Automation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function determineOutputType(functionName) {
  const mapping = {
    generateSchoolStoryContent: 'story',
    schoolVideoScriptGeneration: 'video_script',
    generateBlogArticle: 'blog_article',
    aiVideoStudio: 'video',
    authorityPlanner: 'authority_map',
    monthlyReportGenerator: 'report',
    generateContentFromTopic: 'content',
    adaSalesAssistant: 'sales_intelligence',
    createAIContentJob: 'job_queue',
  };
  return mapping[functionName] || 'other';
}
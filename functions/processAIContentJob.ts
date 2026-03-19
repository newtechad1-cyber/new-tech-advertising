import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { jobId, outputData, status } = await req.json();

    if (!jobId) {
      return Response.json({ error: 'Missing jobId' }, { status: 400 });
    }

    // Update job status
    await base44.asServiceRole.entities.AIContentJobs.update(jobId, {
      status: status || 'completed',
      output_data: outputData ? JSON.stringify(outputData) : null,
      completed_at: new Date().toISOString(),
    });

    // Fetch the job to get source entity info
    const jobs = await base44.asServiceRole.entities.AIContentJobs.filter({
      id: jobId,
    });

    if (jobs.length === 0) {
      return Response.json({ error: 'Job not found' }, { status: 404 });
    }

    const job = jobs[0];

    // Create AIContentOutput record
    await base44.asServiceRole.entities.AIContentOutputs.create({
      school_slug: job.school_slug,
      ai_job_id: jobId,
      output_type: job.job_type,
      source_entity_type: job.source_entity_type,
      source_entity_id: job.source_entity_id,
      output_data: outputData ? JSON.stringify(outputData) : null,
      status: 'pending_review',
      approved: false,
      approved_by: null,
      approved_at: null,
    });

    // Sync preview back to source entity if applicable
    if (job.source_entity_type === 'StudentVideoSubmissions' && job.job_type === 'story_generation') {
      const preview = outputData?.story || 'AI draft generated';
      await base44.asServiceRole.entities.StudentVideoSubmissions.update(
        job.source_entity_id,
        { ai_draft_text: preview }
      );
    }

    return Response.json({
      success: true,
      message: 'AI job processed and output created',
      jobId,
      outputStatus: 'pending_review',
    });
  } catch (error) {
    console.error('Error processing AI job:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
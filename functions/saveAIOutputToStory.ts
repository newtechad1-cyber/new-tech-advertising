import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ai_job_id, ai_output_id, school_slug, submission_id } = await req.json();

    if (!ai_job_id || !school_slug) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch AI output
    const outputs = await base44.asServiceRole.entities.AIContentOutputs.filter({
      id: ai_output_id,
    });

    if (!outputs || outputs.length === 0) {
      return Response.json({ error: 'AI output not found' }, { status: 404 });
    }

    const output = outputs[0];

    // Create Story entity with AI draft
    const story = await base44.asServiceRole.entities.SchoolStories.create({
      school_slug,
      title: output.title,
      body: output.body,
      short_summary: output.short_summary,
      ai_generated: true,
      ai_job_id,
      ai_output_id,
      source_submission_id: submission_id,
      status: 'draft',
      ai_approval_status: 'pending_review',
    });

    // Update AI job to link to story
    await base44.asServiceRole.entities.AIContentJobs.update(ai_job_id, {
      source_entity_type: 'SchoolStories',
      source_entity_id: story.id,
    });

    return Response.json({
      success: true,
      story_id: story.id,
      story,
    });
  } catch (error) {
    console.error('Save AI output to story error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
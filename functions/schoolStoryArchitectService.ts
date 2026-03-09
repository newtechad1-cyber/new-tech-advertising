import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * StoryArchitectService
 * Builds narrative structure from clips
 * Creates three-act story outline
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { render_job_id } = await req.json();

    if (!render_job_id) {
      return Response.json({ error: 'Missing render_job_id' }, { status: 400 });
    }

    const renderJob = await base44.entities.SchoolVideoRenderJobs.get(render_job_id);
    if (!renderJob) {
      return Response.json({ error: 'Render job not found' }, { status: 404 });
    }

    const inputManifest = JSON.parse(renderJob.input_manifest);
    const project = await base44.entities.SchoolVideoProjects.get(renderJob.project_id);

    // Build story structure prompt
    const topClips = inputManifest.ranked_by_highlight?.slice(0, 5) || [];
    const transcript = inputManifest.transcript || '';

    const storyResponse = await base44.integrations.Core.InvokeLLM({
      prompt: `Create a three-act story structure for a ${project.project_type} video about:
Event: ${project.event_name || 'School event'}
Activity: ${project.activity_type}
Description: ${project.description}

Based on these top moments and transcript:
${transcript.substring(0, 1000)}

Structure the story with:
1. Hook (first 10 seconds) - grab attention
2. Setup (establish context)
3. Rising action (build momentum with best clips)
4. Climax (emotional peak)
5. Resolution (inspiring conclusion)

Return a narrative outline with timing.`,
      response_json_schema: {
        type: 'object',
        properties: {
          hook: { type: 'string' },
          setup: { type: 'string' },
          rising_action: { type: 'string' },
          climax: { type: 'string' },
          resolution: { type: 'string' },
          suggested_duration: { type: 'string' },
          emotional_arc: { type: 'string' }
        }
      }
    });

    const storyPlan = {
      narrative_structure: storyResponse.data,
      clip_sequence: topClips,
      created_at: new Date().toISOString()
    };

    await base44.entities.SchoolVideoRenderJobs.update(render_job_id, {
      stage: `Story architecture created at ${new Date().toISOString()}`
    });

    console.log(`[StoryArchitectService] Created story structure for job ${render_job_id}`);

    return Response.json({
      success: true,
      story_plan: storyPlan,
      narrative_structure: storyResponse.data
    });

  } catch (error) {
    console.error('[StoryArchitectService] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
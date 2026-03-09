import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      ai_job_id, 
      ai_output_id, 
      project_id, 
      output_type, // 'story', 'video_script', 'captions', 'headlines'
    } = await req.json();

    if (!ai_job_id || !project_id || !output_type) {
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

    // Get current project
    const projects = await base44.asServiceRole.entities.SchoolVideoProjects.filter({
      id: project_id,
    });

    if (!projects || projects.length === 0) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    const project = projects[0];

    // Update project with appropriate AI output
    const updateData = {};

    if (output_type === 'story') {
      updateData.ai_story_job_id = ai_job_id;
      updateData.ai_story_draft = output.body;
      updateData.ai_story_title = output.title;
    } else if (output_type === 'video_script') {
      updateData.ai_video_script_job_id = ai_job_id;
      updateData.ai_video_script_draft = output.body;
    } else if (output_type === 'captions') {
      updateData.ai_caption_job_id = ai_job_id;
      const captions = JSON.parse(output.caption_options || '[]');
      updateData.ai_caption_blocks = JSON.stringify(captions);
    } else if (output_type === 'headlines') {
      const headlines = JSON.parse(output.headline_options || '[]');
      updateData.ai_headline_options = JSON.stringify(headlines);
    }

    updateData.ai_content_status = 'draft_ready';
    updateData.ai_last_updated = new Date().toISOString();

    const updatedProject = await base44.asServiceRole.entities.SchoolVideoProjects.update(
      project_id,
      updateData
    );

    return Response.json({
      success: true,
      project_id: project.id,
      output_type,
      updated_fields: Object.keys(updateData),
    });
  } catch (error) {
    console.error('Save AI output to project error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
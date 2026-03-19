import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * CaptionPlanningService
 * Plans captions for accessibility and engagement
 * Generates SRT format and styling config
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { render_job_id, voiceover_config } = await req.json();

    if (!render_job_id) {
      return Response.json({ error: 'Missing render_job_id' }, { status: 400 });
    }

    const renderJob = await base44.entities.SchoolVideoRenderJobs.get(render_job_id);
    if (!renderJob) {
      return Response.json({ error: 'Render job not found' }, { status: 404 });
    }

    // Generate captions from voiceover script
    const captionResponse = await base44.integrations.Core.InvokeLLM({
      prompt: `Create SRT captions for this voiceover script:
${voiceover_config?.full_script || ''}

Guidelines:
- Captions should be concise (max 42 characters per line)
- Break sentences naturally
- Include sound descriptions in brackets for deaf viewers
- Time each caption for readability
- Add emphasis markers for key points

Return as JSON array of caption objects with timing.`,
      response_json_schema: {
        type: 'object',
        properties: {
          captions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                sequence: { type: 'number' },
                start_time: { type: 'string' },
                end_time: { type: 'string' },
                text: { type: 'string' },
                is_sound_description: { type: 'boolean' }
              }
            }
          },
          srt_content: { type: 'string' }
        }
      }
    });

    const captionConfig = {
      captions: captionResponse.data.captions,
      srt_content: captionResponse.data.srt_content,
      style: {
        font: 'Arial',
        size: 24,
        color: '#ffffff',
        background: '#000000',
        opacity: 0.8,
        position: 'bottom',
        alignment: 'center'
      },
      burn_in: false,
      accessibility_enabled: true,
      created_at: new Date().toISOString()
    };

    await base44.entities.SchoolVideoRenderJobs.update(render_job_id, {
      caption_config: JSON.stringify(captionConfig),
      stage: `Caption plan created at ${new Date().toISOString()}`
    });

    console.log(`[CaptionPlanningService] Created captions for job ${render_job_id}`);

    return Response.json({
      success: true,
      caption_count: captionResponse.data.captions.length,
      caption_config
    });

  } catch (error) {
    console.error('[CaptionPlanningService] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
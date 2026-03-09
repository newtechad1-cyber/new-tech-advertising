import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Clip Analysis Service
 * Analyzes video/photo clips for:
 * - Quality scoring (resolution, lighting, audio)
 * - Energy/engagement levels
 * - AI tagging and scene detection
 * - Emotional tone analysis
 * - Transcript extraction (video)
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { clip_id, media_url, media_type } = await req.json();

    if (!clip_id || !media_url) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Use OpenAI vision for image/video frame analysis
    const analysisPrompt = media_type === 'video'
      ? 'Analyze this video frame for: 1) Quality score (0-10), 2) Energy level (0-10), 3) Emotional tone, 4) Scene description, 5) Detected activity, 6) Detected location, 7) Recommended tags'
      : 'Analyze this photo for: 1) Quality score (0-10), 2) Energy level (0-10), 3) Emotional tone, 4) Scene description, 5) Detected subjects, 6) Recommended tags';

    const analysis = await base44.integrations.Core.InvokeLLM({
      prompt: analysisPrompt,
      file_urls: [media_url],
      response_json_schema: {
        type: 'object',
        properties: {
          quality_score: { type: 'number', min: 0, max: 10 },
          energy_score: { type: 'number', min: 0, max: 10 },
          emotional_tone: { type: 'string' },
          scene_description: { type: 'string' },
          detected_activity: { type: 'string' },
          detected_location: { type: 'string' },
          ai_tags: { type: 'string', description: 'Comma-separated tags' }
        }
      }
    });

    // Update clip with analysis results
    await base44.asServiceRole.entities.SchoolVideoClips.update(clip_id, {
      quality_score: analysis.quality_score || 0,
      energy_score: analysis.energy_score || 0,
      emotional_tone: analysis.emotional_tone || '',
      scene_description: analysis.scene_description || '',
      detected_activity: analysis.detected_activity || '',
      detected_location: analysis.detected_location || '',
      ai_tags: analysis.ai_tags || ''
    });

    // If video, queue transcript extraction
    if (media_type === 'video') {
      await base44.asServiceRole.functions.invoke('schoolVideoTranscriptExtraction', {
        clip_id,
        media_url
      });
    }

    return Response.json({ success: true, analysis });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
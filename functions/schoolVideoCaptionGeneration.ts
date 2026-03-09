import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Caption Generation Service
 * Generates captions/subtitles from video transcripts
 * Integrates with external caption services or uses OpenAI
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { script_id, project_id } = await req.json();

    if (!script_id || !project_id) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Fetch script
    const script = await base44.asServiceRole.entities.SchoolVideoScripts.list()
      .then(all => all.find(s => s.id === script_id));

    if (!script) {
      return Response.json({ error: 'Script not found' }, { status: 404 });
    }

    // Generate SRT format captions from full script
    const captionPrompt = `Convert this video script into SRT subtitle format with proper timing. Include speaker identification and on-screen text descriptions.

Script:
${script.full_voiceover_script}

Scene Structure:
${script.scene_structure}

Generate SRT file format (timecode --> timecode followed by caption text).`;

    const captions = await base44.integrations.Core.InvokeLLM({
      prompt: captionPrompt
    });

    // Store caption metadata in script
    await base44.asServiceRole.entities.SchoolVideoScripts.update(script_id, {
      caption_text: captions
    });

    return Response.json({
      success: true,
      caption_format: 'srt',
      caption_data: captions
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
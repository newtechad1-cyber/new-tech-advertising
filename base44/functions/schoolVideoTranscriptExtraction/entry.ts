import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Transcript Extraction Service
 * Extracts speech-to-text from video/audio clips
 * Integrates with Whisper API or similar STT service
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { clip_id, media_url } = await req.json();

    if (!clip_id || !media_url) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Integration point: Call Whisper API or similar STT service
    // For now, we'll use OpenAI's integration with a prompt for demonstration
    const transcriptPrompt = `Listen to this video and provide a detailed transcript of all spoken content. Include speaker names if identifiable.`;

    const transcript = await base44.integrations.Core.InvokeLLM({
      prompt: transcriptPrompt,
      file_urls: [media_url]
    });

    // Update clip with transcript
    await base44.asServiceRole.entities.SchoolVideoClips.update(clip_id, {
      transcript: transcript || ''
    });

    return Response.json({ success: true, transcript });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
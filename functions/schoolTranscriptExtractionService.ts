import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * TranscriptExtractionService
 * Extracts speech from video using OpenAI Whisper
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
    const videoAsset = inputManifest.assets.find(a => a.type === 'video');

    if (!videoAsset) {
      return Response.json({
        success: true,
        transcript: null,
        message: 'No video asset to transcribe'
      });
    }

    // Use OpenAI Whisper for transcription
    const transcriptionResult = await base44.integrations.Core.InvokeLLM({
      prompt: `Extract and transcribe all speech from this video. Include speaker identification and timestamps.`,
      file_urls: [videoAsset.url],
      response_json_schema: {
        type: 'object',
        properties: {
          full_transcript: { type: 'string' },
          segments: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                timestamp_start: { type: 'string' },
                timestamp_end: { type: 'string' },
                text: { type: 'string' },
                speaker: { type: 'string' }
              }
            }
          },
          language: { type: 'string' },
          confidence: { type: 'number' }
        }
      }
    });

    const updatedManifest = {
      ...inputManifest,
      transcript: transcriptionResult.data.full_transcript,
      transcript_segments: transcriptionResult.data.segments
    };

    await base44.entities.SchoolVideoRenderJobs.update(render_job_id, {
      input_manifest: JSON.stringify(updatedManifest),
      stage: `Transcript extracted at ${new Date().toISOString()}`
    });

    console.log(`[TranscriptExtractionService] Extracted transcript for job ${render_job_id}`);

    return Response.json({
      success: true,
      transcript: transcriptionResult.data.full_transcript,
      segment_count: transcriptionResult.data.segments.length
    });

  } catch (error) {
    console.error('[TranscriptExtractionService] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
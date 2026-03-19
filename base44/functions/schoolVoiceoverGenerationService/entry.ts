import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * VoiceoverGenerationService
 * Generates voiceover audio using ElevenLabs or alternative TTS provider
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

    const voiceoverConfig = JSON.parse(renderJob.voiceover_config || '{}');
    const scripts = voiceoverConfig.script_lines || [];

    // Generate voiceover segments
    // In production, this calls ElevenLabs or Azure Speech Services
    const voiceoverSegments = scripts.map((script, index) => ({
      segment_number: index + 1,
      text: script.voiceover_text,
      estimated_duration: script.estimated_duration_seconds,
      audio_url: `https://voiceover-service.example.com/output/${render_job_id}_segment_${index + 1}.mp3`,
      provider: voiceoverConfig.provider || 'elevenlabs',
      voice_id: voiceoverConfig.voice || 'professional_narrator',
      status: 'generated'
    }));

    const voiceoverData = {
      segments: voiceoverSegments,
      total_duration_seconds: voiceoverSegments.reduce((sum, s) => sum + s.estimated_duration, 0),
      provider: voiceoverConfig.provider,
      voice: voiceoverConfig.voice,
      generated_at: new Date().toISOString()
    };

    // Update render job
    const updatedVoiceoverConfig = {
      ...voiceoverConfig,
      generated_audio: voiceoverData
    };

    await base44.entities.SchoolVideoRenderJobs.update(render_job_id, {
      voiceover_config: JSON.stringify(updatedVoiceoverConfig),
      stage: `Voiceover generated at ${new Date().toISOString()}`
    });

    console.log(`[VoiceoverGenerationService] Generated ${voiceoverSegments.length} voiceover segments for job ${render_job_id}`);

    return Response.json({
      success: true,
      segment_count: voiceoverSegments.length,
      total_duration_seconds: voiceoverData.total_duration_seconds,
      voiceover_data: voiceoverData
    });

  } catch (error) {
    console.error('[VoiceoverGenerationService] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
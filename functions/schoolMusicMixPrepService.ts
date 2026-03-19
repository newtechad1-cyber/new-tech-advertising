import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * MusicMixPrepService
 * Prepares audio mix configuration for render engine
 * Handles voiceover ducking, layering, EQ
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

    const musicConfig = JSON.parse(renderJob.music_config || '{}');
    const voiceoverConfig = JSON.parse(renderJob.voiceover_config || '{}');

    // Build audio mix timeline
    const audioMixTimeline = {
      tracks: [
        {
          track_name: 'voiceover',
          source: voiceoverConfig.generated_audio?.segments || [],
          volume: 1.0,
          ducking_enabled: false,
          start_time: 0
        },
        {
          track_name: 'music_intro',
          source: musicConfig.selected_tracks?.tracks?.intro,
          volume: 0.7,
          ducking_enabled: false,
          start_time: 0,
          fade_in_duration: 0.5,
          fade_out_duration: 0.5
        },
        {
          track_name: 'music_main',
          source: musicConfig.selected_tracks?.tracks?.main,
          volume: 0.5,
          ducking_enabled: true,
          ducking_target: 0.3,
          start_time: 5,
          crossfade_duration: 1.0
        },
        {
          track_name: 'music_outro',
          source: musicConfig.selected_tracks?.tracks?.outro,
          volume: 0.7,
          ducking_enabled: false,
          start_time: 185,
          fade_out_duration: 1.0
        }
      ],
      effects: [
        {
          type: 'eq',
          target_track: 'voiceover',
          low_freq_cut: 100,
          high_freq_shelf: 5000
        },
        {
          type: 'compression',
          target_track: 'music_main',
          threshold: -20,
          ratio: 4,
          attack_ms: 10,
          release_ms: 100
        }
      ],
      master_volume: 0.9,
      loudness_target: -14,
      format: 'stereo',
      sample_rate: 48000
    };

    const mixConfig = {
      timeline: audioMixTimeline,
      voiceover_ducking: musicConfig.voiceover_ducking,
      master_volume: musicConfig.master_volume,
      prepared_at: new Date().toISOString()
    };

    const updatedMusicConfig = {
      ...musicConfig,
      mix_config: mixConfig
    };

    await base44.entities.SchoolVideoRenderJobs.update(render_job_id, {
      music_config: JSON.stringify(updatedMusicConfig),
      stage: `Audio mix prepared at ${new Date().toISOString()}`
    });

    console.log(`[MusicMixPrepService] Prepared audio mix for job ${render_job_id}`);

    return Response.json({
      success: true,
      mix_config: mixConfig,
      track_count: audioMixTimeline.tracks.length
    });

  } catch (error) {
    console.error('[MusicMixPrepService] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * MusicSelectionService
 * Selects and sources music tracks based on planning
 * Supports royalty-free libraries
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

    // Select music from library based on style preference
    // In production, this queries music library or ElevenLabs music service
    const musicTracks = {
      intro: {
        title: 'Bright Beginning',
        duration_seconds: 5,
        style: musicConfig.style,
        url: 'https://music-library.example.com/intro_track_001.mp3',
        bpm: 120,
        key: 'C Major'
      },
      main: {
        title: 'Inspiring Momentum',
        duration_seconds: 180,
        style: musicConfig.style,
        url: 'https://music-library.example.com/main_track_042.mp3',
        bpm: 100,
        key: 'G Major',
        regions: [
          { start: 0, end: 40, intensity: 'building' },
          { start: 40, end: 120, intensity: 'high' },
          { start: 120, end: 180, intensity: 'climax' }
        ]
      },
      outro: {
        title: 'Warm Conclusion',
        duration_seconds: 5,
        style: musicConfig.style,
        url: 'https://music-library.example.com/outro_track_003.mp3',
        bpm: 90,
        key: 'C Major'
      }
    };

    const selectedMusic = {
      tracks: musicTracks,
      mixing_strategy: musicConfig.mixing_strategy,
      total_duration_seconds: Object.values(musicTracks).reduce((sum, t) => sum + t.duration_seconds, 0),
      voiceover_ducking_enabled: true,
      master_volume: musicConfig.master_volume,
      selected_at: new Date().toISOString()
    };

    const updatedMusicConfig = {
      ...musicConfig,
      selected_tracks: selectedMusic
    };

    await base44.entities.SchoolVideoRenderJobs.update(render_job_id, {
      music_config: JSON.stringify(updatedMusicConfig),
      stage: `Music selected at ${new Date().toISOString()}`
    });

    console.log(`[MusicSelectionService] Selected music tracks for job ${render_job_id}`);

    return Response.json({
      success: true,
      selected_music: selectedMusic
    });

  } catch (error) {
    console.error('[MusicSelectionService] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
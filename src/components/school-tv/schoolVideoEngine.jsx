import { base44 } from '@/api/base44Client';

/**
 * School Video Engine Helper Module
 * High-level API for managing the video processing pipeline
 * Simplifies multi-step workflows and provides status tracking
 */

export const SchoolVideoEngine = {
  /**
   * Initiate full video production pipeline
   * From submission approval through to publishing
   */
  async startProductionPipeline(projectId, config = {}) {
    try {
      const project = await base44.entities.SchoolVideoProjects.list()
        .then(all => all.find(p => p.id === projectId));

      if (!project) throw new Error('Project not found');

      // Step 1: Script Generation
      if (project.status === 'ready_for_ai') {
        console.log('[VideoEngine] Step 1: Generating script...');
        await base44.functions.invoke('schoolVideoScriptGeneration', { project_id: projectId });
      }

      // Step 2: Render Queue
      if (project.status === 'script_generated' || project.status === 'ready_for_ai') {
        console.log('[VideoEngine] Step 2: Queueing render...');
        await base44.functions.invoke('schoolVideoRenderOrchestration', {
          project_id: projectId,
          render_config: config.render_config || {
            engine: 'ffmpeg',
            format: 'mp4',
            resolution: '1920x1080',
            aspect_ratio: project.format_type === 'landscape' ? '16:9' : project.format_type === 'square' ? '1:1' : '9:16'
          }
        });
      }

      return { success: true, message: 'Production pipeline started' };
    } catch (error) {
      console.error('[VideoEngine] Pipeline error:', error.message);
      throw error;
    }
  },

  /**
   * Publish completed video to specified platforms
   */
  async publishVideo(projectId, platforms = ['gallery']) {
    try {
      const publish_targets = platforms.map(p => ({ platform: p }));
      
      console.log(`[VideoEngine] Publishing to ${platforms.join(', ')}...`);
      
      await base44.functions.invoke('schoolVideoPublishingOrchestration', {
        project_id: projectId,
        publish_targets
      });

      return { success: true, platforms_queued: platforms.length };
    } catch (error) {
      console.error('[VideoEngine] Publishing error:', error.message);
      throw error;
    }
  },

  /**
   * Get real-time status of a project through the pipeline
   */
  async getProjectStatus(projectId) {
    try {
      const project = await base44.entities.SchoolVideoProjects.list()
        .then(all => all.find(p => p.id === projectId));

      if (!project) throw new Error('Project not found');

      // Fetch related records
      const clips = await base44.entities.SchoolVideoClips.filter({ project_id: projectId });
      const scripts = await base44.entities.SchoolVideoScripts.filter({ project_id: projectId });
      const renders = await base44.entities.SchoolVideoRenders.filter({ project_id: projectId });
      const publishing = await base44.entities.SchoolVideoPublishing.filter({ project_id: projectId });

      return {
        project: {
          id: project.id,
          title: project.title,
          status: project.status,
          publish_status: project.publish_status,
          created_at: project.created_date,
          updated_at: project.updated_date
        },
        pipeline: {
          clips: {
            total: clips.length,
            selected: clips.filter(c => c.is_selected).length,
            analyzed: clips.filter(c => c.quality_score > 0).length,
            with_transcript: clips.filter(c => c.transcript).length
          },
          script: {
            exists: scripts.length > 0,
            version: scripts[0]?.script_version || 0,
            status: scripts[0]?.generation_status || 'pending',
            approved: scripts[0]?.approved_version || false
          },
          render: {
            total: renders.length,
            queued: renders.filter(r => r.status === 'queued').length,
            in_progress: renders.filter(r => ['preparing', 'processing', 'rendering'].includes(r.status)).length,
            completed: renders.filter(r => r.status === 'completed').length,
            failed: renders.filter(r => r.status === 'failed').length,
            latest_status: renders[0]?.status || 'none',
            output_url: renders[0]?.output_url || null
          },
          publishing: {
            total: publishing.length,
            queued: publishing.filter(p => p.destination_status === 'queued').length,
            published: publishing.filter(p => p.destination_status === 'published').length,
            failed: publishing.filter(p => p.destination_status === 'failed').length,
            destinations: {
              gallery: publishing.find(p => p.destination === 'gallery')?.destination_status || 'not_queued',
              youtube: publishing.find(p => p.destination === 'youtube')?.destination_status || 'not_queued',
              facebook: publishing.find(p => p.destination === 'facebook')?.destination_status || 'not_queued',
              instagram: publishing.find(p => p.destination === 'instagram')?.destination_status || 'not_queued'
            }
          }
        },
        progress_percentage: calculateProgress(project, clips, scripts, renders, publishing)
      };
    } catch (error) {
      console.error('[VideoEngine] Status error:', error.message);
      throw error;
    }
  },

  /**
   * Monitor render queue and estimated wait times
   */
  async getRenderQueueStatus() {
    try {
      const allRenders = await base44.entities.SchoolVideoRenders.filter({ status: 'queued' });
      
      const projects = await Promise.all(
        allRenders.map(r => 
          base44.entities.SchoolVideoProjects.list()
            .then(all => all.find(p => p.id === r.project_id))
        )
      );

      const queueItems = allRenders.map((render, idx) => ({
        queue_position: idx + 1,
        render_id: render.id,
        project_title: projects[idx]?.title || 'Unknown',
        priority: projects[idx]?.priority || 'normal',
        estimated_wait_minutes: (idx + 1) * 5 // Assuming ~5 min per render
      }));

      return {
        queue_length: queueItems.length,
        items: queueItems
      };
    } catch (error) {
      console.error('[VideoEngine] Queue status error:', error.message);
      throw error;
    }
  },

  /**
   * Retry failed render job
   */
  async retryRender(renderId) {
    try {
      const render = await base44.entities.SchoolVideoRenders.list()
        .then(all => all.find(r => r.id === renderId));

      if (!render) throw new Error('Render job not found');
      if (render.retry_count >= 3) throw new Error('Max retries exceeded');

      console.log(`[VideoEngine] Retrying render ${renderId}...`);

      await base44.entities.SchoolVideoRenders.update(renderId, {
        status: 'queued',
        retry_count: (render.retry_count || 0) + 1
      });

      return { success: true, retry_count: render.retry_count + 1 };
    } catch (error) {
      console.error('[VideoEngine] Retry error:', error.message);
      throw error;
    }
  },

  /**
   * Get publishing platform URLs after publishing
   */
  async getPublishedUrls(projectId) {
    try {
      const publishing = await base44.entities.SchoolVideoPublishing.filter({ project_id: projectId });

      const urls = {};
      publishing.forEach(p => {
        if (p.destination_status === 'published') {
          urls[p.destination] = p.destination_url;
        }
      });

      return {
        project_id: projectId,
        published_urls: urls,
        total_platforms: publishing.length,
        published_platforms: Object.keys(urls).length
      };
    } catch (error) {
      console.error('[VideoEngine] URL error:', error.message);
      throw error;
    }
  },

  /**
   * Get clip analysis summary for a project
   */
  async getClipAnalysisSummary(projectId) {
    try {
      const clips = await base44.entities.SchoolVideoClips.filter({ project_id: projectId });

      if (clips.length === 0) return { message: 'No clips found' };

      const qualities = clips.map(c => c.quality_score).filter(q => q > 0);
      const energies = clips.map(c => c.energy_score).filter(e => e > 0);

      return {
        total_clips: clips.length,
        analyzed: qualities.length,
        quality_score: qualities.length > 0 ? (qualities.reduce((a, b) => a + b) / qualities.length).toFixed(1) : 'N/A',
        energy_score: energies.length > 0 ? (energies.reduce((a, b) => a + b) / energies.length).toFixed(1) : 'N/A',
        top_clips: clips
          .filter(c => c.quality_score > 0)
          .sort((a, b) => b.quality_score - a.quality_score)
          .slice(0, 3)
          .map(c => ({
            title: c.clip_title,
            quality: c.quality_score,
            energy: c.energy_score,
            tone: c.emotional_tone,
            tags: c.ai_tags
          })),
        clips_with_transcript: clips.filter(c => c.transcript).length
      };
    } catch (error) {
      console.error('[VideoEngine] Analysis error:', error.message);
      throw error;
    }
  }
};

/**
 * Calculate overall progress percentage through pipeline
 */
function calculateProgress(project, clips, scripts, renders, publishing) {
  let progress = 0;
  let totalSteps = 0;

  // Clips analysis (20%)
  if (clips.length > 0) {
    const analyzedPercent = clips.filter(c => c.quality_score > 0).length / clips.length;
    progress += analyzedPercent * 20;
    totalSteps += 20;
  }

  // Script generation (20%)
  if (scripts.length > 0 && scripts[0].generation_status === 'generated') {
    progress += 20;
    totalSteps += 20;
  } else if (project.status === 'script_generated') {
    progress += 20;
    totalSteps += 20;
  }

  // Rendering (30%)
  if (renders.length > 0) {
    const completedRenders = renders.filter(r => r.status === 'completed').length;
    progress += (completedRenders / renders.length) * 30;
    totalSteps += 30;
  }

  // Publishing (30%)
  if (publishing.length > 0) {
    const publishedCount = publishing.filter(p => p.destination_status === 'published').length;
    progress += (publishedCount / publishing.length) * 30;
    totalSteps += 30;
  }

  return Math.round(progress);
}

export default SchoolVideoEngine;
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Clip Ingestion Service
 * Processes newly uploaded video files from SchoolSubmissions
 * Triggers clip extraction, metadata analysis, and quality scoring
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { submission_id, submission } = await req.json();

    if (!submission_id || !submission) {
      return Response.json({ error: 'Missing submission data' }, { status: 400 });
    }

    // MODERATION SAFETY CHECK: Block flagged/rejected uploads from ingestion
    if (submission.moderation_status === 'flagged' || submission.moderation_status === 'requires_review' || submission.status === 'rejected') {
      const blockReason = `Blocked: Upload has moderation_status='${submission.moderation_status}' and status='${submission.status}'. Must be marked safe before clip ingestion.`;
      console.error(`[MODERATION_BLOCK] ${blockReason}`);
      return Response.json({ 
        error: blockReason,
        submission_id,
        moderation_status: submission.moderation_status,
        status: submission.status
      }, { status: 403 });
    }

    // Extract video URLs from submission
    const videoFiles = submission.video_files ? JSON.parse(submission.video_files) : [];
    const photoFiles = submission.photo_files ? JSON.parse(submission.photo_files) : [];

    const clips = [];

    // Process video files
    for (let i = 0; i < videoFiles.length; i++) {
      const clipRecord = await base44.asServiceRole.entities.SchoolVideoClips.create({
        submission_id,
        project_id: submission.project_id || '',
        clip_title: `${submission.submission_title} - Video Part ${i + 1}`,
        media_type: 'video',
        media_url: videoFiles[i],
        source_file_name: `video_part_${i + 1}.mp4`,
        quality_score: 0,
        energy_score: 0,
        is_selected: true
      });
      clips.push(clipRecord);

      // Queue for analysis
      await base44.asServiceRole.functions.invoke('schoolVideoClipAnalysis', {
        clip_id: clipRecord.id,
        media_url: clipRecord.media_url,
        media_type: 'video'
      });
    }

    // Process photo files
    for (let i = 0; i < photoFiles.length; i++) {
      const clipRecord = await base44.asServiceRole.entities.SchoolVideoClips.create({
        submission_id,
        project_id: submission.project_id || '',
        clip_title: `${submission.submission_title} - Photo ${i + 1}`,
        media_type: 'photo',
        media_url: photoFiles[i],
        source_file_name: `photo_${i + 1}.jpg`,
        quality_score: 0,
        energy_score: 0,
        is_selected: true
      });
      clips.push(clipRecord);
    }

    // Update submission status
    await base44.asServiceRole.entities.SchoolSubmissions.update(submission_id, {
      status: 'processing'
    });

    return Response.json({
      success: true,
      clipsCreated: clips.length,
      clipIds: clips.map(c => c.id)
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
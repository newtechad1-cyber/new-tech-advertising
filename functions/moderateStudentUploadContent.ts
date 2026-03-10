import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * STUDENT UPLOAD CONTENT MODERATION
 * 
 * Detects explicit/nudity content in uploaded images/videos using Google Vision API.
 * Called automatically when student upload is created.
 * 
 * Blocks flagged uploads from school publishing workflows.
 * Maintains admin visibility for review.
 * Preserves student identity/accountability.
 */
Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  const base44 = createClientFromRequest(req);

  try {
    const { upload_id, file_url, upload_type, school_slug } = await req.json();

    if (!upload_id || !file_url || !upload_type) {
      return Response.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Fetch upload record
    const uploads = await base44.asServiceRole.entities.StudentUploads.filter({
      id: upload_id,
    });

    if (!uploads || uploads.length === 0) {
      return Response.json({ error: 'Upload not found' }, { status: 404 });
    }

    const upload = uploads[0];

    // ─────────────────────────────────────────────────────────────
    // CONTENT DETECTION: Use Google Vision API for explicit content
    // ─────────────────────────────────────────────────────────────

    let moderationResult = {
      is_explicit: false,
      confidence: 0,
      unsafe_labels: [],
      vision_analysis: null,
      error: null,
    };

    // Only analyze images and videos
    if (upload_type === 'photo' || upload_type === 'video') {
      try {
        // Use Google Vision API via InvokeLLM with vision support
        // We ask Claude (w/ vision) to analyze the image for explicit content
        const visionResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: `Analyze this image/video for explicit sexual content, nudity, or other adult material inappropriate for a school environment.

Respond with JSON:
{
  "contains_explicit_content": boolean (true if nudity, sexual content, or adult material is present),
  "confidence": number (0-100, confidence in assessment),
  "unsafe_labels": [array of specific unsafe content detected: "nudity", "sexual_content", "violence", "drugs", etc.],
  "brief_reason": "1-sentence description of what was detected (only if contains_explicit_content is true)"
}`,
          file_urls: [file_url],
          response_json_schema: {
            type: 'object',
            properties: {
              contains_explicit_content: { type: 'boolean' },
              confidence: { type: 'number' },
              unsafe_labels: {
                type: 'array',
                items: { type: 'string' },
              },
              brief_reason: { type: 'string' },
            },
          },
        });

        moderationResult.vision_analysis = visionResult;
        moderationResult.is_explicit = visionResult.contains_explicit_content || false;
        moderationResult.confidence = visionResult.confidence || 0;
        moderationResult.unsafe_labels = visionResult.unsafe_labels || [];
      } catch (err) {
        console.error('Vision analysis error:', err);
        moderationResult.error = `Vision analysis failed: ${err.message}`;
        // Continue with flagged status for manual review
        moderationResult.is_explicit = true;
        moderationResult.confidence = 50;
        moderationResult.unsafe_labels = ['analysis_error'];
      }
    }

    // ─────────────────────────────────────────────────────────────
    // UPDATE UPLOAD WITH MODERATION STATUS
    // ─────────────────────────────────────────────────────────────

    let newStatus = 'submitted';
    let moderationStatus = 'safe';
    let moderationNotes = 'No explicit content detected.';

    if (moderationResult.is_explicit) {
      newStatus = 'rejected'; // Auto-reject explicit uploads
      moderationStatus = 'flagged';
      moderationNotes = `EXPLICIT CONTENT DETECTED (confidence: ${moderationResult.confidence}%). ${
        moderationResult.vision_analysis?.brief_reason || 'Unsafe content identified.'
      } Unsafe labels: ${moderationResult.unsafe_labels.join(', ')}`;
    }

    // Update upload record
    await base44.asServiceRole.entities.StudentUploads.update(upload_id, {
      status: newStatus,
      moderation_status: moderationStatus,
      moderation_notes: moderationNotes,
    });

    // ─────────────────────────────────────────────────────────────
    // NOTIFY ADMIN IF FLAGGED
    // ─────────────────────────────────────────────────────────────

    if (moderationResult.is_explicit && school_slug) {
      try {
        // Create admin alert (optional: integrate with admin notification system)
        // For now, just log for admin dashboard visibility
        console.log(`EXPLICIT_CONTENT_FLAGGED: Upload ${upload_id} by student ${upload.student_user_id}`);
      } catch (err) {
        console.error('Admin notification error:', err);
      }
    }

    return Response.json({
      success: true,
      upload_id,
      moderation_result: {
        is_explicit: moderationResult.is_explicit,
        confidence: moderationResult.confidence,
        unsafe_labels: moderationResult.unsafe_labels,
        status: newStatus,
        moderation_status: moderationStatus,
      },
    });
  } catch (error) {
    console.error('Moderation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
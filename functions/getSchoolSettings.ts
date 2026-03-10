import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Shared utility — returns SchoolSettings for a given school_slug.
 * Auto-creates a record with safe defaults if none exists yet.
 * All downstream workflows (moderation, rendering, publishing, AI generation)
 * call this or query SchoolSettings directly.
 */

export const SCHOOL_SETTINGS_DEFAULTS = {
  // AI content defaults
  enable_ai_tools: true,
  ai_tone_default: 'warm',
  ai_auto_generate_captions: true,
  ai_auto_generate_story: false,
  ai_story_word_count_min: 120,
  ai_story_word_count_max: 200,
  // Moderation rules
  ai_content_moderation: true,
  moderation_strictness: 'standard',
  auto_approve_staff_submissions: false,
  require_consent: true,
  require_release_signature: true,
  // Publishing defaults
  manual_publish_only: true,
  auto_publish: false,
  default_content_visibility: 'staff',
  publish_to_gallery_default: true,
  publish_to_youtube_default: false,
  publish_to_facebook_default: false,
  publish_to_instagram_default: false,
  enable_social_sharing: false,
  // Video defaults
  voiceover_enabled_default: true,
  captions_enabled_default: true,
  intro_enabled_default: true,
  outro_enabled_default: true,
  video_format_default: 'landscape',
  video_resolution_default: '1920x1080',
  video_duration_target: '2-3 minutes',
  music_enabled_default: true,
  // Approval workflow
  require_teacher_review: true,
  approval_required_for_publish: true,
  min_approvals_required: 1,
  auto_archive_rejected: false,
  submission_review_deadline_days: 7,
  allow_public_submissions: false,
  max_file_size_mb: 500,
  allowed_file_types: 'mp4,mov,jpg,png,gif',
  // Notifications
  notify_on_new_submission: true,
  notify_on_ai_completion: true,
  notify_on_render_complete: true,
  notify_on_publish: true,
  notification_email: '',
  notify_contributor_on_approval: true,
  notify_contributor_on_rejection: true,
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { school_slug } = await req.json();

    if (!school_slug) {
      return Response.json({ error: 'Missing school_slug' }, { status: 400 });
    }

    const existing = await base44.asServiceRole.entities.SchoolSettings.filter({ school_slug });

    if (existing.length > 0) {
      // Merge with defaults to backfill any fields added after record creation
      const settings = { ...SCHOOL_SETTINGS_DEFAULTS, ...existing[0] };
      return Response.json({ settings, created: false });
    }

    // Auto-create with safe defaults
    const created = await base44.asServiceRole.entities.SchoolSettings.create({
      school_slug,
      ...SCHOOL_SETTINGS_DEFAULTS,
    });

    return Response.json({ settings: { ...SCHOOL_SETTINGS_DEFAULTS, ...created }, created: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
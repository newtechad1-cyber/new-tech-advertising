/**
 * MODERATION SAFETY CHECKS
 * Centralized utility for enforcing moderation rules across workflows
 */

/**
 * Check if an upload/submission is safe to use in downstream workflows
 * @param {Object} item - StudentUploads or SchoolSubmissions record
 * @returns {boolean} - true if blocked, false if safe
 */
export const isModerationBlocked = (item) => {
  if (!item) return false;
  return (
    item.moderation_status === 'flagged' ||
    item.moderation_status === 'requires_review' ||
    item.status === 'rejected'
  );
};

/**
 * Get human-readable block reason
 * @param {Object} item - StudentUploads or SchoolSubmissions record
 * @returns {string} - Block reason message
 */
export const getModerationBlockReason = (item) => {
  if (!item || !isModerationBlocked(item)) return null;
  return `Upload blocked: moderation_status='${item.moderation_status}', status='${item.status}'. Must be marked safe before use.`;
};

/**
 * Allowed workflows for safe uploads
 */
export const ALLOWED_WORKFLOWS = {
  CLIP_INGESTION: ['submitted', 'under_review', 'approved', 'published'],
  STORY_CREATION: ['submitted', 'under_review', 'approved', 'published'],
  PROJECT_ASSET: ['submitted', 'under_review', 'approved', 'published'],
  VIDEO_RENDER: ['submitted', 'under_review', 'approved', 'published'],
  PUBLISH: ['approved', 'published'],
};

/**
 * Validate upload before allowing in workflow
 * @param {Object} upload - StudentUploads record
 * @param {string} workflow - Workflow type
 * @returns {Object} - { allowed: boolean, reason: string }
 */
export const validateUploadForWorkflow = (upload, workflow) => {
  if (!upload) {
    return { allowed: false, reason: 'Upload not found' };
  }

  if (isModerationBlocked(upload)) {
    return { allowed: false, reason: getModerationBlockReason(upload) };
  }

  if (upload.moderation_status !== 'safe') {
    return {
      allowed: false,
      reason: `Upload moderation status is '${upload.moderation_status}', must be 'safe'`
    };
  }

  const allowedStatuses = ALLOWED_WORKFLOWS[workflow];
  if (allowedStatuses && !allowedStatuses.includes(upload.status)) {
    return {
      allowed: false,
      reason: `Upload status '${upload.status}' not allowed for ${workflow}`
    };
  }

  return { allowed: true, reason: null };
};
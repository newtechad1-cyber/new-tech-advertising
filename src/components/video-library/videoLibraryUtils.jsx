/**
 * Video Library Utilities
 * Helper functions for issue detection, formatting, etc.
 */

export function getVideoIssues(video, publishJobs = []) {
  const issues = [];

  if (!video.transcript_text && video.transcript_status !== 'running') {
    issues.push('Missing transcript');
  }

  if (!video.captions_json && video.captions_status !== 'running') {
    issues.push('Missing captions');
  }

  if (!video.branding_status || video.branding_status === 'not_started') {
    issues.push('No branding applied');
  }

  if (video.render_status === 'failed') {
    issues.push('Render failed');
  }

  const failedJobs = publishJobs.filter(j => j.video_id === video.id && j.job_status === 'failed');
  if (failedJobs.length > 0) {
    issues.push(`${failedJobs.length} publish blocked`);
  }

  if (video.approval_status === 'pending_review' && !video.review_notes) {
    issues.push('Awaiting review');
  }

  return issues;
}

export function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function getStatusColor(status) {
  const colors = {
    uploaded: 'bg-slate-100 text-slate-700',
    processing: 'bg-blue-100 text-blue-700',
    ready_for_review: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    rendering: 'bg-purple-100 text-purple-700',
    published: 'bg-emerald-100 text-emerald-700',
    failed: 'bg-red-100 text-red-700',
  };
  return colors[status] || colors.uploaded;
}

export function getApprovalColor(status) {
  const colors = {
    pending: 'bg-amber-50 border border-amber-200',
    approved: 'bg-green-50 border border-green-200',
    rejected: 'bg-red-50 border border-red-200',
  };
  return colors[status] || 'bg-slate-50';
}

export function calculatePublishingProgress(video, publishJobs = []) {
  const jobs = publishJobs.filter(j => j.video_id === video.id);
  if (jobs.length === 0) return 0;
  
  const published = jobs.filter(j => j.job_status === 'published').length;
  return Math.round((published / jobs.length) * 100);
}

export function getDurationString(seconds) {
  if (!seconds) return '—';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export function sortVideos(videos, sortBy = 'created_date', order = 'desc') {
  const sorted = [...videos].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    
    if (aVal < bVal) return order === 'desc' ? 1 : -1;
    if (aVal > bVal) return order === 'desc' ? -1 : 1;
    return 0;
  });
  
  return sorted;
}
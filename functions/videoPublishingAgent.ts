import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// ─── Helpers ────────────────────────────────────────────────────────────────

function slugify(text) {
  return (text || 'video')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) + '-' + Date.now().toString(36);
}

function getCopyForDest(dest, video) {
  const map = {
    website: { title: video.website_title || video.title, summary: video.website_summary, body: video.website_body },
    facebook: { caption: video.facebook_caption },
    instagram: { caption: video.instagram_caption },
    youtube: { title: video.youtube_title || video.title, description: video.youtube_description },
    tiktok: { caption: video.tiktok_caption },
    gbp: { text: video.gbp_post_text }
  };
  return map[dest] || {};
}

async function writeAudit(base44, data) {
  await base44.asServiceRole.entities.VideoPublishAuditLog.create({
    ...data,
    logged_at: new Date().toISOString()
  });
}

// ─── Destination Publishers ──────────────────────────────────────────────────

async function publishWebsite(base44, video, job) {
  const title = video.website_title || video.title || 'Video';
  const slug = slugify(title);
  const publicUrl = `/video-story/${slug}`;

  const story = await base44.asServiceRole.entities.WebsiteVideoStory.create({
    video_id: video.id,
    company_id: video.client_id || video.business_id,
    title,
    slug,
    summary: video.website_summary || '',
    body: video.website_body || '',
    thumbnail_url: video.thumbnail_url || '',
    video_url: video.render_output_url || video.final_video || video.source_file_url || '',
    transcript_excerpt: video.transcript_text ? video.transcript_text.slice(0, 600) : '',
    seo_title: video.website_title || video.title,
    seo_description: video.website_summary || '',
    cta_text: video.cta_text || video.cta || '',
    cta_url: video.website_url || '',
    category: video.request_type || 'general',
    publish_status: 'published',
    published_at: new Date().toISOString(),
    public_url: publicUrl
  });

  await base44.asServiceRole.entities.VideoPublishJob.update(job.id, {
    job_status: 'published',
    publish_started_at: new Date().toISOString(),
    publish_completed_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    publish_url: publicUrl,
    external_post_id: story.id,
    response_json: JSON.stringify({ story_id: story.id, slug, url: publicUrl })
  });

  // Backlink story id to video
  await base44.asServiceRole.entities.VideoRequests.update(video.id, {
    website_story_id: story.id
  });

  return { success: true, url: publicUrl, story_id: story.id };
}

async function publishFacebook(base44, video, job) {
  const pageToken = Deno.env.get('META_PAGE_ACCESS_TOKEN');
  const pageId = Deno.env.get('META_PAGE_ID');

  if (!pageToken || !pageId) {
    await base44.asServiceRole.entities.VideoPublishJob.update(job.id, {
      job_status: 'blocked',
      error_message: 'Facebook Page Access Token or Page ID not configured in environment secrets.'
    });
    return { success: false, reason: 'not_configured' };
  }

  const videoUrl = video.render_output_url || video.final_video;
  if (!videoUrl || !videoUrl.startsWith('http')) {
    await base44.asServiceRole.entities.VideoPublishJob.update(job.id, {
      job_status: 'blocked',
      error_message: 'Render output URL is not publicly accessible. Facebook requires a public HTTPS video URL.'
    });
    return { success: false, reason: 'no_public_url' };
  }

  const caption = video.facebook_caption || video.website_summary || video.title;

  await base44.asServiceRole.entities.VideoPublishJob.update(job.id, { job_status: 'publishing', publish_started_at: new Date().toISOString() });

  const res = await fetch(`https://graph.facebook.com/v18.0/${pageId}/videos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_url: videoUrl, description: caption, access_token: pageToken })
  });

  const data = await res.json();

  if (data.id) {
    const publishUrl = `https://www.facebook.com/${pageId}/videos/${data.id}`;
    await base44.asServiceRole.entities.VideoPublishJob.update(job.id, {
      job_status: 'published',
      publish_completed_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
      external_post_id: data.id,
      publish_url: publishUrl,
      response_json: JSON.stringify(data)
    });
    return { success: true, post_id: data.id, url: publishUrl };
  } else {
    const errMsg = data.error?.message || 'Facebook API returned an error';
    await base44.asServiceRole.entities.VideoPublishJob.update(job.id, {
      job_status: 'failed',
      error_message: errMsg,
      response_json: JSON.stringify(data)
    });
    return { success: false, error: errMsg };
  }
}

async function publishInstagram(base44, video, job) {
  const pageToken = Deno.env.get('META_PAGE_ACCESS_TOKEN');
  const igAccountId = Deno.env.get('META_INSTAGRAM_ACCOUNT_ID');

  if (!pageToken || !igAccountId) {
    await base44.asServiceRole.entities.VideoPublishJob.update(job.id, {
      job_status: 'blocked',
      error_message: 'Instagram Business Account ID or access token not configured in environment secrets.'
    });
    return { success: false, reason: 'not_configured' };
  }

  const videoUrl = video.render_output_url || video.final_video;
  if (!videoUrl || !videoUrl.startsWith('http')) {
    await base44.asServiceRole.entities.VideoPublishJob.update(job.id, {
      job_status: 'blocked',
      error_message: 'Render output URL is not publicly accessible. Instagram requires a public HTTPS video URL.'
    });
    return { success: false, reason: 'no_public_url' };
  }

  const caption = video.instagram_caption || video.facebook_caption || video.title;

  await base44.asServiceRole.entities.VideoPublishJob.update(job.id, { job_status: 'publishing', publish_started_at: new Date().toISOString() });

  // Step 1: Create media container
  const containerRes = await fetch(`https://graph.facebook.com/v18.0/${igAccountId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ video_url: videoUrl, caption, media_type: 'REELS', access_token: pageToken })
  });
  const containerData = await containerRes.json();

  if (!containerData.id) {
    const errMsg = containerData.error?.message || 'Instagram media container creation failed';
    await base44.asServiceRole.entities.VideoPublishJob.update(job.id, {
      job_status: 'failed',
      error_message: errMsg,
      response_json: JSON.stringify(containerData)
    });
    return { success: false, error: errMsg };
  }

  // Step 2: Wait for processing, then publish
  await new Promise(r => setTimeout(r, 4000));

  const publishRes = await fetch(`https://graph.facebook.com/v18.0/${igAccountId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: containerData.id, access_token: pageToken })
  });
  const publishData = await publishRes.json();

  if (publishData.id) {
    const publishUrl = `https://www.instagram.com/p/${publishData.id}/`;
    await base44.asServiceRole.entities.VideoPublishJob.update(job.id, {
      job_status: 'published',
      publish_completed_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
      external_post_id: publishData.id,
      publish_url: publishUrl,
      response_json: JSON.stringify(publishData)
    });
    return { success: true, post_id: publishData.id, url: publishUrl };
  } else {
    const errMsg = publishData.error?.message || 'Instagram publish step failed';
    await base44.asServiceRole.entities.VideoPublishJob.update(job.id, {
      job_status: 'failed',
      error_message: errMsg,
      response_json: JSON.stringify(publishData)
    });
    return { success: false, error: errMsg };
  }
}

async function publishYoutube(base44, video, job) {
  await base44.asServiceRole.entities.VideoPublishJob.update(job.id, {
    job_status: 'blocked',
    error_message: 'YouTube OAuth channel connection not configured. Add YouTube OAuth credentials and connect the channel in Distribution Settings.'
  });
  return { success: false, reason: 'needs_connection', platform: 'youtube' };
}

async function publishTikTok(base44, video, job) {
  // TikTok client keys exist in secrets — user OAuth authorization still required
  await base44.asServiceRole.entities.VideoPublishJob.update(job.id, {
    job_status: 'blocked',
    error_message: 'TikTok API keys are configured. User OAuth authorization is required. Connect your TikTok account in Distribution Settings to complete this integration.'
  });
  return { success: false, reason: 'needs_oauth', platform: 'tiktok' };
}

async function publishGBP(base44, video, job) {
  await base44.asServiceRole.entities.VideoPublishJob.update(job.id, {
    job_status: 'blocked',
    error_message: 'Google Business Profile API connection not configured. Connect a GBP account in Distribution Settings.'
  });
  return { success: false, reason: 'needs_connection', platform: 'gbp' };
}

async function processJobByType(base44, video, job, destType) {
  switch (destType) {
    case 'website': return publishWebsite(base44, video, job);
    case 'facebook': return publishFacebook(base44, video, job);
    case 'instagram': return publishInstagram(base44, video, job);
    case 'youtube': return publishYoutube(base44, video, job);
    case 'tiktok': return publishTikTok(base44, video, job);
    case 'gbp': return publishGBP(base44, video, job);
    default: return { success: false, reason: 'unknown_destination' };
  }
}

// ─── Action: Create Publish Jobs ─────────────────────────────────────────────

async function createJobs(base44, videoId, actorEmail) {
  const video = await base44.asServiceRole.entities.VideoRequests.get(videoId);
  if (!video) return Response.json({ error: 'Video not found' }, { status: 404 });

  if (video.review_status !== 'approved') {
    return Response.json({ error: 'Video must be approved before publishing jobs can be created.' }, { status: 400 });
  }

  const DEST_KEYS = [
    { key: 'website_publish_enabled', type: 'website' },
    { key: 'facebook_publish_enabled', type: 'facebook' },
    { key: 'instagram_publish_enabled', type: 'instagram' },
    { key: 'youtube_publish_enabled', type: 'youtube' },
    { key: 'tiktok_publish_enabled', type: 'tiktok' },
    { key: 'gbp_publish_enabled', type: 'gbp' },
  ];

  const enabledDests = DEST_KEYS.filter(d => video[d.key]).map(d => d.type);
  if (enabledDests.length === 0) {
    return Response.json({ error: 'No publish destinations selected on this video.' }, { status: 400 });
  }

  // Prevent duplicate published jobs
  const existingJobs = await base44.asServiceRole.entities.VideoPublishJob.filter({ video_id: videoId });
  const alreadyPublishedDests = existingJobs.filter(j => j.job_status === 'published').map(j => j.destination_type);

  const results = [];

  for (const destType of enabledDests) {
    if (alreadyPublishedDests.includes(destType)) {
      results.push({ destination: destType, status: 'skipped', reason: 'already_published' });
      continue;
    }

    const scheduledFor = video.publish_immediately ? null : video.scheduled_publish_at;
    const initialStatus = scheduledFor ? 'scheduled' : 'queued';

    const job = await base44.asServiceRole.entities.VideoPublishJob.create({
      video_id: video.id,
      video_title: video.title,
      destination_type: destType,
      job_status: initialStatus,
      review_gate_status: 'approved',
      scheduled_for: scheduledFor || null,
      company_id: video.client_id || video.business_id || null,
      brand_name: video.brand_name || null,
      created_by: actorEmail,
      triggered_by: actorEmail,
      payload_json: JSON.stringify(getCopyForDest(destType, video))
    });

    await writeAudit(base44, {
      video_id: video.id,
      publish_job_id: job.id,
      event_type: 'job_created',
      event_label: `Publish job created — ${destType}`,
      event_details: `Status: ${initialStatus}`,
      destination: destType,
      actor_type: 'admin',
      actor_name: actorEmail
    });

    if (!scheduledFor) {
      const result = await processJobByType(base44, video, job, destType);

      await writeAudit(base44, {
        video_id: video.id,
        publish_job_id: job.id,
        event_type: result.success ? 'publish_succeeded' : (result.reason ? 'needs_connection' : 'publish_failed'),
        event_label: result.success ? `Published to ${destType}` : `${destType} publish ${result.reason === 'needs_connection' || result.reason === 'needs_oauth' ? 'blocked — needs connection' : 'failed'}`,
        event_details: result.success ? `URL: ${result.url || ''}` : (result.error || result.reason || ''),
        destination: destType,
        actor_type: 'system',
        actor_name: 'video_publishing_agent'
      });

      results.push({ destination: destType, status: result.success ? 'published' : 'failed', ...result });
    } else {
      results.push({ destination: destType, status: 'scheduled', scheduled_for: scheduledFor });
    }
  }

  // Update video processing_status
  const publishedCount = results.filter(r => r.status === 'published').length;
  const newStatus = publishedCount === enabledDests.length ? 'published' : 'publishing';

  await base44.asServiceRole.entities.VideoRequests.update(videoId, {
    processing_status: newStatus,
    last_publish_attempt_at: new Date().toISOString(),
    last_publish_result: JSON.stringify(results)
  });

  await writeAudit(base44, {
    video_id: videoId,
    event_type: 'publish_pipeline_started',
    event_label: `Publishing pipeline executed — ${enabledDests.length} destination(s)`,
    event_details: results.map(r => `${r.destination}: ${r.status}`).join(', '),
    actor_type: 'admin',
    actor_name: actorEmail
  });

  return Response.json({ success: true, results, jobs_created: results.filter(r => r.status !== 'skipped').length });
}

// ─── Action: Retry Job ────────────────────────────────────────────────────────

async function retryJob(base44, jobId, actorEmail) {
  const job = await base44.asServiceRole.entities.VideoPublishJob.get(jobId);
  if (!job) return Response.json({ error: 'Publish job not found' }, { status: 404 });

  if (job.job_status === 'published') {
    return Response.json({ error: 'Job already published. Use an explicit republish action if needed.' }, { status: 400 });
  }

  const video = await base44.asServiceRole.entities.VideoRequests.get(job.video_id);
  if (!video) return Response.json({ error: 'Video not found' }, { status: 404 });
  if (video.review_status !== 'approved') {
    return Response.json({ error: 'Video is no longer approved. Re-approve before retrying.' }, { status: 400 });
  }

  const retryCount = (job.retry_count || 0) + 1;
  const updatedJob = { ...job, retry_count: retryCount, job_status: 'queued', error_message: null };

  await base44.asServiceRole.entities.VideoPublishJob.update(jobId, {
    job_status: 'queued', retry_count: retryCount, last_retry_at: new Date().toISOString(), error_message: null
  });

  await writeAudit(base44, {
    video_id: job.video_id, publish_job_id: jobId,
    event_type: 'retry_requested',
    event_label: `Retry #${retryCount} requested — ${job.destination_type}`,
    event_details: `By ${actorEmail}`,
    destination: job.destination_type, actor_type: 'admin', actor_name: actorEmail
  });

  const result = await processJobByType(base44, video, updatedJob, job.destination_type);

  await writeAudit(base44, {
    video_id: job.video_id, publish_job_id: jobId,
    event_type: result.success ? 'retry_succeeded' : 'retry_failed',
    event_label: result.success ? `Retry succeeded — ${job.destination_type}` : `Retry failed — ${job.destination_type}`,
    event_details: result.success ? `URL: ${result.url || ''}` : (result.error || result.reason || ''),
    destination: job.destination_type, actor_type: 'system', actor_name: 'video_publishing_agent'
  });

  return Response.json({ success: result.success, result });
}

// ─── Action: Process Scheduled Jobs ──────────────────────────────────────────

async function processScheduled(base44) {
  const now = new Date().toISOString();
  const scheduledJobs = await base44.asServiceRole.entities.VideoPublishJob.filter({ job_status: 'scheduled' });
  const dueJobs = scheduledJobs.filter(j => j.scheduled_for && j.scheduled_for <= now);

  const results = [];
  for (const job of dueJobs) {
    const video = await base44.asServiceRole.entities.VideoRequests.get(job.video_id);
    if (!video || video.review_status !== 'approved') continue;

    await base44.asServiceRole.entities.VideoPublishJob.update(job.id, { job_status: 'queued' });
    await writeAudit(base44, {
      video_id: job.video_id, publish_job_id: job.id,
      event_type: 'scheduled_activated',
      event_label: `Scheduled job activated — ${job.destination_type}`,
      destination: job.destination_type, actor_type: 'system', actor_name: 'scheduler'
    });

    const result = await processJobByType(base44, video, { ...job, job_status: 'queued' }, job.destination_type);
    results.push({ job_id: job.id, destination: job.destination_type, result });
  }

  return Response.json({ processed: results.length, results });
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { action, video_id, job_id } = body;

    if (action === 'create_jobs') return createJobs(base44, video_id, user.email);
    if (action === 'retry_job') return retryJob(base44, job_id, user.email);
    if (action === 'process_scheduled') return processScheduled(base44);

    return Response.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});
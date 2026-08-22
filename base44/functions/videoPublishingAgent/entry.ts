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
  const slug = video.website_slug || stableVideoSlug(title);
  const publicUrl = '/growth-show/' + slug;

  const storyPayload = {
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
  };

  const existingStories = await base44.asServiceRole.entities.WebsiteVideoStory.filter({ video_id: video.id });
  let story;
  if (existingStories?.[0]) {
    await base44.asServiceRole.entities.WebsiteVideoStory.update(existingStories[0].id, storyPayload);
    story = { ...existingStories[0], ...storyPayload };
  } else {
    story = await base44.asServiceRole.entities.WebsiteVideoStory.create(storyPayload);
  }

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

async function refreshYouTubeAccessToken(clientId, clientSecret, refreshToken) {
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('YouTube OAuth refresh is not configured. Reconnect the YouTube channel with upload permission.');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  const data = await response.json();

  if (!response.ok || !data.access_token) {
    throw new Error('YouTube OAuth refresh failed: ' + (data.error_description || data.error || 'unknown error'));
  }

  return {
    access_token: data.access_token,
    expires_at: data.expires_in
      ? new Date(Date.now() + Number(data.expires_in) * 1000).toISOString()
      : null,
  };
}

async function getYouTubeUploadContext(base44) {
  const environmentToken = Deno.env.get('GOOGLE_ACCESS_TOKEN') || Deno.env.get('YOUTUBE_ACCESS_TOKEN');
  if (environmentToken) {
    return { accessToken: environmentToken, connection: null, expiresAt: null };
  }

  const connections = await base44.asServiceRole.entities.ChannelConnection.filter({ provider: 'youtube' });
  const connection = (connections || [])
    .filter(item => item.status !== 'disconnected')
    .sort((a, b) => (
      (b.is_default ? 100 : 0) - (a.is_default ? 100 : 0) ||
      (b.status === 'ready' ? 20 : 0) - (a.status === 'ready' ? 20 : 0) ||
      new Date(b.updated_date || b.last_sync_at || 0).getTime() -
      new Date(a.updated_date || a.last_sync_at || 0).getTime()
    ))[0] || null;

  if (!connection) {
    throw new Error('No YouTube channel connection is available. Connect the YouTube channel before publishing.');
  }

  const expiresAt = connection.expires_at ? Date.parse(connection.expires_at) : 0;
  if (connection.access_token && (!expiresAt || expiresAt > Date.now() + 60000)) {
    return { accessToken: connection.access_token, connection, expiresAt: connection.expires_at || null };
  }

  if (!connection.refresh_token) {
    throw new Error('The YouTube channel authorization has expired and has no refresh token. Reconnect YouTube with upload permission.');
  }

  try {
    const refreshed = await refreshYouTubeAccessToken(
      Deno.env.get('GOOGLE_CLIENT_ID'),
      Deno.env.get('GOOGLE_CLIENT_SECRET'),
      connection.refresh_token
    );

    await base44.asServiceRole.entities.ChannelConnection.update(connection.id, {
      access_token: refreshed.access_token,
      expires_at: refreshed.expires_at,
      status: 'ready',
      last_sync_at: new Date().toISOString(),
      error_message: null,
    });

    return {
      accessToken: refreshed.access_token,
      connection: { ...connection, access_token: refreshed.access_token, expires_at: refreshed.expires_at },
      expiresAt: refreshed.expires_at,
    };
  } catch (error) {
    await base44.asServiceRole.entities.ChannelConnection.update(connection.id, {
      status: 'expired',
      error_message: error.message,
      last_sync_at: new Date().toISOString(),
    });
    throw error;
  }
}

function stableVideoSlug(title) {
  return (title || 'video')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'video';
}

function extractEpisodeNumber(title) {
  const match = String(title || '').match(/episode\s*(\d+)/i);
  return match ? Number(match[1]) : null;
}

async function upsertGrowthShowEpisode(base44, video, youtubeVideoId, youtubeUrl) {
  const title = video.website_title || video.title || 'NTA Growth Show episode';
  const slug = video.website_slug || stableVideoSlug(title);
  const existing = await base44.asServiceRole.entities.GrowthShowEpisode.filter({ slug });
  const payload = {
    episode_number: video.episode_number || extractEpisodeNumber(title) || null,
    title,
    slug,
    summary: video.website_summary || video.youtube_description || '',
    status: 'Published',
    published_date: new Date().toISOString().slice(0, 10),
    featured: false,
    thumbnail_url: video.thumbnail_url || '',
    youtube_video_id: youtubeVideoId,
    playlist_slug: 'nta-growth-show',
    cta_text: video.cta_text || video.cta || 'Start a Growth Conversation',
    cta_url: video.website_url || '/growth-conversation',
    notes: JSON.stringify({ youtube_url: youtubeUrl, source_video_id: video.id }),
  };

  if (existing?.[0]) {
    await base44.asServiceRole.entities.GrowthShowEpisode.update(existing[0].id, payload);
    return { ...existing[0], ...payload };
  }

  return base44.asServiceRole.entities.GrowthShowEpisode.create(payload);
}

async function publishYoutube(base44, video, job) {
  const videoUrl = video.render_output_url || video.final_video || video.source_file_url || '';
  if (!videoUrl || !/^https:\/\//i.test(videoUrl)) {
    await base44.asServiceRole.entities.VideoPublishJob.update(job.id, {
      job_status: 'blocked',
      error_message: 'The video needs a public HTTPS source URL before YouTube can download it.'
    });
    return { success: false, reason: 'no_public_url', platform: 'youtube' };
  }

  await base44.asServiceRole.entities.VideoPublishJob.update(job.id, {
    job_status: 'publishing',
    publish_started_at: new Date().toISOString(),
    error_message: null,
  });

  try {
    const { accessToken } = await getYouTubeUploadContext(base44);
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error('Video download failed: ' + videoResponse.status + ' ' + videoResponse.statusText);
    }

    const videoBytes = new Uint8Array(await videoResponse.arrayBuffer());
    if (!videoBytes.length) throw new Error('The video source returned an empty file.');

    const privacyStatus = ['private', 'unlisted', 'public'].includes(video.youtube_privacy_status)
      ? video.youtube_privacy_status
      : 'unlisted';
    const metadata = {
      snippet: {
        title: String(video.youtube_title || video.title || 'NTA Growth Show').slice(0, 100),
        description: String(video.youtube_description || video.website_summary || video.title || '').slice(0, 5000),
        categoryId: String(video.youtube_category_id || '22'),
      },
      status: {
        privacyStatus,
        selfDeclaredMadeForKids: Boolean(video.youtube_made_for_kids),
        embeddable: true,
      },
    };

    const initResponse = await fetch(
      'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
          'X-Upload-Content-Type': 'video/mp4',
          'X-Upload-Content-Length': String(videoBytes.length),
        },
        body: JSON.stringify(metadata),
      }
    );

    if (!initResponse.ok) {
      throw new Error('YouTube upload initialization failed: ' + initResponse.status + ' ' + await initResponse.text());
    }

    const uploadUrl = initResponse.headers.get('Location');
    if (!uploadUrl) throw new Error('YouTube did not return a resumable upload URL.');

    const chunkSize = 8 * 1024 * 1024;
    let start = 0;
    let uploadData = null;

    while (start < videoBytes.length) {
      const end = Math.min(start + chunkSize, videoBytes.length) - 1;
      const chunk = videoBytes.slice(start, end + 1);
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'video/mp4',
          'Content-Length': String(chunk.length),
          'Content-Range': 'bytes ' + start + '-' + end + '/' + videoBytes.length,
        },
        body: chunk,
      });

      if (uploadResponse.status === 308) {
        const range = uploadResponse.headers.get('Range');
        const lastMatch = range ? range.match(/-(\d+)$/) : null;
        const lastByte = lastMatch ? Number(lastMatch[1]) : end;
        start = Number.isFinite(lastByte) ? lastByte + 1 : end + 1;
        continue;
      }

      if (!uploadResponse.ok) {
        throw new Error('YouTube video upload failed: ' + uploadResponse.status + ' ' + await uploadResponse.text());
      }

      uploadData = await uploadResponse.json();
      break;
    }

    if (!uploadData?.id) throw new Error('YouTube completed the upload without returning a video ID.');

    const youtubeVideoId = uploadData.id;
    const youtubeUrl = 'https://www.youtube.com/watch?v=' + youtubeVideoId;
    let growthEpisode = null;
    let growthEpisodeError = null;

    try {
      growthEpisode = await upsertGrowthShowEpisode(base44, video, youtubeVideoId, youtubeUrl);
    } catch (error) {
      growthEpisodeError = error.message;
      console.error('[videoPublishingAgent] Growth Show record update failed:', error.message);
    }

    const completedAt = new Date().toISOString();
    await base44.asServiceRole.entities.VideoPublishJob.update(job.id, {
      job_status: 'published',
      publish_completed_at: completedAt,
      published_at: completedAt,
      publish_url: youtubeUrl,
      external_post_id: youtubeVideoId,
      response_json: JSON.stringify({
        youtube_video_id: youtubeVideoId,
        youtube_url: youtubeUrl,
        privacy_status: privacyStatus,
        growth_show_episode_id: growthEpisode?.id || null,
        growth_show_episode_error: growthEpisodeError,
      }),
      notes: growthEpisodeError
        ? 'YouTube upload succeeded, but the Growth Show record needs repair: ' + growthEpisodeError
        : 'YouTube upload completed and the Growth Show record was synchronized.',
    });

    return {
      success: true,
      platform: 'youtube',
      video_id: youtubeVideoId,
      url: youtubeUrl,
      growth_show_episode_id: growthEpisode?.id || null,
    };
  } catch (error) {
    const message = error.message || 'YouTube publishing failed.';
    const isConnectionProblem = /OAuth|authorization|refresh|connection|permission|scope/i.test(message);
    await base44.asServiceRole.entities.VideoPublishJob.update(job.id, {
      job_status: isConnectionProblem ? 'blocked' : 'failed',
      error_message: message,
      response_json: JSON.stringify({ error: message }),
    });
    return {
      success: false,
      platform: 'youtube',
      reason: isConnectionProblem ? 'needs_connection' : 'upload_failed',
      error: message,
    };
  }
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

async function createJobs(base44, videoId, actorEmail, options = {}) {
  const automatic = Boolean(options.automatic);
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

  // Prevent duplicate jobs, especially when an entity hook sees our own status updates.
  const existingJobs = await base44.asServiceRole.entities.VideoPublishJob.filter({ video_id: videoId });
  const existingByDestination = new Map();
  for (const existingJob of existingJobs) {
    const current = existingByDestination.get(existingJob.destination_type);
    if (!current || new Date(existingJob.created_date || 0) > new Date(current.created_date || 0)) {
      existingByDestination.set(existingJob.destination_type, existingJob);
    }
  }

  const results = [];

  for (const destType of enabledDests) {
    const existingJob = existingByDestination.get(destType);
    if (existingJob && (
      automatic ||
      existingJob.job_status === 'published' ||
      ['queued', 'scheduled', 'preparing', 'publishing'].includes(existingJob.job_status)
    )) {
      results.push({
        destination: destType,
        status: 'skipped',
        reason: automatic ? 'existing_job' : 'already_published',
        job_id: existingJob.id,
      });
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

  // If this was an entity-hook re-entry and every destination already had a job,
  // stop without updating VideoRequests again (which would retrigger the hook).
  if (!results.some(r => r.status !== 'skipped')) {
    return Response.json({ success: true, results, jobs_created: 0, skipped: true });
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

async function handleVideoRequestAutomation(base44, body, actorEmail) {
  const event = body.event || {};
  if (event.entity_name !== 'VideoRequests') {
    return Response.json({ success: true, skipped: true, reason: 'unhandled_entity' });
  }

  const video = body.data || await base44.asServiceRole.entities.VideoRequests.get(event.entity_id);
  if (!video) return Response.json({ success: true, skipped: true, reason: 'video_not_found' });

  // A manually linked YouTube video is already complete; do not upload it again.
  if (video.youtube_video_id) {
    return Response.json({ success: true, skipped: true, reason: 'youtube_already_linked' });
  }

  if (video.review_status !== 'approved') {
    return Response.json({ success: true, skipped: true, reason: 'awaiting_approval' });
  }

  if (!video.website_publish_enabled && !video.youtube_publish_enabled) {
    return Response.json({ success: true, skipped: true, reason: 'no_enabled_destinations' });
  }

  return createJobs(base44, video.id, actorEmail, { automatic: true });
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const adminBoundaryUser = await base44.auth.me().catch(() => null);
    if (!adminBoundaryUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (adminBoundaryUser.role !== 'admin' && adminBoundaryUser.is_service !== true) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { action, video_id, job_id } = body;

    if (body.event?.entity_name === 'VideoRequests') {
      return handleVideoRequestAutomation(base44, body, user.email);
    }
    if (action === 'create_jobs') return createJobs(base44, video_id, user.email);
    if (action === 'retry_job') return retryJob(base44, job_id, user.email);
    if (action === 'process_scheduled') return processScheduled(base44);

    return Response.json({ error: 'Unknown action: ' + action }, { status: 400 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});
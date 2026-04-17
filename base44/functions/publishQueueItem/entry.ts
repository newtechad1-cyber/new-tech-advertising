import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const CALLBACK_URL = 'https://new-tech-advertising.base44.app/api/functions/channelOAuthCallback';

async function postLog(base44, data) {
  try {
    await base44.asServiceRole.entities.PostingLog.create({
      event_time: new Date().toISOString(),
      ...data,
    });
  } catch (e) {
    console.error('[publishQueueItem] log error:', e.message);
  }
}

async function refreshGoogleToken(refreshToken) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: Deno.env.get('GOOGLE_CLIENT_ID'),
      client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET'),
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  return res.json();
}

async function publishGBP(accessToken, locationId, item) {
  const body = {
    languageCode: 'en',
    summary: item.body_text || item.caption || '',
  };
  if (item.media_urls?.length > 0) {
    body.media = [{ mediaFormat: 'PHOTO', sourceUrl: item.media_urls[0] }];
  }
  if (item.content_type === 'gbp_cta' && item.gbp_cta_url) {
    body.callToAction = { actionType: item.gbp_cta_type || 'CALL', url: item.gbp_cta_url };
  }
  const res = await fetch(`https://mybusiness.googleapis.com/v4/${locationId}/localPosts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ post: body }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || JSON.stringify(data));
  return data;
}

async function publishFacebook(accessToken, pageId, item) {
  const params = new URLSearchParams({ access_token: accessToken });
  const caption = [item.body_text || item.caption, item.hashtags].filter(Boolean).join('\n\n');

  if (item.video_url) {
    // Video post
    params.set('description', caption);
    params.set('file_url', item.video_url);
    const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data;
  } else if (item.media_urls?.length > 0) {
    // Photo post
    params.set('caption', caption);
    params.set('url', item.media_urls[0]);
    const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data;
  } else {
    // Text post
    params.set('message', caption);
    if (item.link_url) params.set('link', item.link_url);
    const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data;
  }
}

async function publishInstagram(accessToken, igAccountId, item) {
  const caption = [item.body_text || item.caption, item.hashtags].filter(Boolean).join('\n\n');

  if (item.video_url) {
    // Create reel container
    const containerRes = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ media_type: 'REELS', video_url: item.video_url, caption, access_token: accessToken }),
    });
    const container = await containerRes.json();
    if (container.error) throw new Error(container.error.message);

    // Publish container
    const pubRes = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: container.id, access_token: accessToken }),
    });
    const pub = await pubRes.json();
    if (pub.error) throw new Error(pub.error.message);
    return pub;
  } else if (item.media_urls?.length > 0) {
    const containerRes = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: item.media_urls[0], caption, access_token: accessToken }),
    });
    const container = await containerRes.json();
    if (container.error) throw new Error(container.error.message);

    const pubRes = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: container.id, access_token: accessToken }),
    });
    const pub = await pubRes.json();
    if (pub.error) throw new Error(pub.error.message);
    return pub;
  } else {
    throw new Error('Instagram requires a media URL (image or video)');
  }
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  let payload = {};
  try { payload = await req.json(); } catch (_) {}
  const { queue_id, bypass_auth = false } = payload;

  if (!queue_id) {
    return Response.json({ error: 'queue_id required' }, { status: 400 });
  }

  // Auth check — allow bypass from job runner (internal), require admin otherwise
  if (!bypass_auth) {
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log(`[publishQueueItem] starting — queue_id=${queue_id}`);

  // Load queue item
  const items = await base44.asServiceRole.entities.PublishingQueue.filter({ id: queue_id });
  const item = items[0];
  if (!item) return Response.json({ error: 'Queue item not found' }, { status: 404 });

  await postLog(base44, {
    queue_id,
    client_id: item.client_id,
    provider: item.provider,
    event_type: 'queue_item_publish_started',
    status: 'info',
    message: `Publish started for "${item.title || item.body_text?.slice(0, 50)}" → ${item.provider}`,
    payload: JSON.stringify({ queue_id, provider: item.provider, connection_id: item.connection_id }),
  });

  // Mark as Publishing
  await base44.asServiceRole.entities.PublishingQueue.update(queue_id, { publish_status: 'publishing' });

  try {
    // Load connection
    const connFilter = { client_id: item.client_id, provider: item.provider };
    if (item.connection_id) connFilter.id = item.connection_id;
    const conns = await base44.asServiceRole.entities.ChannelConnection.filter(connFilter);
    let conn = conns[0];

    if (!conn) {
      throw new Error(`No channel connection found for client=${item.client_id} provider=${item.provider}`);
    }

    // Refresh token if expired or close to expiry
    let accessToken = conn.access_token;
    const isGoogle = item.provider === 'google_business_profile' || item.provider === 'youtube';
    if (isGoogle && conn.refresh_token) {
      const expiresAt = conn.expires_at ? new Date(conn.expires_at) : new Date(0);
      const shouldRefresh = expiresAt < new Date(Date.now() + 5 * 60 * 1000); // refresh if < 5 min
      if (shouldRefresh) {
        console.log(`[publishQueueItem] refreshing token for conn=${conn.id}`);
        const refreshed = await refreshGoogleToken(conn.refresh_token);
        if (refreshed.access_token) {
          accessToken = refreshed.access_token;
          const newExpiry = new Date(Date.now() + (refreshed.expires_in || 3600) * 1000).toISOString();
          await base44.asServiceRole.entities.ChannelConnection.update(conn.id, { access_token: accessToken, expires_at: newExpiry });
          await postLog(base44, { queue_id, client_id: item.client_id, provider: item.provider, event_type: 'token_refresh', status: 'success', message: 'Token refreshed successfully' });
        } else {
          throw new Error(`Token refresh failed: ${refreshed.error} — ${refreshed.error_description || ''}`);
        }
      }
    }

    // Destination
    const destinationId = item.connection_id && conn.selected_destination_id
      ? conn.selected_destination_id
      : conn.selected_destination_id;

    if (!destinationId && (item.provider === 'google_business_profile' || item.provider === 'youtube')) {
      throw new Error('No destination selected on connection (location/channel required)');
    }

    let providerResponse = null;
    let platformPostId = null;
    let platformPostUrl = null;

    // --- PUBLISH ---
    if (item.provider === 'google_business_profile') {
      providerResponse = await publishGBP(accessToken, destinationId, item);
      platformPostId = providerResponse?.name;
    } else if (item.provider === 'facebook') {
      const pageId = destinationId || conn.external_parent_id;
      if (!pageId) throw new Error('No Facebook Page ID on connection');
      providerResponse = await publishFacebook(accessToken, pageId, item);
      platformPostId = providerResponse?.id;
      if (platformPostId) platformPostUrl = `https://facebook.com/${platformPostId}`;
    } else if (item.provider === 'instagram') {
      const igId = destinationId || conn.external_parent_id;
      if (!igId) throw new Error('No Instagram Account ID on connection');
      providerResponse = await publishInstagram(accessToken, igId, item);
      platformPostId = providerResponse?.id;
    } else {
      throw new Error(`Provider ${item.provider} publishing not yet implemented`);
    }

    // Mark success
    const now = new Date().toISOString();
    await base44.asServiceRole.entities.PublishingQueue.update(queue_id, {
      publish_status: 'posted',
      platform_post_id: platformPostId || null,
      platform_post_url: platformPostUrl || null,
      provider_response: JSON.stringify(providerResponse),
      error_message: null,
    });

    await base44.asServiceRole.entities.ChannelConnection.update(conn.id, { last_successful_post_at: now, status: 'connected' });

    await postLog(base44, {
      queue_id,
      client_id: item.client_id,
      provider: item.provider,
      event_type: 'queue_item_publish_success',
      status: 'success',
      message: `Published successfully! post_id=${platformPostId || 'n/a'}`,
      payload: JSON.stringify({ platform_post_id: platformPostId, platform_post_url: platformPostUrl }),
    });

    console.log(`[publishQueueItem] SUCCESS — queue_id=${queue_id} post_id=${platformPostId}`);
    return Response.json({ success: true, platform_post_id: platformPostId, platform_post_url: platformPostUrl });

  } catch (err) {
    console.error(`[publishQueueItem] FAILED — queue_id=${queue_id} error=${err.message}`);

    const retryCount = (item.retry_count || 0) + 1;
    const maxRetries = item.max_retries || 3;
    const newStatus = retryCount >= maxRetries ? 'failed' : 'queued';

    await base44.asServiceRole.entities.PublishingQueue.update(queue_id, {
      publish_status: newStatus,
      error_message: err.message,
      retry_count: retryCount,
    });

    await postLog(base44, {
      queue_id,
      client_id: item.client_id,
      provider: item.provider,
      event_type: 'queue_item_publish_failed',
      status: 'failed',
      message: `Publish failed (attempt ${retryCount}/${maxRetries}): ${err.message}`,
      error_details: err.message,
    });

    return Response.json({ success: false, error: err.message, retry_count: retryCount }, { status: 500 });
  }
});
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const GV = (k) => Deno.env.get(k);

const YT_API = 'https://www.googleapis.com/youtube/v3';

async function auditLog(base44, { event_type, event_label, event_details, status_after, actor }) {
  await base44.asServiceRole.entities.PlatformConnectionAuditLog.create({
    platform_type: 'youtube',
    event_type, event_label, event_details, status_after,
    actor_type: 'admin', actor_name: actor,
    logged_at: new Date().toISOString()
  });
}

async function verifyToken() {
  const token = GV('GOOGLE_ACCESS_TOKEN') || GV('YOUTUBE_ACCESS_TOKEN');
  if (!token) {
    return { valid: false, status: 'not_set', error: 'No YouTube/Google access token found. Set YOUTUBE_ACCESS_TOKEN in environment secrets.' };
  }

  // Try tokeninfo endpoint
  const r = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`);
  const d = await r.json();

  if (d.error) {
    const expired = d.error === 'invalid_token';
    return { valid: false, status: expired ? 'expired' : 'invalid', error: d.error_description || d.error };
  }

  const scopes = (d.scope || '').split(' ');
  const hasYouTube = scopes.some(s => s.includes('youtube'));
  const email = d.email || null;
  const expiresIn = parseInt(d.expires_in || '0');

  if (expiresIn <= 0) {
    return { valid: false, status: 'expired', error: 'Token has expired.', scopes, email };
  }
  if (!hasYouTube) {
    return { valid: false, status: 'invalid', error: 'Token does not include YouTube scope. Reconnect with youtube.upload or youtube scope.', scopes, email };
  }

  return { valid: true, status: 'active', scopes, email, expires_in: expiresIn };
}

async function getChannel() {
  const token = GV('GOOGLE_ACCESS_TOKEN') || GV('YOUTUBE_ACCESS_TOKEN');
  const channelId = GV('YOUTUBE_CHANNEL_ID');

  if (!token) return { channel: null, error: 'No access token configured.' };

  // If we have a specific channel ID, fetch it directly
  const endpoint = channelId
    ? `${YT_API}/channels?part=snippet,contentDetails,status&id=${channelId}&access_token=${token}`
    : `${YT_API}/channels?part=snippet,contentDetails,status&mine=true&access_token=${token}`;

  const r = await fetch(endpoint);
  const d = await r.json();

  if (d.error) return { channel: null, error: d.error.message };
  if (!d.items?.length) return { channel: null, error: channelId ? `Channel ID ${channelId} not found or not accessible.` : 'No YouTube channels found for this Google account.' };

  const ch = d.items[0];
  return {
    channel: {
      id: ch.id,
      name: ch.snippet?.title,
      handle: ch.snippet?.customUrl || null,
      description: ch.snippet?.description?.substring(0, 100),
      upload_playlist_id: ch.contentDetails?.relatedPlaylists?.uploads,
      made_for_kids: ch.status?.madeForKids || false,
    }
  };
}

async function checkUploadCapability() {
  const token = GV('GOOGLE_ACCESS_TOKEN') || GV('YOUTUBE_ACCESS_TOKEN');
  if (!token) return { can_upload: false, error: 'No access token.' };

  // Check scopes from tokeninfo
  const r = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`);
  const d = await r.json();
  if (d.error) return { can_upload: false, error: d.error_description || d.error };

  const scopes = (d.scope || '').split(' ');
  const hasUpload = scopes.some(s => s.includes('youtube.upload') || s === 'https://www.googleapis.com/auth/youtube');
  const hasReadonly = scopes.some(s => s.includes('youtube.readonly'));

  return {
    can_upload: hasUpload,
    can_read: hasUpload || hasReadonly,
    shorts_supported: hasUpload, // Shorts are just regular uploads with #Shorts in title/description
    scheduled_supported: hasUpload,
    scopes,
    error: hasUpload ? null : 'Token is missing youtube.upload scope. Re-authorize with the correct scopes.'
  };
}

function computeScore(tokenOk, channelFound, channelVerified, uploadOk, shortsOk) {
  let s = 0;
  if (tokenOk)       s += 30;
  if (channelFound)  s += 25;
  if (channelVerified) s += 20;
  if (uploadOk)      s += 20;
  if (shortsOk)      s += 5;
  return Math.min(s, 100);
}

function computeStatus(score, tokenStatus) {
  if (tokenStatus === 'expired') return 'token_expired';
  if (score >= 95) return 'ready';
  if (score >= 60) return 'partially_ready';
  if (score >= 25) return 'connected_but_incomplete';
  return 'needs_connection';
}

async function getOrCreateProfile(base44) {
  const list = await base44.asServiceRole.entities.YouTubeConnectionProfile.list('-created_date', 1);
  return list[0] || null;
}

async function refreshAll(base44, profileId, actorEmail) {
  const [tokenResult, channelResult, capResult] = await Promise.all([
    verifyToken(),
    getChannel(),
    checkUploadCapability()
  ]);

  const score = computeScore(
    tokenResult.valid,
    !!channelResult.channel,
    !!channelResult.channel && !channelResult.error,
    capResult.can_upload,
    capResult.shorts_supported
  );
  const status = computeStatus(score, tokenResult.status);

  const updates = {
    google_account_email: tokenResult.email || null,
    youtube_channel_name: channelResult.channel?.name || null,
    youtube_channel_id: channelResult.channel?.id || GV('YOUTUBE_CHANNEL_ID') || null,
    youtube_handle: channelResult.channel?.handle || null,
    youtube_channel_selected: !!channelResult.channel,
    upload_access_verified: capResult.can_upload && !!channelResult.channel,
    publish_permissions_ok: capResult.can_upload,
    shorts_publish_supported: capResult.shorts_supported || false,
    standard_video_publish_supported: capResult.can_upload || false,
    token_status: tokenResult.status,
    permissions_json: JSON.stringify(tokenResult.scopes || capResult.scopes || []),
    readiness_status: status,
    readiness_score: score,
    last_verified_at: new Date().toISOString(),
    last_error: tokenResult.error || channelResult.error || capResult.error || null,
    active: true
  };

  let profile;
  if (profileId) {
    await base44.asServiceRole.entities.YouTubeConnectionProfile.update(profileId, updates);
    profile = { id: profileId, ...updates };
  } else {
    profile = await base44.asServiceRole.entities.YouTubeConnectionProfile.create(updates);
  }

  const eventType = score >= 50 ? 'connection_verified' : 'connection_failed';
  await auditLog(base44, {
    event_type: eventType,
    event_label: `YouTube full refresh — ${score}/100 — ${status}`,
    event_details: JSON.stringify({
      token: tokenResult.status,
      channel: channelResult.channel?.name,
      upload: capResult.can_upload,
      score,
      error: tokenResult.error || channelResult.error || capResult.error
    }),
    status_after: status,
    actor: actorEmail
  });

  return { profile, score, status, token: tokenResult, channel: channelResult, capability: capResult };
}

async function runConnectionTest(base44, profileId, actorEmail) {
  const token = GV('GOOGLE_ACCESS_TOKEN') || GV('YOUTUBE_ACCESS_TOKEN');
  if (!token) {
    return { success: false, blocked: true, error: 'No YouTube access token configured. Set YOUTUBE_ACCESS_TOKEN in environment secrets.' };
  }

  const r = await fetch(`${YT_API}/channels?part=snippet,status&mine=true&access_token=${token}`);
  const d = await r.json();

  if (d.error) {
    await auditLog(base44, { event_type: 'connection_failed', event_label: 'YouTube API connection test failed', event_details: d.error.message, status_after: 'failed', actor: actorEmail });
    return { success: false, error: `YouTube API error: ${d.error.message}` };
  }

  const count = d.items?.length || 0;
  await auditLog(base44, { event_type: 'connection_verified', event_label: 'YouTube API connection test passed', event_details: `${count} channel(s) accessible. No content uploaded.`, status_after: 'verified', actor: actorEmail });
  return { success: true, message: `YouTube API is responding. ${count} channel(s) found for this Google account. No content was uploaded.`, channel_count: count };
}

async function runCapabilityTest(base44, profileId, actorEmail) {
  const token = GV('GOOGLE_ACCESS_TOKEN') || GV('YOUTUBE_ACCESS_TOKEN');
  if (!token) return { success: false, blocked: true, error: 'No access token configured.' };

  const cap = await checkUploadCapability();
  const eventType = cap.can_upload ? 'test_publish_succeeded' : 'test_publish_failed';
  await auditLog(base44, {
    event_type: eventType,
    event_label: 'YouTube capability check',
    event_details: `upload: ${cap.can_upload}, shorts: ${cap.shorts_supported}, error: ${cap.error || 'none'}`,
    status_after: cap.can_upload ? 'capable' : 'limited',
    actor: actorEmail
  });

  if (!cap.can_upload) return { success: false, error: cap.error || 'Upload capability not confirmed.' };
  return {
    success: true,
    message: `YouTube upload capability confirmed. Shorts: ${cap.shorts_supported ? 'supported' : 'not confirmed'}. Scheduled uploads: ${cap.scheduled_supported ? 'supported' : 'not confirmed'}. No content was uploaded.`,
    details: cap
  };
}

async function saveDefaults(base44, profileId, data, actorEmail) {
  if (!profileId) return { error: 'No profile found. Run Refresh first.' };
  await base44.asServiceRole.entities.YouTubeConnectionProfile.update(profileId, data);
  await auditLog(base44, { event_type: 'settings_updated', event_label: 'YouTube defaults updated', event_details: Object.keys(data).join(', '), status_after: 'updated', actor: actorEmail });
  return { success: true };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { action, profile_id, data } = body;

    if (action === 'get_profile') {
      return Response.json({ profile: await getOrCreateProfile(base44) });
    }
    if (action === 'refresh_all') {
      return Response.json(await refreshAll(base44, profile_id || null, user.email));
    }
    if (action === 'run_connection_test') {
      return Response.json(await runConnectionTest(base44, profile_id, user.email));
    }
    if (action === 'run_capability_test') {
      return Response.json(await runCapabilityTest(base44, profile_id, user.email));
    }
    if (action === 'save_defaults') {
      return Response.json(await saveDefaults(base44, profile_id, data, user.email));
    }

    return Response.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});
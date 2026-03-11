import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

async function writeAudit(base44, data) {
  await base44.asServiceRole.entities.PlatformConnectionAuditLog.create({
    ...data,
    logged_at: new Date().toISOString()
  });
}

async function verifyLinkedIn(base44) {
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('linkedin');
    return { connected: !!accessToken, token_status: 'active', status: 'connected', message: 'LinkedIn OAuth active and valid' };
  } catch (e) {
    return { connected: false, token_status: 'not_set', status: 'needs_connection', error: 'LinkedIn OAuth not connected. Authorize in the Base44 connectors panel.' };
  }
}

async function verifyGoogle(base44) {
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');
    return { connected: !!accessToken, token_status: 'active', status: 'connected', message: 'Google OAuth active and valid' };
  } catch (e) {
    return { connected: false, token_status: 'not_set', status: 'needs_connection', error: 'Google OAuth not connected.' };
  }
}

async function verifyFacebook() {
  const token = Deno.env.get('META_PAGE_ACCESS_TOKEN');
  const pageId = Deno.env.get('META_PAGE_ID');
  if (!token || !pageId) {
    return { connected: false, token_status: 'not_set', status: 'needs_connection', error: 'META_PAGE_ACCESS_TOKEN and/or META_PAGE_ID not configured in environment secrets.' };
  }
  const res = await fetch(`https://graph.facebook.com/v18.0/${pageId}?access_token=${token}&fields=name,id`);
  const data = await res.json();
  if (data.error) {
    const isExpired = data.error.code === 190;
    return { connected: false, token_status: isExpired ? 'expired' : 'invalid', status: isExpired ? 'token_expired' : 'error', error: data.error.message };
  }
  return { connected: true, token_status: 'active', status: 'connected', account_label: data.name, page_id: data.id };
}

async function verifyInstagram() {
  const token = Deno.env.get('META_PAGE_ACCESS_TOKEN');
  const igId = Deno.env.get('META_INSTAGRAM_ACCOUNT_ID');
  if (!token || !igId) {
    return { connected: false, token_status: 'not_set', status: 'needs_connection', error: 'META_INSTAGRAM_ACCOUNT_ID not configured.' };
  }
  const res = await fetch(`https://graph.facebook.com/v18.0/${igId}?access_token=${token}&fields=name,id,username`);
  const data = await res.json();
  if (data.error) {
    return { connected: false, token_status: 'invalid', status: 'error', error: data.error.message };
  }
  return { connected: true, token_status: 'active', status: 'connected', account_label: data.username || data.name, page_id: igId };
}

async function doVerify(base44, platformType) {
  switch (platformType) {
    case 'website':
      return { connected: true, token_status: 'active', status: 'connected', message: 'Website publishing always ready' };
    case 'google':
    case 'gbp':
      return verifyGoogle(base44);
    case 'linkedin':
      return verifyLinkedIn(base44);
    case 'facebook':
      return verifyFacebook();
    case 'instagram':
      return verifyInstagram();
    case 'youtube':
      return { connected: false, token_status: 'not_set', status: 'needs_connection', error: 'YouTube channel OAuth not configured. Add YouTube Data API credentials.' };
    case 'tiktok': {
      const key = Deno.env.get('TIKTOK_CLIENT_KEY');
      return { connected: false, token_status: 'not_set', status: 'needs_connection', error: key ? 'TikTok API keys configured. Complete user OAuth authorization flow to enable publishing.' : 'TikTok not configured.' };
    }
    default:
      return { connected: false, status: 'error', error: 'Unknown platform' };
  }
}

async function verifyPlatform(base44, platformType, connectionId, actorEmail) {
  const result = await doVerify(base44, platformType);

  if (connectionId) {
    const updates = {
      is_connected: result.connected,
      connection_status: result.status,
      token_status: result.token_status || 'not_set',
      last_verified_at: new Date().toISOString(),
    };
    if (result.error) updates.last_error = result.error;
    if (result.account_label) updates.account_label = result.account_label;
    if (result.page_id) updates.page_id_or_channel_id = result.page_id;
    await base44.asServiceRole.entities.VideoDistributionConnection.update(connectionId, updates);
  }

  await writeAudit(base44, {
    connection_id: connectionId || null,
    platform_type: platformType,
    event_type: result.connected ? 'connection_verified' : 'connection_failed',
    event_label: `${platformType} connection ${result.connected ? 'verified' : 'failed'}`,
    event_details: result.error || result.message || '',
    status_after: result.status,
    actor_type: 'admin',
    actor_name: actorEmail
  });

  return result;
}

async function runTestPublish(base44, platformType, connectionId, actorEmail) {
  let result = {};

  if (platformType === 'website') {
    const story = await base44.asServiceRole.entities.WebsiteVideoStory.create({
      video_id: 'test_connection',
      title: '[TEST] Connection Check — ' + new Date().toLocaleString(),
      slug: 'test-connection-' + Date.now(),
      summary: 'Automated connection test. This draft will not be published.',
      publish_status: 'draft'
    });
    result = { success: true, message: 'Test draft story created successfully. Website publishing is ready.', story_id: story.id };
  } else if (platformType === 'google' || platformType === 'gbp') {
    const r = await verifyGoogle(base44);
    result = { success: r.connected, message: r.connected ? 'Google OAuth active. No live post created — manual test not executed to prevent accidental publishing.' : r.error };
  } else if (platformType === 'linkedin') {
    const r = await verifyLinkedIn(base44);
    result = { success: r.connected, message: r.connected ? 'LinkedIn OAuth active. No live post created — test verified connection only.' : r.error };
  } else if (platformType === 'facebook') {
    const r = await verifyFacebook();
    result = { success: r.connected, message: r.connected ? `Facebook Page "${r.account_label}" is accessible. Token valid. No test post made.` : r.error };
  } else if (platformType === 'instagram') {
    const r = await verifyInstagram();
    result = { success: r.connected, message: r.connected ? `Instagram account "${r.account_label}" is accessible. Token valid. No test post made.` : r.error };
  } else {
    result = { success: false, error: `${platformType} test publish requires completed OAuth setup first.` };
  }

  await writeAudit(base44, {
    connection_id: connectionId || null,
    platform_type: platformType,
    event_type: result.success ? 'test_publish_succeeded' : 'test_publish_failed',
    event_label: `Test ${result.success ? 'passed' : 'failed'} — ${platformType}`,
    event_details: result.message || result.error || '',
    status_after: result.success ? 'verified' : 'failed',
    actor_type: 'admin',
    actor_name: actorEmail
  });

  return result;
}

async function togglePublishing(base44, connectionId, enabled, actorEmail) {
  const conn = await base44.asServiceRole.entities.VideoDistributionConnection.get(connectionId);
  if (!conn) return { error: 'Connection not found' };
  const before = conn.publishing_enabled;
  await base44.asServiceRole.entities.VideoDistributionConnection.update(connectionId, { publishing_enabled: enabled });
  await writeAudit(base44, {
    connection_id: connectionId,
    platform_type: conn.platform_type,
    event_type: enabled ? 'publishing_enabled' : 'publishing_disabled',
    event_label: `Publishing ${enabled ? 'enabled' : 'disabled'} — ${conn.platform_type}`,
    status_before: String(before),
    status_after: String(enabled),
    actor_type: 'admin',
    actor_name: actorEmail
  });
  return { success: true };
}

async function updateSettings(base44, connectionId, settings, actorEmail) {
  const conn = await base44.asServiceRole.entities.VideoDistributionConnection.get(connectionId);
  if (!conn) return { error: 'Connection not found' };
  await base44.asServiceRole.entities.VideoDistributionConnection.update(connectionId, settings);
  await writeAudit(base44, {
    connection_id: connectionId,
    platform_type: conn.platform_type,
    event_type: 'settings_updated',
    event_label: `Settings updated — ${conn.platform_type}`,
    event_details: Object.keys(settings).join(', '),
    actor_type: 'admin',
    actor_name: actorEmail
  });
  return { success: true };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { action, platform_type, connection_id, settings, enabled } = body;

    if (action === 'verify_platform') {
      const result = await verifyPlatform(base44, platform_type, connection_id, user.email);
      return Response.json(result);
    }
    if (action === 'run_test_publish') {
      const result = await runTestPublish(base44, platform_type, connection_id, user.email);
      return Response.json(result);
    }
    if (action === 'toggle_publishing') {
      const result = await togglePublishing(base44, connection_id, enabled, user.email);
      return Response.json(result);
    }
    if (action === 'update_settings') {
      const result = await updateSettings(base44, connection_id, settings, user.email);
      return Response.json(result);
    }

    return Response.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

async function writeAudit(base44, data) {
  await base44.asServiceRole.entities.PlatformConnectionAuditLog.create({
    ...data,
    logged_at: new Date().toISOString()
  });
}

// ─── Platform Verifiers ──────────────────────────────────────────────────────

async function verifyLinkedIn(base44) {
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('linkedin');
    if (!accessToken) throw new Error('No token');
    return { connected: true, token_status: 'active', status: 'connected', message: 'LinkedIn OAuth connector is active and authorized.' };
  } catch (e) {
    return { connected: false, token_status: 'not_set', status: 'needs_connection', error: 'LinkedIn OAuth not authorized in Base44 connectors. Authorize via Settings → Integrations.' };
  }
}

async function verifyGoogle(base44) {
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');
    if (!accessToken) throw new Error('No token');
    return { connected: true, token_status: 'active', status: 'connected', message: 'Google OAuth connector is active and authorized.' };
  } catch (e) {
    return { connected: false, token_status: 'not_set', status: 'needs_connection', error: 'Google OAuth not authorized in Base44 connectors.' };
  }
}

async function verifyFacebook() {
  const token = Deno.env.get('META_PAGE_ACCESS_TOKEN');
  const pageId = Deno.env.get('META_PAGE_ID');

  if (!token) return { connected: false, token_status: 'not_set', status: 'needs_connection', error: 'META_PAGE_ACCESS_TOKEN not set in environment secrets.' };
  if (!pageId) return { connected: false, token_status: 'not_set', status: 'incomplete', error: 'META_PAGE_ACCESS_TOKEN is set but META_PAGE_ID is missing. Add your Facebook Page ID to secrets.' };

  const res = await fetch(`https://graph.facebook.com/v18.0/${pageId}?access_token=${token}&fields=name,id,fan_count`);
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

  if (!token) return { connected: false, token_status: 'not_set', status: 'needs_connection', error: 'META_PAGE_ACCESS_TOKEN not set.' };
  if (!igId) return { connected: false, token_status: 'not_set', status: 'incomplete', error: 'META_INSTAGRAM_ACCOUNT_ID not set. You need an Instagram Business Account ID.' };

  const res = await fetch(`https://graph.facebook.com/v18.0/${igId}?access_token=${token}&fields=name,id,username,account_type`);
  const data = await res.json();

  if (data.error) {
    return { connected: false, token_status: 'invalid', status: 'error', error: `Instagram API error: ${data.error.message}` };
  }

  const accountType = data.account_type || '';
  if (accountType && !['BUSINESS', 'CREATOR'].includes(accountType.toUpperCase())) {
    return { connected: false, token_status: 'active', status: 'incomplete', error: `Account type is "${accountType}". Instagram publishing requires a Business or Creator account.` };
  }

  return { connected: true, token_status: 'active', status: 'connected', account_label: data.username || data.name, page_id: igId };
}

async function verifyYouTube() {
  return { connected: false, token_status: 'not_set', status: 'needs_connection', error: 'YouTube Data API OAuth not configured. You need to set up YouTube OAuth credentials and connect a channel.' };
}

async function verifyTikTok() {
  const key = Deno.env.get('TIKTOK_CLIENT_KEY');
  const secret = Deno.env.get('TIKTOK_CLIENT_SECRET');
  if (key && secret) {
    return { connected: false, token_status: 'not_set', status: 'incomplete', error: 'TikTok API keys are configured but user OAuth authorization has not been completed. The authorization flow must be implemented to enable publishing.' };
  }
  return { connected: false, token_status: 'not_set', status: 'needs_connection', error: 'TikTok not configured. Set TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET then complete OAuth authorization.' };
}

async function doVerify(base44, platformType) {
  switch (platformType) {
    case 'website': return { connected: true, token_status: 'active', status: 'connected', message: 'Website publishing is always available.' };
    case 'google': return verifyGoogle(base44);
    case 'gbp': return verifyGoogle(base44);
    case 'linkedin': return verifyLinkedIn(base44);
    case 'facebook': return verifyFacebook();
    case 'instagram': return verifyInstagram();
    case 'youtube': return verifyYouTube();
    case 'tiktok': return verifyTikTok();
    default: return { connected: false, status: 'error', error: 'Unknown platform' };
  }
}

// ─── Actions ─────────────────────────────────────────────────────────────────

async function seedConnections(base44, actorEmail) {
  const existing = await base44.asServiceRole.entities.VideoDistributionConnection.list();
  const existingTypes = existing.map(c => c.platform_type);

  const defaults = [
    { platform_type: 'website', connection_name: 'NTA Website', account_label: 'New Tech Advertising Website', is_connected: true, connection_status: 'connected', token_status: 'active', publishing_enabled: true, default_destination: true },
    { platform_type: 'linkedin', connection_name: 'LinkedIn', account_label: 'Checking...', is_connected: false, connection_status: 'pending_verification' },
    { platform_type: 'google', connection_name: 'Google', account_label: 'Checking...', is_connected: false, connection_status: 'pending_verification' },
    { platform_type: 'facebook', connection_name: 'Facebook', account_label: 'Needs attention', is_connected: false, connection_status: 'incomplete', last_error: 'Page ID or access token may need verification.' },
    { platform_type: 'instagram', connection_name: 'Instagram', account_label: 'Needs attention', is_connected: false, connection_status: 'incomplete', last_error: 'Instagram Business Account needs verification.' },
    { platform_type: 'youtube', connection_name: 'YouTube', account_label: 'Not connected', is_connected: false, connection_status: 'needs_connection' },
    { platform_type: 'tiktok', connection_name: 'TikTok', account_label: 'Not configured', is_connected: false, connection_status: 'needs_connection' },
  ];

  const created = [];
  for (const def of defaults) {
    if (!existingTypes.includes(def.platform_type)) {
      const conn = await base44.asServiceRole.entities.VideoDistributionConnection.create(def);
      await writeAudit(base44, {
        connection_id: conn.id, platform_type: def.platform_type,
        event_type: 'connection_seeded', event_label: `${def.platform_type} connection initialized`,
        event_details: `Initial state: ${def.connection_status}`,
        status_after: def.connection_status, actor_type: 'system', actor_name: actorEmail
      });
      created.push(conn);
    }
  }
  return { seeded: created.length, skipped: existingTypes.length };
}

async function verifyPlatform(base44, platformType, connectionId, actorEmail) {
  const before = connectionId ? await base44.asServiceRole.entities.VideoDistributionConnection.get(connectionId) : null;
  const result = await doVerify(base44, platformType);

  const updates = {
    is_connected: result.connected,
    connection_status: result.status,
    token_status: result.token_status || 'not_set',
    last_verified_at: new Date().toISOString(),
  };
  if (result.error) updates.last_error = result.error;
  else updates.last_error = null;
  if (result.account_label) updates.account_label = result.account_label;
  if (result.page_id) updates.page_id_or_channel_id = result.page_id;

  if (connectionId) {
    await base44.asServiceRole.entities.VideoDistributionConnection.update(connectionId, updates);
  }

  await writeAudit(base44, {
    connection_id: connectionId || null, platform_type: platformType,
    event_type: result.connected ? 'connection_verified' : 'connection_failed',
    event_label: `${platformType} verification — ${result.connected ? 'passed' : 'failed'}`,
    event_details: result.error || result.message || '',
    status_before: before?.connection_status, status_after: result.status,
    actor_type: 'admin', actor_name: actorEmail
  });

  return { ...result, updates };
}

async function runTestPublish(base44, platformType, connectionId, actorEmail) {
  let result = {};

  if (platformType === 'website') {
    const story = await base44.asServiceRole.entities.WebsiteVideoStory.create({
      video_id: 'test_connection_check',
      title: '[CONNECTION TEST] ' + new Date().toLocaleString(),
      slug: 'connection-test-' + Date.now(),
      summary: 'Automated connection test story. Created in draft. Will not be publicly displayed.',
      publish_status: 'draft'
    });
    result = { success: true, message: 'Test draft story created successfully. Website publishing is fully operational.', ref: story.id };
  } else if (platformType === 'google' || platformType === 'gbp') {
    const r = await verifyGoogle(base44);
    result = { success: r.connected, message: r.connected ? 'Google OAuth active and valid. No live post created — connection verified only.' : r.error };
  } else if (platformType === 'linkedin') {
    const r = await verifyLinkedIn(base44);
    result = { success: r.connected, message: r.connected ? 'LinkedIn OAuth active and valid. No live post created — connection verified only.' : r.error };
  } else if (platformType === 'facebook') {
    const r = await verifyFacebook();
    result = { success: r.connected, message: r.connected ? `Facebook Page "${r.account_label}" is accessible. Token valid. No test post created to avoid unintended content.` : r.error };
  } else if (platformType === 'instagram') {
    const r = await verifyInstagram();
    result = { success: r.connected, message: r.connected ? `Instagram account "${r.account_label}" accessible. Token valid. No test post created.` : r.error };
  } else {
    result = { success: false, error: `${platformType} is not connected. Complete the setup first.`, status: 'blocked' };
  }

  if (connectionId && result.success) {
    await base44.asServiceRole.entities.VideoDistributionConnection.update(connectionId, {
      last_publish_success_at: new Date().toISOString()
    });
  }

  await writeAudit(base44, {
    connection_id: connectionId || null, platform_type: platformType,
    event_type: result.success ? 'test_publish_succeeded' : 'test_publish_failed',
    event_label: `Test ${result.success ? 'passed' : 'failed'} — ${platformType}`,
    event_details: result.message || result.error || '',
    status_after: result.success ? 'verified' : 'failed',
    actor_type: 'admin', actor_name: actorEmail
  });

  return result;
}

async function togglePublishing(base44, connectionId, enabled, actorEmail) {
  const conn = await base44.asServiceRole.entities.VideoDistributionConnection.get(connectionId);
  if (!conn) return { error: 'Connection not found' };
  await base44.asServiceRole.entities.VideoDistributionConnection.update(connectionId, { publishing_enabled: enabled });
  await writeAudit(base44, {
    connection_id: connectionId, platform_type: conn.platform_type,
    event_type: enabled ? 'publishing_enabled' : 'publishing_disabled',
    event_label: `Publishing ${enabled ? 'enabled' : 'disabled'} — ${conn.platform_type}`,
    status_before: String(conn.publishing_enabled), status_after: String(enabled),
    actor_type: 'admin', actor_name: actorEmail
  });
  return { success: true };
}

async function updateSettings(base44, connectionId, settings, actorEmail) {
  const conn = await base44.asServiceRole.entities.VideoDistributionConnection.get(connectionId);
  if (!conn) return { error: 'Connection not found' };
  await base44.asServiceRole.entities.VideoDistributionConnection.update(connectionId, settings);
  await writeAudit(base44, {
    connection_id: connectionId, platform_type: conn.platform_type,
    event_type: 'settings_updated',
    event_label: `Settings updated — ${conn.platform_type}`,
    event_details: Object.keys(settings).join(', '),
    actor_type: 'admin', actor_name: actorEmail
  });
  return { success: true };
}

// ─── Handler ─────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { action, platform_type, connection_id, settings, enabled } = body;

    if (action === 'seed_connections') return Response.json(await seedConnections(base44, user.email));
    if (action === 'verify_platform') return Response.json(await verifyPlatform(base44, platform_type, connection_id, user.email));
    if (action === 'run_test_publish') return Response.json(await runTestPublish(base44, platform_type, connection_id, user.email));
    if (action === 'toggle_publishing') return Response.json(await togglePublishing(base44, connection_id, enabled, user.email));
    if (action === 'update_settings') return Response.json(await updateSettings(base44, connection_id, settings, user.email));

    return Response.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});
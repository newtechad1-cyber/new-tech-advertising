import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const GV = (k) => Deno.env.get(k);

async function auditLog(base44, { platform, event_type, event_label, event_details, status_after, actor }) {
  await base44.asServiceRole.entities.PlatformConnectionAuditLog.create({
    platform_type: platform,
    event_type, event_label, event_details, status_after,
    actor_type: 'admin', actor_name: actor,
    logged_at: new Date().toISOString()
  });
}

async function verifyToken() {
  const token = GV('META_PAGE_ACCESS_TOKEN');
  const appId = GV('META_APP_ID');
  const appSecret = GV('META_APP_SECRET');
  if (!token) return { valid: false, status: 'not_set', error: 'META_PAGE_ACCESS_TOKEN not configured in environment secrets.' };

  // Use app access token to debug the page token
  if (!appId || !appSecret) {
    // Fallback: just test the token against the page endpoint
    const pageId = GV('META_PAGE_ID');
    if (!pageId) return { valid: false, status: 'not_set', error: 'META_PAGE_ID not set. Cannot verify token without page ID.' };
    const r = await fetch(`https://graph.facebook.com/v18.0/${pageId}?access_token=${token}&fields=id,name`);
    const d = await r.json();
    if (d.error) {
      const expired = d.error.code === 190;
      return { valid: false, status: expired ? 'expired' : 'invalid', error: d.error.message };
    }
    return { valid: true, status: 'active', scopes: [], expires_at: null };
  }

  const appToken = `${appId}|${appSecret}`;
  const r = await fetch(`https://graph.facebook.com/v18.0/debug_token?input_token=${token}&access_token=${appToken}`);
  const d = await r.json();

  if (d.error || !d.data) return { valid: false, status: 'invalid', error: d.error?.message || 'Token debug failed.' };
  if (!d.data.is_valid) return { valid: false, status: 'invalid', error: 'Token is no longer valid.' };

  const nowSec = Math.floor(Date.now() / 1000);
  const expiresAt = d.data.expires_at;
  if (expiresAt && expiresAt > 0 && expiresAt < nowSec) {
    return { valid: false, status: 'expired', error: 'Token has expired.', scopes: d.data.scopes || [], expires_at: new Date(expiresAt * 1000).toISOString() };
  }

  return {
    valid: true, status: 'active',
    scopes: d.data.scopes || [],
    expires_at: expiresAt ? new Date(expiresAt * 1000).toISOString() : null,
    type: d.data.type
  };
}

async function getPageAndInstagram() {
  const token = GV('META_PAGE_ACCESS_TOKEN');
  const pageId = GV('META_PAGE_ID');
  if (!token || !pageId) return { page: null, instagram: null, error: 'Token or Page ID not configured.' };

  const fields = 'name,id,category,fan_count,instagram_business_account{id,name,username,account_type,followers_count}';
  const r = await fetch(`https://graph.facebook.com/v18.0/${pageId}?access_token=${token}&fields=${fields}`);
  const d = await r.json();

  if (d.error) return { page: null, instagram: null, error: d.error.message };

  const iga = d.instagram_business_account;
  return {
    page: { id: d.id, name: d.name, category: d.category },
    instagram: iga ? { id: iga.id, name: iga.name, username: iga.username, account_type: iga.account_type } : null,
    instagram_linked: !!iga
  };
}

async function checkPermissions() {
  const token = GV('META_PAGE_ACCESS_TOKEN');
  if (!token) return { permissions: [], ok: false, error: 'Token not set.' };

  const r = await fetch(`https://graph.facebook.com/v18.0/me/permissions?access_token=${token}`);
  const d = await r.json();

  if (d.error) return { permissions: [], ok: false, error: d.error.message };

  const granted = (d.data || []).filter(p => p.status === 'granted').map(p => p.permission);
  const required = ['pages_manage_posts', 'pages_read_engagement'];
  return {
    permissions: granted,
    ok: required.every(r => granted.includes(r)),
    missing: required.filter(r => !granted.includes(r))
  };
}

function computeScore(tokenOk, pageOk, pageVerified, igFound, igLinked, permsOk) {
  let s = 0;
  if (tokenOk)    s += 25;
  if (pageOk)     s += 20;
  if (pageVerified) s += 20;
  if (igFound)    s += 20;
  if (igLinked)   s += 15;
  if (permsOk)    s = Math.min(s + 5, 100);
  return s;
}

function computeStatus(score, tokenStatus) {
  if (tokenStatus === 'expired') return 'token_expired';
  if (score >= 100) return 'ready';
  if (score >= 65)  return 'partially_ready';
  if (score >= 25)  return 'connected_but_incomplete';
  return 'needs_connection';
}

async function getOrCreateProfile(base44) {
  const existing = await base44.asServiceRole.entities.MetaConnectionProfile.list('-created_date', 1);
  return existing[0] || null;
}

async function refreshAll(base44, profileId, actorEmail) {
  const [tokenResult, pageResult, permResult] = await Promise.all([
    verifyToken(),
    getPageAndInstagram(),
    checkPermissions()
  ]);

  // Also check Instagram ID from env if not found via page
  const igId = pageResult.instagram?.id || GV('META_INSTAGRAM_ACCOUNT_ID');

  const score = computeScore(
    tokenResult.valid,
    !!pageResult.page,
    !!pageResult.page && !pageResult.error,
    !!igId,
    !!pageResult.instagram_linked,
    permResult.ok
  );
  const status = computeStatus(score, tokenResult.status);

  const updates = {
    token_status: tokenResult.status,
    token_expires_at: tokenResult.expires_at || null,
    facebook_page_name: pageResult.page?.name || null,
    facebook_page_id: pageResult.page?.id || GV('META_PAGE_ID') || null,
    facebook_page_selected: !!pageResult.page,
    facebook_page_access_verified: !!pageResult.page && !pageResult.error,
    facebook_publish_permissions_ok: permResult.ok,
    instagram_account_name: pageResult.instagram?.username || pageResult.instagram?.name || null,
    instagram_account_id: igId || null,
    instagram_account_type: pageResult.instagram?.account_type || null,
    instagram_selected: !!igId,
    instagram_linked_to_facebook_page: !!pageResult.instagram_linked,
    instagram_publish_permissions_ok: !!pageResult.instagram_linked && permResult.ok,
    permissions_json: JSON.stringify(permResult.permissions),
    readiness_status: status,
    readiness_score: score,
    last_verified_at: new Date().toISOString(),
    last_error: tokenResult.error || pageResult.error || permResult.error || null,
    active: true
  };

  let profile;
  if (profileId) {
    await base44.asServiceRole.entities.MetaConnectionProfile.update(profileId, updates);
    profile = { id: profileId, ...updates };
  } else {
    profile = await base44.asServiceRole.entities.MetaConnectionProfile.create(updates);
  }

  await auditLog(base44, {
    platform: 'facebook',
    event_type: score >= 100 ? 'connection_verified' : score >= 25 ? 'connection_verified' : 'connection_failed',
    event_label: `Meta full refresh — ${score}/100 — ${status}`,
    event_details: JSON.stringify({ token: tokenResult.status, page: pageResult.page?.name, ig: pageResult.instagram?.username, score, missing_perms: permResult.missing }),
    status_after: status,
    actor: actorEmail
  });

  return { profile, score, status, token: tokenResult, page: pageResult, permissions: permResult };
}

async function runFacebookTest(base44, profileId, actorEmail) {
  const token = GV('META_PAGE_ACCESS_TOKEN');
  const pageId = GV('META_PAGE_ID');

  if (!token || !pageId) {
    return { success: false, blocked: true, error: 'META_PAGE_ACCESS_TOKEN or META_PAGE_ID is not configured.' };
  }

  const r = await fetch(`https://graph.facebook.com/v18.0/${pageId}?access_token=${token}&fields=name,id,can_post`);
  const d = await r.json();

  if (d.error) {
    await auditLog(base44, { platform: 'facebook', event_type: 'test_publish_failed', event_label: 'Facebook API test failed', event_details: d.error.message, status_after: 'failed', actor: actorEmail });
    return { success: false, error: `Facebook API error: ${d.error.message}` };
  }

  await auditLog(base44, { platform: 'facebook', event_type: 'test_publish_succeeded', event_label: 'Facebook API test passed', event_details: `Page "${d.name}" accessible. can_post: ${d.can_post}. No content posted.`, status_after: 'verified', actor: actorEmail });
  return { success: true, message: `Facebook Page "${d.name}" is accessible. Token is valid and API is responding. No content was posted.`, can_post: d.can_post };
}

async function runInstagramTest(base44, profileId, actorEmail) {
  const token = GV('META_PAGE_ACCESS_TOKEN');
  const igId = GV('META_INSTAGRAM_ACCOUNT_ID');

  if (!token || !igId) {
    return { success: false, blocked: true, error: 'META_PAGE_ACCESS_TOKEN or META_INSTAGRAM_ACCOUNT_ID is not configured.' };
  }

  const r = await fetch(`https://graph.facebook.com/v18.0/${igId}?access_token=${token}&fields=name,username,account_type,media_count`);
  const d = await r.json();

  if (d.error) {
    await auditLog(base44, { platform: 'instagram', event_type: 'test_publish_failed', event_label: 'Instagram API test failed', event_details: d.error.message, status_after: 'failed', actor: actorEmail });
    return { success: false, error: `Instagram API error: ${d.error.message}` };
  }

  const accountType = d.account_type || 'UNKNOWN';
  const eligible = ['BUSINESS', 'CREATOR'].includes(accountType.toUpperCase());

  await auditLog(base44, { platform: 'instagram', event_type: eligible ? 'test_publish_succeeded' : 'test_publish_failed', event_label: 'Instagram API test', event_details: `@${d.username} (${accountType}) — eligible: ${eligible}. No content posted.`, status_after: eligible ? 'verified' : 'incomplete', actor: actorEmail });

  if (!eligible) {
    return { success: false, error: `Account type "${accountType}" is not eligible for API publishing. Must be BUSINESS or CREATOR.` };
  }

  return { success: true, message: `Instagram @${d.username || d.name} (${accountType}) is accessible and publish-eligible. No content was posted.`, account_type: accountType };
}

async function saveMapping(base44, profileId, data, actorEmail) {
  if (!profileId) return { error: 'No profile found. Run Refresh first.' };
  await base44.asServiceRole.entities.MetaConnectionProfile.update(profileId, data);
  await auditLog(base44, { platform: 'facebook', event_type: 'page_mapping_updated', event_label: 'Meta mapping saved manually', event_details: Object.keys(data).join(', '), status_after: 'updated', actor: actorEmail });
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
      const p = await getOrCreateProfile(base44);
      return Response.json({ profile: p });
    }
    if (action === 'refresh_all') {
      const result = await refreshAll(base44, profile_id || null, user.email);
      return Response.json(result);
    }
    if (action === 'run_facebook_test') {
      return Response.json(await runFacebookTest(base44, profile_id, user.email));
    }
    if (action === 'run_instagram_test') {
      return Response.json(await runInstagramTest(base44, profile_id, user.email));
    }
    if (action === 'save_mapping') {
      return Response.json(await saveMapping(base44, profile_id, data, user.email));
    }

    return Response.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});
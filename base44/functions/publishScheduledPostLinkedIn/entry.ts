import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const LINKEDIN_VERSION = '202610';

function isTrustedInternalUser(user) {
  return Boolean(user && (user.role === 'admin' || user.is_service === true));
}

async function getMemberUrn(accessToken) {
  const response = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload?.sub) {
    throw new Error(payload?.message || 'LinkedIn profile lookup failed.');
  }
  return `urn:li:person:${payload.sub}`;
}

async function createLinkedInPost(accessToken, authorUrn, commentary) {
  const response = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-Restli-Protocol-Version': '2.0.0',
      'LinkedIn-Version': LINKEDIN_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      author: authorUrn,
      commentary,
      visibility: 'PUBLIC',
      distribution: {
        feedDistribution: 'MAIN_FEED',
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: false,
    }),
  });

  const bodyText = await response.text();
  let payload = {};
  try { payload = bodyText ? JSON.parse(bodyText) : {}; } catch { payload = { raw: bodyText }; }
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error?.message || `LinkedIn returned HTTP ${response.status}`);
  }
  return {
    id: response.headers.get('x-restli-id') || payload?.id || null,
    status: response.status,
  };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!isTrustedInternalUser(user)) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { scheduledPostId } = await req.json();
    if (!scheduledPostId) {
      return Response.json({ error: 'scheduledPostId is required' }, { status: 400 });
    }

    const post = await base44.asServiceRole.entities.ScheduledPost.get(scheduledPostId);
    if (!post) return Response.json({ error: 'ScheduledPost not found' }, { status: 404 });
    if (post.platform !== 'linkedin') {
      return Response.json({ error: 'This publisher only supports LinkedIn posts' }, { status: 400 });
    }

    const draft = await base44.asServiceRole.entities.ContentDraft.get(post.draft_id);
    if (!draft) return Response.json({ error: 'ContentDraft not found' }, { status: 404 });

    const hashtags = (draft.hashtags || []).join(' ');
    const commentary = [draft.caption, hashtags].filter(Boolean).join('\n\n').trim();
    if (!commentary) {
      return Response.json({ error: 'LinkedIn post text is empty' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('linkedin');
    if (!accessToken) throw new Error('LinkedIn connector is not authorized.');

    const authorUrn = await getMemberUrn(accessToken);
    const result = await createLinkedInPost(accessToken, authorUrn, commentary.substring(0, 3000));

    await base44.asServiceRole.entities.ScheduledPost.update(post.id, {
      status: 'published',
      posted_at: new Date().toISOString(),
      publish_count: (post.publish_count || 0) + 1,
      last_error: null,
      publish_result: JSON.stringify({
        provider: 'linkedin',
        author: authorUrn,
        post_id: result.id,
        api_version: LINKEDIN_VERSION,
      }),
    });

    return Response.json({
      success: true,
      platform: 'linkedin',
      post_id: result.id,
      api_version: LINKEDIN_VERSION,
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});

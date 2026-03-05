import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

async function postToFacebook(pageId, pageToken, message, mediaUrl) {
  if (mediaUrl) {
    const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/photos`, {
      method: 'POST',
      body: new URLSearchParams({ url: mediaUrl, caption: message, access_token: pageToken }),
    });
    return res.json();
  } else {
    const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
      method: 'POST',
      body: new URLSearchParams({ message, access_token: pageToken }),
    });
    return res.json();
  }
}

async function postToInstagram(igId, pageToken, message, mediaUrl) {
  if (!mediaUrl) throw new Error('Instagram requires a media URL');

  const containerRes = await fetch(`https://graph.facebook.com/v19.0/${igId}/media`, {
    method: 'POST',
    body: new URLSearchParams({ image_url: mediaUrl, caption: message, access_token: pageToken }),
  });
  const container = await containerRes.json();
  if (container.error) throw new Error(container.error.message);

  const publishRes = await fetch(`https://graph.facebook.com/v19.0/${igId}/media_publish`, {
    method: 'POST',
    body: new URLSearchParams({ creation_id: container.id, access_token: pageToken }),
  });
  return publishRes.json();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { scheduledPostId } = await req.json();
    if (!scheduledPostId) return Response.json({ error: 'scheduledPostId is required' }, { status: 400 });

    const post = await base44.asServiceRole.entities.ScheduledPost.get(scheduledPostId);
    if (!post) return Response.json({ error: 'ScheduledPost not found' }, { status: 404 });

    const draft = await base44.asServiceRole.entities.ContentDraft.get(post.draft_id);
    if (!draft) return Response.json({ error: 'ContentDraft not found' }, { status: 404 });

    // Load MetaConnection for this account
    const connections = await base44.asServiceRole.entities.MetaConnection.filter({ account_id: post.account_id });
    const conn = connections?.[0];

    const fallback = async (reason) => {
      await base44.asServiceRole.entities.ScheduledPost.update(post.id, {
        status: 'manual_required',
        last_error: reason,
      });

      // Send failure notification email
      if (draft.account_id) {
        const accounts = await base44.asServiceRole.entities.TrialAccount.filter({ id: post.account_id });
        const account = accounts?.[0];
        if (account?.email) {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: account.email,
            subject: `Action Required: Auto-post failed for ${post.platform}`,
            body: `Your scheduled ${post.platform} post could not be published automatically.\n\nReason: ${reason}\n\nPlease post manually at: https://new-tech-advertising.base44.app/scheduled-queue`,
          });
        }
      }
      return { success: false, fallback: true, reason };
    };

    if (!conn || conn.status !== 'connected') {
      const reason = conn?.status === 'expired' ? 'Meta token expired. Please reconnect.' : 'Meta account not connected.';
      if (conn?.status === 'expired') {
        await base44.asServiceRole.entities.MetaConnection.update(conn.id, { status: 'expired' });
      }
      return Response.json(await fallback(reason));
    }

    if (!conn.page_access_token) {
      return Response.json(await fallback('No page access token found.'));
    }

    // Build message
    const hashtags = (draft.hashtags || []).join(' ');
    const message = [draft.caption, hashtags].filter(Boolean).join('\n\n').substring(0, 63206);
    const mediaUrl = draft.media_url || null;

    let result;
    if (post.platform === 'facebook') {
      result = await postToFacebook(conn.facebook_page_id, conn.page_access_token, message, mediaUrl);
    } else if (post.platform === 'instagram') {
      if (!mediaUrl) {
        return Response.json(await fallback('Instagram requires a media URL. Please add an image to this draft and try again.'));
      }
      result = await postToInstagram(conn.instagram_business_account_id, conn.page_access_token, message, mediaUrl);
    } else {
      return Response.json({ error: `Platform ${post.platform} not supported by this function` }, { status: 400 });
    }

    if (result?.error) {
      const errMsg = result.error.message || JSON.stringify(result.error);
      // Check for token expiry
      if (result.error.code === 190) {
        await base44.asServiceRole.entities.MetaConnection.update(conn.id, { status: 'expired', last_error: errMsg });
      }
      return Response.json(await fallback(errMsg));
    }

    // Success
    await base44.asServiceRole.entities.ScheduledPost.update(post.id, {
      status: 'published',
      posted_at: new Date().toISOString(),
      publish_count: (post.publish_count || 0) + 1,
      last_error: null,
      publish_result: JSON.stringify(result).substring(0, 2000),
    });

    return Response.json({ success: true, platform: post.platform, result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
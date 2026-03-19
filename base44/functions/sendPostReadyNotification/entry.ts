import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { scheduledPostId } = await req.json();
    if (!scheduledPostId) return Response.json({ error: 'scheduledPostId required' }, { status: 400 });

    const post = await base44.asServiceRole.entities.ScheduledPost.get(scheduledPostId);
    if (!post) return Response.json({ error: 'ScheduledPost not found' }, { status: 404 });

    // Idempotency: don't send twice
    if (post.notified_ready) {
      return Response.json({ success: true, sent: false, reason: 'Already notified' });
    }

    const draft = await base44.asServiceRole.entities.ContentDraft.get(post.draft_id);
    if (!draft) return Response.json({ error: 'Draft not found' }, { status: 404 });

    const account = await base44.asServiceRole.entities.TrialAccount.get(post.account_id);
    if (!account) return Response.json({ error: 'Account not found' }, { status: 404 });

    const platform = post.platform.charAt(0).toUpperCase() + post.platform.slice(1);
    const hook = draft.hook || 'Your post';
    const queueUrl = `https://app.base44.com/content/scheduled?account_id=${post.account_id}`;

    const emailBody = `
Hi ${account.name || 'there'},

Your scheduled <strong>${platform}</strong> post is ready to publish!

<div style="background:#1e1b4b;border-left:4px solid #7c3aed;padding:16px;margin:16px 0;border-radius:4px;">
  <p style="color:#c4b5fd;font-size:14px;margin:0 0 8px 0;">Hook</p>
  <p style="color:white;font-size:16px;margin:0;">${hook}</p>
</div>

<a href="${queueUrl}" style="display:inline-block;background:#ea580c;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">⚡ Post Now →</a>

<br/><br/>
<small>This post was scheduled and is now ready for manual publishing.</small>
    `.trim();

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: account.email,
      subject: `Your ${platform} post is ready to publish`,
      body: emailBody,
      from_name: 'NTA Content Team',
    });

    // Mark as notified
    await base44.asServiceRole.entities.ScheduledPost.update(scheduledPostId, { notified_ready: true });

    return Response.json({ success: true, sent: true, email: account.email });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
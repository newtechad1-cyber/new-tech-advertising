import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { accountId } = await req.json();
    const now = new Date().toISOString();

    const query = { status: 'scheduled', publish_mode: 'manual' };
    if (accountId) query.account_id = accountId;

    const posts = await base44.asServiceRole.entities.ScheduledPost.filter(query);
    const due = posts.filter(p => p.scheduled_for && p.scheduled_for <= now);

    let updated = 0;
    for (const post of due) {
      await base44.asServiceRole.entities.ScheduledPost.update(post.id, {
        status: 'manual_required',
      });
      updated++;

      // Send post-ready email if not already notified
      if (!post.notified_ready && post.account_id) {
        await base44.asServiceRole.functions.invoke('sendPostReadyNotification', {
          scheduledPostId: post.id,
        });
      }
    }

    return Response.json({ success: true, checked: posts.length, updated });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
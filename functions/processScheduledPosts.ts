import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const now = new Date().toISOString();

    // Find due posts with publish_mode=api on FB/IG
    const scheduledPosts = await base44.asServiceRole.entities.ScheduledPost.filter({ status: 'scheduled', publish_mode: 'api' });
    const due = scheduledPosts.filter(p =>
      p.scheduled_for && p.scheduled_for <= now &&
      (p.platform === 'facebook' || p.platform === 'instagram')
    ).slice(0, 10); // max 10 per run

    let published = 0;
    let failed = 0;
    const results = [];

    for (const post of due) {
      // Set status to publishing to prevent double-runs
      await base44.asServiceRole.entities.ScheduledPost.update(post.id, { status: 'publishing' });

      const res = await base44.asServiceRole.functions.invoke('publishScheduledPostMeta', {
        scheduledPostId: post.id,
      });

      if (res?.success) {
        published++;
        results.push({ id: post.id, platform: post.platform, status: 'published' });
      } else {
        failed++;
        results.push({ id: post.id, platform: post.platform, status: 'failed', reason: res?.reason || res?.error });
      }
    }

    return Response.json({
      success: true,
      checked: scheduledPosts.length,
      due: due.length,
      published,
      failed,
      results,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
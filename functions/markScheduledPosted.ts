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

    const now = new Date().toISOString();

    await base44.asServiceRole.entities.ScheduledPost.update(scheduledPostId, {
      status: 'published',
      posted_at: now,
      publish_result: { manual: true, posted_by: user.email, posted_at: now },
      publish_count: (post.publish_count || 0) + 1,
    });

    return Response.json({ success: true, posted_at: now });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
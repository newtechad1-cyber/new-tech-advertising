import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { draftId, platform, scheduledFor, action } = await req.json();

    if (!draftId || !platform) {
      return Response.json({ error: 'draftId and platform are required' }, { status: 400 });
    }

    // Look up existing ScheduledPost for this (draft_id, platform) pair
    const existing = await base44.asServiceRole.entities.ScheduledPost.filter({
      draft_id: draftId,
      platform: platform,
    });

    const record = existing?.[0] || null;

    // CANCEL action
    if (action === 'cancel') {
      if (!record) {
        return Response.json({ error: 'No scheduled post found to cancel' }, { status: 404 });
      }
      await base44.asServiceRole.entities.ScheduledPost.update(record.id, {
        status: 'canceled',
      });
      return Response.json({ success: true, action: 'canceled', id: record.id });
    }

    // SCHEDULE / RESCHEDULE action (default)
    if (!scheduledFor) {
      return Response.json({ error: 'scheduledFor is required for scheduling' }, { status: 400 });
    }

    if (record) {
      // Upsert: overwrite scheduled_for, reset status to scheduled
      await base44.asServiceRole.entities.ScheduledPost.update(record.id, {
        scheduled_for: scheduledFor,
        status: 'scheduled',
        last_error: null,
        publish_result: null,
      });
      return Response.json({ success: true, action: 'rescheduled', id: record.id });
    } else {
      // Fetch draft to get account_id
      const draft = await base44.asServiceRole.entities.ContentDraft.get(draftId);
      if (!draft) {
        return Response.json({ error: 'Draft not found' }, { status: 404 });
      }
      const created = await base44.asServiceRole.entities.ScheduledPost.create({
        draft_id: draftId,
        account_id: draft.account_id,
        platform,
        scheduled_for: scheduledFor,
        status: 'scheduled',
        publish_count: 0,
      });
      return Response.json({ success: true, action: 'scheduled', id: created.id });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
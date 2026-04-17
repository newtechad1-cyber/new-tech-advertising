import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

async function postLog(base44, data) {
  try {
    await base44.asServiceRole.entities.PostingLog.create({
      event_time: new Date().toISOString(),
      ...data,
    });
  } catch (e) {
    console.error('[publishingJobRunner] log error:', e.message);
  }
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Allow admin user or internal (bypass_auth from direct calls)
  let isInternal = false;
  let payload = {};
  try { payload = await req.json(); } catch (_) {}
  isInternal = payload?.internal === true;

  if (!isInternal) {
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }
  }

  const now = new Date();
  console.log(`[publishingJobRunner] starting at ${now.toISOString()}`);

  await postLog(base44, {
    event_type: 'publish_attempt',
    status: 'info',
    message: `Job runner started at ${now.toISOString()}`,
  });

  // Fetch all non-terminal items
  const allItems = await base44.asServiceRole.entities.PublishingQueue.list('-scheduled_for', 500);

  // Filter: approved + actionable publish status + scheduled_for <= now
  const ELIGIBLE_STATUSES = ['queued', 'scheduled', 'not_started'];
  const ELIGIBLE_APPROVALS = ['approved'];

  const dueItems = allItems.filter(item => {
    if (!ELIGIBLE_APPROVALS.includes(item.approval_status)) return false;
    if (!ELIGIBLE_STATUSES.includes(item.publish_status)) return false;
    if (!item.scheduled_for) return false;
    return new Date(item.scheduled_for) <= now;
  });

  const skippedItems = allItems.filter(item => {
    // Only log skips for items that seem like they should be running
    if (item.publish_status === 'posted' || item.publish_status === 'cancelled' || item.publish_status === 'publishing') return false;
    if (!item.scheduled_for) return false;
    if (new Date(item.scheduled_for) > now) return false;
    // Skipped = has scheduled_for <= now but not in due list
    return !dueItems.find(d => d.id === item.id);
  });

  console.log(`[publishingJobRunner] total=${allItems.length} due=${dueItems.length} skipped=${skippedItems.length}`);

  await postLog(base44, {
    event_type: 'publish_attempt',
    status: 'info',
    message: `Found ${dueItems.length} due items, ${skippedItems.length} skipped items`,
    payload: JSON.stringify({ total: allItems.length, due: dueItems.length, skipped: skippedItems.length }),
  });

  // Log why items were skipped
  for (const item of skippedItems) {
    let reason = 'unknown';
    if (!ELIGIBLE_APPROVALS.includes(item.approval_status)) {
      reason = `approval_status is "${item.approval_status}" (need: approved)`;
    } else if (!ELIGIBLE_STATUSES.includes(item.publish_status)) {
      reason = `publish_status is "${item.publish_status}" (need: queued/scheduled/not_started)`;
    }

    await postLog(base44, {
      queue_id: item.id,
      client_id: item.client_id,
      provider: item.provider,
      event_type: 'queue_item_skipped',
      status: 'warning',
      message: `Skipped "${item.title || item.id}": ${reason}`,
      payload: JSON.stringify({ approval_status: item.approval_status, publish_status: item.publish_status, scheduled_for: item.scheduled_for }),
    });

    // Write skip reason back to the queue item for diagnostics
    await base44.asServiceRole.entities.PublishingQueue.update(item.id, {
      notes: `[Runner skip ${now.toISOString()}]: ${reason}`,
    });
  }

  // Process due items
  let processed = 0, published = 0, failed = 0;

  for (const item of dueItems) {
    processed++;
    console.log(`[publishingJobRunner] processing item=${item.id} provider=${item.provider}`);

    await postLog(base44, {
      queue_id: item.id,
      client_id: item.client_id,
      provider: item.provider,
      event_type: 'queue_item_picked_up',
      status: 'info',
      message: `Picked up for publishing: "${item.title || item.id}" scheduled_for=${item.scheduled_for}`,
    });

    try {
      // Call publishQueueItem via SDK (internal bypass)
      const res = await base44.asServiceRole.functions.invoke('publishQueueItem', {
        queue_id: item.id,
        bypass_auth: true,
      });

      if (res?.success === false || res?.error) {
        failed++;
        console.error(`[publishingJobRunner] item=${item.id} failed: ${res?.error}`);
      } else {
        published++;
        console.log(`[publishingJobRunner] item=${item.id} published OK`);
      }
    } catch (err) {
      failed++;
      console.error(`[publishingJobRunner] item=${item.id} threw: ${err.message}`);
      await postLog(base44, {
        queue_id: item.id,
        client_id: item.client_id,
        provider: item.provider,
        event_type: 'queue_item_publish_failed',
        status: 'failed',
        message: `Runner caught exception: ${err.message}`,
        error_details: err.message,
      });
    }
  }

  const summary = { processed, published, failed, skipped: skippedItems.length, run_at: now.toISOString() };
  console.log(`[publishingJobRunner] done`, summary);

  await postLog(base44, {
    event_type: 'publish_attempt',
    status: published > 0 || processed === 0 ? 'success' : 'warning',
    message: `Runner finished: processed=${processed} published=${published} failed=${failed} skipped=${skippedItems.length}`,
    payload: JSON.stringify(summary),
  });

  return Response.json(summary);
});
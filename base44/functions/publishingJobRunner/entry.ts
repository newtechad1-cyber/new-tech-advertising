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

// Canonical runnable statuses — single source of truth
const ELIGIBLE_STATUSES = ['queued', 'scheduled', 'not_started'];
const NON_RUNNABLE_STATUSES = ['publishing', 'posted', 'failed', 'cancelled'];

// Returns a human-readable reason why a queue item is NOT eligible, or null if it is eligible.
function getSkipReason(item, now) {
  if (!item.provider) return 'missing_provider: no provider set on queue item';
  if (!item.connection_id) return 'missing_connection_id: no connection_id linked to queue item';
  if (!item.scheduled_for) return 'missing_schedule: scheduled_for is empty';
  if (item.approval_status !== 'approved') {
    return `not_approved: approval_status="${item.approval_status}" (need: approved)`;
  }
  if (item.publish_status === 'failed') {
    return `failed_status: publish_status="failed" — manual reset required before retrying`;
  }
  if (item.publish_status === 'publishing') {
    return `stuck_publishing: publish_status="publishing" — item may be stuck, use Reset to Queue`;
  }
  if (!ELIGIBLE_STATUSES.includes(item.publish_status)) {
    return `bad_publish_status: publish_status="${item.publish_status}" (need: queued/scheduled/not_started)`;
  }
  if (new Date(item.scheduled_for) > now) {
    return `not_yet_due: scheduled_for=${item.scheduled_for} is in the future`;
  }
  return null; // eligible
}

// Check if item is "ready to publish" (all required fields present + approved + queueable)
function isReadyToPublish(item) {
  return !!(
    item.provider &&
    item.connection_id &&
    item.scheduled_for &&
    item.approval_status === 'approved' &&
    ['queued', 'scheduled', 'not_started'].includes(item.publish_status)
  );
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Allow an admin user or a scheduled runner holding the server-side secret.
  let isInternal = false;
  let payload = {};
  try { payload = await req.json(); } catch (_) {}
  const runnerSecret = Deno.env.get('PUBLISHING_RUNNER_SECRET') || '';
  isInternal = !!runnerSecret && payload?.internal_token === runnerSecret;

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
  // NOTE: 'publishing' is intentionally NOT excluded — we need to detect stuck items
  const allItems = await base44.asServiceRole.entities.PublishingQueue.list('-scheduled_for', 500);
  const nonTerminal = allItems.filter(item =>
    !['posted', 'cancelled'].includes(item.publish_status)
  );

  // Detect stuck publishing items: status=publishing with no recent activity (>10 min old)
  const stuckThreshold = new Date(now.getTime() - 10 * 60 * 1000); // 10 minutes ago
  const stuckItems = allItems.filter(item => {
    if (item.publish_status !== 'publishing') return false;
    const updatedAt = item.updated_date ? new Date(item.updated_date) : new Date(0);
    return updatedAt < stuckThreshold;
  });

  // Reset stuck publishing items to failed
  for (const stuck of stuckItems) {
    console.warn(`[publishingJobRunner] STUCK item detected: ${stuck.id} — resetting to failed`);
    await base44.asServiceRole.entities.PublishingQueue.update(stuck.id, {
      publish_status: 'failed',
      error_message: `Auto-reset: item was stuck in "publishing" state for >10 min (no worker completed)`,
    });
    await postLog(base44, {
      queue_id: stuck.id,
      client_id: stuck.client_id,
      provider: stuck.provider || '',
      event_type: 'queue_item_stuck_reset',
      status: 'warning',
      message: `Stuck publishing item auto-reset to failed: "${stuck.title || stuck.id}"`,
    });
  }

  // Classify each item
  const dueItems = [];
  const skippedItems = [];

  for (const item of nonTerminal) {
    const reason = getSkipReason(item, now);
    if (reason === null) {
      dueItems.push(item);
    } else if (item.scheduled_for) {
      // Only report as skipped if it has a schedule (otherwise it's just a draft sitting in queue)
      skippedItems.push({ item, reason });
    }
  }

  console.log(`[publishingJobRunner] total=${allItems.length} nonTerminal=${nonTerminal.length} due=${dueItems.length} skipped=${skippedItems.length}`);

  await postLog(base44, {
    event_type: 'runner_due_items_found',
    status: 'info',
    message: `Found ${dueItems.length} due items ready to publish`,
    payload: JSON.stringify({
      total: allItems.length,
      non_terminal: nonTerminal.length,
      due: dueItems.length,
      skipped: skippedItems.length,
    }),
  });

  if (skippedItems.length > 0) {
    await postLog(base44, {
      event_type: 'runner_skipped_items_found',
      status: 'warning',
      message: `${skippedItems.length} items skipped — see payload for details`,
      payload: JSON.stringify(
        skippedItems.map(({ item, reason }) => ({
          id: item.id,
          title: item.title || item.body_text?.slice(0, 50),
          provider: item.provider,
          client_id: item.client_id,
          connection_id: item.connection_id,
          scheduled_for: item.scheduled_for,
          approval_status: item.approval_status,
          publish_status: item.publish_status,
          reason,
        }))
      ),
    });
  }

  // Log + annotate each skipped item
  for (const { item, reason } of skippedItems) {
    // Determine specific event type
    let eventType = 'queue_item_skipped';
    if (reason.startsWith('missing_provider')) eventType = 'queue_item_missing_provider';
    else if (reason.startsWith('missing_connection_id')) eventType = 'queue_item_missing_connection';
    else if (reason.startsWith('missing_schedule')) eventType = 'queue_item_missing_schedule';
    else if (reason.startsWith('not_approved')) eventType = 'queue_item_not_approved';

    await postLog(base44, {
      queue_id: item.id,
      client_id: item.client_id,
      provider: item.provider || '',
      event_type: eventType,
      status: 'warning',
      message: `Skipped "${item.title || item.id}": ${reason}`,
      payload: JSON.stringify({
        approval_status: item.approval_status,
        publish_status: item.publish_status,
        scheduled_for: item.scheduled_for,
        connection_id: item.connection_id,
        provider: item.provider,
      }),
    });

    // Write skip reason + ready_to_publish=false back to the queue item
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
      const res = await base44.asServiceRole.functions.invoke('publishQueueItem', {
        queue_id: item.id,
        internal_token: runnerSecret,
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

  const summary = {
    processed,
    published,
    failed,
    skipped: skippedItems.length,
    due_items: dueItems.length,
    run_at: now.toISOString(),
  };
  console.log(`[publishingJobRunner] done`, summary);

  await postLog(base44, {
    event_type: 'publish_attempt',
    status: published > 0 || processed === 0 ? 'success' : 'warning',
    message: `Runner finished: processed=${processed} published=${published} failed=${failed} skipped=${skippedItems.length}`,
    payload: JSON.stringify(summary),
  });

  return Response.json(summary);
});

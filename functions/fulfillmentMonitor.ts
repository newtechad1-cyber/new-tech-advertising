import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const now = new Date();
    const noActivityThreshold = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

    // ── 1. Check for stalled workrooms (no activity 5+ days) ──────
    const activeWorkrooms = await base44.asServiceRole.entities.FulfillmentWorkrooms.filter({
      status: 'active',
    });

    const created = [];

    for (const workroom of activeWorkrooms) {
      if (new Date(workroom.updated_date) < noActivityThreshold) {
        const existing = await base44.asServiceRole.entities.SalesNotification.filter({
          related_workroom_id: workroom.id,
          notification_type: 'fulfillment_stalled',
          status: { $in: ['unread', 'snoozed'] },
        });

        if (existing.length === 0) {
          await base44.asServiceRole.entities.SalesNotification.create({
            title: `⏱️ Fulfillment Stalled — ${workroom.title}`,
            message: 'No activity for 5+ days. Check on delivery progress with client.',
            priority: 'medium',
            notification_type: 'fulfillment_stalled',
            related_workroom_id: workroom.id,
            assigned_admin_user_id: workroom.assigned_admin_user_id,
            status: 'unread',
          });
          created.push(`stalled: ${workroom.title}`);
        }
      }
    }

    // ── 2. Check for overdue deliveries ──────────────────────────
    const overdueWorkrooms = activeWorkrooms.filter(w =>
      w.next_delivery_date && new Date(w.next_delivery_date) < now
    );

    for (const workroom of overdueWorkrooms) {
      const existing = await base44.asServiceRole.entities.SalesNotification.filter({
        related_workroom_id: workroom.id,
        notification_type: 'delivery_overdue',
        status: { $in: ['unread', 'snoozed'] },
      });

      if (existing.length === 0) {
        await base44.asServiceRole.entities.SalesNotification.create({
          title: `📦 Delivery Overdue — ${workroom.title}`,
          message: `Scheduled delivery was ${Math.floor((now - new Date(workroom.next_delivery_date)) / 86400000)} days ago.`,
          priority: 'high',
          notification_type: 'delivery_overdue',
          related_workroom_id: workroom.id,
          assigned_admin_user_id: workroom.assigned_admin_user_id,
          status: 'unread',
        });
        created.push(`overdue: ${workroom.title}`);
      }
    }

    // ── 3. Create client approval tasks when deliverables need review ──
    const deliverables = await base44.asServiceRole.entities.Deliverables.filter({
      approval_required: true,
      approval_status: 'pending_review',
    });

    for (const deliverable of deliverables) {
      const existingTask = await base44.asServiceRole.entities.FulfillmentTasks.filter({
        related_task_id: deliverable.id,
        task_type: 'client_approval',
        status: { $nin: ['completed', 'approved'] },
      });

      if (existingTask.length === 0) {
        const workrooms = await base44.asServiceRole.entities.FulfillmentWorkrooms.filter({
          id: deliverable.workroom_id,
        });

        if (workrooms.length > 0) {
          const workroom = workrooms[0];
          await base44.asServiceRole.entities.FulfillmentTasks.create({
            workroom_id: workroom.id,
            company_id: deliverable.company_id,
            visible_to_client: true,
            task_title: `Approve: ${deliverable.title}`,
            task_type: 'client_approval',
            description: `Client approval needed for ${deliverable.title}`,
            status: 'pending',
            priority: 'high',
            due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          });
          created.push(`approval-task: ${deliverable.title}`);
        }
      }
    }

    // ── 4. Close old client requests ─────────────────────────────
    const oldRequests = await base44.asServiceRole.entities.ClientRequests.filter({
      status: 'resolved',
      resolved_date: { $lt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString() },
    });

    for (const request of oldRequests) {
      await base44.asServiceRole.entities.ClientRequests.update(request.id, {
        status: 'closed',
      });
      created.push(`closed-request: ${request.title}`);
    }

    return Response.json({
      success: true,
      actions_taken: created.length,
      details: created,
      checked_at: now.toISOString(),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
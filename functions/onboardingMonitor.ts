import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();
    const created = [];

    // ── 1. ONBOARDING STALLED for 3+ days ──────────────────────────
    const activeWorkrooms = await base44.asServiceRole.entities.OnboardingWorkrooms.filter({
      status: { $nin: ['launched', 'paused'] },
    });

    for (const workroom of activeWorkrooms) {
      if (workroom.created_date && workroom.created_date < threeDaysAgo && workroom.status === 'not_started') {
        // Check for existing alert
        const existing = await base44.asServiceRole.entities.SalesNotification.filter({
          related_workroom_id: workroom.id,
          notification_type: 'onboarding_stalled',
          status: { $in: ['unread', 'snoozed'] },
        });

        if (existing.length === 0) {
          await base44.asServiceRole.entities.SalesNotification.create({
            title: `⏰ Onboarding Stalled — ${workroom.title}`,
            message: `Workroom created 3+ days ago but not yet started. Follow up with client.`,
            priority: 'high',
            notification_type: 'onboarding_stalled',
            related_workroom_id: workroom.id,
            company_name: workroom.title || '',
            status: 'unread',
          });
          created.push(`onboarding-stalled: ${workroom.title}`);
        }
      }
    }

    // ── 2. CLIENT TASK overdue ──────────────────────────────────────
    const overdueTasks = await base44.asServiceRole.entities.OnboardingTasks.filter({
      visible_to_client: true,
      status: { $nin: ['completed', 'approved'] },
      due_date: { $lt: new Date().toISOString().split('T')[0] },
    });

    for (const task of overdueTasks) {
      const existing = await base44.asServiceRole.entities.SalesNotification.filter({
        related_task_id: task.id,
        notification_type: 'task_overdue',
        status: { $in: ['unread', 'snoozed'] },
      });

      if (existing.length === 0) {
        const workrooms = await base44.asServiceRole.entities.OnboardingWorkrooms.filter({ id: task.workroom_id });
        const workroom = workrooms[0];
        await base44.asServiceRole.entities.SalesNotification.create({
          title: `📋 Client Task Overdue — ${task.task_title}`,
          message: `Task for ${workroom?.title} is ${Math.floor((now - new Date(task.due_date)) / 86400000)} days overdue.`,
          priority: 'high',
          notification_type: 'task_overdue',
          related_task_id: task.id,
          related_workroom_id: task.workroom_id,
          status: 'unread',
        });
        created.push(`task-overdue: ${task.task_title}`);
      }
    }

    // ── 3. Auto-create tasks when client tasks submitted ─────────────
    const submittedTasks = await base44.asServiceRole.entities.OnboardingTasks.filter({
      visible_to_client: true,
      status: 'submitted',
    });

    for (const task of submittedTasks) {
      // Check for existing review task
      const reviewTask = await base44.asServiceRole.entities.SalesTasks.filter({
        task_type: 'other',
        company_name: task.company_id,
      }).then(tasks => tasks.find(t => t.notes?.includes(`Review: ${task.task_title}`)));

      if (!reviewTask) {
        await base44.asServiceRole.entities.SalesTasks.create({
          task_title: `Review submission: ${task.task_title}`,
          task_type: 'content_approval',
          company_name: task.company_id,
          priority: 'high',
          due_date: new Date().toISOString().split('T')[0],
          status: 'pending',
          notes: `Review: ${task.task_title} for onboarding`,
        });
        created.push(`review-task: ${task.task_title}`);
      }
    }

    return Response.json({
      success: true,
      alerts_created: created.length,
      details: created,
      checked_at: now.toISOString(),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
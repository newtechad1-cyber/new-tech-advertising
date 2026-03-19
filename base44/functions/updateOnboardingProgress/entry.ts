import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { workroom_id } = await req.json();

    if (!workroom_id) {
      return Response.json({ error: 'workroom_id required' }, { status: 400 });
    }

    // Fetch workroom
    const workrooms = await base44.asServiceRole.entities.OnboardingWorkrooms.filter({ id: workroom_id });
    if (workrooms.length === 0) {
      return Response.json({ error: 'Workroom not found' }, { status: 404 });
    }
    const workroom = workrooms[0];

    // Fetch all tasks and assets
    const [tasks, assets, forms] = await Promise.all([
      base44.asServiceRole.entities.OnboardingTasks.filter({ workroom_id: workroom_id }),
      base44.asServiceRole.entities.OnboardingAssets.filter({ workroom_id: workroom_id }),
      base44.asServiceRole.entities.OnboardingForms.filter({ workroom_id: workroom_id }),
    ]);

    // Calculate progress
    const requiredTasks = tasks.filter(t => t.required_for_launch);
    const completedRequiredTasks = requiredTasks.filter(t => t.status === 'completed' || t.status === 'approved');
    const clientTasks = tasks.filter(t => t.visible_to_client);
    const completedClientTasks = clientTasks.filter(t => t.status === 'completed' || t.status === 'approved' || t.status === 'submitted');
    const criticalAssets = assets.filter(a => ['logo', 'service_list', 'service_area'].includes(a.asset_type));
    const approvedCriticalAssets = criticalAssets.filter(a => a.status === 'approved');
    const submittedForms = forms.filter(f => f.status === 'submitted' || f.status === 'approved');

    let progressPercent = 0;
    const totalItems = requiredTasks.length + criticalAssets.length + (forms.length > 0 ? 1 : 0);
    if (totalItems > 0) {
      const completedItems = completedRequiredTasks.length + approvedCriticalAssets.length + (submittedForms.length > 0 ? 1 : 0);
      progressPercent = Math.round((completedItems / totalItems) * 100);
    }

    // Determine status
    let newStatus = workroom.status;
    const hasBlockers = requiredTasks.some(t => t.status === 'blocked') || criticalAssets.some(a => a.status === 'missing');

    if (clientTasks.length > 0 && completedClientTasks.length < clientTasks.length) {
      newStatus = 'waiting_on_client';
    } else if (progressPercent === 100 && !hasBlockers) {
      newStatus = 'review';
    }

    // Update workroom
    await base44.asServiceRole.entities.OnboardingWorkrooms.update(workroom_id, {
      progress_percent: progressPercent,
      status: newStatus,
    });

    // Auto-resolve alerts if ready
    if (newStatus === 'review') {
      const alerts = await base44.asServiceRole.entities.SalesNotification.filter({
        related_workroom_id: workroom_id,
        status: { $in: ['unread', 'snoozed'] },
      });
      for (const alert of alerts) {
        await base44.asServiceRole.entities.SalesNotification.update(alert.id, {
          status: 'resolved',
          resolved_date: new Date().toISOString(),
        });
      }
    }

    return Response.json({ success: true, progress_percent: progressPercent, status: newStatus });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
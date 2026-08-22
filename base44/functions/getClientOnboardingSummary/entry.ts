import { createClientFromRequest } from 'npm:@base44/sdk@0.8.41';

Deno.serve(async (req) => {
  if (req.method !== 'POST') return Response.json({ error: 'POST required' }, { status: 405 });

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const isAdmin = user.role === 'admin' || user.is_service === true;
    const companyId = user?.data?.client_id || user.company_id;
    if (!isAdmin && !companyId) {
      return Response.json({ error: 'Client access required.' }, { status: 403 });
    }

    const query = isAdmin ? { status: { $nin: ['launched', 'paused'] } } : {
      company_id: companyId,
      status: { $nin: ['launched', 'paused'] },
    };
    const workrooms = await base44.asServiceRole.entities.OnboardingWorkrooms.filter(query, '-created_date', 1);
    const workroom = workrooms[0];
    if (!workroom) return Response.json({ workroom: null, nextTask: null });

    const taskQuery = {
      workroom_id: workroom.id,
      visible_to_client: true,
      status: 'pending',
    };
    const tasks = await base44.asServiceRole.entities.OnboardingTasks.filter(taskQuery, 'due_date', 1);
    return Response.json({
      workroom: {
        id: workroom.id,
        title: workroom.title,
        status: workroom.status,
        progress_percent: workroom.progress_percent,
      },
      nextTask: tasks[0] ? {
        id: tasks[0].id,
        task_title: tasks[0].task_title,
        due_date: tasks[0].due_date,
      } : null,
    });
  } catch (error) {
    console.error('getClientOnboardingSummary failed', error);
    return Response.json({ error: 'Unable to load onboarding summary.' }, { status: 500 });
  }
});

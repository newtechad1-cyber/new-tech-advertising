import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

function isTrustedInternalUser(user) {
  const adminEmails = String(Deno.env.get('ADMIN_EMAILS') || '')
    .split(',')
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(
    user &&
    (user.is_service === true ||
      user.role === 'admin' ||
      adminEmails.includes(String(user.email || '').toLowerCase()))
  );
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
  const user = await base44.auth.me().catch(() => null);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isTrustedInternalUser(user)) return Response.json({ error: 'Admin access required' }, { status: 403 });


    const allJobs = await base44.asServiceRole.entities.AIJobs.list('-created_date', 200);
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;
    const alerts = [];

    for (const job of allJobs) {
      const age = now - new Date(job.created_date).getTime();

      if (job.status === 'pending' && age > ONE_HOUR) {
        alerts.push({
          automation_name: 'processAIJobsAutomation',
          issue_type: 'stuck_job',
          message: `Job ${job.id} (${job.job_type} for "${job.topic_title}") has been pending for over 1 hour.`,
          status: 'open',
          reference_id: job.id,
        });
      }

      if (job.status === 'processing' && age > ONE_HOUR) {
        alerts.push({
          automation_name: 'processAIJobsAutomation',
          issue_type: 'stuck_job',
          message: `Job ${job.id} (${job.job_type} for "${job.topic_title}") has been processing for over 1 hour.`,
          status: 'open',
          reference_id: job.id,
        });
      }

      if (job.status === 'failed') {
        // Only create alert if no existing open alert for this job
        const existing = await base44.asServiceRole.entities.AutomationAlerts.filter({
          reference_id: job.id,
          status: 'open',
        });
        if (existing.length === 0) {
          alerts.push({
            automation_name: 'processAIJobsAutomation',
            issue_type: 'failed_job',
            message: `Job ${job.id} failed: ${job.error_message || 'Unknown error'}`,
            status: 'open',
            reference_id: job.id,
          });
        }
      }
    }

    for (const alert of alerts) {
      await base44.asServiceRole.entities.AutomationAlerts.create(alert);
    }

    return Response.json({ checked: allJobs.length, alerts_created: alerts.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
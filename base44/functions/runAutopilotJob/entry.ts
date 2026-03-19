import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { job_type, related_service, related_city } = await req.json();

    const job = await base44.asServiceRole.entities.AutopilotJobs.create({
      job_name: `Manual: ${job_type}`,
      job_type,
      status: 'running',
      frequency: 'Once',
      related_service: related_service || '',
      related_city: related_city || '',
      enabled: true,
      last_run_date: new Date().toISOString()
    });

    let result = '';

    try {
      if (job_type === 'Blog Generation') {
        const res = await base44.asServiceRole.functions.invoke('weeklyBlogGenerator', {});
        result = typeof res === 'string' ? res : JSON.stringify(res);
      } else if (job_type === 'City Page Generation') {
        const res = await base44.asServiceRole.functions.invoke('dailyProgrammaticPageGenerator', {});
        result = typeof res === 'string' ? res : JSON.stringify(res);
      } else if (job_type === 'Social Content Generation') {
        const res = await base44.asServiceRole.functions.invoke('weeklyContentMultiplication', {});
        result = typeof res === 'string' ? res : JSON.stringify(res);
      } else if (job_type === 'Case Study Promotion') {
        const res = await base44.asServiceRole.functions.invoke('generateCaseStudyContent', {});
        result = typeof res === 'string' ? res : JSON.stringify(res);
      } else {
        result = `Job type "${job_type}" manually triggered at ${new Date().toISOString()}. No direct function mapping — configure via scheduler.`;
      }

      await base44.asServiceRole.entities.AutopilotJobs.update(job.id, {
        status: 'completed',
        output_summary: result,
        last_run_date: new Date().toISOString()
      });

      return Response.json({ success: true, job_id: job.id, result });
    } catch (err) {
      await base44.asServiceRole.entities.AutopilotJobs.update(job.id, {
        status: 'failed',
        output_summary: err.message,
        last_run_date: new Date().toISOString()
      });
      return Response.json({ success: false, error: err.message }, { status: 500 });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
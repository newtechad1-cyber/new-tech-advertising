/**
 * Automation: Monthly Cron Job
 * Trigger:    Scheduled — 1st of each month at 6am CT
 * Action:     reporting_agent.generate_report for every active company
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

function getPreviousMonthLabel() {
  const now = new Date();
  const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const month = now.getMonth() === 0 ? 12 : now.getMonth();
  return `${year}-${String(month).padStart(2, '0')}`;
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const reportPeriod = getPreviousMonthLabel();

  // Fetch all active client companies
  const companies = await base44.asServiceRole.entities.Company.filter({ status: 'client' });

  const results = [];

  for (const company of companies) {
    // Check if a report for this period already exists
    const existing = await base44.asServiceRole.entities.PerformanceReport.filter({
      company_id: company.id,
      report_period: reportPeriod,
    });
    if (existing.length > 0) {
      results.push({ company_id: company.id, skipped: true, reason: 'Report already exists' });
      continue;
    }

    // Fetch last month's post metrics
    const [posts, contentItems] = await Promise.all([
      base44.asServiceRole.entities.ScheduledPost.filter({ company_id: company.id, status: 'posted' }),
      base44.asServiceRole.entities.ContentItem.filter({ company_id: company.id, status: 'posted' }),
    ]);

    // Create AiTask for reporting_agent.generate_report
    const task = await base44.asServiceRole.entities.AiTask.create({
      agent_key: 'reporting_agent',
      step_key: 'generate_report',
      status: 'pending',
      step_status: 'pending',
      inputs: {
        company_id: company.id,
        business_name: company.business_name,
        report_period: reportPeriod,
        total_posts_this_month: posts.length,
        content_items_count: contentItems.length,
        artifact_type: 'other',
      },
    });

    await base44.asServiceRole.functions.invoke('agentJobHelper', {
      job_type: 'report_generation',
      trigger: 'scheduled',
      company_id: company.id,
      input_params: { task_id: task.id, report_period: reportPeriod },
      function_to_invoke: 'runAiStep',
      function_payload: { task_id: task.id },
    });

    // Pre-create the PerformanceReport record (AI will fill summary_narrative)
    await base44.asServiceRole.entities.PerformanceReport.create({
      company_id: company.id,
      report_period: reportPeriod,
      report_type: 'monthly',
      total_posts: posts.length,
      generated_by: 'ai',
    });

    await base44.asServiceRole.entities.ActivityLog.create({
      company_id: company.id,
      event_type: 'agent_job_completed',
      summary: `Monthly report triggered for ${company.business_name} — period: ${reportPeriod}`,
      entity_type: 'Company',
      entity_id: company.id,
    });

    results.push({ company_id: company.id, task_id: task.id, report_period: reportPeriod });
  }

  return Response.json({ success: true, report_period: reportPeriod, processed: results.length, results });
});
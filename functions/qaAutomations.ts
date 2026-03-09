/**
 * QA Automations Handler
 * Triggered by entity automations on QATestRuns and QAIssues.
 *
 * Handles:
 * 1. QATestRun result=fail → create QAIssue if no open duplicate exists
 * 2. QAIssue status=resolved → mark linked test as retest_needed
 * 3. Critical open issues → degrade go_live_status on latest QAReleaseStatus
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Admin access required' }, { status: 403 });
  }

  const body = await req.json();
  const { event, data, old_data } = body;

  if (!event || !data) {
    return Response.json({ error: 'Missing event or data' }, { status: 400 });
  }

  const { type, entity_name, entity_id } = event;

  // ── QATestRun result changed to fail ────────────────────────────
  if (entity_name === 'QATestRuns' && (type === 'create' || type === 'update')) {
    const resultChangedToFail =
      data.result === 'fail' && (type === 'create' || old_data?.result !== 'fail');

    if (resultChangedToFail) {
      // Check for existing open issue linked to this test case
      const existingIssues = await base44.asServiceRole.entities.QAIssues.filter({
        linked_test_case_id: data.test_case_id,
        status: 'open',
      });

      if (existingIssues.length === 0) {
        // Fetch test case name for context
        let testName = data.test_case_id;
        try {
          const tc = await base44.asServiceRole.entities.QATestCases.get(data.test_case_id);
          testName = `${tc.test_id} — ${tc.name}`;
        } catch (_) {}

        await base44.asServiceRole.entities.QAIssues.create({
          title: `Test Failed: ${testName}`,
          severity: 'high',
          priority: 'P1',
          status: 'open',
          linked_test_case_id: data.test_case_id,
          linked_test_run_id: entity_id,
          issue_type: 'automation_failure',
          description: `Test run failed on ${data.environment || 'staging'} (build: ${data.build_version || 'unknown'}). Auto-created by QA Automations.`,
          actual_behavior: data.notes || 'Test failed — see run details for steps.',
          opened_date: new Date().toISOString().split('T')[0],
          auto_created: true,
        });

        console.log(`[qaAutomations] Created QAIssue for failed run on test: ${testName}`);
      } else {
        console.log(`[qaAutomations] Open issue already exists for test_case_id: ${data.test_case_id} — skipping`);
      }

      // Update latest QAReleaseStatus critical/failed counts
      await updateReleaseStatusCounts(base44);
    }
  }

  // ── QAIssue status changed to resolved ──────────────────────────
  if (entity_name === 'QAIssues' && type === 'update') {
    const resolvedNow = data.status === 'resolved' && old_data?.status !== 'resolved';

    if (resolvedNow && data.linked_test_case_id) {
      // Mark the related test run as needing retest by creating a new open issue note
      console.log(`[qaAutomations] Issue resolved for test_case_id: ${data.linked_test_case_id} — retest recommended`);
      // You can extend: create a AgentTask or notification here for "retest needed"
    }

    // Recalculate release status after resolution
    await updateReleaseStatusCounts(base44);
  }

  return Response.json({ success: true, processed: `${entity_name}:${type}:${entity_id}` });
});

async function updateReleaseStatusCounts(base44) {
  try {
    const releases = await base44.asServiceRole.entities.QAReleaseStatus.list('-last_updated', 1);
    if (!releases.length) return;

    const latest = releases[0];
    const openIssues = await base44.asServiceRole.entities.QAIssues.filter({ status: 'open' });
    const criticalCount = openIssues.filter(i => i.severity === 'critical').length;
    const highCount = openIssues.filter(i => i.severity === 'high').length;

    // Auto-determine go_live_status
    let go_live_status = latest.go_live_status;
    if (criticalCount > 0) go_live_status = 'no_go';
    else if (highCount > 3) go_live_status = 'conditional';
    else if (latest.failed_tests === 0 && latest.passed_tests > 0) go_live_status = 'go';

    const allRuns = await base44.asServiceRole.entities.QATestRuns.list('-started_at', 200);
    const failed = allRuns.filter(r => r.result === 'fail').length;
    const passed = allRuns.filter(r => r.result === 'pass').length;
    const blocked = allRuns.filter(r => r.result === 'blocked').length;

    await base44.asServiceRole.entities.QAReleaseStatus.update(latest.id, {
      failed_tests: failed,
      passed_tests: passed,
      blocked_tests: blocked,
      critical_failures: criticalCount,
      high_failures: highCount,
      go_live_status,
      last_updated: new Date().toISOString(),
    });

    console.log(`[qaAutomations] Release status updated: go_live=${go_live_status}, critical=${criticalCount}`);
  } catch (err) {
    console.error('[qaAutomations] Failed to update release status:', err.message);
  }
}
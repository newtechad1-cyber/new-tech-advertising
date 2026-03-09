/**
 * NTA QA Automation Engine
 * Handles 4 automations:
 *   A — QATestRun result=Fail → create QAIssue (no-dup check via root_cause_key)
 *   B — QAIssue status=Resolved → create Retest run + clone steps
 *   C — QATestRun create/update → recalculate QAReleaseStatus
 *   D — QATestRun create → clone QATestCaseSteps into QATestRunSteps
 * Also handles direct admin action calls: { action: "recalculate" | "clone_steps" }
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const BILLING_IDS    = ['QA-012','QA-013','QA-014','QA-015'];
const SECURITY_IDS   = ['QA-002','QA-003','QA-004','QA-038','QA-039'];
const CONTENT_IDS    = ['QA-017','QA-018','QA-019','QA-020','QA-021','QA-022','QA-023'];
const HEALTH_IDS     = ['QA-036','QA-037'];
const SALE_GATES     = ['QA-008','QA-010','QA-013','QA-038','QA-039'];

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const body = await req.json().catch(() => ({}));

  // ── Direct admin action calls ─────────────────────────────────────────────
  if (body.action) {
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }
    if (body.action === 'recalculate') {
      await recalculateReleaseStatus(base44);
      return Response.json({ success: true, action: 'recalculate' });
    }
    if (body.action === 'clone_steps') {
      const count = await cloneStepsForRun(base44, body.test_run_id, body.test_case_id);
      return Response.json({ success: true, cloned: count });
    }
    return Response.json({ error: 'Unknown action' }, { status: 400 });
  }

  // ── Entity webhook automations ────────────────────────────────────────────
  const { event, data, old_data } = body;
  if (!event || !data) {
    return Response.json({ error: 'Invalid automation payload' }, { status: 400 });
  }

  const { type, entity_name, entity_id } = event;
  const results = [];

  if (entity_name === 'QATestRuns' && (type === 'create' || type === 'update')) {
    // Automation D: clone step templates when run is first created
    if (type === 'create' && data.test_case_id) {
      const count = await cloneStepsForRun(base44, entity_id, data.test_case_id);
      results.push(`D: cloned ${count} steps for run ${entity_id}`);
    }

    // Automation A: create issue when result becomes Fail
    const nowFail = data.result === 'Fail' && (type === 'create' || old_data?.result !== 'Fail');
    if (nowFail && data.test_case_id) {
      const issueId = await maybeCreateIssue(base44, entity_id, data);
      if (issueId) results.push(`A: created issue ${issueId}`);
    }

    // Automation C: recalculate release status
    await recalculateReleaseStatus(base44);
    results.push('C: release status recalculated');
  }

  if (entity_name === 'QAIssues' && type === 'update') {
    // Automation B: create retest run when issue is resolved
    const resolvedNow = data.status === 'Resolved' && old_data?.status !== 'Resolved';
    if (resolvedNow && data.linked_test_case_id) {
      const runId = await createRetestRun(base44, entity_id, data);
      if (runId) results.push(`B: created retest run ${runId}`);
    }
    // Automation C: recalculate
    await recalculateReleaseStatus(base44);
    results.push('C: release status recalculated');
  }

  return Response.json({ success: true, results });
});

// ── Automation D: clone templates ─────────────────────────────────────────
async function cloneStepsForRun(base44, testRunId, testCaseId) {
  const existing = await base44.asServiceRole.entities.QATestRunSteps.filter({ test_run_id: testRunId });
  if (existing.length > 0) return 0;

  const templates = await base44.asServiceRole.entities.QATestCaseSteps.filter({ test_case_id: testCaseId });
  const sorted = [...templates].sort((a, b) => (a.step_number || 0) - (b.step_number || 0));

  for (const t of sorted) {
    await base44.asServiceRole.entities.QATestRunSteps.create({
      test_run_id: testRunId,
      step_template_id: t.id,
      step_number: t.step_number,
      step_name: t.step_name,
      expected_result: t.expected_result || '',
      failure_condition: t.failure_condition || '',
      validation_page: t.validation_page || '',
      status: 'Not Run',
    });
  }
  return sorted.length;
}

// ── Automation A: create issue from fail ──────────────────────────────────
async function maybeCreateIssue(base44, runId, runData) {
  const rootCauseKey = `${runData.test_case_id}_regression`;

  const existing = await base44.asServiceRole.entities.QAIssues.filter({
    linked_test_case_id: runData.test_case_id,
    status: 'Open',
  });
  if (existing.some(i => i.root_cause_key === rootCauseKey)) return null;
  if (existing.length > 0) return null;

  let tc = null;
  try { tc = await base44.asServiceRole.entities.QATestCases.get(runData.test_case_id); } catch(_) {}

  const p = (tc?.priority || 'P1').substring(0, 2);
  const sevMap = { P0: 'Critical', P1: 'High', P2: 'Medium', P3: 'Low' };
  const severity = sevMap[p] || 'High';

  const issue = await base44.asServiceRole.entities.QAIssues.create({
    title: `QA Failure: ${tc?.name || runData.test_case_id}`,
    severity,
    priority: p,
    status: 'Open',
    linked_test_case_id: runData.test_case_id,
    linked_test_run_id: runId,
    page_route: tc?.start_page || '',
    module_tag: tc?.test_group || '',
    issue_type: 'Regression',
    description: 'Auto-created from failed QA test run.',
    expected_behavior: tc?.validation_pages_json ? `Expected validation: ${tc.validation_pages_json}` : '',
    actual_behavior: runData.notes || 'Test failed — see run steps.',
    assigned_to: tc?.owner || '',
    opened_date: new Date().toISOString().split('T')[0],
    root_cause_key: rootCauseKey,
    auto_created: true,
  });

  await base44.asServiceRole.entities.QATestRuns.update(runId, { linked_issue_id: issue.id });
  return issue.id;
}

// ── Automation B: create retest run ──────────────────────────────────────
async function createRetestRun(base44, issueId, issueData) {
  const run = await base44.asServiceRole.entities.QATestRuns.create({
    test_case_id: issueData.linked_test_case_id,
    run_name: `Retest Required — ${issueData.linked_test_case_id}`,
    run_type: 'Retest',
    result: 'Needs Review',
    environment: 'staging',
    started_at: new Date().toISOString(),
    notes: `Auto-created: issue ${issueId} was resolved.`,
  });
  await cloneStepsForRun(base44, run.id, issueData.linked_test_case_id);
  return run.id;
}

// ── Automation C: recalculate QAReleaseStatus ─────────────────────────────
async function recalculateReleaseStatus(base44) {
  const [allTests, allRuns, allIssues] = await Promise.all([
    base44.asServiceRole.entities.QATestCases.list(),
    base44.asServiceRole.entities.QATestRuns.list('-started_at', 2000),
    base44.asServiceRole.entities.QAIssues.filter({ status: 'Open' }),
  ]);

  const releases = await base44.asServiceRole.entities.QAReleaseStatus.list('-last_updated', 1);
  if (!releases.length) return;

  const tcByTestId = Object.fromEntries(allTests.map(t => [t.test_id, t]));

  // Latest run per test case
  const latestByCase = {};
  for (const r of allRuns) {
    if (!latestByCase[r.test_case_id] || r.started_at > latestByCase[r.test_case_id].started_at) {
      latestByCase[r.test_case_id] = r;
    }
  }

  const getResult = (testId) => {
    const tc = tcByTestId[testId];
    return tc ? (latestByCase[tc.id]?.result || 'Not Run') : 'Not Run';
  };

  const calcPassRate = (ids) => {
    const cases = ids.map(id => tcByTestId[id]).filter(Boolean);
    if (!cases.length) return 0;
    return cases.filter(tc => latestByCase[tc.id]?.result === 'Pass').length / cases.length;
  };

  const active = allTests.filter(t => t.is_active !== false);
  const p0 = active.filter(t => (t.priority || '').includes('P0'));
  const p0Rate = p0.length > 0 ? p0.filter(tc => latestByCase[tc.id]?.result === 'Pass').length / p0.length : 0;

  const readinessScore = Math.round(
    p0Rate * 40 +
    calcPassRate(BILLING_IDS) * 20 +
    calcPassRate(SECURITY_IDS) * 15 +
    calcPassRate(CONTENT_IDS) * 15 +
    calcPassRate(HEALTH_IDS) * 10
  );

  const passedTests = active.filter(tc => latestByCase[tc.id]?.result === 'Pass').length;
  const failedTests = active.filter(tc => latestByCase[tc.id]?.result === 'Fail').length;
  const blockedTests = active.filter(tc => latestByCase[tc.id]?.result === 'Blocked').length;

  const criticalOpen = allIssues.filter(i => i.severity === 'Critical');
  const critBilling = criticalOpen.filter(i => i.issue_type === 'Billing Bug');
  const dataIso = allIssues.filter(i => i.issue_type === 'Data Isolation Bug');
  const critSecurity = criticalOpen.filter(i => ['Data Isolation Bug','Permission Bug'].includes(i.issue_type));

  // Must-pass flows
  const mustFlows = await base44.asServiceRole.entities.QAMustPassFlows.filter({ is_active: true }).catch(() => []);
  const mustIds = new Set(mustFlows.flatMap(f => { try { return JSON.parse(f.included_test_ids_json || '[]'); } catch(_) { return []; } }));
  const mustPassTotal = mustIds.size;
  const mustPassPassed = [...mustIds].filter(id => getResult(id) === 'Pass').length;

  // Go-live status
  const saleReady = criticalOpen.length === 0 && critBilling.length === 0 && dataIso.length === 0 &&
    SALE_GATES.every(id => getResult(id) === 'Pass');
  const betaReady = p0.length >= 20 && p0Rate >= 0.8 && critSecurity.length === 0;
  const internalReady = p0Rate >= 0.5 && getResult('QA-001') === 'Pass';
  const atRisk = p0Rate > 0 && !betaReady && !saleReady;

  const go_live_status = saleReady ? 'Ready for Sale' :
    betaReady ? 'Ready for Beta' :
    internalReady ? 'Ready for Internal Use' :
    atRisk ? 'At Risk' : 'Not Ready';

  await base44.asServiceRole.entities.QAReleaseStatus.update(releases[0].id, {
    total_tests: active.length,
    passed_tests: passedTests,
    failed_tests: failedTests,
    blocked_tests: blockedTests,
    critical_failures: criticalOpen.length,
    high_failures: allIssues.filter(i => i.severity === 'High').length,
    must_pass_total: mustPassTotal,
    must_pass_passed: mustPassPassed,
    readiness_score: readinessScore,
    go_live_status,
    last_regression_run_at: allRuns[0]?.started_at || null,
    last_updated: new Date().toISOString(),
  });

  console.log(`[qaAutomations] Release: ${go_live_status} | Score: ${readinessScore} | P0: ${Math.round(p0Rate*100)}%`);
}
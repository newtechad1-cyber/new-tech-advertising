import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Expected run intervals per trigger_category (hours). Adjust as needed.
const EXPECTED_INTERVALS = {
  lifecycle: 24,
  retention: 24,
  sales_signals: 12,
  billing: 24,
  pipeline: 12,
};

const DEFAULT_INTERVAL_HOURS = 48;

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Allow scheduled (no user) or admin-triggered
  let user = null;
  try { user = await base44.auth.me(); } catch (_) {}
  if (user && user.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const rules = await base44.asServiceRole.entities.AutomationRule.list('-last_executed_at');
  const logs = await base44.asServiceRole.entities.AutomationRuleLog.list('-created_date', 500);

  const now = new Date();
  const newAlerts = [];
  const skipped = [];

  for (const rule of rules) {
    if (!rule.is_active) continue;

    // ── Check 1: Repeated failures (2+ consecutive failures) ──────────────────
    const ruleLogs = logs
      .filter(l => l.rule_id === rule.id)
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

    let consecutiveFails = 0;
    for (const log of ruleLogs) {
      if (log.status === 'failed') consecutiveFails++;
      else break;
    }

    if (consecutiveFails >= 2) {
      // Check if open alert already exists for this rule + type
      const existing = await base44.asServiceRole.entities.AutomationFailureAlert.filter({
        rule_id: rule.id,
        alert_type: 'repeated_failures',
        status: 'open',
      });

      if (!existing || existing.length === 0) {
        const alert = await base44.asServiceRole.entities.AutomationFailureAlert.create({
          rule_id: rule.id,
          rule_name: rule.rule_name,
          alert_type: 'repeated_failures',
          failure_count: consecutiveFails,
          last_run_at: rule.last_executed_at || null,
          status: 'open',
          notification_sent: false,
          details: `"${rule.rule_name}" has failed ${consecutiveFails} consecutive times.`,
        });

        // Send internal notification email
        try {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: 'rick@newtechadvertising.com',
            subject: `🚨 Automation Alert: "${rule.rule_name}" failed ${consecutiveFails}x`,
            body: `<p>The automation rule <strong>${rule.rule_name}</strong> has failed <strong>${consecutiveFails} consecutive times</strong>.</p>
<p>Category: ${rule.trigger_category}<br/>Event: ${rule.trigger_event}</p>
<p>Please check the Automation Command Center for details.</p>`,
          });
          await base44.asServiceRole.entities.AutomationFailureAlert.update(alert.id, { notification_sent: true });
        } catch (_) {}

        newAlerts.push({ type: 'repeated_failures', rule: rule.rule_name });
      } else {
        skipped.push({ rule: rule.rule_name, reason: 'open alert exists (failures)' });
      }
    }

    // ── Check 2: Overdue run ───────────────────────────────────────────────────
    if (rule.last_executed_at) {
      const expectedHours = EXPECTED_INTERVALS[rule.trigger_category] || DEFAULT_INTERVAL_HOURS;
      const lastRun = new Date(rule.last_executed_at);
      const hoursElapsed = (now - lastRun) / (1000 * 60 * 60);

      if (hoursElapsed > expectedHours) {
        const hoursOverdue = Math.round(hoursElapsed - expectedHours);

        const existing = await base44.asServiceRole.entities.AutomationFailureAlert.filter({
          rule_id: rule.id,
          alert_type: 'overdue_run',
          status: 'open',
        });

        if (!existing || existing.length === 0) {
          const alert = await base44.asServiceRole.entities.AutomationFailureAlert.create({
            rule_id: rule.id,
            rule_name: rule.rule_name,
            alert_type: 'overdue_run',
            last_run_at: rule.last_executed_at,
            expected_interval_hours: expectedHours,
            hours_overdue: hoursOverdue,
            status: 'open',
            notification_sent: false,
            details: `"${rule.rule_name}" is ${hoursOverdue}h overdue (expected every ${expectedHours}h).`,
          });

          try {
            await base44.asServiceRole.integrations.Core.SendEmail({
              to: 'rick@newtechadvertising.com',
              subject: `⚠️ Automation Overdue: "${rule.rule_name}" is ${hoursOverdue}h late`,
              body: `<p>The automation rule <strong>${rule.rule_name}</strong> has not run in <strong>${Math.round(hoursElapsed)} hours</strong> (expected every ${expectedHours}h).</p>
<p>Category: ${rule.trigger_category}<br/>Last run: ${new Date(rule.last_executed_at).toLocaleString()}</p>
<p>Please check the Automation Command Center for details.</p>`,
            });
            await base44.asServiceRole.entities.AutomationFailureAlert.update(alert.id, { notification_sent: true });
          } catch (_) {}

          newAlerts.push({ type: 'overdue_run', rule: rule.rule_name, hoursOverdue });
        } else {
          skipped.push({ rule: rule.rule_name, reason: 'open alert exists (overdue)' });
        }
      }
    }
  }

  return Response.json({
    checked: rules.length,
    new_alerts: newAlerts.length,
    alerts: newAlerts,
    skipped: skipped.length,
  });
});
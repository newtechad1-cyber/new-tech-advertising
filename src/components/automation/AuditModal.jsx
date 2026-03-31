import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  X, CheckCircle, XCircle, AlertTriangle, Loader2,
  ShieldCheck, Link2, Database, Code2, ArrowRight,
  FileText, Wrench, ExternalLink
} from 'lucide-react';

const VALID_TRIGGER_EVENTS = [
  'user_signup','onboarding_complete','first_milestone','inactivity_detected',
  'momentum_drop','upgrade_readiness_high','leads_logged','payment_failed',
  'subscription_cancelled','discovery_done','proposal_not_viewed','deal_won',
  'engagement_increase','growth_score_milestone'
];

const VALID_ACTION_TYPES = [
  'send_email','show_modal','send_notification','create_record',
  'update_record','flag_entity','trigger_workflow','update_dashboard'
];

const VALID_CATEGORIES = ['lifecycle','retention','sales_signals','billing','pipeline'];

function CheckRow({ label, status, detail, fix, onFix }) {
  const cfg = {
    pass:    { icon: CheckCircle,    cls: 'text-green-400',  bg: 'border-green-800/40',  label: 'PASS' },
    fail:    { icon: XCircle,        cls: 'text-red-400',    bg: 'border-red-800/40',    label: 'FAIL' },
    warn:    { icon: AlertTriangle,  cls: 'text-yellow-400', bg: 'border-yellow-800/40', label: 'WARN' },
    loading: { icon: Loader2,        cls: 'text-slate-400 animate-spin', bg: 'border-slate-700', label: '...' },
  }[status];
  const Icon = cfg.icon;

  return (
    <div className={`flex items-start gap-3 border rounded-xl p-4 ${cfg.bg} bg-slate-900/60`}>
      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.cls}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-white text-sm font-semibold">{label}</span>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${cfg.cls} bg-current/10`}>{cfg.label}</span>
        </div>
        {detail && <p className="text-slate-400 text-xs leading-relaxed">{detail}</p>}
        {fix && status !== 'pass' && onFix && (
          <button
            onClick={onFix}
            className="mt-2 flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300 transition"
          >
            <Wrench className="w-3 h-3" /> {fix}
          </button>
        )}
      </div>
    </div>
  );
}

function tryParseJSON(str) {
  if (!str) return null;
  try { return JSON.parse(str); } catch { return null; }
}

export default function AuditModal({ rule, logs, onClose, onRuleUpdate }) {
  const [checks, setChecks] = useState([]);
  const [running, setRunning] = useState(true);
  const [fixing, setFixing] = useState(false);

  const ruleLogs = logs.filter(l => l.rule_id === rule.id).slice(0, 20);
  const latestLog = ruleLogs[0] || null;

  useEffect(() => { runAudit(); }, []);

  const runAudit = () => {
    setRunning(true);
    const results = [];

    // ── 1. Trigger Entity ────────────────────────────────────────────────────
    const validEvent = VALID_TRIGGER_EVENTS.includes(rule.trigger_event);
    const validCat   = VALID_CATEGORIES.includes(rule.trigger_category);
    results.push({
      id: 'trigger_entity',
      label: '1. Trigger Entity',
      status: validEvent && validCat ? 'pass' : 'fail',
      detail: validEvent && validCat
        ? `Trigger event "${rule.trigger_event}" is valid in category "${rule.trigger_category}".`
        : `Invalid trigger_event: "${rule.trigger_event || '(empty)'}" or trigger_category: "${rule.trigger_category || '(empty)'}". Must match schema enums.`,
      fixLabel: 'Review trigger_event and trigger_category fields',
    });

    // ── 2. Trigger Conditions ────────────────────────────────────────────────
    let condStatus = 'pass';
    let condDetail = 'No trigger_condition set — rule fires on every matching event.';
    if (rule.trigger_condition) {
      const parsed = tryParseJSON(rule.trigger_condition);
      if (!parsed) {
        condStatus = 'fail';
        condDetail = `trigger_condition is not valid JSON: "${rule.trigger_condition.slice(0, 80)}"`;
      } else {
        condDetail = `Condition JSON is valid. Keys: ${Object.keys(parsed).join(', ')}.`;
      }
    }
    results.push({
      id: 'trigger_conditions',
      label: '2. Trigger Conditions',
      status: condStatus,
      detail: condDetail,
    });

    // ── 3. Function / Action Call ────────────────────────────────────────────
    const validAction = VALID_ACTION_TYPES.includes(rule.action_type);
    const hasTarget   = !!rule.action_target?.trim();
    results.push({
      id: 'function_call',
      label: '3. Action / Function Call',
      status: validAction && hasTarget ? 'pass' : 'fail',
      detail: validAction && hasTarget
        ? `Action type "${rule.action_type}" → target "${rule.action_target}".`
        : `${!validAction ? `Invalid action_type "${rule.action_type || '(empty)'}". ` : ''}${!hasTarget ? 'action_target is empty.' : ''}`,
      fixLabel: 'Fix action_type or action_target',
    });

    // ── 4. Data Input / Payload ──────────────────────────────────────────────
    let payloadStatus = 'warn';
    let payloadDetail = 'No action_payload defined — function may use defaults.';
    if (rule.action_payload) {
      const parsed = tryParseJSON(rule.action_payload);
      if (!parsed) {
        payloadStatus = 'fail';
        payloadDetail = `action_payload is not valid JSON: "${rule.action_payload.slice(0, 80)}"`;
      } else {
        const keys = Object.keys(parsed);
        payloadStatus = 'pass';
        payloadDetail = `Payload is valid JSON with ${keys.length} field(s): ${keys.join(', ')}.`;
      }
    }
    results.push({
      id: 'data_input',
      label: '4. Data Input / Payload',
      status: payloadStatus,
      detail: payloadDetail,
      fixLabel: 'Set valid JSON in action_payload',
    });

    // ── 5. Output ────────────────────────────────────────────────────────────
    const outputTarget = rule.action_target;
    const outputType   = rule.action_type;
    const producesRecord = ['create_record', 'update_record', 'flag_entity'].includes(outputType);
    results.push({
      id: 'output',
      label: '5. Output Destination',
      status: outputTarget ? 'pass' : 'warn',
      detail: outputTarget
        ? `Output directed to "${outputTarget}" via action "${outputType}". ${producesRecord ? 'Creates/updates entity records.' : 'No records produced by this action type.'}`
        : 'action_target is empty — output destination unknown.',
      outputLink: producesRecord && outputTarget ? `/Admin${outputTarget}` : null,
    });

    // ── 6. Error Handling ────────────────────────────────────────────────────
    const hasError = !!latestLog?.error_message;
    const failCount = rule.failure_count || 0;
    results.push({
      id: 'error_handling',
      label: '6. Error Handling',
      status: hasError ? 'fail' : failCount > 0 ? 'warn' : 'pass',
      detail: hasError
        ? `Last error: ${latestLog.error_message}`
        : failCount > 0
        ? `${failCount} total failures recorded but no error message captured on latest log.`
        : 'No errors detected in run history.',
      errorMessage: latestLog?.error_message,
    });

    // ── 7. Logging ───────────────────────────────────────────────────────────
    const totalRuns = rule.execution_count || 0;
    const hasLogs   = ruleLogs.length > 0;
    results.push({
      id: 'logging',
      label: '7. Run Logging',
      status: totalRuns > 0 && hasLogs ? 'pass' : totalRuns > 0 ? 'warn' : 'never' in rule ? 'never' : 'warn',
      detail: hasLogs
        ? `${ruleLogs.length} log entries found. Latest: ${new Date(ruleLogs[0].created_date).toLocaleString()}. Successes: ${rule.success_count || 0}, Failures: ${failCount}.`
        : totalRuns > 0
        ? `${totalRuns} executions recorded on rule but no AutomationRuleLog entries found. Logging may not be wired up.`
        : 'No runs recorded. Rule has never been triggered.',
    });

    setChecks(results);
    setRunning(false);
  };

  const overallStatus = running ? 'auditing' :
    checks.some(c => c.status === 'fail') ? 'fail' :
    checks.some(c => c.status === 'warn') ? 'warn' : 'pass';

  const handleFixLastError = async () => {
    if (!latestLog?.error_message) return;
    setFixing(true);
    try {
      await base44.entities.AutomationRule.update(rule.id, {
        last_run_result: 'failed',
        automation_status: 'Failed',
        notes: (rule.notes || '') + `\n[Audit ${new Date().toLocaleDateString()}] Last error: ${latestLog.error_message}`,
      });
      onRuleUpdate?.();
    } catch (_) {}
    setFixing(false);
  };

  const overallCfg = {
    auditing: { label: 'Running Audit…',  cls: 'bg-slate-700 text-slate-300' },
    pass:     { label: 'All Checks Passed', cls: 'bg-green-900/40 text-green-400 border border-green-700' },
    warn:     { label: 'Warnings Found',   cls: 'bg-yellow-900/40 text-yellow-400 border border-yellow-700' },
    fail:     { label: 'Issues Found',     cls: 'bg-red-900/40 text-red-400 border border-red-700' },
  }[overallStatus];

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-start gap-3">
            <div className="bg-orange-500/20 p-2 rounded-lg mt-0.5">
              <ShieldCheck className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-0.5">Automation Audit</p>
              <h2 className="font-bold text-white text-lg leading-tight">{rule.rule_name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-slate-500">{rule.trigger_event}</span>
                <span className="text-slate-700">·</span>
                <span className="text-xs text-slate-500">{rule.trigger_category}</span>
                <span className="text-slate-700">·</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${overallCfg.cls}`}>
                  {overallCfg.label}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-3">
          {running ? (
            <div className="flex items-center justify-center py-16 text-slate-500 gap-3">
              <Loader2 className="w-5 h-5 animate-spin" /> Running audit checks…
            </div>
          ) : (
            checks.map(check => (
              <CheckRow
                key={check.id}
                label={check.label}
                status={check.status === 'never' ? 'warn' : check.status}
                detail={check.detail}
                fix={check.fixLabel}
                onFix={check.id === 'error_handling' ? handleFixLastError : null}
              />
            ))
          )}

          {/* Log summary table */}
          {!running && ruleLogs.length > 0 && (
            <div className="mt-4">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Recent Runs</p>
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900">
                      <th className="text-left text-slate-500 px-4 py-2 font-semibold">Timestamp</th>
                      <th className="text-left text-slate-500 px-4 py-2 font-semibold">Result</th>
                      <th className="text-left text-slate-500 px-4 py-2 font-semibold">Processed</th>
                      <th className="text-left text-slate-500 px-4 py-2 font-semibold">Created</th>
                      <th className="text-left text-slate-500 px-4 py-2 font-semibold">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ruleLogs.slice(0, 8).map((log, i) => (
                      <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="px-4 py-2 text-slate-400">{log.created_date ? new Date(log.created_date).toLocaleString() : '—'}</td>
                        <td className="px-4 py-2">
                          <span className={`font-bold ${log.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>{log.status}</span>
                        </td>
                        <td className="px-4 py-2 text-slate-300 font-mono">{log.records_processed ?? '—'}</td>
                        <td className="px-4 py-2 text-slate-300 font-mono">{log.records_created ?? '—'}</td>
                        <td className="px-4 py-2 text-red-400 truncate max-w-[160px]" title={log.error_message}>
                          {log.error_message ? log.error_message.slice(0, 40) + (log.error_message.length > 40 ? '…' : '') : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Output links */}
          {!running && (() => {
            const out = checks.find(c => c.id === 'output');
            return out?.outputLink ? (
              <a
                href={out.outputLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-semibold mt-2 transition"
              >
                <ExternalLink className="w-4 h-4" /> View Output Records → {out.outputLink}
              </a>
            ) : null;
          })()}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={runAudit}
            className="flex items-center gap-2 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <ShieldCheck className="w-4 h-4" /> Re-run Audit
          </button>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-5 py-2 rounded-lg text-sm transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import QANav from '@/components/qa/QANav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2, XCircle, Clock, ShieldCheck, ShieldX, ShieldAlert, AlertTriangle, Plus, Info } from 'lucide-react';
import { createPageUrl } from '@/utils';

const GO_LIVE = {
  go:          { label: 'GO',          icon: ShieldCheck,  bg: 'bg-green-600',  text: 'text-white', border: 'border-green-700',  desc: 'All critical tests passing. Ready to launch.' },
  no_go:       { label: 'NO-GO',       icon: ShieldX,      bg: 'bg-red-600',    text: 'text-white', border: 'border-red-700',    desc: 'Critical failures or blockers prevent launch.' },
  conditional: { label: 'CONDITIONAL', icon: ShieldAlert,  bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-600', desc: 'Passing with known risk. Review blockers before launch.' },
  pending:     { label: 'PENDING',     icon: Clock,        bg: 'bg-gray-200',   text: 'text-gray-800', border: 'border-gray-300', desc: 'Testing in progress. Decision not yet made.' },
};

// Canonical pinned must-pass flows keyed by test_id
const PINNED_FLOWS = [
  {
    label: 'Revenue Acquisition',
    color: 'blue',
    ids: ['QA-005','QA-006','QA-008','QA-010','QA-012','QA-013'],
  },
  {
    label: 'Billing Protection',
    color: 'red',
    ids: ['QA-014','QA-015'],
  },
  {
    label: 'Onboarding & Fulfillment',
    color: 'purple',
    ids: ['QA-017','QA-018','QA-019','QA-020','QA-021','QA-022','QA-023'],
  },
  {
    label: 'Reseller Scale',
    color: 'orange',
    ids: ['QA-030','QA-031','QA-032'],
  },
  {
    label: 'Safety Isolation',
    color: 'slate',
    ids: ['QA-002','QA-003','QA-004','QA-036','QA-037','QA-038','QA-039'],
  },
];

const FLOW_COLORS = {
  blue:   { header: 'bg-blue-50 border-blue-200', badge: 'bg-blue-600 text-white', bar: 'bg-blue-500', text: 'text-blue-700' },
  red:    { header: 'bg-red-50 border-red-200',   badge: 'bg-red-600 text-white',   bar: 'bg-red-500',  text: 'text-red-700' },
  purple: { header: 'bg-purple-50 border-purple-200', badge: 'bg-purple-600 text-white', bar: 'bg-purple-500', text: 'text-purple-700' },
  orange: { header: 'bg-orange-50 border-orange-200', badge: 'bg-orange-500 text-white', bar: 'bg-orange-500', text: 'text-orange-700' },
  slate:  { header: 'bg-slate-50 border-slate-200',   badge: 'bg-slate-700 text-white',   bar: 'bg-slate-600',  text: 'text-slate-700' },
};

// Readiness gate rules
const READINESS_RULES = {
  'Ready for Sale': [
    { id: 'no-critical-open',           label: 'Zero open Critical issues' },
    { id: 'no-critical-billing',        label: 'Zero open Critical Billing Bug issues' },
    { id: 'no-data-isolation',          label: 'Zero open Data Isolation Bug issues' },
    { id: 'signup-passing',             label: 'Signup flow passing (QA-010)' },
    { id: 'closed-won-passing',         label: 'Closed Won flow passing (QA-008)' },
    { id: 'invoice-paid-passing',       label: 'Invoice Paid flow passing (QA-013)' },
    { id: 'client-isolation-passing',   label: 'Client data isolation passing (QA-038)' },
    { id: 'reseller-isolation-passing', label: 'Reseller isolation passing (QA-039)' },
  ],
  'Ready for Beta': [
    { id: 'all-p0-exist',               label: 'All P0 test cases exist in system' },
    { id: 'p0-80pct-passing',           label: 'At least 80% of P0 tests passing' },
    { id: 'no-critical-security',       label: 'Zero open Critical security / access control issues' },
  ],
};

function evaluateRule(ruleId, issues, runs, testCases) {
  const latestByCase = {};
  for (const r of runs) {
    if (!latestByCase[r.test_case_id] || r.started_at > latestByCase[r.test_case_id].started_at) {
      latestByCase[r.test_case_id] = r;
    }
  }
  const tcByTestId = Object.fromEntries(testCases.map(t => [t.test_id, t]));

  const getLatestResult = (testId) => {
    const tc = tcByTestId[testId];
    if (!tc) return null;
    return latestByCase[tc.id]?.result || null;
  };

  const openIssues = issues.filter(i => i.status === 'open');

  switch (ruleId) {
    case 'no-critical-open':
      return openIssues.filter(i => i.severity === 'critical').length === 0;
    case 'no-critical-billing':
      return openIssues.filter(i => i.severity === 'critical' && i.issue_type === 'Billing Bug').length === 0;
    case 'no-data-isolation':
      return openIssues.filter(i => i.issue_type === 'Data Isolation Bug').length === 0;
    case 'signup-passing':
      return getLatestResult('QA-010') === 'pass';
    case 'closed-won-passing':
      return getLatestResult('QA-008') === 'pass';
    case 'invoice-paid-passing':
      return getLatestResult('QA-013') === 'pass';
    case 'client-isolation-passing':
      return getLatestResult('QA-038') === 'pass';
    case 'reseller-isolation-passing':
      return getLatestResult('QA-039') === 'pass';
    case 'all-p0-exist':
      return testCases.filter(t => t.priority === 'P0' && t.is_active).length >= 21;
    case 'p0-80pct-passing': {
      const p0cases = testCases.filter(t => t.priority === 'P0' && t.is_active);
      const p0passing = p0cases.filter(tc => latestByCase[tc.id]?.result === 'pass').length;
      return p0cases.length > 0 && (p0passing / p0cases.length) >= 0.8;
    }
    case 'no-critical-security':
      return openIssues.filter(i => i.severity === 'critical' && (i.issue_type === 'Permission Bug' || i.issue_type === 'Data Isolation Bug' || i.issue_type === 'access_control')).length === 0;
    default:
      return null;
  }
}

function ReleaseModal({ release, onClose, onSave }) {
  const isNew = !release?.id;
  const [form, setForm] = useState(release || { release_name: '', build_version: '', go_live_status: 'pending', notes: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <DialogContent className="max-w-md">
      <DialogHeader><DialogTitle>{isNew ? 'New Release' : 'Edit Release'}</DialogTitle></DialogHeader>
      <div className="space-y-3 text-sm">
        <div><label className="text-xs text-gray-400 uppercase mb-1 block">Release Name</label><Input value={form.release_name} onChange={e => set('release_name', e.target.value)} placeholder="v1.0 Launch" /></div>
        <div><label className="text-xs text-gray-400 uppercase mb-1 block">Build Version</label><Input value={form.build_version || ''} onChange={e => set('build_version', e.target.value)} placeholder="0.1.0" /></div>
        <div><label className="text-xs text-gray-400 uppercase mb-1 block">Go-Live Decision</label>
          <Select value={form.go_live_status} onValueChange={v => set('go_live_status', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{Object.keys(GO_LIVE).map(k => <SelectItem key={k} value={k}>{GO_LIVE[k].label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><label className="text-xs text-gray-400 uppercase mb-1 block">Notes</label><textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)} className="w-full border rounded px-3 py-2 text-sm min-h-[60px] resize-none focus:outline-none focus:ring-1 focus:ring-blue-400" /></div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(form)}>Save</Button>
        </div>
      </div>
    </DialogContent>
  );
}

export default function AdminQAReadiness() {
  const qc = useQueryClient();
  const [releaseModal, setReleaseModal] = useState(null);

  const { data: releases = [] } = useQuery({ queryKey: ['QAReleaseStatus'], queryFn: () => base44.entities.QAReleaseStatus.list('-last_updated') });
  const { data: issues = [] } = useQuery({ queryKey: ['QAIssues'], queryFn: () => base44.entities.QAIssues.list('-opened_date') });
  const { data: runs = [] } = useQuery({ queryKey: ['QATestRuns'], queryFn: () => base44.entities.QATestRuns.list('-started_at', 500) });
  const { data: testCases = [] } = useQuery({ queryKey: ['QATestCases'], queryFn: () => base44.entities.QATestCases.list() });

  const saveRelease = useMutation({
    mutationFn: form => form.id
      ? base44.entities.QAReleaseStatus.update(form.id, { ...form, last_updated: new Date().toISOString() })
      : base44.entities.QAReleaseStatus.create({ ...form, last_updated: new Date().toISOString() }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['QAReleaseStatus'] }); setReleaseModal(null); },
  });

  const latest = releases[0];
  const goLiveCfg = GO_LIVE[latest?.go_live_status || 'pending'];
  const GoLiveIcon = goLiveCfg.icon;

  const blockers = issues.filter(i => i.status === 'open' && (i.priority === 'blocker' || i.severity === 'critical'));
  const openHigh = issues.filter(i => i.status === 'open' && i.severity === 'high');

  // Latest run per test case lookup
  const latestByCase = {};
  for (const r of runs) {
    if (!latestByCase[r.test_case_id] || r.started_at > latestByCase[r.test_case_id].started_at) {
      latestByCase[r.test_case_id] = r;
    }
  }
  const tcByTestId = Object.fromEntries(testCases.map(t => [t.test_id, t]));

  // Pinned flow health
  const flowData = PINNED_FLOWS.map(flow => {
    const cases = flow.ids.map(id => tcByTestId[id]).filter(Boolean);
    const results = cases.map(tc => latestByCase[tc.id]?.result || 'untested');
    const passing = results.filter(r => r === 'pass').length;
    const failing = results.filter(r => r === 'fail').length;
    const untested = results.filter(r => r === 'untested').length;
    const allPass = failing === 0 && untested === 0 && passing === cases.length;
    const pct = cases.length ? Math.round((passing / cases.length) * 100) : 0;
    return { ...flow, cases, results, passing, failing, untested, allPass, pct };
  });

  // Readiness rule evaluation
  const ruleResults = {};
  for (const [gate, rules] of Object.entries(READINESS_RULES)) {
    ruleResults[gate] = rules.map(rule => ({
      ...rule,
      pass: evaluateRule(rule.id, issues, runs, testCases),
    }));
  }

  // Scores
  const passCount = runs.filter(r => r.result === 'pass').length;
  const failCount = runs.filter(r => r.result === 'fail').length;
  const totalRuns = passCount + failCount;
  const readinessScore = totalRuns ? Math.round((passCount / totalRuns) * 100) : 0;
  const p0Cases = testCases.filter(t => t.priority === 'P0' && t.is_active);
  const p0Passing = p0Cases.filter(tc => latestByCase[tc.id]?.result === 'pass').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <QANav current="AdminQAReadiness" />
      <div className="max-w-7xl mx-auto px-6 pb-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Release Readiness</h1>
            <p className="text-sm text-gray-400">Go / No-Go decision dashboard for NTA platform launch</p>
          </div>
          <Button onClick={() => setReleaseModal({})} className="gap-2"><Plus className="w-4 h-4" /> New Release</Button>
        </div>

        {/* Go-Live Banner */}
        {latest && (
          <div className={`rounded-xl border p-5 mb-6 flex items-center gap-4 ${goLiveCfg.bg} ${goLiveCfg.border} ${goLiveCfg.text}`}>
            <GoLiveIcon className="w-10 h-10 shrink-0" />
            <div className="flex-1">
              <p className="text-2xl font-black tracking-tight">{latest.release_name} — {goLiveCfg.label}</p>
              <p className="opacity-80 text-sm">{goLiveCfg.desc}</p>
              {latest.notes && <p className="opacity-70 text-xs mt-1 italic">{latest.notes}</p>}
            </div>
            <div className="text-right shrink-0 text-sm">
              <p className="text-xs opacity-60">Build</p>
              <p className="font-bold">{latest.build_version || 'unversioned'}</p>
              <p className="text-xs opacity-60 mt-1">Updated {latest.last_updated ? new Date(latest.last_updated).toLocaleDateString() : '—'}</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0 bg-white/20 border-white/40 hover:bg-white/30" onClick={() => setReleaseModal(latest)}>Edit</Button>
          </div>
        )}

        {/* Score Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Readiness Score', value: `${readinessScore}%`, color: readinessScore >= 80 ? 'text-green-600' : readinessScore >= 50 ? 'text-orange-600' : 'text-red-600' },
            { label: 'P0 Tests Passing', value: `${p0Passing}/${p0Cases.length}`, color: p0Passing === p0Cases.length && p0Cases.length > 0 ? 'text-green-600' : p0Passing > 0 ? 'text-orange-600' : 'text-red-600' },
            { label: 'Critical Blockers', value: blockers.length, color: blockers.length > 0 ? 'text-red-600' : 'text-green-600' },
            { label: 'High Issues', value: openHigh.length, color: openHigh.length > 3 ? 'text-orange-600' : 'text-gray-700' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Pinned Must-Pass Flows */}
        <h2 className="text-base font-semibold text-gray-800 mb-3">Must-Pass Flows</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
          {flowData.map(flow => {
            const colors = FLOW_COLORS[flow.color];
            return (
              <div key={flow.label} className={`bg-white rounded-xl border overflow-hidden`}>
                <div className={`px-4 py-2.5 border-b flex items-center justify-between ${colors.header}`}>
                  <span className={`text-sm font-semibold ${colors.text}`}>{flow.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>{flow.pct}%</span>
                </div>
                <div className="px-4 py-3">
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                    <div className={`h-1.5 rounded-full transition-all ${colors.bar}`} style={{ width: `${flow.pct}%` }} />
                  </div>
                  <div className="space-y-1">
                    {flow.cases.map((tc, i) => {
                      const result = flow.results[i];
                      return (
                        <div key={tc.id} className="flex items-center gap-2">
                          {result === 'pass'    && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />}
                          {result === 'fail'    && <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                          {result === 'untested'&& <Clock className="w-3.5 h-3.5 text-gray-300 shrink-0" />}
                          {result === 'blocked' && <AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0" />}
                          <span className="text-xs font-mono text-gray-400 w-12 shrink-0">{tc.test_id}</span>
                          <span className="text-xs text-gray-700 truncate">{tc.name}</span>
                        </div>
                      );
                    })}
                  </div>
                  {flow.untested > 0 && (
                    <p className="text-xs text-gray-400 mt-2">{flow.untested} untested · run these cases to unlock status</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Readiness Gate Rules */}
        <h2 className="text-base font-semibold text-gray-800 mb-3">Readiness Gate Checklist</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {Object.entries(ruleResults).map(([gate, rules]) => {
            const passing = rules.filter(r => r.pass === true).length;
            const allPass = passing === rules.length;
            return (
              <div key={gate} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className={`px-4 py-3 border-b flex items-center justify-between ${allPass ? 'bg-green-50 border-green-100' : 'bg-white'}`}>
                  <div className="flex items-center gap-2">
                    {allPass
                      ? <ShieldCheck className="w-5 h-5 text-green-600" />
                      : <ShieldX className="w-5 h-5 text-red-500" />
                    }
                    <span className="font-semibold text-gray-800">{gate}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${allPass ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {passing}/{rules.length}
                  </span>
                </div>
                <div className="divide-y divide-gray-50">
                  {rules.map(rule => (
                    <div key={rule.id} className="px-4 py-2.5 flex items-center gap-3">
                      {rule.pass === true  && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />}
                      {rule.pass === false && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                      {rule.pass === null  && <Clock className="w-4 h-4 text-gray-300 shrink-0" />}
                      <span className={`text-sm ${rule.pass === false ? 'text-red-700 font-medium' : rule.pass ? 'text-gray-500' : 'text-gray-400'}`}>
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Blocker List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-800">Launch Blockers</h2>
                <p className="text-xs text-gray-400">Must resolve before Go-Live decision</p>
              </div>
              <a href={createPageUrl('AdminQAIssues')} className="text-xs text-blue-500 hover:underline">Manage →</a>
            </div>
            {blockers.length === 0 ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No blockers — critical path is clear</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {blockers.map(issue => (
                  <div key={issue.id} className="px-4 py-3 flex items-start gap-3">
                    <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${issue.severity === 'critical' ? 'text-red-600' : 'text-orange-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{issue.title}</p>
                      <div className="flex gap-2 mt-0.5">
                        {issue.page_route && <span className="text-xs font-mono text-blue-600 bg-blue-50 px-1 rounded">{issue.page_route}</span>}
                        <span className="text-xs text-gray-400">{issue.issue_type}</span>
                      </div>
                    </div>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0 ${issue.priority === 'blocker' ? 'bg-red-700 text-white' : 'bg-red-100 text-red-700'}`}>
                      {issue.priority === 'blocker' ? 'BLOCKER' : issue.severity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Release History */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Release History</h2>
            </div>
            {releases.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">No releases created yet</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {releases.map(rel => {
                  const cfg = GO_LIVE[rel.go_live_status || 'pending'];
                  const Icon = cfg.icon;
                  return (
                    <div key={rel.id} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer" onClick={() => setReleaseModal(rel)}>
                      <Icon className={`w-4 h-4 shrink-0 ${rel.go_live_status === 'go' ? 'text-green-600' : rel.go_live_status === 'no_go' ? 'text-red-600' : 'text-orange-500'}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{rel.release_name}</p>
                        <p className="text-xs text-gray-400">Build {rel.build_version || '—'} · {rel.last_updated ? new Date(rel.last_updated).toLocaleDateString() : '—'}</p>
                      </div>
                      <div className="flex gap-3 text-xs text-gray-400 hidden md:flex">
                        <span className="text-green-600">{rel.passed_tests ?? 0} pass</span>
                        <span className="text-red-600">{rel.failed_tests ?? 0} fail</span>
                        <span>{rel.blocked_tests ?? 0} blocked</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {releaseModal !== null && (
        <Dialog open onOpenChange={() => setReleaseModal(null)}>
          <ReleaseModal release={releaseModal?.id ? releaseModal : null} onClose={() => setReleaseModal(null)} onSave={form => saveRelease.mutate(form)} />
        </Dialog>
      )}
    </div>
  );
}
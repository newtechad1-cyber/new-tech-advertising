import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import QANav from '@/components/qa/QANav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2, XCircle, Clock, ShieldCheck, ShieldX, ShieldAlert, AlertTriangle, Plus } from 'lucide-react';
import { createPageUrl } from '@/utils';

const GO_LIVE = {
  go:          { label: 'GO', icon: ShieldCheck, bg: 'bg-green-600', text: 'text-white', border: 'border-green-700', desc: 'All critical tests passing. Ready to launch.' },
  no_go:       { label: 'NO-GO', icon: ShieldX, bg: 'bg-red-600', text: 'text-white', border: 'border-red-700', desc: 'Critical failures or blockers prevent launch.' },
  conditional: { label: 'CONDITIONAL', icon: ShieldAlert, bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-600', desc: 'Passing with known risk. Review blockers before launch.' },
  pending:     { label: 'PENDING', icon: Clock, bg: 'bg-gray-200', text: 'text-gray-800', border: 'border-gray-300', desc: 'Testing in progress. Decision not yet made.' },
};

const MUST_PASS_GROUPS = ['Deal Closed Won','Direct Signup','Subscription Billing','Invoice and Payment','Data Isolation','Reseller Signup'];

function ReleaseModal({ release, onClose, onSave }) {
  const isNew = !release?.id;
  const [form, setForm] = useState(release || { release_name: '', build_version: '', go_live_status: 'pending', notes: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <DialogContent className="max-w-md">
      <DialogHeader><DialogTitle>{isNew ? 'New Release' : 'Edit Release'}</DialogTitle></DialogHeader>
      <div className="space-y-3 text-sm">
        <div><label className="text-xs text-gray-400 uppercase mb-1 block">Release Name</label><Input value={form.release_name} onChange={e => set('release_name', e.target.value)} placeholder="v1.0 Launch" /></div>
        <div><label className="text-xs text-gray-400 uppercase mb-1 block">Build Version</label><Input value={form.build_version || ''} onChange={e => set('build_version', e.target.value)} placeholder="v1.2.3" /></div>
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
  const { data: runs = [] } = useQuery({ queryKey: ['QATestRuns'], queryFn: () => base44.entities.QATestRuns.list('-started_at', 200) });
  const { data: testCases = [] } = useQuery({ queryKey: ['QATestCases'], queryFn: () => base44.entities.QATestCases.list() });

  const saveRelease = useMutation({
    mutationFn: form => form.id ? base44.entities.QAReleaseStatus.update(form.id, { ...form, last_updated: new Date().toISOString() }) : base44.entities.QAReleaseStatus.create({ ...form, last_updated: new Date().toISOString() }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['QAReleaseStatus'] }); setReleaseModal(null); },
  });

  const latest = releases[0];
  const goLiveCfg = GO_LIVE[latest?.go_live_status || 'pending'];
  const GoLiveIcon = goLiveCfg.icon;

  const blockers = issues.filter(i => i.status === 'open' && (i.priority === 'blocker' || i.severity === 'critical'));
  const openHigh = issues.filter(i => i.status === 'open' && i.severity === 'high');

  // Must-pass flow results
  const mustPassData = MUST_PASS_GROUPS.map(group => {
    const groupCases = testCases.filter(tc => tc.test_group === group && tc.is_active);
    const p0cases = groupCases.filter(tc => tc.priority === 'P0');
    const caseIds = new Set(groupCases.map(t => t.id));
    // Latest run per test case
    const latest = {};
    for (const r of runs) {
      if (!caseIds.has(r.test_case_id)) continue;
      if (!latest[r.test_case_id] || r.started_at > latest[r.test_case_id].started_at) latest[r.test_case_id] = r;
    }
    const latestResults = Object.values(latest);
    const passing = latestResults.filter(r => r.result === 'pass').length;
    const failing = latestResults.filter(r => r.result === 'fail').length;
    const untested = groupCases.length - latestResults.length;
    const allP0Pass = p0cases.every(tc => latest[tc.id]?.result === 'pass');
    return { group, total: groupCases.length, p0: p0cases.length, passing, failing, untested, allP0Pass };
  });

  const totalActive = testCases.filter(t => t.is_active).length;
  const passCount = runs.filter(r => r.result === 'pass').length;
  const failCount = runs.filter(r => r.result === 'fail').length;
  const totalRuns = passCount + failCount;
  const readinessScore = totalRuns ? Math.round((passCount / totalRuns) * 100) : 0;
  const mustPassAllGreen = mustPassData.every(m => m.allP0Pass);

  return (
    <div className="min-h-screen bg-gray-50">
      <QANav current="AdminQAReadiness" />
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Release Readiness</h1>
            <p className="text-sm text-gray-400">Go/No-Go decision dashboard</p>
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
            <div className="text-right shrink-0">
              <p className="text-xs opacity-60">Build</p>
              <p className="font-bold">{latest.build_version || 'unversioned'}</p>
              <p className="text-xs opacity-60 mt-1">Updated {latest.last_updated ? new Date(latest.last_updated).toLocaleDateString() : '—'}</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0 bg-white/20 border-white/40 hover:bg-white/30" onClick={() => setReleaseModal(latest)}>Edit</Button>
          </div>
        )}

        {/* Readiness Score Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Readiness Score', value: `${readinessScore}%`, color: readinessScore >= 80 ? 'text-green-600' : readinessScore >= 50 ? 'text-orange-600' : 'text-red-600' },
            { label: 'Critical Blockers', value: blockers.length, color: blockers.length > 0 ? 'text-red-600' : 'text-green-600' },
            { label: 'High Issues', value: openHigh.length, color: openHigh.length > 3 ? 'text-orange-600' : 'text-gray-700' },
            { label: 'Must-Pass Flows', value: mustPassAllGreen ? '✓ All Green' : `${mustPassData.filter(m => !m.allP0Pass).length} failing`, color: mustPassAllGreen ? 'text-green-600' : 'text-red-600' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Must-Pass Flows */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Must-Pass Critical Flows</h2>
              <p className="text-xs text-gray-400">All P0 tests in these groups must pass before launch</p>
            </div>
            <div className="divide-y divide-gray-50">
              {mustPassData.map(m => (
                <div key={m.group} className="px-4 py-3 flex items-center gap-3">
                  {m.allP0Pass
                    ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    : m.untested === m.total
                      ? <Clock className="w-5 h-5 text-gray-300 shrink-0" />
                      : <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  }
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{m.group}</p>
                    <p className="text-xs text-gray-400">{m.p0} P0 tests · {m.passing} passing · {m.failing} failing · {m.untested} untested</p>
                  </div>
                  {m.failing > 0 && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">{m.failing} fail</span>}
                  {m.allP0Pass && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Ready</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Blocker List */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-800">Launch Blockers</h2>
                <p className="text-xs text-gray-400">Must resolve before go-live decision</p>
              </div>
              <a href={createPageUrl('AdminQAIssues')} className="text-xs text-blue-500 hover:underline">Manage →</a>
            </div>
            {blockers.length === 0 ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No blockers — critical path clear</p>
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
          {releases.length > 1 && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden lg:col-span-2">
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Release History</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {releases.map(rel => {
                  const cfg = GO_LIVE[rel.go_live_status || 'pending'];
                  const Icon = cfg.icon;
                  return (
                    <div key={rel.id} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer" onClick={() => setReleaseModal(rel)}>
                      <Icon className={`w-4 h-4 shrink-0 ${rel.go_live_status === 'go' ? 'text-green-600' : rel.go_live_status === 'no_go' ? 'text-red-600' : 'text-orange-500'}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{rel.release_name}</p>
                        <p className="text-xs text-gray-400">Build: {rel.build_version || '—'} · {rel.last_updated ? new Date(rel.last_updated).toLocaleDateString() : '—'}</p>
                      </div>
                      <div className="flex gap-3 text-xs text-gray-400">
                        <span className="text-green-600">{rel.passed_tests ?? 0} pass</span>
                        <span className="text-red-600">{rel.failed_tests ?? 0} fail</span>
                        <span>{rel.blocked_tests ?? 0} blocked</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
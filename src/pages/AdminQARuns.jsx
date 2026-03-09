import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import QANav from '@/components/qa/QANav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, ChevronDown, ChevronRight, CheckCircle2, XCircle, Clock, Ban, Play } from 'lucide-react';

const RESULT_STYLES = {
  pass:        { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100 text-green-800 border-green-200' },
  fail:        { icon: XCircle,      color: 'text-red-600',   bg: 'bg-red-100 text-red-800 border-red-200' },
  blocked:     { icon: Ban,          color: 'text-orange-600',bg: 'bg-orange-100 text-orange-800 border-orange-200' },
  skipped:     { icon: ChevronRight, color: 'text-gray-400',  bg: 'bg-gray-100 text-gray-600 border-gray-200' },
  in_progress: { icon: Play,         color: 'text-blue-600',  bg: 'bg-blue-100 text-blue-800 border-blue-200' },
};

const RUN_PRESETS = [
  'Smoke Test',
  'Critical Revenue Flow Test',
  'Billing Regression',
  'Reseller Regression',
  'Content Fulfillment Regression',
  'Security Isolation Test',
  'Full Regression',
  'Pre-Sales Launch Check',
];

function NewRunModal({ testCases, onClose, onSave }) {
  const [form, setForm] = useState({ run_name: '', environment: 'staging', build_version: '', notes: '', started_at: new Date().toISOString(), result: 'in_progress', test_case_id: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader><DialogTitle>New Test Run</DialogTitle></DialogHeader>
      <div className="space-y-3 text-sm">
        <div><label className="text-xs text-gray-400 uppercase mb-1 block">Test Case</label>
          <Select value={form.test_case_id} onValueChange={v => set('test_case_id', v)}>
            <SelectTrigger><SelectValue placeholder="Select test case..." /></SelectTrigger>
            <SelectContent className="max-h-60">
              {testCases.map(tc => <SelectItem key={tc.id} value={tc.id}>{tc.test_id} — {tc.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-gray-400 uppercase mb-1 block">Run Name</label>
          <Input value={form.run_name} onChange={e => set('run_name', e.target.value)} placeholder="Sprint 4 Regression" />
          <div className="flex flex-wrap gap-1 mt-1.5">
            {RUN_PRESETS.map(p => (
              <button key={p} type="button" onClick={() => set('run_name', p)} className="text-xs px-2 py-0.5 rounded-full border border-gray-200 text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors">{p}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-gray-400 uppercase mb-1 block">Environment</label>
            <Select value={form.environment} onValueChange={v => set('environment', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{['development','staging','production'].map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><label className="text-xs text-gray-400 uppercase mb-1 block">Build Version</label><Input value={form.build_version} onChange={e => set('build_version', e.target.value)} placeholder="v1.2.3" /></div>
        </div>
        <div><label className="text-xs text-gray-400 uppercase mb-1 block">Result</label>
          <Select value={form.result} onValueChange={v => set('result', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{Object.keys(RESULT_STYLES).map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><label className="text-xs text-gray-400 uppercase mb-1 block">Notes</label><textarea value={form.notes} onChange={e => set('notes', e.target.value)} className="w-full border rounded px-3 py-2 text-sm min-h-[60px] resize-none focus:outline-none focus:ring-1 focus:ring-blue-400" /></div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(form)} disabled={!form.test_case_id}>Save Run</Button>
        </div>
      </div>
    </DialogContent>
  );
}

function RunDetail({ run, testCase, steps, onAddStep, onUpdateStep }) {
  const [newStep, setNewStep] = useState({ step_number: steps.length + 1, step_name: '', expected_result: '', actual_result: '', status: 'not_run' });

  return (
    <div className="mt-3 ml-8 bg-gray-50 rounded-lg border border-gray-200 p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-xs">
        <div><span className="text-gray-400">Environment</span><p className="font-medium">{run.environment}</p></div>
        <div><span className="text-gray-400">Build</span><p className="font-medium">{run.build_version || '—'}</p></div>
        <div><span className="text-gray-400">Started</span><p className="font-medium">{run.started_at ? new Date(run.started_at).toLocaleString() : '—'}</p></div>
        <div><span className="text-gray-400">Started By</span><p className="font-medium">{run.started_by || '—'}</p></div>
      </div>
      {run.notes && <p className="text-xs text-gray-500 italic mb-3">{run.notes}</p>}

      <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Steps ({steps.length})</h4>
      {steps.length === 0 ? (
        <p className="text-xs text-gray-400 mb-3">No steps recorded</p>
      ) : (
        <div className="space-y-1 mb-3">
          {steps.map(step => {
            const cfg = RESULT_STYLES[step.status] || RESULT_STYLES.not_run || RESULT_STYLES.skipped;
            const Icon = cfg?.icon || Clock;
            return (
              <div key={step.id} className="flex items-start gap-2 bg-white border border-gray-100 rounded p-2">
                <span className="text-xs text-gray-300 w-5 shrink-0">{step.step_number}.</span>
                <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${cfg?.color || 'text-gray-400'}`} />
                <div className="flex-1 text-xs">
                  <p className="font-medium text-gray-700">{step.step_name}</p>
                  {step.expected_result && <p className="text-gray-400">Expected: {step.expected_result}</p>}
                  {step.actual_result && <p className={step.status === 'fail' ? 'text-red-600' : 'text-gray-500'}>Actual: {step.actual_result}</p>}
                  {step.error_log && <p className="text-red-500 font-mono bg-red-50 px-2 py-1 rounded mt-1">{step.error_log}</p>}
                </div>
                <Select value={step.status} onValueChange={v => onUpdateStep(step.id, { status: v })}>
                  <SelectTrigger className="w-28 h-6 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{['pass','fail','blocked','skipped','not_run'].map(s => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            );
          })}
        </div>
      )}

      <div className="border-t border-gray-200 pt-3 flex gap-2">
        <Input value={newStep.step_name} onChange={e => setNewStep(s => ({ ...s, step_name: e.target.value }))} placeholder="Step name..." className="text-xs h-7 flex-1" />
        <Input value={newStep.expected_result} onChange={e => setNewStep(s => ({ ...s, expected_result: e.target.value }))} placeholder="Expected..." className="text-xs h-7 flex-1" />
        <Button size="sm" className="h-7 text-xs" onClick={() => { onAddStep({ ...newStep, test_run_id: run.id }); setNewStep(s => ({ ...s, step_number: s.step_number + 1, step_name: '', expected_result: '' })); }}>+ Step</Button>
      </div>
    </div>
  );
}

export default function AdminQARuns() {
  const qc = useQueryClient();
  const [envFilter, setEnvFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');
  const [buildFilter, setBuildFilter] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [showNew, setShowNew] = useState(false);

  const { data: runs = [] } = useQuery({ queryKey: ['QATestRuns'], queryFn: () => base44.entities.QATestRuns.list('-started_at', 200) });
  const { data: testCases = [] } = useQuery({ queryKey: ['QATestCases'], queryFn: () => base44.entities.QATestCases.list() });
  const { data: steps = [] } = useQuery({ queryKey: ['QATestRunSteps'], queryFn: () => base44.entities.QATestRunSteps.list('step_number', 500) });

  const createRun = useMutation({ mutationFn: d => base44.entities.QATestRuns.create(d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['QATestRuns'] }); setShowNew(false); } });
  const addStep = useMutation({ mutationFn: d => base44.entities.QATestRunSteps.create(d), onSuccess: () => qc.invalidateQueries({ queryKey: ['QATestRunSteps'] }) });
  const updateStep = useMutation({ mutationFn: ({ id, data }) => base44.entities.QATestRunSteps.update(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['QATestRunSteps'] }) });

  const tcMap = useMemo(() => Object.fromEntries(testCases.map(t => [t.id, t])), [testCases]);

  const filtered = useMemo(() => runs.filter(r => {
    if (envFilter !== 'all' && r.environment !== envFilter) return false;
    if (resultFilter !== 'all' && r.result !== resultFilter) return false;
    if (buildFilter && !(r.build_version || '').toLowerCase().includes(buildFilter.toLowerCase())) return false;
    return true;
  }), [runs, envFilter, resultFilter, buildFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <QANav current="AdminQARuns" />
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Test Runs</h1>
            <p className="text-sm text-gray-400">{runs.length} total · {runs.filter(r => r.result === 'pass').length} passing · {runs.filter(r => r.result === 'fail').length} failing</p>
          </div>
          <Button onClick={() => setShowNew(true)} className="gap-2"><Plus className="w-4 h-4" /> New Run</Button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-center">
          <Select value={envFilter} onValueChange={setEnvFilter}>
            <SelectTrigger className="w-36 h-8 text-sm"><SelectValue placeholder="Environment" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Envs</SelectItem>{['development','staging','production'].map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={resultFilter} onValueChange={setResultFilter}>
            <SelectTrigger className="w-32 h-8 text-sm"><SelectValue placeholder="Result" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Results</SelectItem>{Object.keys(RESULT_STYLES).map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
          </Select>
          <Input value={buildFilter} onChange={e => setBuildFilter(e.target.value)} placeholder="Filter build..." className="w-32 h-8 text-sm" />
          <span className="ml-auto text-xs text-gray-400">{filtered.length} runs</span>
        </div>

        <div className="space-y-2">
          {filtered.map(run => {
            const tc = tcMap[run.test_case_id];
            const cfg = RESULT_STYLES[run.result] || RESULT_STYLES.skipped;
            const Icon = cfg.icon;
            const isOpen = expanded === run.id;
            const runSteps = steps.filter(s => s.test_run_id === run.id);

            return (
              <div key={run.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50" onClick={() => setExpanded(isOpen ? null : run.id)}>
                  <Icon className={`w-4 h-4 shrink-0 ${cfg.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {run.run_name || (tc ? `${tc.test_id} — ${tc.name}` : run.test_case_id)}
                    </p>
                    <p className="text-xs text-gray-400">{tc?.test_group || '—'} · {run.environment} · {run.started_at ? new Date(run.started_at).toLocaleDateString() : '—'}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.bg}`}>{run.result}</span>
                  <span className="text-xs text-gray-300 hidden md:block shrink-0">{run.build_version || '—'}</span>
                  <span className="text-xs text-gray-400 shrink-0">{runSteps.length} steps</span>
                  {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />}
                </div>
                {isOpen && (
                  <div className="px-4 pb-4">
                    <RunDetail
                      run={run} testCase={tc} steps={runSteps}
                      onAddStep={data => addStep.mutate(data)}
                      onUpdateStep={(id, data) => updateStep.mutate({ id, data })}
                    />
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && <div className="text-center py-16 text-gray-400">No runs match filters</div>}
        </div>
      </div>

      {showNew && (
        <Dialog open onOpenChange={() => setShowNew(false)}>
          <NewRunModal testCases={testCases} onClose={() => setShowNew(false)} onSave={d => createRun.mutate(d)} />
        </Dialog>
      )}
    </div>
  );
}
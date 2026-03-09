import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import QANav from '@/components/qa/QANav';
import { PriorityBadge, ResultBadge } from '@/components/qa/QABadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, ChevronDown, ChevronRight, Play } from 'lucide-react';

const RESULTS  = ['Pass','Fail','Blocked','Needs Review','Not Run'];
const RUN_TYPES= ['Manual','Preset','Retest','Smoke','Regression','Automated'];
const ENVS     = ['development','staging','production'];

const PRESET_CHIPS = ['Smoke Test','Critical Revenue Flow Test','Billing Regression','Reseller Regression','Content Fulfillment Regression','Security Isolation Test','Full Regression','Pre-Sales Launch Check'];

function NewRunModal({ testCases, onClose, onSave }) {
  const [form, setForm] = useState({ run_name:'',run_type:'Manual',environment:'staging',build_version:'',notes:'',result:'Not Run',started_at:new Date().toISOString(),test_case_id:'' });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  return (
    <DialogContent className="max-w-lg">
      <DialogHeader><DialogTitle>New Test Run</DialogTitle></DialogHeader>
      <div className="space-y-3 text-sm">
        <div><label className="text-xs text-gray-400 uppercase block mb-1">Test Case</label>
          <Select value={form.test_case_id} onValueChange={v=>set('test_case_id',v)}>
            <SelectTrigger><SelectValue placeholder="Select test case..."/></SelectTrigger>
            <SelectContent className="max-h-60">{testCases.map(tc=><SelectItem key={tc.id} value={tc.id}>{tc.test_id} — {tc.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-gray-400 uppercase block mb-1">Run Name</label>
          <Input value={form.run_name} onChange={e=>set('run_name',e.target.value)} placeholder="Sprint 4 Regression..." />
          <div className="flex flex-wrap gap-1 mt-1.5">
            {PRESET_CHIPS.map(p=><button key={p} type="button" onClick={()=>set('run_name',p)} className="text-xs px-2 py-0.5 rounded-full border border-gray-200 text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors">{p}</button>)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-gray-400 uppercase block mb-1">Run Type</label>
            <Select value={form.run_type} onValueChange={v=>set('run_type',v)}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>{RUN_TYPES.map(r=><SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><label className="text-xs text-gray-400 uppercase block mb-1">Environment</label>
            <Select value={form.environment} onValueChange={v=>set('environment',v)}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>{ENVS.map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-gray-400 uppercase block mb-1">Build Version</label><Input value={form.build_version} onChange={e=>set('build_version',e.target.value)} placeholder="0.1.0" /></div>
          <div><label className="text-xs text-gray-400 uppercase block mb-1">Result</label>
            <Select value={form.result} onValueChange={v=>set('result',v)}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>{RESULTS.map(r=><SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div><label className="text-xs text-gray-400 uppercase block mb-1">Notes</label><Textarea value={form.notes} onChange={e=>set('notes',e.target.value)} className="min-h-[60px] text-sm" /></div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={()=>onSave(form)} disabled={!form.test_case_id}>Create Run</Button>
        </div>
      </div>
    </DialogContent>
  );
}

function RunDetail({ run, steps, onUpdateStep, onAddStep }) {
  const [newStep, setNewStep] = useState({ step_name:'',expected_result:'',status:'Not Run' });

  return (
    <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-3 text-xs">
        <div><span className="text-gray-400">Started By</span><p className="font-medium">{run.started_by||'—'}</p></div>
        <div><span className="text-gray-400">Build</span><p className="font-medium">{run.build_version||'—'}</p></div>
        <div><span className="text-gray-400">Started</span><p className="font-medium">{run.started_at?new Date(run.started_at).toLocaleString():'—'}</p></div>
        <div><span className="text-gray-400">Environment</span><p className="font-medium">{run.environment}</p></div>
      </div>
      {run.notes && <p className="text-xs text-gray-500 italic mb-3">{run.notes}</p>}
      <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Steps ({steps.length})</h4>
      <div className="space-y-1 mb-3">
        {steps.map(step=>(
          <div key={step.id} className="flex items-start gap-2 bg-white border border-gray-100 rounded p-2">
            <span className="text-xs text-gray-300 w-5 shrink-0">{step.step_number}.</span>
            <div className="flex-1 text-xs">
              <p className="font-medium text-gray-700">{step.step_name}</p>
              {step.expected_result&&<p className="text-gray-400">Expected: {step.expected_result}</p>}
              {step.actual_result&&<p className={step.status==='Fail'?'text-red-600':'text-gray-500'}>Actual: {step.actual_result}</p>}
              {step.error_log&&<p className="text-red-500 font-mono bg-red-50 px-2 py-1 rounded mt-1 text-xs">{step.error_log}</p>}
            </div>
            <Select value={step.status||'Not Run'} onValueChange={v=>onUpdateStep(step.id,{status:v})}>
              <SelectTrigger className="w-28 h-6 text-xs shrink-0"><SelectValue/></SelectTrigger>
              <SelectContent>{RESULTS.map(s=><SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        ))}
        {steps.length===0&&<p className="text-xs text-gray-400">No steps yet — create run to auto-clone templates</p>}
      </div>
      <div className="flex gap-2 border-t border-gray-200 pt-2">
        <Input value={newStep.step_name} onChange={e=>setNewStep(s=>({...s,step_name:e.target.value}))} placeholder="Step name..." className="text-xs h-7 flex-1" />
        <Input value={newStep.expected_result} onChange={e=>setNewStep(s=>({...s,expected_result:e.target.value}))} placeholder="Expected..." className="text-xs h-7 flex-1" />
        <Button size="sm" className="h-7 text-xs" onClick={()=>{ onAddStep({...newStep,test_run_id:run.id,step_number:steps.length+1}); setNewStep({step_name:'',expected_result:'',status:'Not Run'}); }}>+Step</Button>
      </div>
    </div>
  );
}

export default function AdminQARuns() {
  const qc = useQueryClient();
  const [resultFilter, setResultFilter] = useState('all');
  const [envFilter, setEnvFilter] = useState('all');
  const [buildFilter, setBuildFilter] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const { data: runs = [] }    = useQuery({ queryKey:['QATestRuns'],    queryFn:()=>base44.entities.QATestRuns.list('-started_at',300) });
  const { data: tests = [] }   = useQuery({ queryKey:['QATestCases'],   queryFn:()=>base44.entities.QATestCases.list() });
  const { data: steps = [] }   = useQuery({ queryKey:['QATestRunSteps'],queryFn:()=>base44.entities.QATestRunSteps.list('step_number',5000) });

  const createRun = useMutation({
    mutationFn: d => base44.entities.QATestRuns.create({...d,started_at:d.started_at||new Date().toISOString()}),
    onSuccess: () => { qc.invalidateQueries({queryKey:['QATestRuns']}); qc.invalidateQueries({queryKey:['QATestRunSteps']}); setShowNew(false); },
  });
  const addStep    = useMutation({ mutationFn: d=>base44.entities.QATestRunSteps.create(d), onSuccess:()=>qc.invalidateQueries({queryKey:['QATestRunSteps']}) });
  const updateStep = useMutation({ mutationFn:({id,data})=>base44.entities.QATestRunSteps.update(id,data), onSuccess:()=>qc.invalidateQueries({queryKey:['QATestRunSteps']}) });
  const updateRun  = useMutation({ mutationFn:({id,data})=>base44.entities.QATestRuns.update(id,data), onSuccess:()=>qc.invalidateQueries({queryKey:['QATestRuns']}) });

  const tcById = useMemo(()=>Object.fromEntries(tests.map(t=>[t.id,t])),[tests]);

  const filtered = useMemo(()=>runs.filter(r=>{
    if(resultFilter!=='all'&&r.result!==resultFilter) return false;
    if(envFilter!=='all'&&r.environment!==envFilter) return false;
    if(buildFilter&&!(r.build_version||'').toLowerCase().includes(buildFilter.toLowerCase())) return false;
    return true;
  }),[runs,resultFilter,envFilter,buildFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <QANav current="AdminQARuns" />
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Test Runs</h1>
            <p className="text-sm text-gray-400">{runs.length} total · {runs.filter(r=>r.result==='Pass').length} passing · {runs.filter(r=>r.result==='Fail').length} failing</p>
          </div>
          <Button onClick={()=>setShowNew(true)} className="gap-2"><Plus className="w-4 h-4"/>New Run</Button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-center">
          <Select value={resultFilter} onValueChange={setResultFilter}>
            <SelectTrigger className="w-32 h-8 text-sm"><SelectValue placeholder="Result"/></SelectTrigger>
            <SelectContent><SelectItem value="all">All Results</SelectItem>{RESULTS.map(r=><SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={envFilter} onValueChange={setEnvFilter}>
            <SelectTrigger className="w-36 h-8 text-sm"><SelectValue placeholder="Env"/></SelectTrigger>
            <SelectContent><SelectItem value="all">All Envs</SelectItem>{ENVS.map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
          </Select>
          <Input value={buildFilter} onChange={e=>setBuildFilter(e.target.value)} placeholder="Filter build..." className="w-32 h-8 text-sm" />
          <span className="ml-auto text-xs text-gray-400">{filtered.length} runs</span>
        </div>

        <div className="space-y-2">
          {filtered.map(run=>{
            const tc = tcById[run.test_case_id];
            const runSteps = steps.filter(s=>s.test_run_id===run.id).sort((a,b)=>(a.step_number||0)-(b.step_number||0));
            const isOpen = expanded===run.id;
            return (
              <div key={run.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 flex items-center gap-3">
                  <ResultBadge result={run.result} />
                  {tc && <PriorityBadge priority={tc.priority} />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{run.run_name||`${tc?.test_id||''} run`}</p>
                    <p className="text-xs text-gray-400">{tc?.test_group||'—'} · {run.environment} · {run.started_at?new Date(run.started_at).toLocaleDateString():'—'}</p>
                  </div>
                  <Select value={run.result} onValueChange={v=>updateRun.mutate({id:run.id,data:{result:v}})}>
                    <SelectTrigger className="w-32 h-7 text-xs"><SelectValue/></SelectTrigger>
                    <SelectContent>{RESULTS.map(r=><SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>)}</SelectContent>
                  </Select>
                  <span className="text-xs text-gray-300 hidden md:block shrink-0">{run.build_version||'—'}</span>
                  <span className="text-xs text-gray-400 shrink-0">{runSteps.length} steps</span>
                  <button onClick={()=>setExpanded(isOpen?null:run.id)} className="text-gray-300 hover:text-gray-600">
                    {isOpen?<ChevronDown className="w-4 h-4"/>:<ChevronRight className="w-4 h-4"/>}
                  </button>
                </div>
                {isOpen && <RunDetail run={run} steps={runSteps} onUpdateStep={(id,data)=>updateStep.mutate({id,data})} onAddStep={d=>addStep.mutate(d)} />}
              </div>
            );
          })}
          {filtered.length===0&&<div className="text-center py-16 text-gray-400">No runs match filters</div>}
        </div>
      </div>

      {showNew&&(
        <Dialog open onOpenChange={()=>setShowNew(false)}>
          <NewRunModal testCases={tests} onClose={()=>setShowNew(false)} onSave={d=>createRun.mutate(d)} />
        </Dialog>
      )}
    </div>
  );
}
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import QANav from '@/components/qa/QANav';
import { PriorityBadge, ResultBadge } from '@/components/qa/QABadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, ChevronRight, Star, ToggleLeft, ToggleRight, ChevronDown } from 'lucide-react';

const TEST_GROUPS = ['Authentication','Sales','Signup','Billing','Finance','Onboarding','Content','SEO','Website','ADA','Reviews','Reseller','Support','Analytics','System Health','Security'];
const PRIORITIES  = ['P0 Critical','P1 High','P2 Normal','P3 Low'];
const STATUSES    = ['Ready','Draft','Deprecated'];

function TestCaseModal({ tc, onClose, onSave }) {
  const isNew = !tc?.id;
  const [form, setForm] = useState(tc || { test_id:'',name:'',test_group:'Authentication',priority:'P1 High',role:'Admin',status:'Ready',is_active:true,is_high_visibility:false,owner:'Rick',trigger:'' });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const ta = (k,ph) => <textarea value={form[k]||''} onChange={e=>set(k,e.target.value)} className="w-full border rounded px-3 py-2 text-sm min-h-[60px] resize-y focus:outline-none focus:ring-1 focus:ring-blue-400 font-mono" placeholder={ph} />;

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader><DialogTitle>{isNew?'New Test Case':`Edit ${tc?.test_id}`}</DialogTitle></DialogHeader>
      <div className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-gray-400 uppercase block mb-1">Test ID</label><Input value={form.test_id} onChange={e=>set('test_id',e.target.value)} placeholder="QA-040" /></div>
          <div><label className="text-xs text-gray-400 uppercase block mb-1">Priority</label>
            <Select value={form.priority} onValueChange={v=>set('priority',v)}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>{PRIORITIES.map(p=><SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div><label className="text-xs text-gray-400 uppercase block mb-1">Name</label><Input value={form.name} onChange={e=>set('name',e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-gray-400 uppercase block mb-1">Test Group</label>
            <Select value={form.test_group} onValueChange={v=>set('test_group',v)}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>{TEST_GROUPS.map(g=><SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><label className="text-xs text-gray-400 uppercase block mb-1">Role</label><Input value={form.role||''} onChange={e=>set('role',e.target.value)} placeholder="Admin, Client, Public..." /></div>
        </div>
        <div><label className="text-xs text-gray-400 uppercase block mb-1">Start Page</label><Input value={form.start_page||''} onChange={e=>set('start_page',e.target.value)} placeholder="/client/billing" /></div>
        <div><label className="text-xs text-gray-400 uppercase block mb-1">Trigger</label>{ta('trigger','Describe what triggers this test')}</div>
        <div><label className="text-xs text-gray-400 uppercase block mb-1">Expected Records Created (JSON)</label>{ta('expected_records_created_json','["ClientCompanies","ClientSubscriptions"]')}</div>
        <div><label className="text-xs text-gray-400 uppercase block mb-1">Expected Records Updated (JSON)</label>{ta('expected_records_updated_json','["ClientCompanies.status=active"]')}</div>
        <div><label className="text-xs text-gray-400 uppercase block mb-1">Validation Pages (JSON)</label>{ta('validation_pages_json','["/admin/billing","/client/dashboard"]')}</div>
        <div><label className="text-xs text-gray-400 uppercase block mb-1">Failure Conditions (JSON)</label>{ta('failure_conditions_json','["no company created","duplicate"]')}</div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-gray-400 uppercase block mb-1">Owner</label><Input value={form.owner||''} onChange={e=>set('owner',e.target.value)} /></div>
          <div><label className="text-xs text-gray-400 uppercase block mb-1">Status</label>
            <Select value={form.status} onValueChange={v=>set('status',v)}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>{STATUSES.map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div><label className="text-xs text-gray-400 uppercase block mb-1">Notes</label>{ta('notes','')}</div>
        <div className="flex items-center gap-4">
          <button onClick={()=>set('is_active',!form.is_active)} className="flex items-center gap-1.5 text-sm text-gray-600">
            {form.is_active?<ToggleRight className="w-5 h-5 text-green-500"/>:<ToggleLeft className="w-5 h-5 text-gray-400"/>}Active
          </button>
          <button onClick={()=>set('is_high_visibility',!form.is_high_visibility)} className="flex items-center gap-1.5 text-sm text-gray-600">
            <Star className={`w-4 h-4 ${form.is_high_visibility?'text-yellow-500 fill-yellow-500':'text-gray-300'}`}/>High Visibility
          </button>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={()=>onSave(form)}>Save</Button>
        </div>
      </div>
    </DialogContent>
  );
}

function StepsPanel({ tc, templates }) {
  const tcSteps = templates.filter(s => s.test_case_id === tc.id)
    .sort((a,b)=>(a.step_number||0)-(b.step_number||0));
  if (tcSteps.length === 0) return <p className="text-xs text-gray-400 mt-2">No step templates</p>;
  return (
    <div className="mt-2 space-y-1">
      {tcSteps.map(s => (
        <div key={s.id} className="flex items-start gap-2 text-xs bg-gray-50 rounded px-3 py-1.5">
          <span className="text-gray-300 w-5 shrink-0">{s.step_number}.</span>
          <div className="flex-1">
            <span className="font-medium text-gray-700">{s.step_name}</span>
            {s.expected_result && <span className="text-gray-400"> → {s.expected_result}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminQATests() {
  const qc = useQueryClient();
  const [groupFilter, setGroupFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hvFilter, setHvFilter] = useState(false);
  const [search, setSearch] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [modal, setModal] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const { data: tests = [] }     = useQuery({ queryKey:['QATestCases'],    queryFn:()=>base44.entities.QATestCases.list() });
  const { data: runs = [] }      = useQuery({ queryKey:['QATestRuns'],     queryFn:()=>base44.entities.QATestRuns.list('-started_at',500) });
  const { data: templates = [] } = useQuery({ queryKey:['QATestCaseSteps'],queryFn:()=>base44.entities.QATestCaseSteps.list('step_number',2000) });
  const { data: issueList = [] } = useQuery({ queryKey:['QAIssues'],       queryFn:()=>base44.entities.QAIssues.list() });

  const save = useMutation({
    mutationFn: f => f.id ? base44.entities.QATestCases.update(f.id,f) : base44.entities.QATestCases.create(f),
    onSuccess: () => { qc.invalidateQueries({queryKey:['QATestCases']}); setModal(null); },
  });

  const latestByCase = useMemo(()=>{
    const m={};
    for(const r of runs) { if(!m[r.test_case_id]||r.started_at>m[r.test_case_id].started_at) m[r.test_case_id]=r; }
    return m;
  },[runs]);

  const issuesByTC = useMemo(()=>{
    const m={};
    for(const i of issueList){ if(i.linked_test_case_id){ m[i.linked_test_case_id]=(m[i.linked_test_case_id]||0)+1; } }
    return m;
  },[issueList]);

  const filtered = useMemo(()=>tests.filter(t=>{
    if(!showInactive && !t.is_active) return false;
    if(groupFilter!=='all' && t.test_group!==groupFilter) return false;
    if(priorityFilter!=='all' && !(t.priority||'').includes(priorityFilter)) return false;
    if(statusFilter!=='all' && t.status!==statusFilter) return false;
    if(hvFilter && !(t.is_high_visibility||t.high_visibility)) return false;
    if(search && !`${t.test_id} ${t.name}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }),[tests,groupFilter,priorityFilter,statusFilter,hvFilter,search,showInactive]);

  const grouped = useMemo(()=>filtered.reduce((acc,t)=>{
    const g=t.test_group||'Other';
    if(!acc[g]) acc[g]=[];
    acc[g].push(t);
    return acc;
  },{}),[ filtered]);

  return (
    <div className="min-h-screen bg-gray-50">
      <QANav current="AdminQATests" />
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Test Cases</h1>
            <p className="text-sm text-gray-400">{tests.filter(t=>t.is_active).length} active · {tests.length} total</p>
          </div>
          <Button onClick={()=>setModal({})} className="gap-2"><Plus className="w-4 h-4"/>New Test Case</Button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-center">
          <Input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} className="w-44 h-8 text-sm" />
          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger className="w-44 h-8 text-sm"><SelectValue placeholder="All Groups"/></SelectTrigger>
            <SelectContent><SelectItem value="all">All Groups</SelectItem>{TEST_GROUPS.map(g=><SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-28 h-8 text-sm"><SelectValue placeholder="Priority"/></SelectTrigger>
            <SelectContent><SelectItem value="all">All</SelectItem>{['P0','P1','P2','P3'].map(p=><SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-28 h-8 text-sm"><SelectValue placeholder="Status"/></SelectTrigger>
            <SelectContent><SelectItem value="all">All</SelectItem>{STATUSES.map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <button onClick={()=>setHvFilter(v=>!v)} className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border transition-colors ${hvFilter?'bg-yellow-50 border-yellow-300 text-yellow-700':'border-gray-200 text-gray-500'}`}>
            <Star className="w-3 h-3"/>High-Vis Only
          </button>
          <button onClick={()=>setShowInactive(v=>!v)} className={`text-xs px-2.5 py-1.5 rounded-full border transition-colors ${showInactive?'bg-gray-800 text-white border-gray-800':'border-gray-200 text-gray-500'}`}>Show Inactive</button>
          <span className="ml-auto text-xs text-gray-400">{filtered.length} tests</span>
        </div>

        <div className="space-y-4">
          {Object.entries(grouped).map(([grp, grpTests])=>(
            <div key={grp} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 border-b px-4 py-2.5 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 text-sm">{grp}</h2>
                <span className="text-xs text-gray-400">{grpTests.length} tests</span>
              </div>
              <div className="divide-y divide-gray-50">
                {grpTests.map(t=>{
                  const res = latestByCase[t.id]?.result||'Not Run';
                  const issueCount = issuesByTC[t.id]||0;
                  const isExpanded = expanded===t.id;
                  return (
                    <div key={t.id}>
                      <div className="px-4 py-3 flex items-center gap-3 hover:bg-blue-50/20">
                        <PriorityBadge priority={t.priority} />
                        {(t.is_high_visibility||t.high_visibility) && <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 shrink-0" />}
                        <span className="text-xs text-gray-400 font-mono w-16 shrink-0">{t.test_id}</span>
                        <div className="flex-1 min-w-0 cursor-pointer" onClick={()=>setModal(t)}>
                          <p className="text-sm font-medium text-gray-800 truncate">{t.name}</p>
                          <p className="text-xs text-gray-400 truncate">{t.trigger}</p>
                        </div>
                        <ResultBadge result={res} />
                        {issueCount>0 && <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full font-medium">{issueCount} issue{issueCount>1?'s':''}</span>}
                        {!t.is_active && <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">inactive</span>}
                        <button onClick={()=>setExpanded(isExpanded?null:t.id)} className="text-gray-300 hover:text-gray-600">
                          {isExpanded?<ChevronDown className="w-4 h-4"/>:<ChevronRight className="w-4 h-4"/>}
                        </button>
                      </div>
                      {isExpanded && (
                        <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 text-xs">
                            {t.validation_pages_json && <div><p className="text-gray-400 uppercase tracking-wide mb-1">Validation Pages</p><p className="font-mono text-gray-600">{t.validation_pages_json}</p></div>}
                            {t.failure_conditions_json && <div><p className="text-gray-400 uppercase tracking-wide mb-1">Failure Conditions</p><p className="font-mono text-gray-600">{t.failure_conditions_json}</p></div>}
                          </div>
                          <StepsPanel tc={t} templates={templates} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {Object.keys(grouped).length===0&&<div className="text-center py-16 text-gray-400">No test cases match filters</div>}
        </div>
      </div>

      {modal!==null && (
        <Dialog open onOpenChange={()=>setModal(null)}>
          <TestCaseModal tc={modal?.id?modal:null} onClose={()=>setModal(null)} onSave={f=>save.mutate(f)} />
        </Dialog>
      )}
    </div>
  );
}
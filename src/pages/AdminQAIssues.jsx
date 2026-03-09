import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import QANav from '@/components/qa/QANav';
import { SeverityBadge, ISSUE_STATUS_STYLE } from '@/components/qa/QABadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, AlertTriangle, ChevronRight } from 'lucide-react';

const SEVERITIES  = ['Critical','High','Medium','Low'];
const PRIORITIES  = ['P0','P1','P2','P3'];
const STATUSES    = ['Open','In Progress','Blocked','Resolved','Closed'];
const ISSUE_TYPES = ['UI Bug','Entity Bug','Automation Bug','Permission Bug','Billing Bug','Agent Failure','Data Isolation Bug','Regression','Reporting Bug','Integration Bug'];
const MODULES     = ['Authentication','Sales','Signup','Billing','Finance','Onboarding','Content','SEO','Website','ADA','Reviews','Reseller','Support','Analytics','System Health','Security'];

const HIGH_VIS_TC_IDS = ['QA-008','QA-010','QA-013','QA-014','QA-015','QA-019','QA-021','QA-031','QA-032','QA-036','QA-037','QA-038','QA-039'];

function IssueModal({ issue, testCases, runs, onClose, onSave }) {
  const isNew = !issue?.id;
  const [form, setForm] = useState(issue||{title:'',severity:'Medium',priority:'P1',status:'Open',issue_type:'Regression',opened_date:new Date().toISOString().split('T')[0],description:'',expected_behavior:'',actual_behavior:'',reproduction_steps:'',assigned_to:''});
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const ta = (k,ph,rows=2) => <textarea value={form[k]||''} onChange={e=>set(k,e.target.value)} rows={rows} className="w-full border rounded px-3 py-2 text-sm resize-y focus:outline-none focus:ring-1 focus:ring-blue-400" placeholder={ph} />;

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader><DialogTitle>{isNew?'New Issue':'Edit Issue'}</DialogTitle></DialogHeader>
      <div className="space-y-3 text-sm">
        <div><label className="text-xs text-gray-400 uppercase block mb-1">Title</label><Input value={form.title} onChange={e=>set('title',e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          {[{l:'Severity',k:'severity',opts:SEVERITIES},{l:'Priority',k:'priority',opts:PRIORITIES},{l:'Status',k:'status',opts:STATUSES},{l:'Issue Type',k:'issue_type',opts:ISSUE_TYPES}].map(({l,k,opts})=>(
            <div key={k}><label className="text-xs text-gray-400 uppercase block mb-1">{l}</label>
              <Select value={form[k]} onValueChange={v=>set(k,v)}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>{opts.map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-gray-400 uppercase block mb-1">Module Tag</label>
            <Select value={form.module_tag||''} onValueChange={v=>set('module_tag',v)}>
              <SelectTrigger><SelectValue placeholder="Module..."/></SelectTrigger>
              <SelectContent>{MODULES.map(m=><SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><label className="text-xs text-gray-400 uppercase block mb-1">Page Route</label><Input value={form.page_route||''} onChange={e=>set('page_route',e.target.value)} placeholder="/client/billing" /></div>
        </div>
        <div><label className="text-xs text-gray-400 uppercase block mb-1">Linked Test Case</label>
          <Select value={form.linked_test_case_id||''} onValueChange={v=>set('linked_test_case_id',v)}>
            <SelectTrigger><SelectValue placeholder="Link to test case (optional)..."/></SelectTrigger>
            <SelectContent><SelectItem value={null}>None</SelectItem>{testCases.map(tc=><SelectItem key={tc.id} value={tc.id}>{tc.test_id} — {tc.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><label className="text-xs text-gray-400 uppercase block mb-1">Description</label>{ta('description','Describe the issue...',3)}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><label className="text-xs text-gray-400 uppercase block mb-1">Expected Behavior</label>{ta('expected_behavior','What should happen...')}</div>
          <div><label className="text-xs text-gray-400 uppercase block mb-1">Actual Behavior</label>{ta('actual_behavior','What actually happened...')}</div>
        </div>
        <div><label className="text-xs text-gray-400 uppercase block mb-1">Reproduction Steps</label>{ta('reproduction_steps','1. Open page\n2. Click...',3)}</div>
        <div><label className="text-xs text-gray-400 uppercase block mb-1">Root Cause Key</label><Input value={form.root_cause_key||''} onChange={e=>set('root_cause_key',e.target.value)} placeholder="e.g. closed_won_idempotency" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-gray-400 uppercase block mb-1">Assigned To</label><Input value={form.assigned_to||''} onChange={e=>set('assigned_to',e.target.value)} /></div>
          <div><label className="text-xs text-gray-400 uppercase block mb-1">Opened Date</label><Input type="date" value={form.opened_date||''} onChange={e=>set('opened_date',e.target.value)} /></div>
        </div>
        {['Resolved','Closed'].includes(form.status) && <>
          <div><label className="text-xs text-gray-400 uppercase block mb-1">Resolved Date</label><Input type="date" value={form.resolved_date||''} onChange={e=>set('resolved_date',e.target.value)} /></div>
          <div><label className="text-xs text-gray-400 uppercase block mb-1">Resolution Notes</label>{ta('resolution_notes','How was this resolved...')}</div>
        </>}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={()=>onSave(form)}>Save Issue</Button>
        </div>
      </div>
    </DialogContent>
  );
}

export default function AdminQAIssues() {
  const qc = useQueryClient();
  const [sevFilter, setSevFilter]   = useState('all');
  const [statFilter, setStatFilter] = useState('Open');
  const [typeFilter, setTypeFilter] = useState('all');
  const [modFilter, setModFilter]   = useState('all');
  const [search, setSearch]         = useState('');
  const [modal, setModal]           = useState(null);

  const { data: issues = [] }    = useQuery({ queryKey:['QAIssues'],    queryFn:()=>base44.entities.QAIssues.list('-opened_date',300) });
  const { data: testCases = [] } = useQuery({ queryKey:['QATestCases'],  queryFn:()=>base44.entities.QATestCases.list() });
  const { data: runs = [] }      = useQuery({ queryKey:['QATestRuns'],   queryFn:()=>base44.entities.QATestRuns.list('-started_at',100) });

  const save = useMutation({
    mutationFn: f => f.id ? base44.entities.QAIssues.update(f.id,f) : base44.entities.QAIssues.create(f),
    onSuccess: ()=>{ qc.invalidateQueries({queryKey:['QAIssues']}); setModal(null); },
  });

  const tcById = useMemo(()=>Object.fromEntries(testCases.map(t=>[t.id,t])),[testCases]);
  const tcByTestId = useMemo(()=>Object.fromEntries(testCases.map(t=>[t.test_id,t])),[testCases]);

  const filtered = useMemo(()=>issues.filter(i=>{
    if(sevFilter!=='all'&&i.severity!==sevFilter) return false;
    if(statFilter!=='all'&&i.status!==statFilter) return false;
    if(typeFilter!=='all'&&i.issue_type!==typeFilter) return false;
    if(modFilter!=='all'&&i.module_tag!==modFilter) return false;
    if(search&&!`${i.title} ${i.page_route||''} ${i.entity_name||''}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }),[issues,sevFilter,statFilter,typeFilter,modFilter,search]);

  const openCrit = issues.filter(i=>i.status==='Open'&&i.severity==='Critical').length;
  const openBlockers = issues.filter(i=>i.status==='Open'&&i.priority==='P0').length;

  // Highlight issues linked to high-visibility test cases
  const isHighVis = (issue) => {
    if (!issue.linked_test_case_id) return false;
    const tc = tcById[issue.linked_test_case_id];
    return tc && HIGH_VIS_TC_IDS.includes(tc.test_id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <QANav current="AdminQAIssues" />
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Issues</h1>
            <div className="flex gap-3 mt-1">
              <span className="text-sm text-gray-400">{issues.filter(i=>i.status==='Open').length} open</span>
              {openCrit>0&&<span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">{openCrit} critical</span>}
              {openBlockers>0&&<span className="text-xs bg-red-700 text-white px-2 py-0.5 rounded-full font-bold">{openBlockers} P0</span>}
            </div>
          </div>
          <Button onClick={()=>setModal({})} className="gap-2"><Plus className="w-4 h-4"/>New Issue</Button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-center">
          <Input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} className="w-44 h-8 text-sm" />
          <Select value={statFilter} onValueChange={setStatFilter}>
            <SelectTrigger className="w-32 h-8 text-sm"><SelectValue/></SelectTrigger>
            <SelectContent><SelectItem value="all">All Status</SelectItem>{STATUSES.map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={sevFilter} onValueChange={setSevFilter}>
            <SelectTrigger className="w-28 h-8 text-sm"><SelectValue placeholder="Severity"/></SelectTrigger>
            <SelectContent><SelectItem value="all">All Sev</SelectItem>{SEVERITIES.map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40 h-8 text-sm"><SelectValue placeholder="Type"/></SelectTrigger>
            <SelectContent><SelectItem value="all">All Types</SelectItem>{ISSUE_TYPES.map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={modFilter} onValueChange={setModFilter}>
            <SelectTrigger className="w-36 h-8 text-sm"><SelectValue placeholder="Module"/></SelectTrigger>
            <SelectContent><SelectItem value="all">All Modules</SelectItem>{MODULES.map(m=><SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
          </Select>
          <span className="ml-auto text-xs text-gray-400">{filtered.length} issues</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {filtered.length===0
            ? <div className="py-16 text-center text-gray-400">No issues match filters</div>
            : <div className="divide-y divide-gray-100">
                {filtered.map(issue=>{
                  const tc = tcById[issue.linked_test_case_id];
                  const hv = isHighVis(issue);
                  return (
                    <div key={issue.id} className={`px-4 py-3 flex items-start gap-3 hover:bg-gray-50 cursor-pointer ${hv?'border-l-2 border-red-400':''}`} onClick={()=>setModal(issue)}>
                      <div className="flex flex-col gap-1 shrink-0 pt-0.5">
                        <SeverityBadge severity={issue.severity} />
                        <span className="text-xs text-gray-400 font-mono">{issue.priority}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {hv && <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-medium">⚠ High-Vis</span>}
                          <p className="text-sm font-medium text-gray-800">{issue.title}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {issue.module_tag&&<span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{issue.module_tag}</span>}
                          {issue.issue_type&&<span className="text-xs text-gray-400">{issue.issue_type}</span>}
                          {issue.page_route&&<span className="text-xs font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{issue.page_route}</span>}
                          {tc&&<span className="text-xs text-gray-400">→ {tc.test_id}</span>}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ISSUE_STATUS_STYLE[issue.status]||''}`}>{issue.status}</span>
                        <span className="text-xs text-gray-300">{issue.opened_date}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 mt-1" />
                    </div>
                  );
                })}
              </div>
          }
        </div>
      </div>

      {modal!==null&&(
        <Dialog open onOpenChange={()=>setModal(null)}>
          <IssueModal issue={modal?.id?modal:null} testCases={testCases} runs={runs} onClose={()=>setModal(null)} onSave={f=>save.mutate(f)} />
        </Dialog>
      )}
    </div>
  );
}
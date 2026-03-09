import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import QANav from '@/components/qa/QANav';
import { PriorityBadge, ResultBadge } from '@/components/qa/QABadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2, XCircle, Clock, ShieldCheck, ShieldX, ShieldAlert, AlertTriangle, Plus, RefreshCw } from 'lucide-react';
import { createPageUrl } from '@/utils';

const GO_LIVE = {
  'Ready for Sale':         { icon: ShieldCheck, bg:'bg-green-600',  text:'text-white', border:'border-green-700',  desc:'All critical tests passing. Ready for live sales traffic.' },
  'Ready for Beta':         { icon: ShieldCheck, bg:'bg-blue-600',   text:'text-white', border:'border-blue-700',   desc:'80%+ of P0s passing with no critical security issues.' },
  'Ready for Internal Use': { icon: ShieldAlert, bg:'bg-yellow-500', text:'text-white', border:'border-yellow-600', desc:'50%+ of P0s passing. Suitable for internal NTA use only.' },
  'At Risk':                { icon: ShieldAlert, bg:'bg-orange-500', text:'text-white', border:'border-orange-600', desc:'Some P0s passing but sale/beta conditions not yet met.' },
  'Not Ready':              { icon: ShieldX,     bg:'bg-gray-400',   text:'text-white', border:'border-gray-500',   desc:'Insufficient testing completed. Not ready for any use.' },
};

const FLOW_COLORS = {
  1:'blue', 2:'red', 3:'purple', 4:'orange', 5:'slate'
};
const FLOW_COLOR_CLASSES = {
  blue:   {border:'border-blue-200',header:'bg-blue-50',badge:'bg-blue-600 text-white',bar:'bg-blue-500',text:'text-blue-700'},
  red:    {border:'border-red-200',header:'bg-red-50',badge:'bg-red-600 text-white',bar:'bg-red-500',text:'text-red-700'},
  purple: {border:'border-purple-200',header:'bg-purple-50',badge:'bg-purple-600 text-white',bar:'bg-purple-500',text:'text-purple-700'},
  orange: {border:'border-orange-200',header:'bg-orange-50',badge:'bg-orange-500 text-white',bar:'bg-orange-500',text:'text-orange-700'},
  slate:  {border:'border-slate-200',header:'bg-slate-50',badge:'bg-slate-700 text-white',bar:'bg-slate-600',text:'text-slate-700'},
};

const SALE_GATES   = ['QA-008','QA-010','QA-013','QA-038','QA-039'];
const BETA_MINP0   = 0.8;
const INTERN_MINP0 = 0.5;

function ReleaseModal({ release, onClose, onSave }) {
  const isNew = !release?.id;
  const [form, setForm] = useState(release||{release_name:'',build_version:'',go_live_status:'Not Ready',notes:''});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return (
    <DialogContent className="max-w-md">
      <DialogHeader><DialogTitle>{isNew?'New Release':'Edit Release'}</DialogTitle></DialogHeader>
      <div className="space-y-3 text-sm">
        <div><label className="text-xs text-gray-400 uppercase block mb-1">Release Name</label><Input value={form.release_name} onChange={e=>set('release_name',e.target.value)} /></div>
        <div><label className="text-xs text-gray-400 uppercase block mb-1">Build Version</label><Input value={form.build_version||''} onChange={e=>set('build_version',e.target.value)} placeholder="0.1.0" /></div>
        <div><label className="text-xs text-gray-400 uppercase block mb-1">Go-Live Status</label>
          <Select value={form.go_live_status} onValueChange={v=>set('go_live_status',v)}>
            <SelectTrigger><SelectValue/></SelectTrigger>
            <SelectContent>{Object.keys(GO_LIVE).map(k=><SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><label className="text-xs text-gray-400 uppercase block mb-1">Notes</label><textarea value={form.notes||''} onChange={e=>set('notes',e.target.value)} className="w-full border rounded px-3 py-2 text-sm min-h-[60px] resize-y focus:outline-none focus:ring-1 focus:ring-blue-400" /></div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={()=>onSave(form)}>Save</Button>
        </div>
      </div>
    </DialogContent>
  );
}

export default function AdminQAReadiness() {
  const qc = useQueryClient();
  const [relModal, setRelModal] = useState(null);
  const [recalcing, setRecalcing] = useState(false);

  const { data: releases=[] }  = useQuery({ queryKey:['QAReleaseStatus'], queryFn:()=>base44.entities.QAReleaseStatus.list('-last_updated') });
  const { data: issues=[] }    = useQuery({ queryKey:['QAIssues'],        queryFn:()=>base44.entities.QAIssues.list('-opened_date',200) });
  const { data: runs=[] }      = useQuery({ queryKey:['QATestRuns'],      queryFn:()=>base44.entities.QATestRuns.list('-started_at',500) });
  const { data: tests=[] }     = useQuery({ queryKey:['QATestCases'],     queryFn:()=>base44.entities.QATestCases.list() });
  const { data: flows=[] }     = useQuery({ queryKey:['QAMustPassFlows'], queryFn:()=>base44.entities.QAMustPassFlows.filter({is_active:true}) });

  const saveRelease = useMutation({
    mutationFn: f => f.id ? base44.entities.QAReleaseStatus.update(f.id,{...f,last_updated:new Date().toISOString()}) : base44.entities.QAReleaseStatus.create({...f,last_updated:new Date().toISOString()}),
    onSuccess: ()=>{ qc.invalidateQueries({queryKey:['QAReleaseStatus']}); setRelModal(null); },
  });

  const tcByTestId = useMemo(()=>Object.fromEntries(tests.map(t=>[t.test_id,t])),[tests]);
  const latestByCase = useMemo(()=>{
    const m={};
    for(const r of runs) { if(!m[r.test_case_id]||r.started_at>m[r.test_case_id].started_at) m[r.test_case_id]=r; }
    return m;
  },[runs]);

  const getResult = (testId)=>{
    const tc=tcByTestId[testId];
    return tc?(latestByCase[tc.id]?.result||'Not Run'):'Not Run';
  };

  const rel = releases[0];
  const goLiveCfg = GO_LIVE[rel?.go_live_status||'Not Ready'];
  const GoLiveIcon = goLiveCfg.icon;

  const openIssues      = issues.filter(i=>i.status==='Open');
  const critIssues      = openIssues.filter(i=>i.severity==='Critical');
  const critBilling     = critIssues.filter(i=>i.issue_type==='Billing Bug');
  const dataIso         = openIssues.filter(i=>i.issue_type==='Data Isolation Bug');
  const critSecurity    = critIssues.filter(i=>['Data Isolation Bug','Permission Bug'].includes(i.issue_type));

  const p0Tests = tests.filter(t=>t.is_active&&(t.priority||'').includes('P0'));
  const p0Pass  = p0Tests.filter(t=>latestByCase[t.id]?.result==='Pass').length;
  const p0Rate  = p0Tests.length?p0Pass/p0Tests.length:0;

  // Flow data
  const flowData = useMemo(()=>{
    const sorted=[...flows].sort((a,b)=>(a.display_order||0)-(b.display_order||0));
    return sorted.map((f,i)=>{
      const ids=(()=>{ try{return JSON.parse(f.included_test_ids_json||'[]');}catch(_){return[];} })();
      const results=ids.map(id=>getResult(id));
      const pass=results.filter(r=>r==='Pass').length;
      const fail=results.filter(r=>r==='Fail').length;
      const blocked=results.filter(r=>r==='Blocked').length;
      const pct=ids.length?Math.round((pass/ids.length)*100):0;
      return {...f,ids,results,pass,fail,blocked,pct,colorKey:f.color||['blue','red','purple','orange','slate'][i%5]};
    });
  },[flows,tests,runs]);

  // Readiness rules
  const SALE_RULES = [
    {id:'no-crit',         label:'Zero open Critical issues',              pass:critIssues.length===0},
    {id:'no-crit-billing', label:'Zero open Critical Billing Bug issues',  pass:critBilling.length===0},
    {id:'no-data-iso',     label:'Zero open Data Isolation Bug issues',    pass:dataIso.length===0},
    {id:'qa-008',          label:'QA-008 Closed Won flow passing',         pass:getResult('QA-008')==='Pass'},
    {id:'qa-010',          label:'QA-010 Direct Signup passing',           pass:getResult('QA-010')==='Pass'},
    {id:'qa-013',          label:'QA-013 Paid Invoice passing',            pass:getResult('QA-013')==='Pass'},
    {id:'qa-038',          label:'QA-038 Client Isolation passing',        pass:getResult('QA-038')==='Pass'},
    {id:'qa-039',          label:'QA-039 Reseller Isolation passing',      pass:getResult('QA-039')==='Pass'},
  ];
  const BETA_RULES = [
    {id:'p0-exist',        label:`All P0 tests exist (${p0Tests.length}/20+ required)`, pass:p0Tests.length>=20},
    {id:'p0-80pct',        label:`80%+ of P0 tests passing (${p0Pass}/${p0Tests.length} = ${Math.round(p0Rate*100)}%)`, pass:p0Rate>=BETA_MINP0},
    {id:'no-crit-sec',     label:'Zero open Critical security/isolation issues',          pass:critSecurity.length===0},
  ];
  const INTERNAL_RULES = [
    {id:'p0-50pct', label:`50%+ of P0 tests passing (${Math.round(p0Rate*100)}%)`, pass:p0Rate>=INTERN_MINP0},
    {id:'qa-001',   label:'QA-001 Admin Login passing',                               pass:getResult('QA-001')==='Pass'},
  ];

  const recalculate = async () => {
    setRecalcing(true);
    await base44.functions.invoke('qaAutomations', { action: 'recalculate' });
    qc.invalidateQueries({queryKey:['QAReleaseStatus']});
    setRecalcing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <QANav current="AdminQAReadiness" />
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Release Readiness</h1>
            <p className="text-sm text-gray-400">Go / No-Go decision center for NTA platform launch</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={recalculate} disabled={recalcing} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${recalcing?'animate-spin':''}`}/>Recalculate
            </Button>
            <Button onClick={()=>setRelModal({})} className="gap-2"><Plus className="w-4 h-4"/>New Release</Button>
          </div>
        </div>

        {/* Go-Live Banner */}
        {rel&&(
          <div className={`rounded-xl border p-5 mb-6 flex items-center gap-4 ${goLiveCfg.bg} ${goLiveCfg.border} ${goLiveCfg.text}`}>
            <GoLiveIcon className="w-10 h-10 shrink-0" />
            <div className="flex-1">
              <p className="text-2xl font-black tracking-tight">{rel.release_name} — {goLiveCfg.label}</p>
              <p className="opacity-80 text-sm">{goLiveCfg.desc}</p>
              {rel.notes&&<p className="opacity-70 text-xs mt-1 italic">{rel.notes}</p>}
            </div>
            <div className="text-right shrink-0">
              <p className="text-3xl font-black">{rel.readiness_score??0}%</p>
              <p className="text-xs opacity-70">Readiness Score</p>
              <p className="text-xs opacity-60 mt-1">Build {rel.build_version||'—'}</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0 bg-white/20 border-white/40 hover:bg-white/30" onClick={()=>setRelModal(rel)}>Edit</Button>
          </div>
        )}

        {/* Score Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {l:'P0 Tests Passing',v:`${p0Pass}/${p0Tests.length}`,c:p0Rate>=0.8?'text-green-600':p0Rate>=0.5?'text-orange-600':'text-red-600'},
            {l:'Must-Pass Passed', v:`${rel?.must_pass_passed??0}/${rel?.must_pass_total??0}`, c:'text-blue-600'},
            {l:'Critical Issues',  v:critIssues.length, c:critIssues.length>0?'text-red-600':'text-green-600'},
            {l:'Data Iso Issues',  v:dataIso.length, c:dataIso.length>0?'text-red-600':'text-green-600'},
          ].map(s=>(
            <div key={s.l} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold ${s.c}`}>{s.v}</div>
              <div className="text-xs text-gray-400 mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Must-pass flows */}
        <h2 className="text-base font-semibold text-gray-800 mb-3">Must-Pass Flows</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
          {flowData.map(flow=>{
            const c = FLOW_COLOR_CLASSES[flow.colorKey]||FLOW_COLOR_CLASSES.blue;
            return (
              <div key={flow.id} className={`bg-white rounded-xl border ${c.border} overflow-hidden`}>
                <div className={`px-4 py-2.5 border-b ${c.header} flex items-center justify-between`}>
                  <span className={`text-sm font-semibold ${c.text}`}>{flow.flow_name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.badge}`}>{flow.pct}%</span>
                </div>
                <div className="px-4 py-3">
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                    <div className={`h-1.5 rounded-full ${c.bar}`} style={{width:`${flow.pct}%`}} />
                  </div>
                  <div className="space-y-1">
                    {flow.ids.map((id,idx)=>{
                      const r=flow.results[idx];
                      const tc=tcByTestId[id];
                      return (
                        <div key={id} className="flex items-center gap-2">
                          {r==='Pass'&&<CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0"/>}
                          {r==='Fail'&&<XCircle className="w-3.5 h-3.5 text-red-500 shrink-0"/>}
                          {r==='Not Run'&&<Clock className="w-3.5 h-3.5 text-gray-300 shrink-0"/>}
                          {r==='Blocked'&&<AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0"/>}
                          <span className="text-xs font-mono text-gray-400 w-14 shrink-0">{id}</span>
                          <span className="text-xs text-gray-700 truncate">{tc?.name||id}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Decision gates */}
        <h2 className="text-base font-semibold text-gray-800 mb-3">Release Gate Checklist</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {[{title:'Ready for Sale',rules:SALE_RULES,color:'green'},{title:'Ready for Beta',rules:BETA_RULES,color:'blue'},{title:'Ready for Internal Use',rules:INTERNAL_RULES,color:'yellow'}].map(({title,rules,color})=>{
            const allPass=rules.every(r=>r.pass);
            const passing=rules.filter(r=>r.pass).length;
            return (
              <div key={title} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className={`px-4 py-3 border-b flex items-center justify-between ${allPass?'bg-green-50':''}`}>
                  <span className="font-semibold text-gray-800 text-sm">{title}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${allPass?'bg-green-600 text-white':'bg-gray-200 text-gray-600'}`}>{passing}/{rules.length}</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {rules.map(rule=>(
                    <div key={rule.id} className="px-4 py-2.5 flex items-center gap-2">
                      {rule.pass?<CheckCircle2 className="w-4 h-4 text-green-500 shrink-0"/>:<XCircle className="w-4 h-4 text-red-400 shrink-0"/>}
                      <span className={`text-xs ${rule.pass?'text-gray-500':'text-red-700 font-medium'}`}>{rule.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* P0 Tests */}
        <h2 className="text-base font-semibold text-gray-800 mb-3">All P0 Critical Tests</h2>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-400 uppercase">
                <tr>{['Test','Name','Group','Latest Result','Role'].map(h=><th key={h} className="px-4 py-2.5 text-left font-medium">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {p0Tests.map(t=>{
                  const res=latestByCase[t.id]?.result||'Not Run';
                  return (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-500">{t.test_id}</td>
                      <td className="px-4 py-2.5 font-medium text-gray-800">{t.name}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-400">{t.test_group}</td>
                      <td className="px-4 py-2.5"><ResultBadge result={res}/></td>
                      <td className="px-4 py-2.5 text-xs text-gray-400">{t.role}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Open critical issues */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Open Critical Issues</h2>
              <a href={createPageUrl('AdminQAIssues')} className="text-xs text-blue-500 hover:underline">Manage →</a>
            </div>
            {critIssues.length===0
              ? <div className="py-10 text-center"><CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-2"/><p className="text-sm text-gray-400">No critical issues open</p></div>
              : <div className="divide-y divide-gray-50">{critIssues.map(i=>(
                  <div key={i.id} className="px-4 py-3 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5"/>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{i.title}</p>
                      <p className="text-xs text-gray-400">{i.module_tag} · {i.issue_type}</p>
                    </div>
                    <span className="text-xs font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded shrink-0">{i.page_route||'—'}</span>
                  </div>
                ))}</div>
            }
          </div>

          {/* Release history */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b"><h2 className="font-semibold text-gray-800">Release History</h2></div>
            {releases.length===0
              ? <div className="py-10 text-center text-sm text-gray-400">No releases yet</div>
              : <div className="divide-y divide-gray-50">{releases.map(r=>{
                  const cfg=GO_LIVE[r.go_live_status||'Not Ready'];
                  const Icon=cfg.icon;
                  return (
                    <div key={r.id} className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50" onClick={()=>setRelModal(r)}>
                      <Icon className={`w-4 h-4 shrink-0 ${r.go_live_status==='Ready for Sale'?'text-green-600':r.go_live_status==='Not Ready'?'text-gray-400':'text-orange-500'}`}/>
                      <div className="flex-1"><p className="text-sm font-medium text-gray-800">{r.release_name}</p><p className="text-xs text-gray-400">Build {r.build_version||'—'} · Score {r.readiness_score??0}%</p></div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${cfg.bg} ${cfg.text}`}>{cfg.label||r.go_live_status}</span>
                    </div>
                  );
                })}</div>
            }
          </div>
        </div>
      </div>

      {relModal!==null&&(
        <Dialog open onOpenChange={()=>setRelModal(null)}>
          <ReleaseModal release={relModal?.id?relModal:null} onClose={()=>setRelModal(null)} onSave={f=>saveRelease.mutate(f)} />
        </Dialog>
      )}
    </div>
  );
}
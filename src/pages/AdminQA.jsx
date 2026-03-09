import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import QANav from '@/components/qa/QANav';
import { PriorityBadge, ResultBadge, SeverityBadge, RESULT_STYLE, SEVERITY_STYLE, ISSUE_STATUS_STYLE } from '@/components/qa/QABadge';
import { createPageUrl } from '@/utils';
import { CheckCircle2, XCircle, Clock, AlertTriangle, TrendingUp, Play, Star, ChevronRight, Shield, ShieldCheck, ShieldX, ShieldAlert } from 'lucide-react';

const GO_LIVE_CONFIG = {
  'Ready for Sale':          { icon: ShieldCheck, bg: 'bg-green-600', text: 'text-white', label: 'Ready for Sale' },
  'Ready for Beta':          { icon: ShieldCheck, bg: 'bg-blue-600',  text: 'text-white', label: 'Ready for Beta' },
  'Ready for Internal Use':  { icon: ShieldAlert, bg: 'bg-yellow-500',text: 'text-white', label: 'Ready for Internal Use' },
  'At Risk':                 { icon: ShieldAlert, bg: 'bg-orange-500',text: 'text-white', label: 'At Risk' },
  'Not Ready':               { icon: ShieldX,     bg: 'bg-gray-400',  text: 'text-white', label: 'Not Ready' },
};

const FLOW_COLORS = {
  blue:   { border:'border-blue-200',   header:'bg-blue-50',   badge:'bg-blue-600 text-white',   bar:'bg-blue-500',   text:'text-blue-700' },
  red:    { border:'border-red-200',    header:'bg-red-50',    badge:'bg-red-600 text-white',    bar:'bg-red-500',    text:'text-red-700' },
  purple: { border:'border-purple-200', header:'bg-purple-50', badge:'bg-purple-600 text-white', bar:'bg-purple-500', text:'text-purple-700' },
  orange: { border:'border-orange-200', header:'bg-orange-50', badge:'bg-orange-500 text-white', bar:'bg-orange-500', text:'text-orange-700' },
  slate:  { border:'border-slate-200',  header:'bg-slate-50',  badge:'bg-slate-700 text-white',  bar:'bg-slate-600',  text:'text-slate-700' },
};

const HIGH_VIS_IDS = ['QA-008','QA-010','QA-013','QA-014','QA-015','QA-019','QA-021','QA-031','QA-032','QA-036','QA-037','QA-038','QA-039'];

function KpiCard({ label, value, sub, color='text-gray-900', href }) {
  const inner = (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow h-full">
      <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">{label}</div>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
  return href ? <a href={href} className="block">{inner}</a> : inner;
}

export default function AdminQA() {
  const { data: tests = [] }   = useQuery({ queryKey: ['QATestCases'],   queryFn: () => base44.entities.QATestCases.list() });
  const { data: runs = [] }    = useQuery({ queryKey: ['QATestRuns'],    queryFn: () => base44.entities.QATestRuns.list('-started_at', 200) });
  const { data: issues = [] }  = useQuery({ queryKey: ['QAIssues'],      queryFn: () => base44.entities.QAIssues.list('-opened_date', 100) });
  const { data: releases = [] }= useQuery({ queryKey: ['QAReleaseStatus'],queryFn: () => base44.entities.QAReleaseStatus.list('-last_updated',1) });
  const { data: flows = [] }   = useQuery({ queryKey: ['QAMustPassFlows'],queryFn: () => base44.entities.QAMustPassFlows.filter({ is_active: true }) });

  const tcByTestId = useMemo(() => Object.fromEntries(tests.map(t => [t.test_id, t])), [tests]);
  const tcById     = useMemo(() => Object.fromEntries(tests.map(t => [t.id, t])),      [tests]);

  const latestByCase = useMemo(() => {
    const m = {};
    for (const r of runs) {
      if (!m[r.test_case_id] || r.started_at > m[r.test_case_id].started_at) m[r.test_case_id] = r;
    }
    return m;
  }, [runs]);

  const getResult = (testId) => {
    const tc = tcByTestId[testId];
    return tc ? (latestByCase[tc.id]?.result || 'Not Run') : 'Not Run';
  };

  const oneWeekAgo = new Date(Date.now() - 7*24*60*60*1000).toISOString();
  const passedWeek = runs.filter(r => r.result === 'Pass' && r.started_at >= oneWeekAgo).length;
  const failedWeek = runs.filter(r => r.result === 'Fail' && r.started_at >= oneWeekAgo).length;
  const openIssues = issues.filter(i => i.status === 'Open');
  const critIssues = openIssues.filter(i => i.severity === 'Critical');
  const rel = releases[0];
  const readiness = rel?.readiness_score ?? 0;
  const goLiveCfg = GO_LIVE_CONFIG[rel?.go_live_status || 'Not Ready'];
  const GoLiveIcon = goLiveCfg.icon;

  const highVisTests = tests.filter(t => t.is_high_visibility || t.high_visibility || HIGH_VIS_IDS.includes(t.test_id));
  const recentFailed = runs.filter(r => r.result === 'Fail').slice(0, 8);
  const critHighIssues = issues.filter(i => ['Critical','High'].includes(i.severity) && i.status !== 'Closed').slice(0, 8);

  // Must-pass flows
  const flowData = useMemo(() => {
    const sorted = [...flows].sort((a,b) => (a.display_order||0)-(b.display_order||0));
    return sorted.map(f => {
      const ids = (() => { try { return JSON.parse(f.included_test_ids_json||'[]'); } catch(_) { return []; } })();
      const results = ids.map(id => getResult(id));
      const pass = results.filter(r => r === 'Pass').length;
      const fail = results.filter(r => r === 'Fail').length;
      const blocked = results.filter(r => r === 'Blocked').length;
      const pct = ids.length ? Math.round((pass/ids.length)*100) : 0;
      const lastTestedDates = ids.map(id => { const tc=tcByTestId[id]; return tc ? latestByCase[tc.id]?.started_at : null; }).filter(Boolean);
      const lastTested = lastTestedDates.length ? lastTestedDates.sort().at(-1) : null;
      const status = fail > 0 ? 'Fail' : blocked > 0 ? 'Blocked' : pass === ids.length && ids.length > 0 ? 'Pass' : 'Not Run';
      return { ...f, ids, results, pass, fail, blocked, pct, lastTested, status };
    });
  }, [flows, tests, runs]);

  return (
    <div className="min-h-screen bg-gray-50">
      <QANav current="AdminQA" />
      <div className="max-w-7xl mx-auto px-6 pb-12">

        {/* Header + go-live */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">QA Dashboard</h1>
            <p className="text-sm text-gray-400">NTA platform quality assurance — admin only</p>
          </div>
          {rel && (
            <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl ${goLiveCfg.bg} ${goLiveCfg.text} font-bold text-sm`}>
              <GoLiveIcon className="w-5 h-5" />
              {rel.release_name}: {goLiveCfg.label}
            </div>
          )}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <KpiCard label="Active Tests"      value={tests.filter(t=>t.is_active).length} href={createPageUrl('AdminQATests')} />
          <KpiCard label="Passed (7d)"       value={passedWeek} color="text-green-600" href={createPageUrl('AdminQARuns')} />
          <KpiCard label="Failed (7d)"       value={failedWeek} color={failedWeek>0?'text-red-600':'text-green-600'} href={createPageUrl('AdminQARuns')} />
          <KpiCard label="Critical Issues"   value={critIssues.length} color={critIssues.length>0?'text-red-600':'text-green-600'} href={createPageUrl('AdminQAIssues')} />
          <KpiCard label="Readiness Score"   value={`${readiness}%`} color={readiness>=80?'text-green-600':readiness>=50?'text-orange-600':'text-red-600'} href={createPageUrl('AdminQAReadiness')} />
          <KpiCard label="Last Regression"   value={rel?.last_regression_run_at ? new Date(rel.last_regression_run_at).toLocaleDateString() : '—'} sub={rel?.build_version} />
        </div>

        {/* Must-pass flows */}
        <h2 className="text-base font-semibold text-gray-800 mb-3">Must-Pass Flows</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
          {flowData.map((flow, i) => {
            const colorKey = flow.color || ['blue','red','purple','orange','slate'][i%5];
            const c = FLOW_COLORS[colorKey] || FLOW_COLORS.blue;
            return (
              <div key={flow.id} className={`bg-white rounded-xl border ${c.border} overflow-hidden`}>
                <div className={`px-4 py-2.5 border-b ${c.header} flex items-center justify-between`}>
                  <span className={`text-sm font-semibold ${c.text}`}>{flow.flow_name}</span>
                  <div className="flex items-center gap-1.5">
                    <ResultBadge result={flow.status} />
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.badge}`}>{flow.pct}%</span>
                  </div>
                </div>
                <div className="px-4 py-3">
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                    <div className={`h-1.5 rounded-full ${c.bar}`} style={{width:`${flow.pct}%`}} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                    <span className="text-green-600 font-medium">{flow.pass} pass</span>
                    {flow.fail > 0 && <span className="text-red-600 font-medium">{flow.fail} fail</span>}
                    {flow.blocked > 0 && <span className="text-orange-600 font-medium">{flow.blocked} blocked</span>}
                    <span>{flow.ids.length} tests</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {flow.ids.map((id, idx) => {
                      const r = flow.results[idx];
                      const dot = r==='Pass'?'bg-green-500':r==='Fail'?'bg-red-500':r==='Blocked'?'bg-orange-400':'bg-gray-200';
                      return <span key={id} title={`${id}: ${r}`} className={`inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded`}><span className={`w-1.5 h-1.5 rounded-full ${dot} inline-block`}/>{id}</span>;
                    })}
                  </div>
                  {flow.lastTested && <p className="text-xs text-gray-300 mt-2">Last tested {new Date(flow.lastTested).toLocaleDateString()}</p>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* High-visibility tests */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <h2 className="font-semibold text-gray-800">High-Visibility Tests</h2>
              <span className="ml-auto text-xs text-gray-400">{highVisTests.length} tests</span>
            </div>
            <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
              {highVisTests.map(t => {
                const res = latestByCase[t.id]?.result || 'Not Run';
                return (
                  <div key={t.id} className="px-4 py-2.5 flex items-center gap-3">
                    <PriorityBadge priority={t.priority} />
                    <span className="text-xs text-gray-400 font-mono w-14 shrink-0">{t.test_id}</span>
                    <span className="text-sm text-gray-800 flex-1 truncate">{t.name}</span>
                    <ResultBadge result={res} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Latest failed runs */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Latest Failed Runs</h2>
              <a href={createPageUrl('AdminQARuns')} className="text-xs text-blue-500 hover:underline">View all</a>
            </div>
            {recentFailed.length === 0
              ? <div className="py-10 text-center text-sm text-gray-400 flex flex-col items-center gap-1"><CheckCircle2 className="w-8 h-8 text-green-400"/>No failures</div>
              : <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                  {recentFailed.map(run => {
                    const tc = tcById[run.test_case_id];
                    return (
                      <div key={run.id} className="px-4 py-2.5 flex items-center gap-3">
                        <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{tc ? `${tc.test_id} — ${tc.name}` : '—'}</p>
                          <p className="text-xs text-gray-400">{run.environment} · {run.started_at ? new Date(run.started_at).toLocaleDateString() : '—'}</p>
                        </div>
                        <span className="text-xs text-gray-300 shrink-0">{run.build_version || '—'}</span>
                      </div>
                    );
                  })}
                </div>
            }
          </div>

          {/* Open critical/high issues */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Open Critical / High Issues</h2>
              <a href={createPageUrl('AdminQAIssues')} className="text-xs text-blue-500 hover:underline">View all</a>
            </div>
            {critHighIssues.length === 0
              ? <div className="py-10 text-center text-sm text-gray-400 flex flex-col items-center gap-1"><CheckCircle2 className="w-8 h-8 text-green-400"/>No critical issues</div>
              : <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                  {critHighIssues.map(i => (
                    <div key={i.id} className="px-4 py-2.5 flex items-start gap-3">
                      <SeverityBadge severity={i.severity} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{i.title}</p>
                        <p className="text-xs text-gray-400 truncate">{i.module_tag} · {i.issue_type} · {i.page_route || '—'}</p>
                      </div>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0 ${ISSUE_STATUS_STYLE[i.status]||''}`}>{i.status}</span>
                    </div>
                  ))}
                </div>
            }
          </div>

          {/* Release readiness summary */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Release Readiness</h2>
              <a href={createPageUrl('AdminQAReadiness')} className="text-xs text-blue-500 hover:underline flex items-center gap-1">Full report<ChevronRight className="w-3 h-3"/></a>
            </div>
            {rel ? (
              <div className="p-4 space-y-3">
                <div className={`flex items-center gap-3 p-3 rounded-lg ${goLiveCfg.bg} ${goLiveCfg.text}`}>
                  <GoLiveIcon className="w-6 h-6" />
                  <div><p className="font-bold">{goLiveCfg.label}</p><p className="text-xs opacity-75">Build {rel.build_version || '—'}</p></div>
                  <div className="ml-auto text-right"><p className="text-2xl font-black">{readiness}%</p><p className="text-xs opacity-75">Readiness</p></div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    {l:'Must-Pass',v:`${rel.must_pass_passed||0}/${rel.must_pass_total||0}`,c:'text-blue-600'},
                    {l:'Critical Issues',v:rel.critical_failures||0,c:rel.critical_failures>0?'text-red-600':'text-green-600'},
                    {l:'Passed',v:rel.passed_tests||0,c:'text-green-600'},
                    {l:'Failed',v:rel.failed_tests||0,c:rel.failed_tests>0?'text-red-600':'text-gray-500'},
                  ].map(s=>(
                    <div key={s.l} className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className={`text-lg font-bold ${s.c}`}>{s.v}</div>
                      <div className="text-gray-400">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : <div className="py-10 text-center text-sm text-gray-400">No release created yet</div>}
          </div>
        </div>

        {/* Recent runs */}
        <div className="mt-6 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Recent Test Runs</h2>
            <a href={createPageUrl('AdminQARuns')} className="text-xs text-blue-500 hover:underline">View all</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-400 uppercase">
                <tr>{['Test','Group','Result','Env','Build','Date'].map(h=><th key={h} className="px-4 py-2.5 text-left font-medium">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {runs.slice(0,10).map(run=>{
                  const tc=tcById[run.test_case_id];
                  return (
                    <tr key={run.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5"><span className="font-mono text-xs text-gray-400 mr-2">{tc?.test_id}</span>{tc?.name||'—'}</td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">{tc?.test_group||'—'}</td>
                      <td className="px-4 py-2.5"><ResultBadge result={run.result} /></td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">{run.environment}</td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">{run.build_version||'—'}</td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">{run.started_at?new Date(run.started_at).toLocaleDateString():'—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {runs.length===0&&<div className="py-8 text-center text-sm text-gray-400">No runs yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
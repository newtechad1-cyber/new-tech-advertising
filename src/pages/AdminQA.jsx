import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import QANav from '@/components/qa/QANav';
import { createPageUrl } from '@/utils';
import {
  CheckCircle2, XCircle, AlertTriangle, Clock, TrendingUp,
  ShieldCheck, ShieldX, ShieldAlert, ChevronRight, Activity
} from 'lucide-react';

const TOP_RISK_MODULES = [
  { label: 'Billing & Payments', groups: ['Subscription Billing', 'Invoice and Payment'] },
  { label: 'Signup & Trial', groups: ['Direct Signup', 'Deal Closed Won'] },
  { label: 'Reseller Attribution', groups: ['Reseller Signup'] },
  { label: 'Data Isolation', groups: ['Data Isolation'] },
  { label: 'Content Generation', groups: ['Content Generation', 'Content Approval'] },
];

const RESULT_COLORS = {
  pass: 'text-green-600 bg-green-50 border-green-200',
  fail: 'text-red-600 bg-red-50 border-red-200',
  blocked: 'text-orange-600 bg-orange-50 border-orange-200',
  skipped: 'text-gray-500 bg-gray-50 border-gray-200',
  in_progress: 'text-blue-600 bg-blue-50 border-blue-200',
};

const GO_LIVE_CONFIG = {
  go: { label: 'GO', icon: ShieldCheck, color: 'text-green-600 bg-green-50 border-green-200' },
  no_go: { label: 'NO-GO', icon: ShieldX, color: 'text-red-600 bg-red-50 border-red-200' },
  conditional: { label: 'CONDITIONAL', icon: ShieldAlert, color: 'text-orange-600 bg-orange-50 border-orange-200' },
  pending: { label: 'PENDING', icon: Clock, color: 'text-gray-500 bg-gray-50 border-gray-200' },
};

function StatCard({ label, value, sub, color = 'text-gray-900', icon: Icon, href }) {
  const content = (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
        {Icon && <Icon className="w-4 h-4 text-gray-300" />}
      </div>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
}

export default function AdminQA() {
  const { data: testCases = [] } = useQuery({ queryKey: ['QATestCases'], queryFn: () => base44.entities.QATestCases.list() });
  const { data: runs = [] } = useQuery({ queryKey: ['QATestRuns'], queryFn: () => base44.entities.QATestRuns.list('-started_at', 100) });
  const { data: issues = [] } = useQuery({ queryKey: ['QAIssues'], queryFn: () => base44.entities.QAIssues.list('-opened_date') });
  const { data: releases = [] } = useQuery({ queryKey: ['QAReleaseStatus'], queryFn: () => base44.entities.QAReleaseStatus.list('-last_updated', 1) });

  const activeTests = testCases.filter(t => t.is_active !== false && t.status === 'active').length;
  const openIssues = issues.filter(i => i.status === 'open');
  const criticalIssues = openIssues.filter(i => i.severity === 'critical');
  const blockers = openIssues.filter(i => i.priority === 'blocker');

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const recentFailedRuns = runs.filter(r => r.result === 'fail' && r.started_at >= oneWeekAgo);

  const passCount = runs.filter(r => r.result === 'pass').length;
  const failCount = runs.filter(r => r.result === 'fail').length;
  const totalRuns = passCount + failCount;
  const readinessScore = totalRuns ? Math.round((passCount / totalRuns) * 100) : 0;

  const latestRelease = releases[0];
  const goLiveCfg = GO_LIVE_CONFIG[latestRelease?.go_live_status || 'pending'];
  const GoLiveIcon = goLiveCfg.icon;

  const lastRun = runs[0];

  // Module health
  const moduleHealth = TOP_RISK_MODULES.map(mod => {
    const modCases = testCases.filter(tc => mod.groups.includes(tc.test_group));
    const modCaseIds = new Set(modCases.map(t => t.id));
    const modRuns = runs.filter(r => modCaseIds.has(r.test_case_id));
    const latest = {};
    for (const r of modRuns) {
      if (!latest[r.test_case_id] || r.started_at > latest[r.test_case_id].started_at) {
        latest[r.test_case_id] = r;
      }
    }
    const latestResults = Object.values(latest);
    const passing = latestResults.filter(r => r.result === 'pass').length;
    const failing = latestResults.filter(r => r.result === 'fail').length;
    const total = modCases.length;
    const health = total ? Math.round((passing / total) * 100) : null;
    return { ...mod, passing, failing, total, health };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <QANav current="AdminQA" />
      <div className="max-w-7xl mx-auto px-6 pb-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">QA Dashboard</h1>
            <p className="text-sm text-gray-400 mt-0.5">NTA platform quality assurance — admin only</p>
          </div>
          {latestRelease && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm ${goLiveCfg.color}`}>
              <GoLiveIcon className="w-5 h-5" />
              {latestRelease.release_name}: {goLiveCfg.label}
            </div>
          )}
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <StatCard label="Active Tests" value={activeTests} icon={Activity} href={createPageUrl('AdminQATests')} />
          <StatCard label="Failed This Week" value={recentFailedRuns.length} color={recentFailedRuns.length > 0 ? 'text-red-600' : 'text-green-600'} icon={XCircle} href={createPageUrl('AdminQARuns')} />
          <StatCard label="Critical Issues" value={criticalIssues.length} color={criticalIssues.length > 0 ? 'text-red-600' : 'text-green-600'} icon={AlertTriangle} href={createPageUrl('AdminQAIssues')} />
          <StatCard label="Open Blockers" value={blockers.length} color={blockers.length > 0 ? 'text-red-700' : 'text-green-600'} icon={XCircle} href={createPageUrl('AdminQAIssues')} />
          <StatCard label="Readiness Score" value={`${readinessScore}%`} color={readinessScore >= 80 ? 'text-green-600' : readinessScore >= 60 ? 'text-orange-600' : 'text-red-600'} icon={TrendingUp} href={createPageUrl('AdminQAReadiness')} />
          <StatCard label="Last Run" value={lastRun ? new Date(lastRun.started_at).toLocaleDateString() : '—'} sub={lastRun?.result || ''} icon={Clock} href={createPageUrl('AdminQARuns')} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Module Health */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Top-Risk Module Health</h2>
              <span className="text-xs text-red-500 font-medium">HIGH PRIORITY</span>
            </div>
            <div className="divide-y divide-gray-50">
              {moduleHealth.map(mod => (
                <div key={mod.label} className="px-4 py-3 flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-800">{mod.label}</span>
                      <span className="text-xs text-gray-400">{mod.passing}/{mod.total} passing</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${mod.health >= 80 ? 'bg-green-500' : mod.health >= 50 ? 'bg-orange-400' : 'bg-red-500'}`}
                        style={{ width: `${mod.health ?? 0}%` }}
                      />
                    </div>
                  </div>
                  {mod.failing > 0 && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">{mod.failing} failing</span>
                  )}
                  {mod.health === 100 && (
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Latest Failed Tests */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Latest Failed Runs</h2>
              <a href={createPageUrl('AdminQARuns')} className="text-xs text-blue-500 hover:underline">View all</a>
            </div>
            {recentFailedRuns.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">No failures this week</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentFailedRuns.slice(0, 6).map(run => {
                  const tc = testCases.find(t => t.id === run.test_case_id);
                  return (
                    <div key={run.id} className="px-4 py-3 flex items-center gap-3">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{tc ? `${tc.test_id} — ${tc.name}` : run.test_case_id}</p>
                        <p className="text-xs text-gray-400">{run.environment} · {new Date(run.started_at).toLocaleDateString()}</p>
                      </div>
                      <span className="text-xs text-gray-400 shrink-0">{run.build_version || '—'}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Open Blockers */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Open Blockers & Critical Issues</h2>
              <a href={createPageUrl('AdminQAIssues')} className="text-xs text-blue-500 hover:underline">View all</a>
            </div>
            {criticalIssues.length === 0 && blockers.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400 flex flex-col items-center gap-1">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
                No critical blockers
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {[...blockers, ...criticalIssues.filter(i => i.priority !== 'blocker')].slice(0, 6).map(issue => (
                  <div key={issue.id} className="px-4 py-3 flex items-start gap-3">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-bold shrink-0 ${issue.priority === 'blocker' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'}`}>
                      {issue.priority === 'blocker' ? 'BLOCKER' : issue.severity.toUpperCase()}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{issue.title}</p>
                      <p className="text-xs text-gray-400 truncate">{issue.page_route || issue.entity_name || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Release Summary */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Release Readiness</h2>
              <a href={createPageUrl('AdminQAReadiness')} className="text-xs text-blue-500 hover:underline flex items-center gap-1">Full report <ChevronRight className="w-3 h-3" /></a>
            </div>
            {latestRelease ? (
              <div className="p-4 space-y-3">
                <div className={`flex items-center gap-3 p-3 rounded-lg border ${goLiveCfg.color}`}>
                  <GoLiveIcon className="w-6 h-6" />
                  <div>
                    <p className="font-bold">{latestRelease.release_name} — {goLiveCfg.label}</p>
                    <p className="text-xs opacity-75">Build {latestRelease.build_version || 'unversioned'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: 'Passed', value: latestRelease.passed_tests, color: 'text-green-600' },
                    { label: 'Failed', value: latestRelease.failed_tests, color: 'text-red-600' },
                    { label: 'Blocked', value: latestRelease.blocked_tests, color: 'text-orange-600' },
                  ].map(s => (
                    <div key={s.label} className="bg-gray-50 rounded-lg p-2">
                      <div className={`text-xl font-bold ${s.color}`}>{s.value ?? 0}</div>
                      <div className="text-xs text-gray-400">{s.label}</div>
                    </div>
                  ))}
                </div>
                {latestRelease.notes && <p className="text-xs text-gray-500 italic">{latestRelease.notes}</p>}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-sm text-gray-400">No release created yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Shield, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';

function HealthRow({ label, value, status }) {
  const colors = { good: 'text-green-400', warn: 'text-yellow-400', bad: 'text-red-400', neutral: 'text-gray-400' };
  const icons = {
    good: <CheckCircle className="w-3.5 h-3.5 text-green-500" />,
    warn: <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />,
    bad: <XCircle className="w-3.5 h-3.5 text-red-500" />,
    neutral: <div className="w-3.5 h-3.5 rounded-full bg-gray-700" />,
  };
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
      <div className="flex items-center gap-2">
        {icons[status] || icons.neutral}
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <span className={`text-xs font-medium ${colors[status] || colors.neutral}`}>{value}</span>
    </div>
  );
}

const GO_LIVE_STATUS_COLOR = {
  'Ready for Sale': 'bg-green-900/40 border-green-700 text-green-400',
  'Ready for Beta': 'bg-blue-900/40 border-blue-700 text-blue-400',
  'Ready for Internal Use': 'bg-yellow-900/40 border-yellow-700 text-yellow-400',
  'At Risk': 'bg-orange-900/40 border-orange-700 text-orange-400',
  'Not Ready': 'bg-red-900/40 border-red-700 text-red-400',
};

export default function FounderPlatformHealth() {
  const { data: qaRelease = [] } = useQuery({
    queryKey: ['founder-health-qa-release'],
    queryFn: () => base44.entities.QAReleaseStatus.list('-last_updated', 3),
  });

  const { data: qaIssues = [] } = useQuery({
    queryKey: ['founder-health-qa-issues'],
    queryFn: () => base44.entities.QAIssues.filter({ status: 'Open' }),
  });

  const { data: runs = [] } = useQuery({
    queryKey: ['founder-health-runs'],
    queryFn: () => base44.entities.AgentRuns.list('-created_date', 100),
  });

  const { data: testRuns = [] } = useQuery({
    queryKey: ['founder-health-test-runs'],
    queryFn: () => base44.entities.QATestRuns.list('-started_at', 50),
  });

  const { data: healthChecks = [] } = useQuery({
    queryKey: ['founder-health-checks'],
    queryFn: () => base44.entities.SystemHealthCheck.list('-created_date', 5),
  });

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const latestRelease = qaRelease[0];
  const readiness = latestRelease?.readiness_score ?? null;
  const goLive = latestRelease?.go_live_status ?? 'Not Ready';
  const lastRegression = latestRelease?.last_regression_run_at;

  const criticalIssues = qaIssues.filter(i => i.severity === 'Critical').length;
  const highIssues = qaIssues.filter(i => i.severity === 'High').length;
  const billingIssues = qaIssues.filter(i => i.module_tag === 'Billing' && i.status === 'Open').length;
  const dataIsoIssues = qaIssues.filter(i => i.issue_type === 'Data Isolation Bug' && i.status === 'Open').length;

  const failedRunsToday = runs.filter(r =>
    r.status === 'failed' && new Date(r.created_date) >= todayStart
  ).length;

  const lastHealthCheck = healthChecks[0];
  const healthStatus = lastHealthCheck?.overall_status || 'Unknown';

  const lastRegressionLabel = lastRegression
    ? new Date(lastRegression).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'Never';

  const glColors = GO_LIVE_STATUS_COLOR[goLive] || 'bg-gray-800 border-gray-700 text-gray-400';

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-4 h-4 text-rose-400" />
        <h2 className="text-sm font-bold text-white">Platform Health</h2>
      </div>

      {/* Go-Live Status — always visible */}
      <div className={`rounded-lg border p-3 mb-4 flex items-center justify-between ${glColors}`}>
        <div>
          <div className="text-xs text-gray-400 mb-0.5">Current Go-Live Status</div>
          <div className="text-sm font-bold">{goLive}</div>
        </div>
        {readiness !== null && (
          <div className="text-right">
            <div className="text-xs text-gray-400 mb-0.5">Readiness Score</div>
            <div className="text-2xl font-bold">{readiness}</div>
          </div>
        )}
      </div>

      {/* Health Rows */}
      <div className="flex-1">
        <HealthRow
          label="System Health"
          value={healthStatus}
          status={healthStatus === 'healthy' ? 'good' : healthStatus === 'Unknown' ? 'neutral' : 'warn'}
        />
        <HealthRow
          label="Failed Agent Runs Today"
          value={failedRunsToday}
          status={failedRunsToday === 0 ? 'good' : failedRunsToday <= 3 ? 'warn' : 'bad'}
        />
        <HealthRow
          label="Open Critical QA Issues"
          value={criticalIssues}
          status={criticalIssues === 0 ? 'good' : criticalIssues <= 1 ? 'warn' : 'bad'}
        />
        <HealthRow
          label="Open High QA Issues"
          value={highIssues}
          status={highIssues === 0 ? 'good' : highIssues <= 3 ? 'warn' : 'bad'}
        />
        <HealthRow
          label="Open Billing Issues"
          value={billingIssues}
          status={billingIssues === 0 ? 'good' : 'warn'}
        />
        <HealthRow
          label="Data Isolation Issues"
          value={dataIsoIssues}
          status={dataIsoIssues === 0 ? 'good' : 'bad'}
        />
        <HealthRow
          label="Last Regression Run"
          value={lastRegressionLabel}
          status={lastRegression ? 'neutral' : 'warn'}
        />
      </div>

      {/* Open Issues by Severity */}
      {qaIssues.length > 0 && (
        <div className="border-t border-gray-800 pt-3 mt-3">
          <p className="text-xs text-gray-500 mb-2">Recent open issues</p>
          <div className="space-y-1.5 max-h-28 overflow-y-auto">
            {qaIssues
              .filter(i => i.severity === 'Critical' || i.severity === 'High')
              .slice(0, 5)
              .map(i => (
                <div key={i.id} className={`flex items-center justify-between text-xs rounded-md px-2.5 py-1.5 border ${
                  i.severity === 'Critical'
                    ? 'bg-red-900/20 border-red-900/30'
                    : 'bg-orange-900/20 border-orange-900/30'
                }`}>
                  <span className="text-gray-300 truncate max-w-[65%]">{i.title}</span>
                  <span className={`font-medium flex-shrink-0 ${i.severity === 'Critical' ? 'text-red-400' : 'text-orange-400'}`}>
                    {i.severity}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
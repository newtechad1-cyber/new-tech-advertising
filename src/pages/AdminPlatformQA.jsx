import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CATEGORY_CONFIG = {
  public_page: { label: 'Public Page', color: '#8b5cf6', icon: '🌐' },
  onboarding_flow: { label: 'Onboarding Flow', color: '#06b6d4', icon: '🚀' },
  client_portal_page: { label: 'Client Portal', color: '#10b981', icon: '👥' },
  admin_page: { label: 'Admin Page', color: '#3b82f6', icon: '⚙️' },
  publishing_flow: { label: 'Publishing Flow', color: '#ef4444', icon: '📤' },
  automation_flow: { label: 'Automation Flow', color: '#f59e0b', icon: '🤖' },
  reporting_page: { label: 'Reporting Page', color: '#14b8a6', icon: '📊' },
  channel_connection_flow: { label: 'Channel Connection', color: '#ec4899', icon: '🔗' },
};

const STATUS_CONFIG = {
  verified: { label: 'Verified', badge: 'bg-emerald-100 text-emerald-700', color: '#10b981', icon: '✓' },
  partial: { label: 'Partial', badge: 'bg-yellow-100 text-yellow-700', color: '#f59e0b', icon: '◐' },
  failed: { label: 'Failed', badge: 'bg-red-100 text-red-700', color: '#ef4444', icon: '✗' },
  not_tested: { label: 'Not Tested', badge: 'bg-slate-100 text-slate-700', color: '#94a3b8', icon: '○' },
};

export default function AdminPlatformQA() {
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    base44.entities.PlatformQACheck.list('-qa_status', 100)
      .then(data => {
        setChecks(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600 text-sm animate-pulse">Loading QA status…</div>
      </div>
    );
  }

  // Filter checks
  let filtered = checks.filter(c => {
    if (filterStatus !== 'all' && c.qa_status !== filterStatus) return false;
    if (filterCategory !== 'all' && c.qa_category !== filterCategory) return false;
    if (searchTerm && !c.page_or_workflow_name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // KPIs
  const verified = checks.filter(c => c.qa_status === 'verified').length;
  const not_tested = checks.filter(c => c.qa_status === 'not_tested').length;
  const failed = checks.filter(c => c.qa_status === 'failed').length;
  const partial = checks.filter(c => c.qa_status === 'partial').length;
  const readinessScore = checks.length > 0
    ? Math.round((verified / checks.length) * 100)
    : 0;

  // Category distribution
  const categoryDistribution = Object.keys(CATEGORY_CONFIG).map(cat => ({
    name: CATEGORY_CONFIG[cat].label,
    verified: checks.filter(c => c.qa_category === cat && c.qa_status === 'verified').length,
    partial: checks.filter(c => c.qa_category === cat && c.qa_status === 'partial').length,
    failed: checks.filter(c => c.qa_category === cat && c.qa_status === 'failed').length,
    not_tested: checks.filter(c => c.qa_category === cat && c.qa_status === 'not_tested').length,
  })).filter(item => item.verified + item.partial + item.failed + item.not_tested > 0);

  // Risk alerts
  const alerts = [];

  const partialChecks = checks.filter(c => c.qa_status === 'partial');
  if (partialChecks.length > 0) {
    alerts.push({
      severity: 'medium',
      title: `${partialChecks.length} Verification(s) Partial - Missing Test Coverage`,
      description: partialChecks.slice(0, 3).map(c => c.page_or_workflow_name).join(', ') + (partialChecks.length > 3 ? ` and ${partialChecks.length - 3} more` : ''),
      action: 'Review incomplete test cases. Complete verification checklist for full confidence.',
    });
  }

  const failedChecks = checks.filter(c => c.qa_status === 'failed');
  if (failedChecks.length > 0) {
    alerts.push({
      severity: 'high',
      title: `${failedChecks.length} Test(s) FAILED - Blocking Release`,
      description: failedChecks.slice(0, 3).map(c => c.page_or_workflow_name).join(', ') + (failedChecks.length > 3 ? ` and ${failedChecks.length - 3} more` : ''),
      action: 'URGENT: Fix failing tests before release. Critical blockers must be resolved.',
    });
  }

  const notTestedCritical = checks.filter(c => c.qa_status === 'not_tested' && ['admin_page', 'publishing_flow', 'client_portal_page'].includes(c.qa_category));
  if (notTestedCritical.length > 0) {
    alerts.push({
      severity: 'high',
      title: `${notTestedCritical.length} Critical Path(s) Not Tested Yet`,
      description: 'Admin pages, publishing flows, and client portal features have zero test coverage.',
      action: 'Prioritize testing critical user journeys. Schedule verification tests immediately.',
    });
  }

  const mobileNotTested = checks.filter(c => !c.mobile_layout_verified);
  if (mobileNotTested.length > mobileNotTested.length / 2) {
    alerts.push({
      severity: 'medium',
      title: `Mobile Layout Testing Incomplete - ${mobileNotTested.length} Pages Need Verification`,
      description: 'Many pages missing mobile responsiveness verification.',
      action: 'Test on iOS (Safari) and Android (Chrome) browsers. Check touch targets and layout.',
    });
  }

  // Release readiness
  const releaseChecks = [
    { step: 'Navigation Verified', status: checks.filter(c => c.navigation_verified).length > checks.length * 0.9, icon: '🗺️' },
    { step: 'Channel Connections Healthy', status: checks.filter(c => c.qa_category === 'channel_connection_flow' && c.qa_status === 'verified').length > 0, icon: '🔗' },
    { step: 'Publishing Stable', status: checks.filter(c => c.qa_category === 'publishing_flow' && c.qa_status === 'verified').length > 0, icon: '📤' },
    { step: 'Client Portal Verified', status: checks.filter(c => c.qa_category === 'client_portal_page' && c.qa_status === 'verified').length > 0, icon: '👥' },
    { step: 'Safe to Scale', status: verified > checks.length * 0.8 && failed === 0, icon: '🚀' },
  ];

  const handleStatusUpdate = async (checkId, newStatus) => {
    await base44.entities.PlatformQACheck.update(checkId, { qa_status: newStatus, last_tested_date: new Date().toISOString().split('T')[0] });
    setChecks(checks.map(c => c.id === checkId ? { ...c, qa_status: newStatus, last_tested_date: new Date().toISOString().split('T')[0] } : c));
    setSelectedCheck(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">✓</div>
            <h1 className="text-3xl font-black text-slate-900">Platform QA</h1>
          </div>
          <p className="text-slate-600 text-sm">Functional verification status of all platform pages, workflows, integrations, and user journeys</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SECTION 1 — QA Readiness KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Pages Verified</p>
            <p className="text-3xl font-black text-emerald-600">{verified}</p>
            <p className="text-xs text-slate-600 mt-2">Ready for release</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Not Tested</p>
            <p className="text-3xl font-black text-slate-600">{not_tested}</p>
            <p className="text-xs text-slate-600 mt-2">Needs attention</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Failed Checks</p>
            <p className={`text-3xl font-black ${failed > 0 ? 'text-red-600' : 'text-slate-600'}`}>{failed}</p>
            <p className="text-xs text-slate-600 mt-2">Blocking release</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Partial Tests</p>
            <p className="text-3xl font-black text-yellow-600">{partial}</p>
            <p className="text-xs text-slate-600 mt-2">Incomplete coverage</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Readiness Score</p>
            <p className={`text-3xl font-black ${readinessScore > 80 ? 'text-emerald-600' : readinessScore > 60 ? 'text-yellow-600' : 'text-red-600'}`}>{readinessScore}%</p>
            <p className="text-xs text-slate-600 mt-2">Platform coverage</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search pages or workflows…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="partial">Partial</option>
              <option value="failed">Failed</option>
              <option value="not_tested">Not Tested</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg"
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* SECTION 2 — QA Verification Grid */}
        <div>
          <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Verification Checklist</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(check => {
              const categoryConfig = CATEGORY_CONFIG[check.qa_category];
              const statusConfig = STATUS_CONFIG[check.qa_status];
              const verifiedCount = [check.navigation_verified, check.primary_action_verified, check.data_save_verified, check.error_handling_verified, check.mobile_layout_verified].filter(Boolean).length;
              return (
                <button
                  key={check.id}
                  onClick={() => setSelectedCheck(check)}
                  className={`rounded-xl p-5 text-left transition-all hover:shadow-lg border-2 ${
                    check.qa_status === 'verified'
                      ? 'bg-white border-emerald-200'
                      : check.qa_status === 'failed'
                      ? 'bg-white border-red-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{check.page_or_workflow_name}</h4>
                      <p className="text-xs text-slate-600 mt-1">{categoryConfig.label}</p>
                    </div>
                    <span className="text-2xl flex-shrink-0">{categoryConfig.icon}</span>
                  </div>

                  <div className="mb-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded inline-block ${statusConfig.badge}`}>
                      {statusConfig.icon} {statusConfig.label}
                    </span>
                  </div>

                  {/* Verification checks */}
                  <div className="space-y-1 mb-3 pb-3 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-xs">
                      <span className={check.navigation_verified ? '✓ text-emerald-600' : '○ text-slate-400'}>
                        {check.navigation_verified ? '✓' : '○'}
                      </span>
                      <span className="text-slate-600">Navigation</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={check.primary_action_verified ? '✓ text-emerald-600' : '○ text-slate-400'}>
                        {check.primary_action_verified ? '✓' : '○'}
                      </span>
                      <span className="text-slate-600">Primary Action</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={check.data_save_verified ? '✓ text-emerald-600' : '○ text-slate-400'}>
                        {check.data_save_verified ? '✓' : '○'}
                      </span>
                      <span className="text-slate-600">Data Save</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={check.mobile_layout_verified ? '✓ text-emerald-600' : '○ text-slate-400'}>
                        {check.mobile_layout_verified ? '✓' : '○'}
                      </span>
                      <span className="text-slate-600">Mobile Layout</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600">
                    {verifiedCount}/{5} checks passed
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 4 — QA Coverage Distribution */}
        {categoryDistribution.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Coverage by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryDistribution} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="verified" stackId="a" fill="#10b981" />
                <Bar dataKey="partial" stackId="a" fill="#f59e0b" />
                <Bar dataKey="failed" stackId="a" fill="#ef4444" />
                <Bar dataKey="not_tested" stackId="a" fill="#cbd5e1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* SECTION 6 — Release Readiness Strip */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Release Readiness</h3>
          <div className="flex gap-2">
            {releaseChecks.map((item, idx) => (
              <div key={idx} className="flex-1">
                <div className={`rounded-lg p-4 text-center transition-all ${
                  item.status
                    ? 'bg-emerald-100 border border-emerald-300'
                    : 'bg-slate-100 border border-slate-300'
                }`}>
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className={`text-xs font-bold ${item.status ? 'text-emerald-700' : 'text-slate-600'}`}>
                    {item.step}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className={`mt-4 p-3 rounded-lg text-sm font-bold ${
            releaseChecks[4].status
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
          }`}>
            {releaseChecks[4].status ? '✓ Platform ready for scale' : '⚠️ Complete verification before full release'}
          </div>
        </div>

        {/* SECTION 5 — Platform Risk Alert Feed */}
        {alerts.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">QA Verification Issues</h3>
            <div className="space-y-3">
              {alerts.map((alert, idx) => {
                const bgColor = alert.severity === 'high' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200';
                const textColor = alert.severity === 'high' ? 'text-red-900' : 'text-yellow-900';
                const icon = alert.severity === 'high' ? '🚨' : '⚠️';
                return (
                  <div key={idx} className={`border rounded-xl p-5 ${bgColor}`}>
                    <div className="flex items-start gap-4">
                      <div className="text-2xl flex-shrink-0">{icon}</div>
                      <div className="flex-1">
                        <h4 className={`text-sm font-black ${textColor}`}>{alert.title}</h4>
                        <p className={`text-sm mt-1 ${textColor}`}>{alert.description}</p>
                        <div className={`mt-3 text-xs font-black ${textColor}`}>
                          {alert.action}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Detail Modal */}
      {selectedCheck && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">{selectedCheck.page_or_workflow_name}</h3>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${STATUS_CONFIG[selectedCheck.qa_status].badge}`}>
                    {STATUS_CONFIG[selectedCheck.qa_status].label}
                  </span>
                  <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: CATEGORY_CONFIG[selectedCheck.qa_category].color + '20', color: CATEGORY_CONFIG[selectedCheck.qa_category].color }}>
                    {CATEGORY_CONFIG[selectedCheck.qa_category].label}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedCheck(null)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <div className="space-y-6 mb-6 pb-6 border-b border-slate-200">
              {/* User Role */}
              {selectedCheck.user_role_tested && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">User Role Tested</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedCheck.user_role_tested}</p>
                </div>
              )}

              {/* Last Tested */}
              {selectedCheck.last_tested_date && (
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Last Tested</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedCheck.last_tested_date}</p>
                </div>
              )}

              {/* Verification Checklist */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">Verification Checklist</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 cursor-pointer hover:bg-slate-100">
                    <input
                      type="checkbox"
                      checked={selectedCheck.navigation_verified}
                      onChange={(e) => setSelectedCheck({...selectedCheck, navigation_verified: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-slate-900">Navigation paths verified</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 cursor-pointer hover:bg-slate-100">
                    <input
                      type="checkbox"
                      checked={selectedCheck.primary_action_verified}
                      onChange={(e) => setSelectedCheck({...selectedCheck, primary_action_verified: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-slate-900">Primary action works end-to-end</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 cursor-pointer hover:bg-slate-100">
                    <input
                      type="checkbox"
                      checked={selectedCheck.data_save_verified}
                      onChange={(e) => setSelectedCheck({...selectedCheck, data_save_verified: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-slate-900">Data saves correctly</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 cursor-pointer hover:bg-slate-100">
                    <input
                      type="checkbox"
                      checked={selectedCheck.error_handling_verified}
                      onChange={(e) => setSelectedCheck({...selectedCheck, error_handling_verified: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-slate-900">Error states handled</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 cursor-pointer hover:bg-slate-100">
                    <input
                      type="checkbox"
                      checked={selectedCheck.mobile_layout_verified}
                      onChange={(e) => setSelectedCheck({...selectedCheck, mobile_layout_verified: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-slate-900">Mobile layout responsive</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Status Actions */}
            <div className="space-y-2">
              <button
                onClick={() => handleStatusUpdate(selectedCheck.id, 'verified')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
              >
                ✓ Mark Verified
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedCheck.id, 'partial')}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
              >
                ◐ Mark Partial
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedCheck.id, 'failed')}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
              >
                ✗ Mark Failed
              </button>
              <button className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 text-sm font-bold py-2 rounded-lg transition-colors">
                📅 Schedule Re-test
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
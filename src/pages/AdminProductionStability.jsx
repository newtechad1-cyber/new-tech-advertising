import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CATEGORY_CONFIG = {
  navigation: { label: 'Navigation', color: '#3b82f6', icon: '🗺️' },
  publishing: { label: 'Publishing', color: '#ef4444', icon: '📤' },
  integration: { label: 'Integration', color: '#8b5cf6', icon: '🔗' },
  automation: { label: 'Automation', color: '#10b981', icon: '⚙️' },
  data_sync: { label: 'Data Sync', color: '#f59e0b', icon: '🔄' },
  permissions: { label: 'Permissions', color: '#ec4899', icon: '🔐' },
  ui_confusion: { label: 'UI Confusion', color: '#06b6d4', icon: '❓' },
  performance: { label: 'Performance', color: '#f97316', icon: '⚡' },
  routing: { label: 'Routing', color: '#14b8a6', icon: '↔️' },
};

const SEVERITY_CONFIG = {
  critical: { label: 'Critical', badge: 'bg-red-950 text-red-100', color: '#7f1d1d', textColor: 'text-red-900' },
  high: { label: 'High', badge: 'bg-red-100 text-red-700', color: '#ef4444', textColor: 'text-red-700' },
  medium: { label: 'Medium', badge: 'bg-orange-100 text-orange-700', color: '#f97316', textColor: 'text-orange-700' },
  low: { label: 'Low', badge: 'bg-yellow-100 text-yellow-700', color: '#eab308', textColor: 'text-yellow-700' },
};

const AREA_CONFIG = {
  public_site: { label: 'Public Site', color: '#8b5cf6' },
  onboarding: { label: 'Onboarding', color: '#06b6d4' },
  client_portal: { label: 'Client Portal', color: '#10b981' },
  admin_platform: { label: 'Admin Platform', color: '#3b82f6' },
  sales: { label: 'Sales', color: '#f59e0b' },
  operations: { label: 'Operations', color: '#ef4444' },
  reporting: { label: 'Reporting', color: '#14b8a6' },
  channels: { label: 'Channels', color: '#ec4899' },
};

const STATUS_CONFIG = {
  open: { label: 'Open', badge: 'bg-slate-100 text-slate-700' },
  investigating: { label: 'Investigating', badge: 'bg-blue-100 text-blue-700' },
  fixing: { label: 'Fixing', badge: 'bg-yellow-100 text-yellow-700' },
  resolved: { label: 'Resolved', badge: 'bg-emerald-100 text-emerald-700' },
};

export default function AdminProductionStability() {
  const [blockers, setBlockers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlocker, setSelectedBlocker] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterArea, setFilterArea] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    base44.entities.ProductionBlocker.list('-severity_level', 100)
      .then(data => {
        setBlockers(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600 text-sm animate-pulse">Loading production status…</div>
      </div>
    );
  }

  // Filter blockers
  let filtered = blockers.filter(b => {
    if (filterSeverity !== 'all' && b.severity_level !== filterSeverity) return false;
    if (filterArea !== 'all' && b.affected_system_area !== filterArea) return false;
    if (searchTerm && !b.blocker_title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // KPIs
  const criticalOpen = blockers.filter(b => b.severity_level === 'critical' && b.blocker_status === 'open').length;
  const highSeverity = blockers.filter(b => b.severity_level === 'high' && b.blocker_status !== 'resolved').length;
  const being_fixed = blockers.filter(b => b.blocker_status === 'fixing').length;
  const resolved_week = blockers.filter(b => b.blocker_status === 'resolved').length;
  const stabilityScore = blockers.length > 0
    ? Math.round((resolved_week / blockers.length) * 100)
    : 100;

  // Category distribution
  const categoryDistribution = Object.keys(CATEGORY_CONFIG).map(cat => ({
    name: CATEGORY_CONFIG[cat].label,
    count: blockers.filter(b => b.blocker_category === cat && b.blocker_status !== 'resolved').length,
    color: CATEGORY_CONFIG[cat].color,
  })).filter(item => item.count > 0);

  // System area distribution
  const areaDistribution = Object.keys(AREA_CONFIG).map(area => ({
    name: AREA_CONFIG[area].label,
    count: blockers.filter(b => b.affected_system_area === area && b.blocker_status !== 'resolved').length,
    color: AREA_CONFIG[area].color,
  })).filter(item => item.count > 0);

  // Urgent insights
  const insights = [];

  const publishingFailures = blockers.filter(b => b.blocker_category === 'publishing' && b.blocker_status !== 'resolved');
  if (publishingFailures.length > 0) {
    insights.push({
      severity: 'critical',
      title: `${publishingFailures.length} Publishing Blocker(s) Preventing Content Delivery`,
      description: `${publishingFailures.map(b => b.blocker_title).join(', ')}. These failures are blocking client content from reaching audiences.`,
      action: 'URGENT: Prioritize publishing fixes immediately. Track as revenue impact.',
    });
  }

  const onboardingIssues = blockers.filter(b => b.affected_system_area === 'onboarding' && b.blocker_status !== 'resolved');
  if (onboardingIssues.length > 0) {
    insights.push({
      severity: 'high',
      title: `${onboardingIssues.length} Onboarding Blocker(s) Slowing New Client Activation`,
      description: 'New clients may be stuck during trial setup, reducing conversion velocity.',
      action: 'Fast-track fixes to onboarding critical path. May impact revenue if blocking trials.',
    });
  }

  const navigationIssues = blockers.filter(b => b.blocker_category === 'navigation' && b.blocker_status !== 'resolved');
  if (navigationIssues.length > 0) {
    insights.push({
      severity: 'high',
      title: `${navigationIssues.length} Navigation Issue(s) Creating Confusion and Support Load`,
      description: 'Users unable to find features or reach intended pages. Increases support volume.',
      action: 'Fix broken routes and menu items. Reduces support burden significantly.',
    });
  }

  const integrationIssues = blockers.filter(b => b.blocker_category === 'integration' && b.blocker_status !== 'resolved');
  if (integrationIssues.length > 0) {
    insights.push({
      severity: 'high',
      title: `${integrationIssues.length} Integration Error(s) Affecting External Channel Operations`,
      description: 'Channel connections failing (Meta, Google, etc.). Limits publishing capability.',
      action: 'Coordinate with integration team. May require vendor API debugging.',
    });
  }

  const performanceIssues = blockers.filter(b => b.blocker_category === 'performance');
  if (performanceIssues.length > 0) {
    insights.push({
      severity: 'medium',
      title: `${performanceIssues.length} Performance Degradation(s) Detected`,
      description: 'Platform slowness or timeouts affecting user experience.',
      action: 'Profile system metrics. Check database queries, API latency, and resource usage.',
    });
  }

  const handleStatusUpdate = async (blockerId, newStatus) => {
    await base44.entities.ProductionBlocker.update(blockerId, { blocker_status: newStatus });
    setBlockers(blockers.map(b => b.id === blockerId ? { ...b, blocker_status: newStatus } : b));
    setSelectedBlocker(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">🚨</div>
            <h1 className="text-3xl font-black text-slate-900">Production Stability</h1>
          </div>
          <p className="text-slate-600 text-sm">Track platform production issues, workflow blockers, and system reliability risks</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className={`rounded-2xl p-5 shadow-sm border-2 ${criticalOpen > 0 ? 'bg-red-950 border-red-700' : 'bg-white border-slate-200'}`}>
            <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${criticalOpen > 0 ? 'text-red-200' : 'text-slate-600'}`}>Critical Issues Open</p>
            <p className={`text-3xl font-black ${criticalOpen > 0 ? 'text-red-100' : 'text-slate-900'}`}>{criticalOpen}</p>
            <p className={`text-xs mt-2 ${criticalOpen > 0 ? 'text-red-300' : 'text-slate-600'}`}>Immediate attention</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">High Severity Issues</p>
            <p className="text-3xl font-black text-red-600">{highSeverity}</p>
            <p className="text-xs text-slate-600 mt-2">Unresolved</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Being Fixed</p>
            <p className="text-3xl font-black text-blue-600">{being_fixed}</p>
            <p className="text-xs text-slate-600 mt-2">In progress</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Resolved This Week</p>
            <p className="text-3xl font-black text-emerald-600">{resolved_week}</p>
            <p className="text-xs text-slate-600 mt-2">Completed fixes</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Stability Score</p>
            <p className="text-3xl font-black text-slate-900">{stabilityScore}%</p>
            <p className="text-xs text-slate-600 mt-2">Resolution rate</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search blockers by title…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg"
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg"
            >
              <option value="all">All System Areas</option>
              {Object.entries(AREA_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* SECTION 2 — Blocker Priority Grid */}
        <div>
          <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Open Blockers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(blocker => {
              const severityConfig = SEVERITY_CONFIG[blocker.severity_level];
              const categoryConfig = CATEGORY_CONFIG[blocker.blocker_category];
              const areaConfig = AREA_CONFIG[blocker.affected_system_area];
              const statusConfig = STATUS_CONFIG[blocker.blocker_status];
              return (
                <button
                  key={blocker.id}
                  onClick={() => setSelectedBlocker(blocker)}
                  className={`rounded-xl p-5 text-left transition-all hover:shadow-lg border-2 ${
                    blocker.severity_level === 'critical'
                      ? 'bg-red-950 border-red-700'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-bold truncate ${blocker.severity_level === 'critical' ? 'text-red-100' : 'text-slate-900'}`}>
                        {blocker.blocker_title}
                      </h4>
                    </div>
                    <span className="text-2xl flex-shrink-0">{categoryConfig.icon}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span style={{ background: severityConfig.color + '20', color: severityConfig.color }} className="text-xs font-bold px-2 py-1 rounded">
                      {severityConfig.label}
                    </span>
                    <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: areaConfig.color + '20', color: areaConfig.color }}>
                      {AREA_CONFIG[blocker.affected_system_area].label}
                    </span>
                  </div>

                  <div className={`flex items-center justify-between pt-3 border-t ${blocker.severity_level === 'critical' ? 'border-red-700' : 'border-slate-200'}`}>
                    <div className="flex gap-2">
                      {blocker.workaround_available && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-1 rounded">
                          Workaround
                        </span>
                      )}
                      <span className={`text-xs font-bold px-2 py-1 rounded ${statusConfig.badge}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                    {blocker.estimated_fix_complexity && (
                      <span className={`text-xs font-bold ${blocker.severity_level === 'critical' ? 'text-red-200' : 'text-slate-600'}`}>
                        {blocker.estimated_fix_complexity === 'quick_fix' ? '⚡' : blocker.estimated_fix_complexity === 'moderate' ? '⚙️' : '🔨'}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 4 — Blocker Category Distribution */}
        {categoryDistribution.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Blockers by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryDistribution} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {categoryDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* SECTION 5 — System Area Risk Map */}
        {areaDistribution.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Risk Distribution by System Area</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={areaDistribution} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {areaDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* SECTION 6 — Urgent Fix Intelligence Feed */}
        {insights.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Production Intelligence Feed</h3>
            <div className="space-y-3">
              {insights.map((insight, idx) => {
                const bgColor = insight.severity === 'critical' ? 'bg-red-50 border-red-200' : insight.severity === 'high' ? 'bg-orange-50 border-orange-200' : 'bg-yellow-50 border-yellow-200';
                const textColor = insight.severity === 'critical' ? 'text-red-900' : insight.severity === 'high' ? 'text-orange-900' : 'text-yellow-900';
                const icon = insight.severity === 'critical' ? '🚨' : insight.severity === 'high' ? '⚠️' : '⚡';
                return (
                  <div key={idx} className={`border rounded-xl p-5 ${bgColor}`}>
                    <div className="flex items-start gap-4">
                      <div className="text-2xl flex-shrink-0">{icon}</div>
                      <div className="flex-1">
                        <h4 className={`text-sm font-black ${textColor}`}>{insight.title}</h4>
                        <p className={`text-sm mt-1 ${textColor}`}>{insight.description}</p>
                        <div className={`mt-3 text-xs font-black ${textColor}`}>
                          {insight.action}
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
      {selectedBlocker && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ background: SEVERITY_CONFIG[selectedBlocker.severity_level].color + '20', color: SEVERITY_CONFIG[selectedBlocker.severity_level].color }} className="text-xs font-bold px-2 py-1 rounded">
                    {SEVERITY_CONFIG[selectedBlocker.severity_level].label} Severity
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${STATUS_CONFIG[selectedBlocker.blocker_status].badge}`}>
                    {STATUS_CONFIG[selectedBlocker.blocker_status].label}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">{selectedBlocker.blocker_title}</h3>
              </div>
              <button onClick={() => setSelectedBlocker(null)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <div className="space-y-6 mb-6 pb-6 border-b border-slate-200">
              {/* Category and Area */}
              <div className="flex gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Category</p>
                  <p className="text-sm font-semibold text-slate-900">{CATEGORY_CONFIG[selectedBlocker.blocker_category].label}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Affected Area</p>
                  <p className="text-sm font-semibold text-slate-900">{AREA_CONFIG[selectedBlocker.affected_system_area].label}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Description</p>
                <p className="text-sm text-slate-700">{selectedBlocker.blocker_description}</p>
              </div>

              {/* Affected Users */}
              {selectedBlocker.affected_user_role && (
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Affected Users</p>
                  <p className="text-sm text-slate-700">{selectedBlocker.affected_user_role}</p>
                </div>
              )}

              {/* Workaround */}
              {selectedBlocker.workaround_available && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">Workaround Available</p>
                  <p className="text-sm text-emerald-900">Users have an alternative workflow while this issue is being fixed.</p>
                </div>
              )}

              {/* Fix Complexity */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Estimated Fix Complexity</p>
                <p className="text-sm font-semibold text-slate-900">
                  {selectedBlocker.estimated_fix_complexity === 'quick_fix' && '⚡ Quick Fix (< 1 hour)'}
                  {selectedBlocker.estimated_fix_complexity === 'moderate' && '⚙️ Moderate (1-4 hours)'}
                  {selectedBlocker.estimated_fix_complexity === 'major' && '🔨 Major (> 4 hours)'}
                  {selectedBlocker.estimated_fix_complexity === 'unknown' && '❓ Unknown'}
                </p>
              </div>
            </div>

            {/* Status Actions */}
            <div className="space-y-2">
              {selectedBlocker.blocker_status === 'open' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedBlocker.id, 'investigating')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    🔍 Mark Investigating
                  </button>
                  <button className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                    ⬆️ Escalate Severity
                  </button>
                </>
              )}
              {selectedBlocker.blocker_status === 'investigating' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedBlocker.id, 'fixing')}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    🔧 Mark Fixing
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedBlocker.id, 'open')}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ↩️ Back to Open
                  </button>
                </>
              )}
              {selectedBlocker.blocker_status === 'fixing' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedBlocker.id, 'resolved')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ✓ Mark Resolved
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedBlocker.id, 'investigating')}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ↩️ Back to Investigating
                  </button>
                </>
              )}
              {selectedBlocker.blocker_status === 'resolved' && (
                <button
                  onClick={() => handleStatusUpdate(selectedBlocker.id, 'open')}
                  className="w-full bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  🔄 Reopen Issue
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
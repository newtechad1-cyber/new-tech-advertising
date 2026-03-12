import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const GROUP_CONFIG = {
  public_site: { label: 'Public Site', color: '#8b5cf6' },
  trial_flow: { label: 'Trial Flow', color: '#06b6d4' },
  client_portal: { label: 'Client Portal', color: '#10b981' },
  admin_platform: { label: 'Admin Platform', color: '#3b82f6' },
  sales: { label: 'Sales', color: '#f59e0b' },
  operations: { label: 'Operations', color: '#ef4444' },
  partner_portal: { label: 'Partner Portal', color: '#ec4899' },
  reporting: { label: 'Reporting', color: '#14b8a6' },
};

const STATUS_CONFIG = {
  active: { label: 'Active', badge: 'bg-emerald-100 text-emerald-700', color: '#10b981' },
  review_needed: { label: 'Review Needed', badge: 'bg-yellow-100 text-yellow-700', color: '#eab308' },
  orphaned: { label: 'Orphaned', badge: 'bg-orange-100 text-orange-700', color: '#f97316' },
  duplicate: { label: 'Duplicate', badge: 'bg-red-100 text-red-700', color: '#ef4444' },
  broken: { label: 'Broken', badge: 'bg-red-950 text-red-100', color: '#7f1d1d' },
};

export default function AdminNavigationAudit() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [filterGroup, setFilterGroup] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'page_name', direction: 'asc' });

  useEffect(() => {
    base44.entities.PlatformRouteRegistry.list('-route_status', 200)
      .then(data => {
        setRoutes(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600 text-sm animate-pulse">Loading navigation audit…</div>
      </div>
    );
  }

  // Filter and search
  let filtered = routes.filter(r => {
    if (filterGroup !== 'all' && r.page_group !== filterGroup) return false;
    if (filterStatus !== 'all' && r.route_status !== filterStatus) return false;
    if (searchTerm && !r.page_name.toLowerCase().includes(searchTerm.toLowerCase()) && !r.route_path.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Sort
  filtered = [...filtered].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  // KPIs
  const totalRoutes = routes.length;
  const brokenRoutes = routes.filter(r => r.route_status === 'broken').length;
  const orphanedPages = routes.filter(r => r.route_status === 'orphaned').length;
  const duplicatePages = routes.filter(r => r.route_status === 'duplicate').length;
  const missingNextStep = routes.filter(r => !r.primary_next_step).length;

  // Group distribution
  const groupDistribution = Object.keys(GROUP_CONFIG).map(group => ({
    name: GROUP_CONFIG[group].label,
    count: routes.filter(r => r.page_group === group).length,
    color: GROUP_CONFIG[group].color,
  })).filter(item => item.count > 0);

  // Issues detected
  const issues = [];

  // Orphaned pages
  const orphanedList = routes.filter(r => r.route_status === 'orphaned');
  if (orphanedList.length > 0) {
    issues.push({
      type: 'critical',
      title: `${orphanedList.length} Orphaned Page(s) Not Reachable From Menu`,
      affected: orphanedList.map(r => r.page_name).join(', '),
      summary: 'Pages exist in the routing system but have no navigation menu entry.',
      fix: 'Add pages to appropriate navigation menu group or mark as intentionally hidden.',
    });
  }

  // Broken routes
  const brokenList = routes.filter(r => r.route_status === 'broken');
  if (brokenList.length > 0) {
    issues.push({
      type: 'critical',
      title: `${brokenList.length} Broken Route(s) Requiring Immediate Attention`,
      affected: brokenList.map(r => r.page_name).join(', '),
      summary: 'These routes are returning errors or pages are not loading properly.',
      fix: 'Debug routing configuration and component imports. Verify page exists and is properly exported.',
    });
  }

  // Missing next steps
  const missingNextList = routes.filter(r => !r.primary_next_step && r.route_status === 'active').slice(0, 3);
  if (missingNextList.length > 0) {
    issues.push({
      type: 'warning',
      title: `${missingNextList.length}+ Pages Missing Clear Next Action`,
      affected: missingNextList.map(r => r.page_name).join(', '),
      summary: 'Users may not know where to go after viewing these pages.',
      fix: 'Define primary_next_step for all active pages. Add prominent CTAs to guide user flow.',
    });
  }

  // Duplicate purposes
  const duplicateList = routes.filter(r => r.route_status === 'duplicate');
  if (duplicateList.length > 0) {
    issues.push({
      type: 'warning',
      title: `${duplicateList.length} Pages With Duplicate Purpose Detected`,
      affected: duplicateList.map(r => r.page_name).join(', '),
      summary: 'Multiple pages appear to serve the same function. May confuse users.',
      fix: 'Consolidate pages or clarify differentiation. Remove redundant routes.',
    });
  }

  // Orphaned navigation groups
  const usedGroups = new Set(routes.map(r => r.parent_navigation_group).filter(Boolean));
  const allGroupsUsed = Object.keys(GROUP_CONFIG).filter(g => usedGroups.has(g)).length;
  if (allGroupsUsed < Object.keys(GROUP_CONFIG).length) {
    issues.push({
      type: 'info',
      title: `${Object.keys(GROUP_CONFIG).length - allGroupsUsed} Navigation Group(s) With No Pages`,
      affected: Object.keys(GROUP_CONFIG).filter(g => !usedGroups.has(g)).map(g => GROUP_CONFIG[g].label).join(', '),
      summary: 'Some navigation categories are defined but have no pages assigned.',
      fix: 'Either assign pages to these groups or remove empty navigation categories.',
    });
  }

  // Entry/exit path gaps
  const missingPathsGaps = routes.filter(r => !r.entry_path_summary || !r.exit_path_summary).length;
  if (missingPathsGaps > 0) {
    issues.push({
      type: 'info',
      title: `${missingPathsGaps} Pages Missing Entry/Exit Path Documentation`,
      affected: `${missingPathsGaps} page(s)`,
      summary: 'Navigation paths are not fully documented for future maintenance.',
      fix: 'Document how users arrive at and leave each page. Creates better maintainability.',
    });
  }

  const handleStatusUpdate = async (routeId, newStatus) => {
    await base44.entities.PlatformRouteRegistry.update(routeId, { route_status: newStatus });
    setRoutes(routes.map(r => r.id === routeId ? { ...r, route_status: newStatus } : r));
    setSelectedRoute(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">🗺️</div>
            <h1 className="text-3xl font-black text-slate-900">Navigation Audit</h1>
          </div>
          <p className="text-slate-600 text-sm">Route registry and navigation clarity system for the entire NTA platform</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Total Registered Routes</p>
            <p className="text-3xl font-black text-slate-900">{totalRoutes}</p>
            <p className="text-xs text-slate-600 mt-2">Pages in platform</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Broken Routes</p>
            <p className="text-3xl font-black text-red-700">{brokenRoutes}</p>
            <p className="text-xs text-slate-600 mt-2">Require immediate fix</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Orphaned Pages</p>
            <p className="text-3xl font-black text-orange-600">{orphanedPages}</p>
            <p className="text-xs text-slate-600 mt-2">Not in navigation</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Duplicate Purpose</p>
            <p className="text-3xl font-black text-red-600">{duplicatePages}</p>
            <p className="text-xs text-slate-600 mt-2">Pages detected</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Missing Next Step</p>
            <p className="text-3xl font-black text-yellow-600">{missingNextStep}</p>
            <p className="text-xs text-slate-600 mt-2">No CTA defined</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search routes by page name or path…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg"
            >
              <option value="all">All Page Groups</option>
              {Object.entries(GROUP_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="review_needed">Review Needed</option>
              <option value="orphaned">Orphaned</option>
              <option value="duplicate">Duplicate</option>
              <option value="broken">Broken</option>
            </select>
          </div>
        </div>

        {/* SECTION 2 — Route Registry Table */}
        <div>
          <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Route Registry</h3>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left">
                      <button onClick={() => handleSort('page_name')} className="font-bold text-slate-700 hover:text-slate-900">
                        Page Name {sortConfig.key === 'page_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button onClick={() => handleSort('route_path')} className="font-bold text-slate-700 hover:text-slate-900">
                        Route Path {sortConfig.key === 'route_path' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button onClick={() => handleSort('page_group')} className="font-bold text-slate-700 hover:text-slate-900">
                        Group {sortConfig.key === 'page_group' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button onClick={() => handleSort('parent_navigation_group')} className="font-bold text-slate-700 hover:text-slate-900">
                        Nav Group {sortConfig.key === 'parent_navigation_group' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button onClick={() => handleSort('primary_cta_label')} className="font-bold text-slate-700 hover:text-slate-900">
                        CTA {sortConfig.key === 'primary_cta_label' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button onClick={() => handleSort('route_status')} className="font-bold text-slate-700 hover:text-slate-900">
                        Status {sortConfig.key === 'route_status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(route => {
                    const statusConfig = STATUS_CONFIG[route.route_status];
                    const groupConfig = GROUP_CONFIG[route.page_group];
                    return (
                      <tr
                        key={route.id}
                        onClick={() => setSelectedRoute(route)}
                        className="border-b border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3 font-semibold text-slate-900">{route.page_name}</td>
                        <td className="px-4 py-3 text-slate-600 font-mono text-xs">{route.route_path}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: groupConfig.color + '20', color: groupConfig.color }}>
                            {groupConfig.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs">{route.parent_navigation_group || '—'}</td>
                        <td className="px-4 py-3 text-slate-600 text-xs">{route.primary_cta_label || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${statusConfig.badge}`}>
                            {statusConfig.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="p-8 text-center text-slate-600">
                <p className="text-sm">No routes match your filters</p>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-3">Showing {filtered.length} of {totalRoutes} routes</p>
        </div>

        {/* SECTION 4 — Navigation Group Distribution */}
        {groupDistribution.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Page Distribution by Navigation Group</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={groupDistribution} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12, color: '#1e293b' }}
                  formatter={(val) => [val, 'Pages']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {groupDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* SECTION 5 — Route Issue Feed */}
        {issues.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Navigation Audit Issues</h3>
            <div className="space-y-3">
              {issues.map((issue, idx) => {
                const typeColor = issue.type === 'critical' ? 'bg-red-50 border-red-200' : issue.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200';
                const textColor = issue.type === 'critical' ? 'text-red-900' : issue.type === 'warning' ? 'text-yellow-900' : 'text-blue-900';
                const icon = issue.type === 'critical' ? '🚨' : issue.type === 'warning' ? '⚠️' : 'ℹ️';
                return (
                  <div key={idx} className={`border rounded-xl p-5 ${typeColor}`}>
                    <div className="flex items-start gap-4">
                      <div className="text-2xl flex-shrink-0">{icon}</div>
                      <div className="flex-1">
                        <h4 className={`text-sm font-black ${textColor}`}>{issue.title}</h4>
                        <p className={`text-sm mt-1 ${textColor}`}>
                          <span className="font-bold">Affected: </span>{issue.affected}
                        </p>
                        <p className={`text-sm mt-1 ${textColor}`}>{issue.summary}</p>
                        <div className={`mt-3 text-xs font-bold ${textColor}`}>
                          <span className="font-black">Fix: </span>{issue.fix}
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
      {selectedRoute && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ background: GROUP_CONFIG[selectedRoute.page_group].color + '20', color: GROUP_CONFIG[selectedRoute.page_group].color }} className="text-xs font-bold px-2 py-1 rounded">
                    {GROUP_CONFIG[selectedRoute.page_group].label}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${STATUS_CONFIG[selectedRoute.route_status].badge}`}>
                    {STATUS_CONFIG[selectedRoute.route_status].label}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">{selectedRoute.page_name}</h3>
              </div>
              <button onClick={() => setSelectedRoute(null)} className="text-slate-400 hover:text-slate-600 text-2xl flex-shrink-0">×</button>
            </div>

            <div className="space-y-6 mb-6 pb-6 border-b border-slate-200">
              {/* Route path */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Route Path</p>
                <p className="text-sm font-mono bg-slate-100 p-3 rounded text-slate-900">{selectedRoute.route_path}</p>
              </div>

              {/* Page purpose */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Page Purpose</p>
                <p className="text-sm text-slate-700">{selectedRoute.page_purpose || 'No purpose defined'}</p>
              </div>

              {/* User role visibility */}
              {selectedRoute.user_role_visibility && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">User Role Visibility</p>
                  <p className="text-sm text-slate-700">{selectedRoute.user_role_visibility}</p>
                </div>
              )}

              {/* Parent navigation group */}
              {selectedRoute.parent_navigation_group && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Parent Navigation Group</p>
                  <p className="text-sm text-slate-700">{selectedRoute.parent_navigation_group}</p>
                </div>
              )}

              {/* Entry path */}
              {selectedRoute.entry_path_summary && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Entry Path</p>
                  <p className="text-sm text-blue-900">{selectedRoute.entry_path_summary}</p>
                </div>
              )}

              {/* Primary CTA */}
              {selectedRoute.primary_cta_label && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">Primary CTA</p>
                  <p className="text-sm font-semibold text-emerald-900">{selectedRoute.primary_cta_label}</p>
                </div>
              )}

              {/* Primary next step */}
              {selectedRoute.primary_next_step && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-2">Primary Next Step</p>
                  <p className="text-sm text-purple-900">{selectedRoute.primary_next_step}</p>
                </div>
              )}

              {/* Exit path */}
              {selectedRoute.exit_path_summary && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">Exit Path</p>
                  <p className="text-sm text-orange-900">{selectedRoute.exit_path_summary}</p>
                </div>
              )}
            </div>

            {/* Status Actions */}
            <div className="space-y-2">
              {selectedRoute.route_status !== 'active' && (
                <button
                  onClick={() => handleStatusUpdate(selectedRoute.id, 'active')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  ✓ Mark Active
                </button>
              )}
              {selectedRoute.route_status !== 'review_needed' && (
                <button
                  onClick={() => handleStatusUpdate(selectedRoute.id, 'review_needed')}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  👀 Mark Review Needed
                </button>
              )}
              {selectedRoute.route_status !== 'orphaned' && (
                <button
                  onClick={() => handleStatusUpdate(selectedRoute.id, 'orphaned')}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  🔍 Mark Orphaned
                </button>
              )}
              {selectedRoute.route_status !== 'duplicate' && (
                <button
                  onClick={() => handleStatusUpdate(selectedRoute.id, 'duplicate')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  ⚠️ Mark Duplicate
                </button>
              )}
              {selectedRoute.route_status !== 'broken' && (
                <button
                  onClick={() => handleStatusUpdate(selectedRoute.id, 'broken')}
                  className="w-full bg-red-900 hover:bg-red-800 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  🚨 Mark Broken
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
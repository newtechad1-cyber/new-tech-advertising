import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, ArrowRight, AlertCircle } from 'lucide-react';

export default function NextBestArchitectureAction({ pages = [], routes = [], layouts = [], navItems = [] }) {
  const prioritizedActions = useMemo(() => {
    const actions = [];

    // Detect layout mismatches
    pages.forEach(page => {
      const layout = layouts.find(l => l.layout_key === page.layout_key);
      if (layout) {
        const allowedFamilies = layout.allowed_route_families_json
          ? JSON.parse(layout.allowed_route_families_json)
          : [];
        if (allowedFamilies.length > 0 && !allowedFamilies.includes(page.route_family)) {
          actions.push({
            type: 'layout_mismatch',
            severity: 'critical',
            priority: 1,
            title: `Fix layout mismatch: ${page.page_name}`,
            description: `${page.page_name} uses ${page.layout_key} but family ${page.route_family} is not allowed.`,
            suggestion: `Update ${page.layout_key} to allow route family '${page.route_family}' or reassign page to compatible layout.`,
            affected: page.page_name,
          });
        }
      }
    });

    // Detect duplicate routes
    const routePaths = {};
    routes.forEach(route => {
      if (!routePaths[route.route_path]) routePaths[route.route_path] = [];
      routePaths[route.route_path].push(route);
    });

    Object.entries(routePaths).forEach(([path, dupes]) => {
      if (dupes.length > 1) {
        actions.push({
          type: 'duplicate_route',
          severity: 'critical',
          priority: 2,
          title: `Resolve duplicate route: ${path}`,
          description: `Route path "${path}" is registered ${dupes.length} times.`,
          suggestion: `Keep canonical route, deprecate or delete duplicates. Affected pages: ${dupes.map(d => d.page_key).join(', ')}`,
          affected: path,
        });
      }
    });

    // Detect orphan pages
    pages.forEach(page => {
      const hasRoute = routes.some(r => r.page_key === page.page_key && r.active);
      if (!hasRoute && page.active) {
        actions.push({
          type: 'orphan_page',
          severity: 'high',
          priority: 3,
          title: `Register orphan page: ${page.page_name}`,
          description: `Page "${page.page_name}" has no active route. It's unreachable.`,
          suggestion: `Create MasterRouteDefinition entry with route_path, or archive page if no longer needed.`,
          affected: page.page_name,
        });
      }
    });

    // Detect missing access rules
    pages.forEach(page => {
      if (!page.access_rules_json && page.route_family !== 'public') {
        actions.push({
          type: 'missing_access_rules',
          severity: 'high',
          priority: 4,
          title: `Tighten access rules: ${page.page_name}`,
          description: `${page.page_name} has no access rules defined for family ${page.route_family}.`,
          suggestion: `Define access_rules_json with role, feature_flag, or org_scope requirements.`,
          affected: page.page_name,
        });
      }
    });

    // Detect deprecated pages still in nav
    navItems.forEach(item => {
      const targetPage = pages.find(p => p.page_key === item.page_key);
      if (targetPage?.deprecated && item.active) {
        actions.push({
          type: 'deprecated_in_nav',
          severity: 'high',
          priority: 5,
          title: `Remove deprecated link: ${item.label}`,
          description: `Navigation item "${item.label}" links to deprecated page ${targetPage.page_name}.`,
          suggestion: `Deactivate navigation item or redirect to replacement page.`,
          affected: item.label,
        });
      }
    });

    // Detect duplicate page ownership
    const ownerMap = {};
    pages.forEach(page => {
      const key = `${page.owner_team || 'unassigned'}-${page.page_key}`;
      if (!ownerMap[key]) ownerMap[key] = [];
      ownerMap[key].push(page);
    });

    const ownerConflicts = pages.filter(p => {
      const sameOwnerPages = pages.filter(pp => pp.owner_team === p.owner_team && pp.route_family === p.route_family);
      return sameOwnerPages.length > 1;
    });

    if (ownerConflicts.length > 0) {
      const conflicts = [...new Set(ownerConflicts.map(p => p.owner_team))];
      actions.push({
        type: 'duplicate_ownership',
        severity: 'medium',
        priority: 6,
        title: `Clarify page ownership`,
        description: `Multiple pages share same owner in same family. Risk of unclear responsibilities.`,
        suggestion: `Review ownership assignments. Ensure clear single owner per logical domain.`,
        affected: conflicts.join(', '),
      });
    }

    // Sort by priority
    return actions.sort((a, b) => a.priority - b.priority).slice(0, 5);
  }, [pages, routes, layouts, navItems]);

  const severityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-950/50 border-red-700 text-red-300';
      case 'high':
        return 'bg-orange-950/50 border-orange-700 text-orange-300';
      case 'medium':
        return 'bg-amber-950/50 border-amber-700 text-amber-300';
      default:
        return 'bg-slate-900/50 border-slate-700 text-slate-300';
    }
  };

  if (prioritizedActions.length === 0) {
    return (
      <Card className="bg-slate-950 border-slate-700">
        <CardContent className="pt-6">
          <div className="text-center py-4">
            <p className="text-slate-400 text-sm">✓ Architecture is healthy. No immediate actions needed.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-950 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          Next Best Architecture Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {prioritizedActions.map((action, idx) => (
            <div
              key={idx}
              className={`p-3 rounded border transition-all hover:border-opacity-100 ${severityColor(action.severity)}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">{action.title}</p>
                    <Badge className="text-xs bg-slate-900 border-slate-700">
                      {action.type.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs opacity-90 mb-1">{action.description}</p>
                  <p className="text-xs opacity-80 italic">💡 {action.suggestion}</p>
                </div>
                <ArrowRight className="w-4 h-4 mt-1 flex-shrink-0 opacity-60" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
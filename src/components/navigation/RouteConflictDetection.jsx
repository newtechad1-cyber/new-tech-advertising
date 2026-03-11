import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Link2, Copy, X } from 'lucide-react';

export default function RouteConflictDetection({ routes = [], pages = [] }) {
  const conflicts = useMemo(() => {
    const issues = [];

    // Find duplicate routes
    const routePaths = {};
    routes.forEach(r => {
      if (routePaths[r.route_path]) {
        routePaths[r.route_path].push(r);
      } else {
        routePaths[r.route_path] = [r];
      }
    });

    Object.entries(routePaths).forEach(([path, routes]) => {
      if (routes.length > 1) {
        issues.push({
          type: 'duplicate_route',
          severity: 'critical',
          path,
          routes,
          message: `Route "${path}" maps to multiple pages`,
        });
      }
    });

    // Find orphan pages (no route)
    const routedPageKeys = new Set(routes.map(r => r.page_key));
    pages.filter(p => p.active).forEach(p => {
      if (!routedPageKeys.has(p.page_key)) {
        issues.push({
          type: 'orphan_page',
          severity: 'high',
          pageKey: p.page_key,
          pageName: p.page_name,
          message: `Page "${p.page_name}" has no registered route`,
        });
      }
    });

    // Find wrong-family routes
    routes.forEach(r => {
      const page = pages.find(p => p.page_key === r.page_key);
      if (page && page.route_family !== r.route_family) {
        issues.push({
          type: 'family_mismatch',
          severity: 'high',
          route: r.route_path,
          pageFamily: page.route_family,
          routeFamily: r.route_family,
          message: `Route family mismatch: route is "${r.route_family}" but page expects "${page.route_family}"`,
        });
      }
    });

    return issues.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }, [routes, pages]);

  if (conflicts.length === 0) {
    return (
      <Card className="bg-slate-950 border-slate-700">
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-emerald-400">✓ No route conflicts detected</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-950 border-red-700/50">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-red-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Route Conflicts ({conflicts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {conflicts.map((conflict, idx) => {
          const severityColors = {
            critical: 'bg-red-950/40 border-red-700 text-red-300',
            high: 'bg-orange-950/40 border-orange-700 text-orange-300',
            medium: 'bg-amber-950/40 border-amber-700 text-amber-300',
            low: 'bg-yellow-950/40 border-yellow-700 text-yellow-300',
          };

          return (
            <div key={idx} className={`rounded-lg border p-3 ${severityColors[conflict.severity]} text-xs space-y-1`}>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="font-semibold">{conflict.message}</p>
              </div>

              {conflict.type === 'duplicate_route' && (
                <div className="ml-6 space-y-1">
                  <p className="text-xs opacity-80">Conflicting pages:</p>
                  {conflict.routes.map((r, i) => (
                    <p key={i} className="text-xs opacity-70 font-mono">
                      {r.page_key}
                    </p>
                  ))}
                </div>
              )}

              {conflict.type === 'family_mismatch' && (
                <div className="ml-6 text-xs opacity-80">
                  Route: <span className="font-mono">{conflict.route}</span>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}